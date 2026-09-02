require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

const games = new Map();

function newGame() {
  return { board: Array(9).fill(''), turn: 'X', players: { X: null, O: null }, started: false, finished: false };
}
function result(board) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of wins) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return board.every(Boolean) ? 'DRAW' : null;
}
async function saveGame(game) {
  if (!supabase) return;
  const winner = result(game.board);
  const { error } = await supabase.from('games').insert({
    player_x: game.players.X,
    player_o: game.players.O,
    winner: winner === 'DRAW' ? null : winner,
    is_draw: winner === 'DRAW',
    moves: game.board
  });
  if (error) console.error('Supabase insert failed:', error.message);
}

app.get('/api/health', (_req,res) => res.json({ ok: true, service: 'real-time-tic-tac-toe' }));
app.get('/api/history', async (_req,res) => {
  if (!supabase) return res.status(503).json({ message: 'Supabase is not configured' });
  const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false }).limit(25);
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

io.on('connection', socket => {
  socket.on('joinGame', ({ roomId, playerName }) => {
    if (!roomId || !playerName) return socket.emit('errorMessage', 'Room ID and player name are required.');
    const id = String(roomId).trim().slice(0, 40);
    const name = String(playerName).trim().slice(0, 30);
    if (!games.has(id)) games.set(id, newGame());
    const game = games.get(id);
    let symbol = null;
    if (!game.players.X) symbol = 'X';
    else if (!game.players.O) symbol = 'O';
    else return socket.emit('errorMessage', 'This room already has two players.');
    game.players[symbol] = name;
    socket.join(id);
    socket.data.roomId = id;
    socket.data.symbol = symbol;
    game.started = Boolean(game.players.X && game.players.O);
    socket.emit('joined', { roomId: id, symbol, game });
    io.to(id).emit('gameState', game);
  });

  socket.on('makeMove', async ({ roomId, index }) => {
    const game = games.get(roomId);
    const symbol = socket.data.symbol;
    if (!game || !symbol || game.finished) return;
    if (!game.started) return socket.emit('errorMessage', 'Waiting for the second player.');
    if (game.turn !== symbol) return socket.emit('errorMessage', 'It is not your turn.');
    if (!Number.isInteger(index) || index < 0 || index > 8 || game.board[index]) return socket.emit('errorMessage', 'Invalid move.');
    game.board[index] = symbol;
    const winner = result(game.board);
    if (winner) {
      game.finished = true;
      io.to(roomId).emit('gameState', game);
      await saveGame(game);
      return;
    }
    game.turn = symbol === 'X' ? 'O' : 'X';
    io.to(roomId).emit('gameState', game);
  });

  socket.on('resetGame', () => {
    const roomId = socket.data.roomId;
    if (!roomId || !games.has(roomId)) return;
    const old = games.get(roomId);
    const fresh = newGame();
    fresh.players = old.players;
    fresh.started = Boolean(fresh.players.X && fresh.players.O);
    games.set(roomId, fresh);
    io.to(roomId).emit('gameState', fresh);
  });

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    const game = games.get(roomId);
    if (!game) return;
    io.to(roomId).emit('playerLeft');
    games.delete(roomId);
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

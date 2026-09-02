# 🎮 Real-Time Tic Tac Toe Game

A real-time multiplayer Tic Tac Toe web application built using **Node.js, Express.js, Socket.io, and Supabase PostgreSQL**.

The application allows two players to join the same game room and play Tic Tac Toe in real time. Game moves are synchronized between connected players using Socket.io, while completed games are stored in Supabase.

---

## 👨‍🎓 Student Details

| Field | Details |
|---|---|
| **Student Name** | Harsh Kumar |
| **Roll Number** | 150096725105 |
| **Assignment** | Assignment 5 — Real-Time Tic Tac Toe Game |
| **Course** | BTech CSE |

---

## 🌐 Live Application

### [🎮 Play Real-Time Tic Tac Toe](https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com)

The application is deployed as a Node.js Web Service on Render.

---

## 💻 GitHub Repository

### [📂 View Source Code on GitHub](https://github.com/harsh4421/Harsh-Assignment-5-real-time-Tic-Tac-Toe-game)

---

# 📌 Project Overview

This project implements a real-time multiplayer version of the classic Tic Tac Toe game.

Two players can connect to the same game room. The first player is assigned **X**, while the second player is assigned **O**.

Every move is sent to the backend server through Socket.io. The server validates the move, updates the game state, and broadcasts the updated state to all players in the room.

When the game is completed, the result is stored in a **Supabase PostgreSQL database**.

---

# ✨ Features

- 🎮 Real-time two-player multiplayer
- 🔗 Room-based game joining
- ❌ Automatic X player assignment
- ⭕ Automatic O player assignment
- ⚡ Real-time board synchronization using Socket.io
- 🔐 Server-side turn validation
- 🚫 Invalid move protection
- 🏆 Automatic win detection
- 🤝 Draw detection
- 🔄 Game reset / New Round functionality
- 👋 Player disconnect handling
- 💾 Completed game persistence in Supabase
- 📜 Game history API
- ❤️ Health check API
- 📱 Responsive user interface
- 🌐 Production deployment using Render

---

# 🛠️ Technology Stack

## Backend

- **Node.js**
- **Express.js**
- **Socket.io**
- **Supabase JavaScript Client**
- **PostgreSQL**
- **dotenv**

## Frontend

- **HTML5**
- **CSS3**
- **JavaScript**
- **Socket.io Client**

## Database

- **Supabase PostgreSQL**

## Deployment

- **Render**

---

# 📂 Project Structure

```text
Harsh_Kumar_150096725105/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env.example
├── .gitignore
├── Assignment 5.txt
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

# 🏗️ System Architecture

The application uses a client-server architecture with Socket.io for real-time communication.

```text
                    ┌─────────────────────┐
                    │    Player 1 Browser │
                    └──────────┬──────────┘
                               │
                               │ Socket.io
                               ▼
                    ┌─────────────────────┐
                    │   Node.js Server    │
                    │     Express.js      │
                    │                     │
                    │  Room Management    │
                    │  Turn Validation    │
                    │  Game Logic        │
                    │  Win/Draw Check    │
                    └──────────┬──────────┘
                               │
                               │ Socket.io
                               ▼
                    ┌─────────────────────┐
                    │    Player 2 Browser │
                    └─────────────────────┘
                               │
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Supabase PostgreSQL │
                    │                     │
                    │ Completed Games     │
                    │ Game History        │
                    └─────────────────────┘
```

---

# 🎯 Game Flow

1. A player opens the application.
2. The player creates or joins a game room.
3. The first player joining the room is assigned **X**.
4. The second player joining the room is assigned **O**.
5. Players take turns selecting cells.
6. Each move is sent to the Node.js server using Socket.io.
7. The server validates the move.
8. The server updates the game state.
9. The updated state is broadcast to all players.
10. The server checks for a winner or draw.
11. When the game finishes, the result is saved in Supabase.
12. Players can reset the board and start a new round.

---

# ⚡ Real-Time Communication

Socket.io is used to provide real-time communication between the players and server.

The basic communication flow is:

```text
Player 1
   │
   │ makeMove
   ▼
Socket.io Server
   │
   │ Validate Move
   ▼
Game State
   │
   │ gameState
   ▼
Player 1 + Player 2
```

This allows both players to see board updates immediately without refreshing the browser.

---

# 🔌 Socket.io Events

| Event | Description |
|---|---|
| `joinGame` | Allows a player to join a game room |
| `makeMove` | Sends a player's move to the server |
| `resetGame` | Resets the current game |
| `gameState` | Sends the current game state to connected players |
| `errorMessage` | Sends an error message for invalid actions |
| `playerLeft` | Notifies the remaining player when another player disconnects |

---

# 🔐 Server-Side Game Validation

The server is responsible for maintaining the authoritative game state.

Before accepting a move, the server checks:

- Whether the player belongs to the room
- Whether it is the player's turn
- Whether the selected cell is empty
- Whether the game has already ended
- Whether the move is valid

This prevents clients from directly manipulating the game state.

---

# 🏆 Game Rules

The application follows standard Tic Tac Toe rules.

A player wins when they get three of their symbols in:

### Horizontal

```text
X | X | X
---------
  |   |
---------
  |   |
```

### Vertical

```text
X |   |
---------
X |   |
---------
X |   |
```

### Diagonal

```text
X |   |
---------
  | X |
---------
  |   | X
```

If all nine cells are filled and no player has three symbols in a row, the game is declared a **draw**.

---

# 🗄️ Database

The application uses **Supabase PostgreSQL** to store completed games.

The database contains a table named:

```text
games
```

## Games Table

| Column | Type | Description |
|---|---|---|
| `id` | bigint | Primary key |
| `player_x` | text | Player assigned X |
| `player_o` | text | Player assigned O |
| `winner` | text | Winning symbol |
| `is_draw` | boolean | Indicates whether the game was a draw |
| `moves` | jsonb | Stored game state / moves |
| `created_at` | timestamptz | Game timestamp |

---

# 🧱 Database SQL

The `games` table can be created using the following SQL:

```sql
create table if not exists games (
  id bigint generated by default as identity primary key,
  player_x text,
  player_o text,
  winner text,
  is_draw boolean default false,
  moves jsonb,
  created_at timestamptz default now()
);
```

---

# 🔗 REST API

The application also provides REST API endpoints.

## 1. Health Check

```http
GET /api/health
```

This endpoint is used to verify that the backend service is running.

### Example

```text
https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com/api/health
```

---

## 2. Game History

```http
GET /api/history
```

This endpoint retrieves completed games stored in Supabase.

### Example

```text
https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com/api/history
```

---

# 🌐 Production URLs

## Application

```text
https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com
```

## Health API

```text
https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com/api/health
```

## Game History API

```text
https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com/api/history
```

---

# 🚀 Local Installation

Follow these steps to run the project locally.

## 1. Clone the Repository

```bash
git clone https://github.com/harsh4421/Harsh-Assignment-5-real-time-Tic-Tac-Toe-game.git
```

---

## 2. Enter the Project Directory

```bash
cd Harsh-Assignment-5-real-time-Tic-Tac-Toe-game/Harsh_Kumar_150096725105
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Environment Variables

Create a file named:

```text
.env
```

Add:

```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with your Supabase project credentials.

---

## 5. Start the Server

```bash
npm start
```

The application will run on:

```text
http://localhost:3000
```

---

# 🧪 Development Mode

The project also supports Nodemon for development.

Run:

```bash
npm run dev
```

Nodemon automatically restarts the server whenever changes are made to the backend source code.

---

# 🔑 Environment Variables

The following environment variables are required:

```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_publishable_key
```

### Environment Variable Description

| Variable | Description |
|---|---|
| `PORT` | Port used by the Node.js server |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase API key |

Environment variables are used instead of hard-coding credentials into the application.

---

# 🔒 Git Security

The project uses a `.gitignore` file to prevent sensitive and unnecessary files from being committed.

```gitignore
node_modules/
.env
.DS_Store
*.log
```

### Ignored Files

```text
.env
node_modules/
.DS_Store
*.log
```

The actual `.env` file is intentionally excluded from GitHub.

The repository contains `.env.example` with placeholder values so that other developers know which environment variables are required.

---

# 🧪 Testing

The following functionality was tested during development:

### Backend

- Server startup
- Health check API
- Game history API
- Supabase database connection

### Multiplayer

- Player 1 joining
- Player 2 joining
- X/O assignment
- Room joining
- Real-time communication
- Real-time board synchronization

### Game Logic

- Valid moves
- Invalid moves
- Turn validation
- Win detection
- Draw detection
- Game completion
- Game reset

### Connection Handling

- Player disconnect
- Remaining player notification
- New round functionality

### Database

- Completed game persistence
- Winner storage
- Draw storage
- Move/game state storage
- Game history retrieval

### Deployment

- Render deployment
- Production application loading
- Production API availability
- Production Socket.io communication

---

# ☁️ Deployment

The application is deployed using **Render** as a Node.js Web Service.

## Render Configuration

```text
Runtime:
Node

Branch:
main

Root Directory:
Harsh_Kumar_150096725105

Build Command:
npm install

Start Command:
npm start
```

---

# 🔐 Production Environment

The following environment variables are configured in Render:

```text
SUPABASE_URL
SUPABASE_KEY
```

The actual credentials are not stored in the GitHub repository.

---

# 📡 API + WebSocket Architecture

The project combines REST APIs and WebSocket communication.

## REST APIs

Used for:

```text
GET /api/health
GET /api/history
```

## Socket.io

Used for:

```text
joinGame
makeMove
resetGame
gameState
errorMessage
playerLeft
```

This combination allows the application to provide both traditional HTTP APIs and real-time multiplayer functionality.

---

# 📊 Application Workflow

```text
                User Opens Website
                       │
                       ▼
                 Create / Join Room
                       │
                       ▼
                Player X / Player O
                       │
                       ▼
                 Socket.io Connection
                       │
                       ▼
                  Make a Move
                       │
                       ▼
              Server Validates Move
                       │
                       ▼
                 Update Game State
                       │
                       ▼
             Broadcast to Both Players
                       │
                       ▼
              Check Win / Draw
                    /     \
                  Win     Draw
                   │        │
                   └────┬───┘
                        ▼
                Save Result in
              Supabase PostgreSQL
                        │
                        ▼
                   Game History
```

---

# 📁 Important Files

| File | Purpose |
|---|---|
| `server.js` | Main Express and Socket.io server |
| `public/index.html` | Main application interface |
| `public/style.css` | Application styling |
| `public/script.js` | Frontend game logic and Socket.io client |
| `package.json` | Project dependencies and scripts |
| `.env.example` | Environment variable template |
| `.gitignore` | Prevents unnecessary/private files from Git |
| `README.md` | Project documentation |

---

# 📦 NPM Scripts

### Start Production Server

```bash
npm start
```

### Start Development Server

```bash
npm run dev
```

---

# 🛡️ Error Handling

The server handles invalid game actions such as:

- Invalid room
- Invalid player
- Playing out of turn
- Selecting an occupied cell
- Making moves after the game has ended
- Invalid game reset requests

Errors are communicated back to the client through Socket.io.

---

# 🎯 Learning Outcomes

Through this project, the following concepts were implemented:

- Node.js backend development
- Express.js REST API development
- WebSocket communication
- Socket.io real-time applications
- Multiplayer room management
- Server-side game validation
- Game state management
- PostgreSQL database usage
- Supabase integration
- Environment variable management
- Git and GitHub
- Production deployment using Render

---

# 🚀 Future Improvements

Possible future improvements include:

- User authentication
- Player profiles
- Persistent player statistics
- Leaderboards
- Matchmaking
- Spectator mode
- Game replay
- Online player status
- Chat functionality
- Tournament mode
- Improved game history interface

---

# 📝 Conclusion

The Real-Time Tic Tac Toe Game demonstrates how a multiplayer web application can be built using **Node.js, Express.js, Socket.io, and Supabase PostgreSQL**.

Socket.io provides real-time communication between players, while the Node.js server maintains the authoritative game state and validates player actions.

Supabase PostgreSQL provides persistent storage for completed games and game history.

The application is deployed on Render and can be accessed through the live production URL below.

### 🎮 Live Application

**https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com**

---

# 👨‍💻 Author

**Harsh Kumar**

**Roll Number:** 150096725105

**BTech CSE**

**Assignment 5 — Real-Time Tic Tac Toe Game**

---

## 🔗 Links

- **Live Application:** https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com
- **GitHub Repository:** https://github.com/harsh4421/Harsh-Assignment-5-real-time-Tic-Tac-Toe-game
- **Health API:** https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com/api/health
- **Game History API:** https://harsh-assignment-5-real-time-tic-tac-toe.onrender.com/api/history
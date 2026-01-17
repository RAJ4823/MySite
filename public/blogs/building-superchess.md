# Building SuperChess: A Production-Ready Real-Time Multiplayer Chess Platform

---

## Super Summary

**TL;DR:** I built a full-stack, real-time chess platform—not because I wanted to play chess, but because I wanted to build something complex, production-ready, and genuinely enjoyable. This post covers the architecture, the five biggest technical hurdles I faced, and how I solved each one.

🔗 **Live App:** https://superchess.iamraj.dev

---

## Table of Contents

---

## Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-FF6B6B)
![Stockfish](https://img.shields.io/badge/Stockfish-17.1-8B4513)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/MUI-7.3-007FFF?logo=mui&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![OAuth2](https://img.shields.io/badge/Google-OAuth2-4285F4?logo=google&logoColor=white)

---

## The Story

I didn't build SuperChess because I wanted to play chess online. I built it because I wanted a **real challenge**.

I was tired of tutorial projects—todo apps, weather dashboards, portfolio sites. I wanted to build something that was:
- **Complex enough** to push my skills (real-time sync, authentication, game logic)
- **Production-ready** (not a demo, but something I could actually deploy and share)
- **Genuinely enjoyable** (something people would want to come back to)

Chess checked all the boxes. Real-time multiplayer, server-validated game state, AI opponents, time controls, user accounts—this wasn't a weekend project. It was a proper engineering challenge.

SuperChess is the result: a full-stack monorepo running entirely on free-tier infrastructure, with features I'm actually proud of.

---
## Key Features

#### 🎮 Game Modes
- **Online Matchmaking** — Automatic pairing with players worldwide
- **Friend Games** — Private rooms with 6-digit invite codes
- **AI Opponents** — Stockfish engine at 3 levels (SuperPawn, SuperKnight, SuperGrandmaster)

#### ⏱️ Time Controls
- Bullet (1 min), Blitz (3 min), Rapid (10 min), Classical (30 min)

#### 🔐 Authentication
- Email/Password with BCrypt hashing
- Google OAuth 2.0 with automatic profile picture sync
- JWT-based session management

#### 📊 Gameplay
- Real-time WebSocket synchronization
- Server-side move validation (anti-cheat)
- Live position evaluation bar (Stockfish WASM)
- Captured pieces display with material difference
- Full move history with algebraic notation

#### 🎨 UX Polish
- Dark/Light theme with system preference detection
- Responsive design (mobile, tablet, desktop)
- Sound effects for moves, captures, check, game end
- Built-in **Report Bug** and **Request Feature** pages

---

## Architecture Overview

SuperChess follows a clean **client-server architecture** where the server is the single source of truth for all game state.

### High-Level System Design

![SuperChess Architecture](/images/diagrams/diagram-superchess.svg)

### Separation of Concerns

**Frontend Responsibilities:**
- Render UI based on server state
- Optimistic updates (show move immediately, wait for confirmation)
- Client-side position evaluation (Stockfish WASM for eval bar)
- Audio/visual feedback
- Theme management

**Backend Responsibilities:**
- **All game logic validation** (server is source of truth)
- Timer management & timeout detection
- Move legality verification via chesslib
- AI move generation via Stockfish subprocess
- User authentication & authorization
- Persistent state in PostgreSQL

**Why this matters:** The client never makes game decisions. It only suggests moves. The server validates, applies, and broadcasts results. This prevents cheating and ensures consistency.

---

## WebSocket Event Design

SuperChess uses **STOMP over WebSocket** for real-time communication. The server broadcasts events, and clients subscribe to game-specific topics.


### Event Types

| Message Type | Direction | Purpose |
|-----------|-----------|---------|
| `MOVE_REQUEST` | Client → Server | Player sends move request (`{from, to, promotion}`) |
| `MOVE_RESPONSE` | Server → Clients | Move result/response broadcast (`{success, newFen, gameStatus, isCheck, isCheckmate}`) |
| `TIMER_SYNC` | Server → Clients | Sync clocks after each move (`{whiteTimeMs, blackTimeMs, activePlayer, serverTimestamp}`) |
| `GAME_END` | Server → Clients | Announce game over (`{status, winner, whiteTimeMs, blackTimeMs}`) |
| `GAME_STATE_UPDATE` | Server → Clients | Game state changed (player joined, etc.) |

### How Server Broadcasts Work

1. **Client subscribes** to `/topic/game/{gameId}` after joining a game
2. **Client sends move** via `/app/game/move/{gameId}` with `MOVE_REQUEST {from: "e2", to: "e4", promotion: null}`
3. **Server validates** the move, updates DB, and broadcasts `MOVE_RESPONSE` to all subscribers
4. **Timer sync** happens automatically after each move via `TIMER_SYNC` message

### Event Ordering & Consistency

- **Server is sequential:** Moves are processed one at a time per game (no race conditions)
- **Session isolation:** Each WebSocket connection is tied to a JWT-authenticated user
- **Optimistic UI, server reconciliation:** Client shows move immediately but reverts if server rejects it

---

## Data Model

PostgreSQL stores all persistent state. Here's the core schema:

#### Main Entities

**`users`**
```sql
- id (PK)
- username (unique)
- email (unique)
- password_hash (BCrypt)
- picture_url (for OAuth users)
- created_at
```

**`games`**
```sql
- id (PK)
- white_player_id (FK → users)
- black_player_id (FK → users, nullable for waiting games)
- current_fen (FEN string representing board state)
- status (WAITING | IN_PROGRESS | CHECKMATE | STALEMATE | DRAW | TIMEOUT)
- current_turn ("WHITE" | "BLACK")
- winner ("WHITE" | "BLACK" | null)
- time_control (e.g., "10+0")
- white_time_remaining_ms
- black_time_remaining_ms
- last_move_time (timestamp)
- game_type (ONLINE | FRIEND | AI_BOT)
- bot_difficulty (BEGINNER | INTERMEDIATE | EXPERT, if AI_BOT)
- invite_code (6-digit code for friend games)
- created_at, updated_at
```

**`moves`**
```sql
- id (PK)
- game_id (FK → games)
- move_number (1, 2, 3...)
- from_square (e.g., "e2")
- to_square (e.g., "e4")
- piece (e.g., "PAWN")
- promotion (e.g., "QUEEN", nullable)
- fen_after_move (FEN snapshot after move)
- is_check, is_checkmate (boolean)
- timestamp
```

#### Why FEN + Move History?

**FEN (Forsyth-Edwards Notation):** Compact representation of board state. Stored in `games.current_fen` and `moves.fen_after_move`.

**Move storage:** Each move is stored with `from_square` and `to_square` (UCI format). This allows:
- Full game replay
- PGN export in the future
- Debugging invalid positions

**Why not just FEN?** Storing individual moves enables game history display, analysis, and statistics (e.g., "most common opening").

---

## Security & Production Readiness

Security isn't an afterthought. Here's what I implemented:

#### Authentication
- **JWT tokens** with 7-day expiration, signed with `HS256`
- **BCrypt password hashing** (cost factor 10)
- **Google OAuth 2.0** for passwordless login
- **Refresh tokens** (planned but not yet implemented)

#### Authorization
- **Game access control:** Users can only view/modify games they're part of
- **WebSocket auth:** JWT token validated during STOMP `CONNECT` handshake
- **Session mapping:** Each WebSocket session maps to a user ID

#### Input Validation
- **Move validation:** All moves verified via `chesslib` library (can't bypass UI)
- **DTO validation:** Spring `@Valid` annotations on request bodies
- **SQL injection prevention:** JPA parameterized queries

#### Anti-Cheat Measures
- **Server-side move validation:** Client can't inject illegal moves
- **Timeout detection server-side:** Client can't fake clock state
- **FEN integrity:** Server recomputes FEN after each move (client suggestions ignored)

#### CORS & Cookies
- **Allowed origins:** Only `https://superchess.iamraj.dev` in production
- **HTTPS enforced** in production (Cloudflare Pages + Render)

#### Rate Limiting
Currently minimal (Spring Boot default). Future: Add per-user rate limits for API endpoints.

---

## The Challenges (And How I Solved Them)

### 1. Timer Synchronization

**The Problem:** Distributed timers are hard. Client-side `setInterval` drifts. Network latency creates ambiguity. Page refreshes desync clocks.

**Core Idea:**
- **Server is the authority** on time remaining
- **Polling would cause drift** (database queries every second)
- **Latency matters:** 50-200ms round trips add up
- **Refreshes must recover** accurate state

**The Solution:** Event-driven, server-authoritative timers.

Instead of polling the database every second, I use a `TimerSchedulerService` with a `ScheduledExecutorService`:

1. **Schedule timeout when turn starts**: `scheduleTimeout(gameId, "WHITE", 600000ms)`
2. **Cancel timeout when move happens**: `cancelTimeout(gameId)`
3. **Broadcast timer sync** after each move: `TIMER_SYNC` message with server timestamp

```java
public void scheduleTimeout(Long gameId, String player, long timeRemainingMs) {
    cancelTimeout(gameId); // Cancel any existing
    ScheduledFuture<?> task = scheduler.schedule(
        () -> handleTimeout(gameId, player),
        timeRemainingMs,
        TimeUnit.MILLISECONDS
    );
    timeoutTasks.put(gameId, task);
}
```

After each move, the server broadcasts:
```json
{
  "type": "TIMER_SYNC",
  "whiteTimeMs": 587231,
  "blackTimeMs": 600000,
  "activePlayer": "BLACK",
  "serverTimestamp": 1705230192841
}
```

Clients use this to correct local display.

**Result:** No polling, no drift, precise timeout detection.

---

### 2. SEO in a Single Page Application

**The Problem:** Google wasn't indexing my app. Every route returned the same `index.html` with identical meta tags.

**The Solution:** Custom `useSEO` React hook.

```javascript
const useSEO = ({ title, description, canonical, noindex = false }) => {
    useEffect(() => {
        document.title = fullTitle;
        
        if (fullCanonical) {
            document.querySelector('link[rel="canonical"]').href = fullCanonical;
        }
        
        if (noindex) {
            document.querySelector('meta[name="robots"]').content = 'noindex, nofollow';
        }
        
        // Update og:title, og:url, og:description...
    }, [title, description, canonical]);
};
```

Each page calls `useSEO()` with specific metadata. Pages like `/game/:id` get `noindex: true`.

**Result:** Proper indexing, unique meta descriptions per route.

---

### 3. State Management Across Disconnects

**The Problem:** WebSockets drop. Users refresh. Networks flake. Games must survive.

**The Solution:** Resilient reconnection strategy.

1. **Server persists all state** in PostgreSQL (never trust client)
2. **On reconnect**, client fetches full game state via REST before re-subscribing to WebSocket
3. **Timers recalculated** server-side based on `lastMoveTimestamp`
4. **Optimistic UI** with server reconciliation

**Result:** Refresh, disconnect, switch devices—game continues seamlessly.

---

### 4. AI Bot Performance

**The Problem:** Custom Minimax with Alpha-Beta pruning was too slow at depth 5+ (5-10s per move).

**The Solution:** Stockfish integration.

**Backend:** Stockfish runs as a subprocess managed by `StockfishService`. Communicates via UCI protocol.

```java
public String getBestMove(String fen, int depth) {
    sendCommand("position fen " + fen);
    sendCommand("go depth " + depth);
    // Parse "bestmove e2e4" from output
}
```

**Difficulty levels:**
- **SuperPawn (Beginner):** Depth 5, Skill 1
- **SuperKnight (Intermediate):** Depth 10, Skill 10
- **SuperGrandmaster (Expert):** Depth 15, Skill 20

**Frontend:** Stockfish.js (WASM) runs in a Web Worker for the live evaluation bar.

**Result:** AI moves quickly and consistently, proper engine strength, real-time eval.

---

### 5. Google Sign-In Complexity

**The Problem:** OAuth requires Privacy Policy, Terms of Service, and a public landing page. Google rejected my consent screen because the app had no public info.

**The Solution:** Restructured the app.

- Created **public landing page** at `/` with features, FAQ, CTA
- Moved dashboard to `/home`
- Built **Privacy Policy** and **Terms** pages
- Added **JSON-LD structured data** for rich search results

**Result:** OAuth approved, app looks professional.

---

## Deployment (The $0/month Setup)

| Layer | Provider | Tier |
|-------|----------|------|
| Frontend | Cloudflare Pages | Free |
| Backend | Render | Free |
| Database | Neon DB | Free |
| CI/CD | GitHub Actions | Free |

---

## What's Next?

Honestly? **Not much next—unless people start playing consistently.**

I've scoped out features like ELO ratings, game replay/analysis, spectator mode, and puzzles. But building those takes significant time.

My rule: If daily active users hit **100 and stay consistent for a month**, I'll invest in the next phase. Until then, SuperChess is feature-complete and ready for players.

---

## Wrapping Up

Building SuperChess taught me that the "simple" features are often the hardest. Timers, authentication flows, state synchronization, and SEO in SPAs all required careful thought and multiple iterations.

#### For Chess Players 🎮
**Come play a game!** Visit [superchess.iamraj.dev](https://superchess.iamraj.dev) and let me know what you think. Feedback is gold.

---

*Built with 💜 by [Raj Patel](https://iamraj.dev)*

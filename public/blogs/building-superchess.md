# SuperChess: Building a Production-Grade, Real-Time Multiplayer Chess Platform from Scratch

---

## The "Super" Summary

**TL;DR:** I built a full-stack, real-time chess platform—not because I wanted to play chess, but because I wanted to build something complex, production-ready, and genuinely enjoyable. This post covers the architecture, the five biggest technical hurdles I faced, and how I solved each one.

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

## The Challenges (And How I Solved Them)

### 1. Timer Synchronization

**The Problem:** In a distributed system, keeping two players' clocks synchronized is deceptively hard. Client-side `setInterval` drifts. Network latency creates ambiguity about who "owns" time during a move. Page refreshes can desync everything.

**The Solution:** I implemented **event-driven, server-authoritative timers**.

Instead of polling the database every second, the backend uses a `TimerSchedulerService` that:
1. **Schedules a one-time timeout task** when a player's turn starts
2. **Cancels the task** when the player makes a move
3. **Triggers timeout handling** only when time actually runs out

```java
// Schedule timeout when turn starts
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

After each move, the server broadcasts a `TIMER_SYNC` message with updated times and a server timestamp. Clients use this to correct their local display.

**Result:** No database polling, no drift, and the server is the single source of truth for timeout detection.

---

### 2. SEO in a Single Page Application

**The Problem:** Google wasn't indexing my app at all. Every route returned the same `index.html`, with the same meta tags and title. Google saw no difference between `/home`, `/login`, and `/changelog`.

**The Solution:** I built a custom `useSEO` React hook that dynamically updates the document head on every route change.

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

Each page calls `useSEO()` with its specific metadata. Pages that shouldn't be indexed (like `/game/:id` or `/error`) get `noindex: true`.

**Result:** Proper canonical URLs, unique meta descriptions, and Google now indexes all relevant pages correctly.

---

### 3. State Management Across Disconnects

**The Problem:** WebSocket connections drop. Users refresh. Networks flake. If I didn't handle this gracefully, live games would break mid-match.

**The Solution:** I designed a **resilient reconnection strategy**:

1. **Server persists all game state** in PostgreSQL—never trust the client as source of truth
2. **On reconnect**, the client fetches the full game state via REST API before re-subscribing to WebSocket
3. **Timers are recalculated** server-side based on `lastMoveTimestamp`, so clocks are accurate even after a 30-second disconnect
4. **Optimistic UI** with server reconciliation—the client shows moves immediately but waits for server confirmation

**Result:** Players can refresh, lose connection, or switch devices, and the game continues seamlessly.

---

### 4. AI Bot Performance

**The Problem:** I initially implemented a custom **Minimax algorithm with Alpha-Beta pruning**. It worked fine at depth 3-4, but at depth 5+, it became unusably slow (5-10 seconds per move).

**The Solution:** I pivoted to **Stockfish**.

On the backend, I integrated Stockfish as a subprocess. The `StockfishService` manages the engine lifecycle, sends positions via UCI protocol, and retrieves best moves at configurable depth levels:

- **SuperPawn (Beginner):** Depth 1
- **SuperKnight (Intermediate):** Depth 5
- **SuperGrandmaster (Expert):** Depth 15

```java
public String getBestMove(String fen, int depth) {
    sendCommand("position fen " + fen);
    sendCommand("go depth " + depth);
    // Parse "bestmove e2e4" from engine output
}
```

On the frontend, I also integrated **Stockfish.js (WASM)** for the live position evaluation bar—giving players real-time feedback on who's winning.

**Result:** AI moves in <500ms at any depth, with proper chess engine quality.

---

### 5. Google Sign-In Complexity

**The Problem:** I thought Google OAuth would be a quick integration. I didn't realize it came with compliance requirements: **Privacy Policy**, **Terms of Service**, and a proper **Landing Page**.

Google rejected my OAuth consent screen because the app was "just a dashboard"—no public-facing info for unauthenticated users.

**The Solution:** I restructured the entire app:

- Created a **public landing page** at `/` with feature showcase, FAQ, and call-to-action
- Moved the authenticated dashboard to `/home`
- Built dedicated **Privacy Policy** and **Terms of Service** pages
- Added proper **JSON-LD structured data** for rich search results

What started as a 1-hour task turned into a 2-week effort that transformed SuperChess from a simple tool into a proper platform.

**Result:** OAuth works, the app looks professional, and Google is happy.

---

## Key Features

### 🎮 Game Modes
- **Online Matchmaking** — Automatic pairing with players worldwide
- **Friend Games** — Private rooms with 6-digit invite codes
- **AI Opponents** — Stockfish engine at 3 levels (SuperPawn, SuperKnight, SuperGrandmaster)

### ⏱️ Time Controls
- Bullet (1 min), Blitz (3 min), Rapid (10 min), Classical (30 min)

### 🔐 Authentication
- Email/Password with BCrypt hashing
- Google OAuth 2.0 with automatic profile picture sync
- JWT-based session management

### 📊 Gameplay
- Real-time WebSocket synchronization
- Server-side move validation (anti-cheat)
- Live position evaluation bar (Stockfish WASM)
- Captured pieces display with material difference
- Full move history with algebraic notation

### 🎨 UX Polish
- Dark/Light theme with system preference detection
- Responsive design (mobile, tablet, desktop)
- Sound effects for moves, captures, check, game end
- Built-in **Report Bug** and **Request Feature** pages

---

## Deployment (The $0/month Setup)

| Layer | Provider | Tier |
|-------|----------|------|
| Frontend | Cloudflare Pages | Free |
| Backend | Render | Free |
| Database | Neon DB (PostgreSQL) | Free |
| CI/CD | GitHub Actions | Free |

---

## What's Next?

Honestly? **Nothing, unless users show up.**

I've scoped out features like ELO ratings, game replay/analysis, spectator mode, and puzzles. But building those takes significant time.

My rule: If daily active users hit **100 and stay consistent for a month**, I'll invest in the next phase. Until then, SuperChess is feature-complete and ready for players.

---

## Wrapping Up

Building SuperChess taught me that the "simple" features are often the hardest. Timers, authentication flows, state synchronization, and SEO in SPAs all required careful thought and multiple iterations.

If you're a chess player—**come play a game**. I'll see you on the board. ♔

---

*Built with 💜 by [Raj Patel](https://iamraj.dev)*

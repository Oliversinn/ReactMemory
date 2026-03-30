# Yu-Gi-Oh! Memory

A modern memory card game built with **React 19** and **Vite**, featuring real Yu-Gi-Oh! cards fetched from the [YGOPRODeck API](https://ygoprodeck.com/api-guide/).

## Features

- 🃏 **Live card data** — Each game fetches a fresh set of random Yu-Gi-Oh! cards from the API
- 🎮 **Difficulty levels** — Easy (6 pairs), Medium (8 pairs), Hard (12 pairs)
- 🔄 **3D card flip animation** — Smooth CSS perspective transforms
- ✨ **Match/miss effects** — Green glow on match, red shake on miss
- 🏆 **Win celebration** — Animated confetti and star rating
- 🔊 **Sound effects** — Procedurally generated via the Web Audio API (no external files)
- ⏱️ **Timer & turn counter** — Track your performance
- 📶 **Offline fallback** — Uses local card images when the API is unavailable

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| Vite | 8 |
| CSS Modules | — |
| YGOPRODeck API | v7 |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Legacy

The original HTML/CDN-based version of the game is preserved in the [`memoria/`](./memoria/) folder.

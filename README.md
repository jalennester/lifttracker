# 🔒 Lock In – Lift Tracker

A personal weightlifting tracker built around your exact 6-day routine.

## Features
- **6-day workout plan** pre-loaded with all your exercises
- **Log sets & reps** with weight for every exercise
- **Auto PR detection** — highlights when you beat your best weight
- **Rest timer** with 1m / 1:30 / 2m / 3m presets + audio alert
- **Progress charts** — weight, reps, or volume over time per exercise
- **Full session history** — expandable log of every workout
- **Notes** per exercise for form cues, drop sets, etc.
- **Offline-ready** — all data stored locally in your browser

## Setup

### Prerequisites
- Node.js 18+ installed ([nodejs.org](https://nodejs.org))

### Run locally

```bash
cd lifttracker
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

This creates a `build/` folder you can deploy to Netlify, Vercel, or any static host for free.

## Deploying (free, 2 mins)

### Netlify (easiest)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com) → drag & drop the `build/` folder
3. Done — live URL instantly

### Vercel
1. Install: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts — it auto-detects React

## Project Structure

```
src/
  data/
    workouts.js         ← Your 6-day routine lives here
  hooks/
    useWorkoutTracker.js ← State management & localStorage
  components/
    Dashboard.js        ← Home screen with stats & day selection
    WorkoutSession.js   ← Active workout logging view
    ExerciseCard.js     ← Individual exercise with sets/reps inputs
    RestTimer.js        ← Countdown timer with audio alert
    ProgressCharts.js   ← Area charts per exercise
    HistoryView.js      ← Past session log
  App.js               ← Root component & navigation
  App.css              ← All styles
```

## Customizing Your Routine

Edit `src/data/workouts.js` to add/remove exercises or change set counts:

```js
{ id: "my-exercise", name: "My Exercise", muscle: "Chest", defaultSets: 3 }
```

## Using Claude Code in VS Code

Install the **Claude Code** extension in VS Code for AI-assisted development:
1. Open VS Code → Extensions (Ctrl+Shift+X)
2. Search "Claude Code"
3. Use it to ask Claude to add features, fix bugs, or tweak the design

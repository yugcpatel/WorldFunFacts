# World Fun Facts (MERN + React Three Fiber)

An interactive 3D Earth you can spin and click to see country info and community-curated fun facts.

## Tech
- **Frontend**: React + Vite, React Three Fiber (Three.js), @react-three/drei (OrbitControls, Stars), Framer Motion
- **Backend**: Node + Express, MongoDB Atlas via Mongoose
- **External API**: REST Countries `https://restcountries.com/v3.1/alpha/{code}`
- **Features**:
  - 3D globe with orbit/zoom, stars background
  - Click on country markers to view details
  - Slide-in panel with country info and fun facts
  - Add facts, upvote facts, delete facts
  - Dark theme friendly UI
  - Input sanitization and error handling

## Folder Structure
```
/client  -> React frontend
/server  -> Express backend
```

## Quick Start

### 1) Backend
```bash
cd server
npm i
cp .env.example .env
# Edit .env with your MongoDB connection string (MONGODB_URI)
npm run dev
```
Server starts at `http://localhost:4000` by default.

### 2) Frontend
In a second terminal:
```bash
cd client
npm i
npm run dev
```
Frontend starts at the Vite dev URL (usually `http://localhost:5173`).  
Make sure the backend is running so the API calls work.

## Environment Variables
`server/.env`:
```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
```

## Deploy (Optional)
- **Frontend**: Netlify (build: `npm run build`, publish: `dist`)
- **Backend**: Render or Railway (use `npm start`), set `MONGODB_URI` and `CORS_ORIGIN` env vars.

## Bonus Ideas
- Auto-rotate globe until user drags (included)
- Smooth zoom toward selected country (included basic camera tween)
- Leaderboard page (top 10 countries with most facts) (route stub included)
- AI fact generator hook (stub included)

Have fun! ✨🌍

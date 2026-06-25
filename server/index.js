const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD ist nicht gesetzt. Bitte als Umgebungsvariable definieren, bevor der Server gestartet wird.');
  process.exit(1);
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { matches: [], tips: [] };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let data = loadData();

const app = express();
app.use(cors());
app.use(express.json());

function requireAdmin(req, res, next) {
  if (req.headers['x-admin-password'] !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }
  next();
}

function tendency(home, away) {
  if (home > away) return 'home';
  if (home < away) return 'away';
  return 'draw';
}

function scoreTip(tip, match) {
  if (!match.result) return 0;
  const { germany: rg, opponent: ro } = match.result;
  if (tip.germany === rg && tip.opponent === ro) return 5;
  if (tendency(tip.germany, tip.opponent) === tendency(rg, ro)) return 2;
  return 0;
}

// --- Matches ---
app.get('/api/matches', (req, res) => {
  res.json(data.matches);
});

app.post('/api/matches', requireAdmin, (req, res) => {
  const { opponent, stage, date } = req.body;
  if (!opponent || !date) {
    return res.status(400).json({ error: 'opponent und date sind erforderlich' });
  }
  const match = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    opponent,
    stage: stage || 'Gruppenphase',
    date,
    result: null,
  };
  data.matches.push(match);
  saveData(data);
  res.status(201).json(match);
});

app.put('/api/matches/:id/result', requireAdmin, (req, res) => {
  const { germany, opponent } = req.body;
  const match = data.matches.find((m) => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: 'Spiel nicht gefunden' });
  if (typeof germany !== 'number' || typeof opponent !== 'number') {
    return res.status(400).json({ error: 'Ungültiges Ergebnis' });
  }
  match.result = { germany, opponent };
  saveData(data);
  res.json(match);
});

app.delete('/api/matches/:id', requireAdmin, (req, res) => {
  data.matches = data.matches.filter((m) => m.id !== req.params.id);
  data.tips = data.tips.filter((t) => t.matchId !== req.params.id);
  saveData(data);
  res.status(204).end();
});

// --- Tips ---
app.get('/api/tips', (req, res) => {
  const { player, matchId } = req.query;
  let result = data.tips;
  if (player) result = result.filter((t) => t.player === player);
  if (matchId) result = result.filter((t) => t.matchId === matchId);
  res.json(result);
});

app.post('/api/tips', (req, res) => {
  const { player, matchId, germany, opponent } = req.body;
  if (!player || !matchId || typeof germany !== 'number' || typeof opponent !== 'number') {
    return res.status(400).json({ error: 'player, matchId, germany und opponent sind erforderlich' });
  }
  const match = data.matches.find((m) => m.id === matchId);
  if (!match) return res.status(404).json({ error: 'Spiel nicht gefunden' });
  if (match.result) {
    return res.status(403).json({ error: 'Tipp kann nicht mehr geändert werden, das Spiel ist bereits ausgewertet' });
  }

  const existing = data.tips.find((t) => t.player === player && t.matchId === matchId);
  if (existing) {
    existing.germany = germany;
    existing.opponent = opponent;
  } else {
    data.tips.push({ player, matchId, germany, opponent });
  }
  saveData(data);
  res.status(201).json({ player, matchId, germany, opponent });
});

// --- Leaderboard ---
app.get('/api/leaderboard', (req, res) => {
  const players = Array.from(new Set(data.tips.map((t) => t.player)));
  const leaderboard = players.map((player) => {
    const tips = data.tips.filter((t) => t.player === player);
    let points = 0;
    for (const tip of tips) {
      const match = data.matches.find((m) => m.id === tip.matchId);
      if (match) points += scoreTip(tip, match);
    }
    return { player, points };
  });
  leaderboard.sort((a, b) => b.points - a.points);
  res.json(leaderboard);
});

app.listen(PORT, () => {
  console.log(`Tippspiel-Server läuft auf Port ${PORT}`);
});

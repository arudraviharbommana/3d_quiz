const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const scoresFile = path.join(__dirname, 'data', 'scores.json');

// Ensure scores file exists
if (!fs.existsSync(scoresFile)) {
  fs.writeFileSync(scoresFile, JSON.stringify([]));
}

// POST: Save player score
app.post('/submit', (req, res) => {
  const { name, email, score, total, date } = req.body;
  if (!name || !email || score === undefined || total === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newEntry = { name, email, score, total, date: date || new Date().toISOString() };
  const existing = JSON.parse(fs.readFileSync(scoresFile));
  existing.push(newEntry);
  fs.writeFileSync(scoresFile, JSON.stringify(existing, null, 2));
  res.json({ success: true });
});

// GET: All scores
app.get('/scores', (req, res) => {
  const data = JSON.parse(fs.readFileSync(scoresFile));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const scoresFile = path.join(__dirname, 'data', 'scores.json');

// Test route
app.get('/', (req, res) => {
  res.send('🎉 Quiz backend is running!');
});

// Ensure scores.json file exists
if (!fs.existsSync(scoresFile)) {
  fs.mkdirSync(path.dirname(scoresFile), { recursive: true });
  fs.writeFileSync(scoresFile, JSON.stringify([]));
}

// POST: Save player score
app.post('/submit', (req, res) => {
  const { name, score, total, date } = req.body;
  if (!name || score === undefined || total === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newEntry = {
    name,
    score,
    total,
    date: date || new Date().toISOString()
  };

  const existing = JSON.parse(fs.readFileSync(scoresFile));
  existing.push(newEntry);
  fs.writeFileSync(scoresFile, JSON.stringify(existing, null, 2));

  res.json({ success: true });
});

// GET: Fetch all scores
app.get('/scores', (req, res) => {
  const data = JSON.parse(fs.readFileSync(scoresFile));
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

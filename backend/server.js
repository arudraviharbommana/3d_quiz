const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const scoresFile = path.join(__dirname, 'data', 'scores.json');

// Root route
app.get('/', (req, res) => {
  res.send('🎉 Quiz backend is running!');
});

// Ensure scores file exists
if (!fs.existsSync(scoresFile)) {
  fs.writeFileSync(scoresFile, JSON.stringify([]));
}

// POST: Save player score
app.post('/submit', (req, res) => {
  const { name, score, total = 10, date } = req.body;

  if (!name || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name or score' });
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

// GET: Return all scores
app.get('/scores', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(scoresFile));
    res.json(data);
  } catch (err) {
    console.error("❌ Error reading scores:", err);
    res.status(500).json({ error: 'Failed to read scores' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

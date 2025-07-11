const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Path to scores file
const scoresFile = path.join(dataDir, 'scores.json');

// Ensure scores file exists
if (!fs.existsSync(scoresFile)) {
  fs.writeFileSync(scoresFile, JSON.stringify([]));
}

// Test root route
app.get('/', (req, res) => {
  res.send('🎉 Quiz backend is running!');
});

// POST: Save player score
app.post('/submit', (req, res) => {
  const { name, score, total, date } = req.body;

  // Validate
  if (!name || score === undefined || total === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newEntry = {
    name,
    score,
    total,
    date: date || new Date().toISOString()
  };

  try {
    const existing = JSON.parse(fs.readFileSync(scoresFile));
    existing.push(newEntry);
    fs.writeFileSync(scoresFile, JSON.stringify(existing, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing score:', err);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// GET: All scores
app.get('/scores', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(scoresFile));
    res.json(data);
  } catch (err) {
    console.error('Error reading scores:', err);
    res.status(500).json({ error: 'Failed to load scores' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

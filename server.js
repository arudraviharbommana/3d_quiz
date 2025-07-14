const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./quiz_scores.db', (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Create scores table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      date TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating table:', err.message);
    } else {
      console.log('✅ Scores table ready');
      // Clean up any existing duplicates
      cleanupDuplicates();
    }
  });
});

// Clean up duplicate records (keep only the latest for each email)
function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate records...');
  
  const query = `
    DELETE FROM scores 
    WHERE id NOT IN (
      SELECT MAX(id) 
      FROM scores 
      GROUP BY LOWER(email)
    )
  `;
  
  db.run(query, [], function(err) {
    if (err) {
      console.error('❌ Error cleaning duplicates:', err.message);
    } else {
      if (this.changes > 0) {
        console.log(`🧹 Removed ${this.changes} duplicate record(s)`);
      } else {
        console.log('✅ No duplicates found');
      }
    }
  });
}

// API Routes

// Get all scores (for scoreboard)
app.get('/api/scores', (req, res) => {
  const query = `
    SELECT name, email, score, total, percentage, date
    FROM scores 
    ORDER BY score DESC, timestamp DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching scores:', err.message);
      res.status(500).json({ error: 'Failed to fetch scores' });
    } else {
      console.log(`📊 Fetched ${rows.length} scores`);
      res.json({ success: true, scores: rows });
    }
  });
});

// Submit new score (replaces existing score for same email)
app.post('/api/scores', (req, res) => {
  const { name, email, score, total, percentage, date } = req.body;
  
  // Validation
  if (!name || !email || score === undefined || !total) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, email, score, total' 
    });
  }
  
  // Normalize email to lowercase to prevent case-sensitive duplicates
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedName = name.trim();
  const timestamp = Date.now();
  
  console.log(`📧 Processing score for: ${normalizedName} (${normalizedEmail})`);
  
  // Delete existing score for this email first, then insert new one
  const deleteQuery = 'DELETE FROM scores WHERE LOWER(email) = ?';
  
  db.run(deleteQuery, [normalizedEmail], function(err) {
    if (err) {
      console.error('❌ Error deleting existing score:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const wasUpdate = this.changes > 0;
    console.log(`🔍 Found ${this.changes} existing record(s) for ${normalizedEmail}`);
    
    // Insert the new score
    const insertQuery = `
      INSERT INTO scores (name, email, score, total, percentage, date, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(insertQuery, [normalizedName, normalizedEmail, score, total, percentage, date, timestamp], function(err) {
      if (err) {
        console.error('❌ Error saving score:', err.message);
        res.status(500).json({ error: 'Failed to save score' });
      } else {
        const action = wasUpdate ? 'updated' : 'created';
        const symbol = wasUpdate ? '🔄' : '✅';
        console.log(`${symbol} Score ${action}: ${normalizedName} - ${score}/${total} (${percentage}%)`);
        res.json({ 
          success: true, 
          message: `Score ${action} successfully`,
          action: action,
          id: this.lastID 
        });
      }
    });
  });
});

// Get user's personal scores
app.get('/api/scores/:email', (req, res) => {
  const email = req.params.email.toLowerCase().trim();
  const query = `
    SELECT name, email, score, total, percentage, date
    FROM scores 
    WHERE LOWER(email) = ?
    ORDER BY timestamp DESC
  `;
  
  db.all(query, [email], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching user scores:', err.message);
      res.status(500).json({ error: 'Failed to fetch user scores' });
    } else {
      console.log(`📊 Fetched ${rows.length} scores for ${email}`);
      res.json({ success: true, scores: rows });
    }
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const queries = {
    totalAttempts: 'SELECT COUNT(*) as count FROM scores',
    averageScore: 'SELECT AVG(percentage) as average FROM scores',
    highestScore: 'SELECT MAX(percentage) as highest FROM scores',
    uniqueUsers: 'SELECT COUNT(DISTINCT email) as count FROM scores'
  };
  
  const stats = {};
  let completed = 0;
  
  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, [], (err, row) => {
      if (!err) {
        stats[key] = row[Object.keys(row)[0]] || 0;
      }
      completed++;
      
      if (completed === Object.keys(queries).length) {
        res.json({ success: true, stats });
      }
    });
  });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quiz server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/scores     - Get all scores`);
  console.log(`   POST /api/scores     - Submit new score`);
  console.log(`   GET  /api/scores/:email - Get user scores`);
  console.log(`   GET  /api/stats      - Get statistics`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

// Perform initial cleanup on startup
cleanupDuplicates();

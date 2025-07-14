# Supabase Setup Instructions

## 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up with your GitHub account
3. Create a new project
4. Choose a project name (e.g., "movie-quiz-app")
5. Set a strong database password
6. Choose a region close to your users

## 2. Create Database Table
After your project is ready, go to the SQL Editor and run this query:

```sql
-- Create scores table
CREATE TABLE scores (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  date TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX idx_scores_email ON scores(LOWER(email));

-- Enable Row Level Security (optional but recommended)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON scores
FOR ALL USING (true) WITH CHECK (true);
```

## 3. Get API Credentials
1. Go to Settings > API
2. Copy these values:
   - Project URL
   - Anon/Public Key

## 4. Update Environment
Create a `.env` file with:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

## 5. Test Connection
Use the Supabase dashboard to verify the table was created successfully.

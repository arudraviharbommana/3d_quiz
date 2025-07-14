# 🚀 Complete Deployment Guide: Movie Quiz with Global Scoreboard

This guide will help you deploy your movie quiz so friends worldwide can play and share scores!

## 📋 Overview

**What you'll achieve:**
- ✅ Global database where all players' scores are stored
- ✅ Real-time scoreboard visible to everyone  
- ✅ Duplicate prevention (latest attempt replaces previous)
- ✅ Free hosting on GitHub Pages
- ✅ Professional URL to share with friends

**Time needed:** 15-20 minutes

---

## 🎯 Step 1: Create Supabase Database (5 minutes)

### 1.1 Sign Up for Supabase
1. Go to **[https://supabase.com](https://supabase.com)**
2. Click **"Start your project"**
3. Sign up with your **GitHub account** (recommended)
4. Verify your email if prompted

### 1.2 Create New Project
1. Click **"New Project"** 
2. Choose your organization (usually your GitHub username)
3. Fill in project details:
   - **Name**: `movie-quiz-app` (or any name you like)
   - **Database Password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose closest to your location/users
4. Click **"Create new project"**
5. **Wait 2-3 minutes** for the project to initialize

### 1.3 Set Up Database Table
1. Once project is ready, go to **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. **Copy and paste this exact SQL code:**

```sql
-- Create the scores table for movie quiz
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

-- Create index for faster email searches
CREATE INDEX idx_scores_email ON scores(LOWER(email));

-- Enable Row Level Security
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read/write scores
CREATE POLICY "Public Access" ON scores
FOR ALL USING (true) WITH CHECK (true);
```

4. Click **"Run"** button
5. You should see: **"Success. No rows returned"**

### 1.4 Verify Table Creation
1. Go to **"Table Editor"** (left sidebar)
2. You should see a **"scores"** table
3. Click on it to see the empty table structure

### 1.5 Get API Credentials
1. Go to **"Settings"** → **"API"** (left sidebar)
2. **Copy these two values** (keep them handy):
   - **Project URL**: Something like `https://abcdefghijk.supabase.co`
   - **Anon Public Key**: Long string starting with `eyJ...`

---

## 🔧 Step 2: Configure Your Quiz App (2 minutes)

### 2.1 Update Configuration File
1. In your project, open **`config.js`**
2. Replace the placeholder values with your actual Supabase credentials:

```javascript
// Supabase Configuration
const SUPABASE_CONFIG = {
  url: 'https://abcdefghijk.supabase.co',  // ← Paste your Project URL here
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // ← Paste your Anon Key here
};

// Enable Supabase (set to false if you want localStorage only)
const ENABLE_SUPABASE = true;
```

3. **Save the file**

### 2.2 Test Locally (Optional but Recommended)
1. Open **`index.html`** in your web browser
2. Take the quiz and submit a score
3. Check browser console (F12) for messages like:
   - `✅ Supabase client initialized`
   - `✅ Score saved to Supabase`
4. Verify in Supabase dashboard that your score appears in the **scores** table

---

## 📤 Step 3: Push to GitHub (3 minutes)

### 3.1 Initialize Git (if not already done)
Open terminal/command prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Movie quiz app with Supabase integration"
```

### 3.2 Create GitHub Repository
1. Go to **[https://github.com](https://github.com)**
2. Click **"New"** (green button) or **"+"** → **"New repository"**
3. Repository settings:
   - **Repository name**: `movie-quiz` (or any name you prefer)
   - **Visibility**: **Public** (required for free GitHub Pages)
   - **Don't** check "Add a README file" (we already have files)
4. Click **"Create repository"**

### 3.3 Connect and Push Your Code
Copy the commands shown on GitHub and run them in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/movie-quiz.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## 🌐 Step 4: Deploy to GitHub Pages (3 minutes)

### 4.1 Enable GitHub Pages
1. In your GitHub repository, click **"Settings"** tab
2. Scroll down to **"Pages"** section (left sidebar)
3. Under **"Source"**, select:
   - **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **"Save"**

### 4.2 Wait for Deployment
1. GitHub will show a message: **"Your site is ready to be published"**
2. **Wait 3-5 minutes** for the initial deployment
3. Refresh the Pages settings page
4. You'll see: **"Your site is live at [URL]"**

### 4.3 Get Your Live URL
Your quiz will be available at:
```
https://YOUR_USERNAME.github.io/movie-quiz/
```

---

## 🎉 Step 5: Test and Share (2 minutes)

### 5.1 Test Your Live Site
1. Visit your GitHub Pages URL
2. Take the quiz yourself first
3. Submit a score and verify it appears in the scoreboard
4. Check Supabase dashboard to confirm the score was saved

### 5.2 Share with Friends
Send your friends the GitHub Pages URL:
- They can access it from anywhere in the world
- All scores are saved to the same global database
- Everyone sees the same real-time scoreboard
- Latest attempts replace previous scores (no duplicates)

---

## 🔄 Step 6: Making Updates (Future)

When you want to update your quiz:

1. **Make changes** to your local files
2. **Test locally** to ensure everything works
3. **Commit and push** changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Wait 2-3 minutes** for GitHub Pages to update automatically

---

## 🛠️ Troubleshooting

### Common Issues and Solutions:

#### **1. "Supabase credentials not configured" error**
- **Problem**: Config file not updated properly
- **Solution**: Double-check `config.js` has correct URL and key from Supabase dashboard

#### **2. Scores not saving to database**
- **Problem**: Database permissions or API key issues
- **Solution**: 
  - Verify Row Level Security policy is created
  - Check browser console for specific error messages
  - Test API key in Supabase dashboard → API docs

#### **3. GitHub Pages shows 404 error**
- **Problem**: Repository settings or file structure issues
- **Solution**: 
  - Ensure repository is **public**
  - Verify **main** branch is selected in Pages settings
  - Check that `index.html` exists in root folder

#### **4. Scores showing but not globally**
- **Problem**: Using localStorage instead of Supabase
- **Solution**: 
  - Check browser console for Supabase connection messages
  - Verify `ENABLE_SUPABASE = true` in `config.js`
  - Test Supabase connection in dashboard

#### **5. GitHub Pages not updating after changes**
- **Problem**: Deployment cache or timing
- **Solution**: 
  - Wait 5-10 minutes after pushing changes
  - Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
  - Check repository → Actions tab for build status

#### **6. Quiz works locally but not on GitHub Pages**
- **Problem**: File paths or HTTPS issues
- **Solution**: 
  - Ensure all file references use relative paths
  - Check browser console for mixed content errors
  - Verify Supabase URL uses HTTPS

### **Getting Help**

1. **Check browser console** (F12) for error messages
2. **Verify Supabase dashboard** for database entries
3. **Test API connection** in Supabase → Settings → API
4. **Create GitHub issue** in your repository if problems persist

---

## 🎯 Success Checklist

Before sharing with friends, verify:

- [ ] ✅ Quiz loads correctly on GitHub Pages URL
- [ ] ✅ Can submit scores successfully  
- [ ] ✅ Scores appear in Supabase dashboard
- [ ] ✅ Scoreboard shows submitted scores
- [ ] ✅ Multiple attempts by same email replace previous scores
- [ ] ✅ Quiz works on both desktop and mobile

---

## 🌟 Advanced Options (Optional)

### **Custom Domain**
Want a custom domain like `moviequiz.yourname.com`?
1. Buy a domain from any registrar
2. In GitHub Pages settings, add custom domain
3. Configure DNS with your domain provider

### **Analytics**
Track how many people play your quiz:
1. Create Google Analytics account
2. Add tracking code to all HTML files
3. Monitor usage statistics

### **Enhanced Security**
Restrict database access:
1. In Supabase → Authentication → Policies
2. Modify policies to add restrictions (time limits, etc.)
3. Set up user authentication if needed

---

## 🎬 Final Result

**Once deployed successfully:**

✅ **Professional URL**: `https://yourusername.github.io/movie-quiz/`  
✅ **Global Database**: All scores stored permanently in Supabase  
✅ **Real-time Scoreboard**: Everyone sees the same live rankings  
✅ **Mobile-Friendly**: Works perfectly on phones and tablets  
✅ **Zero Duplicates**: Latest scores replace previous attempts  
✅ **Free Hosting**: No ongoing costs  

**Your friends can now:**
- Play from anywhere in the world
- See each other's scores in real-time
- Compete on a global leaderboard
- Access the quiz anytime from the shared URL

**🎉 Congratulations! Your movie quiz is now live and ready for the world!**
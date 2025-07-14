# 🎬 Vihar's Cine Square - Movie Quiz

A beautiful 3D animated movie quiz application with a global scoreboard, powered by Supabase and deployable to GitHub Pages.

## ✨ Features

- 🎯 **10 Personalized Movie Questions** - About Tamil/Telugu cinema preferences
- 🎨 **3D Animated Background** - Beautiful Three.js particle effects  
- 📱 **Responsive Design** - Works on desktop and mobile
- 🌍 **Global Scoreboard** - Real-time scores shared across all players
- 🔄 **Duplicate Prevention** - Latest attempt replaces previous scores
- 💾 **Persistent Storage** - Supabase database with localStorage fallback
- 🚀 **Easy Deployment** - One-click deployment to GitHub Pages

## 🎮 Live Demo

Once deployed, share your GitHub Pages URL with friends to play!

## 🚀 Quick Deployment

### Option 1: Deploy with Supabase (Recommended for Global Scoreboard)

1. **Set up Supabase Database**
   - Follow the detailed guide in [`DEPLOYMENT.md`](DEPLOYMENT.md)
   - Create a free account at [supabase.com](https://supabase.com)
   - Set up the database table and get your API credentials

2. **Configure the App**
   - Update `config.js` with your Supabase credentials
   - Test locally to ensure everything works

3. **Deploy to GitHub Pages**
   - Push code to GitHub repository
   - Enable GitHub Pages in repository settings
   - Share the live URL with friends!

### Option 2: Quick Deploy (Local Scores Only)

If you just want to deploy without global scores:

1. Set `ENABLE_SUPABASE = false` in `config.js`
2. Push to GitHub and enable Pages
3. Each user will see only their own scores

## 🛠️ Local Development

### Prerequisites
- Node.js (for local server development)
- Modern web browser

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/arudraviharbommana/3d_quiz.git
   cd 3d_quiz
   ```

2. **Install dependencies** (for local server)
   ```bash
   npm install
   ```

3. **Start local server** (optional)
   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

4. **Or open directly in browser**
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

## 📁 Project Structure

```
3d_quiz/
├── index.html          # Welcome page
├── quiz.html           # Quiz interface  
├── result.html         # Results page
├── scoreboard.html     # Global scoreboard
├── script_new.js       # Main application logic
├── style.css           # Styling and animations
├── config.js           # Supabase configuration
├── supabase-client.js  # Database client
├── server.js           # Local development server
├── package.json        # Node.js dependencies
├── DEPLOYMENT.md       # Detailed deployment guide
└── README.md          # This file
```

## 🎯 Quiz Questions

The quiz features 10 carefully crafted questions about:
- Favorite Tamil/Telugu directors
- Movie genre preferences  
- Iconic movie scenes and dialogues
- Actor preferences
- Cinema appreciation

## 🔧 Configuration

### Supabase Setup
Update `config.js`:
```javascript
const SUPABASE_CONFIG = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key'
};
```

### Features Toggle
```javascript
const ENABLE_SUPABASE = true;  // false for localStorage only
```

## 🌟 Technical Features

- **Duplicate Prevention**: Email-based deduplication ensures one score per player
- **Fallback System**: Graceful degradation from Supabase → Local Server → localStorage
- **Real-time Updates**: Instant scoreboard updates for all players
- **Mobile Responsive**: Optimized for all screen sizes
- **3D Graphics**: Smooth particle animations with Three.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Troubleshooting

### Common Issues

1. **Scores not saving globally**
   - Check Supabase configuration in `config.js`
   - Verify database permissions in Supabase dashboard

2. **Local server issues**
   - Run `npm install` to install dependencies
   - Check if port 3000 is available

3. **GitHub Pages deployment issues**
   - Ensure repository is public
   - Wait 5-10 minutes for changes to propagate
   - Check browser console for errors

For more help, see [`DEPLOYMENT.md`](DEPLOYMENT.md) or create an issue.

## 🎬 About

Created by Vihar as a fun way to test movie knowledge and share cinema passion with friends. The quiz celebrates South Indian cinema with personalized questions about favorite directors, genres, and memorable movie moments.

---

**Ready to test your movie knowledge?** [Start the quiz!](#) 🎬
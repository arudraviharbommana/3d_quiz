// =========================
// QUIZ DATA & CONFIGURATION
// =========================
const questions = [
  {
    question: "Which wood do I like the most?",
    options: { A: "Kolly wood (Tamil)", B: "Tollywood (Telugu)", C: "Sandalwood (Kannada)", D: "Bollywood (Hindi)" },
    correct: ["A", "B"]
  },
  {
    question: "Who is my favourite director?",
    options: { A: "Rajamouli", B: "Puri Jagannadh", C: "Trivikram", D: "Mani Ratnam" },
    correct: ["D"]
  },
  {
    question: "My favourite genre?",
    options: { A: "Romantic comedy", B: "Suspense thriller", C: "Horror", D: "Periodic" },
    correct: ["B"]
  },
  {
    question: "My favourite Hero?",
    options: { A: "Allu Arjun", B: "NTR", C: "Rajnikanth", D: "Dhanush" },
    correct: ["C"]
  },
  {
    question: "My Favourite comedian?",
    options: { A: "Ali", B: "Brahmanandam", C: "Vadivelu", D: "Vivekanandan" },
    correct: ["D"]
  },
  {
    question: "Whose dance style do I love to dup?",
    options: { A: "Jani master", B: "Sekhar master", C: "NTR", D: "Allu Arjun" },
    correct: ["A"]
  },
  {
    question: "What's the latest film that I have enjoyed?",
    options: { A: "Kuberaa", B: "Daaku Maharaj", C: "HIT-3", D: "Pushpa-2" },
    correct: ["C", "D"]
  },
  {
    question: "Which film would I like to recommend you to watch?",
    options: { A: "Dalapathi", B: "Baasha", C: "Mahanadi", D: "Nayakudu" },
    correct: ["A"]
  },
  {
    question: "My favourite Music album ____.",
    options: { A: "Remo", B: "Gunturu Kaaram", C: "Pushpa", D: "Petta" },
    correct: ["B"]
  },
  {
    question: "Something makes me settle____.",
    options: { A: "Dance", B: "Writing", C: "Music", D: "Food" },
    correct: ["C", "D"]
  }
];

// =========================
// QUIZ STATE MANAGEMENT
// =========================
let currentQuestion = 0;
let selectedAnswers = [];
let quizData = {
  name: '',
  email: '',
  score: 0,
  total: questions.length,
  results: [],
  date: ''
};

// =========================
// UTILITY FUNCTIONS
// =========================
function log(message, data = '') {
  console.log(`🎬 [QUIZ] ${message}`, data);
}

function showMessage(element, message, type = 'error') {
  if (element) {
    element.textContent = message;
    element.className = type === 'success' ? 'success-msg' : 'error-msg';
  }
}

function showResultMessage(message, type) {
  const resultBox = document.querySelector(".result-box");
  if (!resultBox) return;
  
  const existingMsg = resultBox.querySelector('.result-message');
  if (existingMsg) existingMsg.remove();
  
  const msgElement = document.createElement("div");
  msgElement.className = 'result-message';
  msgElement.style.cssText = `
    background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#f44336'};
    color: white; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: center;
  `;
  msgElement.textContent = message;
  resultBox.prepend(msgElement);
}

// =========================
// API CONFIGURATION
// =========================
const API_BASE_URL = 'http://localhost:3000'; // Backend server URL (fallback)
const USE_SUPABASE = true; // Set to true to use Supabase, false for local server

// =========================
// LOCAL STORAGE MANAGEMENT (Fallback)
// =========================
function saveScoreToLocal(scoreData) {
  try {
    let scores = JSON.parse(localStorage.getItem('movieQuizScores') || '[]');
    
    // Remove any existing score for the same email (case-insensitive)
    const normalizedEmail = scoreData.email.toLowerCase().trim();
    scores = scores.filter(score => score.email.toLowerCase().trim() !== normalizedEmail);
    
    // Add the new score
    scores.push(scoreData);
    
    // Sort by score (highest first), then by date (most recent first)
    scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.date) - new Date(a.date);
    });
    
    localStorage.setItem('movieQuizScores', JSON.stringify(scores));
    log('Score saved to localStorage (replaced existing):', scoreData);
    return true;
  } catch (error) {
    log('Error saving to localStorage:', error);
    return false;
  }
}

function getScoresFromLocal() {
  try {
    return JSON.parse(localStorage.getItem('movieQuizScores') || '[]');
  } catch (error) {
    log('Error loading from localStorage:', error);
    return [];
  }
}

// =========================
// BACKEND API FUNCTIONS
// =========================
async function saveScoreToServer(scoreData) {
  // Try Supabase first if enabled
  if (USE_SUPABASE && typeof supabaseClient !== 'undefined') {
    console.log('🚀 Using Supabase for score storage');
    const result = await supabaseClient.saveScore(scoreData);
    return result.success || false;
  }
  
  // Fallback to local server
  try {
    const response = await fetch(`${API_BASE_URL}/api/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      log('Score saved to server:', scoreData);
      return true;
    } else {
      log('Server error saving score:', result.error);
      return false;
    }
  } catch (error) {
    log('Network error saving score:', error);
    return false;
  }
}

async function getScoresFromServer() {
  // Try Supabase first if enabled
  if (USE_SUPABASE && typeof supabaseClient !== 'undefined') {
    console.log('🚀 Using Supabase for score retrieval');
    return await supabaseClient.getScores();
  }
  
  // Fallback to local server
  try {
    const response = await fetch(`${API_BASE_URL}/api/scores`);
    const result = await response.json();
    
    if (result.success) {
      log('Scores loaded from server:', result.scores.length);
      return result.scores;
    } else {
      log('Server error loading scores:', result.error);
      return [];
    }
  } catch (error) {
    log('Network error loading scores:', error);
    return [];
  }
}

async function getUserScores(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scores/${encodeURIComponent(email)}`);
    const result = await response.json();
    
    if (result.success) {
      log('User scores loaded from server:', result.scores.length);
      return result.scores;
    } else {
      log('Server error loading user scores:', result.error);
      return [];
    }
  } catch (error) {
    log('Network error loading user scores:', error);
    return [];
  }
}

// =========================
// INDEX PAGE FUNCTIONS
// =========================
function startQuiz() {
  log('Starting quiz...');
  
  const nameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const errorElement = document.getElementById("error");
  
  if (!nameInput || !emailInput) {
    log('Name or email input not found');
    return;
  }
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  
  if (!name) {
    showMessage(errorElement, "Please enter your name.");
    return;
  }
  
  if (!email) {
    showMessage(errorElement, "Please enter your email.");
    return;
  }
  
  // Store user data
  quizData.name = name;
  quizData.email = email;
  quizData.date = new Date().toISOString();
  
  // Save to sessionStorage
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("quizData", JSON.stringify(quizData));
  
  log('User data stored:', { name, email });
  
  // Navigate to quiz
  window.location.href = "quiz.html";
}

function viewScoreboard() {
  log('Navigating to scoreboard...');
  window.location.href = "scoreboard.html";
}

function initializeIndexPage() {
  const startBtn = document.getElementById("startQuizBtn");
  const scoreboardBtn = document.getElementById("viewScoreboardBtn");
  
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
    log('Start Quiz button initialized');
  }
  
  if (scoreboardBtn) {
    scoreboardBtn.addEventListener('click', viewScoreboard);
    log('View Scoreboard button initialized');
  }
}

// =========================
// QUIZ PAGE FUNCTIONS
// =========================
function renderQuestion() {
  if (!questions || currentQuestion >= questions.length) {
    log('No questions or end of quiz reached');
    return;
  }
  
  const questionElement = document.getElementById("questionText");
  const optionsElement = document.getElementById("optionsContainer");
  const titleElement = document.getElementById("questionTitle");
  const progressElement = document.getElementById("progressFill");
  
  if (!questionElement || !optionsElement) {
    log('Quiz elements not found on page');
    return;
  }
  
  const question = questions[currentQuestion];
  
  // Update question title and progress
  if (titleElement) titleElement.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  if (progressElement) progressElement.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  
  // Display question
  questionElement.textContent = question.question;
  
  // Display options
  optionsElement.innerHTML = '';
  Object.entries(question.options).forEach(([key, value]) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    
    optionDiv.innerHTML = `
      <input type="checkbox" id="option${key}" value="${key}" style="display: none;">
      <label for="option${key}">${key}. ${value}</label>
    `;
    
    // Add click handler for the entire div
    optionDiv.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const checkbox = this.querySelector('input');
      
      // Allow multiple selections - just toggle this option
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        
        // Update visual state
        if (checkbox.checked) {
          this.classList.add('selected');
        } else {
          this.classList.remove('selected');
        }
      }
      
      enableNextButton();
    });
    
    optionsElement.appendChild(optionDiv);
  });
  
  log(`Rendered question ${currentQuestion + 1}:`, question.question);
  
  // Disable next button initially
  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) prevBtn.disabled = currentQuestion === 0;
}

function updateSelectedState() {
  const selected = selectedAnswers[currentQuestion] || [];

  const options = document.querySelectorAll('#optionsContainer .option');
  options.forEach(option => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = selected.includes(checkbox.value);
      if (checkbox.checked) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    }
  });

  enableNextButton();
}

function updateOptionStyles() {
  const options = document.querySelectorAll('#optionsContainer .option');
  options.forEach(option => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

function enableNextButton() {
  const nextBtn = document.getElementById("nextBtn");
  const checkedBoxes = document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked');
  
  if (nextBtn) {
    nextBtn.disabled = checkedBoxes.length === 0;
    nextBtn.style.opacity = checkedBoxes.length === 0 ? '0.5' : '1';
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
    updateSelectedState(); // Highlight previously selected answers
  }
}

function nextQuestion() {
  log(`Processing question ${currentQuestion + 1}`);
  
  // Get selected answers
  const selected = [];
  const checkboxes = document.querySelectorAll('#optionsContainer input[type="checkbox"]:checked');
  checkboxes.forEach(cb => selected.push(cb.value));
  
  if (selected.length === 0) {
    alert('Please select at least one answer before proceeding.');
    return;
  }
  
  selectedAnswers[currentQuestion] = selected;
  log('Selected answers:', selected);
  
  currentQuestion++;
  
  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  log('Finishing quiz and calculating results...');
  
  // Calculate score and results
  quizData.score = 0;
  quizData.results = [];
  
  for (let i = 0; i < questions.length; i++) {
    const correct = questions[i].correct.sort();
    const selected = (selectedAnswers[i] || []).sort();
    const isCorrect = JSON.stringify(correct) === JSON.stringify(selected);
    
    if (isCorrect) quizData.score++;
    
    quizData.results.push({
      question: questions[i].question,
      selected,
      correct,
      isCorrect
    });
  }
  
  // Save complete quiz data
  sessionStorage.setItem("quizData", JSON.stringify(quizData));
  sessionStorage.setItem("score", quizData.score.toString());
  sessionStorage.setItem("results", JSON.stringify(quizData.results));
  
  log('Quiz completed! Final data:', quizData);
  
  // Navigate to results
  window.location.href = "result.html";
}

// =========================
// RESULT PAGE FUNCTIONS
// =========================
function displayResults() {
  log('Displaying results...');
  
  // Load quiz data
  const storedData = sessionStorage.getItem("quizData");
  if (storedData) {
    quizData = JSON.parse(storedData);
  } else {
    // Fallback to individual items
    quizData.score = parseInt(sessionStorage.getItem("score") || "0");
    quizData.results = JSON.parse(sessionStorage.getItem("results") || "[]");
    quizData.name = sessionStorage.getItem("name") || "";
    quizData.email = sessionStorage.getItem("email") || "";
  }
  
  log('Loaded quiz data:', quizData);
  
  // Display score
  const scoreElement = document.getElementById("scoreDisplay");
  if (scoreElement) {
    scoreElement.textContent = `${quizData.score}/${quizData.total || questions.length}`;
  }
  
  // Display detailed results
  const answersDiv = document.getElementById("answers");
  if (answersDiv && quizData.results) {
    answersDiv.innerHTML = '';
    quizData.results.forEach((result, index) => {
      const block = document.createElement("div");
      block.classList.add("qa");
      
      // Convert option keys to format: "A. Option Text"
      const selectedText = (result.selected || []).map(opt => `${opt}. ${questions[index].options[opt] || opt}`).join(", ") || 'None';
      const correctText = (result.correct || []).map(opt => `${opt}. ${questions[index].options[opt] || opt}`).join(", ");
      
      block.innerHTML = `
        <h4>Q${index + 1}. ${result.question}</h4>
        <p><strong>Your Answer:</strong> 
          <span class="${result.isCorrect ? 'correct' : 'wrong'}">${selectedText}</span>
        </p>
        <p><strong>Correct Answer:</strong> ${correctText}</p>
      `;
      answersDiv.appendChild(block);
    });
  }
  
  // Save score to localStorage
  saveScore();
}

function saveScore() {
  if (!quizData.name || !quizData.email) {
    log('Error: Missing name or email for submission', quizData);
    showResultMessage('⚠️ Missing name or email for score submission.', 'warning');
    return;
  }
  
  const scoreData = {
    name: quizData.name,
    email: quizData.email,
    score: quizData.score,
    total: quizData.total,
    percentage: Math.round((quizData.score / quizData.total) * 100),
    date: new Date().toISOString(),
    timestamp: Date.now()
  };
  
  log('Saving score data:', scoreData);
  
  // Try to save to server first, fallback to localStorage
  saveScoreToServer(scoreData)
    .then(serverSaved => {
      if (serverSaved) {
        showResultMessage('✅ Score saved to global scoreboard!', 'success');
      } else {
        // Fallback to localStorage
        const localSaved = saveScoreToLocal(scoreData);
        if (localSaved) {
          showResultMessage('⚠️ Score saved locally (server unavailable)', 'warning');
        } else {
          showResultMessage('❌ Error saving score', 'error');
        }
      }
    })
    .catch(error => {
      log('Error in saveScore:', error);
      // Fallback to localStorage
      const localSaved = saveScoreToLocal(scoreData);
      if (localSaved) {
        showResultMessage('⚠️ Score saved locally (server unavailable)', 'warning');
      } else {
        showResultMessage('❌ Error saving score', 'error');
      }
    });
}

// =========================
// SCOREBOARD FUNCTIONS
// =========================
async function loadScoreboard() {
  log('Loading scoreboard...');
  
  const tbody = document.querySelector("#scoreTable tbody");
  if (!tbody) {
    log('Scoreboard table not found');
    return;
  }
  
  // Show loading message
  tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ccc;">Loading global scores...</td></tr>';
  
  try {
    // Try to load from server first
    const serverScores = await getScoresFromServer();
    let scores = [];
    
    if (serverScores.length > 0) {
      scores = serverScores;
      log('Using server scores:', scores.length);
    } else {
      // Fallback to localStorage if server has no scores
      scores = getScoresFromLocal();
      log('Using local scores as fallback:', scores.length);
      
      if (scores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ccc; font-style: italic;">No scores yet. Be the first to take the quiz!</td></tr>';
        return;
      }
    }
    
    tbody.innerHTML = '';
    
    // Display scores
    scores.forEach((entry, index) => {
      const row = document.createElement("tr");
      const rank = index + 1;
      const percentage = entry.percentage || Math.round((entry.score / entry.total) * 100);
      const date = new Date(entry.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Add rank styling classes
      let rankClass = '';
      if (rank === 1) rankClass = 'rank-1';
      else if (rank === 2) rankClass = 'rank-2';
      else if (rank === 3) rankClass = 'rank-3';
      
      row.className = rankClass;
      row.innerHTML = `
        <td><strong>#${rank}</strong></td>
        <td>${entry.name}</td>
        <td class="score-cell"><strong>${entry.score}/${entry.total}</strong><br><small>(${percentage}%)</small></td>
        <td>${date}</td>
      `;
      
      tbody.appendChild(row);
    });
    
    log(`Loaded ${scores.length} scores to scoreboard`);
    
  } catch (error) {
    log('Error loading scores:', error);
    // Final fallback to localStorage
    const localScores = getScoresFromLocal();
    if (localScores.length > 0) {
      tbody.innerHTML = '';
      localScores.forEach((entry, index) => {
        const row = document.createElement("tr");
        const rank = index + 1;
        const percentage = entry.percentage || Math.round((entry.score / entry.total) * 100);
        const date = new Date(entry.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        
        // Add rank styling classes
        let rankClass = '';
        if (rank === 1) rankClass = 'rank-1';
        else if (rank === 2) rankClass = 'rank-2';
        else if (rank === 3) rankClass = 'rank-3';
        
        row.className = rankClass;
        row.innerHTML = `
          <td><strong>#${rank}</strong></td>
          <td>${entry.name}</td>
          <td class="score-cell"><strong>${entry.score}/${entry.total}</strong><br><small>(${percentage}%)</small></td>
          <td>${date}</td>
        `;
        
        tbody.appendChild(row);
      });
    } else {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ff6b6b;">Error loading scores. Please try again later.</td></tr>';
    }
  }
}

// =========================
// NAVIGATION FUNCTIONS
// =========================
function goHome() {
  log('Navigating to home page');
  sessionStorage.clear();
  window.location.href = "index.html";
}

function viewAgain() {
  log('Restarting quiz');
  // Keep user data but reset quiz state
  const userData = {
    name: quizData.name,
    email: quizData.email
  };
  sessionStorage.clear();
  sessionStorage.setItem("name", userData.name);
  sessionStorage.setItem("email", userData.email);
  sessionStorage.setItem("quizData", JSON.stringify({
    name: userData.name,
    email: userData.email,
    score: 0,
    total: questions.length,
    results: [],
    date: new Date().toISOString()
  }));
  window.location.href = "quiz.html";
}

// =========================
// PAGE INITIALIZATION
// =========================
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();
  log('Page loaded:', currentPage);
  
  // Initialize based on current page
  switch(currentPage) {
    case 'index.html':
    case '':
      // Initialize index page buttons
      initializeIndexPage();
      break;
      
    case 'quiz.html':
      // Load user data
      const storedData = sessionStorage.getItem("quizData");
      if (storedData) {
        quizData = JSON.parse(storedData);
        log('Loaded quiz data for user:', quizData.name);
      } else {
        // If no quiz data, redirect to index
        log('No quiz data found, redirecting to index');
        window.location.href = "index.html";
        return;
      }
      
      // Reset quiz state
      currentQuestion = 0;
      selectedAnswers = [];
      
      // Render first question
      renderQuestion();
      break;
      
    case 'result.html':
      displayResults();
      break;
      
    case 'scoreboard.html':
      loadScoreboard();
      break;
      
    default:
      log('Unknown page, checking for index elements...');
      // Fallback: if we find index page elements, initialize them
      if (document.getElementById("startQuizBtn")) {
        initializeIndexPage();
      }
  }
});

// =========================
// 3D BACKGROUND ANIMATIONS
// =========================
function initializeThreeJSAnimation(canvasId) {
  if (typeof THREE === 'undefined' || !document.getElementById(canvasId)) {
    return;
  }
  
  const canvas = document.querySelector(`#${canvasId}`);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Mobile optimization - reduce quality for better performance
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true,
    antialias: !isMobile, // Disable antialiasing on mobile for performance
    powerPreference: isMobile ? "low-power" : "high-performance"
  });
  
  // Set pixel ratio for mobile devices
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Reduced geometry complexity for mobile
  const geometry = new THREE.SphereGeometry(0.03, isMobile ? 6 : 8, isMobile ? 6 : 8);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });

  // Fewer particles on mobile for better performance
  const particleCount = isMobile ? 100 : 200;
  
  for (let i = 0; i < particleCount; i++) {
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    scene.add(star);
  }

  // Simpler lighting for mobile
  if (!isMobile) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
  }

  let isAnimating = true;
  let lastTime = 0;
  const targetFPS = isMobile ? 30 : 60; // Lower FPS on mobile
  const interval = 1000 / targetFPS;
  
  function animate(currentTime) {
    if (!isAnimating) return;
    
    requestAnimationFrame(animate);
    
    // Throttle animation for mobile performance
    if (currentTime - lastTime < interval) return;
    lastTime = currentTime;
    
    scene.rotation.x += isMobile ? 0.0005 : 0.0008;
    scene.rotation.y += isMobile ? 0.0003 : 0.0005;
    renderer.render(scene, camera);
  }
  animate();

  // Pause animation when page is not visible (mobile battery optimization)
  document.addEventListener('visibilitychange', () => {
    isAnimating = !document.hidden;
    if (isAnimating) animate();
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  });
}

// Initialize animations for all pages
document.addEventListener('DOMContentLoaded', function() {
  // Check WebGL support
  function isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }

  // Add fallback for devices without WebGL support
  if (!isWebGLSupported()) {
    document.body.classList.add('no-webgl');
    // Create fallback animation element
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'mobile-animation-fallback';
    document.body.appendChild(fallbackDiv);
    return;
  }

  // Check which canvas exists and initialize accordingly
  const canvases = ['welcomeCanvas', 'quizCanvas', 'resultCanvas', 'scoreboardCanvas'];
  canvases.forEach(canvasId => {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
      initializeThreeJSAnimation(canvasId);
    }, 100);
  });
});

// Debug functions
function viewStoredScores() {
  const scores = getScoresFromLocal();
  console.table(scores);
  return scores;
}

function clearAllScores() {
  clearLocalScores();
  console.log('All scores cleared from localStorage');
}

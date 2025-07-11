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
    question: "What’s the latest film that I have enjoyed?",
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

let currentQuestion = 0;
const selectedAnswers = {};

function renderQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("quiz-title").innerText = `${currentQuestion + 1}. ${q.question}`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  for (let key in q.options) {
    const btn = document.createElement("button");
    btn.innerText = `${key}. ${q.options[key]}`;
    btn.classList.toggle("selected", selectedAnswers[currentQuestion]?.includes(key));
    btn.onclick = () => toggleOption(key);
    optionsDiv.appendChild(btn);
  }

  document.getElementById("submitBtn").style.display = currentQuestion === questions.length - 1 ? "inline-block" : "none";
}

function toggleOption(key) {
  selectedAnswers[currentQuestion] = selectedAnswers[currentQuestion] || [];
  const idx = selectedAnswers[currentQuestion].indexOf(key);
  if (idx > -1) {
    selectedAnswers[currentQuestion].splice(idx, 1);
  } else {
    selectedAnswers[currentQuestion].push(key);
  }
  renderQuestion();
}

function rotateLeft() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function rotateRight() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function submitQuiz() {
  let score = 0;
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    const correct = questions[i].correct.sort();
    const selected = (selectedAnswers[i] || []).sort();
    const isCorrect = JSON.stringify(correct) === JSON.stringify(selected);
    if (isCorrect) score++;
    results.push({
      question: questions[i].question,
      selected,
      correct,
      isCorrect
    });
  }

  sessionStorage.setItem("score", score);
  sessionStorage.setItem("results", JSON.stringify(results));
  window.location.href = "result.html";
}

renderQuestion();

// ===== THREE.JS ANIMATED STARFIELD BACKGROUND =====
const canvas = document.querySelector("#quizCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(0.03, 8, 8);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa });

for (let i = 0; i < 200; i++) {
  const star = new THREE.Mesh(geometry, material);
  star.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
  scene.add(star);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.x += 0.0008;
  scene.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


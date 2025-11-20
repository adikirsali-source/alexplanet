// scripts.js - quiz, carousel, and API fetch for Task 3
document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
  initCarousel();
  initAPI();
});

/* ---------- QUIZ ---------- */
function initQuiz(){
  const quizEl = document.getElementById('quiz');
  if (!quizEl) return;

  // sample questions
  const questions = [
    {
      q: "Which HTML element is used for JavaScript?",
      choices: ["<script>", "<js>", "<javascript>", "<code>"],
      answer: 0
    },
    {
      q: "Which method adds an event listener to an element?",
      choices: ["addListener()", "attach()", "addEventListener()", "listen()"],
      answer: 2
    },
    {
      q: "Which CSS property is used to change layout to flexbox?",
      choices: ["display:flex", "layout:flex", "flexbox:true", "display:grid"],
      answer: 0
    },
    {
      q: "What does DOM stand for?",
      choices: ["Document Object Model", "Data Object Model", "Document Order Model", "Display Object Model"],
      answer: 0
    }
  ];

  let cur = 0, score = 0, selected = null;
  const questionEl = document.getElementById('question');
  const choicesEl = document.getElementById('choices');
  const nextBtn = document.getElementById('nextBtn');
  const restartBtn = document.getElementById('restartBtn');
  const msg = document.getElementById('quizMsg');

  function render(){
    selected = null;
    msg.textContent = '';
    const item = questions[cur];
    questionEl.textContent = `Q${cur+1}. ${item.q}`;
    choicesEl.innerHTML = '';
    item.choices.forEach((c,i) => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.textContent = c;
      b.type = 'button';
      b.addEventListener('click', () => {
        // mark selection visually
        [...choicesEl.children].forEach(ch => ch.classList.remove('selected'));
        b.classList.add('selected');
        selected = i;
      });
      choicesEl.appendChild(b);
    });
    nextBtn.textContent = cur === questions.length -1 ? 'Finish' : 'Next';
  }

  nextBtn.addEventListener('click', () => {
    if (selected === null) {
      msg.textContent = 'Please select an answer to continue.';
      return;
    }
    const correct = questions[cur].answer;
    if (selected === correct) score++;
    cur++;
    if (cur < questions.length) {
      render();
    } else {
      // show result
      questionEl.textContent = `Quiz Completed — Score: ${score} / ${questions.length}`;
      choicesEl.innerHTML = '';
      msg.textContent = '';
      nextBtn.style.display = 'none';
      restartBtn.style.display = 'inline-block';
    }
  });

  restartBtn.addEventListener('click', () => {
    cur = 0; score = 0; selected = null;
    nextBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
    render();
  });

  render();
}

/* ---------- CAROUSEL ---------- */
function initCarousel(){
  const track = document.getElementById('track');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsWrap = document.getElementById('dots');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = 0, intervalId = null;
  // build dots
  slides.forEach((_,i) => {
    const d = document.createElement('div');
    d.className = 'dot';
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);
  function update(){
    const width = track.clientWidth;
    track.style.transform = `translateX(-${index * width}px)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }
  function goTo(i){
    index = (i + slides.length) % slides.length;
    update();
    resetAuto();
  }
  prev?.addEventListener('click', () => goTo(index-1));
  next?.addEventListener('click', () => goTo(index+1));

  // auto rotate
  function auto(){
    intervalId = setInterval(() => goTo(index+1), 3500);
  }
  function resetAuto(){
    clearInterval(intervalId);
    auto();
  }
  // initial
  window.addEventListener('resize', update);
  update();
  auto();
}

/* ---------- API FETCH (Random Joke) ---------- */
function initAPI(){
  const btn = document.getElementById('fetchJoke');
  const display = document.getElementById('jokeDisplay');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    display.textContent = 'Loading...';
    try {
      // public joke API
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      display.innerHTML = `<strong>${escapeHtml(data.setup)}</strong><br>${escapeHtml(data.punchline)}`;
    } catch (err) {
      // fallback to quotes API if CORS blocks
      try {
        const res2 = await fetch('https://api.quotable.io/random');
        const d2 = await res2.json();
        display.innerHTML = `<strong>${escapeHtml(d2.content)}</strong><br>— ${escapeHtml(d2.author)}`;
      } catch (e) {
        display.textContent = 'Failed to fetch a joke. Please try again.';
      }
    }
  });
}

// small helper to avoid injected HTML via API
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* =========================================
   TASTE BUDS — script.js
   Vanilla JS + async JSON data loading
   ========================================= */

// ── State ─────────────────────────────────
const state = {
  answers: {},
  scores: { comfort: 0, spicy: 0, sweet: 0, fresh: 0, quick: 0 },
  resultBear: null,
  topCuisines: [],
  cuisines: [],
  chartInstance: null
};

// ── Bear Data ─────────────────────────────
const BEARS = {
  comfort: {
    type: 'comfort',
    name: 'Teddy',
    img: 'assets/brown-bear.png',
    alt: 'A cute brown teddy bear',
    description: 'You love warm, hearty meals that feel like a hug. Pizza, pasta, and BBQ are your go-tos!'
  },
  spicy: {
    type: 'spicy',
    name: 'Spice',
    img: 'assets/spicy-bear.png',
    alt: 'A bold red teddy bear with a green outline',
    description: 'You crave bold flavors and exciting heat! Thai, Korean, and Mexican are calling your name.'
  },
  sweet: {
    type: 'sweet',
    name: 'Cherry',
    img: 'assets/pink-cherry-bear.png',
    alt: 'A soft pink teddy bear with rosy cheeks',
    description: 'Life is sweeter with desserts! Bakeries, brunch, and boba make your heart happy.'
  },
  fresh: {
    type: 'fresh',
    name: 'Rose',
    img: 'assets/green-pinkflower-bear.png',
    alt: 'A sage green teddy bear with a little pink flower',
    description: 'You appreciate clean, fresh flavors. Japanese, Mediterranean, and seafood are your vibe.'
  },
  quick: {
    type: 'quick',
    name: 'Dasha',
    img: 'assets/pink-lemonade-bear.png',
    alt: 'A creamy white teddy bear with a pink outline',
    description: 'Fast, tasty, and satisfying! Burgers, sandwiches, and food trucks are perfect for you.'
  }
};

// ── Quiz Questions ─────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 'mood',
    question: "What's your food mood?",
    options: [
      { label: 'chill', value: 'chill' },
      { label: 'sweet', value: 'sweet' },
      { label: 'spicy', value: 'spicy' },
      { label: 'comfort', value: 'comfort' }
    ],
    cols: 2
  },
  {
    id: 'hunger',
    question: 'How hungry are you?',
    options: [
      { label: 'just a little snack', value: 'snack' },
      { label: 'a little appetizer would be nice', value: 'appetizer' },
      { label: 'full meal please', value: 'fullmeal' },
      { label: 'I could eat a whole house', value: 'wholehouse' }
    ],
    cols: 1
  },
  {
    id: 'budget',
    question: "What's your budget?",
    options: [
      { label: '$', value: '$' },
      { label: '$$', value: '$$' },
      { label: '$$$', value: '$$$' },
      { label: "doesn't matter", value: 'any' }
    ],
    cols: 2
  },
  {
    id: 'vibe',
    question: "What's the vibe?",
    options: [
      { label: 'quick & easy', value: 'quick' },
      { label: 'casual hangout', value: 'casual' },
      { label: 'sit-down meal', value: 'sitdown' },
      { label: 'try something new', value: 'new' }
    ],
    cols: 2
  }
];

// ── Async Data Loading ─────────────────────
async function loadCuisines() {
  const response = await fetch('data/cuisines.json');

  if (!response.ok) {
    throw new Error('Could not load cuisine data.');
  }

  const data = await response.json();
  return data;
}

// ── Scoring Logic ─────────────────────────
function calculateScores() {
  const s = { comfort: 0, spicy: 0, sweet: 0, fresh: 0, quick: 0 };

  if (state.answers.mood === 'comfort') s.comfort += 3;
  if (state.answers.mood === 'sweet') s.sweet += 3;
  if (state.answers.mood === 'spicy') s.spicy += 3;
  if (state.answers.mood === 'chill') {
    s.fresh += 2;
    s.quick += 1;
  }

  if (state.answers.hunger === 'snack') {
    s.quick += 2;
  }
  if (state.answers.hunger === 'appetizer') {
    s.sweet += 2;
    s.quick += 1;
  }
  if (state.answers.hunger === 'fullmeal') {
    s.comfort += 2;
    s.spicy += 1;
  }
  if (state.answers.hunger === 'wholehouse') {
    s.comfort += 2;
    s.spicy += 2;
  }

  if (state.answers.budget === '$') {
    s.quick += 2;
    s.sweet += 1;
  }
  if (state.answers.budget === '$$') {
    s.comfort += 1;
    s.spicy += 1;
  }
  if (state.answers.budget === '$$$') {
    s.fresh += 2;
  }
  if (state.answers.budget === 'any') {
    s.fresh += 1;
    s.spicy += 1;
  }

  if (state.answers.vibe === 'quick') {
    s.quick += 3;
  }
  if (state.answers.vibe === 'casual') {
    s.comfort += 2;
    s.quick += 1;
  }
  if (state.answers.vibe === 'sitdown') {
    s.comfort += 2;
    s.fresh += 1;
  }
  if (state.answers.vibe === 'new') {
    s.spicy += 2;
    s.fresh += 1;
  }

  state.scores = s;

  const winner = Object.keys(s).reduce((a, b) => (s[a] > s[b] ? a : b));
  state.resultBear = BEARS[winner];

  state.topCuisines = state.cuisines
    .filter(c => c.category === winner)
    .slice(0, 3);
}

// ── Screen Navigation ─────────────────────
const SCREENS = [
  'welcome',
  'learning1',
  'learning2',
  'learning3',
  'quiz1',
  'quiz2',
  'quiz3',
  'quiz4',
  'result',
  'explore'
];

function showScreen(name) {
  SCREENS.forEach(id => {
    const el = document.getElementById('screen-' + id);
    if (el) el.classList.remove('active');
  });

  const target = document.getElementById('screen-' + name);
  if (target) target.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Reset Helper ──────────────────────────
function goHome() {
  state.answers = {};
  state.scores = { comfort: 0, spicy: 0, sweet: 0, fresh: 0, quick: 0 };
  state.resultBear = null;
  state.topCuisines = [];

  if (state.chartInstance) {
    state.chartInstance.destroy();
    state.chartInstance = null;
  }

  showScreen('welcome');
}

// ── Quiz Screen Builder ───────────────────
function buildQuizScreens() {
  QUIZ_QUESTIONS.forEach((q, index) => {
    const screenId = 'screen-quiz' + (index + 1);
    const container = document.getElementById(screenId);
    if (!container) return;

    const progress = ((index + 1) / QUIZ_QUESTIONS.length) * 100;
    const nextScreen = index < QUIZ_QUESTIONS.length - 1
      ? 'quiz' + (index + 2)
      : 'result';

    container.innerHTML = `
      <div class="quiz-top-bar">
        <button class="btn-home" data-action="home" aria-label="Go back to home screen">🏠 Home</button>
        <div class="progress-bar-wrap" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Quiz progress">
          <div class="progress-bar-fill" style="width: ${progress}%"></div>
        </div>
      </div>

      <h2 class="title-display cream" style="font-size:clamp(1.7rem,6vw,2.2rem); margin-bottom:24px;">
        ${q.question}
      </h2>

      <div class="quiz-options ${q.cols === 1 ? 'single-col' : ''}" role="group" aria-label="${q.question}">
        ${q.options.map(opt => `
          <button
            class="quiz-btn"
            data-answer="${opt.value}"
            data-question="${q.id}"
            data-next="${nextScreen}"
            aria-label="${opt.label}"
          >
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `;

    container.querySelector('[data-action="home"]').addEventListener('click', goHome);

    container.querySelectorAll('.quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.answers[btn.dataset.question] = btn.dataset.answer;

        container.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        setTimeout(() => {
          if (btn.dataset.next === 'result') {
            calculateScores();
            renderResult();
          }

          showScreen(btn.dataset.next);
        }, 200);
      });
    });
  });
}

// ── Render Result Screen ──────────────────
function renderResult() {
  const bear = state.resultBear;

  document.getElementById('result-bear-img').src = bear.img;
  document.getElementById('result-bear-img').alt = bear.alt;
  document.getElementById('result-bear-name').textContent = bear.name;
  document.getElementById('result-bear-desc').textContent = bear.description;

  const list = document.getElementById('cuisine-list');

  list.innerHTML = state.topCuisines.map((c, i) => `
    <div class="cuisine-card" role="listitem">
      <span class="cuisine-num" aria-hidden="true">${i + 1}.</span>
      <div>
        <div class="cuisine-name">${c.name}</div>
        <div class="cuisine-desc">${c.description}</div>
        <span class="tag tag-pink">${c.budget}</span>
        <span class="tag tag-mint">${c.category}</span>
      </div>
    </div>
  `).join('');

  setTimeout(() => drawChart(), 120);
}

// ── Chart.js Bar Chart ────────────────────
function drawChart() {
  const canvas = document.getElementById('tasteChart');
  if (!canvas) return;

  if (state.chartInstance) {
    state.chartInstance.destroy();
    state.chartInstance = null;
  }

  const s = state.scores;

  state.chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Comfort', 'Spicy', 'Sweet', 'Fresh', 'Quick'],
      datasets: [
        {
          label: 'Score',
          data: [s.comfort, s.spicy, s.sweet, s.fresh, s.quick],
          backgroundColor: ['#9b7653', '#ff6b6b', '#ffb5e8', '#b4e7ce', '#ffd4a3'],
          borderColor: ['#7d5f3f', '#e74c3c', '#e880cc', '#7fcfb0', '#f0b86b'],
          borderWidth: 2,
          borderRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            precision: 0,
            font: { family: 'Nunito', weight: '700' }
          }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Nunito', weight: '700' } }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Your Taste Bud Breakdown ♡',
          font: { family: 'Nunito', size: 14, weight: '800' },
          color: '#9b7653',
          padding: { bottom: 12 }
        }
      }
    }
  });
}

// ── Render Explore Screen ─────────────────
function renderExplore() {
  const grid = document.getElementById('explore-grid');

  const categoryInfo = {
    comfort: {
      title: 'Teddy - Cozy Comfort',
      bear: 'assets/brown-bear.png',
      intro: 'warm, filling, familiar picks'
    },
    spicy: {
      title: 'Spice - Spicy Adventure',
      bear: 'assets/spicy-bear.png',
      intro: 'bold, flavorful, exciting picks'
    },
    sweet: {
      title: 'Cherry - Sweet Treat',
      bear: 'assets/pink-cherry-bear.png',
      intro: 'cute, sweet, dessert-y picks'
    },
    fresh: {
      title: 'Rose - Fresh & Light',
      bear: 'assets/green-pinkflower-bear.png',
      intro: 'clean, refreshing, balanced picks'
    },
    quick: {
      title: 'Dasha - Quick Bite',
      bear: 'assets/pink-lemonade-bear.png',
      intro: 'easy, fast, satisfying picks'
    }
  };

  grid.innerHTML = Object.keys(categoryInfo).map(category => {
    const cuisines = state.cuisines.filter(c => c.category === category);
    const info = categoryInfo[category];

    return `
      <section class="explore-category-card" aria-label="${info.title}">
        <div class="explore-category-header">
          <img src="${info.bear}" alt="${info.title} bear" class="explore-bear" />
          <div>
            <h2>${info.title}</h2>
            <p>${info.intro}</p>
          </div>
        </div>

        <div class="cuisine-pill-list">
          ${cuisines.map(c => `
            <article class="cuisine-pill">
              <span class="cuisine-pill-name">${c.name}</span>
              <span class="cuisine-pill-meta">${c.budget} • ${c.diningStyle}</span>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }).join('');
}

// ── Reset Quiz ────────────────────────────
function resetQuiz() {
  state.answers = {};
  state.scores = { comfort: 0, spicy: 0, sweet: 0, fresh: 0, quick: 0 };
  state.resultBear = null;
  state.topCuisines = [];

  if (state.chartInstance) {
    state.chartInstance.destroy();
    state.chartInstance = null;
  }

  showScreen('quiz1');
}

// ── Init ──────────────────────────────────
async function init() {
  try {
    state.cuisines = await loadCuisines();

    buildQuizScreens();
    renderExplore();

    document.getElementById('welcome-click-area').addEventListener('click', () => showScreen('learning1'));
    document.getElementById('btn-start').addEventListener('click', () => showScreen('learning1'));

    document.getElementById('btn-l1-home').addEventListener('click', goHome);
    document.getElementById('btn-l1-next').addEventListener('click', () => showScreen('learning2'));

    document.getElementById('btn-l2-home').addEventListener('click', goHome);
    document.getElementById('btn-l2-back').addEventListener('click', () => showScreen('learning1'));
    document.getElementById('btn-l2-next').addEventListener('click', () => showScreen('learning3'));

    document.getElementById('btn-l3-home').addEventListener('click', goHome);
    document.getElementById('btn-l3-back').addEventListener('click', () => showScreen('learning2'));
    document.getElementById('btn-l3-start').addEventListener('click', () => showScreen('quiz1'));

    document.getElementById('btn-home-result').addEventListener('click', goHome);
    document.getElementById('btn-try-again').addEventListener('click', resetQuiz);

    document.getElementById('btn-explore').addEventListener('click', () => {
      renderExplore();
      showScreen('explore');
    });

    document.getElementById('btn-home-explore').addEventListener('click', goHome);
    document.getElementById('btn-explore-back').addEventListener('click', () => showScreen('result'));

    showScreen('welcome');
  } catch (error) {
    console.error(error);

    document.getElementById('app').innerHTML = `
      <section class="screen active">
        <div class="card">
          <h1 class="title-display" style="font-size:2rem;">Oops!</h1>
          <p class="text-body">
            The cuisine data could not load. Please check that
            <strong>data/cuisines.json</strong> exists and is valid JSON.
          </p>
        </div>
      </section>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
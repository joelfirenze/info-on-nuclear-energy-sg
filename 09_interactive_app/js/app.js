// ============================================================
// app.js — Main Controller: State Management, Nav, onStateChange
// ============================================================

// Global state
const state = {
  growthRate: 2,
  projectionYears: 20,
  industries: {},
  selectedReactors: {},
  underground: false,
  computed: {},
};

// Initialize industry counts
INDUSTRIES.forEach(ind => {
  state.industries[ind.id] = ind.defaultCount;
});

// Navigation
function initNav() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = {
    calculator: document.getElementById('section-calculator'),
    reactors: document.getElementById('section-reactors'),
    land: document.getElementById('section-land'),
    waste: document.getElementById('section-waste'),
    carbon: document.getElementById('section-carbon'),
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.values(sections).forEach(s => s.classList.add('hidden'));
      sections[target].classList.remove('hidden');

      // Trigger update for the visible section to resize charts
      onStateChange();
    });
  });
}

// Central state change handler — cascades updates
function onStateChange() {
  Calculator.calculate(state);
  Calculator.update(state);
  Reactors.calculate(state);
  Reactors.update(state);
  Land.update(state);
  Waste.update(state);
  Carbon.update(state);
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  Calculator.init(state);
  Reactors.init(state);
  Land.init(state);
  Waste.init();
  Carbon.init();
  initNav();

  // Initial calculation
  onStateChange();
});

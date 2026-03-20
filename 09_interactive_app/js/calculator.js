// ============================================================
// calculator.js — Energy Growth Calculator (Section 1)
// ============================================================

const Calculator = (() => {
  let demandChart = null;

  function init(state) {
    renderIndustryCards(state);
    bindSliders(state);
  }

  function renderIndustryCards(state) {
    const grid = document.getElementById('industry-grid');
    grid.innerHTML = INDUSTRIES.map((ind, i) => `
      <div class="industry-card ${state.industries[ind.id] > 0 ? 'active' : ''}"
           data-industry="${ind.id}">
        <span class="industry-icon">${ind.icon}</span>
        <div class="industry-name">${ind.name}</div>
        <div class="industry-range">${ind.minMW}–${ind.maxMW} MW each</div>
        <div class="industry-stepper">
          <button class="stepper-btn" data-action="dec" data-industry="${ind.id}">−</button>
          <span class="stepper-count" id="count-${ind.id}">${state.industries[ind.id] || 0}</span>
          <button class="stepper-btn" data-action="inc" data-industry="${ind.id}">+</button>
        </div>
      </div>
    `).join('');

    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.stepper-btn');
      if (!btn) return;
      const id = btn.dataset.industry;
      const ind = INDUSTRIES.find(x => x.id === id);
      const action = btn.dataset.action;
      let val = state.industries[id] || 0;
      if (action === 'inc' && val < ind.maxCount) val++;
      if (action === 'dec' && val > 0) val--;
      state.industries[id] = val;
      document.getElementById(`count-${id}`).textContent = val;
      const card = btn.closest('.industry-card');
      card.classList.toggle('active', val > 0);
      if (typeof onStateChange === 'function') onStateChange();
    });
  }

  function bindSliders(state) {
    const growthSlider = document.getElementById('growth-rate');
    const yearsSlider = document.getElementById('projection-years');
    const growthLabel = document.getElementById('growth-rate-value');
    const yearsLabel = document.getElementById('projection-years-value');

    growthSlider.value = state.growthRate;
    yearsSlider.value = state.projectionYears;
    growthLabel.textContent = state.growthRate.toFixed(1) + '%';
    yearsLabel.textContent = state.projectionYears + ' years';

    growthSlider.addEventListener('input', () => {
      state.growthRate = parseFloat(growthSlider.value);
      growthLabel.textContent = state.growthRate.toFixed(1) + '%';
      if (typeof onStateChange === 'function') onStateChange();
    });

    yearsSlider.addEventListener('input', () => {
      state.projectionYears = parseInt(yearsSlider.value);
      yearsLabel.textContent = state.projectionYears + ' years';
      if (typeof onStateChange === 'function') onStateChange();
    });
  }

  function calculate(state) {
    const years = [];
    const baselineDemand = [];
    const industryDemands = {};

    INDUSTRIES.forEach(ind => {
      industryDemands[ind.id] = [];
    });

    for (let y = 0; y <= state.projectionYears; y++) {
      years.push(2025 + y);
      const base = SG_BASELINE.peakDemandMW * Math.pow(1 + state.growthRate / 100, y);
      baselineDemand.push(Math.round(base));

      INDUSTRIES.forEach(ind => {
        const count = state.industries[ind.id] || 0;
        // Phase in over first 5 years
        const phaseIn = Math.min(y / 5, 1);
        const avgMW = (ind.minMW + ind.maxMW) / 2;
        industryDemands[ind.id].push(Math.round(count * avgMW * phaseIn));
      });
    }

    // Final year totals
    const finalYear = state.projectionYears;
    const finalBaseline = baselineDemand[finalYear];
    let finalIndustryTotal = 0;
    INDUSTRIES.forEach(ind => {
      finalIndustryTotal += industryDemands[ind.id][finalYear];
    });

    state.computed = state.computed || {};
    state.computed.totalDemandMW = finalBaseline + finalIndustryTotal;
    state.computed.baselineDemandMW = finalBaseline;
    state.computed.industryDemandMW = finalIndustryTotal;
    state.computed.years = years;
    state.computed.baselineDemand = baselineDemand;
    state.computed.industryDemands = industryDemands;
    state.computed.totalDemandTWh = Math.round(state.computed.totalDemandMW * 8.76 * CAPACITY_FACTOR / 1000 * 10) / 10;

    return state.computed;
  }

  function updateSummary(state) {
    const c = state.computed;
    const el = document.getElementById('demand-summary');
    const nuclearMW = c.totalDemandMW - SG_BASELINE.peakDemandMW;
    el.innerHTML = `
      <div class="summary-item">
        <span class="summary-value blue">${formatNum(c.totalDemandMW)}</span>
        <span class="summary-label">Total Demand (MW)</span>
      </div>
      <div class="summary-item">
        <span class="summary-value amber">${formatNum(c.baselineDemandMW)}</span>
        <span class="summary-label">Baseline Growth (MW)</span>
      </div>
      <div class="summary-item">
        <span class="summary-value green">${formatNum(c.industryDemandMW)}</span>
        <span class="summary-label">New Industry (MW)</span>
      </div>
      <div class="summary-item">
        <span class="summary-value purple">${c.totalDemandTWh}</span>
        <span class="summary-label">TWh / year</span>
      </div>
      <div class="summary-item">
        <span class="summary-value amber">${formatNum(nuclearMW > 0 ? nuclearMW : 0)}</span>
        <span class="summary-label">New Capacity Needed (MW)</span>
      </div>
    `;
  }

  function updateChart(state) {
    const c = state.computed;
    const ctx = document.getElementById('demand-chart').getContext('2d');

    const datasets = [
      {
        label: 'Baseline Demand',
        data: c.baselineDemand,
        backgroundColor: 'rgba(100,116,139,0.4)',
        borderColor: '#64748b',
        fill: true,
        order: 10,
      },
    ];

    INDUSTRIES.forEach((ind, i) => {
      const d = c.industryDemands[ind.id];
      if (d.some(v => v > 0)) {
        datasets.push({
          label: ind.name,
          data: d,
          backgroundColor: INDUSTRY_COLORS[i] + '66',
          borderColor: INDUSTRY_COLORS[i],
          fill: true,
          order: 9 - i,
        });
      }
    });

    if (demandChart) {
      demandChart.data.labels = c.years;
      demandChart.data.datasets = datasets;
      demandChart.options.scales.y.stacked = true;
      demandChart.update('none');
    } else {
      demandChart = new Chart(ctx, {
        type: 'line',
        data: { labels: c.years, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } },
            tooltip: {
              callbacks: {
                label: (item) => `${item.dataset.label}: ${formatNum(item.raw)} MW`
              }
            },
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              stacked: true,
              title: { display: true, text: 'Peak Demand (MW)' },
              ticks: { callback: v => formatNum(v) },
            },
          },
        },
      });
    }
  }

  function update(state) {
    calculate(state);
    updateSummary(state);
    updateChart(state);
  }

  return { init, update, calculate };
})();

function formatNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + 'k';
  return Math.round(n).toLocaleString();
}

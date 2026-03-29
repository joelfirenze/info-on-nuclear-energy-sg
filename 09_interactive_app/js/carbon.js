// ============================================================
// carbon.js — Carbon Sequestration Module (Section 5)
// ============================================================

const Carbon = (() => {
  let carbonChart = null;

  function init() {}

  function update(state) {
    const c = state.computed;

    // Nuclear replaces gas → displaced emissions
    const nuclearMW = c.nuclearCapacityMW || 0;
    const nuclearTWh = nuclearMW * 8.76 * CAPACITY_FACTOR / 1000;
    const displacedCO2Mt = nuclearTWh * SG_BASELINE.gasEmissionFactor; // MWh * tCO2/MWh → Mt

    // DAC capture
    const dacCount = state.industries['direct-air-capture'] || 0;
    const dacCO2Mt = dacCount * 1; // 1 MtCO2/year each

    // DAC power check
    const dacInd = INDUSTRIES.find(x => x.id === 'direct-air-capture');
    const dacPowerMW = dacCount * ((dacInd.minMW + dacInd.maxMW) / 2);
    const powerSufficient = nuclearMW >= dacPowerMW;

    const currentCO2 = SG_BASELINE.annualCO2Mt;
    const remainingCO2 = currentCO2 - displacedCO2Mt - dacCO2Mt;
    const isNegative = remainingCO2 < 0;

    c.displacedCO2Mt = displacedCO2Mt;
    c.dacCO2Mt = dacCO2Mt;
    c.remainingCO2 = remainingCO2;
    c.isNegative = isNegative;

    renderDashboard(c, dacCount, powerSufficient, currentCO2, displacedCO2Mt, dacCO2Mt, remainingCO2, isNegative);
    updateCarbonChart(currentCO2, displacedCO2Mt, dacCO2Mt, remainingCO2, isNegative);
  }

  function renderDashboard(c, dacCount, powerSufficient, currentCO2, displaced, dac, remaining, isNegative) {
    const el = document.getElementById('carbon-dashboard');
    el.innerHTML = `
      <div class="carbon-stat-card">
        <span class="carbon-stat-value red">${currentCO2}</span>
        <span class="carbon-stat-label">Current Annual CO₂ (Mt)</span>
      </div>
      <div class="carbon-stat-card">
        <span class="carbon-stat-value blue">−${displaced.toFixed(1)}</span>
        <span class="carbon-stat-label">Displaced by Nuclear (Mt)</span>
      </div>
      <div class="carbon-stat-card">
        <span class="carbon-stat-value green">−${dac.toFixed(1)}</span>
        <span class="carbon-stat-label">Removed by DAC (Mt) — ${dacCount} units</span>
      </div>
      <div class="carbon-stat-card ${isNegative ? 'negative' : ''}">
        <span class="carbon-stat-value ${isNegative ? 'green' : 'red'}">${remaining.toFixed(1)}</span>
        <span class="carbon-stat-label">${isNegative ? 'Carbon Negative!' : 'Remaining CO₂ (Mt)'}</span>
      </div>
      ${!powerSufficient && dacCount > 0 ? `
        <div class="carbon-stat-card" style="grid-column:1/-1;border-color:var(--amber);background:#fffbeb;">
          <span class="carbon-stat-value amber">⚠</span>
          <span class="carbon-stat-label">Warning: Not enough nuclear capacity to power all ${dacCount} DAC units.
            DAC needs ${formatNum(dacCount * 375)} MW but nuclear provides ${formatNum(c.nuclearCapacityMW || 0)} MW.</span>
        </div>
      ` : ''}
    `;
  }

  function updateCarbonChart(current, displaced, dac, remaining, isNegative) {
    const ctx = document.getElementById('carbon-chart').getContext('2d');

    const data = {
      labels: ['Current Emissions', 'After Nuclear', 'After Nuclear + DAC'],
      datasets: [{
        label: 'CO₂ Emissions (Mt/year)',
        data: [
          current,
          Math.max(0, current - displaced),
          Math.max(0, remaining),
        ],
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          isNegative ? '#10b981' : '#f59e0b',
        ],
        borderRadius: 6,
        barThickness: 50,
      }],
    };

    if (isNegative) {
      data.labels.push('Carbon Removed (Net)');
      data.datasets[0].data.push(Math.abs(remaining));
      data.datasets[0].backgroundColor.push('#10b981');
    }

    if (carbonChart) {
      carbonChart.data = data;
      carbonChart.update('none');
    } else {
      carbonChart = new Chart(ctx, {
        type: 'bar',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (item) => `${item.raw.toFixed(1)} MtCO₂/year`,
              }
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'MtCO₂ per year' },
              beginAtZero: true,
            },
            y: {
              grid: { display: false },
            },
          },
        },
      });
    }
  }

  return { init, update };
})();

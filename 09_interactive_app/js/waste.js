// ============================================================
// waste.js — Waste Volume + Decay Timeline Visualizer (Section 4)
// ============================================================

const Waste = (() => {
  let decayChart = null;

  function init() {}

  function update(state) {
    const c = state.computed;
    renderCubes(c);
    renderCaskCounter(c);
    updateDecayChart(c);
  }

  function renderCubes(c) {
    const el = document.getElementById('waste-cubes');
    const fissionM3 = c.fissionWasteM3 || 0;
    const fusionM3 = c.fusionWasteM3 || 0;

    // Cube side length from volume (m³) — scale for display
    const fissionSide = Math.cbrt(fissionM3);
    const fusionSide = Math.cbrt(fusionM3);
    const maxSide = Math.max(fissionSide, fusionSide, 0.5);

    // Map to max 160px display
    const maxPx = 160;
    const fPx = Math.max(20, (fissionSide / maxSide) * maxPx);
    const fuPx = fusionM3 > 0 ? Math.max(20, (fusionSide / maxSide) * maxPx) : 0;

    el.innerHTML = `
      <div class="waste-cube-block">
        <div class="waste-cube-title" style="color:var(--amber)">Fission High-Level Waste</div>
        ${fissionM3 > 0 ? renderCube3D(fPx, 'var(--amber)', 'var(--amber-light)') : '<p style="color:var(--slate)">No fission reactors selected</p>'}
        <div class="waste-stats">
          <strong>${fissionM3.toFixed(1)} m³/year</strong> &bull; Hazard: 100,000+ years
          <br>Cube side: ${fissionSide.toFixed(2)} m
        </div>
      </div>

      <div class="waste-cube-block">
        <div class="waste-cube-title" style="color:var(--purple)">Fusion Activated Materials</div>
        ${fusionM3 > 0 ? renderCube3D(fuPx, 'var(--purple)', 'var(--purple-light)') : '<p style="color:var(--slate)">No fusion reactors selected</p>'}
        <div class="waste-stats">
          <strong>${fusionM3.toFixed(1)} m³/year</strong> &bull; Hazard: ~100 years
          <br>${fusionM3 > 0 ? 'Cube side: ' + fusionSide.toFixed(2) + ' m' : 'No spent fuel'}
        </div>
      </div>
    `;

    if (fissionM3 > 0 && fusionM3 > 0) {
      const ratio = fissionM3 / fusionM3;
      el.innerHTML += `
        <div style="grid-column:1/-1;text-align:center;padding:12px;background:var(--gray-100);border-radius:8px;">
          Fission produces <strong style="color:var(--amber)">${ratio.toFixed(1)}×</strong> more waste volume,
          with <strong style="color:var(--red)">${(100000 / 100).toLocaleString()}×</strong> longer hazard period
        </div>
      `;
    }
  }

  function renderCube3D(sizePx, colorDark, colorLight) {
    const half = sizePx / 2;
    return `
      <div class="cube-scene" style="width:${sizePx + 40}px;height:${sizePx + 40}px;">
        <div class="cube" style="width:${sizePx}px;height:${sizePx}px;">
          <div class="cube-face front" style="
            width:${sizePx}px;height:${sizePx}px;
            background:${colorDark};opacity:0.9;
            transform: translateZ(${half}px);
          "></div>
          <div class="cube-face back" style="
            width:${sizePx}px;height:${sizePx}px;
            background:${colorDark};opacity:0.7;
            transform: rotateY(180deg) translateZ(${half}px);
          "></div>
          <div class="cube-face right" style="
            width:${sizePx}px;height:${sizePx}px;
            background:${colorLight};opacity:0.8;
            transform: rotateY(90deg) translateZ(${half}px);
          "></div>
          <div class="cube-face left" style="
            width:${sizePx}px;height:${sizePx}px;
            background:${colorLight};opacity:0.6;
            transform: rotateY(-90deg) translateZ(${half}px);
          "></div>
          <div class="cube-face top" style="
            width:${sizePx}px;height:${sizePx}px;
            background:${colorLight};opacity:0.95;
            transform: rotateX(90deg) translateZ(${half}px);
          "></div>
          <div class="cube-face bottom" style="
            width:${sizePx}px;height:${sizePx}px;
            background:${colorDark};opacity:0.5;
            transform: rotateX(-90deg) translateZ(${half}px);
          "></div>
        </div>
      </div>
    `;
  }

  function renderCaskCounter(c) {
    const el = document.getElementById('cask-counter');
    const fissionM3 = c.fissionWasteM3 || 0;
    // Dry cask ~3m³ capacity (vitrified HLW)
    const caskCount = Math.ceil(fissionM3 / 3);

    if (caskCount <= 0) {
      el.innerHTML = '<p class="cask-counter-title">Dry Cask Storage</p><p style="color:var(--slate)">No fission waste to store.</p>';
      return;
    }

    const displayCount = Math.min(caskCount, 50);
    let icons = '';
    for (let i = 0; i < displayCount; i++) {
      icons += '<div class="cask-icon">☢</div>';
    }
    if (caskCount > 50) {
      icons += `<div style="display:flex;align-items:center;padding:0 8px;font-weight:700;color:var(--slate);">+${caskCount - 50} more</div>`;
    }

    el.innerHTML = `
      <div class="cask-counter-title">Dry Cask Storage — ${caskCount} casks/year (≈3 m³ each)</div>
      <div class="cask-icons">${icons}</div>
    `;
  }

  function updateDecayChart(c) {
    const ctx = document.getElementById('decay-chart').getContext('2d');
    const hasFission = (c.fissionWasteM3 || 0) > 0;
    const hasFusion = (c.fusionWasteM3 || 0) > 0;

    // Logarithmic time points
    const timePoints = [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];

    const datasets = [];

    if (hasFission) {
      // Simplified decay: activity proportional to t^(-0.3) for fission products
      const initial = 100;
      datasets.push({
        label: 'Fission (HLW)',
        data: timePoints.map(t => initial * Math.pow(t, -0.3)),
        borderColor: COLORS.amber,
        backgroundColor: COLORS.amber + '22',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      });
    }

    if (hasFusion) {
      // Fusion activation decays much faster, negligible after ~100 years
      const initial = 40;
      datasets.push({
        label: 'Fusion (activated materials)',
        data: timePoints.map(t => t <= 100 ? initial * Math.pow(t, -0.5) : 0.01),
        borderColor: COLORS.purple,
        backgroundColor: COLORS.purple + '22',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      });
    }

    if (datasets.length === 0) {
      datasets.push({
        label: 'No waste data',
        data: timePoints.map(() => 0),
        borderColor: '#ccc',
      });
    }

    // Natural background radiation line
    datasets.push({
      label: 'Natural background level',
      data: timePoints.map(() => 0.5),
      borderColor: '#10b981',
      borderDash: [6, 4],
      pointRadius: 0,
      fill: false,
    });

    if (decayChart) {
      decayChart.data.labels = timePoints.map(t => t >= 1000 ? (t/1000) + 'k' : t);
      decayChart.data.datasets = datasets;
      decayChart.update('none');
    } else {
      decayChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timePoints.map(t => t >= 1000 ? (t/1000) + 'k' : t),
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } },
            tooltip: {
              callbacks: {
                title: (items) => items[0].label + ' years',
                label: (item) => `${item.dataset.label}: ${item.raw.toFixed(2)}% of initial`,
              }
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'Years After Removal' },
              grid: { display: false },
            },
            y: {
              type: 'logarithmic',
              title: { display: true, text: 'Relative Radioactivity (%)' },
              min: 0.01,
              max: 120,
            },
          },
        },
      });
    }
  }

  return { init, update };
})();

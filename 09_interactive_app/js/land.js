// ============================================================
// land.js — Land Footprint Visualizer (Section 3)
// ============================================================

const Land = (() => {

  function init(state) {
    document.getElementById('underground-toggle').addEventListener('change', (e) => {
      state.underground = e.target.checked;
      if (typeof onStateChange === 'function') onStateChange();
    });
  }

  function update(state) {
    const c = state.computed;
    const nuclearHa = c.totalFootprintHa || 0;
    const effectiveNuclearHa = state.underground ? nuclearHa * UNDERGROUND_SURFACE_FRACTION : nuclearHa;

    // Gas equivalent footprint
    const totalGW = (c.nuclearCapacityMW || 0) / 1000;
    const gasHa = totalGW * GAS_PLANT_FOOTPRINT_HA_PER_GW * GAS_INFRA_MULTIPLIER;

    renderComparison(effectiveNuclearHa, gasHa, state.underground, nuclearHa);
    renderLandmarks(effectiveNuclearHa);
  }

  function renderComparison(nuclearHa, gasHa, underground, fullNuclearHa) {
    const el = document.getElementById('land-comparison');
    const maxHa = Math.max(nuclearHa, gasHa, 1);

    // Scale: max rect = 220px side
    const maxPx = 220;
    const nuclearPx = Math.max(30, Math.sqrt(nuclearHa / maxHa) * maxPx);
    const gasPx = Math.max(30, Math.sqrt(gasHa / maxHa) * maxPx);

    el.innerHTML = `
      <div class="land-block">
        <div class="land-block-title" style="color:var(--green)">Nuclear Footprint</div>
        <div class="land-rect-container">
          <div class="land-rect" style="
            width:${nuclearPx}px; height:${nuclearPx}px;
            background: linear-gradient(135deg, var(--green), var(--green-light));
          ">
            <span class="land-rect-label">${nuclearHa.toFixed(1)} ha</span>
            <span class="land-rect-sublabel">${underground ? '(surface only — 30%)' : ''}</span>
          </div>
        </div>
        ${underground ? `<p style="font-size:0.8rem;color:var(--slate);margin-top:8px;">
          Full footprint: ${fullNuclearHa.toFixed(1)} ha (underground)</p>` : ''}
      </div>

      <div class="land-block">
        <div class="land-block-title" style="color:var(--red)">Equivalent Gas + LNG Infrastructure</div>
        <div class="land-rect-container">
          <div class="land-rect" style="
            width:${gasPx}px; height:${gasPx}px;
            background: linear-gradient(135deg, var(--red), var(--red-light));
          ">
            <span class="land-rect-label">${gasHa.toFixed(1)} ha</span>
            <span class="land-rect-sublabel">incl. LNG terminal (${GAS_INFRA_MULTIPLIER}× multiplier)</span>
          </div>
        </div>
      </div>
    `;

    if (gasHa > 0 && nuclearHa > 0) {
      const ratio = gasHa / nuclearHa;
      el.innerHTML += `
        <div style="grid-column:1/-1;text-align:center;padding:12px;background:var(--gray-100);border-radius:8px;margin-top:8px;">
          <strong style="font-size:1.1rem;color:var(--green);">Nuclear uses ${ratio.toFixed(1)}× less land</strong>
          than equivalent gas infrastructure
        </div>
      `;
    }
  }

  function renderLandmarks(nuclearHa) {
    const el = document.getElementById('landmark-comparisons');
    if (nuclearHa <= 0) {
      el.innerHTML = '<p style="color:var(--slate);padding:16px;">Add reactors to see landmark comparisons.</p>';
      return;
    }

    el.innerHTML = LANDMARKS.map(lm => {
      const pct = (nuclearHa / lm.areaHa * 100);
      const times = nuclearHa / lm.areaHa;
      let display;
      if (pct < 1) {
        display = `${pct.toFixed(2)}%`;
      } else if (times >= 1) {
        display = `${times.toFixed(1)}×`;
      } else {
        display = `${pct.toFixed(1)}%`;
      }
      return `
        <div class="landmark-card">
          <div class="landmark-value">${display}</div>
          <div class="landmark-name">of ${lm.name}</div>
        </div>
      `;
    }).join('');
  }

  return { init, update };
})();

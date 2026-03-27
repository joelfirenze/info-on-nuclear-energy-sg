// ============================================================
// reactors.js — Reactor Technology Selector (Section 2)
// ============================================================

const Reactors = (() => {

  function init(state) {
    renderCategories(state);
  }

  function renderCategories(state) {
    const container = document.getElementById('reactor-categories');
    container.innerHTML = REACTOR_CATEGORIES.map(cat => {
      const reactors = REACTORS.filter(r => r.category === cat.id);
      return `
        <div class="reactor-category">
          <span class="category-header" style="background:${cat.colorLight}; color:${cat.color}">
            ${cat.name}
          </span>
          <div class="reactor-cards">
            ${reactors.map(r => `
              <div class="reactor-card ${state.selectedReactors[r.id] ? 'selected' : ''}"
                   data-reactor="${r.id}">
                <div class="reactor-card-header">
                  <div>
                    <div class="reactor-card-name">${r.name}</div>
                    <div class="reactor-card-power">${r.mwe} MWe</div>
                  </div>
                  <button class="reactor-info-btn" data-info-toggle="${r.id}" title="Technology profile">ℹ</button>
                </div>
                <div class="reactor-card-desc">${r.description}</div>
                <span class="reactor-card-type type-${r.type}">${r.type}</span>
                <div class="reactor-share-row">
                  <input type="range" min="0" max="100" step="5"
                    value="${state.selectedReactors[r.id] || 0}"
                    data-reactor-share="${r.id}">
                  <span class="share-value" id="share-${r.id}">${state.selectedReactors[r.id] || 0}%</span>
                </div>
                ${r.profile ? `
                <div class="reactor-profile" id="profile-${r.id}">
                  <div class="profile-section">
                    <h4>Technology Overview</h4>
                    <p>${r.profile.overview}</p>
                  </div>
                  <div class="profile-section">
                    <h4>Safety Characteristics</h4>
                    <ul>${r.profile.safety.map(s => `<li>${s}</li>`).join('')}</ul>
                  </div>
                  <div class="profile-section profile-waste">
                    <h4>☢ Waste Profile</h4>
                    <p>${r.profile.wasteProfile}</p>
                    <div class="profile-waste-stats">
                      <span class="waste-stat"><strong>${r.wasteM3PerGWYear}</strong> m³/GW·yr</span>
                      <span class="waste-stat"><strong>${r.decayYears >= 1000 ? (r.decayYears / 1000) + 'k' : r.decayYears}</strong> yr decay</span>
                    </div>
                  </div>
                  <a class="profile-safety-link" href="../10_safety_education/index.html${r.profile.safetyLink.hash}" target="_blank">
                    ${r.profile.safetyLink.text} →
                  </a>
                </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Bind info toggle
    container.addEventListener('click', (e) => {
      const infoBtn = e.target.closest('[data-info-toggle]');
      if (!infoBtn) return;
      e.stopPropagation();
      const id = infoBtn.dataset.infoToggle;
      const profile = document.getElementById('profile-' + id);
      if (profile) {
        profile.classList.toggle('open');
        infoBtn.classList.toggle('active');
      }
    });

    // Bind click to toggle selection
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.reactor-card');
      if (!card || e.target.closest('.reactor-share-row') || e.target.closest('[data-info-toggle]')) return;
      const id = card.dataset.reactor;
      if (state.selectedReactors[id]) {
        delete state.selectedReactors[id];
        card.classList.remove('selected');
      } else {
        state.selectedReactors[id] = 25; // default share
        card.classList.add('selected');
        const slider = card.querySelector(`[data-reactor-share="${id}"]`);
        if (slider) slider.value = 25;
        const label = document.getElementById(`share-${id}`);
        if (label) label.textContent = '25%';
      }
      normalizeShares(state);
      if (typeof onStateChange === 'function') onStateChange();
    });

    // Bind share sliders
    container.addEventListener('input', (e) => {
      const slider = e.target.closest('[data-reactor-share]');
      if (!slider) return;
      const id = slider.dataset.reactorShare;
      state.selectedReactors[id] = parseInt(slider.value);
      document.getElementById(`share-${id}`).textContent = slider.value + '%';
      if (typeof onStateChange === 'function') onStateChange();
    });
  }

  function normalizeShares(state) {
    const ids = Object.keys(state.selectedReactors);
    if (ids.length === 0) return;
    const equalShare = Math.round(100 / ids.length);
    ids.forEach((id, i) => {
      const share = i === ids.length - 1 ? 100 - equalShare * (ids.length - 1) : equalShare;
      state.selectedReactors[id] = share;
      const slider = document.querySelector(`[data-reactor-share="${id}"]`);
      if (slider) slider.value = share;
      const label = document.getElementById(`share-${id}`);
      if (label) label.textContent = share + '%';
    });
  }

  function calculate(state) {
    const totalDemand = (state.computed && state.computed.totalDemandMW) || SG_BASELINE.peakDemandMW;
    const newCapacity = Math.max(0, totalDemand - SG_BASELINE.peakDemandMW);

    const ids = Object.keys(state.selectedReactors);
    const totalShareRaw = ids.reduce((s, id) => s + (state.selectedReactors[id] || 0), 0);
    const totalShare = totalShareRaw || 1;

    const reactorResults = [];
    let totalReactors = 0;
    let totalFootprintHa = 0;
    let totalWasteM3 = 0;
    let weightedDecayYears = 0;
    let fissionMW = 0;
    let fusionMW = 0;
    let fissionWasteM3 = 0;
    let fusionWasteM3 = 0;

    ids.forEach(id => {
      const r = REACTORS.find(x => x.id === id);
      if (!r) return;
      const share = (state.selectedReactors[id] || 0) / totalShare;
      const mwNeeded = newCapacity * share;
      const count = Math.ceil(mwNeeded / r.mwe) || 0;
      const actualMW = count * r.mwe;
      const gw = actualMW / 1000;
      const wasteM3 = r.wasteM3PerGWYear * gw;
      const footprint = count * r.footprintHa;

      reactorResults.push({ ...r, count, actualMW, wasteM3, footprint, share: state.selectedReactors[id] });

      totalReactors += count;
      totalFootprintHa += footprint;
      totalWasteM3 += wasteM3;
      weightedDecayYears += r.decayYears * share;

      if (r.type === 'fission') {
        fissionMW += actualMW;
        fissionWasteM3 += wasteM3;
      } else {
        fusionMW += actualMW;
        fusionWasteM3 += wasteM3;
      }
    });

    state.computed.reactorResults = reactorResults;
    state.computed.totalReactors = totalReactors;
    state.computed.totalFootprintHa = totalFootprintHa;
    state.computed.totalWasteM3PerYear = totalWasteM3;
    state.computed.fissionWasteM3 = fissionWasteM3;
    state.computed.fusionWasteM3 = fusionWasteM3;
    state.computed.fissionMW = fissionMW;
    state.computed.fusionMW = fusionMW;
    state.computed.newCapacityMW = newCapacity;
    state.computed.nuclearCapacityMW = fissionMW + fusionMW;
  }

  function updateSummary(state) {
    const c = state.computed;
    const el = document.getElementById('reactor-summary');
    const ids = Object.keys(state.selectedReactors);

    if (ids.length === 0) {
      el.innerHTML = `<div class="summary-item"><span class="summary-value amber">—</span>
        <span class="summary-label">Select reactors above</span></div>`;
      return;
    }

    el.innerHTML = `
      <div class="summary-item">
        <span class="summary-value green">${c.totalReactors}</span>
        <span class="summary-label">Total Reactors</span>
      </div>
      <div class="summary-item">
        <span class="summary-value blue">${formatNum(c.nuclearCapacityMW)}</span>
        <span class="summary-label">Nuclear Capacity (MW)</span>
      </div>
      <div class="summary-item">
        <span class="summary-value amber">${formatNum(c.newCapacityMW)}</span>
        <span class="summary-label">Demand to Meet (MW)</span>
      </div>
      <div class="summary-item">
        <span class="summary-value purple">${c.totalFootprintHa.toFixed(1)} ha</span>
        <span class="summary-label">Total Footprint</span>
      </div>
    `;
  }

  function updatePictograph(state) {
    const el = document.getElementById('reactor-pictograph');
    const results = state.computed.reactorResults || [];

    if (results.length === 0) {
      el.innerHTML = '<p style="color:var(--slate);padding:8px;">Select reactor types above to see the pictograph.</p>';
      return;
    }

    let html = '';
    results.forEach(r => {
      const cat = REACTOR_CATEGORIES.find(c => c.id === r.category);
      const color = cat ? cat.color : '#64748b';
      const displayCount = Math.min(r.count, 100); // cap display
      for (let i = 0; i < displayCount; i++) {
        html += `<div class="reactor-icon-unit" style="background:${color}" title="${r.name}">
          ${r.type === 'fusion' ? '⚡' : '⚛'}
        </div>`;
      }
    });

    el.innerHTML = html || '<p style="color:var(--slate);padding:8px;">No reactors needed.</p>';
  }

  function update(state) {
    calculate(state);
    updateSummary(state);
    updatePictograph(state);
  }

  return { init, update, calculate };
})();

/**
 * BodyMind OS — Dashboard Module
 * Revenue overview, stats, quick actions
 */
(function() {
  'use strict';

  function renderDashboard(container) {
    const state = window.BM.state.loadState();
    const stats = window.BM.state.getStats();
    const tier = window.BM.state.getLicenseTier();
    const isPro = tier !== 'free';

    container.innerHTML = `
      ${!isPro ? `
        <div class="upgrade-banner">
          <div>
            <strong>Upgrade to Pro</strong> — Get intake forms, SOAP notes, CE tracking, and unlimited clients.
          </div>
          <a href="../#pricing" class="btn btn-accent btn-sm">Upgrade →</a>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-header">
          <div>
            <div class="page-title">Dashboard</div>
            <div class="card-subtitle">${state.settings.name ? escapeHtml(state.settings.name) + "'s" : 'Your'} Practice Overview</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">$${stats.revenue.toLocaleString()}</div>
            <div class="stat-label">Revenue (This Month)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.completedSessions}</div>
            <div class="stat-label">Sessions (This Month)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.activeClients}</div>
            <div class="stat-label">Active Clients</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.noShowRate}%</div>
            <div class="stat-label">No-Show Rate</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Quick Actions</div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px;">
          <button class="btn btn-ghost" onclick="window.BM.app.navigateTo('calendar')" style="padding:16px; flex-direction:column; gap:4px;">
            <span style="font-size:20px;">📅</span>
            <span>New Booking</span>
          </button>
          <button class="btn btn-ghost" onclick="window.BM.app.navigateTo('clients')" style="padding:16px; flex-direction:column; gap:4px;">
            <span style="font-size:20px;">👥</span>
            <span>Add Client</span>
          </button>
          <button class="btn btn-ghost" onclick="window.BM.app.navigateTo('notes')" style="padding:16px; flex-direction:column; gap:4px;">
            <span style="font-size:20px;">📝</span>
            <span>Session Notes</span>
          </button>
          ${isPro ? `
            <button class="btn btn-ghost" onclick="window.BM.app.navigateTo('ce')" style="padding:16px; flex-direction:column; gap:4px;">
              <span style="font-size:20px;">🎓</span>
              <span>Log CE Hours</span>
            </button>
          ` : ''}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Session Types</div>
        </div>
        ${state.settings.sessionTypes.map(t => `
          <div class="client-item">
            <div style="flex:1;">
              <div class="client-name">${escapeHtml(t.name)}</div>
              <div class="client-meta">${t.duration} minutes</div>
            </div>
            <div style="font-weight:600; color:var(--primary);">$${t.price}</div>
          </div>
        `).join('')}
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Settings</div>
        </div>
        <div class="form-group">
          <label>Your Name / Business Name</label>
          <input type="text" id="setting-name" value="${escapeAttr(state.settings.name)}" placeholder="Your name or business name">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>License Number</label>
            <input type="text" id="setting-license" value="${escapeAttr(state.settings.licenseNumber)}" placeholder="LMT-12345">
          </div>
          <div class="form-group">
            <label>State</label>
            <select id="setting-state">
              <option value="">Select state...</option>
              ${['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s =>
                `<option value="${s}" ${state.settings.state === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Work Start</label>
            <input type="time" id="setting-workstart" value="${escapeAttr(state.settings.workStart)}">
          </div>
          <div class="form-group">
            <label>Work End</label>
            <input type="time" id="setting-workend" value="${escapeAttr(state.settings.workEnd)}">
          </div>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-save-settings">Save Settings</button>
      </div>
    `;

    // Settings save
    document.getElementById('btn-save-settings').addEventListener('click', () => {
      const updates = {
        name: document.getElementById('setting-name').value.trim(),
        licenseNumber: document.getElementById('setting-license').value.trim(),
        state: document.getElementById('setting-state').value,
        workStart: document.getElementById('setting-workstart').value,
        workEnd: document.getElementById('setting-workend').value
      };
      window.BM.state.updateSettings(updates);
      toast('Settings saved');
      renderDashboard(container);
    });
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.dashboard = {
    renderDashboard
  };
})();

/**
 * BodyMind OS — CE Tracker Module (Pro Feature)
 * Continuing education compliance tracking
 */
(function() {
  'use strict';

  // State CE requirements (simplified — common requirements)
  const STATE_CE_REQUIREMENTS = {
    'NY': { hours: 36, periodYears: 3, deadline: '2027-01-01' },
    'CA': { hours: 25, periodYears: 2, deadline: '2028-06-30' },
    'TX': { hours: 20, periodYears: 2, deadline: '2028-12-31' },
    'FL': { hours: 24, periodYears: 2, deadline: '2027-11-30' },
    'IL': { hours: 24, periodYears: 2, deadline: '2028-09-30' },
    'PA': { hours: 24, periodYears: 2, deadline: '2028-12-31' },
    'OH': { hours: 24, periodYears: 2, deadline: '2028-12-31' },
    'GA': { hours: 25, periodYears: 2, deadline: '2028-03-31' },
    'NC': { hours: 25, periodYears: 2, deadline: '2028-02-28' },
    'MI': { hours: 24, periodYears: 2, deadline: '2028-10-31' },
    'DEFAULT': { hours: 24, periodYears: 2, deadline: null }
  };

  function renderCETracker(container) {
    const state = window.BM.state.loadState();
    const ceStats = window.BM.state.getCEStats();
    const settings = state.settings;
    const userState = settings.state || 'DEFAULT';
    const requirement = STATE_CE_REQUIREMENTS[userState] || STATE_CE_REQUIREMENTS['DEFAULT'];

    const progress = Math.min(100, Math.round((ceStats.total / requirement.hours) * 100));
    const remaining = Math.max(0, requirement.hours - ceStats.total);

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="page-title">CE Compliance</div>
            <div class="card-subtitle">${userState !== 'DEFAULT' ? userState + ' State Requirements' : 'Set your state in settings'}</div>
          </div>
          <button class="btn btn-sm btn-primary" id="btn-add-ce">+ Log Hours</button>
        </div>

        <div style="margin-bottom:20px;">
          <div class="ce-stat">
            <span>${ceStats.total} / ${requirement.hours} hours completed</span>
            <span>${progress}%</span>
          </div>
          <div class="ce-progress">
            <div class="ce-progress-bar" style="width: ${progress}%;"></div>
          </div>
          <div class="ce-stat" style="margin-top:4px;">
            <span>${remaining > 0 ? remaining + ' hours remaining' : '✓ Requirement met!'}</span>
            ${requirement.deadline ? '<span>Deadline: ' + formatDate(requirement.deadline) + '</span>' : ''}
          </div>
        </div>

        <h4 style="font-size:14px; font-weight:600; margin-bottom:12px;">Recent Entries</h4>
        <div id="ce-entries-list"></div>
      </div>

      <!-- Add CE Modal -->
      <div id="ce-modal" class="hidden" style="position:fixed; inset:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:300; padding:20px;">
        <div style="background:var(--bg-card); border-radius:var(--radius); padding:24px; max-width:400px; width:100%;">
          <h3 style="margin-bottom:16px;">Log CE Hours</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input type="date" id="ce-date" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label>Hours</label>
              <input type="number" id="ce-hours" min="0.5" max="12" step="0.5" value="2">
            </div>
          </div>
          <div class="form-group">
            <label>Topic / Course Title</label>
            <input type="text" id="ce-topic" placeholder="Deep Tissue Techniques Update">
          </div>
          <div class="form-group">
            <label>Provider</label>
            <input type="text" id="ce-provider" placeholder="ABMP, NCBTMB, etc.">
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:20px;">
            <button class="btn btn-ghost btn-sm" id="btn-cancel-ce">Cancel</button>
            <button class="btn btn-primary btn-sm" id="btn-save-ce">Log Hours</button>
          </div>
        </div>
      </div>
    `;

    // Render entries
    const listEl = document.getElementById('ce-entries-list');
    const entries = [...state.ceEntries].sort((a, b) => b.date.localeCompare(a.date));

    if (entries.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎓</div>
          <p>No CE hours logged yet. Start tracking to stay compliant.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = entries.slice(0, 20).map(e => `
        <div class="client-item">
          <div style="flex:1;">
            <div class="client-name">${escapeHtml(e.topic || 'Untitled')}</div>
            <div class="client-meta">${formatDate(e.date)} · ${e.hours}h${e.provider ? ' · ' + escapeHtml(e.provider) : ''}</div>
          </div>
          <button class="btn btn-sm btn-danger" onclick="window.BM.app.deleteCE('${e.id}')">🗑</button>
        </div>
      `).join('');
    }

    // Event listeners
    document.getElementById('btn-add-ce').addEventListener('click', () => {
      document.getElementById('ce-modal').classList.remove('hidden');
    });

    document.getElementById('btn-cancel-ce').addEventListener('click', () => {
      document.getElementById('ce-modal').classList.add('hidden');
    });

    document.getElementById('btn-save-ce').addEventListener('click', () => {
      const date = document.getElementById('ce-date').value;
      const hours = parseFloat(document.getElementById('ce-hours').value);
      const topic = document.getElementById('ce-topic').value.trim();
      const provider = document.getElementById('ce-provider').value.trim();

      if (!date || !hours || hours <= 0) {
        toast('Date and hours are required');
        return;
      }

      window.BM.state.addCEEntry(date, hours, topic, provider);
      document.getElementById('ce-modal').classList.add('hidden');
      toast(`${hours}h logged`);
      renderCETracker(container);
    });
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.ce = {
    renderCETracker,
    STATE_CE_REQUIREMENTS
  };
})();

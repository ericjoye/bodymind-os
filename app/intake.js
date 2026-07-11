/**
 * BodyMind OS — Digital Intake Forms Module (Pro Feature)
 * Health history, contraindication flagging, consent
 */
(function() {
  'use strict';

  const CONTRAINDICATIONS = [
    { id: 'dvt', label: 'Deep Vein Thrombosis (DVT)', severity: 'critical' },
    { id: 'osteoporosis', label: 'Osteoporosis', severity: 'warning' },
    { id: 'pregnancy', label: 'Pregnancy', severity: 'warning' },
    { id: 'cancer', label: 'Cancer Treatment', severity: 'critical' },
    { id: 'skin_infection', label: 'Skin Infection / Rash', severity: 'critical' },
    { id: 'fracture', label: 'Recent Fracture', severity: 'warning' },
    { id: 'surgery', label: 'Recent Surgery (<6 weeks)', severity: 'warning' },
    { id: 'blood_thinners', label: 'Blood Thinners', severity: 'warning' },
    { id: 'heart_condition', label: 'Heart Condition', severity: 'critical' },
    { id: 'diabetes', label: 'Diabetes', severity: 'warning' },
    { id: 'high_bp', label: 'High Blood Pressure', severity: 'warning' },
    { id: 'allergies', label: 'Allergies (latex, oils)', severity: 'warning' }
  ];

  function renderIntake(container, clientId) {
    const state = window.BM.state.loadState();
    const client = clientId ? state.clients.find(c => c.id === clientId) : null;

    const contraItems = CONTRAINDICATIONS.map(c => `
      <label class="checkbox-item ${c.severity === 'critical' ? 'danger' : ''}">
        <input type="checkbox" name="contra" value="${c.id}">
        ${escapeHtml(c.label)}
      </label>
    `).join('');

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="page-title">Intake Form</div>
            <div class="card-subtitle">${client ? escapeHtml(client.name) : 'New Client'}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="window.BM.app.navigateTo('clients')">← Back</button>
        </div>

        <div id="intake-contra-alert" class="contraindication-alert hidden">
          <span class="alert-icon">⚠️</span>
          <div>
            <strong>Contraindication Detected</strong>
            <div id="intra-contra-list"></div>
            <div style="margin-top:6px; font-size:12px;">Review before session. Modify technique or refer to physician as appropriate.</div>
          </div>
        </div>

        <form id="intake-form">
          <div class="intake-section">
            <h3>Health History</h3>
            <div class="form-group">
              <label>Do you have any of the following conditions?</label>
              <div class="checkbox-group">
                ${contraItems}
              </div>
            </div>
            <div class="form-group">
              <label>Please list any other health concerns, medications, or recent injuries:</label>
              <textarea id="intake-health-notes" rows="3" placeholder="E.g., lower back pain from desk work, taking ibuprofen daily..."></textarea>
            </div>
          </div>

          <div class="intake-section">
            <h3>Current Symptoms</h3>
            <div class="form-group">
              <label>What brings you in today? (areas of tension, pain level 1-10)</label>
              <textarea id="intake-symptoms" rows="3" placeholder="Upper back tension, pain level 4..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Pain Level (1-10)</label>
                <input type="number" id="intake-pain" min="1" max="10" value="3">
              </div>
              <div class="form-group">
                <label>How long have you had this issue?</label>
                <select id="intake-duration">
                  <option>Today</option>
                  <option>This week</option>
                  <option>This month</option>
                  <option>Chronic (3+ months)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="intake-section">
            <h3>Consent</h3>
            <label class="checkbox-item">
              <input type="checkbox" id="intake-consent-treatment">
              I consent to receive massage therapy treatment.
            </label>
            <label class="checkbox-item">
              <input type="checkbox" id="intake-consent-data">
              I understand my health information will be stored securely and used only for my care.
            </label>
            <div class="form-group" style="margin-top:12px;">
              <label>Client Signature (full name)</label>
              <input type="text" id="intake-signature" placeholder="Type full name as signature">
            </div>
          </div>

          <div style="display:flex; gap:8px; margin-top:20px;">
            <button type="button" class="btn btn-ghost" onclick="window.BM.app.navigateTo('clients')">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Intake Form</button>
          </div>
        </form>
      </div>
    `;

    // Check contraindications on change
    container.querySelectorAll('input[name="contra"]').forEach(cb => {
      cb.addEventListener('change', checkContraindications);
    });

    function checkContraindications() {
      const checked = Array.from(container.querySelectorAll('input[name="contra"]:checked'));
      const alert = document.getElementById('intake-contra-alert');
      const list = document.getElementById('intra-contra-list');

      if (checked.length > 0) {
        const items = checked.map(cb => {
          const contra = CONTRAINDICATIONS.find(c => c.id === cb.value);
          return `<span class="badge badge-${contra.severity === 'critical' ? 'danger' : 'warning'}">${escapeHtml(contra.label)}</span>`;
        });
        list.innerHTML = items.join(' ');
        alert.classList.remove('hidden');
      } else {
        alert.classList.add('hidden');
      }
    }

    // Form submit
    document.getElementById('intake-form').addEventListener('submit', (e) => {
      e.preventDefault();

      const checked = Array.from(container.querySelectorAll('input[name="contra"]:checked'));
      const contraindications = checked.map(cb => cb.value);

      const intakeData = {
        healthNotes: document.getElementById('intake-health-notes').value.trim(),
        symptoms: document.getElementById('intake-symptoms').value.trim(),
        painLevel: document.getElementById('intake-pain').value,
        duration: document.getElementById('intake-duration').value,
        consentTreatment: document.getElementById('intake-consent-treatment').checked,
        consentData: document.getElementById('intake-consent-data').checked,
        signature: document.getElementById('intake-signature').value.trim(),
        contraindications,
        completedAt: new Date().toISOString()
      };

      if (clientId) {
        window.BM.state.updateClient(clientId, {
          intakeCompleted: true,
          contraindications,
          intakeData
        });
        toast('Intake form saved');
        window.BM.app.navigateTo('clients');
      } else {
        toast('Please save the client first');
      }
    });
  }

  function renderIntakeList(container) {
    const state = window.BM.state.loadState();
    const clientsWithIntake = state.clients.filter(c => c.intakeCompleted);

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="page-title">Intake Forms</div>
            <div class="card-subtitle">${clientsWithIntake.length} completed</div>
          </div>
        </div>
        ${clientsWithIntake.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <p>No intake forms yet. Complete one when a new client arrives.</p>
          </div>
        ` : clientsWithIntake.map(c => {
          const contras = (c.contraindications || []).map(id => {
            const contra = CONTRAINDICATIONS.find(x => x.id === id);
            return contra ? `<span class="badge badge-${contra.severity === 'critical' ? 'danger' : 'warning'}">${escapeHtml(contra.label)}</span>` : '';
          }).join(' ');

          return `
            <div class="client-item">
              <div style="flex:1;">
                <div class="client-name">${escapeHtml(c.name)}</div>
                <div class="client-meta">Completed: ${formatDate(c.intakeData?.completedAt)}</div>
                ${contras ? `<div style="margin-top:4px;">${contras}</div>` : ''}
              </div>
              <button class="btn btn-sm btn-ghost" onclick="window.BM.app.viewIntake('${c.id}')">View</button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.intake = {
    renderIntake,
    renderIntakeList,
    CONTRAINDICATIONS
  };
})();

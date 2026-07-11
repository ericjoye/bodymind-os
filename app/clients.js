/**
 * BodyMind OS — Client CRM Module
 */
(function() {
  'use strict';

  function renderClients(container) {
    const state = window.BM.state.loadState();
    const isPro = window.BM.state.isFeatureAvailable('intake');

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="page-title">Clients</div>
            <div class="card-subtitle">${state.clients.length} total clients</div>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-add-client">+ Add Client</button>
        </div>
        <div id="client-list"></div>
      </div>

      <!-- Add Client Modal -->
      <div id="client-modal" class="hidden" style="position:fixed; inset:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:300; padding:20px;">
        <div style="background:var(--bg-card); border-radius:var(--radius); padding:24px; max-width:440px; width:100%; max-height:90vh; overflow-y:auto;">
          <h3 style="margin-bottom:16px;">New Client</h3>
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="client-name" placeholder="Jane Smith">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="client-email" placeholder="jane@email.com">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" id="client-phone" placeholder="555-0100">
            </div>
          </div>
          <div class="form-group">
            <label>Notes</label>
            <textarea id="client-notes" placeholder="Referral source, preferences, etc."></textarea>
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:20px;">
            <button class="btn btn-ghost btn-sm" id="btn-cancel-client">Cancel</button>
            <button class="btn btn-primary btn-sm" id="btn-save-client">Save Client</button>
          </div>
        </div>
      </div>
    `;

    const list = document.getElementById('client-modal');
    const modal = document.getElementById('client-modal');

    // Event listeners
    document.getElementById('btn-add-client').addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    document.getElementById('btn-cancel-client').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    document.getElementById('btn-save-client').addEventListener('click', () => {
      const name = document.getElementById('client-name').value.trim();
      const email = document.getElementById('client-email').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const notes = document.getElementById('client-notes').value.trim();

      if (!name) {
        toast('Name is required');
        return;
      }

      window.BM.state.addClient(name, email, phone, notes);
      modal.classList.add('hidden');
      toast('Client added');
      // Re-render via app
      if (window.BM.app) window.BM.app.navigateTo('clients');
    });

    // Render client list
    const listEl = document.getElementById('client-list');
    if (state.clients.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <p>No clients yet. Add your first client to get started.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = state.clients.map(c => {
        const visitCount = state.appointments.filter(a => a.clientId === c.id && a.status === 'completed').length;
        const nextAppt = state.appointments.find(a => a.clientId === c.id && a.status === 'scheduled' && new Date(a.date) >= new Date(new Date().toDateString()));
        return `
          <div class="client-item">
            <div style="flex:1;">
              <div class="client-name">${escapeHtml(c.name)}</div>
              <div class="client-meta">
                ${c.phone ? '📱 ' + escapeHtml(c.phone) : ''}
                ${c.email ? ' · ✉️ ' + escapeHtml(c.email) : ''}
                ${c.contraindications && c.contraindications.length ? ' · <span class="badge badge-danger">' + c.contraindications.length + ' contraindication(s)</span>' : ''}
              </div>
              <div class="client-meta">${visitCount} visit(s)${nextAppt ? ' · Next: ' + formatDate(nextAppt.date) + ' at ' + nextAppt.time : ''}</div>
            </div>
            <div style="display:flex; gap:4px;">
              ${isPro ? `<button class="btn btn-sm btn-ghost" onclick="window.BM.app.viewIntake('${c.id}')">📋 Intake</button>` : ''}
              <button class="btn btn-sm btn-ghost" onclick="window.BM.app.bookClient('${c.id}')">📅 Book</button>
              <button class="btn btn-sm btn-ghost" onclick="window.BM.app.editClient('${c.id}')">✏️</button>
              <button class="btn btn-sm btn-danger" onclick="window.BM.app.deleteClientConfirm('${c.id}')">🗑</button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function renderClientForm(container, clientId) {
    const state = window.BM.state.loadState();
    const client = clientId ? state.clients.find(c => c.id === clientId) : null;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="page-title">${client ? 'Edit Client' : 'New Client'}</div>
        </div>
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" id="edit-client-name" value="${escapeAttr(client ? client.name : '')}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="edit-client-email" value="${escapeAttr((client && client.email) || '')}">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" id="edit-client-phone" value="${escapeAttr((client && client.phone) || '')}">
          </div>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea id="edit-client-notes">${escapeHtml((client && client.notes) || '')}</textarea>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-ghost" onclick="window.BM.app.navigateTo('clients')">Cancel</button>
          <button class="btn btn-primary" id="btn-save-edit-client">Save</button>
        </div>
      </div>
    `;

    document.getElementById('btn-save-edit-client').addEventListener('click', () => {
      const name = document.getElementById('edit-client-name').value.trim();
      if (!name) { toast('Name is required'); return; }

      const updates = {
        name,
        email: document.getElementById('edit-client-email').value.trim(),
        phone: document.getElementById('edit-client-phone').value.trim(),
        notes: document.getElementById('edit-client-notes').value.trim()
      };

      if (clientId) {
        window.BM.state.updateClient(clientId, updates);
        toast('Client updated');
      } else {
        window.BM.state.addClient(name, updates.email, updates.phone, updates.notes);
        toast('Client added');
      }
      window.BM.app.navigateTo('clients');
    });
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.clients = {
    renderClients,
    renderClientForm
  };
})();

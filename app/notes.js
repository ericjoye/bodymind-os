/**
 * BodyMind OS — Session Notes Module (SOAP format)
 */
(function() {
  'use strict';

  function renderNotes(container) {
    const state = window.BM.state.loadState();
    const notes = state.sessionNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="page-title">Session Notes</div>
            <div class="card-subtitle">${notes.length} notes</div>
          </div>
          <button class="btn btn-sm btn-primary" id="btn-new-note">+ New Note</button>
        </div>
        <div id="notes-list"></div>
      </div>

      <!-- Note Modal -->
      <div id="note-modal" class="hidden" style="position:fixed; inset:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:300; padding:20px;">
        <div style="background:var(--bg-card); border-radius:var(--radius); padding:24px; max-width:500px; width:100%; max-height:90vh; overflow-y:auto;">
          <h3 style="margin-bottom:16px;">New Session Note</h3>
          <div class="form-group">
            <label>Client *</label>
            <select id="note-client">
              <option value="">Select client...</option>
              ${state.clients.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
            </select>
          </div>
          <div class="soap-grid">
            <div class="soap-section">
              <h4>S — Subjective</h4>
              <textarea id="note-subjective" placeholder="Client's reported experience, feelings, concerns..."></textarea>
            </div>
            <div class="soap-section">
              <h4>O — Objective</h4>
              <textarea id="note-objective" placeholder="Observable findings, tissue quality, ROM..."></textarea>
            </div>
            <div class="soap-section">
              <h4>A — Assessment</h4>
              <textarea id="note-assessment" placeholder="Your analysis, progress evaluation..."></textarea>
            </div>
            <div class="soap-section">
              <h4>P — Plan</h4>
              <textarea id="note-plan" placeholder="Next session focus, homework, referrals..."></textarea>
            </div>
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:20px;">
            <button class="btn btn-ghost btn-sm" id="btn-cancel-note">Cancel</button>
            <button class="btn btn-primary btn-sm" id="btn-save-note">Save Note</button>
          </div>
        </div>
      </div>
    `;

    // Render notes list
    const listEl = document.getElementById('notes-list');
    if (notes.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <p>No session notes yet. Create one after your next appointment.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = notes.map(n => {
        const client = state.clients.find(c => c.id === n.clientId);
        return `
          <div class="card" style="padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <div>
                <strong>${client ? escapeHtml(client.name) : 'Unknown'}</strong>
                <span class="card-subtitle" style="margin-left:8px;">${formatDate(n.date)}</span>
              </div>
              <div style="display:flex; gap:4px;">
                <button class="btn btn-sm btn-ghost" onclick="window.BM.app.editNote('${n.id}')">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="window.BM.app.deleteNoteConfirm('${n.id}')">🗑</button>
              </div>
            </div>
            <div class="soap-grid" style="gap:8px;">
              <div class="soap-section"><h4>S</h4><div style="font-size:13px;">${escapeHtml(n.subjective || '—')}</div></div>
              <div class="soap-section"><h4>O</h4><div style="font-size:13px;">${escapeHtml(n.objective || '—')}</div></div>
              <div class="soap-section"><h4>A</h4><div style="font-size:13px;">${escapeHtml(n.assessment || '—')}</div></div>
              <div class="soap-section"><h4>P</h4><div style="font-size:13px;">${escapeHtml(n.plan || '—')}</div></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Event listeners
    document.getElementById('btn-new-note').addEventListener('click', () => {
      if (state.clients.length === 0) {
        toast('Add a client first');
        return;
      }
      document.getElementById('note-modal').classList.remove('hidden');
    });

    document.getElementById('btn-cancel-note').addEventListener('click', () => {
      document.getElementById('note-modal').classList.add('hidden');
    });

    document.getElementById('btn-save-note').addEventListener('click', () => {
      const clientId = document.getElementById('note-client').value;
      if (!clientId) { toast('Select a client'); return; }

      const note = {
        subjective: document.getElementById('note-subjective').value.trim(),
        objective: document.getElementById('note-objective').value.trim(),
        assessment: document.getElementById('note-assessment').value.trim(),
        plan: document.getElementById('note-plan').value.trim()
      };

      window.BM.state.addSessionNote(clientId, null, note);
      document.getElementById('note-modal').classList.add('hidden');
      toast('Session note saved');
      renderNotes(container);
    });
  }

  function renderNoteForm(container, noteId) {
    const state = window.BM.state.loadState();
    const note = noteId ? state.sessionNotes.find(n => n.id === noteId) : null;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="page-title">${note ? 'Edit Note' : 'New Session Note'}</div>
        </div>
        <div class="form-group">
          <label>Client</label>
          <select id="edit-note-client">
            <option value="">Select...</option>
            ${state.clients.map(c => `<option value="${c.id}" ${note && note.clientId === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
          </select>
        </div>
        <div class="soap-grid">
          <div class="soap-section">
            <h4>S — Subjective</h4>
            <textarea id="edit-note-subjective">${escapeHtml(note ? note.subjective : '')}</textarea>
          </div>
          <div class="soap-section">
            <h4>O — Objective</h4>
            <textarea id="edit-note-objective">${escapeHtml(note ? note.objective : '')}</textarea>
          </div>
          <div class="soap-section">
            <h4>A — Assessment</h4>
            <textarea id="edit-note-assessment">${escapeHtml(note ? note.assessment : '')}</textarea>
          </div>
          <div class="soap-section">
            <h4>P — Plan</h4>
            <textarea id="edit-note-plan">${escapeHtml(note ? note.plan : '')}</textarea>
          </div>
        </div>
        <div style="display:flex; gap:8px; margin-top:20px;">
          <button class="btn btn-ghost" onclick="window.BM.app.navigateTo('notes')">Cancel</button>
          <button class="btn btn-primary" id="btn-save-edit-note">Save</button>
        </div>
      </div>
    `;

    document.getElementById('btn-save-edit-note').addEventListener('click', () => {
      const clientId = document.getElementById('edit-note-client').value;
      if (!clientId) { toast('Select a client'); return; }

      const updates = {
        clientId,
        subjective: document.getElementById('edit-note-subjective').value.trim(),
        objective: document.getElementById('edit-note-objective').value.trim(),
        assessment: document.getElementById('edit-note-assessment').value.trim(),
        plan: document.getElementById('edit-note-plan').value.trim()
      };

      if (noteId) {
        window.BM.state.updateNote(noteId, updates);
        toast('Note updated');
      } else {
        window.BM.state.addSessionNote(clientId, null, updates);
        toast('Note created');
      }
      window.BM.app.navigateTo('notes');
    });
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.notes = {
    renderNotes,
    renderNoteForm
  };
})();

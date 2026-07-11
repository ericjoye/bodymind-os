/**
 * BodyMind OS — Main App Controller
 * Tab navigation, global utilities, toast notifications
 */
(function() {
  'use strict';

  let currentTab = 'dashboard';

  function init() {
    // First, check license
    window.BM.license.initSplash();

    // Setup navigation
    setupNavigation();

    // If already initialized, render the current tab
    const state = window.BM.state.loadState();
    if (state.initialized) {
      navigateTo('dashboard');
    }
  }

  function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        navigateTo(tab);
      });
    });

    // Settings button
    const settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        navigateTo('dashboard');
        // Scroll to settings section
        setTimeout(() => {
          const settingsCard = document.querySelector('#app-content .card:last-child');
          if (settingsCard) settingsCard.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    }
  }

  function navigateTo(tab) {
    currentTab = tab;

    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Render content
    const content = document.getElementById('app-content');
    if (!content) return;

    // Check feature availability for pro tabs
    if ((tab === 'ce' || tab === 'intake' || tab === 'notes') && !window.BM.state.isFeatureAvailable(tab === 'ce' ? 'ce_tracker' : tab)) {
      renderUpgradePrompt(content, tab);
      return;
    }

    switch (tab) {
      case 'dashboard':
        window.BM.dashboard.renderDashboard(content);
        break;
      case 'calendar':
        window.BM.calendar.renderCalendar(content);
        break;
      case 'clients':
        window.BM.clients.renderClients(content);
        break;
      case 'notes':
        window.BM.notes.renderNotes(content);
        break;
      case 'intake':
        window.BM.intake.renderIntake(content, null);
        break;
      case 'ce':
        window.BM.ce.renderCETracker(content);
        break;
      default:
        window.BM.dashboard.renderDashboard(content);
    }
  }

  function renderUpgradePrompt(container, feature) {
    const featureNames = {
      intake: 'Digital Intake Forms',
      ce: 'CE Tracker',
      notes: 'SOAP Session Notes'
    };

    container.innerHTML = `
      <div class="card" style="text-align:center; padding:48px 24px;">
        <div style="font-size:48px; margin-bottom:16px;">🔒</div>
        <h2 style="margin-bottom:8px;">${featureNames[feature] || feature} is a Pro Feature</h2>
        <p style="color:var(--text-muted); margin-bottom:24px;">
          Upgrade to Pro for $29/mo to unlock intake forms, SOAP notes, CE tracking, and more.
        </p>
        <a href="../#pricing" class="btn btn-primary">Upgrade to Pro →</a>
      </div>
    `;
  }

  // --- Quick actions from other modules ---

  function bookClient(clientId) {
    navigateTo('calendar');
    setTimeout(() => {
      const select = document.getElementById('appt-client');
      if (select) select.value = clientId;
      const modal = document.getElementById('booking-modal');
      if (modal && window.BM.state.loadState().clients.length > 0) {
        modal.classList.remove('hidden');
      }
    }, 100);
  }

  function editClient(clientId) {
    const content = document.getElementById('app-content');
    window.BM.clients.renderClientForm(content, clientId);
  }

  function deleteClientConfirm(clientId) {
    const state = window.BM.state.loadState();
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return;

    if (confirm(`Delete ${client.name}? This cannot be undone.`)) {
      window.BM.state.deleteClient(clientId);
      toast('Client deleted');
      navigateTo('clients');
    }
  }

  function completeAppt(id) {
    window.BM.state.updateAppointment(id, { status: 'completed' });
    toast('Session marked complete');
    navigateTo('calendar');
  }

  function noShowAppt(id) {
    window.BM.state.updateAppointment(id, { status: 'no_show' });
    toast('Marked as no-show');
    navigateTo('calendar');
  }

  function cancelAppt(id) {
    if (confirm('Cancel this appointment?')) {
      window.BM.state.deleteAppointment(id);
      toast('Appointment cancelled');
      navigateTo('calendar');
    }
  }

  function editNote(id) {
    const content = document.getElementById('app-content');
    window.BM.notes.renderNoteForm(content, id);
  }

  function deleteNoteConfirm(id) {
    if (confirm('Delete this note?')) {
      window.BM.state.deleteNote(id);
      toast('Note deleted');
      navigateTo('notes');
    }
  }

  function deleteCE(id) {
    window.BM.state.deleteCEEntry(id);
    toast('Entry deleted');
    navigateTo('ce');
  }

  function viewIntake(clientId) {
    const content = document.getElementById('app-content');
    window.BM.intake.renderIntake(content, clientId);
  }

  // --- Toast ---
  function toast(message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => {
      el.classList.remove('visible');
    }, 2500);
  }

  // --- Utility functions (global) ---
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.app = {
    init,
    navigateTo,
    bookClient,
    editClient,
    deleteClientConfirm,
    completeAppt,
    noShowAppt,
    cancelAppt,
    editNote,
    deleteNoteConfirm,
    deleteCE,
    viewIntake,
    toast
  };

  // Global helpers for inline onclick handlers
  window.escapeHtml = escapeHtml;
  window.escapeAttr = escapeAttr;
  window.formatDate = formatDate;

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

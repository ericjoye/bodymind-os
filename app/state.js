/**
 * BodyMind OS — State Management
 * localStorage persistence, license gate, offline-first data model
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'bodymind_os';
  const LICENSE_KEY = 'bodymind_license';

  // --- Default state ---
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* corrupted — reset */ }

    return {
      initialized: false,
      currentTab: 'dashboard',
      clients: [],
      appointments: [],
      sessionNotes: [],
      ceEntries: [],
      supplyItems: [],
      licenseTier: 'free', // 'free' | 'pro' | 'studio'
      settings: {
        name: '',
        licenseNumber: '',
        state: '',
        sessionTypes: [
          { name: 'Swedish 60', duration: 60, price: 90 },
          { name: 'Swedish 90', duration: 90, price: 130 },
          { name: 'Deep Tissue 60', duration: 60, price: 100 },
          { name: 'Deep Tissue 90', duration: 90, price: 140 }
        ],
        weeklyHours: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
        workStart: '09:00',
        workEnd: '18:00',
        bufferMinutes: 15
      }
    };
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  // --- Client CRUD ---
  function addClient(name, email, phone, notes) {
    const state = loadState();
    const client = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: name || '',
      email: email || '',
      phone: phone || '',
      notes: notes || '',
      intakeCompleted: false,
      contraindications: [],
      createdAt: new Date().toISOString()
    };
    state.clients.push(client);
    saveState(state);
    return client;
  }

  function updateClient(id, updates) {
    const state = loadState();
    const idx = state.clients.findIndex(c => c.id === id);
    if (idx >= 0) {
      Object.assign(state.clients[idx], updates);
      saveState(state);
    }
    return state.clients[idx];
  }

  function deleteClient(id) {
    const state = loadState();
    state.clients = state.clients.filter(c => c.id !== id);
    saveState(state);
  }

  // --- Appointment CRUD ---
  function addAppointment(clientId, date, time, type, duration, notes) {
    const state = loadState();
    const appt = {
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      clientId,
      date,
      time,
      type,
      duration: duration || 60,
      notes: notes || '',
      status: 'scheduled', // 'scheduled' | 'completed' | 'no_show' | 'cancelled'
      createdAt: new Date().toISOString()
    };
    state.appointments.push(appt);
    saveState(state);
    return appt;
  }

  function updateAppointment(id, updates) {
    const state = loadState();
    const idx = state.appointments.findIndex(a => a.id === id);
    if (idx >= 0) {
      Object.assign(state.appointments[idx], updates);
      saveState(state);
    }
  }

  function deleteAppointment(id) {
    const state = loadState();
    state.appointments = state.appointments.filter(a => a.id !== id);
    saveState(state);
  }

  // --- Session Notes CRUD ---
  function addSessionNote(clientId, appointmentId, soap) {
    const state = loadState();
    const note = {
      id: 'n_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      clientId,
      appointmentId,
      date: new Date().toISOString(),
      subjective: soap.subjective || '',
      objective: soap.objective || '',
      assessment: soap.assessment || '',
      plan: soap.plan || ''
    };
    state.sessionNotes.push(note);
    saveState(state);
    return note;
  }

  function updateNote(id, updates) {
    const state = loadState();
    const idx = state.sessionNotes.findIndex(n => n.id === id);
    if (idx >= 0) {
      Object.assign(state.sessionNotes[idx], updates);
      saveState(state);
    }
  }

  function deleteNote(id) {
    const state = loadState();
    state.sessionNotes = state.sessionNotes.filter(n => n.id !== id);
    saveState(state);
  }

  // --- CE Tracking ---
  function addCEEntry(date, hours, topic, provider) {
    const state = loadState();
    const entry = {
      id: 'ce_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      date: date || new Date().toISOString().split('T')[0],
      hours: hours || 1,
      topic: topic || '',
      provider: provider || '',
      createdAt: new Date().toISOString()
    };
    state.ceEntries.push(entry);
    saveState(state);
    return entry;
  }

  function deleteCEEntry(id) {
    const state = loadState();
    state.ceEntries = state.ceEntries.filter(e => e.id !== id);
    saveState(state);
  }

  function getCEStats() {
    const state = loadState();
    const total = state.ceEntries.reduce((sum, e) => sum + (e.hours || 0), 0);
    const byMonth = {};
    state.ceEntries.forEach(e => {
      const month = e.date.substring(0, 7);
      byMonth[month] = (byMonth[month] || 0) + (e.hours || 0);
    });
    return { total, byMonth, entries: state.ceEntries.length };
  }

  // --- Supply Inventory ---
  function addSupplyItem(name, quantity, unit, costPerUnit) {
    const state = loadState();
    const item = {
      id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: name || '',
      quantity: quantity || 0,
      unit: unit || 'unit',
      costPerUnit: costPerUnit || 0,
      createdAt: new Date().toISOString()
    };
    state.supplyItems.push(item);
    saveState(state);
    return item;
  }

  function updateSupplyItem(id, updates) {
    const state = loadState();
    const idx = state.supplyItems.findIndex(s => s.id === id);
    if (idx >= 0) {
      Object.assign(state.supplyItems[idx], updates);
      saveState(state);
    }
  }

  function deleteSupplyItem(id) {
    const state = loadState();
    state.supplyItems = state.supplyItems.filter(s => s.id !== id);
    saveState(state);
  }

  // --- License ---
  function getLicense() {
    try {
      const raw = localStorage.getItem(LICENSE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function setLicense(tier) {
    localStorage.setItem(LICENSE_KEY, JSON.stringify({ tier, activated: new Date().toISOString() }));
    const state = loadState();
    state.licenseTier = tier;
    state.initialized = true;
    saveState(state);
  }

  function clearLicense() {
    localStorage.removeItem(LICENSE_KEY);
  }

  // --- ⚠️ DEPRECATED 2026-07-20 — use window.License.activateLicense() instead ---
  function validateLicenseKey(key) {
    // This function is intentionally crippled to prevent bypassing the real ECDSA verifier.
    // The real verification now happens in app/license.js via window.License.activateLicense().
    // See https://github.com/ericjoye/bodymind-os/commit/XXX-TODO
    return false;
  }

  function getLicenseTier() {
    const state = loadState();
    return state.licenseTier || 'free';
  }

  function isFeatureAvailable(feature) {
    const tier = getLicenseTier();
    const freeFeatures = ['dashboard', 'calendar', 'clients', 'notes_basic'];
    const proFeatures = ['intake', 'notes', 'ce_tracker', 'supply', 'studio'];

    if (freeFeatures.includes(feature)) return true;
    if (proFeatures.includes(feature) && tier !== 'free') return true;
    return false;
  }

  // --- Settings ---
  function updateSettings(updates) {
    const state = loadState();
    Object.assign(state.settings, updates);
    saveState(state);
    return state.settings;
  }

  // --- Stats ---
  function getStats() {
    const state = loadState();
    const now = new Date();
    const thisMonth = now.toISOString().substring(0, 7);

    const appointmentsThisMonth = state.appointments.filter(a => a.date.startsWith(thisMonth));
    const completedThisMonth = appointmentsThisMonth.filter(a => a.status === 'completed');
    const noShowsThisMonth = appointmentsThisMonth.filter(a => a.status === 'no_show');
    const cancelledThisMonth = appointmentsThisMonth.filter(a => a.status === 'cancelled');

    const revenue = completedThisMonth.reduce((sum, a) => {
      const sessionType = state.settings.sessionTypes.find(t => t.name === a.type);
      return sum + (sessionType ? sessionType.price : 0);
    }, 0);

    const noShowRate = appointmentsThisMonth.length > 0
      ? Math.round((noShowsThisMonth.length + cancelledThisMonth.length) / appointmentsThisMonth.length * 100)
      : 0;

    const activeClients = state.clients.length;
    const upcomingCount = state.appointments.filter(a => {
      const apptDate = new Date(a.date + 'T' + a.time);
      return apptDate > now && a.status === 'scheduled';
    }).length;

    return {
      revenue,
      completedSessions: completedThisMonth.length,
      noShowRate,
      activeClients,
      upcomingCount,
      totalClients: state.clients.length,
      totalSessions: state.appointments.length
    };
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.state = {
    loadState,
    saveState,
    addClient,
    updateClient,
    deleteClient,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addSessionNote,
    updateNote,
    deleteNote,
    addCEEntry,
    deleteCEEntry,
    getCEStats,
    addSupplyItem,
    updateSupplyItem,
    deleteSupplyItem,
    getLicense,
    setLicense,
    clearLicense,
    // validateLicenseKey removed 2026-07-20 — ECDSA verifier in license.js is the only path
    getLicenseTier,
    isFeatureAvailable,
    updateSettings,
    getStats
  };
})();

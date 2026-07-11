/**
 * BodyMind OS — Calendar & Booking Module
 */
(function() {
  'use strict';

  let currentMonth = new Date();

  function renderCalendar(container) {
    const state = window.BM.state.loadState();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Get appointments for this month
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthAppointments = state.appointments.filter(a => a.date.startsWith(monthStr));

    let calendarHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="page-title">Calendar</div>
            <div class="card-subtitle">${monthNames[month]} ${year}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-sm btn-ghost" id="btn-prev-month">← Prev</button>
            <button class="btn btn-sm btn-ghost" id="btn-next-month">Next →</button>
          </div>
        </div>

        <div class="calendar-grid">
          ${dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('')}
    `;

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      calendarHTML += `<div class="calendar-day empty"></div>`;
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
      const hasEvents = monthAppointments.some(a => a.date === dateStr);
      const isToday = dateStr === todayStr;

      calendarHTML += `<div class="calendar-day${isToday ? ' today' : ''}${hasEvents ? ' has-events' : ''}" data-date="${dateStr}">${day}</div>`;
    }

    calendarHTML += `</div>`;

    // Upcoming appointments
    const upcoming = state.appointments
      .filter(a => {
        const apptDate = new Date(a.date + 'T' + (a.time || '00:00'));
        return apptDate >= new Date(new Date().toDateString()) && a.status === 'scheduled';
      })
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 10);

    calendarHTML += `
      <div style="margin-top:24px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <h3 style="font-size:16px; font-weight:600;">Upcoming Appointments</h3>
          <button class="btn btn-sm btn-primary" id="btn-new-appt">+ New Booking</button>
        </div>
    `;

    if (upcoming.length === 0) {
      calendarHTML += `<div class="empty-state"><p>No upcoming appointments.</p></div>`;
    } else {
      calendarHTML += upcoming.map(a => {
        const client = state.clients.find(c => c.id === a.clientId);
        return `
          <div class="appointment-item">
            <div class="appointment-time">${a.time}</div>
            <div class="appointment-info">
              <div class="appointment-client">${client ? escapeHtml(client.name) : 'Unknown'}</div>
              <div class="appointment-type">${escapeHtml(a.type)} · ${a.duration}min</div>
            </div>
            <div style="display:flex; gap:4px;">
              <button class="btn btn-sm btn-ghost" onclick="window.BM.app.completeAppt('${a.id}')">✓</button>
              <button class="btn btn-sm btn-ghost" onclick="window.BM.app.noShowAppt('${a.id}')">✗</button>
              <button class="btn btn-sm btn-danger" onclick="window.BM.app.cancelAppt('${a.id}')">🗑</button>
            </div>
          </div>
        `;
      }).join('');
    }

    calendarHTML += `</div></div>`;

    // Booking modal
    calendarHTML += `
      <div id="booking-modal" class="hidden" style="position:fixed; inset:0; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; z-index:300; padding:20px;">
        <div style="background:var(--bg-card); border-radius:var(--radius); padding:24px; max-width:440px; width:100%; max-height:90vh; overflow-y:auto;">
          <h3 style="margin-bottom:16px;">New Booking</h3>
          <div class="form-group">
            <label>Client *</label>
            <select id="appt-client">
              <option value="">Select client...</option>
              ${state.clients.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Date *</label>
              <input type="date" id="appt-date">
            </div>
            <div class="form-group">
              <label>Time *</label>
              <input type="time" id="appt-time" value="10:00">
            </div>
          </div>
          <div class="form-group">
            <label>Session Type</label>
            <select id="appt-type">
              ${state.settings.sessionTypes.map(t => `<option value="${escapeAttr(t.name)}" data-duration="${t.duration}">${escapeHtml(t.name)} — $${t.price}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Notes</label>
            <textarea id="appt-notes" placeholder="Focus areas, special requests..."></textarea>
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:20px;">
            <button class="btn btn-ghost btn-sm" id="btn-cancel-booking">Cancel</button>
            <button class="btn btn-primary btn-sm" id="btn-save-booking">Create Booking</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = calendarHTML;

    // Event listeners
    document.getElementById('btn-prev-month').addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderCalendar(container);
    });

    document.getElementById('btn-next-month').addEventListener('click', () => {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderCalendar(container);
    });

    document.getElementById('btn-new-appt').addEventListener('click', () => {
      if (state.clients.length === 0) {
        toast('Add a client first');
        return;
      }
      document.getElementById('booking-modal').classList.remove('hidden');
    });

    document.getElementById('btn-cancel-booking').addEventListener('click', () => {
      document.getElementById('booking-modal').classList.add('hidden');
    });

    document.getElementById('btn-save-booking').addEventListener('click', () => {
      const clientId = document.getElementById('appt-client').value;
      const date = document.getElementById('appt-date').value;
      const time = document.getElementById('appt-time').value;
      const type = document.getElementById('appt-type').value;
      const notes = document.getElementById('appt-notes').value.trim();

      if (!clientId || !date || !time) {
        toast('Client, date, and time are required');
        return;
      }

      const duration = state.settings.sessionTypes.find(t => t.name === type)?.duration || 60;
      window.BM.state.addAppointment(clientId, date, time, type, duration, notes);
      document.getElementById('booking-modal').classList.add('hidden');
      toast('Booking created');
      renderCalendar(container);
    });

    // Day click
    container.querySelectorAll('.calendar-day:not(.empty)').forEach(el => {
      el.addEventListener('click', () => {
        const date = el.dataset.date;
        document.getElementById('appt-date').value = date;
        if (state.clients.length === 0) {
          toast('Add a client first');
          return;
        }
        document.getElementById('booking-modal').classList.remove('hidden');
      });
    });
  }

  function navigateToMonth(date) {
    const [y, m] = date.split('-').map(Number);
    currentMonth = new Date(y, m - 1, 1);
  }

  // Expose
  window.BM = window.BM || {};
  window.BM.calendar = {
    renderCalendar,
    navigateToMonth
  };
})();

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useCalendar } from './hooks/useCalendar';
import Header from './components/Header';
import Legend from './components/Legend';
import CalendarGrid from './components/CalendarGrid';
import EventPanel from './components/EventPanel';
import AddEventModal from './components/AddEventModal';
import NameModal from './components/NameModal';
import TodayBanner from './components/TodayBanner';
import FilterBar from './components/FilterBar';
import AgendaSidebar from './components/AgendaSidebar';
import { LOCAL_STORAGE_KEY, FILTER_STORAGE_KEY, TEAM_MEMBERS } from './constants';
import { parseDateStr } from './utils/dates';
import './App.css';

const App = () => {
  // ── User identity ─────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEY) || null,
  );
  const [showNameModal, setShowNameModal] = useState(!localStorage.getItem(LOCAL_STORAGE_KEY));

  const handleNameConfirm = useCallback((name) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, name);
    setCurrentUser(name);
    setShowNameModal(false);
  }, []);

  const handleChangeName = useCallback(() => {
    setShowNameModal(true);
  }, []);

  // ── Calendar state ────────────────────────────────────────────────────────
  const {
    viewDate, todayStr, events, selectedDate, loading, error, syncing,
    setSelectedDate, goToPrevMonth, goToNextMonth, goToToday, jumpToMonth,
    addEvent, deleteEvent, getDaysInMonth,
  } = useCalendar();

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalDate, setModalDate]       = useState(null);

  // ── Filter by person ────────────────────────────────────────────────────
  // This is a PER-DEVICE view preference, not synced. We seed it from this
  // device's localStorage so each person's chosen view sticks on their own
  // machine; it never touches Firestore or anyone else's calendar.
  const [activeNames, setActiveNames] = useState(() => {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) return new Set(JSON.parse(saved));
    } catch { /* ignore malformed storage */ }
    return new Set(TEAM_MEMBERS);
  });

  // Persist the filter locally whenever it changes (this device only).
  useEffect(() => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify([...activeNames]));
    } catch { /* storage may be unavailable; non-fatal */ }
  }, [activeNames]);

  const toggleName = useCallback((name) => {
    setActiveNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // "All Team": when everyone is selected, clear it (show nothing). Otherwise
  // select everyone (back to full calendar).
  const toggleAll = useCallback(() => {
    setActiveNames((prev) =>
      prev.size === TEAM_MEMBERS.length ? new Set() : new Set(TEAM_MEMBERS),
    );
  }, []);

  // Events visible after applying the person filter. People not on the
  // hardcoded team (custom names) always show so nobody's events vanish.
  const visibleEvents = useMemo(() => {
    if (activeNames.size === TEAM_MEMBERS.length) return events;
    return events.filter(
      (e) => activeNames.has(e.createdBy) || !TEAM_MEMBERS.includes(e.createdBy),
    );
  }, [events, activeNames]);

  // ── Agenda sidebar ────────────────────────────────────────────────────────
  const [agendaCollapsed, setAgendaCollapsed] = useState(false);

  const days = getDaysInMonth();

  const handleDayClick = useCallback((_date, dateStr) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }, [setSelectedDate]);

  const openAddModal = useCallback((dateStr) => {
    if (!currentUser) { setShowNameModal(true); return; }
    setModalDate(dateStr ? parseDateStr(dateStr) : new Date());
    setShowAddModal(true);
  }, [currentUser]);

  const handleAddEvent = useCallback(() => {
    openAddModal(selectedDate);
  }, [openAddModal, selectedDate]);

  // ── Loading / error screens ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner" />
        <p className="loading__text">Connecting to calendar…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading">
        <div className="error-screen">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#FCA5A5" strokeWidth="1.5"/>
            <path d="M20 12v10M20 26v2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h2>Can't reach the calendar</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="app">
        <Header
          viewDate={viewDate}
          onPrev={goToPrevMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
          onJump={jumpToMonth}
          onAddEvent={handleAddEvent}
          currentUser={currentUser}
          onChangeName={handleChangeName}
          syncing={syncing}
        />

        <TodayBanner
          events={events}
          todayStr={todayStr}
          onSelectToday={() => setSelectedDate(todayStr)}
        />

        <FilterBar
          active={activeNames}
          onToggle={toggleName}
          onToggleAll={toggleAll}
        />

        <main className="app__main">
          <section className="app__calendar">
            <CalendarGrid
              days={days}
              events={visibleEvents}
              todayStr={todayStr}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
              onEventClick={(ev) => setSelectedDate(ev.startDate || ev.date)}
            />
            <Legend />
          </section>

          <AgendaSidebar
            events={visibleEvents}
            todayStr={todayStr}
            collapsed={agendaCollapsed}
            onToggle={() => setAgendaCollapsed((c) => !c)}
            onSelectDay={(dateStr) => setSelectedDate(dateStr)}
          />
        </main>

        <EventPanel
          selectedDate={selectedDate}
          events={events}
          onClose={() => setSelectedDate(null)}
          onDelete={deleteEvent}
          onAddForDay={openAddModal}
        />
      </div>

      {/* Name picker — shown on first visit or when user clicks their name */}
      {showNameModal && (
        <NameModal
          onConfirm={handleNameConfirm}
          onClose={() => setShowNameModal(false)}
          canClose={!!currentUser}
        />
      )}

      {/* Add event modal */}
      {showAddModal && (
        <AddEventModal
          initialDate={modalDate}
          currentUser={currentUser}
          onClose={() => setShowAddModal(false)}
          onSave={addEvent}
        />
      )}
    </>
  );
};

export default App;

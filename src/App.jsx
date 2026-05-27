import React, { useState, useCallback } from 'react';
import { useCalendar } from './hooks/useCalendar';
import Header from './components/Header';
import Legend from './components/Legend';
import CalendarGrid from './components/CalendarGrid';
import EventPanel from './components/EventPanel';
import AddEventModal from './components/AddEventModal';
import NameModal from './components/NameModal';
import { LOCAL_STORAGE_KEY } from './constants';
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
    viewDate, todayStr, events, selectedDate, loading, error,
    setSelectedDate, goToPrevMonth, goToNextMonth, goToToday,
    addEvent, deleteEvent, getDaysInMonth,
  } = useCalendar();

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalDate, setModalDate]       = useState(null);

  const days = getDaysInMonth();

  const handleDayClick = useCallback((_date, dateStr) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }, [setSelectedDate]);

  const handleAddEvent = useCallback(() => {
    if (!currentUser) { setShowNameModal(true); return; }
    setModalDate(selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date());
    setShowAddModal(true);
  }, [currentUser, selectedDate]);

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
      <div className={`app${selectedDate ? ' app--panel' : ''}`}>
        <Header
          viewDate={viewDate}
          onPrev={goToPrevMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
          onAddEvent={handleAddEvent}
          currentUser={currentUser}
          onChangeName={handleChangeName}
        />

        <main className="app__main">
          <section className="app__calendar">
            <CalendarGrid
              days={days}
              events={events}
              todayStr={todayStr}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
              onEventClick={(ev) => setSelectedDate(ev.date)}
            />
            <Legend />
          </section>

          <EventPanel
            selectedDate={selectedDate}
            events={events}
            onClose={() => setSelectedDate(null)}
            onDelete={deleteEvent}
          />
        </main>
      </div>

      {/* Name picker — shown on first visit or when user clicks their name */}
      {showNameModal && (
        <NameModal onConfirm={handleNameConfirm} />
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

import React, { useState } from 'react';
import { useCalendar } from './hooks/useCalendar';
import Header from './components/Header';
import Legend from './components/Legend';
import CalendarGrid from './components/CalendarGrid';
import EventPanel from './components/EventPanel';
import AddEventModal from './components/AddEventModal';
import './App.css';

const App = () => {
  const {
    viewDate, todayStr, events, selectedDate, loading,
    setSelectedDate, goToPrevMonth, goToNextMonth, goToToday,
    addEvent, deleteEvent, getDaysInMonth,
  } = useCalendar();

  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);

  const days = getDaysInMonth();

  const handleDayClick = (_date, dateStr) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  };

  const handleAddEvent = () => {
    setModalDate(
      selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date()
    );
    setShowModal(true);
  };

  const handleSave = async (data) => {
    await addEvent(data);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner" />
      </div>
    );
  }

  return (
    <div className={`app${selectedDate ? ' app--panel' : ''}`}>
      <Header
        viewDate={viewDate}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        onToday={goToToday}
        onAddEvent={handleAddEvent}
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

      {showModal && (
        <AddEventModal
          initialDate={modalDate}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default App;

import React from 'react';
import DayCell from './DayCell';

const toDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid = ({ days, events, todayStr, selectedDate, onDayClick, onEventClick }) => (
  <div className="grid">
    <div className="grid__header">
      {DAY_NAMES.map((name) => (
        <div key={name} className="grid__day-name">{name}</div>
      ))}
    </div>

    <div className="grid__cells">
      {days.map((day, i) => (
        <DayCell
          key={i}
          day={day}
          events={events}
          isToday={toDateStr(day.date) === todayStr}
          isSelected={toDateStr(day.date) === selectedDate}
          onClick={onDayClick}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  </div>
);

export default CalendarGrid;

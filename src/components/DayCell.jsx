import React from 'react';
import EventChip from './EventChip';

const toDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const DayCell = ({ day, events, isToday, isSelected, onClick, onEventClick }) => {
  const { date, isCurrentMonth } = day;
  const dateStr  = toDateStr(date);
  const dayNum   = date.getDate();
  const dayEvents = events.filter((e) => e.date === dateStr);

  const classes = [
    'day',
    !isCurrentMonth && 'day--other',
    isToday         && 'day--today',
    isSelected      && 'day--selected',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={() => onClick(date, dateStr)}>
      <span className={`day__num${isToday ? ' day__num--today' : ''}`}>
        {dayNum}
      </span>

      <div className="day__events">
        {dayEvents.slice(0, 3).map((event) => (
          <EventChip
            key={event.id}
            event={event}
            onClick={onEventClick}
          />
        ))}
        {dayEvents.length > 3 && (
          <span className="day__overflow">+{dayEvents.length - 3} more</span>
        )}
      </div>
    </div>
  );
};

export default DayCell;

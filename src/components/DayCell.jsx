import React from 'react';
import EventChip from './EventChip';
import { toDateStr, eventsForDay, isContinuation } from '../utils/dates';

const MAX_VISIBLE = 3;

const DayCell = ({ day, events, isToday, isSelected, todayStr, onClick, onEventClick }) => {
  const { date, isCurrentMonth } = day;
  const dateStr  = toDateStr(date);
  const dayNum   = date.getDate();
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isPast    = dateStr < todayStr;

  const dayEvents = eventsForDay(events, dateStr);
  const visible   = dayEvents.slice(0, MAX_VISIBLE);
  const overflow  = dayEvents.length - visible.length;

  const classes = [
    'day',
    !isCurrentMonth && 'day--other',
    isToday         && 'day--today',
    isSelected      && 'day--selected',
    isPast          && isCurrentMonth && 'day--past',
    isWeekend       && 'day--weekend',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={() => onClick(date, dateStr)}>
      <span className={`day__num${isToday ? ' day__num--today' : ''}`}>
        {dayNum}
      </span>

      <div className="day__events">
        {visible.map((event) => (
          <EventChip
            key={event.id}
            event={event}
            continuation={isContinuation(event, dateStr)}
            onClick={onEventClick}
          />
        ))}
        {overflow > 0 && (
          <button
            className="day__overflow"
            onClick={(e) => { e.stopPropagation(); onClick(date, dateStr); }}
          >
            +{overflow} more
          </button>
        )}
      </div>
    </div>
  );
};

export default DayCell;

import React from 'react';
import { EVENT_TYPE_META } from '../constants';

// Compact pill shown inside a day cell.
// Shows who the event belongs to and the type via color.
const EventChip = ({ event, onClick }) => {
  const meta = EVENT_TYPE_META[event.type] ?? EVENT_TYPE_META['meeting'];

  return (
    <button
      className="chip"
      style={{ background: meta.bg, color: meta.text }}
      onClick={(e) => { e.stopPropagation(); onClick?.(event); }}
      title={`${meta.label} — ${event.createdBy}`}
    >
      <span className="chip__dot" style={{ background: meta.dot }} />
      <span className="chip__person">{event.createdBy}</span>
      <span className="chip__title">{event.title}</span>
    </button>
  );
};

export default EventChip;

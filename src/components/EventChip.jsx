import React from 'react';
import { EVENT_TYPE_META } from '../data/mockData';

const EventChip = ({ event, onClick }) => {
  const meta = EVENT_TYPE_META[event.type];

  return (
    <button
      className="chip"
      style={{ background: meta.bg, color: meta.text }}
      onClick={(e) => { e.stopPropagation(); onClick?.(event); }}
      title={`${event.title} · ${event.person}`}
    >
      <span className="chip__dot" style={{ background: meta.dot }} />
      <span className="chip__person">{event.person}</span>
      <span className="chip__title">{event.title}</span>
    </button>
  );
};

export default EventChip;

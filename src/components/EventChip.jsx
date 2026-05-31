import React, { useState, useRef } from 'react';
import { EVENT_TYPE_META } from '../constants';
import { eventStart, eventEnd, isMultiDay, formatRange } from '../utils/dates';

// Only show hover tooltips on devices with a real hovering pointer.
// Pure touch screens fall through to tap → open panel.
const canHover = typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

// Solid pill chip. `continuation` = a later day of a multi-day event.
const EventChip = ({ event, onClick, continuation }) => {
  const meta = EVENT_TYPE_META[event.type] ?? EVENT_TYPE_META['meeting'];
  const [tip, setTip] = useState(null); // {x, y} in viewport coords
  const ref = useRef(null);

  const showTip = () => {
    if (!canHover || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTip({ x: r.left + r.width / 2, y: r.bottom + 8 });
  };
  const hideTip = () => setTip(null);

  const rangeLabel = formatRange(eventStart(event), eventEnd(event));
  const note = event.note?.slice(0, 60) + (event.note?.length > 60 ? '…' : '');

  return (
    <>
      <button
        ref={ref}
        className={`chip${continuation ? ' chip--cont' : ''}`}
        style={{ background: meta.dot }}
        onClick={(e) => { e.stopPropagation(); onClick?.(event); }}
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
      >
        {continuation && <span className="chip__cont-arrow">›</span>}
        <span className="chip__text">
          {event.createdBy}{!continuation && ` · ${meta.label}`}
        </span>
        {isMultiDay(event) && !continuation && <span className="chip__multi">↔</span>}
      </button>

      {tip && (
        <div
          className="chip-tip"
          style={{ left: tip.x, top: tip.y }}
          role="tooltip"
        >
          <div className="chip-tip__top">
            <span className="chip-tip__dot" style={{ background: meta.dot }} />
            <strong className="chip-tip__name">{event.createdBy}</strong>
          </div>
          <div className="chip-tip__type">{meta.label}</div>
          <div className="chip-tip__date">{rangeLabel}</div>
          {event.note && <div className="chip-tip__note">{note}</div>}
        </div>
      )}
    </>
  );
};

export default EventChip;

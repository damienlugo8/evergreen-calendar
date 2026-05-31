import React from 'react';
import { EVENT_TYPE_META } from '../constants';
import { occursOn } from '../utils/dates';

// Slim banner: who is unavailable today (Time Off / Out of Office / WFH).
// Renders nothing if nobody is out — no empty state.
const OUT_TYPES = ['time-off', 'out-of-office', 'wfh'];

const TodayBanner = ({ events, todayStr, onSelectToday }) => {
  const outToday = events.filter(
    (e) => OUT_TYPES.includes(e.type) && occursOn(e, todayStr),
  );

  if (outToday.length === 0) return null;

  return (
    <button className="today-banner" onClick={onSelectToday} title="View today">
      <span className="today-banner__leaf">🌿</span>
      <span className="today-banner__label">Today</span>
      <span className="today-banner__items">
        {outToday.map((e, i) => {
          const meta = EVENT_TYPE_META[e.type] ?? EVENT_TYPE_META['meeting'];
          return (
            <span key={e.id} className="today-banner__item">
              <span className="today-banner__dot" style={{ background: meta.dot }} />
              <strong>{e.createdBy}</strong>
              <span className="today-banner__type">{meta.label}</span>
              {i < outToday.length - 1 && <span className="today-banner__sep">·</span>}
            </span>
          );
        })}
      </span>
    </button>
  );
};

export default TodayBanner;

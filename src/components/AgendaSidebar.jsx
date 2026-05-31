import React from 'react';
import { EVENT_TYPE_META } from '../constants';
import {
  MONTHS_SHORT, DAYS_FULL, parseDateStr, eventStart, eventEnd,
  weekStartStr, formatRange,
} from '../utils/dates';

// Desktop-only (>1200px) collapsible sidebar listing upcoming events
// from today forward, grouped by week.
const AgendaSidebar = ({ events, todayStr, collapsed, onToggle, onSelectDay }) => {
  // Upcoming = events whose end is today or later, sorted by start.
  const upcoming = events
    .filter((e) => eventEnd(e) >= todayStr)
    .sort((a, b) => eventStart(a).localeCompare(eventStart(b)));

  // Group by week-start.
  const groups = [];
  const byWeek = new Map();
  for (const e of upcoming) {
    const start = eventStart(e) < todayStr ? todayStr : eventStart(e);
    const wk = weekStartStr(start);
    if (!byWeek.has(wk)) {
      byWeek.set(wk, []);
      groups.push(wk);
    }
    byWeek.get(wk).push(e);
  }

  const weekLabel = (wk) => {
    const d = parseDateStr(wk);
    return `Week of ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
  };

  if (collapsed) {
    return (
      <aside className="agenda agenda--collapsed">
        <button className="agenda__toggle" onClick={onToggle} aria-label="Expand upcoming">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2.5" y="3.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M2.5 6.5h13M6 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="agenda">
      <div className="agenda__head">
        <h2 className="agenda__title">Upcoming</h2>
        <button className="agenda__toggle" onClick={onToggle} aria-label="Collapse upcoming">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="agenda__body">
        {groups.length === 0 ? (
          <p className="agenda__empty">Nothing scheduled ahead.</p>
        ) : (
          groups.map((wk) => (
            <div key={wk} className="agenda__week">
              <p className="agenda__week-label">{weekLabel(wk)}</p>
              {byWeek.get(wk).map((e) => {
                const meta = EVENT_TYPE_META[e.type] ?? EVENT_TYPE_META['meeting'];
                const d = parseDateStr(eventStart(e));
                return (
                  <button
                    key={e.id}
                    className="agenda__item"
                    onClick={() => onSelectDay(eventStart(e))}
                  >
                    <span className="agenda__item-dot" style={{ background: meta.dot }} />
                    <span className="agenda__item-day">
                      {DAYS_FULL[d.getDay()].slice(0, 3)} {formatRange(eventStart(e), eventEnd(e))}
                    </span>
                    <span className="agenda__item-who">
                      {e.createdBy}: {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default AgendaSidebar;

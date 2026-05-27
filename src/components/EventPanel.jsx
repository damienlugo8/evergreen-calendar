import React from 'react';
import { EVENT_TYPE_META } from '../data/mockData';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_FULL    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const fmt12 = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const EventPanel = ({ selectedDate, events, onClose, onDelete }) => {
  const isOpen = Boolean(selectedDate);

  let header = null;
  let dayEvents = [];

  if (selectedDate) {
    const d = new Date(selectedDate + 'T00:00:00');
    header = {
      dayName: DAY_FULL[d.getDay()],
      display: `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    };
    dayEvents = events.filter((e) => e.date === selectedDate);
  }

  return (
    <aside className={`panel${isOpen ? ' panel--open' : ''}`}>
      {isOpen && (
        <>
          <div className="panel__head">
            <div>
              <p className="panel__day-name">{header.dayName}</p>
              <p className="panel__date">{header.display}</p>
            </div>
            <button className="panel__close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="panel__body">
            {dayEvents.length === 0 ? (
              <div className="panel__empty">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="17" stroke="#E8E3DC" strokeWidth="1.5"/>
                  <path d="M12 18h12M18 12v12" stroke="#C8C0B6" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                </svg>
                <p>No events scheduled</p>
              </div>
            ) : (
              <ul className="panel__list">
                {dayEvents.map((event) => {
                  const meta = EVENT_TYPE_META[event.type];
                  return (
                    <li key={event.id} className="panel__event">
                      <div className="panel__event-bar" style={{ background: meta.dot }} />
                      <div className="panel__event-body">
                        <div className="panel__event-top">
                          <span
                            className="panel__event-tag"
                            style={{ background: meta.bg, color: meta.text }}
                          >
                            {meta.label}
                          </span>
                          <button
                            className="panel__delete"
                            onClick={() => onDelete(event.id)}
                            aria-label="Delete event"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 4h10M5.5 4V2.5h3V4M4 4l.8 7.5h4.4L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>

                        <p className="panel__event-title">{event.title}</p>

                        {event.person && (
                          <p className="panel__event-meta">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.1"/>
                              <path d="M1.5 10.5c0-2.21 2.015-4 4.5-4s4.5 1.79 4.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                            </svg>
                            {event.person}
                          </p>
                        )}

                        {event.startTime && (
                          <p className="panel__event-meta">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1"/>
                              <path d="M6 3.5V6l1.8 1.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                            </svg>
                            {fmt12(event.startTime)}
                            {event.endTime && ` — ${fmt12(event.endTime)}`}
                          </p>
                        )}

                        {event.description && (
                          <p className="panel__event-desc">{event.description}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </aside>
  );
};

export default EventPanel;

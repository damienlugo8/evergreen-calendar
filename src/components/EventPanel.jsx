import React, { useState } from 'react';
import { EVENT_TYPE_META } from '../constants';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_FULL    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const EventPanel = ({ selectedDate, events, onClose, onDelete }) => {
  const [confirmId, setConfirmId] = useState(null);
  const isOpen = Boolean(selectedDate);

  let header    = null;
  let dayEvents = [];

  if (selectedDate) {
    const d = new Date(selectedDate + 'T00:00:00');
    header = {
      dayName: DAY_FULL[d.getDay()],
      display: `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    };
    dayEvents = events.filter((e) => e.date === selectedDate);
  }

  const handleDelete = async (id) => {
    await onDelete(id);
    setConfirmId(null);
    // onSnapshot will remove the event from the list automatically.
  };

  return (
    <aside className={`panel${isOpen ? ' panel--open' : ''}`}>
      {isOpen && (
        <>
          <div className="panel__head">
            <div>
              <p className="panel__day-name">{header.dayName}</p>
              <p className="panel__date">{header.display}</p>
            </div>
            <button className="panel__close" onClick={onClose} aria-label="Close panel">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="panel__body">
            {dayEvents.length === 0 ? (
              <div className="panel__empty">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="#E8E3DC" strokeWidth="1.5"/>
                  <path d="M13 20h14M20 13v14" stroke="#D0C8BE" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                </svg>
                <p>No events on this day</p>
                <p className="panel__empty-hint">Click "+ Add Event" to schedule something.</p>
              </div>
            ) : (
              <ul className="panel__list">
                {dayEvents.map((event) => {
                  const meta      = EVENT_TYPE_META[event.type] ?? EVENT_TYPE_META['meeting'];
                  const confirming = confirmId === event.id;

                  return (
                    <li key={event.id} className={`panel__event${confirming ? ' panel__event--confirming' : ''}`}>
                      <div className="panel__event-bar" style={{ background: meta.dot }} />
                      <div className="panel__event-body">

                        {/* Top row: type tag + delete control */}
                        <div className="panel__event-top">
                          <span
                            className="panel__event-tag"
                            style={{ background: meta.bg, color: meta.text }}
                          >
                            {meta.label}
                          </span>

                          {confirming ? (
                            <div className="panel__confirm">
                              <button
                                className="panel__confirm-cancel"
                                onClick={() => setConfirmId(null)}
                              >
                                Keep
                              </button>
                              <button
                                className="panel__confirm-delete"
                                onClick={() => handleDelete(event.id)}
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <button
                              className="panel__delete"
                              onClick={() => setConfirmId(event.id)}
                              aria-label="Delete event"
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 4h10M5.5 4V2.5h3V4M4 4l.8 7.5h4.4L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Who added this */}
                        {event.createdBy && (
                          <p className="panel__event-person">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.1"/>
                              <path d="M1.5 10.5c0-2.21 2.015-4 4.5-4s4.5 1.79 4.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                            </svg>
                            {event.createdBy}
                          </p>
                        )}

                        {/* Optional note */}
                        {event.note && (
                          <p className="panel__event-note">{event.note}</p>
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

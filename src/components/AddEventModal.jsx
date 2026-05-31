import React, { useState } from 'react';
import { EVENT_TYPES, EVENT_TYPE_META } from '../constants';

const toDateStr = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    : '';

// Minimal form: type, date, note. Name is read from localStorage (passed as
// currentUser) so the user never has to type it themselves.
const AddEventModal = ({ onClose, onSave, initialDate, currentUser }) => {
  const start0 = toDateStr(initialDate) || toDateStr(new Date());
  const [type, setType]       = useState(EVENT_TYPES.MEETING);
  const [isRange, setIsRange] = useState(false);
  const [date, setDate]       = useState(start0);
  const [endDate, setEndDate] = useState(start0);
  const [note, setNote]       = useState('');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) { setError('Please choose a date.'); return; }
    if (isRange && endDate < date) {
      setError('End date must be on or after the start date.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({
        type,
        startDate: date,
        endDate: isRange ? endDate : date,
        createdBy: currentUser,
        note,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save event:', err);
      setError('Could not save. Check your internet connection and try again.');
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={saving ? undefined : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal__head">
          <div className="modal__head-left">
            <h2 className="modal__title">New Event</h2>
            <span className="modal__user-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.1"/>
                <path d="M1.5 10.5c0-2.21 2.015-4 4.5-4s4.5 1.79 4.5 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
              </svg>
              {currentUser}
            </span>
          </div>
          <button className="modal__close" onClick={onClose} disabled={saving} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>

          {/* Event type — the primary choice, made large and tappable */}
          <div className="field">
            <label className="field__label">What type of event?</label>
            <div className="type-grid type-grid--large">
              {Object.values(EVENT_TYPES).map((t) => {
                const meta   = EVENT_TYPE_META[t];
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    className={`type-btn type-btn--large${active ? ' type-btn--active' : ''}`}
                    style={active ? { background: meta.bg, borderColor: meta.dot, color: meta.text } : {}}
                    onClick={() => setType(t)}
                    aria-pressed={active}
                  >
                    <span className="type-btn__dot" style={{ background: meta.dot }} />
                    {meta.label}
                    {active && (
                      <svg className="type-btn__check" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l4 4 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Single day vs date range toggle */}
          <div className="field">
            <label className="field__label">When?</label>
            <div className="seg">
              <button
                type="button"
                className={`seg__btn${!isRange ? ' seg__btn--active' : ''}`}
                onClick={() => setIsRange(false)}
                aria-pressed={!isRange}
              >
                Single Day
              </button>
              <button
                type="button"
                className={`seg__btn${isRange ? ' seg__btn--active' : ''}`}
                onClick={() => {
                  setIsRange(true);
                  if (endDate < date) setEndDate(date);
                }}
                aria-pressed={isRange}
              >
                Date Range
              </button>
            </div>
          </div>

          {/* Date(s) */}
          {isRange ? (
            <div className="field-row">
              <div className="field">
                <label className="field__label" htmlFor="evt-date">Start date</label>
                <input
                  id="evt-date"
                  className="field__input"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (endDate < e.target.value) setEndDate(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="evt-end">End date</label>
                <input
                  id="evt-end"
                  className="field__input"
                  type="date"
                  value={endDate}
                  min={date}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="field">
              <label className="field__label" htmlFor="evt-date">Date</label>
              <input
                id="evt-date"
                className="field__input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          )}

          {/* Note (optional) */}
          <div className="field">
            <label className="field__label" htmlFor="evt-note">
              Note <span className="field__optional">(optional)</span>
            </label>
            <textarea
              id="evt-note"
              className="field__input field__textarea"
              placeholder="e.g. Doctor's appointment, client call at 2pm…"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={400}
            />
          </div>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving || !date}>
              {saving ? (
                <>
                  <span className="btn-spinner" />
                  Saving…
                </>
              ) : 'Add to Calendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;

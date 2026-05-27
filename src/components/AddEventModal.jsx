import React, { useState } from 'react';
import { EVENT_TYPES, EVENT_TYPE_META } from '../data/mockData';

const toDateStr = (d) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    : '';

const PEOPLE = ['King', 'Michael', 'Sarah', 'Marcus', 'Rachel', 'All Team'];

const AddEventModal = ({ onClose, onSave, initialDate }) => {
  const [form, setForm] = useState({
    title:       '',
    type:        EVENT_TYPES.MEETING,
    date:        toDateStr(initialDate) || toDateStr(new Date()),
    startTime:   '',
    endTime:     '',
    person:      '',
    description: '',
  });

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title">New Event</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="field">
            <label className="field__label">Title</label>
            <input
              className="field__input"
              type="text"
              placeholder="e.g. Team Meeting"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              autoFocus
            />
          </div>

          {/* Type */}
          <div className="field">
            <label className="field__label">Type</label>
            <div className="type-grid">
              {Object.values(EVENT_TYPES).map((type) => {
                const meta = EVENT_TYPE_META[type];
                const active = form.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    className={`type-btn${active ? ' type-btn--active' : ''}`}
                    style={active ? { background: meta.bg, borderColor: meta.dot, color: meta.text } : {}}
                    onClick={() => set('type', type)}
                  >
                    <span className="type-btn__dot" style={{ background: meta.dot }} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + Person */}
          <div className="field-row">
            <div className="field">
              <label className="field__label">Date</label>
              <input
                className="field__input"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label">Person</label>
              <select
                className="field__input"
                value={form.person}
                onChange={(e) => set('person', e.target.value)}
              >
                <option value="">Select…</option>
                {PEOPLE.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Time */}
          <div className="field-row">
            <div className="field">
              <label className="field__label">Start time</label>
              <input
                className="field__input"
                type="time"
                value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label">End time</label>
              <input
                className="field__input"
                type="time"
                value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="field">
            <label className="field__label">Notes</label>
            <textarea
              className="field__input field__textarea"
              placeholder="Optional description…"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;

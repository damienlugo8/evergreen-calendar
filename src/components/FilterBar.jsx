import React, { useState, useRef, useEffect } from 'react';
import { TEAM_MEMBERS } from '../constants';

// Custom dropdown to filter the calendar by person. Matches the month picker
// styling — no native <select>.
const FilterBar = ({ active, onToggle, onToggleAll }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const allOn = active.size === TEAM_MEMBERS.length;

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Trigger label: "All Team", a name list, or "No one".
  let label;
  if (allOn) label = 'All Team';
  else if (active.size === 0) label = 'No one';
  else label = TEAM_MEMBERS.filter((n) => active.has(n)).join(', ');

  return (
    <div className="filterbar">
      <span className="filterbar__label">Show</span>

      <div className="filter-dd" ref={ref}>
        <button
          className={`filter-dd__trigger${!allOn ? ' filter-dd__trigger--active' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <svg className="filter-dd__people" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M11 3.2A2.2 2.2 0 0 1 11 7.4M11.5 9.2c1.8.2 3 1.6 3 3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className="filter-dd__label">{label}</span>
          <svg className="filter-dd__caret" width="11" height="11" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {open && (
          <div className="filter-dd__menu" role="menu">
            <button className="filter-dd__row filter-dd__row--all" onClick={onToggleAll}>
              <span className={`filter-dd__check${allOn ? ' filter-dd__check--on' : ''}`}>
                {allOn && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="filter-dd__name filter-dd__name--all">All Team</span>
            </button>

            <div className="filter-dd__divider" />

            {TEAM_MEMBERS.map((name) => {
              const on = active.has(name);
              return (
                <button
                  key={name}
                  className="filter-dd__row"
                  onClick={() => onToggle(name)}
                  role="menuitemcheckbox"
                  aria-checked={on}
                >
                  <span className={`filter-dd__check${on ? ' filter-dd__check--on' : ''}`}>
                    {on && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.2l2.3 2.3L9.5 3.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="filter-dd__name">{name}</span>
                </button>
              );
            })}

            <div className="filter-dd__divider" />
            <button className="filter-dd__done" onClick={() => setOpen(false)}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;

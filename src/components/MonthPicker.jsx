import React, { useState, useEffect, useRef } from 'react';
import { MONTHS_SHORT } from '../utils/dates';

// Floating custom date picker — replaces native <select> dropdowns.
// Lets the user pick a month from a 3×4 grid and step the year, then jump.
const MonthPicker = ({ viewDate, onJump, onClose }) => {
  const [year, setYear] = useState(viewDate.getFullYear());
  const ref = useRef(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const pick = (monthIndex) => {
    onJump(year, monthIndex);
    onClose();
  };

  return (
    <div className="mpick" ref={ref} role="dialog" aria-label="Pick month and year">
      <div className="mpick__year-row">
        <button
          className="mpick__year-arrow"
          onClick={() => setYear((y) => y - 1)}
          aria-label="Previous year"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="mpick__year">{year}</span>
        <button
          className="mpick__year-arrow"
          onClick={() => setYear((y) => y + 1)}
          aria-label="Next year"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="mpick__grid">
        {MONTHS_SHORT.map((m, i) => {
          const active = i === viewDate.getMonth() && year === viewDate.getFullYear();
          return (
            <button
              key={m}
              className={`mpick__month${active ? ' mpick__month--active' : ''}`}
              onClick={() => pick(i)}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthPicker;

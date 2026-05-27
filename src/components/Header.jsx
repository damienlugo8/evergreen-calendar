import React from 'react';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// currentUser: string name from localStorage
// onChangeName: opens the NameModal again so user can switch
const Header = ({ viewDate, onPrev, onNext, onToday, onAddEvent, currentUser, onChangeName }) => {
  return (
    <header className="header">
      <div className="header__brand">
        <svg className="header__icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#1E3A5F"/>
          <rect x="8" y="9"  width="16" height="2" rx="1" fill="#F5F0EB"/>
          <rect x="8" y="14" width="11" height="2" rx="1" fill="#F5F0EB" opacity="0.7"/>
          <rect x="8" y="19" width="14" height="2" rx="1" fill="#F5F0EB" opacity="0.5"/>
        </svg>
        <span className="header__brand-name">Evergreen</span>
      </div>

      <div className="header__nav">
        <button className="header__today-pill" onClick={onToday}>Today</button>
        <div className="header__arrow-group">
          <button className="header__arrow" onClick={onPrev} aria-label="Previous month">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="header__arrow" onClick={onNext} aria-label="Next month">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <h1 className="header__title">
          {MONTHS[viewDate.getMonth()]}
          <span className="header__year">{viewDate.getFullYear()}</span>
        </h1>
      </div>

      <div className="header__right">
        {/* Current user pill — click to change name */}
        {currentUser && (
          <button
            className="header__user-pill"
            onClick={onChangeName}
            title="Change your name"
          >
            <span className="header__user-avatar">
              {currentUser.charAt(0).toUpperCase()}
            </span>
            <span className="header__user-name">{currentUser}</span>
          </button>
        )}

        <button className="header__add-btn" onClick={onAddEvent}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add Event
        </button>
      </div>
    </header>
  );
};

export default Header;

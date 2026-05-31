import React, { useState, useRef } from 'react';
import { TEAM_MEMBERS } from '../constants';

// Shown once on first visit. Saves the chosen name to localStorage so the
// user never has to pick again unless they clear their browser data.
const NameModal = ({ onConfirm, onClose, canClose }) => {
  const [selected, setSelected] = useState('');
  const [custom, setCustom]     = useState('');
  const inputRef = useRef(null);

  const activeName = selected || custom.trim();

  const handleTeamClick = (name) => {
    setSelected(name);
    setCustom('');
  };

  const handleCustomChange = (e) => {
    setCustom(e.target.value);
    setSelected('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeName) onConfirm(activeName);
  };

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter' && custom.trim()) onConfirm(custom.trim());
  };

  return (
    <div className="overlay overlay--welcome">
      <div className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        {canClose && (
          <button
            type="button"
            className="welcome-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {/* Logo mark */}
        <div className="welcome-modal__logo">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="12" fill="#1E3A5F"/>
            <rect x="11" y="13" width="22" height="2.5" rx="1.25" fill="#F5F0EB"/>
            <rect x="11" y="20" width="15" height="2.5" rx="1.25" fill="#F5F0EB" opacity="0.65"/>
            <rect x="11" y="27" width="18" height="2.5" rx="1.25" fill="#F5F0EB" opacity="0.4"/>
          </svg>
          <span className="welcome-modal__brand">Evergreen Calendar</span>
        </div>

        <div className="welcome-modal__body">
          <h1 id="welcome-title" className="welcome-modal__title">Welcome to the team calendar</h1>
          <p className="welcome-modal__subtitle">
            Select your name so your teammates know who added each event.
            You'll only need to do this once.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Team member grid */}
            <p className="welcome-modal__section-label">Select your name</p>
            <div className="name-grid">
              {TEAM_MEMBERS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`name-btn${selected === name ? ' name-btn--active' : ''}`}
                  onClick={() => handleTeamClick(name)}
                  aria-pressed={selected === name}
                >
                  <span className="name-btn__avatar">
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <span className="name-btn__label">{name}</span>
                  {selected === name && (
                    <svg className="name-btn__check" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Custom name input */}
            <div className="welcome-modal__divider">
              <span>or enter a different name</span>
            </div>

            <input
              ref={inputRef}
              className="field__input welcome-modal__custom-input"
              type="text"
              placeholder="Type your name…"
              value={custom}
              onChange={handleCustomChange}
              onKeyDown={handleCustomKeyDown}
              maxLength={40}
              autoComplete="off"
            />

            <button
              type="submit"
              className="btn-primary welcome-modal__cta"
              disabled={!activeName}
            >
              Get Started
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NameModal;

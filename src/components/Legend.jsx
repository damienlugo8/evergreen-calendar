import React from 'react';
import { EVENT_TYPE_META } from '../data/mockData';

const Legend = () => (
  <div className="legend">
    {Object.entries(EVENT_TYPE_META).map(([type, meta]) => (
      <div key={type} className="legend__item">
        <span className="legend__dot" style={{ background: meta.dot }} />
        <span className="legend__label">{meta.label}</span>
      </div>
    ))}
  </div>
);

export default Legend;

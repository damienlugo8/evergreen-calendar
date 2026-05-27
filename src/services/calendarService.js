// calendarService.js — mock implementation (Phase 1)
//
// Phase 2: replace each function body with the equivalent Firebase
// Firestore call. Function signatures and return shapes are intentionally
// identical to what Firestore would return so the swap is surgical.

import { MOCK_EVENTS } from '../data/mockData';

// In-memory store — survives re-renders but resets on page reload
let _store = [...MOCK_EVENTS];

export const getEvents = async () => {
  return [..._store];
};

export const addEvent = async (event) => {
  const newEvent = { ...event, id: `evt-${Date.now()}` };
  _store = [..._store, newEvent];
  return newEvent;
};

export const updateEvent = async (id, updates) => {
  _store = _store.map((e) => (e.id === id ? { ...e, ...updates } : e));
  return _store.find((e) => e.id === id);
};

export const deleteEvent = async (id) => {
  _store = _store.filter((e) => e.id !== id);
  return id;
};

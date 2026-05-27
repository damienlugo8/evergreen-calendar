// calendarService.js — Firestore implementation (Phase 2).
//
// All reads use onSnapshot so every connected browser updates
// the moment any team member writes to the "events" collection.

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { EVENT_TYPE_META } from '../constants';

const COLLECTION = 'events';

// Subscribe to all events. Returns the unsubscribe function — call it on
// component unmount to avoid memory leaks.
export const subscribeToEvents = (onUpdate, onError) => {
  const q = query(collection(db, COLLECTION), orderBy('date', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(events);
    },
    onError,
  );
};

// Write a new event. `title` is auto-derived from the event type so the
// form only needs: type, date, createdBy, note.
export const addEvent = async ({ type, date, createdBy, note }) => {
  return addDoc(collection(db, COLLECTION), {
    title:     EVENT_TYPE_META[type].label,
    type,
    date,
    createdBy: createdBy || 'Team',
    note:      note?.trim() || '',
    createdAt: serverTimestamp(),
  });
};

export const deleteEvent = async (id) => {
  return deleteDoc(doc(db, COLLECTION, id));
};

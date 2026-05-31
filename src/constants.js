// constants.js — event type definitions.
// These drive the UI (colors, labels) and are referenced everywhere.
// Edit TEAM_MEMBERS to match your actual team.

export const EVENT_TYPES = {
  MEETING:       'meeting',
  TIME_OFF:      'time-off',
  WFH:           'wfh',
  OUT_OF_OFFICE: 'out-of-office',
};

export const EVENT_TYPE_META = {
  meeting: {
    label: 'Meeting',
    dot:   'var(--c-meeting-dot)',
    bg:    'var(--c-meeting-bg)',
    text:  'var(--c-meeting-tx)',
  },
  'time-off': {
    label: 'Time Off',
    dot:   'var(--c-timeoff-dot)',
    bg:    'var(--c-timeoff-bg)',
    text:  'var(--c-timeoff-tx)',
  },
  wfh: {
    label: 'WFH',
    dot:   'var(--c-wfh-dot)',
    bg:    'var(--c-wfh-bg)',
    text:  'var(--c-wfh-tx)',
  },
  'out-of-office': {
    label: 'Out of Office',
    dot:   'var(--c-ooo-dot)',
    bg:    'var(--c-ooo-bg)',
    text:  'var(--c-ooo-tx)',
  },
};

// Edit these names to match your actual team.
export const TEAM_MEMBERS = ['Marc', 'Damien', 'Dan', 'Michael', 'King', 'Jason', 'Richard'];

export const LOCAL_STORAGE_KEY = 'evg_user';

// Per-device key for the "Show" person filter. This is a personal view
// preference — it is saved locally on each device and is NEVER synced to
// Firestore, so one person's filter never affects anyone else's calendar.
export const FILTER_STORAGE_KEY = 'evg_filter';

// firebase.js — initialize Firebase and export the Firestore instance.
//
// ─── SETUP STEPS ────────────────────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com
// 2. Create a project (or use an existing one)
// 3. Add a Web app (</> icon) to get your config values
// 4. Replace the placeholder strings below with your real config
// 5. In Firestore → Rules, paste the rules below so everyone on the team
//    can read and write without logging in:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /events/{eventId} {
//          allow read, write: if true;
//        }
//      }
//    }
// ────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

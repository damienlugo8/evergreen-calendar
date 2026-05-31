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
  apiKey: "AIzaSyDjTrt1tVPhzGubzYOyws99z3RAYaDaKvc",
  authDomain: "evergreen-calendar-cf583.firebaseapp.com",
  projectId: "evergreen-calendar-cf583",
  storageBucket: "evergreen-calendar-cf583.firebasestorage.app",
  messagingSenderId: "207678824003",
  appId: "1:207678824003:web:ffd8dbe63f90bd8983fef6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

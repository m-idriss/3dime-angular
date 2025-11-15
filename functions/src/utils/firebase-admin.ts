import { initializeApp, getApps } from "firebase-admin/app";

/**
 * Initialize Firebase Admin SDK if not already initialized
 * This prevents multiple initialization errors when importing across modules
 */
export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    initializeApp();
  }
}

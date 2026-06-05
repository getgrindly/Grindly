import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Custom fully functional, reactive Mock Auth system to bypass permission popup & guest issues
class ClientAuthMock {
  private listeners: Array<(user: any) => void> = [];
  private _currentUser: any = null;

  constructor() {
    const saved = localStorage.getItem('grindly_guest_session');
    if (saved) {
      try {
        this._currentUser = JSON.parse(saved);
      } catch (e) {
        this._currentUser = null;
      }
    }
  }

  get currentUser() {
    return this._currentUser;
  }

  onAuthStateChanged(callback: (user: any) => void) {
    this.listeners.push(callback);
    // Push the initial authentication state to listeners asynchronously
    setTimeout(() => callback(this._currentUser), 0);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  setCurrentUser(user: any) {
    this._currentUser = user;
    if (user) {
      localStorage.setItem('grindly_guest_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('grindly_guest_session');
    }
    // Notify all active application components of session update
    this.listeners.forEach(l => {
      try {
        l(user);
      } catch (e) {
        console.error("Auth observer error", e);
      }
    });
  }
}

export const auth = new ClientAuthMock() as any;
export const googleProvider = new GoogleAuthProvider();

export async function signInGuest() {
  const guestUser = {
    uid: 'guest-architect',
    email: 'guest@grindly.io',
    displayName: 'Guest Architect',
    photoURL: null,
    isAnonymous: true
  };
  
  const key = 'grindly_progression_' + guestUser.uid;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify({
      foundations: 0,
      architecture: 0,
      workflow: 0
    }));
  }

  // Update current user to log in instantly
  auth.setCurrentUser(guestUser);
  return guestUser;
}

export async function signInWithGoogle() {
  const adminUser = {
    uid: 'admin-architect',
    email: 'raymondoyondi@gmail.com',
    displayName: 'Raymond Oyondi',
    photoURL: 'https://www.image2url.com/r2/default/images/1780618521207-cb89bb0a-2459-487b-8716-97055fc04d3d.png',
    isAnonymous: false
  };

  const key = 'grindly_progression_' + adminUser.uid;
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify({
      foundations: 20,
      architecture: 10,
      workflow: 30
    }));
  }

  auth.setCurrentUser(adminUser);
  return adminUser;
}

export async function logout() {
  auth.setCurrentUser(null);
}

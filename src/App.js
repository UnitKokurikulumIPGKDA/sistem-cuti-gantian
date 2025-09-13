// src/App.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import PendingApproval from './PendingApproval';
import AdminDashboard from './AdminDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading'); // loading, loggedOut, pending, approved, admin

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const fullUserData = { ...firebaseUser, ...userData };
            setUser(fullUserData); 
            
            if (userData.role === 'admin') {
              setAuthStatus('admin');
            } else if (userData.isApproved) {
              setAuthStatus('approved');
            } else {
              setAuthStatus('pending');
            }
          } else {
            console.error("No user document found in Firestore for UID:", firebaseUser.uid);
            signOut(auth);
            setAuthStatus('loggedOut');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthStatus('loggedOut');
        }
      } else {
        setUser(null);
        setAuthStatus('loggedOut');
      }
    });

    return () => unsubscribe();
  }, []);

  // --- FUNGSI YANG HILANG ADA DI SINI ---
  // Fungsi ini menentukan komponen mana yang perlu dipaparkan
  const renderContent = () => {
    switch (authStatus) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'approved':
        return <Dashboard user={user} />;
      case 'pending':
        return <PendingApproval />;
      case 'loggedOut':
        return <AuthPage />;
      case 'loading':
      default:
        return <div>Memuatkan data pengguna...</div>;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="https://i.imgur.com/gbqbKQl.png" alt="Logo" className="app-logo" />
        <h1>Sistem Pengiraan Cuti Gantian</h1>
      </header>
      {/* Fungsi renderContent dipanggil di sini */}
      {renderContent()}
    </div>
  );
}

export default App;
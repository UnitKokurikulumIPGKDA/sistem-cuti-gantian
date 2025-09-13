// src/PendingApproval.js
import React from 'react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const PendingApproval = () => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Akaun Anda Sedang Menunggu Kelulusan</h2>
      <p>Sila hubungi admin KeraBerok untuk mengaktifkan akaun anda.</p>
      <p>Terima kasih kerana mendaftar.</p>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Log Keluar</button>
    </div>
  );
};

export default PendingApproval;
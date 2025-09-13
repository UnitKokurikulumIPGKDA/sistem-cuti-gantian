// src/Dashboard.js
import React, { useState } from 'react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import OvertimeForm from './OvertimeForm';
import OvertimeLedger from './OvertimeLedger';
import ApplyLeaveForm from './ApplyLeaveForm';
import './Dashboard.css';
import { generatePdf } from './pdfGenerator'; // Import fungsi PDF

const Dashboard = ({ user }) => {
  const [balance, setBalance] = useState(0);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout Error:", error));
  };
  
  if (!user || !user.uid) {
    return <div className="app-container">Memuatkan data pengguna...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Selamat Datang, {user.name}!</h2>
        <div className="header-controls">
          <button onClick={() => generatePdf(user, balance)} className="pdf-button">Jana PDF</button>
          <button onClick={handleLogout} className="logout-button" title="Log Keluar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5zM14 2.1c1.21.41 2.32 1.18 3.21 2.24l-2.12 2.12c-.5-.66-1.1-1.2-1.78-1.58L14 2.1zM4.27 4.27l1.41 1.41C4.59 7.03 4 8.47 4 10c0 4.42 3.58 8 8 8 1.53 0 2.97-.43 4.31-1.27l1.41 1.41C16.32 19.34 14.26 20 12 20c-5.52 0-10-4.48-10-10 0-2.26.86-4.32 2.27-5.73z"/>
            </svg>
          </button>
        </div>
      </div>
      <p>Jabatan: {user.department}</p>
      
      <div className="dashboard-grid">
        <OvertimeForm user={user} />
        <OvertimeLedger user={user} setBalance={setBalance} /> 
      </div>

      <hr style={{margin: '2rem 0'}} />

      <ApplyLeaveForm user={user} balance={balance} />
    </div>
  );
};

export default Dashboard;
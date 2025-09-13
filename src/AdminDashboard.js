// src/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './Admin.css';

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, 'users');
      const data = await getDocs(usersCollectionRef);
      const userList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const approveUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, { isApproved: true });
    // Muat semula senarai pengguna untuk memaparkan status terkini
    const usersCollectionRef = collection(db, 'users');
    const data = await getDocs(usersCollectionRef);
    const userList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setUsers(userList);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // --- TAMBAHAN DI SINI ---
  // Semakan ini memastikan 'user' wujud sebelum cuba memaparkan namanya
  if (!user) {
    return <div>Memuatkan...</div>;
  }

  return (
    <div>
      <h2>Selamat Datang ke Panel Admin, {user.name}!</h2>
      <button onClick={handleLogout} className="logout-button" title="Log Keluar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 17v-3H9v-4h7V7l5 5-5 5zM14 2.1c1.21.41 2.32 1.18 3.21 2.24l-2.12 2.12c-.5-.66-1.1-1.2-1.78-1.58L14 2.1zM4.27 4.27l1.41 1.41C4.59 7.03 4 8.47 4 10c0 4.42 3.58 8 8 8 1.53 0 2.97-.43 4.31-1.27l1.41 1.41C16.32 19.34 14.26 20 12 20c-5.52 0-10-4.48-10-10 0-2.26.86-4.32 2.27-5.73z"/>
        </svg>
      </button>
      <h3>Senarai Pengguna Berdaftar</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>E-mel</th>
            <th>Status</th>
            <th>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {u.isApproved 
                  ? <span className="status-approved">Diluluskan</span> 
                  : <span className="status-pending">Menunggu</span>}
              </td>
              <td>
                {!u.isApproved && (
                  <button onClick={() => approveUser(u.id)} className="approve-button">
                    Luluskan
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
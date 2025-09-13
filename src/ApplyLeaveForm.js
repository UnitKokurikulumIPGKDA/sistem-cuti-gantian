// src/ApplyLeaveForm.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, query, where, orderBy, getDocs, writeBatch, doc } from 'firebase/firestore';

const ApplyLeaveForm = ({ user, balance }) => {
  const [normalDays, setNormalDays] = useState(0);
  const [thursdayDays, setThursdayDays] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const totalNormalHours = normalDays * 9;
    const totalThursdayHours = thursdayDays * 7.5;
    let hoursToDeduct = totalNormalHours + totalThursdayHours;

    if (hoursToDeduct <= 0) {
      alert("Sila masukkan bilangan hari yang sah.");
      setLoading(false);
      return;
    }

    if (hoursToDeduct > balance) {
      alert(`Permohonan anda (${hoursToDeduct} jam) melebihi baki jam yang ada (${balance.toFixed(2)} jam).`);
      setLoading(false);
      return;
    }

    try {
      // 1. Dapatkan semua rekod kerja lebih masa yang sah (belum luput & masih ada baki)
      const userOvertimeRef = collection(db, 'users', user.uid, 'overtimeEntries');
      const q = query(
        userOvertimeRef,
        where('expiryDate', '>', new Date()), // Belum luput
        orderBy('expiryDate', 'asc') // Ambil yang paling lama dahulu (FIFO)
      );

      const querySnapshot = await getDocs(q);
      const entriesToUpdate = [];
      querySnapshot.forEach(doc => {
        const entry = { id: doc.id, ...doc.data() };
        // Pastikan rekod masih ada baki jam
        if (entry.durationHours > entry.usedHours) {
          entriesToUpdate.push(entry);
        }
      });
      
      // Gunakan 'batch' untuk memastikan semua kemas kini berjaya atau tiada langsung
      const batch = writeBatch(db);

      // 2. Logik FIFO: Tolak jam dari rekod paling lama dahulu
      for (const entry of entriesToUpdate) {
        if (hoursToDeduct <= 0) break;

        const availableHours = entry.durationHours - entry.usedHours;
        const hoursToUse = Math.min(hoursToDeduct, availableHours);
        
        const docRef = doc(db, 'users', user.uid, 'overtimeEntries', entry.id);
        batch.update(docRef, {
          usedHours: entry.usedHours + hoursToUse
        });

        hoursToDeduct -= hoursToUse;
      }
      
      // 3. Laksanakan semua kemas kini
      await batch.commit();

      setMessage('Permohonan cuti anda telah berjaya direkodkan!');
      setNormalDays(0);
      setThursdayDays(0);

    } catch (error) {
      console.error("Error applying leave: ", error);
      setMessage('Gagal memohon cuti. Sila cuba lagi.');
    }

    setLoading(false);
  };

  return (
    <div className="form-section-dashboard">
      <h3>Mohon Cuti Gantian</h3>
      <form onSubmit={handleApplyLeave}>
        <p>Baki Jam Tersedia: <strong>{balance.toFixed(2)}</strong> jam</p>
        <div className="form-group">
          <label>Bilangan Hari Ahad - Rabu (9 jam/hari)</label>
          <input 
            type="number" 
            min="0" 
            value={normalDays} 
            onChange={(e) => setNormalDays(parseInt(e.target.value) || 0)} 
          />
        </div>
        <div className="form-group">
          <label>Bilangan Hari Khamis (7.5 jam/hari)</label>
          <input 
            type="number" 
            min="0" 
            value={thursdayDays} 
            onChange={(e) => setThursdayDays(parseInt(e.target.value) || 0)} 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Memohon...' : 'Mohon Cuti'}
        </button>
        {message && <p className="success-message" style={{marginTop: '1rem'}}>{message}</p>}
      </form>
    </div>
  );
};

export default ApplyLeaveForm;
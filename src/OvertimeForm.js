// src/OvertimeForm.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const OvertimeForm = ({ user }) => {
  const [taskDate, setTaskDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- TAMBAHAN DI SINI ---
    // 'Pemeriksa keselamatan' untuk memastikan user.uid wujud
    if (!user || !user.uid) {
      setMessage('Ralat: Maklumat pengguna tidak dijumpai. Sila log masuk semula.');
      return;
    }

    setMessage('');

    const start = new Date(`${taskDate}T${startTime}`);
    const end = new Date(`${taskDate}T${endTime}`);
    let durationHours = (end - start) / (1000 * 60 * 60);

    if (durationHours < 0) {
      durationHours += 24;
    }

    if (isNaN(durationHours) || durationHours <= 0) {
        alert("Sila pastikan tarikh dan masa adalah betul.");
        return;
    }

    const expiryDate = new Date(start);
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    try {
      const userOvertimeRef = collection(db, 'users', user.uid, 'overtimeEntries');
      await addDoc(userOvertimeRef, {
        taskDate,
        taskDescription,
        startTime,
        endTime,
        durationHours: parseFloat(durationHours.toFixed(2)),
        createdAt: serverTimestamp(),
        expiryDate: expiryDate,
        usedHours: 0,
        isExpired: false
      });

      setMessage('Rekod kerja lebih masa berjaya disimpan!');
      setTaskDate('');
      setTaskDescription('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage('Gagal menyimpan rekod. Sila cuba lagi.');
    }
  };

  return (
    <div className="form-section-dashboard">
      <h3>Tambah Rekod Kerja Lebih Masa</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tarikh Tugasan</label>
          <input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Keterangan Tugasan</label>
          <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Masa Mula</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Masa Tamat</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
        </div>
        <button type="submit">Simpan Rekod</button>
        {message && <p className="success-message" style={{marginTop: '1rem'}}>{message}</p>}
      </form>
    </div>
  );
};

export default OvertimeForm;
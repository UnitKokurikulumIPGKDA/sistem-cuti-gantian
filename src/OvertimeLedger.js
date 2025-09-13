// src/OvertimeLedger.js
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore'; 
import './Ledger.css';
import EditEntryModal from './EditEntryModal';

const OvertimeLedger = ({ user, setBalance }) => {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ earned: 0, used: 0, balance: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) return;
    
    const userOvertimeRef = collection(db, 'users', user.uid, 'overtimeEntries');
    const q = query(userOvertimeRef, orderBy('taskDate', 'desc')); // Tarikh terkini di atas
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const overtimeEntries = [];
      querySnapshot.forEach((doc) => {
        overtimeEntries.push({ id: doc.id, ...doc.data() });
      });
      setEntries(overtimeEntries);

      let totalEarned = 0, totalUsed = 0;
      const now = new Date();
      overtimeEntries.forEach(entry => {
        if (entry.expiryDate && entry.expiryDate.toDate() > now) {
          totalEarned += entry.durationHours;
          totalUsed += entry.usedHours;
        }
      });
      const currentBalance = totalEarned - totalUsed;
      setSummary({ earned: totalEarned, used: totalUsed, balance: currentBalance });
      if (typeof setBalance === 'function') setBalance(currentBalance);
    });
    
    return () => unsubscribe();
  }, [user, setBalance]);

  // ... (Fungsi handleDelete, handleEditClick, handleSave tidak berubah)
  const handleDelete = async (entryId) => {
    if (window.confirm("Adakah anda pasti mahu memadam rekod ini?")) {
      try {
        const entryDocRef = doc(db, 'users', user.uid, 'overtimeEntries', entryId);
        await deleteDoc(entryDocRef);
      } catch (error) { console.error("Error deleting document: ", error); alert("Gagal memadam rekod."); }
    }
  };
  const handleEditClick = (entry) => {
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };
  const handleSave = async (updatedData) => {
    const { id, taskDate, taskDescription, startTime, endTime } = updatedData;
    const start = new Date(`${taskDate}T${startTime}`);
    const end = new Date(`${taskDate}T${endTime}`);
    let durationHours = (end - start) / (1000 * 60 * 60);
    if (durationHours < 0) durationHours += 24;
    try {
      const entryDocRef = doc(db, 'users', user.uid, 'overtimeEntries', id);
      await updateDoc(entryDocRef, {
        taskDate, taskDescription, startTime, endTime,
        durationHours: parseFloat(durationHours.toFixed(2))
      });
      setIsModalOpen(false);
    } catch (error) { console.error("Error updating document: ", error); alert("Gagal mengemas kini rekod."); }
  };

  return (
    <div className="ledger-section">
      <h3>Rekod & Baki Cuti Gantian</h3>
      <div className="summary-boxes">
        <div className="summary-box"><h4>Jam Diperoleh</h4><p>{summary.earned.toFixed(2)}</p></div>
        <div className="summary-box"><h4>Jam Digunakan</h4><p>{summary.used.toFixed(2)}</p></div>
        <div className="summary-box balance"><h4>Baki Jam</h4><p>{summary.balance.toFixed(2)}</p></div>
      </div>
      
      {/* --- PERUBAHAN STRUKTUR KEMBALI KEPADA JADUAL --- */}
      <div className="ledger-container">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>BIL.</th>
              <th>TUGASAN RASMI</th>
              <th>TARIKH</th>
              <th>TEMPOH</th>
              <th>JUMLAH MASA</th>
              <th>TINDAKAN</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const duration = entry.durationHours;
              const hours = Math.floor(duration);
              const minutes = Math.round((duration - hours) * 60);

              return (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.taskDescription}</td>
                  <td>{entry.taskDate}</td>
                  <td>{entry.startTime} - {entry.endTime}</td>
                  <td>{hours}j {minutes}m</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditClick(entry)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(entry.id)}>Padam</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* --- TAMAT PERUBAHAN --- */}

      {isModalOpen && (
        <EditEntryModal
          entry={currentEntry}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default OvertimeLedger;
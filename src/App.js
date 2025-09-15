// src/App.js

import React, { useState } from 'react';
import OvertimeForm from './OvertimeForm'; // Import komponen borang yang kita baru cipta
import './App.css'; // Import fail untuk penggayaan (styling)

function App() {
  // Di sini kita akan simpan senarai semua rekod kerja lebih masa
  const [overtimeList, setOvertimeList] = useState([]);

  // Fungsi untuk menambah rekod baharu ke dalam senarai 'overtimeList'
  // Kita akan gunakannya nanti
  const addOvertimeRecord = (record) => {
    setOvertimeList([...overtimeList, record]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistem Pengurusan Kerja Lebih Masa</h1>
      </header>
      <main>
        <OvertimeForm /> {/* Ini akan memaparkan borang yang kita cipta tadi */}
      </main>
    </div>
  );
}

export default App;

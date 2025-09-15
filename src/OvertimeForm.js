// src/OvertimeForm.js

import React, { useState } from 'react';

function OvertimeForm() {
  // 'useState' digunakan untuk menyimpan data yang dimasukkan oleh pengguna dalam setiap medan input
  const [date, setDate] = useState('');
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Fungsi ini akan dipanggil apabila butang 'Simpan' ditekan
  const handleSubmit = (event) => {
    event.preventDefault(); // Menghalang halaman daripada refresh
    console.log({ date, task, startTime, endTime }); // Paparkan data di console untuk ujian
    // Nanti kita akan hantar data ini ke komponen utama (App.js)
  };

  return (
    <form onSubmit={handleSubmit} className="overtime-form">
      <h3>Tambah Rekod Kerja Lebih Masa</h3>
      <div className="form-group">
        <label>Tarikh:</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Tugasan:</label>
        <input 
          type="text" 
          placeholder="Cth: Pegawai Bertugas Gotong Royong"
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Masa Mula:</label>
        <input 
          type="time" 
          value={startTime} 
          onChange={(e) => setStartTime(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Masa Tamat:</label>
        <input 
          type="time" 
          value={endTime} 
          onChange={(e) => setEndTime(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Simpan Rekod</button>
    </form>
  );
}

export default OvertimeForm;

// src/EditEntryModal.js
import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditEntryModal = ({ entry, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...entry });

  useEffect(() => {
    // Kemas kini borang jika entri berubah
    setFormData({ ...entry });
  }, [entry]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Rekod Kerja Lebih Masa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tarikh Tugasan</label>
            <input type="date" name="taskDate" value={formData.taskDate || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Keterangan Tugasan</label>
            <textarea name="taskDescription" value={formData.taskDescription || ''} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Masa Mula</label>
              <input type="time" name="startTime" value={formData.startTime || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Masa Tamat</label>
              <input type="time" name="endTime" value={formData.endTime || ''} onChange={handleChange} required />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">Batal</button>
            <button type="submit" className="button-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntryModal;
// src/SignUp.js
import React, { useState } from 'react';
import { auth, db } from './firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './Form.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name || !department || !email || !password) {
        setError("Sila isi semua ruangan.");
        return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        department: department,
        email: email,
        isApproved: false,
        role: 'user'
      });

      setMessage('Pendaftaran berjaya! Sila tunggu kelulusan dari Admin.');
      setName('');
      setDepartment('');
      setEmail('');
      setPassword('');

    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('E-mel ini telah didaftarkan.');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('Kata laluan mestilah sekurang-kurangnya 6 aksara.');
      } else {
        setError('Pendaftaran gagal. Sila cuba lagi.');
      }
      console.error("Firebase SignUp Error:", firebaseError);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSignUp}>
        <h2>Daftar Akaun Baharu</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="form-group">
          <label>Nama Penuh</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Jabatan / Unit</label>
          <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>E-mel</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Kata Laluan</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
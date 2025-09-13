import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './Form.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Validasi input awal
      if (!name || !department || !username || !email || !password) {
        setError('Sila isi semua medan.');
        setLoading(false);
        return;
      }

      // Semak username sudah wujud?
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('Nama pengguna ini telah digunakan. Sila pilih yang lain.');
        setLoading(false);
        return;
      }

      // Daftar pengguna
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data pengguna ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        department,
        username,
        email,
        isApproved: false,
        role: 'user'
      });

      setMessage('Pendaftaran berjaya! Sila tunggu kelulusan dari Admin.');
      // Reset form
      setName('');
      setDepartment('');
      setUsername('');
      setEmail('');
      setPassword('');

    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('E-mel ini telah didaftarkan.');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('Kata laluan mestilah sekurang-kurangnya 6 aksara.');
      } else {
        setError('Pendaftaran gagal. Sila cuba lagi.');
        console.error(firebaseError);
      }
    } finally {
      setLoading(false);
    }
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
          <label>Nama Pengguna (Username)</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
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

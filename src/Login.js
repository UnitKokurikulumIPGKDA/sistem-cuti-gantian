// src/Login.js
import React, { useState } from 'react';
import { auth } from './firebase'; // Import auth dari firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Form.css'; // Guna semula CSS dari borang pendaftaran

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gunakan fungsi Firebase untuk log masuk pengguna
      await signInWithEmailAndPassword(auth, email, password);
      alert('Log masuk berjaya!'); // Mesej sementara
    } catch (firebaseError) {
      // Tangani ralat jika e-mel/kata laluan salah
      setError('E-mel atau kata laluan tidak sah.');
      console.error("Firebase Login Error:", firebaseError);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin}>
        <h2>Log Masuk</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>E-mel</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Kata Laluan</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Sila Tunggu...' : 'Log Masuk'}
        </button>
      </form>
    </div>
  );
};

export default Login;
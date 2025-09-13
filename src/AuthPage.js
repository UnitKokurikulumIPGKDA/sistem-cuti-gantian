// src/AuthPage.js
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

const toggleContainerStyle = {
  textAlign: 'center',
  marginTop: '1.5rem',
};

const linkStyle = {
  color: '#3f51b5',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontWeight: '600'
};

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div>
      {isLoginView ? <Login /> : <SignUp />}

      <div style={toggleContainerStyle}>
        {isLoginView
          ? (
            <span>
              Tiada akaun? <span onClick={() => setIsLoginView(false)} style={linkStyle}>Daftar di sini</span>
            </span>
          )
          : (
            <span>
              Sudah ada akaun? <span onClick={() => setIsLoginView(true)} style={linkStyle}>Log masuk di sini</span>
            </span>
          )
        }
      </div>
    </div>
  );
};

// PASTIKAN BARIS INI WUJUD DI BAHAGIAN PALING BAWAH
export default AuthPage;
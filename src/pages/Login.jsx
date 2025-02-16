import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import '../styles/styles.css';
import Dashboard from './Dashboard';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegistering ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setIsAuthenticated(true);
    }
    console.log(data);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (isAuthenticated) {
    return <Dashboard username={username} onLogout={handleLogout} />;
  }

  return (
    <div className="login-container">
      <Tilt tiltMaxAngleX={25} tiltMaxAngleY={25} style={{ height: 'auto', width: '300px' }}>
        <div className="Tilt-inner">
          <h2>{isRegistering ? 'Register' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? '¿Tienes alguna cuenta? Login' : "¿No tienes ninguna cuenta? Registrate"}
          </button>
        </div>
      </Tilt>
    </div>
  );
};

export default Login;

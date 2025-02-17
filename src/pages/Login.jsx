import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import '../styles/styles.css';
import Dashboard from './Dashboard';
import UserDashboard from './UserDashboard';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/login';
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
      setUserRole(data.rol); // Asignamos el rol del usuario
    } else {
      console.log(data.error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setUserRole(''); // Reiniciamos el rol del usuario
  };

  if (isAuthenticated) {
    if (userRole === 'admin') {
      return <Dashboard username={username} onLogout={handleLogout} />;
    } else if (userRole === 'user') {
      return <UserDashboard username={username} onLogout={handleLogout} />;
    } else {
      return <div>Rol de usuario no reconocido.</div>;
    }
  }

  return (
    <div className="login-container">
      <Tilt tiltMaxAngleX={25} tiltMaxAngleY={25} style={{ height: 'auto', width: '300px' }}>
        <div className="Tilt-inner">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input type="text" id="username" name="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </Tilt>
    </div>
  );
};

export default Login;



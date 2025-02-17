import React, { useState } from 'react';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, role }),
    });
    const data = await response.json();
    if (response.ok) {
      onRegister(); // Callback para volver a la pantalla de login
      console.log('Registro exitoso:', data);
    } else {
      console.log('Error en el registro:', data.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input type="text" id="username" name="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <input type="text" id="role" name="role" className="form-control" value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

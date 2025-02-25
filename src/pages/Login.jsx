import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/styles.css';
import Dashboard from './Dashboard';
import UserDashboard from './UserDashboard';

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, 'El nombre de usuario es demasiado corto')
      .max(50, 'El nombre de usuario es demasiado largo')
      .required('El nombre de usuario es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
  });

  const handleSubmit = async (values) => {
    const url = 'http://localhost:5000/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (response.ok) {
      setIsAuthenticated(true);
      setUserRole(data.rol);
      setUsername(data.username);
    } else {
      console.log(data.error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setUsername('');
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        const response = await fetch('/dashboard');
        const data = await response.json();
        setUsername(data.username);
        setUserRole(data.rol);
      };
      fetchData();
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    if (userRole === 'admin') {
      return <Dashboard onLogout={handleLogout} />;
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
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Login</h2>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="form-group">
                      <label htmlFor="username">Usuario</label>
                      <Field type="text" id="username" name="username" className="form-control" />
                      <ErrorMessage name="username" component="div" className="text-danger" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Contraseña</label>
                      <Field type="password" id="password" name="password" className="form-control" />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
};

export default Login;
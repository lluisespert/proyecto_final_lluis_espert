import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/styles.css'; // Asegúrate de crear este archivo CSS

const Dashboard = () => {
  const baseURL = 'http://localhost:5000/api';

  const [esEditable, setEsEditable] = useState(false);
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editarTarea, setEditarTarea] = useState({});
  const [labelEdit, setLabelEdit] = useState('');
  const [descriptionEdit, setDescriptionEdit] = useState('');
  const [completedEdit, setCompletedEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const handleSubmitAdd = async (event) => {
    event.preventDefault();

    const dataToSend = {
      label: label,
      description: description,
      is_done: false,
      user_id: selectedUser
    };

    try {
      await axios.post(`${baseURL}/todos`, dataToSend);
      setLabel('');
      setDescription('');
      setSelectedUser('');
      getTodos();
    } catch (error) {
      console.log('error:', error.response.status, error.response.statusText);
    }
  };

  const handleEdit = (editarTarea) => {
    setEsEditable(true);
    setEditarTarea(editarTarea);
    setLabelEdit(editarTarea.label);
    setDescriptionEdit(editarTarea.description);
    setCompletedEdit(editarTarea.is_done);
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      label: labelEdit,
      description: descriptionEdit,
      is_done: completedEdit
    };

    try {
      await axios.put(`${baseURL}/todos/${editarTarea.id}`, dataToSend);
      getTodos();
      setEsEditable(false);
      setEditarTarea({});
      setLabelEdit('');
      setDescriptionEdit('');
      setCompletedEdit(false);
    } catch (error) {
      console.log('error:', error.response.status, error.response.statusText);
    }
  };

  const handleDelete = async (tareaId) => {
    try {
      await axios.delete(`${baseURL}/todos/${tareaId}`);
      getTodos();
    } catch (error) {
      console.log('error:', error.response.status, error.response.statusText);
    }
  };

  const getTodos = async () => {
    try {
      const response = await axios.get(`${baseURL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.log('error:', error.response.status, error.response.statusText);
    }
  };

  const getUsuarios = async () => {
    try {
      const response = await axios.get(`${baseURL}/users`);
      setUsuarios(response.data);
    } catch (error) {
      console.log('error:', error.response.status, error.response.statusText);
    }
  };

  useEffect(() => {
    getTodos();
    getUsuarios();
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/logout');
      console.log('Sesión cerrada');
      window.location.href = '/'; // Redirigir al índice después de cerrar la sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error.response.status, error.response.statusText);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-success">Gestión de tareas</h1>
      <button onClick={logout} className="btn btn-danger logout-btn">Logout</button>
      {esEditable ? (
        <form onSubmit={handleSubmitEdit}>
          <div className="text-start mb-3">
            <label htmlFor="labelEdit" className="form-label">Editar Nombre de la Tarea</label>
            <input type="text" className="form-control" id="labelEdit" value={labelEdit} onChange={(event) => { setLabelEdit(event.target.value) }} />
          </div>
          <div className="text-start mb-3">
            <label htmlFor="descriptionEdit" className="form-label">Editar Descripción de la Tarea</label>
            <textarea className="form-control" id="descriptionEdit" value={descriptionEdit} onChange={(event) => { setDescriptionEdit(event.target.value) }} />
          </div>
          <div className="text-start mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={completedEdit} onChange={(event) => { setCompletedEdit(event.target.checked) }} />
            <label className="form-check-label" htmlFor="exampleCheck1">Completada la tarea</label>
          </div>
          <button type="submit" className="btn btn-primary me-2">Enviar</button>
          <button type="reset" className="btn btn-secondary">Reset</button>
        </form>
      ) : (
        <form onSubmit={handleSubmitAdd}>
          <div className="text-start mb-3">
            <label htmlFor="label" className="form-label">Nombre de la Tarea</label>
            <input type="text" className="form-control" id="label" value={label} onChange={(event) => setLabel(event.target.value)} />
          </div>
          <div className="text-start mb-3">
            <label htmlFor="description" className="form-label">Descripción de la Tarea</label>
            <textarea className="form-control" id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div className="text-start mb-3">
            <label htmlFor="selectUser" className="form-label">Asignar Usuario</label>
            <select className="form-select" id="selectUser" value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)}>
              <option value="">Seleccione un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>{usuario.username}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Añadir Tarea</button>
        </form>
      )}
      <h2 className="text-primary mt-5">Lista de tareas</h2>
      <ul className="text-start list-group">
        {todos.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <div>
              {item.is_done ? <i className="fa fa-thumbs-up text-success me-2"></i> : <i className="fa fa-times-circle text-danger me-2"></i>}
              {item.label} - {item.description} - Asignado a: {item.assigned_user || "N/A"}
            </div>
            <div>
              <span onClick={() => handleEdit(item)}>
                <i className="fa fa-check-square-o text-primary me-2"></i>
              </span>
              <span onClick={() => handleDelete(item.id)}>
                <i className="fa fa-remove text-danger"></i>
              </span>
            </div>
          </li>
        ))}
        <li className="list-group-item text-end">{todos.length === 0 ? 'No hay tareas, añade nuevas tareas' : todos.length + ' tareas'}</li>
      </ul>
    </div>
  );
};

export default Dashboard;

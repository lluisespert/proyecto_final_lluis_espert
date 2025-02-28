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
  const [language, setLanguage] = useState('es'); // Estado para el idioma

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
      is_done: completedEdit,
      user_id: editarTarea.user_id // Asegúrate de enviar el user_id al editar
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

  const changeLanguageToEnglish = () => {
    setLanguage('en');
  };

  const changeLanguageToSpanish = () => {
    setLanguage('es');
  };

  return (
    <div className="container my-5">
     
      <div className="d-flex justify-content-center">
        <button onClick={logout} className="btn btn-danger me-2">Logout</button>
        <button onClick={changeLanguageToEnglish} className="btn btn-success me-2">English</button>
        <button onClick={changeLanguageToSpanish} className="btn btn-success me-2">Español</button>
      </div>
      <h1 className="text-3d mt-5">{language === 'es' ? 'Gestión de tareas' : 'Task Management'}</h1>
      {esEditable ? (
        <div className="card mb-3 card-custom mt-5">
          <div className="card-body">
            <h5 className="card-title">{language === 'es' ? 'Editar Tarea' : 'Edit Task'}</h5>
            <form onSubmit={handleSubmitEdit}>
              <div className="text-start mb-3">
                <label htmlFor="labelEdit" className="form-label">{language === 'es' ? 'Editar Nombre de la Tarea' : 'Edit Task Name'}</label>
                <input type="text" className="form-control" id="labelEdit" value={labelEdit} onChange={(event) => { setLabelEdit(event.target.value) }} />
              </div>
              <div className="text-start mb-3">
                <label htmlFor="descriptionEdit" className="form-label">{language === 'es' ? 'Editar Descripción de la Tarea' : 'Edit Task Description'}</label>
                <textarea className="form-control" id="descriptionEdit" value={descriptionEdit} onChange={(event) => { setDescriptionEdit(event.target.value) }} />
              </div>
              <div className="text-start mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={completedEdit} onChange={(event) => { setCompletedEdit(event.target.checked) }} />
                <label className="form-check-label" htmlFor="exampleCheck1">{language === 'es' ? 'Completada la tarea' : 'Task Completed'}</label>
              </div>
              <button type="submit" className="btn btn-primary me-2">{language === 'es' ? 'Enviar' : 'Submit'}</button>
              <button type="reset" className="btn btn-secondary">{language === 'es' ? 'Reset' : 'Reset'}</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="card mb-3 mt-5">
          <div className="card-body">
            <h5 className="card-title">{language === 'es' ? 'Añadir Tarea' : 'Add Task'}</h5>
            <form onSubmit={handleSubmitAdd}>
              <div className="text-start mb-3">
                <label htmlFor="label" className="form-label">{language === 'es' ? 'Nombre de la Tarea' : 'Task Name'}</label>
                <input type="text" className="form-control" id="label" value={label} onChange={(event) => setLabel(event.target.value)} />
              </div>
              <div className="text-start mb-3">
                <label htmlFor="description" className="form-label">{language === 'es' ? 'Descripción de la Tarea' : 'Task Description'}</label>
                <textarea className="form-control" id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
              </div>
              <div className="text-start mb-3">
                <label htmlFor="selectUser" className="form-label">{language === 'es' ? 'Asignar Usuario' : 'Assign User'}</label>
                <select className="form-select" id="selectUser" value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)}>
                  <option value="">{language === 'es' ? 'Seleccione un usuario' : 'Select a user'}</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>{usuario.username}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">{language === 'es' ? 'Añadir Tarea' : 'Add Task'}</button>
            </form>
          </div>
        </div>
      )}
      <h2 className="text-3d mt-5">{language === 'es' ? 'Lista de tareas' : 'Task List'}</h2>
      <ul className="text-start list-group">
        {todos.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <div>
              {item.is_done ? <i className="fa fa-thumbs-up text-success me-2"></i> : <i className="fa fa-times-circle text-danger me-2"></i>}
              {item.label} - {item.description} - {language === 'es' ? 'Asignado a' : 'Assigned to'}: {item.assigned_user || "N/A"} - {language === 'es' ? 'Estado' : 'Status'}: {item.is_done ? (language === 'es' ? 'Terminada' : 'Completed') : (language === 'es' ? 'Pendiente' : 'Pending')}
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
        <li className="list-group-item text-end">{todos.length === 0 ? (language === 'es' ? 'No hay tareas, añade nuevas tareas' : 'No tasks, add new tasks') : todos.length + (language === 'es' ? ' tareas' : ' tasks')}</li>
      </ul>
    </div>
  );
};

export default Dashboard;
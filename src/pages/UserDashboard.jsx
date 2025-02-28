import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css'; // Asegúrate de crear este archivo CSS

const UserDashboard = ({ username, userId, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [language, setLanguage] = useState('es'); // Estado para el idioma

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/todos?user_id=${userId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleCompleteTask = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      const completedAt = new Date().toISOString();
      await axios.put(`http://localhost:5000/api/todos/${taskId}`, { 
        label: taskToUpdate.label, 
        description: taskToUpdate.description, 
        is_done: true, 
        user_id: username, // Guardar el username en el campo user_id
        username: username,
        completed_at: completedAt
      });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, is_done: true, completed_at: completedAt } : task));
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewDescription(task.description);
    setNewLabel(task.label);
  };

  const handleSaveTask = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${taskId}`, { 
        description: newDescription, 
        label: newLabel, 
        is_done: editingTask.is_done, 
        user_id: username, // Guardar el username en el campo user_id
        username: username
      });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, description: newDescription, label: newLabel, user_id: username } : task));
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const changeLanguageToEnglish = () => {
    setLanguage('en');
  };

  const changeLanguageToSpanish = () => {
    setLanguage('es');
  };

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-center mb-3">
        <button onClick={onLogout} className="btn btn-danger me-2">Logout</button>
        <button onClick={changeLanguageToEnglish} className="btn btn-success me-2">English</button>
        <button onClick={changeLanguageToSpanish} className="btn btn-success me-2">Español</button>
      </div>
      <h1 className="text-center">{language === 'es' ? `Bienvenido, ${username}!` : `Welcome, ${username}!`}</h1>
      <h1>{language === 'es' ? 'Te muestro las tareas que tienes pendientes' : 'Here are your pending tasks'}</h1>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="card mb-3 mx-auto" style={{ maxWidth: '500px' }}>
            <div className="card-body">
              {editingTask && editingTask.id === task.id ? (
                <div>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="form-control mb-2"
                  />
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="form-control mb-2"
                  />
                  <button onClick={() => handleSaveTask(task.id)} className="btn btn-primary me-2">
                    {language === 'es' ? 'Guardar' : 'Save'}
                  </button>
                  <button onClick={() => setEditingTask(null)} className="btn btn-secondary">
                    {language === 'es' ? 'Cancelar' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <div>
                  <h5 className="card-title">{language === 'es' ? 'Nombre de la tarea' : 'Task Name'}: {task.label}</h5>
                  <p className="card-text">{language === 'es' ? 'Descripción de la tarea' : 'Task Description'}: {task.description}</p>
                  <p className="card-text">Status: {task.is_done ? (language === 'es' ? 'Terminada' : 'Completed') : (language === 'es' ? 'Pendiente' : 'Pending')}</p>
                  {task.assigned_at && (
                    <p className="card-text">{language === 'es' ? 'Asignada a las' : 'Assigned at'}: {new Date(task.assigned_at).toLocaleString()}</p>
                  )}
                  {task.is_done && task.completed_at && (
                    <p className="card-text">{language === 'es' ? 'Terminada a las' : 'Completed at'}: {new Date(task.completed_at).toLocaleString()}</p>
                  )}
                  {!task.is_done && (
                    <button onClick={() => handleCompleteTask(task.id)} className="btn btn-success me-2">
                      {language === 'es' ? 'Terminar la tarea' : 'Complete Task'}
                    </button>
                  )}
                  <button onClick={() => handleEditTask(task)} className="btn btn-warning">
                    {language === 'es' ? 'Editar la tarea' : 'Edit Task'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css'; // Asegúrate de crear este archivo CSS

const UserDashboard = ({ username, userId, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [newLabel, setNewLabel] = useState('');

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
      await axios.put(`http://localhost:5000/api/todos/${taskId}`, { 
        label: taskToUpdate.label, 
        description: taskToUpdate.description, 
        is_done: true, 
        user_id: username, // Guardar el username en el campo user_id
        username: username
      });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, is_done: true } : task));
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

  return (
    <div className="dashboard-container">
      <button onClick={onLogout} className="btn btn-danger logout-btn">Logout</button>
      <h1 className="text-center">Bienvenido, {username}!</h1>
      <h1> Te muestro las tareas que tienes pendientes</h1>
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
                    Save
                  </button>
                  <button onClick={() => setEditingTask(null)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h5 className="card-title">Nombre de la tarea: {task.label}</h5>
                  <p className="card-text">Descripción de la tarea: {task.description}</p>
                  <p className="card-text">Status: {task.is_done ? 'Terminada' : 'Pendiente'}</p>
                  {!task.is_done && (
                    <button onClick={() => handleCompleteTask(task.id)} className="btn btn-success me-2">
                      Terminar la tarea
                    </button>
                  )}
                  <button onClick={() => handleEditTask(task)} className="btn btn-warning">
                    Editar la tarea
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
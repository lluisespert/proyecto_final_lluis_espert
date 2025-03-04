import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../styles/styles.css'; // Asegúrate de crear este archivo CSS

const UserDashboard = ({ username, userId, onLogout }) => {
  const { t, i18n } = useTranslation();
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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-center mb-3">
        <button onClick={onLogout} className="btn btn-danger me-2">{t('logout')}</button>
        <button onClick={() => changeLanguage('en')} className="btn btn-success me-2">{t('english')}</button>
        <button onClick={() => changeLanguage('es')} className="btn btn-success me-2">{t('spanish')}</button>
      </div>
      <h1 className="text-center">{t('welcome', { username })}</h1>
      <h1>{t('pending_tasks')}</h1>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="card mb-3 mx-auto" style={{ maxWidth: '500px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <img 
                  src={`https://robohash.org/${task.id}.png?size=50x50`} 
                  alt="Avatar" 
                  className="rounded-circle me-3" 
                />
                <h5 className="card-title mb-0">{t('task_name')}: {task.label}</h5>
              </div>
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
                    {t('save')}
                  </button>
                  <button onClick={() => setEditingTask(null)} className="btn btn-secondary">
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="card-text">{t('task_description')}: {task.description}</p>
                  <p className="card-text">{t('status')}: {task.is_done ? t('completed') : t('pending')}</p>
                  {task.assigned_at && (
                    <p className="card-text">{t('assigned_at')}: {new Date(task.assigned_at).toLocaleString()}</p>
                  )}
                  {task.is_done && task.completed_at && (
                    <p className="card-text">{t('completed_at')}: {new Date(task.completed_at).toLocaleString()}</p>
                  )}
                  {!task.is_done && (
                    <button onClick={() => handleCompleteTask(task.id)} className="btn btn-success me-2">
                      {t('complete_task')}
                    </button>
                  )}
                  <button onClick={() => handleEditTask(task)} className="btn btn-warning">
                    {t('edit_task')}
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
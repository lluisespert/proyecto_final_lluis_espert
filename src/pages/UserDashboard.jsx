import React from 'react';

const UserDashboard = ({ username, onLogout }) => {
  return (
    <div className="dashboard-container">
      <h1>Welcome, {username}!</h1>
      <p>This is your user dashboard.</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;

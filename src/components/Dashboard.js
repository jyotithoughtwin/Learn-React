import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Auth.css";
import UserManagement from './userManagement';
import Home from './home';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();  

  const menuItems = [
    'Home',
    'Company Management',
    'Users Management',
    'User Profile'
  ];

  const handleLogout = () => {
    navigate('/login');  
  };

  return (
    <div style={{ display: 'flex' }}>
      <aside className="w-64">
        <h2 className="text-2xl">DASHBOARD</h2>
        <ul className="menu-list">
          {menuItems.map(item => (
            <li 
              key={item} 
              className={item === activeTab ? 'active' : ''} 
              onClick={() => setActiveTab(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </header>
        <div className="card">
          <div className="card-content">
            {activeTab === 'Home' && <Home />}
            {activeTab === 'Users Management' && <UserManagement />}
            {activeTab !== 'Home' && activeTab !== 'Users Management' && (
              <>
                <h3>{activeTab}</h3>
                <p>Content for {activeTab} goes here...</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

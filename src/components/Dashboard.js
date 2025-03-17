import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import "../styles/Auth.css";

const Dashboard = () => {
  const navigate = useNavigate(); 

  const menuItems = [
    { name: 'Home', path: '/dashboard/home' },
    { name: 'Users Management', path: '/dashboard/users' },
    { name: 'User Profile', path: '/dashboard/profile' }
  ];
  const handleLogOut = () =>{
    localStorage.removeItem("authToken"); 

    setTimeout(() => {
      window.location.href = "/login"; 
    }, 500);
    // setError(true);
    return;
  }
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="w-64 sidebar">
        <h2 className="text-2xl sidebar-title">DASHBOARD</h2>
        <ul className="menu-list">
          {menuItems.map(item => (
            <li key={item.name}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1">
        <header className="dashboard-header">
          <button className="logout-button" onClick={handleLogOut}>Logout</button>
        </header>
        <div className="card">
          <div className="card-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

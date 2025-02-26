import React from "react";
import "../styles/Auth.css";

const Home = () => {
  const totalUsers = 100;
  const activeUsers = 80;
  const deactiveUsers = 20;

  return (
    <div className="home-wrapper">
      <h1 className="home-title">Overview</h1>
      <div className="home-card-container">
        {/* Total Users Card */}
        <div className="home-card">
          <h2>Total Users</h2>
          <p className="home-count">{totalUsers}</p>
        </div>

        {/* Active Users Card */}
        <div className="home-card home-active">
          <h2>Active Users</h2>
          <p className="home-count">{activeUsers}</p>
        </div>

        {/* De-active Users Card */}
        <div className="home-card home-deactive">
          <h2>De-active Users</h2>
          <p className="home-count">{deactiveUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

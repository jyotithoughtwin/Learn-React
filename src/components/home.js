import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Auth.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Ensure correct env variable name

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [deactiveUsers, setDeactiveUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchUserCounts = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/getCount`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          toast.error("Auth token is required");
          setError(true);
          return;
        }

        if (response.status === 403) {
          toast.error("Auth token expired, redirecting...");
          localStorage.removeItem("authToken"); 
          setTimeout(() => {
            window.location.href = "/login"; 
          }, 1000);
          setError(true);
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setTotalUsers(data.totalUser);
          setActiveUsers(data.activeUserCount);
          setDeactiveUsers(data.inactiveUserCount);
        } else {
          toast.error(data.message || "Get count API failed");
          setError(true);
        }
      } catch (error) {
        toast.error("Get count API failed");
        setError(true);
        console.error("Error fetching user counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCounts();
  }, [navigate]); // Include navigate in dependencies

  return (
    <div className="home-wrapper">
      <h1 className="home-title">Overview</h1>
      <ToastContainer />

      {isLoading || error ? (
        <div className="loader">
          <ClipLoader color="#3498db" loading={true} size={50} />
        </div>
      ) : (
        <div className="home-card-container">
          <div className="home-card">
            <h2>Total Users</h2>
            <p className="home-count">{totalUsers}</p>
          </div>

          <div className="home-card home-active">
            <h2>Active Users</h2>
            <p className="home-count">{activeUsers}</p>
          </div>

          <div className="home-card home-deactive">
            <h2>De-active Users</h2>
            <p className="home-count">{deactiveUsers}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

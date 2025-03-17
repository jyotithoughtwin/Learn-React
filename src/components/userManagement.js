import React, { useState, useEffect } from 'react';
import "../styles/Auth.css";
import convertDate from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoadingRow, setActionLoadingRow] = useState(null); // Track loading for a specific row
  const [keepLoading, setKeepLoading] = useState(false);

  // Clear Messages after a few seconds
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccessMessage('');
    }, 3000);
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    setKeepLoading(false);
    const token = localStorage.getItem("authToken");

    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        page,
        limit: 5,
      });
      if (sortKey) queryParams.append('sortBy', sortKey);
      if (sortOrder) queryParams.append('order', sortOrder);

      const response = await fetch(`${API_BASE_URL}/getAllUser?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Auth token is required");
        setKeepLoading(true);
        return;
      }

      if (response.status === 403) {
        toast.error("Auth token expired, redirecting...");
        localStorage.removeItem("authToken"); 
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 1000);
        setKeepLoading(true);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPage);
      setSuccessMessage('Users loaded successfully');
      clearMessages();
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Toggle User Status (Only for clicked row)
  const toggleUserStatus = async (userId) => {
    setActionLoadingRow(userId);
    setKeepLoading(false);

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_BASE_URL}/updateUserStatus/${userId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error("Auth token is required");
        setKeepLoading(true);
        return;
      }

      if (response.status === 403) {
        toast.error("Auth token expired, redirecting...");
        localStorage.removeItem("authToken"); 
        setKeepLoading(true);
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 1000);
        return;
      }

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchUsers();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating status');
      toast.error('Error updating status'); 
    } finally {
      setActionLoadingRow(null);
      clearMessages();
    }
  };

  // Fetch users whenever search, sort, filter, or page changes
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, sortKey, sortOrder, page]);

  return (
    <div className="user-management">
      <h2>Users Management</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <p>Find all your individual user-related updates and data here!</p>

      <div className="controls">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <select onChange={(e) => setSortKey(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="created_at">Date</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort Order</option>
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
      </div>

      {/* Loader for GET API */}
      {loading || keepLoading ? (
        <div className="loader">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      ) : (
        <>
          {/* No Users Found Message */}
          {users.length === 0 ? (
            <h1><center>No user found</center></h1>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Users Name</th>
                  <th>Email ID</th>
                  <th>Status</th>
                  <th>D. O. Registration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td className={`status-${user.status?.toLowerCase()}`}>{user.status}</td>
                    <td>{convertDate(user.created_at)}</td>
                    <td>
                      <button 
                        className={`toggle-button ${user.status === 'Active' ? 'active' : 'inactive'}`}
                        onClick={() => toggleUserStatus(user._id)}
                        disabled={actionLoadingRow === user._id}
                      >
                        {actionLoadingRow === user._id ? (
                          <ClipLoader color="#fff" loading={true} size={15} />
                        ) : (
                          user.status === 'active' ? 'InActivate' : 'Activate'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <div className="pagination">
        <button 
          disabled={page <= 1} 
          onClick={() => setPage(prev => prev - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              className={pageNumber === page ? 'active-page' : ''}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
      <ToastContainer autoClose={3000} theme="light" />
    </div>
  );
};

export default UserManagement;

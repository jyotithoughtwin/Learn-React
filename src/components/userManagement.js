import React, { useState, useEffect } from 'react';
import "../styles/Auth.css";
import convertDate from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  // Clear Messages after a few seconds
  const clearMessages = () => {
    setTimeout(() => {
      setError('');
      setSuccessMessage('');
    }, 3000); // Clears after 3 seconds
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        page,
        limit: 5,
      });
      if (sortKey) queryParams.append('sortBy', sortKey);
      if (sortOrder) queryParams.append('order', sortOrder);

      const response = await fetch(`https://backend-todo-1-uz9r.onrender.com/getAllUser?${queryParams}`);
      
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
    }
  };

  // Toggle User Status
  const toggleUserStatus = async (userId) => {
    try {
      const response = await fetch(`https://backend-todo-1-uz9r.onrender.com/updateUserStatus/${userId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchUsers(); // Refresh the user list after status update
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error updating status');
      toast.error('Error updating status'); 
    } finally {
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
                >
                  {user.status === 'active' ? 'InActivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserManagement;

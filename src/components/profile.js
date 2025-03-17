import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Auth.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Ensure correct env variable name

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    role: "",
    image: "https://i.imghippo.com/files/JFdy5058hdI.png",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setError(false);
    try {
      const response = await fetch(`${API_BASE_URL}/getProfile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
      setProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        status: data.user.status,
        role: data.user.role,
        image: data.user.profileImage
          ? `${API_BASE_URL}${data.user.profileImage}`
          : "https://i.imghippo.com/files/JFdy5058hdI.png",
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Show a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsUpdating(true);
    setIsEditing(false);

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("phone", profile.phone);
    formData.append("status", profile.status);

    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/updateProfile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
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
      if (!response.ok) {
        toast.error(result.message || "Failed to update profile");
        setIsUpdating(false);
        return;
      }

      toast.success("Profile updated successfully!");

      setTimeout(() => {
        fetchProfile();
        setIsUpdating(false);
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong!");
      setIsUpdating(false);
    }
  };
  
  const handlePasswordChange = async () => {
    console.log(`password data==> ${JSON.stringify(passwordData)}`)
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Both fields are required!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/changePassword`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const result = await response.json();
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
      if (!response.ok) {
        toast.error(result.message || "Password change failed");
        return;
      }

      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
      localStorage.removeItem("authToken"); 

      setTimeout(() => {
        window.location.href = "/login"; 
      }, 3000);
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="profile-container">
      {(isLoading || error) && (
        <div className="loader">
          <ClipLoader color="#3498db" loading={true} size={50} />
        </div>
      )}
      {!isLoading && !error && (
        <>
          <div className="profile-header">
            <div className="profile-image-container">
              <label htmlFor="file-input">
                <img src={profile.image} alt="Profile" className="profile-image" />
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                disabled={!isEditing} // Disable file upload unless editing

              />
            </div>
            <div className="profile-info">
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <button onClick={handleSave} disabled={isUpdating}>
                  Save Changes
                </button>
              ) : (
                <button onClick={handleEdit}>
                  {isUpdating ? <ClipLoader color="white" loading={true} size={20} /> : "Edit"}
                </button>
              )}
            </div>
          </div>

          <div className="profile-form">
            <label>Name:</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} />

            <label>Email:</label>
            <input type="email" value={profile.email} disabled />

            <label>Phone No:</label>
            <input type="tel" name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} />

            <label>Status:</label>
            <select name="status" value={profile.status} onChange={handleChange} disabled={!isEditing}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
          </div>
          <div className="change-password-container">
            <button onClick={() => setShowPasswordModal(true)}>Change Password</button>
          </div>
          
        </>
      )}
        {showPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Password</h3>
            <input type="password" placeholder="Old Password" onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
            <input type="password" placeholder="New Password" onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
            <button onClick={handlePasswordChange}>Submit</button>
            <button onClick={() => setShowPasswordModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Profile;
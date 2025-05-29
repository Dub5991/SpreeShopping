// src/components/Auth/Logout.tsx
// Modern logout button styled for navbar

import React from "react";
import { logout } from "../../firebase/auth"; // Custom logout function from Firebase auth
import { useDispatch } from "react-redux"; // Redux hook for dispatching actions
import { clearUser } from "../../redux/userSlice"; // Redux action to clear user state
import { useNavigate } from "react-router-dom"; // React Router hook for navigation
import { Button } from "react-bootstrap"; // Bootstrap button component
import { FiLogOut } from "react-icons/fi"; // Logout icon

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handles the logout process: sign out, clear user state, and redirect to login
  const handleLogout = async () => {
    await logout(); // Sign out from Firebase
    dispatch(clearUser()); // Clear user data from Redux store
    navigate("/login"); // Redirect to login page
  };

  return (
    <Button
      variant="outline-light"
      className="ms-2 fw-bold d-flex align-items-center gap-2"
      style={{
        borderRadius: "1.5em",
        border: "none",
        letterSpacing: "0.03em",
        fontSize: "1.08rem",
        boxShadow: "0 2px 8px #6366f122",
        transition: "background 0.2s",
      }}
      onClick={handleLogout}
      title="Logout"
    >
      <FiLogOut size={18} /> {/* Logout icon */}
      Logout
    </Button>
  );
};

export default Logout;
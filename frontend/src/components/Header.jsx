import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";  // Redirect user to login page after logout
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-link">Home</Link>
      {!isLoggedIn && <Link to="/login" className="navbar-link">Login</Link>}
      {!isLoggedIn && <Link to="/register" className="navbar-link">Register</Link>}
      {isLoggedIn && (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      )}
    </nav>
  );
};

export default Header;

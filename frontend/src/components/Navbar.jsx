import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ user, setUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token"); // clear token if stored
    navigate("/login");
  };

  const renderLinks = () => {
    if (user) {
      return (
        <>
          <Link to="/books">Books</Link>
          <Link to="/mybooks">My Books</Link>
          <Link to="/profile">Me</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      );
    }
    return (
      <>
        <Link to="/books">Books</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </>
    );
  };

  return (
    <nav className="navbar">
      <h1>📚 Book Library</h1>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        {renderLinks()}
      </div>

      <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          {renderLinks()}
        </div>
      )}
    </nav>
  );
}

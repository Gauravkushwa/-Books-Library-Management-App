// src/pages/Login.jsx
import React, { useState } from "react";
import api from "../api/axiosConfig";
import '../styles/Form.css'

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
  
      setUser(res.data);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
    } catch (err) {
      // Correctly use 'err' inside catch
      console.error("Login error full:", err); 
      console.error("Login error response:", err.response); 
      console.error("Login error response.data:", err.response?.data);
  
      setMessage(
        err.response?.data?.message || // backend message
        err.message ||                 // axios/network error
        "Unknown error occurred"
      );
    }
  };
  

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;

// src/components/LoginForm.js

import './styles/LoginForm.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setRole, setUserName } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [role, setRoleState] = useState('user'); // Default role
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRoleState(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Here you should include logic to validate credentials
    // For demonstration purposes, we're just dispatching the role and username
    dispatch(setRole(role));
    dispatch(setUserName(username));

    // Redirect to dashboard or another page after successful login
    navigate('/dashboard-');
  };

  return (
    <div className="login-form">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div className="role-selection">
          <input
            type="radio"
            id="user"
            name="role"
            value="user"
            checked={role === 'user'}
            onChange={handleRoleChange}
          />
          <input
            type="radio"
            id="admin"
            name="role"
            value="admin"
            checked={role === 'admin'}
            onChange={handleRoleChange}
          />
          
          <div className="switch">
            <label htmlFor="user" className="switch-label">User</label>
            <div className="slider"></div>
            <label htmlFor="admin" className="switch-label">Admin</label>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="username" className="visually-hidden"></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={role === 'user' ? 'Enter Phone Number' : 'Enter Email'}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password" className="visually-hidden"></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;

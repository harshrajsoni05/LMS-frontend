import './styles/LoginForm.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRole, setUserName } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [role, setRoleState] = useState('user'); // Default role
  const [placeholderText, setPlaceholderText] = useState("Enter Phone Number");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPlaceholderText(role === "admin" ? "Enter Email" : "Enter Phone Number");
  }, [role]);

  // Function to handle role change
  const handleRoleChange = (event) => {
    setRoleState(event.target.value);
    setUsername("");  // Clear the username field
    setPassword("");  // Clear the password field
  };
  

  // Function to validate the form inputs
  const validate = () => {
    let errors = {};

    validateUsername(errors);
    validatePassword(errors);

    return errors;
  };

  // Validate username or phone number based on the role
  const validateUsername = (errors) => {
    if (!username) {
      errors.username = "Username or phone number is required";
    } else if (role === "admin" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
      errors.username = "Enter a valid email address";
    } else if (role === "user" && !/^\d{8,12}$/.test(username)) {
      errors.username = "Enter a valid phone number";
    }
  };

  // Validate the password
  const validatePassword = (errors) => {
    if (!password) {
      errors.password = "Password is required";
    } 
    
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    await loginUser();
  };

  // Function to perform the login action
  const loginUser = async () => {
    const credentials = {
      usernameOrPhoneNumber: username,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const token = data.jwtToken;
      localStorage.setItem("token", token);

      // Dispatch role and username to Redux store
      dispatch(setRole(role));
      dispatch(setUserName(username));

      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: "Invalid username or password!" });
      setIsSubmitting(false);
    }
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
            placeholder={placeholderText}
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password" className="visually-hidden"></label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type="submit" className="login-btn" >Login</button>
       
      </form>
      {errors.submit && <p className="error-text">{errors.submit}</p>}
    </div>
  );
};

export default LoginForm;

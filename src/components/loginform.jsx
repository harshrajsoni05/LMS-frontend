import '../styles/LoginForm.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// CSS
import '../styles/LoginForm.css'

// Components
import CustomButton from '../components/button'

// Functions
import { login } from '../api/auth'
import { loginUser } from '../redux/authActions'

// Constants


const initialErrors = {
  username: '',
  password: ''
}

const LoginForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(state => state.auth);

  const [role, setRoleState] = useState('user'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [placeholderText, setPlaceholderText] = useState("Enter Phone Number");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [errors, setErrors] = useState(initialErrors);

  useEffect (() => {
    if (auth && auth.jwtToken) {
      if (auth.role === 'ROLE_ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/userhistory');
      }
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateLogin()) {
    //   return;
    // }
    try {
      const { data } = await login(username, password);
      dispatch(loginUser(data));
      window.localStorage.setItem('jwtToken', data.jwtToken);
      
    } catch (error) {
      console.log(error);
    }

  }


  useEffect(() => {
    setPlaceholderText(role === "admin" ? "Enter Email" : "Enter Phone Number");
  }, [role]);

//   useEffect(() => {
//     if (auth && auth.jwtjwtToken) {
//       if (auth.role === 'ROLE_ADMIN') {
//         navigate('/dashboard');
//       } else if (auth.role === 'ROLE_USER') {
//         navigate('/userHistory');
//       }
//     }
//   }, [auth, navigate]);

  const handleRoleChange = (event) => {
    setRoleState(event.target.value);
    setUsername("");
    setPassword("");
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
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        {errors.submit && <p className="error-text">{errors.submit}</p>}

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

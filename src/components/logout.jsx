import { useDispatch } from 'react-redux';
import {logout as logoutAction} from '../redux/authSlice'
import { useNavigate } from 'react-router-dom';

const UseLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {

        dispatch(logoutAction());
      
      navigate("/");
      window.location.reload();

    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logout;
};

export default UseLogout;

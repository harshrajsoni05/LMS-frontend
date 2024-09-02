import { Navigate, useLocation } from 'react-router-dom';

// Function to check if the JWT token is present in localStorage
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
    return token !== null;
};

const PrivateRoute = ({ element }) => {
  const location = useLocation();
  
  // Check if the user is authenticated
  return isAuthenticated() ? (
    // If authenticated, render the requested component
    element
  ) : (
    // If not authenticated, redirect to login page
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

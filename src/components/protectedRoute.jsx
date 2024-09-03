import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useSelector((state) => state.user);

  if (!token || (requiredRole && role !== requiredRole)) {
    return <Navigate to="/" replace />;
  }



  return children;
};

export default ProtectedRoute;

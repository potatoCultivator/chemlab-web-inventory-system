import { Navigate } from 'react-router-dom';

// Dummy authentication check
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Return true if the token exists
};

// ProtectedRoute component
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;

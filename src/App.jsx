import './styles/app.css'; 
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookswithLayout } from './pages/BooksPage';
import { IssuancewithLayout } from './pages/IssuancePage';
import { DashboardwithLayout } from './components/dashboard';
import { CategorywithLayout } from './pages/CategoryPage';
import { UserwithLayout } from './pages/UserPage';
import ProtectedRoute from './components/protectedRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginPage />} />

        <Route 
          path='/category' 
          element={
            <ProtectedRoute requiredRole="admin">
              <CategorywithLayout />
            </ProtectedRoute>
          }/>


        <Route path='/issuance' 
            element={
              <ProtectedRoute requiredRole="admin">
                <IssuancewithLayout />
              </ProtectedRoute>
            }
        />

        <Route path='/books' 
          element={
            <ProtectedRoute requiredRole="admin">
              <BookswithLayout />  
            </ProtectedRoute>
          }
        />

        <Route path='/dashboard' 
          element={
            <ProtectedRoute requiredRole="admin">
              <DashboardwithLayout />
              </ProtectedRoute>
            } 
        />

        <Route path='/user' 
          element={
            <ProtectedRoute 
              requiredRole="admin">
                <UserwithLayout/>
            </ProtectedRoute>
            }
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;


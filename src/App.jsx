import './app.css'; 
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/privateRoute'; 
import { BookswithLayout } from './pages/BooksPage';
import { IssuancewithLayout } from './pages/IssuancePage';
import { DashboardwithLayout } from './components/dashboard';
import { CategorywithLayout } from './pages/CategoryPage';
import { UserwithLayout } from './pages/UserPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/category' element={<PrivateRoute element={<CategorywithLayout />} />} />
        <Route path='/issuance' element={<PrivateRoute element={<IssuancewithLayout />} />} />
        <Route path='/books' element={<PrivateRoute element={<BookswithLayout />} />} />
        <Route path='/dashboard' element={<PrivateRoute element={<DashboardwithLayout />} />} />
        <Route path='/user' element={<PrivateRoute element={<UserwithLayout />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

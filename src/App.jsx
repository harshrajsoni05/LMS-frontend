
import './app.css'; 
import LoginPage from './pages/LoginPage';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookswithLayout } from './pages/BooksPage';
import { IssuancewithLayout } from './pages/IssuancePage';
import { DashboardwithLayout} from './components/dashboard';
import { CategorywithLayout} from './pages/CategoryPage'
import { UserwithLayout } from './pages/UserPage';

function App() {
  return (
     <BrowserRouter>
      <Routes>
      
      <Route path='/' element={<LoginPage />}/>
      <Route path='/category-' element={<CategorywithLayout />} />
      <Route path='/issuance-' element={<IssuancewithLayout/>} />
      <Route path='/books-' element={<BookswithLayout />}/> 
      <Route path='/dashboard-' element={<DashboardwithLayout />}/>
      <Route path='/user-' element={<UserwithLayout/>}/>

      
      </Routes>
    </BrowserRouter> 
  );
}

export default App;

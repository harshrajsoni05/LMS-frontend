import { useSelector } from 'react-redux';
import Header from '../components/Header'; 
import Sidebar from '../components/Sidebar';
import './Hoc.css';

const WithLayoutComponent = (Component) => {
  return function Hoc(props) {

    const role = useSelector((state) => state.user.role);
    const userName = useSelector((state) => state.user.userName);

    return (
      <div>
        <Header role={role} userName={userName} />
        <div className='dashboard-hoc-container'>
          <Sidebar role={role} />
          <div className='dashboard-hoc-right-container'>
            <Component {...props} />
          </div>
        </div>
      </div>
    );
  };
};

export default WithLayoutComponent;

import { useSelector } from 'react-redux'
import LoadingToRedirect from './loadingToRedirect.jsx';

const UserRoute = ({children, ...rest}) => {

  const auth = useSelector((state) => state.auth);
 
  return auth && auth.jwtToken 
    ? children 
    : <div className="">
        <LoadingToRedirect />
      </div>
}

export default UserRoute
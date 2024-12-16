import { useNavigate } from 'react-router-dom';
import { deleteAllCookies } from '../../utils/cookie';
import { useEffect } from 'react';

function LogOut() {
  const navigate = useNavigate();
  deleteAllCookies();
  useEffect(() => {
    navigate('/form-login');
  }, []);
  return <>LogOut</>;
}

export default LogOut;

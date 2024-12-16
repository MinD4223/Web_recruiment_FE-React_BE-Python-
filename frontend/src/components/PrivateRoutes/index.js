import { Outlet } from 'react-router-dom';
import LayoutAdmin from '../LayoutAdmin';
import LayoutDefault from '../LayoutDefault';
function PrivateRoutes() {
  const isLogin = false;
  return <>{isLogin ? <LayoutDefault /> : <LayoutAdmin />}</>;
}

export default PrivateRoutes;

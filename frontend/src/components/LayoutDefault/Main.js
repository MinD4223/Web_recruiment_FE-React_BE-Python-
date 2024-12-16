import { Outlet } from 'react-router-dom';
import './layout.css/Main.css';
function Main() {
  return (
    <>
      <div className='layoutdefault-main'>
        <div className='container'>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Main;

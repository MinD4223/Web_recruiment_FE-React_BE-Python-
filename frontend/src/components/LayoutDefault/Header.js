import { Link, useNavigate } from 'react-router-dom';
import './layout.css/Header.css';
import { Button } from 'antd';
import { getCookie } from '../../utils/cookie';
import AvatarIcon from '../AvatarIcon';

function Header() {
  const navigate = useNavigate();
  const role = getCookie('role');

  return (
    <>
      <nav>
        <div className='header'>
          <div className='header-brand'>
            <img className='header-brand__logo' src='/image/logo.png' />
            <p className='header-brand__name'>MinD Career</p>
          </div>
          <div className='header-menu'>
            <div className='header-menu__item'>
              <Link to='/'>Home</Link>
            </div>
            <div className='header-menu__item'>
              <Link to='jobs'>Job</Link>
            </div>
            <div className='header-menu__item'>
              <Link to='process'>Process</Link>
            </div>
            <div className='header-menu__button'>
              {role ? (
                <AvatarIcon />
              ) : (
                <Button
                  id='button-login'
                  onClick={() => {
                    navigate(`/form-login`);
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;

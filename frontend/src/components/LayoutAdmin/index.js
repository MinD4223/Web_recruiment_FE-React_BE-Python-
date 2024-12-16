import { Avatar, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import Footer from '../LayoutDefault/Footer';
import DashBoard from '../../pages/DashBoard';
import './LayoutAdmin.css';
import { MenuFoldOutlined } from '@ant-design/icons';
import AvatarIcon from '../AvatarIcon';
import MenuSider from '../MenuSider';
import { Outlet } from 'react-router-dom';
import PrivateRoutes from '../PrivateRoutes';
import AdminJob from '../../pages/AdminJob';

function LayoutAdmin() {
  const [collapse, setCollapse] = useState(false);
  return (
    <>
      <Layout className='layout-admin'>
        <header className='header-admin'>
          <div
            className={
              collapse
                ? 'header-admin__logo header-admin__logo-collapse'
                : 'header-admin__logo'
            }
          >
            {collapse ? (
              <img className='logo_true' src='/image/logo.png' />
            ) : (
              <img className='logo' src='/image/logo-admin.png' />
            )}
          </div>
          <div className='header-admin__nav'>
            <div className='header-admin__nav-left'>
              <div
                className='header-admin__collapse'
                onClick={() => setCollapse(!collapse)}
              >
                <MenuFoldOutlined />
              </div>
            </div>
            <div className='header-admin__nav-right'>
              <div className='header-admin__avatar'>
                <AvatarIcon />
              </div>
            </div>
          </div>
        </header>
        <Layout>
          <Sider className='sider-admin' collapsed={collapse} theme='light'>
            <MenuSider />
          </Sider>
          <Content className='content-admin'>
            <Outlet />
          </Content>
        </Layout>
        <Footer />
      </Layout>
    </>
  );
}

export default LayoutAdmin;

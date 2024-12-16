import {
  KeyOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import Avatar from 'antd/es/avatar/avatar';
import './AvatarIcon.css';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

function AvatarIcon() {
  const navigate = useNavigate();
  const role = getCookie('role');
  const handleClick = ({ key }) => {
    if (key === '1') {
      navigate('/log-out');
    } else if (key === '2') {
      navigate('/admin-dashboard');
    }
  };
  const items = [
    {
      label: (
        <div className='avatar'>
          <div className='avatar-icon'>
            <SettingOutlined />
          </div>
          <div className='avatar-label'>Information</div>
        </div>
      ),
      key: '0',
    },
    ...(role == 'admin'
      ? [
          {
            label: (
              <div className='avatar token'>
                <div className='avatar-icon token'>
                  <KeyOutlined />
                </div>
                <div className='avatar-label token'>Admin Page</div>
              </div>
            ),
            key: '2',
          },
        ]
      : []),
    {
      danger: true,
      label: (
        <div className='avatar log-out'>
          <div className='avatar-icon log-out'>
            <LogoutOutlined />
          </div>
          <div className='avatar-label log-out'>Log-out</div>
        </div>
      ),
      key: '1',
    },
  ];
  return (
    <>
      <Dropdown
        menu={{
          items,
          onClick: handleClick,
        }}
        trigger={['click']}
      >
        <Avatar size='large' icon={<UserOutlined />} />
      </Dropdown>
    </>
  );
}

export default AvatarIcon;

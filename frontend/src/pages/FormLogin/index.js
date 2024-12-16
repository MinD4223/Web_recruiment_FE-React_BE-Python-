import { Button, Col, Form, Input, message, Row, Upload } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import './FormLogin.css';
import { setCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/serviceAccount';

function FormLogin() {
  const navigate = useNavigate();
  const [mess, contextHolder] = message.useMessage();
  const onFinish = async (values) => {
    const data = await login(values);
    if (data.message == 'User login successfully') {
      const time = 1;
      setCookie('email', data.uaa_response.email, time);
      setCookie('role', data.uaa_response.role, time);
      setCookie('id', data.uaa_response._id, time);
      mess.success('Plese check email or password again');
      if (data.uaa_response.profile == 'true') {
        navigate('/');
      } else {
        navigate(`/form-apply`);
      }
    } else {
      mess.error('Plese check email or password again');
    }
  };

  return (
    <>
      {contextHolder}
      <Row>
        <Col className='form-apply-column__left' span={14}>
          <div className='form-login'>
            <p className='form-login-title'>Login</p>
            <Form onFinish={onFinish}>
              <Form.Item name={'username'}>
                <Input
                  className='form-apply__input'
                  size='large'
                  placeholder='Email...'
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item name={'password'}>
                <Input.Password
                  className='form-apply__input'
                  size='large'
                  placeholder='Password...'
                  prefix={<KeyOutlined />}
                />
              </Form.Item>

              <Form.Item>
                <div className='button__apply'>
                  <Button type='primary' htmlType='submit'>
                    Login
                  </Button>
                </div>
              </Form.Item>
            </Form>
            <div>
              If you don't have account{' '}
              <Button
                onClick={() => {
                  navigate(`/form-register`);
                }}
              >
                Click here
              </Button>
            </div>
          </div>
        </Col>
        <Col span={10}>
          <div className='banner'>
            <img className='image-banner' src='./image/banner-form.png' />
            <div className='form-apply__banner-name'>MinD Career</div>
            <div className='form-apply__banner-slogan'>
              Change today - Value tomorrow
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default FormLogin;

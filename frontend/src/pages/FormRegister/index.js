import { Button, Col, Form, Input, Row, message } from 'antd';
import {
  ContactsOutlined,
  KeyOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './FormRegister.css';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../../services/serviceAccount';

function FormRegister() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values) => {
    const result = await createAccount(values);
    if (result.message == 'User registered successfully') {
      messageApi.success('User registered successfully');
      navigate('/form-login');
    } else {
      messageApi.error(
        'Failed to register user, check exist username, email, phone'
      );
    }
  };
  return (
    <>
      {contextHolder}
      <Row>
        <Col className='form-apply-column__left' span={14}>
          <div className='form-login'>
            <p className='form-register-title'>Register</p>
            <Form onFinish={onFinish}>
              <Form.Item name={'username'}>
                <Input
                  className='form-apply__input'
                  size='large'
                  placeholder='User name...'
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
              <Form.Item name={'fullname'}>
                <Input
                  className='form-apply__input'
                  size='large'
                  placeholder='Full name...'
                  prefix={<ContactsOutlined />}
                />
              </Form.Item>
              <Form.Item name={'phone'}>
                <Input
                  className='form-apply__input'
                  size='large'
                  placeholder='Phone...'
                  prefix={<PhoneOutlined />}
                />
              </Form.Item>
              <Form.Item name={'email'}>
                <Input
                  className='form-apply__input'
                  size='large'
                  placeholder='Email....'
                  prefix={<MailOutlined />}
                />
              </Form.Item>
              <Form.Item>
                <div className='button__apply'>
                  <Button type='primary' htmlType='submit'>
                    Register
                  </Button>
                </div>
              </Form.Item>
            </Form>
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

export default FormRegister;

import {
  Button,
  Col,
  Form,
  Input,
  message,
  notification,
  Row,
  Upload,
} from 'antd';
import './FormApply.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createProfileUser,
  getDetailAccount,
  updateAccount,
} from '../../services/serviceAccount';
import { getCookie } from '../../utils/cookie';
import { UploadOutlined } from '@ant-design/icons';

function FormApply() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const id = getCookie('id');
  const [noti, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    const options = {
      ...values,
      userId: id,
    };
    const response = await createProfileUser(options);
    if (response.message === 'Profile created successfully') {
      noti.success({
        message: 'Send CV success',
        description: 'The recruiment will send you resullt early',
      });
      navigate('/');
    } else {
      noti.error({
        message: 'Send CV not success',
        description: 'Error in system, please try again',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Row>
        <Col className='form-apply-column__left' span={14}>
          <div className='form-apply'>
            <p className='form-apply-title'>Form Information User</p>
            <Form
              form={form}
              onFinish={onFinish}
              layout='vertical'
              // initialValues={data}
            >
              <Form.Item name={'skill'} label={'Skills'}>
                <Input.TextArea
                  className='form-apply__input'
                  size='large'
                  placeholder='Your skills...'
                />
              </Form.Item>
              <Form.Item name={'experience'} label={'Experience'}>
                <Input.TextArea
                  className='form-apply__input'
                  size='large'
                  placeholder='Your experience...'
                />
              </Form.Item>
              <Form.Item name={'description'} label={'Description'}>
                <Input.TextArea
                  className='form-apply__input'
                  size='large'
                  placeholder='Phone...'
                />
              </Form.Item>

              {/* <Form.Item
                name={'file_cv'}
                valuePropName='file'
                getValueFromEvent={(e) => e.file}
              >
                <Upload
                  name='file_cv'
                  accept='.pdf'
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  action='http://127.0.0.1:8021/api/create-profile'
                >
                  <Button id='button__file' icon={<UploadOutlined />}>
                    Upload your CV
                  </Button>
                </Upload>
              </Form.Item> */}

              <Form.Item>
                <div className='button__apply'>
                  <Button type='primary' htmlType='submit'>
                    Update
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={10}>
          <div className='banner'>
            <img className='image-banner' src='/image/banner-form.png' />
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
export default FormApply;

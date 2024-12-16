import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Row,
  Col,
  Select,
  notification,
  DatePicker,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import './../AdminJob.css';
// import { getTimeCurrent } from '../../../utils/getTime';
import { createJob } from '../../../services/serviceJob';
import { category, city, level, type } from '../../../search';
const { Option } = Select;

function CreateAdminJob() {
  const [noti, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const options = {
      name: values.name,
      city: values.city,
      type: values.type,
      category: values.category,
      level: values.level,
      salary: values.salary,
      dateTo: values.dateTo.format('YYYY-MM-DD'),
      dateFrom: values.dateFrom.format('YYYY-MM-DD'),
      content: {
        description: values.description,
        benefits: values.benefits,
        requirements: values.requirements,
      },
    };
    const response = await createJob(options);
    if (response) {
      form.resetFields();
      noti.success({
        //type: 'success',
        message: 'Add new job success',
        description: 'You have added the new job',
      });
    } else {
      noti.error({
        //type: 'error',
        message: 'Add new job not success',
        description: 'Error in system, please try again',
      });
    }
    // console.log(options);
    // console.log('Formatted Date:', values.dateTo?.format('YYYY-MM-DD'));
  };

  return (
    <>
      {contextHolder}
      <div className='admin-job'>
        <div className='admin-job__title'>
          <div className='admin-job__button-return'>
            <Button
              onClick={() => {
                navigate('/admin-jobs');
              }}
            >
              <ArrowLeftOutlined />
              Return
            </Button>
          </div>
          <div className='admin-job__name'>Create job</div>
          <div className='admin-job__button-add'>
            <Button type='primary'>Save</Button>
          </div>
        </div>
        <div className='admin-table'>
          <div className='admin-table__size'>
            <Form onFinish={onFinish} form={form}>
              <Row>
                <Col span={24}>
                  <p className='admin-table__label'>Job name:</p>
                  <Form.Item
                    name='name'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <p className='admin-table__label'>City:</p>
                  <Form.Item
                    name='city'
                    className='input_form'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Select
                      options={city}
                      placeholder='Select a option and change input text above'
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <p className='admin-table__label'>Type:</p>
                  <Form.Item
                    name='type'
                    className='input_form'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Select a option and change input text above'
                      allowClear
                      options={type}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <p className='admin-table__label'>Category:</p>
                  <Form.Item
                    name='category'
                    className='input_form'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Select
                      options={category}
                      placeholder='Select a option and change input text above'
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <p className='admin-table__label'>Level:</p>
                  <Form.Item
                    name='level'
                    className='input_form'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Select a option and change input text above'
                      allowClear
                      options={level}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <p className='admin-table__label'>Salary:</p>
                  <Form.Item
                    name='salary'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <p className='admin-table__label'>Date:</p>
                  <Form.Item
                    name='dateTo'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <DatePicker
                      format={{
                        format: 'YYYY-MM-DD',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <p className='admin-table__label'>Date:</p>
                  <Form.Item
                    name='dateFrom'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <DatePicker
                      format={{
                        format: 'YYYY-MM-DD',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <p className='admin-table__label'>Description:</p>
                  <Form.Item
                    name='description'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <p className='admin-table__label'>Requirement:</p>
                  <Form.Item
                    name='requirements'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <p className='admin-table__label'>Benefit:</p>
                  <Form.Item
                    name='benefits'
                    rules={[
                      {
                        required: true,
                        message: 'Please input job name!',
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
export default CreateAdminJob;

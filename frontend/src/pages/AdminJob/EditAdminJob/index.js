import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
// import { getTimeCurrent } from '../../../utils/getTime';
import { getDetailJob, updateJob } from '../../../services/serviceJob';
import { category, city, level, type } from '../../../search';
import moment from 'moment';

function EditAdminJob(props) {
  //onReload
  const { record, handleReload } = props;
  const [form] = Form.useForm();
  const [mess, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [job, setJob] = useState({
    category: '',
    city: '',
    benefits: '',
    description: '',
    requirements: '',
    dateFrom: '',
    dateTo: '',
    level: '',
    name: '',
    salary: '',
    type: '',
  });

  useEffect(() => {
    const fetchApi = async () => {
      const response = await getDetailJob(record._id);
      if (response) {
        setJob({
          category: response.response_data.job.category,
          city: response.response_data.job.city,
          benefits: response.response_data.job.content.benefits,
          description: response.response_data.job.content.description,
          requirements: response.response_data.job.content.requirements,
          dateFrom: moment(response.response_data.job.dateFrom, 'YYYY-MM-DD'),
          dateTo: moment(response.response_data.job.dateTo, 'YYYY-MM-DD'),
          level: response.response_data.job.level,
          name: response.response_data.job.name,
          salary: response.response_data.job.salary,
          type: response.response_data.job.type,
        });
      }
    };
    fetchApi();
  }, []);

  const showModal = () => {
    form.setFieldValue(job);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleFinish = async (values) => {
    const options = {
      _id: record._id,
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
    const response = await updateJob(options);
    if (response) {
      form.resetFields();
      handleReload();
      setIsModalOpen(false);
      mess.open({
        type: 'success',
        content: 'Update job success',
      });
    } else {
      mess.open({
        type: 'error',
        content: 'Update job not success',
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Button
        ghost
        type='primary'
        icon={<EditOutlined />}
        onClick={showModal}
      ></Button>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <h3>Edit Job</h3>
        <Form form={form} onFinish={handleFinish} initialValues={job}>
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
                <DatePicker />
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
                <DatePicker />
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
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default EditAdminJob;

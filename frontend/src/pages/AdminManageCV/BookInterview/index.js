import { CalendarOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { bookInterview } from '../../../services/serviceCV';

function BookInterview(props) {
  const { record, handleInfo } = props;
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const format = 'HH:mm A';
  // const [date, setDate] = useState();
  // const onChange = (date, dateString) => {
  //   console.log(dateString);
  //   setDate(dateString);
  // };

  // const onClick = async () => {
  //   const options = {
  //     ...record,
  //     dateInterview: date,
  //   };
  //   const response = await changeStatusCV(record.id, options);
  //   if (response) {
  //     setIsModalOpen(false);
  //     handleInfo();
  //   }
  // };

  const onFinish = async (values) => {
    const options = {
      userId: record._id,
      date: values.date.format('YYYY-MM-DD'),
      floor: values.floor,
      room: values.room,
      time: values.time.format('HH-mm A'),
    };
    const response = await bookInterview(options);
    if (response.message == 'Interview successfully') {
      handleInfo();
      setIsModalOpen(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        ghost
        icon={<CalendarOutlined />}
      ></Button>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <h3>Schedule an interview </h3>
        <Form form={form} onFinish={onFinish}>
          <Row>
            <Col span={12}>
              <p className='admin-table__label'>Date:</p>
              <Form.Item
                name='date'
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
              <p className='admin-table__label'>Time:</p>
              <Form.Item
                name='time'
                rules={[
                  {
                    required: true,
                    message: 'Please input job name!',
                  },
                ]}
              >
                <TimePicker
                  initialValues={dayjs('12:08', format)}
                  format={format}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <p className='admin-table__label'>Floor:</p>
              <Form.Item
                name='floor'
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
            <Col span={24}>
              <p className='admin-table__label'>Room:</p>
              <Form.Item
                name='room'
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
          </Row>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Book
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default BookInterview;

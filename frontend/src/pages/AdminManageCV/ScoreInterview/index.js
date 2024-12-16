import { FileDoneOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Modal, Row } from 'antd';
import { useState } from 'react';
import { changeStatusCV, scoreInterview } from '../../../services/serviceCV';

function ScoreInterview(props) {
  const { record, handleReload } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (values) => {
    const options = {
      user_id: record._id,
      attitude: values.attitude,
      skill: values.skill,
      knowledge: values.knowledge,
    };
    console.log(options);
    const response = await scoreInterview(options);
    if (response.response_data.message === 'User pass') {
      setIsModalOpen(false);
      handleReload();
    }
  };
  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        ghost
        icon={<FileDoneOutlined />}
      ></Button>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <h3>Score Interview</h3>
        <div>Total: {score}</div>
        <Form onFinish={onFinish}>
          <Row>
            <Col span={24}>
              <p className='admin-table__label'>Attitude</p>
              <Form.Item
                name='attitude'
                rules={[
                  {
                    required: true,
                    message: 'Please input job name!',
                  },
                ]}
              >
                <InputNumber min={1} max={10} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <p className='admin-table__label'>Skill</p>
              <Form.Item
                name='skill'
                rules={[
                  {
                    required: true,
                    message: 'Please input job name!',
                  },
                ]}
              >
                <InputNumber min={1} max={10} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <p className='admin-table__label'>Knowledge</p>
              <Form.Item
                name='knowledge'
                rules={[
                  {
                    required: true,
                    message: 'Please input job name!',
                  },
                ]}
              >
                <InputNumber min={1} max={10} />
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

export default ScoreInterview;

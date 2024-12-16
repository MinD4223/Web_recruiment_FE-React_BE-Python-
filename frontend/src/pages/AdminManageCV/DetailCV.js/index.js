import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Modal, Row, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { updateJob } from '../../../services/serviceJob';

function DetailCV(props) {
  const { record } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button icon={<EyeOutlined />} onClick={showModal}></Button>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <h3>Information Candidate</h3>
        <div>
          Name:<b>{record.fullname}</b>{' '}
        </div>
        <div>
          Phone: <b>{record.phone}</b> Email:<b>{record.email}</b>
        </div>
        <div>
          Skill: <b>{record.skill}</b>{' '}
        </div>
        <div>
          Experience: <b>{record.experience}</b>{' '}
        </div>
        <div>
          Description: <b>{record.description}</b>
        </div>
      </Modal>
    </>
  );
}
export default DetailCV;

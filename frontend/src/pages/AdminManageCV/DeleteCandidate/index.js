import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import { unsubmitApply } from "../../../services/serviceCV";
import { useNavigate } from "react-router-dom";

function DeleteCandidate(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {record, handleReload} = props
    const navigate = useNavigate();
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = async() => {
      setIsModalOpen(false);
      const response = await unsubmitApply(record._id);
          if (response) {
            handleReload()
          }
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  return (
    <>
      <Button danger icon={<DeleteOutlined />} onClick={showModal}></Button>
      <Modal
        title="Delete Candidate"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure to delete candidate <b>{record.fullname}</b></p>
        
      </Modal>
    </>
  );
}

export default DeleteCandidate;

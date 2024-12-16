import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteJob } from "../../../services/serviceJob";

function DeleteJob(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {record, handleReload} = props
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = async() => {
      setIsModalOpen(false);
      const response = await deleteJob(record._id);
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
        title="Delete Job"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure to delete job <b>{record.name}</b></p>
        
      </Modal>
    </>
  );
}

export default DeleteJob;

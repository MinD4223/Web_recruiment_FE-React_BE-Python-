import { Button, Table, Tag } from 'antd';
import './AdminJob.css';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllJobs } from '../../services/serviceJob';
import EditAdminJob from './EditAdminJob';
import DeleteJob from './DeleteJob';

function AdminJob() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const fetchApi = async () => {
    const response = await getAllJobs();
    setData(response.jobs);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleReload = () => {
    fetchApi();
  };

  const handleRowClick = (record) => {
    navigate(`/admin-manage-cv/${record._id}`);
  };

  const columns = [
    {
      title: 'Name job',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, record) => (
        <Tag className='mb-5' color='blue'>
          {record.type}
        </Tag>
      ),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
    },
    // {
    //   title: 'Time',
    //   key: 'time',
    //   width: 250,
    //   render: (_, record) => (
    //     <>
    //       <small>Time begin: {record.dateFrom}</small>
    //       <br />
    //       <small>Time end: {record.dateTo}</small>
    //     </>
    //   ),
    // },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => (
        <>
          {record.status == 'open' ? (
            <Tag color='green'>Open</Tag>
          ) : (
            <Tag color='red'>Close</Tag>
          )}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          {' '}
          <Link to={`/detail-admin-job/${record._id}`}>
            <Button icon={<EyeOutlined />}></Button>
          </Link>
          <Button
            icon={<UsergroupAddOutlined />}
            onClick={(e) => handleRowClick(record)}
          ></Button>
          <EditAdminJob record={record} handleReload={handleReload} />
          <DeleteJob record={record} handleReload={handleReload} />
        </>
      ),
    },
  ];
  return (
    <>
      <div className='admin-job'>
        <div className='admin-job__title'>
          <div className='admin-job__button-return'>
            <Button
              onClick={() => {
                navigate('/admin-dashboard');
              }}
            >
              <ArrowLeftOutlined />
              Return
            </Button>
          </div>
          <div className='admin-job__name'>List job</div>
          <div className='admin-job__button-add'>
            <Button
              onClick={() => {
                navigate('/create-admin-jobs');
              }}
            >
              <PlusOutlined /> Add new job
            </Button>
          </div>
        </div>
        <div className='admin-table'>
          <div className='admin-table__size'>
            <Table
              dataSource={data.reverse().map((item, index) => ({
                ...item,
                key: item.id || index,
              }))}
              columns={columns}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminJob;

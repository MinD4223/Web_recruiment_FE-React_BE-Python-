import { Button, message, Space, Table, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getListCV } from '../../services/serviceCV';
import DetailCV from './DetailCV.js';
import BookInterview from './BookInterview/index.js';
import ScoreInterview from './ScoreInterview/index.js';
import DeleteCandidate from './DeleteCandidate/index.js';

function AdminManageCV() {
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState();
  const [nameJob, setNameJob] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const fetchApi = async () => {
    const response = await getListCV(params.id);
    setData(response.response_data.users);
    setNameJob(response.response_data.jobName);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  console.log(params.id);

  const handleInfo = () => {
    fetchApi();
    messageApi.success('Schedule Interview success');
  };

  const handleReload = () => {
    fetchApi();
    messageApi.success('Delete candidate success');
  };

  const columns = [
    {
      title: 'Name job',
      dataIndex: 'idJob',
      key: 'idJob',
      render: (_, record) => {
        return <Tag color='blue'>{nameJob}</Tag>;
      },
    },
    {
      title: 'Name candidate',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Skill',
      key: 'skill',
      width: 150,
      render: (_, record) => (
        <>
          <Tag color='green'>{record.skill}</Tag>
        </>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (_, record) => {
        if (record.status == 'unapproval') {
          return <Tag color='blue'>Apply</Tag>;
        } else if (record.status == 'waiting') {
          return <Tag color='yellow'>Waiting response</Tag>;
        } else if (record.status == 'interview') {
          return <Tag color='green'>Interview</Tag>;
        } else if (record.status == 'reject') {
          return <Tag color='red'>Reject</Tag>;
        } else if (record.status == 'pass') {
          return <Tag color='purple'>Pass</Tag>;
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <DetailCV record={record} />
          {(record.status == 'unapproval' || record.status == 'reject') && (
            <>
              <BookInterview record={record} handleInfo={handleInfo} />
            </>
          )}
          {record.status == 'interview' && (
            <>
              <ScoreInterview record={record} handleReload={handleReload} />
            </>
          )}
          <DeleteCandidate record={record} handleReload={handleReload} />
        </>
      ),
    },
  ];
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
          <div className='admin-job__name'>List Candidate</div>
          <div className='admin-job__button-add'>
            <div className='admin-job__space'></div>
          </div>
        </div>
        <div className='admin-table'>
          <div className='admin-table__size'>
            {params.id !== ':id' ? (
              <Table
                dataSource={data?.map((item, index) => ({
                  ...item,
                  key: item.id || index,
                }))}
                columns={columns}
                pagination={{ pageSize: 5 }}
              />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p>You need choose job</p>{' '}
                <div>
                  <Button
                    type={'primary'}
                    onClick={() => {
                      navigate('/admin-jobs');
                    }}
                  >
                    Go to Jobs
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminManageCV;

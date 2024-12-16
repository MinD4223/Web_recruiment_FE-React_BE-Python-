import { Button, Col, notification, Row } from 'antd';
import './JobDetail.css';
import {
  ClockCircleOutlined,
  FolderOpenOutlined,
  LeftCircleOutlined,
} from '@ant-design/icons';
import CardItem from '../../components/CardItem';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllJobs, getDetailJob } from '../../services/serviceJob';
import { getCookie } from '../../utils/cookie';
import { createCV, getDetailCVForProcess } from '../../services/serviceCV';
function JobDetail() {
  const params = useParams();
  const [job, setJob] = useState({});
  const [data, setData] = useState();
  const [spam, setSpam] = useState();
  const navigate = useNavigate();
  const id = getCookie('id');
  const [noti, contextHolder] = notification.useNotification();
  useEffect(() => {
    const fetchApi = async () => {
      const response = await getDetailJob(params.id);
      const data = await getAllJobs();
      if (response) {
        setJob(response.response_data.job);
        setData(data.jobs.reverse().slice(0, 3));
      }
      const checkSpam = await getDetailCVForProcess(id);
      setSpam(checkSpam?.response_data?.check_spam);
      console.log(spam);
    };
    fetchApi();
  }, []);

  const onClick = async () => {
    const options = {
      job_id: params.id,
      user_id: id,
    };
    if (id) {
      if (spam === 'true') {
        const response = await createCV(options);
        if (response.message == 'Submit job successfully') {
          noti.success({
            message: 'Send CV success',
            description: 'The recruiment will send you resullt early',
          });
          setTimeout(() => {
            navigate('/process');
          }, 2000);
        } else {
          noti.error({
            message: 'Send CV failed',
            description: 'You need fill profile to apply',
          });
        }
      } else {
        noti.error({
          message: 'Send CV failed',
          description: 'You have send CV',
        });
      }
    } else {
      navigate(`/form-login`);
    }
  };

  return (
    <>
      {contextHolder}
      <div className='job-detail'>
        <div className='job-detail__title'>
          <div className='job-detail__column-left'>
            <div className='job-detail__action'>
              <Button>
                <LeftCircleOutlined />
                Back
              </Button>
            </div>
            <div className='job-detail__job-name'>{job.name}</div>
            <div className='job-detail__infor'>
              <p className='job-detail__item'>
                <ClockCircleOutlined /> Type: {job.type}
              </p>
              <p className='job-detail__item'>
                <FolderOpenOutlined /> Level: {job.level}
              </p>
            </div>
          </div>
          <div className='job-detail__column-right'>
            <Button className='job-detail__status' onClick={onClick}>
              Apply
            </Button>
          </div>
        </div>
        {/* Description */}
        <div className='job-detail__description'>
          <p className='job-detail__name-category'>Detail jobs</p>
          <div className='job-detail__item-description'>
            <p className='job-detail__description-name'>1. Job Description</p>
            <ul className='job-detail__list-description'>
              <li>{job?.content?.description}</li>
            </ul>
          </div>
          <div className='job-detail__item-description'>
            <p className='job-detail__description-name'>2. Job Requirements</p>
            <ul className='job-detail__list-description'>
              <li>{job?.content?.requirements}</li>
            </ul>
          </div>
          <div className='job-detail__item-description'>
            <p className='job-detail__description-name'>3. Benefits</p>
            <ul className='job-detail__list-description'>
              <li>{job?.content?.benefits}</li>
            </ul>
          </div>
          <div className='job-detail__description-action'>
            <Button className='job-detail__status-action' onClick={onClick}>
              Apply
            </Button>
          </div>
        </div>
        {/* Relate jobs */}
        <div className='job-detail__relate-jobs'>
          <p className='job-detail__name-category'>Relate jobs</p>
          <Row className='job-detail'>
            {data &&
              data.map((item, index) => (
                <Col className='card-item' span={8} key={index}>
                  <CardItem data={item} />
                </Col>
              ))}
          </Row>
        </div>
      </div>
    </>
  );
}

export default JobDetail;

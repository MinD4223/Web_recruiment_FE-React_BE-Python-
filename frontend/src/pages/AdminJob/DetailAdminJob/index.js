import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDetailJob } from '../../../services/serviceJob';

function DetailAdminJob() {
  const navigate = useNavigate();
  const params = useParams();
  const [job, setJob] = useState({});
  useEffect(() => {
    const fetchApi = async () => {
      const response = await getDetailJob(params.id);
      setJob(response.response_data.job);
    };
    fetchApi();
  }, []);

  return (
    <>
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
          <div className='admin-job__name'>{job.name}</div>
          <div className='admin-job__button-add'>
            <div className='admin-job__space'></div>
          </div>
        </div>
        <div className='admin-table'>
          {/* <div className='admin-table__size'> */}
          <p className='job-detail__name-category'>Detail jobs</p>

          <div className='job-detail__item-description'>
            <p className='job-detail__description-name'>1. Job Description</p>
            <ul className='job-detail__list-description'>
              {job.content && <li>{job?.content?.description}</li>}
            </ul>
          </div>
          <div className='job-detail__item-description'>
            <p className='job-detail__description-name'>2. Job Requirements</p>
            <ul className='job-detail__list-description'>
              {job.content && <li>{job?.content?.requirements}</li>}
            </ul>
          </div>
          <div className='job-detail__item-description'>
            <p className='job-detail__description-name'>3. Benefits</p>
            <ul className='job-detail__list-description'>
              {job.content && <li>{job?.content?.benefits}</li>}
            </ul>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}

export default DetailAdminJob;

import { Col, Divider, Input, Pagination, Radio, Row } from 'antd';
import './Jobs.css';
import { ClockCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllJobs } from '../../services/serviceJob';

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const citySearch = searchParams.get('city') || '';
  const jobNameSearch = searchParams.get('jobname') || '';
  const typeSearch = searchParams.get('type') || '';
  const levelSearch = searchParams.get('level') || '';
  const categorySearch = searchParams.get('category') || '';
  const [page, setPage] = useState(1);
  const [currentJobs, setCurrentJobs] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const response = await getAllJobs();
      if (response) {
        const newData = response.jobs.filter((item) => {
          // const city = citySearch
          //   ? item.city?.some((item) => item?.includes(citySearch))
          //   : true;
          const city = citySearch ? item.city?.includes(citySearch) : true;
          const level = levelSearch ? item.level?.includes(levelSearch) : true;
          const category = categorySearch
            ? item.category?.includes(categorySearch)
            : true;
          const type = typeSearch ? item.type?.includes(typeSearch) : true;
          const jobname = jobNameSearch
            ? item.jobname?.includes(jobNameSearch)
            : true;
          //const status = item.status;
          return city && jobname && level && category && type;
        });
        setData(newData.reverse());
      }
    };
    fetchApi();
  }, []);

  useEffect(() => {
    const pageSize = 5;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setCurrentJobs(data.slice(start, end));
  }, [data, page]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <>
      <Row className='banner'>
        <Col span={8} className='banner-left'>
          <div className='banner-left__name'>MinD Career</div>
          <div className='banner-left__slogan'>
            Change today - Value tomorrow
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={8} className='job-left'>
          <div className='job-filter'>
            <p className='job-filter__name'>Find your dream job</p>
            <Input
              className='job-filter__input-name'
              placeholder='Job name..'
            />
            <Divider
              style={{
                borderColor: '#1F3B61',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            />
            <p className='job-filter__name-category'>Job type</p>
            {/* onChange={onChange} value={value} */}
            <Radio.Group>
              <Radio value={1}>All</Radio>
              <Radio value={2}>Full-time</Radio>
              <Radio value={3}>Part-time</Radio>
            </Radio.Group>
            <Divider
              style={{
                borderColor: '#1F3B61',
              }}
            />
            <p className='job-filter__name-category'>Category</p>
            {/* onChange={onChange} value={value} */}
            <Radio.Group>
              <Radio value={1}>All</Radio>
              <Radio value={2}>JavaScript</Radio>
              <Radio value={3}>PHP</Radio>
              <Radio value={2}>Development</Radio>
              <Radio value={3}>Business Analyst</Radio>
            </Radio.Group>
            <Divider
              style={{
                borderColor: '#1F3B61',
              }}
            />
            <p className='job-filter__name-category'>Level</p>
            {/* onChange={onChange} value={value} */}
            <Radio.Group>
              <Radio value={1}>All</Radio>
              <Radio value={2}>Fresher</Radio>
              <Radio value={3}>Junior</Radio>
              <Radio value={2}>Middle</Radio>
              <Radio value={3}>Senior</Radio>
              <Radio value={3}>Manage</Radio>
            </Radio.Group>
          </div>
        </Col>
        <Col span={16} className='job-right'>
          <div className='job-display'>
            <p className='job-filter__name'>List jobs</p>
            <div className='job-filter__box'>
              {currentJobs &&
                currentJobs.map((item, index) => (
                  <div className='job-filter__list-jobs' key={index}>
                    <div className='job-filter__jobs-left'>
                      <div className='job-filter__job-name'>
                        {currentJobs[index].name}
                      </div>
                      <div className='job-filter__infor'>
                        <p className='job-filter__item'>
                          <ClockCircleOutlined /> Time
                        </p>
                        <p className='job-filter__item'>
                          <FolderOpenOutlined /> Level
                        </p>
                      </div>
                    </div>
                    <div className='job-filter__jobs-right'>
                      <div className='job-filter__status'>
                        <Link to={`/jobs/${currentJobs[index]._id}`}>
                          {' '}
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <Pagination
              align='center'
              current={page}
              defaultCurrent={1}
              total={data.length}
              pageSize={5}
              onChange={handlePageChange}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Jobs;

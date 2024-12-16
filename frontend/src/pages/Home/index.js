import { Button, Card, Col, Divider, Row, Space } from 'antd';
import '../Home/Home.css';
import SearchForm from '../../components/SearchForm';
import CardItem from '../../components/CardItem';
import { useEffect, useState } from 'react';
import { getAllJobs } from '../../services/serviceJob';

function Home() {
  const [data, setData] = useState();
  useEffect(() => {
    const fetchApi = async () => {
      const response = await getAllJobs();
      if (response) {
        setData(response.jobs.reverse().slice(0, 6));
      }
    };
    fetchApi();
  }, []);
  return (
    <>
      <Row>
        <Col span={12} className='banner-left'>
          <div className='banner-left__name'>MinD Career</div>
          <div className='banner-left__slogan'>
            Change today - Value tomorrow
          </div>
        </Col>
        <Col span={12}>
          <div className='banner-right'>
            <img src='./image/banner.png' />
          </div>
        </Col>
      </Row>
      <div className='search-category'>
        <SearchForm />
      </div>
      <Divider
        style={{
          borderColor: '#000000',
          marginTop: '8%',
          marginBottom: '0',
        }}
      >
        <p className='divider'>Lastest Jobs</p>
      </Divider>

      <Card className='card-lastest-jobs'>
        <Row>
          {data &&
            data.map((item, index) => (
              <Col className='card-item' span={8} key={index}>
                <CardItem data={item} />
              </Col>
            ))}

          {/* <Col className='card-item' span={8}>
            <CardItem />
          </Col>
          <Col className='card-item' span={8}>
            <CardItem />
          </Col>
          <Col className='card-item' span={8}>
            <CardItem />
          </Col>
          <Col className='card-item' span={8}>
            <CardItem />
          </Col>
          <Col className='card-item' span={8}>
            <CardItem />
          </Col> */}
        </Row>
        <div className='card-button__view-more'>
          <Button>View more</Button>
        </div>
      </Card>
    </>
  );
}

export default Home;

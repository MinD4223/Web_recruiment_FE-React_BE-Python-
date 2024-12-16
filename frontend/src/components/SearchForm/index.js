import { Button, Col, Form, Input, Row, Select } from 'antd';
import '../SearchForm/SearchForm.css';
import { useNavigate } from 'react-router-dom';
import { city } from '../../search';
import { type } from '../../search';
import { category } from '../../search';
import { level } from '../../search';

function SearchForm() {
  const navigate = useNavigate();

  const handleFinish = (values) => {
    let city = values.city || '';
    let type = values.type || '';
    let level = values.level || '';
    let category = values.category || '';
    city = values.city === 'All' ? '' : city;
    type = values.type === 'All' ? '' : type;
    level = values.level === 'All' ? '' : level;
    category = values.category === 'All' ? '' : category;
    navigate(
      `/jobs?level=${level}&category=${category}&type=${type}&city=${city}&jobname=${
        values.jobname || ''
      }`
    );
  };

  return (
    <>
      <p className='search-name'>Search</p>
      {city && (
        <Form className='search-form' onFinish={handleFinish}>
          <Row>
            <Col className='search-item'>
              <div className='search-label'>Job name:</div>
              <Form.Item name='jobname' className='search-input'>
                <Input placeholder='Enter job name' />
              </Form.Item>
            </Col>
            <Col className='search-item'>
              <div className='search-label'>Location:</div>
              <Form.Item name='city' className='search-input'>
                <Select options={city} placeholder='Choose location' />
              </Form.Item>
            </Col>
            <Col className='search-item'>
              <div className='search-label'>Type:</div>
              <Form.Item name='type' className='search-input'>
                <Select options={type} placeholder='Choose type' />
              </Form.Item>
            </Col>
            <Col className='search-item'>
              <div className='search-label'>Category:</div>
              <Form.Item name='category' className='search-input'>
                <Select options={category} placeholder='Choose category' />
              </Form.Item>
            </Col>
            <Col className='search-item'>
              <div className='search-label'>Level:</div>
              <Form.Item name='level' className='search-input'>
                <Select options={level} placeholder='Choose level' />
              </Form.Item>
            </Col>
            <Col className='search-item'>
              <Form.Item
                name='city'
                className='search-input search-input__button '
              >
                <Button type='primary' htmlType='submit'>
                  Search
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
}

export default SearchForm;

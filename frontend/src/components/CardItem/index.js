import { Button, Card } from 'antd';
import './CardItem.css';
function CardItem(props) {
  const { data } = props;
  return (
    <>
      <Card className='card-item' style={{ background: '#CDEDFE' }}>
        <p className='card-item__name'>{data.name}</p>
        <div className='card-item__infor'>
          <div className='card-item__infor_left'>
            <div className='card-item__salary'>Salary: {data.salary}</div>
            <div className='card-item__level'>Level: {data.level}</div>
          </div>
          <div className='card-item__infor_right'>
            <div className='card-item__time'>Type: {data.type}</div>
          </div>
        </div>
        <div className='card-item__action'>
          <Button type='primary'>View</Button>
        </div>
      </Card>
    </>
  );
}

export default CardItem;

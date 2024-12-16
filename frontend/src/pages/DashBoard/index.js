import { Column } from '@ant-design/plots';
import { Pie } from '@ant-design/plots';
import './DashBoard.css';
import { useEffect, useState } from 'react';
import { getDashBoard } from '../../services/serviceDashBoard';
function DashBoard() {
  const [jobLevel, setJobLevel] = useState();
  const [user, setUser] = useState();
  const [candidate, setCandidate] = useState();
  const [job, setJob] = useState();
  const [pass, setPass] = useState();
  const fetchAPI = async () => {
    const result = await getDashBoard();
    setJobLevel(result.job_level);
    setUser(result.users);
    setJob(result.summary.total_job);
    setCandidate(result.summary.total_user);
    setPass(result.summary.user_pass);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  console.log(user);

  const config = {
    data: {
      value: user,
    },
    xField: 'name',
    yField: 'userCount',
    colorField: 'name',
    // group: true,
    style: {
      inset: 5,
    },
    columnWidthRatio: 0.8,
    // onReady: ({ chart }) => {
    //   try {
    //     chart.on('afterrender', () => {
    //       chart.emit('legend:filter', {
    //         data: { channel: 'color', values: ['London'] },
    //       });
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
  };

  const config1 = {
    data:
      jobLevel?.map((item) => ({
        type: item.level,
        value: item.count,
      })) || [],
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };
  return (
    <>
      <h1 className='title'>DashBoard</h1>
      <div className='dash-board'>
        <div className='row-number'>
          <div className=' number'>
            <div className='number_title'>Number Candidate</div>
            <div className='number_count'>{candidate}</div>
          </div>
          <div className=' number'>
            {' '}
            <div className='number_title'>Number Job</div>
            <div className='number_count'>{job}</div>
          </div>
          <div className=' number'>
            {' '}
            <div className='number_title'>Number Pass</div>
            <div className='number_count'>{pass}</div>
          </div>
        </div>
        <div className='row-diagram'>
          <div className='diagram diagram-cv'>
            {user && <Column {...config} />}
          </div>
          <div className='diagram diagram-job'>
            <Pie {...config1} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;

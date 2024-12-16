import { Button, Card, message, Space, Steps } from 'antd';
import './Process.css';
import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import {
  acceptInterview,
  getDetailCVForProcess,
  infoInterview,
  rejectInterview,
  unsubmitApply,
} from '../../services/serviceCV';
import { useNavigate } from 'react-router-dom';
function Process() {
  const navigate = useNavigate();
  const id = getCookie('id');
  const [step, setStep] = useState(0);
  const [spam, setSpam] = useState();
  const [info, setInfo] = useState();
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    const getDetailCV = async () => {
      if (id) {
        const result = await getDetailCVForProcess(id);
        if (result.response_data.check_spam === 'false') {
          setStep(0);
          if (result.response_data.status == 'waiting') {
            setStep(1);
            const infomation = await infoInterview(id);
            setInfo(infomation.response_data);
          } else if (
            result.response_data.status == 'interview' ||
            result.response_data.status == 'reject'
          ) {
            setStep(1);
            setAccept(true);
          } else if (result.response_data.status == 'pass') {
            setStep(2);
          }
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };
    getDetailCV();
  }, [id]);

  const onClick = async () => {
    const response = await acceptInterview(id);
    if (
      response.response_data.message == `User status updated to 'interview'`
    ) {
      setAccept(true);
    }
  };

  const onClickReject = async () => {
    const response = await rejectInterview(id);
    if (
      response.response_data.message == `User status updated to 'interview'`
    ) {
      setAccept(true);
    }
  };

  const CancelApply = async () => {
    const response = await unsubmitApply(id);
    if (response) {
      navigate('/jobs')
    }
  }

  return (
    <>
      {/* {contextHolder} */}
      <h1 className='title'>Process</h1>
      <div className='process'>
        <div className='process-main'>
          <div className='process-step'>
            <Steps
              direction='vertical'
              current={step}
              items={[
                {
                  title: 'Apply',
                },
                {
                  title: 'Interview',
                },
                {
                  title: 'Pass',
                },
              ]}
            />
          </div>
          <div className='process-content'>
            <div className='process-info'>
              {step === 0 && (
                <Card
                  className='info'
                  title='Information'
                  bordered={true}
                  style={{
                    width: 400,
                  }}
                >
                  <p>
                    You have applied job success, please wait the recruiment
                    contact with you
                  </p>
                </Card>
              )}
              {step === 1 && (
                <Card
                  className='info'
                  title='Information'
                  bordered={true}
                  style={{
                    width: 400,
                  }}
                >
                  {accept ? (
                    <p className='interview-content'>
                      Please wait the result from recruiment
                    </p>
                  ) : (
                    <div className='interview-content'>
                      <div>
                        {' '}
                        You are scheduled for an interview on{' '}
                        <b>{info?.date}</b>
                      </div>
                      <div>
                        At room {info?.location.room}, {info?.location.floor}th
                        floor company headquarters
                      </div>
                      <div>
                        Time: <b>{info?.location.time}</b>{' '}
                      </div>
                    </div>
                  )}

                  {!accept && (
                    <>
                      <Space>
                        <Button type='primary' onClick={onClick}>
                          Accept
                        </Button>
                        <Button type='primary' danger onClick={onClickReject}>
                          Reject
                        </Button>
                      </Space>
                    </>
                  )}
                </Card>
              )}
              {step === 2 && (
                <Card
                  className='info'
                  title='Information'
                  bordered={true}
                  style={{
                    width: 400,
                  }}
                >
                  <p className='interview-content'>
                    Congratulation you have passed in company
                  </p>
                </Card>
              )}
            </div>
          </div>
          <div className='process-unsubmit'>
              <Button onClick={CancelApply} danger>Cancel apply</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Process;

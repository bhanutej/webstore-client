import { useState } from 'react';
import { Row, Col, Input, notification } from 'antd';
import { useMutation } from "@apollo/client";

import { ADD_NEWS_SUBSCRIBER_MUTATION } from '../../GraphQL/Mutations';
import './NewsLetterSubscription.css';

export const NewsLetterSubscription = () => {
  const [email, setEmail] = useState(null);
  const [newsSubscription] = useMutation(ADD_NEWS_SUBSCRIBER_MUTATION);
  const openNotification = (type, placement, message) => {
    notification[type]({
      message,
      placement,
    });
  };

  const onNewsSubscribe = () => {
    if (email) {
      newsSubscription({
        variables: {
          email
        }
      })
      .then(res => {
        openNotification('success', 'topRight', res.data.addNewsSubscriber.message);
        setEmail(null);
      })
      .catch(error => {
        openNotification('info', 'topRight', error.message);
        setEmail(null);
      });
    }
  }
  return <>
    <div className='news-letter-subscription-container'>
      <Row id='horizontal-row'>
        <Col span={12}>
          <p>Subscribe to our News Letter</p>
        </Col>
        <Col span={12}>
          <div className='letter-form'>
            <Input onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email id to subscribe" value={email} />
            <button onClick={onNewsSubscribe}>Subscribe</button>
          </div>
        </Col>
      </Row>
    </div>

  </>
};

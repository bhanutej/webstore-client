import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Products } from './Products.js/Products';
import { HowItWork } from './HowItWork';
import './Home.css';
import { NewsLetterSubscription } from './NewsLetterSubscription/NewsLetterSubscription';
import { WelcomeContent } from './WelcomeContent';


export const Home = () => {
  const navigate = useNavigate();

  return (<>
    <Row>
      <Col span={3} />
      <Col span={18}>
        <div className="home-container">
          <WelcomeContent />
          <div className="list-products-btn-container">
            <button className="btn-list-products" onClick={() => navigate('/addProduct', { replace: true })}>
              List your Application
            </button>
          </div>
          <div className="top-products-container">
            <p className="products-title">
              Look at Top Performing Products Today . . !
            </p>
            <Products />
          </div>
          <div className="how-it-work-container">
            <HowItWork />
          </div>
          <div className="news-letter-container">
            <NewsLetterSubscription />
          </div>
        </div>
      </Col>
      <Col span={3} />
    </Row>
  </>);
}
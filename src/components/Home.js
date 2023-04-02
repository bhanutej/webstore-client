import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Products } from './Products/Products';
import { HowItWork } from './HowItWork';
import './Home.css';
import { NewsLetterSubscription } from './NewsLetterSubscription/NewsLetterSubscription';
import { WelcomeContent } from './WelcomeContent';
import { useAuth } from '../auth-context/auth';


export const Home = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const validateBeforeAddProduct = () => {
    if (!auth.user) {
      navigate("/signUp", { replace: true });
    } else {
      navigate('/addProduct', { replace: true });
    }
  }

  return (<>
    <Row>
      <Col span={3} />
      <Col span={18}>
        <div className="home-container">
          <WelcomeContent />
          <div className="list-products-btn-container">
            <button className="btn-list-products" onClick={validateBeforeAddProduct}>
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
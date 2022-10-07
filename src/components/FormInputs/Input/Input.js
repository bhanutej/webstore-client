import { Input, Typography } from 'antd';
import './Input.css';

const { Text } = Typography;

export const FormInput = ({ label, onChange, value, isValid, validationText, required }) => {
  return <div className='custom-input-container'>
    <p className='label'>{required ? <Text type='danger'>*</Text> : <></>}{label}</p>
    <Input 
      className="custom-input-box"
      onChange={onChange}
      value={value}
    />
    {!isValid && <p style={{ color: "red" }}>{validationText}</p>}
  </div>
}
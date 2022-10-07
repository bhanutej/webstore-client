import { Input } from 'antd';
import './Input.css';

const { TextArea } = Input;
export const FormTextArea = ({ label, onChange, value }) => {
  return <div className='custom-input-container'>
    <p className='label'>{label}</p>
    <TextArea
      maxLength={2000}
      className="custom-input-box"
      onChange={onChange}
      value={value}
    />
  </div>
}
import { Select } from 'antd';

import './Select.css';

const { Option } = Select;

export const TagSelect = ({ label, onChange, value, isValid, validationText, placeholder, options, mode }) => {
  return <div className='custom-select-container'>
    <p className='label'>{label}</p>
    <Select
      mode={mode}
      className="custom-select-box"
      showSearch
      placeholder={placeholder}
      optionFilterProp="children"
      onChange={onChange}
      // onSearch={onSearch}
      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
      value={value}
    > 
      { options && options.map((option) => {
        return <Option key={`${option}`} value={option}>{option}</Option>
      }) }
    </Select>
    {!isValid && <p style={{ color: "red" }}>{validationText}</p>}
  </div>
};
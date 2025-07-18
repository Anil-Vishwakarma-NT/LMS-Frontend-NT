import React from 'react'
import loader from "../../../assets/Loader3.gif";
import { Alert, Flex, Spin } from 'antd';
import './Loader.css'

const contentStyle = {
  padding: 50,
  background: 'rgba(26, 63, 228, 0.05)',
  borderRadius: 0,
  minHeight: 150
};
const content = <div style={contentStyle} />;
const Loader = () => {
  return (
    <div className='loader-container'>
      <Spin tip="Loading..." size="large">
        {content}
      </Spin>
    </div>
  )
}

export default Loader
import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;

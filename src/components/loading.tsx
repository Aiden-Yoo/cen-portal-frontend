/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/prop-types */
import React from 'react';
import { Spin } from 'antd';

export const Loading = ({ tip }: any) => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin tip={tip ? tip : ''} />
    </div>
  );
};

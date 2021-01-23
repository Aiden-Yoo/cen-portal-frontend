import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserRole } from '../__generated__/globalTypes';
import { useMe } from '../hooks/useMe';

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="home">
            <Link to="/">Home</Link>
          </Menu.Item>
          {(data?.me.role === UserRole.CENSE ||
            data?.me.role === UserRole.CEN) && (
            <Menu.Item key="cen">
              <Link to="/cen">CEN</Link>
            </Menu.Item>
          )}
          <Menu.Item key="partner">
            <Link to="/partner">Partner</Link>
          </Menu.Item>
          <Menu.Item key="mypage">
            {!data?.me ? <Link to="/">MyPage</Link> : data.me.name}
          </Menu.Item>
        </Menu>
      </Layout.Header>
    </>
  );
};

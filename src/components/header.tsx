import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Layout, Menu } from 'antd';
import { UserRole } from '../__generated__/globalTypes';
import { useMe } from '../hooks/useMe';
import { LOCALSTORAGE_TOKEN } from '../constants';

const { SubMenu } = Menu;

export const Header: React.FC = () => {
  const { data } = useMe();
  const history = useHistory();

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
              <Link to="/cen/orders">CEN</Link>
            </Menu.Item>
          )}
          <Menu.Item key="partner">
            <Link to="/partner">Partner</Link>
          </Menu.Item>
          <SubMenu
            key="mypage"
            title={!data?.me ? <Link to="/">MyPage</Link> : data.me.name}
          >
            <Menu.Item key="mypage">
              <Link to="/mypage">프로필</Link>
            </Menu.Item>
            <Menu.Item
              key="logout"
              onClick={() => {
                localStorage.removeItem(LOCALSTORAGE_TOKEN);
                isLoggedInVar(false);
                history.push('/');
              }}
            >
              로그아웃
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Layout.Header>
    </>
  );
};

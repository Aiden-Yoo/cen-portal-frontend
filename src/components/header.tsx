import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Layout, Menu } from 'antd';
import { UserRole } from '../__generated__/globalTypes';
import { useMe } from '../hooks/useMe';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { useEffect } from 'react';
import { logoutMutation } from '../__generated__/logoutMutation';
import { notification } from 'antd';

const { SubMenu } = Menu;

const LOGOUT_MUTATION = gql`
  mutation logoutMutation {
    logout {
      ok
      error
    }
  }
`;

export const Header: React.FC = () => {
  const { data, refetch } = useMe();
  const history = useHistory();

  useEffect(() => {
    refetch();
  }, []);

  const onLogoutCompleted = (logoutResult: logoutMutation) => {
    const {
      logout: { ok, error },
    } = logoutResult;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '로그아웃 성공',
        placement: 'topRight',
        duration: 2,
      });
      localStorage.removeItem(LOCALSTORAGE_TOKEN);
      history.push('/');
      isLoggedInVar(false);
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `[로그아웃 실패] ${error}`,
        placement: 'topRight',
        duration: 0,
      });
    }
  };

  const [logoutMutation, { data: logoutResult, loading, error }] =
    useMutation<logoutMutation>(LOGOUT_MUTATION, {
      onCompleted: onLogoutCompleted,
    });

  if (error) console.log(error);

  const onLogout = () => {
    if (!loading) {
      logoutMutation();
    }
  };

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
            <Link to="/partner/firmwares">Partner</Link>
          </Menu.Item>
          <SubMenu
            key="mypage"
            title={!data?.me ? <Link to="/">MyPage</Link> : data.me.name}
          >
            <Menu.Item key="mypage">
              <Link to="/mypage">프로필</Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={onLogout}>
              로그아웃
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Layout.Header>
    </>
  );
};

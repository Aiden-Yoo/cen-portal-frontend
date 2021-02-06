import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useMe } from '../hooks/useMe';
import { Layout, Menu } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { UserRole } from '../__generated__/globalTypes';
import logo from '../images/CoreEdge_logo.png';
import { NotFound } from '../pages/404';
import { Loading } from '../components/loading';
import { Header } from '../components/header';
import { Order } from '../pages/cen/orders/orders';
import { Partner } from '../pages/cen/partners/partners';
import { Device } from '../pages/cen/devices/devices';
import { AddBundle } from '../pages/cen/devices/addBundle';
import { AddOrder } from '../pages/cen/orders/addOrder';
import { OrderDetail } from '../pages/cen/orders/orderDetail';
import { AddPartner } from '../pages/cen/partners/addPartner';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const LogoColumn = styled.div`
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  padding: 3px;
  height: 46px;
`;

const ContentColumn = styled(Content)`
  margin: 24px 16px 0;
  overflow: initial;
`;

const Contents = styled.div`
  padding: 24;
  min-height: calc(100vh - 108px);
  background: #ffffff;
`;

const cenRoutes = [
  { path: '/cen/orders', component: <Order /> },
  { path: '/cen/orders/add-order', component: <AddOrder /> },
  { path: '/cen/orders/:id', component: <OrderDetail /> },
  // { path: "/cen/orders/:id/edit-order", component: <EditOrder /> },
  { path: '/cen/partners', component: <Partner /> },
  { path: '/cen/partners/add-partner', component: <AddPartner /> },
  // { path: "/cen/partners/:id", component: <PartnerDetail /> },
  // { path: "/cen/partners/:id/edit-partner", component: <EditPartner /> },
  // { path: "/cen/partners/:id/add-contact", component: <AddContact /> },
  { path: '/cen/devices', component: <Device /> },
  { path: '/cen/devices/add-bundle', component: <AddBundle /> },
  // { path: "/cen/devices/add-part", component: <AddPart /> },
  // { path: "/cen/devices/:id", component: <BundleDetail /> },
  // { path: "/cen/devices/:id/edit-bundle", component: <EditBundle /> },
  // { path: "/cen/devices/:id/add-part", component: <AddPart /> },
];

const commonRoutes = [
  { path: '/', component: 'home' },
  // { path: '/', component: <Home /> },
  // { path: "/confirm", component: <ConfirmEmail /> },
  // { path: "/edit-profile", component: <EditProfile /> },
];

const siderRoutes = [
  {
    path: '/cen',
    component: (
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1-1']}
        defaultOpenKeys={['sub1']}
      >
        <SubMenu key="sub1" icon={<UserOutlined />} title="출고요청">
          <Menu.Item key="1-1">
            <Link to="/cen/orders">출고요청서</Link>
          </Menu.Item>
          <Menu.Item key="1-2">
            <Link to="/cen/partners">파트너</Link>
          </Menu.Item>
          <Menu.Item key="1-3">
            <Link to="/cen/devices">제품</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key="6" icon={<VideoCameraOutlined />}>
          nav 2
        </Menu.Item>
        <Menu.Item key="7" icon={<UploadOutlined />}>
          nav 3
        </Menu.Item>
        <Menu.Item key="8" icon={<UserOutlined />}>
          nav 4
        </Menu.Item>
      </Menu>
    ),
  },
  {
    path: '/partner',
    component: (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          partner 1
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          nav 2
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          nav 3
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />}>
          nav 4
        </Menu.Item>
      </Menu>
    ),
  },
];

export const LoggedInRouter: React.FC = () => {
  const year = new Date().getFullYear();
  const { data, loading, error } = useMe();

  return (
    <Router>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            style={{
              height: 'inherit',
              left: 0,
            }}
          >
            <LogoColumn>
              <Link to="/">
                <Logo src={logo} />
              </Link>
            </LogoColumn>
            {siderRoutes.map((route) => (
              <Route key={route.path} path={route.path}>
                {route.component}
              </Route>
            ))}
          </Sider>
          <Layout>
            {/* <Header style={{ padding: 0, background: '#ffffff' }} /> */}
            <Header />
            <Switch>
              {commonRoutes.map((route) => (
                <Route exact key={route.path} path={route.path}>
                  <ContentColumn>
                    <Contents>{route.component}</Contents>
                  </ContentColumn>
                </Route>
              ))}
              {(data?.me.role === UserRole.CENSE ||
                data?.me.role === UserRole.CEN) &&
                cenRoutes.map((route) => (
                  <Route exact key={route.path} path={route.path}>
                    <ContentColumn>
                      <Contents>{route.component}</Contents>
                    </ContentColumn>
                  </Route>
                ))}
              <Route>
                <NotFound />
              </Route>
            </Switch>
            <Footer
              style={{
                textAlign: 'center',
                fontSize: '10px',
                padding: '5px 0',
              }}
            >
              COPYRIGHT© 2017-{year} COREEDGE NETWORKS INC. ALL RIGHTS RESERVED.
            </Footer>
          </Layout>
        </Layout>
      )}
    </Router>
  );
};

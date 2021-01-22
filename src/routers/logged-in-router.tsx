import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
import Loading from '../components/loading';

const { Header, Content, Footer, Sider } = Layout;

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
  { path: '/cen/orders', component: '/cen/orders' },
  { path: '/cen/partners', component: '/cen/partners' },
  { path: '/cen/bundles', component: '/cen/bundles' },
  // { path: "/cen/orders", component: <Order /> },
  // { path: "/cen/orders/add-order", component: <AddOrder /> },
  // { path: "/cen/orders/:id", component: <OrderDetail /> },
  // { path: "/cen/orders/:id/edit-order", component: <EditOrder /> },
  // { path: "/cen/partners", component: <Partner /> },
  // { path: "/cen/partners/add-partner", component: <AddPartner /> },
  // { path: "/cen/partners/:id", component: <PartnerDetail /> },
  // { path: "/cen/partners/:id/edit-partner", component: <EditPartner /> },
  // { path: "/cen/partners/:id/add-contact", component: <AddContact /> },
  // { path: "/cen/bundles", component: <Device /> },
  // { path: "/cen/bundles/add-bundle", component: <AddBundle /> },
  // { path: "/cen/bundles/add-part", component: <AddPart /> },
  // { path: "/cen/bundles/:id", component: <BundleDetail /> },
  // { path: "/cen/bundles/:id/edit-bundle", component: <EditBundle /> },
  // { path: "/cen/bundles/:id/add-part", component: <AddPart /> },
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
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          cen 1
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

  if (!data || loading || error) {
    return <Loading />;
  }

  return (
    <Router>
      <Switch>
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
              <Logo src={logo} />
            </LogoColumn>
            {siderRoutes.map((route) => (
              <Route key={route.path} path={route.path}>
                {route.component}
              </Route>
            ))}
          </Sider>

          <Layout>
            <Header
              className="site-layout-sub-header-background"
              style={{ padding: 0, background: '#ffffff' }}
            />
            {(data.me.role === UserRole.CENSE ||
              data.me.role === UserRole.CEN) &&
              cenRoutes.map((route) => (
                <Route exact key={route.path} path={route.path}>
                  <ContentColumn>
                    <Contents>{route.component}</Contents>
                  </ContentColumn>
                </Route>
              ))}
            {commonRoutes.map((route) => (
              <Route exact key={route.path} path={route.path}>
                <Route exact key={route.path} path={route.path}>
                  <ContentColumn>
                    <Contents>{route.component}</Contents>
                  </ContentColumn>
                </Route>
              </Route>
            ))}
            {/* <Route>
              <NotFound />
            </Route> */}
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
      </Switch>
    </Router>
  );
};

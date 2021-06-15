import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import styled from 'styled-components';
import { Form, Input, Button, Spin, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LOCALSTORAGE_TOKEN } from '../constants';
import logo from '../images/CoreEdge_logo.png';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: no-repeat url() center center;
  background-color: rgba(21, 20, 13, 0.5);
  background-size: 1920px 640px;
`;

const LoginHeader = styled.header`
  padding-left: 5px;
  position: absolute;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 60px;
  background-color: rgba(21, 20, 13, 0.5);
`;

const Logo = styled.img`
  width: 234px;
  height: 50px;
`;

const Box = styled.div`
  margin-left: 100px;
  background-color: white;
  border: 1px solid #e6e6e6;
  text-align: center;
  width: 300px;
`;

const Column = styled.div`
  width: 20%;
`;

const SwitchBox = styled(Box)`
  padding: 25px 0px;
  margin-top: 15px;
`;

const SwitchLink = styled.span`
  color: ${(props) => props.theme.colors.green_1};
  cursor: pointer;
`;

const FormBox = styled(Box)`
  padding: 30px;
`;

const SButton = styled(Button)`
  width: 100%;
`;

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

export const Login: React.FC = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token, error },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      notification.success({
        message: 'Success!',
        description: '로그인 성공',
        placement: 'topRight',
        duration: 1,
      });
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `[로그인 실패] ${error}`,
        placement: 'topRight',
        duration: 0,
      });
    }
  };

  const [loginMutation, { data, loading, error }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  if (error) console.log(error);

  const onFinish = () => {
    if (!loading) {
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
      setUsername('');
      setPassword('');
    }
  };

  const onChangeHandler = (event: any) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setUsername(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <>
      <Helmet>
        <title>Log in | CEN Portal</title>
      </Helmet>
      <LoginHeader>
        <Logo src={logo} />
      </LoginHeader>
      <Container>
        <Column>
          <FormBox>
            <Form onFinish={onFinish}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '사용자 계정을 입력하세요',
                  },
                  {
                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: '이메일 형태로 입력해주세요',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                  value={email}
                  name="email"
                  type="text"
                  onChange={onChangeHandler}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '비밀번호를 입력하세요',
                  },
                  { min: 5, message: '비밀번호는 최소 5자리입니다' },
                  { max: 20, message: '비밀번호는 최대 20자리입니다' },
                  {
                    pattern: /^[a-zA-Z0-9_!@#$%^&*()_+-={},./<>?;:'"]+$/,
                    message: '유효하지 않은 문자를 입력했습니다',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Password"
                  value={password}
                  name="password"
                  type="password"
                  onChange={onChangeHandler}
                />
              </Form.Item>
              <SButton type="primary" htmlType="submit">
                {!loading ? '로그인' : <Spin />}
              </SButton>
            </Form>
          </FormBox>
          <SwitchBox>
            회원가입이 필요하신가요?{' '}
            <SwitchLink>
              <Link to="/create-account">회원가입</Link>
            </SwitchLink>
          </SwitchBox>
        </Column>
      </Container>
    </>
  );
};

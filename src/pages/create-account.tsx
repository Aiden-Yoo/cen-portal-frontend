import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Select } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  TagOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import logo from '../images/CoreEdge_logo.png';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
import { UserRole } from '../__generated__/globalTypes';

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

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

export const CreateAccount: React.FC = () => {
  const [email, setUsername] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Partner);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [team, setTeam] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const history = useHistory();

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert('Account Created! Log in now!');
      history.push('/');
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult, error },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    },
  );

  if (loading) console.log('loading...');
  if (error) console.log(error);

  const onFinish = () => {
    if (!loading) {
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
            company,
            name,
            team,
            jobTitle,
          },
        },
      });
      setUsername('');
      setPassword('');
      setPasswordConfirm('');
      setRole(UserRole.Partner);
      setName('');
      setCompany('');
      setTeam('');
      setJobTitle('');
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };

  const onChangeHandler = (event: any) => {
    if (typeof event === 'string') {
      if (event === 'CEN') setRole(UserRole.CEN);
      else if (event === 'Partner') setRole(UserRole.Partner);
      else if (event === 'Client') setRole(UserRole.Client);
    } else {
      const {
        target: { name, value },
      } = event;
      if (name === 'email') {
        setUsername(value);
      } else if (name === 'password') {
        setPassword(value);
      } else if (name === 'passwordConfirm') {
        setPasswordConfirm(value);
      } else if (name === 'name') {
        setName(value);
      } else if (name === 'company') {
        setCompany(value);
      } else if (name === 'team') {
        setTeam(value);
      } else if (name === 'jobTitle') {
        setJobTitle(value);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | CEN Portal</title>
      </Helmet>
      <LoginHeader>
        <Logo src={logo} />
      </LoginHeader>
      <Container>
        <Column>
          <FormBox>
            <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Form.Item
                name="role"
                rules={[
                  { required: true, message: '회원 구분을 선택해주세요' },
                ]}
              >
                <Select
                  placeholder="Member Role"
                  value={role}
                  onChange={onChangeHandler}
                >
                  {/* {Object.keys(UserRole).map((role, index) => (
                    <Select.Option key={index} value={role}>
                      {role}
                    </Select.Option>
                  ))} */}
                  <Select.Option value={UserRole.CEN}>
                    코어엣지네트웍스
                  </Select.Option>
                  <Select.Option value={UserRole.Partner}>파트너</Select.Option>
                  <Select.Option value={UserRole.Client}>고객</Select.Option>
                </Select>
              </Form.Item>
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
              <Form.Item
                name="passwordConfirm"
                rules={[
                  {
                    required: true,
                    message: '비밀번호를 재입력 해주세요',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('비밀번호가 불일치합니다');
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Confirm Password"
                  value={passwordConfirm}
                  name="passwordConfirm"
                  type="password"
                  onChange={onChangeHandler}
                />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: '이름을 입력해주세요',
                    whitespace: true,
                  },
                ]}
              >
                <Input
                  prefix={<TagOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Name"
                  value={name}
                  name="name"
                  type="text"
                  onChange={onChangeHandler}
                />
              </Form.Item>
              <Form.Item
                name="company"
                rules={[
                  {
                    required: true,
                    message: '회사명을 입력해주세요',
                    whitespace: true,
                  },
                ]}
              >
                <Input
                  prefix={
                    <SnippetsOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Company Name"
                  value={company}
                  name="company"
                  type="text"
                  onChange={onChangeHandler}
                />
              </Form.Item>
              <Form.Item
                name="team"
                rules={[
                  {
                    required: false,
                    message: '팀명을 입력해주세요',
                    whitespace: true,
                  },
                ]}
              >
                <Input
                  prefix={
                    <SnippetsOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Team Name"
                  value={team}
                  name="team"
                  type="text"
                  onChange={onChangeHandler}
                />
              </Form.Item>
              <Form.Item
                name="jobTitle"
                rules={[
                  {
                    required: false,
                    message: '직함이나 직책을 입력해주세요',
                    whitespace: true,
                  },
                ]}
              >
                <Input
                  prefix={
                    <SnippetsOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Job Title"
                  value={jobTitle}
                  name="jobTitle"
                  type="text"
                  onChange={onChangeHandler}
                />
              </Form.Item>
              <SButton type="primary" htmlType="submit">
                회원가입
              </SButton>
            </Form>
          </FormBox>
          <SwitchBox>
            이미 사용자 계정이 있으신가요?{' '}
            <SwitchLink>
              <Link to="/">로그인</Link>
            </SwitchLink>
          </SwitchBox>
        </Column>
      </Container>
    </>
  );
};

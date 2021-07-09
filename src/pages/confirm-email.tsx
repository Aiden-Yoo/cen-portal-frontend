import { gql, useMutation } from '@apollo/client';
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import logo from '../images/CoreEdge_logo.png';
import background from '../images/background.jpg';
import styled from 'styled-components';
import {
  verifyEmail,
  verifyEmailVariables,
} from '../__generated__/verifyEmail';
import { useHistory } from 'react-router';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: no-repeat url(${background});
  background-color: rgba(21, 20, 13, 0.5);
  background-size: cover;
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
  width: 400px;
`;

const Column = styled.div`
  width: 20%;
`;

const FormBox = styled(Box)`
  padding: 30px;
`;

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail: React.FC = () => {
  const history = useHistory();

  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '이메일 인증 성공',
        placement: 'topRight',
        duration: 2,
      });
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `[이메일 인증 실패] ${error}`,
        placement: 'topRight',
        duration: 3,
      });
    }
    history.push('/');
  };

  const [verifyEmail, { loading: verifyingEmail }] = useMutation<
    verifyEmail,
    verifyEmailVariables
  >(VERIFY_EMAIL_MUTATION, { onCompleted });

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);

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
            <h2>이메일 확인 중입니다.</h2>
            <h4>이 창을 닫지 마시고, 잠시만 기다려주시기 바랍니다.</h4>
          </FormBox>
        </Column>
      </Container>
    </>
  );
};

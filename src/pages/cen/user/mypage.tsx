import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { gql, useMutation, useApolloClient } from '@apollo/client';
import { Button, Form, Input, notification, Descriptions, Spin } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';
import {
  editProfileMutation,
  editProfileMutationVariables,
} from '../../../__generated__/editProfileMutation';

const Wrapper = styled.div`
  padding: 20px;
`;

const TitleBar = styled.div`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const MenuBar = styled.span`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const ContentBar = styled.div`
  padding: 0 20%;
`;

const SButton = styled(Button)`
  margin-left: 8px;
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormValue {
  password: string | undefined;
  passwordConfirm: string | undefined;
  team: string | undefined;
  jobTitle: string | undefined;
  bio: string | undefined;
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const tailLayout = {
  wrapperCol: { offset: 18 },
};

export const MyPage: React.FC = () => {
  const { data: userData, loading } = useMe();
  const client = useApolloClient();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<IFormValue>();

  const onCompleted = (data: editProfileMutation) => {
    const {
      editProfile: { ok, error },
    } = data;
    if (ok && userData?.me.id && inputValue) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            team
            jobTitle
            bio
          }
        `,
        data: {
          team: inputValue.team,
          jobTitle: inputValue.jobTitle,
          bio: inputValue.bio,
        },
      });
      notification.success({
        message: 'Success!',
        description: `변경 성공`,
        placement: 'topRight',
        duration: 1,
      });
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `변경 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
    setIsEdit(!isEdit);
  };

  const [editProfileMutation, { data }] = useMutation<
    editProfileMutation,
    editProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });

  const handleCancel = () => {
    setIsEdit(!isEdit);
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const onFinish = (value: IFormValue) => {
    setInputValue(value);
    console.log(value);
    if (!value.password && !value.team && !value.jobTitle && !value.bio) {
      notification.error({
        message: 'Error',
        description: `입력한 정보가 없습니다.`,
        placement: 'topRight',
        duration: 1,
      });
    } else if (!loading) {
      editProfileMutation({
        variables: {
          input: {
            password: value.password,
            team: value.team,
            jobTitle: value.jobTitle,
            bio: value.bio,
          },
        },
      });
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Wrapper>
      <Helmet>
        <title>MyPage | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <UserOutlined />
        {' 프로필'}
      </TitleBar>
      <MenuBar>
        {isEdit ? (
          <SButton type="primary" size="small" onClick={handleCancel}>
            Cancel
          </SButton>
        ) : (
          <SButton type="primary" size="small" onClick={handleEdit}>
            Edit
          </SButton>
        )}
      </MenuBar>
      <ContentBar>
        {isEdit ? (
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="이름">{userData?.me.name}</Form.Item>
            <Form.Item label="이메일">{userData?.me.email}</Form.Item>
            <Form.Item label="회사">{userData?.me.company}</Form.Item>
            <Form.Item
              label="비밀번호"
              name="password"
              rules={[
                {
                  required: false,
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
                name="password"
                type="password"
              />
            </Form.Item>
            <Form.Item
              label="비밀번호 확인"
              name="passwordConfirm"
              rules={[
                {
                  required: false,
                  whitespace: true,
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
                name="passwordConfirm"
                type="password"
              />
            </Form.Item>
            <Form.Item
              label="팀명"
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
                placeholder={
                  userData?.me.team ? (userData?.me.team as string) : `Team`
                }
                name="team"
                type="text"
              />
            </Form.Item>
            <Form.Item
              label="직함/직급"
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
                placeholder={
                  userData?.me.jobTitle
                    ? (userData?.me.jobTitle as string)
                    : `Job Title`
                }
                name="jobTitle"
                type="text"
              />
            </Form.Item>
            <Form.Item label="자기소개" name="bio">
              <Input.TextArea
                placeholder={
                  userData?.me.bio ? (userData?.me.bio as string) : `자기소개`
                }
                autoSize={{ minRows: 4, maxRows: 10 }}
                name="bio"
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <SButton type="primary" htmlType="submit">
                {!loading ? 'Submit' : <Spin />}
              </SButton>
            </Form.Item>
          </Form>
        ) : (
          <Descriptions bordered>
            <Descriptions.Item label="이름" span={3}>
              {userData?.me.name}
            </Descriptions.Item>
            <Descriptions.Item label="이메일" span={3}>
              {userData?.me.email}
            </Descriptions.Item>
            <Descriptions.Item label="회사" span={3}>
              {userData?.me.company}
            </Descriptions.Item>
            <Descriptions.Item label="팀" span={3}>
              {userData?.me.team}
            </Descriptions.Item>
            <Descriptions.Item label="직함/직급" span={3}>
              {userData?.me.jobTitle}
            </Descriptions.Item>
            <Descriptions.Item label="자기소개" span={3}>
              {userData?.me.bio}
            </Descriptions.Item>
          </Descriptions>
        )}
      </ContentBar>
    </Wrapper>
  );
};

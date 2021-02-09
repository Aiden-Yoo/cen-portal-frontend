import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import {
  Popconfirm,
  Form,
  Button,
  notification,
  Input,
  Space,
  Select,
  Tooltip,
} from 'antd';
import {
  FolderOpenOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  createContactMutation,
  createContactMutationVariables,
} from '../../../__generated__/createContactMutation';

const { Option } = Select;

const Wrapper = styled.div`
  padding: 20px;
`;

const TitleBar = styled.div`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const FormColumn = styled.div`
  margin-top: 40px;
`;

const CREATE_CONTACT_MUTATION = gql`
  mutation createContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      ok
      error
    }
  }
`;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 10 },
};

export const AddContact = () => {
  const history = useHistory();
  const contactId: any = useParams();
  const [form] = Form.useForm();

  const onCompleted = (data: createContactMutation) => {
    const {
      createContact: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '연락처 등록 성공',
        placement: 'topRight',
        duration: 1,
      });
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `연락처 등록 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [createContactMutation, { data: createContactData }] = useMutation<
    createContactMutation,
    createContactMutationVariables
  >(CREATE_CONTACT_MUTATION, {
    onCompleted,
  });

  const onFinish = (values: any) => {
    createContactMutation({
      variables: {
        input: {
          partnerId: +contactId.id,
          name: values.name,
          jobTitle: values.jobTitle,
          team: values.team,
          tel: values.tel,
        },
      },
    });
    history.goBack();
    setTimeout(() => {
      history.go(0);
    }, 10);
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Add Contacts | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 연락처 등록'}
      </TitleBar>
      <FormColumn>
        <Form form={form} onFinish={onFinish} autoComplete="off" {...layout}>
          <Form.Item
            name="name"
            label={
              <span>
                {'이름 '}
                <Tooltip title="이름 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '이름을 입력해주세요.' }]}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            name="jobTitle"
            label={
              <span>
                {'직급/직함 '}
                <Tooltip title="직급/직함 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: '직급 or 직함을 입력 해주세요.' },
            ]}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            name="team"
            label={
              <span>
                {'팀명 '}
                <Tooltip title="팀명 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            name="tel"
            label={
              <span>
                {'연락처 '}
                <Tooltip title="연락처 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '연락처를 입력 해주세요.' }]}
          >
            <Input style={{ width: 200 }} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Submit
            </Button>
            <Button type="primary">
              <Popconfirm
                title="정말 취소 하시겠습니까?"
                onConfirm={() => history.goBack()}
              >
                Cancel
              </Popconfirm>
            </Button>
          </Form.Item>
        </Form>
      </FormColumn>
    </Wrapper>
  );
};

import React from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
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
  createPartnerMutation,
  createPartnerMutationVariables,
} from '../../../__generated__/createPartnerMutation';

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

const CREATE_PARTNER_MUTATION = gql`
  mutation createPartnerMutation($input: CreatePartnerInput!) {
    createPartner(input: $input) {
      ok
      error
    }
  }
`;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 2, span: 10 },
};

export const AddPartner = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const onCompleted = (data: createPartnerMutation) => {
    const {
      createPartner: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '파트너 등록 성공',
        placement: 'topRight',
        duration: 1,
      });
      // setSelectedRowKeys([]);
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `파트너 등록 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [createPartnerMutation, { data: createPartnerData }] = useMutation<
    createPartnerMutation,
    createPartnerMutationVariables
  >(CREATE_PARTNER_MUTATION, {
    onCompleted,
  });

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    createPartnerMutation({
      variables: {
        input: {
          name: values.name,
          address: values.address,
          zip: values.zip,
          tel: values.tel,
        },
      },
    });
    history.goBack();
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Add Partners | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 파트너 등록'}
      </TitleBar>
      <FormColumn>
        <Form form={form} onFinish={onFinish} autoComplete="off" {...layout}>
          <Form.Item
            name="name"
            label={
              <span>
                {'Partner '}
                <Tooltip title="파트너명 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '파트너 이름을 입력해주세요.' }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            name="address"
            label={
              <span>
                {'Address '}
                <Tooltip title="주소 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '주소를 입력 해주세요.' }]}
          >
            <Input style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            name="zip"
            label={
              <span>
                {'Zip '}
                <Tooltip title="우편번호 입력">
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
                {'Tel '}
                <Tooltip title="회사번호 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
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

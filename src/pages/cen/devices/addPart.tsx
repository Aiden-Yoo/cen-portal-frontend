import React from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import { Popconfirm, Form, Button, notification, Input, Tooltip } from 'antd';
import { FolderOpenOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  createPartMutation,
  createPartMutationVariables,
} from '../../../__generated__/createPartMutation';

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

const CREATE_PART_MUTATION = gql`
  mutation createPartMutation($input: CreatePartInput!) {
    createPart(input: $input) {
      ok
      error
    }
  }
`;

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 3, span: 10 },
};

export const AddPart = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const onCompleted = (data: createPartMutation) => {
    const {
      createPart: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '번들 등록 성공',
        placement: 'topRight',
        duration: 1,
      });
      // setSelectedRowKeys([]);
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `번들 등록 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [createPartMutation, { data: createPartData }] = useMutation<
    createPartMutation,
    createPartMutationVariables
  >(CREATE_PART_MUTATION, {
    onCompleted,
  });

  const onFinish = (values: any) => {
    // console.log('Received values of form:', values);
    createPartMutation({
      variables: {
        input: {
          name: values.name,
          series: values.series,
          description: values.description,
        },
      },
    });
    history.goBack();
  };

  const handleChange = () => {
    form.setFieldsValue({ parts: [] });
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Add Parts | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 제품 등록 - Parts'}
      </TitleBar>
      <FormColumn>
        <Form form={form} onFinish={onFinish} autoComplete="off" {...layout}>
          <Form.Item
            name="name"
            label={
              <span>
                {'Name '}
                <Tooltip title="부품명 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '부품 이름을 입력해주세요.' }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            name="series"
            label={
              <span>
                {'Series '}
                <Tooltip title="시리즈명 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '시리즈 이름를 입력해주세요.' }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item
            name="description"
            label={
              <span>
                {'Description '}
                <Tooltip title="참고사항 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
          >
            <Input.TextArea style={{ width: 500 }} />
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

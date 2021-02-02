import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Table,
  Popconfirm,
  Form,
  Typography,
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
  createBundleMutation,
  createBundleMutationVariables,
} from '../../../__generated__/createBundleMutation';

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

const CREATE_BUNDLE_MUTATION = gql`
  mutation createBundleMutation($input: CreateBundleInput!) {
    createBundle(input: $input) {
      ok
      error
    }
  }
`;

export const AddBundle = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const onCompleted = (data: createBundleMutation) => {
    const {
      createBundle: { ok, error },
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

  const [createBundleMutation, { data: createBundleData }] = useMutation<
    createBundleMutation,
    createBundleMutationVariables
  >(CREATE_BUNDLE_MUTATION, {
    onCompleted,
  });

  const onFinish = (values: any) => {
    // console.log('Received values of form:', values);
    const parts: any[] = [];
    for (const part in values.parts) {
      parts.push({
        name: values.parts[part].name,
        num: +values.parts[part].num,
      });
    }
    createBundleMutation({
      variables: {
        input: {
          name: values.name,
          series: values.series,
          parts: parts,
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
        <title>Add Bundles | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 제품 등록'}
      </TitleBar>
      <FormColumn>
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="name"
            label={
              <span>
                {'Bundle '}
                <Tooltip title="번들명 입력">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '번들 이름을 입력해주세요.' }]}
            style={{ width: 300 }}
          >
            <Input />
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
            style={{ width: 300 }}
          >
            <Input />
          </Form.Item>
          <Form.List name="parts">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline">
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.area !== curValues.area ||
                        prevValues.parts !== curValues.parts
                      }
                    >
                      {() => (
                        <Form.Item
                          {...field}
                          label={
                            <span>
                              Part{' '}
                              <Tooltip title="번들에 포함된 부품(Parts) 입력">
                                <QuestionCircleOutlined />
                              </Tooltip>
                            </span>
                          }
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={[
                            { required: true, message: '부품을 입력해주세요.' },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label={
                        <span>
                          Num{' '}
                          <Tooltip title="번들에 포함된 부품(Parts) 입력">
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      name={[field.name, 'num']}
                      fieldKey={[field.fieldKey, 'num']}
                      rules={[
                        { required: true, message: '부품 수를 입력해주세요' },
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Parts
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
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

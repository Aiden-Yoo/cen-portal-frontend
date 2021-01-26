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
  Descriptions,
} from 'antd';
import {
  FolderOpenOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  createOrderMutation,
  createOrderMutationVariables,
} from '../../../__generated__/createOrderMutation';
import { useMe } from '../../../hooks/useMe';
import { useAllBundles } from '../../../hooks/useAllBundles';

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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrderMutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

// const ALL_BUNDLES_QUERY = gql`
//   query allBundlesQuery {
//     allBundles {
//       ok
//       error
//       bundles {
//         id
//         name
//         series
//       }
//     }
//   }
// `;

export const AddOrder = () => {
  const { data: meData, loading: meLoading } = useMe();
  // const { data: meData, loading: meLoading} = useMe(); // getBundles query
  const {
    data: bundleData,
    loading: bundleLoading,
    refetch: bundleFetch,
  } = useAllBundles();
  const history = useHistory();
  const [form] = Form.useForm();

  if (meData) {
    console.log(meData);
  }
  if (bundleData) {
    console.log(bundleData);
  }

  const onCompleted = (data: createOrderMutation) => {
    const {
      createOrder: { ok, error },
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

  const [createOrderMutation, { data: createOrderData }] = useMutation<
    createOrderMutation,
    createOrderMutationVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const onFinish = (values: any) => {
    // console.log('Received values of form:', values);
    const orderItems: any[] = [];
    // for (const orderItem in values.orderItems) {
    //   orderItems.push({
    //     name: values.orderItems[part].name,
    //     num: +values.orderItems[part].num,
    //   });
    // }
    // createOrderMutation({
    //   variables: {
    //     input: {
    //       name: values.name,
    //       series: values.series,
    //       orderItems: orderItems,
    //     },
    //   },
    // });
    // history.goBack();
  };

  const handleChange = () => {
    form.setFieldsValue({ parts: [] });
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Add Orders | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 출고요청서 등록'}
      </TitleBar>
      <FormColumn>
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Descriptions
            bordered
            size="small"
            labelStyle={{ backgroundColor: '#F0F2F5' }}
          >
            <Descriptions.Item
              label={
                <span>
                  {'담당영업 '}
                  <Tooltip title="담당영업 입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
            >
              <Form.Item
                name="salesPerson"
                rules={[
                  { required: true, message: '담당 영업을 입력해주세요.' },
                ]}
              >
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Form.Item
              name="projectName"
              label={
                <span>
                  {'프로젝트 '}
                  <Tooltip title="프로젝트명 입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '프로젝트를 입력해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="classification"
              label={
                <span>
                  {'출고구분 '}
                  <Tooltip title="출고구분 선택">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '출고 구분을 선택해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="orderSheet"
              label={
                <span>
                  {'발주서접수 '}
                  <Tooltip title="발주서 접수 여부">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="destination"
              label={
                <span>
                  {'납품처 '}
                  <Tooltip title="납품처 입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '납품처를 입력해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="receiver"
              label={
                <span>
                  {'수령인 '}
                  <Tooltip title="수령인 입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '수령인를 입력해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="contact"
              label={
                <span>
                  {'수령인 연락처 '}
                  <Tooltip title="수령인 연락처 입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[
                { required: true, message: '수령인 연락처를 입력해주세요.' },
              ]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label={
                <span>
                  {'납품장소 '}
                  <Tooltip title="납품장소 입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '납품장소를 입력해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deliveryDate"
              label={
                <span>
                  {'납품일 '}
                  <Tooltip title="납품일 입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '납품일을 입력해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deliveryType"
              label={
                <span>
                  {'출고형태 '}
                  <Tooltip title="출고형태 선택">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '출고형태를 선택해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deliveryMethod"
              label={
                <span>
                  {'배송방법 '}
                  <Tooltip title="배송방법 선택">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '배송방법을 선택해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label={
                <span>
                  {'상태 '}
                  <Tooltip title="상태 선택">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: '상태를 선택해주세요.' }]}
              style={{ width: 300 }}
            >
              <Input />
            </Form.Item>
            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.area !== curValues.area ||
                          prevValues.items !== curValues.items
                        }
                      >
                        {() => (
                          <Form.Item
                            {...field}
                            label={
                              <span>
                                {'Bundle '}
                                <Tooltip title="번들 선택">
                                  <QuestionCircleOutlined />
                                </Tooltip>
                              </span>
                            }
                            name={[field.name, 'name']}
                            fieldKey={[field.fieldKey, 'name']}
                            rules={[
                              {
                                required: true,
                                message: '번들 이름을 선택해주세요.',
                              },
                            ]}
                          >
                            <Select style={{ width: 300 }}>
                              {/* {(sights[form.getFieldValue('area')] || []).map(item => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))} */}
                              <Option key={1} value={'11'}>
                                {'11'}
                              </Option>
                              <Option key={2} value={'22'}>
                                {'22'}
                              </Option>
                            </Select>
                          </Form.Item>
                        )}
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label={
                          <span>
                            {'Num '}
                            <Tooltip title="번들 수 입력">
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </span>
                        }
                        name={[field.name, 'num']}
                        fieldKey={[field.fieldKey, 'num']}
                        rules={[
                          { required: true, message: '번들 수를 입력해주세요' },
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
                      Add Bundles
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 8 }}
              >
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
          </Descriptions>
        </Form>
      </FormColumn>
    </Wrapper>
  );
};

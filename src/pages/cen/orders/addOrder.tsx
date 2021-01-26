import React, { useState, useEffect } from 'react';
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
  Badge,
  Checkbox,
  DatePicker,
  Divider,
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
import {
  DeliveryMethod,
  DeliveryType,
  OrderClassification,
  OrderStatus,
} from '../../../__generated__/globalTypes';
import { useMe } from '../../../hooks/useMe';
import { useAllBundles } from '../../../hooks/useAllBundles';
import { useAllPartners } from '../../../hooks/useAllPartners';

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

export const AddOrder = () => {
  const { data: meData, loading: meLoading } = useMe();
  const {
    data: bundleData,
    loading: bundleLoading,
    refetch: bundleFetch,
  } = useAllBundles();
  const {
    data: partnerData,
    loading: partnerLoading,
    refetch: partnerFetch,
  } = useAllPartners();
  const history = useHistory();
  const [form] = Form.useForm();
  const [partners, setPartners] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  const [destItem, setDestItem] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [addrItem, setAddrItem] = useState<string[]>([]);
  const [newReceiver, setNewReceiver] = useState('');
  const [recvItem, setRecvItem] = useState<string[]>([]);
  const [newTel, setNewTel] = useState('');
  const [telItem, setTelItem] = useState<string[]>([]);
  const [telItemTemp, setTelItemTemp] = useState<string[]>([]);

  if (meData) {
    console.log(meData);
  }
  if (bundleData) {
    console.log(bundleData);
  }
  // if (partnerData && !partnerLoading) {
  //   console.log(partnerData.allPartners.partners);
  //   const allPartners: any = partnerData.allPartners.partners;
  //   setPartners(allPartners);
  //   console.log(partners);
  // }

  useEffect(() => {
    const partnersName: string[] = [];
    if (partnerData) {
      console.log(partnerData);
      const allPartners: any = partnerData.allPartners.partners;
      setPartners(allPartners);
      allPartners.map((partner: any) => partnersName.push(partner.name));
      setDestItem(partnersName);
    }
  }, [partnerData]);

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

  const handleChange = (event: any, option?: any) => {
    form.setFieldsValue({ parts: [] });
    console.log(event, option);
  };

  const onPartnerIdChange = (event: any, option?: any) => {
    const partner: any = partners[option.key];
    const recvTemp: string[] = [];
    const telTemp: string[] = [];
    setRecvItem([]);
    setTelItem([]);
    setAddrItem([partner.address]);
    partner.contacts.map((contact: any) => {
      recvTemp.push(contact.name + ' ' + contact.jobTitle);
      telTemp.push(contact.tel);
    });
    setRecvItem(recvTemp);
    setTelItemTemp(telTemp);
  };

  const onReceiverIdChange = (event: any, option?: any) => {
    const telTemp: string = telItemTemp[option.key];
    setTelItem([telTemp]);
  };

  const onDestinationChange = (event: any) => {
    setNewDestination(event.target.value);
  };

  const addDestination = () => {
    setDestItem([...destItem, newDestination]);
    setNewDestination('');
  };

  const onAddressChange = (event: any) => {
    setNewAddress(event.target.value);
  };

  const addAddress = () => {
    setAddrItem([...addrItem, newAddress]);
    setNewAddress('');
  };

  const onReceiverChange = (event: any) => {
    setNewReceiver(event.target.value);
  };

  const addReceiver = () => {
    setRecvItem([...recvItem, newReceiver]);
    setNewReceiver('');
  };

  const onTelChange = (event: any) => {
    setNewTel(event.target.value);
  };

  const addTel = () => {
    setTelItem([...telItem, newTel]);
    setNewTel('');
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
            <Descriptions.Item label="작성일자">
              <Form.Item name="writeDate">
                <Input
                  defaultValue={new Date().toLocaleDateString()}
                  disabled
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="담당영업">
              <Form.Item name="salesPerson">
                <Input defaultValue={meData?.me.name} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="작성자">
              <Form.Item name="writer">
                <Input defaultValue={meData?.me.name} disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="프로젝트명" span={2}>
              <Form.Item name="projectName">
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Form.Item name="status">
                <Badge status="processing" text="출고요청" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="구분">
              <Form.Item name="classification">
                <Select onChange={handleChange}>
                  <Option value={OrderClassification.Sale}>판매</Option>
                  <Option value={OrderClassification.Demo}>Demo</Option>
                  <Option value={OrderClassification.RMA}>RMA</Option>
                  <Option value={OrderClassification.DoA}>DoA</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Demo 회수일자">
              <Form.Item name="demoReturnDate">
                <Space direction="vertical">
                  <DatePicker onChange={handleChange} />
                </Space>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="발주서 접수">
              <Form.Item name="orderSheet">
                <Checkbox onChange={handleChange} defaultChecked={false} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="거래처">
              <Form.Item name="partnerId">
                <Select
                  onChange={onPartnerIdChange}
                  placeholder="거래처 선택"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option: any): any =>
                    option.children.indexOf(input) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.value.localeCompare(optionB.value)
                  }
                >
                  {partners.map((partner: any, index: number) => (
                    <Option key={index} value={partner.id}>
                      {partner?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  {'납품처 '}
                  <Tooltip title="리스트에 없는 경우, 직접입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
            >
              <Form.Item name="newDestination">
                <Select
                  onChange={handleChange}
                  placeholder="납품처 입력"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          padding: 8,
                        }}
                      >
                        <Input
                          style={{ flex: 'auto' }}
                          value={newDestination}
                          onChange={onDestinationChange}
                        />
                        <a
                          style={{
                            flex: 'none',
                            padding: '8px',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={addDestination}
                        >
                          <PlusOutlined /> Add item
                        </a>
                      </div>
                    </div>
                  )}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option: any): any =>
                    option.children.indexOf(input) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.value.localeCompare(optionB.value)
                  }
                >
                  {destItem.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="납품일">
              <Form.Item name="deliveryDate">
                <Space direction="vertical">
                  <DatePicker />
                </Space>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="출고형태" span={2}>
              <Form.Item name="deliveryType">
                <Select>
                  <Option value={DeliveryType.Total}>전체출고</Option>
                  <Option value={DeliveryType.Partial}>부분출고</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="배송방법" span={2}>
              <Form.Item name="deliveryMethod">
                <Select>
                  <Option value={DeliveryMethod.Parcel}>택배</Option>
                  <Option value={DeliveryMethod.Quick}>퀵</Option>
                  <Option value={DeliveryMethod.Cargo}>화물</Option>
                  <Option value={DeliveryMethod.Directly}>직접배송</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="수령자" span={2}>
              <Form.Item name="receiver">
                <Select
                  onChange={onReceiverIdChange}
                  placeholder="수령자 입력"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          padding: 8,
                        }}
                      >
                        <Input
                          style={{ flex: 'auto' }}
                          value={newReceiver}
                          onChange={onReceiverChange}
                        />
                        <a
                          style={{
                            flex: 'none',
                            padding: '8px',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={addReceiver}
                        >
                          <PlusOutlined /> Add item
                        </a>
                      </div>
                    </div>
                  )}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option: any): any =>
                    option.children.indexOf(input) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.value.localeCompare(optionB.value)
                  }
                >
                  {recvItem.map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="연락처">
              <Form.Item name="contact">
                <Select
                  onChange={handleChange}
                  placeholder="연락처 입력"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          padding: 8,
                        }}
                      >
                        <Input
                          style={{ flex: 'auto' }}
                          value={newTel}
                          onChange={onTelChange}
                        />
                        <a
                          style={{
                            flex: 'none',
                            padding: '8px',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={addTel}
                        >
                          <PlusOutlined /> Add item
                        </a>
                      </div>
                    </div>
                  )}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option: any): any =>
                    option.children.indexOf(input) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.value.localeCompare(optionB.value)
                  }
                >
                  {telItem.map((item, index) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="납품장소" span={3}>
              <Form.Item name="address">
                <Select
                  onChange={handleChange}
                  placeholder="납품장소 입력"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          padding: 8,
                        }}
                      >
                        <Input
                          style={{ flex: 'auto' }}
                          value={newAddress}
                          onChange={onAddressChange}
                        />
                        <a
                          style={{
                            flex: 'none',
                            padding: '8px',
                            display: 'block',
                            cursor: 'pointer',
                          }}
                          onClick={addAddress}
                        >
                          <PlusOutlined /> Add item
                        </a>
                      </div>
                    </div>
                  )}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option: any): any =>
                    option.children.indexOf(input) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.value.localeCompare(optionB.value)
                  }
                >
                  {addrItem.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="요청사항" span={3}>
              <Form.Item name="remark">
                <Input.TextArea />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions layout="vertical" bordered size="small">
            <Descriptions.Item
              label="출고제품"
              style={{ backgroundColor: '#F0F2F5' }}
            >
              {/* <Descriptions.Item
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
            </Descriptions.Item> */}

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
                              <Select>
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
                            {
                              required: true,
                              message: '번들 수를 입력해주세요',
                            },
                          ]}
                        >
                          <Input type="number" />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
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
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </FormColumn>
    </Wrapper>
  );
};

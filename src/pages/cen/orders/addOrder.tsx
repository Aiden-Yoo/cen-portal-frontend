import React, { useState, useEffect } from 'react';
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
  InputNumber,
  Space,
  Select,
  Tooltip,
  Descriptions,
  Badge,
  Checkbox,
  DatePicker,
  Divider,
  TreeSelect,
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
import { Loading } from '../../../components/loading';
import { TreeNode } from 'rc-tree-select';

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

const ItemList = styled.div`
  background-color: #ffffff;
  padding: 20px;
`;

const ButtonColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrderMutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IPartner {
  id: number;
  name: string;
  address: string;
  zip: string | null;
  tel: string | null;
  contactsCount: number;
  contacts: IContact[] | null;
}

interface IContact {
  id: number;
  name: string;
  jobTitle: string | null;
  tel: string;
}

interface IPart {
  id: number;
  name: string;
  num: number | null;
}

interface IBundle {
  id: number;
  name: string;
  series: string;
  parts: IPart[] | null;
}

// interface IAllBundlesOutput {
//   ok: boolean;
//   error: string | null;
//   totalPages: number | null;
//   totalResults: number | null;
//   bundles: IBundle[] | null;
// }

export const AddOrder: React.FC = () => {
  const { data: meData } = useMe();
  const { data: bundleData } = useAllBundles();
  const { data: partnerData } = useAllPartners();
  const history = useHistory();
  const [form] = Form.useForm();
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [newDestination, setNewDestination] = useState<string>('');
  const [destItem, setDestItem] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState<string>('');
  const [addrItem, setAddrItem] = useState<string[]>([]);
  const [newReceiver, setNewReceiver] = useState<string>('');
  const [recvItem, setRecvItem] = useState<string[]>([]);
  const [newTel, setNewTel] = useState<string>('');
  const [telItem, setTelItem] = useState<string[]>([]);
  const [telItemTemp, setTelItemTemp] = useState<string[]>([]);
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<string>();
  const [demoReturnDate, setDemoReturnDate] = useState<string>();
  const [orderSheet, setOrderSheet] = useState<boolean>(false);
  const parentList: string[] = [];

  useEffect(() => {
    if (meData) {
      // console.log(meData);
    }
  }, [meData]);

  useEffect(() => {
    const partnersName: string[] = [];
    if (partnerData) {
      // console.log(partnerData);
      const allPartners = partnerData.allPartners.partners as IPartner[];
      setPartners(allPartners);
      allPartners?.map((partner) => partnersName.push(partner.name));
      setDestItem(partnersName);
    }
  }, [partnerData]);

  useEffect(() => {
    if (bundleData) {
      const allBundles = bundleData.allBundles.bundles as IBundle[];
      allBundles.map((bundle) => {
        if (parentList.indexOf(bundle.series) === -1) {
          parentList.push(bundle.series);
        }
      });
      setBundles(allBundles);
    }
  }, [bundleData, parentList]);

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
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `번들 등록 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [
    createOrderMutation,
    { data: createOrderData, loading: createOrderLoading },
  ] = useMutation<createOrderMutation, createOrderMutationVariables>(
    CREATE_ORDER_MUTATION,
    {
      onCompleted,
    },
  );

  if (createOrderLoading) {
    return (
      <Loading
        tip={
          '등록중입니다. 잠시만 기다려주세요... 제품 수량이 많을수록 많은 시간이 소요됩니다.'
        }
      />
    );
  }

  if (createOrderData && !createOrderLoading) {
    history.push('/cen/orders');
  }

  const onFinish = (values: any) => {
    let fail = '';
    // console.log('Received values of form:', values);
    if (!values.projectName) {
      fail += `${fail !== '' ? ', ' : ''}프로젝트명`;
    }
    if (!values.classification) {
      fail += `${fail !== '' ? ', ' : ''}구분`;
    }
    if (!values.receiver) {
      fail += `${fail !== '' ? ', ' : ''}거래처`;
    }
    if (!values.contact) {
      fail += `${fail !== '' ? ', ' : ''}연락처`;
    }
    if (!values.address) {
      fail += `${fail !== '' ? ', ' : ''}납품장소`;
    }
    if (!values.deliveryType) {
      fail += `${fail !== '' ? ', ' : ''}출고형태`;
    }
    if (!values.deliveryMethod) {
      fail += `${fail !== '' ? ', ' : ''}출고방법`;
    }
    if (!values.deliveryMethod) {
      fail += `${fail !== '' ? ', ' : ''}배송방법`;
    }
    if (fail !== '') {
      notification.error({
        message: 'Error',
        description: `[작성 누락] ${fail}`,
        placement: 'topRight',
        duration: 3,
      });
    } else {
      createOrderMutation({
        variables: {
          input: {
            address: values.address,
            classification: values.classification,
            contact: values.contact,
            deliveryDate,
            deliveryMethod: values.deliveryMethod,
            deliveryType: values.deliveryType,
            demoReturnDate,
            destination: values.destination,
            items: values.items,
            orderSheet,
            partnerId: values.partnerId,
            projectName: values.projectName,
            receiver: values.receiver,
            remark: values.remark,
            salesPerson: values.salesPerson
              ? values.salesPerson
              : meData?.me.name,
            status: OrderStatus.Created,
          },
        },
      });
    }
  };

  const onPartnerIdChange = (_: string, option?: any) => {
    const partner = partners[option.key];
    const recvTemp: string[] = [];
    const telTemp: string[] = [];
    setRecvItem([]);
    setTelItem([]);
    setAddrItem([partner.address]);
    if (!partner.contacts) return;
    partner.contacts.map((contact) => {
      recvTemp.push(contact.name + ' ' + contact.jobTitle);
      telTemp.push(contact.tel);
    });
    setRecvItem(recvTemp);
    setTelItemTemp(telTemp);
  };

  const onReceiverIdChange = (_: string, option?: any) => {
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

  const onDateChange = (_: any, dateString: string) => {
    setDeliveryDate(dateString);
  };

  const onDemoReturnDateChange = (_: any, dateString: string) => {
    setDemoReturnDate(dateString);
  };

  const onOrderSheetChange = (event: any) => {
    const {
      target: { checked },
    } = event;
    setOrderSheet(checked);
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
                <Input defaultValue={meData?.me.name} value={meData?.me.name} />
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
                <Input
                  prefix={<Badge status="processing" text="출고요청" />}
                  value={OrderStatus.Created}
                  disabled
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="구분">
              <Form.Item name="classification">
                <Select>
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
                  <DatePicker onChange={onDemoReturnDateChange} />
                </Space>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="발주서 접수">
              <Form.Item name="orderSheet">
                <Checkbox onChange={onOrderSheetChange} checked={orderSheet} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  {'거래처 '}
                  <Tooltip title="등록한 파트너만 선택 가능">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
            >
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
              <Form.Item name="destination">
                <Select
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
                  <DatePicker onChange={onDateChange} />
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
            <Descriptions.Item
              label={
                <span>
                  {'수령자 '}
                  <Tooltip title="등록한 연락처 입력 혹은 직접입력">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              span={2}
            >
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
                  {telItem.map((item) => (
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
              label={
                <span>
                  {'출고제품 '}
                  <Tooltip title="등록한 제품만 선택 가능. 'Add Bundles' 버튼을 통해 항목추가 가능.">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              style={{ backgroundColor: '#F0F2F5' }}
            >
              <ItemList>
                <Form.List name="items">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => (
                        <div key={field.key}>
                          <Space align="baseline">
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
                                  label="제품명"
                                  name={[field.name, 'bundleId']}
                                  fieldKey={[field.fieldKey, 'bundleId']}
                                  rules={[
                                    {
                                      required: true,
                                      message: '번들 이름을 선택해주세요.',
                                    },
                                  ]}
                                  style={{ width: 250 }}
                                >
                                  <TreeSelect
                                    showSearch
                                    placeholder="Please select"
                                    allowClear
                                    style={{ width: '180px' }}
                                    dropdownStyle={{
                                      maxHeight: 400,
                                      overflow: 'auto',
                                    }}
                                  >
                                    {bundles
                                      ? parentList.map((parent) => {
                                          // console.log(parentList);
                                          return (
                                            // parent list.
                                            <TreeNode
                                              key={parent}
                                              value={parent}
                                              title={parent}
                                              selectable={false}
                                            >
                                              {bundles.map((bundle) => {
                                                // children list.
                                                if (bundle.series === parent) {
                                                  return (
                                                    <TreeNode
                                                      key={bundle.id}
                                                      value={bundle.id}
                                                      title={bundle.name}
                                                    />
                                                  );
                                                }
                                              })}
                                            </TreeNode>
                                          );
                                        })
                                      : null}
                                  </TreeSelect>
                                </Form.Item>
                              )}
                            </Form.Item>
                            <Form.Item
                              {...field}
                              label="수량"
                              name={[field.name, 'num']}
                              fieldKey={[field.fieldKey, 'num']}
                              rules={[
                                {
                                  required: true,
                                  message: '수량 입력 필요',
                                },
                              ]}
                              style={{ width: 150 }}
                            >
                              <InputNumber />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => remove(field.name)}
                            />
                          </Space>
                        </div>
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
              </ItemList>
            </Descriptions.Item>
          </Descriptions>
          <Form.Item>
            <ButtonColumn>
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
            </ButtonColumn>
          </Form.Item>
        </Form>
      </FormColumn>
    </Wrapper>
  );
};

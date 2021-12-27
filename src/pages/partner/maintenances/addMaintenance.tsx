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
  createMaintenanceMutation,
  createMaintenanceMutationVariables,
} from '../../../__generated__/createMaintenanceMutation';
import { MaintenanceClassification } from '../../../__generated__/globalTypes';
import { useMe } from '../../../hooks/useMe';
import { useAllBundles } from '../../../hooks/useAllBundles';
import { useAllPartners } from '../../../hooks/useAllPartners';
import { Loading } from '../../../components/loading';
import { TreeNode } from 'rc-tree-select';

const { Option } = Select;
const { RangePicker } = DatePicker;

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

const CREATE_MAINTENANCE_MUTATION = gql`
  mutation createMaintenanceMutation($input: CreateMaintenanceInput!) {
    createMaintenance(input: $input) {
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

export const AddMaintenance: React.FC = () => {
  const { data: meData } = useMe();
  const { data: bundleData } = useAllBundles(1, 1000);
  const { data: partnerData } = useAllPartners();
  const history = useHistory();
  const [form] = Form.useForm();
  const [partners, setPartners] = useState<IPartner[]>([]);
  const [bundles, setBundles] = useState<IBundle[]>([]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const parentList: string[] = [];

  const onCompleted = (data: createMaintenanceMutation) => {
    const {
      createMaintenance: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '유지보수 등록 성공',
        placement: 'topRight',
        duration: 1,
      });
      history.push('/partner/maintenances');
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `유지보수 등록 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [
    createMaintenanceMutation,
    { data: createMaintenanceData, loading: createMaintenanceLoading },
  ] = useMutation<
    createMaintenanceMutation,
    createMaintenanceMutationVariables
  >(CREATE_MAINTENANCE_MUTATION, {
    onCompleted,
  });

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
  }, [bundleData, parentList, createMaintenanceData]);

  if (createMaintenanceLoading) {
    return (
      <Loading
        tip={
          '등록중입니다. 잠시만 기다려주세요... 제품 수량이 많을수록 많은 시간이 소요됩니다.'
        }
      />
    );
  }

  const onFinish = (values: any) => {
    let fail = '';
    // console.log('Received values of form:', values);
    if (!values.projectName || values.projectName === '') {
      fail += `${fail !== '' ? ', ' : ''}프로젝트명`;
    }
    if (!values.classification || values.classification === '') {
      fail += `${fail !== '' ? ', ' : ''}계약종류`;
    }
    if (!values.distPartnerId || values.distPartnerId === '') {
      fail += `${fail !== '' ? ', ' : ''}계약 파트너사`;
    }
    if (!values.reqPartner || values.reqPartner === '') {
      fail += `${fail !== '' ? ', ' : ''}요청 파트너사`;
    }
    if (!startDate || startDate === '') {
      fail += `${fail !== '' ? ', ' : ''}시작날짜`;
    }
    if (!endDate || endDate === '') {
      fail += `${fail !== '' ? ', ' : ''}끝날짜`;
    }
    if (!values.items || values.items.length === 0) {
      fail += `${fail !== '' ? ', ' : ''}출고제품`;
    }
    if (fail !== '') {
      notification.error({
        message: 'Error',
        description: `[작성 누락] ${fail}`,
        placement: 'topRight',
        duration: 3,
      });
    } else {
      createMaintenanceMutation({
        variables: {
          input: {
            contractNo: 'CEN-SVC-XXXXXX-XX',
            salesPerson: values.salesPerson
              ? values.salesPerson
              : meData?.me.name,
            projectName: values.projectName,
            reqPartner: values.reqPartner,
            startDate,
            endDate,
            description: values.description,
            distPartnerId: values.distPartnerId,
            items: values.items,
            classification: values.classification,
            inCharge: values.inCharge,
            contact: values.contact,
          },
        },
      });
    }
  };

  const onPartnerIdChange = (_: string, option?: any) => {
    const partner = partners[option.key];
    const recvTemp: string[] = [];
    const telTemp: string[] = [];
    if (!partner.contacts) return;
    partner.contacts.map((contact) => {
      recvTemp.push(contact.name + ' ' + contact.jobTitle);
      telTemp.push(contact.tel);
    });
  };

  const onDateChange = (_: any, dateString: [string, string]) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Add Maintenance | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 유지보수 등록'}
      </TitleBar>
      <FormColumn>
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Descriptions
            bordered
            size="small"
            labelStyle={{ backgroundColor: '#F0F2F5' }}
          >
            <Descriptions.Item label="계약번호">
              <Form.Item name="contractNo">
                <Input
                  defaultValue={`CEN-SVC-${new Date()
                    .toISOString()
                    .substring(2, 10)
                    .replace(/-/g, '')}-XX`}
                  disabled
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="작성일">
              <Form.Item name="writeDate">
                <Input
                  defaultValue={new Date().toLocaleDateString()}
                  disabled
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Form.Item name="maintenanceStatus">
                <Input
                  prefix={<Badge status="processing" text="작성중" />}
                  disabled
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="계약종류" span={3}>
              <Form.Item name="classification">
                <Select style={{ width: 80 }}>
                  <Option value={MaintenanceClassification.CSTY}>CSTY</Option>
                  <Option value={MaintenanceClassification.CSTC}>CSTC</Option>
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="고객사(프로젝트명)" span={2}>
              <Form.Item name="projectName">
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="작성자">
              <Form.Item name="writer">
                <Input defaultValue={meData?.me.name} disabled />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="계약 파트너사(총판)" span={2}>
              <Form.Item name="distPartnerId">
                <Select
                  onChange={onPartnerIdChange}
                  placeholder="파트너 선택"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option: any): any =>
                    option.children.indexOf(input) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.value.localeCompare(optionB.value)
                  }
                >
                  {partners.map((distPartner: any, index: number) => (
                    <Option key={index} value={distPartner.id}>
                      {distPartner?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="담당영업">
              <Form.Item name="salesPerson">
                <Input defaultValue={meData?.me.name} value={meData?.me.name} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="요청 파트너사" span={2}>
              <Form.Item name="reqPartner">
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="계약기간">
              <Form.Item name="date">
                <Space direction="vertical">
                  <RangePicker onChange={onDateChange} />
                </Space>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="담당자" span={2}>
              <Form.Item name="inCharge">
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="연락처">
              <Form.Item name="contact">
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="비고" span={3}>
              <Form.Item name="description">
                <Input />
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

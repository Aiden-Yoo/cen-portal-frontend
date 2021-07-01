/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Table,
  Popconfirm,
  Form,
  Typography,
  Button,
  notification,
  Radio,
  RadioChangeEvent,
  BackTop,
  Tag,
  Input,
  Select,
} from 'antd';
import {
  OrderClassification,
  DeliveryType,
  DeliveryMethod,
  OrderStatus,
  UserRole,
} from '../../../__generated__/globalTypes';
import {
  getOrdersQuery,
  getOrdersQueryVariables,
} from '../../../__generated__/getOrdersQuery';
import {
  deleteOrderMutation,
  deleteOrderMutationVariables,
} from '../../../__generated__/deleteOrderMutation';
import {
  editOrderMutation,
  editOrderMutationVariables,
} from '../../../__generated__/editOrderMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';

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

const SButton = styled(Button)`
  margin-left: 8px;
`;

const GET_ORDERS_QUERY = gql`
  query getOrdersQuery($input: GetOrdersInput!) {
    getOrders(input: $input) {
      ok
      error
      totalPages
      totalResults
      orders {
        id
        createAt
        salesPerson
        classification
        projectName
        partner {
          name
        }
        deliveryType
        deliveryMethod
        deliveryDate
        status
      }
    }
  }
`;

const DELETE_ORDER_MUTATION = gql`
  mutation deleteOrderMutation($input: DeleteOrderInput!) {
    deleteOrder(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrderMutation($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IPartner {
  name: string;
}

interface IOrder {
  key?: string;
  no?: number;
  id?: number;
  createAt: string;
  salesPerson: string;
  classification: OrderClassification | string;
  projectName: string | JSX.Element;
  partner?: IPartner | null;
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  deliveryDate: string;
  status: OrderStatus;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'select' | 'text';
  record?: IOrder;
  index?: number;
  children?: React.ReactNode;
  width?: string;
  editable?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
  sortDirections?: string[];
  defaultSortOrder?: string;
  sorter?: unknown;
  render?: unknown;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { Option } = Select;
  const inputNode =
    inputType === 'select' ? (
      <Select style={{ width: 100 }}>
        <Option value={OrderStatus.Created}>출고요청</Option>
        <Option value={OrderStatus.Pending}>보류</Option>
        <Option value={OrderStatus.Canceled}>취소</Option>
        <Option value={OrderStatus.Preparing}>준비중</Option>
        <Option value={OrderStatus.Partial}>부분출고</Option>
        <Option value={OrderStatus.Completed}>출고완료</Option>
      </Select>
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const Order = () => {
  const originData: IOrder[] = [];
  const { data: meData } = useMe();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<IOrder[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const {
    data: ordersData,
    loading,
    refetch: reGetData,
  } = useQuery<getOrdersQuery, getOrdersQueryVariables>(GET_ORDERS_QUERY, {
    variables: {
      input: {
        page,
        take,
        status,
      },
    },
  });

  const onDeleteCompleted = (data: deleteOrderMutation) => {
    const {
      deleteOrder: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '삭제 성공',
        placement: 'topRight',
        duration: 1,
      });
      setSelectedRowKeys([]);
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `삭제 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const onEditCompleted = (data: editOrderMutation) => {
    const {
      editOrder: { ok, error },
    } = data;
    if (ok) {
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
  };

  const [deleteOrderMutation, { data: deleteOrderData }] = useMutation<
    deleteOrderMutation,
    deleteOrderMutationVariables
  >(DELETE_ORDER_MUTATION, {
    onCompleted: onDeleteCompleted,
  });

  const [editOrderMutation, { data: editOrderData }] = useMutation<
    editOrderMutation,
    editOrderMutationVariables
  >(EDIT_ORDER_MUTATION, {
    onCompleted: onEditCompleted,
  });

  useEffect(() => {
    if (ordersData && !loading) {
      const orders = ordersData.getOrders.orders as IOrder[];
      const getTotal = ordersData.getOrders.totalResults as number;
      for (let i = 0; i < orders.length; i++) {
        originData.push({
          key: `${orders[i].id}`,
          no: 1 + i,
          createAt: new Date(orders[i].createAt).toLocaleDateString(),
          projectName: (
            <Link
              to={`/cen/orders/${orders[i].id}`}
            >{`${orders[i].projectName}`}</Link>
          ),
          classification: `${
            orders[i].classification === OrderClassification.Sale
              ? '판매'
              : orders[i].classification
          }`,
          salesPerson: orders[i].salesPerson,
          deliveryDate: new Date(orders[i].deliveryDate).toLocaleDateString(),
          deliveryMethod: orders[i].deliveryMethod,
          deliveryType: orders[i].deliveryType,
          status: orders[i].status,
        });
      }
      setTotal(getTotal);
      setData(originData);
    }
    reGetData();
  }, [ordersData]);

  const isEditing = (record: IOrder) => record.key === editingKey;

  const edit = (record: Partial<IOrder> & { key: React.Key }) => {
    form.setFieldsValue({
      status: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IOrder;

      const newData = [...data];
      const index = newData?.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
        editOrderMutation({
          variables: {
            input: {
              id: +key,
              status: row.status,
            },
          },
        });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      reGetData();
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleAdd = () => {
    console.log('handleAdd');
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      deleteOrderMutation({
        variables: { input: { orderId: +key } },
      });
    });
    reGetData();
  };

  const handleRowDelete = (key: number) => {
    deleteOrderMutation({
      variables: { input: { orderId: +key } },
    });
    reGetData();
  };

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const handleStatusChange = (event: RadioChangeEvent) => {
    const {
      target: { value },
    } = event;
    setStatus(value);
  };

  const columns: EditableCellProps[] = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '1%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a: { no: number }, b: { no: number }) => a.no - b.no,
        multiple: 1,
      },
    },
    {
      title: '작성일',
      dataIndex: 'createAt',
      width: '10%',
      align: 'center',
    },
    {
      title: '프로젝트',
      dataIndex: 'projectName',
      width: '20%',
      align: 'center',
    },
    {
      title: '구분',
      dataIndex: 'classification',
      width: '7%',
      align: 'center',
    },
    {
      title: '담당영업',
      dataIndex: 'salesPerson',
      width: '10%',
      align: 'center',
    },
    {
      title: '납품일',
      dataIndex: 'deliveryDate',
      width: '10%',
      align: 'center',
    },
    {
      title: '배송방법',
      dataIndex: 'deliveryMethod',
      width: '10%',
      align: 'center',
      render: (deliveryMethod: DeliveryMethod) => {
        if (deliveryMethod === 'Parcel') return '택배';
        else if (deliveryMethod === 'Quick') return '퀵';
        else if (deliveryMethod === 'Cargo') return '화물';
        else if (deliveryMethod === 'Directly') return '직접전달';
      },
    },
    {
      title: '출고형태',
      dataIndex: 'deliveryType',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a: { deliveryType: string }, b: { deliveryType: string }) =>
          a.deliveryType.localeCompare(b.deliveryType),
        multiple: 2,
      },
      render: (deliveryType: DeliveryType) => {
        let color = '';
        let text = '';
        if (deliveryType === 'Partial') {
          color = 'blue';
          text = '부분출고';
        } else if (deliveryType === 'Total') {
          color = 'geekblue';
          text = '전체출고';
        }
        return (
          <Tag color={color} key={deliveryType}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: '1%',
      editable: true,
      align: 'center',
      render: (status: OrderStatus) => {
        let color = '';
        let text = '';
        if (status === 'Created') {
          color = 'orange';
          text = '출고요청';
        } else if (status === 'Canceled') {
          color = 'red';
          text = '취소됨';
        } else if (status === 'Pending') {
          color = 'volcano';
          text = '보류';
        } else if (status === 'Preparing') {
          color = 'green';
          text = '준비중';
        } else if (status === 'Partial') {
          color = 'blue';
          text = '부분출고';
        } else if (status === 'Completed') {
          color = 'geekblue';
          text = '출고완료';
        }
        return (
          <Tag color={color} key={status}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      width: '1%',
      render: (_: string, record: any) => {
        const editable = isEditing(record);
        return (
          <span>
            {editable ? (
              <>
                <Popconfirm
                  title="정말 변경 하시겠습니까?"
                  onConfirm={() => save(record.key)}
                >
                  <Typography.Link
                    style={{
                      marginRight: 8,
                    }}
                  >
                    Save
                  </Typography.Link>
                </Popconfirm>
                <Typography.Link
                  onClick={cancel}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Cancel
                </Typography.Link>
              </>
            ) : (
              <Typography.Link
                onClick={() => edit(record)}
                style={{ marginRight: 8 }}
                disabled={meData?.me.role !== UserRole.CENSE}
              >
                Edit
              </Typography.Link>
            )}

            <Typography.Link href="#!">
              <Popconfirm
                title="정말 삭제 하시겠습니까?"
                onConfirm={() => handleRowDelete(record.key)}
              >
                Delete
              </Popconfirm>
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IOrder) => ({
        record,
        inputType: col.dataIndex === 'status' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IOrder[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    // getCheckboxProps: (record: IOrder) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Orders | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 출고요청서'}
      </TitleBar>
      <MenuBar>
        <Radio.Group
          defaultValue={null}
          size="small"
          onChange={handleStatusChange}
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={OrderStatus.Created}>출고요청</Radio.Button>
          <Radio.Button value={OrderStatus.Canceled}>출고취소</Radio.Button>
          <Radio.Button value={OrderStatus.Pending}>보류</Radio.Button>
          <Radio.Button value={OrderStatus.Preparing}>준비중</Radio.Button>
          <Radio.Button value={OrderStatus.Partial}>부분출고</Radio.Button>
          <Radio.Button value={OrderStatus.Completed}>출고완료</Radio.Button>
        </Radio.Group>
        <SButton type="primary" size="small" onClick={() => handleAdd()}>
          <Link to="/cen/orders/add-order">Add</Link>
        </SButton>
        <SButton type="primary" size="small">
          <Popconfirm
            title="정말 삭제 하시겠습니까?"
            onConfirm={() => handleDelete()}
          >
            Delete
          </Popconfirm>
        </SButton>
      </MenuBar>
      <Form form={form} component={false}>
        <Table<IOrder>
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowSelection={rowSelection}
          dataSource={data}
          columns={mergedColumns}
          pagination={{
            total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, take) => handlePageChange(page, take as number),
            showSizeChanger: true,
          }}
          loading={loading}
          size="small"
        />
      </Form>
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

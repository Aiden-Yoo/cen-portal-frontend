/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
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
} from 'antd';
import {
  OrderClassification,
  DeliveryType,
  DeliveryMethod,
  OrderStatus,
} from '../../../__generated__/globalTypes';
import {
  getOrdersQuery,
  getOrdersQueryVariables,
} from '../../../__generated__/getOrdersQuery';
import {
  deleteOrderMutation,
  deleteOrderMutationVariables,
} from '../../../__generated__/deleteOrderMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Loading } from '../../../components/loading';

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

interface IPartner {
  name: string;
}

interface IOrder {
  id: number;
  createAt: any;
  salesPerson: string;
  classification: OrderClassification;
  projectName: string;
  partner: IPartner | null;
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  deliveryDate: any;
  status: OrderStatus;
}

interface IGetOrdersOutput {
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  orders: IOrder[] | null;
}

interface IDeleteOrderOutput {
  ok: boolean;
  error: string | null;
}

export const Order = () => {
  const originData: any[] = [];
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<IOrder[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const { data: ordersData, loading, refetch: reGetData } = useQuery<
    getOrdersQuery,
    getOrdersQueryVariables
  >(GET_ORDERS_QUERY, {
    variables: {
      input: {
        page,
        take,
        status,
      },
    },
  });

  const onCompleted = (data: deleteOrderMutation) => {
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

  const [deleteOrderMutation, { data: deleteOrderData }] = useMutation<
    deleteOrderMutation,
    deleteOrderMutationVariables
  >(DELETE_ORDER_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    if (ordersData && !loading) {
      const orders = ordersData.getOrders.orders as IOrder[];
      const getTotal = ordersData.getOrders.totalResults as number;
      for (let i = 0; i < orders.length; i++) {
        originData.push({
          key: `${orders[i].id}`,
          no: i + 1 + (page - 1) * take,
          createAt: new Date(orders[i].createAt).toLocaleDateString(),
          projectName: (
            <Link
              to={`/cen/orders/${orders[i].id}`}
            >{`${orders[i].projectName}`}</Link>
          ),
          classification: orders[i].classification,
          salesPerson: orders[i].salesPerson,
          deliveryDate: new Date(orders[i].deliveryDate).toLocaleDateString(),
          deliveryMethod: orders[i].deliveryMethod,
          deliveryType: orders[i].deliveryType,
          status: orders[i].status,
        });
      }
      setTotal(getTotal);
      setData(originData);
      reGetData();
    }
  }, [ordersData]);

  useEffect(() => {
    if (deleteOrderData) {
      reGetData();
    }
  }, [deleteOrderData]);

  const edit = (record: IOrder) => {
    console.log(record);
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
    console.log(page, take);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: (a: { no: number }, b: { no: number }) => a.no - b.no,
    },
    {
      title: '작성일',
      dataIndex: 'createAt',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: any, b: any) => a.createAt.localeCompare(b.createAt),
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
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { classification: string }, b: { classification: string }) =>
        a.classification.localeCompare(b.classification),
    },
    {
      title: '담당영업',
      dataIndex: 'salesPerson',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { salesPerson: string }, b: { salesPerson: string }) =>
        a.salesPerson.localeCompare(b.salesPerson),
    },
    {
      title: '납품일',
      dataIndex: 'deliveryDate',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { deliveryDate: string }, b: { deliveryDate: string }) =>
        a.deliveryDate.localeCompare(b.deliveryDate),
    },
    {
      title: '배송방법',
      dataIndex: 'deliveryMethod',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { deliveryMethod: string }, b: { deliveryMethod: string }) =>
        a.deliveryMethod.localeCompare(b.deliveryMethod),
    },
    {
      title: '출고형태',
      dataIndex: 'deliveryType',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { deliveryType: string }, b: { deliveryType: string }) =>
        a.deliveryType.localeCompare(b.deliveryType),
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { status: string }, b: { status: string }) =>
        a.status.localeCompare(b.status),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) => {
        return (
          <span>
            <Typography.Link
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Typography.Link>
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IOrder[]) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
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
        {loading ? (
          <Loading />
        ) : (
          <Table<IOrder>
            bordered
            rowSelection={rowSelection}
            dataSource={data}
            columns={columns}
            pagination={{
              total,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, take) => handlePageChange(page, take as number),
            }}
          />
        )}
      </Form>
    </Wrapper>
  );
};

/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect, SetStateAction } from 'react';
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
  getOrdersQuery,
  getOrdersQueryVariables,
  getOrdersQuery_getOrders_orders,
  getOrdersQuery_getOrders_orders_partner,
} from '../../../__generated__/getOrdersQuery';
import {
  deleteOrderMutation,
  deleteOrderMutationVariables,
} from '../../../__generated__/deleteOrderMutation';
import { FolderOpenOutlined } from '@ant-design/icons';

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

interface Item {
  key: string;
  no: number;
  series: string;
  name: string;
}

export const Order = () => {
  const originData: any[] = [];
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState<getOrdersQuery_getOrders_orders[]>([]);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(null);
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
      const orders: any = ordersData?.getOrders.orders;
      const getTotal: any = ordersData?.getOrders.totalResults;
      for (let i = 0; i < orders?.length; i++) {
        originData.push({
          key: `${orders[i].id}`,
          no: i + 1 + (page - 1) * take,
          createAt: new Date(orders[i].createAt).toLocaleDateString(),
          projectName: orders[i].projectName,
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
      console.log(originData);
    }
  }, [ordersData]);

  useEffect(() => {
    if (deleteOrderData) {
      reGetData();
    }
  }, [deleteOrderData]);

  const edit = (record: getOrdersQuery_getOrders_orders) => {
    console.log(record);
  };

  const handleAdd = () => {
    console.log('handleAdd');
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      console.log(key);
      deleteOrderMutation({
        variables: { input: { orderId: +key } },
      });
    });
  };

  const handleCancel = (key: any) => {
    console.log(key);
  };

  const handleRowDelete = (record: getOrdersQuery_getOrders_orders) => {
    console.log(record);
  };

  const handlePageChange = (page: number, take: any) => {
    setPage(page);
    setTake(take);
    console.log(page, take);
  };

  const onShowSizeChange = (current: any, size: any) => {
    console.log(current, size);
  };

  const save = async (key: React.Key) => {
    console.log(key);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '5%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sortOrder: 'ascend',
      sorter: (a: { no: number }, b: { no: number }) => a.no - b.no,
    },
    {
      title: '작성일',
      dataIndex: 'createAt',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { series: string }, b: { series: string }) =>
        a.series.localeCompare(b.series),
    },
    {
      title: '프로젝트',
      dataIndex: 'projectName',
      width: '20%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: '구분',
      dataIndex: 'classification',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: '담당영업',
      dataIndex: 'salesPerson',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: '납품일',
      dataIndex: 'deliveryDate',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: '배송방법',
      dataIndex: 'deliveryMethod',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: '출고형태',
      dataIndex: 'deliveryType',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <span>
            <Typography.Link
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Typography.Link>
            <Typography.Link href="#!" onClick={() => handleDelete()}>
              Delete
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const rowSelection = {
    // onChange: (selectedRowKeys: React.Key[], selectedRows: Item[]) => {
    onChange: (
      selectedRowKeys: any,
      selectedRows: getOrdersQuery_getOrders_orders[],
    ) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    getCheckboxProps: (record: getOrdersQuery_getOrders_orders) => ({
      // disabled: record.name === 'Disabled User',
      // name: record.name,
    }),
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
        <Table<getOrdersQuery_getOrders_orders>
          bordered
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={{
            total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, take) => handlePageChange(page, take),
          }}
        />
      </Form>
    </Wrapper>
  );
};

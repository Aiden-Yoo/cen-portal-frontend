/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import {
  Table,
  Popconfirm,
  Form,
  Typography,
  Button,
  notification,
} from 'antd';
import {
  deleteBundleMutation,
  deleteBundleMutationVariables,
} from '../../../__generated__/deleteBundleMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Loading } from '../../../components/loading';
import { useAllBundles } from '../../../hooks/useAllBundles';

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

const DELETE_BUNDLE_MUTATION = gql`
  mutation deleteBundleMutation($input: DeleteBundleInput!) {
    deleteBundle(input: $input) {
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

export const Device = () => {
  const originData: Item[] = [];
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [total, setTotal] = useState(0);
  const { data: bundleData, loading, refetch: reGetData } = useAllBundles(
    page,
    take,
  );

  const onCompleted = (data: deleteBundleMutation) => {
    const {
      deleteBundle: { ok, error },
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

  const [deleteBundleMutation, { data: deleteBundleData }] = useMutation<
    deleteBundleMutation,
    deleteBundleMutationVariables
  >(DELETE_BUNDLE_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    if (bundleData && !loading) {
      setData([]);
      const bundles: any = bundleData?.allBundles.bundles;
      const getTotal: any = bundleData?.allBundles.totalResults;
      for (let i = 0; i < bundles?.length; i++) {
        originData.push({
          key: `${bundles[i].id}`,
          no: i + 1 + (page - 1) * take,
          series: `${bundles[i].series}`,
          name: `${bundles[i].name}`,
        });
      }
      setTotal(getTotal);
      setData(originData);
    }
  }, [bundleData]);

  useEffect(() => {
    if (deleteBundleData) {
      reGetData();
    }
  }, [deleteBundleData]);

  const edit = (record: Item) => {
    console.log(record);
  };

  const handleAdd = () => {
    console.log('handleAdd');
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      console.log(key);
      deleteBundleMutation({
        variables: { input: { bundleId: +key } },
      });
    });
  };

  const handleCancel = (key: any) => {
    console.log(key);
  };

  const handleRowDelete = (record: Item) => {
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

  const columns: ColumnsType<Item> = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '10%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sortOrder: 'ascend',
      sorter: (a: { no: number }, b: { no: number }) => a.no - b.no,
    },
    {
      title: 'Series',
      dataIndex: 'series',
      width: '20%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { series: string }, b: { series: string }) =>
        a.series.localeCompare(b.series),
    },
    {
      title: 'Bundle Name',
      dataIndex: 'name',
      width: '45%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: (a: { name: string }, b: { name: string }) =>
        a.name.localeCompare(b.name),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: any, record: Item) => {
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
    onChange: (selectedRowKeys: any, selectedRows: Item[]) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    getCheckboxProps: (record: Item) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Bundles | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 제품'}
      </TitleBar>
      <MenuBar>
        <SButton type="primary" size="small" onClick={() => handleAdd()}>
          <Link to="/cen/devices/add-bundle">Add</Link>
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
          <Table<Item>
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
        )}
      </Form>
    </Wrapper>
  );
};

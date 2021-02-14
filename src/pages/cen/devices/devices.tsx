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
  Radio,
} from 'antd';
import {
  deleteBundleMutation,
  deleteBundleMutationVariables,
} from '../../../__generated__/deleteBundleMutation';
import {
  deletePartMutation,
  deletePartMutationVariables,
} from '../../../__generated__/deletePartMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Loading } from '../../../components/loading';
import { useAllBundles } from '../../../hooks/useAllBundles';
import { useAllParts } from '../../../hooks/useAllParts';

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

const DELETE_PART_MUTATION = gql`
  mutation deletePartMutation($input: DeletePartInput!) {
    deletePart(input: $input) {
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

interface IBundleItem {
  num: number | null;
  part: IPart;
}

interface IBundle {
  // key?: string;
  // no?: number;
  id: number;
  name: string;
  series: string | null;
  description: string | null;
  parts: IBundleItem[] | null;
}

interface IAllBundlesOutput {
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  bundles: IBundle[] | null;
}

interface IPart {
  id: number;
  name: string;
  series: string;
  description?: string | null;
}

interface IAllPartsOutput {
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  parts: IPart[] | null;
}

export const Device = () => {
  const originBundleData: Item[] = [];
  const originPartData: Item[] = [];
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [radioValue, setRadioValue] = useState('Bundles');
  const [bundlesData, setBundlesData] = useState<Item[]>([]);
  const [partsData, setPartsData] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [total, setTotal] = useState(0);
  const [bundlesPage, setBundlesPage] = useState(1);
  const [bundlesTake, setBundlesTake] = useState(10);
  const [bundlesTotal, setBundlesTotal] = useState(0);
  const [partsPage, setPartsPage] = useState(1);
  const [partsTake, setPartsTake] = useState(10);
  const [partsTotal, setPartsTotal] = useState(0);
  const {
    data: bundleGetData,
    loading: bundleLoading,
    refetch: reGetBundles,
  } = useAllBundles(bundlesPage, bundlesTake);
  const {
    data: partGetData,
    loading: partLoading,
    refetch: reGetParts,
  } = useAllParts(partsPage, partsTake);
  const devicesOptions = ['Bundles', 'Parts'];

  const onCompletedBundle = (data: deleteBundleMutation) => {
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

  const onCompletedPart = (data: deletePartMutation) => {
    const {
      deletePart: { ok, error },
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

  const [deleteBundleMutation, { data: deleteBundleGetData }] = useMutation<
    deleteBundleMutation,
    deleteBundleMutationVariables
  >(DELETE_BUNDLE_MUTATION, {
    onCompleted: onCompletedBundle,
  });

  const [deletePartMutation, { data: deletePartGetData }] = useMutation<
    deletePartMutation,
    deletePartMutationVariables
  >(DELETE_PART_MUTATION, {
    onCompleted: onCompletedPart,
  });

  useEffect(() => {
    if (bundleGetData && !bundleLoading) {
      setBundlesData([]);
      const bundles = bundleGetData.allBundles.bundles as IBundle[];
      const getTotal = bundleGetData.allBundles.totalResults as number;
      for (let i = 0; i < bundles.length; i++) {
        originBundleData.push({
          key: `${bundles[i].id}`,
          no: i + 1 + (bundlesPage - 1) * bundlesTake,
          series: `${bundles[i].series}`,
          name: `${bundles[i].name}`,
        });
      }
      setBundlesTotal(getTotal);
      setBundlesData(originBundleData);
    }
    if (partGetData && !partLoading) {
      setPartsData([]);
      const parts = partGetData.allParts.parts as IPart[];
      const getTotal = partGetData.allParts.totalResults as number;
      for (let i = 0; i < parts.length; i++) {
        originPartData.push({
          key: `${parts[i].id}`,
          no: i + 1 + (bundlesPage - 1) * bundlesTake,
          series: `${parts[i].series}`,
          name: `${parts[i].name}`,
        });
      }
      setPartsTotal(getTotal);
      setPartsData(originPartData);
    }
  }, [bundleGetData, partGetData]);

  useEffect(() => {
    if (deleteBundleGetData) {
      reGetBundles();
    }
    // if (deletePartGetData) {
    //   reGetParts();
    // }
  }, [deleteBundleGetData]);

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

  const handleBundlePageChange = (page: number, take: any) => {
    setBundlesPage(page);
    setBundlesTake(take);
    console.log(page, take);
  };

  const handlePartPageChange = (page: number, take: any) => {
    setPartsPage(page);
    setPartsTake(take);
    console.log(page, take);
  };

  const onShowSizeChange = (current: any, size: any) => {
    console.log(current, size);
  };

  const save = async (key: React.Key) => {
    console.log(key);
  };

  const handleRadioChange = (e: any) => {
    setRadioValue(e.target.value);
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
      title: 'Name',
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
        {radioValue === 'Bundles' ? ' - Bundles' : ' - Parts'}
      </TitleBar>
      <MenuBar>
        <Radio.Group
          options={devicesOptions}
          onChange={handleRadioChange}
          value={radioValue}
        />
        <SButton type="primary" size="small" onClick={() => handleAdd()}>
          {radioValue === 'Bundles' ? (
            <Link to="/cen/devices/add-bundle">Add</Link>
          ) : (
            <Link to="/cen/devices/add-part">Add</Link>
          )}
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
        {radioValue === 'Bundles' ? (
          <Table<Item>
            bordered
            rowSelection={rowSelection}
            dataSource={bundlesData}
            columns={columns}
            pagination={{
              total: bundlesTotal,
              // total,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, take) => handleBundlePageChange(page, take),
              showSizeChanger: true,
            }}
            loading={bundleLoading}
            size="small"
          />
        ) : (
          <Table<Item>
            bordered
            rowSelection={rowSelection}
            dataSource={partsData}
            columns={columns}
            pagination={{
              total: partsTotal,
              // total,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, take) => handlePartPageChange(page, take),
              showSizeChanger: true,
            }}
            loading={partLoading}
            size="small"
          />
        )}
      </Form>
    </Wrapper>
  );
};

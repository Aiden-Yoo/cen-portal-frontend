/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {
  Table,
  Popconfirm,
  Form,
  Typography,
  Button,
  notification,
  Radio,
  BackTop,
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
import { UserRole } from '../../../__generated__/globalTypes';
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
  name: string | JSX.Element;
  sorter?: unknown;
}

interface IBundleItem {
  num: number | null;
  part: IPart;
}

interface IBundle {
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
  const client = useApolloClient();
  const originBundleData: Item[] = [];
  const originPartData: Item[] = [];
  const { data: meData } = useMe();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [radioValue, setRadioValue] = useState('Bundles');
  const [bundlesData, setBundlesData] = useState<Item[]>([]);
  const [partsData, setPartsData] = useState<Item[]>([]);
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
      reGetBundles();
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
      reGetParts();
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
    onCompleted: onCompletedBundle,
  });

  const [deletePartMutation, { data: deletePartData }] = useMutation<
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
          name: (
            <Link
              to={`/cen/devices/bundle/${bundles[i].id}`}
            >{`${bundles[i].name}`}</Link>
          ),
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
          name: (
            <Link
              to={`/cen/devices/part/${parts[i].id}`}
            >{`${parts[i].name}`}</Link>
          ),
        });
      }
      setPartsTotal(getTotal);
      setPartsData(originPartData);
    }
  }, [bundleGetData, partGetData]);

  const edit = (record: Item) => {
    console.log(record);
  };

  const handleAdd = () => {
    console.log('handleAdd');
  };

  const handleDelete = (key?: number) => {
    if (key && radioValue === 'Bundles') {
      deleteBundleMutation({
        variables: { input: { bundleId: +key } },
      });
    }
    if (key && radioValue === 'Parts') {
      deletePartMutation({
        variables: { input: { partId: +key } },
      });
    }
    selectedRowKeys?.map((key) => {
      if (radioValue === 'Bundles') {
        deleteBundleMutation({
          variables: { input: { bundleId: +key } },
        });
      }
      if (radioValue === 'Parts') {
        deletePartMutation({
          variables: { input: { partId: +key } },
        });
      }
    });
  };

  const handleCancel = (key: any) => {
    console.log(key);
  };

  const handleBundlePageChange = (page: number, take: number) => {
    setBundlesPage(page);
    setBundlesTake(take);
    console.log(page, take);
  };

  const handlePartPageChange = (page: number, take: number) => {
    setPartsPage(page);
    setPartsTake(take);
    console.log(page, take);
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
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
      align: 'center',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: string, record: any) => {
        return (
          <span>
            <Typography.Link
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
              disabled={meData?.me.role !== UserRole.CENSE}
            >
              Edit
            </Typography.Link>
            <Typography.Link href="#!">
              <Popconfirm
                title="정말 삭제 하시겠습니까?"
                onConfirm={() => handleDelete(record.key)}
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: Item[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    // getCheckboxProps: (record: Item) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Devices | CEN Portal</title>
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
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, take) =>
                handleBundlePageChange(page, take as number),
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
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, take) =>
                handlePartPageChange(page, take as number),
              showSizeChanger: true,
            }}
            loading={partLoading}
            size="small"
          />
        )}
      </Form>
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

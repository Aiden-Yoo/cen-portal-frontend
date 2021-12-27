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

import { FolderOpenOutlined } from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';
import {
  deleteMaintenanceMutation,
  deleteMaintenanceMutationVariables,
} from '../../../__generated__/deleteMaintenanceMutation';
import {
  getMaintenancesQuery,
  getMaintenancesQueryVariables,
} from '../../../__generated__/getMaintenancesQuery';
import { ColumnsType } from 'antd/lib/table';
import {
  MaintenanceClassification,
  UserRole,
} from '../../../__generated__/globalTypes';

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

const GET_MAINTENANCES_QUERY = gql`
  query getMaintenancesQuery($input: GetMaintenancesInput!) {
    getMaintenances(input: $input) {
      ok
      error
      totalPages
      totalResults
      maintenances {
        id
        createAt
        updateAt
        contractNo
        writer {
          name
        }
        salesPerson
        projectName
        distPartner {
          name
        }
        reqPartner
        startDate
        endDate
        description
        items {
          bundle {
            name
          }
          num
        }
        maintenanceStatus
        classification
        inCharge
        contact
      }
    }
  }
`;

const DELETE_MAINTENANCE_MUTATION = gql`
  mutation deleteMaintenanceMutation($input: DeleteMaintenanceInput!) {
    deleteMaintenance(input: $input) {
      ok
      error
    }
  }
`;

interface IWriter {
  name: string;
}

interface IPartner {
  name: string;
}

interface IItem {
  bundle: {
    name: string;
  };
  num: number;
}

interface IMaintenance {
  key?: string;
  no?: number;
  id?: number;
  createAt: string;
  contractNo: string;
  writer: IWriter;
  salesPerson: string;
  projectName: string | JSX.Element;
  reqPartner?: string | null;
  distPartner: IPartner;
  distPartnerName?: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  items?: IItem[] | null;
  maintenanceStatus?: string | null;
  classification?: MaintenanceClassification | null;
  inCharge?: string | null;
  contact?: string | null;
}

export const Maintenance = () => {
  const originData: IMaintenance[] = [];
  const { data: meData } = useMe();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<IMaintenance[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [maintenanceStatus, setMaintenanceStatus] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const { Search } = Input;

  const onGetCompleted = (data: getMaintenancesQuery) => {
    const {
      getMaintenances: { ok, error },
    } = data;
    if (error) {
      notification.error({
        message: 'Error',
        description: `로드 실패. ${error}`,
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  const onDeleteCompleted = (data: deleteMaintenanceMutation) => {
    const {
      deleteMaintenance: { ok, error },
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

  const {
    data: maintenancesData,
    loading,
    refetch: reGetData,
  } = useQuery<getMaintenancesQuery, getMaintenancesQueryVariables>(
    GET_MAINTENANCES_QUERY,
    {
      variables: {
        input: {
          page,
          take,
          maintenanceStatus,
          searchTerm,
        },
      },
      onCompleted: onGetCompleted,
    },
  );

  const [deleteMaintenanceMutation, { data: deleteMaintenanceData }] =
    useMutation<deleteMaintenanceMutation, deleteMaintenanceMutationVariables>(
      DELETE_MAINTENANCE_MUTATION,
      {
        onCompleted: onDeleteCompleted,
      },
    );

  useEffect(() => {
    if (maintenancesData) {
      const maintenances = maintenancesData.getMaintenances
        .maintenances as IMaintenance[];
      const getTotal = maintenancesData.getMaintenances.totalResults as number;
      for (let i = 0; i < maintenances?.length; i++) {
        originData.push({
          key: `${maintenances[i].id}`,
          no: getTotal - (page - 1) * take - i,
          createAt: new Date(maintenances[i].createAt).toLocaleDateString(),
          contractNo: maintenances[i].contractNo,
          writer: maintenances[i].writer,
          salesPerson: maintenances[i].salesPerson,
          projectName: (
            <Link
              to={`/partner/maintenances/${maintenances[i].id}`}
            >{`${maintenances[i].projectName}`}</Link>
          ),
          reqPartner: maintenances[i].reqPartner,
          distPartner: maintenances[i].distPartner,
          distPartnerName: maintenances[i].distPartner.name,
          startDate: maintenances[i].startDate
            ? new Date(`${maintenances[i].startDate}`).toLocaleDateString()
            : null,
          endDate: maintenances[i].endDate
            ? new Date(`${maintenances[i].endDate}`).toLocaleDateString()
            : null,
          description: maintenances[i].description,
          items: maintenances[i].items,
          maintenanceStatus: maintenances[i].maintenanceStatus,
          classification: maintenances[i].classification,
          inCharge: maintenances[i].inCharge,
          contact: maintenances[i].contact,
        });
      }
      setTotal(getTotal);
      setData(originData);
    }
    reGetData();
  }, [maintenancesData, deleteMaintenanceData]);

  const handleStatusChange = (event: RadioChangeEvent) => {
    const {
      target: { value },
    } = event;
    setMaintenanceStatus(value);
  };

  const handleAdd = () => {
    // console.log('handleAdd');
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      deleteMaintenanceMutation({
        variables: { input: { maintenanceId: +key } },
      });
    });
    reGetData();
  };

  const handleRowDelete = (key: number) => {
    deleteMaintenanceMutation({
      variables: { input: { maintenanceId: +key } },
    });
    reGetData();
  };

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const columns: ColumnsType<IMaintenance> = [
    {
      title: '상태',
      dataIndex: 'maintenanceStatus',
      width: 80,
      align: 'center',
      render: (maintenanceStatus: string) => {
        let color = '';
        let text = '';
        switch (maintenanceStatus) {
          case '계약만료':
            color = 'red';
            text = '계약만료';
            break;
          case '계약중':
            color = 'blue';
            text = '계약중';
            break;
        }
        return (
          <Tag color={color} key={maintenanceStatus}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '프로젝트',
      dataIndex: 'projectName',
      width: '20%',
      align: 'center',
    },
    {
      title: '계약종류',
      dataIndex: 'classification',
      width: '10%',
      align: 'center',
    },
    {
      title: '계약 파트너',
      dataIndex: 'distPartnerName',
      width: 140,
      align: 'center',
    },
    {
      title: '요청 파트너',
      dataIndex: 'reqPartner',
      width: 140,
      align: 'center',
    },
    {
      title: '담당영업',
      dataIndex: 'salesPerson',
      width: 80,
      align: 'center',
    },
    {
      title: '계약 시작',
      dataIndex: 'startDate',
      width: 100,
      align: 'center',
    },
    {
      title: '계약 끝',
      dataIndex: 'endDate',
      width: 100,
      align: 'center',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      width: 80,
      render: (_: string, record: any) => {
        return (
          <span>
            <Typography.Link
              href="#!"
              disabled={
                meData?.me.role !== UserRole.CENSE &&
                meData?.me.role !== UserRole.CEN
              }
            >
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: IMaintenance[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    // getCheckboxProps: (record: IMaintenance) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Maintenances | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 유지보수'}
      </TitleBar>
      <MenuBar>
        <Search
          placeholder="검색(프로젝트, 담당영업, 파트너, SN)"
          onSearch={onSearch}
          style={{ width: 300 }}
          size="small"
          allowClear
          enterButton
        />
        <Radio.Group
          defaultValue={null}
          size="small"
          onChange={handleStatusChange}
          style={{ paddingLeft: '8px' }}
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={'계약중'}>계약중</Radio.Button>
          <Radio.Button value={'계약만료'}>계약만료</Radio.Button>
        </Radio.Group>
        <SButton
          type="primary"
          size="small"
          disabled={
            meData?.me.role !== UserRole.CENSE &&
            meData?.me.role !== UserRole.CEN
          }
          onClick={() => handleAdd()}
        >
          <Link to="/partner/maintenances/add-maintenance">Add</Link>
        </SButton>
        <SButton
          type="primary"
          size="small"
          disabled={
            meData?.me.role !== UserRole.CENSE &&
            meData?.me.role !== UserRole.CEN
          }
        >
          <Popconfirm
            title="정말 삭제 하시겠습니까?"
            onConfirm={() => handleDelete()}
          >
            Delete
          </Popconfirm>
        </SButton>
      </MenuBar>
      <Form form={form} component={false}>
        <Table<IMaintenance>
          bordered
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={{
            total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, take) => handlePageChange(page, take as number),
            showSizeChanger: true,
            pageSize: 20,
          }}
          loading={loading}
          size="small"
        />
      </Form>
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

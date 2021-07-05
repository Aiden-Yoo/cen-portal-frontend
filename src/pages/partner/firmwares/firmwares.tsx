/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Table, Typography, Button, BackTop } from 'antd';
import {
  DesktopOutlined,
  LockOutlined,
  FileZipOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useMe } from '../../../hooks/useMe';
import { useAllFirmwares } from '../../../hooks/useAllFirmwares';
import { UserRole } from '../../../__generated__/globalTypes';

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

interface IUser {
  id: number;
  name: string;
  company: string;
}

interface IFirmwareFiles {
  id: number;
  path: string;
}

interface IFirmwares {
  id: number;
  writer: IUser | null;
  locked: boolean | null;
  kind: string | null;
  title: string;
  files: IFirmwareFiles[] | null;
  createAt: any;
  updateAt: any;
}

interface IFirmwaresData {
  key: string;
  no: number;
  title: string | JSX.Element;
  kind: string | null;
  locked: boolean | null;
  writer: IUser['name'] | null;
  company: IUser['company'] | null;
  filesCount: number;
  createAt: string;
}

export const Firmware: React.FC = () => {
  const originData: IFirmwaresData[] = [];
  const [data, setData] = useState<IFirmwaresData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const { data: meData } = useMe();
  const {
    data: allFirmwaresData,
    loading: allFirmwaresLoading,
    refetch: reGetData,
  } = useAllFirmwares(page, take);

  useEffect(() => {
    if (allFirmwaresData && !allFirmwaresLoading) {
      const firmwares = allFirmwaresData.allFirmwares.firmwares as IFirmwares[];
      const getTotalResults = allFirmwaresData.allFirmwares
        .totalResults as number;
      for (let i = 0; i < firmwares.length; i++) {
        originData.push({
          key: `${firmwares[i].id}`,
          no: firmwares[i].id,
          title: (
            <>
              {`[${firmwares[i].kind}] `}
              <Typography.Link
                disabled={
                  meData?.me.role === UserRole.CENSE ||
                  firmwares[i].writer?.id === meData?.me.id
                    ? false
                    : (firmwares[i].locked as boolean)
                }
                href={`/partner/firmwares/${firmwares[i].id}`}
              >{`${firmwares[i].title}`}</Typography.Link>
              {firmwares[i].files?.length !== 0 ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <FileZipOutlined />
                  {firmwares[i].files?.length}
                </span>
              ) : null}
              {firmwares[i].locked ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <LockOutlined />
                </span>
              ) : null}
            </>
          ),
          kind: firmwares[i].kind,
          locked: firmwares[i].locked,
          writer: firmwares[i].writer?.name as string,
          company: firmwares[i].writer?.company as string,
          filesCount: firmwares[i].files?.length as number,
          createAt: new Date(firmwares[i].createAt).toLocaleDateString(),
        });
      }
      setTotal(getTotalResults);
      setData(originData);
    }
    reGetData();
  }, [allFirmwaresData]);

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const columns: ColumnsType<IFirmwaresData> = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '1%',
      align: 'center',
    },
    {
      title: '제목',
      dataIndex: 'title',
      width: '50%',
      align: 'center',
    },
    {
      title: '소속',
      dataIndex: 'company',
      width: '20%',
      align: 'center',
    },
    {
      title: '작성자',
      dataIndex: 'writer',
      width: '10%',
      align: 'center',
    },
    {
      title: '작성일',
      dataIndex: 'createAt',
      width: '20%',
      align: 'center',
    },
  ];

  return (
    <Wrapper>
      <Helmet>
        <title>Firmwares | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <DesktopOutlined />
        {' Firmwares'}
      </TitleBar>
      <MenuBar>
        <SButton
          type="primary"
          size="small"
          disabled={UserRole.CENSE !== meData?.me.role}
        >
          <Link to="/partner/firmwares/add-firmware">New</Link>
        </SButton>
      </MenuBar>
      <Table<IFirmwaresData>
        bordered
        dataSource={data}
        columns={columns}
        pagination={{
          total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, take) => handlePageChange(page, take as number),
          showSizeChanger: true,
        }}
        loading={allFirmwaresLoading}
        size="small"
      />
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

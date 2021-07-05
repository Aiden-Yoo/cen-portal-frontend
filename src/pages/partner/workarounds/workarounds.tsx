/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Table, Typography, Button, BackTop } from 'antd';
import {
  ToolOutlined,
  CommentOutlined,
  LockOutlined,
  FileZipOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useMe } from '../../../hooks/useMe';
import { useAllWorkarounds } from '../../../hooks/useAllWorkarounds';
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

interface IWorkaroundFiles {
  id: number;
  path: string;
}

interface IWorkarounds {
  id: number;
  writer: IUser | null;
  locked: boolean | null;
  kind: string | null;
  title: string;
  files: IWorkaroundFiles[] | null;
  createAt: any;
  updateAt: any;
  commentsNum: number;
}

interface IWorkaroundsData {
  key: string;
  no: number;
  title: string | JSX.Element;
  kind: string | null;
  locked: boolean | null;
  writer: IUser['name'] | null;
  company: IUser['company'] | null;
  filesCount: number;
  commentsNum: number;
  createAt: string;
}

export const Workaround: React.FC = () => {
  const originData: IWorkaroundsData[] = [];
  const [data, setData] = useState<IWorkaroundsData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const { data: meData } = useMe();
  const {
    data: allWorkaroundsData,
    loading: allWorkaroundsLoading,
    refetch: reGetData,
  } = useAllWorkarounds(page, take);

  useEffect(() => {
    if (allWorkaroundsData && !allWorkaroundsLoading) {
      const workarounds = allWorkaroundsData.allWorkarounds
        .workarounds as IWorkarounds[];
      const getTotalResults = allWorkaroundsData.allWorkarounds
        .totalResults as number;
      for (let i = 0; i < workarounds.length; i++) {
        originData.push({
          key: `${workarounds[i].id}`,
          no: workarounds[i].id,
          title: (
            <>
              {`[${workarounds[i].kind}] `}
              <Typography.Link
                disabled={
                  meData?.me.role === UserRole.CENSE ||
                  workarounds[i].writer?.id === meData?.me.id
                    ? false
                    : (workarounds[i].locked as boolean)
                }
                href={`/partner/workarounds/${workarounds[i].id}`}
              >{`${workarounds[i].title}`}</Typography.Link>
              {workarounds[i].files?.length !== 0 ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <FileZipOutlined />
                  {workarounds[i].files?.length}
                </span>
              ) : null}
              {workarounds[i].commentsNum ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <CommentOutlined />
                  {workarounds[i].commentsNum}
                </span>
              ) : null}
              {workarounds[i].locked ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <LockOutlined />
                </span>
              ) : null}
            </>
          ),
          kind: workarounds[i].kind,
          locked: workarounds[i].locked,
          writer: workarounds[i].writer?.name as string,
          company: workarounds[i].writer?.company as string,
          filesCount: workarounds[i].files?.length as number,
          commentsNum: workarounds[i].commentsNum,
          createAt: new Date(workarounds[i].createAt).toLocaleDateString(),
        });
      }
      setTotal(getTotalResults);
      setData(originData);
    }
    reGetData();
  }, [allWorkaroundsData]);

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const columns: ColumnsType<IWorkaroundsData> = [
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
        <title>Workarounds | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <ToolOutlined />
        {' Workarounds'}
      </TitleBar>
      <MenuBar>
        <SButton
          type="primary"
          size="small"
          disabled={UserRole.CENSE !== meData?.me.role}
        >
          <Link to="/partner/workarounds/add-workaround">New</Link>
        </SButton>
      </MenuBar>
      <Table<IWorkaroundsData>
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
        loading={allWorkaroundsLoading}
        size="small"
      />
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

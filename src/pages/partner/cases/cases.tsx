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
import { useAllCases } from '../../../hooks/useAllCases';
import {
  KindRole,
  KindWorkaround,
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

interface IUser {
  id: number;
  name: string;
  company: string;
}

interface IIssueFiles {
  id: number;
  path: string;
}

interface IIssues {
  id: number;
  writer: IUser | null;
  locked: boolean | null;
  kind: string | null;
  title: string;
  files: IIssueFiles[] | null;
  createAt: any;
  updateAt: any;
  commentsNum: number;
}

interface ICasesData {
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

export const Case: React.FC = () => {
  const originData: ICasesData[] = [];
  const [data, setData] = useState<ICasesData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const { data: meData } = useMe();
  const {
    data: allCasesData,
    loading: allCasesLoading,
    refetch: reGetData,
  } = useAllCases(page, take);

  useEffect(() => {
    if (allCasesData && !allCasesLoading) {
      const cases = allCasesData.allIssues.issues as IIssues[];
      const getTotalResults = allCasesData.allIssues.totalResults as number;
      for (let i = 0; i < cases.length; i++) {
        originData.push({
          key: `${cases[i].id}`,
          no: cases[i].id,
          title: (
            <>
              {cases[i].kind === KindRole.Question
                ? `[문의] `
                : `[${cases[i].kind}] `}
              <Typography.Link
                disabled={
                  meData?.me.role === UserRole.CENSE ||
                  cases[i].writer?.id === meData?.me.id
                    ? false
                    : (cases[i].locked as boolean)
                }
                href={`/partner/cases/${cases[i].id}`}
              >{`${cases[i].title}`}</Typography.Link>
              {cases[i].files?.length !== 0 ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <FileZipOutlined />
                  {cases[i].files?.length}
                </span>
              ) : null}
              {cases[i].commentsNum ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <CommentOutlined />
                  {cases[i].commentsNum}
                </span>
              ) : null}
              {cases[i].locked ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <LockOutlined />
                </span>
              ) : null}
            </>
          ),
          kind: cases[i].kind,
          locked: cases[i].locked,
          writer: cases[i].writer?.name as string,
          company: cases[i].writer?.company as string,
          filesCount: cases[i].files?.length as number,
          commentsNum: cases[i].commentsNum,
          createAt: new Date(cases[i].createAt).toLocaleDateString(),
        });
      }
      setTotal(getTotalResults);
      setData(originData);
    }
    reGetData();
  }, [allCasesData]);

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const columns: ColumnsType<ICasesData> = [
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
        <title>Cases | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <ToolOutlined />
        {' Cases'}
      </TitleBar>
      <MenuBar>
        <SButton type="primary" size="small">
          <Link to="/partner/cases/add-case">New</Link>
        </SButton>
      </MenuBar>
      <Table<ICasesData>
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
        loading={allCasesLoading}
        size="small"
      />
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

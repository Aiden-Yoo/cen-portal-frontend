/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Table, Typography, Button, BackTop } from 'antd';
import { FileOutlined, LockOutlined, FileZipOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useMe } from '../../../hooks/useMe';
import { useAllDocuments } from '../../../hooks/useAllDocuments';
import { KindDocument, UserRole } from '../../../__generated__/globalTypes';

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

interface IDocumentFiles {
  id: number;
  path: string;
}

interface IDocuments {
  id: number;
  writer: IUser | null;
  locked: boolean | null;
  kind: string | null;
  title: string;
  files: IDocumentFiles[] | null;
  createAt: any;
  updateAt: any;
}

interface IDocumentsData {
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

export const Document: React.FC = () => {
  const originData: IDocumentsData[] = [];
  const [data, setData] = useState<IDocumentsData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const { data: meData } = useMe();
  const {
    data: allDocumentsData,
    loading: allDocumentsLoading,
    refetch: reGetData,
  } = useAllDocuments(page, take);

  useEffect(() => {
    if (allDocumentsData && !allDocumentsLoading) {
      const documents = allDocumentsData.allDocuments.documents as IDocuments[];
      const getTotalResults = allDocumentsData.allDocuments
        .totalResults as number;
      for (let i = 0; i < documents.length; i++) {
        originData.push({
          key: `${documents[i].id}`,
          no: documents[i].id,
          title: (
            <>
              {documents[i].kind === KindDocument.Datasheet
                ? `[데이터시트] `
                : documents[i].kind === KindDocument.Proposal
                ? `[표준제안서] `
                : documents[i].kind === KindDocument.Certificate
                ? `[인증서] `
                : documents[i].kind === KindDocument.TestReport
                ? `[시험성적서] `
                : documents[i].kind === KindDocument.Brochure
                ? `[브로셔] `
                : `[${documents[i].kind}] `}
              <Typography.Link
                disabled={
                  meData?.me.role === UserRole.CENSE ||
                  documents[i].writer?.id === meData?.me.id
                    ? false
                    : (documents[i].locked as boolean)
                }
                href={`/partner/documents/${documents[i].id}`}
              >{`${documents[i].title}`}</Typography.Link>
              {documents[i].files?.length !== 0 ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <FileZipOutlined />
                  {documents[i].files?.length}
                </span>
              ) : null}
              {documents[i].locked ? (
                <span style={{ fontSize: '11px' }}>
                  {' '}
                  <LockOutlined />
                </span>
              ) : null}
            </>
          ),
          kind: documents[i].kind,
          locked: documents[i].locked,
          writer: documents[i].writer?.name as string,
          company: documents[i].writer?.company as string,
          filesCount: documents[i].files?.length as number,
          createAt: new Date(documents[i].createAt).toLocaleDateString(),
        });
      }
      setTotal(getTotalResults);
      setData(originData);
    }
    reGetData();
    console.log(allDocumentsData);
    console.log(originData);
  }, [allDocumentsData]);

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const columns: ColumnsType<IDocumentsData> = [
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
        <title>Documents | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FileOutlined />
        {' Documents'}
      </TitleBar>
      <MenuBar>
        <SButton
          type="primary"
          size="small"
          disabled={UserRole.CENSE !== meData?.me.role}
        >
          <Link to="/partner/documents/add-document">New</Link>
        </SButton>
      </MenuBar>
      <Table<IDocumentsData>
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
        loading={allDocumentsLoading}
        size="small"
      />
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

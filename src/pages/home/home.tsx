import React, { useEffect, useState, useRef } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import { Popconfirm, Button, notification } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useMe } from '../../hooks/useMe';
import { Loading } from '../../components/loading';
import { UserRole } from '../../__generated__/globalTypes';
import { getHomeNoticeQuery } from '../../__generated__/getHomeNoticeQuery';
import {
  createHomeNoticeMutation,
  createHomeNoticeMutationVariables,
} from '../../__generated__/createHomeNoticeMutation';

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

const GET_HOMENOTICE_QUERY = gql`
  query getHomeNoticeQuery {
    getHomeNotice {
      ok
      error
      notice {
        id
        content
      }
    }
  }
`;

const CREATE_HOMENOTICE_MUTATION = gql`
  mutation createHomeNoticeMutation($input: CreateHomeNoticeInput!) {
    createHomeNotice(input: $input) {
      ok
      error
    }
  }
`;

interface IHomeNotice {
  content: string;
}

export const Home: React.FC = () => {
  const { data: meData } = useMe();
  const history = useHistory();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const editorRef = React.createRef<any>();
  const viewerRef = useRef<Viewer>();
  const [content, setContent] = useState<string>();
  const {
    data: homeNoticeData,
    loading: homeNoticeLoading,
    refetch,
  } = useQuery<getHomeNoticeQuery>(GET_HOMENOTICE_QUERY);

  const onCompleted = (data: createHomeNoticeMutation) => {
    const {
      createHomeNotice: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '공지 수정 성공',
        placement: 'topRight',
        duration: 1,
      });
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `공지 수정 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [createHomeNoticeMutation, { data }] = useMutation<
    createHomeNoticeMutation,
    createHomeNoticeMutationVariables
  >(CREATE_HOMENOTICE_MUTATION, { onCompleted });

  useEffect(() => {
    if (viewerRef.current && homeNoticeData) {
      const notice = homeNoticeData.getHomeNotice.notice as IHomeNotice;
      setContent(notice.content);
      viewerRef.current?.getInstance().setMarkdown(content as string);
    }
    refetch();
  }, [homeNoticeData, content]);

  const handleSave = async () => {
    const getContent = await editorRef.current.getInstance().getMarkdown();
    setContent(getContent);
    createHomeNoticeMutation({
      variables: {
        input: {
          content: getContent as string,
        },
      },
    });
    setIsEdit(!isEdit);
  };

  const handleCancel = () => {
    setIsEdit(!isEdit);
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Home | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <HomeOutlined />
        {' Home'}
      </TitleBar>
      <MenuBar>
        {isEdit ? (
          <>
            <Popconfirm title="정말 변경 하시겠습니까?" onConfirm={handleSave}>
              <SButton type="primary" size="small">
                Save
              </SButton>
            </Popconfirm>
            <SButton type="primary" size="small" onClick={handleCancel}>
              Cancel
            </SButton>
          </>
        ) : (
          <SButton
            type="primary"
            size="small"
            disabled={meData?.me.role !== UserRole.CENSE}
            onClick={handleEdit}
          >
            Edit
          </SButton>
        )}
      </MenuBar>
      {homeNoticeLoading ? (
        <Loading />
      ) : isEdit ? (
        <Editor
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          placeholder="글쓰기"
          ref={editorRef}
          initialValue={content}
          language="ko-KR"
          previewHighlight={false}
          usageStatistics={false}
        />
      ) : (
        <Viewer
          initialValue={content}
          ref={viewerRef as React.MutableRefObject<Viewer>}
        />
      )}
    </Wrapper>
  );
};

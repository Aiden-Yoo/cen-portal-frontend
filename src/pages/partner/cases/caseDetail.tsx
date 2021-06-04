import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import {
  Button,
  Comment,
  Tooltip,
  List,
  Input,
  Form,
  notification,
  Popconfirm,
  Upload,
  Select,
  Checkbox,
} from 'antd';
import {
  getIssueQuery,
  getIssueQueryVariables,
} from '../../../__generated__/getIssueQuery';
import { InboxOutlined, ToolOutlined, LockOutlined } from '@ant-design/icons';
import { KindRole, UserRole } from '../../../__generated__/globalTypes';
import moment from 'moment';
import { useMe } from '../../../hooks/useMe';
import {
  deleteIssueCommentMutation,
  deleteIssueCommentMutationVariables,
} from '../../../__generated__/deleteIssueCommentMutation';
import {
  createIssueCommentMutation,
  createIssueCommentMutationVariables,
} from '../../../__generated__/createIssueCommentMutation';
import {
  deleteIssueMutation,
  deleteIssueMutationVariables,
} from '../../../__generated__/deleteIssueMutation';
import {
  editIssueMutation,
  editIssueMutationVariables,
} from '../../../__generated__/editIssueMutation';
import { WAS_IP } from '../../../constants';

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const Wrapper = styled.div`
  padding: 20px;
`;

const TitleBar = styled.div`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const MenuBar = styled.span`
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
`;

const TitleColumn = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 18px;
`;

const ContentColumn = styled.div`
  margin: 20px 0;
  padding: 10px;
  min-height: 350px;
  border-top: solid #d0d0d0 1px;
  border-bottom: solid #d0d0d0 1px;
`;

const FilesColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilesTitleColumn = styled.div`
  margin: 0 0 10px;
  font-weight: bold;
  font-size: 14px;
`;

const CommentColumn = styled.div`
  margin-top: 10px;
`;

const SButton = styled(Button)`
  margin-left: 8px;
`;

const GET_ISSUE_QUERY = gql`
  query getIssueQuery($input: GetIssueInput!) {
    getIssue(input: $input) {
      ok
      error
      issue {
        id
        title
        kind
        content
        locked
        writer {
          id
          company
          name
        }
        files {
          id
          path
        }
        comment {
          id
          writer {
            id
            company
            name
          }
          comment
          groupNum
          depth
          order
          createAt
          deleteAt
        }
      }
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteIssueCommentMutation($input: DeleteIssueCommentInput!) {
    deleteIssueComment(input: $input) {
      ok
      error
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createIssueCommentMutation($input: CreateIssueCommentInput!) {
    createIssueComment(input: $input) {
      ok
      error
    }
  }
`;

const DELETE_ISSUE_MUTATION = gql`
  mutation deleteIssueMutation($input: DeleteIssueInput!) {
    deleteIssue(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_ISSUE_MUTATION = gql`
  mutation editIssueMutation($input: EditIssueInput!) {
    editIssue(input: $input) {
      ok
      error
    }
  }
`;

interface IIssueUser {
  id: number;
  company: string;
  name: string;
}

interface IIssueFiles {
  id: number;
  path: string;
}

interface ICommentUser {
  id: number;
  company: string;
  name: string;
}

interface IIssueComments {
  id: number;
  writer: ICommentUser | null;
  comment: string;
  groupNum: number;
  depth: number;
  order: number;
  createAt: any;
  deleteAt: any | null;
}

interface IOriginComment {
  key: string;
  actions: JSX.Element[];
  author: string | null;
  content: string;
  datetime?: JSX.Element;
  depth: number;
  isReply?: boolean;
}

interface IIssues {
  id: number;
  title: string;
  kind: KindRole;
  content: string;
  locked: boolean | null;
  writer: IIssueUser | null;
  files: IIssueFiles[] | null;
  comment: IIssueComments[] | null;
}

interface IUploadedFile {
  filename: string;
  originalname: string;
}

interface IDefaultFileList {
  uid: string;
  name: string;
  status: string;
  url: string;
}

const CommentList = ({ comments }: any) => {
  return (
    <List
      dataSource={comments}
      header={`${comments.length} ${
        comments.length > 1 ? 'comments' : 'comment'
      }`}
      itemLayout="horizontal"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      renderItem={(props: any) => {
        return (
          <Comment
            {...props}
            style={{
              position: 'relative',
              left: `${(props.depth - 1) * 20}px`,
              width: `calc(100% - ${(props.depth - 1) * 20}px)`,
              marginTop: '5px',
            }}
          />
        );
      }}
    />
  );
};

const CommentEditor = ({ onChange, onSubmit, submitting, value }: any) => (
  <>
    <Form.Item name="commentValue">
      <TextArea
        name="commentValue"
        rows={4}
        onChange={onChange}
        value={value}
      />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

export const CaseDetail: React.FC = () => {
  const { data: meData } = useMe();
  const originComment: IOriginComment[] = [];
  const history = useHistory();
  const caseId: any = useParams();
  const viewerRef = useRef<Viewer>();
  const editorRef = React.createRef<any>();
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>();
  const [writer, setWriter] = useState<ICommentUser>();
  const [loadedData, setLoadedData] = useState<IIssues>();
  const [commentData, setCommentData] = useState<IOriginComment[]>([]);
  const [files, setFiles] = useState<IIssueFiles[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [commentValue, setCommentValue] = useState<string>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<IUploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [checkLocked, setCheckLocked] = useState<boolean>(false);
  const [defaultFileList, setDefaultFileList] = useState<any[]>([]);
  const {
    data: caseDetailData,
    loading: caseDetailLoading,
    refetch,
  } = useQuery<getIssueQuery, getIssueQueryVariables>(GET_ISSUE_QUERY, {
    variables: {
      input: {
        id: +caseId.id,
      },
    },
  });

  const onCommentDeleteCompleted = (data: deleteIssueCommentMutation) => {
    const {
      deleteIssueComment: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `댓글 삭제 성공`,
        placement: 'topRight',
        duration: 1,
      });
      refetch();
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `댓글 삭제 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const onCommentCreateCompleted = (data: createIssueCommentMutation) => {
    const {
      createIssueComment: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `댓글 작성 성공`,
        placement: 'topRight',
        duration: 1,
      });
      setSubmitting(false);
      refetch();
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `댓글 작성 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const onIssueDeleteCompleted = (data: deleteIssueMutation) => {
    const {
      deleteIssue: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `삭제 성공`,
        placement: 'topRight',
        duration: 1,
      });
      history.push('/partner/cases/');
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `삭제 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const onIssueEditCompleted = (data: editIssueMutation) => {
    const {
      editIssue: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `수정 성공`,
        placement: 'topRight',
        duration: 1,
      });
      history.push(`/partner/cases/${caseId.id}`);
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `수정 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
    refetch();
  };

  const [
    deleteIssueCommentMutation,
    { data: deleteIssueCommentData },
  ] = useMutation<
    deleteIssueCommentMutation,
    deleteIssueCommentMutationVariables
  >(DELETE_COMMENT_MUTATION, { onCompleted: onCommentDeleteCompleted });

  const [
    createIssueCommentMutation,
    { data: createIssueCommentData },
  ] = useMutation<
    createIssueCommentMutation,
    createIssueCommentMutationVariables
  >(CREATE_COMMENT_MUTATION, { onCompleted: onCommentCreateCompleted });

  const [deleteIssueMutation] = useMutation<
    deleteIssueMutation,
    deleteIssueMutationVariables
  >(DELETE_ISSUE_MUTATION, {
    onCompleted: onIssueDeleteCompleted,
  });

  const [editIssueMutation] = useMutation<
    editIssueMutation,
    editIssueMutationVariables
  >(EDIT_ISSUE_MUTATION, {
    onCompleted: onIssueEditCompleted,
  });

  useEffect(() => {
    if (viewerRef.current && caseDetailData) {
      const issue = caseDetailData.getIssue.issue as IIssues;
      const issueComment = issue.comment as IIssueComments[];
      setContent(issue.content);
      setWriter(issue.writer as ICommentUser);
      setFiles(issue.files as IIssueFiles[]);
      setLoadedData(issue as IIssues);
      setCheckLocked(issue.locked as boolean);
      viewerRef.current?.getInstance().setMarkdown(issue.content as string);
      issueComment.map((comment, index) => {
        originComment.push({
          key: `${comment.id}`,
          actions: [
            // <span key={`comment-reply-${comment.id}`}>Reply to</span>,
            // <span
            //   key={comment.id}
            //   data-id={`${comment.id}`}
            //   onClick={handleEditClick}
            // >
            //   Edit
            // </span>,
            <span key={comment.id}>
              {meData?.me.id === comment.writer?.id && (
                <Popconfirm
                  title="정말 삭제 하시겠습니까?"
                  onConfirm={() => handleCommentDelete(comment.id)}
                  disabled={meData?.me.id !== comment.writer?.id}
                >
                  Delete
                </Popconfirm>
              )}
            </span>,
          ],
          author: comment.writer?.company
            ? comment.writer?.company === 'CEN'
              ? `${comment.writer?.name} [코어엣지네트웍스]`
              : `${comment.writer?.name} [${comment.writer?.company}]`
            : null,
          content: comment.comment,
          datetime: (
            <Tooltip
              title={moment().format(
                new Date(comment.createAt).toLocaleString(),
              )}
            >
              <span>{moment(comment.createAt).fromNow()}</span>
            </Tooltip>
          ),
          depth: comment.depth,
          isReply: false,
        });
      });
      setCommentData(originComment);
      const uploadedList: IDefaultFileList[] = [];
      files.map((file, index) => {
        uploadedList.push({
          uid: `${index + 1}`,
          name: `${file.path}`,
          status: 'done',
          url: `http://${WAS_IP}:4000/uploads/issues/${file.path}`,
        });
      });
      setDefaultFileList(uploadedList);
    }
    refetch();
  }, [caseDetailData, loadedData]);

  const handleEditClick = (event: any) => {
    console.log(event.target.attributes[0].value);
  };

  const handleCommentDelete = (id: number) => {
    deleteIssueCommentMutation({
      variables: { input: { commentId: id } },
    });
  };

  const handleIssueDelete = () => {
    deleteIssueMutation({
      variables: { input: { issueId: +caseId.id } },
    });
  };

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setCommentValue(value);
  };

  const handleSubmit = () => {
    if (!commentValue) {
      return;
    }
    setSubmitting(true);
    createIssueCommentMutation({
      variables: {
        input: {
          issueId: +caseId.id,
          comment: commentValue,
        },
      },
    });
    setCommentValue('');
  };

  const handleSave = async (values: any) => {
    const getContent = await editorRef.current.getInstance().getMarkdown();
    if (isUploading) {
      notification.error({
        message: 'Error',
        description: `파일 업로드 중입니다. 잠시 후에 시도해주세요.`,
        placement: 'topRight',
        duration: 1.5,
      });
      return;
    }
    if (!getContent) {
      notification.error({
        message: 'Error',
        description: `내용을 입력해 주세요.`,
        placement: 'topRight',
        duration: 1,
      });
      return;
    }
    setContent(getContent);
    setIsEdit(!isEdit);
    const newFileForm: any[] = [];
    if (defaultFileList.length !== 0) {
      defaultFileList.map((file) => {
        newFileForm.push({ path: file.name });
      });
    }
    if (uploadedFile.length !== 0) {
      uploadedFile.map((file) => {
        newFileForm.push({
          path: file.filename,
        });
      });
    }
    setFiles(newFileForm); // for render files
    editIssueMutation({
      variables: {
        input: {
          issueId: +caseId.id,
          title: values.title,
          content: getContent,
          kind: values.kind,
          files: newFileForm,
          locked: checkLocked,
        },
      },
    });
  };

  const handleCheckChange = () => {
    setCheckLocked(!checkLocked);
    console.log(checkLocked);
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 5,
    action: `http://${WAS_IP}:4000/uploads/issues`,
    customRequest: (options: any) => {
      const data = new FormData();
      data.append('file', options.file);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      if (uploadedFile.length + defaultFileList.length >= 5) {
        notification.error({
          message: 'Error',
          description: `업로드는 최대 5개만 가능합니다.`,
          placement: 'topRight',
          duration: 1.5,
        });
      } else {
        axios
          .post(options.action, data, config)
          .then((res: any) => {
            options.onSuccess(res.data, options.file);
            uploadedFile.push(res.data.data[0]);
            setUploadedFile(uploadedFile);
            notification.success({
              message: 'Success!',
              description: `업로드 성공(${options.file.name})`,
              placement: 'topRight',
              duration: 1.5,
            });
          })
          .catch((err: Error) => {
            notification.error({
              message: 'Error',
              description: `업로드 실패`,
              placement: 'topRight',
              duration: 1.5,
            });
          });
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
    },
    async onChange(info: any) {
      const refeshDefault: any[] = [];
      await info.fileList.map((file: any) => {
        if (file.response === undefined) {
          refeshDefault.push({ name: file.name });
        }
      });
      setDefaultFileList(refeshDefault); // dummy for max file count
      if (
        info.file.status === 'uploading' &&
        uploadedFile.length + defaultFileList.length < 5
      ) {
        setIsUploading(true);
      } else {
        setIsUploading(false);
      }
    },
    defaultFileList: defaultFileList,
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Cases | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <ToolOutlined />
        {` Cases`}
      </TitleBar>
      <Form form={form} onFinish={handleSave} autoComplete="off">
        <MenuBar>
          {isEdit ? (
            <>
              <SButton type="primary" size="small" htmlType="submit">
                Save
              </SButton>
              <SButton type="primary" size="small">
                <Popconfirm
                  title="정말 취소 하시겠습니까?"
                  onConfirm={() => setIsEdit(false)}
                >
                  Cancel
                </Popconfirm>
              </SButton>
            </>
          ) : (
            <SButton
              type="primary"
              size="small"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </SButton>
          )}
          <SButton
            type="primary"
            size="small"
            disabled={
              isEdit ||
              meData?.me.id !== writer?.id ||
              meData?.me.role !== UserRole.CENSE
            }
          >
            <Popconfirm
              title="정말 삭제 하시겠습니까?"
              onConfirm={handleIssueDelete}
            >
              Delete
            </Popconfirm>
          </SButton>
          <SButton
            type="primary"
            size="small"
            onClick={() => history.push('/partner/cases/')}
          >
            Back
          </SButton>
        </MenuBar>

        <TitleColumn>
          {isEdit ? (
            <>
              <Form.Item
                name="kind"
                style={{
                  display: 'inline-block',
                  width: '20%',
                  marginRight: '8px',
                }}
                rules={[{ required: true, message: '입력 필수' }]}
                initialValue={loadedData?.kind}
              >
                <Select
                  placeholder="말머리"
                  allowClear
                  defaultValue={loadedData?.kind}
                >
                  <Option value={KindRole.Case}>Case</Option>
                  <Option value={KindRole.Question}>문의</Option>
                  <Option value={KindRole.ETC}>ETC</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="title"
                style={{
                  display: 'inline-block',
                  width: '70%',
                  marginRight: '8px',
                }}
                rules={[{ required: true, message: '입력 필수' }]}
                initialValue={loadedData?.title}
              >
                <Input placeholder="제목" defaultValue={loadedData?.title} />
              </Form.Item>
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(10% - 16px)' }}
              >
                <Checkbox
                  defaultChecked={checkLocked}
                  onChange={handleCheckChange}
                >
                  <LockOutlined />
                </Checkbox>
              </Form.Item>
            </>
          ) : (
            <>
              {loadedData?.kind === KindRole.Question
                ? `[문의] `
                : `[${loadedData?.kind}] `}
              {loadedData?.title}
            </>
          )}
        </TitleColumn>

        {isEdit ? (
          <>
            <ContentColumn>
              <Editor
                previewStyle="vertical"
                height="500px"
                initialEditType="wysiwyg"
                placeholder="글쓰기"
                ref={editorRef}
                initialValue={content}
                language="ko-KR"
                previewHighlight={false}
                usageStatistics={false}
              />
            </ContentColumn>
            <Dragger {...uploadProps} defaultFileList={defaultFileList}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                업로드할 파일을 이 영역으로 드래그 또는 클릭합니다.
              </p>
              <p className="ant-upload-hint">
                단일 또는 대량 업로드를 지원하며, 최대 5개까지 업로드
                가능합니다.
              </p>
            </Dragger>
          </>
        ) : (
          <>
            <ContentColumn>
              <Viewer
                initialValue={content}
                ref={viewerRef as React.MutableRefObject<Viewer>}
              />
            </ContentColumn>
            {files.length > 0 && (
              <FilesColumn>
                <FilesTitleColumn>첨부파일</FilesTitleColumn>
                {files.map((file, index) => (
                  <a
                    key={file.id}
                    title={`첨부${index + 1} 다운로드`}
                    href={`http://${WAS_IP}:4000/uploads/issues/${file.path}`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    style={{ margin: '8px 0' }}
                  >
                    {`${index + 1}. ${file.path}`}
                  </a>
                ))}
              </FilesColumn>
            )}
          </>
        )}
      </Form>
      <CommentColumn>
        {commentData?.length > 0 && <CommentList comments={commentData} />}
        {!isEdit && (
          <Comment
            content={
              <CommentEditor
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                value={commentValue}
              />
            }
          />
        )}
      </CommentColumn>
    </Wrapper>
  );
};

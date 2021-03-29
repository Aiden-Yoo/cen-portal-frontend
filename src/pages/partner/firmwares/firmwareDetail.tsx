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
  getFirmwareQuery,
  getFirmwareQueryVariables,
} from '../../../__generated__/getFirmwareQuery';
import { InboxOutlined, ToolOutlined, LockOutlined } from '@ant-design/icons';
import { KindFirmware, UserRole } from '../../../__generated__/globalTypes';
import moment from 'moment';
import { useMe } from '../../../hooks/useMe';
import {
  deleteFirmwareMutation,
  deleteFirmwareMutationVariables,
} from '../../../__generated__/deleteFirmwareMutation';
import {
  editFirmwareMutation,
  editFirmwareMutationVariables,
} from '../../../__generated__/editFirmwareMutation';

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

const GET_WORKAROUND_QUERY = gql`
  query getFirmwareQuery($input: GetFirmwareInput!) {
    getFirmware(input: $input) {
      ok
      error
      firmware {
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
      }
    }
  }
`;

const DELETE_WORKAROUND_MUTATION = gql`
  mutation deleteFirmwareMutation($input: DeleteFirmwareInput!) {
    deleteFirmware(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_WORKAROUND_MUTATION = gql`
  mutation editFirmwareMutation($input: EditFirmwareInput!) {
    editFirmware(input: $input) {
      ok
      error
    }
  }
`;

interface IFirmwareUser {
  id: number;
  company: string;
  name: string;
}

interface IFirmwareFiles {
  id: number;
  path: string;
}

interface IFirmwares {
  id: number;
  title: string;
  kind: KindFirmware;
  content: string;
  locked: boolean | null;
  writer: IFirmwareUser | null;
  files: IFirmwareFiles[] | null;
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

export const FirmwareDetail: React.FC = () => {
  const { data: meData } = useMe();
  const history = useHistory();
  const firmwareId: any = useParams();
  const viewerRef = useRef<Viewer>();
  const editorRef = React.createRef<any>();
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>();
  const [loadedData, setLoadedData] = useState<IFirmwares>();
  const [files, setFiles] = useState<IFirmwareFiles[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<IUploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [checkLocked, setCheckLocked] = useState<boolean>(false);
  const [defaultFileList, setDefaultFileList] = useState<any[]>([]);
  const {
    data: firmwareDetailData,
    loading: firmwareDetailLoading,
    refetch,
  } = useQuery<getFirmwareQuery, getFirmwareQueryVariables>(
    GET_WORKAROUND_QUERY,
    {
      variables: {
        input: {
          id: +firmwareId.id,
        },
      },
    },
  );

  const onFirmwareDeleteCompleted = (data: deleteFirmwareMutation) => {
    const {
      deleteFirmware: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `삭제 성공`,
        placement: 'topRight',
        duration: 1,
      });
      history.push('/partner/firmwares/');
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `삭제 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const onFirmwareEditCompleted = (data: editFirmwareMutation) => {
    const {
      editFirmware: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `수정 성공`,
        placement: 'topRight',
        duration: 1,
      });
      history.push(`/partner/firmwares/${firmwareId.id}`);
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

  const [deleteFirmwareMutation] = useMutation<
    deleteFirmwareMutation,
    deleteFirmwareMutationVariables
  >(DELETE_WORKAROUND_MUTATION, {
    onCompleted: onFirmwareDeleteCompleted,
  });

  const [editFirmwareMutation] = useMutation<
    editFirmwareMutation,
    editFirmwareMutationVariables
  >(EDIT_WORKAROUND_MUTATION, {
    onCompleted: onFirmwareEditCompleted,
  });

  useEffect(() => {
    if (viewerRef.current && firmwareDetailData) {
      const firmware = firmwareDetailData.getFirmware.firmware as IFirmwares;
      setContent(firmware.content);
      setFiles(firmware.files as IFirmwareFiles[]);
      setLoadedData(firmware as IFirmwares);
      setCheckLocked(firmware.locked as boolean);
      viewerRef.current?.getInstance().setMarkdown(firmware.content as string);
      const uploadedList: IDefaultFileList[] = [];
      files.map((file, index) => {
        uploadedList.push({
          uid: `${index + 1}`,
          name: `${file.path}`,
          status: 'done',
          url: `http://localhost:4000/uploads/firmwares/${file.path}`,
        });
      });
      setDefaultFileList(uploadedList);
    }
    refetch();
  }, [firmwareDetailData, loadedData]);

  const handleEditClick = (event: any) => {
    console.log(event.target.attributes[0].value);
  };

  const handleFirmwareDelete = () => {
    deleteFirmwareMutation({
      variables: { input: { firmwareId: +firmwareId.id } },
    });
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
    editFirmwareMutation({
      variables: {
        input: {
          firmwareId: +firmwareId.id,
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
    action: 'http://localhost:4000/uploads/firmwares',
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
        <title>Firmwares | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <ToolOutlined />
        {` Firmwares`}
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
              disabled={UserRole.CENSE !== meData?.me.role}
            >
              Edit
            </SButton>
          )}
          <SButton
            type="primary"
            size="small"
            disabled={isEdit || meData?.me.role !== UserRole.CENSE}
          >
            <Popconfirm
              title="정말 삭제 하시겠습니까?"
              onConfirm={handleFirmwareDelete}
            >
              Delete
            </Popconfirm>
          </SButton>
          <SButton type="primary" size="small" onClick={() => history.goBack()}>
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
                  <Option value={KindFirmware.C2000}>C2000</Option>
                  <Option value={KindFirmware.C3000}>C3000</Option>
                  <Option value={KindFirmware.C3100}>C3100</Option>
                  <Option value={KindFirmware.C3300}>C3300</Option>
                  <Option value={KindFirmware.C5000}>C5000</Option>
                  <Option value={KindFirmware.C7000}>C7000</Option>
                  <Option value={KindFirmware.C9000}>C9000</Option>
                  <Option value={KindFirmware.ETC}>ETC</Option>
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
            <>{`[${loadedData?.kind}] ${loadedData?.title}`}</>
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
                    href={`http://localhost:4000/uploads/firmwares/${file.path}`}
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
    </Wrapper>
  );
};

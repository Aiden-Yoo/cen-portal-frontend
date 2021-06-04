import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import {
  Popconfirm,
  Form,
  Button,
  notification,
  Input,
  Select,
  Upload,
} from 'antd';
import { FormOutlined, InboxOutlined } from '@ant-design/icons';
import {
  createDocumentMutation,
  createDocumentMutationVariables,
} from '../../../__generated__/createDocumentMutation';
import { KindDocument } from '../../../__generated__/globalTypes';
import { useMe } from '../../../hooks/useMe';
import { WAS_IP } from '../../../constants';

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

const FormColumn = styled.div`
  margin-top: 40px;
`;

const ItemList = styled.div`
  background-color: #ffffff;
  padding: 20px;
`;

const ButtonColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const CREATE_WORKAROUND_MUTATION = gql`
  mutation createDocumentMutation($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      ok
      error
      document {
        id
      }
    }
  }
`;

interface IUploadedFile {
  filename: string;
  originalname: string;
}

export const AddDocument: React.FC = () => {
  const { data: meData } = useMe();
  const history = useHistory();
  const [form] = Form.useForm();
  const [uploadedFile, setUploadedFile] = useState<IUploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const editorRef = React.createRef<any>();
  const [content, setContent] = useState<string>();

  const onCompleted = (data: createDocumentMutation) => {
    const {
      createDocument: { ok, error, document },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '새 글 등록 성공',
        placement: 'topRight',
        duration: 1,
      });
      setUploadedFile([]);
      history.push(`/partner/documents/${document.id}`);
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `새 글 등록 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [createDocumentMutation, { data }] = useMutation<
    createDocumentMutation,
    createDocumentMutationVariables
  >(CREATE_WORKAROUND_MUTATION, {
    onCompleted,
  });

  const onFinish = async (values: any) => {
    const getContent = await editorRef.current.getInstance().getMarkdown();
    if (isUploading) {
      notification.error({
        message: 'Error',
        description: `파일 업로드 중입니다. 잠시 후에 시도해주세요.`,
        placement: 'topRight',
        duration: 1,
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
    // console.log('Received values of form:', values);
    const newFileForm: any[] = [];
    if (uploadedFile.length !== 0) {
      uploadedFile.map((file) => {
        newFileForm.push({ path: file.filename });
      });
    }
    createDocumentMutation({
      variables: {
        input: {
          title: values.title,
          content: getContent,
          kind: values.kind,
          files: newFileForm,
        },
      },
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 5,
    action: `http://${WAS_IP}:4000/uploads/documents`,
    customRequest: (options: any) => {
      const data = new FormData();
      data.append('file', options.file);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      if (uploadedFile.length >= 5) {
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
      if (info.file.status === 'uploading' && uploadedFile.length < 5) {
        setIsUploading(true);
      } else {
        setIsUploading(false);
      }
    },
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Add Document | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FormOutlined />
        {' 새 글 등록'}
      </TitleBar>
      <FormColumn>
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="kind"
            style={{
              display: 'inline-block',
              width: '20%',
              margin: '0 8px 0 0',
            }}
            rules={[{ required: true, message: '입력 필수' }]}
          >
            <Select placeholder="말머리" allowClear>
              <Option value={KindDocument.Datasheet}>데이터시트</Option>
              <Option value={KindDocument.Proposal}>표준제안서</Option>
              <Option value={KindDocument.Certificate}>인증서</Option>
              <Option value={KindDocument.TestReport}>시험성적서</Option>
              <Option value={KindDocument.Brochure}>브로셔</Option>
              <Option value={KindDocument.ETC}>ETC</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            style={{ display: 'inline-block', width: 'calc(80% - 8px)' }}
            rules={[{ required: true, message: '입력 필수' }]}
          >
            <Input placeholder="제목" />
          </Form.Item>

          <Editor
            previewStyle="vertical"
            height="500px"
            // initialEditType="markdown"
            initialEditType="wysiwyg"
            placeholder="글쓰기"
            ref={editorRef}
            initialValue={content}
            language="ko-KR"
            previewHighlight={false}
            usageStatistics={false}
          />

          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              업로드할 파일을 이 영역으로 드래그 또는 클릭합니다.
            </p>
            <p className="ant-upload-hint">
              단일 또는 대량 업로드를 지원하며, 최대 5개까지 업로드 가능합니다.
            </p>
          </Dragger>
          <ButtonColumn>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              작성완료
            </Button>
            <Button type="primary">
              <Popconfirm
                title="정말 취소 하시겠습니까?"
                onConfirm={() => history.goBack()}
              >
                취소
              </Popconfirm>
            </Button>
          </ButtonColumn>
        </Form>
      </FormColumn>
    </Wrapper>
  );
};

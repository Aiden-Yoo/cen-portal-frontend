/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Form,
  Button,
  notification,
  Descriptions,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Select,
} from 'antd';
import {
  editBundleMutation,
  editBundleMutationVariables,
} from '../../../__generated__/editBundleMutation';
import {
  getBundleQuery,
  getBundleQueryVariables,
} from '../../../__generated__/getBundleQuery';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';
import {
  UserRole,
  CreateBundleItemInput,
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

const TableColumn = styled.div`
  padding: 8px;
  background-color: #ffffff;
`;

const SButton = styled(Button)`
  margin-left: 8px;
`;

const GET_BUNDLE_QUERY = gql`
  query getBundleQuery($input: BundleInput!) {
    findBundleById(input: $input) {
      ok
      error
      bundle {
        id
        name
        series
        description
        parts {
          num
          part {
            id
            name
            series
          }
        }
      }
    }
  }
`;

const EDIT_BUNDLE_MUTATION = gql`
  mutation editBundleMutation($input: EditBundleInput!) {
    editBundle(input: $input) {
      ok
      error
    }
  }
`;

interface IBundleParts {
  key: string;
  no: number;
  name: string;
  series: string;
  num: number | null;
}

interface IPart {
  id: number;
  name: string;
  series: string;
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

interface IBundleOutput {
  ok: boolean;
  error: string | null;
  bundle: IBundle | null;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'select' | 'number' | 'text';
  record?: IBundle;
  index?: number;
  children?: React.ReactNode;
  //
  width?: string;
  editable?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
  sortDirections?: string[];
  defaultSortOrder?: string;
  sorter?: unknown;
  render?: unknown;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { Option } = Select;
  let inputNode;
  if (inputType === 'select') {
    inputNode = (
      <Select>
        <Option value={1}>test</Option>
      </Select>
    );
  } else if (inputType === 'number') {
    inputNode = <InputNumber />;
  } else {
    inputNode = <Input />;
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const BundleDetail: React.FC = () => {
  const originData: IBundleParts[] = [];
  const { data: meData } = useMe();
  const [form] = Form.useForm();
  const history = useHistory();
  const bundleId: any = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [series, setSeries] = useState<string | null>('');
  const [description, setDescription] = useState<string | null>('');
  const [data, setData] = useState<IBundleParts[]>([]);
  const [parts, setParts] = useState<IBundleItem[]>([]);
  const [inputParts, setInputParts] = useState<CreateBundleItemInput[]>([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: IBundleParts) => record.key === editingKey;

  const {
    data: bundleData,
    loading: bundleLoading,
    refetch,
  } = useQuery<getBundleQuery, getBundleQueryVariables>(GET_BUNDLE_QUERY, {
    variables: {
      input: {
        bundleId: +bundleId.id,
      },
    },
  });

  const onCompleted = (data: editBundleMutation) => {
    const {
      editBundle: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '변경 성공',
        placement: 'topRight',
        duration: 1,
      });
      setSelectedRowKeys([]);
      refetch();
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `변경 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [editBundleMutation, { data: editBundleData }] = useMutation<
    editBundleMutation,
    editBundleMutationVariables
  >(EDIT_BUNDLE_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    if (bundleData && !bundleLoading) {
      const bundleInfo = bundleData.findBundleById.bundle as IBundle;
      const partsInfo = bundleInfo.parts as IBundleItem[];
      setName(bundleInfo.name);
      setSeries(bundleInfo.series);
      setDescription(bundleInfo.description);
      setParts(bundleInfo.parts as IBundleItem[]);
      for (let i = 0; i < partsInfo.length; i++) {
        originData.push({
          key: `${partsInfo[i].part.id}`,
          no: 1 + i,
          name: partsInfo[i].part.name,
          series: partsInfo[i].part.series,
          num: partsInfo[i].num,
        });
      }
      setData(originData);
    }
  }, [bundleData]);

  const handleChange = (e: any) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'name') {
      setName(value);
    }
    if (name === 'series') {
      setSeries(value);
    }
    if (name === 'description') {
      setDescription(value);
    }
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
    // form.setFieldsValue({
    //   ...record,
    // });
    // setEditingKey(record.key);
  };

  const handleCancel = () => {
    setIsEdit(!isEdit);
  };

  const handleSave = () => {
    try {
      editBundleMutation({
        variables: {
          input: {
            bundleId: +bundleId.id,
            name: name,
            series: series,
            description: description,
            parts: inputParts,
          },
        },
      });
      setIsEdit(!isEdit);
      console.log(parts);
    } catch (e) {
      console.log(e);
    }
  };

  // const handleAdd = () => {
  //   const newData = {
  //     key: `${data.length + 1}`,
  //     no: data.length + 1,
  //     name: '',
  //     series: '',
  //     num: null,
  //   };
  //   setData([...data, newData]);
  // };

  const handleDelete = () => {
    let newData: IBundleParts[] = [...data];
    let newPartsData: CreateBundleItemInput[] = [];
    selectedRowKeys.map((key) => {
      const tempData: IBundleParts[] = [];
      const tempPart: CreateBundleItemInput[] = [];
      newData.map((k: IBundleParts) => {
        if (k.key !== `${key}`) {
          tempData.push(k);
          tempPart.push({ partId: +k.key, num: k.num });
        }
        newData = tempData;
        newPartsData = tempPart;
      });
    });
    setData(newData);
    setInputParts(newPartsData);
  };

  const handleRowDelete = (key: number) => {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].key !== `${key}`) {
        newData.push({
          key: data[i].key,
          no: data[i].no,
          name: data[i].name,
          series: data[i].series,
          num: data[i].num,
        });
      }
    }
    setData(newData);
  };

  const columns: EditableCellProps[] = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '8%',
      align: 'center',
    },
    {
      title: '모델명',
      dataIndex: 'name',
      width: '35%',
      align: 'center',
      editable: true,
    },
    {
      title: '시리즈',
      dataIndex: 'series',
      width: '20%',
      align: 'center',
      editable: true,
    },
    {
      title: '수량',
      dataIndex: 'num',
      width: '8%',
      align: 'center',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      render: (_: string, record: any) => {
        return (
          <span>
            <Typography.Link href="#!" disabled={!isEdit}>
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

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IBundleParts) => ({
        record,
        inputType:
          col.dataIndex === 'name'
            ? 'select'
            : col.dataIndex === 'name'
            ? 'number'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IBundleParts[]) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    // getCheckboxProps: (record: IPart) => ({
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
        {` 제품 - Bundles`}
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
            onClick={() => handleEdit()}
          >
            Edit
          </SButton>
        )}

        <SButton
          type="primary"
          size="small"
          disabled={isEdit}
          onClick={() => history.goBack()}
        >
          Back
        </SButton>
      </MenuBar>

      <Descriptions
        title={`${name}`}
        bordered
        size="small"
        labelStyle={{ backgroundColor: '#F0F2F5' }}
      >
        <Descriptions.Item label="모델명" span={2}>
          {isEdit ? (
            <Input name="name" onChange={handleChange} defaultValue={name} />
          ) : (
            name
          )}
        </Descriptions.Item>
        <Descriptions.Item label="시리즈" span={1}>
          {isEdit ? (
            <Input
              name="series"
              onChange={handleChange}
              defaultValue={series ? `${series}` : ''}
            />
          ) : (
            series
          )}
        </Descriptions.Item>
        <Descriptions.Item label="설명" span={3}>
          {isEdit ? (
            <Input.TextArea
              name="description"
              onChange={handleChange}
              defaultValue={description ? `${description}` : ''}
            />
          ) : (
            description
          )}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions layout="vertical" bordered size="small">
        <Descriptions.Item
          label="포함 제품"
          style={{ backgroundColor: '#F0F2F5' }}
        >
          <TableColumn>
            {isEdit ? (
              <MenuBar>
                {/* <SButton type="primary" size="small" onClick={handleAdd}>
                  Add a row
                </SButton> */}
                <SButton type="primary" size="small">
                  <Popconfirm
                    title="정말 삭제 하시겠습니까?"
                    onConfirm={() => handleDelete()}
                  >
                    Delete
                  </Popconfirm>
                </SButton>
              </MenuBar>
            ) : (
              ''
            )}

            <Form form={form} component={false}>
              <Table
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                columns={mergedColumns}
                dataSource={data}
                rowSelection={rowSelection}
                pagination={false}
                size="small"
                bordered
                loading={bundleLoading}
              />
            </Form>
          </TableColumn>
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  );
};

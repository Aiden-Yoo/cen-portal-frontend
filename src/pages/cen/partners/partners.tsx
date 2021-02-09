/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import {
  Table,
  Popconfirm,
  Form,
  Typography,
  Button,
  notification,
  BackTop,
  Input,
} from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';
import { useAllPartners } from '../../../hooks/useAllPartners';
import {
  deletePartnerMutation,
  deletePartnerMutationVariables,
} from '../../../__generated__/deletePartnerMutation';
import {
  editPartnerMutation,
  editPartnerMutationVariables,
} from '../../../__generated__/editPartnerMutation';

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

const DELETE_PARTNER_MUTATION = gql`
  mutation deletePartnerMutation($input: DeletePartnerInput!) {
    deletePartner(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_PARTNER_MUTATION = gql`
  mutation editPartnerMutation($input: EditPartnerInput!) {
    editPartner(input: $input) {
      ok
      error
    }
  }
`;

interface IPartner {
  key?: string;
  no?: number;
  id?: number;
  name: string | JSX.Element;
  address: string;
  zip: string;
  tel: string;
  contactsCount: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'number' | 'text';
  record?: IPartner;
  index?: number;
  children?: React.ReactNode;
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
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const Partner = () => {
  const originData: IPartner[] = [];
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<IPartner[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const { data: meData } = useMe();
  const {
    data: allPartnersData,
    loading: allPartnersLoading,
    refetch: reGetData,
  } = useAllPartners(page, take);

  const onDeleteCompleted = (data: deletePartnerMutation) => {
    const {
      deletePartner: { ok, error },
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

  const onEditCompleted = (data: editPartnerMutation) => {
    const {
      editPartner: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `변경 성공`,
        placement: 'topRight',
        duration: 1,
      });
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `변경 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [deletePartnerMutation, { data: deletePartnerData }] = useMutation<
    deletePartnerMutation,
    deletePartnerMutationVariables
  >(DELETE_PARTNER_MUTATION, {
    onCompleted: onDeleteCompleted,
  });

  const [editPartnerMutation, { data: editPartnerData }] = useMutation<
    editPartnerMutation,
    editPartnerMutationVariables
  >(EDIT_PARTNER_MUTATION, {
    onCompleted: onEditCompleted,
  });

  useEffect(() => {
    if (allPartnersData && !allPartnersLoading) {
      const partners = allPartnersData.allPartners.partners as IPartner[];
      const getTotalPages = allPartnersData.allPartners.totalPages as number;
      const getTotalResults = allPartnersData.allPartners
        .totalResults as number;
      for (let i = 0; i < partners.length; i++) {
        originData.push({
          key: `${partners[i].id}`,
          // no: i + 1 + (getTotalPages - page) * (getTotalResults % take),
          no: (getTotalPages - page) * take + (getTotalResults % take) - i,
          name: (
            <Link
              to={`/cen/partners/${partners[i].id}`}
            >{`${partners[i].name}`}</Link>
          ),
          address: partners[i].address,
          zip: partners[i].zip,
          tel: partners[i].tel,
          contactsCount: partners[i].contactsCount,
        });
      }
      setTotal(getTotalResults);
      setData(originData);
    }
    reGetData();
  }, [allPartnersData]);

  const isEditing = (record: IPartner) => record.key === editingKey;

  const edit = (record: Partial<IPartner> & { key: React.Key }) => {
    form.setFieldsValue({
      status: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IPartner;

      const newData = [...data];
      const index = newData?.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
        editPartnerMutation({
          variables: {
            input: {
              partnerId: +key,
              address: row.address,
              zip: row.zip,
              tel: row.tel,
            },
          },
        });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      reGetData();
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      deletePartnerMutation({
        variables: { input: { partnerId: +key } },
      });
    });
    reGetData();
  };

  const handleRowDelete = (key: number) => {
    deletePartnerMutation({
      variables: { input: { partnerId: +key } },
    });
    reGetData();
  };

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const columns: EditableCellProps[] = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '1%',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a: { no: number }, b: { no: number }) => a.no - b.no,
        multiple: 1,
      },
    },
    {
      title: '회사명',
      dataIndex: 'name',
      width: '20%',
      align: 'center',
    },
    {
      title: '주소',
      dataIndex: 'address',
      align: 'center',
      editable: true,
    },
    {
      title: '우편번호',
      dataIndex: 'zip',
      width: '10%',
      align: 'center',
      editable: true,
    },
    {
      title: '회사번호',
      dataIndex: 'tel',
      width: '12%',
      align: 'center',
      editable: true,
    },
    {
      title: '연락처 수',
      dataIndex: 'contactsCount',
      width: '9%',
      align: 'center',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      width: '1%',
      render: (_: string, record: any) => {
        const editable = isEditing(record);
        return (
          <span>
            {editable ? (
              <>
                <Popconfirm
                  title="정말 변경 하시겠습니까?"
                  onConfirm={() => save(record.key)}
                >
                  <Typography.Link
                    style={{
                      marginRight: 8,
                    }}
                  >
                    Save
                  </Typography.Link>
                </Popconfirm>
                <Typography.Link
                  onClick={cancel}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Cancel
                </Typography.Link>
              </>
            ) : (
              <Typography.Link
                onClick={() => edit(record)}
                style={{ marginRight: 8 }}
              >
                Edit
              </Typography.Link>
            )}

            <Typography.Link href="#!">
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
      onCell: (record: IPartner) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IPartner[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    // getCheckboxProps: (record: IPartner) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Partners | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 파트너'}
      </TitleBar>
      <MenuBar>
        <SButton type="primary" size="small">
          <Link to="/cen/partners/add-partner">Add</Link>
        </SButton>
        <SButton type="primary" size="small">
          <Popconfirm
            title="정말 삭제 하시겠습니까?"
            onConfirm={() => handleDelete()}
          >
            Delete
          </Popconfirm>
        </SButton>
      </MenuBar>
      <Form form={form} component={false}>
        <Table<IPartner>
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowSelection={rowSelection}
          dataSource={data}
          columns={mergedColumns}
          pagination={{
            total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, take) => handlePageChange(page, take as number),
            showSizeChanger: true,
          }}
          loading={allPartnersLoading}
          size="small"
        />
      </Form>
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

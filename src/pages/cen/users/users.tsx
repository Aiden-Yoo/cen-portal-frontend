/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
  Select,
} from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';
import { useAllUsers } from '../../../hooks/useAllUsers';
import { UserRole } from '../../../__generated__/globalTypes';
import {
  editUserMutation,
  editUserMutationVariables,
} from '../../../__generated__/editUserMutation';

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

const EDIT_USER_MUTATION = gql`
  mutation editUserMutation($input: EditUserInput!) {
    editUser(input: $input) {
      ok
      error
    }
  }
`;

interface IUser {
  key?: string;
  no?: number;
  id?: number;
  createAt: string;
  email: string;
  role: UserRole;
  company: string;
  team: string | null;
  name: string | JSX.Element;
  verified: boolean | string;
  isLocked: boolean | string;
  orderAuth: boolean | string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'select';
  record?: IUser;
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
  const { Option } = Select;
  const inputNode =
    dataIndex === 'role' ? (
      <Select style={{ width: 100 }}>
        <Option value={UserRole.CEN}>CEN</Option>
        <Option value={UserRole.CENSE}>CENSE</Option>
        <Option value={UserRole.Partner}>Partner</Option>
        <Option value={UserRole.Client}>Client</Option>
      </Select>
    ) : (
      <Select style={{ width: 60 }}>
        <Option value={'O'}>O</Option>
        <Option value={'X'}>X</Option>
      </Select>
    );

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

export const User: React.FC = () => {
  const originData: IUser[] = [];
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState<IUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const {
    data: allUsersData,
    loading: allUsersLoading,
    refetch: reGetData,
  } = useAllUsers(page, take);

  const onEditCompleted = (data: editUserMutation) => {
    const {
      editUser: { ok, error },
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

  const [editUserMutation, { data: editUserData }] = useMutation<
    editUserMutation,
    editUserMutationVariables
  >(EDIT_USER_MUTATION, {
    onCompleted: onEditCompleted,
  });

  useEffect(() => {
    if (allUsersData && !allUsersLoading) {
      const users = allUsersData.allUsers.users as IUser[];
      const getTotalPages = allUsersData.allUsers.totalPages as number;
      const getTotalResults = allUsersData.allUsers.totalResults as number;
      for (let i = 0; i < users.length; i++) {
        originData.push({
          key: `${users[i].id}`,
          // no: i + 1 + (getTotalPages - page) * (getTotalResults % take),
          no: (getTotalPages - page) * take + (getTotalResults % take) - i,
          name: users[i].name,
          // (
          //   <Link to={`/cen/users/${users[i].id}`}>{`${users[i].name}`}</Link>
          // ),
          createAt: users[i].createAt,
          email: users[i].email,
          role: users[i].role,
          company: users[i].company,
          team: users[i].team,
          verified: `${users[i].verified === true ? 'O' : 'X'}`,
          isLocked: `${users[i].isLocked === true ? 'O' : 'X'}`,
          orderAuth: `${users[i].orderAuth === true ? 'O' : 'X'}`,
        });
      }
      setTotal(getTotalResults);
      setData(originData);
    }
    reGetData();
  }, [allUsersData]);

  const isEditing = (record: IUser) => record.key === editingKey;

  const edit = (record: Partial<IUser> & { key: React.Key }) => {
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
      const row = (await form.validateFields()) as IUser;

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
        const verified = row.verified === 'O' ? true : false;
        const isLocked = row.isLocked === 'O' ? true : false;
        const orderAuth = row.orderAuth === 'O' ? true : false;
        editUserMutation({
          variables: {
            input: {
              userId: +key,
              role: row.role,
              verified,
              isLocked,
              orderAuth,
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
      title: '이름',
      dataIndex: 'name',
      width: '12%',
      align: 'center',
    },
    {
      title: '이메일',
      dataIndex: 'email',
      width: '20%',
      align: 'center',
    },
    {
      title: '회사',
      dataIndex: 'company',
      width: '20%',
      align: 'center',
    },
    {
      title: '팀',
      dataIndex: 'team',
      width: '8%',
      align: 'center',
    },
    {
      title: '권한',
      dataIndex: 'role',
      width: '10%',
      align: 'center',
      editable: true,
    },
    {
      title: '승인',
      dataIndex: 'verified',
      width: '10%',
      align: 'center',
      editable: true,
    },
    {
      title: '잠금',
      dataIndex: 'isLocked',
      width: '10%',
      align: 'center',
      editable: true,
    },
    {
      title: '출고열람',
      dataIndex: 'orderAuth',
      width: '10%',
      align: 'center',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: '16%',
      align: 'center',
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
      onCell: (record: IUser) => ({
        record,
        inputType: 'select',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Wrapper>
      <Helmet>
        <title>Users | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <UsergroupAddOutlined />
        {' 회원관리'}
      </TitleBar>
      <MenuBar />
      <Form form={form} component={false}>
        <Table<IUser>
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          pagination={{
            total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, take) => handlePageChange(page, take as number),
            showSizeChanger: true,
          }}
          loading={allUsersLoading}
          size="small"
        />
      </Form>
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Table,
  Popconfirm,
  Form,
  Typography,
  Button,
  notification,
  Descriptions,
  Badge,
  Input,
} from 'antd';
import {
  getPartnerQuery,
  getPartnerQueryVariables,
} from '../../../__generated__/getPartnerQuery';
import {
  deleteContactMutation,
  deleteContactMutationVariables,
} from '../../../__generated__/deleteContactMutation';
import {
  editContactMutation,
  editContactMutationVariables,
} from '../../../__generated__/editContactMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Loading } from '../../../components/loading';
import { UserRole } from '../../../__generated__/globalTypes';
import { useMe } from '../../../hooks/useMe';

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

const GET_PARTNER_QUERY = gql`
  query getPartnerQuery($input: PartnerInput!) {
    findPartnerById(input: $input) {
      ok
      error
      partner {
        id
        name
        address
        zip
        tel
        contacts {
          id
          name
          jobTitle
          tel
          team
        }
        orders {
          id
          projectName
          items {
            id
            num
          }
        }
      }
    }
  }
`;

const DELETE_CONTACT_MUTATION = gql`
  mutation deleteContactMutation($input: DeleteContactInput!) {
    deleteContact(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_CONTACT_MUTATION = gql`
  mutation editContactMutation($input: EditContactInput!) {
    editContact(input: $input) {
      ok
      error
    }
  }
`;

interface IContact {
  key?: number;
  no?: number;
  id?: number;
  name: string;
  jobTitle: string | null;
  tel: string;
  team?: string | null;
}

interface IBundle {
  name: string;
}

interface IOrderItem {
  id: number;
  bundle: IBundle;
  num: number;
}

interface IOrder {
  id: number;
  projectName: string;
  items: IOrderItem[];
}

interface IPartner {
  key?: string;
  id: number;
  name: string;
  address: string;
  zip: string | null;
  tel: string | null;
  contacts: IContact[] | null;
  orders: IOrder[] | null;
}

interface IPartnerOutput {
  ok: boolean;
  error: string | null;
  partner: IPartner | null;
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

export const PartnerDetail: React.FC = () => {
  const history = useHistory();
  const originData: IContact[] = [];
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const partnerId: any = useParams();
  const { data: meData } = useMe();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [partner, setPartner] = useState<IPartner>();
  const [data, setData] = useState<any>([]);

  const {
    data: partnerData,
    loading: partnerLoading,
    refetch: reGetData,
  } = useQuery<getPartnerQuery, getPartnerQueryVariables>(GET_PARTNER_QUERY, {
    variables: {
      input: {
        partnerId: +partnerId.id,
      },
    },
  });

  const onDeleteCompleted = (data: deleteContactMutation) => {
    const {
      deleteContact: { ok, error },
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

  const onEditCompleted = (data: editContactMutation) => {
    const {
      editContact: { ok, error },
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

  const [deleteContactMutation, { data: deleteContactData }] = useMutation<
    deleteContactMutation,
    deleteContactMutationVariables
  >(DELETE_CONTACT_MUTATION, {
    onCompleted: onDeleteCompleted,
  });

  const [editContactMutation, { data: editContactData }] = useMutation<
    editContactMutation,
    editContactMutationVariables
  >(EDIT_CONTACT_MUTATION, {
    onCompleted: onEditCompleted,
  });

  useEffect(() => {
    if (partnerData && !partnerLoading) {
      const partnerInfo = partnerData.findPartnerById.partner as IPartner;
      const contactsInfo = partnerInfo.contacts as IContact[];
      setPartner(partnerInfo);
      for (let i = 0; i < contactsInfo.length; i++) {
        originData.push({
          key: contactsInfo[i].id,
          no: i + 1,
          name: contactsInfo[i].name,
          jobTitle: contactsInfo[i].jobTitle,
          team: contactsInfo[i].team,
          tel: contactsInfo[i].tel,
        });
      }
      setData(originData);
    }
  }, [partnerData]);

  const columns: EditableCellProps[] = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '8%',
      align: 'center',
    },
    {
      title: '이름',
      dataIndex: 'name',
      width: '15%',
      align: 'center',
      editable: true,
    },
    {
      title: '직함/직책',
      dataIndex: 'jobTitle',
      width: '13%',
      align: 'center',
      editable: true,
    },
    {
      title: '팀',
      dataIndex: 'team',
      width: '17%',
      align: 'center',
      editable: true,
    },
    {
      title: '연락처',
      dataIndex: 'tel',
      width: '25%',
      align: 'center',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      align: 'center',
      width: '15%',
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
                  <Typography.Link style={{ marginRight: 8 }}>
                    Save
                  </Typography.Link>
                </Popconfirm>
                <Typography.Link onClick={cancel} style={{ marginRight: 8 }}>
                  Cancel
                </Typography.Link>
              </>
            ) : (
              <Typography.Link
                onClick={() => edit(record)}
                style={{ marginRight: 8 }}
                disabled={editingKey !== ''}
              >
                Edit
              </Typography.Link>
            )}

            <Typography.Link href="#!" disabled={editingKey !== ''}>
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
      const row = (await form.validateFields()) as IContact;
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
        editContactMutation({
          variables: {
            input: {
              contactId: +key,
              name: row.name,
              jobTitle: row.jobTitle,
              team: row.team,
              tel: row.tel,
            },
          },
        });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      deleteContactMutation({
        variables: { input: { contactId: +key } },
      });
    });
    reGetData();
  };

  const handleRowDelete = (key: number) => {
    deleteContactMutation({
      variables: { input: { contactId: +key } },
    });
    reGetData();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IOrder[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    // getCheckboxProps: (record: IOrder) => ({
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
        {` 파트너`}
      </TitleBar>
      <MenuBar>
        <SButton type="primary" size="small" onClick={() => history.goBack()}>
          Back
        </SButton>
      </MenuBar>

      <Descriptions
        title={`${partner?.name}`}
        bordered
        size="small"
        labelStyle={{ backgroundColor: '#F0F2F5' }}
      >
        <Descriptions.Item label="업체명" span={1}>
          {partner?.name}
        </Descriptions.Item>
        <Descriptions.Item label="주소" span={2}>
          {partner?.address}
        </Descriptions.Item>
        <Descriptions.Item label="우편번호" span={1}>
          {partner?.zip == null ? '-' : partner?.zip}
        </Descriptions.Item>
        <Descriptions.Item label="대표번호" span={2}>
          {partner?.tel == null ? '-' : partner?.tel}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions layout="vertical" bordered size="small">
        <Descriptions.Item
          label="연락처"
          style={{ backgroundColor: '#F0F2F5' }}
        >
          <TableColumn>
            <MenuBar>
              <SButton type="primary" size="small">
                <Link to={`/cen/partners/${partnerId.id}/add-contact`}>
                  Add
                </Link>
              </SButton>
              <SButton type="primary" size="small" disabled={editingKey !== ''}>
                <Popconfirm
                  title="정말 삭제 하시겠습니까?"
                  onConfirm={() => handleDelete()}
                >
                  Delete
                </Popconfirm>
              </SButton>
            </MenuBar>
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
                loading={partnerLoading}
              />
            </Form>
          </TableColumn>
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  );
};

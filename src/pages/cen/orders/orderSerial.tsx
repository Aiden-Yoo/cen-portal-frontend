/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Table,
  Button,
  Form,
  BackTop,
  Input,
  Popconfirm,
  notification,
} from 'antd';
import {
  getOrderItemsQuery,
  getOrderItemsQueryVariables,
} from '../../../__generated__/getOrderItemsQuery';
import {
  editItemInfoMutation,
  editItemInfoMutationVariables,
} from '../../../__generated__/editItemInfoMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';
import { UserRole } from '../../../__generated__/globalTypes';

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

const GET_ORDERITEMS_QUERY = gql`
  query getOrderItemsQuery($input: GetOrderItemsInput!) {
    getOrderItems(input: $input) {
      ok
      error
      totalPages
      totalResults
      itemInfos {
        id
        name
        serialNumber
      }
    }
  }
`;

const EDIT_ITEMINFO_MUTATION = gql`
  mutation editItemInfoMutation($input: EditItemInfoInput!) {
    editItemInfo(input: $input) {
      ok
      error
    }
  }
`;

// const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface IItemInfo {
  key?: string;
  no?: number;
  id?: number;
  name: string;
  serialNumber: string | null;
}

////////////////////////////////////////////////////////////
// interface EditableRowProps {
//   index: number;
// }

// const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
//   const [form] = Form.useForm();
//   return (
//     <Form form={form} component={false}>
//       <EditableContext.Provider value={form}>
//         <tr {...props} />
//       </EditableContext.Provider>
//     </Form>
//   );
// };

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'number' | 'text';
  record: IItemInfo;
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

type EditableTableProps = Parameters<typeof Table>[0];

// interface DataType {
//   id: number;
//   name: string;
//   serialNumber: string | null;
// }

// interface EditableTableState {
//   dataSource: DataType[];
//   count: number;
// }

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

////////////////////////////////////////////////////////////////

export const OrderSerial: React.FC = () => {
  const { data: meData } = useMe();
  const [form] = Form.useForm();
  const orderId: any = useParams();
  const [data, setData] = useState<IItemInfo[]>([]);
  const originData: IItemInfo[] = [];
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const history = useHistory();

  const {
    data: orderItemData,
    loading: orderItemLoading,
    refetch,
  } = useQuery<getOrderItemsQuery, getOrderItemsQueryVariables>(
    GET_ORDERITEMS_QUERY,
    {
      variables: {
        input: {
          orderId: +orderId.id,
          page,
          take,
        },
      },
    },
  );

  const onCompleted = (data: editItemInfoMutation) => {
    const {
      editItemInfo: { ok, error },
    } = data;

    if (ok) {
      notification.success({
        message: 'Success!',
        description: `변경 성공`,
        placement: 'topRight',
        duration: 1,
      });
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

  const [editItemInfoMutation, { data: editItemInfoData }] = useMutation<
    editItemInfoMutation,
    editItemInfoMutationVariables
  >(EDIT_ITEMINFO_MUTATION, {
    onCompleted,
  });

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
          <Form.Item key={record.key} name={record.key} style={{ margin: 0 }}>
            <Input
              onChange={handleChange}
              defaultValue={
                record.serialNumber ? record.serialNumber : undefined
              }
            />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  useEffect(() => {
    if (orderItemData && !orderItemLoading) {
      const itemInfos = orderItemData.getOrderItems.itemInfos as IItemInfo[];
      const getTotalPages = orderItemData.getOrderItems.totalPages as number;
      const getTotalResults = orderItemData.getOrderItems
        .totalResults as number;
      for (let i = 0; i < itemInfos.length; i++) {
        originData.push({
          key: `${itemInfos[i].id}`,
          no: i + 1 + (page - 1) * take,
          name: itemInfos[i].name,
          serialNumber: itemInfos[i].serialNumber,
        });
      }
      setTotal(getTotalResults);
      setData(originData);
    }
    refetch();
  }, [orderItemData]);

  const handleChange = (e: any) => {
    console.log(e);
  };

  const handleCancel = () => {
    setIsEdit(!isEdit);
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const handleSave = async () => {
    try {
      const row = await form.validateFields();
      for (const item in row) {
        if (typeof row[item] === 'string') {
          editItemInfoMutation({
            variables: {
              input: {
                itemInfoId: +item,
                serialNumber: row[item],
              },
            },
          });
        }
      }

      setIsEdit(!isEdit);
      refetch();
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const columns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: 'No',
      dataIndex: 'no',
      align: 'center',
      width: '1%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      width: '50%',
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      align: 'center',
      editable: true,
    },
  ];

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IItemInfo) => ({
        record,
        inputType: 'text',
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEdit,
      }),
    };
  });

  return (
    <Wrapper>
      <Helmet>
        <title>Orders | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 시리얼 넘버'}
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
      <Form form={form} component={false}>
        <Table<any>
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns as ColumnTypes}
          rowClassName={() => 'editable-row'}
          pagination={{
            total,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, take) => handlePageChange(page, take as number),
            showSizeChanger: true,
          }}
          loading={orderItemLoading}
          size="small"
        />
      </Form>
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

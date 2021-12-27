/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Table,
  Popconfirm,
  Form,
  Typography,
  Button,
  notification,
  Radio,
  RadioChangeEvent,
  BackTop,
  Tag,
  Input,
  Select,
} from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useMe } from '../../../hooks/useMe';
import {
  DemoStatus,
  Origin,
  UserRole,
} from '../../../__generated__/globalTypes';
import {
  getDemosQuery,
  getDemosQueryVariables,
} from '../../../__generated__/getDemosQuery';
import Search from 'antd/lib/input/Search';
import {
  deleteDemoMutation,
  deleteDemoMutationVariables,
} from '../../../__generated__/deleteDemoMutation';
import {
  editDemoMutation,
  editDemoMutationVariables,
} from '../../../__generated__/editDemoMutation';
import {
  createDemoMutation,
  createDemoMutationVariables,
} from '../../../__generated__/createDemoMutation';

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

interface IDemo {
  key?: string;
  no?: number;
  id?: number;
  status: DemoStatus | null;
  deliverDate: string;
  returnDate?: string | null;
  projectName: string;
  model: string;
  serialNumber: string;
  salesPerson: string;
  applier?: string | null;
  receiver?: string | null;
  partner: string;
  partnerPerson?: string | null;
  origin: Origin | null;
  description?: string | null;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'number' | 'text' | 'select';
  record?: IDemo;
  index?: number;
  children?: React.ReactNode;
  width?: string | number;
  editable?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
  sortDirections?: string[];
  defaultSortOrder?: string;
  sorter?: unknown;
  render?: unknown;
  fixed?: 'left' | 'right';
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

  const inputNode = (dataIndex: string) => {
    switch (dataIndex) {
      case 'status':
        return (
          <Select style={{ width: 100 }}>
            <Option value={DemoStatus.Release}>출고상태</Option>
            <Option value={DemoStatus.Return}>반납완료</Option>
            <Option value={DemoStatus.Sold}>판매전환</Option>
            <Option value={DemoStatus.Loss}>손실처리</Option>
            <Option value={DemoStatus.Etc}>기타</Option>
          </Select>
        );
      case 'origin':
        return (
          <Select style={{ width: 100 }}>
            <Option value={Origin.Demo}>데모장비</Option>
            <Option value={Origin.LAB}>랩장비</Option>
            <Option value={Origin.New}>새장비</Option>
          </Select>
        );
      default:
        return <Input />;
    }
  };

  const missCheck = (dataIndex: string) => {
    switch (dataIndex) {
      case 'status':
      case 'deliverDate':
      case 'projectName':
      case 'model':
      case 'serialNumber':
      case 'salesPerson':
      case 'partner':
        return true;
      default:
        return false;
    }
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: missCheck(dataIndex),
              message: `${title} 작성 필요!`,
            },
          ]}
        >
          {inputNode(dataIndex)}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const GET_DEMOS_QUERY = gql`
  query getDemosQuery($input: GetDemosInput!) {
    getDemos(input: $input) {
      ok
      error
      totalPages
      totalResults
      demos {
        id
        createAt
        status
        deliverDate
        returnDate
        projectName
        model
        serialNumber
        salesPerson
        applier
        receiver
        partner
        partnerPerson
        origin
        description
      }
    }
  }
`;

const DELETE_DEMO_MUTATION = gql`
  mutation deleteDemoMutation($input: DeleteDemoInput!) {
    deleteDemo(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_DEMO_MUTATION = gql`
  mutation editDemoMutation($input: EditDemoInput!) {
    editDemo(input: $input) {
      ok
      error
    }
  }
`;

const CREATE_DEMO_MUTATION = gql`
  mutation createDemoMutation($input: CreateDemoInput!) {
    createDemo(input: $input) {
      ok
      error
    }
  }
`;

export const Demo = () => {
  const originData: IDemo[] = [];
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<IDemo[]>([]);
  const [oldData, setOldData] = useState<IDemo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<DemoStatus>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNew, setIsNew] = useState<boolean>(false);
  const { data: meData } = useMe();

  const {
    data: demoData,
    loading,
    refetch: reGetData,
  } = useQuery<getDemosQuery, getDemosQueryVariables>(GET_DEMOS_QUERY, {
    variables: {
      input: {
        page,
        take,
        status,
        searchTerm,
      },
    },
  });

  const onDeleteCompleted = (data: deleteDemoMutation) => {
    const {
      deleteDemo: { ok, error },
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

  const [deleteDemoMutation, { data: deleteDemoData }] = useMutation<
    deleteDemoMutation,
    deleteDemoMutationVariables
  >(DELETE_DEMO_MUTATION, {
    onCompleted: onDeleteCompleted,
  });

  const onEditCompleted = (data: editDemoMutation) => {
    const {
      editDemo: { ok, error },
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

  const [editDemoMutation, { data: editDemoData }] = useMutation<
    editDemoMutation,
    editDemoMutationVariables
  >(EDIT_DEMO_MUTATION, {
    onCompleted: onEditCompleted,
  });

  const onCreateCompleted = (data: createDemoMutation) => {
    const {
      createDemo: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: `추가 성공`,
        placement: 'topRight',
        duration: 1,
      });
      setIsNew(false);
    } else if (error) {
      notification.error({
        message: 'Error',
        description: `추가 실패. ${error}`,
        placement: 'topRight',
        duration: 1,
      });
    }
  };

  const [createDemoMutation, { data: createDemoData }] = useMutation<
    createDemoMutation,
    createDemoMutationVariables
  >(CREATE_DEMO_MUTATION, {
    onCompleted: onCreateCompleted,
  });

  useEffect(() => {
    if (demoData) {
      const demos = demoData.getDemos.demos as IDemo[];
      const getTotal = demoData.getDemos.totalResults as number;
      for (let i = 0; i < demos?.length; i++) {
        originData.push({
          key: `${demos[i].id}`,
          status: demos[i].status,
          deliverDate: new Date(demos[i].deliverDate).toLocaleDateString(),
          returnDate: demos[i].returnDate
            ? new Date(`${demos[i].returnDate}`).toLocaleDateString()
            : null,
          projectName: demos[i].projectName,
          model: demos[i].model,
          serialNumber: demos[i].serialNumber,
          salesPerson: demos[i].salesPerson,
          applier: demos[i].applier,
          receiver: demos[i].receiver,
          partner: demos[i].partner,
          partnerPerson: demos[i].partnerPerson,
          origin: demos[i].origin,
          description: demos[i].description,
        });
      }
      setTotal(getTotal);
      setData(originData);
      setOldData(originData);
    }
    reGetData();
    // if (data !== originData) reGetData();
  }, [demoData, createDemoData, editDemoData, deleteDemoData]);

  const handleStatusChange = (event: RadioChangeEvent) => {
    const {
      target: { value },
    } = event;
    setStatus(value);
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const isEditing = (record: IDemo) => record.key === editingKey;

  const initializeForm = () => {
    form.setFieldsValue({
      status: null,
      applier: '',
      deliverDate: null,
      description: '',
      model: '',
      origin: null,
      partner: '',
      partnerPerson: '',
      projectName: '',
      receiver: '',
      returnDate: null,
      salesPerson: '',
      serialNumber: '',
    });
  };

  const handleEdit = (record: Partial<IDemo> & { key: React.Key }) => {
    if (isNew) initializeForm();
    if (!isNew) {
      form.setFieldsValue({
        status: '',
        ...record,
      });
    }
    setEditingKey(record.key);
  };

  const handleCancel = () => {
    initializeForm();
    setIsNew(false);
    setEditingKey('');
    setData(oldData);
  };

  const handleSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IDemo;

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
        if (!isNew) {
          editDemoMutation({
            variables: {
              input: {
                id: +key,
                status: row.status,
                applier: row.applier,
                deliverDate: row.deliverDate,
                description: row.description,
                model: row.model,
                origin: row.origin,
                partner: row.partner,
                partnerPerson: row.partnerPerson,
                projectName: row.projectName,
                receiver: row.receiver,
                returnDate: row.returnDate === '' ? null : row.returnDate,
                salesPerson: row.salesPerson,
                serialNumber: row.serialNumber,
              },
            },
          });
        }
        if (isNew) {
          createDemoMutation({
            variables: {
              input: {
                status: row.status,
                applier: row.applier,
                deliverDate: row.deliverDate,
                description: row.description,
                model: row.model,
                origin: row.origin,
                partner: row.partner,
                partnerPerson: row.partnerPerson,
                projectName: row.projectName,
                receiver: row.receiver,
                returnDate: row.returnDate,
                salesPerson: row.salesPerson,
                serialNumber: row.serialNumber,
              },
            },
          });
        }
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      initializeForm();
      setIsNew(false);
      reGetData();
    } catch (errInfo) {
      // console.log('Validate Failed:', errInfo);
      notification.error({
        message: 'Error',
        description: `[작성 누락] 누락된 항목을 채워주세요.`,
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const handleAdd = () => {
    initializeForm();
    setEditingKey('');
    setIsNew(true);
    setOldData(data);
    setEditingKey('0');
    if (isNew) {
      notification.error({
        message: 'Error',
        description: `추가된 행에 작성해 주세요`,
        placement: 'topRight',
        duration: 2,
      });
    } else {
      const newData: IDemo = {
        key: `0`,
        deliverDate: new Date().toLocaleDateString(),
        model: '',
        origin: null,
        partner: '',
        projectName: '',
        salesPerson: '',
        serialNumber: '',
        status: null,
      };
      setData([newData, ...data]);
      setTotal(total + 1);
    }
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      deleteDemoMutation({
        variables: { input: { id: +key } },
      });
    });
    setIsNew(false);
    reGetData();
  };

  const handleRowDelete = (key: number) => {
    deleteDemoMutation({
      variables: { input: { id: +key } },
    });
    setIsNew(false);
    reGetData();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IDemo[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    // getCheckboxProps: (record: IDemo) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  const columns: EditableCellProps[] = [
    {
      title: '상태',
      dataIndex: 'status',
      width: 120,
      editable: true,
      align: 'center',
      fixed: 'left',
      render: (status: DemoStatus) => {
        let color = '';
        let text = '';
        switch (status) {
          case DemoStatus.Release:
            color = 'orange';
            text = '출고상태';
            break;
          case DemoStatus.Return:
            color = 'geekblue';
            text = '반납완료';
            break;
          case DemoStatus.Sold:
            color = 'green';
            text = '판매전환';
            break;
          case DemoStatus.Loss:
            color = 'red';
            text = '손실처리';
            break;
          case DemoStatus.Etc:
            color = 'volcano';
            text = '기타';
            break;
        }
        return (
          <Tag color={color} key={status}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '출고일자',
      dataIndex: 'deliverDate',
      width: 120,
      editable: true,
      align: 'center',
    },
    {
      title: '반납일자',
      dataIndex: 'returnDate',
      width: 120,
      editable: true,
      align: 'center',
    },
    {
      title: '프로젝트명',
      dataIndex: 'projectName',
      width: 250,
      editable: true,
      align: 'center',
    },
    {
      title: '모델명',
      dataIndex: 'model',
      width: 180,
      editable: true,
      align: 'center',
    },
    {
      title: 'SN or 수량',
      dataIndex: 'serialNumber',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '신청자',
      dataIndex: 'salesPerson',
      width: 80,
      editable: true,
      align: 'center',
    },
    {
      title: '출고자',
      dataIndex: 'applier',
      width: 80,
      editable: true,
      align: 'center',
    },
    {
      title: '반납자',
      dataIndex: 'receiver',
      width: 80,
      editable: true,
      align: 'center',
    },
    {
      title: '파트너사',
      dataIndex: 'partner',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '담당자/연락처',
      dataIndex: 'partnerPerson',
      width: 200,
      editable: true,
      align: 'center',
    },
    {
      title: '장비구분',
      dataIndex: 'origin',
      width: 120,
      editable: true,
      align: 'center',
      render: (deliveryMethod: Origin) => {
        switch (deliveryMethod) {
          case Origin.Demo:
            return '데모장비';
          case Origin.LAB:
            return '랩장비';
          case Origin.New:
            return '새장비';
        }
      },
    },
    {
      title: '비고',
      dataIndex: 'description',
      width: 300,
      editable: true,
      align: 'center',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_: string, record: any) => {
        const editable = isEditing(record);
        return (
          <span>
            {editable ? (
              <>
                <Popconfirm
                  title="정말 저장 하시겠습니까?"
                  onConfirm={() => handleSave(record.key)}
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
                  onClick={handleCancel}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Cancel
                </Typography.Link>
              </>
            ) : (
              <Typography.Link
                onClick={() => handleEdit(record)}
                style={{ marginRight: 8 }}
                disabled={meData?.me.role !== UserRole.CENSE || isNew}
              >
                Edit
              </Typography.Link>
            )}

            <Typography.Link
              href="#!"
              disabled={meData?.me.role !== UserRole.CENSE || isNew}
            >
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
      onCell: (record: IDemo) => ({
        record,
        inputType: col.dataIndex === ('status' || 'origin') ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Wrapper>
      <Helmet>
        <title>Demo | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 입출고 - Demo'}
      </TitleBar>
      <MenuBar>
        <Search
          placeholder="검색(프로젝트, 모델, SN, 파트너)"
          onSearch={onSearch}
          style={{ width: 300 }}
          size="small"
          allowClear
          enterButton
        />
        <Radio.Group
          defaultValue={null}
          size="small"
          onChange={handleStatusChange}
          style={{ paddingLeft: '8px' }}
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={DemoStatus.Notcompleted}>미완료</Radio.Button>
          <Radio.Button value={DemoStatus.Completed}>완료</Radio.Button>
        </Radio.Group>
        <SButton
          type="primary"
          size="small"
          disabled={meData?.me.role !== UserRole.CENSE || isNew}
          onClick={() => handleAdd()}
        >
          Add
        </SButton>
        <SButton
          type="primary"
          size="small"
          disabled={meData?.me.role !== UserRole.CENSE || isNew}
        >
          <Popconfirm
            title="정말 삭제 하시겠습니까?"
            onConfirm={() => handleDelete()}
          >
            Delete
          </Popconfirm>
        </SButton>
      </MenuBar>
      <Form form={form} component={false}>
        <Table<IDemo>
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
            pageSize: 20,
          }}
          loading={loading}
          scroll={{ x: 1500 }}
          size="small"
        />
      </Form>
      <BackTop style={{ right: 10, bottom: 10 }} />
    </Wrapper>
  );
};

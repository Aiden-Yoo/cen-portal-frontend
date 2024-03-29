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
  Reenactment,
  RmaClassification,
  UserRole,
} from '../../../__generated__/globalTypes';
import {
  getRmasQuery,
  getRmasQueryVariables,
} from '../../../__generated__/getRmasQuery';
import Search from 'antd/lib/input/Search';
import {
  deleteRmaMutation,
  deleteRmaMutationVariables,
} from '../../../__generated__/deleteRmaMutation';
import {
  editRmaMutation,
  editRmaMutationVariables,
} from '../../../__generated__/editRmaMutation';
import {
  createRmaMutation,
  createRmaMutationVariables,
} from '../../../__generated__/createRmaMutation';

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

interface IRma {
  key?: string;
  no?: number;
  id?: number;
  rmaStatus?: string;
  classification: RmaClassification | null;
  model: string;
  projectName: string;
  returnDate?: string | null;
  returnSrc?: string | null;
  returnSn?: string | null;
  deliverDate?: string | null;
  deliverDst?: string | null;
  deliverSn?: string | null;
  reenactment?: Reenactment | string | null;
  person?: string | null;
  description?: string | null;
  address?: string | null;
  symptom?: string | null;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing?: boolean;
  dataIndex: string;
  title: string;
  inputType?: 'number' | 'text' | 'select' | 'checkbox';
  record?: IRma;
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
      case 'classification':
        return (
          <Select style={{ width: 80 }}>
            <Option value={RmaClassification.RMA}>RMA</Option>
            <Option value={RmaClassification.DoA}>DoA</Option>
          </Select>
        );
      case 'reenactment':
        return (
          <Select style={{ width: 100 }}>
            <Option value={Reenactment.True}>재현됨</Option>
            <Option value={Reenactment.False}>재현불가</Option>
            <Option value={Reenactment.Later}>추후확인</Option>
          </Select>
        );
      default:
        return <Input />;
    }
  };

  const missCheck = (dataIndex: string) => {
    switch (dataIndex) {
      case 'projectName':
      case 'model':
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

const GET_RMAS_QUERY = gql`
  query getRmasQuery($input: GetRmasInput!) {
    getRmas(input: $input) {
      ok
      error
      totalPages
      totalResults
      rmas {
        id
        createAt
        updateAt
        classification
        model
        projectName
        returnDate
        returnSrc
        returnSn
        deliverDst
        deliverDate
        deliverSn
        reenactment
        person
        description
        rmaStatus
        address
        symptom
      }
    }
  }
`;

const DELETE_RMA_MUTATION = gql`
  mutation deleteRmaMutation($input: DeleteRmaInput!) {
    deleteRma(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_RMA_MUTATION = gql`
  mutation editRmaMutation($input: EditRmaInput!) {
    editRma(input: $input) {
      ok
      error
    }
  }
`;

const CREATE_RMA_MUTATION = gql`
  mutation createRmaMutation($input: CreateRmaInput!) {
    createRma(input: $input) {
      ok
      error
    }
  }
`;

export const Rma = () => {
  const originData: IRma[] = [];
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<IRma[]>([]);
  const [oldData, setOldData] = useState<IRma[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);
  const [rmaStatus, setRmaStatus] = useState<string | null>(null);
  const [classification, setRmaClassification] = useState<RmaClassification>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNew, setIsNew] = useState<boolean>(false);
  const { data: meData } = useMe();

  const {
    data: rmaData,
    loading,
    refetch: reGetData,
  } = useQuery<getRmasQuery, getRmasQueryVariables>(GET_RMAS_QUERY, {
    variables: {
      input: {
        page,
        take,
        rmaStatus,
        classification,
        searchTerm,
      },
    },
  });

  const onDeleteCompleted = (data: deleteRmaMutation) => {
    const {
      deleteRma: { ok, error },
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

  const [deleteRmaMutation, { data: deleteRmaData }] = useMutation<
    deleteRmaMutation,
    deleteRmaMutationVariables
  >(DELETE_RMA_MUTATION, {
    onCompleted: onDeleteCompleted,
  });

  const onEditCompleted = (data: editRmaMutation) => {
    const {
      editRma: { ok, error },
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

  const [editRmaMutation, { data: editRmaData }] = useMutation<
    editRmaMutation,
    editRmaMutationVariables
  >(EDIT_RMA_MUTATION, {
    onCompleted: onEditCompleted,
  });

  const onCreateCompleted = (data: createRmaMutation) => {
    const {
      createRma: { ok, error },
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

  const [createRmaMutation, { data: createRmaData }] = useMutation<
    createRmaMutation,
    createRmaMutationVariables
  >(CREATE_RMA_MUTATION, {
    onCompleted: onCreateCompleted,
  });

  const reenactmentCheck = (reenactment: Reenactment) => {
    switch (reenactment) {
      case Reenactment.Later:
        return '추후확인';
      case Reenactment.False:
        return '재현불가';
      case Reenactment.True:
        return '재현됨';
    }
  };

  useEffect(() => {
    if (rmaData) {
      const rmas = rmaData.getRmas.rmas as IRma[];
      const getTotal = rmaData.getRmas.totalResults as number;
      for (let i = 0; i < rmas?.length; i++) {
        originData.push({
          key: `${rmas[i].id}`,
          rmaStatus: rmas[i].rmaStatus,
          classification: rmas[i].classification,
          model: rmas[i].model,
          projectName: rmas[i].projectName,
          returnDate: rmas[i].returnDate
            ? new Date(`${rmas[i].returnDate}`).toLocaleDateString()
            : null,
          returnSrc: rmas[i].returnSrc,
          returnSn: rmas[i].returnSn,
          deliverDate: rmas[i].deliverDate
            ? new Date(`${rmas[i].deliverDate}`).toLocaleDateString()
            : null,
          deliverDst: rmas[i].deliverDst,
          deliverSn: rmas[i].deliverSn,
          reenactment: reenactmentCheck(rmas[i].reenactment as Reenactment),
          person: rmas[i].person,
          description: rmas[i].description,
          address: rmas[i].address,
          symptom: rmas[i].symptom,
        });
      }
      setTotal(getTotal);
      setData(originData);
      setOldData(originData);
    }
    reGetData();
    // if (data !== originData) reGetData();
  }, [rmaData, createRmaData, deleteRmaData, editRmaData]);

  const handleStatusChange = (event: RadioChangeEvent) => {
    const {
      target: { value },
    } = event;
    setRmaStatus(value);
  };

  const handleRmaClassificationChange = (event: RadioChangeEvent) => {
    const {
      target: { value },
    } = event;
    setRmaClassification(value);
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number, take: number) => {
    setPage(page);
    setTake(take);
  };

  const isEditing = (record: IRma) => record.key === editingKey;

  const initializeForm = () => {
    form.setFieldsValue({
      classification: null,
      model: '',
      projectName: '',
      returnDate: null,
      returnSrc: '',
      returnSn: '',
      deliverDst: '',
      deliverDate: null,
      deliverSn: '',
      reenactment: null,
      person: '',
      description: '',
      address: '',
      symptom: '',
    });
  };

  const handleEdit = (record: Partial<IRma> & { key: React.Key }) => {
    if (isNew) initializeForm();
    if (!isNew) {
      form.setFieldsValue({
        status: '',
        ...record,
      });
    }
    setEditingKey(record.key);
  };

  const handleCancel = (key: React.Key) => {
    initializeForm();
    setIsNew(false);
    setEditingKey('');
    setData(oldData);
  };

  const handleSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IRma;
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
          editRmaMutation({
            variables: {
              input: {
                id: +key,
                classification: row.classification,
                model: row.model,
                projectName: row.projectName,
                returnDate: row.returnDate === '' ? null : row.returnDate,
                returnSrc: row.returnSrc,
                returnSn: row.returnSn,
                deliverDst: row.deliverDst,
                deliverDate: row.deliverDate === '' ? null : row.deliverDate,
                deliverSn: row.deliverSn,
                reenactment: row.reenactment as Reenactment,
                person: row.person,
                description: row.description,
                address: row.address,
                symptom: row.symptom,
              },
            },
          });
        }
        if (isNew) {
          createRmaMutation({
            variables: {
              input: {
                classification: row.classification,
                model: row.model,
                projectName: row.projectName,
                returnDate: row.returnDate === '' ? null : row.returnDate,
                returnSrc: row.returnSrc,
                returnSn: row.returnSn,
                deliverDst: row.deliverDst,
                deliverDate: row.deliverDate === '' ? null : row.deliverDate,
                deliverSn: row.deliverSn,
                reenactment: row.reenactment as Reenactment,
                person: row.person,
                description: row.description,
                address: row.address,
                symptom: row.symptom,
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
      const newData: IRma = {
        key: `0`,
        classification: null,
        model: '',
        projectName: '',
        // deliverSn: '',
      };
      setData([newData, ...data]);
      setTotal(total + 1);
    }
  };

  const handleDelete = () => {
    selectedRowKeys.map((key) => {
      deleteRmaMutation({
        variables: { input: { id: +key } },
      });
    });
    setIsNew(false);
    reGetData();
  };

  const handleRowDelete = (key: number) => {
    deleteRmaMutation({
      variables: { input: { id: +key } },
    });
    setIsNew(false);
    reGetData();
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IRma[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    // getCheckboxProps: (record: IRma) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  const columns: EditableCellProps[] = [
    {
      title: '구분',
      dataIndex: 'classification',
      width: 100,
      editable: true,
      align: 'center',
      fixed: 'left',
      render: (classification: RmaClassification) => {
        let color = '';
        let text = '';
        switch (classification) {
          case RmaClassification.RMA:
            color = 'geekblue';
            text = 'RMA';
            break;
          case RmaClassification.DoA:
            color = 'green';
            text = 'DoA';
            break;
        }
        return (
          <Tag color={color} key={classification}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '상태',
      dataIndex: 'rmaStatus',
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (rmaStatus: string) => {
        let color = '';
        let text = '';
        switch (rmaStatus) {
          case '완료':
            color = 'geekblue';
            text = '완료';
            break;
          case '선출고':
            color = 'volcano';
            text = '선출고';
            break;
          case '선입고':
            color = 'purple';
            text = '선입고';
            break;
          case '임시':
            color = 'red';
            text = '임시';
            break;
        }
        return (
          <Tag color={color} key={rmaStatus}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '모델명',
      dataIndex: 'model',
      width: 180,
      editable: true,
      align: 'center',
    },
    {
      title: '프로젝트명',
      dataIndex: 'projectName',
      width: 200,
      editable: true,
      align: 'center',
    },
    {
      title: '회수날짜',
      dataIndex: 'returnDate',
      width: 120,
      editable: true,
      align: 'center',
    },
    {
      title: '회수지',
      dataIndex: 'returnSrc',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '회수SN(수량)',
      dataIndex: 'returnSn',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '출고날짜',
      dataIndex: 'deliverDate',
      width: 120,
      editable: true,
      align: 'center',
    },
    {
      title: '출고지',
      dataIndex: 'deliverDst',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '출고SN(수량)',
      dataIndex: 'deliverSn',
      width: 150,
      editable: true,
      align: 'center',
    },
    {
      title: '재현여부',
      dataIndex: 'reenactment',
      width: 120,
      editable: true,
      align: 'center',
    },
    {
      title: '장애증상',
      dataIndex: 'symptom',
      width: 120,
      editable: true,
      align: 'center',
    },
    {
      title: '납품장소',
      dataIndex: 'address',
      width: 350,
      editable: true,
      align: 'center',
    },
    {
      title: '담당자/연락처',
      dataIndex: 'person',
      width: 200,
      editable: true,
      align: 'center',
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
                  onClick={() => handleCancel(record.key)}
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
      onCell: (record: IRma) => ({
        record,
        inputType: col.dataIndex === 'classification' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Wrapper>
      <Helmet>
        <title>RMA/DoA | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {' 입출고 - RMA/DoA'}
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
          <Radio.Button value={'선입고'}>선입고</Radio.Button>
          <Radio.Button value={'선출고'}>선출고</Radio.Button>
          <Radio.Button value={'완료'}>완료</Radio.Button>
        </Radio.Group>
        <Radio.Group
          defaultValue={null}
          size="small"
          onChange={handleRmaClassificationChange}
          style={{ paddingLeft: '8px' }}
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={RmaClassification.RMA}>RMA</Radio.Button>
          <Radio.Button value={RmaClassification.DoA}>DoA</Radio.Button>
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
        <Table<IRma>
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

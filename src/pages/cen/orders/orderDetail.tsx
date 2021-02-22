import React, { useState, useEffect, SetStateAction } from 'react';
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
} from 'antd';
import {
  getOrderQuery,
  getOrderQueryVariables,
} from '../../../__generated__/getOrderQuery';
import {
  deleteOrderMutation,
  deleteOrderMutationVariables,
} from '../../../__generated__/deleteOrderMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Loading } from '../../../components/loading';
import { AnyNaptrRecord } from 'dns';
import {
  DeliveryMethod,
  DeliveryType,
  OrderClassification,
  OrderStatus,
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

const SButton = styled(Button)`
  margin-left: 8px;
`;

const GET_ORDER_QUERY = gql`
  query getOrderQuery($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        id
        createAt
        updateAt
        writer {
          name
        }
        salesPerson
        projectName
        classification
        demoReturnDate
        orderSheet
        partner {
          name
        }
        destination
        receiver
        contact
        address
        deliveryDate
        deliveryType
        deliveryMethod
        remark
        items {
          bundle {
            name
          }
          num
        }
        status
      }
    }
  }
`;

interface IUser {
  name: string;
}

interface IPartner {
  name: string;
}

interface IBundle {
  name: string;
}

interface IOrderItem {
  bundle: IBundle | null;
  num: number;
}

interface IOrder {
  id: number;
  createAt: any;
  updateAt: any;
  writer: IUser | null;
  salesPerson: string;
  projectName: string;
  classification: OrderClassification;
  demoReturnDate: any | null;
  orderSheet: boolean;
  partner: IPartner | null;
  destination: string;
  receiver: string;
  contact: string;
  address: string;
  deliveryDate: any;
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  remark: string | null;
  items: IOrderItem[];
  status: OrderStatus;
}

interface IOrderItemData {
  key: number;
  no: number;
  name: string | undefined;
  num: number;
}

export const OrderDetail: React.FC = () => {
  const originData: IOrderItemData[] = [];
  const history = useHistory();
  const orderId: any = useParams();
  const [order, setOrder] = useState<IOrder>();
  const [data, setData] = useState<IOrderItemData[]>([]);
  const [orderText, setOrderText] = useState('');
  const [orderColor, setOrderColor] = useState('');

  const { data: orderData, loading, refetch } = useQuery<
    getOrderQuery,
    getOrderQueryVariables
  >(GET_ORDER_QUERY, {
    variables: {
      input: {
        id: +orderId.id,
      },
    },
  });

  const columns: ColumnsType<any> = [
    {
      title: 'No',
      dataIndex: 'no',
      width: '10%',
      align: 'center',
    },
    {
      title: '제품명',
      dataIndex: 'name',
      width: '70%',
      align: 'center',
    },
    {
      title: '수량',
      dataIndex: 'num',
      width: '20%',
      align: 'center',
    },
  ];

  useEffect(() => {
    if (orderData && !loading) {
      const orderInfo = orderData.getOrder.order as IOrder;
      setOrder(orderInfo);
      const orderItems = orderInfo.items as IOrderItem[];
      for (let i = 0; i < orderItems.length; i++) {
        originData.push({
          key: i + 1,
          no: i + 1,
          name: orderItems[i].bundle?.name,
          num: orderItems[i].num,
        });
      }
      setData(originData);
      if (orderInfo.status === OrderStatus.Created) {
        setOrderText('출고요청');
        setOrderColor('orange');
      } else if (orderInfo.status === OrderStatus.Canceled) {
        setOrderText('취소됨');
        setOrderColor('red');
      } else if (orderInfo.status === OrderStatus.Pending) {
        setOrderText('보류');
        setOrderColor('volcano');
      } else if (orderInfo.status === OrderStatus.Preparing) {
        setOrderText('준비중');
        setOrderColor('green');
      } else if (orderInfo.status === OrderStatus.Partial) {
        setOrderText('부분출고');
        setOrderColor('blue');
      } else if (orderInfo.status === OrderStatus.Completed) {
        setOrderText('출고완료');
        setOrderColor('geekblue');
      }
    }
    refetch();
  }, [orderData]);

  return (
    <Wrapper>
      <Helmet>
        <title>Orders | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {` 출고요청서`}
      </TitleBar>
      <MenuBar>
        <SButton type="primary" size="small" onClick={() => history.goBack()}>
          Back
        </SButton>
      </MenuBar>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Descriptions
            title={`${order?.projectName}`}
            bordered
            size="small"
            labelStyle={{ backgroundColor: '#F0F2F5' }}
          >
            <Descriptions.Item label="작성일">
              {new Date(order?.createAt).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="담당영업">
              {order?.salesPerson}
            </Descriptions.Item>
            <Descriptions.Item label="작성자">
              {order?.writer?.name}
            </Descriptions.Item>
            <Descriptions.Item label="프로젝트명" span={2}>
              {order?.projectName}
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Badge color={orderColor} text={orderText} />
            </Descriptions.Item>
            <Descriptions.Item label="구분">
              {order?.classification === OrderClassification.Sale
                ? '판매'
                : order?.classification === OrderClassification.Demo
                ? '데모'
                : `${order?.classification}`}
            </Descriptions.Item>
            <Descriptions.Item label="Demo 회수일자">
              {new Date(`${order?.demoReturnDate}`).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="발주서 접수">
              {order?.orderSheet === true ? 'O' : 'X'}
            </Descriptions.Item>
            <Descriptions.Item label="거래처">
              {order?.partner?.name}
            </Descriptions.Item>
            <Descriptions.Item label="납품처">
              {order?.destination}
            </Descriptions.Item>
            <Descriptions.Item label="납품일">
              {new Date(order?.deliveryDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="출고형태" span={2}>
              {order?.deliveryType === DeliveryType.Total
                ? '전체출고'
                : '부분출고'}
            </Descriptions.Item>
            <Descriptions.Item label="배송방법">
              {order?.deliveryMethod === DeliveryMethod.Parcel
                ? '택배'
                : order?.deliveryMethod === DeliveryMethod.Cargo
                ? '화물'
                : order?.deliveryMethod === DeliveryMethod.Quick
                ? '퀵'
                : '직접배송'}
            </Descriptions.Item>
            <Descriptions.Item label="수령자" span={2}>
              {order?.receiver}
            </Descriptions.Item>
            <Descriptions.Item label="연락처">
              {order?.contact}
            </Descriptions.Item>
            <Descriptions.Item label="납품장소" span={3}>
              {order?.address}
            </Descriptions.Item>
            <Descriptions.Item label="요청사항" span={3}>
              {order?.remark}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions layout="vertical" bordered size="small">
            <Descriptions.Item
              label="출고제품"
              style={{ backgroundColor: '#F0F2F5' }}
            >
              <Table<any>
                columns={columns}
                dataSource={data}
                pagination={false}
                size="small"
              />
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Wrapper>
  );
};

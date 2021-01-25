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
  getOrderQuery_getOrder_order,
  getOrderQuery_getOrder_order_partner,
} from '../../../__generated__/getOrderQuery';
import {
  deleteOrderMutation,
  deleteOrderMutationVariables,
} from '../../../__generated__/deleteOrderMutation';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Loading } from '../../../components/loading';
import { AnyNaptrRecord } from 'dns';

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

export const OrderDetail: React.FC = () => {
  const originData: any[] = [];
  const history = useHistory();
  const orderId: any = useParams();
  const [order, setOrder] = useState<getOrderQuery_getOrder_order>();
  const [data, setData] = useState<any[]>([]);

  const { data: orderData, loading } = useQuery<
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
      const orderInfo: any = orderData.getOrder.order;
      setOrder(orderInfo);
      for (let i = 0; i < orderInfo.items.length; i++) {
        originData.push({
          key: i + 1,
          no: i + 1,
          name: orderInfo.items[i].bundle.name,
          num: orderInfo.items[i].num,
        });
      }
      setData(originData);
    }
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
              <Badge status="processing" text="Create" />
            </Descriptions.Item>
            <Descriptions.Item label="구분">
              {order?.classification + ''}
            </Descriptions.Item>
            <Descriptions.Item label="Demo 회수일자">
              {order?.demoReturnDate}
            </Descriptions.Item>
            <Descriptions.Item label="발주서 접수">
              {order?.orderSheet}
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
              {order?.deliveryType + ''}
            </Descriptions.Item>
            <Descriptions.Item label="배송방법">
              {order?.deliveryMethod + ''}
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

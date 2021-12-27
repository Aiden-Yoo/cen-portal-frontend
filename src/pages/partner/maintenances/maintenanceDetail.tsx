import React, { useState, useEffect, SetStateAction } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Table, Button, Descriptions, Badge, notification } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { Loading } from '../../../components/loading';
import { useMe } from '../../../hooks/useMe';
import {
  getMaintenanceQuery,
  getMaintenanceQueryVariables,
} from '../../../__generated__/getMaintenanceQuery';
import {
  MaintenanceClassification,
  UserRole,
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

const GET_MAINTENANCE_QUERY = gql`
  query getMaintenanceQuery($input: GetMaintenanceInput!) {
    getMaintenance(input: $input) {
      ok
      error
      maintenance {
        id
        createAt
        updateAt
        contractNo
        writer {
          name
        }
        salesPerson
        projectName
        distPartner {
          name
        }
        reqPartner
        startDate
        endDate
        description
        items {
          bundle {
            name
          }
          num
        }
        maintenanceItemInfos {
          name
          serialNumber
        }
        maintenanceStatus
        classification
        inCharge
        contact
      }
    }
  }
`;

interface IWriter {
  name: string;
}

interface IPartner {
  name: string;
}

interface IItem {
  bundle: {
    name: string;
  };
  num: number;
}

interface IMaintenance {
  id: number;
  createAt: string;
  contractNo: string;
  writer: IWriter;
  salesPerson: string;
  projectName: string;
  reqPartner?: string | null;
  distPartner: IPartner;
  distPartnerName?: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  items?: IItem[] | null;
  maintenanceStatus?: string | null;
  classification?: MaintenanceClassification | null;
  inCharge?: string | null;
  contact?: string | null;
}

interface IMaintenanceItemData {
  key: number;
  no: number;
  name: string | undefined;
  num: number;
}

export const MaintenanceDetail: React.FC = () => {
  const { data: meData } = useMe();
  const originData: IMaintenanceItemData[] = [];
  const history = useHistory();
  const maintenanceId: any = useParams();
  const [maintenance, setMaintenance] = useState<IMaintenance>();
  const [data, setData] = useState<IMaintenanceItemData[]>([]);
  const [maintenanceText, setMaintenanceText] = useState('');
  const [maintenanceColor, setMaintenanceColor] = useState('');

  const onGetCompleted = (data: getMaintenanceQuery) => {
    const {
      getMaintenance: { ok, error },
    } = data;
    if (error) {
      notification.error({
        message: 'Error',
        description: `로드 실패. ${error}`,
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  const {
    data: maintenanceData,
    loading,
    refetch,
  } = useQuery<getMaintenanceQuery, getMaintenanceQueryVariables>(
    GET_MAINTENANCE_QUERY,
    {
      variables: {
        input: {
          id: +maintenanceId.id,
        },
      },
      onCompleted: onGetCompleted,
    },
  );

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
    if (maintenanceData) {
      const maintenanceInfo = maintenanceData.getMaintenance
        .maintenance as IMaintenance;
      setMaintenance(maintenanceInfo);
      const maintenanceItems = maintenanceInfo?.items as IItem[];
      for (let i = 0; i < maintenanceItems?.length; i++) {
        originData.push({
          key: i + 1,
          no: i + 1,
          name: maintenanceItems[i].bundle?.name,
          num: maintenanceItems[i].num,
        });
      }
      setData(originData);
      if (maintenanceInfo?.maintenanceStatus === '계약중') {
        setMaintenanceText('계약중');
        setMaintenanceColor('blue');
      } else if (maintenanceInfo?.maintenanceStatus === '계약만료') {
        setMaintenanceText('계약만료');
        setMaintenanceColor('red');
      }
    }
    // refetch();
  }, [maintenanceData]);

  return (
    <Wrapper>
      <Helmet>
        <title>Maintenances | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {` 유지보수`}
      </TitleBar>
      <MenuBar>
        <SButton type="primary" size="small">
          <Link to={`/partner/maintenances/${maintenanceId.id}/serial-number`}>
            Serial Number
          </Link>
        </SButton>
        <SButton type="primary" size="small" onClick={() => history.goBack()}>
          Back
        </SButton>
      </MenuBar>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Descriptions
            title={`${maintenance?.projectName}`}
            bordered
            size="small"
            labelStyle={{ backgroundColor: '#F0F2F5' }}
          >
            <Descriptions.Item label="계약번호">
              {maintenance?.contractNo}
            </Descriptions.Item>
            <Descriptions.Item label="작성일">
              {new Date(`${maintenance?.createAt}`).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Badge color={maintenanceColor} text={maintenanceText} />
            </Descriptions.Item>
            <Descriptions.Item label="계약종류" span={3}>
              {maintenance?.classification}
            </Descriptions.Item>
            <Descriptions.Item label="고객사(프로젝트명)" span={2}>
              {maintenance?.projectName}
            </Descriptions.Item>
            <Descriptions.Item label="작성자">
              {maintenance?.writer?.name}
            </Descriptions.Item>
            <Descriptions.Item label="계약 파트너사(총판)" span={2}>
              {maintenance?.distPartner?.name}
            </Descriptions.Item>
            <Descriptions.Item label="담당영업">
              {maintenance?.salesPerson}
            </Descriptions.Item>
            <Descriptions.Item label="요청 파트너사" span={2}>
              {maintenance?.reqPartner}
            </Descriptions.Item>
            <Descriptions.Item label="계약기간">
              {`${new Date(`${maintenance?.startDate}`).toLocaleDateString()} ~
                ${new Date(`${maintenance?.endDate}`).toLocaleDateString()}`}
            </Descriptions.Item>
            <Descriptions.Item label="담당자" span={2}>
              {maintenance?.inCharge}
            </Descriptions.Item>
            <Descriptions.Item label="연락처">
              {maintenance?.contact}
            </Descriptions.Item>
            <Descriptions.Item label="비고" span={3}>
              {maintenance?.description}
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

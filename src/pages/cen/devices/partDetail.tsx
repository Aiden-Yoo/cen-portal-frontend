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
  Popconfirm,
} from 'antd';
import {
  editPartMutation,
  editPartMutationVariables,
} from '../../../__generated__/editPartMutation';
import {
  getPartQuery,
  getPartQueryVariables,
} from '../../../__generated__/getPartQuery';
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

const GET_PART_QUERY = gql`
  query getPartQuery($input: PartInput!) {
    findPartById(input: $input) {
      ok
      error
      part {
        id
        name
        series
        description
      }
    }
  }
`;

const EDIT_PART_MUTATION = gql`
  mutation editPartMutation($input: EditPartInput!) {
    editPart(input: $input) {
      ok
      error
    }
  }
`;

interface IPart {
  id: number;
  name: string;
  series: string;
  description: string | null;
}

export const PartDetail: React.FC = () => {
  const history = useHistory();
  const { data: meData } = useMe();
  const partId: any = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string>('');
  const [series, setSeries] = useState<string>('');
  const [description, setDescription] = useState<string | null>('');

  const {
    data: partData,
    loading,
    refetch,
  } = useQuery<getPartQuery, getPartQueryVariables>(GET_PART_QUERY, {
    variables: {
      input: {
        partId: +partId.id,
      },
    },
  });

  const onCompleted = (data: editPartMutation) => {
    const {
      editPart: { ok, error },
    } = data;
    if (ok) {
      notification.success({
        message: 'Success!',
        description: '변경 성공',
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

  const [editPartMutation, { data: editPartData }] = useMutation<
    editPartMutation,
    editPartMutationVariables
  >(EDIT_PART_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    if (partData && !loading) {
      const partInfo = partData.findPartById.part as IPart;
      setName(partInfo.name);
      setSeries(partInfo.series);
      setDescription(partInfo.description);
    }
  }, [partData, editPartData]);

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
    console.log('handleEdit');
    setIsEdit(!isEdit);
  };

  const handleSave = () => {
    try {
      editPartMutation({
        variables: {
          input: {
            partId: +partId.id,
            name: name,
            series: series,
            description: description,
          },
        },
      });
      setIsEdit(!isEdit);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setIsEdit(!isEdit);
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Devices | CEN Portal</title>
      </Helmet>
      <TitleBar>
        <FolderOpenOutlined />
        {` 제품 - Parts`}
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
              defaultValue={series}
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
    </Wrapper>
  );
};

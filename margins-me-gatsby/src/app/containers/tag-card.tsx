import React, { Fragment, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Descriptions, Button, Typography, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { Loading } from '../components';
// import { PublicationFormModal } from './publication-form-modal';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Link } from 'gatsby';
import {
  GetTagByTagIdDocument,
  UpdateTagByTagIdDocument
} from '../__generated__/graphql-types';
import { useDeleteTag } from '../graphql';

const { Text } = Typography;

interface TagCardProps {
  tagId: string,
}

export const TagCard: React.FC<TagCardProps>
   = ({ tagId }) => {

  const [ isEditing, setIsEditing ] = useState(false);
  const [ confirmDelete, setConfirmDelete ] = useState(false);
  const [ updateTagLoading, setUpdateTagLoading ] = useState(false);
  const [ form ] = Form.useForm();
  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(
    GetTagByTagIdDocument,
    {
      variables: {
        tagId
      }
    }
  );

  const [ updateTag ] = useMutation(UpdateTagByTagIdDocument);
  const [ deleteTag ] = useDeleteTag();

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving tag data</p>


  const tag = data.tagByTagId;

  if (tag == null) return <p>Error in Tag Data</p>;

  const onOk = async () => {
    setUpdateTagLoading(true);
    const values = await form.validateFields();
    console.log('edit tags modal values:\n', values);
    const updateRes = await updateTag({
      variables: {
        tagId: tag.tagId,
        tagPatch: {
          tagName: values.tagName
        }
      }
    });
    console.log('update tag response', updateRes);
    setUpdateTagLoading(false);
    setIsEditing(false);
  }

  return (
    <Fragment>
      <Modal
        title="Edit Tag"
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={onOk}
        confirmLoading={updateTagLoading}
      >
        <Form
          layout="vertical"
          initialValues={{
            tagName: tag.tagName
          }}
          form={form}
        >
          <Form.Item label="Tag Name" name="tagName" required={true}
          rules={[
            {
              type: "string",
              min: 1
            }
          ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={confirmDelete}
        title="Confirm Delete"
        okText="Delete"
        okButtonProps={{danger: true}}
        onOk={() => {
          deleteTag({ variables: { tagId: tag.tagId }})
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
        >
          Are you sure you want to delete this tag?
       </Modal>
      <Card
      title={tag.tagName}
      extra={[
        <Button key="Edit" icon={<EditOutlined />} size="small" shape="circle" type="link"
          onClick={() => setIsEditing(!isEditing)}
        />,
        <Button key="Delete" icon={<DeleteOutlined />} size="small" shape="circle" type="link"
          onClick={() => setConfirmDelete(true)}
        />,
      ]}
      // css={{
      //   width: width
      // }}
      size="small"
    >
      <div css={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        // margin: '0px -5px'
      }}>
        <Link to={`/app/annotations/tag/${tagId}`}>
          <Text strong={true}>Annotations: </Text>View {tag.annotationTagsByTagId.totalCount} <FileTextOutlined/>
        </Link>
      </div>
    </Card>
    </Fragment>
  )
}

export default TagCard;

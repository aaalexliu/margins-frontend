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
  GetAuthorAndChildPublicationsDocument,
  UpdateAuthorByAuthorIdDocument
} from '../__generated__/graphql-types';
import { useDeleteAuthor } from '../graphql';

const { Text, Paragraph } = Typography;

interface AuthorCardProps {
  id: string,
  authorId?: string
}

export const AuthorCard: React.FC<AuthorCardProps>
   = ({ id, authorId }) => {

  const [ isEditing, setIsEditing ] = useState(false);
  const [ confirmDelete, setConfirmDelete ] = useState(false);
  const [ updateAuthorLoading, setUpdateAuthorLoading ] = useState(false);
  const [ form ] = Form.useForm();

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery(
    GetAuthorAndChildPublicationsDocument,
    {
      variables: {
        id
      }
    }
  );

  const [ updateAuthor ] = useMutation(UpdateAuthorByAuthorIdDocument);
  const [ deleteAuthor ] = useDeleteAuthor();

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving author data</p>


  const author = data.author;

  if (author == null) return <p>Error in Author Data</p>;

  const onOk = async () => {
    setUpdateAuthorLoading(true);
    const values = await form.validateFields();
    console.log('edit tags modal values:\n', values);
    const updateRes = await updateAuthor({
      variables: {
        authorId: author.authorId,
        authorPatch: {
          fullName: values.fullName
        }
      }
    });
    console.log('update author response', updateRes);
    setUpdateAuthorLoading(false);
    setIsEditing(false);
  }

  return (
    <Fragment>
      <Modal
        title="Edit Author"
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={onOk}
        confirmLoading={updateAuthorLoading}
      >
        <Form
          layout="vertical"
          initialValues={{
            fullName: author.fullName
          }}
          form={form}
        >
          <Form.Item label="Full Name" name="fullName" required={true}
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
          deleteAuthor({ variables: { authorId: author.authorId }})
          setConfirmDelete(false);
        }}
        onCancel={() => setConfirmDelete(false)}
        >
          Are you sure you want to delete this Author?
       </Modal>
      <Card
      title={author.fullName}
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
        <Paragraph
          ellipsis={{
            rows: 4,
            expandable: true,
            symbol: 'All'
          }}
        >
          <Text strong={true}>
          Publications {
          author.publicationAuthorsByAuthorId.totalCount ?
          `(${author.publicationAuthorsByAuthorId.totalCount})` :
          ''}:
          </Text>
          <br/>
          {
            author.publicationAuthorsByAuthorId.nodes.map(pubNode => {
              if (pubNode == null) return;
              const publication = pubNode.publicationByPublicationId;
              if (publication == null) return;

              return (
              <Fragment>
                <Link key={publication.publicationId}
                  to={`/app/annotations/publication/${publication.publicationId}`}
                >
                  {publication.title}
                </Link>
                <br/>
              </Fragment>
              )
            })
          }
        </Paragraph>
      </div>
    </Card>
    </Fragment>
  )
}

export default AuthorCard;

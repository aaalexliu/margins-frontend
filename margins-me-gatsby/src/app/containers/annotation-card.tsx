import React, { Fragment, useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Link } from 'gatsby';
import { Card, Divider, Typography, Input, Button, Modal, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Loading, AnnotationForm } from '../components';
import {
  extractAnnotationAll,
  extractPublicationAuthorAnnotationCount
} from '../graphql/fragments';
import { generateObjectId, getAccountId } from '../utils';
import {
  GetAnnotationDocument,
  DeleteAnnotationDocument,
  UpdateAnnotationDocument,
  GetAnnotationAndPublicationDocument
} from '../__generated__/graphql-types';
import styled from '@emotion/styled';
import { AnnotationTags } from './annotation-tags';

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ColoredQuote = styled.blockquote`
  // margin:50px auto;
  // padding:1.2em 30px 1.2em 75px;
  padding-left: 10px;
  border-left:4px solid;
  border-color: ${props => props.color ? props.color : 'grey'};
`;

function isOrphanNote(highlightText: any, noteText: any): boolean {
  if (!highlightText && noteText) return true;
  return false;
}

function stringifyLocation(location: any) {
  if (location === undefined ) return null;
  const locationArr: string[] = [];
  console.log(location);
  if (location.section !== undefined) locationArr.push(location.section);
  if (location.chapter !== undefined) locationArr.push(location.chapter);
  if (location.page !== undefined) locationArr.push(`Page: ${location.page}`);
  if (location.kindleLocation !== undefined) locationArr.push(`Kindle Location: ${location.kindleLocation}`);
  return {
    fullLocation: locationArr.slice(0, -1).join(' - '),
    suffixLocation: ` - ${locationArr.slice(-1)}`
  }
}

// export const GET_ANNOTATION_BY_ANNOTATION_ID = gql`
//   query GetAnnotationByAnnotationId($annotationId: String!) {
//     annotationByAnnotationId(annotationId: $annotationId) {
//       ...AnnotationAll
//     }
//   }
//   ${ANNOTATION_ALL_FRAGMENT}
// `;

export const GET_ANNOTATION = gql`
  query GetAnnotation($id: ID!) {
    annotation(id: $id) {
      ...AnnotationAll
    }
  }
`;

interface AnnotationContentProps {
  id: string
}

export const AnnotationContent: React.FC<AnnotationContentProps>
  = ({ id })  => {

  const {
    data,
    loading,
    error,
  } = useQuery(GetAnnotationDocument,
    {
      variables: {
        id
      },
      // used to test why cache wasn't hitting.
      // fetchPolicy: 'cache-only',
      fetchPolicy: "cache-first",
    },
  );

  const [ isEditing, setIsEditing ] = useState(false);
  const [ updateLoading, setUpdateLoading ] = useState(false);
  const [ form ] = Form.useForm();
  const [ confirmDelete, setConfirmDelete ] = useState(false);

  const [ updateAnnotation ] = useMutation(UpdateAnnotationDocument);

  const [ deleteAnnotation ] = useMutation(DeleteAnnotationDocument,
    {
      update(cache, { data }) {
        console.log('delete annotation data', data);
        const deletedAnnotationId = data?.deleteAnnotationByAnnotationId?.annotation?.annotationId;
        cache.modify({
          fields: {
            allAnnotations(currentAllAnnotations, { readField, storeFieldName }) {
              let {edges} = currentAllAnnotations;
              console.log('existingAnnotationEdges:\n', edges);
              console.log('storeFieldName', storeFieldName);
              let newEdges =  edges.filter((annotationEdge: any) => {
                console.log('read field:\n', readField('annotationId', annotationEdge.node))
                return deletedAnnotationId !== readField('annotationId', annotationEdge.node)
              });
              return {
                ...currentAllAnnotations,
                totalCount: currentAllAnnotations.totalCount - 1,
                edges: newEdges
              }
            }
          }
        })
      }
    });

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving annotation data</p>

  const annotation = data.annotation !== null ?
    data.annotation :
    null;
  if (annotation == null) return <p>No Annotation Exists</p>
  
  const {
    annotationId,
    color,
    createdAt,
    editedHighlightText,
    extraEdits,
    highlightLocation,
    highlightText,
    noteLocation,
    noteText,
    publicationId,
    recordedAt,
    updatedAt,
    tags
  } = extractAnnotationAll(annotation);

  const onDelete = async () => {
    console.log('delete meee');
    setConfirmDelete(true);
  }

  const onSubmitEdit = async () => {
    setUpdateLoading(true);
    const values = await form.validateFields();
    console.log('update annotation values:\n', values);
    try {
      const updateResponse = await updateAnnotation({
        variables: {
          inputAnnotation: {
            id,
            annotationPatch: {
              ...values,
              highlightLocation: JSON.stringify(values.highlightLocation)
            }
          }
        }
      });
    } finally {
      setIsEditing(false);
      setUpdateLoading(false);
    }
  }

  console.log(`${highlightText} tags:`, tags);

  const notOrphanNote = !isOrphanNote(highlightText, noteText);

  const cardTitle = <Text>{notOrphanNote ? 'Highlight' : 'Note'}</Text>;
  // const cardTitle = <Title level={6}>{notOrphanNote ? 'Highlight' : 'Note'}</Title>;


  let annotationLocation = notOrphanNote ? stringifyLocation(highlightLocation): stringifyLocation(noteLocation)
  const cardLocation = annotationLocation ?
    <Paragraph type="secondary"
      ellipsis={{
        rows: 1,
        expandable: true,
        symbol: '..full',
        suffix: annotationLocation.suffixLocation
      }}
    >
     {annotationLocation.fullLocation}
    </Paragraph>
    :
    null;
  // const cardDescription = notOrphanNote ? stringifyLocation(highlightLocation) : stringifyLocation(noteLocation);

  const NoteDivider = ((notOrphanNote && noteText) || (notOrphanNote && isEditing)) ?
    <Divider orientation="left" plain={true}>{`Note`}</Divider>:
    null;

  let cardQuote = editedHighlightText ? editedHighlightText : highlightText;
  let cardNote = noteText;

  const displayAnnotation =
  <Fragment>
    {/* {cardLocation} */}
      {cardQuote &&
      <ColoredQuote color={color ? color : undefined}>
        {cardQuote}
      </ColoredQuote>}
      {NoteDivider}
      {cardNote}
      <AnnotationTags annotationId={annotationId} tags={tags}/>
  </Fragment>;

  return (
  <Fragment>
    <Modal
      visible={confirmDelete}
      title="Confirm Delete"
      okText="Delete"
      okButtonProps={{danger: true}}
      onOk={() => deleteAnnotation({ variables: { annotationId }})}
      onCancel={() => setConfirmDelete(false)}
      >
        Are you sure you want to delete this annotation?
    </Modal>
      
    <div
      css={{
        display: 'flex',
        flexWrap: 'nowrap'
      }}
    >
      <div css={{
        flexGrow: 1
      }}>
      {cardLocation}
      </div>
      <div
        css={{
          marginLeft: '5px',
          display: 'flex'
        }}
      >
        <Button key="Edit" icon={<EditOutlined />} size="small" shape="circle" type="link"
          onClick={() => setIsEditing(!isEditing)}
        />
        <Button key="Delete" icon={<DeleteOutlined />} size="small" shape="circle" type="link"
          onClick={onDelete}
        />
      </div>
    </div>

    {isEditing ?
    <Fragment>
      <AnnotationForm form={form}
        initialValues={{
          ...annotation,
          highlightLocation
        }}
      />
      <div css={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <Button type="primary"
          onClick={onSubmitEdit}
          loading={updateLoading}
        >Submit</Button>
        <Button
          onClick={() => setIsEditing(false)}
          css={{
            marginLeft: '5px'
          }}
          disabled={updateLoading}
        >
          Cancel</Button>
      </div>
    </Fragment>
      : displayAnnotation
    }
  </Fragment>
  )
}

interface AnnotationCardProps {
  id: string
}

const AnnotationCard: React.FC<AnnotationCardProps>
  = ({ id }) => {

  return (
    <Card
      // title={cardTitle}
      // extra={[
      //   <Button key="Edit" icon={<EditOutlined />} size="small" shape="circle" type="link"
      //     onClick={() => setIsEditing(!isEditing)}
      //   />,
      //   <Button key="Delete" icon={<DeleteOutlined />} size="small" shape="circle" type="link"
      //     onClick={onDelete}
      //   />,
      // ]}
      size="small"
      bodyStyle={{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px'
      }}
    >
      <AnnotationContent id={id}/>
    </Card>
  )
}

export const AnnotationAndPublicationCard: React.FC<AnnotationCardProps> 
  = ({ id }) => {

  const { data, loading, error } = useQuery(GetAnnotationAndPublicationDocument, 
    {
      variables: {
        id
      }
    });

  if (loading) return <Loading />;

  const annotation = data?.annotation;
  if (error || !annotation) return <p>Error in retrieving annotation data</p>
  
  const annotationPublication = annotation.publicationByPublicationId;
  let publicationTitle = null;
  if (annotationPublication) {
    const {
      publicationId,
      title,
      authorNames,
      authors
    } = extractPublicationAuthorAnnotationCount(annotationPublication);
    publicationTitle =
    <div>
      <Link to={`/app/annotations/publication/${publicationId}`}>
          <strong>{title}</strong>
        </Link>
        <br />
        <Text type="secondary">
          By: {authorNames}
        </Text>
        <Divider css={{
          margin: '5px 0px 10px'
        }}/>
    </div>
  }

  return (
    <Card
      size="small"
      bodyStyle={{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px'
      }}
    >
      {publicationTitle}
      <AnnotationContent id={annotation.id}/>
    </Card>
  )
}

export default AnnotationCard;
import React, { Fragment, useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { generateObjectId } from '../utils/object-id';
import { getAccountId } from '../utils/account-id';
import { Card, Divider, Typography, Tag, Select } from 'antd';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import { Loading } from '../components';
import {
  ANNOTATION_ALL_FRAGMENT,
  extractAnnotationAll
} from '../utils/annotation-all'
import { GET_ALL_TAGS } from '../utils/get-all-tags';
import * as GetAllTagsTypes from '../utils/__generated__/GetAllTags';
// import * as GetAnnotationByAnnotationIdTypes from './__generated__/GetAnnotationByAnnotationId';
import * as GetAnnotationTypes from './__generated__/GetAnnotation';
import * as DeleteAnnotationTagTypes from './__generated__/DeleteAnnotationTag';
import * as AddTagToAnnotationTypes from './__generated__/AddTagToAnnotation';
import * as CreateTagAndAddToAnnotationTypes from './__generated__/CreateTagAndAddToAnnotation';
import * as DeleteTagTypes from './__generated__/DeleteTag';
import styled from '@emotion/styled';

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

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

function stringifyLocation(location: any): string {
  if (location === undefined ) return '';
  const locationArr: string[] = [];
  if (location.chapter !== undefined) locationArr.push(location.chapter);
  if (location.page !== undefined) locationArr.push(`Page: ${location.page}`);
  if (location.kindleLocation !== undefined) locationArr.push(`Kindle Location: ${location.kindleLocation}`);
  return locationArr.join(' - ');
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
  ${ANNOTATION_ALL_FRAGMENT}
`;

export const ADD_TAG_TO_ANNOTATION = gql`
  mutation AddTagToAnnotation($annotationId: String!, $tagId: String!) {
    createAnnotationTag(
      input: {
        annotationTag: {
          annotationId: $annotationId
          tagId: $tagId
        }
      }) {
      annotationByAnnotationId {
        ...AnnotationAll
      }
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`

export const CREATE_AND_ADD_TAG_TO_ANNOTATION = gql`
  mutation CreateTagAndAddToAnnotation(
    $tagId: String!
    $tagName: String!
    $annotationId: String!
    $accountId: UUID!
  ) {
    __typename
    createTag(
      input: {
        tag: {
          tagId: $tagId
          tagName: $tagName
          annotationTagsUsingTagId: { create: { annotationId: $annotationId } }
          accountId: $accountId
        }
      }
    ) {
      tag {
        id
        tagId
        tagName
      }
      query {
        annotationByAnnotationId(annotationId: $annotationId) {
          ...AnnotationAll
        }
      }
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`

export const DELETE_ANNOTATION_TAG = gql`
  mutation DeleteAnnotationTag($annotationId: String!, $tagId: String!) {
    __typename
    deleteAnnotationTagByAnnotationIdAndTagId(input: {annotationId: $annotationId, tagId: $tagId}) {
      tagByTagId {
        annotationTagsByTagId {
          totalCount
        }
        tagId
        tagName
        id
      }
      annotationByAnnotationId {
        ...AnnotationAll
      }
    }
  }
  ${ANNOTATION_ALL_FRAGMENT}
`

export const DELETE_TAG = gql`
  mutation DeleteTag($tagId: String!) {
    __typename
    deleteTagByTagId(input: {tagId: $tagId}) {
      deletedTagId
    }
  }
`

interface AnnotationCardProps {
  id: string
}

function AnnotationTag({annotationId, tag}) {
  const [deleteAnnotationTag, { error: deleteError, loading: deleteLoading }] = useMutation<
    DeleteAnnotationTagTypes.DeleteAnnotationTag,
    DeleteAnnotationTagTypes.DeleteAnnotationTagVariables
    >(DELETE_ANNOTATION_TAG);

  const [deleteTag] = useMutation<
    DeleteTagTypes.DeleteTag,
    DeleteTagTypes.DeleteTagVariables
  >(DELETE_TAG,{
    update(cache, { data }) {
      console.log('delete tag data: ', data);
      const deletedTagId = data?.deleteTagByTagId?.deletedTagId;
      cache.modify({
        fields: {
          allTags({nodes: existingTagRefs}, { readField }) {
            console.log(existingTagRefs);
            return existingTagRefs.filter((tagRef: any) => deletedTagId !== readField('tagId', tagRef)
            );
          },
        },
      });
    }
  })

  const onCloseHandler = async () => {
    const { data } = await deleteAnnotationTag({variables: {
      annotationId,
      tagId: tag.tagId
    }});
    console.log(data);
    let tagAnnotationCount = data?.deleteAnnotationTagByAnnotationIdAndTagId?.tagByTagId?.annotationTagsByTagId.totalCount;
    console.log(`tag has ${tagAnnotationCount} annotations left`);
    if (tagAnnotationCount === 0) {
      await deleteTag({variables: { tagId: tag.tagId}});
      console.log('deleted tag:', tag);
    }
    if (deleteError) console.log('error with deleting tag', deleteError);
  }

    return (
    <Tag
      closable={true}
      onClose={onCloseHandler}
      icon={deleteLoading ? <SyncOutlined spin /> : null}
    >
        {tag.tagName}
    </Tag>
    )

}

function AnnotationCardTags({annotationId, tags}) {
  // console.log('current tags\n', tags);
  const { data: allTagsData, loading: allTagsLoading } = useQuery<
    GetAllTagsTypes.GetAllTags
  >(GET_ALL_TAGS,
    {
      //just to test if it's reading from cache
      // fetchPolicy: "cache-only"  
    });

  const [addAnnotationTag, { data: addTagData, loading: addTagLoading}] = useMutation<
    AddTagToAnnotationTypes.AddTagToAnnotation,
    AddTagToAnnotationTypes.AddTagToAnnotationVariables
  >(ADD_TAG_TO_ANNOTATION);

  const [createAndAddTag, { data: createAndAddData, loading: createAndAddLoading }] = useMutation<
    CreateTagAndAddToAnnotationTypes.CreateTagAndAddToAnnotation,
    CreateTagAndAddToAnnotationTypes.CreateTagAndAddToAnnotationVariables
  >(CREATE_AND_ADD_TAG_TO_ANNOTATION);

  const [ inputValue, setInputValue ] = useState('');
  // const [ addTagLoading, setAddTagLoading ] = useState(false);

  let tagNodes = allTagsData?.allTags?.nodes;
  let availableTags: {label: string, value: string}[] = [];
  if (tagNodes != null) {
    let otherTags = tagNodes.filter(choiceTag => {
      if (choiceTag == null ) return false;
      let matchedTag = tags.filter(tag => tag.tagId === choiceTag.tagId).length > 0;
      return !matchedTag;
    })
    // console.log(tagNodes);
    availableTags = otherTags.flatMap(tag => tag ? [{label: tag.tagName, value: tag.tagId}] : []);
  }

  const [ tagOptions, setTagOptions] = useState(availableTags);

  if (!Array.isArray(tags) || tags.length === 0) return null;


  const onSelect = async (_: string, option: any) => {
    console.log('onSelect', option);
    // setAddTagLoading(true);
    if (option.value.startsWith('CREATE:')) {
      const createTagName = option.value.substring(7);
      console.log('create tag:', createTagName);
      await createAndAddTag({
        variables: {
          annotationId,
          tagId: generateObjectId(),
          tagName: createTagName,
          accountId: getAccountId()
        }
      });

    } else {
      const tagId = option.value;
      await addAnnotationTag({variables: {annotationId, tagId}});
      console.log('add tag executed');
    }
    setInputValue('');
  };
  const onChange = (data: string) => {
    console.log('onChange', data);
    setInputValue(data);
  };
  const onBlur = () => {
    console.log('blurred');
  }
  const onSearch = (data: string) => {
    console.log('onSearch:', data);
    if (tagOptions.filter(option => option.value === data).length > 0) {
      console.log('option exists, not adding create option');
      return;
    }
    setTagOptions([...availableTags, {label: `Create: ${data}`, value: `CREATE:${data}`}])
  }

  const filterOption = (inputValue: string, option: any) => {
    let re = new RegExp(inputValue, 'i');
    console.log(`testing ${inputValue} against ${option.label} result ${re.test(option.label)}`);
    return re.test(option.label);
  }

  return (
    <div
      css={{
        marginTop: '10px'
      }}
    >
      {tags.map((tag) => {
        //wonky ass bug where key property causes tag to remember state upon re-render.
        // therefore if a user deletes a tag and adds it back, it doesn't show up because it's already
        // been closed. somewhat janky fix to force tag re-render and key uniqueness is date now so new
        // tags have updated key
        return (
          <AnnotationTag
            annotationId={annotationId}
            tag={tag}
            key={tag.tagId + Date.now()}
          />
        )})
      }
      <Select
        options={tagOptions}
        // onChange={onSearch}
        showSearch={true}
        onSelect={onSelect}
        
        style={{width: 200}}
        filterOption={filterOption}
        onSearch={onSearch}
        defaultActiveFirstOption={true}
        onBlur={onBlur}
        value={inputValue}
        loading={addTagLoading || createAndAddLoading}
      />
    </div>
  )
}

const AnnotationCard: React.FC<AnnotationCardProps>
  = ({ id }) => {
  

  const {
    data,
    loading,
    error,
  } = useQuery<
  GetAnnotationTypes.GetAnnotation,
  GetAnnotationTypes.GetAnnotationVariables
  >(
  GET_ANNOTATION,
    {
      variables: {
        id
      },
      // used to test why cache wasn't hitting.
      // fetchPolicy: 'cache-only',
      fetchPolicy: "cache-first",
    },
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>Error in retrieving annotation data</p>

  const annotation = data.annotation !== null ?
    data.annotation :
    null;
  if (annotation === null) return <p>No Annotation Exists</p>
  
  const {
    annotationId,
    color,
    createdAt,
    editedHighlightText,
    editedNoteText,
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

  console.log(`${highlightText} tags:`, tags);

  const notOrphanNote = !isOrphanNote(highlightText, noteText);

  const cardTitle = <Text strong={true}>{notOrphanNote ? 'Highlight' : 'Note'}</Text>;

  const cardLocation = 
    <Paragraph type="secondary" ellipsis={{ rows: 1, expandable: true, symbol: '..more' }}>
      {notOrphanNote ? stringifyLocation(highlightLocation): stringifyLocation(noteLocation)}
    </Paragraph>
  // const cardDescription = notOrphanNote ? stringifyLocation(highlightLocation) : stringifyLocation(noteLocation);

  const NoteDivider = notOrphanNote && noteText ?
    <Divider orientation="left" plain={true}>{`Note`}</Divider>:
    null;

  return (
    <Card
      // title={cardTitle}
      actions={[
        <EditOutlined key="edit"/>,
      ]}
      size="default"
    >
      {cardTitle}
      {cardLocation}
      {highlightText &&
      <ColoredQuote color={color ? color : undefined}>
        {highlightText}
      </ColoredQuote>}
      {NoteDivider}
      {noteText}
      <AnnotationCardTags annotationId={annotationId} tags={tags}/>
    </Card>
  )
}

export default AnnotationCard;
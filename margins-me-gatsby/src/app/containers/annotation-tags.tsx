import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { generateObjectId } from '../utils/object-id';
import { getAccountId } from '../utils/account-id';
import { Card, Divider, Typography, Tag, Select, Button } from 'antd';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import { Loading } from '../components';
import {
  GetAllTagsDocument,
  AddTagToAnnotationDocument,
  CreateTagAndAddToAnnotationDocument,
  TagInput,
  DeleteTagDocument,
  DeleteAnnotationTagDocument
} from '../__generated__/graphql-types';

interface AnnotationTagProps {
  annotationId: string,
  tag: TagInput
}

export function AnnotationTag({annotationId, tag}: AnnotationTagProps) {
  const [deleteAnnotationTag, { error: deleteError, loading: deleteLoading }] =
  useMutation(DeleteAnnotationTagDocument);

  const [deleteTag] = useMutation(DeleteTagDocument,
  {
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
  });

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

interface AnnotationCardTagsProps {
  annotationId: string,
  tags: TagInput[]
}

export function AnnotationCardTags({annotationId, tags}: AnnotationCardTagsProps) {
  // console.log('current tags\n', tags);
  const { data: allTagsData, loading: allTagsLoading } = useQuery(
    GetAllTagsDocument,
    {
      //just to test if it's reading from cache
      // fetchPolicy: "cache-only"  
    });

  const [addAnnotationTag, { data: addTagData, loading: addTagLoading}] = 
    useMutation(AddTagToAnnotationDocument);

  const [createAndAddTag, { data: createAndAddData, loading: createAndAddLoading }] =
    useMutation(CreateTagAndAddToAnnotationDocument);

  const [ inputValue, setInputValue ] = useState('');
  const [ addTagMode, setAddTagMode ] = useState(false);
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
    setAddTagMode(false);
  }
  const onSearch = (data: string) => {
    console.log('onSearch:', data);
    if (tagOptions.filter(option => option.value === data).length > 0) {
      console.log('option exists, not adding create option');
      return;
    }
    if (tags.filter(tag => tag.tagName === data).length > 0) {
      console.log('tag already added to annotation, not adding create option');
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
        marginTop: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline'
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
      <div
        css={{
          marginTop: '5px'
        }}
      >
        {addTagMode ?
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
        /> :
        <Button type="link"
        size="small"
        onClick={() => {setAddTagMode(true)}}>
          Add Tag
        </Button>
        }
      </div>
    </div>
  )
}
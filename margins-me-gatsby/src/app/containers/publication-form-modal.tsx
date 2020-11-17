import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Select, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { LabeledValue } from 'antd/lib/select';
import { Rule } from 'antd/lib/form';
import { useQuery, useMutation } from '@apollo/client';
import { generateObjectId } from '../utils/object-id';
import { getAccountId } from '../utils/account-id';
import {
  GetAllAuthorsDocument,
  Author,
  AddAuthorToPublicationDocument,
  CreateAuthorAndAddToPublicationDocument,
  DeletePublicationAuthorDocument
} from '../__generated__/graphql-types';
import Modal from 'antd/lib/modal/Modal';
import { Loading } from '../components';

const { TextArea } = Input;

interface PublicationFormModalProps {
  // form: any,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  initialValues: {
    publicationId: string,
    title: string,
    authors: Pick<Author, 'authorId' | 'fullName' | 'id'>[]
  }
}

export const PublicationFormModal: React.FC<PublicationFormModalProps> =
  ({ visible, setVisible, initialValues }) => {

  // const textValidator: Rule = ({ getFieldValue }) => ({
  //   validator(_, __) {
  //     const highlightText = getFieldValue('highlightText');
  //     const noteText = getFieldValue('noteText');
  //     if (!noteText && !highlightText) {
  //       return Promise.reject('Either Highlight or Note must have text')
  //     }
  //     return Promise.resolve();
  //   },
  // });

  const { publicationId } = initialValues;

  const {
    data: authorsData,
    loading: authorsLoading
  } = useQuery(GetAllAuthorsDocument);

  let authorNodes = authorsData?.allAuthors?.nodes;
  let availableAuthors: LabeledValue[] = [];
  if (authorNodes != null ) {
    // let otherAuthors = authorNodes.filter(authorNode => {
    //   if (authorNode == null ) return false;
    //   let matchedAuthor = currentAuthors.filter(currentAuthor => {
    //     return currentAuthor.authorId === authorNode.authorId
    //   }).length > 0;
    //   return !matchedAuthor
    // });

    // availableAuthors = otherAuthors
    //   .flatMap(author => author ? [{label: author.fullName, value: author.authorId}]: []);
    availableAuthors = authorNodes
      .flatMap(author => author ? [{label: author.fullName, value: author.authorId}]: []);
  }

  const [form] = Form.useForm();
  const [ authorInput, setAuthorInput ] = useState('');
  const [ authorOptions, setAuthorOptions ] = useState<LabeledValue[]>(availableAuthors);
  console.log('authorOptions', authorOptions);


  const [ addAuthorToPublication ] = useMutation(AddAuthorToPublicationDocument);

  const [ createAndAddAuthor ] = useMutation(CreateAuthorAndAddToPublicationDocument, {
    update(cache, { data }) {
    console.log('add author data: ', data);
      const createdAuthor = data?.createAuthor?.author;
      const allAuthorsData = cache.readQuery({ query: GetAllAuthorsDocument});
      if (createdAuthor && allAuthorsData?.allAuthors?.nodes) {
        cache.writeQuery({
          query: GetAllAuthorsDocument,
          data: {
            allAuthors: {
              nodes: [...allAuthorsData.allAuthors.nodes, createdAuthor]
            }
          }
        })
      }
    }
  });

  const [ deleteAuthorFromPublication ] = useMutation(DeletePublicationAuthorDocument);

  //BREAK IF LOADING
  console.log('authorsloading', authorsLoading);
  if(authorsLoading) return <Loading />;

  const currentAuthors: Pick<Author, 'authorId' | 'fullName' | 'id'>[] =
    initialValues.authors ? initialValues.authors : [];

  const authorSelectDefaultValues: LabeledValue[] = currentAuthors.map(author => {
    return {
      label: author.fullName,
      value: author.authorId,
    }
  });

  console.log('authorSelectDefaultValues: ', authorSelectDefaultValues);


  const onSelect = async (value: any, option: any) => {
    // console.log('onselect value ', value);
    console.log('onSelect option', option);
    if (option.value.startsWith('CREATE:')) {
      const createAuthorName = option.value.substring(7);
      console.log('create author: ', createAuthorName);
      await createAndAddAuthor({
        variables: {
          authorId: generateObjectId(),
          fullName: createAuthorName,
          accountId: getAccountId(),
          publicationId
        }
      });
    } else {
      const authorId = option.value;
      await addAuthorToPublication({variables: {authorId, publicationId}});
      console.log('add author executed');
    }
    // setInputValue('');
  }

  const onSearch = (data: string) => {
    console.log('onSearch:', data);
    if (authorOptions.filter(option => option.label === data).length > 0) {
      console.log('option exists, not adding create option');
      return;
    }

    setAuthorOptions([...availableAuthors, {label: `Create: ${data}`, value: `CREATE:${data}`}])
  }

  const onDeselect = async (value: any, option: any) => {
    console.log('onDeselect:', option);
    const authorId = option.value;
    const deleteRes = await deleteAuthorFromPublication({
      variables: {
        authorId,
        publicationId
      }
    });
    console.log('delete Author from publication', deleteRes);
  }

  const onOk = async () => {
    setVisible(false);
    const values = await form.validateFields();
    console.log(values);
  }

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={onOk}
    >
      <Form
        layout="vertical"
        // onFinish={onFinish}
        form={form}
        initialValues={initialValues}
      >
        <Form.Item label="Title" name="title"
          rules={[
            {
              type: "string",
              min: 1
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Author(s)"
          // rules={[
          // ]}
        >
            <Select
            // loading={authorsLoading}
            mode="multiple"
            // a somewhat janky fix to make sure that authorOptions are available at first load,
            // so that default values work. the problem is that authorOptions is at first initiated
            // with an empty array because useState can't be called after data loads, all useState
            // hooks must be in the same order after every render. Need this useState because I 
            // add the create option dynamically with user input, but that isn't set after the user
            // performs a search, so right now a janky if statement to only load stateful authorOptions
            // after a search is performed
            options={authorOptions.length === 0 ? availableAuthors : authorOptions}
            onSelect={onSelect}
            onDeselect={onDeselect}
            onSearch={onSearch}
            optionFilterProp="label"
            defaultValue={authorSelectDefaultValues.map(author => author.value)}
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <Input style={{ flex: 'auto' }}
                  // value={name} onChange={this.onNameChange}
                  />
                  <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    // onClick={this.addItem}
                  >
                    <PlusOutlined /> Add Author
                  </a>
                </div>
              </div>
            )}
          />
        </Form.Item>
        {/* <Form.Item >
          <Button type="primary" htmlType="submit">
            Submit</Button>
        </Form.Item> */}
      </Form>
    </Modal>
  )
}

export default PublicationFormModal;
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
  DeletePublicationAuthorDocument,
  DeleteAuthorDocument,
  UpdatePublicationDocument
} from '../__generated__/graphql-types';
import Modal from 'antd/lib/modal/Modal';
import { Loading } from '../components';

const { TextArea, Search } = Input;

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
  const [form] = Form.useForm();
  const [ addAuthorLoading, setAddAuthorLoading ] = useState(false);
  const [ updatePublicationLoading, setUpdatePublicationLoading ] = useState(false);

  const [ updatePublication ]  = useMutation(UpdatePublicationDocument);

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

  const [ deleteAuthor ] = useMutation(DeleteAuthorDocument, {
    update(cache, { data }) {
      console.log('delete author data: ', data);
      const deletedAuthorId = data?.deleteAuthorByAuthorId?.author?.authorId;
      cache.modify({
        fields: {
          allAuthors(allAuthorsConnection, { readField }) {
            let { nodes } = allAuthorsConnection;
            console.log('current author nodes\n', nodes);
            let newNodes = nodes.filter((authorRef: any) => deletedAuthorId !== readField('authorId', authorRef));
            return {
              ...allAuthorsConnection,
              nodes: newNodes
            };
          }
        },
      });
    }
  });

  const {
    data: authorsData,
    loading: authorsLoading
  } = useQuery(GetAllAuthorsDocument);

  let authorNodes = authorsData?.allAuthors?.nodes;
  let availableAuthors: LabeledValue[] = [];
  if (authorNodes != null ) {
    availableAuthors = authorNodes
      .flatMap(author => author ? [{label: author.fullName, value: author.authorId}]: []);
  }

  const currentAuthors: Pick<Author, 'authorId' | 'fullName' | 'id'>[] =
  initialValues.authors ? initialValues.authors : [];

  const [ currentAuthorsValue, setCurrentAuthorsValue ] = useState(currentAuthors.map(author => author.authorId));
  console.log('current Author Values: ', currentAuthorsValue);

    //BREAK IF LOADING
  console.log('authorsloading', authorsLoading);
  if(authorsLoading) return <Loading />;

  const onSelect = async (value: any, option: any) => {
    // console.log('onselect value ', value);
    console.log('onSelect option', option);
    const authorId = option.value;
    setCurrentAuthorsValue([...currentAuthorsValue, authorId]);
    await addAuthorToPublication({variables: {authorId, publicationId}});
    console.log('add author executed');
  }

  const onAddAuthor = async(value: any) => {
    setAddAuthorLoading(true);
    console.log('add author value:', value);
    if (value == null) return;
    const createAuthorName = value;
    console.log('create author: ', createAuthorName);
    const authorId = generateObjectId();
    await createAndAddAuthor({
      variables: {
        authorId,
        fullName: createAuthorName,
        accountId: getAccountId(),
        publicationId
      }
    });
    setCurrentAuthorsValue([...currentAuthorsValue, authorId]);
    setAddAuthorLoading(false);
  }

  // const onSearch = (data: string) => {
  //   console.log('onSearch:', data);
  //   if (authorOptions.filter(option => option.label === data).length > 0) {
  //     console.log('option exists, not adding create option');
  //     return;
  //   }

  //   setAuthorOptions([...availableAuthors, {label: `Create: ${data}`, value: `CREATE:${data}`}])
  // }

  const onDeselect = async (value: any, option: any) => {
    console.log('onDeselect:', option);
    const authorId = option.value;
    setCurrentAuthorsValue(
      currentAuthorsValue.filter(id => id !== authorId)
    );
    const deletePublicationAuthorRes = await deleteAuthorFromPublication({
      variables: {
        authorId,
        publicationId
      }
    });
    console.log('delete Author from publication', deletePublicationAuthorRes);
    const deletedAuthor = 
      deletePublicationAuthorRes.data?.deletePublicationAuthorByPublicationIdAndAuthorId?.authorByAuthorId;
    if (deletedAuthor && deletedAuthor.publicationAuthorsByAuthorId.totalCount === 0) {
      console.log(`author ${deletedAuthor.fullName} has no other publications, deleting`);
      const deleteAuthorRes = await deleteAuthor({
        variables: {
          authorId
        }
      });
      console.log('delete author res\n', deleteAuthorRes);
    }
  }

  const onOk = async () => {
    setUpdatePublicationLoading(true);
    const values = await form.validateFields();
    console.log('edit publication modal values:\n', values);
    
    const updateRes = await updatePublication({
      variables: {
        inputPublication: {
          publicationId,
          publicationPatch: {
            title: values.title
          }
        }
      }
    })
    setVisible(false);
    setUpdatePublicationLoading(false);
  }

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={onOk}
      confirmLoading={updatePublicationLoading}
    >
      <Form
        layout="vertical"
        // onFinish={onFinish}
        form={form}
        initialValues={initialValues}
      >
        <Form.Item label="Title" name="title" required={true}
          rules={[
            {
              type: "string",
              min: 1
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Current Author(s)"
          // rules={[
          // ]}
        >
            <Select
            // loading={authorsLoading}
            mode="multiple"
            options={availableAuthors}
            onSelect={onSelect}
            onDeselect={onDeselect}
            optionFilterProp="label"
            value={currentAuthorsValue}
            // dropdownRender={menu => (
            //   <div>
            //     {menu}
            //     <Divider style={{ margin: '4px 0' }} />
            //     <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            //       <Input style={{ flex: 'auto' }}
            //       onFocus={() => setSelectDeleteDisabled(true)}
            //       onBlur={() => setSelectDeleteDisabled(false)}
            //       value={addAuthorInput} onChange={(event) => {
            //         event.stopPropagation();
            //         event.preventDefault();
            //         setAddAuthorInput(event.target.value)}
            //       }
            //       />
            //       <a
            //         style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
            //         onClick={onAddAuthor}
            //       >
            //         <PlusOutlined /> Add Author
            //       </a>
            //     </div>
            //   </div>
            // )}
          />
        </Form.Item>
        <Form.Item label="Create and Add Author">
           <Search style={{ flex: 'auto' }}
            enterButton="Create Author"
            onSearch={onAddAuthor}
            loading={addAuthorLoading}
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
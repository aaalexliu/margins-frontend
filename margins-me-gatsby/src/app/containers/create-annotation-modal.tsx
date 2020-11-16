import React, {useState} from 'react';
import { Modal, Form } from 'antd';
import { AnnotationForm } from '../components';
import { CreateAnnotationDocument, GetAllAnnotationsForPublicationDocument, CreateAnnotationInput } from '../__generated__/graphql-types'; 
import { gql, useMutation } from '@apollo/client';
import { generateObjectId } from '../utils/object-id';
import { getAccountId } from '../utils/account-id';

interface CreateAnnotationModalProps {
  publicationId: string;
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function createAnnotationInput(values: any, publicationId: string): CreateAnnotationInput {
  const newAnnotation: any = {
    annotationId: generateObjectId(),
    accountId: getAccountId(),
    publicationId,
  }
  console.log(values);

  if (values.location != null) {
    newAnnotation['highlightLocation'] = JSON.stringify(values.location);
  }
  if (values.highlightText != null && values.highlightText != '') {
    newAnnotation['highlightText'] = values.highlightText;
  }
  if (values.noteText != null && values.noteText != '') {
    newAnnotation['noteText'] = values.noteText;
  }
  if (values.color != null) {
    newAnnotation['color'] = values.color
  }
  return {
    annotation: newAnnotation
  };
}

export const CreateAnnotationModal: React.FC<CreateAnnotationModalProps> = ({
  publicationId,
  visible,
  onCreate,
  onCancel,
}) => {
  const [ form ] = Form.useForm();
  const [ confirmLoading, setConfirmLoading ] = useState(false);
  const [ addAnnotation ] = useMutation(CreateAnnotationDocument, {
    update(cache, { data }) {
      const newAnnotationEdge = data?.createAnnotation?.annotationEdge;
      const existingAnnotations = cache.readQuery({
        query: GetAllAnnotationsForPublicationDocument,
        variables: {
          publicationId
        }
      });

      if (newAnnotationEdge && existingAnnotations?.allAnnotations?.edges) {
        cache.writeQuery({
          query: GetAllAnnotationsForPublicationDocument,
          variables: {
            publicationId
          },
          data: {
            allAnnotations: {
              ...existingAnnotations.allAnnotations,
              totalCount: existingAnnotations.allAnnotations.totalCount + 1,
              edges: [...existingAnnotations.allAnnotations.edges, newAnnotationEdge]
            }
          }
        })
      }
    }
  });

  const onModalOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      form.resetFields();
      const { data } = await addAnnotation({
        variables: {
          inputAnnotation: createAnnotationInput(values, publicationId)
        }
      })
      onCreate(data);
    } catch(error) {
      console.log('Validate Failed:', error);
    } finally{
      setConfirmLoading(false);
    } 
  }
  return (
    <Modal
      visible={visible}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      onOk={onModalOk}
    >
      <AnnotationForm form={form} initialValues={{color: 'none'}}/>
    </Modal>
  )
}

export default CreateAnnotationModal;
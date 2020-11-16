import React from 'react';
import { Modal, Form } from 'antd';
import { AnnotationForm } from '../components';
import { CreateAnnotationDocument, GetAllAnnotationsForPublicationDocument } from '../__generated__/graphql-types'; 
import { gql, useMutation } from '@apollo/client';
import { generateObjectId } from '../utils/object-id';
import { getAccountId } from '../utils/account-id';

interface CreateAnnotationModalProps {
  publicationId: string;
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

export const CreateAnnotationModal: React.FC<CreateAnnotationModalProps> = ({
  publicationId,
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
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

      // cache.modify({
      //   fields: {
      //     allAnnotations(existingAnnotationRefs = [], { DELETE }) {
      //       console.log('existingannotationrefs');
      //       console.log(existingAnnotationRefs);
            // return DELETE;
            // const newAnnotationEdge = data?.createAnnotation?.annotationEdge;
            // if (newAnnotationEdge == null) return [...existingAnnotationRefs];

            // const newAnnotationEdgeRef = cache.writeFragment({
            //   data: newAnnotationEdge,
            //   fragment: gql`
            //     fragment NewAnnotationEdge on AnnotationEdge {
            //       cursor
            //       node {
            //         ...AnnotationAll
            //       }
            //     }
            //   `
            // });
            // return [...existingAnnotationRefs, newAnnotationEdgeRef];
            // const newCommentRef = cache.writeFragment({
            //   data: addComment,
            //   fragment: gql`
            //     fragment NewComment on Comment {
            //       id
            //       text
            //     }
            //   `
            // });
            // return [...existingCommentRefs, newCommentRef];
          // }
        // }
      // });
    }
  });
  return (
    <Modal
      visible={visible}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            addAnnotation({
              variables: {
                inputAnnotation: {
                  annotation: {
                    annotationId: generateObjectId(),
                    highlightLocation: JSON.stringify({kindleLocation: 1}),
                    highlightText: 'testCreate1',
                    accountId: getAccountId(),
                    publicationId
                  }
                } 
              }
            })
            onCreate(values);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <AnnotationForm form={form} initialValues={{highlightColor: 'none'}}/>
    </Modal>
  )
}

export default CreateAnnotationModal;
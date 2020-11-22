import { useMutation } from '@apollo/client';
import {
  DeleteAuthorByAuthorIdDocument
} from '../__generated__/graphql-types';


export function useDeleteAuthor() {
  const [ deleteAuthor ] = useMutation(DeleteAuthorByAuthorIdDocument, {
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

  return [ deleteAuthor ];
}
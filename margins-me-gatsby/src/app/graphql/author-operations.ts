import { useMutation } from '@apollo/client';
import {
  DeleteAuthorByAuthorIdDocument
} from '../__generated__/graphql-types';


// ok current cache bug is that deleting an author means that
// cached publications still have the deled author, should probably
// figure out a way to either invalidate publication that the author
// is attached to, or surgically remove in cache.
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
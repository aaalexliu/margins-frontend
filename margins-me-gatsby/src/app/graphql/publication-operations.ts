import { useMutation } from '@apollo/client';
import {
  DeletePublicationByPublicationIdDocument
} from '../__generated__/graphql-types';


// ok current cache bug is that deleting an author means that
// cached publications still have the deled author, should probably
// figure out a way to either invalidate publication that the author
// is attached to, or surgically remove in cache.
export function useDeletePublication() {
  const [ deletePublication ] = useMutation(DeletePublicationByPublicationIdDocument, {
    update(cache, { data }) {
      console.log('delete publication data: ', data);
      const deletedPublicationId = data?.deletePublicationByPublicationId?.publication?.publicationId;
      cache.modify({
        fields: {
          allPublications(currentAllPublications, { readField, storeFieldName }) {
            let { edges } = currentAllPublications;
            console.log('existing Publication Edges:\n', edges);
            console.log('storeFieldName', storeFieldName);
            let newEdges =  edges.filter((publcationEdge: any) => {
              console.log('read field:\n', readField('publicationId', publcationEdge.node))
              return deletedPublicationId !== readField('publicationId', publcationEdge.node)
            });
            return {
              ...currentAllPublications,
              totalCount: currentAllPublications.totalCount - 1,
              edges: newEdges
            }
          }
        },
      });
    }
  });

  return [ deletePublication ];
}
import { useMutation } from '@apollo/client';
import {
  DeleteTagByTagIdDocument
} from '../__generated__/graphql-types';

export function useDeleteTag() {
  const [deleteTag] = useMutation(DeleteTagByTagIdDocument,
    {
      update(cache, { data }) {
        console.log('delete tag data: ', data);
        const deletedTagId = data?.deleteTagByTagId?.tag?.tagId;
        cache.modify({
          fields: {
            allTags(allTagsConnection, { readField }) {
              let { nodes } = allTagsConnection;
              console.log('current tag nodes\n', nodes);
              let newNodes = nodes.filter((tagRef: any) => deletedTagId !== readField('tagId', tagRef));
              return {
                ...allTagsConnection,
                nodes: newNodes
              };
            },
          },
        });
      }
    }
  );

  return [deleteTag];
}

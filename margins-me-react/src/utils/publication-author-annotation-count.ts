import * as PublicationAuthorAnnotationCountTypes from '../pages/__generated__/PublicationAuthorAnnotationCount';

export const extractPublicationAuthorAnnotationCount = (publication: PublicationAuthorAnnotationCountTypes.PublicationAuthorAnnotationCount) => {
  const {
    title,
    annotationsByPublicationId: {
      totalCount: annotationCount
    },
    authorsByPublicationAuthorPublicationIdAndAuthorId: {
      nodes: authors
    },
  } = publication;


  const authorNames = authors
    .filter((node): node is PublicationAuthorAnnotationCountTypes.PublicationAuthorAnnotationCount_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes => node !== null)
    .map(author => author.fullName)
    .join(' ');

  return {
    title,
    annotationCount,
    authorNames
  }
}
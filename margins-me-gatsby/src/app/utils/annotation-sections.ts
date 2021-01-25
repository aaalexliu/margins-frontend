import React from 'react';
import {
  extractAnnotationAll
} from '../graphql/fragments/';
import { AnnotationAllFragment } from '../__generated__/graphql-types';

export interface Section<T> {
  sectionId: string,
  name: string,
  ref: React.RefObject<T>,
}

export function extractAnnotationSections(
  annotations: AnnotationAllFragment[]
  // annotations:GetAllAnnotationsForPublicationTypes.GetAllAnnotationsForPublication_allAnnotations_edges_node[]
  ) {

  let lastSection = '';
  let sectionCount = 0;
  const sections: Section<HTMLDivElement>[] = [];
  const annotationsAndSections = annotations.flatMap(annotation => {
    const { highlightLocation, noteLocation } = extractAnnotationAll(annotation);
    const location = highlightLocation ? highlightLocation : noteLocation;
    // console.log(location);
    // console.log(location.section);
    // console.log(location.section != null);
    // console.log(location.section !== lastSection);
    if (location != null && location.section !=  null && location.section !== lastSection) {
      lastSection = location.section;
      sectionCount++;
      // console.log(lastSection);
      const ref = React.createRef<HTMLDivElement>();
      const section: Section<HTMLDivElement>= {
        sectionId: `section-${sectionCount}-${lastSection}`,
        name: lastSection,
        ref};
      sections.push(section);
      return [ section, annotation];
    } else {
      return [ annotation ];
    }
  }); 
  return {
    annotationsAndSections,
    sections
  };
}
import React from 'react';
import { Spin } from 'antd';
import styled from '@emotion/styled';

const CenteredDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export default function Loading() {
  return (
    <CenteredDiv>
      <Spin size="default" />
    </CenteredDiv>
  );
}

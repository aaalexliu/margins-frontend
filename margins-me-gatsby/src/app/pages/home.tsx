import React from 'react';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { RouteComponentProps } from '@reach/router';

const CenteredApp = styled.div`
  margin: 0 auto;
  width: 75%;
  max-width: 500px;
`;

const { Title } = Typography;

const Home: React.FC<RouteComponentProps> = () => {
  return (
    <Title level={1}>Welcome to Margins.Me</Title>
  )
}

export default Home;
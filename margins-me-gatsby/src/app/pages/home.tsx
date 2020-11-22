import React from 'react';
import styled from '@emotion/styled';
import { Typography, List } from 'antd';
import { BookOutlined, TagOutlined, ContactsOutlined } from '@ant-design/icons';
import { RouteComponentProps } from '@reach/router';
import { Link } from 'gatsby';
import { currentAccountVar } from '../../apollo/cache';
import { useQuery } from '@apollo/client';
import { GetHomePageCountsDocument } from '../__generated__/graphql-types';


const { Title, Text, Paragraph } = Typography;

const Home: React.FC<RouteComponentProps> = () => {
  const {
    data,
    error,
    loading
  } = useQuery(GetHomePageCountsDocument);

  
  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '80%',
          maxWidth: '700px',
          alignItems: 'center'
        }}
      >
        <Title level={3} >Welcome to Margins Me</Title>
        <Title level={5} type='secondary'
          css={{
            marginTop: '0px !important'
          }}
        >{currentAccountVar().email}</Title>
        <br />
        <List
          header={<h3>Browse {loading ? '' : `Your ${data?.allAnnotations?.totalCount} Annotations`}</h3>}
          css={{
            width: '100%',
            // backgroundColor: 'white'
          }}
          itemLayout='vertical'

        >
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={'/app/publications'}>
                    {loading ? 'Publications' : `Publications (${data?.allPublications?.totalCount})`}
                  </Link>
                }
                description={'Edit your publications and view annotations organized by location'}
                avatar={<BookOutlined />}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={'/app/tags'}>
                    {loading ? 'Tags' : `Tags (${data?.allTags?.totalCount})`}
                  </Link>
                }
                description={'Rename your tags and view their associated annotations'}
                avatar={<TagOutlined />}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={'/app/authors'}>
                    {loading ? 'Authors' : `Authors (${data?.allAuthors?.totalCount})`}
                  </Link>
                }
                description={'Edit your authors and view their associated publications'}
                avatar={<ContactsOutlined />}
              />
            </List.Item>
        </List>
      </div>
    </div>
  )
}

export default Home;
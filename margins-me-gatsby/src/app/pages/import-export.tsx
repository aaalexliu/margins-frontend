import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Typography, List, Input, Button } from 'antd';
import { BookOutlined, TagOutlined, ContactsOutlined } from '@ant-design/icons';
import { RouteComponentProps } from '@reach/router';
import { Link } from 'gatsby';
import { currentAccountVar } from '../../apollo/cache';
import { useQuery } from '@apollo/client';
import { GetHomePageCountsDocument } from '../__generated__/graphql-types';
import kindleImportGuide from '../static/kindle-import-guide.png';
import graphiql from '../static/graphiql.png'


const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ImportExport: React.FC<RouteComponentProps> = () => {
  const {
    data,
    error,
    loading
  } = useQuery(GetHomePageCountsDocument);

  const [ header, setHeader ] = useState(
`{
  "Authorization": "Bearer ${currentAccountVar().accessToken}"
}`);

  const textAreaRef = useRef();

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
          maxWidth: '600px',
          alignItems: 'center'
        }}
      >
        <Title level={3} >Import and Export Annotations</Title>
        <br />
        <List
          // header={<h3>Browse {loading ? '' : `Your ${data?.allAnnotations?.totalCount} Annotations`}</h3>}
          css={{
            width: '100%',
            // backgroundColor: 'white'
          }}
          itemLayout='vertical'
        >
            <List.Item>
              <List.Item.Meta
                title={`Import Your Kindle Annotations`}
                // avatar={<BookOutlined />}
              />
              <p>
                Right now the only method to import annotations is to email them from the Kindle app to <b>kindle@margins.me</b>, upload options coming soon!
              </p>
              <img
                css={{
                  width: '100%'
                }}
                src={kindleImportGuide}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title={
                  'Export Your Annotations'
                }
                // description={'Export Your Annotations'}
                // avatar={<TagOutlined />}
              />
              <p>
                Right now you can directly query your data using GraphiQL, which is meant to be a way for developers to test a GraphQL API, but it's also an amazing, user-friendly way to get your data in JSON format. Working on alternative solutions that scale better.
              </p>
              <p>
                <ol>
                  <li> 
                    Copy your access token and paste it into request headers (the access token is valid for 24 hours):
                    <Button type='link' onClick={() => {navigator.clipboard.writeText(header)}}>
                    Copy To Clipboard
                    </Button>
                    <TextArea
                      rows={3}
                      css={{
                        whiteSpace: 'pre',
                        overflowWrap: 'normal',
                        overflowX: 'scroll'
                      }}
                      name="access-token"
                      value={header}
                      onChange={(e) => setHeader(e.target.value)}
                    />
                  </li>
                  <li>Go to <a href={"https://api.margins.me/graphiql"}>api.margins.me/graphiql</a></li>
                  <li>
                  Paste your access token into the request headers section, refresh the page, and explore your data! You can try to query for other accounts data,
                  but thanks to PostreSQL Row Level Security, you won't be able to receive data from any other account
                  <img
                    css={{
                      width: '100%'
                    }}
                    src={graphiql}
                  />
                  </li>
                </ol>
              </p>
            </List.Item>
        </List>
      </div>
    </div>
  )
}

export default ImportExport;
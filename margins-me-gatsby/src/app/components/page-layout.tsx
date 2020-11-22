/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useState } from "react"
import { Layout, Menu, Button, Input } from 'antd';
import { useLocation } from "@reach/router"
import { Link, navigate } from 'gatsby';
import { LoginOrLogout } from '../../components';

const { Header, Content, Footer } = Layout;

const { Search } = Input;

export default function PageLayout (props: any) {
  const [ searchWidth, setSearchWidth ] = useState('150px');
  const [ searchValue, setSearchValue ] = useState('');

  const location = useLocation();
  const { pathname } = location;
  return (
    <Layout className="layout">
      <Header
        css={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Menu theme="dark" mode="horizontal"
          css={{
            flexGrow: 1
          }}
          selectedKeys={[pathname]}
          >
          <Menu.Item key = "/app">
            <Link to="/app">Home</Link>
          </Menu.Item>
          {/* </Menu> */}
          {/* <div
            css={{
              marginLeft: 'auto'
            }}
          > */}
            <Menu.Item key="/login">
              <LoginOrLogout />
            </Menu.Item>
          {/* </div> */}
        </Menu>
        <Search
          size='middle'
          placeholder='Annotations'
          css={{
            marginRight: '0px',
            width: searchWidth,
            webkitTransition: 'width 500ms ease',
            MozTransition: 'width 500ms ease',
            transition: 'width 500ms ease'
          }}
          onFocus={() => setSearchWidth('300px')}
          onBlur={() => setSearchWidth('150px')}
          enterButton={true}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={(value: string) => {
            setSearchValue('');
            navigate(`/app/search?query=${value}`);
          }}
        />
      </Header>
      <Content css={{padding: '24px'}}>
        {props.children}
      </Content>
      <Footer>
        Margins Me ©2020
      </Footer>
    </Layout>
  );
}

// SAMPLE GATSBY CODE
// import PropTypes from "prop-types"
// import { useStaticQuery, graphql } from "gatsby"

// import Header from "./header"
// import "./layout.css"

// const Layout = ({ children }) => {
//   const data = useStaticQuery(graphql`
//     query SiteTitleQuery {
//       site {
//         siteMetadata {
//           title
//         }
//       }
//     }
//   `)

//   return (
//     <>
//       <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
//       <div
//         style={{
//           margin: `0 auto`,
//           maxWidth: 960,
//           padding: `0 1.0875rem 1.45rem`,
//         }}
//       >
//         <main>{children}</main>
//         <footer style={{
//           marginTop: `2rem`
//         }}>
//           © {new Date().getFullYear()}, Built with
//           {` `}
//           <a href="https://www.gatsbyjs.com">Gatsby</a>
//         </footer>
//       </div>
//     </>
//   )
// }

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

// export default Layout

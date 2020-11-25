/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { Layout, Menu, Button } from 'antd';
import { useLocation } from "@reach/router"
import { Link } from 'gatsby';
import { LoginOrLogout } from '../components';
import { useStaticQuery, graphql } from "gatsby"
import './layout.less';

const { Header, Content, Footer } = Layout;

export default function PageLayout (props: any) {

  const location = useLocation();
  const { pathname } = location;

  const data = useStaticQuery(graphql`
     query SiteTitleQuery {
       site {
         siteMetadata {
           title
         }
       }
     }
  `);

  const siteTitle = data.site.siteMetadata?.title || `No Title`

  return (
    <Layout className="layout">
      <Header>
        <div>
          <h1 style={{ margin: 0 }}>
            <Link
              to="/"
              style={{
                color: `white`,
                textDecoration: `none`,
              }}
            >
              {siteTitle}
            </Link>
          </h1>
        </div>
      </Header>
      <Content
        css={{
          padding: '0 1rem',
        }}
      >
        {props.children}
      </Content>
      <Footer>
          <div
          style={{
            display: "grid",
            alignItems: "center",
            justifyContent: "space-between",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 240px))",
            padding: "1rem 2rem",
            fontSize: ".85rem",
          }}
        >
          <div style={{ color: 'lightblue', fontWeight: 700 }}>
            <a
              style={{ textDecoration: "none" }}
              href="https://github.com/gillkyle/gatsby-starter-landing-page"
            >
              Contact Us
            </a>
          </div>
          <div style={{ color: 'grey' }}>
            © {new Date().getFullYear()}
            {` `}
            {siteTitle}
          </div>
        </div>
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

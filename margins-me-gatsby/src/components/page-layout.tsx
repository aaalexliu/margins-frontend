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
import { blue } from '@ant-design/colors';
import { useStaticQuery, graphql, navigate } from "gatsby";
import Logo from '../images/margins-me-logo.inline.svg';
import './layout.less';

const { Header, Content, Footer } = Layout;

export const PageLayout: React.FC = (props) => {

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
    <Layout
      css={{
        backgroundColor: 'transparent'
      }}
    >
      <Header
        css={{
          color: 'black',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap'
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Logo css={{
              height: '3em',
              width: '3em',
              margin: '0 5px'
            }}
          />
          <h1 css={{ margin: 0 }}>
            <Link
              to="/"
              css={{
                textDecoration: `none`,
                color: 'black'
              }}
            >
              {siteTitle}
            </Link>
          </h1>
        </div>
        <div
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexGrow: 1
          }}
        >
          <Button
            size='large'
            type='text'
            onClick={() => navigate('/login/')}
          >
            Login
          </Button>
        </div>
      </Header>
      <Content
        css={{
          padding: '0 1rem',
          backgroundColor: 'transparent'
        }}
      >
        {props.children}
      </Content>
      <Footer>
          <div
          css={{
            display: "grid",
            alignItems: "center",
            justifyContent: "space-between",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 240px))",
            padding: "1rem 2rem",
            fontSize: ".85rem",
          }}
        >
          <div css={{ fontWeight: 700 }}>
            {/* <a
              css={{ textDecoration: "none" }}
              href="https://github.com/gillkyle/gatsby-starter-landing-page"
            >
              Contact Us
            </a> */}
            <p>
              Contact Us:
              <br/>
              support@margins.me
            </p>
          </div>
          <div css={{ color: 'grey' }}>
            © {new Date().getFullYear()}
            {` `}
            {siteTitle}
          </div>
        </div>
      </Footer>
    </Layout>
  );
}

export const AuthPageLayout: React.FC = (props) => {
  return (
    <PageLayout>
      <div
        css={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
        }}
      >
        <div
          css={{
            width: '50%',
            minWidth: '300px',
            maxWidth: '350px',
            marginTop: '50px'
          }}
        >
          {props.children}
        </div>
      </div>
    </PageLayout>
  )

}

export default PageLayout;

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
//         css={{
//           margin: `0 auto`,
//           maxWidth: 960,
//           padding: `0 1.0875rem 1.45rem`,
//         }}
//       >
//         <main>{children}</main>
//         <footer css={{
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

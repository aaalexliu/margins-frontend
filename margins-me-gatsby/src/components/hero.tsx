import React from "react"
import PropTypes from "prop-types"

// import Button from "../components/button"
import { Button, Typography } from 'antd';
import headerImage from "../images/header.png";
import MockupContent from "./image"
// import mockupFrame from "../images/mockup-frame.png"
import MockupBrowser from '../images/mockup-browser.inline.svg';
import { navigate } from 'gatsby'

const { Title, Paragraph, Text } = Typography;

const Hero: React.FC = () => (
  <div
    css={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      padding: "4rem 1rem",
    }}
  >
    <div
      css={{
        backgroundImage: `url(${headerImage})`,
        position: "absolute",
        top: 0,
        zIndex: -5,
        height: "100vh",
        width: "100vw",
        opacity: 0.5,
      }}
    />
    <Title level={1}css={{ textAlign: "center" }}>
      Home For Your Margins
    </Title>
    <p css={{ textAlign: "center", maxWidth: 440 }}>
      One place to save, organize, and search your highlights and notes.
      Augment the life of your mind.
    </p>
    <Button
      onClick={() => {navigate('/signup')}}
      type="primary"
    >Sign Up</Button>
    <div css={{
      margin: 60,
      minWidth: `400px`,
      width: '50%',
      maxWidth: '600px',
      position: "relative",
      }}>
        <MockupBrowser
          css={{
            position: "absolute",
            width: "100% !important",
            height: "100% !important",
            top: 0,
            zIndex: -1
          }}
          />
        {/* <img
          src={mockupFrame}
          alt="outlines of shapes and confetti in the background "
        /> */}
      <div
        css={{
          // clipPath: "inset(2% 5% round 2% 5%)",
          margin: '8% 3.5% 2.25% 3.5%'
        }}
      >
        <MockupContent
          css={{
            width: '100%',
          }}
        />
      </div>
    </div>
  </div>
)

// Hero.propTypes = {
//   siteTitle: PropTypes.string,
// }

// Hero.defaultProps = {
//   siteTitle: ``,
// }

export default Hero
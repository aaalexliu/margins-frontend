import React from "react"
import PropTypes from "prop-types"

// import Button from "../components/button"
import { Button } from 'antd';
import headerImage from "../images/header.png";
import MockupContent from "./image"
import mockupFrame from "../images/mockup-frame.png"

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
    <h1 css={{ textAlign: "center" }}>Landing Page Starter</h1>
    <p css={{ textAlign: "center", maxWidth: 440 }}>
      This landing page looks great on all devices and is minimal in design. Add
      what you want and deploy.
    </p>
    <Button>Get Early Access</Button>
    <div css={{ margin: 60, width: `250px`, position: "relative" }}>
      <div css={{ clipPath: "inset(2% 5% round 2% 5%)" }}>
        <MockupContent />
      </div>
      <div
        css={{
          position: "absolute",
          width: "250px",
          top: 0,
        }}
      >
        <img
          src={mockupFrame}
          alt="outlines of shapes and confetti in the background "
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
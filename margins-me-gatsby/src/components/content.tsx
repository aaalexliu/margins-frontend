import React from "react"

import feature from "../images/feature.png"
import SectionHeader from './section-header';

const Content = () => (
  <div css={{ padding: "4rem 1rem", textAlign: "center" }}>
    <SectionHeader
      title="Minimal Features"
      description="Don't spend time ripping out unneeded plugins and bloat."
    />
    <div
      css={{
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 340px))",
      }}
    >
      <div>
        <h3>What you need to Start</h3>
        <p css={{ color: '@grey-5' }}>
          Includes plugins for analytics, building sitemaps, and optimizing
          images
        </p>
      </div>
      <div>
        <img src={feature} alt="a blank card floating over colorful graphics" />
      </div>
    </div>
  </div>
)

export default Content

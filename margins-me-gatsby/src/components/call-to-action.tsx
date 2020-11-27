import React from "react"

import { Button } from 'antd';
import SectionHeader from "./section-header";
import { navigate } from 'gatsby';

const CallToAction = () => (
  <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
    <SectionHeader
      title="Try it out!"
      description="Free until my AWS Free Tier expires, then I'll figure out a sustainable pricing plan"
    />
    <Button type='primary' onClick={() => navigate('/signup')}>Sign up</Button>
  </div>
)

export default CallToAction

import React from "react"
import { Link } from "gatsby"

import PageLayout from "../components/page-layout"
import Hero from '../components/hero';
import Content from '../components/content';
import CallToAction from '../components/call-to-action';
import SEO from "../components/seo"

const IndexPage = () => (
  <PageLayout>
    <SEO title="Welcome" />
    <Hero />
    <Content />
    <CallToAction />
  </PageLayout>
)

export default IndexPage

import React from "react"

import PageLayout from "../components/page-layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <PageLayout>
    <SEO title="404: Not found" />
    <h1>404: Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </PageLayout>
)

export default NotFoundPage

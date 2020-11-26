import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `StaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `StaticQuery`: https://gatsby.dev/staticquery
 */


const Image: React.FC= () => {

  // ok this doesn't work because gatsby doesn't allow variables in static query,
  // abandoning but keeping for now
    const data = useStaticQuery(graphql`
      query {
        file(relativePath: { eq: "mockup-content-main.png" }) {
          childImageSharp {
            fluid(maxWidth: 600) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `);

  return (
    <Img fluid={data.file?.childImageSharp?.fluid}/>
  )
}

export default Image

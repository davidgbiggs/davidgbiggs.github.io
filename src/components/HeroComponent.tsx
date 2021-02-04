import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'

interface LocalProps {
  children?: React.ReactNode
  data?: any
}

// @ts-ignore
export default () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "hero-image.jpg" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fluid(maxWidth: 1110, maxHeight: 400) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <>
      <div style={{ marginTop: '100px' }} />
      <Img fluid={data.file.childImageSharp.fluid} />
    </>
  )
}

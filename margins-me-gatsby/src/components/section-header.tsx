import React from "react"

// import { COLORS } from "../styles/constants"

interface SectionHeaderProps {
  title: string
  description: string
}

const SectionHeader: React.FC<SectionHeaderProps>= ({ title, description }) => (
  <>
    <h2>{title}</h2>
    <p css={{ color:  '@grey-3'}}>{description}</p>
  </>
)

export default SectionHeader

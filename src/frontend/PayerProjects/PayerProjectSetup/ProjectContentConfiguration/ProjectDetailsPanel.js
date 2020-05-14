import React from 'react'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const Panel = styled.div({
  background: Color.LIGHT_BLUE_GRAY_2,
  borderRadius: 4,
  width: '33%',
  padding: Spacing.S3,
})

const Header = styled.div({
  color: Color.MEDIUM_GRAY_2,
  fontWeight: 700,
  marginBottom: Spacing.S2,
  ...FontSpace.FS2
})

const TagsContainer = styled.div({
  color: Color.BLACK,
  display: 'flex',
  flexWrap: 'wrap',
})

const Tag = styled.span({
  background: Color.MEDIUM_GRAY_1,
  borderRadius: 4,
  margin: `0 ${ Spacing.S2 } ${ Spacing.S2 } 0`,
  padding: `0 ${ Spacing.S2 }`,
  fontWeight: 500,
  ...FontSpace.FS1,
})

const ProjectDetailsPanel = ({ name, values }) => {
  return (
    <Panel>
      <Header>
        { name.toUpperCase() }
      </Header>
      <TagsContainer>
        {
          values.map(value => (
            <Tag key={value}>
              { value }
            </Tag>
          ))
        }
      </TagsContainer>
    </Panel>
  )
}

export default ProjectDetailsPanel

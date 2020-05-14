import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S7,
  background: Color.WHITE,
  color: Color.BLACK,
  borderBottom: `1px solid ${ Color.LIGHT_GRAY_1 }`,
})

const Header = styled.div({
  marginBottom: Spacing.S7,
  display: 'flex',
  justifyContent: 'space-between',
})

const Title = styled.div({
  fontWeight: 700,
  ...FontSpace.FS3,
})

const SubTitle = styled.div({
  whiteSpace: 'pre-wrap',
  opacity: '50%',
  ...FontSpace.FS2,
})

const SectionCard = ({
  title,
  subtitle,
  leftHeaderContent,
  children,
}) => {
  return (
    <Wrapper>
      <Header>
        <div>
          <Title>
            { title }
          </Title>
          {
            subtitle &&
            <SubTitle>
              { subtitle }
            </SubTitle>
          }
        </div>
        {
          leftHeaderContent && 
          <div>
            { leftHeaderContent }
          </div>
        }
      </Header>
      { children }
    </Wrapper>
  )
}

SectionCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.string,
  leftHeaderContent: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
}

SectionCard.defaultProps = {
  subtitle: null,
  leftHeaderContent: null,
}

export default SectionCard
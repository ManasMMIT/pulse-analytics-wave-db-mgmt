import React, { useState } from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

import { Colors, Spacing } from '../../utils/pulseStyles'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  fontWeight: 500,
  color: transparentize(0.4, Colors.WHITE),
  margin: `0 ${Spacing.NORMAL}`,
  borderRadius: 4,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textDecoration: 'none',
  fontSize: 11,
  lineHeight: '20px',
  ':hover': {
    background: transparentize(0.9, Colors.WHITE),
  },
})

const ChildContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 12,
})

const Dropdown = ({ style, label, children }) => {
  const [show, toggleShow] = useState(false)
  const handleClick = () => toggleShow(!show)

  return (
    <>
      <Wrapper style={{ style }} onClick={handleClick}>
        <span>{label}</span>
        <span>
          <FontAwesomeIcon size="lg" icon={faCaretDown} />
        </span>
      </Wrapper>
      {show && <ChildContainer>{children}</ChildContainer>}
    </>
  )
}

export default Dropdown

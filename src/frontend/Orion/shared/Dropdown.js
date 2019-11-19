import React, { useState } from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"

import { Colors } from '../../utils/pulseStyles'

const Wrapper = styled.div({
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.9, Colors.WHITE),
  }
})

const Dropdown = ({ style, label, children }) => {
  const [show, toggleShow] = useState(false)
  const handleClick = () => toggleShow(!show)

  return (
    <>
      <Wrapper style={{ display: 'flex', justifyContent: 'space-between', ...style }} onClick={handleClick}>
        <span>{label}</span>
        <span>
          <FontAwesomeIcon size="lg" icon={faCaretDown} />
        </span>
      </Wrapper>
      {
        show && (
          <div style={{ marginLeft: '12px' }}>
            {children}
          </div>
        )
      }
    </>
  )
}

export default Dropdown

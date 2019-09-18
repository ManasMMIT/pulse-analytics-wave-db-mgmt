import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"

const Dropdown = ({ style, label, children }) => {
  const [show, toggleShow] = useState(false)
  const handleClick = () => toggleShow(!show)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...style }} onClick={handleClick}>
        <span>{label}</span>
        <span>
          <FontAwesomeIcon size="lg" icon={faCaretDown} />
        </span>
      </div>
      {
        show && (
          <div style={{ marginLeft: '50px' }}>
            {children}
          </div>
        )
      }
    </>
  )
}

export default Dropdown

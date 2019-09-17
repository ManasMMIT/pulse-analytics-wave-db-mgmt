import React, { useState } from 'react'

const Dropdown = ({ style, label, children }) => {
  const [show, toggleShow] = useState(false)
  const handleClick = () => toggleShow(!show)

  return (
    <>
      <div style={style} onClick={handleClick}>
        {label}
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

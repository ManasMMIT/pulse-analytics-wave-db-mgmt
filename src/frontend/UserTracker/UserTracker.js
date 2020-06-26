import React, { useState } from 'react'

import useTrackerSocket from './useTrackerSocket'
import UsersSection from './UsersSection'

const wrapperStyle = {
  opacity: 0.4,
  position: 'absolute',
  bottom: 0,
  right: 0,
  maxWidth: '50%',
  display: 'flex',
  color: '#8266fa',
  background: 'rgb(242, 239, 254)',
  zIndex: 50,
}

export default () => {
  const [isOpen, setIsOpen] = useState(false)
  const { otherUsersOnPage, otherUsersOnTool } = useTrackerSocket()

  if (!otherUsersOnTool.length && !otherUsersOnPage.length) return null

  return (
    <div style={isOpen ? { ...wrapperStyle, opacity: 1 } : wrapperStyle}>
      <div style={{ margin: 12, alignSelf: 'center', opacity: .8, cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>{"<"}</div>
      { isOpen && (
        <>
          <UsersSection
            title="Users on this page"
            users={otherUsersOnPage}
          />
          <UsersSection
            title="Users on this tool"
            users={otherUsersOnTool}
          />
        </>
      )}
    </div>
  )
}

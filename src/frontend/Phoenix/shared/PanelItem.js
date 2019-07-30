import React from 'react'
import PropTypes from 'prop-types'

const defaultStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  cursor: "pointer",
  backgroundColor: "none",
  padding: 24,
  color: "#838c96",
  borderLeft: "4px solid transparent",
}

const PanelItem = ({
  label,
  style,
  onClick,
  children,
}) => {
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      <span>{label}</span>

      <span>
      { children }
      </span>
    </div>
  )
}

PanelItem.propTypes = {
  label: PropTypes.node,
  style: PropTypes.object,
  onClick: PropTypes.func,
}

PanelItem.defaultProps = {
  label: 'Default label',
  style: {},
  onClick: () => console.log('panel item clicked'),
}

export default PanelItem

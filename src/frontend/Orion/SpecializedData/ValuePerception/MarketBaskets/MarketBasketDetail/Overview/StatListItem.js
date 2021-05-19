import React from 'react'
import PropTypes from 'prop-types'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const StatListItem = ({ title, description }) => (
  <div style={{ padding: Spacing.S4 }}>
    <span style={{ ...FontSpace.FS2, fontWeight: 700 }}>{title}</span>
    <p>{description}</p>
  </div>
)

StatListItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default StatListItem

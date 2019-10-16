import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'

const SitemapSwitch = ({
  nodeType,
  sourceEntity,
  teamEntityNodes,
  handleToggle,
}) => (
  <Switch
    key={sourceEntity._id}
    checked={Boolean(teamEntityNodes[sourceEntity._id])}
    color="primary"
    onChange={e => (
      handleToggle({
        type: nodeType,
        _id: e.target.value,
        node: e.target.checked && sourceEntity,
      })
    )}
    value={sourceEntity._id}
  />
)

SitemapSwitch.defaultProps = {
  sourceEntity: {},
  teamEntityNodes: {},
  handleToggle: () => {
    console.error('No handler passed to SitemapSwitch')
  }
}

SitemapSwitch.propTypes = {
  sourceEntity: PropTypes.object,
  teamEntityNodes: PropTypes.object,
  handleToggle: PropTypes.func,
}

export default SitemapSwitch

import React from 'react'
import PropTypes from 'prop-types'

import Panel from './Panel'

const StructuralListPanels = ({ panels, searchParamsAncestry }) => {
  /*
    This operation sets the searchParamsAncestry for each panel.
    It maps through the panels. For each map operation, add to the searchParamsAncestry array
    and set the panel's searchParamsAncestry array. This is done so that
    each panel knows its preceding search string params.
    TODO: Write tests for this operation
  */
  const tempSearchParamsAncestry = [...searchParamsAncestry]
  panels.forEach((panel) => {
    tempSearchParamsAncestry.push(panel.searchParamConfig.searchParam)
    panel.searchParamConfig.searchParamsAncestry = [...tempSearchParamsAncestry]
  })

  return (
    <>
      {panels.map((panel) => (
        <Panel key={panel.searchParamConfig.searchParam} {...panel} />
      ))}
    </>
  )
}

StructuralListPanels.propTypes = {
  panels: PropTypes.array,
  searchParamsAncestry: PropTypes.array,
}

StructuralListPanels.defaultProps = {
  panels: [],
  searchParamsAncestry: [],
}

export default StructuralListPanels

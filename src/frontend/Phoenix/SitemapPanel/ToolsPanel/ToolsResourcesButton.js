import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Modal from './../../../components/Modal'

const contentWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-evenly',
}

const regionWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const statesWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const ResourcesButton = ({
  resources
}) => {
  const [isOpen,
    setIsOpen] = useState(false)

  const doesNotHaveResources = Object.keys(resources)
    .every(resourceType => _.isEmpty(resources[resourceType]))

  if (doesNotHaveResources) return null

  const {
    regionalBreakdown
  } = resources
 
  const groupedRegionalBreakdown = _.groupBy(
    regionalBreakdown,
    'region',
  )

  return (
    <>
      <button
        style={{ margin: '0 12px '}}
        onClick={() => setIsOpen(true)}
      >
        resources
      </button>
      <Modal
        handleClose={() => setIsOpen(false)}
        show={isOpen}
        title="Resources"
      >
        <div style={contentWrapperStyle}>
          {
            Object.keys(groupedRegionalBreakdown).map(region => {
              const stateObjsInRegion = groupedRegionalBreakdown[region]

              return (
                <div
                  key={region}
                  style={regionWrapperStyle}
                >
                  <span style={{ fontSize: 24 }}>{region}</span>
                  <div style={statesWrapperStyle}>
                    {
                      stateObjsInRegion.map(stateObj => (
                        <div key={stateObj.state}>
                          {stateObj.stateLong}
                        </div>
                      ))
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </Modal>
    </>
  )
}


ResourcesButton.propTypes = {
  resources: PropTypes.object,
}

ResourcesButton.defaultProps = {
  resources: {
    indications: [],
    accounts: [],
    regionalBreakdown: [],
  }
}

export default ResourcesButton
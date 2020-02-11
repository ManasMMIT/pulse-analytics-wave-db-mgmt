import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_SELECTED_CLIENT,
  GET_SELECTED_TEAM,
  GET_STAGED_SITEMAP,
} from '../../../api/queries'

import SelectedEntityDescription from './SelectedEntityDescription'
import CancelButton from './CancelButton'
import SubmitButton from './SubmitButton'

const Wrapper = styled.div({
  flex: 0,
  backgroundColor: '#EDF1F5',
  padding: 20,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const span1Style = {
  color: '#0E2539',
  opacity: 0.3,
  fontWeight: 600,
}

const span2Style = {
  color: '#0668D9',
  fontWeight: 600,
}

const SitemapPanelHeader = ({ teamId }) => {
  const { data, loading } = useQuery(GET_STAGED_SITEMAP)

  if (loading) return null

  const { stagedSitemap } = data

  // strip __typename and _id from the top-level sitemap obj
  let strippedSitemap = {}
  if (stagedSitemap) {
    const { __typename, _id, ...rest } = stagedSitemap
    strippedSitemap = rest
  }

  // prepare the data for potential persistence
  const updatedSitemap = _.mapValues(
    strippedSitemap,
    obj => {
      // arrayify the object
      const nodesAsArray = Object.values(obj)

      // remove any nodes that have been checked off (false values)
      const nodesAsArrayTrimmed = _.compact(nodesAsArray)

      // this step is necessary because https://github.com/apollographql/react-apollo/issues/741
      const nodesWithTypenameRemoved = nodesAsArrayTrimmed.map(({ __typename, ...rest }) => rest)

      return nodesWithTypenameRemoved
    }
  )

  return (
    <Wrapper>
      <div>
        <span style={span1Style}>EDITING TEAM PERMISSIONS / </span>
        <SelectedEntityDescription
          style={span1Style}
          queryDoc={GET_SELECTED_CLIENT}
        />
        <span style={span1Style}> / </span>
        <SelectedEntityDescription
          style={span2Style}
          queryDoc={GET_SELECTED_TEAM}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CancelButton />
        <SubmitButton
          teamId={teamId}
          updatedSitemap={updatedSitemap}
        />
      </div>
    </Wrapper>
  )
}

SitemapPanelHeader.propTypes = {
  teamId: PropTypes.string,
}

export default SitemapPanelHeader

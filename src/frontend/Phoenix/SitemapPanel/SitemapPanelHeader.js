import React from 'react'
import styled from '@emotion/styled'
import { Query, Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import _ from 'lodash'

import {
  GET_SELECTED_CLIENT,
  GET_SELECTED_TEAM,
  GET_CLIENT_TEAMS,
} from '../../api/queries'

import {
  SELECT_TOOL,
  UPDATE_ROLE_SITEMAP,
} from '../../api/mutations'

import Spinner from '../shared/Spinner'

const Wrapper = styled.div({
  flexGrow: 1,
  backgroundColor: '#EDF1F5',
  padding: 20,
  display: 'flex',
  justifyContent: 'space-between',
})

const Span1 = styled.span({
  color: '#0E2539',
  opacity: 0.3,
  fontWeight: 600,
})

const Span2 = styled.span({
  color: '#0668D9',
  fontWeight: 600,
})

const cancelButtonStyle = {
  color: '#EE5340',
  fontWeight: 600,
  fontSize: 14,
  padding: '8px 16px'
}

const submitButtonStyle = {
  backgroundColor: '#0668D9',
  color: 'white',
  fontWeight: 600,
  fontSize: 14,
  padding: 6,
  cursor: 'pointer',
}

const SitemapPanelHeader = ({
  stagedSitemap,
  teamId,
}) => {
  // strip __typename and __id from the top-level sitemap obj
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
        <Span1>EDITING VIEW CONTROL / </Span1>

        <Span1>
          <Query query={GET_SELECTED_CLIENT}>
            {({ data: { selectedClient } }) => selectedClient.description}
          </Query>
        </Span1>

        <Span1> / </Span1>

        <Span2>
          <Query query={GET_SELECTED_TEAM}>
            {({ data: { selectedTeam } }) => selectedTeam.description}
          </Query>
        </Span2>
      </div>


      <div>
        <Mutation mutation={SELECT_TOOL}>
          {resetToolSelection => (
            <Link
              to="/phoenix"
              style={cancelButtonStyle}
              onClick={resetToolSelection}
            >
              Cancel
            </Link>
          )}
        </Mutation>

        <Mutation
          mutation={UPDATE_ROLE_SITEMAP}
          variables={{ input: { updatedSitemap, teamId } }}
          refetchQueries={[{ query: GET_CLIENT_TEAMS }]}
        >
          {(updateRoleSitemap, { loading, error }) => {
            if (loading) return <Spinner />
            if (error) return (
              <div style={{ color: 'red' }}>
                Error processing request
              </div>
            )

            return (
              <button
                onClick={updateRoleSitemap}
                style={submitButtonStyle}
              >
                Submit Changes
              </button>
            )
          }}
        </Mutation>
      </div>
    </Wrapper>
  )
}
export default SitemapPanelHeader

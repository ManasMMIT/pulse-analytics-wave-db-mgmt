import React from 'react'
import { Query } from 'react-apollo'
import Inspector from 'react-inspector'

import { GET_TEAM_SITEMAP } from '../../../api/queries'

const wrapperStyle = {
  flex: 4,
  backgroundColor: '#f7f9fa',
  minHeight: 'calc(100vh - 37px)',
  maxHeight: 'calc(100vh - 37px)',
  overflowY: 'scroll',
  padding: 24,
  boxSizing: 'border-box',
}

const ViewControlTab = () => (
  <Query query={GET_TEAM_SITEMAP}>
    {
      ({ data }) => {
        return (
          <div style={wrapperStyle}>
            <Inspector
              data={data.sitemap}
              expandLevel={12}
              columns={['name', 'id']}
            />
          </div>
        )
      }
    }
  </Query>
)

export default ViewControlTab

import React from 'react'
import _ from 'lodash'
import { graphql } from 'react-apollo'

import { GET_SELECTED_TEAM } from '../../api/queries'
import SitemapPanelHeader from './SitemapPanelHeader'
import ToolsPanel from './ToolsPanel'
import DashboardsPanel from './DashboardsPanel'
import PagesPanel from './PagesPanel'
import CardsPanel from './CardsPanel'

class SitemapPanel extends React.Component {
  constructor(props) {
    super(props)

    const initialState = this.getInitialState()
    this.state = initialState
  }

  // needed because sometimes the initialState set in the constructor
  // is one cycle behind the most recent selection
  componentWillReceiveProps(nextProps) {
    const initialState = this.getInitialState(nextProps)
    this.setState(initialState)
  }

  getInitialState(props = this.props) {
    const { data: { selectedTeam } } = props
    const { sitemap } = selectedTeam

    const initialState = _.mapValues(sitemap, arr => _.keyBy(arr, '_id'))

    return initialState
  }

  handleToggle = ({ type, _id, node }) => {
    const newState = _.merge({}, this.state, { [type]: { [_id]: node } })
    this.setState(newState)
  }

  render() {
    const { data: { selectedTeam: { _id: teamId } } } = this.props

    const {
      tools,
      dashboards,
      pages,
      cards
    } = this.state

    // prepare the data for potential persistence
    const updatedSitemap = _.mapValues(
      this.state,
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
      <div>
        <SitemapPanelHeader
          teamId={teamId}
          updatedSitemap={updatedSitemap}
        />

        <div style={{ display: 'flex' }}>
          <ToolsPanel
            toolsStatus={tools}
            handleToggle={this.handleToggle}
          />

          <DashboardsPanel
            dashboardsStatus={dashboards}
            handleToggle={this.handleToggle}
          />

          <PagesPanel
            pagesStatus={pages}
            handleToggle={this.handleToggle}
          />

          <CardsPanel
            cardsStatus={cards}
            handleToggle={this.handleToggle}
          />
        </div>
      </div>
    )
  }
}

export default graphql(GET_SELECTED_TEAM)(SitemapPanel)

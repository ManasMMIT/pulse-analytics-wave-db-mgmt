import React from 'react'
import _ from 'lodash'
import { graphql } from 'react-apollo'

// TODO: Grab all selected nodes at each level,
// * to pass appropriate indications/accounts
import {
  GET_SELECTED_TEAM,
} from '../../api/queries'
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

  // ! Extra GET_SELECTED_TEAM query is needed because
  // ! sometimes the initialState set in the constructor
  // ! is one cycle behind the most recent selection
  componentWillReceiveProps(nextProps) {
    const initialState = this.getInitialState(nextProps)
    this.setState(initialState)
  }

  getInitialState(props = this.props) {
    const { selectedTeamQuery: { selectedTeam } } = props
    const { sitemap } = selectedTeam

    const initialState = _.mapValues(sitemap, arr => _.keyBy(arr, '_id'))

    return initialState
  }

  handleToggle = ({ type, _id, node }) => {
    const newState = _.merge({}, this.state, { [type]: { [_id]: node } })
    this.setState(newState)
  }

  handleRegBrkToggle = ({
    nodeType,
    nodeId,
    regionalBreakdown,
    checked,
  }) => {
    const newState = _.merge({}, this.state)
    const { resources: currentResources } = newState[nodeType][nodeId]

    if (checked) {
      newState[nodeType][nodeId].resources = _.merge(
        currentResources,
        { regionalBreakdown }
      )
    } else {
      delete newState[nodeType][nodeId]
        .resources.regionalBreakdown
    }

    this.setState(newState)
  }

  render() {
    const {
      selectedTeamQuery: {
        selectedTeam: { _id: teamId },
      }
    } = this.props

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
            handleRegBrkToggle={this.handleRegBrkToggle}
            dashboardsStatus={dashboards}
            handleToggle={this.handleToggle}
          />

          <PagesPanel
            handleRegBrkToggle={this.handleRegBrkToggle}
            pagesStatus={pages}
            handleToggle={this.handleToggle}
          />

          <CardsPanel
            handleRegBrkToggle={this.handleRegBrkToggle}
            cardsStatus={cards}
            handleToggle={this.handleToggle}
          />
        </div>
      </div>
    )
  }
}

export default graphql(GET_SELECTED_TEAM, { name: 'selectedTeamQuery' })(SitemapPanel)

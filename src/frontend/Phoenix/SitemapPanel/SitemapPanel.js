import React from 'react'
import _ from 'lodash'
import {
  useQuery,
  useApolloClient,
} from '@apollo/react-hooks'

// TODO: Grab all selected nodes at each level,
// * to pass appropriate indications/accounts
import {
  GET_SELECTED_TEAM,
  GET_STAGED_SITEMAP,
} from '../../api/queries'

import {
  SET_STAGED_SITEMAP,
} from '../../api/mutations'

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
    const { selectedTeam: { sitemap } } = props

    const initialState = _.mapValues(sitemap, arr => _.keyBy(arr, '_id'))

    this.setStagedSitemapCache(initialState)

    return initialState
  }

  setStagedSitemapCache = newSitemap => {
    this.props.client.mutate({
      mutation: SET_STAGED_SITEMAP,
      variables: {
        input: {
          stagedSitemap: newSitemap,
        }
      }
    })
  }

  handleToggle = ({ type, _id, node }) => {
    // TODO: grab current, staged sitemap
    const newState = _.merge({}, this.state, { [type]: { [_id]: node } })

    this.setStagedSitemapCache(newState)

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

    this.setStagedSitemapCache(newState)

    this.setState(newState)
  }

  render() {
    const {
      selectedTeam: { _id: teamId },
    } = this.props

    const {
      tools,
      dashboards,
      pages,
      cards,
    } = this.state

    return (
      <div>
        <SitemapPanelHeader teamId={teamId} />
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

const SitemapPanelContainer = props => {
  const client = useApolloClient()
  const { data, loading } = useQuery(GET_SELECTED_TEAM)

  if (loading) return null

  const { selectedTeam } = data

  return (
    <SitemapPanel
      client={client}
      selectedTeam={selectedTeam}
      {...props}
    />
  )
}

export default SitemapPanelContainer

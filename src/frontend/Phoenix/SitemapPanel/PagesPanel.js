import React from 'react'
import { Query } from 'react-apollo'
import { transparentize } from 'polished'
import Switch from '@material-ui/core/Switch'

import Panel from '../shared/Panel'
import {
  GET_DASHBOARD_PAGES,
  GET_SELECTED_PAGE,
  GET_SELECTED_DASHBOARD,
} from '../../api/queries'

import { SELECT_PAGE } from '../../api/mutations'

const defaultPanelStyle = {
  padding: 20,
}

const panelHeaderStyle = {
  color: '#0E2539',
  fontWeight: 600,
}

const panelItemStyle = {
  padding: '17px 20px',
  color: '#0E2539',
  fontWeight: 600,
  fontSize: 12,
  backgroundColor: transparentize(0.95, '#0E2539'),
  marginTop: 10,
  cursor: 'pointer',
}

const panelItemActiveStyle = {
  backgroundColor: transparentize(0.9, '#0668D9'),
  color: '#0668D9',
}

const PagesPanel = ({ handleToggle, pagesStatus }) => {
  const buttonGroupCallback = page => (
    <Switch
      key={page._id}
      checked={Boolean(pagesStatus[page._id])}
      color="primary"
      onChange={e => (
        handleToggle({
          type: 'pages',
          _id: e.target.value,
          node: e.target.checked && page,
        })
      )}
      value={page._id}
    />
  )

  return (
    <Query query={GET_SELECTED_DASHBOARD}>
      {({ data: { selectedDashboard: { name: dashboardName } } }) => (
        <Panel
          style={defaultPanelStyle}
          headerContainerStyle={panelHeaderStyle}
          title={`PAGES / ${dashboardName}`}
          titleStyle={{ fontSize: 16 }}
          queryDocs={{
            fetchAllQueryProps: { query: GET_DASHBOARD_PAGES },
            fetchSelectedQueryProps: { query: GET_SELECTED_PAGE },
          }}
          panelItemConfig={{
            selectEntityMutationDoc: SELECT_PAGE,
            style: panelItemStyle,
            activeStyle: panelItemActiveStyle,
            buttonGroupCallback,
          }}
        />
      )}
    </Query>
  )
}

export default PagesPanel

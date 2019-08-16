import React from 'react'
import { Query } from 'react-apollo'

import { transparentize } from 'polished'
import Switch from '@material-ui/core/Switch'

import Panel from '../shared/Panel'
import {
  GET_PAGE_CARDS,
  GET_SELECTED_CARD,
  GET_SELECTED_PAGE,
} from '../../api/queries'

import { SELECT_CARD } from '../../api/mutations'

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

const PagesPanel = ({ handleToggle, cardsStatus }) => {
  const buttonGroupCallback = card => (
    <Switch
      key={card._id}
      checked={Boolean(cardsStatus[card._id])}
      color="primary"
      onChange={e => (
        handleToggle({
          type: 'cards',
          _id: e.target.value,
          node: e.target.checked && card,
        })
      )}
      value={card._id}
    />
  )

  return (
    <Query query={GET_SELECTED_PAGE}>
      {({ data }) => {
        let pageName = data && data.selectedPage && data.selectedPage.name
        if (!pageName) pageName = ''

        return (
          <Panel
            style={defaultPanelStyle}
            headerContainerStyle={panelHeaderStyle}
            title={`CARDS / ${pageName}`}
            titleStyle={{ fontSize: 16 }}
            queryDocs={{
              fetchAllQueryProps: { query: GET_PAGE_CARDS },
              fetchSelectedQueryProps: { query: GET_SELECTED_CARD },
            }}
            panelItemConfig={{
              selectEntityMutationDoc: SELECT_CARD,
              style: panelItemStyle,
              activeStyle: panelItemActiveStyle,
              buttonGroupCallback,
            }}
          />
        )
      }}
    </Query>
  )
}

export default PagesPanel

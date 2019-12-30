import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { transparentize } from 'polished'

import {
  GET_PAGE_CARDS,
  GET_SELECTED_CARD,
  GET_SELECTED_PAGE,
} from '../../api/queries'

import { SELECT_CARD } from '../../api/mutations'

import Panel from '../shared/Panel'
import ButtonGroup from './shared/ButtonGroup'

const defaultPanelStyle = {
  padding: 20,
}

const panelHeaderStyle = {
  color: '#0E2539',
  fontWeight: 600,
}

const panelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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

const PagesPanel = ({
  handleToggle,
  cardsStatus,
}) => {
  const { data, loading } = useQuery(GET_SELECTED_PAGE)

  if (loading) return null

  let pageName = data && data.selectedPage && data.selectedPage.name
  if (!pageName) pageName = ''

  const buttonGroupCallback = card => (
    <ButtonGroup
      sourceEntity={card}
      teamEntityNodes={cardsStatus}
      nodeType="cards"
      handleToggle={handleToggle}
    />
  )

  const label2Callback = ({ _id, name: sourceNodeName }) => {
    const teamNode = cardsStatus[_id]
    if (!teamNode) return null

    const teamNodeTitle = teamNode.text.title
    if (sourceNodeName === teamNodeTitle) return null

    return teamNodeTitle
  }

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
        label1Callback: ({ name }) => name,
        label2Callback,
      }}
    />
  )
}

export default PagesPanel

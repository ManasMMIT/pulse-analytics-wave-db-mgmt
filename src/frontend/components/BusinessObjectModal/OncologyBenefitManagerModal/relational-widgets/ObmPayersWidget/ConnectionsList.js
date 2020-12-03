import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from '@emotion/styled'

import ConnectionListItem from './ConnectionListItem'
import SectionTitle from 'frontend/components/SectionTitle'
import List from 'frontend/components/List'
import Color from 'frontend/utils/color'
import Button from 'frontend/components/Button'
import Icon from 'frontend/components/Icon'

const ConnectionsListWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
})

const ConnectionsList = ({
  connections,
  widgetTitle,
  createConnectionHandler,
  selectedConnectionId,
  selectConnectionId,
  isNewConnectionBeingCreated,
  anyUnsavedChanges,
  payerOrgById,
}) => {
  const clickHandler = (id) => {
    if (anyUnsavedChanges || isNewConnectionBeingCreated) {
      // Disable selection whenever edits are in progress
      alert(
        "You have unsaved changes! First save or cancel the connection you're on."
      )
    } else {
      selectConnectionId(id)
    }
  }

  return (
    <ConnectionsListWrapper>
      <SectionTitle title={widgetTitle}>
        <Button type={'secondary'} onClick={createConnectionHandler}>
          <Icon iconName="add" color1={Color.PRIMARY} width={16} />
        </Button>
      </SectionTitle>

      <List>
        {isNewConnectionBeingCreated && (
          <ConnectionListItem isActive title="New Payer Connection" />
        )}

        {connections.map((datum) => {
          const { _id, payerId, books } = datum
          const isActive =
            !isNewConnectionBeingCreated && selectedConnectionId === _id

          const booksLabel = books
            .map(
              ({ name, isNational }) =>
                `${name} (${isNational ? 'National' : 'States'})`
            )
            .join(', ')

          return (
            <ConnectionListItem
              key={datum._id}
              isActive={isActive}
              clickHandler={() => clickHandler(datum._id)}
              title={payerOrgById[payerId]}
              subtitle={booksLabel}
            />
          )
        })}
      </List>
    </ConnectionsListWrapper>
  )
}

ConnectionsList.propTypes = {
  connections: PropTypes.array,
  widgetTitle: PropTypes.string,
  createConnectionHandler: PropTypes.func,
  selectedConnectionId: PropTypes.string,
  selectConnectionId: PropTypes.func,
  isNewConnectionBeingCreated: PropTypes.bool,
  anyUnsavedChanges: PropTypes.bool,
  payerOrgById: PropTypes.object,
}

export default ConnectionsList

import React from 'react'
import Switch from '@material-ui/core/Switch'
import styled from "@emotion/styled"
import { withStyles } from '@material-ui/core/styles';
import { transparentize, mix } from 'polished'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsAltV } from "@fortawesome/free-solid-svg-icons"
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

import '../sortableContainerStyles.css'

import { Colors, Spacing } from '../../../../../../../../../utils/pulseStyles'

import {
  IndicationPanelContainer,
  ListHeader,
  ActiveRow,
  InactiveRow,
  UnorderedList,
} from '../styledComponents'

const ListRow = styled.li({
  alignItems: 'center',
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  borderRadius: 4,
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 8,
  padding: `${Spacing.TINY} 0`,
  cursor: 'pointer',
}, ({ isSelected }) => {

  return {
    backgroundColor: isSelected ? transparentize(0.9, Colors.PRIMARY) : 'transparent',
    color: isSelected ? Colors.PRIMARY : Colors.BLACK,
    ':hover': {
      backgroundColor: isSelected ? transparentize(0.9, Colors.PRIMARY) : transparentize(0.92, Colors.BLACK),
    }
  }
})

const DragHandle = sortableHandle(() => (
  <span
    style={{
      padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
      opacity: 0.3,
      fontSize: 16,
    }}
  >
    <FontAwesomeIcon
      icon={faArrowsAltV}
      color={Colors.BLACK}
    />
  </span>
))

const switchColor = Colors.GREEN

// Material UI Custom Switch Styling
const PhoenixSwitch = withStyles({
  switchBase: {
    color: mix(0.4, Colors.BLACK, Colors.WHITE),
    '&$checked': {
      color: switchColor,
    },
    '&$checked + $track': {
      backgroundColor: switchColor,
    },
  },
  checked: {},
  track: {
    backgroundColor: transparentize(0.7, Colors.BLACK),
  },
})(Switch)

const SortableItem = sortableElement(({
  ind,
  disableIndication,
  selectedIndicationId,
  selectIndication,
}) => {
  const isSelected = ind._id === selectedIndicationId

  return (
    <ListRow
      isSelected={isSelected}
      onClick={() => selectIndication(ind._id)}
    >
      <div>
        <DragHandle />
        <span style={{ fontWeight: isSelected ? 700 : 500 }}>{ind.name}</span>
      </div>
      <PhoenixSwitch
        checked
        value={ind._id}
        onChange={() => disableIndication(ind)}
      />
    </ListRow>
  )
})

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <UnorderedList>
      {children}
    </UnorderedList>
  )
})

const IndicationsPanel = ({
  selectedIndicationId,
  selectIndication,
  enabledTreatmentPlans,
  disabledTreatmentPlans,
  enableIndication,
  disableIndication,
  onSortEnd,
}) => {
  return (
    <IndicationPanelContainer>
      <ListHeader>Indications</ListHeader>
        <ActiveRow>ACTIVE ({enabledTreatmentPlans.length})</ActiveRow>
        <SortableContainer
          onSortEnd={onSortEnd}
          helperClass="sortableHelper"
          useDragHandle
        >
          {
            enabledTreatmentPlans.map((ind, index) => (
              <SortableItem
                key={ind._id}
                index={index}
                ind={ind}
                disableIndication={disableIndication}
                selectedIndicationId={selectedIndicationId}
                selectIndication={selectIndication}
              />
            ))
          }
        </SortableContainer>

        <InactiveRow>INACTIVE ({disabledTreatmentPlans.length})</InactiveRow>
        <UnorderedList>
          {
            disabledTreatmentPlans.map(ind => {
              const isSelected = ind._id === selectedIndicationId

              const ListRow = styled.li({
                alignItems: 'center',
                backgroundColor: isSelected ? transparentize(0.9, Colors.PRIMARY) : 'transparent',
                borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
                borderRadius: 4,
                color: Colors.BLACK,
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                padding: `${Spacing.TINY} 0 ${Spacing.TINY} ${Spacing.NORMAL}`,
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: isSelected ? transparentize(0.7, Colors.MEDIUM_GRAY_2) : transparentize(0.92, Colors.BLACK),
                }
              })

              return (
                <ListRow
                  key={ind._id}
                  onClick={() => selectIndication(ind._id)}
                >
                  <span style={{ ffontWeight: isSelected ? 700 : 50 }}>{ind.name}</span>
                  <PhoenixSwitch
                    checked={false}
                    value={ind._id}
                    onChange={() => enableIndication(ind)}
                  />
                </ListRow>
              )
            })
          }
        </UnorderedList>
    </IndicationPanelContainer>
  )
}

export default IndicationsPanel

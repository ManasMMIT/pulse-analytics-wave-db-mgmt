import React from 'react'
import Switch from '@material-ui/core/Switch'
import styled from "@emotion/styled"
import { transparentize, mix } from 'polished'
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

import '../sortableContainerStyles.css'

import { Colors } from '../../../../../../../../../utils/pulseStyles'

const ListHeader = styled.div({
  fontSize: 14,
  fontWeight: 500,
  textTransform: 'uppercase',
  padding: '12px 24px',
})

const ActiveRow = styled.div({
  background: mix(0.8, Colors.WHITE, Colors.GREEN),
  color: Colors.GREEN,
  padding: '8px 24px',
  fontWeight: 600,
  lineHeight: '18px',
  fontSize: 10,
  position: 'sticky',
  top: 0,
  zIndex: 5,
})

const InactiveRow = styled.div({
  background: mix(0.8, Colors.WHITE, Colors.MEDIUM_GRAY_2),
  color: Colors.MEDIUM_GRAY_2,
  padding: '8px 24px',
  fontWeight: 600,
  lineHeight: '18px',
  fontSize: 10,
  position: 'sticky',
  top: 0,
  zIndex: 5,
})

const DragHandle = sortableHandle(() => <span style={{ paddingRight: 8, opacity: 0.3 }}>::</span>)

const SortableItem = sortableElement(({
  ind,
  disableIndication,
  selectedIndicationId,
  selectIndication,
}) => {
  const isSelected = ind._id === selectedIndicationId

  return (
    <li
      onClick={() => selectIndication(ind._id)}
      style={{
        display: 'flex',
        borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
        marginBottom: 8,
        backgroundColor: isSelected ? transparentize(0.9, Colors.PRIMARY) : 'transparent',
      }}
    >
      <DragHandle />

      <span style={{ fontWeight: 700 }}>{ind.name}</span>
      <Switch
        checked
        color="primary"
        value={ind._id}
        onChange={() => disableIndication(ind)}
      />
    </li>
  )
})

const SortableContainer = sortableContainer(({ children }) => {
  return (
    <ul>
      {children}
    </ul>
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
    <div style={{ flex: 3, maxHeight: 600, overflow: 'auto' }}>
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
      <ul>
        {
          disabledTreatmentPlans.map(ind => {
            const isSelected = ind._id === selectedIndicationId

            return (
              <li
                key={ind._id}
                onClick={() => selectIndication(ind._id)}
                style={{
                  display: 'flex',
                  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
                  marginBottom: 8,
                  backgroundColor: isSelected ? transparentize(0.9, Colors.PRIMARY) : 'transparent',
                }}
              >
                <span style={{ fontWeight: 700 }}>{ind.name}</span>
                <Switch
                  checked={false}
                  color="primary"
                  value={ind._id}
                  onChange={() => enableIndication(ind)}
                />
              </li>
            )
        })
        }
      </ul>
    </div>
  )
}

export default IndicationsPanel

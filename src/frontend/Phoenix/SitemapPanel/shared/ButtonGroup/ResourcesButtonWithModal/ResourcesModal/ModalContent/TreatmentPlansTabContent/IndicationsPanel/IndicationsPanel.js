import React from 'react'
import Switch from '@material-ui/core/Switch'
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

import '../sortableContainerStyles.css'

const DragHandle = sortableHandle(() => <span>::</span>)

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
        borderBottom: '1px solid black',
        backgroundColor: isSelected ? 'yellow' : 'transparent',
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
      <div>ACTIVE ({enabledTreatmentPlans.length})</div>
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

      <div>INACTIVE ({disabledTreatmentPlans.length})</div>
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
                  borderBottom: '1px solid black',
                  backgroundColor: isSelected ? 'yellow' : 'transparent',
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

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
  reg,
  disableRegimen,
}) => {
  return (
    <li
      style={{
        display: 'flex',
        borderBottom: '1px solid black',
      }}
    >
      <DragHandle />

      <span>{reg.name}</span>
      <Switch
        checked
        color="primary"
        value={reg._id}
        onChange={() => disableRegimen(reg)}
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

const RegimensPanel = ({
  selectedIndicationName,
  enabledRegimens,
  disabledRegimens,
  enableRegimen,
  disableRegimen,
  onSortEnd,
}) => {
  return (
    <div style={{ flex: 3, maxHeight: 600, overflow: 'auto' }}>
      <div>Regimens for selected indication: {selectedIndicationName}</div>

      <div>ACTIVE ({enabledRegimens.length})</div>

      <SortableContainer
        onSortEnd={onSortEnd}
        helperClass="sortableHelper"
        useDragHandle
      >
        {
          enabledRegimens.map((reg, index) => (
            <SortableItem
              key={reg._id}
              index={index}
              reg={reg}
              disableRegimen={disableRegimen}
            />
          ))
        }
      </SortableContainer>

      <div>INACTIVE ({disabledRegimens.length})</div>
      <ul>
        {
          disabledRegimens.map(reg => {
            return (
              <li
                key={reg._id}
                style={{
                  display: 'flex',
                  borderBottom: '1px solid black',
                }}
              >
                <span>{reg.name}</span>
                <Switch
                  checked={false}
                  color="primary"
                  value={reg._id}
                  onChange={() => enableRegimen(reg)}
                />
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default RegimensPanel

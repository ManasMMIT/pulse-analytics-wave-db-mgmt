import React from 'react'
import Switch from '@material-ui/core/Switch'
import styled from "@emotion/styled"
import { transparentize, mix } from 'polished'
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

import { Colors } from '../../../../../../../../../utils/pulseStyles'

import '../sortableContainerStyles.css'

const ListHeader = styled.div({
  fontSize: 14,
  fontWeight: 500,
  textTransform: 'uppercase',
  padding: '12px 24px',
})

const SelectedIndication = styled.span({
  color: Colors.PRIMARY,
  textTransform: 'normal',

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
  reg,
  disableRegimen,
}) => {
  return (
    <li
      style={{
        display: 'flex',
        borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
        marginBottom: 8,
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
      <ListHeader>Regimens / <SelectedIndication>{selectedIndicationName}</SelectedIndication></ListHeader>

      <ActiveRow>ACTIVE ({enabledRegimens.length})</ActiveRow>

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

      <InactiveRow>INACTIVE ({disabledRegimens.length})</InactiveRow>
      <ul>
        {
          disabledRegimens.map(reg => {
            return (
              <li
                key={reg._id}
                style={{
                  display: 'flex',
                  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
                  marginBottom: 8,
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

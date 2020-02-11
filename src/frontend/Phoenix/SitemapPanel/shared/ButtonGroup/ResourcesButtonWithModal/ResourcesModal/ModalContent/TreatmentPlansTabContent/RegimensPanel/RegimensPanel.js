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

import { Colors, Spacing } from '../../../../../../../../../utils/pulseStyles'

import '../sortableContainerStyles.css'

import {
  IndicationPanelContainer,
  ListHeader,
  ActiveRow,
  InactiveRow,
  UnorderedList,
} from '../styledComponents'

const SelectedIndication = styled.span({
  color: Colors.PRIMARY,
  textTransform: 'normal',
})

const ListRow = styled.li({
  alignItems: 'center',
  backgroundColor: 'transparent',
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  borderRadius: 4,
  color: Colors.BLACK,
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 8,
  padding: `${Spacing.TINY} 0`,
  ':hover': {
    backgroundColor: transparentize(0.92, Colors.BLACK),
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
  reg,
  disableRegimen,
}) => {
  return (
    <ListRow>
      <div>
        <DragHandle />
        <span style={{ fontWeight: 500 }}>{reg.name}</span>
      </div>
      <PhoenixSwitch
        checked
        value={reg._id}
        onChange={() => disableRegimen(reg)}
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

const RegimensPanel = ({
  selectedIndicationName,
  enabledRegimens,
  disabledRegimens,
  enableRegimen,
  disableRegimen,
  onSortEnd,
}) => {
  return (
    <IndicationPanelContainer>
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
      <SortableContainer>
        {
          disabledRegimens.map(reg => {
            return (
              <ListRow key={reg._id}>
                <span style={{ fontWeight: 500 }}>{reg.name}</span>
                <PhoenixSwitch
                  checked={false}
                  color="primary"
                  value={reg._id}
                  onChange={() => enableRegimen(reg)}
                />
              </ListRow>
            )
          })
        }
      </SortableContainer>
    </IndicationPanelContainer>
  )
}

export default RegimensPanel

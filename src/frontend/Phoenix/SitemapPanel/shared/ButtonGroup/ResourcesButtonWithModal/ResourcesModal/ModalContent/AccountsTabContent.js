import React from 'react'
import _ from 'lodash'
import styled from "@emotion/styled"
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles';
import { transparentize, mix } from 'polished'

import { Colors, Spacing } from '../../../../../../../utils/pulseStyles'

// ! temp: reuse components from TreatmentPlansTabContent
import {
  ActiveRow,
  InactiveRow,
  UnorderedList,
} from './TreatmentPlansTabContent/styledComponents'

const AccountsPanelContainer = styled.div({
  borderRight: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  borderTop: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  maxHeight: 700,
  overflow: 'auto',
  background: Colors.WHITE,
})

const ToggleButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  position: 'sticky',
  top: 0,
  padding: `${Spacing.SMALL} ${Spacing.LARGE}`,
  background: '#F0F6F9',
  borderBottom: `2px solid ${transparentize(0.9, Colors.BLACK)}`,
  zIndex: 100,
})

const ToggleButton = styled.button({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 10,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textTransform: 'uppercase',
  ':active': {
    outline: 'none'
  },
  ':focus': {
    outline: 'none'
  },
}, props => ({
  color: props.color,
  background: transparentize(0.85, props.color),
  ':hover': {
    background: transparentize(0.7, props.color),
  },
}))

const AccountRowItem = styled.div({
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  paddingLeft: Spacing.NORMAL,
  ':hover': {
    background: transparentize(0.92, Colors.BLACK),
  }
})

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

const AccountsTabContent = ({
  baseAccounts,
  accounts,
  setStagedAccounts,
}) => {
  const enabledAccountsById = _.keyBy(accounts, '_id')

  const enableAccount = account => {
    const accountsPlusNewAccount = accounts.concat({ _id: account._id })
    setStagedAccounts(accountsPlusNewAccount)
  }

  const disableAccount = account => {
    const accountsMinusRemovedAccount = accounts.filter(
      ({ _id }) => account._id !== _id
    )

    setStagedAccounts(accountsMinusRemovedAccount)
  }

  const enableAllAccounts = () => setStagedAccounts(baseAccounts)

  const disableAllAccounts = () => setStagedAccounts([])

  const [
    enabledAccounts,
    disabledAccounts,
  ] = _.partition(baseAccounts, account => enabledAccountsById[account._id])
  
  return (
    <div style={{ maxHeight: 700, overflow: 'auto', background: Colors.WHITE }}>
      <ToggleButtonContainer>
        <ToggleButton
          onClick={enableAllAccounts}
          color={Colors.GREEN}
          style={{ marginRight: Spacing.LARGE }}
        >
          Toggle on All Accounts
        </ToggleButton>
        <ToggleButton
          onClick={disableAllAccounts}
          color={Colors.MEDIUM_GRAY_2}
        >
          Toggle off All Accounts
        </ToggleButton>
      </ToggleButtonContainer>

      <AccountsPanelContainer>
        <ActiveRow>ACTIVE ({enabledAccounts.length})</ActiveRow>
        <UnorderedList>
          {
            enabledAccounts.map(account => (
              <AccountRowItem key={account._id}>
                <PhoenixSwitch
                  checked
                  onChange={() => disableAccount(account)}
                  value={account._id}
                />
                <span style={{ fontWeight: 500 }}>{account.organization} ({account.slug})</span>
              </AccountRowItem>
            ))
          }
        </UnorderedList>

        <InactiveRow>INACTIVE ({disabledAccounts.length})</InactiveRow>
        <UnorderedList>
          {
            disabledAccounts.map(account => (
              <AccountRowItem key={account._id}>
                <PhoenixSwitch
                  checked={false}
                  onChange={() => enableAccount(account)}
                  value={account._id}
                />
                <span style={{ fontWeight: 500 }}>{account.organization} ({account.slug})</span>
              </AccountRowItem>
            ))
          }
        </UnorderedList>
      </AccountsPanelContainer>
    </div>
  )
}

export default AccountsTabContent

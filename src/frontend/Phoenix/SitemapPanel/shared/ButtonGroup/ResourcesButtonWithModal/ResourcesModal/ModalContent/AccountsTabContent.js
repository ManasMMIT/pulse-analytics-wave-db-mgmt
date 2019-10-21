import React from 'react'
import _ from 'lodash'
import Switch from '@material-ui/core/Switch'

const AccountsTabContent = ({
  baseAccounts,
  accounts,
  setStagedAccounts,
}) => {
  const enabledAccountsById = _.keyBy(accounts, '_id')

  const enableAccount = account => {
    const accountsPlusNewAccount = accounts.concat(account)
    setStagedAccounts(accountsPlusNewAccount)
  }

  const disableAccount = account => {
    const accountsMinusRemovedAccount = accounts.filter(
      ({ _id }) => account._id !== _id
    )

    setStagedAccounts(accountsMinusRemovedAccount)
  }

  const accountsList = baseAccounts.map(account => {
    let checked = false
    if (enabledAccountsById[account._id]) checked = true

    return (
      <div key={account._id}>
        <span>{account.organization}</span>
        <Switch
          checked={checked}
          onChange={e => {
            e.target.checked ? enableAccount(account) : disableAccount(account)
          }}
          color="primary"
          value={account._id}
        />
      </div>
    )
  })

  return (
    <div style={{ maxHeight: 600, overflow: 'auto' }}>
      {accountsList}
    </div>
  )
}

export default AccountsTabContent

import React from 'react'
import styled from "@emotion/styled"
import { transparentize } from 'polished'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  GET_PAYER_ORGANIZATIONS,
} from 'frontend/api/queries'
import Card from 'frontend/components/Card'
import Spinner from 'frontend/components/Spinner'

// ! temp: reuse components from TreatmentPlansTabContent
import {
  ActiveRow,
  InactiveRow,
  UnorderedList,
} from '../../../../../../Phoenix/SitemapPanel/shared/ButtonGroup/ResourcesButtonWithModal/ResourcesModal/ModalContent/TreatmentPlansTabContent/styledComponents'

import OrionSwitch from './OrionSwitch'

import { Colors, Spacing } from '../../../../../../utils/pulseStyles'

const AccountRowItem = styled.div({
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  paddingLeft: Spacing.NORMAL,
  ':hover': {
    background: transparentize(0.92, Colors.BLACK),
  }
})

const PayerSelectionPanel = ({
  payerIds,
  setPayerIds,
}) => {
  const { data, loading } = useQuery(GET_PAYER_ORGANIZATIONS)

  let payerOrganizations = []
  if (!loading) {
    payerOrganizations = data.payerOrganizations
  }

  const isPayerChecked = payerId => payerIds[payerId]

  const handleToggle = payerId => {
    const isChecked = isPayerChecked(payerId)

    if (isChecked) {
      const clonedPayerIds = _.cloneDeep(payerIds)
      delete clonedPayerIds[payerId]

      setPayerIds(clonedPayerIds)
    } else {
      setPayerIds({
        ...payerIds,
        [payerId]: true,
      })
    }
  }

  const [
    enabledAccounts,
    disabledAccounts,
  ] = _.partition(payerOrganizations, account => payerIds[account._id])

  return (
    <Card title="Payers">
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        <ActiveRow>ACTIVE ({enabledAccounts.length})</ActiveRow>
        <UnorderedList>
          {
            enabledAccounts.map(account => (
              <AccountRowItem key={account._id}>
                <span>{account.organization} ({account.slug})</span>
                <OrionSwitch
                  _id={account._id}
                  isChecked={isPayerChecked(account._id)}
                  handleToggle={handleToggle}
                />
              </AccountRowItem>
            ))
          }
        </UnorderedList>

        <InactiveRow>INACTIVE ({disabledAccounts.length})</InactiveRow>
        <UnorderedList>
          {
            disabledAccounts.map(account => (
              <AccountRowItem key={account._id}>
                <span>{account.organization} ({account.slug})</span>
                <OrionSwitch
                  _id={account._id}
                  isChecked={isPayerChecked(account._id)}
                  handleToggle={handleToggle}
                />
              </AccountRowItem>
            ))
          }
        </UnorderedList>

        {
          loading && <Spinner />
        }
      </div>
    </Card>
  )
}

export default PayerSelectionPanel

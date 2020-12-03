import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { UnderlinedTabs } from '../../../../../../../components/Tabs'
import AccountsTabContent from './AccountsTabContent'
import SubmitButton from './SubmitButton'
import TreatmentPlansTabContent from './TreatmentPlansTabContent'
import trimTreatmentPlansToIds from './trim-treatment-plans-to-ids'

import { Colors, Spacing } from '../../../../../../../utils/pulseStyles'

const TABS_DATA = ['Treatment Plans', 'Accounts']

const tabsContainerStyle = {
  borderTop: `2px solid ${transparentize(0.9, Colors.BLACK)}`,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  paddingLeft: Spacing.NORMAL,
  paddingRight: Spacing.NORMAL,
}

const activeTabStyle = {
  borderBottomColor: Colors.PRIMARY,
  color: Colors.PRIMARY,
}

const CancelButton = styled.button({
  background: transparentize(0.85, Colors.RED),
  border: 'none',
  borderRadius: 4,
  color: Colors.RED,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  marginRight: Spacing.LARGE,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textTransform: 'uppercase',
  ':hover': {
    background: transparentize(0.7, Colors.RED),
  },
  ':active': {
    outline: 'none',
  },
  ':focus': {
    outline: 'none',
  },
})

const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: Spacing.LARGE,
})

const ModalTitle = styled.div({
  display: 'flex',
})

const ParentNodeTitle = styled.h2({
  fontSize: 14,
  fontWeight: 700,
  color: Colors.BLACK,
})

const CurrentNodeTitle = styled.h2({
  fontSize: 14,
  fontWeight: 700,
  color: Colors.PRIMARY,
})

const ModalContent = ({
  teamId,
  nodeId,
  nodeType,
  currentNode,
  parentNode,
  enabledResources,
  resources, // available treatment plans and accounts to diff against
  closeModal,
}) => {
  const [state, setState] = useState(enabledResources)

  const { treatmentPlans, accounts } = state

  const {
    treatmentPlans: baseTreatmentPlans,
    accounts: baseAccounts,
  } = resources

  // must manually merge state to achieve old merge behavior
  // see: https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables
  const setStagedAccounts = (accounts) => {
    setState((prevState) => ({ ...prevState, accounts }))
  }

  const setStagedTreatmentPlans = (treatmentPlans) => {
    treatmentPlans = trimTreatmentPlansToIds(treatmentPlans)
    setState((prevState) => ({ ...prevState, treatmentPlans }))
  }

  const stageAllTreatmentPlans = () =>
    setStagedTreatmentPlans(baseTreatmentPlans)

  const unstageAllTreatmentPlans = () => setStagedTreatmentPlans([])

  return (
    <>
      <ModalHeader>
        <ModalTitle>
          <ParentNodeTitle>{parentNode.text.title} / &nbsp;</ParentNodeTitle>
          <CurrentNodeTitle>{currentNode.text.title}</CurrentNodeTitle>
        </ModalTitle>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CancelButton onClick={closeModal}>Cancel</CancelButton>
          <SubmitButton
            updatedResources={state}
            nodeId={nodeId}
            teamId={teamId}
            afterSubmitHook={closeModal}
          />
        </div>
      </ModalHeader>

      <UnderlinedTabs
        tabsData={TABS_DATA}
        tabsContainerStyle={tabsContainerStyle}
        activeTabStyle={activeTabStyle}
      >
        <TreatmentPlansTabContent
          stageAllTreatmentPlans={stageAllTreatmentPlans}
          unstageAllTreatmentPlans={unstageAllTreatmentPlans}
          baseTreatmentPlans={baseTreatmentPlans}
          treatmentPlans={treatmentPlans}
          setStagedTreatmentPlans={setStagedTreatmentPlans}
        />
        <AccountsTabContent
          baseAccounts={baseAccounts}
          accounts={accounts}
          setStagedAccounts={setStagedAccounts}
        />
      </UnderlinedTabs>
    </>
  )
}

ModalContent.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  resources: PropTypes.object,
  closeModal: PropTypes.func,
}

ModalContent.defaultProps = {
  nodeId: null,
  nodeType: null,
  resources: {},
  closeModal: null,
}

export default ModalContent

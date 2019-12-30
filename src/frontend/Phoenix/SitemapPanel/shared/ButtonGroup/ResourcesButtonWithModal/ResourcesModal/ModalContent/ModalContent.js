import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UnderlinedTabs } from '../../../../../../../components/Tabs'
import RegionalBreakdownTabContent from './RegionalBreakdownTabContent'
import AccountsTabContent from './AccountsTabContent'
import SubmitButton from './SubmitButton'
import TreatmentPlansTabContent from './TreatmentPlansTabContent'
import trimTreatmentPlansToIds from './trim-treatment-plans-to-ids'

const TABS_DATA = [
  'Treatment Plans',
  'Accounts',
  'Regional Breakdown',
]

const cancelButtonStyle = {
  color: '#EE5340',
  fontWeight: 600,
  fontSize: 14,
  padding: 6,
  cursor: 'pointer',
  marginRight: 16,
}

const ModalContent = ({
  teamId,
  nodeId,
  nodeType,
  enabledResources,
  toolRegionalBreakdown,
  resources, // available treatment plans and accounts to diff against
  closeModal,
}) => {
  const [state, setState] = useState(enabledResources)

  const {
    treatmentPlans,
    accounts,
    regionalBreakdown,
  } = state

  const {
    treatmentPlans: baseTreatmentPlans,
    accounts: baseAccounts,
  } = resources

  // must manually merge state to achieve old merge behavior
  // see: https://reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables
  const setStagedAccounts = accounts => {
    setState(prevState => ({ ...prevState, accounts }))
  }

  const setStagedTreatmentPlans = treatmentPlans => {
    treatmentPlans = trimTreatmentPlansToIds(treatmentPlans)
    setState(prevState => ({ ...prevState, treatmentPlans }))
  }

  const setStagedRegionalBreakdown = regionalBreakdown => {
    setState(prevState => ({ ...prevState, regionalBreakdown }))
  }

  return (
    <>
      <div style={{ marginLeft: 'auto' }}>
        <button
          onClick={closeModal}
          style={cancelButtonStyle}
        >
          Cancel
        </button>

        <SubmitButton
          updatedResources={state}
          nodeId={nodeId}
          teamId={teamId}
          afterSubmitHook={closeModal}
        />
      </div>

      <UnderlinedTabs tabsData={TABS_DATA}>
        <TreatmentPlansTabContent
          baseTreatmentPlans={baseTreatmentPlans}
          treatmentPlans={treatmentPlans}
          setStagedTreatmentPlans={setStagedTreatmentPlans}
        />
        <AccountsTabContent
          baseAccounts={baseAccounts}
          accounts={accounts}
          setStagedAccounts={setStagedAccounts}
        />
        <RegionalBreakdownTabContent
          nodeId={nodeId}
          nodeType={nodeType}
          toolRegionalBreakdown={toolRegionalBreakdown}
          setStagedRegionalBreakdown={setStagedRegionalBreakdown}
          regionalBreakdown={regionalBreakdown}
        />
      </UnderlinedTabs>
    </>
  )
}

ModalContent.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  resources: PropTypes.object,
  toolRegionalBreakdown: PropTypes.array,
  closeModal: PropTypes.func,
}

ModalContent.defaultProps = {
  nodeId: null,
  nodeType: null,
  resources: {},
  closeModal: null,
}

export default ModalContent

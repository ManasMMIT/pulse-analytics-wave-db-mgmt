import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { UnderlinedTabs } from '../../../../../../../components/Tabs'
import RegionalBreakdownTabContent from './RegionalBreakdownTabContent'
import AccountsTabContent from './AccountsTabContent'
import SubmitButton from './SubmitButton'
// import TreatmentPlansTabContent from './TreatmentPlansTabContent'

const TABS_DATA = [
  // 'Treatment Plans',
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
  handlers,
  selectedTeamNode,
  enabledResources,
  resources, // available treatment plans and accounts to diff against
  closeModal,
}) => {
  const [state, setState] = useState(enabledResources)

  const {
    // treatmentPlans,
    accounts,
    // regionalBreakdown,
  } = state

  const {
    // treatmentPlans,
    accounts: baseAccounts,
    // regionalBreakdown,
  } = resources

  const setStagedAccounts = accounts => setState({ accounts })

  // TODO: Deprecate managing resources on the node itself in favor
  // of managing resources on the team level.
  const regionalBreakdownResources = selectedTeamNode
    ? selectedTeamNode.resources
    : {}

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
        {/* <TreatmentPlansTabContent
          treatmentPlans={treatmentPlans}
          setTreatmentPlans={setTreatmentPlans}
        /> */}
        <AccountsTabContent
          baseAccounts={baseAccounts}
          accounts={accounts}
          setStagedAccounts={setStagedAccounts}
        />
        <RegionalBreakdownTabContent
          nodeId={nodeId}
          nodeType={nodeType}
          handlers={handlers}
          resources={regionalBreakdownResources}
        />
      </UnderlinedTabs>
    </>
  )
}

ModalContent.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  handlers: PropTypes.object,
  selectedTeamNode: PropTypes.object,
  resources: PropTypes.object,
  closeModal: PropTypes.func,
}

ModalContent.defaultProps = {
  nodeId: null,
  nodeType: null,
  handlers: {},
  selectedTeamNode: {},
  resources: {},
  closeModal: null,
}

export default ModalContent

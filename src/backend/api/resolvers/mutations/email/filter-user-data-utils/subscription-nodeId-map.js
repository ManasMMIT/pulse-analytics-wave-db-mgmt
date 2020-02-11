// tool Ids
const PATHWAYS_TOOL_ID = '5ba01a27-c738-4ef3-b229-50bae3855f6e'
const APM_TOOL_ID = '69761bab-9e5b-42f2-9470-2036352d7389'
const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'
const PAYER_ACCOUNTS_TOOL_ID = '25fde1b5-4c24-4d8a-ad89-aa4afaca4c52'
const PROVIDERS_TOOL_ID = '997a3c4e-54ef-4933-8ab0-aa2a590795f0'
const SICKLE_CELL_TOOL_ID = 'd6d05995-7054-45f7-8184-969692200852'

// subscription Ids
const PATHWAYS_MONTHLY_ALERT_ID = 'c89a5624-c3e1-45fd-8e7f-615256f3b2f2'

const subscriptionNodeIdMap = {
  [PATHWAYS_MONTHLY_ALERT_ID]: PATHWAYS_TOOL_ID,
}

module.exports = subscriptionNodeIdMap

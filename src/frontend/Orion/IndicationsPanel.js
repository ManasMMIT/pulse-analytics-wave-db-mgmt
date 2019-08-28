import React from 'react'

import Panel from '../Phoenix/shared/Panel'
import { GET_SOURCE_INDICATIONS } from './../api/queries'
import { CREATE_INDICATION } from '../api/mutations'
import TextFormButton from '../Phoenix/shared/TextForm/Button'

const CREATE_BUTTON_TXT = 'Create Indication'

const CREATE_MODAL_TITLE = 'Create New Indication'

const createButtonStyle = {
  background: "#234768",
  color: 'white',
}

const createButton = (
  <TextFormButton
    modalTitle={CREATE_MODAL_TITLE}
    buttonLabel={CREATE_BUTTON_TXT}
    buttonStyle={createButtonStyle}
    mutationDoc={CREATE_INDICATION}
  />
)

// const panelItemConfig = {
  // selectEntityMutationDoc: SELECT_USER,
  // style: defaultPanelItemStyle,
  // activeStyle: activePanelItemStyle,
  // buttonGroupCallback,
  // ! Note: inactiveStyle not needed until hover effects differ
  // ! between active and inactive states
  // inactiveStyle: inactivePanelItemStyle,
// }

const IndicationsPanel = () => (
  <Panel
    // style={panelStyle}
    title="Indications"
    createButton={createButton}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_INDICATIONS },
    }}
    // panelItemConfig={panelItemConfig}
  />
)

export default IndicationsPanel

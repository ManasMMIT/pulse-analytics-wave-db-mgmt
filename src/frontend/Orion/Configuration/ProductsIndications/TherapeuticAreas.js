import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import TherapeuticAreaModalButton from 'frontend/components/BusinessObjectModal/TherapeuticAreaModal/TherapeuticAreaModalButton'
import TherapeuticAreaModal from 'frontend/components/BusinessObjectModal/TherapeuticAreaModal'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import createButtonStyle from 'frontend/Orion/Organizations/Obm/create-button-style'

import { GET_THERAPEUTIC_AREAS } from '../../../api/queries'

const PAGE_TITLE = 'Therapeutic Areas'
const CREATE_BTN_TXT = 'Create Therapeutic Area'

const MODAL_TO_COL_MAP = {
  name: { Modal: TherapeuticAreaModal, idKey: '_id' },
}

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
  },
]

const TherapeuticAreas = () => {
  const { data, loading } = useQuery(GET_THERAPEUTIC_AREAS)

  if (loading) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <TherapeuticAreaModalButton buttonStyle={createButtonStyle}>
          <Icon
            iconName="add"
            color1={Color.WHITE}
            width={16}
            style={{ marginRight: 8 }}
          />
          {CREATE_BTN_TXT}
        </TherapeuticAreaModalButton>
      </PanelHeader>

      <Table
        width={CONFIG_TABLE_WIDTH}
        data={Object.values(data)[0]}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{
          filename: 'TherapeuticAreas',
          sheetName: 'Therapeutic Areas',
        }}
      />
    </div>
  )
}

export default TherapeuticAreas

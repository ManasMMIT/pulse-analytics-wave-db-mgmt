import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import Modal from 'frontend/components/Modal'
import QoaForm from './QoaForm'

import { GET_SOURCE_QUALITY_OF_ACCESS_SCORES } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import Table from 'frontend/components/Table'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import Button from 'frontend/components/Button'

import Color from 'frontend/utils/color'

const CREATE_BUTTON_TXT = 'Create Quality of Access'

const CREATE_MODAL_TITLE = 'Create New Quality of Access'
const EDIT_MODAL_TITLE = 'Edit Quality of Access Scores'
const QoaModal = ({ entityId, closeModal }) => {
  const title = entityId ? EDIT_MODAL_TITLE : CREATE_MODAL_TITLE

  return (
    <Modal title={title} show={true} handleClose={closeModal}>
      <QoaForm entityId={entityId} closeModal={closeModal} />
    </Modal>
  )
}

const MODAL_TO_COL_MAP = {
  editAccessor: {
    Modal: QoaModal,
    idKey: '_id',
  },
}

const COLUMNS = [
  {
    Header: 'Access',
    accessor: 'access',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 400,
  },
  {
    Header: 'Access Tiny',
    accessor: 'accessTiny',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Sort Order',
    accessor: 'sortOrder',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Score',
    accessor: 'score',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Color',
    accessor: 'color',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({
      row: {
        original: { color },
      },
    }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {color}
        <div
          style={{ marginLeft: 12, background: color, width: 48, height: 12 }}
        />
      </div>
    ),
  },
  {
    Header: '',
    disableSortBy: true,
    disableFilters: true,
    accessor: 'editAccessor',
    Cell: 'Edit',
  },
]

const PAGE_TITLE = 'Payer Quality of Access Scores'

const QualityAccessScorePanel = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { data, loading } = useQuery(GET_SOURCE_QUALITY_OF_ACCESS_SCORES)

  if (loading) return null

  const { qualityOfAccessScores } = data

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color={Color.PRIMARY}
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            {CREATE_BUTTON_TXT}
          </Button>
          {isCreateModalOpen && (
            <QoaModal closeModal={() => setIsCreateModalOpen(false)} />
          )}
        </div>
      </PanelHeader>
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={qualityOfAccessScores}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{
          filename: 'Payer-Quality-of-Access-Scores',
          sheetName: 'qoa scores',
        }}
      />
    </div>
  )
}

export default QualityAccessScorePanel

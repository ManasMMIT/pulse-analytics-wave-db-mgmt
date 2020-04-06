import React from 'react'
import styled from '@emotion/styled'

import Panel from '../../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../../shared/ModalButtonWithForm'
import DeleteButton from '../../shared/DeleteButton'
import CopyOneOfStringButton from '../../shared/CopyOneOfStringButton'
import ProductsSelect from './ProductsSelect'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import {
  GET_SOURCE_REGIMENS,
  GET_SOURCE_INDICATIONS,
  GET_SELECTED_REGIMENS,
} from '../../../api/queries'

import {
  CREATE_REGIMEN,
  UPDATE_SOURCE_REGIMEN,
  DELETE_SOURCE_REGIMEN,
} from '../../../api/mutations'

import { Colors, Spacing } from '../../../utils/pulseStyles'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Regimen'

const CREATE_MODAL_TITLE = 'Create New Regimen'

const FormLabel = styled.div({
  textTransform: 'capitalize',
  marginBottom: Spacing.SMALL,
  fontWeight: 700,
})

const buttonStyle = {
  background: "#234768",
  color: 'white',
}

const getInputFields = (state, handleChange) => {
  const products = state.input.products || []

  return (
    <>
      <div style={{ marginBottom: Spacing.LARGE }}>
        <FormLabel>Name:</FormLabel>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={state.input.name || ''}
        />
      </div>

      <div>
        <FormLabel>Products:</FormLabel>
        <ProductsSelect
          products={products}
          handleChange={handleChange}
        />
      </div>
    </>
  )
}

const headerChildren = (
  <div>
    <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      mutationDoc={CREATE_REGIMEN}
      refetchQueries={[{ query: GET_SOURCE_REGIMENS }]}
      getInputFields={getInputFields}
    />

    <CopyOneOfStringButton
      queryDoc={GET_SOURCE_REGIMENS}
      dataKey="regimens"
      datumKey="name"
    />
  </div>
)

const buttonGroupCallback = regimen => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Regimen"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      data={{ input: regimen }}
      mutationDoc={UPDATE_SOURCE_REGIMEN}
      refetchQueries={[
        { query: GET_SOURCE_REGIMENS },
        { query: GET_SOURCE_INDICATIONS },
      ]}
      afterMutationHook={(cache, { data }) => {
        const updatedRegimen = data.updateSourceRegimen

        const { selectedRegimens } = cache.readQuery({ query: GET_SELECTED_REGIMENS })

        const newRegimens = selectedRegimens.map(regimen => {
          if (regimen._id === updatedRegimen._id) return updatedRegimen
          return regimen
        })

        cache.writeQuery({
          query: GET_SELECTED_REGIMENS,
          data: { selectedRegimens: newRegimens },
        })
      }}
      getInputFields={getInputFields}
    />

    <DeleteButton
      itemId={regimen._id}
      mutationDoc={DELETE_SOURCE_REGIMEN}
      refetchQueries={[
        { query: GET_SOURCE_REGIMENS },
        { query: GET_SOURCE_INDICATIONS },
      ]}
      afterMutationHook={(cache, { data }) => {
        const { _id: deletedRegimenId } = data.deleteSourceRegimen

        const { selectedRegimens } = cache.readQuery({ query: GET_SELECTED_REGIMENS })

        const updatedRegimens = selectedRegimens.filter(({ _id }) => _id !== deletedRegimenId)

        cache.writeQuery({
          query: GET_SELECTED_REGIMENS,
          data: { selectedRegimens: updatedRegimens },
        })
      }}
    />
  </>
)

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 24px',
  color: Colors.BLACK,
  fontWeight: 600,
  fontSize: 12,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
}

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ name }) => name,
}

const RegimensPanel = () => (
  <Panel
    title="Regimens"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: Colors.WHITE,
      borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_REGIMENS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default RegimensPanel

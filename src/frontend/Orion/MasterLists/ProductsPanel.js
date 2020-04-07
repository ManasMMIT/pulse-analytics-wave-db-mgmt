import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from '../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../shared/ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'
import CreatableMultiSelect from '../shared/CreatableMultiSelect';

import { StyledInput, FormLabel, createObjectModalStyle } from './styledComponents'

import { GET_SOURCE_PRODUCTS, GET_SOURCE_REGIMENS } from '../../api/queries'

import {
  CREATE_PRODUCT,
  UPDATE_SOURCE_PRODUCT,
  DELETE_SOURCE_PRODUCT,
} from '../../api/mutations'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Product'

const CREATE_MODAL_TITLE = 'Create New Product'

const createButtonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
}

const getInputFields = (state, handleChange) => {
  const tags = state.input.tags || []

  return (
    <>
      <div>
        <FormLabel>Generic Name:</FormLabel>
        <StyledInput
          type="text"
          name="nameGeneric"
          onChange={handleChange}
          value={state.input.nameGeneric || ''}
        />
      </div>
      <div style={{ marginTop: Spacing.S5 }}>
        <FormLabel>Brand Name:</FormLabel>
        <StyledInput
          type="text"
          name="nameBrand"
          onChange={handleChange}
          value={state.input.nameBrand || ''}
        />
      </div>
      <div style={{ marginTop: Spacing.S5 }}>
        <FormLabel>Tags:</FormLabel>
        <CreatableMultiSelect
          value={tags.map(str => ({ value: str, label: str }))}
          handleChange={arrOfVals => {
            const newTags = arrOfVals.map(({ value }) => value)

            // ! HACK: Mock HTML event.target structure to get tags
            // ! able to written into Form's local state by handleChange
            handleChange({ target: { name: 'tags', value: newTags } })
          }}
        />
      </div>
    </>
  )
}

const headerChildren = (
  <ModalButtonWithForm
    modalTitle={CREATE_MODAL_TITLE}
    buttonLabel={CREATE_BUTTON_TXT}
    buttonStyle={createButtonStyle}
    modalStyle={createObjectModalStyle}
    mutationDoc={CREATE_PRODUCT}
    refetchQueries={[{ query: GET_SOURCE_PRODUCTS }]}
    getInputFields={getInputFields}
  />
)

const buttonGroupCallback = ({
  __typename, // ! remove __typename because GraphQL throws error when attempting to fire mutation
  ...product
}) => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Product"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      data={{ input: product }}
      mutationDoc={UPDATE_SOURCE_PRODUCT}
      refetchQueries={[
        { query: GET_SOURCE_PRODUCTS },
        { query: GET_SOURCE_REGIMENS }, // refresh regimens cache after update
      ]}
      getInputFields={getInputFields}
    />

    <DeleteButton
      itemId={product._id}
      mutationDoc={DELETE_SOURCE_PRODUCT}
      refetchQueries={[
        { query: GET_SOURCE_PRODUCTS },
        { query: GET_SOURCE_REGIMENS }, // refresh regimens cache after delete
      ]}
    />
  </>
)

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 24px',
  color: Color.BLACK,
  fontWeight: 600,
  fontSize: 12,
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  ':hover': {
    background: transparentize(0.95, Color.BLACK),
  }
}

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ nameBrand }) => nameBrand,
  label2Callback: ({ nameGeneric }) => nameGeneric,
}

const ProductsPanel = () => (
  <Panel
    title="Products"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: Color.WHITE,
      borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_PRODUCTS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default ProductsPanel

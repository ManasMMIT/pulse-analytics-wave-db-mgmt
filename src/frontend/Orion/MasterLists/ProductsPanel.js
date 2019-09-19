import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from '../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../shared/ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'
import CreatableMultiSelect from '../shared/CreatableMultiSelect';

import { GET_SOURCE_PRODUCTS, GET_SOURCE_REGIMENS } from '../../api/queries'

import {
  CREATE_PRODUCT,
  UPDATE_SOURCE_PRODUCT,
  DELETE_SOURCE_PRODUCT,
} from '../../api/mutations'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Product'

const CREATE_MODAL_TITLE = 'Create New Product'

const createButtonStyle = {
  background: "#234768",
  color: 'white',
}

const getInputFields = (state, handleChange) => {
  const tags = state.input.tags || []

  return (
    <>
      <div>
        <span>Generic Name:</span>
        <input
          type="text"
          name="nameGeneric"
          onChange={handleChange}
          value={state.input.nameGeneric || ''}
        />
      </div>
      <div>
        <span>Brand Name:</span>
        <input
          type="text"
          name="nameBrand"
          onChange={handleChange}
          value={state.input.nameBrand || ''}
        />
      </div>

      <div>
        <span>Tags:</span>
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
  padding: '17px 20px',
  color: '#0E2539',
  fontWeight: 600,
  fontSize: 12,
  marginTop: 10,
  borderTop: '1px solid rgb(182, 185, 188)',
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
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_PRODUCTS },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default ProductsPanel

import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import Panel from 'frontend/components/Panel'
import { GET_SOURCE_TREATMENT_PLANS, GET_BOOKS } from 'frontend/api/queries'

import { DELETE_BOOK, CREATE_BOOK, UPDATE_BOOK } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import ModalButtonWithForm from '../../shared/ModalButtonWithForm'
import DeleteButton from '../../shared/DeleteButton'
import DeleteModalWarning from '../../shared/DeleteModalWarning'

import {
  StyledInput,
  FormLabel,
  createObjectModalStyle,
  defaultPanelItemStyle,
} from '../../Organizations/styledComponents'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Book of Business'

const CREATE_MODAL_TITLE = 'Create New Book of Business'

const buttonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
}

const getInputFields = (state, handleChange) => (
  <>
    <div style={{ marginBottom: Spacing.S5 }}>
      <FormLabel>Name:</FormLabel>
      <StyledInput
        type="text"
        name="name"
        onChange={handleChange}
        value={state.input.name || ''}
      />
    </div>
  </>
)

const headerChildren = (
  <div>
    <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      modalStyle={createObjectModalStyle}
      mutationDoc={CREATE_BOOK}
      refetchQueries={[{ query: GET_BOOKS }]}
      getInputFields={getInputFields}
    />
  </div>
)

const getButtonGroupCallback = (treatmentPlansByBook) => (book) => (
  <>
    <span
      style={{
        padding: Spacing.S2,
        margin: Spacing.S7,
        background: Color.LIGHT_BLUE_GRAY_1,
        borderRadius: 5,
        color: Color.ORION,
      }}
    >
      {`(${(treatmentPlansByBook[book.name] || []).length} Treatment Plans)`}
    </span>
    <ModalButtonWithForm
      modalTitle="Edit Book of Business"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      modalStyle={createObjectModalStyle}
      data={{ input: book }}
      mutationDoc={UPDATE_BOOK}
      refetchQueries={[{ query: GET_BOOKS }]}
      getInputFields={getInputFields}
    />
    <DeleteButton
      itemId={book._id}
      mutationDoc={DELETE_BOOK}
      modalText={<DeleteModalWarning />}
      refetchQueries={[{ query: GET_BOOKS }]}
    />
  </>
)

const BooksPanel = () => {
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  if (loading) return null

  const { treatmentPlans } = data

  const treatmentPlansByBook = _.groupBy(treatmentPlans, 'book')

  const buttonGroupCallback = getButtonGroupCallback(treatmentPlansByBook)

  const panelItemConfig = {
    style: defaultPanelItemStyle,
    buttonGroupCallback,
    label1Callback: ({ name }) => name,
  }

  return (
    <Panel
      title="Books of Business"
      headerChildren={headerChildren}
      headerContainerStyle={{
        background: Color.WHITE,
        borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
      }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_BOOKS },
      }}
      panelItemConfig={panelItemConfig}
    />
  )
}

export default BooksPanel

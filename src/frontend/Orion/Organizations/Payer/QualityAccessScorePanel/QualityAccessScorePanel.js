import React from 'react'
import styled from '@emotion/styled'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import Panel from './../../../../components/Panel'
import ModalButtonWithForm from './../../../shared/ModalButtonWithForm'
// import DeleteButton from '../../../../shared/DeleteButton'
import CopyOneOfStringButton from './../../../shared/CopyOneOfStringButton'
import { GET_SOURCE_QUALITY_OF_ACCESS_SCORES } from './../../../../api/queries'
import ColorBox from './../../../shared/ColorBox'
import QoaForm from './QoaForm'
import { defaultPanelItemStyle } from './../../styledComponents'

import {
  CREATE_QUALITY_OF_ACCESS_SCORE,
  UPDATE_QUALITY_OF_ACCESS_SCORE,
  // DELETE_QUALITY_OF_ACCESS_SCORE,
} from './../../../../api/mutations'

import Color from './../../../../utils/color'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_BUTTON_TXT = 'Create Quality of Access'

const CREATE_MODAL_TITLE = 'Create New Quality of Access'

const BoxContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const BoxLabel = styled.span({
  fontSize: 10,
  color: Color.MEDIUM_GRAY_2,
  margin: '0 8px 0 16px',
})

const buttonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
}

const modalStyle = {
  height: '90%',
  maxHeight: '90%',
  minWidth: 600,
  justifyContent: 'flex-start',
}

const getInputFields = (state, handleChange) => (
  <QoaForm
    state={state}
    handleChange={handleChange}
  />
)

const headerChildren = (
  <div>
    <ModalButtonWithForm
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonStyle={buttonStyle}
      modalStyle={modalStyle}
      mutationDoc={CREATE_QUALITY_OF_ACCESS_SCORE}
      refetchQueries={[{ query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES }]}
      getInputFields={getInputFields}
    />

    <CopyOneOfStringButton
      queryDoc={GET_SOURCE_QUALITY_OF_ACCESS_SCORES}
      dataKey="qualityOfAccessScores"
      datumKey="access"
    />
  </div>
)

const buttonGroupCallback = entity => {
  const input = {
    ...entity,
    score: String(entity.score),
    sortOrder: String(entity.sortOrder),
  }

  return (
    <>
      <ModalButtonWithForm
        modalTitle="Edit Quality of Access Score"
        buttonLabel={editIcon}
        buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
        modalStyle={modalStyle}
        data={{ input }}
        mutationDoc={UPDATE_QUALITY_OF_ACCESS_SCORE}
        refetchQueries={[{ query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES }]}
        getInputFields={getInputFields}
      />
      {/* <DeleteButton
        itemId={entity._id}
        mutationDoc={DELETE_QUALITY_OF_ACCESS_SCORE}
        refetchQueries={[{ query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES }]}
      /> */}
    </>
  )
}

const label1StyleWrapper = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
}

const panelItemConfig = {
  style: defaultPanelItemStyle,
  buttonGroupCallback,
  label1Callback: ({ access, score, color, sortOrder }) => (
    <div style={label1StyleWrapper}>
      <div style={{ fontSize: 12, fontWeight: 700, width: 500, }}>
        {access}
      </div>
      <BoxContainer>
        <BoxLabel>Access Score</BoxLabel>
        <ColorBox
          label={score}
          boxColor={color}
        />
      </BoxContainer>
      <BoxContainer>
        <BoxLabel>Sort Order</BoxLabel>
        <ColorBox
          label={sortOrder}
          boxColor={Color.MEDIUM_GRAY_2}
        />
      </BoxContainer>
    </div>
  )
}

const QualityAccessScorePanel = () => (
  <Panel
    title="Quality of Access Scores"
    headerChildren={headerChildren}
    headerContainerStyle={{
      background: Color.WHITE,
      borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`
    }}
    queryDocs={{
      fetchAllQueryProps: { query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES },
    }}
    panelItemConfig={panelItemConfig}
  />
)

export default QualityAccessScorePanel

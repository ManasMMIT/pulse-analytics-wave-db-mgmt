import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { transparentize } from 'polished'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import useTreatmentPlanParts from 'frontend/hooks/useTreatmentPlanParts'
import { GET_SOURCE_TREATMENT_PLANS } from 'frontend/api/queries'

import TreatmentPlanModalButton from './TreatmentPlanModalButton'
import Spinner from '../../../../Phoenix/shared/Spinner'

import {
  DELETE_SOURCE_TREATMENT_PLAN,
  CREATE_SOURCE_TREATMENT_PLAN,
  // UPDATE_SOURCE_TREATMENT_PLAN,
} from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

import DeleteButton from '../../../shared/DeleteButton'

import {
  StyledInput,
  FormLabel,
  createObjectModalStyle,
} from '../../../Organizations/styledComponents'

const PHOENIX_NOTE = 'If you add a new indication and / or regimen to the Treatment Plan list, make sure to add them to the Phoenix Indication + Regimen list so that they are able to be activated on Phoenix.'
// const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const CREATE_MODAL_TITLE = 'Create Treatment Plan'

const CREATE_BUTTON_TXT = 'Create Treatment Plan'

const Wrapper = styled.div({
  flex: 1,
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
}, props => ({
  ...props.style,
}))

const SHARED_BORDER = `1px solid ${transparentize(0.9, Color.BLACK)}`

const COLUMN_WIDTH = `${100 / 7}%`

const TreatmentPlansPanel = () => {
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  const {
    data: treatmentPlanParts,
    loading: treatmentPlanPartsLoading,
  } = useTreatmentPlanParts()

  let [searchInputValue, setSearchInputValue] = useState('')

  let treatmentPlans = []
  if (!loading) {
    treatmentPlans = data.treatmentPlans

    if (searchInputValue.length) {
      const cleanedSearchInputValue = searchInputValue
        .toLowerCase()
        .split(' ')
        .join('')

      treatmentPlans = treatmentPlans.filter(treatmentPlan => {
          const tpString = [
            treatmentPlan.indication.toLowerCase(),
            treatmentPlan.regimen.toLowerCase(),
            treatmentPlan.population.toLowerCase(),
            treatmentPlan.line.toLowerCase(),
            treatmentPlan.book.toLowerCase(),
          ].join('')
          .split(' ') // some parts have internal spaces
          .join('')

          return tpString.includes(cleanedSearchInputValue)
      })
    }
  }

  return (
    <Wrapper>
      <PanelHeader
        title="Treatment Plans"
        headerContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          background: Color.WHITE,
        }}
        childrenStyle={{ width: '100%' }}
      >
        <div style={{ fontSize: 12, padding: 24, color: Color.PHOENIX }}>
          {PHOENIX_NOTE}
        </div>
        <div style={{ padding: '12px 0' }}>
          <span style={{ margin: 24, fontSize: 12 }}>Search: </span>
          <StyledInput
            value={searchInputValue}
            style={{ margin: 12, border: SHARED_BORDER, width: '70%' }}
            placeholder="Enter treatment plan parts in table column order..."
            onChange={e => setSearchInputValue(e.target.value)}
          />
          {
            !treatmentPlanPartsLoading && (
              <TreatmentPlanModalButton
                treatmentPlanParts={treatmentPlanParts}
                buttonLabel={CREATE_BUTTON_TXT}
                modalStyle={createObjectModalStyle}
                modalTitle={CREATE_MODAL_TITLE}
                submitMutation={CREATE_SOURCE_TREATMENT_PLAN}
              />
            )
          }
        </div>
        <div style={{ display: 'flex', margin: '0 24px' }}>
          {
            ['Indication', 'Regimen', 'Population', 'Line', 'Book', 'Coverage', ' '].map(label => (
              <div key={label} style={{ width: COLUMN_WIDTH, padding: '12px 6px', border: SHARED_BORDER, fontSize: 13 }}>
                {label}
              </div>
            ))
          }
        </div>
      </PanelHeader>
      {
        loading
          ? <Spinner />
          : (
              treatmentPlans.map(({ _id, ...tpParts }) => {
                const rowStyle = {
                  width: COLUMN_WIDTH,
                  padding: 6,
                  border: SHARED_BORDER,
                  fontSize: 12,
                }

                return (
                  <div key={_id} style={{ display: 'flex' }}>
                    <span style={{ ...rowStyle, marginLeft: 24 }}>
                      {tpParts.indication}
                    </span>
                    <span style={rowStyle}>
                      {tpParts.regimen}
                    </span>
                    <span style={rowStyle}>
                      {tpParts.population}
                    </span>
                    <span style={rowStyle}>
                      {tpParts.line}
                    </span>
                    <span style={rowStyle}>
                      {tpParts.book}
                    </span>
                    <span style={rowStyle}>
                      {tpParts.coverage}
                    </span>
                    <span style={{ ...rowStyle, marginRight: 24 }}>
                      <DeleteButton
                        itemId={_id}
                        mutationDoc={DELETE_SOURCE_TREATMENT_PLAN}
                        refetchQueries={[{ query: GET_SOURCE_TREATMENT_PLANS }]}
                      />
                    </span>
                  </div>)
              })
            )
      }
    </Wrapper>
  )
}

export default TreatmentPlansPanel

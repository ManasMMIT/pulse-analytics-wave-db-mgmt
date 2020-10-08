import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'

import Spacing from 'frontend/utils/spacing'
import Input from 'frontend/components/Input'

import {
  GET_SOURCE_INDICATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
} from 'frontend/api/queries'

import {
  FieldContainer,
  FormLabel,
  FieldWrapper,
  FormWrapper,
  FlexWrapper,
} from './styledComponents'

const MGMT_TYPES = ['Business', 'Clinical', 'Leadership']

const INFLUENCER_TYPES = [
  'Steering Committee',
  'Leadership',
  'Content Manager',
  'Payer Partner Leadership',
  'USON P&T Members',
  'UHC P&T Members',
]

const PathwaysForm = ({ orgData, isNewOrgBeingCreated }) => {
  const {
    pathwaysId,
    tumorTypeSpecialty,
    position,
    priority,
    startDate,
    endDate,
    indicationIds,
    pathwaysInfluencerTypes,
    internalFields,
    alert,
    exclusionSettings,
  } = orgData

  const {
    internalNotes,
    totalDisclosures,
    dateDisclosure1,
    dateDisclosure2,
    dateDisclosure3,
    dateDisclosure4,
    pathwaysManagementTypes,
    valueChairsIndicationIds,
  } = internalFields

  const { date, type, description } = alert

  const { isExcluded, reason } = exclusionSettings

  const [selectedPathwaysId, selectPathwaysId] = useState(pathwaysId)

  const { data: indicationsData, loading: indicationsLoading } = useQuery(
    GET_SOURCE_INDICATIONS
  )

  const { data: pathwaysData, loading: pathwaysLoading } = useQuery(
    GET_PATHWAYS_ORGANIZATIONS
  )

  if (indicationsLoading || pathwaysLoading) return 'Loading...'

  const globalIndications = Object.values(indicationsData)[0]
  const globalIndicationsById = _.keyBy(globalIndications, '_id')

  const globalPathways = Object.values(pathwaysData)[0]
  const globalPathwaysById = _.keyBy(globalPathways, '_id')

  return (
    <FormWrapper>
      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Connected Pathways Organization</FormLabel>
          <Select
            isDisabled={!isNewOrgBeingCreated}
            value={{
              label:
                selectedPathwaysId &&
                globalPathwaysById[selectedPathwaysId].organization,
              value: selectedPathwaysId,
            }}
            options={globalPathways.map(({ _id, organization }) => ({
              label: organization,
              value: _id,
            }))}
            onChange={({ value }) => selectPathwaysId(value)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <FormLabel>
            Internal TDG Notes [Format - YYQQ (MM/DD:____);]
          </FormLabel>
          <Input name="internal notes" type="text" value={internalNotes} />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Pathways Management Type (Internal TDG Only)</FormLabel>
          <Select
            isMulti
            value={(pathwaysManagementTypes || []).map((type) => ({
              label: type,
              value: type,
            }))}
            options={MGMT_TYPES.map((type) => ({ label: type, value: type }))}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Pathways Influencer Type</FormLabel>
          <Select
            isMulti
            value={pathwaysInfluencerTypes.map((type) => ({
              label: type,
              value: type,
            }))}
            options={INFLUENCER_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Pathways Position</FormLabel>
          <Input type="text" value={position} />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FormLabel>
            ClinicalPath / Value Chairs Indication(s) (Internal TDG Only)
          </FormLabel>
          <Select
            isMulti
            value={indicationIds.map((_id) => ({
              label: globalIndicationsById[_id],
              value: _id,
            }))}
            options={globalIndications.map(({ _id, name }) => ({
              label: name,
              value: _id,
            }))}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Indications (for permissions)</FormLabel>
          <Select
            isMulti
            value={(valueChairsIndicationIds || []).map((_id) => ({
              label: globalIndicationsById[_id],
              value: _id,
            }))}
            options={globalIndications.map(({ _id, name }) => ({
              label: name,
              value: _id,
            }))}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Tumor Type Specialty</FormLabel>
          <Input type="text" value={tumorTypeSpecialty} />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Priority</FormLabel>
          <Input type="text" value={priority} />
        </FieldWrapper>
        {/* Wire in Dates */}
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Start Date</FormLabel>
            <Select />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Start Quarter</FormLabel>
            <Select />
          </FieldWrapper>
        </FlexWrapper>
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>End Date (Outdated)</FormLabel>
            <Select />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>End Quarter</FormLabel>
            <Select />
          </FieldWrapper>
        </FlexWrapper>
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Alert Date</FormLabel>
            <Select />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Alert Type</FormLabel>
            <Select value={type} />
          </FieldWrapper>
        </FlexWrapper>
        <FieldWrapper>
          <FormLabel>Alert Description</FormLabel>
          <Input type="text" value={description} />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FlexWrapper>
            <input
              type="checkbox"
              style={{ marginRight: Spacing.S3 }}
              checked={isExcluded}
            />
            <FormLabel>Exclude From Tool</FormLabel>
          </FlexWrapper>
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Exclude Reason</FormLabel>
          <Input type="text" value={reason} />
        </FieldWrapper>
      </FieldContainer>
      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Total Disclosures</FormLabel>
          <Input type="text" value={totalDisclosures} />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 1 (Date 1: Tumor(s))</FormLabel>
          <Input type="text" value={dateDisclosure1} />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 2 (Date 2: Tumor(s))</FormLabel>
          <Input type="text" value={dateDisclosure2} />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 3 (Date 3: Tumor(s))</FormLabel>
          <Input type="text" value={dateDisclosure3} />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 4 (Date 4: Tumor(s))</FormLabel>
          <Input type="text" value={dateDisclosure4} />
        </FieldWrapper>
      </FieldContainer>
    </FormWrapper>
  )
}

PathwaysForm.propTypes = {
  data: PropTypes.object.isRequired,
}

export default PathwaysForm

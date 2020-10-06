import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'

import Spacing from 'frontend/utils/spacing'
import Input from 'frontend/components/Input'

import {
  FieldContainer,
  FormLabel,
  FieldWrapper,
  FormWrapper,
  FlexWrapper,
} from './styledComponents'

const getSelectVal = (arr) =>
  arr ? arr.map((value) => ({ label: value, value })) : []

const PathwaysForm = ({ data }) => {
  const {
    internalFields,
    pathwaysInfluencerTypes,
    position,
    tumorTypeSpecialty,
    priority,
    alert,
    exclusionSettings,
  } = data

  //  Destructured fields are defaulted to empty object to account
  //  for initial creation when all values are empty
  const {
    internalNotes,
    pathwaysManagementTypes,
    // valueChairsIndicationIds,
    totalDisclosures,
    dateDisclosure1,
    dateDisclosure2,
    dateDisclosure3,
    dateDisclosure4,
  } = internalFields || {}
  const { isExcluded, reason } = exclusionSettings || {}

  const {
    // date,
    type,
    description,
  } = alert || {}

  const pathwayInfluencerTypesVal = getSelectVal(pathwaysInfluencerTypes)
  const pathwaysManagementTypesVal = !_.isEmpty(internalFields)
    ? getSelectVal(pathwaysManagementTypes)
    : []

  return (
    <FormWrapper>
      <FieldContainer>
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
          <Select isMulti value={pathwaysManagementTypesVal} />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Pathways Influencer Type</FormLabel>
          <Select isMulti value={pathwayInfluencerTypesVal} />
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
          {/* TODO: Hydrate Clinical Chair Indications */}
          <Select isMulti />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Indications (for permissions)</FormLabel>
          {/* TODO: Hydrate Indications */}
          <Select isMulti />
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

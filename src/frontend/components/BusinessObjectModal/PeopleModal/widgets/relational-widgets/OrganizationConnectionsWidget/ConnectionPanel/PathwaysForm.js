import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'

import Spacing from 'frontend/utils/spacing'
import { formatYearQuarter } from 'frontend/utils/formatDate'
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

const PATHWAYS_MGMT_TYPES = ['Business', 'Clinical', 'Leadership']

const INFLUENCER_TYPES = [
  'Steering Committee',
  'Leadership',
  'Content Manager',
  'Payer Partner Leadership',
  'USON P&T Members',
  'UHC P&T Members',
]

const PRIORITY_LEVELS = [null, 'High', 'Medium', 'Low']

const ALERT_TYPES = [null, 'Influencer']

const PathwaysForm = ({ orgData, isNewOrgBeingCreated, setOrgData }) => {
  const { data: indicationsData, loading: indicationsLoading } = useQuery(
    GET_SOURCE_INDICATIONS
  )

  const { data: pathwaysData, loading: pathwaysLoading } = useQuery(
    GET_PATHWAYS_ORGANIZATIONS
  )

  if (indicationsLoading || pathwaysLoading) return 'Loading...'

  const globalIndications = Object.values(indicationsData)[0]
  const globalIndicationsById = _.mapValues(
    _.keyBy(globalIndications, '_id'),
    'name'
  )

  const globalPathways = Object.values(pathwaysData)[0]
  const globalPathwaysById = _.mapValues(
    _.keyBy(globalPathways, '_id'),
    'organization'
  )

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

  const {
    date: alertDate,
    type: alertType,
    description: alertDescription,
  } = alert

  const { isExcluded, reason: exclusionReason } = exclusionSettings

  const orgDataCopy = _.cloneDeep(orgData)

  const selectPathwaysId = (_id) => {
    setOrgData(_.merge({}, orgData, { pathwaysId: _id }))
  }

  const handleTopLevelTextChange = ({ name, value }) => {
    setOrgData(_.merge({}, orgData, { [name]: value }))
  }

  const handleAlertDescriptionChange = ({ name, value }) => {
    orgDataCopy.alert.description = value
    setOrgData(orgDataCopy)
  }

  const handleInternalFieldsTextChange = ({ name, value }) => {
    orgDataCopy.internalFields[name] = value
    setOrgData(orgDataCopy)
  }

  const changeInternalPathwaysManagementTypes = (arr) => {
    orgDataCopy.internalFields.pathwaysManagementTypes = (arr || []).map(
      ({ value }) => value
    )
    setOrgData(orgDataCopy)
  }

  const changePathwaysInfluencerTypes = (arr) => {
    orgDataCopy.pathwaysInfluencerTypes = (arr || []).map(({ value }) => value)
    setOrgData(orgDataCopy)
  }

  const changeInternalValueChairsIndicationIds = (arr) => {
    orgDataCopy.internalFields.valueChairsIndicationIds = (arr || []).map(
      ({ value }) => value
    )
    setOrgData(orgDataCopy)
  }

  const handleIndicationsChange = (arr) => {
    orgDataCopy.indicationIds = (arr || []).map(({ value }) => value)
    setOrgData(orgDataCopy)
  }

  const changeExclusionSettings = ({ name, value }) => {
    _.merge(orgDataCopy.exclusionSettings, { [name]: value })
    setOrgData(orgDataCopy)
  }

  const handleTimestampChange = ({ name, value }) => {
    orgDataCopy[name] = value
    setOrgData(orgDataCopy)
  }

  const handleAlertDate = ({ value: newAlertDate }) => {
    orgDataCopy.alert.date = newAlertDate
    setOrgData(orgDataCopy)
  }

  const handleAlertType = ({ value: newAlertType }) => {
    orgDataCopy.alert.type = newAlertType
    setOrgData(orgDataCopy)
  }

  return (
    <FormWrapper>
      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Connected Pathways Organization</FormLabel>
          <Select
            isDisabled={!isNewOrgBeingCreated}
            value={{
              label: globalPathwaysById[pathwaysId],
              value: pathwaysId,
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
          <Input
            name="internalNotes"
            type="text"
            value={internalNotes}
            onChange={handleInternalFieldsTextChange}
          />
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
            options={PATHWAYS_MGMT_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
            onChange={changeInternalPathwaysManagementTypes}
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
            onChange={changePathwaysInfluencerTypes}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Pathways Position</FormLabel>
          <Input
            type="text"
            value={position}
            name="position"
            onChange={handleTopLevelTextChange}
          />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FormLabel>
            ClinicalPath / Value Chairs Indication(s) (Internal TDG Only)
          </FormLabel>
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
            onChange={changeInternalValueChairsIndicationIds}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Indications (for permissions)</FormLabel>
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
            onChange={handleIndicationsChange}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Tumor Type Specialty</FormLabel>
          <Input
            type="text"
            value={tumorTypeSpecialty}
            name="tumorTypeSpecialty"
            onChange={handleTopLevelTextChange}
          />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Priority</FormLabel>
          <Select
            options={PRIORITY_LEVELS.map((level) => ({
              value: level,
              label: level,
            }))}
            value={{ value: priority, label: priority }}
            onChange={({ value }) =>
              handleTopLevelTextChange({ name: 'priority', value })
            }
          />
        </FieldWrapper>
        {/* Wire in Dates */}
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={startDate}
              name="startDate"
              onChange={handleTimestampChange}
            />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Start Quarter</FormLabel>
            <Input
              disabled
              type="text"
              value={startDate && formatYearQuarter(startDate)}
              style={{ cursor: 'not-allowed' }}
            />
          </FieldWrapper>
        </FlexWrapper>
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>End Date (Outdated)</FormLabel>
            <Input
              type="date"
              value={endDate}
              name="endDate"
              onChange={handleTimestampChange}
            />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>End Quarter</FormLabel>
            <Input
              disabled
              type="text"
              value={endDate && formatYearQuarter(endDate)}
              style={{ cursor: 'not-allowed' }}
            />
          </FieldWrapper>
        </FlexWrapper>
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Alert Date</FormLabel>
            <Input type="date" value={alertDate} onChange={handleAlertDate} />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Alert Type</FormLabel>
            <Select
              value={{ label: alertType, value: alertType }}
              options={ALERT_TYPES.map((type) => ({
                label: type,
                value: type,
              }))}
              onChange={handleAlertType}
            />
          </FieldWrapper>
        </FlexWrapper>
        <FieldWrapper>
          <FormLabel>Alert Description</FormLabel>
          <Input
            type="text"
            value={alertDescription}
            name="description"
            onChange={handleAlertDescriptionChange}
          />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FlexWrapper>
            <FormLabel>
              <Input
                style={{ width: 'auto', marginRight: Spacing.S3 }}
                type="checkbox"
                name="isExcluded"
                checked={Boolean(isExcluded)}
                onChange={changeExclusionSettings}
              />
              Exclude From Tool
            </FormLabel>
          </FlexWrapper>
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Exclude Reason</FormLabel>
          <Input
            type="text"
            value={exclusionReason}
            name="reason"
            onChange={changeExclusionSettings}
          />
        </FieldWrapper>
      </FieldContainer>
      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Total Disclosures</FormLabel>
          <Input
            name="totalDisclosures"
            type="text"
            value={totalDisclosures}
            onChange={handleInternalFieldsTextChange}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 1 (Date 1: Tumor(s))</FormLabel>
          <Input
            name="dateDisclosure1"
            type="text"
            value={dateDisclosure1}
            onChange={handleInternalFieldsTextChange}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 2 (Date 2: Tumor(s))</FormLabel>
          <Input
            name="dateDisclosure2"
            type="text"
            value={dateDisclosure2}
            onChange={handleInternalFieldsTextChange}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 3 (Date 3: Tumor(s))</FormLabel>
          <Input
            name="dateDisclosure3"
            type="text"
            value={dateDisclosure3}
            onChange={handleInternalFieldsTextChange}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Date Disclosure 4 (Date 4: Tumor(s))</FormLabel>
          <Input
            name="dateDisclosure4"
            type="text"
            value={dateDisclosure4}
            onChange={handleInternalFieldsTextChange}
          />
        </FieldWrapper>
      </FieldContainer>
    </FormWrapper>
  )
}

PathwaysForm.propTypes = {
  orgData: PropTypes.object.isRequired,
  isNewOrgBeingCreated: PropTypes.bool.isRequired,
  setOrgData: PropTypes.func.isRequired,
}

export default PathwaysForm

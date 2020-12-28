import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'

import Spacing from 'frontend/utils/spacing'
import Input from 'frontend/components/Input'

import CreatableMultiSelect from '../../../../Orion/shared/CreatableMultiSelect'
import QuarterPicker from '../../../QuarterPicker'

import {
  GET_SOURCE_INDICATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PEOPLE,
} from 'frontend/api/queries'

import {
  FieldContainer,
  FormLabel,
  FieldWrapper,
  FormWrapper,
  FlexWrapper,
  RequiredLabel,
} from './orgInfluencerConnectionComponents/ConnectionPanel/styledComponents'

import { ALERT_TYPES } from './alert-types'

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

const PathwaysInfluencersForm = ({
  refKey,
  connectionData,
  isNewConnectionBeingCreated,
  setConnectionData,
  setWhetherUnsavedChanges,
}) => {
  const { data: indicationsData, loading: indicationsLoading } = useQuery(
    GET_SOURCE_INDICATIONS
  )

  const { data: pathwaysData, loading: pathwaysLoading } = useQuery(
    GET_PATHWAYS_ORGANIZATIONS
  )

  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE)

  if (indicationsLoading || pathwaysLoading || peopleLoading)
    return 'Loading...'

  const globalPeople = Object.values(peopleData)[0]
  const globalPeopleById = _.mapValues(
    _.keyBy(globalPeople, '_id'),
    ({ firstName, lastName }) => `${firstName} ${lastName}`
  )

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
    personId,
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
    startQuarter,
    endQuarter,
  } = connectionData

  const {
    internalNotes,
    pathwaysManagementTypes,
    valueChairsIndications,
  } = internalFields

  const {
    date: alertDate,
    type: alertType,
    description: alertDescription,
  } = alert

  const { isExcluded, reason: exclusionReason } = exclusionSettings

  const pathwaysInfluencerConnectionCopy = _.cloneDeep(connectionData)

  const updateOrgData = (newData) => {
    setConnectionData(newData)
    setWhetherUnsavedChanges(true)
  }

  const selectPathwaysId = (_id) => {
    updateOrgData(_.merge({}, connectionData, { pathwaysId: _id }))
  }

  const selectPersonId = (_id) => {
    updateOrgData(_.merge({}, connectionData, { personId: _id }))
  }

  const handleTopLevelTextChange = ({ name, value }) => {
    updateOrgData(_.merge({}, connectionData, { [name]: value }))
  }

  const handleAlertDescriptionChange = ({ name, value }) => {
    pathwaysInfluencerConnectionCopy.alert.description = value
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const handleInternalFieldsTextChange = ({ name, value }) => {
    pathwaysInfluencerConnectionCopy.internalFields[name] = value
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const changeInternalPathwaysManagementTypes = (arr) => {
    pathwaysInfluencerConnectionCopy.internalFields.pathwaysManagementTypes = (
      arr || []
    ).map(({ value }) => value)
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const changePathwaysInfluencerTypes = (arr) => {
    pathwaysInfluencerConnectionCopy.pathwaysInfluencerTypes = (arr || []).map(
      ({ value }) => value
    )
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const changeInternalValueChairsIndications = (arr) => {
    pathwaysInfluencerConnectionCopy.internalFields.valueChairsIndications = (
      arr || []
    ).map(({ value }) => value)
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const handleIndicationsChange = (arr) => {
    pathwaysInfluencerConnectionCopy.indicationIds = (arr || []).map(
      ({ value }) => value
    )
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const changeExclusionSettings = ({ name, value }) => {
    _.merge(pathwaysInfluencerConnectionCopy.exclusionSettings, {
      [name]: value,
    })
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const handleTimestampChange = ({ name, value }) => {
    if (name === 'startDate') {
      pathwaysInfluencerConnectionCopy.startQuarter = value
    } else if (name === 'endDate') {
      pathwaysInfluencerConnectionCopy.endQuarter = value
    } else if (name === 'startQuarter') {
      pathwaysInfluencerConnectionCopy.startDate = null
    } else if (name === 'endQuarter') {
      pathwaysInfluencerConnectionCopy.endDate = null
    }

    pathwaysInfluencerConnectionCopy[name] = value

    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const clearTimestamp = (name) => {
    handleTimestampChange({ name, value: null })
  }

  const handleAlertDate = ({ value: newAlertDate }) => {
    pathwaysInfluencerConnectionCopy.alert.date = newAlertDate
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const handleAlertType = ({ value: newAlertType }) => {
    pathwaysInfluencerConnectionCopy.alert.type = newAlertType
    updateOrgData(pathwaysInfluencerConnectionCopy)
  }

  const shouldDisablePathwaysSelect =
    !isNewConnectionBeingCreated || refKey !== 'pathwaysId'
  const shouldDisableInfluencerSelect =
    !isNewConnectionBeingCreated || refKey === 'pathwaysId'

  return (
    <FormWrapper>
      <FieldContainer>
        <FieldWrapper>
          <FormLabel>
            Connected Pathways Organization
            {!shouldDisablePathwaysSelect ? (
              <RequiredLabel> (required)</RequiredLabel>
            ) : null}
          </FormLabel>
          <Select
            isDisabled={shouldDisablePathwaysSelect}
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
            Connected Influencer
            {!shouldDisableInfluencerSelect ? (
              <RequiredLabel> (required)</RequiredLabel>
            ) : null}
          </FormLabel>
          <Select
            isDisabled={shouldDisableInfluencerSelect}
            value={{
              label: globalPeopleById[personId],
              value: personId,
            }}
            options={globalPeople.map(({ _id, firstName, lastName }) => ({
              label: `${firstName} ${lastName}`,
              value: _id,
            }))}
            onChange={({ value }) => selectPersonId(value)}
          />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <FormLabel>
            Pathways Management Type (Internal TDG Only)
            <RequiredLabel> (required)</RequiredLabel>
          </FormLabel>
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
          <FormLabel>
            Pathways Influencer Type
            <RequiredLabel> (required)</RequiredLabel>
          </FormLabel>
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
          <FormLabel>
            Pathways Position
            <RequiredLabel> (required)</RequiredLabel>
          </FormLabel>
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
            Indications (for permissions)
            <RequiredLabel> (required)</RequiredLabel>
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
            onChange={handleIndicationsChange}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>
            ClinicalPath / Value Chairs Indication(s) (Internal TDG Only)
          </FormLabel>
          <CreatableMultiSelect
            value={(valueChairsIndications || []).map((str) => ({
              label: str,
              value: str,
            }))}
            handleChange={changeInternalValueChairsIndications}
          />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Start Date</FormLabel>
            <button
              style={{ color: 'blue', marginLeft: 6, cursor: 'pointer' }}
              onClick={() => clearTimestamp('startDate')}
            >
              clear
            </button>
            <Input
              type="date"
              value={startDate}
              name="startDate"
              onChange={handleTimestampChange}
            />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Start Quarter</FormLabel>
            <button
              style={{ color: 'blue', marginLeft: 6, cursor: 'pointer' }}
              onClick={() => clearTimestamp('startQuarter')}
            >
              clear
            </button>
            <QuarterPicker
              value={startQuarter}
              name="startQuarter"
              onChange={handleTimestampChange}
            />
          </FieldWrapper>
        </FlexWrapper>
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>End Date (Outdated)</FormLabel>
            <button
              style={{ color: 'blue', marginLeft: 6, cursor: 'pointer' }}
              onClick={() => clearTimestamp('endDate')}
            >
              clear
            </button>
            <Input
              type="date"
              value={endDate}
              name="endDate"
              onChange={handleTimestampChange}
            />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>End Quarter</FormLabel>
            <button
              style={{ color: 'blue', marginLeft: 6, cursor: 'pointer' }}
              onClick={() => clearTimestamp('endQuarter')}
            >
              clear
            </button>
            <QuarterPicker
              value={endQuarter}
              name="endQuarter"
              onChange={handleTimestampChange}
            />
          </FieldWrapper>
        </FlexWrapper>
        <FlexWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Alert Date</FormLabel>
            <button
              style={{ color: 'blue', marginLeft: 6, cursor: 'pointer' }}
              onClick={() => handleAlertDate({ value: null })}
            >
              clear
            </button>
            <Input
              name="alert.date" // just to avoid prop warning, not used
              type="date"
              value={alertDate}
              onChange={handleAlertDate}
            />
          </FieldWrapper>
          <FieldWrapper style={{ width: '50%' }}>
            <FormLabel>Alert Type</FormLabel>
            <Select
              isDisabled // ! for now alertType can only be 'Influencer'
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
        <FieldWrapper>
          <FlexWrapper>
            <FormLabel>
              <Input
                style={{ width: 'auto', marginRight: Spacing.S3 }}
                type="checkbox"
                name="isExcluded"
                value={Boolean(isExcluded)}
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
    </FormWrapper>
  )
}

PathwaysInfluencersForm.propTypes = {
  refKey: PropTypes.string.isRequired,
  orgData: PropTypes.object.isRequired,
  isNewConnectionBeingCreated: PropTypes.bool.isRequired,
  setConnectionData: PropTypes.func.isRequired,
}

export default PathwaysInfluencersForm

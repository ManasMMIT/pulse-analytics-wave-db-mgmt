import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import Select from 'react-select'
import _ from 'lodash'

import SectionTitle from 'frontend/components/SectionTitle'
import { UnderlinedTabs } from 'frontend/components/Tabs'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import { AlphaColors } from 'frontend/utils/pulseStyles'
import Input from 'frontend/components/Input'

import ButtonCluster from './ButtonCluster'
// import PathwaysForm from './PathwaysForm'
import EventLog from 'frontend/components/EventLog'

const ConnectionsPanelWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
  borderLeft: `2px solid ${transparentize(0.9, Color.BLACK)}`,
})

const ORG_TYPE_MAP = {
  Pathways: {
    // form: PathwaysForm,
    refKey: 'pathwaysId',
  },
}

export const FieldContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.S4,
  background: Color.GRAY_LIGHT,
  borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
})

export const FormLabel = styled.label({
  color: Color.BLACK,
  fontWeight: 700,
  ...FontSpace.FS2,
})

export const FieldWrapper = styled.div({
  margin: Spacing.S4,
})

export const FormWrapper = styled.label({
  overflowY: 'scroll',
})

export const FlexWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const TABS_DATA = [
  'Details',
  'History',
  // TODO: 'Comments'
]

const getSelectVal = (arr) =>
  arr ? arr.map((value) => ({ label: value, value })) : []

const ConnectionsPanel = ({
  entityId,
  selectedOrganization,
  hasNewOrgConnection,
  changeOrganization,
  setNewOrgConnectionStatus,
  connectionsData,
}) => {
  const cancelHandler = () => {
    changeOrganization(connectionsData[0])
    setNewOrgConnectionStatus(false)
  }
  const { organization, organizationType } = selectedOrganization

  const { refKey } = ORG_TYPE_MAP[organizationType] || {}

  const eventLogFilters = {
    entityIds: [entityId, selectedOrganization[refKey]],
  }

  const [data, setData] = useState({})

  const handlePosition = ({ name, value }) => {
    const newData = _.merge({}, data, { [name]: value })
    setData(newData)
  }

  useEffect(() => {
    if (!_.isEmpty(selectedOrganization)) {
      setData(_.cloneDeep(selectedOrganization))
    }
  }, [selectedOrganization])

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
    <ConnectionsPanelWrapper>
      <SectionTitle
        title={organization}
        titleStyle={{ ...FontSpace.FS3, color: Color.BLUE }}
      >
        <ButtonCluster
          data={data}
          cancelHandler={cancelHandler}
          hasNewOrgConnection={hasNewOrgConnection}
        />
      </SectionTitle>
      <UnderlinedTabs
        tabsData={TABS_DATA}
        activeTabStyle={{ color: Color.PRIMARY }}
        tabsContainerStyle={{
          borderBottom: `1px solid ${AlphaColors.Black10}`,
          paddingLeft: Spacing.S4,
        }}
      >
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
              <FormLabel>
                Pathways Management Type (Internal TDG Only)
              </FormLabel>
              <Select isMulti value={pathwaysManagementTypesVal} />
            </FieldWrapper>
            <FieldWrapper>
              <FormLabel>Pathways Influencer Type</FormLabel>
              <Select isMulti value={pathwayInfluencerTypesVal} />
            </FieldWrapper>
            <FieldWrapper>
              <FormLabel>Pathways Position</FormLabel>
              <Input
                type="text"
                name="position"
                onChange={handlePosition}
                value={position}
              />
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

        <EventLog filters={eventLogFilters} />
      </UnderlinedTabs>
    </ConnectionsPanelWrapper>
  )
}

ConnectionsPanel.propTypes = {
  entityId: PropTypes.string.isRequired,
  changeOrganization: PropTypes.func.isRequired,
  hasNewOrgConnection: PropTypes.bool.isRequired,
  connectionsData: PropTypes.array.isRequired,
  selectedOrganization: PropTypes.object.isRequired,
  setNewOrgConnectionStatus: PropTypes.func.isRequired,
}

export default ConnectionsPanel

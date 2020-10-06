import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Button from 'frontend/components/Button'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import { UPSERT_PATHWAYS_AND_PERSON_CONNECTION } from 'frontend/api/mutations'

const ButtonsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const ButtonCluster = ({ isNewOrgBeingCreated, cancelHandler, data }) => {
  const {
    _id,
    pathwaysId,
    personId,
    indicationIds,
    pathwaysInfluencerTypes,
    tumorTypeSpecialty,
    internalFields,
    position,
    priority,
    alert,
    exclusionSettings,
    startDate,
    endDate,
  } = data

  const { __typename: t1, ...internalFieldsCleaned } = internalFields || {}
  internalFieldsCleaned.valueChairsIndicationIds =
    internalFieldsCleaned.valueChairsIndicationIds || []

  const { __typename: t2, ...alertCleaned } = alert || {}

  const { __typename: t3, ...exclusionSettingsCleaned } =
    exclusionSettings || {}

  const formattedData = {
    _id,
    pathwaysId,
    personId,
    indicationIds,
    pathwaysInfluencerTypes,
    tumorTypeSpecialty,
    internalFields: internalFieldsCleaned,
    position,
    priority,
    alert: alertCleaned,
    exclusionSettings: exclusionSettingsCleaned,
    startDate,
    endDate,
  }

  const [upsert] = useMutation(UPSERT_PATHWAYS_AND_PERSON_CONNECTION, {
    variables: {
      input: formattedData,
    },
    // refetchQueries: [
    //   {
    //     query: GET_JOIN_OBMS_SERVICES_AND_OBMS_SERVICES_CATEGORIES,
    //     variables: { obmServiceId: entity._id },
    //   },
    //   {
    //     query: GET_VIEW_OBM_SERVICES,
    //   },
    // ],
    onError: alert,
  })

  return (
    <ButtonsWrapper>
      <Button
        color={Color.WHITE}
        onClick={cancelHandler}
        buttonStyle={{ color: Color.GRAY_DARK, margin: `0 ${Spacing.S3}` }}
      >
        Cancel
      </Button>
      <Button
        type="secondary"
        onClick={upsert}
        color={Color.GREEN}
        buttonStyle={{ margin: `0 ${Spacing.S3}` }}
      >
        Save
      </Button>

      {!isNewOrgBeingCreated && (
        <Button
          buttonStyle={{ margin: `0 ${Spacing.S3}` }}
          onClick={() => {}}
          type="secondary"
          color={Color.RED}
          iconName="delete"
          iconColor1={Color.RED}
        />
      )}
    </ButtonsWrapper>
  )
}

ButtonCluster.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  isNewOrgBeingCreated: PropTypes.bool.isRequired,
}

ButtonCluster.defaultProps = {}

export default ButtonCluster

import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import _ from 'lodash'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Button from 'frontend/components/Button'
import Spinner from 'frontend/components/Spinner'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import stripTypename from '../../../../../../../Orion/shared/strip-typename'

import { GET_EVENTS, GET_JOIN_PATHWAYS_AND_PEOPLE } from 'frontend/api/queries'

import {
  UPSERT_PATHWAYS_AND_PERSON_CONNECTION,
  DELETE_PATHWAYS_AND_PERSON_CONNECTION,
} from 'frontend/api/mutations'

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const SpinnerWrapper = styled.div({
  width: 43,
  height: 30,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: `0 ${Spacing.S3}`,
})

const ButtonsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const ButtonCluster = ({
  isNewOrgBeingCreated,
  cancelHandler,
  orgData,
  setWhetherUnsavedChanges,
  setWhetherNewOrgBeingCreated,
  changeOrganization,
  connectionsData,
}) => {
  const [snackbarOpen, toggleSnackbar] = useState(false)

  orgData = stripTypename(_.cloneDeep(orgData))

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
    startQuarter,
    endQuarter,
  } = orgData

  const dataToPersist = {
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
    startQuarter,
    endQuarter,
  }

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_PATHWAYS_AND_PERSON_CONNECTION,
    {
      variables: {
        input: dataToPersist,
      },
      refetchQueries: [
        { query: GET_EVENTS },
        { query: GET_JOIN_PATHWAYS_AND_PEOPLE },
      ],
      awaitRefetchQueries: true,
      onCompleted: (res) => {
        if (isNewOrgBeingCreated) {
          setWhetherNewOrgBeingCreated(false)
          const newConnectionId = Object.values(res)[0]._id
          changeOrganization(
            connectionsData.find(({ _id }) => _id === newConnectionId)
          )
        }

        toggleSnackbar(true)
        setWhetherUnsavedChanges(false)
      },
      onError: alert,
    }
  )

  const [deleteConnection] = useMutation(
    DELETE_PATHWAYS_AND_PERSON_CONNECTION,
    {
      variables: {
        input: dataToPersist,
      },
      refetchQueries: [
        { query: GET_EVENTS },
        { query: GET_JOIN_PATHWAYS_AND_PEOPLE },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        changeOrganization(connectionsData[0] || {}) // ! if no more connections, pass empty object
        setWhetherUnsavedChanges(false)
      },
      onError: alert,
    }
  )

  const deleteHandler = () => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this connection?'
      )
    ) {
      deleteConnection()
    }
  }

  return (
    <>
      <ButtonsWrapper>
        <Button
          color={Color.WHITE}
          onClick={cancelHandler}
          buttonStyle={{ color: Color.GRAY_DARK, margin: `0 ${Spacing.S3}` }}
        >
          Cancel
        </Button>

        {upsertLoading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : (
          <Button
            type="secondary"
            onClick={upsert}
            color={Color.GREEN}
            buttonStyle={{ margin: `0 ${Spacing.S3}` }}
          >
            Save
          </Button>
        )}

        {!isNewOrgBeingCreated && (
          <Button
            buttonStyle={{ margin: `0 ${Spacing.S3}` }}
            onClick={deleteHandler}
            type="secondary"
            color={Color.RED}
            iconName="delete"
            iconColor1={Color.RED}
          />
        )}
      </ButtonsWrapper>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        onClose={() => toggleSnackbar(false)}
        autoHideDuration={5000}
      >
        <Alert onClose={() => toggleSnackbar(false)} severity="success">
          Connection saved!
        </Alert>
      </Snackbar>
    </>
  )
}

ButtonCluster.propTypes = {
  isNewOrgBeingCreated: PropTypes.bool.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  orgData: PropTypes.object.isRequired,
  setWhetherUnsavedChanges: PropTypes.func.isRequired,
  setWhetherNewOrgBeingCreated: PropTypes.func.isRequired,
  changeOrganization: PropTypes.func.isRequired,
  connectionsData: PropTypes.array.isRequired,
}

ButtonCluster.defaultProps = {}

export default ButtonCluster

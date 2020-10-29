import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import _ from 'lodash'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Button from 'frontend/components/Button'
import Spinner from 'frontend/components/Spinner'
import { GET_EVENTS, GET_JOIN_PATHWAYS_AND_PEOPLE } from 'frontend/api/queries'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import stripTypename from '../../../../../Orion/shared/strip-typename'

// TODO: Pass in mutations and refetch gql tags to button cluster
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
  isNewConnectionBeingCreated,
  cancelHandler,
  connectionData,
  setWhetherUnsavedChanges,
  setWhetherNewConnectionBeingCreated,
  changeConnection,
  connectionsData,
}) => {
  const [snackbarOpen, toggleSnackbar] = useState(false)

  connectionData = stripTypename(_.cloneDeep(connectionData))

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
  } = connectionData

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
        if (isNewConnectionBeingCreated) {
          setWhetherNewConnectionBeingCreated(false)
          const newConnectionId = Object.values(res)[0]._id
          changeConnection(
            connectionsData.find(({ _id }) => _id === newConnectionId)
          )
        }

        toggleSnackbar(true)
        setWhetherUnsavedChanges(false)
      },
      onError: window.alert,
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
        changeConnection(connectionsData[0] || {}) // ! if no more connections, pass empty object
        setWhetherUnsavedChanges(false)
      },
      onError: window.alert,
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

  const handleUpsertion = () => {
    const areRequiredFieldsBlank =
      _.isEmpty(indicationIds) || _.isEmpty(pathwaysInfluencerTypes)

    if (areRequiredFieldsBlank && !exclusionSettings.isExcluded) {
      window.alert(
        `Please fill out the fields marked required OR check off "Exclude From Tool"`
      )
      return
    }

    upsert()
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
            onClick={handleUpsertion}
            color={Color.GREEN}
            buttonStyle={{ margin: `0 ${Spacing.S3}` }}
          >
            Save
          </Button>
        )}

        {!isNewConnectionBeingCreated && (
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
  isNewConnectionBeingCreated: PropTypes.bool.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  connectionData: PropTypes.object.isRequired,
  setWhetherUnsavedChanges: PropTypes.func.isRequired,
  setWhetherNewConnectionBeingCreated: PropTypes.func.isRequired,
  changeConnection: PropTypes.func.isRequired,
  connectionsData: PropTypes.array.isRequired,
}

ButtonCluster.defaultProps = {}

export default ButtonCluster

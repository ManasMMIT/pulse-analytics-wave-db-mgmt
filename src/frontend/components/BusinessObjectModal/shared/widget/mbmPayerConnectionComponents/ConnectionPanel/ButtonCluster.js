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
import stripTypename from 'frontend/Orion/shared/strip-typename'

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
  stagedConnection,
  setWhetherUnsavedChanges,
  setWhetherNewConnectionBeingCreated,
  selectConnectionId,
  connections,
  refetchQueries,
  mutationDocs,
}) => {
  const [snackbarOpen, toggleSnackbar] = useState(false)

  stagedConnection = stripTypename(_.cloneDeep(stagedConnection))

  const [upsert, { loading: upsertLoading }] = useMutation(
    mutationDocs.upsert,
    {
      variables: {
        input: stagedConnection,
      },
      refetchQueries,
      awaitRefetchQueries: true,
      onCompleted: (res) => {
        if (isNewConnectionBeingCreated) {
          setWhetherNewConnectionBeingCreated(false)
          const newConnectionId = Object.values(res)[0]._id
          selectConnectionId(newConnectionId)
        }

        toggleSnackbar(true)
        setWhetherUnsavedChanges(false)
      },
      onError: window.alert,
    }
  )

  const [deleteConnection] = useMutation(mutationDocs.delete, {
    variables: {
      input: { _id: stagedConnection._id },
    },
    refetchQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      selectConnectionId(_.isEmpty(connections) ? null : connections[0]._id)
      setWhetherUnsavedChanges(false)
    },
    onError: window.alert,
  })

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
  stagedConnection: PropTypes.object.isRequired,
  setWhetherUnsavedChanges: PropTypes.func.isRequired,
  setWhetherNewConnectionBeingCreated: PropTypes.func.isRequired,
  selectConnectionId: PropTypes.func.isRequired,
  connections: PropTypes.array.isRequired,
  refetchQueries: PropTypes.array.isRequired,
  mutationDocs: PropTypes.array.isRequired,
}

export default ButtonCluster

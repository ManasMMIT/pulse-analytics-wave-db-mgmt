import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import TextFormButton from '../../shared/TextForm/Button'

import { Colors } from '../../../utils/pulseStyles'

import { GET_CLIENTS } from 'frontend/api/queries'
import { CREATE_CLIENT } from '../../../api/mutations'

const CREATE_BUTTON_TXT = 'Create Client'

const CREATE_MODAL_TITLE = 'Create New Client'

const CreateButton = ({ handleClick, searchParamKey }) => {
  const {
    data: clientsData,
    loading: clientsLoading,
    error: clientsError,
  } = useQuery(GET_CLIENTS)

  const [createClient, { loading, error }] = useMutation(CREATE_CLIENT, {
    update: (cache, { data: { createClient } }) => {
      const newClientsData = clientsData.clients
      let i = 0

      while (
        i < newClientsData.length &&
        newClientsData[i].description.toLowerCase() <
          createClient.description.toLowerCase()
      ) {
        i++
      }
      newClientsData.splice(i, 0, createClient)

      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: newClientsData },
      })
    },
    onCompleted: ({ createClient }) => {
      handleClick(createClient[searchParamKey])
    },
    onError: alert,
  })

  if (clientsLoading) return null
  if (clientsError) return <div>{clientsError}</div>

  const mutationObj = {
    mutationFunc: createClient,
    loading,
    error,
  }

  return (
    <TextFormButton
      modalTitle={CREATE_MODAL_TITLE}
      buttonLabel={CREATE_BUTTON_TXT}
      buttonColor={Colors.WHITE}
      mutationObj={mutationObj}
    />
  )
}

CreateButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  searchParamKey: PropTypes.string.isRequired,
}

export default CreateButton

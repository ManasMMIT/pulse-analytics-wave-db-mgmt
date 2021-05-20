import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import { UPDATE_CLIENT } from '../../../api/mutations'

import { GET_CLIENTS } from '../../../api/queries'

import TextFormButton from '../../shared/TextForm/Button'

const editIcon = (
  <FontAwesomeIcon size="lg" icon={faEdit} style={{ color: 'white' }} />
)

const buttonStyle = {
  border: 'none',
  background: 'none',
  color: '#0A2E4D',
  opacity: 0.3,
}

const UpdateButton = ({ client: { _id, description, icon } }) => {
  const {
    data: clientsData,
    loading: clientsLoading,
    error: clientsError,
  } = useQuery(GET_CLIENTS)

  const [updateClient, { loading, error }] = useMutation(UPDATE_CLIENT, {
    update: (cache, { data: { updateClient } }) => {
      const newClientsData = clientsData.clients.filter(
        ({ _id }) => _id !== updateClient._id
      )
      let i = 0

      while (
        i < newClientsData.length &&
        newClientsData[i].description.toLowerCase() <
          updateClient.description.toLowerCase()
      ) {
        i++
      }
      newClientsData.splice(i, 0, updateClient)

      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: newClientsData },
      })
    },
    onError: alert,
  })

  if (clientsLoading) return null
  if (clientsError) return <div>{clientsError}</div>

  const mutationObj = {
    mutationFunc: updateClient,
    loading,
    error,
  }

  return (
    <TextFormButton
      modalTitle="Edit Client"
      buttonLabel={editIcon}
      buttonStyle={buttonStyle}
      data={{ description }}
      mutationObj={mutationObj}
      additionalFormData={{ _id, icon }}
    />
  )
}

export default UpdateButton

import React from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery } from '@apollo/react-hooks'

import { GET_CLIENTS, GET_TEAMS, GET_USERS } from 'frontend/api/queries'

import StructuralListPanels from 'frontend/components/StructuralListPanels'

import HOME_PANELS from './home-panels'

import StatusPanel from './StatusPanel'

const Home = () => {
  const location = useLocation()

  const { clientId: selectedClientId, teamId: selectedTeamId } =
    (location.search && queryString.parse(location.search)) || {}

  const {
    data: clientsData,
    loading: clientsLoading,
    error: clientsError,
  } = useQuery(GET_CLIENTS)
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery(GET_TEAMS, {
    variables: { clientId: selectedClientId },
  })
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_USERS, {
    variables: { teamId: selectedTeamId },
  })
  const {
    data: allUsersData,
    loading: allUsersLoading,
    error: allUsersError,
  } = useQuery(GET_USERS, {
    variables: { clientId: selectedClientId },
  })

  let clients = []
  const clientsFirstDataKey =
    !clientsLoading && !clientsError && Object.keys(clientsData)[0]
  if (clientsFirstDataKey) {
    clients = clientsData[clientsFirstDataKey]
  }
  HOME_PANELS[0].data = clients
  HOME_PANELS[0].loading = clientsLoading
  HOME_PANELS[0].error = clientsError

  const allUsersTeam = {
    _id: 'allUsers',
    description: 'All Users',
  }
  let teams = []
  let teamsListHeaderTitle = ''
  if (selectedClientId) {
    const teamsFirstDataKey =
      !teamsLoading && !teamsError && Object.keys(teamsData)[0]
    if (teamsFirstDataKey) {
      teams = [allUsersTeam, ...teamsData[teamsFirstDataKey]]
    }

    const selectedClient = clients.find(({ _id }) => _id === selectedClientId)
    if (selectedClient) {
      teamsListHeaderTitle = selectedClient.description
    }
  }
  HOME_PANELS[1].data = teams
  HOME_PANELS[1].loading = teamsLoading
  HOME_PANELS[1].error = teamsError
  HOME_PANELS[1].listHeaderConfig.title = teamsListHeaderTitle

  let users = []
  let usersLoadingConfig
  let usersErrorConfig
  let usersListHeaderTitle = ''
  if (selectedTeamId) {
    if (selectedTeamId === 'allUsers') {
      const allUsersFirstDataKey =
        !allUsersLoading && !allUsersError && Object.keys(allUsersData)[0]

      if (allUsersFirstDataKey) {
        users = allUsersData[allUsersFirstDataKey]
      }
      usersLoadingConfig = allUsersLoading
      usersErrorConfig = allUsersError
    } else {
      const usersFirstDataKey =
        !usersLoading && !usersError && Object.keys(usersData)[0]

      if (usersFirstDataKey) {
        users = usersData[usersFirstDataKey]
      }
      usersLoadingConfig = usersLoading
      usersErrorConfig = usersError
    }

    const selectedTeam = teams.find(({ _id }) => _id === selectedTeamId)
    if (selectedTeam) {
      usersListHeaderTitle = selectedTeam.description
    }
  }
  HOME_PANELS[2].data = users
  HOME_PANELS[2].loading = usersLoadingConfig
  HOME_PANELS[2].error = usersErrorConfig
  HOME_PANELS[2].listHeaderConfig.title = usersListHeaderTitle

  return (
    <div style={{ display: 'flex' }}>
      <StructuralListPanels panels={HOME_PANELS} />
      <StatusPanel />
    </div>
  )
}

export default Home

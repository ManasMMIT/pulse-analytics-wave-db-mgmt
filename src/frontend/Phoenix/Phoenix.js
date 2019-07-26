import React, { Component } from 'react'
// import _ from 'lodash'

// import {
//   getAllClients,
//   getClient,
//   editClient,
//   getAllTeamUsers,
//   getAllClientRoles,
//   createUser,
//   editUser,
//   createTeam,
//   editTeam,
//   deleteTeam,
//   createClient,
//   deleteClient,
//   deleteUser,
// } from './endpoints'

import ClientsPanel from './ClientsPanel'
// import TeamsPanel from './TeamsPanel'
// import UsersPanel from './UsersPanel'

class Phoenix extends Component {
  state = {
    clients: [],
    teams: [],
    users: [],
    selectedClient: null,
    selectedTeam: null,
    selectedUser: null,
  }

  componentDidMount = () => {
    this.props.selectClient()
  }

  render() {
    return (
      <div>
        <ClientsPanel
          selectClient={this.props.selectClient}
          selectedClient={this.props.data && this.props.data.selectedClient}
        />
      </div>
    )
  }
}

export default Phoenix

// class Phoenix extends Component {
//   state = {
//     clients: [],
//     teams: [],
//     users: [],
//     selectedClient: null,
//     selectedTeam: null,
//     selectedUser: null,
//   }

//   componentDidMount = () => {
//     this.props.selectClient()
//   }

//   getInitialState = async () => {
//     const clients = await getAllClients()
//     const selectedClient = clients[0].id

//     const teams = await getClient(selectedClient)
//     const selectedTeam = teams.length ? teams[0].id : null

//     const users = await getAllTeamUsers(selectedTeam)
//     const selectedUser = users.length ? users[0].id : null

//     this.setState({
//       clients,
//       teams,
//       users,
//       selectedClient,
//       selectedTeam,
//       selectedUser,
//     })
//   }

//   handleTeamClick = async teamId => {
//     const users = await getAllTeamUsers(teamId)
//     this.setState({
//       users,
//       selectedTeam: teamId,
//       selectedUser: users.length
//         ? users[0].id
//         : null
//     })
//   }

//   handleClientClick = async clientId => {
//     const teams = await getAllClientRoles(clientId)

//     let users = []
//     if (teams.length) {
//       users = await getAllTeamUsers(teams[0].id)
//     }

//     this.setState({
//       teams,
//       users,
//       selectedClient: clientId,
//       selectedTeam: teams.length ? teams[0].id : null,
//       selectedUser: users.length ? users[0].id : null
//     })
//   }

//   handleEditClient = async ({ id: clientId, name }) => {
//     const client = await editClient(clientId, name)
//     const newClients = _.cloneDeep(this.state.clients)
//     const clientInState = newClients
//       .find(({ id }) => clientId === id)

//     clientInState.name = client.name
//     this.setState({ clients: newClients })
//   }

//   handleClickUser = userId => {
//     this.setState({ selectedUser: userId })
//   }

//   handleDeleteTeam = async teamId => {
//     const { selectedClient } = this.state
//     await deleteTeam(teamId, { clientId: selectedClient })

//     const { teams, users } = this.state
//     const newTeams = teams.filter(({ id }) => id !== teamId)
//     const selectedTeam = newTeams.length
//       ? newTeams[0].id
//       : null

//     let newUsers = users
//     if (newTeams.length) {
//       newUsers = await getAllTeamUsers(newTeams[0].id)
//     }

//     this.setState({
//       teams: newTeams,
//       selectedTeam,
//       users: newUsers,
//     })
//   }

//   handleCreateTeam = async data => {

//     data.clientId = this.state.selectedClient
//     const createdTeam = await createTeam(data)

//     const allTeams = _.cloneDeep(this.state.teams)
//     allTeams.push(createdTeam)

//     this.setState({ teams: allTeams})
//   }

//   handleEditTeam = async data => {
//     const { selectedTeam } = this.state
//     const team = await editTeam(selectedTeam, data)
//     const newTeams = _.cloneDeep(this.state.teams)

//     const teamInState = newTeams
//       .find(({ id }) => selectedTeam === id)

//     teamInState.description = team.description
//     this.setState({ teams: newTeams })
//     document.elementFromPoint(0, 0).click()
//   }

//   handleCreateClient = async data => {
//     const createdClient = await createClient(data)

//     // copy state to avoid mutation
//     const allClients = _.cloneDeep(this.state.clients)
//     allClients.push(createdClient)

//     this.setState({ clients: allClients })
//   }

//   handleDeleteClient = async clientId => {
//     await deleteClient(clientId)

//     // TODO: Remove delete from client
//   }

//   handleDeleteUser = async userId => {
//     await deleteUser(userId)

//     const { users } = this.state
//     const newUsers = users.filter(({ id }) => id !== userId)
//     const selectedUser = newUsers.length
//       ? newUsers[0].id
//       : null
//     this.setState({ users: newUsers, selectedUser })
//   }

//   handleEditUser = async ({ id, ...userData }) => {
//     // userData consists of username, email, password, roles
//     await editUser(id, userData)

//     // the user that's edited isn't necessarily tied to the selected team
//     // so refetch the users that are tied to the selected team
//     const { selectedTeam } = this.state
//     const updatedUsersForTeam = await getAllTeamUsers(selectedTeam)

//     this.setState({ users: updatedUsersForTeam })
//   }

//   handleCreateUser = async data => {
//     await createUser(data)

//     // the user that's created isn't necessarily tied to the selected team
//     // so refetch the users that are tied to the selected team
//     const { selectedTeam } = this.state
//     const updatedUsersForTeam = await getAllTeamUsers(selectedTeam)

//     this.setState({ users: updatedUsersForTeam })
//   }

//   render() {
//     const {
//       clients,
//       teams,
//       users,
//       selectedClient,
//       selectedTeam,
//       selectedUser,
//     } = this.state

//     const selectedClientName =
//       selectedClient && clients
//         .find(({ id }) => id === selectedClient)
//         .description
//     const selectedTeamName =
//       selectedTeam && teams
//         .find(({ id }) => id === selectedTeam)
//         .description

//     return (
//       <div style={{ display: "flex" }}>
//         <ClientsPanel
//           clients={clients}
//           selectedClient={selectedClient}
//           handlers={{
//             onClick: this.handleClientClick,
//             createHandler: this.handleCreateClient
//             // editHandler: this.handleEditClient,
//             // deleteHandler: this.handleDeleteClient
//           }}
//         />
//         <TeamsPanel
//           teams={teams}
//           clientName={selectedClientName}
//           selectedTeam={selectedTeam}
//           handlers={{
//             onClick: this.handleTeamClick,
//             createHandler: this.handleCreateTeam,
//             deleteHandler: this.handleDeleteTeam,
//             editHandler: this.handleEditTeam,
//           }}
//         />
//         <UsersPanel
//           teamName={selectedTeamName}
//           selectedTeam={selectedTeam}
//           selectedClient={selectedClient}
//           users={users}
//           teams={teams}
//           handlers={{
//             editHandler: this.handleEditUser,
//             createHandler: this.handleCreateUser,
//             onClick: this.handleClickUser,
//             deleteHandler: this.handleDeleteUser
//           }}
//           selectedUser={selectedUser}
//         />
//       </div>
//     )
//   }
// }

// export default Phoenix

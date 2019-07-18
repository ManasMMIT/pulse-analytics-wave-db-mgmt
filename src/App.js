import React, { Component } from "react";
import ClientsPanel from "./components/clients/ClientsPanel";

import {
  getAllClients,
  getClient,
  getAllTeamUsers,
  getAllClientRoles,
} from "./endpoints";
import TeamsPanel from "./components/teams/TeamsPanel";
import UsersPanel from "./components/users/UsersPanel";

class App extends Component {
  state = {
    clients: [],
    teams: [],
    users: [],
    selectedClient: null,
    selectedTeam: null,
    selectedUser: null
  };

  componentDidMount = () => {
    this.getInitialState();
  };

  getInitialState = async () => {
    const clients = await getAllClients();
    const selectedClient = clients[0].id;

    const teams = await getClient(selectedClient);
    const selectedTeam = teams.length ? teams[0].id : null;

    const users = await getAllTeamUsers(selectedTeam);

    const selectedUser = users.length ? users[0].id : null;

    this.setState({
      clients,
      teams,
      users,
      selectedClient,
      selectedTeam,
      selectedUser,
    });
  };

  handleTeamClick = async teamId => {
    const users = await getAllTeamUsers(teamId)
    this.setState({
      users,
      selectedTeam: teamId,
      selectedUser: users.length ? users[0].id : null
    });
  };

  handleClientClick = async clientId => {
    const teams = await getAllClientRoles(clientId);

    let users = [];
    if (teams.length) {
      users = await getAllTeamUsers(teams[0].id)
    }

    this.setState({
      teams,
      users,
      selectedClient: clientId,
      selectedTeam: teams.length ? teams[0].id : null,
      selectedUser: users.length ? users[0].id : null
    });
  };

  handleUserClick = userId => {
    this.setState({ selectedUser: userId });
  };

  deleteTeam = async (e, teamId) => {
    e.stopPropagation();
    debugger
    await fetch(`api/roles/${teamId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: this.state.selectedClient
      }),
    });
    const { teams } = this.state;
    const newTeams = teams.filter(({ id }) => id !== teamId);
    const selectedTeam = newTeams.length
      ? newTeams[0].id
      : null;

    let newUsers = this.state.users
    if (newTeams.length) {
      newUsers = await getAllTeamUsers(newTeams[0].id)
    }

    this.setState({ teams: newTeams, selectedTeam, users: newUsers });
  };

  deleteClient = async (e, clientId) => {
    e.stopPropagation();

    await fetch(`api/clients/${ clientId }`, {
      method: 'DELETE',
    })
    console.log('deleted!');
  }

  deleteUser = async (e, userId) => {
    e.stopPropagation();
    await fetch(`api/users/${ userId }`, {
      method: 'DELETE',
    })
    const { users } = this.state;
    const newUsers = users.filter(({ id }) => id !== userId)
    const selectedUser = newUsers.length ? newUsers[0].id : null;
    this.setState({ users: newUsers, selectedUser });
  };

  handleUserEdit = user => {
    // TODO
  }

  render() {
    const {
      clients,
      teams,
      users,
      selectedClient,
      selectedTeam,
      selectedUser,
    } = this.state;

    const selectedClientName =
      selectedClient && clients.find(({ id }) => id === selectedClient).name;
    const selectedTeamName =
      selectedTeam && teams.find(({ id }) => id === selectedTeam).name;

    return (
      <div style={{ display: "flex" }}>
        <ClientsPanel
          clients={clients}
          selectedClient={selectedClient}
          handlers={{
            onClick: this.handleClientClick,
            editHandler: () => {},
            deleteHandler: this.deleteClient,
          }}
        />
        <TeamsPanel
          teams={teams}
          clientName={selectedClientName}
          selectedTeam={selectedTeam}
          handlers={{
            onClick: this.handleTeamClick,
            deleteHandler: this.deleteTeam,
            editHandler: () => {}
          }}
        />
        <UsersPanel
          teamName={selectedTeamName}
          users={users}
          handlers={{
            onClick: this.handleUserClick,
            deleteHandler: this.deleteUser,
            editHandler: this.handleUserEdit
          }}
          selectedUser={selectedUser}
        />
      </div>
    );
  }
}

export default App;

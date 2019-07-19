import React, { Component } from "react";
import ClientsPanel from "./components/clients/ClientsPanel";

import {
  getAllClients,
  getClient,
  editClient,
  getAllTeamUsers,
  getAllClientRoles,
  deleteTeam,
  deleteClient,
  deleteUser,
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
    const users = await getAllTeamUsers(teamId);
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
      users = await getAllTeamUsers(teams[0].id);
    }

    this.setState({
      teams,
      users,
      selectedClient: clientId,
      selectedTeam: teams.length ? teams[0].id : null,
      selectedUser: users.length ? users[0].id : null,
    });
  };

  handleEditClient = async ({ id: clientId, name }) => {
    const client = await editClient(clientId, name);

    const clientInState = this.state.clients
      .find(({ id }) => clientId === id);

    clientInState.name = client.name;
    this.setState({ clients: this.state.clients });
  }

  handleClickUser = userId => {
    this.setState({ selectedUser: userId });
  };

  handleDeleteTeam = async teamId => {
    await deleteTeam(teamId);

    const { teams, users } = this.state;
    const newTeams = teams.filter(({ id }) => id !== teamId);
    const selectedTeam = newTeams.length
      ? newTeams[0].id
      : null;

    let newUsers = users;
    if (newTeams.length) {
      newUsers = await getAllTeamUsers(newTeams[0].id);
    }

    this.setState({ teams: newTeams, selectedTeam, users: newUsers });
  };

  handleDeleteClient = async clientId => {
    await deleteClient(clientId);
  }

  handleDeleteUser = async userId => {
    await deleteUser(userId);

    const { users } = this.state;
    const newUsers = users.filter(({ id }) => id !== userId);
    const selectedUser = newUsers.length ? newUsers[0].id : null;
    this.setState({ users: newUsers, selectedUser });
  };

  // handleUserEdit = user => {
    // TODO
  // }

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
            editHandler: this.handleEditClient,
            deleteHandler: this.handleDeleteClient
          }}
        />
        <TeamsPanel
          teams={teams}
          clientName={selectedClientName}
          selectedTeam={selectedTeam}
          handlers={{
            onClick: this.handleTeamClick,
            deleteHandler: this.handleDeleteTeam,
            editHandler: () => {}
          }}
        />
        <UsersPanel
          teamName={selectedTeamName}
          users={users}
          handlers={{
            onClick: this.handleClickUser,
            deleteHandler: this.handleDeleteUser,
            editHandler: this.handleUserEdit
          }}
          selectedUser={selectedUser}
        />
      </div>
    );
  }
}

export default App;

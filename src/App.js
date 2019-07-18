import React, { Component } from "react";
import ClientsPanel from "./components/clients/ClientsPanel";
import TeamsPanel from "./components/teams/TeamsPanel";
import UsersPanel from "./components/users/UsersPanel";

class App extends Component {
  state = {
    clients: [],
    teams: [],
    users: [],
    selectedClient: null,
    selectedTeam: null
  };

  componentDidMount = () => {
    this.getInitialState();
  };

  getInitialState = async () => {
    const clients = await fetch("api/clients").then(response =>
      response.json()
    );
    const selectedClient = clients[0].id;

    const teams = await fetch(`api/clients/${selectedClient}/roles`).then(
      response => response.json()
    );
    const selectedTeam = teams[0].id;

    const users = await fetch(`api/roles/${selectedTeam}/users`).then(
      response => response.json()
    );

    this.setState({
      clients,
      teams,
      users,
      selectedClient,
      selectedTeam
    });
  };

  handleTeamClick = async teamId => {
    const users = await fetch(`api/roles/${teamId}/users`).then(response =>
      response.json()
    );
    this.setState({ users, selectedTeam: teamId });
  };

  handleClientClick = async clientId => {
    const teams = await fetch(`api/clients/${clientId}/roles`).then(response =>
      response.json()
    );

    let users = [];
    if (teams.length) {
      users = await fetch(`api/roles/${teams[0].id}/users`).then(response =>
        response.json()
      );
    }

    this.setState({
      teams,
      users,
      selectedClient: clientId,
      selectedTeam: teams[0].id
    });
  };

  render() {
    const { clients, teams, users, selectedClient, selectedTeam } = this.state;

    return (
      <div style={{ display: "flex" }}>
        <ClientsPanel
          clients={clients}
          selectedClient={selectedClient}
          onClick={this.handleClientClick}
        />
        <TeamsPanel
          teams={teams}
          client={clients.find(({ id }) => id === selectedClient)}
          selectedTeam={selectedTeam}
          onClick={this.handleTeamClick}
        />
        <UsersPanel users={users} />
      </div>
    );
  }
}

export default App;

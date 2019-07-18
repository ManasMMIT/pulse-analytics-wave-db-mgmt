export const getAllClients = () => fetch("api/clients")
  .then(response =>response.json())

export const getClient = selectedClient => fetch(`api/clients/${selectedClient}/roles`)
  .then(response => response.json());

export const getAllTeamUsers = selectedTeam => fetch(`api/roles/${selectedTeam}/users`)
  .then(response => response.json());

export const getAllClientRoles = clientId => fetch(`api/clients/${clientId}/roles`)
  .then(response => response.json());
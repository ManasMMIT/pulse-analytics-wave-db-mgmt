export const getAllClients = () => fetch("api/clients")
  .then(response =>response.json())

export const getClient = selectedClient => fetch(`api/clients/${selectedClient}/roles`)
  .then(response => response.json())

export const createClient = data => {
  return fetch('api/clients', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(response => response.json())
}

export const createTeam = data => {
  return fetch('api/roles', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(response => response.json())
}

export const getAllTeamUsers = selectedTeam => fetch(`api/roles/${selectedTeam}/users`)
  .then(response => response.json())

export const getAllClientRoles = clientId => fetch(`api/clients/${clientId}/roles`)
  .then(response => response.json())

export const createUser = data => fetch(`api/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
}).then(response => response.json())

export const editUser = (id, userData) => fetch(`api/users/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(userData),
}).then(response => response.json())

export const editClient = (id, name) => {
  return fetch(`api/clients/${ id }`, {
    method: 'PATCH',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  }).then(response => response.json())
}

export const deleteClient = clientId => fetch(`api/clients/${clientId}`, { method: "DELETE" })

export const editTeam = (id, data) => {
  return fetch(`api/roles/${ id }`, {
    method: 'PATCH',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(response => response.json())
}

export const deleteTeam = (teamId, data) => {
  return fetch(`api/roles/${ teamId }`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}

export const deleteUser = userId => fetch(`api/users/${ userId }`, { method: "DELETE" })

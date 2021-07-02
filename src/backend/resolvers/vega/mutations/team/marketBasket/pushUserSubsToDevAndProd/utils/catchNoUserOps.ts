const catchNoUserOps = (userTeamsMap: any) => {
  const hasNoUsersOnTeam = Object.keys(userTeamsMap).length === 0
  if (hasNoUsersOnTeam)
    throw new Error('No users to materialize')
}

export default catchNoUserOps

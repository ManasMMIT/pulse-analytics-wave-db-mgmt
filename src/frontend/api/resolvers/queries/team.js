import {
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
} from '../../queries'

const teamQueryResolvers = {
  /*
    This resolver has ONE JOB: to set a default team (first team)
    from the selected client's teams list, if:
    1. the app is initially loading and team is the dummy initial team, or
    2. the selected team is old and doesn't belong to a newly selected client.

    The mutation resolver `selectTeam` handles cache updates.
  */
  selectedTeam: async (root, args, { client, cache }) => {
    const { selectedTeam } = cache.readQuery({ query: GET_SELECTED_TEAM })
    const { selectedClient } = cache.readQuery({ query: GET_SELECTED_CLIENT })

    let result = selectedTeam
    if (
      selectedTeam._id === 'initialTeam'
      || selectedTeam.client._id !== selectedClient._id
    ) {
      const {
        data: { teams }
      } = await client.query({
        query: GET_CLIENT_TEAMS, // gql query uses @export to get clientId
      })

      result = teams[0]
    }

    return result
  },
}

export default teamQueryResolvers

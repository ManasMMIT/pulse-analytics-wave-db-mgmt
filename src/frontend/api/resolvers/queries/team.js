import {
  GET_SELECTED_CLIENT,
  GET_CLIENT_TEAMS,
  GET_SELECTED_TEAM,
} from '../../queries'

const teamQueryResolvers = {
  // This resolver has ONE JOB: to set a default team, if
  // 1. there is no selected team in the cache or
  // 2. the selected team doesn't belong to the selected client.
  // The mutation resolver `selectTeam` handles cache updates.
  selectedTeam: async (root, args, { client, cache }) => {
    let selectedTeam
    try {
      // ? line 16 will most likely error once, on initial load
      selectedTeam = cache.readQuery({ query: GET_SELECTED_TEAM }).selectedTeam

      const { selectedClient } = cache.readQuery({ query: GET_SELECTED_CLIENT })

      if (selectedTeam.client._id !== selectedClient._id) {
        throw Error('Current selected team not in client')
      }

    } catch (e) {
      const {
        data: { teams }
      } = await client.query({
        query: GET_CLIENT_TEAMS,
      })

      selectedTeam = teams[0]
    }

    return selectedTeam
  },
}

export default teamQueryResolvers

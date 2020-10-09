import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_JOIN_PATHWAYS_AND_PEOPLE,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PEOPLE,
} from 'frontend/api/queries'

const usePathwaysPersonConnections = (args = {}) => {
  const { pathwaysId, personId } = args
  const { data: connectionsData, loading: connectionsLoading } = useQuery(
    GET_JOIN_PATHWAYS_AND_PEOPLE
  )
  const { data: pathwaysData, loading: pathwaysLoading } = useQuery(
    GET_PATHWAYS_ORGANIZATIONS
  )

  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE)

  const loading = [connectionsLoading, pathwaysLoading, peopleLoading].some(
    (loading) => loading
  )

  if (loading) return { data: [], loading }

  const connections = Object.values(connectionsData)[0]
  const pathways = Object.values(pathwaysData)[0]
  const people = Object.values(peopleData)[0]

  const groupedPathwaysById = _.keyBy(pathways, '_id')
  const groupedPeopleById = _.keyBy(people, '_id')

  const joinedData = connections.map(
    joinDataCallBack({ groupedPathwaysById, groupedPeopleById })
  )

  if (!pathwaysId && !personId) return { data: joinedData, loading }

  // Only filter if there's filter params passed in
  const filteredData = joinedData.filter(matchesParams(pathwaysId, personId))

  return {
    data: _.sortBy(filteredData, 'status'),
    loading,
  }
}

const joinDataCallBack = ({ groupedPathwaysById, groupedPeopleById }) => (
  datum
) => {
  const { pathwaysId, personId, endDate, exclusionSettings } = datum

  // Append Derived Fields
  const { description, status } = getConnectionDescriptionAndStatus({
    exclusionSettings,
    endDate,
  })

  const pathwaysDatum = groupedPathwaysById[pathwaysId]
  const personDatum = groupedPeopleById[personId]

  const {
    organization,
    organizationTiny,
    type: organizationType,
    slug: pathwaysSlug,
  } = pathwaysDatum

  const { _id, __typename, ...restPersonDatum } = personDatum

  return {
    ...datum,
    organization,
    organizationTiny,
    organizationType,
    pathwaysSlug,
    ...restPersonDatum,
    description,
    status,
  }
}

const getConnectionDescriptionAndStatus = ({ exclusionSettings, endDate }) => {
  // ! wait why is description a date? and then changed to a string on line 90?
  // ! and then changed to null on line 94? what's description going to be used for?
  let description = endDate
  let status = 'outdated'

  if (exclusionSettings.isExcluded) {
    description = exclusionSettings.reason
    status = 'excluded'
  } else if (endDate === null) {
    description = null
    status = 'active'
  }

  return {
    description,
    status,
  }
}

const matchesParams = (pathwaysId, personId) => {
  return ({ pathwaysId: localPathwaysId, personId: localPersonId }) => {
    if (pathwaysId && personId) {
      return localPathwaysId === pathwaysId && localPersonId === personId
    }

    return localPathwaysId === pathwaysId || localPersonId === personId
  }
}

export default usePathwaysPersonConnections

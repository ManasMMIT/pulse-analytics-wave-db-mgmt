import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_JOIN_PATHWAYS_AND_PEOPLE,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PEOPLE,
  GET_SOURCE_INDICATIONS,
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
  const { data: indicationData, loading: indicationLoading } = useQuery(
    GET_SOURCE_INDICATIONS
  )

  const loading = [
    connectionsLoading,
    pathwaysLoading,
    peopleLoading,
    indicationLoading,
  ].some((loading) => loading)

  if (loading) return { data: [], loading }

  const connections = Object.values(connectionsData)[0]
  const pathways = Object.values(pathwaysData)[0]
  const people = Object.values(peopleData)[0]
  const indications = Object.values(indicationData)[0]

  const groupedPathwaysById = _.keyBy(pathways, '_id')
  const groupedPeopleById = _.keyBy(people, '_id')
  const groupedIndicationsById = _.keyBy(indications, '_id')

  const joinedData = connections.reduce(
    joinDataCallBack({
      groupedPathwaysById,
      groupedPeopleById,
      groupedIndicationsById,
    }),
    []
  )

  if (!pathwaysId && !personId) return { data: joinedData, loading }

  // Only filter if there's filter params passed in
  const filteredData = joinedData.filter(matchesParams(pathwaysId, personId))

  return {
    data: _.sortBy(filteredData, 'status'),
    loading,
  }
}

const joinDataCallBack = ({
  groupedPathwaysById,
  groupedPeopleById,
  groupedIndicationsById,
}) => (acc, datum) => {
  const {
    pathwaysId,
    personId,
    endDate,
    exclusionSettings,
    indicationIds,
    updatedOn: connectionUpdatedOn,
  } = datum

  // Append Derived Fields
  const { description, status } = getConnectionDescriptionAndStatus({
    exclusionSettings,
    endDate,
  })

  const indicationPermissions = (indicationIds || []).map(
    (indicationId) => (groupedIndicationsById[indicationId] || {}).name
  )

  const pathwaysDatum = groupedPathwaysById[pathwaysId]
  const personDatum = groupedPeopleById[personId]

  if (!personDatum || !pathwaysDatum) return acc

  const {
    organization,
    organizationTiny,
    type: organizationType,
    slug: pathwaysSlug,
  } = pathwaysDatum

  const {
    _id,
    __typename,
    updatedOn: personUpdatedOn,
    createdOn: personCreatedOn,
    ...restPersonDatum
  } = personDatum

  acc.push({
    ...datum,
    organization,
    organizationTiny,
    organizationType,
    pathwaysSlug,
    ...restPersonDatum,
    updatedOn: connectionUpdatedOn,
    description,
    status,
    indicationPermissions,
  })

  return acc
}

const getConnectionDescriptionAndStatus = ({ exclusionSettings, endDate }) => {
  // 'description' here refers to the text that appears as the third line
  // of each item in the org connections panel (middle panel in widget); it can be a
  // date if the connection is outdated, or an exclusion reason
  let description = endDate
  let status = 'outdated'

  if (exclusionSettings.isExcluded) {
    description = exclusionSettings.reason
    status = 'excluded'
  } else if (!endDate) {
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

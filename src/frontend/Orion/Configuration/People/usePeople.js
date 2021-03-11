import _ from 'lodash'
import { useQuery } from '@apollo/client'

import { GET_PEOPLE } from 'frontend/api/queries'

import useDevPathwaysInfluencers from './useDevPathwaysInfluencers'
import useDevProviderInfluencers from './useDevProviderInfluencers'
import useObmPersonConnections from '../../Organizations/Obm/useObmPersonConnections'

const usePeople = () => {
  const { data: peopleDataObj, loading: peopleLoading } = useQuery(GET_PEOPLE)

  const {
    data: devPathwaysInfluencers,
    loading: loadingDevPathwaysInfluencers,
  } = useDevPathwaysInfluencers()

  const {
    data: devProviderInfluencers,
    loading: loadingDevProviderInfluencers,
  } = useDevProviderInfluencers()

  const {
    data: obmPersonConnections,
    loading: loadingObmPersonConnections,
  } = useObmPersonConnections()

  const hasDataLoaded =
    !peopleLoading &&
    !loadingDevPathwaysInfluencers &&
    !loadingObmPersonConnections &&
    !loadingDevProviderInfluencers

  let people = []
  if (hasDataLoaded) {
    people = Object.values(peopleDataObj)[0] || []

    people = formatData(people, {
      pathwaysData: devPathwaysInfluencers,
      providerData: devProviderInfluencers,
      obmData: obmPersonConnections,
    })
  }

  return {
    data: people,
    loading: !hasDataLoaded,
  }
}

const formatData = (peopleData, dataSources) => {
  // ! don't mutate data from cache (dangerous)
  const clonedPeople = _.cloneDeep(peopleData)
  const injectSources = getInjectSources(dataSources)
  clonedPeople.forEach(injectSources)
  return clonedPeople
}

const getInjectSources = ({ pathwaysData, providerData, obmData }) => {
  const pathwaysDataByPersonId = _.keyBy(pathwaysData, 'personId')
  const providerDataByPersonId = _.keyBy(providerData, 'personId')
  const obmDataByPersonId = _.keyBy(obmData, 'personId')

  return (person) => {
    person.hasPathwaysData = Boolean(pathwaysDataByPersonId[person._id])
    person.hasProviderData = Boolean(providerDataByPersonId[person._id])
    person.hasObmData = Boolean(obmDataByPersonId[person._id])
  }
}

export default usePeople

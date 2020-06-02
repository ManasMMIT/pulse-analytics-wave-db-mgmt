import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import {
  GET_AQUILA_PQL_RESULTS,
  GET_AQUILA_BUSINESS_OBJECTS,
  GET_AQUILA_BO_FILTER_SETTINGS,
} from 'frontend/api/queries'

export default () => {
  const history = useHistory()
  const location = useLocation()

  const pql = getPqlFromLocation(location)

  const [
    getAquilaPqlResults,
    {
      data: pqlResult,
      loading: loadingPql,
    },
  ] = useLazyQuery(GET_AQUILA_PQL_RESULTS, { variables: { pql } })

  const [
    getFilterConfigOptions,
    {
      data: filterConfigOptionsData,
      loading: loadingFilterConfigOptions,
    }
  ] = useLazyQuery(GET_AQUILA_BUSINESS_OBJECTS)

  const [
    getPlacardOptions,
    {
      data: placardOptionsData,
      loading: loadingPlacardOptions,
    }
  ] = useLazyQuery(GET_AQUILA_BO_FILTER_SETTINGS)

  // On mount: 1. If pql exists, get results; 2. always get filterConfigOptions
  useEffect(() => {
    if (pql.length) getAquilaPqlResults()

    getFilterConfigOptions()
  }, [])

  const setPql = getSetPql(history)

  return {
    data: {
      pql,
      results: pqlResult
        ? pqlResult.aquilaPqlResults
        : [],
      filterConfigOptions: filterConfigOptionsData
        ? filterConfigOptionsData.aquilaBusinessObjects
        : [],
      placardOptions: placardOptionsData
        ? placardOptionsData.aquilaBoFilterSettings
        : [],
    },
    setPql,
    loading: loadingPql || loadingFilterConfigOptions || loadingPlacardOptions,
    submitPql: getAquilaPqlResults,
    getPlacardOptions,
  }
}

const getSetPql = (history) => pql => {
  history.push({
    search: queryString.stringify({ pql }),
  })
}

const getPqlFromLocation = location => {
  const queryStringVars = location.search && queryString.parse(location.search)
  const pql = queryStringVars && queryStringVars.pql
    ? queryStringVars.pql
    : ''

  return pql
}

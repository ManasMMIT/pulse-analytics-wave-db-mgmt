import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import queryString from 'query-string'

import { GET_AQUILA_PQL_RESULTS } from 'frontend/api/queries'

const usePql = () => {
  const history = useHistory()
  const location = useLocation()

  const pql = getPqlFromLocation(location)

  const [
    getAquilaPqlResultsRaw,
    { data: pqlResult, loading: loadingPql },
  ] = useLazyQuery(GET_AQUILA_PQL_RESULTS, { fetchPolicy: 'network-only' })

  // ! passing variables to useLazyQuery triggers the query whenever vars change.
  // ? https://stackoverflow.com/questions/57499553/is-it-possible-to-prevent-uselazyquery-queries-from-being-re-fetched-on-compon
  const getAquilaPqlResults = (pql) =>
    getAquilaPqlResultsRaw({ variables: { pql } })

  // On mount, if pql exists, get results
  useEffect(() => {
    if (pql.length) getAquilaPqlResults(pql)
  }, [])

  const setPql = (pql) => {
    history.push({
      search: queryString.stringify({ pql }),
    })
  }

  const results =
    pqlResult && !pqlResult.aquilaPqlResults.error
      ? pqlResult.aquilaPqlResults
      : []

  return {
    data: { pql, results },
    loading: loadingPql,
    submitPql: getAquilaPqlResults,
    setPql,
  }
}

const getPqlFromLocation = (location) => {
  const queryStringVars = location.search && queryString.parse(location.search)
  const pql = queryStringVars && queryStringVars.pql ? queryStringVars.pql : ''

  return pql
}

export default usePql

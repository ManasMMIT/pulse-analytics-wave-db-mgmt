import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useLazyQuery } from '@apollo/react-hooks'
import queryString from 'query-string'

import {
  GET_AQUILA_PQL_RESULTS,
} from 'frontend/api/queries'

const usePql = () => {
  const history = useHistory()
  const location = useLocation()

  const pql = getPqlFromLocation(location)

  const [
    getAquilaPqlResults,
    {
      data: pqlResult,
      loading: loadingPql,
    },
  ] = useLazyQuery(
    GET_AQUILA_PQL_RESULTS,
    { variables: { pql } },
  )

  // On mount, if pql exists, get results
  useEffect(() => {
    if (pql.length) getAquilaPqlResults()
  }, [])

  const setPql = pql => {
    history.push({
      search: queryString.stringify({ pql }),
    })
  }

  const results = pqlResult
    ? pqlResult.aquilaPqlResults
    : []

  return {
    data: { pql, results },
    loading: loadingPql,
    submitPql: getAquilaPqlResults,
    setPql,
  }
}

const getPqlFromLocation = location => {
  const queryStringVars = location.search && queryString.parse(location.search)
  const pql = queryStringVars && queryStringVars.pql
    ? queryStringVars.pql
    : ''

  return pql
}

export default usePql

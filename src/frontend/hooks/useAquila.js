import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import _ from 'lodash'

import { useAuth0 } from '../../react-auth0-spa'

const AQUILA_ROOT = 'http://localhost:1500'
const PQL_ENDPOINT = `${ AQUILA_ROOT }/pql`
const FILTER_CONFIG_ENDPOINT = `${ AQUILA_ROOT }/filter-configs`

export default () => {
  const history = useHistory()
  const location = useLocation()
  const { accessToken } = useAuth0()

  const [pql, pqlSetter] = useState('')

  const [pqlResult, setPqlResult] = useState([])
  const [loadingPql, setPqlLoading] = useState(false)

  const [filterOptions, setFilterOptions] = useState([])
  const [loadingFilterOptions, setFilterOptionsLoading] = useState(true)

  const submitPql = getSubmitPql(accessToken, setPqlResult, setPqlLoading)
  const setPql = getSetPql(history, pqlSetter)

  useEffect(() => {
    getFilterOptions(accessToken, setFilterOptions, setFilterOptionsLoading)

    const queryStringVars = location.search && queryString.parse(location.search)
    const pqlOnLoad = queryStringVars && queryStringVars.pql
      ? queryStringVars.pql
      : ''

    if (pqlOnLoad.length) {
      submitPql(pqlOnLoad)
      setPql(pqlOnLoad)
    }
  }, [])

  return {
    data: {
      pql,
      results: pqlResult,
      filterOptions,
    },
    setPql,
    loading: loadingPql || loadingFilterOptions,
    submitPql,
  }
}

const getSubmitPql = (accessToken, setPqlResult, setPqlLoading) => pql => {
  setPqlLoading(true)

  fetch(
    PQL_ENDPOINT,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ pql })
    }
  )
    .then(res => res.json())
    .then(res => {
      const sampledResults = res.error
        ? res
        : _.sampleSize(res, 50)
      setPqlResult(sampledResults)

      setPqlLoading(false)
    })
}

const getSetPql = (history, pqlSetter) => pql => {
  history.push({
    search: queryString.stringify({ pql }),
  })

  pqlSetter(pql)
}

const getFilterOptions = (accessToken, setFilterOptions, setFilterOptionsLoading) => {
  setFilterOptionsLoading(true)

  fetch(
    FILTER_CONFIG_ENDPOINT,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then(res => res.json())
    .then(res => {
      setFilterOptions(res)
      setFilterOptionsLoading(false)
    })
}

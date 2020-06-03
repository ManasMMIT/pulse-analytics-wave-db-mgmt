import { useState, useEffect } from 'react'
import { useAuth0 } from '../../../../../react-auth0-spa'
import _ from 'lodash'

const AQUILA_ROOT = 'http://localhost:1500'
const PQL_ENDPOINT = `${AQUILA_ROOT}/pql-object`

export default (pql) => {
  const [pqlObject, setPqlObject] = useState({})
  const [loading, setLoading] = useState(true)
  const { accessToken } = useAuth0()

  const fetchPqlObject = () => fetch(
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
      setPqlObject(res)
      setLoading(false)
    })

  useEffect(() => {
    fetchPqlObject()
  }, [])

  // ! Reset to empty pqlObject whenever inner pql is empty
  const innerPqlWithCurlies = pql.match(/\{.*?\}/g)
  const innerPql = innerPqlWithCurlies && innerPqlWithCurlies[0].slice(1, -1)
  const pqlIsEmpty = !innerPql || !innerPql.length

  useEffect(() => {
    if (pqlIsEmpty && !_.isEmpty(pqlObject)) {
      fetchPqlObject()
    }
  }, [pql])

  let params = []
  if (!_.isEmpty(pqlObject)) {
    params = pqlObject.params.map(({ key, values }) => {
      const options = values.map(value => ({ value, label: value }))

      return { key, options }
    })
  }

  return {
    data: {
      pqlObject: { ...pqlObject, params }
    },
    loading,
  }
}

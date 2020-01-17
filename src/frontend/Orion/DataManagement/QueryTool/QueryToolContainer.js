import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'
import queryString from 'query-string'

import {
  FILTER_QUERY,
} from './../../../api/mutations'

import useQueryTool from './useQueryTool'

import QueryTool from './QueryTool'

const CSV_FILENAME = `Query-Tool-Results`

const ACCOUNT_TYPE_OPTIONS = [
  'Payer',
  'Provider',
  'Pathways',
  'Alternative Payment Model',
]

const getAccountOnChangeHandler = (
  orgTypes,
  history,
  setSelectedAccount,
) => account => {
  const accountQueryStrings = _.isEmpty(account)
    ? {}
    : { selectedAccountId: account.value }

  const orgTypesObj = orgTypes
    ? { orgTypes: orgTypes.map(({ value }) => value) }
    : {}

  const newQueryStrings = queryString.stringify({
    ...orgTypesObj,
    ...accountQueryStrings,
  })

  history.push({
    search: newQueryStrings,
  })

  setSelectedAccount(account)
}

const getSubmitHandler = (
  selectedAccount,
  formattedOrgTypes,
  filterQuery,
) => () => {
  let selectedAccountObj = selectedAccount
    ? { selectedAccount: selectedAccount.value }
    : {}

  filterQuery({
    variables: {
      input: {
        orgTypes: formattedOrgTypes,
        ...selectedAccountObj,
      }
    },
  })
}

const getOrgTypesOnChangeHandler = (
  selectedAccount,
  history,
  setOrgTypes,
) => orgTypes => {
  const orgTypesObj = orgTypes
    ? { orgTypes: orgTypes.map(({ value }) => value) }
    : {}

  const selectedAccountObj = selectedAccount
    ? { selectedAccountId: selectedAccount.value }
    : {}

  const newQueryStrings = queryString.stringify({
    ...orgTypesObj,
    ...selectedAccountObj,
  })

  history.push({
    search: newQueryStrings
  })

  setOrgTypes(orgTypes)
}

const QueryToolContainer = ({
  location: { search },
  history,
}) => {
  // TODO: replace with useEffect to only load URL filters on component mount
  const [
    hasLoadedInitialFilter,
    setHasLoadedInitialFilter,
  ] = useState(false)
  const [showCsvButton, setShowCsvButton] = useState(false)
  const [dataToDisplay, setDataToDisplay] = useState([])
  const [orgTypes, setOrgTypes] = useState([])
  const [selectedAccount, setSelectedAccount] = useState('')

  const { data, loading } = useQueryTool()

  const [filterQuery] = useMutation(
    FILTER_QUERY,
    {
      onCompleted: ({ filterQuery: result }) => {
        setDataToDisplay(result)
        const shouldNotDisplayData = (
          _.isEmpty(result)
            || _.isEmpty(selectedAccount)
            || _.isEmpty(orgTypes)
        )

        // if (shouldNotDisplayData) setShowCsvButton(false)
        // else setShowCsvButton(true)
      }
    }
  )

  if (loading) return null

  const { queryToolAccounts } = data

  const accountFilterOptions = queryToolAccounts
    .map(({ _id, organization, type }) => ({
      value: _id,
      label: `${ organization } (${ type })`,
    }))

  const UrlInput = queryString.parse(search)

  const orgTypeFilterOptions = ACCOUNT_TYPE_OPTIONS
    .map(accountType => ({ value: accountType, label: accountType }))

  let defaultOrgTypes = Object.keys(
    _.groupBy(dataToDisplay, 'slugType')
  ).map(type => ({ value: type, label: type }))

  let UrlOrgTypes = []
  if (UrlInput.orgTypes) {
    // This check is needed because the query string
    // with one orgType is a string, not an array
    UrlOrgTypes = typeof UrlInput.orgTypes === 'string'
      ? [UrlInput.orgTypes]
      : UrlInput.orgTypes

    defaultOrgTypes = UrlOrgTypes.map(type => ({
      value: type,
      label: type
    }))
  }

  let defaultSelectedAccount = null
  if (UrlInput.selectedAccountId) {
    defaultSelectedAccount = accountFilterOptions
      .find(({ value }) => value === UrlInput.selectedAccountId)
  }

  // only load filter from URL on first mount
  if (!hasLoadedInitialFilter) {
    const input = {
      orgTypes: UrlOrgTypes,
      selectedAccount: UrlInput.selectedAccountId,
    }

    const formattedUrlOrgTypes = UrlOrgTypes
      .map(orgType => ({ label: orgType, value: orgType }))

    setOrgTypes(formattedUrlOrgTypes)

    setSelectedAccount(defaultSelectedAccount)

    filterQuery({ variables: { input }, fetchPolicy: 'no-cache' })

    setHasLoadedInitialFilter(true)
  }

  let csvData = []
  if (showCsvButton) {
    csvData = _.cloneDeep(dataToDisplay).reduce((acc, org) => {
      const getCsvObj = connection => ({
        _id: connection._id,
        slug: org.slug,
        slugType: org.type,
        affiliationType: connection.affiliationType,
        slug1: connection.org.slug,
        slugType1: connection.org.type,
        state: connection.state,
      })

      const connectionsByState = (org.connections || []).map(getCsvObj)

      acc = acc.concat(connectionsByState)

      return acc
    }, [])
  }

  let formattedOrgTypes = orgTypes
    ? orgTypes.map(({ value }) => value)
    : []

  const accountConfig = {
    defaultValue: defaultSelectedAccount,
    selected: selectedAccount,
    filterOptions: accountFilterOptions,
    onChangeHandler: getAccountOnChangeHandler(orgTypes, history, setSelectedAccount)
  }

  const orgTypesConfig = {
    defaultValue: defaultOrgTypes,
    selected: orgTypes,
    filterOptions: orgTypeFilterOptions,
    onChangeHandler: getOrgTypesOnChangeHandler(selectedAccount, history, setOrgTypes)
  }

  const emptyRowObj = {
    _id: undefined,
    slug: undefined,
    slugType: undefined,
    affiliationType: undefined,
    slug1: undefined,
    slugType1: undefined,
    state: undefined,
  }

  if (csvData && csvData.length) {
    csvData.splice(0, 0, emptyRowObj, emptyRowObj)
  }

  const csvConfig = {
    data: csvData,
    fileName: CSV_FILENAME,
    shouldShow: showCsvButton,
  }

  const submitHandler = getSubmitHandler(
    selectedAccount,
    formattedOrgTypes,
    filterQuery,
  )

  const resetHandler = () => {
    history.push({ search: '' })
    window.location.reload(false)
  }

  return (
    <QueryTool
      dataToDisplay={dataToDisplay}
      setDataToDisplay={setDataToDisplay}
      accountConfig={accountConfig}
      orgTypesConfig={orgTypesConfig}
      csvConfig={csvConfig}
      submitHandler={submitHandler}
      resetHandler={resetHandler}
    />
  )
}

export default QueryToolContainer

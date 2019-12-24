// ? useQueryToolData

import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  FILTER_QUERY,
} from '../../../api/mutations'

export default ({
  orgTypes,
  selectedAccount,
}) => {
  const [showCsvButton, setShowCsvButton] = useState(false)
  const [dataToDisplay, setDataToDisplay] = useState([])

  const formattedOrgTypes = orgTypes
    ? orgTypes.map(({ value }) => value)
    : []

  const selectedAccountObj = selectedAccount
    ? {
        selectedAccount: selectedAccount.value
      }
    : {}

  const [filterQuery] = useMutation(
    FILTER_QUERY,
    {
      variables: {
        input: {
          orgTypes: formattedOrgTypes,
          ...selectedAccountObj,
        }
      },
      onCompleted: ({ filterQuery: result }) => {
        setDataToDisplay(result)

        const shouldNotDisplayData = (
          _.isEmpty(result)
          || _.isEmpty(selectedAccount)
          || _.isEmpty(orgTypes)
        )

        if (shouldNotDisplayData) setShowCsvButton(false)
        else setShowCsvButton(true)
      }
    }
  )

  return ({
    showCsvButton,
    dataToDisplay,
    filterQuery,
    setDataToDisplay,
  })
}

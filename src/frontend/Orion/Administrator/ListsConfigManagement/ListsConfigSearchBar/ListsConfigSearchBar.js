import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
import Select from 'react-select'

import { GET_LISTS_CONFIG } from 'frontend/api/queries'

const SEARCH_BAR_PLACEHOLDER_TEXT = 'Search Lists, List Keys, List Labels'

const getListsConfigOptionLabel = (listsConfig, labelKey) => {
  return (
    `Dashboard Tool: ${listsConfig.dashboardTool} | List: ${listsConfig.listId} ` +
    `| List Item Key: ${labelKey.labelKey} | List Item Label: ${labelKey.labelName}`
  )
}

const ListsConfigSearchBar = () => {
  const [searchOptions, setSearchOptions] = useState([])

  const history = useHistory()

  const { data: listsConfigData, loading } = useQuery(GET_LISTS_CONFIG)

  const handleSearchSelection = ({ value }) => {
    history.push({
      search: queryString.stringify(value),
    })
  }

  const handleSearchChange = (obj) => {
    let newListsConfigs = []

    if (obj && listsConfigData) {
      listsConfigData.listsConfig.forEach((listsConfig) => {
        const isIncludedListsConfig = listsConfig.listId.includes(obj)

        listsConfig.labelKeys.forEach((labelKey) => {
          if (
            isIncludedListsConfig ||
            labelKey.labelKey.includes(obj) ||
            (labelKey.labelName && labelKey.labelName.includes(obj))
          ) {
            newListsConfigs.push({
              label: getListsConfigOptionLabel(listsConfig, labelKey),
              value: {
                dashboardTool: listsConfig.dashboardTool,
                listsConfigId: listsConfig._id,
                listItemKey: labelKey.labelKey,
              },
            })
          }
        })
      })
    }

    setSearchOptions(newListsConfigs)
  }

  const searchBarStyles = {
    container: (base) => ({ ...base, flex: 1 }),
    control: (base) => ({ ...base, height: 40 }),
    singleValue: (base) => ({ ...base, fontStyle: 'italic', opacity: 0.5 }),
  }

  return (
    <Select
      styles={searchBarStyles}
      value={{ label: SEARCH_BAR_PLACEHOLDER_TEXT }}
      onChange={handleSearchSelection}
      onInputChange={handleSearchChange}
      options={searchOptions}
      isDisabled={loading}
    />
  )
}

export default ListsConfigSearchBar

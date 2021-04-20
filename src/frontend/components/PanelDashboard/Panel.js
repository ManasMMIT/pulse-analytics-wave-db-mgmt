import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import { getNewSearchParams } from './utils'

import Header from './Header'
import Title from './Title'
import List from './List'

const Wrapper = styled.div(
  {
    height: '100%',
    overflowY: 'scroll',
  },
  ({ style }) => ({
    ...style,
  })
)

const Panel = ({
  ListItem,
  header,
  title,
  searchParam,
  searchParamKey,
  query,
  queryVariable,
  footer,
  style,
  listStyle,
  searchParamsAncestry,
}) => {
  const history = useHistory()
  const location = useLocation()

  const currentSearchParams =
    (location.search && queryString.parse(location.search)) || {}
  const selectedListItem = currentSearchParams[searchParam]
  const queryVariableInput = currentSearchParams[queryVariable]

  const queryInput = {}
  if (queryVariable) queryInput[queryVariable] = queryVariableInput

  const { data, loading } = useQuery(query, {
    variables: queryInput,
  })

  const handleClick = pushNewSearchParams(
    searchParamsAncestry,
    searchParam,
    currentSearchParams,
    history
  )

  const firstListItemKey = !loading && Object.keys(data)[0]
  const listItems = (!loading && data[firstListItemKey]) || []

  const setFirstListItem = () => {
    const firstListItem = listItems[0]

    if (!selectedListItem && firstListItem) {
      handleClick(firstListItem[searchParamKey])
    }
  }

  const getFirstListItemEffect = () => {
    const useEffectDependencies = [loading, selectedListItem]
    if (queryVariableInput) useEffectDependencies.push(queryVariableInput)

    return [setFirstListItem, useEffectDependencies]
  }

  useEffect(...getFirstListItemEffect())

  return (
    <Wrapper style={style}>
      {header && <Header {...header} />}
      <Title {...title} />
      <List
        data={listItems}
        searchParamKey={searchParamKey}
        ListItem={ListItem}
        handleClick={handleClick}
        style={listStyle}
      />
      {
        // TODO: Make Footer
        // footer && 'Footer'
      }
    </Wrapper>
  )
}

Panel.propTypes = {
  header: Header.propTypes,
  title: Title.propTypes,
  searchParam: PropTypes.string.isRequired,
  searchParamKey: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  queryVariable: PropTypes.string,
  footer: PropTypes.object,
  style: PropTypes.object,
  listStyle: List.propTypes.style,
  searchParamsAncestry: PropTypes.array.isRequired,
}

Panel.defaultProps = {
  style: {},
  listStyle: List.defaultProps.style,
}

export default Panel

function pushNewSearchParams(
  searchParamsAncestry,
  searchParam,
  currentSearchParams,
  history
) {
  return (newSearchInput) => {
    const newSearchParams = getNewSearchParams(
      searchParamsAncestry,
      searchParam,
      currentSearchParams,
      newSearchInput
    )

    history.push({
      search: queryString.stringify(newSearchParams),
    })
  }
}

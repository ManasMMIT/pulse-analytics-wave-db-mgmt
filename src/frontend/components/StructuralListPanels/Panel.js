import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'

import Spinner from 'frontend/components/Spinner'
import Color from 'frontend/utils/color'

import { pushNewSearchParams } from './utils'

import Header from './Header'
import ListHeader from './ListHeader'
import List from './List'
import SortableList from './SortableList'

const DEFAULT_WRAPPER_STYLE = {
  flex: 1,
}

const DEFAULT_LIST_WRAPPER_STYLE = {
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'auto',
  borderRight: `2px solid ${Color.GRAY_LIGHT}`,
  background: Color.WHITE,
}

const DEFAULT_SPINNER_DIV_STYLE = {
  textAlign: 'center',
  marginTop: '30%',
}

const DEFAULT_ERROR_DIV_STYLE = {
  textAlign: 'center',
  marginTop: '30%',
}

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const ListWrapper = styled.div(DEFAULT_LIST_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const ContainedSpinner = () => (
  <div style={DEFAULT_SPINNER_DIV_STYLE}>
    <Spinner />
  </div>
)

const ErrorDiv = () => (
  <div style={DEFAULT_ERROR_DIV_STYLE}>Error fetching data</div>
)

const Panel = ({
  data,
  loading,
  error,
  searchParamConfig: { searchParam, searchParamKey, searchParamsAncestry },
  style,
  listWrapperStyle,
  headerConfig,
  listHeaderConfig,
  listConfig,
  footerConfig,
}) => {
  const history = useHistory()
  const location = useLocation()

  const currentSearchParams =
    (location.search && queryString.parse(location.search)) || {}
  const selectedListItem = currentSearchParams[searchParam]

  const handleClick = pushNewSearchParams(
    searchParamsAncestry,
    searchParam,
    currentSearchParams,
    history
  )

  const setFirstListItem = () => {
    const [firstListItem] = data
    const isClickable = firstListItem && !selectedListItem

    if (isClickable) {
      handleClick(firstListItem[searchParamKey])
    }
  }

  const getFirstListItemEffect = () => {
    const useEffectDependencies = [data]

    return [setFirstListItem, useEffectDependencies]
  }

  useEffect(...getFirstListItemEffect())

  let headerContent = null
  if (headerConfig) {
    if (headerConfig.Header) {
      const { Header, ...headerProps } = headerConfig
      headerContent = <Header {...headerProps} />
    } else {
      headerContent = <Header {...headerConfig} />
    }
  }

  let listHeaderContent = null
  if (listHeaderConfig.ListHeader) {
    const { ListHeader, ...listHeaderProps } = listHeaderConfig
    listHeaderContent = (
      <ListHeader
        loading={loading}
        error={error}
        handleClick={handleClick}
        {...listHeaderProps}
      />
    )
  } else {
    listHeaderContent = (
      <ListHeader
        loading={loading}
        error={error}
        handleClick={handleClick}
        {...listHeaderConfig}
      />
    )
  }

  let listContent = null
  if (loading) {
    listContent = <ContainedSpinner />
  } else if (error) {
    listContent = <ErrorDiv />
  } else {
    if (listConfig.sortableConfig) {
      listContent = (
        <SortableList
          data={data}
          searchParamKey={searchParamKey}
          selectedListItem={selectedListItem}
          handleClick={handleClick}
          {...listConfig}
          {...listConfig.sortableConfig}
        />
      )
    } else {
      listContent = (
        <List
          data={data}
          searchParamKey={searchParamKey}
          searchParam={searchParam}
          selectedListItem={selectedListItem}
          handleClick={handleClick}
          {...listConfig}
        />
      )
    }
  }

  return (
    <Wrapper style={style}>
      {headerContent}
      <ListWrapper style={listWrapperStyle}>
        {listHeaderContent}
        {listContent}
      </ListWrapper>
      {
        // TODO: Make Footer
        // {footerContent}
      }
    </Wrapper>
  )
}

Panel.propTypes = {
  searchParamConfig: PropTypes.object.isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  style: PropTypes.object,
  listWrapperStyle: PropTypes.object,
  headerConfig: PropTypes.object,
  listHeaderConfig: PropTypes.object,
  listConfig: PropTypes.object,
  footerConfig: PropTypes.object,
}

Panel.defaultProps = {
  data: [],
  loading: false,
  error: false,
  style: {},
  listWrapperStyle: {},
  headerConfig: null,
  listHeaderConfig: {},
  listConfig: {},
  footerConfig: null,
}

export default Panel

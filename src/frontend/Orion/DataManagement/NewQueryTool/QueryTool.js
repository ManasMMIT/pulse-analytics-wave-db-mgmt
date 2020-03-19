import React, { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'

import useAquila from '../../../hooks/useAquila'

import Spacing from '../../../utils/spacing'
import FontSpace from '../../../utils/fontspace'
import Color from '../../../utils/color'

import FilterMenu from '../../../components/FilterMenu'
import Button from '../../../components/Button'
import SectionCard from './SectionCard'

import { generatePqlString } from './utils'

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
})

const FiltersContainer = styled.div({
  display: 'flex',
  margin: Spacing.S4,
  padding: Spacing.S4,
  border: '1px solid black',
  borderRadius: 4,
  background: Color.WHITE,
})

const QueryTool = () => {
  const [
    filterConfigOptions,
    setFilterConfigOptions,
  ] = useState([])

  const [
    isMenuOpen,
    toggleMenu,
  ] = useState(false)

  const [
    filterValues,
    setFilterValues,
  ] = useState({})

  const {
    setPql,
    data: { pql, results },
    getFilterConfigOptions,
    getPlacardOptions,
    loading,
    submitPql,
  } = useAquila()

  useEffect(() => {
    getFilterConfigOptions().then(result => {
      setFilterConfigOptions(result)
    })
  }, [])

  const optionsLoaded = !_.isEmpty(filterConfigOptions)

  const filterPlacards = filterConfigOptions.filter(({ name }) => Boolean(filterValues[name]))

  const filterMenuOptions = filterConfigOptions.map(({ name }) => {
    const newFilterValues = { ...filterValues, [name]: {} }

    return ({
      label: name,
      onClick: () => {
        setFilterValues(newFilterValues)

        const pqlString = generatePqlString(newFilterValues)
        setPql(pqlString)

        toggleMenu(false)
      }
    })
  })

  const anchorEl = useRef()

  return (
    <Wrapper>
      <h1 style={{ padding: Spacing.S4, ...FontSpace.FS4 }}>Query Tool</h1>
      <FiltersContainer>
        <Button
          ref={anchorEl}
          onClick={() => toggleMenu(!isMenuOpen)}
        >
          +
        </Button>
        { 
          optionsLoaded && 
          filterPlacards.map(filterOption => 
            <SectionCard 
              filterOption={filterOption}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              getPlacardOptions={getPlacardOptions}
              setPql={setPql}
            />
          )
        }
      </FiltersContainer>
      <FilterMenu
        anchorEl={anchorEl.current}
        isMenuOpen={isMenuOpen}
        options={filterMenuOptions}
        onClickAway={() => toggleMenu(false)}
        filterValues={filterValues}
      />
    </Wrapper>
  )
}

export default QueryTool

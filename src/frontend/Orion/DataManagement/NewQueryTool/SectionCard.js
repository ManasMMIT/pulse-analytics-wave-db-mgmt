import React, { useState, useEffect  } from 'react'
import _ from 'lodash'

import { FieldsSectionCardWithMenu } from '../../../components/FieldsSectionCard'

import { generatePqlString } from './utils'

const SectionCard = ({
  filterOption,
  filterValues,
  setFilterValues,
  getPlacardOptions,
  setPql,
}) => {
  const { name, boId } = filterOption

  const [
    isCardMenuOpen,
    toggleCardMenu
  ] = useState(false)

  const [
    placardOptions,
    setPlacardOptions,
  ] = useState({})

  useEffect(() => {
    getPlacardOptions(boId).then(result => {
      setPlacardOptions(result)
    })
  }, [])

  let fields = [] // config for inputs to be generated in FieldsSectionCardWithMenu
  const activeFields = filterValues[name] || null

  if (activeFields) {
    /*
      Populate the fields array that contains only the fields to display and add the callback
      that can be used to remove each field
    */
    fields = Object.keys(activeFields).reduce((result, fieldKey) => {
      const field = _.isEmpty(placardOptions) 
        ? {}
        : placardOptions.fields.find(({ key }) => key === fieldKey)

      const fieldToAdd = {
        ...field,
        removeCb: () => {
          const newFilterValue = { ...filterValues[name] }
          delete newFilterValue[fieldKey]
  
          const newFilterValues = { ...filterValues, [name]: newFilterValue }

          setFilterValues(newFilterValues)

          const pqlString = generatePqlString(newFilterValues)
          setPql(pqlString)
        },
      }

      fieldToAdd.inputProps.onChange = selections => {
        const values = selections ? selections.map(({ value }) => value) : []
        const newFilterValue = { ...filterValues[name] }

        newFilterValue[fieldKey] = values
        const newFilterValues = { ...filterValues, [name]: newFilterValue }

        setFilterValues(newFilterValues)

        const pqlString = generatePqlString(newFilterValues)
        setPql(pqlString)
      }

      result.push(fieldToAdd)

      return result
    }, [])
  }

  let filterMenuOptions = []
  if (!_.isEmpty(placardOptions)) {
    filterMenuOptions = placardOptions.fields.map(field => {
      const { label, key } = field

      const currentCardConfig = filterValues[name]
      const newCardConfig = { ...currentCardConfig, [key]: [] }
      const newFilterConfig = { ...filterValues, [name]: newCardConfig }
  
      return ({
        label,
        onClick: () => {
          setFilterValues(newFilterConfig)
          
          const pqlString = generatePqlString(newFilterConfig)
          setPql(pqlString)
  
          toggleCardMenu(false)
        }
      })
    })
  }

  const menuProps = {
    isMenuOpen: isCardMenuOpen,
    toggleMenu: toggleCardMenu,
    onClickAway: () => toggleCardMenu(!isCardMenuOpen),
    options: filterMenuOptions,
  }

  const removeCardCb = () => {
    const newObj = _.omit(filterValues, name)

    setFilterValues(newObj)

    const pqlString = generatePqlString(newObj)
    setPql(pqlString)
  }

  return (
    <FieldsSectionCardWithMenu
      label={name}
      fields={fields}
      containerStyle={{ width: '50%' }}
      removeCardCb={removeCardCb}
      menuProps={menuProps}
    />
  )
}

export default SectionCard

import React, { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import { UPDATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC } from 'frontend/api/mutations'
import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import { FormLabel } from '../CategoriesCharacteristics/CategoryForms/utils'

const Column = styled.section({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.S4,
})

const InputSection = styled.section({
  padding: `${Spacing.S4} 0`,
})

const UpdateCharacteristicColumn = ({ categoryId, characteristicId }) => {
  const characteristicName = useRef()
  const { marketBasketId } = useParams()
  const [formData, setFormData] = useState({
    name: undefined,
    description: undefined,
  })

  const {
    data: marketBasketCategoryData,
    loading: dataLoading,
  } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  useEffect(() => {
    if (!dataLoading) {
      const { marketBasketsCategories } = marketBasketCategoryData
      const categoryData = marketBasketsCategories.find(
        ({ id }) => id === categoryId
      )

      if (categoryData) {
        const selectedCharacteristicData = categoryData.characteristics_full.find(
          ({ id }) => id === characteristicId
        )
        if (selectedCharacteristicData) {
          const { id, name, description } = selectedCharacteristicData
          characteristicName.current = name
          setFormData({
            id,
            name,
            description,
          })
        }
      }
    }
  }, [dataLoading, categoryId, characteristicId, marketBasketCategoryData])

  const [
    updateMarketBasketCategoryCharacteristic,
    { loading: mutationLoading },
  ] = useMutation(UPDATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC, {
    variables: {
      input: formData,
    },
  })
  const handleChange = ({ name, value }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMarketBasketCategoryCharacteristic()
  }

  const buttonContent = mutationLoading ? <Spinner /> : 'Save Characteristic'

  console.log(formData)

  if (dataLoading || !characteristicName.current) return <Column />

  return (
    <Column>
      <h4 style={{ padding: Spacing.S4 }}>{characteristicName.current}</h4>
      <form style={{ padding: Spacing.S4 }}>
        <InputSection>
          <FormLabel>Characteristic Name (required)</FormLabel>
          <Input
            name="name"
            type="text"
            onChange={handleChange}
            value={formData.name}
          />
        </InputSection>
        <InputSection>
          <FormLabel>Description</FormLabel>
          <Input
            name="description"
            type="text"
            onChange={handleChange}
            value={formData.description}
          />
        </InputSection>
      </form>
      <section style={{ padding: Spacing.S4 }}>
        <Button
          type="secondary"
          onClick={handleUpdate}
          style={{ padding: '6px 12px' }}
        >
          {buttonContent}
        </Button>
      </section>
    </Column>
  )
}

export default UpdateCharacteristicColumn

import React, { useState } from 'react'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
import styled from '@emotion/styled'

import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'
import {
  UPDATE_MARKET_BASKET,
  UPDATE_MARKET_BASKET_CATEGORY,
} from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import StructuralListPanels from 'frontend/components/StructuralListPanels'

import CategoryForms from './CategoryForms'
import CharacteristicForms from './CharacteristicForms'
import UpdateCharacteristicColumn from './UpdateCharacteristicColumn'
import PanelHeader from './PanelHeader'
import PanelListItem from './PanelListItem'

const panelHeight = 'calc(100vh - 110px)'
const listWrapperStyle = {
  minHeight: panelHeight,
  maxHeight: panelHeight,
  height: panelHeight,
}

const MODAL_COMPONENT_MAP = {
  category: CategoryForms,
  characteristic: CharacteristicForms,
}

const CATEGORY = 'category'
const CHARACTERISTIC = 'characteristic'

const Flex = styled.section({
  display: 'flex',
})

const CategoriesCharacteristics = () => {
  const location = useLocation()
  const history = useHistory()
  const [modalType, setModalType] = useState(null)
  const [opType, setOpType] = useState(null)

  const { category: categoryId, characteristic: characteristicId } =
    (location.search && queryString.parse(location.search)) || {}

  const { marketBasketId } = useParams()
  const { data, loading, error } = useQuery(GET_MARKET_BASKETS_CATEGORIES, {
    variables: { marketBasketId },
  })

  const [updateCategoriesOrderMutation] = useMutation(UPDATE_MARKET_BASKET, {
    update: (cache, { data: { updateMarketBasket } }) => {
      const newCategories = updateMarketBasket.categories
      cache.writeQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        data: { marketBasketsCategories: newCategories },
        variables: { marketBasketId },
      })
    },
    onError: alert,
  })

  const [updateCharacteristicsOrderMutation] = useMutation(
    UPDATE_MARKET_BASKET_CATEGORY,
    {
      onError: alert,
    }
  )

  if (loading) return <Spinner />

  const handleListItemSearchUpdate = (nextParam) => {
    const prevQueryParams = queryString.parse(location.search)
    const nextParams = {
      ...prevQueryParams,
      ...nextParam,
    }

    history.push({
      search: queryString.stringify(nextParams),
    })
  }

  const updateCategoriesOnSortEnd = (newCategories) => {
    newCategories = newCategories.map(({ id }) => id)

    const input = {
      id: marketBasketId,
      categories: newCategories,
    }

    updateCategoriesOrderMutation({ variables: { input } })
  }

  const updateCharacteristicsOnSortEnd = (newCharacteristics) => {
    newCharacteristics = newCharacteristics.map(({ id }) => id)

    const input = {
      id: categoryId,
      characteristics: newCharacteristics,
    }

    updateCharacteristicsOrderMutation({ variables: { input } })
  }

  const categories = data.marketBasketsCategories || []
  const categoryData = categoryId
    ? categories.find(({ id }) => id === categoryId)
    : []

  let characteristics = []
  if (categoryData) {
    characteristics = categoryData.characteristics_full
  }

  const listConfigPanels = [
    {
      searchParamConfig: {
        searchParam: CATEGORY,
        searchParamKey: 'id',
      },
      listWrapperStyle,
      listHeaderConfig: {
        title: 'Categories',
        ListHeader: (props) => (
          <PanelHeader
            {...props}
            handleCreate={() => {
              setModalType(CATEGORY)
              setOpType('create')
            }}
          />
        ),
      },
      listConfig: {
        ListItem: (props) => (
          <PanelListItem
            {...props}
            handleEdit={() => {
              setModalType(CATEGORY)
              setOpType('update')
            }}
            handleDelete={() => {
              setModalType(CATEGORY)
              setOpType('delete')
            }}
            shouldShowEdit
          />
        ),
        sortableConfig: {
          updateFunc: updateCategoriesOnSortEnd,
        },
      },
      data: categories,
      loading,
      error,
    },
    {
      searchParamConfig: {
        searchParam: CHARACTERISTIC,
        searchParamKey: 'id',
      },
      listWrapperStyle,
      listHeaderConfig: {
        title: 'Characteristics',
        ListHeader: (props) => (
          <PanelHeader
            {...props}
            handleCreate={() => {
              setModalType(CHARACTERISTIC)
              setOpType('create')
            }}
          />
        ),
      },
      listConfig: {
        ListItem: (props) => (
          <PanelListItem
            {...props}
            handleEdit={() => {
              setModalType(CHARACTERISTIC)
              setOpType('update')
            }}
            handleDelete={() => {
              setModalType(CHARACTERISTIC)
              setOpType('delete')
            }}
          />
        ),
        sortableConfig: {
          updateFunc: updateCharacteristicsOnSortEnd,
        },
      },
      data: characteristics,
      loading,
      error,
    },
  ]

  const ModalComponent = MODAL_COMPONENT_MAP[modalType]

  return (
    <Flex>
      <Flex style={{ width: '66.66%' }}>
        <StructuralListPanels
          panels={listConfigPanels}
          searchParamsAncestry={['tab']}
        />
      </Flex>
      <Flex style={{ width: '33.33%' }}>
        <UpdateCharacteristicColumn
          key={categoryId}
          categoryId={categoryId}
          characteristicId={characteristicId}
        />
      </Flex>
      {modalType && (
        <ModalComponent
          closeHandler={() => setModalType(null)}
          opType={opType}
          categories={categories}
          characteristics={characteristics}
          handleListItemSearchUpdate={handleListItemSearchUpdate}
        />
      )}
    </Flex>
  )
}

export default CategoriesCharacteristics

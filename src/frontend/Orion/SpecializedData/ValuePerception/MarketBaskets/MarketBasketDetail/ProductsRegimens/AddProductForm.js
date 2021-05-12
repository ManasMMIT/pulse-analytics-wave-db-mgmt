import React, { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import _ from 'lodash'
import Select from 'react-select'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'

import {
  GET_MARKET_BASKETS,
  GET_VEGA_PRODUCTS,
  GET_VEGA_PRODUCTS_REGIMENS,
} from 'frontend/api/queries'

import { UPDATE_MARKET_BASKET } from 'frontend/api/mutations'

import Spacing from 'frontend/utils/spacing'

import FormSelect from './FormSelect'

import caseInsensitiveSort from './caseInsensitiveSort'

const getFullSetOfProductRegimenComboIds = (
  selectedProductRegimenComboIds,
  { marketBaskets }
) => {
  const [marketBasket] = marketBaskets
  const marketBasketProdRegComboIds = marketBasket.products_regimens.map(
    ({ id }) => id
  )

  return [...marketBasketProdRegComboIds, ...selectedProductRegimenComboIds]
}

const getProductSelectOptions = (productData, marketBasket) => {
  const validNewProducts = getValidNewProducts(productData, marketBasket)

  const productSelectOptions = validNewProducts
    .map(({ id, generic_name }) => ({
      label: generic_name,
      value: id,
    }))
    .sort(caseInsensitiveSort)

  return productSelectOptions
}

const getValidNewProducts = (productData = {}, marketBasket) => {
  const { vegaProducts = [] } = productData
  const { products_regimens: alreadyAddedProductRegCombos } = marketBasket || {
    products_regimens: [],
  }
  const alreadyAddedProductsIdMap = _.keyBy(
    alreadyAddedProductRegCombos,
    'product.id'
  )

  return vegaProducts.filter(
    ({ id: localId }) => !alreadyAddedProductsIdMap[localId]
  )
}

const getRegimenOptions = (
  productRegimenLoading,
  called,
  productRegimenData
) => {
  let regimenOptions = []
  if (!productRegimenLoading && called) {
    const { vegaProductsRegimens } = productRegimenData

    regimenOptions = vegaProductsRegimens
      .map(({ id: comboId, regimen: { name } }) => ({
        label: name,
        value: comboId,
      }))
      .sort(caseInsensitiveSort)
  }

  return regimenOptions
}

const AddProductForm = ({ onCompleted, cancelHandler }) => {
  const { marketBasketId } = useParams()

  const [
    selectedProductRegimenComboIds,
    setSelectedProductRegimenComboIds,
  ] = useState([])

  const { data, loading } = useQuery(GET_MARKET_BASKETS, {
    variables: { marketBasketId },
  })

  const { data: productData, loading: productLoading } = useQuery(
    GET_VEGA_PRODUCTS
  )

  const [
    fetchProductRegimenCombos,
    { data: productRegimenData, loading: productRegimenLoading, called },
  ] = useLazyQuery(GET_VEGA_PRODUCTS_REGIMENS, {
    onCompleted: () => {
      setSelectedProductRegimenComboIds([])
    },
  })

  const fullSetProductsRegimens = getFullSetOfProductRegimenComboIds(
    selectedProductRegimenComboIds,
    data
  )

  const [updateMarketBasket, { loading: isUpdating }] = useMutation(
    UPDATE_MARKET_BASKET,
    {
      variables: {
        input: {
          id: marketBasketId,
          products_regimens: fullSetProductsRegimens,
        },
      },
      onCompleted: () => {
        setSelectedProductRegimenComboIds([])
        onCompleted()
      },
    }
  )

  const handleCreate = (e) => {
    e.preventDefault()
    updateMarketBasket()
  }

  const [marketBasket] = data ? data.marketBaskets : []

  let regimenOptions = getRegimenOptions(
    productRegimenLoading,
    called,
    productRegimenData
  )

  const productSelectOptions = getProductSelectOptions(
    productData,
    marketBasket
  )

  const handleProductOnChange = ({ value }) => {
    fetchProductRegimenCombos({ variables: { input: { productId: value } } })
  }

  const handleRegimensOnChange = (options) => {
    // ! if last item is X'd out, options is null
    const selectedRegimenOptions = options || []
    const selectedComboIds = selectedRegimenOptions.map(({ value }) => value)
    setSelectedProductRegimenComboIds(selectedComboIds)
  }

  const isProductSelectDisabled = !regimenOptions.length

  let productPlaceholderText = 'select regimen(s)...'

  if (productRegimenLoading) {
    productPlaceholderText = (
      <div style={{ textAlign: 'center' }}>
        <Spinner />
      </div>
    )
  } else if (isProductSelectDisabled) {
    productPlaceholderText = 'select product first to choose regimens'
  }

  const selectedRegimens = regimenOptions.filter(({ value }) =>
    selectedProductRegimenComboIds.includes(value)
  )

  return (
    <SingleActionDialog
      header="Add Product and Associated Regimens"
      submitText="Add Product and Regimens"
      submitHandler={handleCreate}
      cancelHandler={cancelHandler}
    >
      <div style={{ padding: Spacing.S7 }}>
        {loading || productLoading || isUpdating ? (
          <div style={{ height: 236, textAlign: 'center' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <>
            <FormSelect
              category="Product"
              label="Product (required)"
              style={{ marginBottom: 24 }}
            >
              <Select
                placeholder={'select product...'}
                options={productSelectOptions}
                onChange={handleProductOnChange}
              />
            </FormSelect>
            <FormSelect
              category="Regimen"
              label="Regimens (at least 1 is required; remove by clicking X)"
            >
              <Select
                isMulti
                isDisabled={isProductSelectDisabled}
                placeholder={productPlaceholderText}
                value={selectedRegimens}
                options={regimenOptions}
                onChange={handleRegimensOnChange}
              />
            </FormSelect>
          </>
        )}
      </div>
    </SingleActionDialog>
  )
}

export default AddProductForm

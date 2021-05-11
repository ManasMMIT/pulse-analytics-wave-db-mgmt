import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import _ from 'lodash'

import {
  GET_MARKET_BASKETS,
  GET_VEGA_PRODUCTS_REGIMENS,
} from 'frontend/api/queries'
import { UPDATE_MARKET_BASKET } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'

import Spacing from 'frontend/utils/spacing'

import FormSelect from '../FormSelect'
import DeleteProductSection from './DeleteProductSection'

import caseInsensitiveSort from '../caseInsensitiveSort'

const EditProductForm = ({ product, onCompleted, cancelHandler }) => {
  const { marketBasketId } = useParams()

  // IDs for current market basket product-regimen combos
  const [
    marketBasketProdRegComboIds,
    setMarketBasketProdRegComboIds,
  ] = useState([])

  // IDs for currently selected regimens in regimen Select input
  // Initial value is current regimens attached to product for market basket
  const [
    selectedRegimenComboOptions,
    setSelectedRegimenComboOptions,
  ] = useState([])

  // Data for current market basket
  const { data, loading } = useQuery(GET_MARKET_BASKETS, {
    variables: { marketBasketId },
  })

  // All possible product-regimen combos for selected product
  const { data: productRegimenData, loading: productRegimenLoading } = useQuery(
    GET_VEGA_PRODUCTS_REGIMENS,
    {
      variables: { input: { productId: product.id } },
    }
  )

  useEffect(() => {
    if (!loading) {
      const { products_regimens } = data.marketBaskets && data.marketBaskets[0]
      // All current product/regimen combos for market basket
      setMarketBasketProdRegComboIds(products_regimens.map(({ id }) => id))

      const selectedProductRegimenComboOptions = products_regimens
        .filter(
          ({ product: { id: localProdId } }) => localProdId === product.id
        )
        .map(({ id, regimen: { name } }) => ({
          label: name,
          value: Number(id),
        }))
      // Set current regimens for product in regimen Select
      setSelectedRegimenComboOptions(selectedProductRegimenComboOptions)
    }
  }, [loading])

  let regimenOptions = []

  if (!productRegimenLoading) {
    // All regimens for selected product that are not currently added to market basket
    regimenOptions = Object.values(productRegimenData)[0]
      .filter(({ id }) => !marketBasketProdRegComboIds.includes(Number(id)))
      .map(({ id, regimen: { name } }) => ({
        label: name,
        value: Number(id),
      }))
      .sort(caseInsensitiveSort)
  }

  const [updateMarketBasket, { loading: isUpdating }] = useMutation(
    UPDATE_MARKET_BASKET,
    {
      variables: {
        input: {
          id: marketBasketId,
          products_regimens: marketBasketProdRegComboIds,
        },
      },
      onCompleted: () => {
        onCompleted()
      },
    }
  )

  const handleRegimensOnChange = (options) => {
    const selectedRegimenCombos = options || []

    const toAdd = _.difference(
      selectedRegimenCombos, // Regimens that are currently selected in regimen Select
      selectedRegimenComboOptions // Regimens that are currently attached to product on market basket
    ).map(({ value }) => value)

    const toRemove = _.difference(
      selectedRegimenComboOptions, // Regimens that are currently attached to product on market basket
      options // Regimens that are currently selected in regimen Select
    ).map(({ value }) => value)

    // Filter out combos being removed
    const filteredMarketBasketProdRegComboIds = marketBasketProdRegComboIds.filter(
      (id) => !toRemove.includes(id)
    )

    // Add combos being added
    const finalSetOfComboIds = [
      ...filteredMarketBasketProdRegComboIds,
      ...toAdd,
    ]

    setMarketBasketProdRegComboIds(finalSetOfComboIds)
    setSelectedRegimenComboOptions(selectedRegimenCombos)
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMarketBasket()
  }

  const isSubmitDisabled = selectedRegimenComboOptions.length === 0

  return (
    <SingleActionDialog
      header="Edit Product and Associated Regimens"
      submitText="Update Product and Regimens"
      submitHandler={handleUpdate}
      cancelHandler={cancelHandler}
      isSubmitDisabled={isSubmitDisabled}
    >
      <div style={{ padding: Spacing.S7 }}>
        {loading || productRegimenLoading || isUpdating ? (
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
                isDisabled
                value={{ label: product.generic_name, value: product.id }}
              />
            </FormSelect>
            <FormSelect
              category="Regimen"
              label="Regimens (at least 1 is required; remove by clicking X)"
              style={{ marginBottom: 24 }}
            >
              <Select
                isMulti
                value={selectedRegimenComboOptions}
                options={regimenOptions}
                onChange={handleRegimensOnChange}
              />
            </FormSelect>
            <DeleteProductSection
              product={product}
              marketBasket={data.marketBaskets[0]}
              onCompleted={onCompleted}
            />
          </>
        )}
      </div>
    </SingleActionDialog>
  )
}

export default EditProductForm

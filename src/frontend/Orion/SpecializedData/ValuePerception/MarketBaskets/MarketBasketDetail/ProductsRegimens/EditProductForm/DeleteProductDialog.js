import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { SingleActionDialog } from 'frontend/components/Dialog'

import { UPDATE_MARKET_BASKET } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

const DeleteProductDialog = ({
  product,
  marketBasket,
  onCompleted,
  cancelHandler,
}) => {
  const { id: productId } = product
  const { id: marketBasketId, products_regimens } = marketBasket

  // Product regimen combos for all other products
  const productRegimenComboIds = products_regimens
    .filter(({ product }) => product.id !== productId)
    .map(({ id }) => id)

  const [updateMarketBasket, { loading }] = useMutation(UPDATE_MARKET_BASKET, {
    variables: {
      input: {
        id: marketBasketId,
        products_regimens: productRegimenComboIds,
      },
    },
    onCompleted: () => {
      onCompleted()
    },
  })

  const submitHandler = (e) => {
    e.preventDefault()
    updateMarketBasket()
  }

  return (
    <SingleActionDialog
      header="Delete Product"
      submitText="Delete Forever"
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      headerStyle={{ color: Color.RED }}
      submitColor={Color.RED}
      contentStyle={{ width: 400 }}
    >
      {loading ? (
        <div style={{ height: 150, textAlign: 'center' }}>
          <Spinner size={32} />
        </div>
      ) : (
        <div style={{ padding: 36, textAlign: 'center', ...FontSpace.FS2 }}>
          <p>
            Are you sure you want to delete the{' '}
            <span style={{ fontWeight: 700 }}>{product.brand_name}</span>{' '}
            Product? This will delete all survey data and client access
            associated with this Product.
          </p>
          <p style={{ fontWeight: 700, marginTop: 12 }}>
            THIS CANNOT BE UNDONE
          </p>
        </div>
      )}
    </SingleActionDialog>
  )
}

export default DeleteProductDialog

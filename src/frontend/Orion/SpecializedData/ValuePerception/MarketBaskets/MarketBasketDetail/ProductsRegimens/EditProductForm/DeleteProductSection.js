import React, { useState } from 'react'

import Button from 'frontend/components/Button'

import Color from 'frontend/utils/color'

import FormSelect from '../FormSelect'
import DeleteProductDialog from './DeleteProductDialog'

const DeleteProductSection = ({ product, marketBasket, onCompleted }) => {
  const [isModalOpen, setModal] = useState(false)

  return (
    <>
      <FormSelect
        category="Delete Product"
        label="Deleting a Product removes all associated Survey response data for that Product and its regimens"
        categoryStyle={{ marginBottom: 0 }}
        labelStyle={{ fontWeight: 400, marginBottom: 16 }}
      >
        <Button color={Color.RED} onClick={() => setModal(true)}>
          Delete Product
        </Button>
      </FormSelect>
      {isModalOpen && (
        <DeleteProductDialog
          product={product}
          marketBasket={marketBasket}
          onCompleted={onCompleted}
          cancelHandler={() => setModal(false)}
        />
      )}
    </>
  )
}

export default DeleteProductSection

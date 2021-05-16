import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Spinner from 'frontend/components/Spinner'
import Modal from 'frontend/components/Modal'
import Button from 'frontend/components/Button'

import MarketBasketForm from '../MarketBasketForm'
import { useQuery } from '@apollo/react-hooks'
import { GET_MARKET_BASKETS } from 'frontend/api/queries'

import ProductsRegimensTab from './ProductsRegimensTab'
import CatCharTab from './CatCharTab'
import ExportSurveyDataButton from './ExportSurveyDataButton'

const MarketBasketDetail = () => {
  const { marketBasketId } = useParams()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, loading } = useQuery(GET_MARKET_BASKETS, {
    variables: { marketBasketId },
  })
  if (loading) return <Spinner />
  const [marketBasket] = data.marketBaskets || []

  // ! after deletion, market basket doesn't exist in cache before redirect
  if (!marketBasket) return <Spinner />
  const { id, name, indication, description } = marketBasket

  const formData = { id, name, indication: indication.id, description }

  return (
    <div>
      <Link to="/orion/specialized/value-perception/sandbox-market-baskets">
        Back
      </Link>

      <h1>Market Basket Overview</h1>
      <h2>Market Basket Details</h2>
      <div>
        <Button onClick={() => setIsModalOpen(true)}>
          Edit Market Basket Details
        </Button>
        <Modal
          show={isModalOpen}
          modalStyle={{ height: 600, width: 800 }}
          handleClose={() => setIsModalOpen(false)}
        >
          <MarketBasketForm
            onCompleted={() => setIsModalOpen(false)}
            data={formData}
          />
        </Modal>
      </div>
      <div>{name}</div>
      <h2>Indication</h2>
      <div>{indication.name}</div>
      <h2>Description</h2>
      <div>{description}</div>
      <hr />
      <ProductsRegimensTab />
      <CatCharTab />
      <ExportSurveyDataButton />
    </div>
  )
}

export default MarketBasketDetail

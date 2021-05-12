import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'

import CategoryCreateForm from './CategoryCreateForm'
import CategoryUpdateForm from './CategoryUpdateForm'
import CategoryDeleteButton from './CategoryDeleteButton'
import CharCreateForm from './CharCreateForm'
import CharUpdateForm from './CharUpdateForm'
import CharDeleteButton from './CharDeleteButton'

const CatCharTab = () => {
  const { marketBasketId } = useParams()
  const { data, loading } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  if (loading) return <Spinner />

  const categories = data.marketBasketsCategories || []

  return (
    <div>
      <h2>Categories and Characteristics</h2>
      <CategoryCreateForm />
      <CategoryUpdateForm />
      <CharCreateForm />
      <CharUpdateForm />
      <ul>
        {
          categories.map(({
            id,
            name,
            characteristics_full,
          }) => (
            <React.Fragment key={id}>
              <li>
                {name}
                <CategoryDeleteButton id={id} />
              </li>
              <ul style={{ paddingLeft: 10 }}>
                {
                  characteristics_full.map(({ id: charId, name }) => (
                    <li>
                      {name}
                      <CharDeleteButton categoryId={id} id={charId} />
                    </li>
                  ))
                }
              </ul>
            </React.Fragment>
          ))
        }
      </ul>
    </div>
  )
}

export default CatCharTab

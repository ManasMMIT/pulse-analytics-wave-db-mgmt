import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_MARKET_BASKETS } from 'frontend/api/queries'
import { DELETE_MARKET_BASKET } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const DeleteMarketBasketSection = ({
  marketBasketId,
  closeModal,
  marketBasketName,
}) => {
  const [isModalOpen, setModal] = useState(false)
  const history = useHistory()

  const { data: marketBasketData } = useQuery(GET_MARKET_BASKETS)

  const [deleteMarketBasket, { loading: mutationLoading }] = useMutation(
    DELETE_MARKET_BASKET,
    {
      update: (cache, { data: { deleteMarketBasket } }) => {
        const newMbs = marketBasketData.marketBaskets.filter(
          ({ id }) => id !== deleteMarketBasket.id
        )

        cache.writeQuery({
          query: GET_MARKET_BASKETS,
          data: { marketBaskets: newMbs },
        })
      },
      onCompleted: () => {
        history.push('/orion/specialized/value-perception/market-baskets')
      },
      onError: alert,
    }
  )

  const handleOnDelete = (e) => {
    e.stopPropagation()
    deleteMarketBasket({ variables: { input: { id: marketBasketId } } })
  }

  return (
    <section style={{ padding: Spacing.S4 }}>
      <h4 style={{ paddingBottom: Spacing.FS4, ...FontSpace.FS5 }}>
        Delete Market Basket
      </h4>
      <p style={FontSpace.FS2}>
        Deleting the Market Basket removes all data associated with it and can’t
        be undone.
      </p>
      <Button
        color={Color.RED}
        onClick={() => setModal(true)}
        style={{
          padding: `${Spacing.S2} ${Spacing.S3}`,
          margin: `${Spacing.S4} 0`,
        }}
      >
        Delete Market Basket
      </Button>
      {isModalOpen && (
        <SingleActionDialog
          header="Delete Market Basket"
          submitText="Delete Forever"
          submitHandler={handleOnDelete}
          cancelHandler={closeModal}
          headerStyle={{ color: Color.RED }}
          submitColor={Color.RED}
          contentStyle={{ width: 400 }}
        >
          {mutationLoading ? (
            <Spinner />
          ) : (
            <div style={{ padding: 36, textAlign: 'center', ...FontSpace.FS2 }}>
              <p>
                Are you sure you want to delete the
                <span style={{ fontWeight: 700 }}> {marketBasketName} </span>
                Market Basket? This will delete all survey data and client
                access associated with this Market Basket.
              </p>
              <p style={{ fontWeight: 700, marginTop: 12 }}>
                THIS CANNOT BE UNDONE
              </p>
            </div>
          )}
        </SingleActionDialog>
      )}
    </section>
  )
}

DeleteMarketBasketSection.propTypes = {
  marketBasketId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  marketBasketName: PropTypes.string.isRequired,
}

export default DeleteMarketBasketSection

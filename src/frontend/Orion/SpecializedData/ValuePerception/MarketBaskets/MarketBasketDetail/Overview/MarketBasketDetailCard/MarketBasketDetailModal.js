import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import Select from 'react-select'
import _ from 'lodash'

import { GET_SOURCE_INDICATIONS } from 'frontend/api/queries'
import { UPDATE_MARKET_BASKET } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import DeleteMarketBasketSection from './DeleteMarketBasketSection'

const FormLabel = styled.label({
  ...FontSpace.FS2,
  fontWeight: 700,
})

const padding = { padding: Spacing.S4 }

const MarketBasketDetailModal = ({ closeModal, name, marketBasket }) => {
  const { id, indication, description } = marketBasket

  const [formData, setFormData] = useState({
    id,
    name,
    indication: indication.id,
    description,
  })

  const { data: indData, loading: indLoading } = useQuery(
    GET_SOURCE_INDICATIONS
  )
  const [submit, { loading: mutationLoading }] = useMutation(
    UPDATE_MARKET_BASKET,
    {
      onError: alert,
      onCompleted: () => closeModal(),
    }
  )

  if (indLoading) return <Spinner />

  const { indications } = indData
  const indicationsByUuid = _.keyBy(indications, 'uuid')
  const indicationSelectOptions = indications.map(({ uuid, name }) => ({
    label: name,
    value: uuid,
  }))
  const selectedIndicationOption = {
    label: (indicationsByUuid[formData.indication] || {}).name,
    value: formData.indication,
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    submit({ variables: { input: formData } })
  }

  const handleChange = ({ name, value }) => {
    const key = name || 'indication'
    setFormData((prevData) => ({ ...prevData, [key]: value }))
  }

  console.log(formData)

  return (
    <SingleActionDialog
      header="Edit Market Basket"
      submitText="Update Market Basket"
      submitHandler={handleOnSubmit}
      cancelHandler={closeModal}
    >
      {mutationLoading ? (
        <Spinner />
      ) : (
        <div style={padding}>
          <h4 style={{ ...padding, ...FontSpace.FS5 }}>Details</h4>
          <form style={padding}>
            <div>
              <FormLabel>Name (required)</FormLabel>
              <Input
                name="name"
                type="text"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div>
              <FormLabel>Indication (required)</FormLabel>
              <Select
                value={selectedIndicationOption}
                options={indicationSelectOptions}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                type="text"
                onChange={handleChange}
                value={formData.description}
              />
            </div>
          </form>
          <DeleteMarketBasketSection
            marketBasketId={id}
            closeModal={closeModal}
            marketBasketName={name}
          />
        </div>
      )}
    </SingleActionDialog>
  )
}

MarketBasketDetailModal.propTypes = {
  marketBasket: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
}

export default MarketBasketDetailModal

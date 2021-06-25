import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button } from '@pulse-analytics/pulse-design-system'

import { UPDATE_VEGA_PRODUCT } from 'frontend/api/mutations'

import Color from 'frontend/utils/color'

const UpdateProduct = ({
  id,
  brand_name,
  generic_name,
  logo_link,
  color,
  messaging,
}) => {
  const [stagedInput, setStagedInput] = useState({
    logo_link: logo_link,
    color: color,
    messaging: messaging,
  })

  const [updateProduct] = useMutation(UPDATE_VEGA_PRODUCT, {
    variables: {
      input: {
        id,
        ...stagedInput,
      },
    },
    onError: alert,
  })

  const handleLogoLinkChange = (e) => {
    setStagedInput({ ...stagedInput, logo_link: e.target.value })
  }

  const handleColorChange = (e) => {
    setStagedInput({ ...stagedInput, color: e.target.value.trim() })
  }

  const handleMessagingChange = (e) => {
    setStagedInput({ ...stagedInput, messaging: e.target.value })
  }

  return (
    <div>
      {id}
      <br />
      {`${generic_name} - ${brand_name}`}
      <br />
      <input
        style={{
          background: Color.LIGHT_BLUE_GRAY_2,
          padding: 12,
          margin: 5,
        }}
        placeholder="Enter logo link..."
        onChange={handleLogoLinkChange}
        value={stagedInput.logo_link}
      />
      <input
        style={{
          background: Color.LIGHT_BLUE_GRAY_2,
          padding: 12,
          margin: 5,
        }}
        placeholder="Enter color..."
        onChange={handleColorChange}
        value={stagedInput.color}
      />
      <input
        style={{
          background: Color.LIGHT_BLUE_GRAY_2,
          padding: 12,
          margin: 5,
        }}
        placeholder="Enter messaging..."
        onChange={handleMessagingChange}
        value={stagedInput.messaging}
      />
      <Button onClick={updateProduct}>Update Product</Button>
    </div>
  )
}

export default UpdateProduct

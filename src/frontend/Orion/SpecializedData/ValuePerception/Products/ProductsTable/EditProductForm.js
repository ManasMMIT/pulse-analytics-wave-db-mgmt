import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { UPDATE_VEGA_PRODUCT } from 'frontend/api/mutations'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import Color from 'frontend/utils/color'

import {
  InputSection,
  FormLabel,
  BlueText,
} from '../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const Flex = styled.div({
  display: 'flex',
})

const NoPreview = styled.p({
  ...FontSpace.FS1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${Color.GRAY_DARK}`,
  height: 50,
  width: 80,
})

const EditProductForm = ({ selectedProviderData, closeHandler }) => {
  const {
    id,
    brand_name,
    generic_name,
    logo_link,
    color,
    messaging,
  } = selectedProviderData
  const [formData, setFormData] = useState({
    logo_link,
    color,
    messaging,
  })

  const [updateProduct, { loading: mutationLoading }] = useMutation(
    UPDATE_VEGA_PRODUCT,
    {
      variables: {
        input: {
          id,
          ...formData,
        },
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  const onTextChange = ({ name, value }) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const header = (
    <p>
      Edit{' '}
      <BlueText>
        {brand_name}-{generic_name}
      </BlueText>{' '}
      Product
    </p>
  )

  return (
    <SingleActionDialog
      header={header}
      submitText="Edit Product"
      submitHandler={updateProduct}
      cancelHandler={closeHandler}
    >
      <div style={{ padding: Spacing.S7 }}>
        {mutationLoading ? (
          <div style={{ height: 236, textAlign: 'center' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <div>
            <form>
              <InputSection>
                <FormLabel>Logo Link</FormLabel>
                <Flex>
                  <Input
                    name="logo_link"
                    type="text"
                    value={formData.logo_link}
                    onChange={onTextChange}
                  />
                  {formData.logo_link ? (
                    <div style={{ height: 50, width: 80 }}>
                      <img
                        style={{ height: '100%', width: '100%' }}
                        src={formData.logo_link}
                        alt={`${brand_name}-${generic_name} logo`}
                      />
                    </div>
                  ) : (
                    <NoPreview>No Preview</NoPreview>
                  )}
                </Flex>
              </InputSection>
              <InputSection>
                <FormLabel>Color</FormLabel>
                <Flex>
                  <Input
                    name="color"
                    type="text"
                    value={formData.color}
                    onChange={onTextChange}
                  />
                  {formData.color ? (
                    <div
                      style={{
                        height: 50,
                        width: 80,
                        backgroundColor: formData.color,
                        border: `1px solid ${Color.GRAY_DARK}`,
                      }}
                    />
                  ) : (
                    <NoPreview>No Preview</NoPreview>
                  )}
                </Flex>
              </InputSection>
              <InputSection>
                <FormLabel>Messaging</FormLabel>
                <Flex>
                  <Input
                    name="messaging"
                    type="text"
                    value={formData.messaging}
                    onChange={onTextChange}
                  />
                </Flex>
              </InputSection>
            </form>
          </div>
        )}
      </div>
    </SingleActionDialog>
  )
}

EditProductForm.propTypes = {
  selectedProviderData: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default EditProductForm

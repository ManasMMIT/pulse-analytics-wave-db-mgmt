import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import { UPDATE_VEGA_PERSON_ROLE_INDICATION } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import {
  InputSection,
  FormLabel,
} from '../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const Column = styled.section({
  display: 'flex',
  flexDirection: 'column',
  padding: Spacing.S4,
  width: '100%',
  backgroundColor: Color.GRAY_LIGHT,
})

const UpdateSpecialtyColumn = ({ specialtyData }) => {
  const { id, specialty_label } = specialtyData

  const [specialtyInput, setSpecialtyInput] = useState(specialty_label)

  const [updateRoleSpecialty, { loading: mutationLoading }] = useMutation(
    UPDATE_VEGA_PERSON_ROLE_INDICATION,
    {
      variables: {
        input: {
          id,
          specialty_label: specialtyInput,
        },
      },
      onError: alert,
    }
  )

  const buttonContent = mutationLoading ? <Spinner /> : 'Save Characteristic'

  return (
    <Column>
      {id && (
        <>
          <h4 style={{ padding: Spacing.S4 }}>{specialty_label}</h4>
          <form style={{ padding: Spacing.S4 }}>
            <InputSection>
              <FormLabel>Specialty Label (required)</FormLabel>
              <Input
                name="specialty"
                type="text"
                onChange={({ value }) => setSpecialtyInput(value)}
                value={specialtyInput}
              />
            </InputSection>
          </form>
          <section style={{ padding: Spacing.S4 }}>
            <Button
              type="secondary"
              onClick={updateRoleSpecialty}
              style={{ padding: '6px 12px' }}
            >
              {buttonContent}
            </Button>
          </section>
        </>
      )}
    </Column>
  )
}

UpdateSpecialtyColumn.propTypes = {
  specialtyData: PropTypes.object,
}

UpdateSpecialtyColumn.defaultProps = {
  specialtyData: {},
}

export default UpdateSpecialtyColumn

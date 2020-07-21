import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_END_USER_TERMS } from 'frontend/api/queries'
import Spinner from 'frontend/components/Spinner'
import Title from 'frontend/components/Title'
import Input from 'frontend/components/Input'
import Button from 'frontend/components/Button'

import Spacing from 'frontend/utils/spacing'
import { formatDateMonthYearLong } from 'frontend/utils/formatDate'
import Color from 'frontend/utils/color'

const IFrame = styled.iframe({
  height: 800,
  width: 1000,
})

const Wrapper = styled.div({
  padding: Spacing.S7,
})

const UpdateWrapper = styled.div({
  paddingTop: Spacing.S4,
})

const InputWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${Spacing.S4} 0`,
})

const EndUserTerms = () => {
  const { data, loading } = useQuery(GET_END_USER_TERMS)
  const [isEditing, setEditingStatus] = useState(false)

  const saveHandler = () => {
    setEditingStatus(false)
  }

  const editHandler = isEditing ? saveHandler : () => setEditingStatus(true)

  if (loading) return <Spinner />

  const { createdOn, link } = data.endUserTerms

  return (
    <Wrapper>
      <Title
        title="End User Terms Management"
        titleStyle={{ paddingLeft: 0 }}
      />
      <p>
        <b>Created on:</b> {formatDateMonthYearLong(createdOn)}
      </p>
      <UpdateWrapper>
        <b>Update Link:</b>
        <InputWrapper>
          <Input
            name="end-user-terms-link"
            value={link}
            disabled={!isEditing}
          />
          <Button
            buttonStyle={{ marginLeft: Spacing.S4 }}
            onClick={editHandler}
            color={isEditing ? Color.GREEN : Color.PRIMARY}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
        </InputWrapper>
      </UpdateWrapper>
      <h4>Preview: </h4>
      <IFrame src={link} title="end-user-terms-preview" />
    </Wrapper>
  )
}

export default EndUserTerms

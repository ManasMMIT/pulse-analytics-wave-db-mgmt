import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_END_USER_TERMS_LINK } from 'frontend/api/queries'
import { UPDATE_END_USER_TERMS } from 'frontend/api/mutations/endUserTerms'
import Spinner from 'frontend/components/Spinner'
import Title from 'frontend/components/Title'
import Input from 'frontend/components/Input'
import Button from 'frontend/components/Button'
import { UnderlinedTabs } from 'frontend/components/Tabs'

import Spacing from 'frontend/utils/spacing'
import { formatDateMonthYearLong } from 'frontend/utils/formatDate'
import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import { AlphaColors } from 'frontend/utils/pulseStyles'

import UsersAgreementTable from './UsersAgreementTable'

const IFrame = styled.iframe({
  height: 600,
  width: '100%',
})

const Wrapper = styled.div({
  padding: Spacing.S7,
  width: '100%',
})

const InputWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${Spacing.S4} 0`,
})

const Label = styled.span({
  ...FontSpace.FS4,
  fontWeight: 500,
  marginRight: Spacing.S4,
})

const TABS_DATA = ['User Terms Preview', 'User Agreement Table']

const EndUserTerms = () => {
  const { data, loading } = useQuery(GET_END_USER_TERMS_LINK)
  const [isEditing, setEditingStatus] = useState(false)
  const [currentLink, setCurrentLink] = useState('')

  const [updateLink] = useMutation(UPDATE_END_USER_TERMS, {
    variables: {
      input: {
        link: currentLink,
      },
    },
    onCompleted: () => setEditingStatus(false),
    refetchQueries: [{ query: GET_END_USER_TERMS_LINK }],
    onError: alert,
  })

  useEffect(() => {
    if (!loading) setCurrentLink(data.endUserTermsLink.link)
  }, [loading])

  const editHandler = isEditing ? updateLink : () => setEditingStatus(true)

  const cancelHandler = () => {
    // Reset link to original
    setCurrentLink(data.endUserTermsLink.link)
    setEditingStatus(false)
  }

  if (loading) return <Spinner />

  const { agreementDate, link } = data.endUserTermsLink

  return (
    <Wrapper>
      <Title
        title="End User Terms Management"
        titleStyle={{ padding: `0 0 ${Spacing.S4} 0` }}
      />
      <div>
        <Label>Agreement Date:</Label>
        {formatDateMonthYearLong(agreementDate)}
      </div>
      <InputWrapper>
        <Label>Link:</Label>
        <Input
          name="end-user-terms-link"
          value={currentLink}
          disabled={!isEditing}
          onChange={({ value }) => setCurrentLink(value)}
        />
        <Button
          buttonStyle={{ marginLeft: Spacing.S4 }}
          onClick={editHandler}
          color={isEditing ? Color.GREEN : Color.PRIMARY}
          iconName="edit"
          iconColor1={Color.WHITE}
          iconPosition="right"
        >
          {isEditing ? 'Save Changes' : 'Edit'}
        </Button>
        {isEditing && (
          <Button
            buttonStyle={{ marginLeft: Spacing.S4 }}
            onClick={cancelHandler}
            color={Color.GRAY_MEDIUM}
            iconName="close"
            iconColor1={Color.WHITE}
            iconPosition="right"
          >
            Cancel
          </Button>
        )}
      </InputWrapper>
      <div>
        <b>
          NOTE: Editing the link 1) does NOT automatically reset users'
          acceptance and force them to accept a revised agreement and 2) does
          NOT automatically update static attachment to email template on
          emailJS.
        </b>
      </div>
      <UnderlinedTabs
        tabsData={TABS_DATA}
        activeTabStyle={{ color: Color.PRIMARY }}
        tabsContainerStyle={{
          borderBottom: `1px solid ${AlphaColors.Black10}`,
          paddingLeft: Spacing.S4,
        }}
      >
        <IFrame
          style={{ marginTop: Spacing.S4 }}
          src={link}
          title="end-user-terms-preview"
        />
        <UsersAgreementTable />
      </UnderlinedTabs>
    </Wrapper>
  )
}

export default EndUserTerms

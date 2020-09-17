import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_DEV_TO_PROD_PUSH_CONFIGS } from 'frontend/api/queries'
import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import DataPushConfig from './DataPushConfig'
import CreateDataPushConfigButton from './CreateDataPushConfigButton'
import PushAllDataToProdButton from './PushAllDataToProdButton'

const Wrapper = styled.div({
  background: Color.GRAY_LIGHT,
  padding: Spacing.S4,
  height: '100vh',
  overflowY: 'auto',
  boxSizing: 'border-box',
  flex: '1 1 auto',
})

const TopButtonsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: Spacing.S4,
  '& > :not(:last-child)': {
    marginRight: 12,
  },
})

const CardsContainer = styled.div({
  padding: Spacing.S4,
  '& > :not(:last-child)': {
    marginBottom: 24,
  },
})

const DevToProdPushManagement = () => {
  const { data, loading, error } = useQuery(GET_DEV_TO_PROD_PUSH_CONFIGS)

  if (loading) return 'Loading...'

  if (error) return 'Error occurred!'

  const { devToProdPushConfigs } = data

  return (
    <Wrapper>
      <TopButtonsWrapper>
        <PushAllDataToProdButton />
        <CreateDataPushConfigButton />
      </TopButtonsWrapper>

      <CardsContainer>
        {devToProdPushConfigs.map(({ _id, name, collections }) => {
          return (
            <DataPushConfig
              key={_id}
              _id={_id}
              name={name}
              collections={collections}
            />
          )
        })}
      </CardsContainer>
    </Wrapper>
  )
}

export default DevToProdPushManagement

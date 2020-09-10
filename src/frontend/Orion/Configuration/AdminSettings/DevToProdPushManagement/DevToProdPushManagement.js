import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { lighten } from 'polished'

import { GET_DEV_TO_PROD_PUSH_CONFIGS } from 'frontend/api/queries'
import { Colors, Spacing } from 'frontend/utils/pulseStyles'

import DataPushConfig from './DataPushConfig'
import CreateDataPushConfigButton from './CreateDataPushConfigButton'
import PushAllDataToProdButton from './PushAllDataToProdButton'

const Wrapper = styled.div({
  background: lighten(0.05, Colors.LIGHT_GRAY_1),
  padding: Spacing.EXTRA_LARGE,
  height: '100vh',
  overflow: 'auto',
  boxSizing: 'border-box',
  flex: '1 0 auto',
})

const TopButtonsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  '& > :not(:last-child)': {
    marginRight: 12,
  },
})

const CardsContainer = styled.div({
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

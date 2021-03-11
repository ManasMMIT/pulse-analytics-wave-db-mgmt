import React from 'react'
import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { lighten } from 'polished'

import { GET_DEV_TO_PROD_PUSH_CONFIGS } from 'frontend/api/queries'
import { Colors, Spacing } from 'frontend/utils/pulseStyles'

import PushCard from './PushCard'

const Wrapper = styled.div({
  background: lighten(0.05, Colors.LIGHT_GRAY_1),
  padding: Spacing.EXTRA_LARGE,
  height: '100vh',
  overflow: 'auto',
  boxSizing: 'border-box',
  flex: '1 0 auto',
})

const CardsContainer = styled.div({
  '& > :not(:last-child)': {
    marginBottom: 24,
  },
})

const DevToProdPushConsole = () => {
  const { data, loading, error } = useQuery(GET_DEV_TO_PROD_PUSH_CONFIGS)

  if (loading) return 'Loading...'

  if (error) return 'Error occurred!'

  const { devToProdPushConfigs } = data

  return (
    <Wrapper>
      <CardsContainer>
        {devToProdPushConfigs.map(({ _id, name }) => {
          return <PushCard key={_id} _id={_id} name={name} />
        })}
      </CardsContainer>
    </Wrapper>
  )
}

export default DevToProdPushConsole

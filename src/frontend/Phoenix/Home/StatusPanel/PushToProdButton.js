import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { useMutation } from '@apollo/react-hooks'
import { transparentize, mix } from 'polished'

import { Colors, Spacing, Transitions } from '../../../utils/pulseStyles'

import StatusHeaderIcon from './StatusHeaderIcon'

import { GET_OP_LOG } from '../../../api/queries'
import {
  PUSH_SITEMAP_TO_PROD,
} from '../../../api/mutations'

import Spinner from '../../shared/Spinner'

const StyledButton = styled.button({
  border: 'none',
  borderRadius: 4,
  padding: `${Spacing.NORMAL} ${Spacing.NORMAL}`,
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: '0.2px',
  cursor: 'pointer',
  background: transparentize(0.9, Colors.WHITE),
  color: Colors.WHITE,
  transition: Transitions.NORMAL,
  width: '100%',
  ':hover': {
    background: Colors.WHITE,
    color: Colors.TOOL_SIDEBAR,
  },
  ':active': {
    background: mix(0.2, Colors.BLACK, Colors.WHITE),
    outline: 'none',
  }
})

const LoadingContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  marginTop: Spacing.NORMAL,
})

const pulseAnimation = keyframes`
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
`

const LoadingMessage = styled.p({
  color: Colors.WHITE,
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  animation: `${pulseAnimation} 0.8s ease infinite`
})

const ErrorContainer = styled.div({
  marginTop: Spacing.NORMAL,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
})

const ErrorHeader = styled.h4({
  color: Colors.RED,
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: Spacing.NORMAL,
})

const ErrorMessage = styled.p({
  color: transparentize(0.2, Colors.WHITE),
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.5,
})


const PushToProdButton = () => {
  const [handleSubmit, { loading, error }] = useMutation(
    PUSH_SITEMAP_TO_PROD,
    { refetchQueries: [{ query: GET_OP_LOG }] }
  )

  if (error) return (
    <ErrorContainer>
      <StatusHeaderIcon size={16} color={Colors.RED} />
      <ErrorHeader>Error processing request</ErrorHeader>
      <ErrorMessage> Reload the page and try again. If the problem persists, contact the Pulse Team.</ErrorMessage>
    </ErrorContainer>
  )
  if (loading) return (
    <LoadingContainer>
      <Spinner fill="white" />
      <LoadingMessage>Deploying Changes to Production</LoadingMessage>
    </LoadingContainer>
  )

  return (
    <div style={{ width: '100%' }}>
      <StyledButton onClick={handleSubmit}>
        DEPLOY PERMISSIONS
      </StyledButton>
    </div>
  )
}

export default PushToProdButton

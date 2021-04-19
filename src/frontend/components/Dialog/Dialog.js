import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import { ZIndexes, AlphaColors } from '../../utils/pulseStyles'
import Color from '../../utils/color'
import Spacing from '../../utils/spacing'

const DialogOverlay = styled.div({
  position: 'fixed',
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  background: AlphaColors.Black70,
  zIndex: ZIndexes.MODAL,
  padding: Spacing.S7,
})

const ContentWrapper = styled.div({
  position: 'relative',
  height: '100%',
})

const Content = styled.div({
  background: Color.WHITE,
  borderRadius: Spacing.S2,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const DialogComponent = ({ contentWrapperStyle, contentStyle, children }) => (
  <DialogOverlay>
    <ContentWrapper style={contentWrapperStyle}>
      <Content style={contentStyle}>{children}</Content>
    </ContentWrapper>
  </DialogOverlay>
)

DialogComponent.propTypes = {
  children: PropTypes.node.isRequired,
  contentWrapperStyle: PropTypes.object,
  contentStyle: PropTypes.object,
}

DialogComponent.defaultProps = {
  contentWrapperStyle: {},
  contentStyle: {},
}

export default DialogComponent

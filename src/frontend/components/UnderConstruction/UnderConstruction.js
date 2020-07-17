import React from 'react'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

const Container = styled.div({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  padding: 24,
})

const Graphic = styled.img({
  maxWidth: 320,
  width: '100%',
})

const Title = styled.h3({
  color: Color.ORANGE,
  textTransform: 'uppercase',
  marginBottom: 24,
})

const Message = styled.p({
  color: Color.BLACK,
  marginTop: 32,
  ...FontSpace.FS3,
})

const UnderConstruction = (props) => (
  <Container>
    <Title>{props.title}</Title>
    <Graphic src={props.image} />
    <Message>{props.text}</Message>
  </Container>
)

UnderConstruction.defaultProps = {
  image:
    'https://res.cloudinary.com/pulsedatatools/image/upload/v1594909914/polaris/system/under-construction/under-construction-1.svg',
  title: 'Under Construction',
  text:
    'This feature is in the process of being built or will be built out in the near future.',
}

export default UnderConstruction

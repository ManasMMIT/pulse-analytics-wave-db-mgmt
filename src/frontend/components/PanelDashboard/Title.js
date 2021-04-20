import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const Wrapper = styled.div(
  {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
  },
  ({ style }) => ({
    ...style,
  })
)

const Label = styled.div({}, ({ style }) => ({
  ...style,
}))

const Title = ({ label, style, labelStyle }) => {
  return (
    <Wrapper style={style}>
      <Label style={labelStyle}>{label}</Label>
    </Wrapper>
  )
}

Title.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
}

Title.defaultProps = {
  style: {},
  labelStyle: {},
}

export default Title

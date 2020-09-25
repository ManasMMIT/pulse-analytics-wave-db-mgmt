import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Button from 'frontend/components/Button'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

const ButtonsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const ButtonCluster = ({ hasNewOrgConnection, cancelHandler }) => {
  return (
    <ButtonsWrapper>
      <Button
        color={Color.WHITE}
        onClick={cancelHandler}
        buttonStyle={{ color: Color.GRAY_DARK, margin: `0 ${Spacing.S3}` }}
      >
        Cancel
      </Button>
      <Button
        type="secondary"
        onClick={() => {}}
        color={Color.GREEN}
        buttonStyle={{ margin: `0 ${Spacing.S3}` }}
      >
        Save
      </Button>
      {!hasNewOrgConnection && (
        <Button
          buttonStyle={{ margin: `0 ${Spacing.S3}` }}
          onClick={() => {}}
          type="secondary"
          color={Color.RED}
          iconName="delete"
          iconColor1={Color.RED}
        />
      )}
    </ButtonsWrapper>
  )
}

ButtonCluster.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  hasNewOrgConnection: PropTypes.bool.isRequired,
}

ButtonCluster.defaultProps = {}

export default ButtonCluster

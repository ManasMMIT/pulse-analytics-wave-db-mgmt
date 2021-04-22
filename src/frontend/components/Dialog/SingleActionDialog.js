import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import Header from 'frontend/components/Header'
import Dialog from './Dialog'
import Button from 'frontend/components/Button'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'

const ActionBar = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: `${Spacing.S5} ${Spacing.S7}`,
})

const defaultContentWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const defaultContentStyle = {
  height: 'auto',
  width: 448,
}

const SingleActionDialog = ({
  header,
  children,
  cancelHandler,
  submitHandler,
  submitText,
  contentWrapperStyle,
  contentStyle,
}) => {
  const combinedContentWrapperStyle = {
    ...defaultContentWrapperStyle,
    contentWrapperStyle,
  }

  const combinedWrapperStyle = {
    ...defaultContentStyle,
    contentStyle,
  }

  return (
    <Dialog
      contentWrapperStyle={combinedContentWrapperStyle}
      contentStyle={combinedWrapperStyle}
    >
      <Header header={header} style={{ padding: Spacing.S7 }} />
      <div style={{ background: Color.GRAY_LIGHT }}>{children}</div>
      <ActionBar>
        <Button
          type="secondary"
          color={Color.GRAY_DARK}
          onClick={cancelHandler}
          buttonStyle={{ marginRight: Spacing.S5 }}
        >
          Cancel
        </Button>
        <Button type="primary" color={Color.GREEN} onClick={submitHandler}>
          {submitText}
        </Button>
      </ActionBar>
    </Dialog>
  )
}

SingleActionDialog.propTypes = {
  children: PropTypes.node.isRequired,
  submitHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  submitText: PropTypes.string,
}

SingleActionDialog.defaultTypes = {
  submitText: 'Submit',
}

export default SingleActionDialog

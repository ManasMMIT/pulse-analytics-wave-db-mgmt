import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing, Transitions, ZIndexes } from '../utils/pulseStyles'
import Color from 'frontend/utils/color'
import Button from 'frontend/components/Button'

const CancelCloseButton = ({ closeModal }) => (
  <Button
    buttonStyle={{ margin: Spacing.S3 }}
    color={Color.GRAY_DARK}
    type="secondary"
    onClick={closeModal}
  >
    Cancel + Close
  </Button>
)

const Wrapper = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: transparentize(0.3, Colors.BLACK),
  zIndex: ZIndexes.MODAL,
  /*
    Since our modal is nested in the DOM, not at the top,
    We need to override styles that might be inherited.
  */
  cursor: 'default',
  fontWeight: 400,
  color: Colors.BLACK,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Main = styled.section(
  {
    background: '#F0F6F9',
    borderRadius: 4,
    boxShadow: `0 6px 24px 0 ${transparentize(0.7, Colors.BLACK)}`,
    overflowY: 'auto',
    maxHeight: '90vh',
    margin: 32,
  },
  (props) => ({
    width: props.width,
    padding: props.padding,
  })
)

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
  textTransform: 'uppercase',
})

const Title = styled.div({
  color: Colors.BLACK,
  fontSize: 14,
  fontWeight: 700,
  marginRight: Spacing.NORMAL,
})

class Modal extends React.Component {
  // TODO: but the Create user button still gets clicked!
  handleClickAway = (e) => {
    e.stopPropagation()

    if (!this.node.contains(e.target) && !this.props.noClickAway) {
      this.props.handleClose()
    }
  }

  render() {
    const {
      handleClose,
      children,
      show,
      title,
      style,
      disableHeader,
      submitButton,
      padding,
      width,
      modalStyle,
    } = this.props

    if (!show) return null

    // TODO: but the Create user button still gets clicked!
    const onClickCloseButton = (e) => {
      e.stopPropagation()
      handleClose()
    }

    return (
      <Wrapper onClick={this.handleClickAway} style={style}>
        <Main
          ref={(node) => {
            this.node = node
          }}
          width={width}
          padding={padding}
          style={modalStyle}
        >
          {disableHeader || (
            <Header>
              <Title>{title}</Title>
              <div>
                <CancelCloseButton closeModal={onClickCloseButton} />
                {submitButton}
              </div>
            </Header>
          )}
          {children}
        </Main>
      </Wrapper>
    )
  }
}

Modal.defaultProps = {
  handleClose: () => {
    console.error('No close handler passed to Modal')
  },
  show: false,
  title: null,
  style: {},
  modalStyle: {},
  disableHeader: false,
  width: 'auto',
  padding: 32,
  noClickAway: false,
}

Modal.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
  modalStyle: PropTypes.object,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disableHeader: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noClickAway: PropTypes.bool,
}

export default Modal

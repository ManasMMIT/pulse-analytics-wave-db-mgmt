import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { transparentize } from 'polished'

import { Colors, Spacing, Transitions, ZIndexes } from '../utils/pulseStyles'

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
})

const Main = styled.section({
  position: "fixed",
  background: '#F0F6F9',
  borderRadius: 4,
  boxShadow: `0 6px 24px 0 ${transparentize(0.7, Colors.BLACK)}`,
  height: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "inline-flex",
  flexDirection: 'column',
  justifyContent: "space-between",
  padding: 24,
  width: '80%',
});

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 24,
  textTransform: 'uppercase',
});

const Title = styled.div({
  color: Colors.BLACK,
  fontSize: 14,
  fontWeight: 700,
  marginRight: Spacing.NORMAL,
});

const CloseButton = styled.button({
  background: transparentize(0.9, Colors.BLACK),
  color: Colors.BLACK,
  cursor: 'pointer',
  border: 'none',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  padding: `${Spacing.TINY} ${Spacing.SMALL}`,
  transition: Transitions.NORMAL,
  textTransform: 'capitalize',
  ':hover': {
    background: transparentize(0.75, Colors.BLACK)
  }
})

const ButtonWrapper = styled.div({
  display: 'flex',
})

class Modal extends React.Component {
  // TODO: but the Create user button still gets clicked!
  handleClickAway = e => {
    e.stopPropagation()

    if (!this.node.contains(e.target)) {
      this.props.handleClose();
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
    } = this.props;

    if (!show) return null;

    // TODO: but the Create user button still gets clicked!
    const onClickCloseButton = e => {
      e.stopPropagation()
      handleClose()
    }

    return (
      <Wrapper onClick={this.handleClickAway} css={style}>
        <Main ref={node => { this.node = node }}>
          {
            disableHeader || (
              <Header>
                <Title>{title}</Title>
                <ButtonWrapper>
                  <CloseButton onClick={onClickCloseButton}>
                    close
                  </CloseButton>
                  {submitButton}
                </ButtonWrapper>
              </Header>
            )
          }

          {children}
        </Main>
      </Wrapper>
    );
  }
}

Modal.defaultProps = {
  handleClose: () => {
    console.error('No close handler passed to Modal')
  },
  show: false,
  title: null,
  style: {},
  disableHeader: false,
}

Modal.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object,
  disableHeader: PropTypes.bool,
}

export default Modal;

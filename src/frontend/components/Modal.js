import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const Wrapper = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.6)',
  zIndex: 1,
  /*
    Since our modal is nested in the DOM, not at the top,
    We need to override styles that might be inherited.
  */
  cursor: 'default',
  fontWeight: 'normal',
  color: 'black',
})

const Main = styled.section({
  position: "fixed",
  background: "white",
  width: "80%",
  height: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "inline-flex",
  flexDirection: 'column',
  justifyContent: "space-between",
  padding: 24,
});

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

const Title = styled.div({
  color: 'black',
  fontWeight: 700,
});

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
                <button onClick={onClickCloseButton}>
                  close
                </button>
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

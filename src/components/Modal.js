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
  handleClickAway = e => {
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
    } = this.props;

    if (!show) return null;

    return (
      <Wrapper onClick={this.handleClickAway}>
        <Main ref={node => { this.node = node }}>
          <Header>
            <Title>{title}</Title>
            <button onClick={handleClose}>close</button>
          </Header>
          {children}
        </Main>
      </Wrapper>
    );
  }
}
export default Modal;

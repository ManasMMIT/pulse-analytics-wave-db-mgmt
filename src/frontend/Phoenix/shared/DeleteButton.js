import React from 'react'
import PropTypes from 'prop-types'
import { Mutation, withApollo } from 'react-apollo'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

import Modal from './../../components/Modal'
import Spinner from './Spinner'

const trashCan = <FontAwesomeIcon size="lg" icon={faTrashAlt} />

const modalButtonStyle = {
  background: 'red',
  color: 'white',
  fontWeight: 700,
  padding: '4px 8px',
  textAlign: 'center',
}

const buttonStyle = {
  border: 'none',
  background: 'none',
  color: '#b6b9bc',
  cursor: 'pointer',
}

class DeleteButton extends React.Component {
  state = { isModalOpen: false }

  openModal = () => this.setState({ isModalOpen: true })

  closeModal = () => this.setState({ isModalOpen: false })

  finalDeleteHandler = _id => {
    this.props.deleteHandler(_id).then(this.closeModal)
  }

  render() {
    const {
      openModal,
      closeModal,
      state: { isModalOpen },
      props: {
        style,
        modalTitle,
        modalText,
        itemId,
        mutationDoc,
        clientMutation,
        client,
        additionalFormData,
      },
    } = this

    const updateClientMutationCallback = (store, { data }) => client.mutate({
      mutation: clientMutation,
      variables: { data }
    })

    return (
      <>
        <button
          style={{ ...buttonStyle, ...style }}
          onClick={openModal}
        >
          {trashCan}
        </button>
        <Modal
          handleClose={closeModal}
          show={isModalOpen}
          title={modalTitle}
        >
          {modalText}

          <Mutation
            mutation={mutationDoc}
            update={updateClientMutationCallback}
          >
            {(handleSubmit, { loading, error }) => {
              if (loading) return <Spinner />
              if (error) return <div style={{ color: 'red' }}>Error processing request</div>

              return (
                <div
                  style={modalButtonStyle}
                  onClick={() => handleSubmit({ variables: { input: { _id: itemId, ...additionalFormData } } })}
                >
                  Delete Forever
                </div>
              )
            }}
          </Mutation>
        </Modal>
      </>
    )
  }
}

DeleteButton.propTypes = {
  style: PropTypes.object,
  mutationDoc: PropTypes.object,
  modalTitle: PropTypes.string,
  modalText: PropTypes.string,
  itemId: PropTypes.string,
  clientMutation: PropTypes.object,
  client: PropTypes.object,
  additionalFormData: PropTypes.object,
}

export default withApollo(DeleteButton)

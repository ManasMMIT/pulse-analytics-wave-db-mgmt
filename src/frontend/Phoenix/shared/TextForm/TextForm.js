import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled"
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { transparentize, lighten } from 'polished'

import Spinner from '../Spinner'

import { Colors, Spacing, FontFamily } from '../../../utils/pulseStyles'

const TeamFormWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: 320,
})

const Label = styled.label({
  fontSize: 12,
  lineHeight: '22px',
  fontWeight: 600,
  textTransform: 'capitalize'
})

const Input = styled.input({
  background: Colors.WHITE,
  border: `1px solid ${transparentize(0.96, Colors.BLACK)}`,
  borderRadius: 4,
  padding: '8px 12px',
  ':hover': {
    border: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  },
  ':focus': {
    border: `1px solid ${transparentize(0.1, Colors.PRIMARY)}`,
    outline: 'none',
  }
})

const Button = styled.button({
  background: Colors.PRIMARY,
  border: 'none',
  borderRadius: 4,
  color: Colors.WHITE,
  cursor: 'pointer',
  fontFamily: FontFamily.NORMAL,
  fontSize: 12,
  fontWeight: 600,
  padding: `${Spacing.NORMAL} ${Spacing.LARGE}`,
  textTransform: 'uppercase',
  marginTop: Spacing.LARGE,
  ':hover': {
    background: lighten(0.1, Colors.PRIMARY),
  }
})

class TextForm extends Component {
  constructor(props) {
    super(props)
    const {
      data: {
        description
      },
      additionalFormData
    } = props

    this.state = { description, ...additionalFormData }
  }

  handleChange = e => {
    const {
      value,
      name,
    } = e.target

    this.setState({ [name]: value })
  }

  render() {
    const {
      state,
      handleChange,
      props: {
        handleSubmit,
        afterSubmitHook,
      },
    } = this

    return (
      <TeamFormWrapper>
        <Label>Name</Label>
        <Input
          type="text"
          name={"description"}
          onChange={handleChange}
          value={state.description}
        />
        <Button
          type="submit"
          onClick={() => handleSubmit({ variables: { input: state } }).then(afterSubmitHook)}
        >
          submit
        </Button>
      </TeamFormWrapper>
    );
  }
}

const TextFormContainer = ({
  mutationDoc,
  clientMutation,
  refetchQueries,
  ...otherProps
}) => {
  const client = useApolloClient()

  const updateClientMutationCallback = clientMutation
    ? (cache, { data }) => {
      client.mutate({
        mutation: clientMutation,
        variables: { data },
      })
    }
    : () => {}

  const [handleSubmit, { loading, error }] = useMutation(
    mutationDoc,
    {
      update: updateClientMutationCallback,
      refetchQueries,
    },
  )

  if (loading) return <Spinner />
  if (error) return <div style={{ color: 'red' }}>Error processing request</div>

  return (
    <TextForm
      handleSubmit={handleSubmit}
      {...otherProps}
    />
  )
}

TextFormContainer.propTypes = {
  data: PropTypes.object,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
  clientMutation: PropTypes.object,
  additionalFormData: PropTypes.object,
  refetchQueries: PropTypes.array,
}

TextFormContainer.defaultProps = {
  data: { description: '' },
  mutationDoc: {},
  clientMutation: null,
  afterMutationHook: () => null,
  additionalFormData: {},
  refetchQueries: [],
}

export default TextFormContainer

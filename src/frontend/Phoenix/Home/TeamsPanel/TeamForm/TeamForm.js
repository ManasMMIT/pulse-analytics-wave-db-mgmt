import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from "@emotion/styled"
import { useMutation, useApolloClient } from '@apollo/client'
import { transparentize, lighten } from 'polished'

import Spinner from 'frontend/components/Spinner'

import { Colors, Spacing, FontFamily } from 'frontend/utils/pulseStyles'

const FormWrapper = styled.div({
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

const InputSection = styled.div({
  marginBottom: 16,
  display: 'flex',
  flexDirection: 'column',
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

class TeamForm extends Component {
  constructor(props) {
    super(props)
    const {
      team: {
        _id,
        description,
        defaultLandingPath = '',
      },
    } = props

    this.state = {
      _id,
      description,
      defaultLandingPath: defaultLandingPath || '',
    }

    // for team creation, endpoint needs to know which client team is on
    if (props.clientId) this.state.clientId = props.clientId
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

    const {
      description,
      defaultLandingPath,
    } = state

    return (
      <FormWrapper>
        <InputSection>
          <Label>Name</Label>
          <Input
            type="text"
            name="description"
            onChange={handleChange}
            value={description}
            autoComplete="off"
          />
        </InputSection>

        <InputSection>
          <Label>Default Landing Page</Label>
          <Input
            type="text"
            name="defaultLandingPath"
            value={defaultLandingPath}
            onChange={handleChange}
            autoComplete="off"
          />
        </InputSection>

        <Button
          type="submit"
          onClick={() => handleSubmit({ variables: { input: state } }).then(afterSubmitHook)}
        >
          submit
        </Button>
      </FormWrapper>
    );
  }
}

const TeamFormContainer = ({
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
    : () => { }

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
    <TeamForm
      handleSubmit={handleSubmit}
      {...otherProps}
    />
  )
}

TeamFormContainer.propTypes = {
  team: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string,
    defaultLandingPath: PropTypes.string,
  }),
  clientId: PropTypes.string,
  mutationDoc: PropTypes.object,
  afterMutationHook: PropTypes.func,
  clientMutation: PropTypes.object,
  refetchQueries: PropTypes.array,
}

TeamFormContainer.defaultProps = {
  team: { _id: null, description: '', defaultLandingPath: '' },
  clientId: null,
  mutationDoc: {},
  clientMutation: null,
  afterMutationHook: () => null,
  refetchQueries: [],
}

export default TeamFormContainer

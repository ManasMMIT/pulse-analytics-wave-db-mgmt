import gql from 'graphql-tag'

export const RUN_PIPE_DELIMITED_SCRIPT = gql`
  mutation PipeDelimitedScript {
    pipeDelimitedScript
  }
`

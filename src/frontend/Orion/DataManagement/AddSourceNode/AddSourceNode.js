import React, { useState } from "react"
import { GET_PATH_NODES } from '../../../api/queries'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Select from 'react-select'

const AddSourceNode = () => {
  const { data, loading } = useQuery(GET_PATH_NODES)

  if (loading) return 'Loading...'

  console.log(data)

  return (
    <div>hello</div>
  )
}

export default AddSourceNode

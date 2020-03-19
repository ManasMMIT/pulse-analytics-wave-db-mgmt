import React, { useState, useEffect } from "react"
import { GET_PATH_NODES } from '../../../api/queries'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Select from 'react-select'

const AddSourceNode = () => {
  const [selectedNode, selectNode] = useState({})
  const { data, loading } = useQuery(GET_PATH_NODES)

  useEffect(() => {
    if (!loading) selectNode(data.pathNodes[0])
  }, [loading])

  if (loading) return 'Loading...'

  return (
    <div style={{ width: 800 }}>
      <Select
        value={{ value: selectedNode._id, label: selectedNode.path }}
        onChange={({ value, label }) => selectNode({ _id: value, path: label })}
        options={data.pathNodes.map(({ _id, path }) => ({ value: _id, label: path }))}
      />
    </div>
  )
}

export default AddSourceNode

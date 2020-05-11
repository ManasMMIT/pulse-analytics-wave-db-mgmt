import React, { useState, useEffect } from "react"
import { useQuery } from '@apollo/react-hooks'
import Select from 'react-select'

import CreateNodeForm from './CreateNodeForm'

import addPathToNodes from '../EditRoleNodeView/addPathToNodes'

import { GET_SOURCE_NODES } from '../../../../api/queries'

const AddSourceNode = () => {
  const [selectedNode, selectNode] = useState({})

  const { data, loading } = useQuery(GET_SOURCE_NODES)

  useEffect(() => {
    if (!loading) {
      selectNode(data.nodes[0])
    }
  }, [loading])

  if (loading) return 'Loading...'

  const parentNodeOptions = addPathToNodes(data.nodes).map(
    ({ _id, path }) => ({ value: _id, label: path })
  )

  return (
    <div style={{ flex: '1 0 auto', padding: 24 }}>
      <div style={{ padding: '24px 0' }}>
        <div style={{ marginBottom: 24 }}>Pick a parent node:</div>

        <Select
          value={{ value: selectedNode._id, label: selectedNode.path }}
          onChange={({ value, label }) => selectNode({ _id: value, path: label })}
          options={parentNodeOptions}
        />
      </div>

      <CreateNodeForm
        parentId={selectedNode._id}
        refetchQueries={[{ query: GET_SOURCE_NODES }]}
      />
    </div>
  )
}

export default AddSourceNode

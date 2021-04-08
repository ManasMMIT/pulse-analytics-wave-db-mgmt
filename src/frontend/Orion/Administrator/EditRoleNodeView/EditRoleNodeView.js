import React, { useState, useEffect} from 'react'
import Select from 'react-select'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import EditRoleNodeForm from './EditRoleNodeForm'

import addPathToNodes from './addPathToNodes'

import {
  GET_TEAMS
} from '../../../api/queries'

const EditRoleNodeView = () => {
  const { loading, data } = useQuery(GET_TEAMS)

  const [
    selectedTeam,
    setSelectedTeam,
  ] = useState(null)

  const [
    selectedNode,
    setSelectedNode,
  ] = useState(null)

  useEffect(() => {
    if (!loading) {
      setSelectedTeam(data.teams[0])
    }
  }, [loading])

  if (loading) return 'Loading...'

  const { teams } = data

  const teamsDropdownOptions = teams.map(team => ({
    value: team,
    label: `Client: ${team.client.name } | Team: ${team.name}`,
  }))

  let roleNodeOptions = []
  if (selectedTeam) {
    // ! need to get the target team from teams because teams may have been updated
    // ! in refetchQueries, so we need to appropriately refresh roleNodeOptions
    const targetTeam = teams.find(({ _id }) => selectedTeam._id === _id)

    const nodesWithPath = addPathToNodes(
      [
        ...targetTeam.sitemap.tools,
        ...targetTeam.sitemap.dashboards,
        ...targetTeam.sitemap.pages,
        ...targetTeam.sitemap.cards,
      ]
    )

    roleNodeOptions = nodesWithPath
      .map(node => ({
        label: node.path,
        value: node,
      }))
  }

  return (
    <div style={{ flex: '1 0 auto', padding: 24 }}>
      {
        selectedTeam && (
          <div style={{ paddingBottom: '24px 0' }}>
            <div style={{ marginBottom: 24 }}>1. Choose a Team: </div>
            <Select
              defaultValue={teamsDropdownOptions[0]}
              value={{
                value: selectedTeam,
                label: `Client: ${selectedTeam.client.name} | Team: ${selectedTeam.name}`,
              }}
              options={teamsDropdownOptions}
              onChange={({ value }) => {
                setSelectedTeam(value)
                setSelectedNode(null)
              }}
            />
          </div>
        )
      }
      {
        selectedTeam && (
          <div style={{ padding: '24px 0' }}>
            <div style={{ marginBottom: 24 }}>2: Choose a Node: </div>
            <Select
              defaultValue={roleNodeOptions[0]}
              value={{ value: selectedNode, label: selectedNode && selectedNode.path }}
              options={roleNodeOptions}
              onChange={({ value }) => setSelectedNode(value)}
            />
          </div>
        )
      }
      {
        selectedTeam && selectedNode && (
          <EditRoleNodeForm
            node={_.omit(selectedNode, 'path')}
            teamId={selectedTeam._id}
            refetchQueries={[
              { query: GET_TEAMS }
            ]}
          />
        )
      }
    </div>
  )
}

export default EditRoleNodeView

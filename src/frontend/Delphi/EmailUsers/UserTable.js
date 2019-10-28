import React from 'react'
import styled from '@emotion/styled'
import _ from 'lodash'
import util from 'util'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const Wrapper = styled.div({
  width: '70%',
  height: 200,
  overflow: 'auto',
  border: '1px solid gray',
})

const TABLE_CONFIG = [
  { title: 'Username', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Pulse Test', key: 'isPulseTest', formatter: e => e.toString() },
  { title: 'TDG Test', key: 'isTdgTest', formatter: e => e.toString() },
]

const UserView = ({ config, data, removeUser }) => {
  const tableRows = data.map((user, idx) => {
    const cells = config.reduce((acc, { key, formatter }) => {
      if (key === 'remove') return acc
      const content = formatter && user[key] ? formatter(user[key]) : user[key]
      acc.push(<TableCell key={`${user.key}-${key}`}>{content}</TableCell>)
      return acc
    }, [])

    return (
      <TableRow key={util.inspect(user)}>
        {cells}
        <TableCell><button onClick={() => removeUser(idx)}>x</button></TableCell>
      </TableRow>
    )
  })

  return tableRows
}

const AllUsersView = ({ config, data }) => {
  const tableRows = data.map(user => {
    const cells =  config.map(({ key, formatter }) => {
      const content = formatter && user[key] ? formatter(user[key]) : user[key]
      return (
        <TableCell key={`${user.key}-${key}`}>{content}</TableCell>
      )
    })

    return (
      <TableRow key={util.inspect(user)}>
        {cells}
      </TableRow>
    )
  })

  return tableRows
}

const UserTable = ({ 
  data, 
  removeUser, 
  style,
  isTabViewUsers
}) => {
  let clonedConfig = _.clone(TABLE_CONFIG)
  let content
  
  if (isTabViewUsers){
    clonedConfig.unshift({ title: 'Client', key: 'client' })
    content = <AllUsersView config={clonedConfig} data={data} />
  } else {
    clonedConfig.push({ title: 'Remove', key: 'remove' })
    content = <UserView config={clonedConfig} data={data} removeUser={removeUser} />
  }

  return (
    <Wrapper style={style}>
      <Table>
        <TableHead>
          <TableRow>
            {clonedConfig.map(config => (
              <TableCell key={util.inspect(config)}>{config.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {content}
        </TableBody>
      </Table>
    </Wrapper>
  )
}

export default UserTable

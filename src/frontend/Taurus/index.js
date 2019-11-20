import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import styled from '@emotion/styled'


import { GET_QUERY_RESULTS } from './../api/queries'

const PageWrapper = styled.div({ flex: 1 })

const Question = styled.div({ fontWeight: 700, padding: 12 })

const TableWrapper = styled.div({ display: 'flex', flexDirection: 'column' })

const TableHeader = styled.div({ display: 'flex', fontWeight: 700, padding: 12 })

const TableHeaderItem = styled.div({ flex: 1, cursor: 'pointer' })

const TableBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 44px)',
  overflowY: 'scroll'
})

const TableRow = styled.div({
  display: 'flex',
  flex: 1,
  padding: 12
}, ({ background }) => ({ background }))

const TableColumn = styled.div({ flex: 1 })

const Taurus = () => {
  const { data, loading } = useQuery(GET_QUERY_RESULTS)
  const [nameSortOrder, handleNameSortOrder] = useState('asc')
  const [typeSortOrder, handleTypeSortOrder] = useState('asc')

  if (loading) return <div>loading</div>
  
  const { queryTool: results } = data
  
  const sortedResults = _.orderBy(
    results,
    ['type', 'organization'],
    [typeSortOrder, nameSortOrder]
  )

  return (
    <PageWrapper>
      <Question>
        Payers and Providers who Participate in OCM (Oncologist Care Model)
      </Question>
      <TableWrapper>
        <TableHeader>
          <TableHeaderItem
            onClick={() => handleNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc')}
          >
            Account {nameSortOrder === 'asc' ? '⬆️' : '⬇️'}
          </TableHeaderItem>
          <TableHeaderItem
            onClick={() => handleTypeSortOrder(typeSortOrder === 'asc' ? 'desc' : 'asc')}
          >
            Type {typeSortOrder === 'asc' ? '⬆️' : '⬇️'}
          </TableHeaderItem>
        </TableHeader>
        <TableBody>
          {
            sortedResults.map((result, idx) => {
              const background = idx % 2 === 0 ? '#9e9e9e33' : 'none'

              return (
                <TableRow
                  key={result._id}
                  background={background}
                >
                  <TableColumn>
                    {result.organization}
                  </TableColumn>
                  <TableColumn>
                    {result.type}
                  </TableColumn>
                </TableRow>
              )
            })
          }
        </TableBody>
      </TableWrapper>
    </PageWrapper>
  )
}

export default Taurus

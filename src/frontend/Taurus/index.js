import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import Select from 'react-select'
import styled from '@emotion/styled'

import {
  FILTER_QUERY,
} from './../api/mutations'

import {
  GET_QUERY_ACCOUNTS,
} from './../api/queries'

import { Colors, Spacing } from '../utils/pulseStyles'

import Card from '../components/Card'
import TableHeader from './TableHeaders/TableHeader'
import DownloadCsvButton from '../components/DownloadCsvButton'

const PageWrapper = styled.div({
  flex: 1,
  backgroundColor: '#e8ebec',
  padding: Spacing.EXTRA_LARGE,
  boxSizing: 'border-box',
})

const Question = styled.div({
  fontWeight: 700,
  padding: 12,
})

const Label = styled.div({
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 4,
})

const SubmitButton = styled.button({
  background: Colors.PRIMARY,
  border: 'none',
  borderRadius: 4,
  color: Colors.WHITE,
  fontSize: 12,
  fontWeight: 700,
  marginLeft: 24,
  padding: '8px 12px',
  ':active': {
    background: 'blue'
  }
})

const TableWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: 12,
})

const TableHeaderWrapper = styled.div({
  display: 'flex',
  fontWeight: 700,
})

const TableBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  maxHeight: 'calc(100vh - 140px)',
})

const TableRow = styled.div({
  display: 'flex',
  flex: 1,
}, ({ background }) => ({ background }))

const TableColumn = styled.div({
  flex: 1,
  padding: 12,
  border: '1px solid grey',
})

const ACCOUNT_TYPE_OPTIONS = [
  'Payer',
  'Provider',
  'Pathways',
  'Alternative Payment Model',
]

const Taurus = () => {
  const { data, loading } = useQuery(GET_QUERY_ACCOUNTS)

  const [dataToDisplay, setDataToDisplay] = useState([])
  const [orgTypes, setOrgTypes] = useState([])
  const [selectedAccount, setSelectedAccount] = useState('')

  const orgTypeFilterOptions = ACCOUNT_TYPE_OPTIONS
    .map(accountType => ({ value: accountType, label: accountType }))

  const [filterQuery] = useMutation(
    FILTER_QUERY,
    {
      onCompleted: ({ filterQuery: result }) => {
        setDataToDisplay(result)
      }
    }
  )

  const defaultValue = Object.keys(
    _.groupBy(dataToDisplay, 'slugType')
  ).map(type => ({ value: type, label: type }))

  if (loading) return null

  const { queryToolAccounts } = data

  const accountFilterOptions = queryToolAccounts.map(({ organization, slug }) => ({
    value: slug,
    label: organization,
  }))

  const csvData = dataToDisplay.map(({ organization, slugType, state }) => ({
    Account: organization,
    Type: slugType,
    'Affiliated State': state,
  }))

  let formattedOrgTypes = []
  if (orgTypes) {
    formattedOrgTypes = orgTypes.map(({ value }) => value)
  }

  const csvFileName = `${ formattedOrgTypes.join('-') }-affiliated-with-${selectedAccount.label }`

  return (
    <PageWrapper>
      <Card title={'Query'}>
        <div style={{ display: 'flex', alignItems: 'flex-end', marginLeft: 12, marginBottom: 24, }}>
          <div style={{ width: 360 }}>
            <Label>
              Account Type(s)
            </Label>
            <Select
              isMulti
              defaultValue={defaultValue}
              onChange={setOrgTypes}
              options={orgTypeFilterOptions}
            />
          </div>
          <Question>
            {`${orgTypes && orgTypes.length > 1 ? 'are' : 'is' } affiliated with`}
          </Question>
          <div style={{ width: 360 }}>
            <Label>
              Account
            </Label>
            <Select
              onChange={setSelectedAccount}
              options={accountFilterOptions}
            />
          </div>
          <SubmitButton
            onClick={() => {
              let formattedAccount = {}
              if (selectedAccount) {
                formattedAccount = selectedAccount.value
              }

              filterQuery({
                variables: {
                  input: {
                    orgTypes: formattedOrgTypes,
                    selectedAccount: formattedAccount,
                  }
                },
              })
            }}
          >
            Submit
          </SubmitButton>
        </div>
      </Card>
      <DownloadCsvButton
        data={csvData}
        fileName={csvFileName}
      />
      <TableWrapper>
        <TableHeaderWrapper>
          <TableHeader
            label={'Account'}
            sortConfig={{
              tableData: dataToDisplay,
              setDataToDisplay,
              key: 'organization',
            }}
          />
          <TableHeader
            label={'Type'}
            sortConfig={{
              tableData: dataToDisplay,
              setDataToDisplay,
              key: 'slugType',
            }}
          />
          <TableHeader
            label={'Affiliated State'}
            sortConfig={{
              tableData: dataToDisplay,
              setDataToDisplay,
              key: 'state',
            }}
          />
        </TableHeaderWrapper>
        <TableBody>
          {
            dataToDisplay.map((result, idx) => {
              const background = idx % 2 === 0 ? '#9e9e9e33' : 'none'

              return (
                <TableRow
                  key={`${ result._id } ${ result.state } ${ idx }`}
                  background={background}
                >
                  <TableColumn>
                    {result.organization}
                  </TableColumn>
                  <TableColumn>
                    {result.slugType}
                  </TableColumn>
                  <TableColumn>
                    {result.state}
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

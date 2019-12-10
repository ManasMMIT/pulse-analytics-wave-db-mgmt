import React from 'react'
import Select from 'react-select'
import styled from '@emotion/styled'
import _ from 'lodash'

import { Colors, Spacing } from './../../../utils/pulseStyles'

import Card from './../../../components/Card'
import TableHeader from './TableHeaders/TableHeader'
import DownloadCsvButton from './../../../components/DownloadCsvButton'

const PageWrapper = styled.div({
  flex: 1,
  backgroundColor: '#e8ebec',
  padding: Spacing.EXTRA_LARGE,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
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
  overflowY: 'scroll',
})

const TableHeaderWrapper = styled.div({
  display: 'flex',
  fontWeight: 700,
})

const TableBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'scroll',
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

const QuestionWrapper = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
  marginLeft: 12,
  marginBottom: 24,
})

const QueryTool = ({
  dataToDisplay,
  setDataToDisplay,
  accountConfig,
  orgTypesConfig,
  csvConfig,
  submitHandler,
}) => {
  const hasStatesData = dataToDisplay
    .some(({ connections }) => connections.some(({ state }) => state))

  return (
    <PageWrapper>
      <Card title={'Query'}>
        <QuestionWrapper>
          <div style={{ width: 360 }}>
            <Label>
              Account Type(s)
            </Label>
            <Select
              isMulti
              defaultValue={orgTypesConfig.defaultValue}
              onChange={orgTypesConfig.onChangeHandler}
              options={orgTypesConfig.filterOptions}
            />
          </div>
          <Question>
            {
              `${ orgTypesConfig.selected && orgTypesConfig.selected.length > 1 ? 'are' : 'is'} affiliated with`
            }
          </Question>
          <div style={{ width: 360 }}>
            <Label>
              Account
            </Label>
            <Select
              isClearable
              defaultValue={accountConfig.defaultValue}
              onChange={accountConfig.onChangeHandler}
              options={accountConfig.filterOptions}
            />
          </div>
          <SubmitButton onClick={submitHandler}>
            Submit
          </SubmitButton>
        </QuestionWrapper>
      </Card>
      <DownloadCsvButton
        data={csvConfig.data}
        fileName={csvConfig.fileName}
      />
      {
        !!dataToDisplay.length && (
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
                  key: 'type',
                }}
              />
              {
                hasStatesData && <TableHeader label={'Affiliated State(s)'} />
              }
            </TableHeaderWrapper>
            <TableBody>
              {
                dataToDisplay.map((result, idx) => {
                  const background = idx % 2 === 0 ? '#9e9e9e33' : 'none'

                  return (
                    <TableRow
                      key={`${result._id} ${idx}`}
                      background={background}
                    >
                      <TableColumn>
                        {result.organization}
                      </TableColumn>
                      <TableColumn>
                        {result.type}
                      </TableColumn>
                      {
                        hasStatesData && (
                          <TableColumn>
                            {result.connections.map(({ state }) => state).join(', ')}
                          </TableColumn>
                        )
                      }
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </TableWrapper>
        )
      }
    </PageWrapper>
  )
}

export default QueryTool

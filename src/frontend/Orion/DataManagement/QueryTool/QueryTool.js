import React from 'react'
import Select from 'react-select'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons"

import { Colors } from './../../../utils/pulseStyles'

import TableHeader from './TableHeader'
import { customSelectStyles } from './../../../components/customSelectStyles'

import {
  PathwaysAccountModal,
  ProviderAccountModal,
  ApmAccountModal,
  PayerAccountModal,
} from '../../shared/AccountModals'

import {
  PageWrapper,
  PageTitle,
  QueryControlsContainer,
  QueryControls,
  Question,
  Label,
  SubmitButton,
  ResultsContainer,
  TableWrapper,
  TableHeaderWrapper,
  TableBody,
  TableRow,
  TableColumn,
  HeaderWrapper,
} from './styledQueryToolComponents'

const MODAL_MAP = {
  'Provider': ProviderAccountModal,
  'Payer': PayerAccountModal,
  'Alternative Payment Model': ApmAccountModal,
  'Pathways': PathwaysAccountModal,
}

const accountModalButtonStyle = {
  color: Colors.BLACK,
}

const QueryTool = ({
  dataToDisplay,
  setDataToDisplay,
  accountConfig,
  orgTypesConfig,
  submitHandler,
  resetHandler,
}) => {

  return (
    <PageWrapper>
      <QueryControlsContainer>
        <HeaderWrapper>
          <PageTitle>Query Tool</PageTitle>
          <FontAwesomeIcon
            style={{ cursor: 'pointer' }}
            onClick={resetHandler}
            icon={faSyncAlt}
            color={Colors.PRIMARY}
          />
        </HeaderWrapper>
        <QueryControls>
          <div style={{ width: 360 }}>
            <Label>
              Account Type(s)
            </Label>
            <Select
              isMulti
              defaultValue={orgTypesConfig.defaultValue}
              onChange={orgTypesConfig.onChangeHandler}
              options={orgTypesConfig.filterOptions}
              styles={customSelectStyles}
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
              styles={customSelectStyles}
            />
          </div>
          <SubmitButton onClick={submitHandler}>
            Submit
          </SubmitButton>
        </QueryControls>
      </QueryControlsContainer>
      {
        !!dataToDisplay.length && (
          <>
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
              <TableHeader
                label={'Oncologists'}
                sortConfig={{
                  tableData: dataToDisplay,
                  setDataToDisplay,
                  key: 'oncologistsCount',
                }}
              />
              <TableHeader label={'VBM Affiliated State(s)'} />
            </TableHeaderWrapper>
            <ResultsContainer>
              <TableWrapper>
                <TableBody>
                  {
                    dataToDisplay.map((result, idx) => {
                      const background = idx % 2 === 0 ? '#9e9e9e33' : 'none'

                      const AccountModal = MODAL_MAP[result.type]

                      const formattedStates = (
                        result.connections
                          ? (
                              result.connections
                                .reduce((acc, { state }) => {
                                  if (state) acc.push(state)

                                  return acc
                                }, [])
                                .join(', ')
                            )
                          : ''
                      )
                      return (
                        <TableRow
                          key={`${result._id} ${idx}`}
                          background={background}
                        >
                          <TableColumn>
                            <AccountModal
                              account={result}
                              buttonLabel={result.organization}
                              buttonStyle={accountModalButtonStyle}
                              isEditModal
                              onActionHook={submitHandler}
                            />
                          </TableColumn>
                          <TableColumn>
                            {result.type}
                          </TableColumn>
                          <TableColumn>
                            {result.oncologistsCount}
                          </TableColumn>
                          <TableColumn>
                            {formattedStates}
                          </TableColumn>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </TableWrapper>
            </ResultsContainer>
          </>
        )
      }
    </PageWrapper>
  )
}

export default QueryTool

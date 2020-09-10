import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import { GET_PHYSICIANS_COMPARE } from 'frontend/api/queries'

import { MODAL_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import NoDataPlaceholder from 'frontend/components/NoDataPlaceholder'
import Spinner from 'frontend/components/Spinner'

const SpinnerWrapper = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const COLUMNS = [
  {
    Header: 'First Name',
    accessor: 'firstName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Middle Name',
    accessor: 'middleName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'PAC ID',
    accessor: 'pacId',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Professional Enrollment ID',
    accessor: 'professionalEnrollmentId',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Primary Specialty',
    accessor: 'primarySpecialty',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Secondary Specialty 1',
    accessor: 'secondarySpecialty1',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Secondary Specialty 2',
    accessor: 'secondarySpecialty2',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Secondary Specialty 3',
    accessor: 'secondarySpecialty3',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Secondary Specialty 4',
    accessor: 'secondarySpecialty4',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Secondary Specialty All',
    accessor: 'secondarySpecialtyAll',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Organization Legal Name',
    accessor: 'orgLegalName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Group Practice PAC ID',
    accessor: 'groupPracticePacId',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Line 1 Street Address',
    accessor: 'address1',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Line 2 Street Address',
    accessor: 'address2',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'City',
    accessor: 'city',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'State',
    accessor: 'state',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Zip Code',
    accessor: 'zip',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Hospital Affiliation LBN 1',
    accessor: 'hospitalAffilLbn1',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Hospital Affiliation LBN 2',
    accessor: 'hospitalAffilLbn2',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Hospital Affiliation LBN 3',
    accessor: 'hospitalAffilLbn3',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Hospital Affiliation LBN 4',
    accessor: 'hospitalAffilLbn4',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Hospital Affiliation LBN 5',
    accessor: 'hospitalAffilLbn5',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const PhysiciansCompareWidget = ({ entity }) => {
  let { data, loading } = useQuery(GET_PHYSICIANS_COMPARE, {
    variables: { npi: entity.nationalProviderIdentifier },
    fetchPolicy: 'network-only',
  })

  if (loading) {
    return (
      <SpinnerWrapper>
        <Spinner size={28} />
      </SpinnerWrapper>
    )
  }

  data = Object.values(data)[0] || []

  if (_.isEmpty(data)) return <NoDataPlaceholder />

  const filename = `CMS_Physicians_Compare-${entity.firstName}_${entity.lastName}`

  return (
    <Table
      width={MODAL_TABLE_WIDTH}
      data={data}
      columns={COLUMNS}
      exportStyle={{ margin: 24 }}
      exportProps={{ filename }}
    />
  )
}

export default PhysiciansCompareWidget

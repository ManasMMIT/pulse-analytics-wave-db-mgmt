import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import _ from 'lodash'

import Title from 'frontend/components/Title'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import { AlphaColors } from 'frontend/utils/pulseStyles'

import TreatmentPlansFilters from './TreatmentPlansFilters'
import TreatmentPlansTable from './TreatmentPlansTable'

const PAYER_TITLE = 'PAYER TREATMENT PLANS (PTP)'

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  width: '100%',
})

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const PayerProjectTreatmentPlan = ({
  data,
  defaultFilters,
  filtersConfig,
  payerOrg,
}) => {
  // defaultFilters shape: { filterVariable: {selectedOptions: [Array], valueSet: [Set]}}
  const [selectedFilters, setFilter] = useState(defaultFilters)

  // filter data by selectedFilters on every render
  const filteredData = data.filter(
    treatmentPlan =>
      // weed out any treatment plan where the value of the key
      // is *not* included in the value Set of the same key in selectedFilters
      !Object.entries(treatmentPlan).some(fieldArr => {
        let shouldBeFiltered = false
        const [key, value] = fieldArr
        const filterValue = selectedFilters[key]

        // don't filter out anything if the valueSet of the filter key
        // is empty aka no filters are selected
        if (filterValue && !_.isEmpty(filterValue.valueSet)) {
          const { valueSet } = filterValue
          shouldBeFiltered = !valueSet.has(value)
        }

        return shouldBeFiltered
      })
  )

  const setFilterOptions = (selectedArr, selectVal) => {
    let uniqueSet = new Set([])

    if (!_.isEmpty(selectedArr)) {
      uniqueSet = selectedArr.reduce((acc, { value }) => {
        acc.add(value)
        return acc
      }, new Set([]))
    }

    const result = {
      selectedVal: selectedArr,
      valueSet: uniqueSet,
    }

    setFilter(state => ({ ...state, [selectVal]: result }))
  }

  return (
    <Wrapper>
      <section style={{ padding: Spacing.S4 }}>
        <Header>
          <Title title={PAYER_TITLE} titleModifiers={[payerOrg]} />
          <button style={{ outline: '1px solid red' }}>Configure PTPs</button>
        </Header>
      </section>
      <TreatmentPlansFilters
        selectedFilters={selectedFilters}
        filtersConfig={filtersConfig}
        setFilter={setFilterOptions}
      />
      <TreatmentPlansTable checkbox data={filteredData} />
    </Wrapper>
  )
}

PayerProjectTreatmentPlan.propTypes = {
  data: PropTypes.array.isRequired,
  defaultFilters: PropTypes.object.isRequired,
  filtersConfig: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.array.isRequired,
    })
  ),
  payerOrg: PropTypes.string.isRequired,
}

export default PayerProjectTreatmentPlan

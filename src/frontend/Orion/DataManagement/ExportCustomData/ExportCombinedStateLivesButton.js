import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ExportExcelButton from '../../../components/ExportExcelButton'

// TODO 1: send treatmentPlan to backend resolver for data
import {
  GET_PAYER_COMBINED_DRG_STATE_LIVES
} from './../../../api/queries'


// TODO 2: disable button if
// * 1. data for treatmentPlan is still loading,
// * 2. returned data from treatmentPlan is empty (nothing found)
// ! for #2 case, display a helpful message on frontend,
// ! disabling already happens under the hood in the ExportButton component

const SOURCE = 'DRG'
const TERRITORY_TYPE = 'states'

const ExportCombinedStateLivesButton = ({
  treatmentPlan,
}) => {
  const { _id, ...tpFields } = treatmentPlan
  const treatmentPlanLabel = Object.values(tpFields).join(' - ')

  const [exportData, setExportData] = useState([])

  const [
    loadCombinedDrgStateLivesData,
    { loading }
  ] = useLazyQuery(
    GET_PAYER_COMBINED_DRG_STATE_LIVES,
    {
      variables: { treatmentPlan },
      onCompleted: data => {
        if (_.isEmpty(data.payerCombinedStateLives[0])) {
          setExportData([])
        } else if (data.payerCombinedStateLives[0]) {

          const formattedDataForExport = getCombinedStateLivesExportData(
            data.payerCombinedStateLives[0],
            SOURCE,
            TERRITORY_TYPE,
          )

          setExportData(formattedDataForExport)
        }
      }
    }
  )

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) loadCombinedDrgStateLivesData()
  }, [treatmentPlan])

  return (
    <ExportExcelButton
      data={exportData}
      isDisabled={_.isEmpty(exportData) || loading}
      filename={`${SOURCE}_Lives-${ treatmentPlanLabel }`}
      sheetName={'State Sheet'}
    >
      Export me
    </ExportExcelButton>
  )
}

export default ExportCombinedStateLivesButton

const getCombinedStateLivesExportData = (combinedStateLivesDoc, source, territoryType) => {
  const {
    statesData,
  } = combinedStateLivesDoc[`${ source }_${ territoryType }Data`]

  const allAccessValuesWithDupes = statesData.reduce((acc, { accessBuckets } ) => {
    const accessBucketValues = Object.keys(
      _.keyBy(accessBuckets, 'access')
    )

    acc = [
      ...acc,
      ...accessBucketValues,
    ]

    return acc
  }, [])

  const allAccessValuesUniq = _.uniq(allAccessValuesWithDupes)

  return statesData.map(({
    state,
    auditedLivesPercent,
    accessBuckets,
  }) => {
    const accessBucketsObj = accessBuckets
      .reduce((acc, { access, livesPercent }) => {
        acc[access] = percentFormatterTo1DecimalPlace(livesPercent)

        return acc
      }, {})

    allAccessValuesUniq.forEach(accessValue => {
      let datumAccessValue = accessBucketsObj[accessValue]

      if (!datumAccessValue) accessBucketsObj[accessValue] = '0.0%'
    })

    return {
      state,
      ...accessBucketsObj,
      'Not Audited': percentFormatterTo1DecimalPlace(1 - auditedLivesPercent),
    }
  })
}

export const percentageFormatter = (value, decimals = 0) => (
  // #toFixed may result in imperfect rounding,
  // example: 859.385 doesn't round correctly for two decimal places
  [undefined, null].includes(value) ? null : `${(value * 100).toFixed(decimals)}%`
)

const percentageFormatterToNDecimalPlaces = place => value => (
  percentageFormatter(value, place)
)

const percentFormatterTo1DecimalPlace = percentageFormatterToNDecimalPlaces(1)

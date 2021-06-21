import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import format from 'date-fns/format'

import { GET_MARKET_BASKET_SURVEY_EXPORT_DATA } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Icon from 'frontend/components/Icon'
import ExportExcelButton from 'frontend/components/ExportExcelButton'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

const Container = styled.div({
  width: '50%',
  padding: Spacing.S7,
  borderRight: `1px solid ${transparentize(0.9, Color.BLACK)}`,
})

export const TextSection = styled.p({
  padding: `${Spacing.S4} 0`,
  ...FontSpace.FS2,
})

const ExportSurveySection = ({ surveyId, marketBasketName, surveyDate }) => {
  const { data, loading } = useQuery(GET_MARKET_BASKET_SURVEY_EXPORT_DATA, {
    variables: { surveyId },
    fetchPolicy: 'network-only',
  })

  const exportData = data
    ? Object.values(data)[0].map(({ __typename, ...rest }) => rest)
    : []

  const filename = `${marketBasketName}_${surveyDate}_${format(
    new Date(),
    'P'
  )}`

  return (
    <Container>
      <h3>Export Survey</h3>
      <TextSection>
        Export the current survey. This will generate an Excel workbook file.
        The stakeholder survey response <b>ratings</b> can be edited in this
        file and then reimported through the import section to the right.
      </TextSection>
      <TextSection>
        IMPORTANT: You CANNOT change the Excel workbook filename, sheet (tab)
        names, add, edit, or remove stakeholders, categories, regimens, or
        columns within this file. Any edits to the survey should be made on
        POLARIS and then exported again to ensure accurate data structures
        within the tool.
      </TextSection>
      <ExportExcelButton
        filename={filename}
        data={exportData}
        buttonStyle={{
          margin: '0 0 12px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon
          iconName="export"
          color1={Color.PRIMARY}
          width={16}
          height={16}
          style={{ marginRight: 8 }}
        />
        {loading ? <Spinner /> : 'Export to Excel'}
      </ExportExcelButton>
    </Container>
  )
}

ExportSurveySection.propTypes = {
  surveyId: PropTypes.string.isRequired,
  marketBasketName: PropTypes.string.isRequired,
  surveyDate: PropTypes.string.isRequired,
}

export default ExportSurveySection

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import format from 'date-fns/format'

import { UnderlinedTabs, Tag } from '@pulse-analytics/pulse-design-system'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

import SurveyForms from './SurveyForms'

import {
  EDIT_SURVEY_TYPE,
  CREATE_STAKEHOLDER_TYPE,
  IMPORT_EXPORT_SURVEY_TYPE,
  StyledButton,
} from './SurveyForms/utils'

const Flex = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const SurveyHeader = ({
  date,
  setTabCategory,
  categories,
  selectedCategory,
  surveyId,
  setSurvey,
}) => {
  const [modalType, setModalType] = useState(null)
  const formattedDate = format(new Date(date), 'PP')
  const selectedTab = selectedCategory ? selectedCategory.value : ''

  return (
    <div>
      <Flex style={{ justifyContent: 'space-between', padding: 24 }}>
        <Flex>
          <h3>{formattedDate}</h3>
          <Tag
            color={Color.GRAY_DARK}
            style={{
              border: 'none',
              background: transparentize(0.85, Color.GRAY_DARK),
              padding: '2px 8px',
              textTransform: 'none',
              margin: '0 12px',
            }}
          >
            Market Basket
          </Tag>
        </Flex>
        <section>
          <StyledButton
            type="secondary"
            onClick={() => setModalType(EDIT_SURVEY_TYPE)}
          >
            Edit Survey
          </StyledButton>
          <StyledButton onClick={() => setModalType(CREATE_STAKEHOLDER_TYPE)}>
            + Add Stakeholder
          </StyledButton>
          <StyledButton
            type="secondary"
            onClick={() => setModalType(IMPORT_EXPORT_SURVEY_TYPE)}
          >
            Import/Export Survey Data
          </StyledButton>
        </section>
      </Flex>
      <Flex
        style={{
          borderBottom: `1px solid ${transparentize(0.9, Color.BLACK)}`,
          padding: '0px 24px',
          ...FontSpace.FS2,
        }}
      >
        <p style={{ fontWeight: 700, ...FontSpace.FS2 }}>Categories: </p>
        <UnderlinedTabs
          tabsData={categories}
          onTabClick={setTabCategory}
          selectedTab={selectedTab}
          activeTabStyle={{ color: Color.PRIMARY }}
          tabsContainerStyle={{
            padding: '0 12px',
          }}
        />
      </Flex>
      {modalType && (
        <SurveyForms
          modalType={modalType}
          closeHandler={() => setModalType(null)}
          surveyId={surveyId}
          surveyDate={formattedDate}
          setSurvey={setSurvey}
        />
      )}
    </div>
  )
}

SurveyHeader.propTypes = {
  date: PropTypes.string.isRequired,
  setTabCategory: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.object,
  surveyId: PropTypes.string.isRequired,
  setSurvey: PropTypes.func.isRequired,
}

SurveyHeader.defaultProps = {
  selectedCategory: null,
}

export default SurveyHeader

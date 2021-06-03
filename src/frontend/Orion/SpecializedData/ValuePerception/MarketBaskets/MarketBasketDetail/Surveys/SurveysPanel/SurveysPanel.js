import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import _ from 'lodash'

import { Button } from '@pulse-analytics/pulse-design-system'

import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

import CreateSurveyForm from './CreateSurveyForm'
import ListItem from './ListItem'

const Panel = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: 164,
  minWidth: 164,
  borderRight: `2px solid ${Color.GRAY_LIGHT}`,
  height: '100%',
  alignItems: 'center',
})

const SurveyItemList = styled.ul({
  listStyle: 'none',
  width: '100%',
})

const getSortedSurveys = (surveys) => _.orderBy(surveys, ['date'], ['desc'])

const SurveysPanel = ({
  marketBasketsSurveys,
  setSurvey,
  selectedSurveyId,
}) => {
  const [isModalOpen, setModal] = useState(false)
  const sortedSurveys = marketBasketsSurveys
    ? getSortedSurveys(marketBasketsSurveys)
    : []

  return (
    <Panel>
      <section style={{ padding: `${Spacing.S4} ${Spacing.S4} 0` }}>
        <Button
          onClick={() => setModal(true)}
          style={{
            width: 100,
            padding: '4px 8px',
            display: 'flex',
            justifyContent: 'center',
            ...FontSpace.FS2,
          }}
        >
          + New Survey
        </Button>
      </section>
      <SurveyItemList>
        {sortedSurveys.map((survey) => (
          <ListItem
            key={survey.id}
            survey={survey}
            setSurvey={setSurvey}
            selectedSurveyId={selectedSurveyId}
          />
        ))}
      </SurveyItemList>
      {isModalOpen && (
        <CreateSurveyForm
          closeModal={() => setModal(false)}
          marketBasketsSurveys={sortedSurveys}
          setSurvey={setSurvey}
        />
      )}
    </Panel>
  )
}

SurveysPanel.propTypes = {
  marketBasketsSurveys: PropTypes.array.isRequired,
  setSurvey: PropTypes.func.isRequired,
  selectedSurveyId: PropTypes.string,
}

SurveysPanel.defaultProps = {
  selectedSurveyId: null,
}

export default SurveysPanel

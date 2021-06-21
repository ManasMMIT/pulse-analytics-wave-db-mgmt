import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import EditSurveyForm from './EditSurveyForm'
import CreateStakeholderForm from './CreateStakeholderForm'
import ImportExportSurveyForm from './ImportExportSurveyForm'

import MarketBasketContext from '../../MarketBasketContext'
import {
  EDIT_SURVEY_TYPE,
  CREATE_STAKEHOLDER_TYPE,
  IMPORT_EXPORT_SURVEY_TYPE,
} from './utils'

const FORM_MAP = {
  [EDIT_SURVEY_TYPE]: EditSurveyForm,
  [CREATE_STAKEHOLDER_TYPE]: CreateStakeholderForm,
  [IMPORT_EXPORT_SURVEY_TYPE]: ImportExportSurveyForm,
}

const SurveyForms = ({
  modalType,
  closeHandler,
  surveyDate,
  surveyId,
  setSurvey,
}) => {
  const { marketBasketId, marketBasketName } = useContext(MarketBasketContext)

  const Component = FORM_MAP[modalType]

  return (
    <Component
      closeHandler={closeHandler}
      marketBasketId={marketBasketId}
      marketBasketName={marketBasketName}
      surveyDate={surveyDate}
      surveyId={surveyId}
      setSurvey={setSurvey}
    />
  )
}

SurveyForms.propTypes = {
  modalType: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default SurveyForms

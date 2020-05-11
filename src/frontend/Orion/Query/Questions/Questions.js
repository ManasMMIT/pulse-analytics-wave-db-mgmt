import React from 'react'

import queryString from 'query-string'

import {
  QuestionsPageContainer,
  PageHeaderContainer,
  PageHeader,
  PageDescription,
  QuestionsListContainer,
  QuestionButtonLinkContainer,
  QuestionButtonLink,
  QuestionArrow,
} from './styledQuestionComponents'

const QUESTION_CONFIGS = [
  {
    question: 'Which payers and providers participate in Oncology Care Model?',
    filters: {
      orgTypes: ['Payer', 'Provider'],
      selectedAccountId: '5d8252eccc80b15a9476ba27',
    }
  },
  {
    question: 'Which pathways are affiliated with Aetna?',
    filters: {
      orgTypes: ['Pathways'],
      selectedAccountId: '5d825030cc80b15a9476b813',
    }
  },
  {
    question: 'Which providers are participating in Via Oncology?',
    filters: {
      orgTypes: ['Provider'],
      selectedAccountId: '5d825338cc80b15a9476ba8a',
    }
  },
]

const Questions = () => {
  return (
    <QuestionsPageContainer>
      <PageHeaderContainer>
        <PageHeader>
          Suggested Query Questions
        </PageHeader>
        <PageDescription>
          Commonly asked questions that will pre-select different filters in the Query Tool.
          Select a question below to continue.
        </PageDescription>
      </PageHeaderContainer>
      <QuestionsListContainer>
        {
          QUESTION_CONFIGS.map(({ question, filters }) => {
            const searchQueryStrings = queryString.stringify(filters)

            return (
              <QuestionButtonLinkContainer key={question}>
                <QuestionButtonLink
                  to={`/orion/query/tool-demo?${ searchQueryStrings }`
                }>
                  <div>
                    {question}
                  </div>
                  <QuestionArrow>
                    ➔
                  </QuestionArrow>
                </QuestionButtonLink>
              </QuestionButtonLinkContainer>
            )
          })
        }
      </QuestionsListContainer>
    </QuestionsPageContainer>
  )
}

export default Questions

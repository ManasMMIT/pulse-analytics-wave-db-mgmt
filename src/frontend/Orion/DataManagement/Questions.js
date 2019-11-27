import React from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

const QUESTION_CONFIGS = [
  {
    question: 'What payers and providers participate in Oncology Care Model?',
    filters: {
      orgTypes: ['Payer', 'Provider'],
      selectedAccountId: '5d8252eccc80b15a9476ba27',
    }
  }
]

const Questions = () => {
  return (
    <div>
      {
        QUESTION_CONFIGS.map(({ question, filters }) => {
          const searchQueryStrings = queryString.stringify(filters)

          return (
            <Link
              key={question}
              to={`/orion/data-management/query?${ searchQueryStrings }`
            }>
              {question}
            </Link>
          )
        })
      }
    </div>
  )
}

export default Questions

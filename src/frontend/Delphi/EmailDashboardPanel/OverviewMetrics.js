import React, { useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import Chartjs from 'chart.js'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S7,
  background: Color.WHITE,
  color: Color.BLACK,
})

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const Title = styled.div({
  fontWeight: 700,
  ...FontSpace.FS4,
})

const lineLabels = [
  'delivered',
  'opens',
  'unique_opens',
  'unique_clicks',
  'blocks',
]

const OverviewMetrics = ({ overviewData }) => {
  const chartContainer = useRef(null)
  const { overviewMetrics } = overviewData
  const dates = overviewMetrics.map(({ date }) => date)
  const aggDataSet = overviewMetrics.reduce((acc, { stats }) => {
    const { metrics } = stats[0]
    lineLabels.forEach(key => {
      if (acc[key]) {
        acc[key] = acc[key].concat([metrics[key]])
      } else {
        acc[key] = [metrics[key]]
      }
    })
    return acc
  }, {})

  const chartConfig = {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          data: aggDataSet['delivered'],
          label: 'Delivered',
          borderColor: '#3e95cd',
          fill: false,
        },
        {
          data: aggDataSet['opens'],
          label: 'Opens',
          borderColor: '#8e5ea2',
          fill: false,
        },
        {
          data: aggDataSet['unique_opens'],
          label: 'Unique Opens',
          borderColor: '#3cba9f',
          fill: false,
        },
        {
          data: aggDataSet['unique_clicks'],
          label: 'Unique Clicks',
          borderColor: '#e8c3b9',
          fill: false,
        },
        {
          data: aggDataSet['blocks'],
          label: 'Blocked',
          borderColor: '#c45850',
          fill: false,
        },
      ],
    },
  }

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      new Chartjs(chartContainer.current, chartConfig)
    }
  }, [chartContainer]) //eslint-disable-line

  return (
    <Wrapper>
      <Header>
        <Title>Overview Metrics: Past 6 Months</Title>
      </Header>
      <canvas ref={chartContainer} />
    </Wrapper>
  )
}

export default OverviewMetrics

// copy of data
// {
//   "overviewMetrics": [
//     {
//       "date": "2019-12-01",
//       "stats": [
//         {
//           "metrics": {
//             "blocks": 36,
//             "bounce_drops": 0,
//             "bounces": 0,
//             "clicks": 111,
//             "deferred": 146,
//             "delivered": 284,
//             "invalid_emails": 0,
//             "opens": 225,
//             "processed": 320,
//             "requests": 320,
//             "spam_report_drops": 0,
//             "spam_reports": 0,
//             "unique_clicks": 29,
//             "unique_opens": 57,
//             "unsubscribe_drops": 0,
//             "unsubscribes": 0
//           }
//         }
//       ]
//     },
//     {
//       "date": "2020-01-01",
//       "stats": [
//         {
//           "metrics": {
//             "blocks": 49,
//             "bounce_drops": 0,
//             "bounces": 0,
//             "clicks": 913,
//             "deferred": 70,
//             "delivered": 380,
//             "invalid_emails": 1,
//             "opens": 467,
//             "processed": 429,
//             "requests": 430,
//             "spam_report_drops": 0,
//             "spam_reports": 0,
//             "unique_clicks": 84,
//             "unique_opens": 92,
//             "unsubscribe_drops": 0,
//             "unsubscribes": 0
//           }
//         }
//       ]
//     },
//     {
//       "date": "2020-02-01",
//       "stats": [
//         {
//           "metrics": {
//             "blocks": 7,
//             "bounce_drops": 0,
//             "bounces": 0,
//             "clicks": 1890,
//             "deferred": 43,
//             "delivered": 230,
//             "invalid_emails": 0,
//             "opens": 259,
//             "processed": 237,
//             "requests": 237,
//             "spam_report_drops": 0,
//             "spam_reports": 0,
//             "unique_clicks": 80,
//             "unique_opens": 66,
//             "unsubscribe_drops": 0,
//             "unsubscribes": 0
//           }
//         }
//       ]
//     },
//     {
//       "date": "2020-03-01",
//       "stats": [
//         {
//           "metrics": {
//             "blocks": 6,
//             "bounce_drops": 0,
//             "bounces": 0,
//             "clicks": 368,
//             "deferred": 50,
//             "delivered": 174,
//             "invalid_emails": 0,
//             "opens": 172,
//             "processed": 180,
//             "requests": 180,
//             "spam_report_drops": 0,
//             "spam_reports": 0,
//             "unique_clicks": 30,
//             "unique_opens": 61,
//             "unsubscribe_drops": 0,
//             "unsubscribes": 0
//           }
//         }
//       ]
//     },
//     {
//       "date": "2020-04-01",
//       "stats": [
//         {
//           "metrics": {
//             "blocks": 18,
//             "bounce_drops": 0,
//             "bounces": 0,
//             "clicks": 81,
//             "deferred": 28,
//             "delivered": 235,
//             "invalid_emails": 0,
//             "opens": 161,
//             "processed": 252,
//             "requests": 252,
//             "spam_report_drops": 0,
//             "spam_reports": 0,
//             "unique_clicks": 21,
//             "unique_opens": 77,
//             "unsubscribe_drops": 0,
//             "unsubscribes": 0
//           }
//         }
//       ]
//     },
//     {
//       "date": "2020-05-01",
//       "stats": [
//         {
//           "metrics": {
//             "blocks": 56,
//             "bounce_drops": 0,
//             "bounces": 0,
//             "clicks": 31,
//             "deferred": 65,
//             "delivered": 187,
//             "invalid_emails": 0,
//             "opens": 116,
//             "processed": 241,
//             "requests": 241,
//             "spam_report_drops": 0,
//             "spam_reports": 0,
//             "unique_clicks": 14,
//             "unique_opens": 52,
//             "unsubscribe_drops": 0,
//             "unsubscribes": 0
//           }
//         }
//       ]
//     },
//     {
//       "date": "2020-06-01",
//       "stats": [
//         {
//           "metrics": {
//             "blocks": 11,
//             "bounce_drops": 0,
//             "bounces": 0,
//             "clicks": 30,
//             "deferred": 106,
//             "delivered": 132,
//             "invalid_emails": 0,
//             "opens": 194,
//             "processed": 142,
//             "requests": 142,
//             "spam_report_drops": 0,
//             "spam_reports": 0,
//             "unique_clicks": 9,
//             "unique_opens": 37,
//             "unsubscribe_drops": 0,
//             "unsubscribes": 0
//           }
//         }
//       ]
//     }
//   ]
// }

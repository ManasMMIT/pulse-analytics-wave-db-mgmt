import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import Select from 'react-select'
import Chartjs from 'chart.js'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S7,
  background: Color.WHITE,
  color: Color.BLACK,
  maxHeight: 500,
})

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const Title = styled.div({
  fontWeight: 700,
  ...FontSpace.FS4,
})

const formatOption = option => ({ label: option, value: option })

const DeviceMetric = ({ chartData }) => {
  const { emailDeviceMetrics } = chartData
  const initialDate = Object.keys(emailDeviceMetrics)[0]
  const [selectedMonth, setMonth] = useState(initialDate)
  const chartContainer = useRef(null)
  const [chartInstance, setChartInstance] = useState(null)

  const monthData = emailDeviceMetrics[selectedMonth]
  const chartConfig = {
    type: 'polarArea',
    data: {
      labels: Object.keys(monthData),
      datasets: [
        {
          data: Object.values(monthData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  }

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig)
      setChartInstance(newChartInstance)
    }
  }, [chartContainer]) //eslint-disable-line

  const filterHandler = props => {
    const newData = Object.values(emailDeviceMetrics[props.value])
    chartInstance.data.datasets[0].data = newData
    chartInstance.update()
    setMonth(props.value)
  }

  const selectOptions = Object.keys(emailDeviceMetrics).map(formatOption)

  const selectedOption = formatOption(selectedMonth)

  return (
    <Wrapper>
      <Header>
        <Title>Device Metrics: {selectedMonth}</Title>
        <div style={{ width: 250 }}>
          <Select
            options={selectOptions}
            value={selectedOption}
            onChange={filterHandler}
          />
        </div>
      </Header>
      <canvas ref={chartContainer} height="100" />
    </Wrapper>
  )
}

export default DeviceMetric

import React from 'react'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import Title from '../../../Title/Title'

const wrapperStyle = {
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
}

const gridWrapperStyle = {
  padding: Spacing.S4,
  display: 'grid',
  gridTemplateColumns: '25% 25% 25% 25%',
}

const InputComponent = styled.input({
  background: Color.WHITE,
  width: '100%',
  padding: `${Spacing.S3}`,
  borderRadius: 4,
  ...FontSpace.FS2,
})

const DataSections = ({ title, data }) => {
  return (
    <div
      style={{
        width: '100%',
        margin: 24,
      }}
    >
      {data.map((datum) => {
        return (
          <div style={wrapperStyle}>
            <Title
              titleStyle={{
                borderBottom: `1px solid ${Color.LIGHT_BLUE_GRAY_1}`,
              }}
              title={datum.organization}
              size={'FS3'}
            />
            <div style={gridWrapperStyle}>
              {Object.keys(datum).map((key) => {
                return (
                  <div style={{ padding: 12 }}>
                    <div
                      style={{ fontSize: 12, lineHeight: 3, fontWeight: 600 }}
                    >
                      {key}
                    </div>
                    <InputComponent type="text" disabled value={datum[key]} />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DataSections

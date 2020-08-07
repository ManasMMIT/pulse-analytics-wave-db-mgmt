import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import _ from 'lodash'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import Title from '../../../Title/Title'
import NoDataPlaceholder from 'frontend/components/NoDataPlaceholder'

const wrapperStyle = {
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
}

const gridWrapperStyle = {
  display: 'grid',
  gridTemplateColumns: '25% 25% 25% 25%',
  padding: Spacing.S3,
}

const InputComponent = styled.input({
  background: Color.WHITE,
  width: '100%',
  padding: `${Spacing.S3}`,
  borderRadius: 4,
  ...FontSpace.FS2,
  ':disabled': {
    cursor: 'not-allowed',
  },
})

const InputLabel = styled.div({
  color: Color.BLACK,
  fontSize: 12,
  lineHeight: 1.5,
  marginBottom: Spacing.S3,
  fontWeight: 700,
  opacity: 0.7,
})

const DataSections = ({ data }) => {
  if (_.isEmpty(data)) return <NoDataPlaceholder />

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
                borderBottom: `1px solid ${transparentize(0.92, Color.BLACK)}`,
                textTransform: 'none',
                paddingLeft: Spacing.S5,
              }}
              title={datum.organization}
              size={'FS3'}
            />
            <div style={gridWrapperStyle}>
              {Object.keys(datum).map((key) => {
                return (
                  <div style={{ padding: 12 }}>
                    <InputLabel>{key}</InputLabel>
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

import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import { ListHeader } from '../../../../../Administrator/ListsConfigManagement/shared/styledComponents'

const ListTitle = styled.p({
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: -0.2,
  lineHeight: '18px',
})

const PanelHeader = ({ title, handleCreate }) => (
  <ListHeader>
    <ListTitle>{title}</ListTitle>
    <Button
      onClick={handleCreate}
      type="secondary"
      style={{ padding: '6px 12px', fontSize: 16 }}
    >
      +
    </Button>
  </ListHeader>
)

PanelHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleCreate: PropTypes.func.isRequired,
}

export default PanelHeader

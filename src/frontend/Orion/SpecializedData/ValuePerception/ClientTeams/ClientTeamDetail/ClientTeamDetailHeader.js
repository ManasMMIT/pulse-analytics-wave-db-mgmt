import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Button, Tag } from '@pulse-analytics/pulse-design-system'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

const TitleSection = styled.div({
  display: 'flex',
  padding: '24px 12px 0px',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const ClientTeamDetailHeader = ({ name }) => {
  return (
    <TitleSection>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/orion/specialized/value-perception/client-teams">
          <Button
            type="secondary"
            style={{
              fontFamily: 'inherit',
              margin: 12,
              padding: '0 6px',
            }}
          >
            <Icon
              iconName="arrow-drop-left"
              color1={Color.PRIMARY}
              width={16}
            />
            All Client Teams
          </Button>
        </Link>
        <h2 style={{ padding: '0 12px' }}>{name}</h2>
        <Tag
          color={Color.GRAY_DARK}
          style={{
            border: 'none',
            background: transparentize(0.85, Color.GRAY_DARK),
            padding: '2px 8px',
            textTransform: 'none',
          }}
        >
          Client Team
        </Tag>
      </div>
    </TitleSection>
  )
}

export default ClientTeamDetailHeader

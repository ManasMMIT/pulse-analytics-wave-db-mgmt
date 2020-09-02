import React from 'react'

import Color from 'frontend/utils/color'
import Icon from 'frontend/components/Icon'

import { useAuth0 } from '../../react-auth0-spa'

import ToolCard from './ToolCard'

const ICON_SIZE = 24

const TOOL_CARD_CONFIGS = [
  {
    title: 'Phoenix',
    description: 'User Management and Tool Permissions',
    to: '/phoenix',
    iconId: 'phoenix-1-white',
    iconColor: Color.PHOENIX,
  },
  {
    title: 'Orion',
    description: 'Import Sheets and Tool Data Management',
    to: '/orion',
    iconId: 'orion-1-white',
    iconColor: Color.ORION,
  },
  {
    title: 'Payer Projects',
    description: 'Import Payer Historical data',
    to: '/payer-projects',
    iconId: 'payer-1-white',
    iconColor: Color.PAYER_PROJECTS,
  },
  {
    title: 'Delphi',
    description: 'Email Alert Service',
    to: '/delphi',
    iconId: 'mercury-1-white',
    iconColor: Color.DELPHI,
  },
]

const toolCards = TOOL_CARD_CONFIGS.map((config) => <ToolCard {...config} />)

const Home = () => {
  const { loading, user } = useAuth0()

  if (loading) return null

  return (
    <div style={{ background: Color.MAIN_BACKGROUND, width: '100%' }}>
      <div style={{ padding: '36px 48px' }}>
        <div style={{ marginBottom: 36, padding: '0 12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon
              width={ICON_SIZE}
              height={ICON_SIZE}
              iconName="polaris-1-color"
            />
            <span
              style={{
                color: Color.PRIMARY,
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1,
                marginLeft: 6,
              }}
            >
              POLARIS
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              opacity: 0.7,
              color: Color.BLACK,
              marginTop: 8,
            }}
          >
            Internal TDG and PULSE Tools for managing data and Pulse Analytics
            tool access
          </div>
        </div>
        <div
          style={{
            padding: 12,
            fontSize: 20,
            marginBottom: 24,
            color: Color.BLACK,
            fontWeight: 500,
          }}
        >
          Hello {user.name}
        </div>
        <div style={{ display: 'flex' }}>{toolCards}</div>
      </div>
    </div>
  )
}

export default Home

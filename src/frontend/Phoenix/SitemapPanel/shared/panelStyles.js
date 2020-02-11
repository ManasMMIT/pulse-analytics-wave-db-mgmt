import { transparentize } from 'polished'

import { Colors, Spacing } from '../../../utils/pulseStyles'

// Panel Container Style
export const defaultPanelStyle = {
  borderRight: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  minHeight: 'auto',
  maxHeight: 'auto',
  height: 'auto',
}

// Inactive Row Style
export const panelItemStyle = {
  alignItems: 'center',
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  borderRadius: 4,
  color: Colors.BLACK,
  cursor: 'pointer',
  display: 'flex',
  fontSize: 12,
  fontWeight: 600,
  justifyContent: 'space-between',
  padding: Spacing.NORMAL,
  margin: Spacing.NORMAL,
}

// Active (Selected) Row Style
export const panelItemActiveStyle = {
  backgroundColor: transparentize(0.9, Colors.PRIMARY),
  color: Colors.PRIMARY,
}

// Panel Header Container Style
export const panelHeaderStyle = {
  height: 60,
  background: Colors.WHITE,
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
}

// Panel Title Text Style
export const panelTitleStyle = {
  color: Colors.BLACK,
  fontSize: 14,
  fontWeight: 600,
}

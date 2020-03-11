import { transparentize } from 'polished'

export const Colors = {
  PRIMARY: '#0668D9',
  BLACK: '#0A2E4D',
  WHITE: '#FFFFFF',
  GREEN: '#22BF6B',
  RED: '#EE5340',
  BLUE: '#0668D9',
  ORANGE: '#FD9651',
  YELLOW: '#FFDC6C',
  PURPLE: '#7C5EFA',
  LIGHT_GRAY_1: '#DFE3EA',
  LIGHT_BLUE_GRAY_2: '#EEF4FA',
  MEDIUM_GRAY_2: '#A3BBDA',
  TOOL_SIDEBAR: '#093357',
  PHOENIX: '#FA8969',
  ORION: '#38B59A',
  DELPHI: '#30B2DC',
  APP_BACKGROUND: '#E8EBEC',
}

export const AlphaColors = {
  Black90: transparentize(0.1, Colors.BLACK),
  Black80: transparentize(0.2, Colors.BLACK),
  Black70: transparentize(0.3, Colors.BLACK),
  Black60: transparentize(0.4, Colors.BLACK),
  Black50: transparentize(0.5, Colors.BLACK),
  Black40: transparentize(0.6, Colors.BLACK),
  Black30: transparentize(0.7, Colors.BLACK),
  Black25: transparentize(0.75, Colors.BLACK),
  Black20: transparentize(0.8, Colors.BLACK),
  Black15: transparentize(0.85, Colors.BLACK),
  Black10: transparentize(0.9, Colors.BLACK),
  Black8: transparentize(0.92, Colors.BLACK),
  Black7: transparentize(0.93, Colors.BLACK),
  Black5: transparentize(0.95, Colors.BLACK),
  Blue90: transparentize(0.1, Colors.BLUE),
  Blue80: transparentize(0.2, Colors.BLUE),
  Blue70: transparentize(0.3, Colors.BLUE),
  Blue60: transparentize(0.4, Colors.BLUE),
  Blue50: transparentize(0.5, Colors.BLUE),
  Blue40: transparentize(0.6, Colors.BLUE),
  Blue30: transparentize(0.7, Colors.BLUE),
  Blue20: transparentize(0.8, Colors.BLUE),
  Blue15: transparentize(0.85, Colors.BLUE),
  Blue10: transparentize(0.9, Colors.BLUE),
  White10: transparentize(0.9, Colors.WHITE),
  White20: transparentize(0.8, Colors.WHITE),
  White30: transparentize(0.7, Colors.WHITE),
  White40: transparentize(0.6, Colors.WHITE),
  White50: transparentize(0.5, Colors.WHITE),
  White60: transparentize(0.4, Colors.WHITE),
  White70: transparentize(0.3, Colors.WHITE),
  White80: transparentize(0.2, Colors.WHITE),
  White90: transparentize(0.1, Colors.WHITE)
}

export const mediaQueries = {
  tablet: '@media only screen and (max-width: 1030px)',
  phone: '@media only screen and (max-width: 500px)',
}

export const Transitions = {
  NORMAL: '250ms ease',
}

export const ZIndexes = {
  MODAL: 1000,
  PANEL_HEADER: 100,
  QUERY_CONTROLS: 1000,
}

export const Spacing = {
  MICRO: '2px',
  TINY: '4px',
  SMALL: '8px',
  NORMAL: '12px',
  MEDIUM: '16px',
  LARGE: '20px',
  EXTRA_LARGE: '24px',
  HUGE: '32px',
  MAX: '48px',
  TOOL_SIDEBAR: '256px',
}

export const FontFamily = {
  NORMAL: 'IBM Plex Sans'
}

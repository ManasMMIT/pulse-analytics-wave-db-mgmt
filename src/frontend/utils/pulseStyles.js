import { transparentize } from 'polished'

export const DataColorsPrimary = {
  PURPLE: '#673AB7',
  DARK_BLUE: '#0B55AE',
  BLUE: '#4A90E2',
  TEAL: '#40CCD4',
  GREEN: '#5CD285',
  ORANGE: '#FFB17D',
  RED: '#EE5340',
  MEDIUM_GRAY: '#BAC7D8',
}

export const Colors = {
  PRIMARY: '#0668D9',
  BLACK: '#0A2E4D',
  WHITE: '#FFFFFF',
  GREEN: '#22BF6B',
  RED: '#EE5340',
  ORANGE: '#FD9651',
  YELLOW: '#FFDC6C',
  PURPLE: '#7C5EFA',
  MEDIUM_GRAY_2: '#A3BBDA',
  TOOL_SIDEBAR: '#093357',
  PHOENIX: '#FA8969',
  ORION: '#38B59A',
  DELPHI: '#30B2DC',
  AppBackground: '#E8EBEC',
  AdminTeal: '#65B69A',
  Black: '#0E2539',
  BlueGray2: '#E5EBF0',
  BlueGray: '#F6F8F9',
  LightBlueGray: '#D6E2EB',
  LightBlueGray2: '#B4C4D2',
  LightGray1: '#F7F9FA',
  LightGray2: '#E8EBEC',
  LightGray3: '#F8F9FA',
  LightGray4: '#E3E6E9',
  LightGray5: '#ECEFF2',
  LightGray: '#C9CBCC',
  MediumBlueGray: '#849CB2',
  OffWhite: '#F5F7F7',
  PulseBlue: '#1674C7',
  DarkBlue: '#004996',
  SystemBlue: '#1483E6',
  SystemGreen: '#22BF6B',
  SystemOrange: '#FD9651',
  SystemRed: '#EE5340',
  White: '#FFFFFF'
}

export const TransColors = {
  Black90: transparentize(0.1, Colors.Black),
  Black80: transparentize(0.2, Colors.Black),
  Black70: transparentize(0.3, Colors.Black),
  Black60: transparentize(0.4, Colors.Black),
  Black50: transparentize(0.5, Colors.Black),
  Black40: transparentize(0.6, Colors.Black),
  Black30: transparentize(0.7, Colors.Black),
  Black25: transparentize(0.75, Colors.Black),
  Black20: transparentize(0.8, Colors.Black),
  Black15: transparentize(0.85, Colors.Black),
  Black10: transparentize(0.9, Colors.Black),
  Black8: transparentize(0.92, Colors.Black),
  Black7: transparentize(0.93, Colors.Black),
  Black5: transparentize(0.95, Colors.Black),
  Blue90: transparentize(0.1, Colors.PulseBlue),
  Blue80: transparentize(0.2, Colors.PulseBlue),
  Blue70: transparentize(0.3, Colors.PulseBlue),
  Blue60: transparentize(0.4, Colors.PulseBlue),
  Blue50: transparentize(0.5, Colors.PulseBlue),
  Blue40: transparentize(0.6, Colors.PulseBlue),
  Blue30: transparentize(0.7, Colors.PulseBlue),
  Blue20: transparentize(0.8, Colors.PulseBlue),
  Blue15: transparentize(0.85, Colors.PulseBlue),
  Blue10: transparentize(0.9, Colors.PulseBlue),
  White10: transparentize(0.9, Colors.White),
  White20: transparentize(0.8, Colors.White),
  White30: transparentize(0.7, Colors.White),
  White40: transparentize(0.6, Colors.White),
  White50: transparentize(0.5, Colors.White),
  White60: transparentize(0.4, Colors.White),
  White70: transparentize(0.3, Colors.White),
  White80: transparentize(0.2, Colors.White),
  White90: transparentize(0.1, Colors.White)
}

export const Fonts = {
  Primary: '"Gotham SSm A","Gotham SSm B", Arial, san-serif', // fallbacks of arial and san-serif
  Mono: 'Mono'
}

export const Gradients = {
  BlueGreen: 'linear-gradient(-180deg, #1674C7 0%, #06E8DD 100%)',
  BlueDarkPurple: 'linear-gradient(-180deg, #1674C7 0%, #003382 100%)'
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
}

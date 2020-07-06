import styled from '@emotion/styled'
import { transparentize, mix } from 'polished'

import Color from 'frontend/utils/color'

// ! BASELINE STYLING FROM SAMPLE: https://codesandbox.io/s/sweet-cori-gl81g?file=/src/App.js
// ! STYLING WAS THEN EDITED TO FIT PULSE NEEDS

const borderColor = Color.LIGHT_GRAY_1

const TableWrapper = styled.div`
  flex: 0 1 auto;
  overflow: auto;
  display: flex;
  height: 100%;

  .td.clickable-cell {
    cursor: pointer;
    font-weight: 500;
    :hover {
      color: ${mix(0.15, Color.BLACK, Color.BLUE)};
      background: ${transparentize(0.85, Color.BLUE)} !important;
    }
  }

  padding: 0;

  .table {
    /* border: 1px solid ${borderColor}; */
    border-top: 1px solid ${borderColor};
    border-bottom: 1px solid ${borderColor};

    .tr {
      :last-child {
        .td {
          border-bottom: 1px solid ${borderColor};
        }
      }
    }

    .th,
    .td {
      border-bottom: 1px solid ${borderColor};
      border-right: 1px solid ${transparentize(0.5, borderColor)};
      overflow: hidden;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    /* PULSE OVERRIDE ON HEADERS TO ALLOW REACT-SELECT DROPDOWNS TO SHOW */
    .th {
      overflow: visible;
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        top: 0;
        box-shadow: 0px 2px 0px ${borderColor};
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -2px 0px ${borderColor};
      }

      .body {
        position: relative;
        z-index: 0;
      }

      .tr:hover {
        [data-sticky-td] {
          background-color: ${mix(0.5, Color.WHITE, Color.LIGHT_GRAY_1)} !important;
        }
        .th {
          background-color: ${Color.WHITE} !important;
        }
      }

      [data-sticky-td] {
        position: sticky;
        background-color: ${Color.WHITE} !important;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 0px ${borderColor};
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 0px ${borderColor};
      }
    }
  }
`

export default TableWrapper

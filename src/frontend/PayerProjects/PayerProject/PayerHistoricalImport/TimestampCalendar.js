import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { MuiPickersUtilsProvider, Calendar } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'

import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'
import {
  formatDayMonthYearShort,
} from 'frontend/utils/formatDate'

const CalendarWrapper = styled.div({
  padding: Spacing.S4
})

const DayWrapper = styled.div({
  textDecoration: 'underline',
  fontWeight: 700,
  color: Color.PRIMARY
})

const datePickerTheme = createMuiTheme({
  palette: {
    primary: {
      main: Color.PRIMARY
    }
  },
  overrides: {
    MuiPickersCalendarHeader: {
      daysHeader: {
        justifyContent: 'space-between'
      }
    },
    MuiPickersCalendar: {
      week: {
        justifyContent: 'space-between'
      }
    },
    MuiIconButton: {
      root: {
        color: 'inherit'
      }
    },
    MuiButtonBase: {
      root: {
        color: 'inherit'
      }
    },
    MuiPickersDay: {
      day: {
        color: 'inherit'
      }
    },
    MuiTypography: {
      body2: {
        fontWeight: 'inherit'
      }
    }
  }
})

const TimestampCalendar = ({ timestamps }) => {
  return (
    <CalendarWrapper>
      <ThemeProvider theme={datePickerTheme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Calendar
            date={new Date()}
            onChange={() => {}}
            renderDay={(
              date,
              selectedDate,
              dayInCurrentMonth,
              dayComponent
            ) => {
              const formattedDate = formatDayMonthYearShort(date)
              if (timestamps.includes(formattedDate)) {
                return <DayWrapper>{dayComponent}</DayWrapper>
              }
              return dayComponent
            }}
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </CalendarWrapper>
  )
}

TimestampCalendar.propTypes = {
  timestamps: PropTypes.array.isRequired
}

export default TimestampCalendar

import queryString from 'query-string'

export const getSelectedDashboardTool = (location) =>
  ((location.search && queryString.parse(location.search)) || {}).dashboardTool

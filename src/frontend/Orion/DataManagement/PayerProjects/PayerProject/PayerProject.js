import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Route, Switch } from 'react-router-dom'

import PayerProjectSidebar from './PayerProjectSidebar'
import PayerHistoricalImport from './PayerHistoricalImport'
import PayerProjectTreatmentPlan from './PayerProjectTreatmentPlan'
import PayerProjectSetup from '../PayerProjectSetup'

const sidebarConfig = [
  { label: 'Import Historical Data', component: PayerHistoricalImport },
  { label: 'Project Setup', component: PayerProjectSetup },
  {
    label: 'Payer Project Treatment Plan',
    component: PayerProjectTreatmentPlan,
  },
].map(({ ...item }) => ({
  ...item,
  link: _.kebabCase(item.label),
}))

const generateRoutes = matchPath => ({ label, link, component }) => (
  <Route
    key={`route-${label}`}
    path={`${matchPath}/${link}`}
    component={component}
  />
)

const PayerProject = ({ match, location }) => {
  const { path } = match

  return (
    <>
      <PayerProjectSidebar
        match={match}
        location={location}
        sidebarConfig={sidebarConfig}
      />
      <Switch>{sidebarConfig.map(generateRoutes(path))}</Switch>
    </>
  )
}

PayerProject.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PayerProject

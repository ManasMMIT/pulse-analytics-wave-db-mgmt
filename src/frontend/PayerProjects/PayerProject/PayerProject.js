import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks'

import { Route, Switch } from 'react-router-dom'

import PayerProjectSidebar from './PayerProjectSidebar'
import PayerHistoricalImport from './PayerHistoricalImport'
import PayerProjectTreatmentPlan from './PayerProjectTreatmentPlan'
import PayerProjectSetup from '../PayerProjectSetup'
import { GET_SINGLE_PAYER_PROJECT } from 'frontend/api/queries'

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

const generateRoutes = (matchPath, projectName) => ({ label, link, component: Component }) => (
  <Route
    key={`route-${label}`}
    path={`${matchPath}/${link}`}
    component={(routeProps) => <Component {...routeProps} projectName={projectName} />}
  />
)

const PayerProject = ({ match, location }) => {
  const { path } = match
  const { data, loading } = useQuery(
    GET_SINGLE_PAYER_PROJECT,
    { variables: { projectId: match.params.projectId }}
  )

  const projectName = loading ? '' : data.singlePayerProject.name

  return (
    <>
      <PayerProjectSidebar
        match={match}
        location={location}
        sidebarConfig={sidebarConfig}
        projectName={projectName}
      />
      <Switch>{sidebarConfig.map(generateRoutes(path, projectName))}</Switch>
    </>
  )
}

PayerProject.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PayerProject

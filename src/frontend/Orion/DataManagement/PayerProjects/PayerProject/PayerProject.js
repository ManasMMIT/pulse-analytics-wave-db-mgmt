import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  Route,
  Switch,
} from 'react-router-dom'

import PayerProjectSidebar from './PayerProjectSidebar'
import PayerHistoricalImport from './PayerHistoricalImport'

const sidebarConfig = [
  { label: 'Import Historical Data', component: PayerHistoricalImport },
  { label: 'Project Setup', component: () => <div>Project Setup</div> },
  { label: 'Payer Project Treatment Plan', component: () => <div>Payer Project Treatment Plan</div> },
].map(({ ...item }) => ({
  ...item,
  link: _.kebabCase(item.label)
}))

const generateRoutes = matchUrl => ({ label, link, component }) => (
  <Route
    key={`route-${ label }`}
    path={`${ matchUrl }/${ link }`}
    component={component}
  />
)

const PayerProject = ({
  match,
  location
}) => {
  const { url } = match

  return (
    <>
      <PayerProjectSidebar
        match={match}
        location={location}
        sidebarConfig={sidebarConfig}
      />
      <Switch>
        { sidebarConfig.map(generateRoutes(url)) }
      </Switch>
    </>
  )
}

PayerProject.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PayerProject
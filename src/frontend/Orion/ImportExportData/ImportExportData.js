import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import NewImport from './NewImport'
import ExportCustomData from './ExportCustomData'
import ExportCustomPowerPoint from './ExportCustomPowerPoint'

const ImportExport = () => (
  <Switch>
    <Route path="/orion/import-export/import-sheets" component={NewImport} />
    <Route
      path="/orion/import-export/export/export-custom-data"
      component={ExportCustomData}
    />
    <Route
      path="/orion/import-export/export/export-custom-powerpoint"
      component={ExportCustomPowerPoint}
    />
    <Redirect to="/orion/import-export/import-sheets" />
  </Switch>
)

export default ImportExport

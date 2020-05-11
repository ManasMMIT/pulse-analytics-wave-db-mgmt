import React from "react"
import { Route, Switch, Redirect } from 'react-router-dom'

import NewImport from './NewImport'
import ExportCustomData from './ExportCustomData'

const Excel = () => (
  <Switch>
    <Route path="/orion/excel/import-sheets" component={NewImport} />
    <Route path="/orion/excel/export-custom-data" component={ExportCustomData} />
    <Redirect to="/orion/excel/import-sheets" />
  </Switch>
)

export default Excel

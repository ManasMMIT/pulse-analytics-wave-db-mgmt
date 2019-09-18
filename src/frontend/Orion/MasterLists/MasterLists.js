import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import IndicationsPanel from './IndicationsPanel'
import ProductsPanel from './ProductsPanel'
import RegimensPanel from './RegimensPanel'
import TreatmentPlans from './TreatmentPlans'

const MasterLists = () => (
  <Switch>
    <Route path={'/orion/lists/treatment-plans'} component={TreatmentPlans} />
    <Route path={'/orion/lists/indications'} component={IndicationsPanel} />
    <Route path={'/orion/lists/regimens'} component={RegimensPanel} />
    <Route path={'/orion/lists/products'} component={ProductsPanel} />
    <Redirect to={'/orion/lists/treatment-plans'} component={TreatmentPlans} />
  </Switch>
)

export default MasterLists

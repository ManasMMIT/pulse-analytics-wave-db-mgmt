import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import IndicationsPanel from './IndicationsPanel'
import LinesPanel from './LinesPanel'
import ProductsPanel from './ProductsPanel'
import RegimensPanel from './RegimensPanel'
import TreatmentPlans from './TreatmentPlans'
import Tools from './Tools'

const MasterLists = () => (
  <Switch>
    <Route path={'/orion/lists/treatment-plans'} component={TreatmentPlans} />
    <Route path={'/orion/lists/indications'} component={IndicationsPanel} />
    <Route path={'/orion/lists/lines'} component={LinesPanel} />
    <Route path={'/orion/lists/regimens'} component={RegimensPanel} />
    <Route path={'/orion/lists/products'} component={ProductsPanel} />
    <Route path={'/orion/lists/tools'} component={Tools} />
    <Redirect to={'/orion/lists/treatment-plans'} component={TreatmentPlans} />
  </Switch>
)

export default MasterLists

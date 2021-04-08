import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Products from './ProductsPanel'
import People from './People'
import UsStates from './UsStates'
import TreatmentPlans from './TreatmentPlans'

const GeneralData = () => (
  <Switch>
    <Route path={'/orion/general/products'} component={Products} />
    <Route path={'/orion/general/people'} component={People} />
    <Route path={'/orion/general/us-states'} component={UsStates} />
    <Route path={'/orion/general/treatment-plans'} component={TreatmentPlans} />
    <Redirect to={'/orion/general/products'} />
  </Switch>
)

export default GeneralData

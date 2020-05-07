import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import PhoenixTreatmentPlans from './PhoenixTreatmentPlans'
import IndicationsPanel from './IndicationsPanel'
import RegimensPanel from './RegimensPanel'
import ProductsPanel from './ProductsPanel'
import LinesPanel from './LinesPanel'

const ProductsIndications = () => (
  <Switch>
    <Route
      path={'/orion/configuration/products-indications/phoenix-treatment-plans'}
      component={PhoenixTreatmentPlans}
    />
    <Route
      path={'/orion/configuration/products-indications/indications'}
      component={IndicationsPanel}
    />
    <Route
      path={'/orion/configuration/products-indications/regimens'}
      component={RegimensPanel}
    />
    <Route
      path={'/orion/configuration/products-indications/products'}
      component={ProductsPanel}
    />
    <Route
      path={'/orion/configuration/products-indications/lines'}
      component={LinesPanel}
    />
    <Redirect to={'/orion/configuration/products-indications/phoenix-treatment-plans'} />
  </Switch>
)

export default ProductsIndications

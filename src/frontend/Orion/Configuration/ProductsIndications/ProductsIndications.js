import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import PhoenixTreatmentPlans from './PhoenixTreatmentPlans'
import TreatmentPlansPanel from './TreatmentPlansPanel'
import IndicationsPanel from './IndicationsPanel'
import TherapeuticAreas from './TherapeuticAreas'
import RegimensPanel from './RegimensPanel'
import ProductsPanel from './ProductsPanel'
import CoveragesPanel from './CoveragesPanel'
import SubtypesPanel from './SubtypesPanel'
import LinesPanel from './LinesPanel'

const ProductsIndications = () => (
  <Switch>
    <Route
      path={'/orion/configuration/products-indications/phoenix-treatment-plans'}
      component={PhoenixTreatmentPlans}
    />
    <Route
      path={'/orion/configuration/products-indications/treatment-plans'}
      component={TreatmentPlansPanel}
    />
    <Route
      path={'/orion/configuration/products-indications/indications'}
      component={IndicationsPanel}
    />
    <Route
      path={'/orion/configuration/products-indications/therapeutic-areas'}
      component={TherapeuticAreas}
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
      path={'/orion/configuration/products-indications/coverage-types'}
      component={CoveragesPanel}
    />
    <Route
      path={'/orion/configuration/products-indications/subtypes'}
      component={SubtypesPanel}
    />
    <Route
      path={'/orion/configuration/products-indications/lines'}
      component={LinesPanel}
    />
    <Redirect
      to={'/orion/configuration/products-indications/phoenix-treatment-plans'}
    />
  </Switch>
)

export default ProductsIndications

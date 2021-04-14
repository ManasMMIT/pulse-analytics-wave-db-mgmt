import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Indications from './IndicationsPanel'
import Regimens from './RegimensPanel'
import PhoenixTreatmentPlans from './PhoenixTreatmentPlans'
import TreatmentPlansPanel from './TreatmentPlansPanel'
import Subtypes from './SubtypesPanel'
import Lines from './LinesPanel'
import CoverageTypes from './CoveragesPanel'
import TherapeuticAreas from './TherapeuticAreas'

const TreatmentPlans = () => (
  <Switch>
    <Route
      path={'/orion/general/treatment-plans/indications'}
      component={Indications}
    />
    <Route
      path={'/orion/general/treatment-plans/regimens'}
      component={Regimens}
    />
    <Route
      path={'/orion/general/treatment-plans/phoenix-tps'}
      component={PhoenixTreatmentPlans}
    />
    <Route
      path={'/orion/general/treatment-plans/treatment-plans'}
      component={TreatmentPlansPanel}
    />
    <Route
      path={'/orion/general/treatment-plans/subtypes'}
      component={Subtypes}
    />
    <Route path={'/orion/general/treatment-plans/lines'} component={Lines} />
    <Route
      path={'/orion/general/treatment-plans/coverage-types'}
      component={CoverageTypes}
    />
    <Route
      path={'/orion/general/treatment-plans/therapeutic-areas'}
      component={TherapeuticAreas}
    />
    <Redirect to={'/orion/general/treatment-plans/indications'} />
  </Switch>
)

export default TreatmentPlans

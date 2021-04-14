import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ValuePerception from './ValuePerception'

const SpecializedData = () => (
  <Switch>
    <Route
      path={'/orion/specialized/value-perception'}
      component={ValuePerception}
    />
    <Redirect to={'/orion/specialized/value-perception'} />
  </Switch>
)

export default SpecializedData

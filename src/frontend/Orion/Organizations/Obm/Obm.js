import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import AccountOverview from './AccountOverview'
import Services from './Services'
import Influencers from './Influencers'
import PayerPartnerships from './PayerPartnerships'

const Obm = () => (
  <Switch>
    <Route
      path={'/orion/organizations/obm/account-overview'}
      component={AccountOverview}
    />
    <Route path={'/orion/organizations/obm/services'} component={Services} />
    <Route
      path={'/orion/organizations/obm/influencers'}
      component={Influencers}
    />
    <Route
      path={'/orion/organizations/obm/payer-partnerships'}
      component={PayerPartnerships}
    />
    <Redirect to={'/orion/organizations/obm/account-overview'} />
  </Switch>
)

export default Obm

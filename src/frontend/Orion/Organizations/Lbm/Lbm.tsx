import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import AccountOverview from './AccountOverview'
import Services from './Services'
import Influencers from './Influencers'
import PayerPartnerships from './PayerPartnerships'

const Lbm = () => (
  <Switch>
    <Route
      path={'/orion/organizations/mbm/lbm/account-overview'}
      component={AccountOverview}
    />
    <Route path={'/orion/organizations/mbm/lbm/services'} component={Services} />
    <Route
      path={'/orion/organizations/mbm/lbm/influencers'}
      component={Influencers}
    />
    <Route
      path={'/orion/organizations/mbm/lbm/payer-partnerships'}
      component={PayerPartnerships}
    />
    <Redirect to={'/orion/organizations/mbm/lbm/account-overview'} />
  </Switch>
)

export default Lbm

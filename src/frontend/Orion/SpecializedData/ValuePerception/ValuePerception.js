import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import MarketBaskets from './MarketBaskets'
import MarketBasketDetail from './MarketBaskets/MarketBasketDetail'
import Stakeholders from './Stakeholders'
import StakeholderRoles from './StakeholderRoles'

import SANDBOX_MarketBaskets from './SANDBOX_MarketBaskets'
import SANDBOX_MarketBasketDetail from './SANDBOX_MarketBaskets/MarketBasketDetail'
import SANDBOX_Stakeholders from './SANDBOX_Stakeholders'
import SANDBOX_Roles from './SANDBOX_Roles'
import SANDBOX_RoleSpecialties from './SANDBOX_RoleSpecialties'
import SANDBOX_Providers from './SANDBOX_Providers'
import SANDBOX_Institutions from './SANDBOX_Institutions'
import SANDBOX_CommunityPracticeNetworks from './SANDBOX_CommunityPracticeNetworks'

const ValuePerception = () => (
  <Switch>
    <Route
      path={
        '/orion/specialized/value-perception/market-baskets/:marketBasketId'
      }
      component={MarketBasketDetail}
    />
    <Route
      path={'/orion/specialized/value-perception/market-baskets'}
      component={MarketBaskets}
    />
    <Route
      path={'/orion/specialized/value-perception/stakeholders'}
      component={Stakeholders}
    />
    <Route
      path={'/orion/specialized/value-perception/stakeholder-roles'}
      component={StakeholderRoles}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-market-baskets'}
      component={SANDBOX_MarketBaskets}
    />
    <Route
      path={
        '/orion/specialized/value-perception/sandbox-market-baskets/:marketBasketId'
      }
      component={SANDBOX_MarketBasketDetail}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-stakeholders'}
      component={SANDBOX_Stakeholders}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-roles'}
      component={SANDBOX_Roles}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-role-specialties'}
      component={SANDBOX_RoleSpecialties}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-providers'}
      component={SANDBOX_Providers}
    />
    <Route
      exact={true}
      path={'/orion/specialized/value-perception/sandbox-institutions'}
      component={SANDBOX_Institutions}
    />
    <Route
      exact={true}
      path={
        '/orion/specialized/value-perception/sandbox-community-practice-networks'
      }
      component={SANDBOX_CommunityPracticeNetworks}
    />
    <Redirect to={'/orion/specialized/value-perception/market-baskets'} />
  </Switch>
)

export default ValuePerception

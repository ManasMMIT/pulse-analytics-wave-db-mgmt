import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import DevToProdPushConsole from './DevToProdPushConsole'
import SheetManagement from './SheetManagement'
import NodeManagement from './NodeManagement'
import DevToProdPushManagement from './DevToProdPushManagement'
import BusinessObject from './BusinessObject'
import QueryToolManagement from './AquilaManagement'
import EditRoleNode from './EditRoleNodeView'
import EndUserTerms from './EndUserTerms'
import TotalHistory from './TotalHistory'

const Administrator = () => (
  <Switch>
    <Route
      path={'/orion/administrator/push-dev-prod'}
      component={DevToProdPushConsole}
    />
    <Route
      path={'/orion/administrator/sheet-mgmt'}
      component={SheetManagement}
    />
    <Route path={'/orion/administrator/node-mgmt'} component={NodeManagement} />
    <Route
      path={'/orion/administrator/push-dev-prod-mgmt'}
      component={DevToProdPushManagement}
    />
    <Route
      path={'/orion/administrator/business-object'}
      component={BusinessObject}
    />
    <Route
      path={'/orion/administrator/query-tool-mgmt'}
      component={QueryToolManagement}
    />
    <Route
      path={'/orion/administrator/edit-role-node'}
      component={EditRoleNode}
    />
    <Route
      path={'/orion/administrator/user-term-mgmt'}
      component={EndUserTerms}
    />
    <Route
      path={'/orion/administrator/total-history'}
      component={TotalHistory}
    />
    <Redirect to={'/orion/administrator/push-dev-prod'} />
  </Switch>
)

export default Administrator

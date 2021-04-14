import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { useAuth0 } from '../../../react-auth0-spa'
import superUsersById from '../../utils/super-users'

import ListsConfigManagement from './ListsConfigManagement'
import DevToProdPushConsole from './DevToProdPushConsole'
import SheetManagement from './SheetManagement'
import NodeManagement from './NodeManagement'
import DevToProdPushManagement from './DevToProdPushManagement'
import BusinessObject from './BusinessObject'
import QueryToolManagement from './AquilaManagement'
import EditRoleNode from './EditRoleNodeView'
import EndUserTerms from './EndUserTerms'
import TotalHistory from './TotalHistory'

const Administrator = () => {
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById

  return (
    <Switch>
      <Route
        path={'/orion/administrator/push-dev-prod'}
        component={DevToProdPushConsole}
      />
      {isSuperUser && (
        <>
          <Route
            path={'/orion/administrator/lists-config-mgmt'}
            component={ListsConfigManagement}
          />
          <Route
            path={'/orion/administrator/sheet-mgmt'}
            component={SheetManagement}
          />
          <Route
            path={'/orion/administrator/node-mgmt'}
            component={NodeManagement}
          />
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
        </>
      )}
      <Redirect to={'/orion/administrator/push-dev-prod'} />
    </Switch>
  )
}

export default Administrator

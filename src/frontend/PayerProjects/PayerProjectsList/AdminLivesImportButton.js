import React from 'react'
import { useHistory } from 'react-router-dom'

import Color from 'frontend/utils/color'
import Button from 'frontend/components/Button'

import superUsersById from '../../utils/super-users'
import { useAuth0 } from '../../../react-auth0-spa'

const IMPORT_LIVES_URL = 'payer-projects/import-lives'

const AdminLivesImportButton = () => {
  let history = useHistory()
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById
  if (!isSuperUser) return null

  const navigate = () => history.push(IMPORT_LIVES_URL)

  return (
    <Button
      buttonStyle={{ marginRight: 24 }}
      onClick={navigate}
      iconColor1={Color.WHITE}
    >
      Payer Lives Import
    </Button>
  )
}

export default AdminLivesImportButton

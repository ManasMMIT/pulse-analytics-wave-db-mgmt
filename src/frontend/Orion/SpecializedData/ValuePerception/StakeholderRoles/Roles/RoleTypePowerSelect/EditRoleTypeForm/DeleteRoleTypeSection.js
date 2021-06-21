import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_VEGA_PEOPLE_ROLES_TYPES } from 'frontend/api/queries'
import { DELETE_VEGA_PERSON_ROLE_TYPE } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import { SingleActionDialog } from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import { BoldText } from '../../../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const DeleteRoleTypeSection = ({ id, name, closeHandler }) => {
  const [isModalOpen, setModal] = useState(false)

  const [deleteRoleType, { loading }] = useMutation(
    DELETE_VEGA_PERSON_ROLE_TYPE,
    {
      variables: {
        input: {
          id,
        },
      },
      update: (cache) => {
        const { vegaPeopleRolesTypes: currRolesTypes } = cache.readQuery({
          query: GET_VEGA_PEOPLE_ROLES_TYPES,
        })

        const newRolesTypes = currRolesTypes.filter(
          ({ id: roleId }) => id !== roleId
        )

        cache.writeQuery({
          query: GET_VEGA_PEOPLE_ROLES_TYPES,
          data: { vegaPeopleRolesTypes: newRolesTypes },
        })
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
      },
    }
  )

  return (
    <section>
      <h4 style={{ paddingBottom: Spacing.FS4, ...FontSpace.FS5 }}>
        Delete Role Type
      </h4>
      <p style={FontSpace.FS2}>
        Deleting a role type removes all data associated with it and can’t be
        undone.
      </p>
      <Button
        color={Color.RED}
        onClick={() => setModal(true)}
        style={{
          padding: `${Spacing.S2} ${Spacing.S3}`,
          margin: `${Spacing.S4} 0`,
        }}
      >
        Delete Role Type
      </Button>
      {isModalOpen && (
        <SingleActionDialog
          header="Delete Role Type"
          submitText="Delete Forever"
          submitHandler={deleteRoleType}
          cancelHandler={() => setModal(false)}
          headerStyle={{ color: Color.RED }}
          submitColor={Color.RED}
          contentStyle={{ width: 450 }}
        >
          {loading ? (
            <Spinner />
          ) : (
            <div style={{ padding: 36, textAlign: 'center', ...FontSpace.FS3 }}>
              <p>
                Are you sure you want to delete the
                <BoldText> {name}</BoldText> Role Type?
              </p>
              <p style={{ fontWeight: 700, marginTop: 12 }}>
                THIS CANNOT BE UNDONE
              </p>
            </div>
          )}
        </SingleActionDialog>
      )}
    </section>
  )
}

DeleteRoleTypeSection.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default DeleteRoleTypeSection

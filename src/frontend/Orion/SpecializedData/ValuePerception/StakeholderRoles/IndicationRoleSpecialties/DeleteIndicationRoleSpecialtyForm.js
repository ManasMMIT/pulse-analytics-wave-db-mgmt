import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { DELETE_VEGA_PERSON_ROLE_INDICATION } from 'frontend/api/mutations'
import { GET_VEGA_PEOPLE_ROLES_INDICATIONS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import { SingleActionDialog } from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

import { BoldText } from '../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const DeleteIndicationRoleSpecialtyForm = ({
  specialtyData,
  closeHandler,
  handleListItemSearchUpdate,
  indicationId,
  roleId,
}) => {
  const { id: specialtyId, specialty_label } = specialtyData

  const handleListItemDelete = () => {
    handleListItemSearchUpdate({ specialty: undefined })
  }

  const [deleteRoleSpecialty, { loading: mutationLoading }] = useMutation(
    DELETE_VEGA_PERSON_ROLE_INDICATION,
    {
      variables: {
        input: {
          id: specialtyId,
        },
      },
      update: (cache) => {
        const { vegaPeopleRolesIndications } = cache.readQuery({
          query: GET_VEGA_PEOPLE_ROLES_INDICATIONS,
          variables: {
            indicationId,
            roleId,
          },
        })

        const newRoleSpecialties = vegaPeopleRolesIndications.filter(
          ({ id }) => id !== specialtyId
        )

        cache.writeQuery({
          query: GET_VEGA_PEOPLE_ROLES_INDICATIONS,
          variables: {
            indicationId,
            roleId,
          },
          data: { vegaPeopleRolesIndications: newRoleSpecialties },
        })
      },
      onError: alert,
      onCompleted: () => {
        closeHandler()
        handleListItemDelete()
      },
    }
  )

  return (
    <SingleActionDialog
      header="Delete Indication Role Specialty"
      submitText="Delete Forever"
      submitHandler={deleteRoleSpecialty}
      cancelHandler={closeHandler}
      headerStyle={{ color: Color.RED }}
      submitColor={Color.RED}
      contentStyle={{ width: 450 }}
    >
      {mutationLoading ? (
        <Spinner />
      ) : (
        <div style={{ padding: 36, textAlign: 'center', ...FontSpace.FS3 }}>
          <p>
            Are you sure you want to delete the
            <BoldText> {specialty_label}</BoldText> Indication Role Specialty?
          </p>
          <p style={{ fontWeight: 700, marginTop: 12 }}>
            THIS CANNOT BE UNDONE
          </p>
        </div>
      )}
    </SingleActionDialog>
  )
}

DeleteIndicationRoleSpecialtyForm.propTypes = {
  specialtyData: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default DeleteIndicationRoleSpecialtyForm

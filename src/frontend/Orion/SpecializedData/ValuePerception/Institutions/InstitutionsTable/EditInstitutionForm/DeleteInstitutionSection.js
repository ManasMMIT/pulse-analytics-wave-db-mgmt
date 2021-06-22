import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

import { Button } from '@pulse-analytics/pulse-design-system'

import { GET_INSTITUTIONS } from 'frontend/api/queries'
import { DELETE_INSTITUTION } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import { SingleActionDialog } from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

import { BoldText } from '../../../MarketBaskets/MarketBasketDetail/Surveys/SurveyView/SurveyForms/utils'

const DeleteInstitutionSection = ({ institutionId, name, closeHandler }) => {
  const [isModalOpen, setModal] = useState(false)

  const [deleteInstitution, { loading: mutationLoading }] = useMutation(
    DELETE_INSTITUTION,
    {
      variables: {
        input: {
          id: institutionId,
        },
      },
      update: (cache) => {
        const { vegaInstitutions } = cache.readQuery({
          query: GET_INSTITUTIONS,
        })
        const newInstitutions = vegaInstitutions.filter(
          ({ id }) => id !== institutionId
        )
        cache.writeQuery({
          query: GET_INSTITUTIONS,
          data: { vegaInstitutions: newInstitutions },
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
        Delete Institution
      </h4>
      <p style={FontSpace.FS2}>
        Deleting an institution removes all data associated with it and can’t be
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
        Delete Institution
      </Button>
      {isModalOpen && (
        <SingleActionDialog
          header="Delete Network"
          submitText="Delete Forever"
          submitHandler={deleteInstitution}
          cancelHandler={() => setModal(false)}
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
                <BoldText> {name}</BoldText> Network?
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

DeleteInstitutionSection.propTypes = {
  institutionId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
}

export default DeleteInstitutionSection

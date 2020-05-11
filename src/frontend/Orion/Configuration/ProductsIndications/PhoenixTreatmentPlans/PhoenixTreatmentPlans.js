import React from 'react'
import { transparentize } from 'polished'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from '../../../../components/Panel'
import ModalButtonWithForm from '../../../shared/ModalButtonWithForm'
import RegimensSelect from './RegimensSelect'

import { StyledInput, FormLabel, createObjectModalStyle, defaultPanelItemStyle } from '../../../Organizations/styledComponents'

import {
  GET_SOURCE_INDICATIONS,
  GET_SELECTED_INDICATION,
  GET_SELECTED_REGIMENS,
} from '../../../../api/queries'

import {
  SELECT_INDICATION,
  UPDATE_SOURCE_INDICATION,
} from '../../../../api/mutations'

import { Colors, Spacing } from '../../../../utils/pulseStyles'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

const panelItemActiveStyle = {
  backgroundColor: transparentize(0.85, Colors.PRIMARY),
  color: Colors.PRIMARY,
}

const getInputFields = (state, handleChange) => {
  return (
    <>
      <div>
        <FormLabel>name: </FormLabel>
        <StyledInput
          type="text"
          name="name"
          onChange={handleChange}
          value={state.input.name}
        />
      </div>

      <div style={{ marginTop: Spacing.LARGE }}>
        <FormLabel>regimens: </FormLabel>

        <RegimensSelect
          state={state}
          handleChange={handleChange}
        />
      </div>
    </>
  )
}

const buttonGroupCallback = ({ name, _id, regimens }) => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Indication"
      buttonLabel={editIcon}
      modalStyle={createObjectModalStyle}
      buttonStyle={{ border: 'none', background: 'none', color: transparentize(0.7, Colors.BLACK) }}
      data={{ input: { name, _id, regimens } }}
      mutationDoc={UPDATE_SOURCE_INDICATION}
      refetchQueries={[{ query: GET_SOURCE_INDICATIONS }]}
      afterMutationHook={(cache, { data }) => {
        const updatedIndication = data.updateSourceIndication
        const { regimens } = updatedIndication

        cache.writeQuery({
          query: GET_SELECTED_REGIMENS,
          data: { selectedRegimens: regimens },
        })
      }}
      getInputFields={getInputFields}
    />
  </>
)

const indicationsPanelItemConfig = {
  style: defaultPanelItemStyle,
  activeStyle: panelItemActiveStyle,
  buttonGroupCallback,
  label1Callback: ({ name }) => name,
  selectEntityMutationDoc: SELECT_INDICATION,
}

const regimensPanelItemConfig = {
  style: defaultPanelItemStyle,
  label1Callback: ({ name }) => name,
}

const TreatmentPlans = () => (
  <div style={{ display: 'flex', flex: 1 }}>
    <Panel
      title="Indications"
      style={{ borderRight: `1px solid ${transparentize(0.9, Colors.BLACK)}` }}
      headerContainerStyle={{
        background: Colors.WHITE,
        borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
      }}
      // headerChildren={headerChildren}
      queryDocs={{
        fetchAllQueryProps: { query: GET_SOURCE_INDICATIONS },
        fetchSelectedQueryProps: { query: GET_SELECTED_INDICATION },
      }}
      panelItemConfig={indicationsPanelItemConfig}
    />

    <Panel
      title="Regimens"
      // headerChildren={regimensHeaderChildren}
      headerContainerStyle={{
        background: Colors.WHITE,
        borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`
      }}
      queryDocs={{
        fetchAllQueryProps: { query: GET_SELECTED_REGIMENS },
      }}
      panelItemConfig={regimensPanelItemConfig}
    />
  </div>
)

export default TreatmentPlans

// agg pipeline for starting with indications and left joining
// treatmentPlans (or ind/reg combos) onto it, and then left joining
// regimens onto that, and then regrouping under indication

// const aggPipeline = [{
//   $lookup: {
//     from: 'treatmentPlans',
//     localField: 'name',
//     foreignField: 'indication',
//     as: 'regimens'
//   }
// }, {
//   $unwind: {
//     path: '$regimens',
//     preserveNullAndEmptyArrays: true
//   }
// }, {
//   $project: {
//     name: 1,
//     regimen: '$regimens.regimen'
//   }
// }, {
//   $lookup: {
//     from: 'regimens',
//     localField: 'regimen',
//     foreignField: 'name',
//     as: 'regimen'
//   }
// }, {
//   $project: {
//     name: 1,
//     regimen: {
//       $arrayElemAt: [
//         '$regimen',
//         0
//       ]
//     }
//   }
// }, {
//   $group: {
//     _id: {
//       name: '$name',
//       _id: '$_id'
//     },
//     regimens: {
//       $push: '$$ROOT'
//     }
//   }
// }, {
//   $project: {
//     _id: '$_id._id',
//     name: '$_id.name',
//     regimens: {
//       $filter: {
//         input: {
//           $map: {
//             input: '$regimens',
//             'in': '$$this.regimen',
//           }
//         },
//         as: 'item',
//         cond: { $ne: ['$$item', null] }
//       }
//     }
//   }
// }]

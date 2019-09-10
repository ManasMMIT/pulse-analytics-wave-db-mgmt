import React from 'react'
import { Query } from 'react-apollo'
import Select from 'react-select'
import _ from 'lodash'
import { transparentize } from 'polished'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"

import Panel from '../../Phoenix/shared/Panel'
import ModalButtonWithForm from '../shared/ModalButtonWithForm'
// import DeleteButton from '../shared/DeleteButton'
// import CopyOneOfStringButton from '../shared/CopyOneOfStringButton'
import Spinner from '../../Phoenix/shared/Spinner'
import stripTypename from '../shared/strip-typename'

import {
  GET_SOURCE_INDICATIONS,
  GET_SOURCE_REGIMENS,
  GET_SELECTED_INDICATION,
  GET_SELECTED_REGIMENS,
} from '../../api/queries'

import {
  SELECT_INDICATION,
  UPDATE_SOURCE_INDICATION,
} from '../../api/mutations'

const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

// const ADD_REGIMEN_ASSOCIATION = 'Associate Other Regimens'

// const buttonStyle = {
//   background: "#234768",
//   color: 'white',
// }

const defaultPanelItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '17px 20px',
  color: '#0E2539',
  fontWeight: 600,
  fontSize: 12,
  marginTop: 10,
  borderTop: '1px solid rgb(182, 185, 188)',
}

const panelItemActiveStyle = {
  backgroundColor: transparentize(0.9, '#0668D9'),
  color: '#0668D9',
}

const getInputFields = (state, handleChange) => {
  return (
    <>
      <div>
        <span>name: </span>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={state.input.name}
        />
      </div>

      <div>
        <span>regimens: </span>
        <Query query={GET_SOURCE_REGIMENS}>
          {({ data: { regimens }, loading, error }) => {
            if (error) return <div style={{ color: 'red' }}>Error processing request</div>
            if (loading) return <Spinner />

            const initialSelections = state.input.regimens.map(({ _id, name }) => (
              { value: _id, label: name }
            ))

            const regimensByKey = _.keyBy(regimens, '_id')

            const options = regimens.map(({ _id, name }) => (
              { value: _id, label: name }
            ))

            return (
              <Select
                defaultValue={initialSelections}
                isMulti
                options={options}
                onChange={arrOfVals => {
                  let newRegimens = arrOfVals || []

                  newRegimens = newRegimens.map(
                    ({ value }) => stripTypename(regimensByKey[value])
                  )

                  // ! HACK: Mock HTML event.target structure to get tags
                  // ! able to written into TextForm's local state by handleChange
                  handleChange({ target: { name: 'regimens', value: newRegimens } })
                }}
              />
            )
          }}
        </Query>
      </div>
    </>
  )
}

// const headerChildren = (
//   <div>
//     <ModalButtonWithForm
//       modalTitle={CREATE_MODAL_TITLE}
//       buttonLabel={CREATE_BUTTON_TXT}
//       buttonStyle={buttonStyle}
//       mutationDoc={CREATE_INDICATION}
//       refetchQueries={[{ query: GET_SOURCE_INDICATIONS }]}
//       getInputFields={getInputFields}
//     />

//     <CopyOneOfStringButton
//       queryDoc={GET_SOURCE_INDICATIONS}
//       dataKey="indications"
//     />
//   </div>
// )

const buttonGroupCallback = ({ name, _id, regimens }) => (
  <>
    <ModalButtonWithForm
      modalTitle="Edit Indication"
      buttonLabel={editIcon}
      buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
      data={{ input: { name, _id, regimens } }}
      mutationDoc={UPDATE_SOURCE_INDICATION}
      refetchQueries={[{ query: GET_SOURCE_INDICATIONS }]}
      getInputFields={getInputFields}
    />

    {/* <DeleteButton
      itemId={_id}
      mutationDoc={DELETE_SOURCE_INDICATION}
      refetchQueries={[{ query: GET_SOURCE_INDICATIONS }]}
    /> */}
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
  // buttonGroupCallback,
  label1Callback: ({ name }) => name,
}

// const regimensHeaderChildren = (
//   <div>
//   </div>
// )

const TreatmentPlans = () => (
  <div style={{ display: 'flex' }}>
    <Panel
      title="Indications"
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

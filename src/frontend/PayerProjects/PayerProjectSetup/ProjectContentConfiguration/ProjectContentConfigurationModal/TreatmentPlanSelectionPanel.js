import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import styled from "@emotion/styled"
import { transparentize } from 'polished'
import {
  GET_SOURCE_TREATMENT_PLANS,
} from 'frontend/api/queries'
import Card from 'frontend/components/Card'
import Spinner from 'frontend/components/Spinner'

// ! temp: reuse components from TreatmentPlansTabContent
import {
  ActiveRow,
  InactiveRow,
  UnorderedList,
} from '../../../../Phoenix/SitemapPanel/shared/ButtonGroup/ResourcesButtonWithModal/ResourcesModal/ModalContent/TreatmentPlansTabContent/styledComponents'

import OrionSwitch from './OrionSwitch'

import { Colors, Spacing } from 'frontend/utils/pulseStyles'

const RowItem = styled.div({
  borderBottom: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  paddingLeft: Spacing.NORMAL,
  ':hover': {
    background: transparentize(0.92, Colors.BLACK),
  }
})

const TreatmentPlanSelectionPanel = ({
  treatmentPlanIds,
  setTreatmentPlanIds,
}) => {
  const { data, loading } = useQuery(GET_SOURCE_TREATMENT_PLANS)

  let treatmentPlans = []
  if (!loading) {
    treatmentPlans = data.treatmentPlans
  }

  const isTreatmentPlanChecked = tpId => treatmentPlanIds[tpId]

  const handleToggle = tpId => {
    const isChecked = isTreatmentPlanChecked(tpId)

    if (isChecked) {
      const clonedTpIds = _.cloneDeep(treatmentPlanIds)
      delete clonedTpIds[tpId]

      setTreatmentPlanIds(clonedTpIds)
    } else {
      setTreatmentPlanIds({
        ...treatmentPlanIds,
        [tpId]: true,
      })
    }
  }

  const getTpLabel = tp => [
    tp.indication,
    tp.regimen,
    tp.population,
    tp.line,
    tp.book,
    tp.coverage,
  ].join(' | ')

  const [
    enabledTps,
    disabledTps,
  ] = _.partition(treatmentPlans, tp => treatmentPlanIds[tp._id])

  return (
    <Card title="Treatment Plans">
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        <ActiveRow>ACTIVE ({enabledTps.length})</ActiveRow>
        <UnorderedList>
          {
            enabledTps.map(tp => (
              <RowItem key={tp._id}>
                <OrionSwitch
                  _id={tp._id}
                  isChecked={isTreatmentPlanChecked(tp._id)}
                  handleToggle={handleToggle}
                />
                <span>{getTpLabel(tp)}</span>
              </RowItem>
            ))
          }
        </UnorderedList>

        <InactiveRow>INACTIVE ({disabledTps.length})</InactiveRow>
        <UnorderedList>
          {
            disabledTps.map(tp => (
              <RowItem key={tp._id}>
                <OrionSwitch
                  _id={tp._id}
                  isChecked={isTreatmentPlanChecked(tp._id)}
                  handleToggle={handleToggle}
                />
                <span>{getTpLabel(tp)}</span>
              </RowItem>
            ))
          }
        </UnorderedList>

        {
          loading && <Spinner />
        }
      </div>
    </Card>
  )
}

export default TreatmentPlanSelectionPanel

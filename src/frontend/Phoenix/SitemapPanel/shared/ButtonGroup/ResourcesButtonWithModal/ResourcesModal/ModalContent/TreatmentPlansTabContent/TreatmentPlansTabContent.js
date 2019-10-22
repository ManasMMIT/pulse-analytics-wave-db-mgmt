import React from 'react'
import Switch from '@material-ui/core/Switch'

const TreatmentPlansTabContent = ({
  enableIndication,
  disableIndication,
  enableRegimen,
  disableRegimen,
  baseTreatmentPlans,
  enabledTreatmentPlansHash,
}) => {
  const content = baseTreatmentPlans.map(ind => (
    <div key={ind._id} style={{ display: 'flex', borderBottom: '1px solid black' }}>
      <div style={{ flex: 3  }}>
        <span style={{ fontWeight: 700 }}>{ind.name}</span>
        <Switch
          checked={Boolean(enabledTreatmentPlansHash[ind._id])}
          color="primary"
          value={ind._id}
          onChange={e => {
            e.target.checked ? enableIndication(ind) : disableIndication(ind)
          }}
        />
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ flex: 3 }}>
        {
          ind.regimens.map(reg => {
            const checked = Boolean(
              enabledTreatmentPlansHash[ind._id]
                && enabledTreatmentPlansHash[ind._id][reg._id]
            )

            return (
              <div key={reg._id} >
                <span>{reg.name}</span>
                <Switch
                  checked={checked}
                  color="primary"
                  value={reg._id}
                  onChange={e => {
                    e.target.checked
                      ? enableRegimen(ind, reg)
                      : disableRegimen(ind, reg)
                  }}
                />
              </div>
            )
          })
        }
      </div>
    </div>
  ))

  return (
    <div style={{ maxHeight: 600, overflow: 'auto' }}>
      {content}
    </div>
  )
}

export default TreatmentPlansTabContent

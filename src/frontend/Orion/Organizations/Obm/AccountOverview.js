import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  GET_OBM_ORGANIZATIONS,
} from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'

import Color from './../../../utils/color'

const StyledTd = styled.td({
  padding: 12,
})

const StyledTh = styled.th({
  fontWeight: 700,
  fontSize: 14,
  padding: 12,
})

const createButtonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
  margin: 12,
  padding: 12,
  borderRadius: 4,
  cursor: 'pointer',
}

const buttonStyle = {
  cursor: 'pointer',
  fontSize: 12,
}

const PAGE_TITLE = 'Oncology Benefit Manager Account Overview'

const AccountOverview = () => {
  const { data, loading } = useQuery(GET_OBM_ORGANIZATIONS)

  let obms = []
  if (!loading) obms = Object.values(data)[0] || []

  return (
    <div style={{ width: '100%' }}>
      <PanelHeader title={PAGE_TITLE}>
        <ObmModalButton buttonStyle={createButtonStyle}>
          Create OBM
        </ObmModalButton>
      </PanelHeader>
      <table style={{
        margin: '12px 24px',
        width: '100%',
        display: 'block',
        height: 650,
        overflowY: 'scroll',
        borderCollapse: 'collapse',
      }}>
        <tbody>
          <tr style={{ border: '1px solid black' }}>
            <StyledTh>Account</StyledTh>
            <StyledTh>Start</StyledTh>
            <StyledTh>Business Model</StyledTh>
          </tr>
          {
            obms.map(({ _id, organization, start, businessModel }) => {
              return (
                <tr key={_id + organization} style={{ border: '1px solid black' }}>
                  <StyledTd>
                    <ObmModalButton buttonStyle={buttonStyle} entityId={_id}>
                      {organization}
                    </ObmModalButton>
                  </StyledTd>
                  <StyledTd>
                    <ObmModalButton buttonStyle={buttonStyle} entityId={_id}>
                      {start}
                    </ObmModalButton>
                  </StyledTd>
                  <StyledTd>
                    <ObmModalButton buttonStyle={buttonStyle} entityId={_id}>
                      {businessModel}
                    </ObmModalButton>
                  </StyledTd>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default AccountOverview

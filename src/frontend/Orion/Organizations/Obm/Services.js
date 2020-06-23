import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  GET_SERVICE_TEMPLATE_OBMS,
} from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import ObmServicesModalButton from '../../../components/BusinessObjectModal/ObmServicesModal/ObmServicesModalButton'
import ObmServicesCategoriesModalButton from '../../../components/BusinessObjectModal/ObmServicesCategoriesModal/ObmServicesCategoriesModalButton'

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

const PAGE_TITLE = 'Oncology Benefit Manager Account Services'

const Services = () => {
  const { data, loading } = useQuery(GET_SERVICE_TEMPLATE_OBMS)

  let serviceTemplateData = []
  if (data && !loading) serviceTemplateData = Object.values(data)[0] || []

  return (
    <div style={{ width: '100%' }}>
      <PanelHeader title={PAGE_TITLE}>
        <ObmServicesModalButton buttonStyle={createButtonStyle} >
          Create Service
        </ObmServicesModalButton>
        <ObmServicesCategoriesModalButton buttonStyle={createButtonStyle} >
          Create Service Category
        </ObmServicesCategoriesModalButton>
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
            <StyledTh>Service Category</StyledTh>
            <StyledTh>Service</StyledTh>
            <StyledTh>Service Rating</StyledTh>
          </tr>
          {
            serviceTemplateData.map(({
              obmServiceJoinId,
              obmId,
              serviceId,
              serviceCategoryId,
              organization,
              serviceCategory,
              service,
              serviceRating
            }) => {
              const keyId = obmServiceJoinId || obmId

              return (
                <tr key={keyId} style={{ border: '1px solid black' }}>
                  <StyledTd>
                    <ObmModalButton
                      buttonStyle={buttonStyle}
                      entityId={obmId}
                    >
                      {organization}
                    </ObmModalButton>
                  </StyledTd>
                  <StyledTd>
                    <ObmServicesCategoriesModalButton
                      buttonStyle={buttonStyle}
                      entityId={serviceCategoryId}
                    >
                      {serviceCategory}
                    </ObmServicesCategoriesModalButton>
                  </StyledTd>
                  <StyledTd>
                    <ObmServicesModalButton
                      buttonStyle={buttonStyle}
                      entityId={serviceId}
                    >
                      {service}
                    </ObmServicesModalButton>
                  </StyledTd>
                  <StyledTd>
                    <ObmModalButton
                      buttonStyle={buttonStyle}
                      entityId={obmId}
                    >
                      {serviceRating}
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

export default Services

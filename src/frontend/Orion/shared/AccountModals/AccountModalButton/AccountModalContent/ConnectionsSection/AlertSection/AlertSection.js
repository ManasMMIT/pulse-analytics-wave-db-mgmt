import React from 'react'
import styled from '@emotion/styled'

const SectionWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  fontSize: 10,
  paddingTop: 12,
})

const basicLabelStyles = {
  marginRight: '8px ',
}

const AlertLabel = styled.span({
  color: 'red',
  border: `1px dotted red`,
  borderRadius: 2,
  padding: '2px 4px',
  ...basicLabelStyles,
})

const AlertField = styled.span({
  ...basicLabelStyles,
})

const FieldKey = styled.span({
  color: 'grey',
})

const FieldValue = styled.span({
  color: 'grey',
})

const AlertSection = ({
  alertDate,
  alertDescription,
  alertType,
}) => {

  return (
    <SectionWrapper>
      <AlertLabel>Alert Set</AlertLabel>

      <AlertField>
        <FieldKey>Type: </FieldKey> 
        <FieldValue>
          {alertType}
        </FieldValue>
      </AlertField>

      <AlertField>
        <FieldKey> Description: </FieldKey> 
        <FieldValue>
          {alertDescription}
        </FieldValue>
      </AlertField>

      <AlertField>
        <FieldKey> Date: </FieldKey> 
        <FieldValue>
          {alertDate}
        </FieldValue>
      </AlertField>
    </SectionWrapper>
  )
}

export default AlertSection

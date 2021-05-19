import styled from '@emotion/styled'

export const CATEGORY_TYPE_OPTIONS = [
  { label: 'Product', value: 'product' },
  { label: 'Regimen', value: 'regimen' },
  { label: 'Manufacturer', value: 'manufacturer' },
]

export const FormLabel = styled.label({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '20px',
})

export const BoldText = styled.span({
  fontWeight: 700,
})

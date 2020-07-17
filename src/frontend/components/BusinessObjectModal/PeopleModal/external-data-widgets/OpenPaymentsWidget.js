import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import format from 'date-fns/format'

import { GET_OPEN_PAYMENTS } from 'frontend/api/queries'

import TemplateTable from 'frontend/Orion/Organizations/Obm/TemplateTable'
import MultiSelectColumnFilter from 'frontend/Orion/Organizations/Obm/TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/Orion/Organizations/Obm/TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'

const COLUMNS = [
  {
    Header: 'Date_of_Payment',
    accessor: 'dateOfPayment',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    Cell: ({ value }) => format(new Date(value), 'M/d/yyyy'),
  },
  {
    Header: 'Total_Amount_of_Payment_USDollars',
    accessor: 'totalAmountOfPaymentUsdollars',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    Cell: ({ value }) => `$${value}`,
  },
  {
    Header: 'Applicable_Manufacturer_or_Applicable_GPO_Making_Payment_Name',
    accessor: 'applicableManufacturerOrApplicableGpoMakingPaymentName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Product_Category_or_Therapeutic_Area_1',
    accessor: 'productCategoryOrTherapeuticArea1',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_1',
    accessor: 'nameOfDrugOrBiologicalOrDeviceOrMedicalSupply1',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Product_Category_or_Therapeutic_Area_2',
    accessor: 'productCategoryOrTherapeuticArea2',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_2',
    accessor: 'nameOfDrugOrBiologicalOrDeviceOrMedicalSupply2',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Product_Category_or_Therapeutic_Area_3',
    accessor: 'productCategoryOrTherapeuticArea3',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_3',
    accessor: 'nameOfDrugOrBiologicalOrDeviceOrMedicalSupply3',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Product_Category_or_Therapeutic_Area_4',
    accessor: 'productCategoryOrTherapeuticArea4',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Name_of_Drug_or_Biological_or_Device_or_Medical_Supply_4',
    accessor: 'nameOfDrugOrBiologicalOrDeviceOrMedicalSupply4',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Nature_of_Payment_or_Transfer_of_Value',
    accessor: 'natureOfPaymentOrTransferOfValue',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Recipient_Primary_Business_Street_Address_Line1',
    accessor: 'recipientPrimaryBusinessStreetAddressLine1',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Recipient_Primary_Business_Street_Address_Line2',
    accessor: 'recipientPrimaryBusinessStreetAddressLine2',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Recipient_City',
    accessor: 'recipientCity',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Recipient_State',
    accessor: 'recipientState',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 50,
  },
  {
    Header: 'Recipient_Zip_Code',
    accessor: 'recipientZipCode',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Physician_Primary_Type',
    accessor: 'physicianPrimaryType',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Physician_Specialty',
    accessor: 'physicianSpecialty',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const OpenPaymentsWidget = ({ entity }) => {
  let { data, loading } = useQuery(GET_OPEN_PAYMENTS, {
    variables: { physicianProfileId: entity.physicianProfileId },
  })

  const filename = `CMS_Open_Payments-${entity.firstName}_${entity.lastName}`

  if (loading) return null

  data = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - 300px)',
      }}
    >
      <TemplateTable
        data={data}
        columns={COLUMNS}
        exportStyle={{ margin: 24 }}
        exportProps={{ filename }}
      />
    </div>
  )
}

export default OpenPaymentsWidget

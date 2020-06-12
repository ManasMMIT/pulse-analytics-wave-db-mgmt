import PathwaysModalButton from 'frontend/components/BusinessObjectModal/PathwaysModal/PathwaysModalButton'
import OncologyBenefitManagerModalButton from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import ObmServicesModalButton from 'frontend/components/BusinessObjectModal/ObmServicesModal/ObmServicesModalButton'
import ObmServicesCategoriesModalButton from 'frontend/components/BusinessObjectModal/ObmServicesCategoriesModal/ObmServicesCategoriesModalButton'

const BO_NAME_BOM_MAP = {
  'Pathways': PathwaysModalButton,
  'Oncology Benefit Manager': OncologyBenefitManagerModalButton,
  'OBM Service': ObmServicesModalButton,
  'OBM Service Category': ObmServicesCategoriesModalButton,
}

export default BO_NAME_BOM_MAP

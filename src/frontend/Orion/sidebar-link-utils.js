export const DATA_IMPORT_CONFIG = [
  { label: 'Import Sheets', link: '/orion/import-export/import-sheets' },
  {
    label: 'Export Data',
    link: '/orion/import-export/export',
    childLinks: [
      {
        label: 'Export Custom Data',
        link: '/export-custom-data',
      },
      {
        label: 'Export Custom Powerpoint',
        link: '/export-custom-powerpoint',
      },
    ],
  },
]

export const ORGANIZATIONS_CONFIG = [
  {
    label: 'Alternative Payment Modals',
    link: '/orion/organizations/apm',
    childLinks: [{ label: 'Accounts', link: '/accounts' }],
  },
  {
    label: 'Medical Benefit Managers',
    link: '/orion/organizations/mbm',
    childLinks: [
      {
        label: 'Oncology Benefit Managers',
        link: '/obm',
        childLinks: [
          { label: 'Account Overview', link: '/account-overview' },
          { label: 'Services', link: '/services' },
          { label: 'Influencers', link: '/influencers' },
          { label: 'Payer Partnerships', link: '/payer-partnerships' },
        ],
      },
      {
        label: 'Laboratory Benefit Managers',
        link: '/lbm',
        childLinks: [
          { label: 'Account Overview', link: '/account-overview' },
          { label: 'Services', link: '/services' },
          { label: 'Influencers', link: '/influencers' },
          { label: 'Payer Partnerships', link: '/payer-partnerships' },
        ],
      },
    ],
  },
  {
    label: 'Pathways',
    link: '/orion/organizations/pathways',
    childLinks: [
      { label: 'Accounts', link: '/accounts' },
      { label: 'Influencers', link: '/influencers' },
    ],
  },
  {
    label: 'Payers',
    link: '/orion/organizations/payer',
    childLinks: [
      { label: 'Accounts', link: '/accounts' },
      { label: 'Book of Business', link: '/book-of-business' },
      { label: 'Quality of Access Score', link: '/scores' },
    ],
  },
  {
    label: 'Providers',
    link: '/orion/organizations/provider',
    childLinks: [
      { label: 'Accounts', link: '/accounts' },
      // { label: 'Provider Types', link: '/provider-types' },
      // { label: 'Provider Networks', link: '/provider-networks' },
    ],
  },
]

export const GENERAL_DATA_CONFIG = [
  { label: 'Products', link: '/orion/general/products' },
  // {
  //   label: 'Manufacturers',
  //   link: '/orion/general/manufacturers',
  // },
  {
    label: 'People',
    link: '/orion/general/people',
  },
  {
    label: 'US States',
    link: '/orion/general/us-states',
  },
  {
    label: 'Treatment Plans',
    link: '/orion/general/treatment-plans',
    childLinks: [
      { label: 'Indications', link: '/indications' },
      { label: 'Regimens', link: '/regimens' },
      { label: 'Phoenix Treatment Plans', link: '/phoenix-tps' },
      { label: 'Treatment Plans', link: '/treatment-plans' },
      { label: 'Subtypes', link: '/subtypes' },
      { label: 'Lines', link: '/lines' },
      { label: 'Coverage Types', link: '/coverage-types' },
      { label: 'Therapeutic Areas', link: '/therapeutic-areas' },
    ],
  },
]

export const SPECIALIZED_DATA_CONFIG = [
  {
    label: 'Value Perception Tool',
    link: '/orion/specialized/value-perception',
    childLinks: [
      { label: 'Market Baskets', link: '/market-baskets' },
      { label: 'Stakeholders', link: '/stakeholders' },
      {
        label: 'Stakeholder Roles',
        link: '/stakeholder-roles',
        childLinks: [
          { label: 'Roles', link: '/roles' },
          {
            label: 'Indication Role Specialties',
            link: '/indication-role-specialties',
          },
        ],
      },
      {
        label: 'SANDBOX Market Baskets',
        link: '/sandbox-market-baskets',
        showOnSuperUserOnly: true,
      },
      {
        label: 'SANDBOX Stakeholders',
        link: '/sandbox-stakeholders',
        showOnSuperUserOnly: true,
      },
      {
        label: 'SANDBOX Roles',
        link: '/sandbox-roles',
        showOnSuperUserOnly: true,
      },
      {
        label: 'SANDBOX Role Specialties',
        link: '/sandbox-role-specialties',
        showOnSuperUserOnly: true,
      },
      {
        label: 'SANDBOX Providers',
        link: '/sandbox-providers',
        showOnSuperUserOnly: true,
      },
      {
        label: 'SANDBOX Institutions',
        link: '/sandbox-institutions',
        showOnSuperUserOnly: true,
      },
      {
        label: 'SANDBOX Community Practice Networks',
        link: '/sandbox-community-practice-networks',
        showOnSuperUserOnly: true,
      },
    ],
  },
]

export const ADMINISTRATOR_DATA_CONFIG = [
  {
    label: 'Lists Config Management',
    link: '/orion/administrator/lists-config-mgmt',
    showOnSuperUserOnly: true,
  },
  { label: 'Push Dev to Prod', link: '/orion/administrator/push-dev-prod' },
  {
    label: 'Sheet Management',
    link: '/orion/administrator/sheet-mgmt',
    showOnSuperUserOnly: true,
  },
  {
    label: 'Node Management',
    link: '/orion/administrator/node-mgmt',
    showOnSuperUserOnly: true,
  },
  {
    label: 'Push Dev to Prod Management',
    link: '/orion/administrator/push-dev-prod-mgmt',
    showOnSuperUserOnly: true,
  },
  {
    label: 'Business Object',
    link: '/orion/administrator/business-object',
    showOnSuperUserOnly: true,
    childLinks: [
      {
        label: 'Business Object Management',
        link: '/business-object-mgmt',
      },
      {
        label: 'Business Object Modal Management',
        link: '/business-object-modal-mgmt',
      },
    ],
  },
  {
    label: 'Query Tool Management',
    link: '/orion/administrator/query-tool-mgmt',
    showOnSuperUserOnly: true,
  },
  {
    label: 'Edit Role Node',
    link: '/orion/administrator/edit-role-node',
    showOnSuperUserOnly: true,
  },
  {
    label: 'End-User Terms Management',
    link: '/orion/administrator/user-term-mgmt',
    showOnSuperUserOnly: true,
  },
  {
    label: 'Total History',
    link: '/orion/administrator/total-history',
    showOnSuperUserOnly: true,
  },
]

export const EXPERIMENTAL_DATA_CONFIG = [
  {
    label: 'Query Tool',
    link: '/orion/experimental/query-tool',
    childLinks: [
      {
        label: 'Query Tool',
        link: '/tool',
      },
      {
        label: 'Query Tool Demo',
        link: '/tool-demo',
      },
      {
        label: 'Suggested Questions',
        link: '/questions',
      },
    ],
  },
]

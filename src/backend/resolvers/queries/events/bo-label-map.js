const BO_LABEL_MAP = {
  Person: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  Pathways: ({ organizationTiny, organization }) => {
    return organizationTiny || organization
  },
  Indication: ({ name }) => name,
}

module.exports = BO_LABEL_MAP

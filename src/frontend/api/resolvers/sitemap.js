import {
  GET_SOURCE_INDICATIONS,
  GET_SELECTED_INDICATION,
  GET_SELECTED_REGIMENS,
} from '../queries'

const sitemapResolvers = {
  selectIndication: async (_, { _id: indicationId }, { cache, client }) => {
    const response = await client.query({ query: GET_SOURCE_INDICATIONS })
    const indications = response.data.indications

    let selectedIndication = indications[0]

    if (indicationId) {
      selectedIndication = indications.find(({ _id }) => _id === indicationId)
    }

    client.writeQuery({
      query: GET_SELECTED_INDICATION,
      data: { selectedIndication },
    })

    client.writeQuery({
      query: GET_SELECTED_REGIMENS,
      data: { selectedRegimens: selectedIndication.regimens },
    })

    return selectedIndication
  },
}

export default sitemapResolvers

const mockPolicyLinkSheetData = [
  {
    slug: "aetna",
    regimen: "Herceptin",
    book: "Commercial",
    coverage: "Medical",
    link: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Aetna+Comm.pdf',
    dateTracked: '1/1/2020',
    paLink: 'N/A',
    policyLink: null,
    siteLink: null,
  },
  {
    slug: "anthem",
    regimen: "Herceptin+Perjeta+docetaxel",
    book: "Medicare",
    coverage: "Medical",
    link: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Anthem+Medicare.pdf',
    dateTracked: '2/1/2020',
    paLink: 'N/A',
    policyLink: null,
    siteLink: null,
  },
]

module.exports = {
  mockPolicyLinkSheetData
}

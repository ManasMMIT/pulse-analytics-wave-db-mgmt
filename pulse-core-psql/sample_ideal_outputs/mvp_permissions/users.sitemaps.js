[
  {
    _id: "5c81841b49c64cbd4f9e1057",
    username: "eli-lilly-prv-demo",
    sitemap: [
      {
        name: 'Provider Targeted Accounts',
        type: 'dashboard',
        children: [
          {
            name: "Management",
            type: 'dashboard',
            children: [
              {
                name: "Regional Footprint",
                type: 'page'
              },
              {
                name: "Internal Pharmacy",
                type: 'page'
              },
              {
                name: "Pathways",
                type: 'page'
              },
              {
                name: "Alternative Payment Models",
                type: 'page'
              },
            ]
          },
          {
            name: "Accounts",
            type: 'dashboard',
            children: [
              {
                name: "Business Model & Capabilities",
                type: 'page'
              },
              {
                name: "Clinical Sophistication",
                type: 'page'
              },
              {
                name: "Value Based Care",
                type: 'page'
              },
              {
                name: "Manufacturer Engagement",
                type: 'page'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    _id: "auth0|59e910a4c30a38053ab5452b",
    username: "admin",
    sitemap: [
      {
        name: 'Payer',
        type: 'dashboard',
        children: [
          {
            name: "Management",
            type: 'dashboard',
            children: [
              {
                name: "Summary",
                type: 'page'
              },
              {
                name: "Quality of Access",
                type: 'page'
              },
              {
                name: "Dupixent Relative Access",
                type: 'page'
              },
              {
                name: "Competitive Access",
                type: 'page'
              },
              {
                name: "Review Timing",
                type: 'page'
              },
              {
                name: "Treatment Centers",
                type: 'page'
              },
              {
                name: "Regional Targeting",
                type: 'page',
                children: [
                  {
                    name: 'Regional Quality of Access',
                    type: 'card',
                    children: [
                      {
                        id: 'fg78',
                        name: 'Regional Map',
                        type: 'content',
                        component: 'Map',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Value Based Models",
                type: 'page'
              },
              {
                name: "Strategic Accounts",
                type: 'page'
              },
              {
                name: "Reports",
                type: 'page'
              }
            ]
          },
          {
            name: "Accounts",
            type: 'dashboard',
            children: [
              {
                name: "Summary & Engagement",
                type: 'page'
              },
              {
                name: "Overview",
                type: 'page'
              },
              {
                name: "Management Capabilities",
                type: 'page'
              },
              {
                name: "Review Process",
                type: 'page'
              },
              {
                name: "Product Coverage",
                type: 'page'
              }
            ]
          }
        ]
      }
    ]
  }
]

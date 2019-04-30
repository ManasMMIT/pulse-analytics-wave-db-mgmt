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
                type: 'page',
                children: [
                  {
                    name: "Site Locations",
                    type: 'card',
                    children: [
                      {
                        name: "Map",
                        type: 'content',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Internal Pharmacy",
                type: 'page',
                children: [
                  {
                    name: "Internal Dispensing",
                    type: 'card',
                    children: [
                      {
                        name: "Horizontal Bar Chart With Chips",
                        type: 'content',
                        component: 'HorizontalBarChartWithChips',
                        props: {
                          bucketContainerStyle: { flexWrap: 'wrap' }
                        }
                      }
                    ]
                  }
                ]
              },
              {
                name: "Pathways",
                type: 'page',
                children: [
                  {
                    name: "Pathways",
                    type: 'card',
                    children: [
                      {
                        name: "Horizontal Bar Chart With Chips",
                        type: 'content',
                        component: 'HorizontalBarChartWithChips',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Alternative Payment Models",
                type: 'page',
                children: [
                  {
                    name: "Alternative Payment Model Breakdown",
                    type: 'card',
                    children: [
                      {
                        name: "Top Tabs",
                        type: 'content',
                        component: 'UnderlinedTabs',
                      }
                    ]
                  }
                ]
              },
            ]
          },
          {
            name: "Accounts",
            type: 'dashboard',
            children: [
              {
                name: "Business Model & Capabilities",
                type: 'page',
                children: [
                  {
                    name: "Staffing",
                    type: 'card',
                    children: [
                      {
                        name: "PulseSimpleTable",
                        type: 'content',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Clinical Sophistication",
                type: 'page',
                children: [
                  {
                    name: "Clinical Designations",
                    type: 'card',
                    children: [
                      {
                        name: "Institutional Designations",
                        type: 'content',
                        component: 'StatTabularList',
                        props: {
                          listTitle: 'Institutional Designations'
                        }
                      }
                    ]
                  }
                ]
              },
              {
                name: "Value Based Care",
                type: 'page',
                children: [
                  {
                    name: "3rd Party & Internal Pathways",
                    type: 'card',
                    children: [
                      {
                        name: null,
                        component: "StatTabularList",
                        type: 'content',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Manufacturer Engagement",
                type: 'page',
                children: [
                  {
                    name: "Valued Data Sources & Education Resources",
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: "IconList",
                        props: {
                          listType: 'bulleted'
                        }
                      }
                    ]
                  }
                ]
              },
            ]
          },
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
                type: 'page',
                children: [
                  {
                    name: "Portfolio Quality of Access Summary",
                    type: 'card',
                    children: [
                      {
                        name: "Portfolio Quality of Access Summary",
                        type: 'content',
                        component: "PulseCardHeader",
                        props: {
                          title: "Portfolio Quality of Access Summary"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                name: "Quality of Access",
                type: 'page',
                children: [
                  {
                    name: "Quality of Access",
                    type: 'card',
                    children: [
                      {
                        name: "Top Tabs",
                        type: 'content',
                        component: 'Tabs',
                        children: [
                          {
                            name: "Access Overview",
                            type: "content",
                            component: "ColorLegend",
                            props: {
                              legendConfig: []
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                name: "Dupixent Relative Access",
                type: 'page',
                children: [
                  {
                    name: null,
                    type: 'card',
                    children: [
                      {
                        name: "Comparison Filter Bar",
                        type: 'content',
                        component: 'FilterBar',
                        props: {
                          filterOptions: []
                        }
                      }
                    ]
                  }
                ]
              },
              {
                name: "Competitive Access",
                type: 'page',
                children: [
                  {
                    name: null,
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: 'RegimenTabs',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Review Timing",
                type: 'page',
                children: [
                  {
                    name: 'Review Timing',
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: 'ReviewTimingChart',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Treatment Centers",
                type: 'page',
                children: [
                  {
                    name: 'FACT-Accredited Treatment Centers',
                    type: 'card',
                    children: [
                      {
                        name: 'Coverage Dropdown',
                        type: 'content',
                        component: 'Dropdown',
                      }
                    ]
                  }
                ]
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
                        id: 'ae3f',
                        name: 'Payer Nav Filter',
                        type: 'content',
                        component: 'PayerNavFilter',
                      },
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
                type: 'page',
                children: [
                  {
                    name: 'Payer Participation in Value-Based Models',
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: 'DoubleBarChart',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Strategic Accounts",
                type: 'page',
                children: [
                  {
                    name: 'Strategic Accounts',
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: 'StrategicAccounts',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Reports",
                type: 'page',
                children: [
                  {
                    name: 'PowerPoints & Excel Reports',
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: 'MultiColumnDropdown',
                      }
                    ]
                  }
                ]
              },
            ]
          },
          {
            name: "Accounts",
            type: 'dashboard',
            children: [
              {
                name: "Summary & Engagement",
                type: 'page',
                children: [
                  {
                    name: 'Account Summary: Dominant Quality of Access',
                    type: 'card',
                    children: [
                      {
                        name: "Product Dropdown",
                        type: 'content',
                        component: "Dropdown"
                      }
                    ]
                  }
                ]
              },
              {
                name: "Overview",
                type: 'page',
                children: [
                  {
                    name: "Payer Overview",
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: 'StatTabularList',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Management Capabilities",
                type: 'page',
                children: [
                  {
                    name: "Implemented Traditional Management",
                    type: 'card',
                    children: [
                      {
                        name: null,
                        component: "IconList",
                        type: 'content',
                      }
                    ]
                  }
                ]
              },
              {
                name: "Review Process",
                type: 'page',
                children: [
                  {
                    name: "Review Timing",
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: "Dropdown",
                      }
                    ]
                  }
                ]
              },
              {
                name: "Product Coverage",
                type: 'page',
                children: [
                  {
                    name: null,
                    type: 'card',
                    children: [
                      {
                        name: null,
                        type: 'content',
                        component: "PayerNavFilter",
                      }
                    ]
                  }
                ]
              },
            ]
          },
        ]
      }
    ]
  }
]

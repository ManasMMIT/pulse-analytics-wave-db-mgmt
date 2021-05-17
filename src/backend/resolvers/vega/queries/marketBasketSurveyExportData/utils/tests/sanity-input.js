const categories = [
  {
    id: 0,
    name: "EmptyCharTest",
    category_type: "product",
    characteristics_full: [],
  },
  {
    id: 1,
    name: "Product Category",
    category_type: "product",
    characteristics_full: [
      {
        id: 1,
        name: "Product Char 1",
      },
      {
        id: 2,
        name: "Product Char 2",
      }
    ],
  },
  {
    id: 2,
    name: "Regimen Category",
    category_type: "regimen",
    characteristics_full: [
      {
        id: 3,
        name: "Regimen Char 1",
      },
      {
        id: 4,
        name: "Regimen Char 2",
      }
    ],
  },
  {
    id: 3,
    name: "Manufacturer Category",
    category_type: "manufacturer",
    characteristics_full: [
      {
        id: 5,
        name: "Manufacturer Char 1",
      },
      {
        id: 6,
        name: "Manufacturer Char 2",
      }
    ],
  },
]

const productsRegimens = [
  {
    product: {
      id: 0,
      brand_name: "Prod A",
      generic_name: "Prod A Generic",
      manufacturers: [
        {
          id: 0,
          name: "Manufacturer A",
        }
      ],
      created_at: "2021-04-07T17:27:19.521063-04:00",
      updated_at: "2021-04-07T17:27:19.521104-04:00"
    },
    regimen: {
      id: 0,
      name: "Regimen A",
    }
  },
  {
    product: {
      id: 1,
      brand_name: "Prod B",
      generic_name: "Prod B Generic",
      manufacturers: [
        {
          id: 0,
          name: "Manufacturer A",
        },
        {
          id: 1,
          name: "Manufacturer B",
        },
      ],
    },
    regimen: {
      id: 1,
      name: "Regimen B",
    }
  },
]

const stakeholders = [
  { id: 0, first_name: 'Matt', last_name: 'The Law' },
  { id: 1, first_name: 'Joe', last_name: 'Star' },
]

const hydratedSurveyQuestionsAnswers = [
  {
    answers: [
      {
        id: '1337',
        rating: 22,
        question: {
          id: 0,
          category: 1,
          characteristic: 1,
          regimen: null,
          product: 1,
          manufacturer: null
        },
        stakeholder: {
          id: 0,
        }
      }
    ],
  }
]

module.exports = {
  categories,
  productsRegimens,
  stakeholders,
  hydratedSurveyQuestionsAnswers,
}

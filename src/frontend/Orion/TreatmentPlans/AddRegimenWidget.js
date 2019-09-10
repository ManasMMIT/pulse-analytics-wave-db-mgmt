import React from 'react'

const AddRegimenWidget = () => (
  <div>
    {/* <Query query={GET_SOURCE_REGIMENS}>
      {({ data: { regimens }, loading, error }) => {
        if (error) return <div style={{ color: 'red' }}>Error processing request</div>
        if (loading) return <Spinner />

        const options = regimens.map(({ name }) => ({ value: name, label: name }))

        return (
          <Select
            defaultValue={options[0]}
            // isMulti
            options={options}
          // className="basic-multi-select"
          // classNamePrefix="select"
          // onChange={arrOfVals => {
          //   let newProducts = arrOfVals || []

          //   newProducts = newProducts.map(({ value }) => {
          //     const { __typename, ...product } = productsByKey[value]
          //     return product
          //   })

          //   // ! HACK: Mock HTML event.target structure to get tags
          //   // ! able to written into TextForm's local state by handleChange
          //   handleChange({ target: { name: 'products', value: newProducts } })
          // }}
          />
        )
      }}
    </Query> */}
  </div>
)

export default AddRegimenWidget

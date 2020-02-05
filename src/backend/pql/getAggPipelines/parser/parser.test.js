const parser = require('./parser')

describe('correctly matches', () => {
  describe('single key with single value', () => {
    test(`w/ parens`, () => {
      const input = "organization = (5d825030cc80b15a9476b80f)"
      const output = ["organization = (5d825030cc80b15a9476b80f)"]
    
      expect(parser(input)).toEqual(output)
    })

    test(`w/o parens`, () => {
      const input = "organization = 5d825030cc80b15a9476b80f"
      const output = ["organization = 5d825030cc80b15a9476b80f"]
    
      expect(parser(input)).toEqual(output)
    })
  })
  
  describe('single key w/ multiple values', () => {
    test(`w/ parens`, () => {
      const input = "organization = (5d825030cc80b15a9476b80f,5d825030cc80b15a9476b810)"
      const output = ["organization = (5d825030cc80b15a9476b80f,5d825030cc80b15a9476b810)"]

      expect(parser(input)).toEqual(output)
    })

    test(`w/o parens`, () => {
      const input = "organization = 5d825030cc80b15a9476b80f,5d825030cc80b15a9476b810"
      const output = ["organization = 5d825030cc80b15a9476b80f,5d825030cc80b15a9476b810"]

      expect(parser(input)).toEqual(output)
    })
  })

  // TODO: test mix with orgTypes
})

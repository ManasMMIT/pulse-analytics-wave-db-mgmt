const setupDateStub = () => {
  global.Date = class extends Date {
    // override constructor to stub date object that is being called inside the Manager class
    constructor(...args) {
      if (args.length > 0) {
        return super(...args);
      }

      return new Date('2020-04-30T04:00:00.000+00:00')
    }
  }
}

module.exports = {
  setupDateStub
}
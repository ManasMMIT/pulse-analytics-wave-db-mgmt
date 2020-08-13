const accumulateTotal = (acc, result) => {
  let newTotals = []
  acc.forEach((total, idx) => {
    const newTotal = total + result.values[idx]
    newTotals.push(newTotal)
  })

  return newTotals
}

module.exports = {
  accumulateTotal,
}

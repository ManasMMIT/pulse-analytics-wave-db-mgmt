const therapeuticAreas = (parent, args, { pulseCoreDb }, info) =>
  pulseCoreDb.collection('therapeuticAreas').find().toArray()

module.exports = therapeuticAreas

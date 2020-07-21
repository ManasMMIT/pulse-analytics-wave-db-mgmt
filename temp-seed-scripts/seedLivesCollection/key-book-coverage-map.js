const { ObjectId } = require('mongodb')

module.exports = {
  commercialMedical: {
    bookId: ObjectId("5ea6ef76e4e250454c670a3e"),
    coverageId: ObjectId("5ebdafb51594eb3c26f4d562"),
  },
  commercialPharmacy: {
    bookId: ObjectId("5ea6ef76e4e250454c670a3e"),
    coverageId: ObjectId("5ebdafc81594eb3c26f4d563"),
  },
  ffsMedicaidMedical: {
    bookId: ObjectId("5ea6ef76e4e250454c670a3f"),
    coverageId: ObjectId("5ebdafb51594eb3c26f4d562"),
  },
  ffsMedicaidPharmacy: {
    bookId: ObjectId("5ea6ef76e4e250454c670a3f"),
    coverageId: ObjectId("5ebdafc81594eb3c26f4d563"),
  },
  macMedical: {
    bookId: ObjectId("5ea6ef76e4e250454c670a43"),
    coverageId: ObjectId("5ebdafb51594eb3c26f4d562"),
  },
  managedMedicaidMedical: {
    bookId: ObjectId("5ea6ef76e4e250454c670a40"),
    coverageId: ObjectId("5ebdafb51594eb3c26f4d562"),
  },
  managedMedicaidPharmacy: {
    bookId: ObjectId("5ea6ef76e4e250454c670a40"),
    coverageId: ObjectId("5ebdafc81594eb3c26f4d563"),
  },
  medicareMedical: {
    bookId: ObjectId("5ea6ef76e4e250454c670a41"),
    coverageId: ObjectId("5ebdafb51594eb3c26f4d562"),
  },
  medicarePharmacy: {
    bookId: ObjectId("5ea6ef76e4e250454c670a41"),
    coverageId: ObjectId("5ebdafc81594eb3c26f4d563"),
  },
  federalOtherMedical: {
    bookId: ObjectId("5ea6ef76e4e250454c670a42"),
    coverageId: ObjectId("5ebdafb51594eb3c26f4d562"),
  },
  federalOtherPharmacy: {
    bookId: ObjectId("5ea6ef76e4e250454c670a42"),
    coverageId: ObjectId("5ebdafc81594eb3c26f4d563"),
  },
  healthExchangePharmacy: {
    bookId: ObjectId("5ea6ef76e4e250454c670a45"),
    coverageId: ObjectId("5ebdafc81594eb3c26f4d563"),
  },
}

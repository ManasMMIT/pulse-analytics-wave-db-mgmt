const JSZip = require('jszip')
const fs = require('fs')

// Refactor function when there are more than two files that needs to be zipped
const zipFiles = ({
  fileContent1,
  fileContent2,
  fileName1,
  fileName2,
  zipFilePath
}) => {
  const zip = new JSZip()

  return new Promise((resolve, reject) => {
    zip.folder('tmp')
      .file(fileName1, fileContent1)
      .file(fileName2, fileContent2)
      .generateNodeStream({ type:'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(zipFilePath))
      .on('finish', () => {
        console.log('Zip File Written.')
        resolve()
      })
      .on('error', (err) => {
        console.err(err)
        reject()
      })
    })
}

const deleteFile = file => { 
  console.log(`Deleting file: ${ file }`)
  fs.unlink(file, err => {
      if (err) {
        console.error(err.toString());
      } else {
        console.warn(file + ' deleted');
      }
  })
}

module.exports = {
  zipFiles,
  deleteFile,
}
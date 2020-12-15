const json = require('./introspectionQueryRes.json');
const fs = require('fs');

// here we're filtering out any type information unrelated to unions or interfaces
const filteredData = json.data.__schema.types.filter(
  type => type.possibleTypes !== null,
);

json.data.__schema.types = filteredData;

fs.writeFileSync('./src/frontend/fragmentTypes.json', JSON.stringify(json.data), err => {
  if (err) {
    console.error('Error writing fragmentTypes file', err);
  } else {
    console.log('Fragment types successfully extracted!');
  }
});

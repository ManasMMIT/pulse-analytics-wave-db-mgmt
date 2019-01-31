# wave-db-mgmt

This repo is meant to eventually become Pulse's primary internal database management tool for importing and updating data in our database. For now, it contains just one custom script for uploading listsConfig JSONs.

## Before you do anything else

When you first clone this repo and `cd` into the root directory in your terminal, run `yarn` to install the packages required for this script.

In order for the script to connect to MongoDB, you'll also need to pull down the `dot-env` file from `/Dropbox/Tech-Group/pulse-analytics/env-variables/dot-env` and save it as `.env` in this directory.

##  Naming Convention for listsConfig JSON files

Any JSON file that's meant to be uploaded to the `listsConfig` collection must follow the following naming convention:

```
listsConfig_${ dashboard }_${ tool }.json
```

An example would be:
```
listsConfig_provider_immuno-oncology.json
```

Please note that the tool name can contain any letters but only the special character `-`, which should be used between words when a tool name comprises multiple words.

##  How to Run the Script

Run the following command in your terminal after navigating to this repository's root directory.
```
node index.js --filepath [string]
```

Example of the command if the file has been copied to your Desktop:
```
node index.js --filepath "/Users/jonlin/Desktop/listsConfig_provider_immuno-oncology.json"
```

Running the script will update a raw collection corresponding one-to-one to the JSON file and also update the master `listsConfig` collection, which is what our frontend application uses.

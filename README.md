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
node index.js --filepath /Users/jonlin/Desktop/listsConfig_provider_immuno-oncology.json
```

Running the script will update a raw collection corresponding one-to-one to the JSON file and also update the master `listsConfig` collection, which is what our frontend application uses.

##  Technical Background

The listsConfig script does the following when it's executed:
1. Consumes a JSON file and parses it into a format that can go into the DB
2. Manipulates the data by adding a `createdOn` timestamp and a `dashboardTool` key (extracted from the JSON's file name) to each listConfig object in the JSON
3. Connects to MongoDB pulse-dev DB
4. Replaces an existing (or creates a new) collection that corresponds one-to-one to the JSON (a raw data collection). This is done by dropping the existing collection if it exists and creating a new collection with the same name with the new data
5. Updates the master `listsConfig` collection in the database by replacing the old subset of data affiliated with the given `dashboardTool` with the new data

The purpose of keeping raw collections alongside the master `listsConfig` collection is we're trying to move toward creating a `pulse-raw` DB that's separate from the DB that our application uses. Having this separation would be beneficial because the way data is optimally structured for the business/product side is different from the way it'd be optimally structured for our application. Eventually, we'd want to move the raw collections created by this import script to a `pulse-raw` DB.

# wave-db-mgmt

This repo is meant to eventually become Pulse's primary internal database management tool for importing and updating data in our database. For now, it contains just two scripts:
- Script for uploading listsConfig JSONs
- Script for merging dashboard permissions data from pulse-core and pushing that to pulse-dev

## Before you do anything else

When you first clone this repo and `cd` into the root directory in your terminal, run `yarn` to install the packages required for this script.

In order for the script to connect to MongoDB, you'll also need to pull down the `dot-env` file from `/Dropbox/Tech-Group/pulse-analytics/env-variables/dot-env` and save it as `.env` in this directory.

#  Instructions for listsConfig Script

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
node ./importListsConfig --filepath ./hello.json
```

Example of the command if the file has been copied to your Desktop:
```
node ./importListsConfig --filepath /Users/jonlin/Desktop/listsConfig_provider_immuno-oncology.json
```

Example of the command if the file is in Egynte Connect on your computer:
```
node ./importListsConfig --filepath "/Volumes/maxine.presto@dedhamgroup.com/Shared/Pulse Analytics/Data/Provider/listsConfig_provider_key-accounts.json"
```

Running the script will update a raw collection corresponding one-to-one to the JSON file and also update the master `listsConfig` collection, which is what our frontend application uses.

##  Technical Background

The listsConfig script does the following when it's executed:
1. Consumes a JSON file and parses it into a format that can go into the DB
2. Manipulates the data by adding a `createdOn` timestamp and a `dashboardTool` key (extracted from the JSON's file name) to each listConfig object in the JSON
3. Connects to MongoDB pulse-dev DB
4. Replaces an existing (or creates a new) collection that corresponds one-to-one to the JSON (a raw data collection). This is done by dropping the existing collection if it exists and creating a new collection with the same name with the new data
5. Updates the master `listsConfig` collection in the database by replacing the old subset of data affiliated with the given `dashboardTool` with the new data

The purpose of keeping raw collections alongside the master `listsConfig` collection is we're trying to move using a `pulse-raw` DB that's separate from the DB that our application uses. Having this separation would be beneficial because the way data is optimally structured for the business/product side is different from the way it'd be optimally structured for our application. Eventually, we'd want to move the raw collections created by this import script to a `pulse-raw` DB.

#  Instructions for pushPermissionsFromCoreToDev Script

Run the following command in your terminal after navigating to this repository's root directory.
```
node ./pushPermissionsFromCoreToDev
```

If you want to run it with the debugger for Node DevTools, then run the following:
```
node --inspect ./pushPermissionsFromCoreToDev
```

##  Technical Background

The pushPermissionsFromCoreToDev script does the following when it's executed:
1. Fetches the `dashboards` collection from `pulse-core` DB and runs an aggregation pipeline on it. The pipeline unwinds, sorts, and groups the data by user _id before joining `dashboards` to `users`.
2. Writes the output from that aggregation pipeline to a collection called `users.dashboards` in `pulse-dev` DB. Will drop and replace that collection if needed.

Here's an example of the output:
```javascript
{
  "_id": "5c82d0878096663d0aebabd4",
  "username": "eli-lilly-prv-demo",
  "dashboards": [
    {
      "tool": "Accounts",
      "pages": [
        {
          "type": "Business Model & Capabilities",
          "_id": "5c819d3ea6e48daca81aa3a9"
        },
        {
          "type": "Clinical Sophistication",
          "_id": "5c819d3ea6e48daca81aa3aa"
        },
        {
          "type": "Value Based Care",
          "_id": "5c819d3ea6e48daca81aa3ab"
        },
        {
          "type": "Manufacturer Engagement",
          "_id": "5c819d3ea6e48daca81aa3ac"
        }
      ]
    },
    {
      "tool": "Management",
      "pages": [
        {
          "type": "Regional Footprint",
          "_id": "5c819cc05def33ac7de9452a"
        },
        {
          "type": "Site of Care Mix",
          "_id": "5c819cc05def33ac7de9452b"
        },
        {
          "type": "Internal Pharmacy",
          "_id": "5c819cc05def33ac7de9452c"
        },
        {
          "type": "Pathways",
          "_id": "5c819cc05def33ac7de9452d"
        },
        {
          "type": "Alternative Payment Models",
          "_id": "5c819cc05def33ac7de9452e"
        }
      ]
    }
  ]
}
```
#  Instructions for importAdminProviderIndRegCombos Script

Export the master list sheet from the Excel workbook as a CSV file.

Edit the CSV file so it looks like the below.

The column headers should be "indication" and "regimen," all lowercased.

| indication | regimen |
|---|---|---|
| AML | cytarabine+daunomycin+cladribine |
| Breast Cancer | Abraxane |

Run the following command in your terminal after navigating to this repository's root directory.
```
node ./importAdminProviderIndRegCombos --filepath ~/Desktop/provider_ind_reg_master.csv
```



# BEING EDITED -- WIP
# wave-csv-loaders

This repo houses the CSV loaders for historical data.

* Version 2 refers to a script that will import historical data from a project-based CSV file for a given project, month, year and collection.
* Version 1 refers to a script that will import historical data from a CSV file that contains data across all projects for a given month, year and collection.

**NOTE:** Both scripts skip the second and third rows of the CSV file upon import, which consist of the header row that consultants use and a type validation row that isn't being used for payer historical data.

```
Usage: node index.js --filepath [string]

Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --filepath[absolute path to CSV file]                                [required]
  --ignoreProjects                                                     [optional]

```

## Before you do anything else

To connect to MongoDB via the script, please pull down the `dot-env` file from `/Dropbox/Tech-Group/pulse-analytics/env-variables/dot-env` and save it as `.env` in this directory.

## How To Run the Scripts

The `index.js` script oversees whether to run the Version 1 script or the Version 2 script.

If you're importing a project-based workbook, then run the following in your terminal after replacing the filepath with the filepath to the appropriate CSV file on your own computer:
```
node index.js --filepath "/Users/jonlin/Desktop/Egnyte/Shared/Pulse Analytics/Data/Payer/Payer Historical Data/Project-Based/MerckAntiemetics/6-2018/MerckAntiemetics-QualityAccess-6-2018.csv"
```

If you're importing `payerHistoricalStateLives`, `payerHistoricalDrgNationalLives`, or old historical data that isn't
project-based, then run the same command but include the `--ignoreProjects` flag:

```
node index.js --filepath "/Users/jonlin/Desktop/payerHistoricalPolicyLinks-5-2018.csv" --ignoreProjects
```

## CSV File Naming Convention for Version 2 Import Script

Example of how the CSV file should be named: `MerckAntiemetics-QualityAccess-6-2018.csv`

The project name (`MerckAntiemetics`) and collection name (`QualityAccess`) must be UpperCamelCased without hyphens or any punctuation. Note that the collection name doesn't need to be preceded with `payerHistorical`; the code will automatically tack that onto the abbreviated collection name.

Month and year must be integers. All four parts of the string should then be concatenated with a `-` delimiter.

This script would update documents in the collection `payerHistoricalQualityAccess` that are associated with project `Merck Antiemetics`, month `6`, and year `2018`.

## CSV File Naming Convention for Version 1 Import Script

Example of how the CSV file should be named: `payerHistoricalQualityOfAcess-1-2018.csv`

This script would update the collection `payerHistoricalQualityOfAccess` for month `1` and year `2018`. Note that the full name of the collection must be stated in the file name.

## Syncing Medical Lives between DRG and MMIT lives data set

The `sync-drg-mmit-medical-lives.js` script will:
1. append the medical lives with the latest month and year from the DRG data to the existing mongoDB documents with the latest month and year in the MMIT data set
2. insert mongoDB documents with the latest month and year from the DRG data set for states that don't exist for organizations in the MMIT data set

To run the script, simply execute `node sync-drg-mmit-medical-lives`

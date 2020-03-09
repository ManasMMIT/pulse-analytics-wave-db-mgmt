# wave-db-mgmt

This repo is meant to eventually become Pulse's primary internal database management tool for importing and updating data in our database. It currently contains five scripts for the following purposes:
1. [Uploading CSV historical data to pulse-dev](#1-uploading-historical-data)
    1. [Historical Import Quick Guide](#historical-import-quick-guide)
        1. [Importing Payer Project Historical Data](#importing-payer-project-historical-data)
        2. [Importing Payer Lives](#importing-payer-lives)
2. [Uploading listsConfig JSONs to pulse-dev](#2-uploading-listsconfig-jsons)
3. [Updating Dashboards Permissions Prototype Collection on Dev](#3-updating-dashboards-permissions-prototype-on-dev)
4. [Exporting Novartis CSV Data](#4-exporting-novartis-csv-data)
5. [Phoenix](#5-phoenix)

# Before you do anything else

When you first clone this repo and `cd` into the root directory in your terminal, run `yarn` to install the packages required for this script.

In order for the script to connect to MongoDB, you'll also need to pull down the `dot-env` file from `/Dropbox/Tech-Group/pulse-analytics/env-variables/dot-env` and save it as `.env` in this directory.

#  1. Uploading Historical Data

##  Historical Import Quick Guide
Make sure that all sheets have been exported in the CSV format AND have the correct filename.

###  Importing Payer Project Historical Data
Sheets affected:
* QualityAccess
* AdditionalCriteria
* PolicyLinks

Run the following command: `node ./importHistoricalData --filepath replaceWithLocalFilepath`
**Note: It takes several minutes to import each sheet.**

If you're importing multiple CSVs and you don't need to consolidate payer data (the most time-costly step) until the last CSV, then add the flag `--ignoreConsolidatePayerData` to the end of the terminal command to avoid that step. And then when you're about to import the last CSV, take the flag off so the consolidation can happen.

###  Importing Payer Lives
Sheets affected:
* payerHistoricalDrgNationalLives
* payerHistoricalDrgStateLives
* payerHistoricalMmitNationalLives
* payerHistoricalMmitStateLives

Run the following command: `node ./importHistoricalData --filepath replaceWithLocalFilepath --ignoreProjects`

## File Naming Convention for Project-Based Data

Example of how the CSV file should be named: `MerckAntiemetics-QualityAccess-6-2018.csv`

The project name (`MerckAntiemetics`) and collection name (`QualityAccess`) must be UpperCamelCased without hyphens or any punctuation. Note that the collection name doesn't need to be preceded with `payerHistorical`; the code will automatically tack that onto the abbreviated collection name.

Month and year must be integers. All four parts of the string should then be concatenated with a `-` delimiter.

This script would update documents in the collection `payerHistoricalQualityAccess` that are associated with project `Merck Antiemetics`, month `6`, and year `2018`.

## File Naming Convention for Non-Project-Based Data

Example of how the CSV file should be named: `payerHistoricalQualityOfAcess-1-2018.csv`

This script would update the collection `payerHistoricalQualityOfAccess` for month `1` and year `2018`. Note that the full name of the collection must be stated in the file name.

## How to Run the Script

**NOTE:** The script keys the data using the first row of headers, and then skips the second and third rows before it begins to parse the data.

If you're importing a **project-based workbook**, then run the following in your terminal after you export the target sheet to a CSV file.

Replace the filepath with the filepath to the appropriate CSV file on your own computer.

```
node ./importHistoricalData --filepath "/Users/jonlin/Desktop/Egnyte/Shared/Pulse Analytics/Data/Payer/Payer Historical Data/Project-Based/MerckAntiemetics/6-2018/MerckAntiemetics-QualityAccess-6-2018.csv"
```

Adding the flag `--ignoreConsolidatePayerData` will result in skipping the payer data consolidation step used to keep the regional targeting feature's data up to date. 

### Importing Payer Lives Data (and other older non-project-based historical data)

If you're importing data such as `payerHistoricalMmitStateLives`, `payerHistoricalDrgNationalLives`, or other historical data that isn't
project-based, then run the same command but include the `--ignoreProjects` flag:

```
node ./importHistoricalData --filepath ~/Desktop/payerHistoricalMmitStateLives-9-2018.csv --ignoreProjects
```

#### Syncing MMIT State Medical Lives
The MMIT Lives provided by Regeneron either does not contain or contains sparce medical lives data for each payer. To solve this we created a script that fills in the missing medical state lives. **This does not fill in missing medical NATIONAL Lives**

The `syncDrgMmitMedicalLives` script automatically executes on pulse-core whenever MMIT lives are imported into pulse-core (but before the latest month/year MMIT lives data is pushed to pulse-dev, and before the MMIT totals collection is calculated).

That script does the following:
1. gets the latest month/year DRG lives but limits that data to the slugs found in the latest month/year MMIT lives set
2. if a given slug/state combo in the DRG lives data from step 1 is found in the latest month/year MMIT lives set, then that MMIT lives row is updated to have a copy of the DRG medical lives (the pharmacy lives are left untouched)
3. if a given slug/state combo in the DRG lives data from step 1 CANNOT be found in the latest month/year MMIT lives set, then that DRG row is copied over with only medical lives into the MMIT lives data


#  2. Uploading listsConfig JSONs

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

#  3. Updating Dashboards Permissions Prototype on Dev

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
```json
{
  "_id": "5c8949bfd4b1e206ee6afeec",
  "username": "eli-lilly-prv-demo",
  "dashboards": [
    {
      "dashboard": "Management",
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
    },
    {
      "dashboard": "Accounts",
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
    }
  ]
}
```

# 4. Exporting Novartis CSV Data

1. Go to http://polaris.pulse-tools.com/orion/data-management/export-custom-data
2. Click on the download button for novartis csv

Refer to [this Conf doc for specs](https://dedhamgroup.atlassian.net/wiki/spaces/PAD/pages/659521555/Kymriah+CSV+Export).

# 5. Phoenix
Phoenix controls and manages all permissions in the Pulse Analytics application. It is the 2nd iteration of permission management. The pervious version was Admin Hub delivered in March 2018.

## Starting Phoenix Locally
Start the server:
```
yarn phoenix
```
Start the front-end app:
```
yarn start
```
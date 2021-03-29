# Polaris

[Polaris](https://app.gitbook.com/@pulse-digital/s/project-polaris/) is Pulse's primary internal tool for managing permissions and data in our database. The application currently comprises:
- `Phoenix`: Permissions management
- `Orion`: Database and business object management, as well as import and export tools
- `Delphi`: Emailing clients
- `Payer Project Management`: Importing payer historical access and lives data, as well as managing which projects "own" which PTPs (payer treatment plan combinations)

# Before you do anything else

When you first clone this repo and `cd` into the root directory in your terminal, run `yarn` to install the packages required for this script.

In order for the script to connect to MongoDB, you'll also need a `.env` file. Contact the backend team to get a copy of that file.

Also, make sure you have the `src/backend/logs/api.log` file created prior to starting the application. This file is gitignored and also dockerignored.

# Running the application locally WITHOUT Docker

1. Change the `PROXY_URL` value in your `.env` file to `http://localhost:1337`.
2. Run the following commands in separate terminal windows:

Start the server:
```
yarn phoenix
```
Start the front-end app:
```
yarn start
```

# Running the application locally WITH Docker

1. Change the `PROXY_URL` value in your `.env` file to `http://polaris_api:1337`
2. Make sure you have Docker installed on your computer (Refer to https://docs.docker.com/docker-for-mac/install/ for instructions).
3. To run the containers in a single terminal window, refer to the command below:

```bash
docker-compose -f docker-compose.dev.yml up
```

4. To run the containers in detach mode so that logging can be viewed in separate terminal windows, refer to the command below:

```bash
docker-compose -f docker-compose.dev.yml up -d

# Run the following command in terminal window 1
docker logs -f polaris_app

# Run the following command in terminal window 2
docker logs -f polaris_api
```

5. Please refer to https://app.gitbook.com/@pulse-digital/s/engineering-handbook/devops/docker-development-workflow for instructions on how to work with containers in a local environment.

# Standalone scripts

While most operations can be done in-browser in the application, there are a few standalone scripts left for uploading and manipulating data.

## Uploading listsConfig JSONs

###  Naming Convention for listsConfig JSON files

Any JSON file that's meant to be uploaded to the `listsConfig` collection must follow the following naming convention:

```
listsConfig_${ dashboard }_${ tool }.json
```

An example would be:
```
listsConfig_provider_immuno-oncology.json
```

Please note that the tool name can contain any letters but only the special character `-`, which should be used between words when a tool name comprises multiple words.

###  How to Run the Script

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

###  Technical Background

The listsConfig script does the following when it's executed:
1. Consumes a JSON file and parses it into a format that can go into the DB
2. Manipulates the data by adding a `createdOn` timestamp and a `dashboardTool` key (extracted from the JSON's file name) to each listConfig object in the JSON
3. Connects to MongoDB pulse-dev DB
4. Replaces an existing (or creates a new) collection that corresponds one-to-one to the JSON (a raw data collection). This is done by dropping the existing collection if it exists and creating a new collection with the same name with the new data
5. Updates the master `listsConfig` collection in the database by replacing the old subset of data affiliated with the given `dashboardTool` with the new data

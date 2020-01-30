## Pipe Delimited Script
This repo contains the JS script to export data to pipe delimited values

Please see the specifications in the link below:
https://dedhamgroup.atlassian.net/wiki/spaces/PAD/pages/417431553/Spec+Generating+Flat+Files

### Before you do anything else
To get started, pull down the dot-env file from `/Dropbox/Tech-Group/pulse-analytics/env-variables/dot-env` and save it as `.env` within this directory so you can connect to the mongo server.

### Database
The script pulls data from the development database `pulse-dev`. This is noted in the `export-to-pipe-values.js` file. You can change the database the script points to by changing line 21 in the `export-to-pipe-values.js` file from `pulse-dev` to `pulse-prod`.

### Exporting to CSV and PSV
1. Run `npm run start` in this directory in your terminal
2. Check if the `DEDHAM_PYR_ACCESS_{DATE}.csv` and `DEDHAM_PYR_ACCESS_{DATE}.txt` files have appeared in your directory

The `.txt` file contains the pipe delimited values while the `.csv` file can be used for quality assurance purposes

### DEV Mode
To run the script in development mode with logging enabled, run the following:
```
npm run start-dev
```

Open node dev-tool and you should see the data being logged in the console.

Every time you hit `CMD + S`, the server will restart and the DB will be requeried, thanks to nodemon.

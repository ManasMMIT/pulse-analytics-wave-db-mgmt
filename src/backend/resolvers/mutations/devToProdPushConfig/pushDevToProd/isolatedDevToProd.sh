# No need to import environmental variables from .env
# Ref: https://unix.stackexchange.com/questions/495161/import-environment-variables-in-a-bash-script

# Use this so any command that fails will cause the entire script to fail.
# Ref: https://stackoverflow.com/questions/1378274/in-a-bash-script-how-can-i-exit-the-entire-script-if-a-certain-condition-occurs
set -e 

# set up a clean_up func that'll remove the ./current-dump at the end of the script,
# whether there's an error OR after script runs 'till completion;
# Ref: https://stackoverflow.com/a/36335414
clean_up () {
  ARG=$? # $? is the exit code of the last op; save it to ARG
  rm -rf ./current-dump
  exit $ARG
}

trap clean_up EXIT

echo "isolatedDevToProd script beginning against $DB_CLUSTER_ENV cluster"

echo "Dumping pulse-dev collections into current-dump folder..."

if [ $DB_CLUSTER_ENV == 'production' ]
then
  HOST='wave-shard-0/wave-shard-00-00-ik4h2.mongodb.net:27017,wave-shard-00-01-ik4h2.mongodb.net:27017,wave-shard-00-02-ik4h2.mongodb.net:27017'
elif [ $DB_CLUSTER_ENV == 'staging' ]
then
  HOST='wave-staging-shard-0/wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017'
elif [ $DB_CLUSTER_ENV == 'local' ]
then
  HOST='localhost:27017'
else
  HOST='wave-staging-shard-0/wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017'
fi

# For variable number of arguments, use "$@": https://www.lifewire.com/pass-arguments-to-bash-script-2200571
# We need to dump the collections one at a time; no batch dumping.
# Ref: http://tech.tulentsev.com/2012/03/how-to-dump-your-mongodb-database-partially-only-selected-tables/
for COLLECTION_NAME in "$@"
do
  echo "Dumping $COLLECTION_NAME into current-dump folder..."

  mongodump \
    --host $HOST \
    --ssl \
    --username pulse-admin \
    --password $MONGO_KEY \
    --authenticationDatabase admin \
    --db pulse-dev \
    --collection $COLLECTION_NAME \
    --out ./current-dump
done

echo "Dumping completed successfully"

echo "Restoring dumped collections to pulse-prod DB..."

mongorestore \
  --host $HOST \
  --ssl \
  --username pulse-admin \
  --password $MONGO_KEY \
  --authenticationDatabase admin \
  --db pulse-prod ./current-dump/pulse-dev \
  --drop \

echo "Restoring completed successfully"

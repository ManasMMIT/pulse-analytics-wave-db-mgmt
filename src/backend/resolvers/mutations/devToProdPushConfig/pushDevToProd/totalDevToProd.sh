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
  rm -f ./vega-core.dump
  exit $ARG
}

trap clean_up EXIT

echo "totalDevToProd script beginning on MongoDB $DB_CLUSTER_ENV cluster and AWS PostgreSQL"

# WARNING: use single =, not double == because on Ubuntu server, 'sh' not okay with double ==
# Ref: https://stackoverflow.com/a/3411105
if [ $DB_CLUSTER_ENV = 'production' ]
then
  HOST='wave-shard-0/wave-shard-00-00-ik4h2.mongodb.net:27017,wave-shard-00-01-ik4h2.mongodb.net:27017,wave-shard-00-02-ik4h2.mongodb.net:27017'
elif [ $DB_CLUSTER_ENV = 'staging' ]
then
  HOST='wave-staging-shard-0/wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017'
elif [ $DB_CLUSTER_ENV = 'local' ]
then
  HOST='localhost:27017'
else
  HOST='wave-staging-shard-0/wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017'
fi

echo "MONGODB: Dumping pulse-dev DB into current-dump folder..."

mongodump \
  --host $HOST \
  --ssl \
  --username $MONGO_USERNAME \
  --password $MONGO_PASSWORD \
  --authenticationDatabase admin \
  --db pulse-dev \
  --excludeCollection exportQueue \
  --excludeCollection users \
  --out ./current-dump

echo "MONGODB: Dumping completed successfully"

echo "MONGODB: Restoring pulse-dev DB to pulse-prod DB..."

mongorestore \
  --host $HOST \
  --ssl \
  --username $MONGO_USERNAME \
  --password $MONGO_PASSWORD \
  --authenticationDatabase admin \
  --db pulse-prod ./current-dump/pulse-dev \
  --drop \

echo "MONGODB: Restoring completed successfully"

# get current directory: https://stackoverflow.com/a/20434740/10957842
DIR="$( cd "$( dirname "$0" )" && pwd )"

sh "${DIR}/../psqlPushCoreToProd/dumpCoreRestoreProd.sh"

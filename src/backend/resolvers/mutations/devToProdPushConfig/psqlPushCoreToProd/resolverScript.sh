# Use this so any command that fails will cause the entire script to fail.
# Ref: https://stackoverflow.com/questions/1378274/in-a-bash-script-how-can-i-exit-the-entire-script-if-a-certain-condition-occurs
set -e 

# set up a clean_up func that'll remove vega-core.dump at the end of the script,
# whether there's an error OR after script runs 'till completion;
# Ref: https://stackoverflow.com/a/36335414
clean_up () {
  ARG=$? # $? is the exit code of the last op; save it to ARG
  rm -f ./vega-core.dump
  exit $ARG
}

trap clean_up EXIT

# get current directory: https://stackoverflow.com/a/20434740/10957842
DIR="$( cd "$( dirname "$0" )" && pwd )"

sh "${DIR}/dumpCoreRestoreProd.sh"

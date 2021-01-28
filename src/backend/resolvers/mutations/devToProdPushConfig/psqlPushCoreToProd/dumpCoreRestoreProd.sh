echo "PSQL: Dump and restore script beginning against AWS vega-1 server"

echo "PSQL: Dumping pulse-core collections into vega-core.dump..."

pg_dump -Fc -v --host=vega-1.cds8evf2mvm3.us-east-1.rds.amazonaws.com --username=pulseadmin --dbname=vega-core -f vega-core.dump

echo "PSQL: Finished dumping"

### FOR NOW: Decided NOT to drop and create because `dropdb` requires no other users be connected.
### Instead, decided to use --clean --if-exists on pg_restore (which will drop any overlapping tables before restoring)
### but unf will leave any right side deprecated/garbage tables.

# echo "PSQL: Dropping vega-prod database"

# dropdb --host=vega-1.cds8evf2mvm3.us-east-1.rds.amazonaws.com --port=5432 --username=pulseadmin --maintenance-db=vega-core vega-prod

# echo "PSQL: Create blank vega-prod database"  

# createdb --host=vega-1.cds8evf2mvm3.us-east-1.rds.amazonaws.com --port=5432 --username=pulseadmin --maintenance-db=vega-core vega-prod

echo "PSQL: Restore vega-core.dump to vega-prod database"

pg_restore -v --no-owner --host=vega-1.cds8evf2mvm3.us-east-1.rds.amazonaws.com --port=5432 --username=pulseadmin --dbname=vega-prod --clean --if-exists vega-core.dump

echo "PSQL: SUCCESS: Restored to vega-prod"

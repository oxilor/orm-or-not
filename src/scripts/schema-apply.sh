#!/bin/sh

source src/scripts/config.sh

docker run --rm --net=host -it -v "${SCHEMA_PATH}":/schema.sql oxilor/dsm apply \
  --uri $POSTGRES_URI \
  --to /schema.sql \
  --unsafe

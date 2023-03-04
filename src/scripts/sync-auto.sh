#!/bin/sh

source src/scripts/config.sh

docker run --rm --net=host -v "${SCHEMA_PATH}":/schema.sql arigaio/atlas schema apply \
  --url $ATLAS_URL \
  --dev-url $ATLAS_DEV_URL \
  --to file://schema.sql \
  --auto-approve

#!/bin/sh

source src/scripts/config.sh

docker run --rm --net=host -it -v "${MIGRATIONS_PATH}":/migrations arigaio/atlas migrate new "$@" \
  --dir file://migrations

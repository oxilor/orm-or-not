#!/bin/sh

# The path to your database schema
SCHEMA_PATH="${PWD}/src/schema.sql"

POSTGRES_URL="postgres://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}"
ATLAS_URL="${POSTGRES_URL}/${POSTGRES_DATABASE}?sslmode=disable"
ATLAS_DEV_URL="${POSTGRES_URL}/atlas?sslmode=disable"

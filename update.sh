#!/bin/bash
#
APP="pipolog"
HOSTPORT="5051"
PORT="8888"
NETWORK="${APP}-network"

#  --mount type=bind,source="$(pwd)"/media,target=/usr/src/app/client/dist/media \

git pull
docker build -t "$APP" .
docker stop "$APP"
docker rm "$APP"
docker run -d -p "${HOSTPORT}:${PORT}" \
  --network "$NETWORK" \
  --restart unless-stopped \
  --name "$APP" \
  "$APP"

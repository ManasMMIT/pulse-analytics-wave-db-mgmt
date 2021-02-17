#!/bin/sh

set -e

echo "Stopping all existing containers"

docker stop $(docker ps -a -q) || true

echo "Removing all existing containers"
docker rm $(docker ps -a -q) || true

echo "Removing existing image"
docker rmi -f $(docker images -a -q) || true

echo "Pulling image from Registry"
docker pull "$REGISTRY/$REGISTRY_REPO_NAME:$IMAGE_TAG" || true

echo "Running Container"
docker-compose -p $CONTAINER_NAME -f $COMPOSE_FILE up -d
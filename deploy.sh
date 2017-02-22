#!/bin/bash
git checkout master
git fetch --all
git reset --hard origin/master

docker-compose -f docker-compose-prod.yml build
docker-compose -f docker-compose-prod.yml restart

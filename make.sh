#!/usr/bin/env bash
osm2pgsql --create --database skytruth $1 -H localhost -r pbf

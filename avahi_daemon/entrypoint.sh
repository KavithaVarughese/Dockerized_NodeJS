#!/bin/bash

set -e
service dbus start
service avahi-daemon start
sleep 5s
avahi-publish -s rasspb170_1-airplay-srv-host _airplay._tcp 1 rasspb170_1-airplay-txt-host
exec "$@"



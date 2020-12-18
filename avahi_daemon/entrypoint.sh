#!/bin/bash

set -e
service dbus start
service avahi-daemon start
bash avahi/start.sh &
tail -F /dev/null
exec "$@"



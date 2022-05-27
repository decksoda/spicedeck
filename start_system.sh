#!/bin/bash
cd ~/homebrew/plugins/SpiceDeck

export DISPLAY=:0
export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
export XDG_RUNTIME_DIR=/run/user/1000

./SpiceDeckServer
#!/bin/bash
echo "Checking if 'Deno' is installed..."

DENO_ARGS="--allow-net --allow-env --allow-read --allow-write --allow-run"

if [ ! -f "$HOME/.deno/bin/deno" ]; then
  echo "Installing 'Deno'..."
  curl -fsSL https://deno.land/x/install/install.sh | sh
fi

cd server

if [ "$1" = "run" ]; then
  echo "Starting server..."
  ~/.deno/bin/deno run $DENO_ARGS server.js
else
  echo "Building SpiceDeck..."
  rm -rf server
  ~/.deno/bin/deno compile $DENO_ARGS server.js
  cd ..

  rm -rf /tmp/SpiceDeck
  mkdir /tmp/SpiceDeck 
  cp -r * /tmp/SpiceDeck 
  cp /tmp/SpiceDeck/server/server /tmp/SpiceDeck/SpiceDeckServer
  rm -rf /tmp/SpiceDeck/server /tmp/SpiceDeck/build.sh

  CURRENT_DIR=$PWD
  cd /tmp/SpiceDeck

  for file in $(ls *); do zip ../SpiceDeck.zip $file; done
  cp ../SpiceDeck.zip $CURRENT_DIR

  cd $CURRENT_DIR 
  rm -rf /tmp/SpiceDeck*
fi
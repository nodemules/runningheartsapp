#!/bin/bash
export PATH=$PATH:$HOME/Code/runningheartsapp/app/util
#DEV
DIR=$HOME/Code/runningheartsapp/app/util

#######################################################
FILENAME=$1;
echo "Using $FILENAME..."
if [ -z ${FILENAME+x} ]
then
  echo "Must Enter a File Name!"
  exit 1
fi

node $DIR/playerLoader.js $FILENAME
node $DIR/venueLoader.js $FILENAME
node $DIR/eventLoader.js $FILENAME
node $DIR/gamesLoader.js $FILENAME
node $DIR/addGamesToEvents.js $FILENAME
node $DIR/addPlayersToGames.js $FILENAME
node $DIR/misc.js

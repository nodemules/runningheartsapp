{
  var mongoose = require('mongoose');
  var moment = require('moment-timezone');

  function exports() {
    return {
      GLOBAL: {
        lookupEvents: {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event'
          }
        },
        unwindEvents: {
          $unwind: {
            path: '$event'
          }
        },
        matchEvent: {
          '$match': {
            'event.statusId': 1
          }
        },
        lookupVenues: {
          $lookup: {
            from: 'venues',
            localField: 'event.venue',
            foreignField: '_id',
            as: 'venue'
          }
        },
        unwindVenues: {
          $unwind: {
            path: '$venue'
          }
        },
        matchVenue: {
          '$match': {
            'venue.statusId': 1
          }
        },
        unwindTds: {
          $unwind: {
            path: '$venue.td',
            preserveNullAndEmptyArrays: true
          }
        },
        lookupTds: {
          $lookup: {
            from: 'players',
            localField: 'venue.td',
            foreignField: '_id',
            as: 'venue.td'
          }
        },
        group: {
          $group: {
            _id: '$venue._id',
            venue: {
              $addToSet: {

                _id: '$venue._id',
                name: '$venue.name',
                td: '$venue.td',
                time: '$venue.time',
                day: '$venue.day',
                numberOfGames: '$venue.numberOfGames',
              }
            },
            events: {
              $addToSet: {
                _id: '$event._id',
                date: '$event.date',
                completed: '$event.completed',
                td: '$event.td'
              }
            },
            games: {
              $addToSet: {
                _id: '$_id',
                completed: '$completed',
                inProgress: '$inProgress',
                players: '$players',
                event: '$event',
                number: '$number'
              }
            }
          }
        },
        finalGroup: {
          $group: {
            _id: '$venue._id',
            td: {
              $push: '$venue.td'
            },
            venue: {
              $addToSet: {
                name: '$venue.name',
                time: '$venue.time',
                day: '$venue.day',
                numberOfGames: '$venue.numberOfGames',
                gamesPlayed: {
                  $size: '$games'
                }
              }
            },
            events: {
              $push: '$events'
            }
          }
        },
        project: {
          $project: {
            _id: '$_id',
            name: '$venue.name',
            time: '$venue.time',
            day: '$venue.day',
            numberOfGames: '$venue.numberOfGames',
            td: '$td',
            events: '$events',
            gamesPlayed: '$venue.gamesPlayed'
          }
        }

      }
    }

  }

  module.exports = exports;
}

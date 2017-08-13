{
  var mongoose = require('mongoose');
  var moment = require('moment-timezone');

  function exports() {
    return {
      GLOBAL: {
        matchVenue: {
          '$match': {
            'venue.statusId': 1
          }
        },
        unwindVenues: {
          $unwind: {
            path: '$venue'
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
        }
      },
      GET_VENUES_WITH_EVENTS: {
        lookupVenues: {
          $lookup: {
            from: 'venues',
            localField: 'venue',
            foreignField: '_id',
            as: 'venue'
          }
        },
        group: {
          $group: {
            _id: '$venue._id',
            venue: {
              $addToSet: '$venue'
            },
            events: {
              $addToSet: {
                _id: '$_id',
                date: '$date',
                completed: '$completed'
              }
            }
          }
        },
        project: {
          $project: {
            _id: '$venue._id',
            numberOfGames: '$venue.numberOfGames',
            name: '$venue.name',
            day: '$venue.day',
            time: '$venue.time',
            td: '$td',
            events: '$events'
          }
        }
      },
      GET_VENUES_WITH_GAMES: {
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
            // events: '$events',
            gamesPlayed: '$venue.gamesPlayed'
          }
        }

      }
    }

  }

  module.exports = exports;
}

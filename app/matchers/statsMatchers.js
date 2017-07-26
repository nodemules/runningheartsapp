{
  var mongoose = require('mongoose');
  var moment = require('moment-timezone');

  function exports() {
    return {
      GLOBAL: {
        unwind: {
          '$unwind': {
            'path': '$players'
          }
        },
        group: {
          '$group': {
            '_id': '$players.player',
            'totalPoints': {
              '$sum': '$players.score'
            },
            'averageRank': {
              '$avg': '$players.rank'
            },
            'bestRank': {
              '$min': '$players.rank'
            },
            'worstRank': {
              '$max': '$players.rank'
            },
            'shoutOuts': {
              '$first': '$players.shoutOuts'
            },
            'totalWins': {
              $sum: {
                $cond: [{
                  $eq: ['$players.rank', 1]
                }, 1, 0]
              }
            },
            'games': {
              $push: {
                '_id': '$_id',
                'score': '$players.score',
                'rank': '$players.rank',
                'event': '$event',
                'gameNumber': '$number',
                'gameStartTime': '$startTime',
                'completed': '$completed',
                'inProgress': '$inProgress',
                'finalTable': '$finalTable',
                'cashedOutTime': '$players.cashedOutTime'
              }
            }
          }
        },
        project: {
          '$project': {
            '_id': '$_id',
            'name': '$player.name',
            'isTd': '$player.isTd',
            'statusId': '$player.statusId',
            'totalPoints': '$totalPoints',
            'totalWins': '$totalWins',
            'bonusChips': {
              $multiply: [{
                $floor: {
                  $divide: ['$totalPoints', 10]
                }
              }, 100]
            },
            'averageRank': '$averageRank',
            'bestRank': '$bestRank',
            'worstRank': '$worstRank',
            'games': '$games'
          }
        },
        sort: {
          '$sort': {
            'startTime': -1
          }
        },
        lookupPlayer: {
          '$lookup': {
            from: 'players', //<collection to join>,
            localField: '_id', //<field from the input documents>,
            foreignField: '_id', //<field from the documents of the "from" collection>,
            as: 'player' //<output array field>
          }
        },
        lookupEvent: {
          '$lookup': {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event'
          }
        },
        lookupVenue: {
          '$lookup': {
            from: 'venues',
            localField: 'event.venue',
            foreignField: '_id',
            as: 'event.venue'
          }
        },
        unwindPlayer: {
          '$unwind': {
            'path': '$player'
          }
        },
        unwindEvent: {
          '$unwind': {
            'path': '$event'
          }
        },
        unwindVenue: {
          '$unwind': {
            'path': '$event.venue'
          }
        },
        matchEvent: {
          '$match': {
            'event.statusId': 1
          }
        }
      },
      GET_PLAYER_STATS: {
        match: function(id) {
          return {
            '$match': {
              'players.player': mongoose.Types.ObjectId(id),
              'completed': true
            }
          }
        }
      },
      GET_ALL_PLAYER_STATS: {
        match: function() {
          return {
            '$match': {
              'completed': true
            }
          }
        },
        sortBy: {
          '$sort': {
            'totalPoints': -1,
            'averageRank': 1
          }
        }
      },
      GET_SEASON_PLAYER_STATS: {
        match: function(startTime, endTime) {
          var match = {
            '$match': {
              'startTime': {
                '$gte': moment(startTime).toDate()
              },
              'completed': true
            }
          }

          if (endTime) {
            match.$match.startTime.$lt = moment(endTime).toDate()
          }
          console.log(match)
          return match;
        },
        sortBy: {
          '$sort': {
            'totalPoints': -1,
            'averageRank': 1
          }
        }
      },
      GET_WINNERS: {
        match: function() {
          return {
            '$match': {
              'completed': true
            }
          }
        },
        group: {
          '$group': {
            '_id': '$players.player',
            'totalPoints': {
              '$sum': '$players.score'
            }
          }
        },
        project: {
          '$project': {
            '_id': '$_id',
            'name': '$player.name',
            'totalPoints': '$totalPoints',
          }
        },
        sort: {
          '$sort': {
            'totalPoints': -1
          }
        },
        limit: {
          '$limit': 5
        }
      }
    }
  }

  module.exports = exports;
}

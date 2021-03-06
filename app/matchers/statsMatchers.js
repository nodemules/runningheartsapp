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
            'shoutOuts': {
              '$first': '$players.shoutOuts'
            },
            'best': {
              '$min': '$players.rank'
            },
            'average': {
              '$avg': '$players.rank'
            },
            'worst': {
              '$max': '$players.rank'
            },
            'firsts': {
              $sum: {
                $cond: [{
                  $eq: ['$players.rank', 1]
                }, 1, 0]
              }
            },
            'seconds': {
              $sum: {
                $cond: [{
                  $eq: ['$players.rank', 2]
                }, 1, 0]
              }
            },
            'thirds': {
              $sum: {
                $cond: [{
                  $eq: ['$players.rank', 3]
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
            'shoutOuts': '$player.shoutOuts',
            'totalPoints': '$totalPoints',
            'bonusChips': {
              $multiply: [{
                $floor: {
                  $divide: ['$totalPoints', 10]
                }
              }, 100]
            },
            'ranks': {
              'best': '$best',
              'worst': '$worst',
              'average': '$average',
              'firsts': '$firsts',
              'seconds': '$seconds',
              'thirds': '$thirds'
            },
            'gamesPlayed': {
              '$size': '$games'
            }
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
        matchPlayer: {
          '$match': {
            'player.statusId': 1
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
      GET_SEASON_STATS: {
        match: function(startTime, endTime) {
          var match = {
            '$match': {
              'startTime': {
                '$gte': moment(startTime).toDate()
              },
              'statusId': 1,
              'completed': true,
              'players': {
                '$ne': []
              }
            }
          };

          if (endTime) {
            match.$match.startTime.$lt = moment(endTime).toDate();
          }
          return match;
        },
        group: {
          '$group': {
            '_id': 0,
            'games': {
              '$push': {
                '_id': '$_id'
              }
            }
          }
        },
        project: {
          '$project': {
            'gamesPlayed': {
              '$size': '$games'
            }
          }
        }
      },
      GET_PLAYER_STATS: {
        match: function(id, season) {
          var match = {
            '$match': {
              'players.player': mongoose.Types.ObjectId(id),
              'completed': true,
              'statusId': 1
            }
          };
          if (season) {
            match.$match.startTime = {
              '$gte': moment(season.startDate).toDate()
            };
            if (season.endDate) {
              match.$match.startTime.$lt = moment(season.endDate).toDate();
            }
          }
          return match;
        }
      },
      GET_ALL_PLAYER_STATS: {
        match: function() {
          return {
            '$match': {
              'completed': true,
              'statusId': 1
            }
          };
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
              'completed': true,
              'statusId': 1
            }
          };

          if (endTime) {
            match.$match.startTime.$lt = moment(endTime).toDate();
          }
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
        match: function(season) {
          var match = {
            '$match': {
              'completed': true,
              'statusId': 1
            }
          };
          if (season) {
            match.$match.startTime = {
              '$gte': moment(season.startDate).toDate()
            };
            if (season.endDate) {
              match.$match.startTime.$lt = moment(season.endDate).toDate();
            }
          }
          return match;
        },
        group: {
          '$group': {
            '_id': '$players.player',
            'totalPoints': {
              '$sum': '$players.score'
            },
            'games': {
              '$push': {
                '_id': '$_id'
              }
            }
          }
        },
        project: {
          '$project': {
            '_id': '$_id',
            'name': '$player.name',
            'totalPoints': '$totalPoints',
            'gamesPlayed': {
              '$size': '$games'
            }
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
    };
  }

  module.exports = exports;
}

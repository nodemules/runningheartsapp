{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).directive('rhpTrophy', rhpTrophy);

  rhpTrophy.$inject = [];

  function rhpTrophy() {

    var directive = {
      restrict: 'E',
      templateUrl: '../views/templates/trophy/trophy.html',
      scope: {
        count: '=',
        rank: '=',
        before: '@',
        after: '@'
      },
      replace: true,
      link: linkFn
    };

    return directive;

    function linkFn(scope, el, attrs) {
      var beforeOrAfterNotPresent = !angular.isDefined(attrs.before) && !angular.isDefined(attrs.after);
      scope.position = {
        before: angular.isDefined(attrs.before),
        after: angular.isDefined(attrs.after),
        none: angular.isDefined(attrs.count)
      };

      if (!angular.isDefined(attrs.count) && beforeOrAfterNotPresent) {
        console.error('rhpTrophy requires either a \'before\' or \'after\' attribute.');
        scope.position.before = false;
        scope.position.after = true;
      }

      if (!scope.position.none && scope.position.before === scope.position.after && !beforeOrAfterNotPresent) {
        console.error('rhpTrophy directive cannot have icon assigned to both \'before\' and \'after\' positions.',
          'Defaulting to \'after\' position.')
        scope.position.before = false;
      }

      scope.getIconClass = function(rank) {
        var icon = '';
        switch (rank) {
          case 1:
            icon = 'fa-trophy trophy-gold';
            break;
          case 2:
            icon = 'fa-trophy trophy-silver';
            break;
          case 3:
            icon = 'fa-trophy trophy-bronze';
            break;
          default:
            icon = 'fa-hashtag';
            break;
        }
        return icon;
      };

      scope.getRankClass = function(rank) {
        var icon = '';
        if (rank >= 100) {
          icon = 'rhp-trophy-rank-xs';
        } else if (rank >= 10) {
          icon = 'rhp-trophy-rank-sm';
        } else {
          icon = 'rhp-trophy-rank';
        }
        return icon;
      };

    }

  }

}

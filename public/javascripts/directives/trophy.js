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
    }

    return directive;

    function linkFn(scope, el, attrs) {
      scope.position = {
        before: angular.isDefined(attrs.before),
        after: angular.isDefined(attrs.after)
      }
      if (!angular.isDefined(attrs.count) && scope.position.before === scope.position.after) {
        console.error('rhpTrophy directive cannot have icon assigned to \'before\' and \'after\' positions.',
          'Defaulting to \'after\' position.')
        scope.position.before = false;
      }

      scope.getIcon = function(rank) {
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
      }
    }

  }

}

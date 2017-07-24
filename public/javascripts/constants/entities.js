{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .constant('Entities', {
      'PLAYER': 1,
      'EVENT': 2,
      'VENUE': 3,
      'GAME': 4,
      'SEASON': 5,
      'fromId': function(id) {
        var entityId = parseInt(id);
        var entity;
        angular.forEach(this, (v, k) => {
          if (v === entityId) {
            entity = this[k];
          }
        });
        return entity;
      }
    })
}

{
  /* global angular, APP_NAME */
  angular
    .module(APP_NAME)
    .constant('RHP_ENTITY_TYPE', {
      'PLAYER': 1,
      'EVENT': 2,
      'VENUE': 3,
      'GAME': 4
    })
}

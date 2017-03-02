var APP_NAME = 'runningHeartsApp'; {
  /* global angular */
  'use strict';

  var APP_DEPENDENCIES = ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ngResource'];
  angular
    .module(APP_NAME, APP_DEPENDENCIES)
    .config(function($mdThemingProvider) {

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('deep-orange', {
          'default': '900'
        })
        .backgroundPalette('grey');
    })
    .config(function($locationProvider) {

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      });

    })
    //this fixes the unhandled rejection error ui-router is throwing but we should investigate further -jr
    .config(function($qProvider) {
      $qProvider.errorOnUnhandledRejections(false);
    })
}

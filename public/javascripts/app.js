var APP_NAME = 'runningHeartsApp';

{
  /* global angular */
  'use strict';

  angular
    .module(APP_NAME, ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'ngMessages', 'ngResource'])
    .config(['$mdThemingProvider', function($mdThemingProvider) {

      $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('deep-orange', {
          'default': '900'
        })
        .warnPalette('grey', {
          'default': '300'
        })
        .backgroundPalette('grey');

      $mdThemingProvider.theme('playerOut')
        .primaryPalette('green', {
          'default': '600'
        })
        .accentPalette('grey', {
          'default': '600'
        })
        .warnPalette('grey', {
          'default': '800'
        });

      $mdThemingProvider.theme('playerIn')
        .primaryPalette('red', {
          'default': '600'
        })
        .accentPalette('grey', {
          'default': '600'
        })
        .warnPalette('grey', {
          'default': '800'
        });


    }])
    .config(['$locationProvider', function($locationProvider) {

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      });

    }])
    //this fixes the unhandled rejection error ui-router is throwing but we should investigate further -jr
    .config(['$qProvider', function($qProvider) {
      $qProvider.errorOnUnhandledRejections(false);
    }]);
}

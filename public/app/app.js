'use strict';

var app = angular.module('main', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide', function($stateProvider, $urlRouterProvider, $httpProvider, $provide) {

  $urlRouterProvider.otherwise('/survey');

  $stateProvider
    .state('survey', {
      url: '/survey',
      templateUrl: 'app/survey/survey.html',
      controller: 'SurveyCtrl'
    })
    .state('results', {
      url: '/results',
      templateUrl: 'app/results/results.html',
      controller: 'ResultsCtrl'
    });

  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function($delegate, $injector) {
    return function(exception, cause) {
      $delegate(exception, cause);

      var $state = $injector.get('$state');
      var $rootScope = $injector.get('$rootScope');

      if ($rootScope.logUiErrors && exception) {
        if (!(exception.message && exception.stack)) {
          exception = {
            message: angular.toJson(exception, true),
            stack: '<< no stack trace assigned >>'
          };
        }
        if ($rootScope.redirectUiErrors) {
          $state.go('error');
        }
      }
    };
  }]);
}]);
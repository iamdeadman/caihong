'use strict';

angular.module('caihongApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/email_confirm/:token*', {
        resolve: {
            email_confirm: function ($q, $location, $http, $route) {
                var deferred = $q.defer();
                console.log('in first');
                $http.post('/api/email_confirm/' + $route.current.params.token)
                    .success(function (data, status, headers, config) {
                      console.log('in success');
                      deferred.reject();
                      $location.url('/home');
                      // or reject
                      // or put location first?
                      // or add a redirectTo
                    })
                    .error(function (data, status, headers, config) {
                      deferred.reject();
                      $location.url('/home');
                    });
                  
                return deferred.promise;
            }
       }
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });
'use strict';

angular.module('caihongApp')
  .controller('EmailConfirmCtrl', function ($routeParams, $http) {
    // grab the token from params
    var email_token = $routeParams.email_token;
    console.log('email_token');

    // TODO: send the request to the sevrver
   
    $http.get('/api/email_confirm/' + email_token).success(function(awesomeThings) {
      console.log('awesomeThings');
    });
});

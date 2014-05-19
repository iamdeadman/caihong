'use strict';

angular.module('caihongApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });

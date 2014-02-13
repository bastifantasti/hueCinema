'use strict';

angular.module('hueCinemaApp')
  .directive('yo', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the yo directive');
      }
    };
  });

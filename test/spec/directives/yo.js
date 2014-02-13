'use strict';

describe('Directive: yo', function () {

  // load the directive's module
  beforeEach(module('hueCinemaApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<yo></yo>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the yo directive');
  }));
});

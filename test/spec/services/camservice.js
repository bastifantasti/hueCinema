'use strict';

describe('Service: Camservice', function () {

  // load the service's module
  beforeEach(module('hueCinemaApp'));

  // instantiate service
  var Camservice;
  beforeEach(inject(function (_Camservice_) {
    Camservice = _Camservice_;
  }));

  it('should do something', function () {
    expect(!!Camservice).toBe(true);
  });

});

'use strict';

describe('Service: Hueservice', function () {

  // load the service's module
  beforeEach(module('hueCinemaApp'));

  // instantiate service
  var Hueservice;
  beforeEach(inject(function (_Hueservice_) {
    Hueservice = _Hueservice_;
  }));

  it('should do something', function () {
    expect(!!Hueservice).toBe(true);
  });

});

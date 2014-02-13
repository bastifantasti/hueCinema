'use strict';

describe('Service: Userprovider', function () {

  // load the service's module
  beforeEach(module('hueCinemaApp'));

  // instantiate service
  var Userprovider;
  beforeEach(inject(function (_Userprovider_) {
    Userprovider = _Userprovider_;
  }));

  it('should do something', function () {
    expect(!!Userprovider).toBe(true);
  });

});

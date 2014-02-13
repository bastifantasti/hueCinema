'use strict';

angular.module('hueCinemaApp')
  .service('Hueservice', function Hueservice($http,$q, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        var lightTimer;
        var updateInterval = 903;
        var baseUrl = '';
       // var baseUrl = 'http://192.168.178.45/api/newdeveloper/lights/';
        var huelight = new Object();
        huelight.r = 0;
        huelight.g = 0;
        huelight.b = 0;


        var scope;

        var setHueBridge = function(val){
            baseUrl = val+"lights/";
        }

        var getHueBridge = function (){
            return baseUrl;
        }
        /*
         t.settings = {
         bri: Math.floor(t.l * 255),
         hue: Math.floor((t.h % 360) * 182),
         sat: Math.floor(t.s * 255),
         on: true
         };
         */




        var getHueList = function() {

            var deferred = $q.defer();
            var url = baseUrl;
            console.log("baseurl: "+url);

            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

        var setSingleHueColor = function(red,green,blue,hueItem){
            var deferred = $q.defer();
            huelight.r = red / 100 * 255;
            huelight.g = green / 100 * 255;
            huelight.b = blue / 100 * 255;
            var t = tinycolor(huelight).toHsl();
            console.log(t);

            var url = baseUrl+hueItem+"/state";
            var params = {on: true, sat: Math.floor(t.s * 255), bri: Math.floor(t.l * 255), hue:Math.floor((t.h % 360) * 182)};
            $http.put(url, params).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;

        }

        var setHueColor = function(red,green,blue,huearr){

            var deferred = $q.defer();
            huelight.r = red / 100 * 255;
            huelight.g = green / 100 * 255;
            huelight.b = blue / 100 * 255;
            var t = tinycolor(huelight).toHsl();
            console.log(t);

            for(var i= 0; i<huearr.length;i++){
                var url = baseUrl+huearr[i]+"/state";
                var params = {on: true, sat: Math.floor(t.s * 255), bri: Math.floor(t.l * 255), hue:Math.floor((t.h % 360) * 182)};
                $http.put(url, params).success(deferred.resolve).error(deferred.reject);
            }

            return deferred.promise;

        }

        var updateLights = function(){
            console.log("update lights");
            console.log(scope);


        }

        var startLightning = function($scope) {

            var deferred = $q.defer();
            scope = $scope;
            lightTimer = window.setInterval(updateLights, updateInterval);
            $timeout(function() {
                deferred.resolve(["lightning",true,updateInterval]);
            }, 1);

            return deferred.promise;
        };

        var stopLightning = function() {
            // STOP VIDEO STREAM
            var deferred = $q.defer();
            window.clearInterval(lightTimer);

            $timeout(function() {
                deferred.resolve(["stop lightning",true]);
            }, 1);

            return deferred.promise;
        };




        return {
            setHueBridge: setHueBridge,
            getHueBridge: getHueBridge,
            getHueList: getHueList,
            setHueColor: setHueColor,
            startLightning: startLightning,
            stopLightning: stopLightning,
            updateLights: updateLights
        };

    });

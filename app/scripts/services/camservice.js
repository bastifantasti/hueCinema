'use strict';

angular.module('hueCinemaApp')
  .service('Camservice', function Camservice($q, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        var videoTimer;
        var updateInterval = 903;
        var video = document.querySelector('video');
        var canvas = document.getElementById('mycanvas');
        var avgColor;

        var updateCam = function (){
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video,0,0,320,240);
            avgColor = getColor();


        }

        var getColor = function (){
            var imgEl = document.getElementById('mycanvas');
            var blockSize = 2, // only visit every 5 pixels
                defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
                canvas = document.createElement('canvas'),
                context = canvas.getContext && canvas.getContext('2d'),
                data, width, height,
                i = -4,
                length,
                rgb = {r:0,g:0,b:0},
                count = 0;

            if (!context) {
                return defaultRGB;
            }

            height = canvas.height = imgEl.height || imgEl.offsetHeight || imgEl.height;
            width = canvas.width = imgEl.width || imgEl.offsetWidth || imgEl.width;

            context.drawImage(imgEl, 0, 0);

            try {
                data = context.getImageData(0, 0, width, height);
            } catch(e) {
                /* security error, img on diff domain */alert('x');
                return defaultRGB;
            }

            length = data.data.length;

            while ( (i += blockSize * 4) < length ) {
                ++count;
                rgb.r += data.data[i];
                rgb.g += data.data[i+1];
                rgb.b += data.data[i+2];
            }

            // ~~ used to floor values
            rgb.r = ~~(rgb.r/count);
            rgb.g = ~~(rgb.g/count);
            rgb.b = ~~(rgb.b/count);

            return rgb;
        }


        var getAvgColor = function (){
            return avgColor;
        }

        var startRecord = function() {
            // ASK FOR VIDEO CAM
            if(navigator.webkitGetUserMedia!=null) {
                var options = {
                    video:true,
                    audio:true
                };

                //request webcam access
                navigator.webkitGetUserMedia(options,
                    function(stream) {
                        //get the video tag

                        //turn the stream into a magic URL
                        video.src = window.webkitURL.createObjectURL(stream);
                    },
                    function(e) {
                        console.log("error happened");
                    }
                );
            }

            var deferred = $q.defer();
            videoTimer = window.setInterval(updateCam, updateInterval);
            $timeout(function() {
                deferred.resolve(["recording",true,updateInterval]);
            }, 1);

            return deferred.promise;
        };

        var stopRecord = function() {
            // STOP VIDEO STREAM
            video.pause();
            video.src="";
            var deferred = $q.defer();
            window.clearInterval(videoTimer);

            $timeout(function() {
                deferred.resolve(["stop recording",true]);
            }, 1);

            return deferred.promise;
        };


        return {
            startRecord: startRecord,
            stopRecord: stopRecord,
            updateCam:updateCam,
            getAvgColor:getAvgColor
        };
  });



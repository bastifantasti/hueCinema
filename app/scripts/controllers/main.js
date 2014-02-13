'use strict';

angular.module('hueCinemaApp')
  .controller('MainCtrl', function ($scope, Hueservice,Camservice) {
        $scope.minUpdateFreq = 500; // VideoCapture Frequenz - entspricht dem Minimum der kleinsten HUE Frq.
        var retrievedObject = localStorage.getItem("bridgeurl");
        if(retrievedObject){

            $('#bridgeurl').val(retrievedObject);
        }


        $scope.saveIP = function(){

            var ip = $('#bridgeurl').val();
            console.log("SAVE IP: "+ip);
            localStorage.setItem("bridgeurl", ip);
            Hueservice.setHueBridge(ip);

        }
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.dataTimer=null;
        console.log("controller is here");

        $scope.sayHello = function(msg){
            console.log(msg);

        }


        $scope.setHueColor = function(r,g,b){
            Hueservice.setHueColor(r,g,b).then(function(messages){console.log(messages);});
        }

        $scope.getHueList = function () {
            console.log("HUEs");
            Hueservice.getHueList().then(function(messages) {
                console.log(messages);
                Object.keys(messages).forEach(function(key) {
                    console.log(key, messages[key]);
                    messages[key].slide = "500";
                    messages[key].prevslide = "500";
                });
                console.log(messages);
                $scope.lights = messages;
                $("#btn-rec").removeClass("disabled");
                $scope.checkLightFreq = window.setInterval($scope.submitLightFreq, 1000);
            });

        };
        $scope.submitLightFreq = function(){

            var min = $scope.minUpdateFreq;
            Object.keys($scope.lights).forEach(function(key) {
                var currFreq = $scope.lights[key].slide;
                var prevFreq = $scope.lights[key].prevslide;
                if(currFreq < min){
                    min = currFreq;
                }
                if(prevFreq != currFreq){
                    $scope.lights[key].prevslide = currFreq;
                    console.log("new slide value! update!");

                }

            });
            if(min < $scope.minUpdateFreq){
                console.log(" *** UPDATE RECORD FREQ ***");
                $scope.minUpdateFreq = min;
                console.log($scope.minUpdateFreq);
            }
        }


        $scope.record = function(){

            if($("#btn-rec").text()=="Record Screen"){
                $("#btn-rec").text("stop Record");
                Camservice.startRecord().then(function(messages) {
                    console.log(messages);
                    Hueservice.startLightning($scope).then(function(messages){console.log(messages);});
                });
                $scope.dataTimer= window.setInterval($scope.deliverData, 500);
            }else{
                $("#btn-rec").text("Record Screen");
                Camservice.stopRecord().then(function(messages) {
                    console.log(messages);
                    Hueservice.stopLightning().then(function(messages){console.log(messages);});
                });
                window.clearInterval($scope.dataTimer);

            }
        }

        $scope.deliverData = function(){
            var color = Camservice.getAvgColor();
            // hue-at-home
            var arr = new Array();
            $("input:checkbox[name=huelisthome]:checked").each(function(){

                //var val = $(this).closest("li").text();
                //selected.push(val);
                //  console.log($(this)[0].value);
                arr.push($(this)[0].value);
                //console.log($(this).name +" / "+$(this).checked+" / "+$(this).value);
            });
            for(var i=0;i<arr.length;i++){
                if($scope.lights[arr[i]].slide != $scope.lights[arr[i]].prevslide){
                    console.log("new slide value! update!");
                    $scope.lights[arr[i]].slide = $scope.lights[arr[i]].prevslide;

                }
            }



            Hueservice.setHueColor(color.r,color.g,color.b,arr);
        }
  });

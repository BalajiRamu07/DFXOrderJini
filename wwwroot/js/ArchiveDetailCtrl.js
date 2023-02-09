/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("ArchiveDetailCtrl", function($scope, $routeParams, $window, $http){
        console.log("Hello from Archive Details Ctrl ....!!!");

        var orderId = $routeParams.orderId;
        $scope.orderDetails = [];

        if(orderId){
            console.log("Fetching Order Details for Order ID  : " + orderId);
            $http.get("/dash/orders/" + orderId)
                .success(function (response) {
                    console.log(response);
                    if(response && response.length)
                        $scope.orderDetails = response;
                    else $window.location.href = '/404';
                })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        }else $window.location.href = '/404';

    })
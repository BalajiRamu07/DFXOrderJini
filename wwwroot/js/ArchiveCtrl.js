/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("ArchiveCtrl",function ($scope, $filter, $http, Settings, $window) {
        console.log("Hello From Archive Controller .... !!!!");

        $scope.arcOrders = [];
        $scope.archiveOrders = {};
        $scope.archiveOrders.filter = '';
        $scope.nav = [];
        $scope.limitingFactory = 30;


        $http.get("/dash/instanceDetails")
            .success(function(response){
                $scope.orderDeleteType =  response.deleteLabel ? response.deleteLabel : 'Archive';
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

        $http.get("/dash/nav")
            .success(function(response){
                $scope.nav = response;
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

        // order delete label type
        $scope.changeDeleteType = function(orderDeleteType){
            console.log('orderDeleteType',orderDeleteType);
            var obj = {
                label:orderDeleteType
            }
            $http.put("/dash/update/deleteLabel", obj)
                .success(function(response){
                    console.log('response',response)

                })
        };

        function getArchiveOrders() {
            var status = "Close";

            $http.get('/dash/archive/orders/' + status)
                .success(function (response) {
                    console.log(response)
                    $scope.arcOrders = response;
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
        }
        getArchiveOrders();

        $scope.parseData = function(viewLength, newViewBy) {return parseInt(viewLength) + parseInt(newViewBy)};

        $scope.archiveOrders = function(id) {
            Settings.confirmPopup("CONFIRM", "Are you sure?", function(result){
                if(result){
                    $http.delete("/dash/orders/" + id)
                        .success(function (response) {
                            console.log("Archive -->" + response);
                            getArchiveOrders();
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
                }
            });
        };

        $scope.trial34 = function (val, i) {
            $scope.arcOrders = $filter('filter')($scope.items21, val);
            $scope.viewby = i;
            $scope.totalItems = $scope.arcOrders.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.case11Length = $scope.arcOrders.length;

        }
        $scope.trial35 = function (i) {
            // alert()
            $scope.arcOrders = $scope.items21;
            $scope.archiveOrders.filter = '';
            $scope.viewby = i;
            $scope.totalItems = $scope.arcOrders.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.case11Length = $scope.arcOrders.length;
        }

        $scope.formatDate = function(date){
            if(date==undefined || date == '')
                return ('');
            /* replace is used to ensure cross browser support*/
            var d = new Date(date.toString().replace("-","/").replace("-","/"));
            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            var dt = d.getDate();
            if(dt<10)
                dt = "0"+dt;
            var dateOut = dt+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear());
            return dateOut;
        }

        $scope.trial35 = function (i) {
            // alert()
            $scope.arcOrders = $scope.items21;
            $scope.archiveOrders.filter = '';
            $scope.viewby = i;
            $scope.totalItems = $scope.arcOrders.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.case11Length = $scope.arcOrders.length;
        };

        $scope.loadMore = function () {
            $scope.limitingFactory += 10;
        }

        $scope.items21 = $scope.arcOrders;
        $scope.viewby = 10;
        $scope.totalItems = $scope.arcOrders.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 5;
        $scope.case11Length = $scope.arcOrders.length;
    })
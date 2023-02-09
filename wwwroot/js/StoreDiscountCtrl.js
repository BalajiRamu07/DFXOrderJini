angular.module('ebs.controller')

    .controller("StoreDiscountCtrl",function ($scope, $filter, $http,Settings, $modal, $window, toastr, $interval,$sce,$mdDialog) {
        console.log("Hello From  Store Discount Controller .... !!!!");
        $scope.storeDiscount=[];
                $scope.getMasterStoreDiscount=function(){
                    $http.get("/dash/customerDiscount/storeDiscount/data")
                        .success(function (res) {
                            console.log(res);
                            $scope.storeDiscount=res;
                        }).error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
                }
                $scope.getMasterStoreDiscount();







 })
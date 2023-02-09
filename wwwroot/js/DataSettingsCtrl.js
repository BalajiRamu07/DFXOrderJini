/**
 * Created by shreyasgombi on 05/07/22.
 */

 angular.module('ebs.controller')

 .controller("DataUploadCtrl", function($scope, $routeParams, $http, $window, Settings){
     console.log("Hello From Data Upload Settings Controller .... !!!!");

     $scope.nav = [];
     $scope.uploadIds = {};
     $scope.upload_status = {};

     $scope.percentageDiscount = false;

     Settings.getNav(false, nav => {
        $scope.nav = nav;
     });

     let instance_details = Settings.getInstance();
     $scope.applicationType = (!instance_details.applicationType || instance_details.applicationType == "OrderJini" ? "" : instance_details.applicationType);
     
     console.log(instance_details.csv_upload_date);
     $scope.uploadIds = instance_details.csv_upload_date;

     const loadPercentageDiscount = () => {
        $http.get("/dash/settings/details/percentageDiscount")
            .then((settings) => {
                console.log(settings);
                if(settings && settings.data){
                    if(!settings.data.value || settings.data.value != 'error'){
                        $scope.percentageDiscount = settings.data.value;
                    }else
                        console.log("Invalid Request : ", settings);
                }
            })
     };

     const loadUploadStats = type => {
        let query = new URLSearchParams();
        if(type) query.append("type", type);

        $http.get("/dash/upload/stats?" + query.toString())
            .then((response) => {
                //console.log(type + " Upload Information --> ", response);
                if(response.data){
                    if(response.data.total){
                        if(type){
                            if(!$scope.upload_status[type]) $scope.upload_status[type] = {};
                            $scope.upload_status[type].upload_status = true;
                            $scope.upload_status[type].completed = response.data.success ? ((response.data.success / response.data.total) * 100) : 0;
                            $scope.upload_status[type].res = response.data;
                        }
                    }
                }
            })
     };

     loadUploadStats("Items");
     loadUploadStats("Customers");
     loadUploadStats("Orders");

     loadPercentageDiscount();
     $scope.refreshStats = type => loadUploadStats(type);
 });
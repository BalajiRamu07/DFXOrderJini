var app = angular.module('MyApp2', [])
app.controller('MyController2', function ($scope, $http, $window) {
    $scope.IsVisible = false;

    $scope.GetAllData = function () {
        

        $http(
        {
            method: 'POST',
            url: '/api/Orders/AjaxMethod',  /*You URL to post*/
                dataType: 'json',
            
                headers: {
                    "Content-Type": "application/json"
                },
        }).then(function (response) {
            $scope.OrderDetails = response.data;
            $scope.IsVisible = true;
            

        }, function errorCallback(response) {
            $window.alert(response.Message);

        });
      
    }

   
    //This will hide the DIV by default.
    $scope.IsHidden = true;
    $scope.OrderFilterBy = function () {
        //If DIV is hidden it will be visible and vice versa.
        $scope.IsHidden = $scope.IsHidden ? false : true;
    }
});






/**
 * Created by shreyasgombi on 05/03/20.
 */

 angular.module('ebs.controller')

    .controller("CustomerDashboardCtrl",function ($scope, $http, $routeParams, $window, Settings, $location) {
        console.log("Hello From Customer Dashboard Controller .... !!!!");

        //.... User details....
        $scope.user_details = {};

        //... Filter....
        $scope.filter = {};
        $scope.filter.filter_by = "week";

        //... Service Tickets ....
        $scope.tickets = [];
        //... Orders....
        $scope.orders = [];
        //... Frequently Bought....
        $scope.frequently_bought = [];

        const api_timeout = 60000;

        Settings.getUserInfo(user_details => {
            $scope.user_details = user_details;
        });

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }
    
        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }
        
        const renderTickets = tickets => {
            stopLoader();
            if(tickets && tickets.length)
                for(let i = 0; i < tickets.length; i++) $scope.tickets.push(tickets[i]);
        }

        const renderOrders = orders => {
            stopLoader();
            if(orders && orders.length)
                for(let i = 0; i < orders.length; i++) $scope.orders.push(orders[i]);
        }

        $scope.formatDate = date => {
            if(date) return new Date(date);
            else return date;
        }

        const loadFrequentlyBought = () => {
            startLoader();

            let request_object = {
                url : "/dash/reports/frequently/bought/items",
                method : "GET",
                timeout : api_timeout,
                //data : filter
            };
            $http(request_object)
                .then(res => {
                    console.log("Frequently Bought --> ", res);

                    for(let i = 0; i < res.data.length; i++){
                        if(res.data[i].item_details){
                            if(res.data[i].item_details.cloudinaryURL && res.data[i].item_details.cloudinaryURL != "undefined"){
                                if(typeof res.data[i].item_details.cloudinaryURL == "string"){
                                    let imageURL = res.data[i].item_details.cloudinaryURL;
                                    res.data[i].item_details.cloudinaryURL = [{
                                        "image" : imageURL
                                    }];
                                }else if(res.data[i].item_details.cloudinaryURL instanceof Array){
                                    if(res.data[i].item_details.cloudinaryURL.length){
                                        console.log("Images are available & in array -- ");
                                    }else{
                                        res.data[i].item_details.cloudinaryURL = [{
                                            "image" : "appimages/product_image_not_available.png"
                                        }];                                }
                                }
                            }else{
                                res.data[i].item_details.cloudinaryURL = [{
                                    "image" : "appimages/product_image_not_available.png"
                                }];
                            }
                        }
                    }
                    $scope.frequently_bought = res.data;
                    
                    }, (error, status) => {
                        console.log(error, status);
                        if(status){
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                        }else if(error.status){
                            if(error.status >= 400 && error.status < 404)
                                $window.location.href = '/404';
                            else if(error.status >= 500)
                                $window.location.href = '/500';
                        }
                        else
                            $window.location.href = '/404';
                })
        }

        const loadOrdersChart = () => {
            startLoader();

            let query = new URLSearchParams();
            query.append("tab", $scope.filter.filter_by);

            let request_object = {
                url : "/dash/reports/orders?" + query.toString(),
                method : "GET",
                timeout : api_timeout,
                //data : filter
            };
            $http(request_object)
                .then(res => {
                    dashboardGraph($scope, res.data, $scope.filter.filter_by);
                    
                    }, (error, status) => {
                        console.log(error, status);
                        if(status){
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                        }else if(error.status){
                            if(error.status >= 400 && error.status < 404)
                                $window.location.href = '/404';
                            else if(error.status >= 500)
                                $window.location.href = '/500';
                        }
                        else
                            $window.location.href = '/404';
                })
        };


        const loadOrders = () => {
            startLoader();

            let query = new URLSearchParams();
            //query.append("tab",  "open");
            query.append("skip", 0);
            query.append("limit", 3);

            let request_object = {
                url : "/dash/orders?" + query.toString(),
                method : "GET",
                timeout : api_timeout,
                //data : filter
            };
            $http(request_object)
                .then(res => {
                    renderOrders(res.data);
                    
                    }, (error, status) => {
                        console.log(error, status);
                        if(status){
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                        }else if(error.status){
                            if(error.status >= 400 && error.status < 404)
                                $window.location.href = '/404';
                            else if(error.status >= 500)
                                $window.location.href = '/500';
                        }
                        else
                            $window.location.href = '/404';
                })
        }

        const loadTickets = () => {
            startLoader();

            let query = new URLSearchParams();
            //query.append("tab",  "open");
            query.append("skip", 0);
            query.append("limit", 3);

            let request_object = {
                url : "/dash/services/tickets?" + query.toString(),
                method : "GET",
                timeout : api_timeout,
                //data : filter
            };
            $http(request_object)
                .then(res => {
                    renderTickets(res.data);
                    
                    }, (error, status) => {
                        console.log(error, status);
                        if(status){
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                        }else if(error.status){
                            if(error.status >= 400 && error.status < 404)
                                $window.location.href = '/404';
                            else if(error.status >= 500)
                                $window.location.href = '/500';
                        }
                        else
                            $window.location.href = '/404';
                })
        }

        loadFrequentlyBought();
        loadOrdersChart();
        loadOrders();
        loadTickets();
    })
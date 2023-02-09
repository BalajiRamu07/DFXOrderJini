/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')


    .controller("EnquiryCtrl",function ($scope, $routeParams, $http, $location, $window) {
        console.log("Hello From Enquiry Controller .... !!!!");

        //.... Enquiries...
        $scope.enquiries = [];

        $scope.enquiry_count = 0;
        $scope.enquiry_summary = {total : 0, hot : 0, warm : 0, cold : 0};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;

        let enquiry_filters = {};
        $scope.enquiry_filters = {};
        $scope.enquiry_filters.startDate = new Date();
        $scope.enquiry_filters.startDate.setDate($scope.enquiry_filters.startDate.getDate() - 7);
        $scope.enquiry_filters.startDate.setHours(0, 0, 0, 0);
        $scope.enquiry_filters.endDate = new Date();
        $scope.enquiry_filters.endDate.setHours(23, 59, 59, 59);
        
        
        $scope.tab = ($routeParams.tab && $routeParams.tab != "hot") ? (($routeParams.tab == "warm" ? "warm" : ($routeParams.tab == "cold" ? "cold" : "hot"))) : "hot";

        let api_timeout = 60000;

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        
        const renderQueries = enquiries => {
            stopLoader();
            if(enquiries && enquiries.length)
                for(let i = 0; i < enquiries.length; i++) $scope.enquiries.push(enquiries[i]);
        }

        const loadSummary = callback => {
            let request_object = {
                url : "/dash/enquiry/summary",
                method : "GET",
                timeout : api_timeout,
                //data : filter
            };
            $http(request_object)
                .then(res => {
                    console.log(res.data);
                    for(let i = 0; i < res.data.length; i++){
                        $scope.enquiry_summary.total += res.data[i].count;
                        if(res.data[i]._id == 'Hot'){
                            $scope.enquiry_summary.hot += res.data[i].count;
                        }else if(res.data[i]._id == 'Warm'){
                            $scope.enquiry_summary.warm += res.data[i].count;
                        }else
                            $scope.enquiry_summary.cold += res.data[i].count;
                    }
                    if(callback)
                        callback(res.data);
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


        const loadEnquiries = callback => {
            startLoader();

            let query = new URLSearchParams();
            query.append("tab",  $scope.tab);
            query.append("skip", enquiry_filters.viewLength || 0);
            query.append("limit", enquiry_filters.viewBy || 10);

            if($scope.enquiry_filters.searchBy) query.append("search",  $scope.enquiry_filters.searchBy);
            if($scope.enquiry_filters.startDate) query.append("from",  $scope.enquiry_filters.startDate.toISOString());
            if($scope.enquiry_filters.endDate) query.append("to",  $scope.enquiry_filters.endDate.toISOString());

            let request_object = {
                url : "/dash/enquiry/queries?" + query.toString(),
                method : "GET",
                timeout : api_timeout,
                //data : filter
            };
            $http(request_object)
                .then(res => {
                    renderQueries(res.data);
                    if(callback)
                        callback(res.data);
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

        const loadEnquiryCount = () => {
            let query = new URLSearchParams();
            query.append("tab",  $scope.tab);
            query.append("count", 1);

            if($scope.enquiry_filters.searchBy) query.append("search",  $scope.enquiry_filters.searchBy);
            if($scope.enquiry_filters.startDate) query.append("from",  $scope.enquiry_filters.startDate.toISOString());
            if($scope.enquiry_filters.endDate) query.append("to",  $scope.enquiry_filters.endDate.toISOString());

            let request_object = {
                url : "/dash/enquiry/queries?" + query.toString(),
                method : "GET",
                timeout : api_timeout,
                //data : filter
            };
            $http(request_object)
                .then(res => {
                    $scope.enquiriesCount(res.data);
                    
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


        $scope.enquiriesCount = (response) => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.enquiry_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.enquiry_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.enquiries = [];
                    $scope.newViewBy = 1;
                    $scope.enquiry_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.enquiries = [];
                $scope.newViewBy = 1;
                $scope.enquiry_count = 0;
                $scope.viewLength = -1;
            }
        }


        $scope.navPage = (direction, newViewBy) => {
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;


            if(direction){
                //console.log(" overallreports NEXT");
                if(viewLength + viewBy >= $scope.tickets.length){

                    if(viewLength + viewBy < $scope.enquiry_count){
                        viewLength += viewBy;
                        // console.log("Fetch more")
                        enquiry_filters.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            enquiry_filters.viewBy = $scope.newViewBy;
                        }else{
                            enquiry_filters.viewBy = initialViewBy;
                        }

                        startLoader();
                        loadTickets();
                        if(viewLength + viewBy > $scope.enquiry_count){
                            a = viewLength + viewBy - $scope.enquiry_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.enquiry_count){
                            a = viewLength + viewBy - $scope.enquiry_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.enquiry_count){
                        a = viewLength + viewBy - $scope.enquiry_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.enquiries.length){
                            enquiry_filters.viewLength = $scope.enquiries.length;
                            enquiry_filters.viewBy = viewLength + viewBy - $scope.enquiries.length;

                            startLoader();
                            loadEnquiries();
                        }
                    }else{
                        if(viewLength + viewBy > $scope.enquiries.length){
                            enquiry_filters.viewLength = $scope.enquiries.length;
                            enquiry_filters.viewBy = viewLength + viewBy - $scope.enquiries.length;

                            startLoader();
                            loadReport();
                        }
                    }
                    $scope.newViewBy = viewBy;
                    $scope.viewLength = viewLength;
                }
            }
            else{
                // console.log("BACK");
                if(viewLength < viewBy){
                    // console.log("NO DATA")
                }
                else{
                    if(viewLength + viewBy >= $scope.enquiry_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        };

        $scope.reloadQueries = () => {
            $scope.enquiries = [];
            loadEnquiries();
            loadEnquiryCount();
        }
        
        $scope.reloadQueries();
        loadSummary();
    })
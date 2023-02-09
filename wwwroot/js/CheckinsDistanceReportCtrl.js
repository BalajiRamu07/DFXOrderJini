

angular.module('ebs.controller')

    .controller("CheckinsDistanceReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Checkins Distance Report Controller .... !!!!");

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;
        let initialViewBy = 60;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.cinreport = {};

        let instanceDetails =  Settings.getInstance();
        
        //... Last 7 Days Filter.....
        $scope.cinreport.startDate = new Date();
        $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
        $scope.cinreport.startDate.setHours(0, 0, 0, 0);
        $scope.cinreport.endDate = new Date();
        $scope.cinreport.endDate.setHours(23, 59, 59, 59);

        $scope.checkInReportSearch = {};
        $scope.checkInReportSearch.filter = '';

        $scope.cinreport.seller = '';

        let localViewBy = $scope.newViewBy;

        const api_timeout = 600000;

        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

        let checkinDealerSearchBy = ['sellername'];

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        let checkinSearchObj = {};
        checkinSearchObj.viewLength =  0; //.... 60
        checkinSearchObj.viewBy = 60; //.... 20
        checkinSearchObj.searchFor = '';
        checkinSearchObj.seller = '';
        checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
        checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
        checkinSearchObj.searchBy = checkinDealerSearchBy;
        $scope.checkinDistanceRecords = [];
        $scope.reportTabName = "Check-ins Distance Calculation"

        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                //console.log("Salesperson : ", salesperson);
                if(salesperson && salesperson.length){
                    console.log('This is list of sales person', salesperson);
                    $scope.roleSalesrep = [];
                    for(var i = 0; i < salesperson.length; i++){
                        if(salesperson[i] && salesperson[i].userStatus == 'Active')
                        $scope.roleSalesrep.push({sellername : salesperson[i].sellername, sellerphone : salesperson[i].sellerphone});
                    }
                }
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

         //... Pagination for all reports
         $scope.navPage =  function(direction, newViewBy){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;


            if(direction){
                // console.log("NEXT");
                if(viewLength + viewBy >= $scope.checkInreport.length){

                    if(viewLength + viewBy < $scope.checkin_count){
                        viewLength += viewBy;
                        // console.log("Fetch more")
                        checkinSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            checkinSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            checkinSearchObj.viewBy = initialViewBy;
                        }
                        checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                        checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                        checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                        checkinSearchObj.searchBy = checkinDealerSearchBy;

                        startLoader();
                        loadReport(checkinSearchObj);
                        if(viewLength + viewBy > $scope.checkin_count){
                            a = viewLength + viewBy - $scope.checkin_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.checkin_count){
                            a = viewLength + viewBy - $scope.checkin_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.checkin_count){
                        a = viewLength + viewBy - $scope.checkin_count;
                        viewBy -= a;

                        if(viewLength + viewBy > $scope.checkInreport.length){
                            checkinSearchObj.viewLength = $scope.checkInreport.length; //.... 60
                            checkinSearchObj.viewBy = viewLength + viewBy - $scope.checkInreport.length; //.... 20
                            checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                            checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                            checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                            checkinSearchObj.searchBy = checkinDealerSearchBy;

                            startLoader();
                            loadReport(checkinSearchObj);
                        }
                    }else{
                        if(viewLength + viewBy > $scope.checkInreport.length){
                            checkinSearchObj.viewLength = $scope.checkInreport.length; //.... 60
                            checkinSearchObj.viewBy = viewLength + viewBy - $scope.checkInreport.length; //.... 20
                            checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                            checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                            checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                            checkinSearchObj.searchBy = checkinDealerSearchBy;

                            startLoader();
                            loadReport(checkinSearchObj);
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
                    if(viewLength + viewBy >= $scope.checkin_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.reportsTransactionCount = (response)=> {
            console.log('response-=>> ',response)
            if(response){
                if(response > $scope.newViewBy){
                    $scope.checkin_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.checkin_count = response;
                    $scope.newViewBy = response;

                }
                else{
                    $scope.checkInreport = [];
                    $scope.newViewBy = 1;
                    $scope.checkin_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.checkInreport = [];
                $scope.newViewBy = 1;
                $scope.checkin_count = 0;
                $scope.viewLength = -1;
            }
            stopLoader();
        }

        $scope.openFilterClear = () => {
            $scope.cinreport.startDate = '';
            $scope.cinreport.endDate = '';
            $scope.cinreport.seller = '';

            $scope.cinreport.startDate = new Date();
            $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
            $scope.cinreport.startDate.setHours(0, 0, 0, 0);
            $scope.cinreport.endDate = new Date();
            $scope.cinreport.endDate.setHours(23, 59, 59, 59);
        };

        $scope.changeReportView = (newViewBy) => {
            startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);

            if($scope.cinreport.startDate && $scope.cinreport.endDate){
                if (($scope.cinreport.startDate - $scope.cinreport.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.cinreport.startDate = new Date();
                    $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
                    $scope.cinreport.startDate.setHours(0, 0, 0, 0);
                    $scope.cinreport.endDate = new Date();
                    $scope.cinreport.endDate.setHours(23, 59, 59, 59);

                }
            }
            checkinSearchObj.seller = ''
            if($scope.cinreport.seller)
                checkinSearchObj.seller = $scope.cinreport.seller ;


            checkinSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                checkinSearchObj.viewBy = $scope.newViewBy;
            }else{
                checkinSearchObj.viewBy = initialViewBy;
            }
            checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
            checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
            checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
            checkinSearchObj.searchBy = checkinDealerSearchBy;

            $scope.checkInreport = [];
            $scope.viewLength = 0;

            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }
            
            loadReport(checkinSearchObj);

            loadReportCount(checkinSearchObj);
        }

        const loadReport = (checkinSearchObj) => {
            $scope.checkinDistanceRecords = [];
            $http.post("/dash/reports/checkins/salesperson/distance/calculation", checkinSearchObj)
            .success((res)=>{
                // console.log('hi',res)
                if(res.length)
                $scope.checkinDistanceRecords = res;
                // console.log('bye ',$scope.checkinDistanceRecords);
                stopLoader();
            })
            .error((error, status)=>{
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            })
        }

        const loadReportCount = (checkinSearchObj) => {
            $http.post("/dash/reports/checkins/salesperson/distance/calculation/count", checkinSearchObj)
                .success($scope.reportsTransactionCount)
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

        loadReport(checkinSearchObj)
        loadReportCount(checkinSearchObj)

        $scope.getCheckInsDistanceConfig = ()=> {
            let checkInDistPrevType = 'checkInPreviousDistance'
            $http.get("/dash/settings/type/"+ checkInDistPrevType)
                .then(type => {
                    // console.log('type is checkin ',type.data)
                if(type.data){
                    $scope.checkInDistCalStatus = type.data.checkInDistCalStatus;
                    $scope.checkIn2WheelerDist = type.data.checkIn2WheelerDist;
                    $scope.checkIn4WheelerDist = type.data.checkIn4WheelerDist;
                }
            })
            .catch((error, status) => {
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
            });
        }
        $scope.getCheckInsDistanceConfig();
        

        $scope.downloadCSV = ()=> {
            checkinSearchObj.seller = ''
            if($scope.cinreport.seller)
                checkinSearchObj.seller = $scope.cinreport.seller ;

            checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
            checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
            checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
            checkinSearchObj.searchBy = checkinDealerSearchBy;

            var request_object = {
                url : "/dash/reports/checkins/salesperson/distance/calculation/count",
                method : "POST",
                timeout : api_timeout,
                data : checkinSearchObj
            };

            $http(request_object)
                .success(function(response){

                    // console.log("response-=>> ", response);
                    if(response > 6000){
                        Settings.failurePopup(
                            'WARNING',
                            'Please select a smaller date range.\nCurrent records : ' + response + ' - Max. records : 6000'
                        )
                    }
                    else {
                        checkinSearchObj.seller = ''
                        if($scope.cinreport.seller)
                            checkinSearchObj.seller = $scope.cinreport.seller ;

                        checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                        checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                        checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                        checkinSearchObj.searchBy = checkinDealerSearchBy;
                        checkinSearchObj.viewBy = 6000;

                        jQuery.noConflict();
                        $('.refresh').css("display", "inline");

                        // using chekin view api to get data
                        var request_object = {
                            url : "/dash/reports/checkins/salesperson/distance/calculation",
                            method : "POST",
                            timeout : api_timeout,
                            data : checkinSearchObj
                        };

                        $http(request_object)
                            .success(function(result){
                                var output = 'id,Date,Salesperson,Distance Travelled (in Kms), 2-Wheeler (Per Kms), 4-Wheeler (Per Kms), Total Amount (2-Wheeler), Total Amount (4-Wheeler)';			//makes it comma seperated heading
                                //console.log(output)
                                output += '\n';

                                for (var i = 0; i < result.length; i++) {

                                    console.log(result);

                                    output += i + 1;
                                    output += ',';

                                    if(result[i]._id && result[i]._id.date_formate)
                                        output += result[i]._id.date_formate;
                                    output += ',';

                                    try {
                                        if (result[i].sellername[0]) {
                                            if ((result[i].sellername[0]).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + result[i].sellername[0] + '"';
                                                result[i].sellername[0] = quotesWrapped
                                            }
                                        }
                                        output += result[i].sellername[0];
                                    } catch (e) {
                                    }
                                    output += ',';

                                    if(result[i].distance_prev)
                                        output += result[i].distance_prev.toFixed(3);
                                    else
                                        output += 0;
                                    output += ',';

                                    if($scope.checkIn2WheelerDist)
                                        output += $scope.checkIn2WheelerDist;    
                                    else
                                        output += 0;
                                    output += ',';

                                    if($scope.checkIn4WheelerDist)
                                        output += $scope.checkIn4WheelerDist;
                                    output += ',';
                                    
                                    if($scope.checkIn2WheelerDist && result[i].distance_prev)
                                        output += ($scope.checkIn2WheelerDist * result[i].distance_prev).toFixed(2);
                                    else
                                        output += 0;
                                    output += ',';

                                    if($scope.checkIn4WheelerDist && result[i].distance_prev)
                                        output += ($scope.checkIn4WheelerDist * result[i].distance_prev).toFixed(2);
                                    else
                                        output += 0;

                                        output += '\n';
                                }

                                var blob = new Blob([output], {type : "text/csv;charset=UTF-8"});
                                console.log(blob);
                                window.URL = window.webkitURL || window.URL;
                                var url = window.URL.createObjectURL(blob);

                                var d = new Date();
                                var anchor = angular.element('<a/>');

                                anchor.attr({
                                    href: url,
                                    target: '_blank',
                                    download: 'Mbj_' + instanceDetails.api_key + '_Salesperson_Checkins_distance_calculation_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                })[0].click();
                                //return response

                                jQuery.noConflict();
                                $('.refresh').css("display", "none");
                                
                            })
                            .error(function(data, status){
                                console.log(data);

                                Settings.alertPopup("Alert", "The server took too long to respond : Timeout Error. Please try again! " <br> "Error : " + data + " " + status);

                            });
                    }
                })
        }

    })
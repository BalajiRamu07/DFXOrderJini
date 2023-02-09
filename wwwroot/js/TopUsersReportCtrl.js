angular.module('ebs.controller')

    .controller("TopUsersReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Top Users Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Top Users";

        $scope.reportTabId = 3;
        $scope.tab = 8;
        $scope.showReports = true;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let instanceDetails =  Settings.getInstance();
        const api_timeout = 600000;

        $scope.sellerReportSearch = {};
        $scope.sellerReportSearch.filter = '';
        $scope.user_count = 0;
        //.... Reports Filter.....
        $scope.sellerReportFilter = {};

        $scope.branches = [];
        //.... Set Filter Dates to last 7 days....
        $scope.sellerReportFilter.startDate = new Date();
        $scope.sellerReportFilter.startDate.setDate($scope.sellerReportFilter.startDate.getDate() - 7);
        $scope.sellerReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.sellerReportFilter.endDate = new Date();
        $scope.sellerReportFilter.endDate.setHours(23, 59, 59, 59);


        let topUserSearchObj = {};
        let topSellerSearchBy = ['sellername'];

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }
        $scope.topSellerDuration = Settings.daysDifference($scope.sellerReportFilter.startDate , $scope.sellerReportFilter.endDate);
        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

        $scope.openFilterClear = () => {
            $scope.sellerReportFilter.startDate = '';
            $scope.sellerReportFilter.endDate = '';
            $scope.sellerReportFilter.branchCode = '';

            $scope.sellerReportFilter.startDate = new Date();
            $scope.sellerReportFilter.startDate.setDate($scope.sellerReportFilter.startDate.getDate() - 7);
            $scope.sellerReportFilter.startDate.setHours(0, 0, 0, 0);
            $scope.sellerReportFilter.endDate = new Date();
            $scope.sellerReportFilter.endDate.setHours(23, 59, 59, 59);
        }

        $scope.reportsTransactionCount = (response) => {
            // console.log("top user report  ",response);
            if(response){
                if(response > $scope.newViewBy){
                    $scope.user_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.user_count = response;
                    $scope.newViewBy = response;

                }
                else{
                    $scope.sellerreport = [];
                    $scope.newViewBy = 1;
                    $scope.user_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.sellerreport = [];
                $scope.newViewBy = 1;
                $scope.user_count = 0;
                $scope.viewLength = -1;
            }
        }

        const loadstorejiniReport = (topUserSearchObj) => {
            $http.post("/dash/reports/storeJini/sellers", topUserSearchObj)
                .success(function(response){
                    $scope.sellerreport = response;
                    $scope.reportsTransactionCount($scope.sellerreport.length);
                    stopLoader();
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

        const loadReport = (topUserSearchObj) => {
            $http.post("/dash/reports/sellers", topUserSearchObj)
                .success(function(response){
                    for(let i = 0; i < response.length; i++){
                        $scope.sellerreport.push(response[i]);
                    }

                    stopLoader();
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

        const loadReportCount = (searchObj) => {
            $http.post("/dash/reports/top/user/count", searchObj)
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

        //... Pagination for all reports
        $scope.navPage =  function(direction, newViewBy){
            $scope.newViewBy = parseInt(newViewBy);
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            if(direction){
                // console.log("NEXT");

                if(viewLength + viewBy >= $scope.sellerreport.length){
                    if(viewLength + viewBy < $scope.user_count){
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        topUserSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            topUserSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            topUserSearchObj.viewBy = initialViewBy;
                        }
                        topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                        topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                        topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                        topUserSearchObj.searchBy = topSellerSearchBy;
                        
                        startLoader();
                        loadReport(topUserSearchObj);
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.user_count){
                            a = viewLength + viewBy - $scope.user_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.user_count){
                        a = viewLength + viewBy - $scope.user_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.sellerreport.length){
                            topUserSearchObj.viewLength = $scope.sellerreport.length;
                            topUserSearchObj.viewBy = viewLength + viewBy - $scope.sellerreport.length;
                            topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                            topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                            topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                            topUserSearchObj.searchBy = topSellerSearchBy;

                            startLoader();
                            loadReport(topUserSearchObj);
                        }
                    }else {
                        if(viewLength + viewBy > $scope.sellerreport.length){
                            topUserSearchObj.viewLength = $scope.sellerreport.length;
                            topUserSearchObj.viewBy = viewLength + viewBy - $scope.sellerreport.length;
                            topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                            topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                            topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                            topUserSearchObj.searchBy = topSellerSearchBy;

                            startLoader();
                            loadReport(topUserSearchObj);
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
                    if(viewLength + viewBy >= $scope.user_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }


        $scope.changeReportView = (newViewBy) =>{
            startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);

            $scope.sellerreport = [];

            if($scope.sellerReportFilter.startDate && $scope.sellerReportFilter.endDate){
                if (($scope.sellerReportFilter.startDate - $scope.sellerReportFilter.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.sellerReportFilter.startDate = new Date();
                    $scope.sellerReportFilter.startDate.setDate($scope.sellerReportFilter.startDate.getDate() - 7);
                    $scope.sellerReportFilter.startDate.setHours(0, 0, 0, 0);
                    $scope.sellerReportFilter.endDate = new Date();
                    $scope.sellerReportFilter.endDate.setHours(23, 59, 59, 59);
                }
            }

            topUserSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                topUserSearchObj.viewBy = $scope.newViewBy;
            }else{
                topUserSearchObj.viewBy = initialViewBy;
            }
            topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
            topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
            topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
            topUserSearchObj.searchBy = topSellerSearchBy;
            topUserSearchObj.branch = '';
            $scope.sellerreport = [];

            if($scope.sellerReportFilter.branch)
                topUserSearchObj.branch = $scope.sellerReportFilter.branch ;

            $scope.viewLength = 0;

            if(!newViewBy) {
                $scope.newViewBy = parseInt(localViewBy);
            }

            loadReport(topUserSearchObj);
            loadReportCount(topUserSearchObj);
        }

        $scope.changeReportDuration = (startDate, endDate, reset) => {
            if(endDate)
                endDate.setHours(23, 59, 59, 59);

            if(!reset) {
                if(startDate || endDate){
                    let numberOfDays
                    if (startDate && endDate) {
                        let d1 = moment(startDate);
                        let d2 = moment(endDate);
                        numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else if (!endDate) {
                        let d1 = moment(startDate);
                        let d2 = moment(new Date());
                        numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else
                        numberOfDays = 0;

                    $scope.topSellerDuration = numberOfDays;
                }
            }else
                $scope.topSellerDuration = 0;
        }
        $scope.downloadCSV = function(){
            startLoader();
            var request_object = {
                url : "/dash/reports/top/user/count",
                method : "POST",
                timeout : api_timeout,
                data : topUserSearchObj
            };

            $http(request_object)
                .then((count) => {
                console.log(count);
            if(!count.data){
                Settings.failurePopup(
                    'WARNING',
                    'No records to download. Choose different filter'
                )
                stopLoader();
            }
            else if(count.data > 3000){
                Settings.failurePopup(
                    'WARNING',
                    'Please select a smaller date range.\nCurrent records : ' + count.data + ' - Max. records : 3000'
                )
                stopLoader();
            }
            else {

                console.log(topUserSearchObj);
                topUserSearchObj.viewLength = 0;
                topUserSearchObj.viewBy = count.data;

                var request_object = {
                    url : "/dash/reports/sellers",
                    method : "POST",
                    timeout : api_timeout,
                    data : topUserSearchObj
                };

                $http(request_object)
                    .then((result) => {
                    let _data = result.data;
                console.log(result.data);
                var output = 'id, Salesperson, Total_Orders, Total_Visit, Total_Line_Items, Total_Line_Amount, Total_Order_Amount';
                output += '\n'
                for (var i = 0; i < _data.length; i++) {
                    output += i + 1;
                    output += ',';

                    try {
                        if (_data[i].sellername) {
                            if ((_data[i].sellername).toString().indexOf(',') != -1) {
                                quotesWrapped = '"' + _data[i].sellername + '"'
                                _data[i].sellername = quotesWrapped
                            }
                        }
                        output += _data[i].sellername;
                    } catch (e) {
                    }
                    output += ',';

                    if (_data[i].orderId[0][0].length)
                        output += _data[i].orderId[0][0].length;
                    output += ',';

                    if (_data[i].visit)
                        output += _data[i].visit;
                    output += ',';

                    if (_data[i].quantity) {
                        _data[i].quantity = _data[i].quantity[0][0].length;
                        output += _data[i].quantity;
                    }
                    output += ',';

                    if (_data[i].total_amount)
                        output += _data[i].total_amount.toFixed(2);
                    output += ',';

                    if (_data[i].orderTotal_amount)
                        output += _data[i].orderTotal_amount.toFixed(2);

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
                    download: 'Mbj_' + instanceDetails.api_key + '_UserReport_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    //download: 'Mbj_' + '_UserReport_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                })[0].click();

                stopLoader();
            })
            .catch((error, status) => {
                    console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
            }
        })
        .catch((error, status) => {
                console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });
        }

        $scope.changeReportView(localViewBy);
    })
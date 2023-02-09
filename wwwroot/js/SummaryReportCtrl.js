
angular.module('ebs.controller')

.controller("SummaryReportCtrl", function ($scope, $http, Settings, $window) {
    console.log("Hello From Summary Report Controller .... !!!!");

    //.... User details....
    $scope.user = {};

    //..... Pagination.....
    $scope.viewLength = 0;
    $scope.newViewBy = 10;
 
    //.... Other View Values....
    $scope.newViewBy1 = {};
    $scope.newViewBy1.view = 10;

    $scope.reportTabName = "Summary";

    $scope.reportTabId = 4;
    $scope.tab = 8;
    $scope.showReports = true;
    $scope.summary_count = 0;

    let localViewBy = $scope.newViewBy;

    let initialViewBy = 60;
    let api_timeout = 600000;

    //.... Reports Filter.....
    $scope.orderReportFilter = {};

    //.... Set Filter Dates to last 7 days....
    $scope.orderReportFilter.startDate = new Date();
    $scope.orderReportFilter.startDate.setDate($scope.orderReportFilter.startDate.getDate() - 7);
    $scope.orderReportFilter.startDate.setHours(0, 0, 0, 0);
    $scope.orderReportFilter.endDate = new Date();
    $scope.orderReportFilter.endDate.setHours(23, 59, 59, 59);

    $scope.orderReportSearch = '';

    Settings.getNav(false, nav => {
        $scope.nav = nav;
        $scope.orderStatus = $scope.nav[1].status? $scope.nav[1].status : [];
    })

    let orderSummarySearchObj = {};
    let orderSearchBy = ['orderId', 'sellername', 'seller', 'dealername', 'dealerphone', 'quantity', 'stockistname'];

    let summarySearchObj = {};

    $scope.orderreport = [];

    //.... Dropdown Initialisations.....
    $scope.branches = [];
    $scope.warehouseLocation = [];

    const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    }

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    }

    $scope.summaryDuration = Settings.daysDifference($scope.orderReportFilter.startDate , $scope.orderReportFilter.endDate);

    $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);

    $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

    $scope.openFilterClear = () => {
        $scope.orderReportFilter.startDate = '';
        $scope.orderReportFilter.endDate = '';
        $scope.orderReportFilter.branchCode = '';
        $scope.orderReportFilter.status = '';
        $scope.orderReportFilter.warehouse = '';

        $scope.orderReportFilter.startDate = new Date();
        $scope.orderReportFilter.startDate.setDate($scope.orderReportFilter.startDate.getDate() - 7);
        $scope.orderReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.orderReportFilter.endDate = new Date();
        $scope.orderReportFilter.endDate.setHours(23, 59, 59, 59);
    }

    $scope.reportsTransactionCount = (response) => {
        if(response){
            if(response > $scope.newViewBy){
                $scope.summary_count = response;
            }
            else if(response <= $scope.newViewBy){
                $scope.summary_count = response;
                $scope.newViewBy = response;

            }
            else{
                $scope.orderreport = [];
                $scope.newViewBy = 1;
                $scope.summary_count = 0;
                $scope.viewLength = -1;
            }
        }
        else{
            $scope.orderreport = [];
            $scope.newViewBy = 1;
            $scope.summary_count = 0;
            $scope.viewLength = -1;
        }
    }

    const loadReport = (searchObj) => {
        $http.post("/dash/reports/ordersreport", searchObj)
            .success(response => {
                
                for(let i = 0; i < response.length; i++){
                    $scope.orderreport.push(response[i]);
                }

                stopLoader();
            })
            .error((error, status) => {
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
        $http.post("/dash/reports/summary/count", searchObj)
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

    $scope.navPage = (direction, newViewBy) => {
        $scope.newViewBy = parseInt(newViewBy);

        var viewLength = $scope.viewLength;
        var viewBy = $scope.newViewBy;
        if(direction){
            // console.log("NEXT");

            if(viewLength + viewBy >= $scope.orderreport.length){
                if(viewLength + viewBy < $scope.summary_count){
                    viewLength += viewBy;
                    //console.log("Fetch more")
                    summarySearchObj.viewLength = viewLength;
                    if($scope.newViewBy > initialViewBy ){
                        summarySearchObj.viewBy = $scope.newViewBy;
                    }else{
                        summarySearchObj.viewBy = initialViewBy;
                    }
                    summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
                    summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');

                    startLoader();
                    loadReport(summarySearchObj);
                    
                    if(viewLength + viewBy > $scope.summary_count){
                        a = viewLength + viewBy - $scope.summary_count;
                        viewBy -= a;
                        $scope.newViewBy = viewBy;
                    }
                    $scope.viewLength = viewLength;
                    
                }
                else{
                    // console.log("Out of data")
                    if(viewLength + viewBy > $scope.summary_count){
                        a = viewLength + viewBy - $scope.summary_count;
                        viewBy -= a;
                        $scope.newViewBy = viewBy;
                    }
                }
            }
            else{
                // console.log("Minus viewby")
                viewLength += viewBy;

                if(viewLength + viewBy > $scope.summary_count){
                    a = viewLength + viewBy - $scope.summary_count;
                    viewBy -= a;
                    if(viewLength + viewBy > $scope.orderreport.length){
                        summarySearchObj.viewLength = $scope.orderreport.length;
                        summarySearchObj.viewBy = viewLength + viewBy - $scope.orderreport.length;
                        summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
                        summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');

                        startLoader();
                        loadReport(summarySearchObj);
                    }
                }else{
                    if(viewLength + viewBy > $scope.orderreport.length){
                        summarySearchObj.viewLength = $scope.orderreport.length;
                        summarySearchObj.viewBy = viewLength + viewBy - $scope.orderreport.length;
                        summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
                        summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');

                        startLoader();
                        loadReport(summarySearchObj);
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
                if(viewLength + viewBy >= $scope.summary_count){
                    viewBy += a;
                    a = 0;
                }

                viewLength -= viewBy;

                $scope.viewLength = viewLength;
                $scope.newViewBy = viewBy;
            }
        }
    }

    $scope.downloadCSV = function(){
        startLoader();
        var request_object = {
            url : "/dash/reports/summary/count",
            method : "POST",
            timeout : api_timeout,
            data : summarySearchObj
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

                    console.log(summarySearchObj);
                    summarySearchObj.viewLength = 0;
                    summarySearchObj.viewBy = count.data;

                    var request_object = {
                        url : "/dash/reports/ordersreport",
                        method : "POST",
                        timeout : api_timeout,
                        data : summarySearchObj
                    };

                    $http(request_object)
                        .then((result) => {
                            let _data = result.data;
                            console.log(result.data);
                            let output = 'id, Date, Orders, lines, Quantity,  Total_line_amount,Total_order_amount';
                            output += '\n'
                            for (var i = 0; i < _data.length; i++) {
                                output += i + 1;
                                output += ',';
                                output += (_data[i]._id.day + '-' + _data[i]._id.month + '-' + _data[i]._id.year);
                                output += ',';

                                if (_data[i].orderDetail.length)
                                    output += _data[i].orderDetail.length;
                                output += ',';

                                if (_data[i].orderLines)
                                    output += _data[i].orderLines;
                                output += ',';

                                if (_data[i].quantity)
                                    output += _data[i].quantity;
                                output += ',';

                                if (_data[i].total)
                                    output += _data[i].total.toFixed(2);
                                output += ',';

                                if (_data[i].orderTotal)
                                    output += _data[i].orderTotal.toFixed(2);

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
                                //download: 'Mbj_' + $scope.user.username + '_Summary_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                download: 'Mbj_' + 'Summary_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                            })[0].click();
                            //return response

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

    $scope.changeReportView = (newViewBy) => {
        startLoader();
        $scope.newViewBy1.view = newViewBy || 10;
        $scope.newViewBy = parseInt(newViewBy || 10);

        if($scope.orderReportFilter.startDate && $scope.orderReportFilter.endDate){
            if (($scope.orderReportFilter.startDate - $scope.orderReportFilter.endDate) > 0){
                Settings.alertPopup("WARNING", "Invalid Date Range set.");

                $scope.orderReportFilter.startDate = new Date();
                $scope.orderReportFilter.startDate.setDate($scope.orderReportFilter.startDate.getDate() - 7);
                $scope.orderReportFilter.startDate.setHours(0, 0, 0, 0);
                $scope.orderReportFilter.endDate = new Date();
                $scope.orderReportFilter.endDate.setHours(23, 59, 59, 59);

                return;
            }
        }

        summarySearchObj.viewLength = 0;
        if($scope.newViewBy > initialViewBy ){
            summarySearchObj.viewBy = $scope.newViewBy;
        }else{
            summarySearchObj.viewBy = initialViewBy;
        }
        summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
        summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');
        summarySearchObj.branch = '';

        if($scope.orderReportFilter.branchCode)
            summarySearchObj.branch = $scope.orderReportFilter.branchCode ;
        $scope.orderreport = [];
        $scope.viewLength = 0;

        if(!newViewBy){
            $scope.newViewBy = localViewBy;
        }

        summarySearchObj.warehouse = '';
        if($scope.orderReportFilter.warehouse)
            summarySearchObj.warehouse = $scope.orderReportFilter.warehouse ;

        summarySearchObj.status = '';
        if($scope.orderReportFilter.status)
            summarySearchObj.status = $scope.orderReportFilter.status ;

        loadReport(summarySearchObj);
        loadReportCount(summarySearchObj);
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

                    $scope.summaryDuration = numberOfDays;
            }
        }else
            $scope.summaryDuration = 0;
    }

    Settings.getUserInfo((user_details) => {
        console.log(user_details)
        if(user_details.sellerObject)
            $scope.user = user_details.sellerObject;
        else
            $scope.user = user_details;
    });

    const loadWarehouse = () => {
        $http.get("/dash/settings/inventory/locations")
            .then(res => {
                if(res.data.length){
                    $scope.warehouseLocation = res.data[0].location;
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const loadBranches = () => {
        $http.get("/dash/store/branches")
            .then(function(response){
                if(response.data.length){
                    for(var i = 0; i < response.data.length; i++){
                        if(response.data[i].branchCode[0] && response.data[i].branchName[0])
                            $scope.branches.push({'branchCode' : response.data[i].branchCode[0], 'branchName' : response.data[i].branchName[0]});
                    }
                }
            }).catch(err => {
                console.log(err);
            })
    }

    loadWarehouse();
    loadBranches();

    $scope.changeReportView(localViewBy);
})
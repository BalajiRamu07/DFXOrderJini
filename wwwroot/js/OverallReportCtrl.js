angular.module('ebs.controller')

    .controller("OverallReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Overall Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Overall report";

        $scope.reportTabId = 14;
        $scope.tab = 8;
        $scope.showReports = true;
        $scope.overall_count = 0;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let instanceDetails =  Settings.getInstance();
        const api_timeout = 600000;

        $scope.overallreports = [];
        //.... Reports Filter.....
        $scope.overallReportFilter = {};
        $scope.sellerNames = [];

        //.... Set Filter Dates to last 7 days....
        $scope.overallReportFilter.startDate = new Date();
        $scope.overallReportFilter.startDate.setDate($scope.overallReportFilter.startDate.getDate() - 7);
        $scope.overallReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.overallReportFilter.endDate = new Date();
        $scope.overallReportFilter.endDate.setHours(23, 59, 59, 59);

        let overallSearchObj = {};
        let reportSearchBy = ['seller', 'sellername', 'dealername', 'dealerphone','stockist','stockistname'];

        //$scope.atmsReportsDuration = Settings.daysDifference($scope.orderReportFilter.startDate , $scope.orderReportFilter.endDate);
        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        $scope.openFilterClear = () => {
            $scope.overallReportFilter.startDate = '';
            $scope.overallReportFilter.endDate = '';
            $scope.overallReportFilter.seller = '';
            $scope.overallReportFilter.filter = '';
            $scope.overallReportFilter.stockist = '';

            $scope.overallReportFilter.startDate = new Date();
            $scope.overallReportFilter.startDate.setDate($scope.overallReportFilter.startDate.getDate() - 7);
            $scope.overallReportFilter.startDate.setHours(0, 0, 0, 0);
            $scope.overallReportFilter.endDate = new Date();
            $scope.overallReportFilter.endDate.setHours(23, 59, 59, 59);
        };


        const loadSalesrep = () =>{
            $http.get("/dash/role/sellers/Salesperson")
                .success(function (salesperson) {
                    // console.log("Salesperson : ", salesperson);
                    if (salesperson && salesperson.length) {
                        $scope.roleSalesrep = [];
                        for (var i = 0; i < salesperson.length; i++) {
                            if(salesperson[i] && salesperson[i].userStatus == 'Active')
                            $scope.roleSalesrep.push({
                                sellername: salesperson[i].sellername,
                                sellerphone: salesperson[i].sellerphone
                            });
                            //$scope.fulfillerNames[fulfillers[i].sellerphone] = fulfillers[i].sellername;
                        }

                        $scope.salespersonLength = $scope.roleSalesrep.length;
                        //$scope.refreshSellerNames();

                    }
                });
        }
        const loadStockist = () =>{
            $http.get("/dash/stores/all/stockist").success(function (response) {
                //  console.log("stockist=====",response);
                allStockist = response;
                $scope.allStockistFromDealer = allStockist.unique('Stockist');
                for (var i = 0; i < response.length; i++)
                    $scope.sellerNames[response[i].Stockist] = response[i].StockistName;
            }).error(function (error, status) {
                console.log(error, status);
                if (status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if (status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
        };


        const loadReport = (overallSearchObj) => {
            $http.post("/dash/reports/overallreports", overallSearchObj)
                .success(function(response){
                     console.log(response);
                    $scope.overallreports = [];
                    for(let i = 0; i < response.length; i++){
                        response[i].stockist = response[i].stockist.join(",");
                        response[i].stockistname = response[i].stockistname.join(",");
                        $scope.overallreports.push(response[i]);
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
        };

        const loadReportCount = (overallSearchObj) => {
            $http.post("/dash/reports/overallreport/count", overallSearchObj)
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
        };


        $scope.reportsTransactionCount = (response) => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.overall_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.overall_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.overallreports = [];
                    $scope.newViewBy = 1;
                    $scope.overall_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.overallreports = [];
                $scope.newViewBy = 1;
                $scope.overall_count = 0;
                $scope.viewLength = -1;
            }
        }

        $scope.navPage = (direction, newViewBy) => {
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;


            if(direction){
                //console.log(" overallreports NEXT");
                if(viewLength + viewBy >= $scope.overallreports.length){

                    if(viewLength + viewBy < $scope.overall_count){
                        viewLength += viewBy;
                        // console.log("Fetch more")
                        overallSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            overallSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            overallSearchObj.viewBy = initialViewBy;
                        }
                        overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
                        overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
                        overallSearchObj.searchFor = $scope.overallReportFilter.filter;
                        overallSearchObj.searchBy = reportSearchBy;

                        startLoader();
                        loadReport(overallSearchObj);
                        if(viewLength + viewBy > $scope.overall_count){
                            a = viewLength + viewBy - $scope.overall_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.overall_count){
                            a = viewLength + viewBy - $scope.overall_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.overall_count){
                        a = viewLength + viewBy - $scope.overall_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.overallreports.length){
                            overallSearchObj.viewLength = $scope.overallreports.length;
                            overallSearchObj.viewBy = viewLength + viewBy - $scope.overallreports.length;
                            overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
                            overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
                            overallSearchObj.searchFor = $scope.overallReportFilter.filter;
                            overallSearchObj.searchBy = reportSearchBy;

                            startLoader();
                            loadReport(overallSearchObj);
                        }
                    }else{
                        if(viewLength + viewBy > $scope.overallreports.length){
                            overallSearchObj.viewLength = $scope.overallreports.length;
                            overallSearchObj.viewBy = viewLength + viewBy - $scope.overallreports.length;
                            overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
                            overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
                            overallSearchObj.searchFor = $scope.overallReportFilter.filter;
                            overallSearchObj.searchBy = reportSearchBy;

                            startLoader();
                            loadReport(overallSearchObj);

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
                    if(viewLength + viewBy >= $scope.overall_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.changeReportView = (newViewBy) => {
            startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);

            if($scope.overallReportFilter.startDate && $scope.overallReportFilter.endDate){
                if (($scope.overallReportFilter.startDate - $scope.overallReportFilter.endDate) > 0){
                    bootbox.alert({
                        title : 'WARNING',
                        message : 'Start date cannot be greater than End date.',
                        className : 'text-center'
                    })

                    $scope.overallReportFilter.startDate = new Date();
                    $scope.overallReportFilter.startDate.setDate($scope.overallReportFilter.startDate.getDate() - 7);
                    $scope.overallReportFilter.startDate.setHours(0, 0, 0, 0);
                    $scope.overallReportFilter.endDate = new Date();
                    $scope.overallReportFilter.endDate.setHours(23, 59, 59, 59);
                }
            }

            if($scope.overallReportFilter.seller){
                overallSearchObj.seller = $scope.overallReportFilter.seller;
            }else{
                overallSearchObj.seller = '';
            }
            if($scope.overallReportFilter.stockist){
                overallSearchObj.stockist = $scope.overallReportFilter.stockist;
            }else{
                overallSearchObj.stockist = '';
            }


            overallSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                overallSearchObj.viewBy = $scope.newViewBy;
            }else{
                overallSearchObj.viewBy = initialViewBy;
            }
            overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
            overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
            overallSearchObj.dateWise = $scope.dateWise;
            overallSearchObj.searchFor = $scope.overallReportFilter.filter;
            overallSearchObj.searchBy = reportSearchBy;

            $scope.viewLength = 0;
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            startLoader();
            loadReport(overallSearchObj);
            loadReportCount(overallSearchObj);


            /*setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 5000);*/
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

                    $scope.atmsReportsDuration = numberOfDays;
                }
            }else
                $scope.atmsReportsDuration = 0;
        }


        $scope.renderOverallReport = function() {
            if($scope.overallReportFilter.startDate && $scope.overallReportFilter.endDate){
                if (($scope.overallReportFilter.startDate - $scope.overallReportFilter.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    return;
                }
            }

            if($scope.overallReportFilter.seller){
                overallSearchObj.seller = $scope.overallReportFilter.seller;
            }
            else{
                overallSearchObj.seller = '';
            }

            if($scope.overallReportFilter.stockist){
                overallSearchObj.stockist = $scope.overallReportFilter.stockist;
            }
            else{
                overallSearchObj.stockist = '';
            }

            overallSearchObj.viewLength = 0;
            overallSearchObj.viewBy = initialViewBy;
            overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
            overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
            overallSearchObj.dateWise = $scope.dateWise;
            overallSearchObj.searchFor = $scope.overallReportFilter.filter;
            overallSearchObj.searchBy = reportSearchBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            startLoader();
            loadReport(overallSearchObj);
            loadReportCount(overallSearchObj);
        };

        $scope.downloadCSV = function(){
            startLoader();
            var request_object = {
                url : "/dash/reports/overallreport/count",
                method : "POST",
                timeout : api_timeout,
                data : overallSearchObj
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
            else if(count.data > 6000){
                Settings.failurePopup(
                    'WARNING',
                    'Please select a smaller date range.\nCurrent records : ' + count.data + ' - Max. records : 6000'
                )
                stopLoader();
            }
            else {

                console.log(overallSearchObj);
                overallSearchObj.viewLength = 0;
                overallSearchObj.viewBy = count.data;

                var request_object = {
                    url : "/dash/reports/overallreports",
                    method : "POST",
                    timeout : api_timeout,
                    data : overallSearchObj
                };

                $http(request_object)
                    .then((result) => {
                    let _data = result.data;
                console.log(result.data);
                var output = 'Id,Date,Sales person,Stockist Name,Stockist Phone,Name of Outlet,Count of visit, Count of order,Value of order';
                output += '\n'
                for (var i = 0; i < _data.length; i++) {
                    /*for (let j = 0; j < _data[i].stockistname.length; j++) {*/
                    output += i + 1;
                    output += ',';
                    function formatdate(date) {
                        if (!date)
                            return ('');
                        /* replace is used to ensure cross browser support*/
                        var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        var dt = d.getDate();
                        if (dt < 10)
                            dt = "0" + dt;
                        return (dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear()));
                    }


                    var dateformat = formatdate(_data[i].date_added[0]);
                    output += dateformat;
                    output += ',';

                    /*for (let j = 0; j < _data[i].stockistname.length; j++) {*/
                        try {
                            if (_data[i].sellername) {
                                if ((_data[i].sellername).toString().indexOf(',') != -1) {
                                    var quotesWrapped = '"' + _data[i].sellername[0] + '"';
                                    _data[i].sellername = quotesWrapped
                                }
                            }
                            output += _data[i].sellername;
                        } catch (e) {
                        }
                        output += ',';

                        try {
                            if (_data[i].stockistname) {
                                if ((_data[i].stockistname).toString().indexOf(',') != -1) {
                                    //  var quotesWrapped = '"' + _data[i].stockistname[0] + '"';
                                    var quotesWrapped = '"' + _data[i].stockistname + '"';
                                    _data[i].stockistname = quotesWrapped
                                }
                            }
                            output += _data[i].stockistname;
                        } catch (e) {
                        }
                        output += ',';

                        try {
                            if (_data[i].stockist) {
                                //  console.log("_data[i].stockist",_data[i].stockist);
                                if ((_data[i].stockist).toString().indexOf(',') != -1) {
                                    //   console.log("_data[i].stockist1",_data[i].stockist);
                                    //  var quotesWrapped = '"' + _data[i].stockist[0] + '"';
                                    var quotesWrapped = '"' + _data[i].stockist + '"';
                                    _data[i].stockist = quotesWrapped
                                }
                            }
                            output += _data[i].stockist;

                        } catch (e) {
                        }
                        output += ',';

                        try {
                            if (_data[i].dealer) {
                                if (_data[i].dealer) {
                                    if ((_data[i].dealer).toString().indexOf(',') != -1) {
                                        var quotesWrapped = '"' + _data[i].dealer + '"'
                                        _data[i].dealer = quotesWrapped
                                    }
                                    output += _data[i].dealer;
                                }
                            }
                        } catch (e) {
                        }
                        output += ',';

                    if (_data[i].check_in_count)
                        output += _data[i].check_in_count;
                    output += ',';

                    if (_data[i].orders_count)
                        output += _data[i].orders_count;
                    output += ',';

                    output += _data[i].orderTotal.toFixed(2);


                    output += '\n';

                    /*}*/
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
                    download: 'Mbj_' + instanceDetails.api_key + '_Overall_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    //download: 'Mbj_' + '_Overall_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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
        };

        loadSalesrep();
        loadStockist();
        $scope.changeReportView(localViewBy);
    })

angular.module('ebs.controller')
// const countlyDb = require('../../../../../../lib/db')
.controller("TopCustomersReportCtrl", function ($scope, $http, Settings, $window) {
    console.log("Hello From Top Customers Report Controller .... !!!!");

    //.... User details....
    $scope.user = {};

    //..... Pagination.....
    $scope.viewLength = 0;
    $scope.newViewBy = 10;

    //.... Other View Values....
    $scope.newViewBy1 = {};
    $scope.newViewBy1.view = 10;

    $scope.reportTabName = "Top Customers";

    $scope.reportTabId = 2;
    $scope.showReports = true;
    $scope.customer_count = 0;
    let localViewBy = $scope.newViewBy;
    let initialViewBy = 60;

    let instanceDetails =  Settings.getInstance();
    console.log('Instance details in top customers', instanceDetails);
    const api_timeout = 600000;
    //... Reports Filters...
    $scope.dealerReportFilter = {};

    $scope.dealerReportFilter.startDate = new Date();
    $scope.dealerReportFilter.startDate.setDate($scope.dealerReportFilter.startDate.getDate() - 7);
    $scope.dealerReportFilter.startDate.setHours(0, 0, 0, 0);
    $scope.dealerReportFilter.endDate = new Date();
    $scope.dealerReportFilter.endDate.setHours(23, 59, 59, 59);

    $scope.dealerReportSearch = {};
    $scope.dealerReportSearch.filter = '';

    let dealerSearchObj = {};
    let dealerSearchBy = ['Dealercode', 'DealerName', 'City', 'seller','SellerName', 'StockistName', 'Area', 'Phone', 'email'];

    let topCustomerSearchObj = {};

    let topDealerSearchBy = ['dealername','sellername'];

    $scope.dealerSelectAll = {};
    $scope.dealerSelectAll.city = true;

    topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
    topCustomerSearchObj.searchBy = topDealerSearchBy;

    //... Main Dealer Report Table View....
    $scope.dealerreport = [];
    $scope.roleSalesrep = [];
    $scope.dealer_area = [];
    $scope.sellerNames = [];

    const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    }

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    }

    $scope.topDealersDuration = Settings.daysDifference($scope.dealerReportFilter.startDate , $scope.dealerReportFilter.endDate);

    $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);

    $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

    $scope.reportsTransactionCount = (response) => {
        if(response){
            console.log('Count response', response);
            if(response > $scope.newViewBy){
                $scope.customer_count = response;
            }
            else if(response <= $scope.newViewBy){
                $scope.customer_count = response;
                $scope.newViewBy = response;
            }
            else{
                $scope.dealerreport = [];
                $scope.newViewBy = 1;
                $scope.customer_count = 0;
                $scope.viewLength = -1;
            }
        }
        else{
            $scope.dealerreport = [];
            $scope.newViewBy = 1;
            $scope.customer_count = 0;
            $scope.viewLength = -1;
        }
    }

    const loadReport = searchObj => {
        $http.post("/dash/reports/dealers", searchObj)
            .then(response => {
                for(let i = 0; i < response.data.length; i++){
                    $scope.dealerreport.push(response.data[i]);
                }

                stopLoader();
            })
            .catch(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
    };

    const loadReportCount = searchObj => {
        $http.post("/dash/reports/top/customer/count", searchObj)
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

    $scope.clearFilter = () => {
        //.... Top Customers...
        topCustomerSearchObj.viewLength = 0;
        topCustomerSearchObj.viewBy = initialViewBy;

        $scope.newViewBy1.view = 10;
        $scope.viewLength = 0;
        $scope.newViewBy = localViewBy;

        if($scope.dealerReportSearch.filter){
            topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
            topCustomerSearchObj.searchBy = topDealerSearchBy;
        }

        $scope.dealerreport = [];

        $scope.showTopCustomerFilter = true;

        if($scope.dealerReportSearch.filter == '')
            $scope.showTopCustomerFilter = false;

        $scope.changeReportView();
    };


    $scope.navPage = (direction, newViewBy) => {
        $scope.newViewBy = parseInt(newViewBy);

        var viewLength = $scope.viewLength;
        var viewBy = $scope.newViewBy;

        if(direction){
            if(viewLength + viewBy >= $scope.dealerreport.length){

                if(viewLength + viewBy < $scope.customer_count){
                    viewLength += viewBy;
                    // console.log("Fetch more")
                    topCustomerSearchObj.viewLength = viewLength;
                    if($scope.newViewBy > initialViewBy ){
                        topCustomerSearchObj.viewBy = $scope.newViewBy;
                    }else{
                        topCustomerSearchObj.viewBy = initialViewBy;
                    }
                    topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
                    topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
                    topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                    topCustomerSearchObj.searchBy = topDealerSearchBy;

                    startLoader();
                    loadReport(topCustomerSearchObj);

                    if(viewLength + viewBy > $scope.customer_count){
                        a = viewLength + viewBy - $scope.customer_count;
                        viewBy -= a;
                        $scope.newViewBy = viewBy;
                    }
                    $scope.viewLength = viewLength;
                }
                else{
                    // console.log("Out of data")
                    if(viewLength + viewBy > $scope.customer_count){
                        a = viewLength + viewBy - $scope.customer_count;
                        viewBy -= a;
                        $scope.newViewBy = viewBy;
                    }
                }
            }
            else{
                // console.log("Minus viewby")
                viewLength += viewBy;

                if(viewLength + viewBy > $scope.customer_count){
                    a = viewLength + viewBy - $scope.customer_count;
                    viewBy -= a;
                    if(viewLength + viewBy > $scope.dealerreport.length){
                        topCustomerSearchObj.viewLength = $scope.dealerreport.length;
                        topCustomerSearchObj.viewBy = viewLength + viewBy - $scope.dealerreport.length;
                        topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
                        topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
                        topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                        topCustomerSearchObj.searchBy = topDealerSearchBy;

                        startLoader();
                        loadReport(topCustomerSearchObj);
                    }
                }else {
                    if(viewLength + viewBy > $scope.dealerreport.length){
                        topCustomerSearchObj.viewLength = $scope.dealerreport.length;
                        topCustomerSearchObj.viewBy = viewLength + viewBy - $scope.dealerreport.length;
                        topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
                        topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
                        topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                        topCustomerSearchObj.searchBy = topDealerSearchBy;

                        startLoader();
                        loadReport(topCustomerSearchObj);
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
                if(viewLength + viewBy >= $scope.customer_count){
                    viewBy += a;
                    a = 0;
                }

                viewLength -= viewBy;

                $scope.viewLength = viewLength;
                $scope.newViewBy = viewBy;
            }
        }
    };


    $scope.changeReportView = (newViewBy) => {
        startLoader();
        $scope.newViewBy1.view = newViewBy || 10;
        $scope.newViewBy = parseInt(newViewBy || 10);

        if($scope.dealerReportFilter.startDate && $scope.dealerReportFilter.endDate){
            if (($scope.dealerReportFilter.startDate - $scope.dealerReportFilter.endDate) > 0){
                Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                $scope.dealerReportFilter.startDate = new Date();
                $scope.dealerReportFilter.startDate.setDate($scope.dealerReportFilter.startDate.getDate() - 7);
                $scope.dealerReportFilter.startDate.setHours(0, 0, 0, 0);
                $scope.dealerReportFilter.endDate = new Date();
                $scope.dealerReportFilter.endDate.setHours(23, 59, 59, 59);

            }
        }

        topCustomerSearchObj.viewLength = 0;
        if($scope.newViewBy > initialViewBy ){
            topCustomerSearchObj.viewBy = $scope.newViewBy;
        }else{
            topCustomerSearchObj.viewBy = initialViewBy;
        }
        topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
        topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
        topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
        topCustomerSearchObj.searchBy = topDealerSearchBy;
        topCustomerSearchObj.seller = '';
        topCustomerSearchObj.branch = '';
        topCustomerSearchObj.region = '';
        topCustomerSearchObj.area = '';
        topCustomerSearchObj.warehouse = '';

        if($scope.dealerReportFilter.branch)
            topCustomerSearchObj.branch = report.branch ;
        if($scope.dealerReportFilter.seller)
            topCustomerSearchObj.seller = $scope.dealerReportFilter.seller ;
        if($scope.dealerReportFilter.region)
            topCustomerSearchObj.region = $scope.dealerReportFilter.region ;
        if($scope.dealerReportFilter.area)
            topCustomerSearchObj.area = $scope.dealerReportFilter.area ;
        if($scope.dealerReportFilter.warehouse)
            topCustomerSearchObj.warehouse = $scope.dealerReportFilter.warehouse ;

        $scope.viewLength = 0;
        $scope.dealerreport = [];

        if(!newViewBy){
            $scope.newViewBy = parseInt(localViewBy);
        }

        loadReport(topCustomerSearchObj);
        loadReportCount(topCustomerSearchObj);
    };

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

                    $scope.topDealersDuration = numberOfDays;
            }
        }else
            $scope.topDealersDuration = 0;
    }

    Settings.getUserInfo((user_details) => {
        if(user_details.sellerObject)
            $scope.user = user_details.sellerObject;
        else
            $scope.user = user_details;
    });

    $scope.openFilterClear = () => {
        $scope.dealerReportFilter.startDate = '';
        $scope.dealerReportFilter.endDate = '';
        $scope.dealerReportFilter.branchCode = '';
        $scope.dealerReportFilter.seller = '';
        $scope.dealerReportFilter.area = '';
        $scope.dealerReportFilter.region = '';
        $scope.dealerReportFilter.warehouse = '';

        $scope.dealerReportFilter.startDate = new Date();
        $scope.dealerReportFilter.startDate.setDate($scope.dealerReportFilter.startDate.getDate() - 7);
        $scope.dealerReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.dealerReportFilter.endDate = new Date();
        $scope.dealerReportFilter.endDate.setHours(23, 59, 59, 59);
    }

    //.... Areas Dropdown data....
    $scope.getAllStoreAreas = function(type){
        $http.post("/dash/stores/filter/" + type, {viewBy : 0})
            .then(area => {
                // console.log("Get all Areas......")
                $scope.dealer_area = area.data;

                $scope.dealer_area.map(function (dealer) {

                    if($scope.dealerSelectAll.city){
                        dealer.selected_area = true;
                    }else{
                        dealer.dealer_area = true
                        $scope.dealer_area = [];
                    }
                    return dealer;
                })
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

    $scope.getAllStoreAreas('area');


    const refreshSellerNames = () => {
        if(typeof $scope.roleSalesrep == 'object'){
            for(let j = 0; j < $scope.roleSalesrep.length; j++){
                if($scope.roleSalesrep[j].role && $scope.roleSalesrep[j].userStatus == 'Active')
                    $scope.sellerNames[$scope.roleSalesrep[j].sellerphone] = $scope.roleSalesrep[j].sellername;
            }
        }
    }

    const loadSalespersons = () => {
        $http.get("/dash/role/sellers/Salesperson")
            .then(list => {
                let salesperson = list.data;
                if(salesperson && salesperson.length){
                    for(var i = 0; i < salesperson.length; i++){
                        if(salesperson[i] && salesperson[i].userStatus == 'Active')
                        $scope.roleSalesrep.push({sellername : salesperson[i].sellername, sellerphone : salesperson[i].sellerphone});
                    }

                    refreshSellerNames();
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

    $scope.downloadCSV = function(){
        startLoader();
        var request_object = {
            url : "/dash/reports/top/customer/count",
            method : "POST",
            timeout : api_timeout,
            data : topCustomerSearchObj
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
                $http.get("/dash/nav/")
                    .then(nav => {
                    console.log(topCustomerSearchObj);
                    topCustomerSearchObj.viewLength = 0;
                    topCustomerSearchObj.viewBy = count.data;

                    var request_object = {
                        url : "/dash/reports/dealers",
                        method : "POST",
                        timeout : api_timeout,
                        data : topCustomerSearchObj
                    };

                    $http(request_object)
                        .then((result) => {
                        let _data = result.data;
                    console.log(result.data);

                    // var dealerCode = toTitleCase(nav[2].display[0] || 'Dealercode') ;
                    // var dealerName = toTitleCase(nav[2].display[1] || 'Dealername') ;
                    // var salesPhone = toTitleCase(nav[2].display[5] || 'Salesperson phone') ;
                    // var salesName =  toTitleCase(nav[2].display[6] || 'Salesperson Name') ;
                    var dealerCode = toTitleCase(nav.data[2].display[0]  || 'Dealercode') ;
                    var dealerName = toTitleCase(nav.data[2].display[1] || 'Dealername') ;
                    var salesPhone = toTitleCase(nav.data[2].display[5] ||'Salesperson phone') ;
                    var salesName =  toTitleCase(nav.data[2].display[6] ||'Salesperson Name') ;

                    var output = 'id, '+dealerCode+ ', '+dealerName+', Phone, '+ salesPhone+', '+salesName+', lines, Quantity, Total, Ordertotal'
                    output += '\n'
                    for (var i = 0; i < _data.length; i++) {
                        output += i + 1;
                        output += ',';
                        if (_data[i]._id.dealercode)
                            output += _data[i]._id.dealercode;
                        output += ',';
                        try {
                            if (_data[i].dealername) {
                                if ((_data[i].dealername).toString().indexOf(',') != -1) {
                                    var quotesWrapped = '"' + _data[i].dealername + '"';
                                    _data[i].dealername = quotesWrapped
                                }
                                output += _data[i].dealername;
                            }
                        } catch (e) {
                        }
                        output += ',';
                        if (_data[i].dealerphone)
                            output += _data[i].dealerphone;
                        output += ',';
                        if (_data[i].seller)
                            output += _data[i].seller;
                        output += ',';

                        try {
                            if (_data[i].sellername) {
                                if ((_data[i].sellername).toString().indexOf(',') != -1) {
                                    var quotesWrapped = '"' + _data[i].sellername + '"';
                                    _data[i].sellername = quotesWrapped
                                }
                            }
                            output += _data[i].sellername;


                    } catch (e) {
                    }
                    output += ',';

                    if (_data[i].lines)
                        output += _data[i].lines;
                    output += ',';

                    if (_data[i].quantity) {
                        output += parseFloat(_data[i].quantity.toFixed(2));
                        // let tot_quant = 0;
                        // for (j = 0; j < _data[i].quantity.length; j++) {
                        //     tot_quant += Number(_data[i].quantity[j]);
                        // }
                        // _data[i].quantity = tot_quant;
                        // output += _data[i].quantity.toFixed(2);
                    }
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
                        download: 'Mbj_' + instanceDetails.api_key + '_TopDealers_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                        //download: 'Mbj_' + '_TopDealers_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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
                    })
                .catch(function(error, status){
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
            })
        };

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    loadSalespersons();
    $scope.changeReportView(localViewBy);

})
angular.module('ebs.controller')

    .controller("BilledReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Items not billed Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Items Not Billed";

        $scope.reportTabId = 9;
        $scope.tab = 8;
        $scope.showReports = true;
        $scope.sku_count = 0;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let instanceDetails =  Settings.getInstance();

        $scope.itemCategories = [];
        $scope.skureport = [];
        //.... Reports Filter.....
        $scope.skuReportFilter = {};
        //.... Set Filter Dates to last 7 days....
        $scope.skuReportFilter.startDate = new Date();
        $scope.skuReportFilter.startDate.setDate($scope.skuReportFilter.startDate.getDate() - 7);
        $scope.skuReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.skuReportFilter.endDate = new Date();
        $scope.skuReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.skuReportFilter.dealer = {};
        $scope.skuReportFilter.dealer.Dealercode = '0'
        $scope.skuReportFilter.category = {};
        $scope.skuReportFilter.category.Manufacturer = '0';


        const api_timeout = 600000;

        let skuSearchObj = {};
        let itemSearchBy = ['itemCode', 'Product', 'Manufacturer', 'subCategory','subSubCategory'];

        $scope.skuDuration = Settings.daysDifference($scope.skuReportFilter.startDate , $scope.skuReportFilter.endDate);
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
            $scope.skuReportFilter.startDate = '';
            $scope.skuReportFilter.endDate = '';
            $scope.skuReportFilter.category = {};
            $scope.skuReportFilter.dealer = {};
        }
        $scope.clearArray = () => {
            $scope.skureport = [];
        }
        const loadCategories = () =>{
            /*$scope.getAllCategories = function (type) {*/
                $http.post("/dash/items/filter/" + 'category', {viewBy: 0})
                    .success(function (category) {
                        console.log(category);
                        $scope.itemCategories = category;

                        $scope.itemCategories = $scope.itemCategories.filter(function (obj) {
                            return obj._id !== 'DEFAULT';
                        });
                    })
                    .error(function (error, status) {
                        console.log(error, status);
                        if (status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if (status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
            /*};*/
        }
        const loadReport = (skuSearchObj) => {
            $http.post("/dash/reports/sku",skuSearchObj)
                .success(function(response){
                    //$scope.skureport = [];
                    for(var i=0; i<response.length; i++){
                        $scope.skureport.push(response[i]);
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
        const loadReportCount = (skuSearchObj) => {
            $http.post("/dash/reports/sku/count", skuSearchObj)
                .success(function (res) {
                    $scope.reportsTransactionCount(res);
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

        $scope.openFilterClear = () => {
            $scope.skuReportFilter.startDate = '';
            $scope.skuReportFilter.endDate = '';
            $scope.skuReportFilter.category = {};
            $scope.skuReportFilter.dealer = {};

            $scope.skuReportFilter.startDate = new Date();
            $scope.skuReportFilter.startDate.setDate($scope.skuReportFilter.startDate.getDate() - 7);
            $scope.skuReportFilter.startDate.setHours(0, 0, 0, 0);
            $scope.skuReportFilter.endDate = new Date();
            $scope.skuReportFilter.endDate.setHours(23, 59, 59, 59);
        }

        $scope.navPage = (direction, newViewBy) => {
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            if(direction){
                // console.log("NEXT");

                if(viewLength + viewBy >= $scope.skureport.length){
                    if(viewLength + viewBy < $scope.sku_count){
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        skuSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            skuSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            skuSearchObj.viewBy = initialViewBy;
                        }
                        skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
                        skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
                        skuSearchObj.category = $scope.skuReportFilter.category.Manufacturer || '';
                        skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
                        skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                        skuSearchObj.searchBy = itemSearchBy;

                        startLoader();
                        loadReport(skuSearchObj);
                        if(viewLength + viewBy > $scope.sku_count){
                            a = viewLength + viewBy - $scope.sku_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.sku_count){
                            a = viewLength + viewBy - $scope.sku_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.sku_count){
                        a = viewLength + viewBy - $scope.sku_count;
                        viewBy -= a;
                        if(viewLength + viewBy >  $scope.skureport.length){
                            skuSearchObj.viewLength =  $scope.skureport.length;
                            skuSearchObj.viewBy = viewLength + viewBy -  $scope.skureport.length;
                            skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
                            skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
                            skuSearchObj.category = $scope.skuReportFilter.category.Manufacturer || '';
                            skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
                            skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                            skuSearchObj.searchBy = itemSearchBy;

                            startLoader();
                            loadReport(skuSearchObj);

                        }
                    }else{
                        if(viewLength + viewBy >  $scope.skureport.length){
                            skuSearchObj.viewLength =  $scope.skureport.length;
                            skuSearchObj.viewBy = viewLength + viewBy -  $scope.skureport.length;
                            skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
                            skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
                            skuSearchObj.category = $scope.skuReportFilter.category.Manufacturer || '';
                            skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
                            skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                            skuSearchObj.searchBy = itemSearchBy;

                            startLoader();
                            loadReport(skuSearchObj);

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
                    if(viewLength + viewBy >= $scope.sku_count){
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

            $scope.skuReportFilter.dealer = {};
            $scope.skuReportFilter.dealer.Dealercode = '0';


            if(!$scope.skuReportFilter.category) {
                $scope.skuReportFilter.category = {};
                $scope.skuReportFilter.category.Manufacturer = '0';
            }

            if($scope.skuReportFilter.startDate && $scope.skuReportFilter.endDate){
                if (($scope.skuReportFilter.startDate - $scope.skuReportFilter.endDate) > 0){
                    Settings.alertPopup("WARNING", "Invalid Date Range set.");

                    $scope.skuReportFilter.startDate = new Date();
                    $scope.skuReportFilter.startDate.setDate($scope.skuReportFilter.startDate.getDate() - 7);
                    $scope.skuReportFilter.startDate.setHours(0, 0, 0, 0);
                    $scope.skuReportFilter.endDate = new Date();
                    $scope.skuReportFilter.endDate.setHours(23, 59, 59, 59);
                }
            }


            skuSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                skuSearchObj.viewBy = $scope.newViewBy;
            }else{
                skuSearchObj.viewBy = initialViewBy;
            }
            skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
            skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
            skuSearchObj.category = $scope.skuReportFilter.category._id;
            skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
            skuSearchObj.searchFor = $scope.skuReportFilter.filter;
            skuSearchObj.searchBy = itemSearchBy;

            $scope.viewLength = 0;
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            startLoader();
            loadReport(skuSearchObj);
            loadReportCount(skuSearchObj);
        }

        $scope.changeReportDuration = (startDate, endDate, reset) =>{
            if (endDate)
                endDate.setHours(23, 59, 59, 59);

            if (!reset) {
                if (startDate || endDate) {
                    if (startDate && endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(endDate);
                        var numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else if (!endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(new Date());
                        var skuDuration = moment.duration(d2.diff(d1)).asDays();
                    }
                    else
                        var skuDuration = 0;

                }
            }
        }
        $scope.reportsTransactionCount = (response) => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.sku_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.sku_count = response;
                    $scope.newViewBy = response;

                }
                else{
                    $scope.skureport = [];
                    $scope.newViewBy = 1;
                    $scope.sku_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.skureport = [];
                $scope.newViewBy = 1;
                $scope.sku_count = 0;
                $scope.viewLength = -1;
            }
        }

        $scope.downloadCSV = function(){
            startLoader();
            var request_object = {
                url : "/dash/reports/sku/count",
                method : "POST",
                timeout : api_timeout,
                data : skuSearchObj
            };

            $http(request_object)
                .then((count) => {
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

                    skuSearchObj.viewLength = 0;
                    skuSearchObj.viewBy = count.data;

                    var request_object = {
                        url : "/dash/reports/sku",
                        method : "POST",
                        timeout : api_timeout,
                        data : skuSearchObj
                    };

                    $http(request_object)
                        .then((result) => {
                        let _data = result.data;
                        
                        var output = 'id,ItemCode,Product,Description,Category,SubCategory';
                        output += '\n'
                        for (var i = 0; i < _data.length; i++) {
                            output += i + 1;
                            output += ',';

                            if (_data[i].itemCode)
                                output += _data[i].itemCode;
                            output += ',';
                            try {
                                if (_data[i].Product) {
                                    if ((_data[i].Product).toString().indexOf(',') != -1) {
                                        quotesWrapped = '"' + _data[i].Product + '"';
                                        _data[i].Product = quotesWrapped
                                    }
                                    output += _data[i].Product;
                                }
                            } catch (e) {
                                console.log(e)
                            }
                            output += ',';
                            try {
                                if (_data[i].Pack) {
                                    if ((_data[i].Pack).toString().indexOf(',') != -1) {
                                        quotesWrapped = '"' + _data[i].Pack + '"';
                                        _data[i].Pack = quotesWrapped
                                    }
                                    output += _data[i].Pack;
                                }
                            } catch (e) {
                                console.log(e)
                            }
                            output += ',';
                            try {
                                if (_data[i].Manufacturer) {
                                    if ((_data[i].Manufacturer).toString().indexOf(',') != -1) {
                                        quotesWrapped = '"' + _data[i].Manufacturer + '"';
                                        _data[i].Manufacturer = quotesWrapped
                                    }
                                    output += _data[i].Manufacturer;
                                }
                            } catch (e) {
                                console.log(e)
                            }
                            output += ',';
                            try {
                                if (_data[i].subCategory) {
                                    if ((_data[i].Product).toString().indexOf(',') != -1) {
                                        quotesWrapped = '"' + _data[i].subCategory + '"';
                                        _data[i].subCategory = quotesWrapped
                                    }
                                    output += _data[i].subCategory;
                                }
                            } catch (e) {
                                console.log(e)
                            }
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
                            download: 'Mbj_' + instanceDetails.api_key + '_SKU_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                            //download: 'Mbj_' + '_SKU__' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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

        loadCategories();
        $scope.changeReportView(localViewBy);
    })
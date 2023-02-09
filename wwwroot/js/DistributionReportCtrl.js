angular.module('ebs.controller')

    .controller("DistributionReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Distribution Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Sales And Distribution";

        $scope.reportTabId = 4;
        $scope.tab = 8;
        $scope.showReports = true;
        $scope.sales_count = 0;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let api_timeout = 600000;
        let instanceDetails =  Settings.getInstance();


        //.... Reports Filter.....
        $scope.salesReportFilter		  = {};

        //.... Set Filter Dates to last 7 days....
        $scope.salesReportFilter.startDate = new Date();
        $scope.salesReportFilter.startDate.setDate($scope.salesReportFilter.startDate.getDate() - 7);
        $scope.salesReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.salesReportFilter.endDate = new Date();
        $scope.salesReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.salesReportSeach = {};
        $scope.salesReportSeach.filter = '';
        let salesSearchObj = {};

        let salesSearchBy = ['orderId', 'sellername', 'seller', 'dealername', 'dealerphone', 'quantity', 'class', 'paymentMode','itemcode','medicine','sellername'];

        //$scope.salesDuration = Settings.daysDifference($scope.orderReportFilter.startDate , $scope.orderReportFilter.endDate);
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
        $scope.openFilterClear = function (){
            $scope.salesReportFilter = {};
            $scope.salesReportFilter.startDate = '';
            $scope.salesReportFilter.endDate = '';

            $scope.salesReportFilter.startDate = new Date();
            $scope.salesReportFilter.startDate.setDate($scope.salesReportFilter.startDate.getDate() - 7);
            $scope.salesReportFilter.startDate.setHours(0, 0, 0, 0);
            $scope.salesReportFilter.endDate = new Date();
            $scope.salesReportFilter.endDate.setHours(23, 59, 59, 59);
        };

        const loadSalesrep = () =>{
            $http.get("/dash/role/sellers/Salesperson")
                .success(function (salesperson) {
                    console.log("salesperson api response----->",salesperson)
                    if (salesperson && salesperson.length) {
                        $scope.roleSalesrep = [];
                        for (var i = 0; i < salesperson.length; i++) {
                            if(salesperson[i] && salesperson[i].userStatus == 'Active')
                            $scope.roleSalesrep.push({
                                sellername: salesperson[i].sellername,
                                sellerphone: salesperson[i].sellerphone
                            });
                        }
                        $scope.salespersonLength = $scope.roleSalesrep.length;
                    }
                });
        }

        const loadReport = (salesSearchObj) => {
            $http.post("/dash/reports/sales/orders",salesSearchObj)
                .success(function(response){
                    console.log(response);
                    for(var i=0; i<response.length; i++){
                        $scope.salesreport.push(response[i]);
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
        const loadReportCount = (salesSearchObj) => {
            $http.post("/dash/reports/sales/orders/count", salesSearchObj)
                .success(function (response) {
                    $scope.reportsTransactionCount(response);
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

        $scope.navPage = (direction, newViewBy) => {
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            if(direction){
                // console.log("NEXT");

                if(viewLength + viewBy >= $scope.salesreport.length){
                    if(viewLength + viewBy < $scope.sales_count){
                        $scope.displayloader = true;
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        salesSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            salesSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            salesSearchObj.viewBy = initialViewBy;
                        }
                        salesSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportFilter.startDate, 'start');
                        salesSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportFilter.endDate, 'end');
                        salesSearchObj.searchFor = $scope.salesReportSeach.filter;
                        salesSearchObj.searchBy = salesSearchBy;
                        salesSearchObj.class = '';
                        salesSearchObj.paymentMode = '';
                        salesSearchObj.seller = '';
                        salesSearchObj.Manufacturer = '';
                        if($scope.salesReportFilter.class)
                            salesSearchObj.class = $scope.salesReportFilter.class;
                        if($scope.salesReportFilter.paymentMode)
                            salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
                        if($scope.salesReportFilter.seller)
                            salesSearchObj.seller = $scope.salesReportFilter.seller ;
                        if($scope.salesReportFilter.Manufacturer)
                            salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;

                        startLoader();
                        loadReport(salesSearchObj);
                        if(viewLength + viewBy > $scope.expense_count){
                            a = viewLength + viewBy - $scope.expense_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                        $scope.displayloader = false;

                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.sales_count){
                            a = viewLength + viewBy - $scope.sales_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.sales_count){
                        a = viewLength + viewBy - $scope.sales_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.salesreport.length){
                            salesSearchObj.viewLength =  $scope.salesreport.length;
                            salesSearchObj.viewBy = viewLength + viewBy - $scope.salesreport.length;
                            salesSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportSeach.startDate, 'start');
                            salesSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportSeach.endDate, 'end');
                            salesSearchObj.searchFor = $scope.expenseReportSearch.filter;
                            salesSearchObj.searchBy = expenseSearchBy;
                            salesSearchObj.filter = $scope.expenseFilterStatus;
                            if($scope.salesReportFilter.class)
                                salesSearchObj.class = $scope.salesReportFilter.class;
                            if($scope.salesReportFilter.paymentMode)
                                salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
                            if($scope.salesReportFilter.seller)
                                salesSearchObj.seller = $scope.salesReportFilter.seller ;
                            if($scope.salesReportFilter.Manufacturer)
                                salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;

                            startLoader();
                            loadReport(salesSearchObj);
                        }
                    }else{
                        if(viewLength + viewBy > $scope.salesreport.length){
                            salesSearchObj.viewLength =  $scope.salesreport.length;
                            salesSearchObj.viewBy = viewLength + viewBy - $scope.salesreport.length;
                            salesSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                            salesSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                            salesSearchObj.searchFor = $scope.expenseReportSearch.filter;
                            salesSearchObj.searchBy = expenseSearchBy;
                            salesSearchObj.filter = $scope.expenseFilterStatus;
                            if($scope.salesReportFilter.class)
                                salesSearchObj.class = $scope.salesReportFilter.class;
                            if($scope.salesReportFilter.paymentMode)
                                salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
                            if($scope.salesReportFilter.seller)
                                salesSearchObj.seller = $scope.salesReportFilter.seller ;
                            if($scope.salesReportFilter.Manufacturer)
                                salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;

                            startLoader();
                            loadReport(salesSearchObj);
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
                    if(viewLength + viewBy >= $scope.sales_count){
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
            //startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);

            if($scope.salesReportFilter.startDate && $scope.salesReportFilter.endDate){
                if (($scope.salesReportFilter.startDate - $scope.salesReportFilter.endDate) > 0){
                    bootbox.alert({
                        title : 'WARNING',
                        message : 'Start date cannot be greater than End date.',
                        className : 'text-center'
                    })

                    $scope.salesReportFilter.startDate = new Date();
                    $scope.salesReportFilter.startDate.setDate($scope.salesReportFilter.startDate.getDate() - 7);
                    $scope.salesReportFilter.startDate.setHours(0, 0, 0, 0);
                    $scope.salesReportFilter.endDate = new Date();
                    $scope.salesReportFilter.endDate.setHours(23, 59, 59, 59);

                }

            }

            salesSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                salesSearchObj.viewBy = $scope.newViewBy;
            }else{
                salesSearchObj.viewBy = initialViewBy;
            }
            salesSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportFilter.startDate, 'start');
            salesSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportFilter.endDate, 'end');
            salesSearchObj.searchFor = $scope.salesReportSeach.filter;
            salesSearchObj.searchBy = salesSearchBy;
            salesSearchObj.class = '';
            salesSearchObj.paymentMode = '';
            salesSearchObj.seller = '';
            salesSearchObj.Manufacturer = '';
            if($scope.salesReportFilter.class)
                salesSearchObj.class = $scope.salesReportFilter.class;
            if($scope.salesReportFilter.paymentMode)
                salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
            if($scope.salesReportFilter.seller)
                salesSearchObj.seller = $scope.salesReportFilter.seller ;
            if($scope.salesReportFilter.Manufacturer)
                salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;


            $scope.salesreport = [];
            $scope.viewLength = 0;
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            startLoader();
            loadReport(salesSearchObj);
            loadReportCount(salesSearchObj);
        }

        $scope.clearFilter = () => {
            salesSearchObj.viewLength = 0;
            salesSearchObj.viewBy = initialViewBy;
            salesSearchObj.searchFor = [];
            salesSearchObj.searchBy = [];


            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;
            $scope.salesReportSeach.filter = '';


            $scope.salesreport = [];

            $scope.showSalesFilter = false;

            $scope.changeReportView();
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

                    $scope.salesDuration = numberOfDays;
                }
            }else
                $scope.salesDuration = 0;
        }

        $scope.reportsTransactionCount = (response) => {
            if(response){

                if(response > $scope.newViewBy){
                    $scope.sales_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.sales_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.salesreport = [];
                    $scope.newViewBy = 1;
                    $scope.sales_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.salesreport = [];
                $scope.newViewBy = 1;
                $scope.sales_count = 0;
                $scope.viewLength = -1;
            }

        }

        const loadCategories = () => {
            $http.post("/dash/items/filter/"+'category', {viewBy : 0})
                .success(function(category){
                    console.log(category);
                    $scope.itemCategories = category;

                    $scope.itemCategories = $scope.itemCategories.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    });
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

        const loadChannel = () => {

        }

        $scope.downloadCSV = function(){
            startLoader();
            var request_object = {
                url : "/dash/reports/sales/orders/count",
                method : "POST",
                timeout : api_timeout,
                data : salesSearchObj
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

                console.log(salesSearchObj);
                salesSearchObj.viewLength = 0;
                salesSearchObj.viewBy = count.data;

                var request_object = {
                    url : "/dash/reports/sales/orders",
                    method : "POST",
                    timeout : api_timeout,
                    data : salesSearchObj
                };

                $http(request_object)
                    .then((result) => {
                    let _data = result.data;
                console.log(result.data);
                var output = 'Sl No,Date,Order Id, Dealer Name,Channel,Mode of Purchase,Delivery Date,Item Code,Item Name, Price,Quantity,Total,Catagory,Sub-Category,Sub-Sub-Category,Salesperson Name, Salesperson Code, Stockist Name,Comment';
                output += '\n'
                for (var i = 0; i < _data.length; i++) {
                    output += i + 1;
                    output += ',';
                    output += _data[i].date_added;
                    output += ',';
                    output += _data[i].orderId;
                    output += ',';

                    output += _data[i].dealername;
                    output += ',';

                    if(_data[i].class){
                        output += _data[i].class;
                    }else{
                        output += '';
                    }

                    output += ',';

                    if(_data[i].paymentMode){
                        output += _data[i].paymentMode;
                    }else{
                        output += '';
                    }

                    output += ',';

                    if(_data[i].deliveryDate){
                        function formatdate(date){
                            if(date==undefined || date == '')
                                return ('')
                            /* replace is used to ensure cross browser support*/
                            var d = new Date(date.toString().replace("-","/").replace("-","/"));
                            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                            var dt = d.getDate();
                            if(dt<10)
                                dt = "0"+dt;
                            var dateOut = dt+"-"+monthNames[d.getMonth()]+"-"+(d.getFullYear())
                            return dateOut;
                        }
                        output += formatdate(_data[i].deliveryDate);
                    }else{
                        output += '';
                    }
                    output += ',';

                    output += _data[i].itemcode;
                    output += ',';

                    try {
                        if (_data[i].medicine) {
                            if ((_data[i].medicine).toString().indexOf(',') != -1) {
                                var quotesWrapped = '"' + _data[i].medicine + '"';
                                _data[i].medicine = quotesWrapped
                            }
                            output += _data[i].medicine;
                        }
                    } catch (e) {
                    }
                    output += ',';

                    if (_data[i].orderMRP)
                        output += (_data[i].orderMRP).toFixed(2);
                    output += ',';

                    if (_data[i].quantity)
                        output += _data[i].quantity;
                    output += ',';

                    if (_data[i].orderMRP && _data[i].quantity)
                        output += (_data[i].quantity * _data[i].orderMRP).toFixed(2);
                    output += ',';

                    // if (_data[i].itemDetails.length && _data[i].itemDetails[0].Manufacturer)
                    //     output += _data[i].itemDetails[0].Manufacturer;
                    // output += ',';
                    //
                    // if (_data[i].itemDetails.length &&_data[i].itemDetails[0].subCategory)
                    //     output += _data[i].itemDetails[0].subCategory;
                    // output += ',';
                    //
                    // if (_data[i].itemDetails.length &&_data[i].itemDetails[0].subSubCategory)
                    //     output += _data[i].itemDetails[0].subSubCategory;
                    // output += ',';
                    if (_data[i].itemDetails && _data[i].itemDetails.Manufacturer)
                        output += _data[i].itemDetails.Manufacturer;
                    output += ',';

                    if (_data[i].itemDetails &&_data[i].itemDetails.subCategory)
                        output += _data[i].itemDetails.subCategory;
                    output += ',';

                    if (_data[i].itemDetails &&_data[i].itemDetails.subSubCategory)
                        output += _data[i].itemDetails.subSubCategory;
                    output += ',';

                    if (_data[i].sellername)
                        output += _data[i].sellername;
                    output += ',';

                    if (_data[i].seller)
                        output += _data[i].seller;
                    output += ',';

                    if (_data[i].stockistname)
                        output += _data[i].stockistname;
                    output += ',';


                    var comment = '';
                    try {

                        comment = _data[i].comment[(_data[i].comment.length) - 1].comment;
                        if(_data[i].source == 'App' || !_data[i].source){
                            if (comment) {
                                output += comment;
                            }
                        }else if(_data[i].source == 'Order'){
                            output += _data[i].comment[0].comment;
                        }
                    } catch (e) {
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
                    download: 'Mbj_' + instanceDetails.api_key + '_Sales_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    //download: 'Mbj_' + '_Sales_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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
        loadCategories();
        $scope.changeReportView(localViewBy);
    })
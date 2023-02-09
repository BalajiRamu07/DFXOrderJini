angular.module('ebs.controller')

    .controller("PaymentsReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Payments Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Payments";

        $scope.reportTabId = 5;
        $scope.tab = 8;
        $scope.showReports = true;
        $scope.payment_count = 0;
        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;

        let instanceDetails =  Settings.getInstance();
        const api_timeout = 600000;
        $scope.paymentReportSearch = {};
        $scope.paymentReportSearch.filter = '';

        //.... Reports Filter.....
        $scope.paymentsreport = {};

        //.... Set Filter Dates to last 7 days....
        $scope.paymentsreport.startDate = new Date();
        $scope.paymentsreport.startDate.setDate($scope.paymentsreport.startDate.getDate() - 7);
        $scope.paymentsreport.startDate.setHours(0, 0, 0, 0);
        $scope.paymentsreport.endDate = new Date();
        $scope.paymentsreport.endDate.setHours(23, 59, 59, 59);

        let paymentSearchObj = {};
        let paymentSearchBy = ['dealername', 'sellername'];
        $scope.cashreport = [];

        $scope.paymentDuration = Settings.daysDifference($scope.paymentsreport.startDate , $scope.paymentsreport.endDate);
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
            $scope.paymentsreport.startDate = '';
            $scope.paymentsreport.endDate = '';
            $scope.paymentsreport.branchCode = '';

            $scope.paymentsreport.startDate = new Date();
            $scope.paymentsreport.startDate.setDate($scope.paymentsreport.startDate.getDate() - 7);
            $scope.paymentsreport.startDate.setHours(0, 0, 0, 0);
            $scope.paymentsreport.endDate = new Date();
            $scope.paymentsreport.endDate.setHours(23, 59, 59, 59);
        }

        const loadReport = (paymentSearchObj) => {
            $http.post("/dash/reports/cashitems",paymentSearchObj)
                .success(function(response){
                    console.log('Data for payments', response);
                    for(let i = 0; i < response.length; i++){
                        $scope.cashreport.push(response[i]);
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

        //... TODO : Deprecate the Storejini APIs......
        const loadStorejiniReport = (paymentSearchObj) => {
            $http.post("/dash/reports/storeJini/payments", paymentSearchObj)
                .success(function(response){

                    for(var i=0; i<response.length; i++){
                        $scope.cashreport.push(response[i]);
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

        const loadReportCount = (paymentSearchObj) => {
            $http.post("/dash/reports/payment/count", paymentSearchObj)
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

        $scope.reportsTransactionCount = (response) => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.payment_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.payment_count = response;
                    $scope.newViewBy = response;

                }
                else{
                    $scope.cashreport = [];
                    $scope.newViewBy = 1;
                    $scope.payment_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.cashreport = [];
                $scope.newViewBy = 1;
                $scope.payment_count = 0;
                $scope.viewLength = -1;
            }
        }

        //... Pagination for all reports
        $scope.navPage =  function(direction, newViewBy){
            $scope.newViewBy = parseInt(newViewBy);
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            if(direction){
                // console.log("NEXT");

                if(viewLength + viewBy >= $scope.cashreport.length){
                    if(viewLength + viewBy < $scope.payment_count){
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        paymentSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            paymentSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            paymentSearchObj.viewBy = initialViewBy;
                        }
                        paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
                        paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
                        paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                        paymentSearchObj.searchBy = paymentSearchBy;
                        paymentSearchObj.filter = $scope.modeOfPayment;

                        startLoader();
                        loadReport(paymentSearchObj);
                        if(viewLength + viewBy > $scope.payment_count){
                            a = viewLength + viewBy - $scope.payment_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.payment_count){
                            a = viewLength + viewBy - $scope.payment_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.payment_count){
                        a = viewLength + viewBy - $scope.payment_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.cashreport.length){
                            paymentSearchObj.viewLength = $scope.cashreport.length;
                            paymentSearchObj.viewBy = viewLength + viewBy - $scope.cashreport.length;
                            paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
                            paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
                            paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                            paymentSearchObj.searchBy = paymentSearchBy;
                            paymentSearchObj.filter = $scope.modeOfPayment;

                            startLoader();
                            loadReport(paymentSearchObj);
                        }
                    }else{
                        if(viewLength + viewBy > $scope.cashreport.length){
                            paymentSearchObj.viewLength = $scope.cashreport.length;
                            paymentSearchObj.viewBy = viewLength + viewBy - $scope.cashreport.length;
                            paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
                            paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
                            paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                            paymentSearchObj.searchBy = paymentSearchBy;
                            paymentSearchObj.filter = $scope.modeOfPayment;

                            startLoader();
                            loadReport(paymentSearchObj);
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
                    if(viewLength + viewBy >= $scope.payment_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        };

        $scope.clearFilter = () => {
            //.... Payments Report...
            paymentSearchObj.viewLength = 0;
            paymentSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.paymentReportSearch.filter){
                paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                paymentSearchObj.searchBy = paymentSearchBy;
            }

            $scope.cashreport = [];


            $scope.showPaymentFilter = true;

            if($scope.paymentReportSearch.filter == '')
                $scope.showPaymentFilter = false;

            $scope.changeReportView();
        }

        $scope.changeReportView = function(newViewBy){
            startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);
            //$scope.reportTabName = "Payments";

            if($scope.paymentsreport.startDate && $scope.paymentsreport.endDate) {
                if (($scope.paymentsreport.startDate - $scope.paymentsreport.endDate) > 0) {
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.paymentsreport.startDate = new Date();
                    $scope.paymentsreport.startDate.setDate($scope.paymentsreport.startDate.getDate() - 7);
                    $scope.paymentsreport.startDate.setHours(0, 0, 0, 0);
                    $scope.paymentsreport.endDate = new Date();
                    $scope.paymentsreport.endDate.setHours(23, 59, 59, 59);
                }
            }



            paymentSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                paymentSearchObj.viewBy = $scope.newViewBy;
            }else{
                paymentSearchObj.viewBy = initialViewBy;
            }
            paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
            paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
            paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
            paymentSearchObj.searchBy = paymentSearchBy;
            paymentSearchObj.filter = $scope.modeOfPayment;
            paymentSearchObj.branch = '';
            if($scope.paymentsreport.branchCode)
                paymentSearchObj.branch = $scope.paymentsreport.branchCode ;

            $scope.cashreport = [];
            $scope.viewLength = 0;
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            startLoader();
            loadReport(paymentSearchObj);
            loadReportCount(paymentSearchObj);
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

                    $scope.paymentDuration = numberOfDays;
                }
            }else
                $scope.paymentDuration = 0;
        }

        Settings.getUserInfo((user_details) => {
            if(user_details.sellerObject)
                $scope.user = user_details.sellerObject;
            else
                $scope.user = user_details;
        });


        $scope.showImage = function(order, type){
            if(type == 'payment'){
                $scope.showPaymentImage = [];

                if(typeof order.cloudinaryURL[0] == "object"){
                    for(var i=0; i<order.cloudinaryURL.length; i++){
                        for(var j=0; j<order.cloudinaryURL[i].length; j++) {
                            var arrImg = order.cloudinaryURL[i];
                            $scope.showPaymentImage.push(arrImg[j].image);
                        }
                    }
                }else
                    $scope.showPaymentImage.push(order.cloudinaryURL[0]);
            }
        }
        $scope.changePaymentStatus =  function(order){
            var payment = {};
            payment.orderId = order._id;
            payment.status = order.status;

            $http.put("/dash/reports/payment/editstatus", payment)
                .success(function(res){
                    if(res){
                        Settings.success_toast("SUCCESS", "Status updated Successfully");
                    }
                    else{
                        Settings.fail_toast("ERROR", "Update unsuccessful. Please try again");
                    }
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

        $scope.downloadCSV = function(){
            startLoader();
            var request_object = {
                url : "/dash/reports/payment/count",
                method : "POST",
                timeout : api_timeout,
                data : paymentSearchObj
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

                console.log(paymentSearchObj);
                paymentSearchObj.viewLength = 0;
                paymentSearchObj.viewBy = count.data;

                var request_object = {
                    url : "/dash/reports/cashitems",  // Storejini payments report needs to be written
                    method : "POST",
                    timeout : api_timeout,
                    data : paymentSearchObj
                };

                $http(request_object)
                    .then((result) => {
                    let _data = result.data;
                console.log(result.data);
                var output = 'id,Payment ID,Date_added,Time,Dealercode,Dealername,Dealer_Phone,Salesperson No.,Salesperson,Stockist,Stockist_Name,Stockist_Area,Payment_Method,Amount,Comment,Type,Address,Latitude,Longitude';
                output += '\n'
                for (var i = 0; i < _data.length; i++) {

                    output += i + 1;
                    output += ',';

                    output += _data[i].orderId;
                    output += ',';

                    if (_data[i].date_added)
                        function formatdate(date) {
                            if (date == undefined || date == '')
                                return ('')
                            /* replace is used to ensure cross browser support*/
                            var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            var dt = d.getDate()
                            if (dt < 10)
                                dt = "0" + dt
                            var dateOut = dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear())
                            return dateOut;
                        }


                    var dateformat = formatdate(_data[i].date_added);
                    output += dateformat;
                    output += ',';

                    if (_data[i].date_added)
                        function formattime(date) {
                            if (date == undefined || date == '')
                                return ('')
                            var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                            var dt = d.getDate()
                            if (dt < 10)
                                dt = "0" + dt
                            var datetime = (d.getHours()) + ":" + (d.getMinutes())
                            return datetime;
                        }

                    var dateformat = formattime(_data[i].date_added);
                    output += dateformat;
                    output += ',';


                    if(_data[i].dealercode)
                        output += _data[i].dealercode;
                    // else output += '';
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
                    if (_data[i].stockist)
                        output += _data[i].stockist;
                    output += ',';
                    if (_data[i].stockistname)
                        output += _data[i].stockistname;
                    output += ',';
                    if (_data[i].stockistarea)
                        output += _data[i].stockistarea;
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

                    if (_data[i].quantity)
                        output += _data[i].quantity;
                    output += ',';

                    var comment = '';
                    try {
                        comment = _data[i].comment[0][(_data[i].comment.length) - 1].comment;
                        if (comment) {
                            if ((comment).toString().indexOf(',') != -1) {
                                var quotesWrapped = '"' + comment + '"';
                                comment = quotesWrapped
                            }
                        }
                        output += comment;
                    } catch (e) {
                    }
                    output += ',';


                    if (_data[i].type)
                        output += _data[i].type;
                    output += ',';


                    try {
                        if (_data[i].Address) {
                            if ((_data[i].Address).toString().indexOf(',') != -1) {
                                quotesWrapped = '"' + _data[i].Address + '"'
                                _data[i].Address = quotesWrapped
                            }
                            output += _data[i].Address;
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    output += ',';


                    if (_data[i].latitude && _data[i].latitude != 'undefined')
                        output += _data[i].latitude;
                    output += ',';
                    if (_data[i].longitude && _data[i].longitude != 'undefined')
                        output += _data[i].longitude;
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
                    download: 'Mbj_' + instanceDetails.api_key + '_Payments_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    //download: 'Mbj_' + '_Payments_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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
        $scope.changeReportView(localViewBy);
    })
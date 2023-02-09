angular.module('ebs.controller')

    .controller("RiderReconciliationReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Rider Reconciliation Report Controller .... !!!!");
        //.... User details....
        $scope.user = {};
        $scope.warehouseLocation = [];
        $scope.fulfillmentstatus = [];
        $scope.roleFulfiller = [];

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... View By 3, 5, 10, 20, 30, 40, 50, 100, 200
        var localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let instanceDetails =  Settings.getInstance();

        const api_timeout = 600000;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Rider Reconciliation";

        $scope.ridersReportSeach = {};

        $scope.ridersReportFilter = {};

        $scope.rider_count = 0;

        $scope.reportTabId = 20;
        // $scope.tab = 20;
        // $scope.showReports = true;

        $scope.ridersReportFilter.startDate = new Date();
        $scope.ridersReportFilter.startDate.setDate($scope.ridersReportFilter.startDate.getDate() - 7);
        $scope.ridersReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.ridersReportFilter.endDate = new Date();
        $scope.ridersReportFilter.endDate.setHours(23, 59, 59, 59);

        var riderSearchBy = ['orderId', 'dealername', 'dealerphone', 'tripId', 'paymentMode','itemcode','medicine','fulfillerName'];
        var userRoletype = '';



        $scope.changeReportView = (newViewBy) => {
            $scope.newViewBy1.view = newViewBy;
            $scope.newViewBy = parseInt(newViewBy);
            // $scope.reportTabName = "Rider Reconciliation";
            riderSearchObj = {};
            if($scope.ridersReportFilter.startDate && $scope.ridersReportFilter.endDate){
                if (($scope.ridersReportFilter.startDate - $scope.ridersReportFilter.endDate) > 0){
                    // bootbox.alert({
                    //     title : 'WARNING',
                    //     message : 'Start date cannot be greater than End date.',
                    //     className : 'text-center'
                    // })

                    Settings.alertPopup("Alert", "Start date cannot be greater than End date.");

                    $scope.ridersReportFilter.startDate = new Date();
                    $scope.ridersReportFilter.startDate.setDate($scope.ridersReportFilter.startDate.getDate() - 7);
                    $scope.ridersReportFilter.startDate.setHours(0, 0, 0, 0);
                    $scope.ridersReportFilter.endDate = new Date();
                    $scope.ridersReportFilter.endDate.setHours(23, 59, 59, 59);

                }

            }

            riderSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                riderSearchObj.viewBy = $scope.newViewBy;
            }else{
                riderSearchObj.viewBy = initialViewBy;
            }
            riderSearchObj.sDate = $scope.DateTimeFormat($scope.ridersReportFilter.startDate, 'start');
            riderSearchObj.eDate = $scope.DateTimeFormat($scope.ridersReportFilter.endDate, 'end');
            riderSearchObj.searchFor = $scope.ridersReportSeach.filter;
            riderSearchObj.searchBy = riderSearchBy;
            riderSearchObj.class = '';
            riderSearchObj.paymentMode = '';
            riderSearchObj.seller = '';
            riderSearchObj.Manufacturer = '';
            riderSearchObj.fulfillmentStatus = '';

            if($scope.ridersReportFilter.paymentMode)
                riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
            if($scope.ridersReportFilter.fulfiller)
                riderSearchObj.fulfiller = $scope.ridersReportFilter.fulfiller ;
            if($scope.ridersReportFilter.warehouse)
                riderSearchObj.warehouse = $scope.ridersReportFilter.warehouse ;

            if($scope.ridersReportFilter.fulfillmentStatus)
                riderSearchObj.fulfillmentStatus = $scope.ridersReportFilter.fulfillmentStatus ;


            $scope.ridersreport = [];
            $scope.viewLength = 0;
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            loadReport(riderSearchObj);

            loadReportCount(riderSearchObj);
        }

        $scope.reportsTransactionCount = function(response, tab){
            if(response){

                if(response > $scope.newViewBy){
                    $scope.rider_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.rider_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.ridersreport = [];
                    $scope.newViewBy = 1;
                    $scope.rider_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.ridersreport = [];
                $scope.newViewBy = 1;
                $scope.rider_count = 0;
                $scope.viewLength = -1;
            }
        }

        //... Pagination for all reports
        $scope.navPage =  function(direction, newViewBy){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            if(direction){
                // console.log("NEXT");

                if(viewLength + viewBy >= $scope.ridersreport.length){
                    if(viewLength + viewBy < $scope.rider_count){
                        $scope.displayloader = true
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        riderSearchObj.viewLength = viewLength;


                        if($scope.newViewBy > initialViewBy ){
                            riderSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            riderSearchObj.viewBy = initialViewBy;
                        }
                        riderSearchObj.sDate = $scope.DateTimeFormat($scope.ridersReportFilter.startDate, 'start');
                        riderSearchObj.eDate = $scope.DateTimeFormat($scope.ridersReportFilter.endDate, 'end');
                        riderSearchObj.searchFor = $scope.ridersReportSeach.filter;
                        riderSearchObj.searchBy = riderSearchBy;
                        riderSearchObj.class = '';
                        riderSearchObj.paymentMode = '';
                        riderSearchObj.seller = '';
                        riderSearchObj.Manufacturer = '';
                        if($scope.ridersReportFilter.paymentMode)
                            riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
                        if($scope.ridersReportFilter.fulfiller)
                            riderSearchObj.fulfiller = $scope.ridersReportFilter.fulfiller ;
                        if($scope.ridersReportFilter.Manufacturer)
                            riderSearchObj.Manufacturer = $scope.ridersReportFilter.Manufacturer ;


                        // jQuery.noConflict();
                        // $('.refresh').css("display", "inline");

                        // $http.post("/dash/reports/riders/orders",riderSearchObj)
                        //     .success(function(response){
                        //         // console.log(response);
                        //
                        //
                        //         for(var i=0; i<response.length; i++){
                        //             $scope.ridersreport.push(response[i]);
                        //         }
                        //
                        //         if(viewLength + viewBy > $scope.expense_count){
                        //             a = viewLength + viewBy - $scope.expense_count;
                        //             viewBy -= a;
                        //             $scope.newViewBy = viewBy;
                        //         }
                        //         $scope.viewLength = viewLength;
                        //         $scope.displayloader = false;
                        //     })
                        //     .error(function(error, status){
                        //         console.log(error, status);
                        //         if(status >= 400 && status < 404)
                        //             $window.location.href = '/404';
                        //         else if(status >= 500)
                        //             $window.location.href = '/500';
                        //         else
                        //             $window.location.href = '/404';
                        //     });

                        loadReport(riderSearchObj);

                        // jQuery.noConflict();
                        // $('.refresh').css("display", "none");

                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.rider_count){
                            a = viewLength + viewBy - $scope.rider_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.rider_count){
                        a = viewLength + viewBy - $scope.rider_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.ridersreport.length){
                            riderSearchObj.viewLength =  $scope.ridersreport.length;
                            riderSearchObj.viewBy = viewLength + viewBy - $scope.ridersreport.length;
                            riderSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportSeach.startDate, 'start');
                            riderSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportSeach.endDate, 'end');
                            riderSearchObj.searchFor = $scope.expenseReportSearch.filter;
                            riderSearchObj.searchBy = expenseSearchBy;
                            riderSearchObj.filter = $scope.expenseFilterStatus;
                            if($scope.ridersReportFilter.class)
                                riderSearchObj.class = $scope.ridersReportFilter.class;
                            if($scope.ridersReportFilter.paymentMode)
                                riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
                            if($scope.ridersReportFilter.seller)
                                riderSearchObj.seller = $scope.ridersReportFilter.seller ;
                            if($scope.ridersReportFilter.Manufacturer)
                                riderSearchObj.Manufacturer = $scope.ridersReportFilter.Manufacturer ;


                            $http.post("/dash/reports/sales/orders",riderSearchObj)
                                .success(function(response){
                                    console.log(response);


                                    for(var i=0; i<response.length; i++){
                                        $scope.salesreport.push(response[i]);
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
                    }else{
                        if(viewLength + viewBy > $scope.ridersreport.length){
                            riderSearchObj.viewLength =  $scope.ridersreport.length;
                            riderSearchObj.viewBy = viewLength + viewBy - $scope.ridersreport.length;
                            riderSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                            riderSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                            riderSearchObj.searchFor = $scope.expenseReportSearch.filter;
                            riderSearchObj.searchBy = expenseSearchBy;
                            riderSearchObj.filter = $scope.expenseFilterStatus;
                            if($scope.ridersReportFilter.class)
                                riderSearchObj.class = $scope.ridersReportFilter.class;
                            if($scope.ridersReportFilter.paymentMode)
                                riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
                            if($scope.ridersReportFilter.seller)
                                riderSearchObj.seller = $scope.ridersReportFilter.seller ;
                            if($scope.ridersReportFilter.Manufacturer)
                                riderSearchObj.Manufacturer = $scope.ridersReportFilter.Manufacturer ;


                            $http.post("/dash/reports/riders/orders",riderSearchObj)
                                .success(function(response){
                                    console.log(response);


                                    for(var i=0; i<response.length; i++){
                                        $scope.ridersreport.push(response[i]);
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
                    if(viewLength + viewBy >= $scope.rider_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.DateTimeFormat = function (date_added, when) {

            if (date_added) {
                //This is to format the date in dd-mm-yy hh:mm:ss format, also padding 0's if values are <10 using above function
                var date = new Date(date_added);
                if (when == 'start') date.setHours(0, 0, 0, 0);
                else if (when == 'end') date.setHours(23, 59, 59, 999);
                var dformat = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');

                return (dformat);
            }
            else
                return 0;
        };

        const loadReport = (riderSearchObj) => {
            $http.post("/dash/reports/riders/orders",riderSearchObj)
                .success(function(response){
                    $scope.displayloader = false;
                    for(var i=0; i<response.length; i++){
                        $scope.ridersreport.push(response[i]);
                    }
                    // $scope.ridersreport = response;
                    console.log('Riders Report ->', $scope.ridersreport)
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

        const loadReportCount = (riderSearchObj) => {
            $http.post("/dash/reports/riders/orders/count", riderSearchObj)
                .success(function (response) {
                    console.log('count response',response)
                    $scope.reportsTransactionCount(response, 19);
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

        const getWareHouseLocation = () => {
            $http.get("/dash/settings/inventory/locations").success(function(res){
                if(res.length){
                    $scope.warehouseLocation = res[0].location;
                }
            }).catch(function(err){
                console.log(err);
            })
        }

        const getFulfilmentStatus = () => {
            Settings.getNav(false, nav => {
                $scope.nav = nav;
                // $scope.orderPaymentStatus = $scope.nav[1].paymentstatus? $scope.nav[1].paymentstatus : [];
                $scope.fulfillmentstatus = $scope.nav[1].fulfillmentstatus? $scope.nav[1].fulfillmentstatus : [];
                // $scope.orderStatus = $scope.nav[1].status? $scope.nav[1].status : [];
                getFulfiller();
            })
        }

        $scope.getRoleName = function(role){
            // console.log(role)
            var temp = '';
            if(role){
                if($scope.userRole){
                    for (var i=0 ; i<$scope.userRole.length ; i++){
                        if($scope.userRole[i].role.toUpperCase() == role.toUpperCase()){
                            temp =$scope.userRole[i].name ;
                            break;
                        }
                    }
                }
            }
            return temp ;
        };

        const getFulfiller = () => {
            Settings.getUserInfo(function(user_details){
                console.log("user_details---->",user_details)
                $scope.user = user_details;

                $scope.userRole = $scope.nav[4].roles;
                $scope.roleFulfiller = [];

                if($scope.user.role){
                    userRoletype = $scope.user.role.toLowerCase();
                }
                let obj = {};
                if(userRoletype  && userRoletype != 'admin' && $scope.user.sellerObject.inventoryLocation){
                    obj.warehouse = $scope.user.sellerObject.inventoryLocation;

                    $http.post("/dash/role/rider/fulfiller",obj)
                        .success(function (fulfillers) {
                            $scope.roleFulfiller = [];
                            if(fulfillers && fulfillers.length){

                                for(var i = 0; i < fulfillers.length; i++){
                                    $scope.roleFulfiller.push({sellername : fulfillers[i].sellername, sellerphone : fulfillers[i].sellerphone,inventoryLocation:fulfillers[i].inventoryLocation});
                                }
                            }
                        })
                }else{
                    $http.get("/dash/role/sellers/Fulfiller")
                        .success(function (fulfillers) {
                            $scope.roleFulfiller = [];
                            if(fulfillers && fulfillers.length){

                                for(var i = 0; i < fulfillers.length; i++){
                                    $scope.roleFulfiller.push({sellername : fulfillers[i].sellername, sellerphone : fulfillers[i].sellerphone,inventoryLocation:fulfillers[i].inventoryLocation});
                                }
                            }

                        });
                }

            });
        }

        $scope.changeReportDuration = function(startDate, endDate){
            if(endDate)
                endDate.setHours(23, 59, 59, 59);

            // if(!reset) {
                if(startDate || endDate){
                    if (startDate && endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(endDate);
                        var numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else if (!endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(new Date());
                        var numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else
                        var numberOfDays = 0;

                    $scope.salesDuration = numberOfDays;
                }
            // }
            // else{
            //     $scope.salesDuration = 0;
            // }
        };

        $scope.clearRiderReport = function (){
            $scope.ridersReportFilter.fulfiller = 0;
            $scope.ridersReportFilter.warehouse = '';
            $scope.ridersReportFilter.fulfillmentStatus = '';
            $scope.ridersReportSeach.filter = '';
            $scope.changeReportView();
        };

        $scope.parseData = function(viewLength, newViewBy){
            return parseInt(viewLength) + parseInt(newViewBy);
        }

        $scope.downloadCSV = function(){

            console.log("riderSearchObj---->",riderSearchObj)
            startLoader();
            let filterObj = {};
            filterObj.eDate = riderSearchObj.eDate;
            filterObj.sDate = riderSearchObj.sDate;

            var request_object = {
                url : "/dash/reports/riders/orders/count",
                method : "POST",
                timeout : api_timeout,
                data : riderSearchObj
            };
            $http(request_object)
                .success(function(response){
                    console.log("count response--->",response)
                    if(response > 15000){
                        stopLoader();
                        Settings.failurePopup(
                            'WARNING',
                            'Please select a smaller date range.\nCurrent records : ' + response + ' - Max. records : 15000'
                        )
                    }else{
                        filterObj.Manufacturer = riderSearchObj.Manufacturer;
                        filterObj.class = riderSearchObj.class;
                        filterObj.fulfillmentStatus = riderSearchObj.fulfillmentStatus;
                        filterObj.paymentMode = riderSearchObj.paymentMode;
                        filterObj.Manufacturer = riderSearchObj.Manufacturer;
                        filterObj.searchBy = riderSearchObj.searchBy;
                        filterObj.searchFor = riderSearchObj.searchFor;
                        filterObj.seller = riderSearchObj.seller;
                        filterObj.viewLength = riderSearchObj.viewLength;
                        filterObj.viewBy = 15000;

                        var request_object = {
                            url : "/dash/reports/riders/orders",
                            method : "POST",
                            timeout : api_timeout,
                            data : filterObj
                        };
                        $http(request_object)
                            .success(function(result){
                                var output = 'Sl No,Delivered Date,Delivered Time,Hub,Trip Id,Delivery Rider,Rider Phone,Customer,Order Id, SKU Id,Item Name,Packed Qty,Delivered Qty,Packed Amount,Collected Amount,Payment Mode,Delivery Status,Remarks,Order Amount,Delivered Amount,API Id,Order Status\n';	//makes it comma seperated heading

                                for (var i = 0; i < result.length; i++) {
                                    output += i + 1;
                                    output += ',';
                                    if(result[i].delivered_time){
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
                                        output += formatdate(result[i].delivered_time);
                                    }
                                    output += ',';

                                    if(result[i].delivered_time){
                                        function getTimeFromDate(date){
                                            if(date){
                                                var t = date.split(" ");
                                                var time = t[1].split(":");

                                                if(time[0] <= 11){
                                                    return time[0]+":"+time[1]+" AM";
                                                }
                                                else if(time[0] == 12){
                                                    return time[0]+":"+time[1]+" PM";
                                                }
                                                else{
                                                    return (time[0] - 12)+":"+time[1]+" PM";
                                                }
                                            }
                                            else{
                                                return 'N/A';
                                            }
                                        }
                                        output += getTimeFromDate(result[i].delivered_time);
                                    }
                                    output += ',';

                                    if(result[i].warehouse){
                                        output += result[i].warehouse;
                                    }
                                    output += ',';

                                    if(result[i].tripId){
                                        output += result[i].tripId;
                                    }
                                    output += ',';

                                    if(result[i].fulfillerName){
                                        output += result[i].fulfillerName;
                                    }
                                    output += ',';

                                    if(result[i].fulfiller){
                                        output += result[i].fulfiller;
                                    }
                                    output += ',';

                                    try {
                                        if (result[i].dealername) {
                                            if ((result[i].dealername).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + result[i].dealername + '"';
                                                result[i].dealername = quotesWrapped
                                            }
                                            output += result[i].dealername;
                                        }
                                    } catch (e) {console.log(e)};
                                    output += ',';

                                    output += result[i].orderId;
                                    output += ',';

                                    if (result[i].itemcode)
                                        output += result[i].itemcode;
                                    output += ',';

                                    try {
                                        if (result[i].medicine) {
                                            if ((result[i].medicine).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + result[i].medicine + '"';
                                                result[i].medicine = quotesWrapped
                                            }
                                            output += result[i].medicine;
                                        }
                                    } catch (e) {console.log(e)}

                                    output += ',';

                                    if (result[i].quantity)
                                        output += result[i].quantity;
                                    output += ',';

                                    if (result[i].delivered_qty)
                                        output += result[i].delivered_qty;
                                    output += ',';

                                    if (result[i].orderMRP && result[i].quantity)
                                        output += result[i].quantity * result[i].orderMRP;
                                    output += ',';

                                    if (result[i].amount_collected)
                                        output += result[i].amount_collected;
                                    output += ',';

                                    if (result[i].paymentMode)
                                        output += result[i].paymentMode;
                                    output += ',';

                                    if (result[i].fulfillmentStatus)
                                        output += result[i].fulfillmentStatus;
                                    output += ',';

                                    if (result[i].full_return_remarks)
                                        output += result[i].full_return_remarks;
                                    output += ',';

                                    if (result[i].ordered_amount)
                                        output += result[i].ordered_amount;
                                    output += ',';

                                    if (result[i].orderTotal)
                                        output += result[i].orderTotal;
                                    output += ',';

                                    if (result[i].api_id)
                                        output += result[i].api_id;
                                    output += ',';

                                    if (result[i].status)
                                        output += result[i].status;
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
                                    download: 'Mbj_' + instanceDetails.api_key + '_Riders_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                })[0].click();

                                stopLoader();

                            })
                            .error(function(data, status, headers, config){
                                console.log(data);
                                stopLoader();
                                Settings.alertPopup("Alert", "The server took too long to respond : Timeout Error. Please try again! " <br> "Error : " + data + " " + status);
                            });
                    }
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    stopLoader();
                    bootbox.alert({
                        title: "ERROR Line : 509",
                        message: "The server took too long to respond : Timeout Error. Please try again!<br>Error : " + data + " " + status,
                        className: "text-center",
                        callback: function (result) {

                        }
                    })
                });
        }

        $scope.getFullTimeFromDate = function(date){
            if(date){
                var t = date.split(" ");
                var time = t[1].split(":");

                if(time[0] <= 11){
                    if (time[1] < 10 && time[1].length <2) time[1] = '0' + time[1];
                    return time[0]+":"+time[1];
                }
                else if(time[0] == 12 ){
                    if (time[1] < 10 && time[1].length <2) time[1] = '0' + time[1];
                    return time[0]+":"+time[1];
                }
                else{
                    if (time[1] < 10 && time[1].length <2) time[1] = '0' + time[1];
                    return (time[0])+":"+time[1];
                }
            }
            else{
                return 'N/A';
            }
        };

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        getWareHouseLocation();
        getFulfilmentStatus();
        $scope.changeReportView(localViewBy);
    })
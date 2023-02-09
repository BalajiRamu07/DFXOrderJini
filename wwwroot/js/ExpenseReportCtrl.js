angular.module('ebs.controller')

    .controller("ExpenseReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Expense Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Expense";

        $scope.reportTabId = 7;
        $scope.tab = 8;
        $scope.showReports = true;
        $scope.expense_count = 0;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let instanceDetails =  Settings.getInstance();
        const api_timeout = 600000;

        $scope.expensereport = [];
        $scope.expreport = {};
        $scope.roleSalesrep = [];

        //.... Reports Filter.....
        $scope.expenseReportSearch = {};
        $scope.expenseReportSearch.filter = '';

        /*$scope.expense_types = [
            {"category" : "Food"},
            {"category" : "Fare"},
            {"category" : "Mileage"},
            {"category" : "Daily allowance	"},
            {"category" : "Toll"}];*/

        //.... Set Filter Dates to last 7 days....
        $scope.expreport.startDate = new Date();
        $scope.expreport.startDate.setDate($scope.expreport.startDate.getDate() - 7);
        $scope.expreport.startDate.setHours(0, 0, 0, 0);
        $scope.expreport.endDate = new Date();
        $scope.expreport.endDate.setHours(23, 59, 59, 59);
        //$scope.expreport.category = {};

        let expenseSearchObj = {};
        let expenseSearchBy= ['sellername'];

        $scope.expenseDuration = Settings.daysDifference($scope.expreport.startDate , $scope.expreport.endDate);
        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

        $scope.openFilterClear = () => {
            $scope.expreport.startDate = '';
            $scope.expreport.endDate = '';
            $scope.expreport.category = '';
            $scope.expreport.branchCode = '';
            $scope.expreport.seller = '';

            $scope.expreport.startDate = new Date();
            $scope.expreport.startDate.setDate($scope.expreport.startDate.getDate() - 7);
            $scope.expreport.startDate.setHours(0, 0, 0, 0);
            $scope.expreport.endDate = new Date();
            $scope.expreport.endDate.setHours(23, 59, 59, 59);
        }

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        const loadReport = (expenseSearchObj) => {
            $http.post("/dash/reports/expense", expenseSearchObj)
                .success(function(response){
                    console.log(response);
                    $scope.expensereport = response;
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

        const loadReportCount = (expenseSearchObj) =>{
            $http.post("/dash/reports/expense/count", expenseSearchObj)
                .success($scope.reportsTransactionCount)
                .error(function (error, status) {
                    console.log(error, status);
                    if (status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if (status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        };
        
        $scope.clearFilter = () => {

            //.... Expense Report
            expenseSearchObj.viewLength = 0;
            expenseSearchObj.viewBy = initialViewBy;

            $scope.newViewBy1.view = 10;
            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.expenseReportSearch.filter){
                expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                expenseSearchObj.searchBy = expenseSearchBy;
            }

            $scope.expensereport = [];

            $scope.showExpenseFilter = true;

            if($scope.expenseReportSearch.filter == '')
                $scope.showExpenseFilter = false;
                
            $scope.changeReportView();
        }

        $scope.navPage = (direction, newViewBy) => {
            $scope.newViewBy = parseInt(newViewBy);
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            if(direction){
                // console.log("NEXT");

                if(viewLength + viewBy >= $scope.expensereport.length){
                    if(viewLength + viewBy < $scope.expense_count){
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        expenseSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            expenseSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            expenseSearchObj.viewBy = initialViewBy;
                        }
                        expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                        expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                        expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                        expenseSearchObj.searchBy = expenseSearchBy;
                        expenseSearchObj.filter = $scope.expenseFilterStatus;

                        startLoader();
                        loadReport(expenseSearchObj);
                        if(viewLength + viewBy > $scope.expense_count){
                            a = viewLength + viewBy - $scope.expense_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.expense_count){
                            a = viewLength + viewBy - $scope.expense_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.expense_count){
                        a = viewLength + viewBy - $scope.expense_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.expensereport.length){
                            expenseSearchObj.viewLength =  $scope.expensereport.length;
                            expenseSearchObj.viewBy = viewLength + viewBy - $scope.expensereport.length;
                            expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                            expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                            expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                            expenseSearchObj.searchBy = expenseSearchBy;
                            expenseSearchObj.filter = $scope.expenseFilterStatus;

                            startLoader();
                            loadReport(expenseSearchObj);
                        }
                    }else{
                        if(viewLength + viewBy > $scope.expensereport.length){
                            expenseSearchObj.viewLength =  $scope.expensereport.length;
                            expenseSearchObj.viewBy = viewLength + viewBy - $scope.expensereport.length;
                            expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                            expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                            expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                            expenseSearchObj.searchBy = expenseSearchBy;
                            expenseSearchObj.filter = $scope.expenseFilterStatus;

                            startLoader();
                            loadReport(expenseSearchObj);
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
                    if(viewLength + viewBy >= $scope.expense_count){
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
            console.log("Calling Change Report View ---->", newViewBy);

            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);

            if($scope.expreport.startDate && $scope.expreport.endDate){
                if (($scope.expreport.startDate - $scope.expreport.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.expreport.startDate = new Date();
                    $scope.expreport.startDate.setDate($scope.expreport.startDate.getDate() - 7);
                    $scope.expreport.startDate.setHours(0, 0, 0, 0);
                    $scope.expreport.endDate = new Date();
                    $scope.expreport.endDate.setHours(23, 59, 59, 59);

                }
            }

            expenseSearchObj.viewLength = 0;

            if($scope.newViewBy > initialViewBy ){
                expenseSearchObj.viewBy = $scope.newViewBy;
            }else{
                expenseSearchObj.viewBy = initialViewBy;
            }
            expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
            expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
            expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
            expenseSearchObj.searchBy = expenseSearchBy;
            expenseSearchObj.filter = $scope.expenseFilterStatus;
            
            if(expenseSearchObj.eDate){
                expenseSearchObj.eDate = new Date(expenseSearchObj.eDate);
            }
            if(expenseSearchObj.sDate){
                expenseSearchObj.sDate = new Date(expenseSearchObj.sDate);
            }

            expenseSearchObj.branch = '';
            expenseSearchObj.expenseType = '';
            expenseSearchObj.seller = '';
            if($scope.expreport.branchCode)
                expenseSearchObj.branch = $scope.expreport.branchCode ;

            if($scope.expreport.category)
                expenseSearchObj.expenseType = $scope.expreport.category;
            if($scope.expreport.seller)
                expenseSearchObj.seller = $scope.expreport.seller ;

            $scope.viewLength = 0;
            $scope.expensereport = [];
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            //previously this condition was used
            //var expenses = [];
            //if(response[i].type == 'expense')
            //    expenses.push(response[i])

            startLoader();
            loadReport(expenseSearchObj);
            loadReportCount(expenseSearchObj);
        }

        $scope.changeReportDuration = (startDate, endDate, reset) => {
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
                        var expenseDuration = moment.duration(d2.diff(d1)).asDays();
                    }
                    else
                        var expenseDuration = 0;
                }
            }
        }

       $scope.reportsTransactionCount = (response) => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.expense_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.expense_count = response;
                    $scope.newViewBy = response;

                }
                else{
                    $scope.expensereport = [];
                    $scope.newViewBy = 1;
                    $scope.expense_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.expensereport = [];
                $scope.newViewBy = 1;
                $scope.expense_count = 0;
                $scope.viewLength = -1;
            }
       }

        $scope.showImage = function(order, type){
            if(type == 'expense'){
                $scope.showExpenseImage = order.cloudinaryURL;
            }
        }
        /*$scope.updateExpenseStatus = function (order) {
            var temp = {};
            temp = order;
            bootbox.confirm({
                title: 'CONFIRM',
                message: "Are you sure ?",
                className: "text-center",
                buttons: {
                    confirm: {
                        label: 'YES',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result && temp) {
                        $http.put("/dash/expense/update/status", temp)
                            .success(function (res) {
                                //console.log(res);
                            })
                    }
                    else {
                        //$scope.refreshReports(7);
                        $scope.changeReportView(localViewBy);
                    }
                }
            })
        }*/

        $scope.updateExpenseStatus =  function(order){
            var payment = {};
            payment = order;

            $http.put("/dash/expense/update/status", payment)
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

        const loadCategory = () => {
            $http.get("/dash/reports/expense/category")
                .success(function(response){
                    $scope.expense_types = response;
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

        const refreshSellerNames = () => {
            if(typeof $scope.roleSalesrep == 'object'){
                console.log('Rolesalesperson', $scope.roleSalesrep);
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
                url : "/dash/reports/expense/count",
                method : "POST",
                timeout : api_timeout,
                data : expenseSearchObj
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

                console.log(expenseSearchObj);
                expenseSearchObj.viewLength = 0;
                expenseSearchObj.viewBy = count.data;

                var request_object = {
                    url : "/dash/reports/expense",  // Storejini payments report needs to be written
                    method : "POST",
                    timeout : api_timeout,
                    data : expenseSearchObj
                };

                $http(request_object)
                    .then((result) => {
                    let _data = result.data;
                console.log(result.data);
                var output = 'SL NO,Expense ID,Date_added,Salesperson No.,Salesperson,Expense Details,Trip Name,Amount,Status,cloudinaryURL';
                output += '\n'
                for (var i = 0; i < _data.length; i++) {
                    if(_data[i].type == 'expense'){
                        output += i + 1;
                        output += ',';

                        output += _data[i].expenseID;
                        output += ',';


                        if (_data[i].date_added){
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
                        }



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
                        } catch (e) {}
                        output += ',';


                        if (_data[i].category)
                            output += _data[i].category;
                        output += ',';


                        try {
                            if(_data[i].tripName){
                                if ((_data[i].tripName).toString().indexOf(',') != -1) {
                                    var quotesWrapped = '"' + _data[i].tripName + '"';
                                    _data[i].tripName = quotesWrapped
                                }
                                output += _data[i].tripName;
                            }
                        } catch (e) {}
                        output += ',';

                        if (_data[i].billAmt)
                            output += _data[i].billAmt;
                        output += ',';

                        if (_data[i].status)
                            output += _data[i].status;
                        output += ',';

                        if (_data[i].cloudinaryURL)
                            output += _data[i].cloudinaryURL;
                        //output += ',';

                        output += '\n';
                    }


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
                    download: 'Mbj_' + instanceDetails.api_key + '_Expense_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    //download: 'Mbj_' + '_Expense_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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

        loadCategory();

        $scope.changeReportView(localViewBy);
        loadSalespersons();
    })
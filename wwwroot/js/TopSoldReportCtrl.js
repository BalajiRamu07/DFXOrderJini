
angular.module('ebs.controller')

.controller("TopSoldReportCtrl", function ($scope, $http, Settings, $window) {
    console.log("Hello From Top Sold Report Controller .... !!!!");

    $scope.user = {};

    $scope.viewLength = 0;
    $scope.newViewBy = 10;

    $scope.sold_count = 0;

    $scope.newViewBy1 = {};
    $scope.newViewBy1.view = 10;

    $scope.reportTabName = "Top Sold";

    $scope.reportTabId = 1;
    $scope.tab = 8;
    $scope.showReports = true;

    $scope.IsAllCollapsed = false;

    var localViewBy = $scope.newViewBy;
    let initialViewBy = 60;
    const api_timeout = 600000;
    let instanceDetails =  Settings.getInstance();

    //.... Reports Filter.....
    $scope.itemReportFilter = {};

    //.... Set Filter Dates to last 7 days....
    $scope.itemReportFilter.startDate = new Date();
    $scope.itemReportFilter.startDate.setDate($scope.itemReportFilter.startDate.getDate() - 7);
    $scope.itemReportFilter.startDate.setHours(0, 0, 0, 0);
    $scope.itemReportFilter.endDate = new Date();
    $scope.itemReportFilter.endDate.setHours(23, 59, 59, 59);

    $scope.itemReportSearch = {};
    $scope.itemReportSearch.filter = '';

    //... Filtering object for APIs.....
    let soldSearchObj = {};
    let soldSearchBy = ['medicine','model'];

    //... Categories and all other dropdowns...
    $scope.itemCategories = [];
    $scope.dealerRegions = [];
    $scope.itemreport = [];
    $scope.warehouseLocation = [];
    $scope.dealer_area = [];
    $scope.roleSalesrep = [];

    $scope.dealerSelectAll = {};
    $scope.dealerSelectAll.city = true;

    const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    }

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    }

    $scope.topSoldDuration = Settings.daysDifference($scope.itemReportFilter.startDate , $scope.itemReportFilter.endDate);

    $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);

    $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

    $scope.getCountDetails = id => {
        $scope.report_itemCountDisp = {};
        $scope.report_itemCountDisp = id;
    };

    
    $scope.collapseAll = function() {
        $scope.IsAllCollapsed = !$scope.IsAllCollapsed;
        $scope.itemreport.forEach(function(item) {
            item.isCollapsed = $scope.IsAllCollapsed;
        })
    }


    $scope.openFilterClear = () => {
        $scope.itemReportFilter.startDate = '';
        $scope.itemReportFilter.endDate = '';
        $scope.itemReportFilter.branchCode = '';
        $scope.itemReportFilter.area = '';
        $scope.itemReportFilter.region = '';
        $scope.itemReportFilter.Manufacturer = '';
        $scope.itemReportFilter.warehouse = '';
        $scope.itemReportFilter.seller = '';

        $scope.itemReportFilter.startDate = new Date();
        $scope.itemReportFilter.startDate.setDate($scope.itemReportFilter.startDate.getDate() - 7);
        $scope.itemReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.itemReportFilter.endDate = new Date();
        $scope.itemReportFilter.endDate.setHours(23, 59, 59, 59);
    }

    
    const topSoldCollapse = (response) => {
        if(response.length){
            for (var i = 0; i < response.length; i++){
                response[i].isCollapsed = false;
    
                var data = response[i].orderDetail;
                var seen = {};
    
                // data = data.filter(function(entry) {
                //     var previous;
                //
                //     // Have we seen this label before?
                //     if (seen.hasOwnProperty(entry.seller)) {
                //         // Yes, grab it and add this data to it
                //         previous = seen[entry.seller];
                //         previous.quantity.push(parseInt(entry.quantity));
                //         previous.stockist.push({
                //             'stockistName' : entry.stockistname,
                //             'stockist' : parseInt(entry.stockist),
                //             'count' : parseInt(entry.quantity)
                //         });
                //
                //         // Don't keep this entry, we've merged it into the previous one
                //         return false;
                //     }
                //
                //     // entry.data probably isn't an array; make it one for consistency
                //     if (!Array.isArray(entry.quantity)) {
                //         entry.quantity = [parseInt(entry.quantity)];
                //     }
                //     entry.stockist = [{
                //         'stockistName' : entry.stockistname,
                //         'stockist' : parseInt(entry.stockist),
                //         'count' : parseInt(entry.quantity[0])
                //     }];
                //
                //
                //     // Remember that we've seen it
                //     seen[entry.seller] = entry;
                //
                //     // Keep this one, we'll merge any others that match into it
                //     return true;
                // });
                //
                // response[i].orderDetail = data ;
                //
                // for (var j = 0; j < response[i].orderDetail.length; j++){
                //     var a = response[i].orderDetail[j].quantity;
                //     response[i].orderDetail[j].quantity = a.reduce(function(a, b) { return a + b; }, 0);
                //     var stockist = response[i].orderDetail[j].stockist ;
                //     var temp = {};
                //     stockist = stockist.filter(function(entry) {
                //         var previous;
                //
                //         // Have we seen this label before?
                //         if (temp.hasOwnProperty(entry.stockist)) {
                //             // Yes, grab it and add this data to it
                //             previous = temp[entry.stockist];
                //             previous.count.push(parseInt(entry.count));
                //
                //             // Don't keep this entry, we've merged it into the previous one
                //             return false;
                //         }
                //
                //         // entry.data probably isn't an array; make it one for consistency
                //         if (!Array.isArray(entry.count)) {
                //             entry.count = [parseInt(entry.count)];
                //         }
                //
                //         // Remember that we've seen it
                //         temp[entry.stockist] = entry;
                //
                //         // Keep this one, we'll merge any others that match into it
                //         return true;
                //     });
                //     response[i].orderDetail[j].stockist = stockist ;
                //     for(var k = 0 ; k < response[i].orderDetail[j].stockist.length; k++){
                //         var b = response[i].orderDetail[j].stockist[k].count;
                //         response[i].orderDetail[j].stockist[k].count = b.reduce(function(a, b) { return a + b; }, 0);
                //     }
                // }
                
                $scope.itemreport.push(response[i]);
    
                if(i == response.length - 1)
                    stopLoader();
            }
        }else
            stopLoader();
    }

    const reportsTransactionCount = response => {
        if(response){
            if(response > $scope.newViewBy){
                $scope.sold_count = response;
            }
            else if(response <= $scope.newViewBy){
                $scope.sold_count = response;
                $scope.newViewBy = response;

            }
            else{
                $scope.itemreport = [];
                $scope.newViewBy = 1;
                $scope.sold_count = 0;
                $scope.viewLength = -1;
            }
        }
        else{
            $scope.itemreport = [];
            $scope.newViewBy = 1;
            $scope.sold_count = 0;
            $scope.viewLength = -1;
        }
    }

    const loadReport = soldSearchObj => {
        $http.post("/dash/reports/items", soldSearchObj)
            .success(topSoldCollapse)
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

    const loadReportCount = soldSearchObj => {
        $http.post("/dash/reports/top/sold/count", soldSearchObj)
        .success(reportsTransactionCount)
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

    $scope.clearFilter = function(){
        //.... Top Sold...
        soldSearchObj.viewLength = 0;
        soldSearchObj.viewBy = initialViewBy;

        $scope.newViewBy1.view = 10;
        $scope.viewLength = 0;
        $scope.newViewBy = localViewBy;

        if($scope.itemReportSearch.filter){
            soldSearchObj.searchFor = $scope.itemReportSearch.filter;
            soldSearchObj.searchBy = soldSearchBy;
        }

        $scope.itemreport = [];

        $scope.showSoldFilter = true;

        if($scope.itemReportSearch.filter == '')
            $scope.showSoldFilter = false;

        $scope.changeReportView();
    }

    $scope.navPage = (direction, newViewBy) => {
        $scope.newViewBy = parseInt(newViewBy);

        var viewLength = $scope.viewLength;
        var viewBy = $scope.newViewBy;
        if(direction){
            // console.log("NEXT");

            if(viewLength + viewBy >= $scope.itemreport.length){
                if(viewLength + viewBy < $scope.sold_count){
                    viewLength += viewBy;
                    //console.log("Fetch more")
                    soldSearchObj.viewLength = viewLength;
                    if($scope.newViewBy > initialViewBy ){
                        soldSearchObj.viewBy = $scope.newViewBy;
                    }else{
                        soldSearchObj.viewBy = initialViewBy;
                    }
                    soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
                    soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
                    soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                    soldSearchObj.searchBy = soldSearchBy;

                   
                    startLoader();
                    loadReport(soldSearchObj);

                    if(viewLength + viewBy > $scope.sold_count){
                        a = viewLength + viewBy - $scope.sold_count;
                        viewBy -= a;
                        $scope.newViewBy = viewBy;
                    }
                    $scope.viewLength = viewLength;

                    jQuery.noConflict();
                    $('.refresh').css("display", "none");

                }
                else{
                    // console.log("Out of data")
                    if(viewLength + viewBy > $scope.sold_count){
                        a = viewLength + viewBy - $scope.sold_count;
                        viewBy -= a;
                        $scope.newViewBy = viewBy;
                    }
                }
            }
            else{
                // console.log("Minus viewby")
                viewLength += viewBy;

                if(viewLength + viewBy > $scope.sold_count){
                    a = viewLength + viewBy - $scope.sold_count;
                    viewBy -= a;

                    if(viewLength + viewBy > $scope.itemreport.length){
                        soldSearchObj.viewLength = $scope.itemreport.length ;
                        soldSearchObj.viewBy = viewLength + viewBy - $scope.itemreport.length;
                        soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
                        soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
                        soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                        soldSearchObj.searchBy = soldSearchBy;

                        startLoader();
                        loadReport(soldSearchObj);
                    }

                }else{
                    if(viewLength + viewBy > $scope.itemreport.length){
                        soldSearchObj.viewLength = $scope.itemreport.length ;
                        soldSearchObj.viewBy = viewLength + viewBy - $scope.itemreport.length;
                        soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
                        soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
                        soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                        soldSearchObj.searchBy = soldSearchBy;

                        startLoader();
                        loadReport(soldSearchObj);
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
                if(viewLength + viewBy >= $scope.sold_count){
                    viewBy += a;
                    a = 0;
                }

                viewLength -= viewBy;

                $scope.viewLength = viewLength;
                $scope.newViewBy = viewBy;
            }
        }
    }

    //.... Change Report View....
    $scope.changeReportView = (newViewBy) => {
        startLoader();
        $scope.newViewBy1.view = newViewBy || 10;
        $scope.newViewBy = parseInt(newViewBy || 10);
        
        if($scope.itemReportFilter.startDate && $scope.itemReportFilter.endDate){
            if (($scope.itemReportFilter.startDate - $scope.itemReportFilter.endDate) > 0){
                Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                $scope.itemReportFilter.startDate = new Date();
                $scope.itemReportFilter.startDate.setDate($scope.itemReportFilter.startDate.getDate() - 7);
                $scope.itemReportFilter.startDate.setHours(0, 0, 0, 0);
                $scope.itemReportFilter.endDate = new Date();
                $scope.itemReportFilter.endDate.setHours(23, 59, 59, 59);
            }
        }

        soldSearchObj.viewLength = 0;
        if($scope.newViewBy > initialViewBy){
            soldSearchObj.viewBy = $scope.newViewBy;
        }else{
            soldSearchObj.viewBy = initialViewBy;
        }
        soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
        soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
        soldSearchObj.searchFor = $scope.itemReportSearch.filter;
        soldSearchObj.searchBy = soldSearchBy;
        soldSearchObj.branch = '';
        soldSearchObj.region = '';
        soldSearchObj.area = '';
        soldSearchObj.Manufacturer = '';
        soldSearchObj.seller = '';

        if($scope.itemReportFilter.branch)
            soldSearchObj.branch = $scope.itemReportFilter.branch;
        if($scope.itemReportFilter.region)
            soldSearchObj.region = $scope.itemReportFilter.region;
        if($scope.itemReportFilter.area)
            soldSearchObj.area = $scope.itemReportFilter.area;
        if($scope.itemReportFilter.Manufacturer)
            soldSearchObj.Manufacturer = $scope.itemReportFilter.Manufacturer;

        if($scope.itemReportFilter.warehouse){
            soldSearchObj.warehouse = $scope.itemReportFilter.warehouse;
        }else{
            soldSearchObj.warehouse = '';
        }
        if($scope.itemReportFilter.seller)
            soldSearchObj.seller = $scope.itemReportFilter.seller ;
        else{
            soldSearchObj.seller = '';
        }

        $scope.itemreport = [];
        $scope.viewLength = 0;
        if(!newViewBy){
            $scope.newViewBy = parseInt(localViewBy);
        }

        console.log($scope.newViewBy, $scope.viewLength);
        loadReport(soldSearchObj);
        loadReportCount(soldSearchObj);
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

                    $scope.topSoldDuration = numberOfDays;
            }
        }else
            $scope.topSoldDuration = 0;
    }

    Settings.getUserInfo((user_details) => {
        console.log(user_details);
        if(user_details.sellerObject)
            $scope.user = user_details.sellerObject;
        else
            $scope.user = user_details;
    });


    //.... Load Regions Dropdown.....
    $http.get("/dash/stores/region")
        .then(region => {
            if(region.data.length){
                $scope.dealerRegions = region.data;
            }
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

        
    //.... Initialize Warehouse / Hub Locations....
    $http.get("/dash/settings/inventory/locations")
        .then(res => {
            if(res.data.length){
                $scope.warehouseLocation = res.data[0].location;
            }
        }).catch(err => {
            console.log(err);
        })

    //.... Categories Dropdown data....
    $scope.getAllCategories = type => {
        $http.post("/dash/items/filter/"+type, {viewBy : 0})
            .then(category => {
                $scope.itemCategories = category.data;

                $scope.itemCategories = $scope.itemCategories.filter(function( obj ) {
                    return obj._id !== 'DEFAULT';
                });
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

    //.... Areas Dropdown data....
    $scope.getAllStoreAreas = function(type){
        $http.post("/dash/stores/filter/"+type, {viewBy : 0})
            .then(area => {
                // console.log("Get all Areas......")
                $scope.dealer_area = area.data;

                $scope.dealer_area.map(function (dealer) {

                    if($scope.dealerSelectAll.city){
                        dealer.selected_area = true;

                    }else{
                        dealer.dealer_area = true
                        $scope.dealer_area= [];
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
    };
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
            url : "/dash/reports/top/sold/count",
            method : "POST",
            timeout : api_timeout,
            data : soldSearchObj
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

            console.log(soldSearchObj);
            soldSearchObj.viewLength = 0;
            soldSearchObj.viewBy = count.data;

            var request_object = {
                url : "/dash/reports/items",
                method : "POST",
                timeout : api_timeout,
                data : soldSearchObj
            };

            $http(request_object)
                .then((result) => {
                let _data = result.data;
            console.log(result.data);

            var output = 'id, ItemCode,Item,SubSubCategory,Times_Ordered,Quantity,Unit_Price,Salesperson,StockistName,StockistPhone,Qty';
            output += '\n'
            for (var i = 0; i < _data.length; i++) {
                output += i + 1;
                output += ',';
                //output += _data[i]._id.itemcode;
                output += _data[i]._id;
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
                try {
                    if (_data[i].subSubCategory) {
                        if ((_data[i].subSubCategory).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + _data[i].subSubCategory + '"';
                            _data[i].subSubCategory = quotesWrapped
                        }
                        output += _data[i].subSubCategory;
                    }
                } catch (e) {
                }
                output += ',';
                // for (var j = 0; j < _data[i].orderDetail.length; j++) {
                //     for (let k = 0; k < _data[i].orderDetail[j].stockist.length; k++) {
                if (_data[i].total)
                    var quantity = output.replace('total', 'Total')
                output += _data[i].total;
                output += ',';

                if (_data[i].quantity)
                    var quantity = output.replace('quantity', 'Quantity')
                output += _data[i].quantity;
                output += ',';

                if (_data[i].orderMRP)
                    output += _data[i].orderMRP[0];
                output += ',';
                output += '\n';
                // try {
                //     if (_data[i].sellername) {
                //         if ((_data[i].sellername).toString().indexOf(',') != -1) {
                //             var quotesWrapped = '"' + _data[i].sellername + '"';
                //             _data[i].sellername = quotesWrapped
                //         }
                //         output += _data[i].sellername;
                //     }
                // } catch (e) {
                // }
                // output += '\n';
                for (var j = 0; j < _data[i].orderDetail.length; j++) {
                    // try {
                    //     if (_data[i].orderDetail[j].sellername) {
                    //         if ((_data[i].orderDetail[j].sellername).toString().indexOf(',') != -1) {
                    //             var quotesWrapped = '"' + _data[i].orderDetail[j].sellername + '"';
                    //             _data[i].orderDetail[j].sellername = quotesWrapped
                    //         }
                    //         output += _data[i].orderDetail[j].sellername;
                    //     }
                    // } catch (e) {
                    // }
                    // output += '\n';

                    if (_data[i].orderDetail[j].stockist){
                        for (let k = 0; k < _data[i].orderDetail[j].stockist.length; k++) {
                            output += ',';
                            output += _data[i]._id;
                            //output += _data[i]._id;
                            output += ',';
                            try {
                                if (_data[i].medicine) {
                                    if ((_data[i].medicine).toString().indexOf(',') != -1) {
                                        _data[i].medicine = (_data[i].medicine).replace('/n', ' ');
                                    }
                                    output += _data[i].medicine;
                                }
                            } catch (e) {
                            }
                            output += ',';
                            try {
                                if (_data[i].subSubCategory) {
                                    // if ((_data[i].subSubCategory).toString().indexOf(',') != -1) {
                                    //     var quotesWrapped = '"' + _data[i].subSubCategory + '"';
                                    //     _data[i].subSubCategory = quotesWrapped
                                    // }
                                    output += _data[i].subSubCategory;
                                }
                            } catch (e) {
                            }
                            output += ',';
                            output += ',';
                            output += ',';
                            output += ',';
                            //output += _data[i].sellername;
                            output += _data[i].orderDetail[j].sellername;
                            output += ',';
                            try {
                                if (_data[i].orderDetail[j].stockist[k].stockistName) {
                                    if ((_data[i].orderDetail[j].stockist[k].stockistName).toString().indexOf(',') != -1) {
                                        var quotesWrapped = '"' + _data[i].orderDetail[j].stockist[k].stockistName + '"';
                                        _data[i].orderDetail[j].stockist[k].stockistName = quotesWrapped
                                    }
                                    output += _data[i].orderDetail[j].stockist[k].stockistName;
                                } else {
                                    output += 'Not available';
                                }
                            } catch (e) {
                            }
                            output += ',';
                            if (_data[i].orderDetail[j].stockist[k].stockist) {
                                output += _data[i].orderDetail[j].stockist[k].stockist;
                            } else {
                                output += 'Not available';
                            }
                            output += ',';
                            if (_data[i].orderDetail[j].stockist[k].count)
                                output += _data[i].orderDetail[j].stockist[k].count;
                            output += '\n';

                        }
                }
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
                download: 'Mbj_' + instanceDetails.api_key + '_TopItems_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                //download: 'Mbj_' + '_TopItems_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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

    $scope.getAllCategories('category');
    $scope.getAllStoreAreas('area');

    $scope.changeReportView(localViewBy);
    loadSalespersons();
});
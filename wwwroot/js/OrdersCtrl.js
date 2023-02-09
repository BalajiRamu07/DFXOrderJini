/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("OrdersCtrl",function ($scope, $rootScope, $http, $window, Settings) {
        console.log("Hello From Orders Controller .... !!!!");

        //.... Pagination.....
        var initialViewBy = 60;
        $scope.newViewBy = 10;
        var localViewBy = $scope.newViewBy;

        //.... Logged In User Object....
        $scope.user = {};
        $scope.user.role = '';

        //.... Search Data....
        var searchObj = {};
        var orderSearchBy = ['orderId', 'sellername', 'dealername', 'stockistname','account_id','sales_org_id', 'order_type'];
        $scope.orderSearch = {};
        
        var dealerSearchBy = ['Dealercode', 'DealerName', 'City', 'seller','SellerName', 'StockistName', 'Area', 'Phone', 'email'];

        //... All users....
        $scope.sellers = [];
        $scope.sellerNames = []; //stores seller name
        
        //... Fulfillers....
        $scope.fulfillerNames = {};

        $scope.orderfilterFlag = false;

        //... Order Statuses....
        $scope.orderStatus = [];

        $scope.settings = {};
        $scope.settings.walk_in_sale = false;

        //.... Extend Timeout for the API requests...
        const api_timeout = 600000;

        //... Get Nav....
        Settings.getNav(false, nav => {
            $scope.nav = nav;
            $scope.userRole = $scope.nav[4].roles;
            $scope.orderPaymentStatus = $scope.nav[1].paymentstatus? $scope.nav[1].paymentstatus : [];
            $scope.fulfillmentstatus = $scope.nav[1].fulfillmentstatus? $scope.nav[1].fulfillmentstatus : [];

            const walkInSaleObj = nav.filter(navObj => {
                if(navObj.tab === "Walk-in Sale"){
                    return navObj;
                }
            })
            if(walkInSaleObj && walkInSaleObj[0] && walkInSaleObj[0].activated) $scope.settings.walk_in_sale = true;

            if($scope.nav[1].status.length){
                for(let i = 0; i < $scope.nav[1].status.length; i++) $scope.orderStatus.push(($scope.nav[1].status[i].toLowerCase()));
            }
        });


        $scope.country = {};

        var instanceDetails =  Settings.getInstance();
        $scope.currency = instanceDetails.currency || "₹";
        $scope.country.name = instanceDetails.country || 'India';

        $scope.dateFormat = 'dd-MMM-yyyy';
        $scope.dateFormatMMYY = 'MMM/yyyy';

        var dealerSearchObj = {};

        //.... Source Types....
        $scope.sourceType = ["Pos", "Order", "App", "Shopify", "Old orders", "Superjini"];
        
        $scope.orderFilter = 'all';

        $scope.coID = instanceDetails.coID;

        $scope.OrderStausCount = {};

        $scope.warehouseLocation = [];
        $scope.roleSalesrep = [];
        $scope.roleFulfiller = [];
        $scope.userNames = [];

        $scope.orderFilterDealers = [];
        $scope.AssignedFulfiller = [];

        $scope.customNames = instanceDetails.customNames || [];

        $scope.shopify = {};

        $scope.DisplayShopifyButton = false;

        $scope.displayloader = false;

        $scope.user = '';
        var userRole = '';

        $scope.percentageDiscountFlag=false;
        $scope.percentageDiscountFlag=instanceDetails.percentageDiscount;

        Settings.getUserInfo((user_details) => {
            $scope.user = user_details;
            $http.get("/dash/settings/inventory/locations").success(function(res){
                if(res.length){
                    $scope.warehouseLocation = res[0].location;
                }
            }).catch(function(err){
                console.log(err);
            });

            if($scope.user.role){
                userRole = $scope.user.role.toLowerCase();
            }
        });
        
        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        startLoader();


        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);
        $scope.formatDate = date => Settings.formatDate(date);

        const getShopifyDetails = () => {
            $http.get("/dash/shopify/creds/fetch")
                .then(response => {
                    console.log("Shopify Credentials Fetched --->");
                    if(response.data && response.data.length){
                        $scope.shopify.api_key = response.data[0].shopify_api_key;
                        $scope.shopify.password = response.data[0].shopify_password;
                        $scope.shopify.host = response.data[0].shopify_host;
                        $scope.shopify.store_name = response.data[0].shopify_store_name;
                    }
                })
                .catch((error, status) => {
                    console.log(error, status);
                    if(status){
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                    }else if(error.status){
                        if(error.status >= 400 && error.status < 404)
                            $window.location.href = '/404';
                        else if(error.status >= 500)
                            $window.location.href = '/500';
                    }
                    else
                        $window.location.href = '/404';
                });
        };
    
        getShopifyDetails();

        var allStockist = [];

        const getStockists = () => {
            $http.get("/dash/stores/all/stockist")
                .then(response => {
                    allStockist = response.data;
                    $scope.allStockistFromDealer = allStockist.unique('StockistName');
                    for(var i = 0; i < allStockist.length; i++)
                        $scope.sellerNames[allStockist[i].Stockist] = allStockist[i].StockistName;
                })
                .catch((error, status) => {
                    console.log(error, status);
                    if(status){
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                    }else if(error.status){
                        if(error.status >= 400 && error.status < 404)
                            $window.location.href = '/404';
                        else if(error.status >= 500)
                            $window.location.href = '/500';
                    }
                    else
                        $window.location.href = '/404';
                });
        }

        const getUsers = () => {
            $http.get("/dash/users")
                .then(users => {
                    if(users.data && users.data.length){
                        for(let i = 0; i < users.data.length; i++){
                            if(users.data[i])
                                $scope.userNames.push({sellername : users.data[i].sellername, sellerphone : users.data[i].sellerphone});
    
                            if(users.data[i].role){
                                if(users.data[i].role == "Salesperson"){
                                    $scope.roleSalesrep.push({sellername : users.data[i].sellername, sellerphone : users.data[i].sellerphone});
                                }
                                if(users.data[i].role == "Fulfiller"){
                                    $scope.roleFulfiller.push({sellername : users.data[i].sellername, sellerphone : users.data[i].sellerphone});
                                }
                            }
                        }
                    }
                })
                .catch((error, status) => {
                    console.log(error, status);
                    if(status){
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                    }else if(error.status){
                        if(error.status >= 400 && error.status < 404)
                            $window.location.href = '/404';
                        else if(error.status >= 500)
                            $window.location.href = '/500';
                    }
                    else
                        $window.location.href = '/404';
                });
        }

        getStockists();
        getUsers();   
        
        $scope.generateFilter = function(date_added, type){
            //console.log(date_added + " " + type);
            if(date_added){
                //This is to format the date in dd-mm-yy hh:mm:ss format, also padding 0's if values are <10 using above function
                var date = new Date(date_added);
                if(type){
                    if(type == 'start') date.setHours(0,0,0,0)
                    else if(type == 'end') date.setHours(23,59,59,999)
                }
                return date;
            }
            else
                return 0;
        };

        $scope.dealerPhoneFilter = function() {
            $scope.showCustomersDropdown = false;

            if ($scope.orderSearch.dealerPhone_Name) {
                var phone = $scope.orderSearch.dealerPhone_Name.toString();

                if (phone.length > 3) {
                    dealerSearchObj.viewLength = 0;
                    dealerSearchObj.viewBy = initialViewBy;
                    if ($scope.orderSearch.dealerPhone_Name) {
                        var phone = $scope.orderSearch.dealerPhone_Name.toString();
                        dealerSearchObj.searchFor = phone;
                        dealerSearchObj.searchBy = dealerSearchBy;

                        $http.post('/dash/stores', dealerSearchObj)
                            .success(function (res) {
                                if (res.length > 0) {
                                    $scope.filteredDealer = true;
                                    $scope.showCustomersDropdown = true;
                                    $scope.orderFilterDealers = res;

                                    jQuery.noConflict();
                                    $(".bankDropdown").css('display', 'block');
                                } else {
                                    $scope.filteredDealer = false;
                                    $scope.orderFilterDealers = [];
                                    jQuery.noConflict();
                                    $(".bankDropdown").css('display', 'none');
                                }
                            });
                    }
                }
            }
        }

        $scope.selectFilterDealer = function (dealer) {
            $scope.showCustomersDropdown = false;
            $scope.orderSearch.dealer = dealer;

            if(dealer.DealerName)
                $scope.orderSearch.dealerPhone_Name = dealer.DealerName;

            $scope.orderSearchFilter();
            $scope.filteredDealer = true;
        }

        $scope.getRoleName = function(role){
            // console.log(role)
            var temp = role;
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

        $scope.getCustomName = function(name){
            // console.log(name);
            var temp = name;
            if(name){
                if($scope.customNames){
                    for (let i = 0; i < $scope.customNames.length; i++){
                        if($scope.customNames[i].name.toUpperCase() == name.toUpperCase()){
                            temp = $scope.customNames[i].displayName ;
                            break;
                        }
                    }
                }
            }
            return temp;
        };

        /*... Get Item/Product MRP...*/
        $scope.OrderFilterBy = function(){
            console.log($scope.orderfilterFlag)
            $scope.orderfilterFlag = !$scope.orderfilterFlag;
        };

        if($scope.user.role != 'Dealer'){
            dealerSearchObj.viewLength = 0;
            dealerSearchObj.viewBy = initialViewBy;
            dealerSearchObj.searchFor = '';
            dealerSearchObj.seller = '';
            dealerSearchObj.stockist = '';
            dealerSearchObj.searchBy = [];
            dealerSearchObj.searchByArea = [];
            dealerSearchObj.searchRegion = [];
            
            $http.post("/dash/stores", dealerSearchObj)
                .success(function (res) {
                    $scope.invoiceClients = res;
                })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 500)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        }


        $scope.updateDeliveryDate = function (order, date, flag) {

            var tempDate = flag ? Settings.dateFilterFormat(date, 'start') : Settings.dateFilterFormat(order.deliveryDate, 'start');
            var today = Settings.dateFilterFormat(new Date(), 'start');

            order.taxSetupStatus = $scope.taxSetup;
            if (tempDate >= today) {
                if (flag) {
                    var obj = {};
                    obj.deliveryDate = Settings.dateFilterFormat(date, 'start');
                    obj.dealerphone = order.dealerphone
                    obj.taxSetupStatus = order.taxSetupStatus;

                    $http.put("/dash/orders/delivery/" + order.orderId + "/1", obj)
                        .success(function (response) {
                            //$scope.showOrderDetails(order[0]);
                            Settings.success_toast("SUCCESS","Order : " + order.orderId + " assigned " + Settings.formatDate(date))
                        })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 500)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }
                else {
                    order.deliveryDate = Settings.dateFilterFormat(order.deliveryDate, 'start');
                    order.status = $scope.nav[1].status[1];
                    $http.put("/dash/orders/delivery/" + order._id + "/0", order)
                        .success(function (response) {
                            // console.log("Update -->" + response);
                            //$scope.all();

                            Settings.success_toast("SUCCESS","Order : " + order.orderId + " assigned " + Settings.formatDate(date))
                        })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 500)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }

            }
            else {
                jQuery.noConflict();
                if (flag)
                    $("#order_deliverDate").val(null);
                else
                    $("#orderLine_deliveryDate").val(null);
                Settings.failurePopup('Error','Please select today or any future date');
                // bootbox.alert({
                //     title: "ERROR",
                //     message: "Please select today or any future date",
                //     className: 'text-center'
                // })
            }
        }

        $scope.getUserName = function(phNumber){
            let temp = '';
            if(phNumber){
                if($scope.userNames){
                    for (let i = 0; i < $scope.userNames.length; i++){
                        if($scope.userNames[i].sellerphone == phNumber){
                            temp = $scope.userNames[i].sellername;
                            break;
                        }
                    }
                }
            }
            return temp || 'N/A';
        };

        /*---fetches sellername if phone is provided---*/
        $scope.getfulfillersName = function(sellerNo){
            /*---DynamicProgramming---*/
            /*---objects doesnt have length ---*/
            if(sellerNo){
                if($scope.roleFulfiller && $scope.roleFulfiller.length){
                    for(var i = 0; i < $scope.roleFulfiller.length; i++){
                        if($scope.roleFulfiller[i].sellerphone == sellerNo){
                            if($scope.roleFulfiller[i].sellername)
                                return $scope.roleFulfiller[i].sellername;
                            else
                                return sellerNo;
                        }
                    }
                }else{
                    return sellerNo;
                }
            }else return sellerNo;
        };

        $scope.getSellerName = function(sellerNo,tag){
            /*---DynamicProgramming---*/
            /*---objects doesnt have length ---*/
            if(sellerNo){
                if(Object.keys($scope.sellerNames).length==0){
                    //console.log('Seller name array is empty and being initialized')
                    $scope.refreshSellerNames();
                    if(tag == 'goals' || $scope.applicationType == 'Atmosphere') $scope.refreshGoalSellerNames()
                }
                if($scope.sellerNames[sellerNo]){
                    return $scope.sellerNames[sellerNo]
                }else if($scope.fulfillerNames[sellerNo]!=undefined){
                    return $scope.fulfillerNames[sellerNo];
                }
            }else return sellerNo;
        };

    //.... Render Orders...
    $scope.renderOrders = function (response) {

        console.log("GetAll Orders--> ", response);

        if(response.length){
            response.sort(function(a, b) {
                return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
            });
    
            //... Process the orders data....
            for(let i = 0; i < response.length; i++){
                //... Freight Charges
                if(response[i].freight && response[i].freight[0]) response[i].freight[0] = Number(response[i].freight[0]);
                //... Misc. Charges....
                if(response[i].miscellaneous && response[i].miscellaneous[0]) response[i].miscellaneous[0] =  Number(response[i].miscellaneous[0]);
                //... Extra Charges...
                if(response[i].extraCharges && response[i].extraCharges[0]) response[i].extraCharges[0] =  Number(response[i].extraCharges[0]);
                //... If order total....
                if(response[i].orderTotal_amount){
                    if(response[i].country != 'ghana'){
                        response[i].orderTotal_amount_tobe_paid = parseFloat(response[i].orderTotal_amount);
                        response[i].orderTotal_amount_tobe_paid = Math.round(response[i].orderTotal_amount_tobe_paid);
                    }
                    if(response[i].country == 'ghana'){
                        response[i].orderTotal_amount_tobe_paid = Number(response[i].orderTotal_amount);
                    }
                }
    
                //... If ther delivery date is in any other format, we change it to the desired format for display....
                if(response[i].deliveryDate && response[i].deliveryDate[0]){
                    response[i].delivery = moment(response[i].deliveryDate[0]).format("DD-MMM-YYYY");
                    response[i].deliveryDate[0] = moment(response[i].deliveryDate[0]).format("DD-MMM-YYYY");
                }
    
                //..... If Line status is an array of statuses, more than 1.....
                if(response[i].lineStatus){
                    //.... Each line will have a line status....
                    if(typeof response[i].lineStatus == 'string')
                        response[i].lineStatus = [response[i].lineStatus || ($scope.nav[1].lineStatus && $scope.nav[1].lineStatus[0]? $scope.nav[1].lineStatus[0] : 'New')];
                    else{
                        for(let j = 0; j < response[i].lineStatus.length; j++){
                            if(!response[i].lineStatus[j]) response[i].lineStatus[j] = ($scope.nav[1].lineStatus && $scope.nav[1].lineStatus[0]? $scope.nav[1].lineStatus[0] : 'New');
                        }
                    }
                }
    
                if(response[i].status){
                    if(typeof response[i].status == 'string'){
                        if(response[i].status)
                            response[i].status = response[i].status.toLowerCase();
                        else response[i].status = ($scope.nav[1].status && $scope.nav[1].status[0]? $scope.nav[1].status[0] : 'New');
                    }else if(typeof response[i].status == 'object'){
                        if(response[i].status[0])
                            response[i].status = response[i].status[0].toLowerCase();
                        else response[i].status = ($scope.nav[1].status && $scope.nav[1].status[0]? $scope.nav[1].status[0] : 'New');
                    }
                }
    
                if(response[i].source == 'superjini'){
                    response[i].totalPayment = 0;
                    response[i].totalPayment += Number(response[i].orderTotal_amount);
                }else{
                    response[i].totalPayment = 0;
                    if(response[i].paymentDetails){
                        for(var j = 0 ; j < response[i].paymentDetails.length; j++){
                            response[i].totalPayment += Number(response[i].paymentDetails[j].quantity);
                        }
                    }
                }
    
                response[i].totalPayment = parseFloat((response[i].totalPayment.toFixed(2)));
    
                $scope.orders.push(response[i]);
            }
        }

        stopLoader();
    };


        const loadOrders = (filter, callback) => {

            let query = new URLSearchParams();
            if($scope.orderSearch.filter){
                query.append('ordersSearchFor', $scope.orderSearch.filter)
            }

            let request_object = {
                    url : "/dash/orders?"+query.toString(),
                    method : "POST",
                    timeout : api_timeout,
                    data : filter
                };
            $http(request_object)
                .then(res => {
                    $scope.renderOrders(res.data);
                    if(callback)
                        callback(res.data);
                }, (error, status) => {
                    console.log(error, status);
                    if(status){
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                    }else if(error.status){
                        if(error.status >= 400 && error.status < 404)
                            $window.location.href = '/404';
                        else if(error.status >= 500)
                            $window.location.href = '/500';
                    }
                    else
                        $window.location.href = '/404';
                })
        }

        const loadOrdersCount = (filter, flag, callback) => {
            let query = new URLSearchParams();
            if($scope.orderSearch.filter){
                query.append('ordersSearchFor', $scope.orderSearch.filter)
            }

            let request_object = {
                url : "/dash/orders/count?"+query.toString(),
                method : "POST",
                timeout : api_timeout,
                data : filter
            };

            $http(request_object)
                .then((res) => {
                    if(res.data <= 20000) {
                        $scope.transactionCount(res.data, flag);
                        loadOrders(searchObj);
                        if (callback)
                            callback(res.data);

                    } else {
                        Settings.alertPopup( "Please choose a different date range. Maximum records that can be viewed : 20000");
                        stopLoader();
                    }

                    }, (error, status) => {
                        console.log(error, status);
                        if(status){
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                        }else if(error.status){
                            if(error.status >= 400 && error.status < 404)
                                $window.location.href = '/404';
                            else if(error.status >= 500)
                                $window.location.href = '/500';
                        }
                        else
                            $window.location.href = '/404';
                    })
        }

        $scope.transactionCount = (response, tab) => {
            if (response) {
                if (response > localViewBy) {
                    $scope.order_count = response;
                }
                else if (response <= localViewBy) {
                    $scope.order_count = response;
                    dealerOrderCount = response;
                    $scope.orderNewViewBy = response;
                }
                else {
                    $scope.orders = [];
                    $scope.orderNewViewBy = 1;
                    $scope.order_count = 0;
                    $scope.orderViewLength = -1;
                }
            }
            else {
                $scope.orders = [];
                $scope.orderNewViewBy = 1;
                $scope.order_count = 0;
                $scope.orderViewLength = -1;
            }
        }

        $scope.refreshSellerNames = function(){
            if(typeof $scope.roleSalesrep == 'object'){
                for(let j = 0; j < $scope.roleSalesrep.length; j++){
                    if($scope.roleSalesrep[j].userStatus == 'Active' || $scope.roleSalesrep[j].role != '')
                        $scope.sellerNames[$scope.roleSalesrep[j].sellerphone] = $scope.roleSalesrep[j].sellername;
                }
            }
        }


        //..... check if the column exists in nav file ....
        $scope.checkIfColExists = (index, colName) => $scope.nav[index].cols.indexOf(colName) == -1;

        //... For Navigation....
        let a = 0;
        $scope.navPage = direction => {
            //Orders Navigation
            var viewLength = $scope.orderViewLength;
            var viewBy = $scope.orderNewViewBy;

            if (direction) {
                //console.log("NEXT");

                if (viewLength + viewBy >= $scope.orders.length) {
                    if (viewLength + viewBy < $scope.order_count) {
                        $scope.displayloader = true;
                        viewLength += viewBy;
                        
                        searchObj.viewLength = viewLength;
                        searchObj.viewBy = initialViewBy;
                        searchObj.from_date = $scope.orderSearch.date_from;
                        searchObj.to_date = $scope.orderSearch.date_to;
                        searchObj.filter = $scope.filterStatusSelect;
                        searchObj.searchFor = $scope.orderSearch.filter;
                        searchObj.searchBy = orderSearchBy;

                        startLoader();
                        loadOrders(searchObj);

                        if (viewLength + viewBy > $scope.order_count) {
                            a = viewLength + viewBy - $scope.order_count;
                            viewBy -= a;
                            $scope.orderNewViewBy = viewBy;
                        }
                        $scope.orderViewLength = viewLength;
                        $scope.displayloader = false;
                    } else {
                        //console.log("Out of data")
                        if (viewLength + viewBy > $scope.order_count) {
                            a = viewLength + viewBy - $scope.order_count;
                            viewBy -= a;
                            $scope.orderNewViewBy = viewBy;
                        }
                    }
                } else {
                    //console.log("Minus viewby")
                    viewLength += viewBy;

                    if (viewLength + viewBy > $scope.order_count) {
                        a = viewLength + viewBy - $scope.order_count;
                        viewBy -= a;
                    }
                    $scope.orderNewViewBy = viewBy;
                    $scope.orderViewLength = viewLength;
                }
            } else {
                //console.log("BACK");
                if (viewLength < viewBy) {
                    //console.log("NO DATA")
                } else {
                    if (viewLength + viewBy >= $scope.order_count) {
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.orderViewLength = viewLength;
                    $scope.orderNewViewBy = viewBy;
                }
            }
        }

        $scope.refreshTransactions = function(){
            searchObj.viewLength = 0;
            searchObj.viewBy = initialViewBy;
            
            searchObj.from_date = new Date();
            searchObj.from_date.setDate(searchObj.from_date.getDate() - 7);
            searchObj.from_date.setHours(0, 0, 0, 0);
            searchObj.to_date = new Date();
            searchObj.to_date.setHours(23, 59, 59, 59);
            searchObj.filter = '';
            searchObj.searchFor = '';
            searchObj.source = '';
            searchObj.paymentStatus = '';
            searchObj.fulfillmentStatus = '';
            searchObj.dealer = '';
            searchObj.accountId = '';
            searchObj.orderType = '';
            searchObj.salesOrg = '';
            searchObj.employeeResponsible = '';

            if($scope.user && $scope.user.sellerObject &&  $scope.user.sellerObject.plant_code){
                searchObj.plant = $scope.user.sellerObject.plant_code ||'';
                $scope.orderSearch.plant = $scope.user.sellerObject.plant_code || '';
            }

            searchObj.filterStockist = '';
            $scope.filterStatusSelect = '';

            $scope.orderSearch.date_from =  searchObj.from_date;
            $scope.orderSearch.date_to =  searchObj.to_date;
            $scope.orderViewLength = 0;
            $scope.orderSearch.filter = '';
            $scope.orderSearch.source = '';
            $scope.orderSearch.paymentStatus = '';
            $scope.orderSearch.fulfillmentStatus = '';
            $scope.orderSearch.warehouse = '';
            $scope.orderSearch.dealerPhone_Name = '';
            $scope.orderSearch.dealer = '';
            $scope.orderSearch.filterStockist = '';
            $scope.orderNewViewBy = localViewBy;
            $scope.orderSearch.accountId = '';
            $scope.orderSearch.orderType = '';
            $scope.orderSearch.salesOrg = '';
            $scope.orderSearch.employeeResponsible = '';
            $scope.orders = [];

            startLoader();

            loadOrdersCount(searchObj, 1);

            $scope.showOrderFilter = false;
        }

        $scope.refreshTransactions();
        
        //.... Apply order filter
        //... This function is called whenever the filter is applied...

        $scope.orderSearchFilter = filter => {
            //... Loader...
            startLoader();

              // $scope.orderSearch.date_from = searchObj.from_date;

            if(filter && filter != 'all'){
                $scope.filterStatusSelect = filter;
                $scope.orderFilter = filter;
                console.log("Order Filter --> ",$scope.orderFilter);
            }
            else if(filter == 'all'){
                $scope.orderFilter = 'all';
            }

            searchObj.viewLength = 0;
            searchObj.viewBy = initialViewBy;

            $scope.orderViewLength = 0;
            $scope.orderNewViewBy = localViewBy;

            if($scope.orderSearch.date_from)
                searchObj.from_date = $scope.orderSearch.date_from;
            if($scope.orderSearch.date_to){
                $scope.orderSearch.date_to.setHours(23,59,59)
                searchObj.to_date = $scope.orderSearch.date_to;
            }

            if(filter && filter != 'all' && filter != 'others')
                searchObj.filter = $scope.filterStatusSelect;
            else if(filter == 'others')
                searchObj.filter = $scope.orderStatus;
            else if(filter == 'all'){
                searchObj.filter = '';
            }

            if($scope.orderSearch.filter){
                searchObj.searchFor = $scope.orderSearch.filter;
                searchObj.searchBy = orderSearchBy;
            }

            searchObj.dealer = {};
            if($scope.orderSearch.dealer){
                searchObj.dealer.dealerID = $scope.orderSearch.dealer.DealerID ? $scope.orderSearch.dealer.DealerID : '';
                searchObj.dealer.dealercode = $scope.orderSearch.dealer.Dealercode ? $scope.orderSearch.dealer.Dealercode : '';
            }

            searchObj.seller = $scope.orderSearch.seller ? $scope.orderSearch.seller.sellerphone : '';
            searchObj.source = $scope.orderSearch.source || '';
            searchObj.filterStockist = ($scope.orderSearch.filterStockist && $scope.orderSearch.filterStockist.Stockist) ? $scope.orderSearch.filterStockist.Stockist : '';
            searchObj.paymentStatus = $scope.orderSearch.paymentStatus || '';
            searchObj.fulfillmentStatus = $scope.orderSearch.fulfillmentStatus || '';
            searchObj.warehouse = $scope.orderSearch.warehouse || '';
            searchObj.plant = $scope.orderSearch.plant || '';
            searchObj.accountId = $scope.orderSearch.accountId || '';
            searchObj.orderType = $scope.orderSearch.orderType || '';
            searchObj.salesOrg = $scope.orderSearch.salesOrg || '';
            searchObj.employeeResponsible = $scope.orderSearch.employeeResponsible || '';

            $scope.orders = [];
            loadOrdersCount(searchObj, 1);

            $scope.showOrderFilter = true;

            if(filter == 'all' && $scope.orderSearch.filter == '' && $scope.orderSearch.date_from == '' && $scope.orderSearch.date_to == '')
                $scope.showOrderFilter = false;

        };

        /*============ Download CSV / Export =============*/
        $scope.downloadCSV = tab => {
            switch(tab){
                case 1:
                    if($scope.orderSearch.date_from)
                        searchObj.from_date = $scope.generateFilter($scope.orderSearch.date_from, 'start');
                    if($scope.orderSearch.date_to)
                        searchObj.to_date = $scope.generateFilter($scope.orderSearch.date_to,'end');

                    if($scope.orderFilter != 'all' && $scope.orderFilter != 'others' && $scope.orderFilter != undefined)
                        searchObj.filter = $scope.orderFilter;
                    else if($scope.orderFilter == 'others')
                        searchObj.filter = $scope.orderStatus;
                    else if($scope.orderFilter == 'all'){
                        searchObj.filter = '';
                    }

                    if($scope.orderSearch.filter){
                        searchObj.searchFor = $scope.orderSearch.filter;
                        searchObj.searchBy = orderSearchBy;
                    }

                    searchObj.dealer = {};
                    if($scope.orderSearch.dealer){
                        searchObj.dealer.dealerID = $scope.orderSearch.dealer.DealerID ? $scope.orderSearch.dealer.DealerID : '';
                        searchObj.dealer.dealercode = $scope.orderSearch.dealer.Dealercode ? $scope.orderSearch.dealer.Dealercode : '';
                    }

                    searchObj.seller = $scope.orderSearch.seller ? $scope.orderSearch.seller.sellerphone : '';

                    if($scope.orderSearch.source){
                        searchObj.source = $scope.orderSearch.source;
                    }
                    else{
                        searchObj.source = '';
                    }

                    if($scope.orderSearch.filterStockist && $scope.orderSearch.filterStockist.Stockist){
                        searchObj.filterStockist = $scope.orderSearch.filterStockist.Stockist;
                    }
                    else{
                        searchObj.filterStockist = '';
                    }

                    if($scope.orderSearch.paymentStatus){
                        searchObj.paymentStatus = $scope.orderSearch.paymentStatus;
                    }else{
                        searchObj.paymentStatus = '';
                    }

                    if($scope.orderSearch.fulfillmentStatus){
                        searchObj.fulfillmentStatus = $scope.orderSearch.fulfillmentStatus;
                    }else{
                        searchObj.fulfillmentStatus = '';
                    }

                    if($scope.orderSearch.warehouse){
                        searchObj.warehouse = $scope.orderSearch.warehouse;
                    }else{
                        searchObj.warehouse = '';
                    }

                    if($scope.orderSearch.accountId)
                        searchObj.accountId = $scope.orderSearch.accountId;

                    if($scope.orderSearch.orderType) 
                        searchObj.orderType = $scope.orderSearch.orderType;

                    if($scope.orderSearch.salesOrg)
                        searchObj.salesOrg = $scope.orderSearch.salesOrg;

                    if($scope.orderSearch.employeeResponsible)
                        searchObj.employeeResponsible = $scope.orderSearch.employeeResponsible;


                function nl2br(cell){
                    if (cell.replace(/ /g, '').match(/[\s,"]/)) {
                        return '"' + cell.replace(/"/g, '""') + '"';
                    }
                    return cell;
                    // return str.replace(/(?:")/g, '\"');
                }

                    startLoader();

                    var request_object = {
                        url : "/dash/orders/count",
                        method : "POST",
                        timeout : api_timeout,
                        data : searchObj
                    };

                    $http(request_object)
                        .success(function(response){

                            if(response > 30000){
                                Settings.failurePopup(
                                    'WARNING',
                                    'Please select a smaller date range. Current records : '+response
                                )
                                stopLoader();
                            }
                            else {
                                if($scope.orderSearch.date_from)
                                    searchObj.from_date = $scope.generateFilter($scope.orderSearch.date_from, 'start');
                                if($scope.orderSearch.date_to)
                                    searchObj.to_date = $scope.generateFilter($scope.orderSearch.date_to,'end');

                                if($scope.orderFilter != 'all' && $scope.orderFilter != 'others' && $scope.orderFilter != undefined)
                                    searchObj.filter = $scope.orderFilter;
                                else if($scope.orderFilter == 'others')
                                    searchObj.filter = $scope.orderStatus;
                                else if($scope.orderFilter == 'all'){
                                    searchObj.filter = '';
                                }

                                if($scope.orderSearch.filter){
                                    searchObj.searchFor = $scope.orderSearch.filter;
                                    searchObj.searchBy = orderSearchBy;
                                }

                                searchObj.dealer = {};
                                if($scope.orderSearch.dealer){
                                    searchObj.dealer.dealerID = $scope.orderSearch.dealer.DealerID ? $scope.orderSearch.dealer.DealerID : '';
                                    searchObj.dealer.dealercode = $scope.orderSearch.dealer.Dealercode ? $scope.orderSearch.dealer.Dealercode : '';
                                }


                                if($scope.orderSearch.seller){
                                    searchObj.seller = $scope.orderSearch.seller.sellerphone;
                                }
                                else{
                                    searchObj.seller = '';
                                }

                                if($scope.orderSearch.source){
                                    searchObj.source = $scope.orderSearch.source;
                                }
                                else{
                                    searchObj.source = '';
                                }

                                if($scope.orderSearch.filterStockist && $scope.orderSearch.filterStockist.Stockist){
                                    searchObj.filterStockist = $scope.orderSearch.filterStockist.Stockist;
                                }
                                else{
                                    searchObj.filterStockist = '';
                                }

                                if($scope.orderSearch.paymentStatus){
                                    searchObj.paymentStatus = $scope.orderSearch.paymentStatus;
                                }else{
                                    searchObj.paymentStatus = '';
                                }

                                if($scope.orderSearch.fulfillmentStatus){
                                    searchObj.fulfillmentStatus = $scope.orderSearch.fulfillmentStatus;
                                }else{
                                    searchObj.fulfillmentStatus = '';
                                }

                                if($scope.orderSearch.warehouse){
                                    searchObj.warehouse = $scope.orderSearch.warehouse;
                                }else{
                                    searchObj.warehouse = '';
                                }

                                var request_object = {
                                    url : "/dash/csv/reports/order",
                                    method : "POST",
                                    timeout : api_timeout,
                                    data : searchObj
                                };

                                let dealerOrderDownload = (result)=>{

                                    var output = 'ID, DATE_ADDED, ORDERID,  ITEMCODE, PRODUCT,' +
                                        'QUANTITY,CGST, SGST, IGST, MRP, ORDERMRP, TOTAL,  ORDERTOTAL,SALES ORDER NUMBER ,INVOICE_NUMBER1, INVOICE_NUMBER2, INVOICE_NUMBER3, ADVANCE_AMOUNT, ADVANCE_PAID, SITE_CODE, SITE_NAME, PAYMENT_TYPE,' +
                                        'COMMENT,ORDER_PLACED_BY,SALESPERSON, CREATED_BY_NAME,CREATED_BY_ROLE,' +
                                        'STATUS,  LATITUDE,' +
                                        'LONGITUDE, FREIGHT_CHARGES,  CLOUDINARYURL, ATTACHMENTS \n';

                                    for (var i = 0; i < result.length; i++) {
                                        result[i].invoiceId = [];
                                        if (result[i].invoiceDetails.length) {
                                            for (var j = 0; j < result[i].invoiceDetails.length; j++) {
                                                for (var k = 0; k < result[i].invoiceDetails[j].items.length; k++) {
                                                    if (result[i].itemcode == result[i].invoiceDetails[j].items[k].itemCode) {
                                                        result[i].invoiceId.push(result[i].invoiceDetails[j].invoiceId);
                                                    }
                                                }
                                            }
                                        }
                                        output += i + 1;
                                        output += ',';
                                        if (result[i].date_added)
                                            function formatdate(date) {
                                                if (date == undefined || date == '')
                                                    return ('')
                                                /* replace is used to ensure cross browser support*/
                                                var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                                                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                                var dt = d.getDate();
                                                if (dt < 10)
                                                    dt = "0" + dt;
                                                var dateOut = dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear())
                                                return dateOut;
                                            }
                                        var dateformat = formatdate(result[i].date_added);
                                        output += dateformat;
                                        output += ',';
                                        if (result[i].orderId) {
                                            var quotesWrappedId = '"' + result[i].orderId + '"';
                                            result[i].orderId = quotesWrappedId;
                                            output += result[i].orderId;
                                        }
                                        output += ',';
                                        // if (result[i].dealercode)
                                        //     output += result[i].dealercode;
                                        // output += ',';
                                        // if (result[i].dealername) {
                                        //     if ((result[i].dealername).toString().indexOf(',') != -1) {
                                        //         var quotesWrapped = '"' + result[i].dealername + '"';
                                        //         result[i].dealername = quotesWrapped
                                        //     }
                                        //     output += result[i].dealername;
                                        // }
                                        // output += ',';
                                        // try {
                                        //     if (result[i].dealerphone) {
                                        //         if ((result[i].dealerphone).toString().indexOf(',') != -1) {
                                        //             var quotesWrapped = '"' + result[i].dealerphone + '"';
                                        //             result[i].dealerphone = quotesWrapped
                                        //         }
                                        //         output += result[i].dealerphone;
                                        //     }
                                        // } catch (e) {
                                        //     console.log(e)
                                        // }
                                        // output += ',';
                                        // try {
                                        //     if (result[i].Address) {
                                        //         if ((result[i].Address).toString().indexOf(',') != -1) {
                                        //             quotesWrapped = '"' + result[i].Address + '"';
                                        //             result[i].Address = quotesWrapped
                                        //         }
                                        //         output += result[i].Address;
                                        //     }
                                        // } catch (e) {
                                        //     console.log(e)
                                        // }
                                        // output += ',';
                                        if (result[i].itemcode)
                                            output += result[i].itemcode;
                                        output += ',';
                                        try {
                                            if (result[i].medicine) {
                                                if ((result[i].medicine).toString().indexOf(',') != -1) {
                                                    quotesWrapped = '"' + result[i].medicine + '"';
                                                    result[i].medicine = quotesWrapped
                                                }
                                                output += result[i].medicine;
                                            }
                                        } catch (e) {
                                            console.log(e)
                                        }
                                        output += ',';
                                        if (result[i].quantity)
                                            output += result[i].quantity;
                                        output += ',';
                                        if (result[i].CGST)
                                            output += result[i].CGST;
                                        output += ',';
                                        if (result[i].SGST)
                                            output += result[i].SGST;
                                        output += ',';
                                        if (result[i].IGST)
                                            output += result[i].IGST;
                                        output += ',';
                                        if (result[i].MRP)
                                            output += result[i].MRP;
                                        output += ',';
                                        if (result[i].orderMRP)
                                            output += result[i].orderMRP;
                                        output += ',';
                                        if (result[i].total)
                                            output += result[i].total;
                                        output += ',';
                                        if (result[i].orderTotal)
                                            output += result[i].orderTotal;
                                        output += ',';
                                        if (result[i].invoiceDetails.length && result[i].invoiceDetails[0].items.length)
                                            if (result[i].invoiceDetails[0].items[0]) {
                                                output += result[i].invoiceDetails[0].items[0].sap_sales_orderid;
                                            } else {
                                                output += '';
                                            }
                                        output += ',';


                                        //.... Invoice Details....
                                        if (result[i].invoiceId.length)
                                            if (result[i].invoiceId[0]) {
                                                output += result[i].invoiceId[0];
                                            } else {
                                                output += result[i].invoiceId;
                                            }
                                        output += ',';
                                        // if (result[i].invoiceDetails[j].total)
                                        //     output += result[i].invoiceDetails[j].total;
                                        if (result[i].invoiceId.length)
                                            if (result[i].invoiceId[1]) {
                                                output += result[i].invoiceId[1];
                                            }
                                        output += ',';
                                        if (result[i].invoiceId)
                                            if (result[i].invoiceId[2]) {
                                                output += result[i].invoiceId[2];
                                            }
                                        output += ',';
                                        if (result[i].advance)
                                            output += result[i].advance;
                                        output += ',';
                                        if (result[i].PaymentDone)
                                            output += result[i].PaymentDone;
                                        output += ',';
                                        if (result[i].siteCode)
                                            output += result[i].siteCode;
                                        output += ',';
                                        if (result[i].siteName) {
                                            if ((result[i].siteName).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + result[i].siteName + '"';
                                                result[i].siteName = quotesWrapped
                                            }
                                            output += result[i].siteName;
                                        }
                                        output += ',';
                                        if (result[i].PaymentType)
                                            output += result[i].PaymentType;
                                        output += ',';
                                        var comment = '';
                                        try {
                                            comment = result[i].comment[(result[i].comment.length) - 1].comment
                                        } catch (e) {
                                        }
                                        if (comment) {
                                            if ((comment).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + comment + '"';
                                                comment = quotesWrapped
                                            }
                                            output += comment;
                                        }
                                        output += ',';
                                                if (result[i].sellername)
                                                    output += result[i].sellername;
                                                output += ',';

                                                if (result[i].customerDetails && result[i].customerDetails.length)
                                                    output += result[i].customerDetails[0].SellerName;
                                                output += ',';
                                        if (result[i].orderPlacedByName) {
                                            output += result[i].orderPlacedByName;
                                        }else {
                                            output += result[i].sellername;
                                        }
                                        output += ',';
                                        if (result[i].orderPlacedByRole) {
                                            output += result[i].orderPlacedByRole;
                                        }else {
                                            output += 'N/A';
                                        }
                                        output += ',';
                                        //
                                        //         if (result[i].sellername)
                                        //             output += result[i].sellername;
                                        //         output += ',';
                                        //         if (result[i].seller)
                                        //             output += result[i].seller;
                                        //         output += ',';
                                        //         if (result[i].stockistname) {
                                        //             output += result[i].stockistname;
                                        //         }
                                        //         output += ',';
                                        //         if (result[i].stockistname1) {
                                        //             output += result[i].stockistname1;
                                        //         }
                                        //         output += ',';
                                        //         if (result[i].stockist)
                                        //             if (result[i].stockist[0]) {
                                        //                 output += result[i].stockist[0];
                                        //             } else {
                                        //                 output += result[i].stockist;
                                        //             }
                                        //         output += ',';
                                        //         if (result[i].stockist)
                                        //             if (result[i].stockist[1]) {
                                        //                 output += result[i].stockist[1];
                                        //             }
                                        //         output += ',';
                                        //         // if(result[i].Stockists){
                                        //         //     if(result[i].Stockists.length){
                                        //         //         // console.log("result[i].Stockists.length",result[i].Stockists.length);
                                        //         //         var  multiStockistData = []
                                        //         //         for(var a=0 ; a < result[i].Stockists.length ; a++ ){
                                        //         //             if(result[i].Stockists[a].StockistName && result[i].Stockists[a].Stockist) {
                                        //         //                 var stockistData = result[i].Stockists[a].StockistName + '[' + result[i].Stockists[a].Stockist + ']'
                                        //         //                 multiStockistData.push(stockistData);
                                        //         //             }
                                        //         //             output += stockistData;
                                        //         //         }
                                        //         //     }
                                        //         //
                                        //         //
                                        //         // }
                                        //         if (result[i].stockistarea) {
                                        //             if ((result[i].stockistarea).toString().indexOf(',') != -1) {
                                        //                 quotesWrapped = '"' + result[i].stockistarea + '"'
                                        //                 result[i].stockistarea = quotesWrapped
                                        //             }
                                        //             output += result[i].stockistarea;
                                        //         }
                                        //         output += ',';
                                        //         // try {
                                        //         //     if (result[i].billing_address) {
                                        //         //         if ((result[i].billing_address).toString().indexOf(',') != -1) {
                                        //         //             quotesWrapped = '"' + result[i].billing_address + '"';
                                        //         //             result[i].billing_address = quotesWrapped;
                                        //         //         }
                                        //         //         output += result[i].billing_address;
                                        //         //     }
                                        //         // } catch (e) {
                                        //         //     console.log(e)
                                        //         // }
                                        //         // output += ',';
                                        //         // try {
                                        //         //     if (result[i].shipping_address) {
                                        //         //         if ((result[i].shipping_address).toString().indexOf(',') != -1) {
                                        //         //             quotesWrapped = '"' + result[i].shipping_address + '"';
                                        //         //             result[i].shipping_address = quotesWrapped
                                        //         //         }
                                        //         //         output += result[i].shipping_address;
                                        //         //     }
                                        //         // } catch (e) {
                                        //         //     console.log(e)
                                        //         // }
                                        //         // output += ',';
                                        //
                                        // if(result[i].billing_address ){
                                        //
                                        //     var stringWithBrs=nl2br(result[i].billing_address);
                                        //
                                        //     if ((result[i].billing_address).toString().indexOf(',') != -1) {
                                        //         var quotesWrapped =  stringWithBrs ;
                                        //         result[i].billing_address = quotesWrapped
                                        //
                                        //     } else if((result[i].billing_address).toString().indexOf('\n') != -1){
                                        //         var quotesWrapped =  stringWithBrs ;
                                        //         result[i].billing_address = quotesWrapped;
                                        //     }
                                        //     output += result[i].billing_address ;
                                        // }else{
                                        //     output += 'N/A';
                                        // }
                                        // output += ',';
                                        //
                                        //         if(result[i].shipping_address ){
                                        //
                                        //             var stringWithBrs=nl2br(result[i].shipping_address);
                                        //
                                        //             if ((result[i].shipping_address).toString().indexOf(',') != -1) {
                                        //                 var quotesWrapped =  stringWithBrs ;
                                        //                 result[i].shipping_address = quotesWrapped
                                        //
                                        //             } else if((result[i].shipping_address).toString().indexOf('\n') != -1){
                                        //                 var quotesWrapped =  stringWithBrs ;
                                        //                 result[i].shipping_address = quotesWrapped;
                                        //             }
                                        //             output += result[i].shipping_address ;
                                        //         }else{
                                        //             output += 'N/A';
                                        //         }
                                        //         output += ',';
                                        //         if (result[i].fulfiller)
                                        //             output += result[i].fulfiller;
                                        //         output += ',';
                                        //         if (result[i].area)
                                        //             output += result[i].area;
                                        //         output += ',';
                                        if (result[i].status)
                                            output += result[i].status;
                                        output += ',';
                                        /*if (result[i].chequenum)
                                         output += result[i].chequenum;
                                         output += ',';
                                         if (result[i].bankname)
                                         output += result[i].bankname;
                                         output += ',';*/
                                        if (result[i].latitude)
                                            output += result[i].latitude;
                                        output += ',';
                                        if (result[i].longitude)
                                            output += result[i].longitude;
                                        output += ',';
                                        if (result[i].freight)
                                            output += result[i].freight || 0;
                                        output += ',';
                                        // if (result[i].type)
                                        //     output += result[i].type;
                                        // output += ',';
                                        // if (result[i].source)
                                        //     output += result[i].source;
                                        // output += ',';
                                        // if (result[i].warehouse)
                                        //     output += result[i].warehouse;
                                        // output += ',';
                                        if (result[i].images) {
                                            if (typeof result[i].images == 'object') {
                                                // if images is an array //
                                                for (var k = 0; k < result[i].images.length; k++) {
                                                    if (result[i].images[k] != 'undefined') {
                                                        var quotesWrapped = '"' + result[i].images[k].image + '"';
                                                        output += quotesWrapped;
                                                    }
                                                }
                                            } else if (typeof result[i].images == 'string') {
                                                // if images is a string //
                                                if (result[i].images != 'undefined') {
                                                    var quotesWrapped = '"' + result[i].images + '"';
                                                    output += quotesWrapped;
                                                }
                                            }
                                        }
                                        output += ',';

                                        if (result[i].attachments && result[i].attachments.length){
                                            for(let k=0;k< result[i].attachments.length; k++){
                                                if(result[i].attachments[k] !='undefined'){
                                                    let quotesWrapped = '"\n' + result[i].attachments[k].url + '"';
                                                    output += quotesWrapped;
                                                }
                                            }
                                        }else
                                            output += 'N/A'
                                        output += '\n';
                                    }
                                    var blob = new Blob([output], {type : "text/csv;charset=UTF-8"});
                                    console.log(blob);
                                    window.URL = window.webkitURL || window.URL;
                                    var url = window.URL.createObjectURL(blob);

                                    //console.log(url);
                                    //var data = output;

                                    var d = new Date();
                                    var anchor = angular.element('<a/>');

                                    anchor.attr({
                                        href: url,
                                        target: '_blank',
                                        download: 'Mbj_' + instanceDetails.api_key + '_Orders_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                    })[0].click();
                                }

                                let adminOrderDownload = (result)=>{

                                    if($scope.percentageDiscountFlag){
                                        var output = 'ID, DATE_ADDED, ORDERID, DEALERCODE, DEALERNAME, DEALERPHONE, DEALER_ADDRESS, ITEMCODE, PRODUCT,' +
                                        'QUANTITY,CGST, SGST, IGST, MRP, ORDERMRP, TOTAL,  ORDERTOTAL,SALES ORDER NUMBER ,INVOICE_NUMBER1, INVOICE_NUMBER2, INVOICE_NUMBER3, ADVANCE_AMOUNT, ADVANCE_PAID, SITE_CODE, SITE_NAME, PAYMENT_TYPE,' +
                                        'COMMENT,ORDER_PLACED_BY,SALESPERSON, CREATED_BY_NAME,CREATED_BY_ROLE,STOCKIST_NAME1,STOCKIST_NAME2,STOCKIST_PHONE1,STOCKIST_PHONE2,STOCKIST_AREA, BILLING_ADDRESS, SHIPPING_ADDRESS,' +
                                        'FULFILLER, AREA, STATUS,  LATITUDE,' +
                                        'LONGITUDE, FREIGHT_CHARGES, TYPE, SOURCE ,WAREHOUSE, ACCOUNT_ID, ORDER_TYPE, SALES_ORG, EMPLOYEE_RESPONSIBLE, CLOUDINARYURL, ATTACHMENTS \n';
                                    }else{
                                    var output = 'ID, DATE_ADDED, ORDERID, DEALERCODE, DEALERNAME, DEALERPHONE, DEALER_ADDRESS, ITEMCODE, PRODUCT,' +
                                        'QUANTITY,CGST, SGST, IGST, MRP, ORDERMRP, TOTAL,  ORDERTOTAL,SALES ORDER NUMBER ,INVOICE_NUMBER1, INVOICE_NUMBER2, INVOICE_NUMBER3, ADVANCE_AMOUNT, ADVANCE_PAID, SITE_CODE, SITE_NAME, PAYMENT_TYPE,' +
                                        'COMMENT,ORDER_PLACED_BY,SALESPERSON, CREATED_BY_NAME,CREATED_BY_ROLE,STOCKIST_NAME1,STOCKIST_NAME2,STOCKIST_PHONE1,STOCKIST_PHONE2,STOCKIST_AREA, BILLING_ADDRESS, SHIPPING_ADDRESS,' +
                                        'FULFILLER, AREA, STATUS,  LATITUDE,' +
                                        'LONGITUDE, FREIGHT_CHARGES, TYPE, SOURCE ,WAREHOUSE, CLOUDINARYURL, ATTACHMENTS \n';
                                    }

                                    for (var i = 0; i < result.length; i++) {
                                        result[i].invoiceId = [];
                                        if (result[i].invoiceDetails.length) {
                                            for (var j = 0; j < result[i].invoiceDetails.length; j++) {
                                                for (var k = 0; k < result[i].invoiceDetails[j].items.length; k++) {
                                                    if (result[i].itemcode == result[i].invoiceDetails[j].items[k].itemCode) {
                                                        result[i].invoiceId.push(result[i].invoiceDetails[j].invoiceId);
                                                    }
                                                }
                                            }
                                        }
                                        output += i + 1;
                                        output += ',';
                                        if (result[i].date_added)
                                            function formatdate(date) {
                                                if (date == undefined || date == '')
                                                    return ('')
                                                /* replace is used to ensure cross browser support*/
                                                var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                                                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                                var dt = d.getDate();
                                                if (dt < 10)
                                                    dt = "0" + dt;
                                                var dateOut = dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear())
                                                return dateOut;
                                            }
                                        var dateformat = formatdate(result[i].date_added);
                                        output += dateformat;
                                        output += ',';
                                        if (result[i].orderId) {
                                            var quotesWrappedId = '"' + result[i].orderId + '"';
                                            result[i].orderId = quotesWrappedId;
                                            output += result[i].orderId;
                                        }
                                        output += ',';
                                        if (result[i].dealercode)
                                            output += result[i].dealercode;
                                        output += ',';
                                        if (result[i].dealername) {
                                            if ((result[i].dealername).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + result[i].dealername + '"';
                                                result[i].dealername = quotesWrapped
                                            }
                                            output += result[i].dealername;
                                        }
                                        output += ',';
                                        try {
                                            if (result[i].dealerphone) {
                                                if ((result[i].dealerphone).toString().indexOf(',') != -1) {
                                                    var quotesWrapped = '"' + result[i].dealerphone + '"';
                                                    result[i].dealerphone = quotesWrapped
                                                }
                                                output += result[i].dealerphone;
                                            }
                                        } catch (e) {
                                            console.log(e)
                                        }
                                        output += ',';
                                        try {
                                            if (result[i].Address) {
                                                if ((result[i].Address).toString().indexOf(',') != -1) {
                                                    quotesWrapped = '"' + result[i].Address + '"';
                                                    result[i].Address = quotesWrapped
                                                }
                                                output += result[i].Address;
                                            }
                                        } catch (e) {
                                            console.log(e)
                                        }
                                        output += ',';
                                        if (result[i].itemcode)
                                            output += result[i].itemcode;
                                        output += ',';
                                        try {
                                            if (result[i].medicine) {
                                                if ((result[i].medicine).toString().indexOf(',') != -1) {
                                                    quotesWrapped = '"' + result[i].medicine + '"';
                                                    result[i].medicine = quotesWrapped
                                                }
                                                output += result[i].medicine;
                                            }
                                        } catch (e) {
                                            console.log(e)
                                        }
                                        output += ',';
                                        if (result[i].quantity)
                                            output += result[i].quantity;
                                        output += ',';
                                        if (result[i].CGST)
                                            output += result[i].CGST;
                                        output += ',';
                                        if (result[i].SGST)
                                            output += result[i].SGST;
                                        output += ',';
                                        if (result[i].IGST)
                                            output += result[i].IGST;
                                        output += ',';
                                        if (result[i].MRP)
                                            output += result[i].MRP;
                                        output += ',';
                                        if (result[i].orderMRP)
                                            output += result[i].orderMRP;
                                        output += ',';
                                        if (result[i].total)
                                            output += result[i].total;
                                        output += ',';
                                        if (result[i].orderTotal)
                                            output += result[i].orderTotal;
                                        output += ',';
                                        if (result[i].invoiceDetails.length && result[i].invoiceDetails[0].items.length)
                                            if (result[i].invoiceDetails[0].items[0]) {
                                                output += result[i].invoiceDetails[0].items[0].sap_sales_orderid;
                                            } else {
                                                output += '';
                                            }
                                        output += ',';


                                        //.... Invoice Details....
                                        if (result[i].invoiceId.length)
                                            if (result[i].invoiceId[0]) {
                                                output += result[i].invoiceId[0];
                                            } else {
                                                output += result[i].invoiceId;
                                            }
                                        output += ',';
                                        // if (result[i].invoiceDetails[j].total)
                                        //     output += result[i].invoiceDetails[j].total;
                                        if (result[i].invoiceId.length)
                                            if (result[i].invoiceId[1]) {
                                                output += result[i].invoiceId[1];
                                            }
                                        output += ',';
                                        if (result[i].invoiceId)
                                            if (result[i].invoiceId[2]) {
                                                output += result[i].invoiceId[2];
                                            }
                                        output += ',';
                                        if (result[i].advance)
                                            output += result[i].advance;
                                        output += ',';
                                        if (result[i].PaymentDone)
                                            output += result[i].PaymentDone;
                                        output += ',';
                                        if (result[i].siteCode)
                                            output += result[i].siteCode;
                                        output += ',';
                                        if (result[i].siteName) {
                                            if ((result[i].siteName).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + result[i].siteName + '"';
                                                result[i].siteName = quotesWrapped
                                            }
                                            output += result[i].siteName;
                                        }
                                        output += ',';
                                        if (result[i].PaymentType)
                                            output += result[i].PaymentType;
                                        output += ',';
                                        var comment = '';
                                        try {
                                            comment = result[i].comment[(result[i].comment.length) - 1].comment
                                        } catch (e) {
                                        }
                                        if (comment) {
                                            if ((comment).toString().indexOf(',') != -1) {
                                                var quotesWrapped = '"' + comment + '"';
                                                comment = quotesWrapped
                                            }
                                            output += comment;
                                        }
                                        output += ',';
                                        if (result[i].sellername)
                                            output += result[i].sellername;
                                        output += ',';

                                        if (result[i].customerDetails && result[i].customerDetails.length)
                                            output += result[i].customerDetails[0].SellerName;
                                        output += ',';

                                        if (result[i].orderPlacedByName) {
                                            output += result[i].orderPlacedByName;
                                        }else {
                                            output += result[i].sellername;
                                        }
                                        output += ',';
                                        if (result[i].orderPlacedByRole) {
                                            output += result[i].orderPlacedByRole;
                                        }else {
                                            output += 'N/A';
                                        }
                                        output += ',';

                                        // if (result[i].sellername)
                                        //     output += result[i].sellername;
                                        // output += ',';
                                        // if (result[i].seller)
                                        //     output += result[i].seller;
                                        // output += ',';
                                        if (result[i].stockistname) {
                                            output += result[i].stockistname;
                                        }
                                        output += ',';
                                        if (result[i].stockistname1) {
                                            output += result[i].stockistname1;
                                        }
                                        output += ',';
                                        if (result[i].stockist)
                                            if (result[i].stockist[0]) {
                                                output += result[i].stockist[0];
                                            } else {
                                                output += result[i].stockist;
                                            }
                                        output += ',';
                                        if (result[i].stockist)
                                            if (result[i].stockist[1]) {
                                                output += result[i].stockist[1];
                                            }
                                        output += ',';
                                        // if(result[i].Stockists){
                                        //     if(result[i].Stockists.length){
                                        //         // console.log("result[i].Stockists.length",result[i].Stockists.length);
                                        //         var  multiStockistData = []
                                        //         for(var a=0 ; a < result[i].Stockists.length ; a++ ){
                                        //             if(result[i].Stockists[a].StockistName && result[i].Stockists[a].Stockist) {
                                        //                 var stockistData = result[i].Stockists[a].StockistName + '[' + result[i].Stockists[a].Stockist + ']'
                                        //                 multiStockistData.push(stockistData);
                                        //             }
                                        //             output += stockistData;
                                        //         }
                                        //     }
                                        //
                                        //
                                        // }
                                        if (result[i].stockistarea) {
                                            if ((result[i].stockistarea).toString().indexOf(',') != -1) {
                                                quotesWrapped = '"' + result[i].stockistarea + '"'
                                                result[i].stockistarea = quotesWrapped
                                            }
                                            output += result[i].stockistarea;
                                        }
                                        output += ',';
                                        // try {
                                        //     if (result[i].billing_address) {
                                        //         if ((result[i].billing_address).toString().indexOf(',') != -1) {
                                        //             quotesWrapped = '"' + result[i].billing_address + '"';
                                        //             result[i].billing_address = quotesWrapped;
                                        //         }
                                        //         output += result[i].billing_address;
                                        //     }
                                        // } catch (e) {
                                        //     console.log(e)
                                        // }
                                        // output += ',';
                                        // try {
                                        //     if (result[i].shipping_address) {
                                        //         if ((result[i].shipping_address).toString().indexOf(',') != -1) {
                                        //             quotesWrapped = '"' + result[i].shipping_address + '"';
                                        //             result[i].shipping_address = quotesWrapped
                                        //         }
                                        //         output += result[i].shipping_address;
                                        //     }
                                        // } catch (e) {
                                        //     console.log(e)
                                        // }
                                        // output += ',';

                                        if(result[i].billing_address ){

                                            var stringWithBrs=nl2br(result[i].billing_address);

                                            if ((result[i].billing_address).toString().indexOf(',') != -1) {
                                                var quotesWrapped =  stringWithBrs ;
                                                result[i].billing_address = quotesWrapped

                                            } else if((result[i].billing_address).toString().indexOf('\n') != -1){
                                                var quotesWrapped =  stringWithBrs ;
                                                result[i].billing_address = quotesWrapped;
                                            }
                                            output += result[i].billing_address ;
                                        }else{
                                            output += 'N/A';
                                        }
                                        output += ',';

                                        if(result[i].shipping_address ){

                                            var stringWithBrs=nl2br(result[i].shipping_address);

                                            if ((result[i].shipping_address).toString().indexOf(',') != -1) {
                                                var quotesWrapped =  stringWithBrs ;
                                                result[i].shipping_address = quotesWrapped

                                            } else if((result[i].shipping_address).toString().indexOf('\n') != -1){
                                                var quotesWrapped =  stringWithBrs ;
                                                result[i].shipping_address = quotesWrapped;
                                            }
                                            output += result[i].shipping_address ;
                                        }else{
                                            output += 'N/A';
                                        }
                                        output += ',';
                                        if (result[i].fulfiller)
                                            output += result[i].fulfiller;
                                        output += ',';
                                        if (result[i].area)
                                            output += result[i].area;
                                        output += ',';
                                        if (result[i].status)
                                            output += result[i].status;
                                        output += ',';
                                        /*if (result[i].chequenum)
                                         output += result[i].chequenum;
                                         output += ',';
                                         if (result[i].bankname)
                                         output += result[i].bankname;
                                         output += ',';*/
                                        if (result[i].latitude)
                                            output += result[i].latitude;
                                        output += ',';
                                        if (result[i].longitude)
                                            output += result[i].longitude;
                                        output += ',';
                                        if (result[i].freight)
                                            output += result[i].freight || 0;
                                        output += ',';
                                        if (result[i].type)
                                            output += result[i].type;
                                        output += ',';
                                        if (result[i].source)
                                            output += result[i].source;
                                        output += ',';
                                        if (result[i].warehouse)
                                            output += result[i].warehouse;
                                        output += ',';

                                        if($scope.percentageDiscountFlag){
                                            if (result[i].account_id)
                                                output += result[i].account_id;
                                            output += ',';
                                            if (result[i].order_type)
                                                output += result[i].order_type;
                                            output += ',';
                                            if (result[i].sales_org_id)
                                                output += result[i].sales_org_id;
                                            output += ',';
                                            if (result[i].employee_responsible)
                                                output += result[i].employee_responsible;
                                            output += ',';
                                        }

                                        if (result[i].images) {
                                            if (typeof result[i].images == 'object') {
                                                // if images is an array //
                                                for (var k = 0; k < result[i].images.length; k++) {
                                                    if (result[i].images[k] != 'undefined') {
                                                        var quotesWrapped = '"' + result[i].images[k].image + '"';
                                                        output += quotesWrapped;
                                                    }
                                                }
                                            } else if (typeof result[i].images == 'string') {
                                                // if images is a string //
                                                if (result[i].images != 'undefined') {
                                                    var quotesWrapped = '"' + result[i].images + '"';
                                                    output += quotesWrapped;
                                                }
                                            }
                                        }
                                        output += ',';

                                        if (result[i].attachments && result[i].attachments.length){
                                            for(let k=0;k< result[i].attachments.length; k++){
                                                if(result[i].attachments[k] !='undefined'){
                                                    let quotesWrapped = '"\n' + result[i].attachments[k].url + '"';
                                                    output += quotesWrapped;
                                                }
                                            }
                                        }

                                        output += '\n';
                                    }
                                    var blob = new Blob([output], {type : "text/csv;charset=UTF-8"});
                                    console.log(blob);
                                    window.URL = window.webkitURL || window.URL;
                                    var url = window.URL.createObjectURL(blob);

                                    //console.log(url);
                                    //var data = output;

                                    var d = new Date();
                                    var anchor = angular.element('<a/>');

                                    anchor.attr({
                                        href: url,
                                        target: '_blank',
                                        download: 'Mbj_' + instanceDetails.api_key + '_Orders_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                    })[0].click();
                                }

                                $http(request_object)
                                    .success(function(result){

                                        if($scope.nav && $scope.nav[25] && $scope.nav[25].activated){
                                            var output = 'ID, DATE_ADDED, ORDERID, ITEMCODE, PRODUCT,' +
                                                'QUANTITY,CGST, SGST, IGST, LIST_PRICE, DISCOUNT,SPECIAL_DISCOUNT,FINAL_DISCOUNT,PRICE,SPECIAL_REDUCTION,FINAL_PRICE, ORDERMRP, TOTAL, ORDERTOTAL, INVOICE_NUMBER1, INVOICE_NUMBER2, INVOICE_NUMBER3, ADVANCE_AMOUNT, ADVANCE_PAID, SITE_CODE, SITE_NAME, PAYMENT_TYPE,' +
                                                'COMMENT,ORDER_PLACED_BY,SALESPERSON, ' +
                                                'STATUS,  LATITUDE,' +
                                                'LONGITUDE, FREIGHT_CHARGES, CLOUDINARYURL, ATTACHMENTS \n';
                                        }


                                        if($scope.nav && $scope.nav[25] && $scope.nav[25].activated){
                                            for (var i = 0; i < result.length; i++) {
                                                result[i].invoiceId = [];
                                                if (result[i].invoiceDetails.length) {
                                                    for (var j = 0; j < result[i].invoiceDetails.length; j++) {
                                                        for (var k = 0; k < result[i].invoiceDetails[j].items.length; k++) {
                                                            if (result[i].itemcode == result[i].invoiceDetails[j].items[k].itemCode) {
                                                                result[i].invoiceId.push(result[i].invoiceDetails[j].invoiceId);
                                                            }
                                                        }
                                                    }
                                                }
                                                output += i + 1;
                                                output += ',';

                                                if (result[i].date_added)
                                                    function formatdate(date) {
                                                        if (date == undefined || date == '')
                                                            return ('')
                                                        /* replace is used to ensure cross browser support*/
                                                        var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                                                        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                                        var dt = d.getDate();
                                                        if (dt < 10)
                                                            dt = "0" + dt;
                                                        var dateOut = dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear())
                                                        return dateOut;
                                                    }


                                                var dateformat = formatdate(result[i].date_added);
                                                output += dateformat;
                                                output += ',';


                                                if (result[i].orderId) {
                                                    var quotesWrappedId = '"' + result[i].orderId + '"';
                                                    result[i].orderId = quotesWrappedId;
                                                    output += result[i].orderId;
                                                }

                                                output += ',';


                                                if (result[i].itemcode)
                                                    output += result[i].itemcode;
                                                output += ',';

                                                try {
                                                    if (result[i].medicine) {
                                                        if ((result[i].medicine).toString().indexOf(',') != -1) {
                                                            quotesWrapped = '"' + result[i].medicine + '"';
                                                            result[i].medicine = quotesWrapped
                                                        }
                                                        output += result[i].medicine;
                                                    }
                                                } catch (e) {
                                                    console.log(e)
                                                }
                                                output += ',';

                                                if (result[i].quantity)
                                                    output += result[i].quantity;
                                                output += ',';

                                                if (result[i].CGST)
                                                    output += result[i].CGST;
                                                output += ',';

                                                if (result[i].SGST)
                                                    output += result[i].SGST;
                                                output += ',';

                                                if (result[i].IGST)
                                                    output += result[i].IGST;
                                                output += ',';

                                                if (result[i].netPrice)
                                                    output += result[i].netPrice;
                                                output += ',';
                                                if (result[i].regularDiscount)
                                                    output += result[i].regularDiscount;
                                                output += ',';
                                                if (result[i].specialDiscount)
                                                    output += result[i].specialDiscount;
                                                output += ',';
                                                if (result[i].finalDiscount)
                                                    output += result[i].finalDiscount;
                                                output += ',';
                                                if (result[i].price)
                                                    output += result[i].price;
                                                output += ',';
                                                if (result[i].specialReduction)
                                                    output += result[i].specialReduction;
                                                output += ',';
                                                if (result[i].MRP)
                                                    output += result[i].MRP;
                                                output += ',';


                                                if (result[i].orderMRP)
                                                    output += result[i].orderMRP;
                                                output += ',';

                                                if (result[i].total)
                                                    output += result[i].total;
                                                output += ',';

                                                if (result[i].orderTotal)
                                                    output += result[i].orderTotal;
                                                output += ',';

                                                //.... Invoice Details....
                                                if (result[i].invoiceId.length)
                                                    if (result[i].invoiceId[0]) {
                                                        output += result[i].invoiceId[0];
                                                    } else {
                                                        output += result[i].invoiceId;
                                                    }
                                                output += ',';

                                                // if (result[i].invoiceDetails[j].total)
                                                //     output += result[i].invoiceDetails[j].total;
                                                if (result[i].invoiceId.length)
                                                    if (result[i].invoiceId[1]) {
                                                        output += result[i].invoiceId[1];
                                                    }
                                                output += ',';
                                                if (result[i].invoiceId)
                                                    if (result[i].invoiceId[2]) {
                                                        output += result[i].invoiceId[2];
                                                    }
                                                output += ',';

                                                if (result[i].advance)
                                                    output += result[i].advance;
                                                output += ',';

                                                if (result[i].PaymentDone)
                                                    output += result[i].PaymentDone;
                                                output += ',';

                                                if (result[i].siteCode)
                                                    output += result[i].siteCode;
                                                output += ',';

                                                if (result[i].siteName) {
                                                    if ((result[i].siteName).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + result[i].siteName + '"';
                                                        result[i].siteName = quotesWrapped
                                                    }
                                                    output += result[i].siteName;
                                                }
                                                output += ',';

                                                if (result[i].PaymentType)
                                                    output += result[i].PaymentType;
                                                output += ',';

                                                var comment = '';
                                                try {
                                                    comment = result[i].comment[(result[i].comment.length) - 1].comment
                                                } catch (e) {
                                                }
                                                if (comment) {
                                                    if ((comment).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + comment + '"';
                                                        comment = quotesWrapped
                                                    }
                                                    output += comment;
                                                }
                                                output += ',';

                                                if (result[i].sellername)
                                                    output += result[i].sellername;
                                                output += ',';

                                                if (result[i].customerDetails && result[i].customerDetails.length)
                                                    output += result[i].customerDetails[0].SellerName;
                                                output += ',';

                                                if (result[i].status)
                                                    output += result[i].status;
                                                output += ',';

                                                if (result[i].latitude)
                                                    output += result[i].latitude;
                                                output += ',';

                                                if (result[i].longitude)
                                                    output += result[i].longitude;
                                                output += ',';

                                                if (result[i].freight)
                                                    output += result[i].freight || 0;
                                                output += ',';


                                                if (result[i].images) {

                                                    if (typeof result[i].images == 'object') {
                                                        // if images is an array //

                                                        for (var k = 0; k < result[i].images.length; k++) {

                                                            if (result[i].images[k] != 'undefined') {

                                                                var quotesWrapped = '"' + result[i].images[k].image + '"';

                                                                output += quotesWrapped;

                                                            }
                                                        }

                                                    } else if (typeof result[i].images == 'string') {
                                                        // if images is a string //

                                                        if (result[i].images != 'undefined') {

                                                            var quotesWrapped = '"' + result[i].images + '"';

                                                            output += quotesWrapped;

                                                        }
                                                    }
                                                }
                                                output += ',';

                                                if (result[i].attachments && result[i].attachments.length){
                                                    for(let k=0;k< result[i].attachments.length; k++){
                                                        if(result[i].attachments[k] !='undefined'){
                                                            let quotesWrapped = '"\n' + result[i].attachments[k].url + '"';
                                                            output += quotesWrapped;
                                                        }
                                                    }
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
                                                download: 'Mbj_' + instanceDetails.api_key + '_Orders_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                            })[0].click();

                                        }else {


                                                if($scope.user.role != 'Dealer')
                                                    adminOrderDownload(result)

                                                if($scope.user.role == 'Dealer')
                                                    dealerOrderDownload(result);


                                            }

                                            //return response

                                            stopLoader();
                                        })
                                        .error(function(data, status, headers, config){
                                            console.log(data);
                                            stopLoader();
                                            // document.getElementById("loader").style.display = "none";
                                            // document.getElementById("myDiv").style.display = "block";
                                            // document.getElementById("message").style.display = "none";

                                            Settings.alertPopup("ERROR Line : 14877",
                                                "The server took too long to respond : Timeout Error. Please try again!<br>Error : " + data + " " + status);
                                        });
                            }

                        })
                        .error(function(data, status, headers, config){
                            console.log(data);
                            // document.getElementById("loader").style.display = "none";
                            // document.getElementById("myDiv").style.display = "block";
                            // document.getElementById("message").style.display = "none";

                            bootbox.alert({
                                title: "ERROR Line : 14895",
                                message: "The server took too long to respond : Timeout Error. Please try again!<br>Error : " + data + " " + status,
                                className: "text-center",
                                callback: function (result) {

                                }
                            })
                        });
                    break;
            }
        }

        /*============download csv function end==========*/

        $scope.clearFilterButton = search => {
            if (!search) $scope.refreshTransactions();
        }


        $scope.updateFulfiller = function (order, fulfiller, flag) {

            if (flag) {
                if(!order.length){
                    var obj = {};
                    obj.fulfiller = fulfiller;
                    obj.dealername = order.dealername[0];
                    obj.dealerphone = order.dealerphone;
                    $http.put("/dash/orders/fulfiller/" + order.orderId[0] + "/1", obj)
                        .then((response) => {
                            $scope.orderFulfiller = '';
                        })
                        .catch((error, status) => {
                            console.log(error, status);
                            if(status){
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                            }else if(error.status){
                                if(error.status >= 400 && error.status < 404)
                                    $window.location.href = '/404';
                                else if(error.status >= 500)
                                    $window.location.href = '/500';
                            }
                            else
                                $window.location.href = '/404';
                        });
                }else{
                    var obj = {};
                    obj.fulfiller = fulfiller;
                    obj.dealername = order[0].dealername;
                    obj.dealerphone = order.dealerphone;
                    $http.put("/dash/orders/fulfiller/" + order[0].orderId + "/1", obj)
                        .success(function (response) {
                            //$scope.showOrderDetails(order[0]);
                            $scope.orderFulfiller = '';
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
            else {
                $http.put("/dash/orders/fulfiller/" + order._id + "/0", order)
                    .success(function (response) {
                        // console.log("Update -->" + response);
                        //$scope.all();

                        Settings.success_toast($scope.getfulfillersName(fulfiller)+ " assigned to " + order.orderId);
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

        $scope.getShopifyOrders = function(){
            startLoader();
            $http.get("/dash/shopify/pull/orders")
                .then(response => {
                    console.log("Shopify Orders Updation initiated ---> ", response.data);
                    if(response.data){
                        stopLoader();
                        Settings.success_toast('SUCCESS',"Shopify Orders will be synced in the background");
                        $scope.refreshTransactions();
                    } else {
                        stopLoader();
                        Settings.failurePopup('ERROR', "Orders importing failed, Check the credentials and try again");
                    }
                })
                .catch((error, status) => {
                    stopLoader();
                    console.log(error, status);
                    if(status){
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                    }else if(error.status){
                        if(error.status >= 400 && error.status < 404)
                            $window.location.href = '/404';
                        else if(error.status >= 500)
                            $window.location.href = '/500';
                    }
                    else
                        $window.location.href = '/404';
                });
        }

        //... Save orders under multiple order select...
        //.... These orders are cached for multiple assignments....
        $scope.multipleSelect = function (order) {
            Settings.setOrderData(order);
        };

        $scope.updateFulfillerForMultiOrder = function (fulfiller,type) {
            var obj = {};
            var AssignedArray = [];
            var tempOrderArray = [];

            if(type == 'warehouse'){
                if($scope.AssignedFulfiller && $scope.AssignedFulfiller.length) {
                    for (var i = 0; i < $scope.AssignedFulfiller.length; i++) {
                        if ($scope.AssignedFulfiller[i].fulfiller[0] != fulfiller) {
                            tempOrderArray.push($scope.AssignedFulfiller[i])
                        }
                    }
                    $scope.AssignedFulfiller = tempOrderArray;

                    for (var i = 0; i < $scope.AssignedFulfiller.length; i++) {
                        AssignedArray.push({"orderId": $scope.AssignedFulfiller[i]._id})
                    }

                    var new_date = Settings.newDate();

                    obj.warehouse = fulfiller;
                    obj.type = 'warehouse';
                    obj.order = AssignedArray;
                    obj.fulfiller_assigned_time = new_date;

                    if ($scope.AssignedFulfiller.length) {
                        $http.post('/dash/multiple/orders/assign', obj).then(function (result) {
                            console.log('result', result.data);

                            if (!result.data) {
                                Settings.alertPopup('WARNING', "Could not update. Please refresh and try");

                            } else {
                                $scope.orderFulfiller = '';
                                Settings.success_toast("Success", "Warehouse Assigned Successfully");
                                $scope.AssignedFulfiller = [];
                                $scope.refreshTransactions();
                            }
                        })
                    }
                }else{
                    Settings.failurePopup('Error', 'Please select at least one Order to assign Warehouse');
                    $scope.orderFulfiller = '';
                }
            }else if(type == 'fulfillment') {
                if ($scope.AssignedFulfiller && $scope.AssignedFulfiller.length) {
                    for (var i = 0; i < $scope.AssignedFulfiller.length; i++) {
                        AssignedArray.push({"orderId": $scope.AssignedFulfiller[i]._id})
                    }

                    obj.fulfillmentStatus = fulfiller;
                    obj.type = 'fulfillment';
                    obj.order = AssignedArray;
                    if ($scope.AssignedFulfiller.length) {
                        $http.post('/dash/multiple/orders/assign', obj)
                            .then(result => {
                                if (!result.data) {
                                    Settings.alertPopup('WARNING', "Could not update. Please refresh and try");

                                } else {
                                    $scope.orderFulfillmentStatus = '';
                                    Settings.success_toast("Success", "fulfilment status  changed Successfully");
                                    $scope.AssignedFulfiller = [];
                                    $scope.refreshTransactions();
                                }
                            })
                    }
                }else{
                    Settings.failurePopup('Error', 'Please select at least one Order to assign fulfilment status');
                    $scope.orderFulfillmentStatus = '';
                }
            }else if(type == 'paymentStatus'){
                if ($scope.AssignedFulfiller && $scope.AssignedFulfiller.length) {
                    for (var i = 0; i < $scope.AssignedFulfiller.length; i++) {
                        AssignedArray.push({"orderId": $scope.AssignedFulfiller[i]._id})
                    }

                    obj.paymentStatus = fulfiller;
                    obj.type = 'paymentStatus';
                    obj.order = AssignedArray;
                    if ($scope.AssignedFulfiller.length) {
                        $http.post('/dash/multiple/orders/assign', obj)
                            .then(result => {
                                if (!result.data) {
                                    Settings.alertPopup('WARNING', "Could not update. Please refresh and re-try");
                                } else {
                                    $scope.assignedPaymentStatus = '';
                                    Settings.success_toast("Success", "Payment Status changed Successfully");
                                    $scope.AssignedFulfiller = [];
                                    $scope.refreshTransactions();
                                }
                            })
                    }
                }else{
                    Settings.failurePopup('Error', 'Please select at least one Order to assign Payment Status');
                    $scope.assignedPaymentStatus = '';
                }
            }
        }

        $scope.updateDeliveryDateForMultiOrder = function (date, flag) {

            if($scope.AssignedFulfiller && $scope.AssignedFulfiller.length) {

                var tempDate =  Settings.dateFilterFormat(dateformat, 'start');
                var today = Settings.dateFilterFormat(new Date(), 'start');

                if (tempDate >= today) {
                    var obj = {};
                    var AssignedArray = [];
                    for (var i = 0; i < $scope.AssignedFulfiller.length; i++) {
                        AssignedArray.push({"orderId": $scope.AssignedFulfiller[i]._id})
                    }

                    obj.type = 'deliveryDate';
                    obj.order = AssignedArray;
                    obj.deliveryDate = Settings.dateFilterFormat(date, 'start');

                    $http.post('/dash/multiple/orders/assign', obj)
                        .then(result => {
                            if (!result.data) {
                                Settings.alertPopup('WARNING', "Could not update. Please refresh and try");
                            } else {
                                $scope.orderDeliveryDate = '';
                                Settings.success_toast("Success", Settings.formatDate(date) + " Assigned Successfully");
                                $scope.AssignedFulfiller = [];
                                $scope.refreshTransactions();
                            }
                        })
                }
                else {
                    jQuery.noConflict();
                    if (flag)
                        $("#order_deliverDate").val(null);
                    else
                        $("#orderLine_deliveryDate").val(null);
                    Settings.failurePopup('Error', 'Please select today or any future date');
                }
            }else{
                Settings.failurePopup('Error', 'Please select at least one Order to assign deliveryDate');
                $scope.orderDeliveryDate = '';
            }
        }

        $scope.multipleOrder = function (order,value) {
            if(value) $scope.AssignedFulfiller.push(order);
            else{
                var idx = $scope.AssignedFulfiller.indexOf(order);

                if (idx > -1) {
                    $scope.AssignedFulfiller.splice(idx, 1);
                }
            }
        }

        $scope.getAllDropdownValues = ()=> {
            console.log('salesorg')
            $http.get("/dash/orders/zeita/dropdown/")
                .then(response => {
                    // console.log('salesorg-=>> ',response)
                    // $scope.getAllSalesOrgIds = response.data;
                    $scope.zeitaDropdown = response.data;
                })
                .catch((error, status) => {
                    console.log(error, status);
                    if(status){
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                    }else if(error.status){
                        if(error.status >= 400 && error.status < 404)
                            $window.location.href = '/404';
                        else if(error.status >= 500)
                            $window.location.href = '/500';
                    }
                    else
                        $window.location.href = '/404';
                });
        }
        $scope.getAllDropdownValues();
})
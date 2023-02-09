/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("CustomerAddressCtrl",function ($scope, $filter, $http, $modal, $window, toastr,Settings, $interval,$sce,$mdDialog,$location) {
        console.log("Hello From Customers Addresses Controller .... !!!!");

        //Render Stores
        // Dealer page declaration

        $scope.dealerListPage = true ;
        $scope.dealerAddPage = false ;
        $scope.dealerEditPage = false ;

        // ************************Add dealer
        $scope.dealer = {};

        //Store customer images and document images while creating a new customer from portal
        $scope.newStoreImageArray = {};
        $scope.newStoreImageArray.customerImage = [];
        $scope.newStoreImageArray.customerDoc = [];

        // ************************dealer filter
        $scope.dealerSearch = {};
        $scope.dealerSearch.filter = '';
        $scope.dealerSearch.filterBy = '';
        $scope.cityText = {};
        $scope.cityText.filter = '';

        $scope.allDealers = [];
        $scope.branches = [];
        $scope.dealerSelectAll = {};
        $scope.sellerNames = []; //stores seller name
        $scope.fulfillerNames = {};
        $scope.filter = {};
        $scope.user = {};
        $scope.dealerClasses = [] ;
        $scope.countryCode = [];

        var viewBy = {};
        viewBy.dealer = 12;
        var initialViewBy = 60;
        var dealerSearchObj = {};
        $scope.orders = [];
        $scope.nav = [];
        $scope.newViewBy = 10;
        $scope.viewLength = 0;
        $scope.newViewBy = viewBy.dealer;
        var localViewBy = $scope.newViewBy;
        var dealerSearchBy = ['Dealercode', 'DealerName', 'City', 'seller','SellerName', 'StockistName', 'Area', 'Phone', 'email'];
        $scope.displayDealerRefresh = true;
        $scope.serviceClients = [];
        $scope.leadserviceClients=[];
        var allStoreRetrieveObj = {};
        dealerSearchObj.viewLength = 0;
        dealerSearchObj.viewBy = initialViewBy;
        dealerSearchObj.searchFor = '';
        dealerSearchObj.seller = '';
        dealerSearchObj.stockist = '';
        dealerSearchObj.searchBy = [];
        dealerSearchObj.searchByArea = [];
        dealerSearchObj.searchRegion = [];
        allStoreRetrieveObj.viewLength = 0;
        allStoreRetrieveObj.viewBy = 60;
        allStoreRetrieveObj.searchFor = '';
        allStoreRetrieveObj.seller = '';
        allStoreRetrieveObj.stockist = '';
        allStoreRetrieveObj.searchBy = [];
        allStoreRetrieveObj.searchByArea = [];
        allStoreRetrieveObj.searchRegion = [];
        // $scope.customerType='customer';
        $scope.class = {};


        $scope.dealerSelectAll.city = true;

        $scope.showStoreFilter = false;
        $scope.filter.sales = "All";
        $scope.filter.branch = "All";
        $scope.filter.class = "All";
        $scope.filter.customerType="All";
        var instanceDetails =  Settings.getInstance();
        $scope.coID = instanceDetails.coID;
        $scope.default_CountryCode = '+91';
        $scope.country = {};
        $scope.country.name = instanceDetails.country || 'India';
        $scope.default_CountryCode = instanceDetails.countryCode;
        $scope.tempCountryName = $scope.country.name.toLowerCase();
        $scope.DisplayShopifyButton = false;
        $scope.dealerfilterFlag = false ;
        $scope.leadstatus=[];

        $scope.disableFlag = false;

        // $scope.cityFilterFlag = false;
        // $scope.areaFilterFlag = false;

        //Checkin Map Icons
        $scope.checkinIcons = [];
        $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';

        $scope.leadstatus=instanceDetails.leadStatus;

        $scope.user = '';
        var userRole = '';
        Settings.getUserInfo(function(user_details){
            $scope.user = user_details;
            if($scope.user.role){
                userRole = $scope.user.role.toLowerCase();
            }

        });

        $http.get("/dash/shopify/creds/fetch")
            .success(function (response) {
                console.log("Shopify credentials Fetched")
                if(response.length){

                    if(response[0].shopify_api_key && response[0].shopify_password && response[0].shopify_host && (userRole == 'admin' || !userRole)){
                        $scope.DisplayShopifyButton = true;
                    }else{
                        $scope.DisplayShopifyButton = false;
                    }

                }
            })
            .error(function (error){
                console.log(error)
            })

        $scope.renderInstanceDetails = function (response) {
            console.log("Instance Details for Dealers -->");
            // console.log(response);
            if(response.dealerClass){
                $scope.dealerClasses = response.dealerClass ;
            }
            if(response.masterPriceList){
                $scope.masterPriceList = response.masterPriceList;
            }
        };

        $scope.countryCodeGet = function () {
            console.log('get country codes');
            $http.get("/country/countryCode").success(function (res) {
                if(res){
                    $scope.countryCode = res;
                }
            });
        };

        $scope.countryCodeGet();

        $http.get("/dash/instanceDetails")
            .success($scope.renderInstanceDetails).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

        $scope.userRole=[
            {
                name:"Admin",
                role:"Admin",
                status:true
            },
            {
                name:"Salesperson",
                role:"Salesperson",
                status:true
            },
            {
                name:"Stockist",
                role:"Stockist",
                status:true
            },
            {
                name:"Dealer",
                role:"Dealer",
                status:true
            },
            {
                name:"Portal Access",
                role:"Portal",
                status:true
            },
            {
                name:"Fulfiller",
                role:"Fulfiller",
                status:true
            },
            {
                name:"Manager",
                role:"Manager",
                status:true
            },
            {
                name:"Branch Role",
                role:"BranchManager",
                status:true
            }
        ];

        jQuery.noConflict();
        $('.refresh').css("display", "inline");




        function reverseGeocode(callback, latlng, type){
            var geocoder = new google.maps.Geocoder();

            if(type == 'customer'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'customer');
                    }
                });
            }

        }
        $scope.formatFullDate = function(date){
            if(date==undefined)
                return
            /* replace is used to ensure cross browser support*/
            var d = new Date(date.toString().replace("-","/").replace("-","/"));
            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

            var time = ''
            var hour =  d.getHours();
            var minute = d.getMinutes();
            var session = ''
            if(minute==0)
                minute = '00'
            else if(minute<10){
                var temp = minute;
                minute = '0' +minute
            }

            if(d.getHours()>12) {
                session = 'PM'
                hour -= 12
            }
            else if(d.getHours() == 12)
                session = 'PM'
            else {
                session = 'AM'
            }
            time = hour+':'+ minute +' '+session
            var dateOut = d.getDate()+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear())+' at '+ time

            $scope.mapTransactionDate = d.getDate()+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear());

            return dateOut;
        }

        function geocode_address(result, type){
            if(type == 'customer'){
                $scope.checkinMapLocation.dealer = result;
                $scope.$apply();
            }

        }


        $http.get("/dash/addresses")
            .success(function(addresses){
                $scope.allShippingAddress = addresses;
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                //console.log("Salesperson : ", salesperson);
                if(salesperson && salesperson.length){
                    $scope.roleSalesrep = [];
                    for(var i = 0; i < salesperson.length; i++){
                        $scope.roleSalesrep.push({sellername : salesperson[i].sellername, sellerphone : salesperson[i].sellerphone});
                    }
                }
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

        $http.get("/dash/settings/details/DealerTabs")
            .then(pincode => {
                if(pincode.data){
                    $scope.pinCodeMadatory = pincode.data.PinCodeMadatory;
                }else{
                    $scope.pinCodeMadatory = false;
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


        $http.get("/dash/nav")
            .success(function(response){
                $scope.nav = response;
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

        $http.get("/dash/user/role/access")
            .success(function(res) {
                if (res.role) {
                    $scope.user = res;
                }
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });


        $scope.getRewardPoints = function(flag){
            if(flag){
                for(var i=0; i<$scope.orders.length; i++) {
                    for (var j = 0; j < $scope.serviceClients.length; j++) {

                        if (!$scope.serviceClients[j].Revenue)
                            $scope.serviceClients[j].Revenue = 0;

                        if ((Number($scope.orders[i].dealerphone[0])) == $scope.serviceClients[j].Phone) {
                            $scope.serviceClients[j].Revenue += (Number($scope.orders[i].total_amount[0]) / 100);
                        }
                    }
                }
            }
        }

        $scope.refreshSellerNames = function(){
            if(typeof $scope.roleSalesrep == 'object'){
                for(var j=0;j<$scope.roleSalesrep.length;j++){
                    if($scope.roleSalesrep[j].userStatus == 'Active' || $scope.roleSalesrep[j].role != '')
                        $scope.sellerNames[$scope.roleSalesrep[j].sellerphone] = $scope.roleSalesrep[j].sellername;
                }
            }

            // console.log($scope.sellerNames);
        }

        $scope.getSellerName = function(sellerNo,tag){
            // console.log('SellerNumber',sellerNo,'Tag',tag)
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
        // console.log($scope.sellerNames);

        $scope.multipleUsers = function(response,type){

            var obj = [];
            if($scope.filter.branch == 'All')
                $scope.allStockistFromDealer = [];
            var allStockist = [];

            // check for seller name by searching it in number

            for(var i=0;i<response.length;i++){
                response[i].multipleSeller = false;
                response[i].multipleStockist = false;


                if((typeof(response[i].Seller) == 'string' || typeof(response[i].Seller == 'number')) && !angular.isObject(response[i].Seller)){
                    //console.log(response[i].Dealercode)
                    response[i].SellerName = $scope.getSellerName(response[i].Seller) ?  $scope.getSellerName(response[i].Seller) : response[i].SellerName;
                }
                else if(angular.isObject(response[i].Seller)){
                    response[i].SellerName = '';
                    response[i].multipleSeller = true;
                    for(var j=0; j< response[i].Seller.length; j++){
                        if(j < response[i].Seller.length - 1)
                            response[i].SellerName += $scope.getSellerName(response[i].Seller[j])+", ";
                        else
                            response[i].SellerName += $scope.getSellerName(response[i].Seller[j]);
                    }
                }

                if(typeof(response[i].Stockist) == 'string' || typeof(response[i].Stockist) == 'number'){
                    // if(response[i].StockistName )
                    //     allStockist.push({Stockist : response[i].Stockist, StockistName : response[i].StockistName});
                    // else allStockist.push({Stockist : response[i].Stockist, StockistName : 'No Name'});
                    // response[i].StockistName = response ? $scope.getSellerName(response[i].Stockist) : 'No Name';
                }
                else if(response[i].Stockist){
                    response[i].multipleStockist = true;
                    /*for(var j=0; j< response[i].Stockist.length; j++){
                     if(response[i].StockistName[j])
                     allStockist.push({Stockist : response[i].Stockist[j], StockistName : response[i].StockistName[j]});
                     else allStockist.push({Stockist : response[i].Stockist[j], StockistName : 'No Name'});

                     // if(j < response[i].Stockist.length - 1)
                     //     response[i].StockistName += $scope.getSellerName(response[i].Stockist[j]) ? $scope.getSellerName(response[i].Stockist[j]) : 'No Name'+", ";
                     // else
                     //     response[i].StockistName += $scope.getSellerName(response[i].Stockist[j]) ? $scope.getSellerName(response[i].Stockist[j]) : 'No Name';
                     }*/

                }


                $scope.serviceClients.push(response[i]);




                // if(response[i].Area){
                //     obj.push(response[i]);
                // }
            }


            // if(type=='City'){
            //     $scope.dealer_area = [];
            //     $scope.dealer_area = obj.unique('Area');
            //
            //     $scope.dealer_area.map(function (dealer) {
            //
            //
            //         if($scope.dealerSelectAll.city){
            //             dealer.selected_area = true;
            //         }else{
            //             dealer.selected_area = true
            //         }
            //         return dealer;
            //     })
            // }



            $scope.serviceClients = $filter('orderBy')( $scope.serviceClients, 'DealerName');

            if($scope.filter.branch == 'All'){

                //      $http.get("/dash/stores/stockist").success(function(response){
                $http.get("/dash/stores/all/stockist").success(function(response){
                    // console.log("stockist=====",response);
                    allStockist = response;
                    $scope.allStockistFromDealer = allStockist.unique('StockistName');
                    for(var i = 0; i < response.length; i++)
                        $scope.sellerNames[response[i].Stockist] = response[i].StockistName;
                }).error(function(error, status){
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

        //Store filter function
        $scope.storeSearchFilter = function(){
            console.log($scope.filter.customerType);

            $scope.showListDealerDetail = false;
            dealerSearchObj.viewLength = 0;
            dealerSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.dealerSearch.filter){
                dealerSearchObj.searchFor = $scope.dealerSearch.filter;
                dealerSearchObj.searchBy = dealerSearchBy;
            }
            dealerSearchObj.leadstatus = '';
            if($scope.filter.leadstatus){
                dealerSearchObj.leadstatus = $scope.filter.leadstatus;
            }

            dealerSearchObj.stockist = {};
            dealerSearchObj.STOCKISTS = {};
            if($scope.filter.branch != 'All'){
                console.log("$scope.filter.branch",$scope.filter.branch);
                //  dealerSearchObj.stockist = $scope.filter.branch;
                dealerSearchObj.STOCKISTS = $scope.filter.branch;

            }
            else {
                // dealerSearchObj.stockist = '';
                dealerSearchObj.STOCKISTS = '';
            }
            console.log("dealer object",dealerSearchObj);

            if($scope.filter.sales != 'All'){
                dealerSearchObj.seller = $scope.filter.sales;
            }
            else{
                dealerSearchObj.seller = '';
            }
            if($scope.filter.class != 'All'){
                dealerSearchObj.class = $scope.filter.class;
            }
            else{
                dealerSearchObj.class = '';
            }
            if($scope.filter.customerType !='All'){
                dealerSearchObj.customerType = $scope.filter.customerType;
            }
            else{
                dealerSearchObj.customerType = '';
            }

            $scope.serviceClients = [];

            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            console.log(dealerSearchObj)

            $http.post('/dash/stores', dealerSearchObj)
                .success(function(res){

                    $scope.multipleUsers(res);
                    // $scope.renderStoreMap(res);
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            $http.post("/dash/stores/count", dealerSearchObj)
                .success(function(res){
                    $scope.transactionCount(res,4);
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 1000);



            $scope.showStoreFilter = true;

            if($scope.dealer.selected_city == '' && $scope.dealer.selected_area == '' && $scope.dealerSearch.filter == '' && $scope.filter.branch == 'All' && $scope.filter.sales == 'All' && $scope.filter.class == 'All' && $scope.filter.customerType == 'All')
                $scope.showStoreFilter = false;
        };

        $scope.renderServiceClients = function (response) {
            $scope.serviceClients =[];
            $scope.leadserviceClients=[];
            for(var i = 0; i< response.length; i++){
                if (response[i].leadStatusWithFollowup.length) {
                    var last = response[i].leadStatusWithFollowup[response[i].leadStatusWithFollowup.length - 1];
                    response[i].leadstatus = last.leadstatus;
                    response[i].leadsource = last.leadsource;
                    response[i].revenueAmount = last.revenueAmount;
                }
            }
            // console.log("GetAll Stores --> " + response.length);
            $scope.invoiceClients = response;

            // console.log(response)
            $scope.multipleUsers(response);


            if($scope.dealerSelectAll.city)
                $scope.dealerSelectAll.city = true;
            else
                $scope.dealerSelectAll.city = false;

            if($scope.dealerSelectAll.city)
                $scope.dealerSelectAll.area = true;
            else
                $scope.dealerSelectAll.area = false;



            $http.get("/dash/store/branches").then(function(response){
                if(response.data.length){
                    for(var i = 0; i < response.data.length; i++){
                        if(response.data[i].branchCode[0] && response.data[i].branchName[0])
                            $scope.branches.push({'branchCode' : response.data[i].branchCode[0], 'branchName' : response.data[i].branchName[0]});
                    }
                }
            })

            // if(response.length == 1){
            //     console.log('One Store');
            //     $scope.data.newOrderStore = response[0];
            //     $scope.a.selectedStores = response[0];
            //     $scope.data.newOrderShipping_address = response[0].Address;
            //
            //     $http.get("/dash/address-list/" + $scope.data.newOrderStore.Dealercode)
            //         .success(function(response){
            //             //console.log(response);
            //             $scope.shipping_addresses = response;
            //         }).error(function(error, status){
            //         console.log(error, status);
            //         if(status >= 400 && status < 404)
            //             $window.location.href = '/404';
            //         else if(status >= 500)
            //             $window.location.href = '/500';
            //         else
            //             $window.location.href = '/404';
            //     });
            //     //console.log($scope.newOrderShipping_address)
            // }
            // /*if(response.length < 50)
            //   $scope.totalStoresDisplayed = response.length;*/

            // $scope.getRewardPoints(1);


            //Set checkboxes for CITY and AREA filter as true
            $scope.dealerSelectAll = {};
            $scope.dealerSelectAll.city = true;
            $scope.dealerSelectAll.area = true;

        };

        $scope.trial42 = function (val, i) {
            $scope.branches = $filter('filter')($scope.items41, val);
            $scope.viewby = i;
            $scope.totalItems = $scope.branches.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
        }

        $scope.transactionCount = function(response, tab){
            //console.log(response);
            if(response){
                if(response > viewBy.dealer){
                    $scope.dealer_count = response;
                    $scope.viewLength = 0;
                    $scope.newViewBy = viewBy.dealer;
                }
                else if(response <= viewBy.dealer){
                    $scope.dealer_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.serviceClients = [];
                    $scope.newViewBy = 1;
                    $scope.dealer_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.serviceClients = [];
                $scope.newViewBy = 1;
                $scope.dealer_count = 0;
                $scope.viewLength = -1;
            }
        }

        $scope.navPage = function(tab, direction){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            if(direction){
                if(viewLength + viewBy >= $scope.serviceClients.length){
                    if(viewLength + viewBy < $scope.dealer_count){
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        dealerSearchObj.viewLength = viewLength;
                        dealerSearchObj.viewBy = initialViewBy;
                        dealerSearchObj.searchFor = $scope.dealerSearch.filter;
                        // if($scope.filter.branch != 'All'){
                        //     dealerSearchObj.stockist = $scope.filter.branch;
                        // }
                        // else {
                        //     dealerSearchObj.stockist = '';
                        // }

                        if($scope.filter.branch != 'All'){
                            dealerSearchObj.STOCKISTS = $scope.filter.branch;
                        }
                        else {
                            dealerSearchObj.STOCKISTS = '';
                        }

                        if($scope.filter.class != 'All'){
                            dealerSearchObj.class = $scope.filter.class;
                        }
                        else {
                            dealerSearchObj.class = '';
                        }

                        if($scope.filter.sales != 'All'){
                            dealerSearchObj.seller = $scope.filter.sales.seller;
                        }
                        else{
                            dealerSearchObj.seller = '';
                        }
                        dealerSearchObj.searchBy = dealerSearchBy;
                        jQuery.noConflict();
                        $('.refresh').css("display", "inline");

                        // dealerSearchObj.viewBy = 0;
                        // dealerSearchObj.viewLength = 0;
                        console.log(dealerSearchObj)
                        $http.post("/dash/stores",dealerSearchObj)
                            .success(function(response){
                                // console.log(response);


                                $scope.multipleUsers(response);

                                if(viewLength + viewBy > $scope.dealer_count){
                                    a = viewLength + viewBy - $scope.dealer_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                                $scope.viewLength = viewLength;
                                jQuery.noConflict();
                                $('.refresh').css("display", "none");
                            })


                    }
                    else{
                        //console.log("Out of data")
                        if(viewLength + viewBy > $scope.dealer_count){
                            a = viewLength + viewBy - $scope.dealer_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    //console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.dealer_count){
                        a = viewLength + viewBy - $scope.dealer_count;
                        viewBy -= a;
                    }
                    $scope.newViewBy = viewBy;
                    $scope.viewLength = viewLength;
                }
            }
            else{
                //console.log("BACK");
                if(viewLength < viewBy){
                    //console.log("NO DATA")
                }
                else{
                    if(viewLength + viewBy >= $scope.dealer_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        //Store filter function search by area and city
        $scope.storeSearchByArea = function(){
            $scope.dealer_city = [];
            $scope.dealer_area = [];
            var temp = [];
            var temp1 = [];

            if($scope.cityText.filter){
                dealerSearchObj.searchFor = $scope.cityText.filter;
                dealerSearchObj.searchBy = dealerSearchBy;
                $http.post("/dash/stores", dealerSearchObj)
                    .success(function (res) {

                        $scope.serviceClients = res;
                        $scope.transactionCount(res.length, 4);
                        for(var i=0; i<res.length; i++){
                            temp.push({'selected_city': true ,'_id':res[i].City});
                            temp1.push({'selected_area': true ,'_id':res[i].Area});
                        }
                        $scope.dealer_city = temp.unique("_id");
                        $scope.dealer_area = temp1.unique("_id");

                    });

            }
            $scope.showStoreFilter = true;
        };

        $scope.getAllStoreCities = function(param,type){

            $http.post("/dash/stores/filter/"+type, {viewBy : 0})
                .success(function(city){
                    $scope.dealer_city = city;
                    // $scope.dealer_city.map(function (dealer) {
                    //
                    //     if($scope.dealerSelectAll.city){
                    //         dealer.selected_city = param;
                    //     }else{
                    //         dealer.dealer_city = true;
                    //     }
                    //     return dealer;
                    // })

                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
        };

        $scope.getAllStoreAreas = function(param,type){
            $http.post("/dash/stores/filter/"+type, {viewBy : 0})
                .success(function(area){
                    $scope.dealer_area = area;
                    // $scope.dealer_area.map(function (dealer) {
                    //
                    //     if($scope.dealerSelectAll.city){
                    //         dealer.selected_area = true;
                    //
                    //     }else{
                    //         dealer.dealer_area = true
                    //         $scope.dealer_area= [];
                    //     }
                    //     return dealer;
                    // })
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
        };

        $scope.getAllStoreCities(true,'city');

        $scope.getAllStoreAreas(true,'area');

        $scope.showDealerTransactions = true;


        if ($scope.dealer_count < viewBy.dealer) {
            $scope.newViewBy = $scope.dealer_count;
        }

        $scope.clearFilterButton = function (search,tab) {
            if (search === '') {
                dealerSearchObj.viewLength = 0;
                dealerSearchObj.viewBy = initialViewBy;
                dealerSearchObj.searchFor = '';
                dealerSearchObj.seller = '';
                dealerSearchObj.stockist = '';
                dealerSearchObj.STOCKISTS = '';
                dealerSearchObj.searchBy = [];

                // dealerSearchObj.searchBycustomertype='';

                // if($scope.customerType=='lead'){
                //     dealerSearchObj.searchBycustomertype='Lead';
                //
                // }
                // else{
                //     dealerSearchObj.searchBycustomertype='';
                //
                // }

                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.dealer;
                $scope.dealerSearch.filter = '';
                $scope.serviceClients = [];
                $scope.cityText.filter = '';
                console.log(dealerSearchObj)

                $http.post("/dash/stores", dealerSearchObj)
                    .success(function(res){


                        $scope.multipleUsers(res);
                    }).error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

                $http.post("/dash/stores/count", dealerSearchObj)
                    .success(function(res){
                        $scope.transactionCount(res,4);
                    }).error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

                $scope.showStoreFilter = false;

                $scope.getAllStoreCities(true,'city');
                $scope.getAllStoreAreas(true,'area');
            }
        };

        $scope.clearFilter = function(tab){
            dealerSearchObj.viewLength = 0;
            dealerSearchObj.viewBy = initialViewBy;
            dealerSearchObj.searchFor = '';
            dealerSearchObj.seller = '';
            dealerSearchObj.stockist = '';
            dealerSearchObj.STOCKISTS = '';
            dealerSearchObj.class = '';
            dealerSearchObj.searchBy = [];
            dealerSearchObj.searchByArea = [];
            dealerSearchObj.searchRegion = [];
            dealerSearchObj.customerType = '';
            dealerSearchObj.leadstatus = '';

            // if($scope.customerType=='lead'){
            //     dealerSearchObj.searchBycustomertype='Lead';
            //
            // }
            // else{
            //     dealerSearchObj.searchBycustomertype='';
            //
            // }
            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.dealer;
            $scope.dealerSearch.filter = '';
            $scope.serviceClients = [];
            $scope.cityText.filter = '';

            $scope.filter.sales = "All";
            $scope.filter.branch = "All";
            $scope.filter.class = "All";
            $scope.dealer.selected_city = '';
            $scope.dealer.selected_area = '';
            $scope.filter.customerType = "All";
            $scope.filter.leadstatus = '';


            $scope.showStoreFilter = false;
            $scope.showListDealerDetail = false;
            $scope.dealerSelectAll.city = true;
            $scope.storeMarkershowMap = true;
            $scope.disableFlag = false;


// change for pagination
            $http.post("/dash/stores", allStoreRetrieveObj)
                .success(function(response){



                    $scope.multipleUsers(response);
                    // $scope.renderStoreMap(response);
                    $scope.displayDealerRefresh=  true

                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            $http.post("/dash/stores/count", dealerSearchObj)
                .success(function(res){
                    $scope.transactionCount(res,4);
                    $scope.displayDealerRefresh=  true

                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });


            $scope.getAllStoreCities(true,'city');
            $scope.getAllStoreAreas(true,'area');
        };

        $scope.getImageUrl = function(obj){
            if(obj){
                if(obj.cloudinaryURL){
                    if(angular.isObject(obj.cloudinaryURL) && obj.cloudinaryURL.length > 0){
                        return obj.cloudinaryURL[0].image;
                    }
                    else if(angular.isObject(obj.cloudinaryURL) && obj.cloudinaryURL.length == 0){
                        return '../appimages/image_not_available.jpg';
                    }
                    else if(obj.cloudinaryURL!="[object Object]"){
                        return obj.cloudinaryURL;
                    }else return '../appimages/image_not_available.jpg';
                }
                else{
                    return '../appimages/image_not_available.jpg';
                }
            }
        }

        //Function to filter stores based on customer type
        // $scope.filterDealerBy = function(type){
        //     if(type == 'lead'){
        //         $scope.serviceClients=[];
        //         dealerSearchObj.searchBycustomertype='Lead';
        //         $scope.customerType='lead';
        //         $scope.refreshTransactions(4);
        //     }
        //     else{
        //         $scope.serviceClients=[];
        //         dealerSearchObj.searchBycustomertype='';
        //         $scope.customerType='';
        //         $window.location.href = '#/customers';
        //         $scope.refreshTransactions(4);
        //     }
        // }

        //Function to filter stores based on city and area
        $scope.filterDealerByCriteria = function (type, all, filter) {
            $scope.serviceClients = [];
            $scope.showListDealerDetail = false;
            if(type == 'city'){
                dealerSearchObj.viewLength = 0;
                dealerSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;
                dealerSearchObj.searchRegion = [];
                dealerSearchObj.searchByArea = [];
                if(filter.selected_city){
                    dealerSearchObj.searchRegion.push(filter.selected_city);
                    if(filter.selected_area){
                        dealerSearchObj.searchByArea = [];
                        $scope.dealer.selected_area = ''
                    }
                }else{
                    dealerSearchObj.searchRegion = [];
                    dealerSearchObj.searchByArea = [];
                }
            }else if(type == 'area'){
                dealerSearchObj.searchByArea = [];
                dealerSearchObj.viewLength = 0;
                dealerSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

                if(filter.selected_city){
                    dealerSearchObj.searchRegion = [];
                    dealerSearchObj.searchRegion.push(filter.selected_city)
                    if(filter.selected_area){
                        dealerSearchObj.searchByArea.push(filter.selected_area)
                    }
                }else{
                    if(filter.selected_area){
                        dealerSearchObj.searchByArea.push(filter.selected_area)
                    }else{
                        dealerSearchObj.searchRegion = [];
                        dealerSearchObj.searchByArea = [];
                    }
                }

            }
            $scope.showStoreFilter = true;
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            $http.post("/dash/stores", dealerSearchObj)
                .success(function (response) {

                    $scope.multipleUsers(response, );
                    // $scope.renderStoreMap(response);
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            $http.post("/dash/stores/count", dealerSearchObj)
                .success(function (res) {
                    $scope.transactionCount(res, 4);
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 1000);
            // if (type == 'city') {
            //     $scope.dealer.selected_area = null;
            //     dealerSearchObj.searchRegion = [];
            //     dealerSearchObj.searchByArea = [];
            //     if (all) {
            //         if (!$scope.dealerSelectAll.city) {
            //
            //             $scope.getAllStoreCities(false, 'city');
            //             $scope.getAllStoreAreas(false, 'area');
            //
            //             $scope.viewLength = 0;
            //             $scope.newViewBy = viewBy.dealer;
            //             $scope.cityText.filter = '';
            //             // $scope.renderStoreMap(0);
            //
            //             $scope.transactionCount(0, 4);
            //
            //         } else {
            //
            //             dealerSearchObj.searchRegion = [];
            //             $scope.clearFilter(4);
            //
            //             $scope.getAllStoreCities(true, 'city');
            //             $scope.getAllStoreAreas(true, 'area');
            //
            //             $scope.viewLength = 0;
            //             $scope.newViewBy = viewBy.dealer;
            //
            //
            //             $http.post("/dash/stores", dealerSearchObj)
            //                 .success(function (response) {
            //                     // $scope.multipleUsers(response, 'City');
            //                     // $scope.renderStoreMap(response);
            //                 }).error(function(error, status){
            //                 console.log(error, status);
            //                 if(status >= 400 && status < 404)
            //                     $window.location.href = '/404';
            //                 else if(status >= 500)
            //                     $window.location.href = '/500';
            //                 else
            //                     $window.location.href = '/404';
            //             });
            //
            //             $http.post("/dash/stores/count", dealerSearchObj)
            //                 .success(function (res) {
            //                     $scope.transactionCount(res, 4);
            //                 }).error(function(error, status){
            //                 console.log(error, status);
            //                 if(status >= 400 && status < 404)
            //                     $window.location.href = '/404';
            //                 else if(status >= 500)
            //                     $window.location.href = '/500';
            //                 else
            //                     $window.location.href = '/404';
            //             });
            //         }
            //
            //     } else {
            //
            //         if ($scope.dealerSelectAll.city) {
            //             dealerSearchObj.dealerSelectAll = true;
            //
            //             if (dealerSearchObj.searchRegion.length) {
            //
            //                 //... If City A needs to be removed...
            //                 if (filter.selected_city) {
            //
            //                     // var new_array = [];  //.. Temp array..
            //                     //
            //                     // for (var i = 0; i < dealerSearchObj.searchRegion.length; i++) {
            //                     //
            //                     //     if (filter._id != dealerSearchObj.searchRegion[i]) {
            //                     //         new_array.push(dealerSearchObj.searchRegion[i]);  //... Push all other cities...
            //                     //     }
            //                     //
            //                     // }
            //
            //                     dealerSearchObj.searchRegion.push(filter.selected_city) //... Replace the array..
            //                     dealerSearchObj.searchByArea = [];
            //
            //                     if (dealerSearchObj.searchRegion.length) {
            //                         $scope.fetchStoresByCities(dealerSearchObj);
            //                     } else {
            //                         $scope.fetchStoresByCities(dealerSearchObj);
            //                     }
            //
            //
            //                 } else {
            //                     for (var j = 0; j < dealerSearchObj.searchRegion.length; j++) {
            //                         // console.log('j Loop')
            //
            //                         if (filter._id == dealerSearchObj.searchRegion[j]) {
            //                             continue;
            //                         } else {
            //                             if (j == dealerSearchObj.searchRegion.length - 1) dealerSearchObj.searchRegion.push(filter._id);
            //                         }
            //                     }
            //                     dealerSearchObj.searchByArea = [];
            //                     $scope.fetchStoresByCities(dealerSearchObj);
            //                 }
            //
            //             } else {
            //
            //                 if (!filter.selected_city) {
            //
            //                     $scope.serviceClients = [];
            //
            //                     dealerSearchObj.searchRegion.push(filter._id)
            //
            //                     $scope.fetchStoresByCities(dealerSearchObj);
            //                 } else {
            //
            //                     // console.log('Selected only one City ')
            //
            //                     // console.log($scope.dealer_city.length)
            //
            //                     if ($scope.dealer_city.length) {
            //                         dealerSearchObj.searchByArea = [];
            //                         dealerSearchObj.searchRegion.push(filter.selected_city)
            //                         // for (var i = 0; i < $scope.dealer_city.length; i++) {
            //                         //
            //                         //     if ($scope.dealer_city[i]._id == filter.selected_city) {
            //                         //         dealerSearchObj.searchRegion.push($scope.dealer_city[i]._id)
            //                         //     }
            //                         // }
            //                         $scope.showStoreFilter = true;
            //                         $scope.fetchStoresByCities(dealerSearchObj);
            //                     }
            //
            //                 }
            //             }
            //         } else {
            //
            //             dealerSearchObj.dealerSelectAll = false;
            //             //.... If some city is already there...
            //             if (dealerSearchObj.searchRegion.length) {
            //                 // console.log(filter.selected_city)
            //                 //... If City A needs to be removed...
            //                 if (!filter.selected_city) {
            //                     //.. Temp array..
            //                     var new_array = [];
            //                     for (var i = 0; i < dealerSearchObj.searchRegion.length; i++) {
            //                         console.log('i Loop')
            //                         //... Push all other cities...
            //                         if (filter._id != dealerSearchObj.searchRegion[i]) {
            //
            //                             new_array.push(dealerSearchObj.searchRegion[i]);
            //                         }
            //                     }
            //                     //... Replace the array..
            //                     dealerSearchObj.searchRegion = new_array;
            //                     dealerSearchObj.searchByArea = [];
            //
            //                     if (dealerSearchObj.searchRegion.length) {
            //                         $http.post("/dash/stores", dealerSearchObj)
            //                             .success(function (response) {
            //                                 $scope.multipleUsers(response, 'City');
            //                                 // $scope.renderStoreMap(response);
            //                                 // $scope.transactionCount($scope.serviceClients.length, 4);
            //                             }).error(function(error, status){
            //                             console.log(error, status);
            //                             if(status >= 400 && status < 404)
            //                                 $window.location.href = '/404';
            //                             else if(status >= 500)
            //                                 $window.location.href = '/500';
            //                             else
            //                                 $window.location.href = '/404';
            //                         });
            //                         $http.post("/dash/stores/count", dealerSearchObj)
            //                             .success(function (res) {
            //                                 $scope.transactionCount(res, 4);
            //                             }).error(function(error, status){
            //                             console.log(error, status);
            //                             if(status >= 400 && status < 404)
            //                                 $window.location.href = '/404';
            //                             else if(status >= 500)
            //                                 $window.location.href = '/500';
            //                             else
            //                                 $window.location.href = '/404';
            //                         });
            //                     } else {
            //                         $scope.dealer_area = [];
            //                     }
            //
            //                 } else {
            //                     for (var j = 0; j < dealerSearchObj.searchRegion.length; j++) {
            //
            //                         if (filter._id == dealerSearchObj.searchRegion[j]) {
            //                             continue;
            //                         } else {
            //                             if (j == dealerSearchObj.searchRegion.length - 1) dealerSearchObj.searchRegion.push(filter._id);
            //                         }
            //                     }
            //
            //                     dealerSearchObj.searchByArea = [];
            //
            //                     $http.post("/dash/stores", dealerSearchObj)
            //                         .success(function (response) {
            //                             // console.log(response)
            //
            //                             $scope.multipleUsers(response, 'City');
            //                             // $scope.renderStoreMap(response);
            //                             // $scope.transactionCount($scope.serviceClients.length, 4);
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //                     $http.post("/dash/stores/count", dealerSearchObj)
            //                         .success(function (res) {
            //                             $scope.transactionCount(res, 4);
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //                 }
            //             } else {
            //
            //                 if (filter.selected_city) {
            //                     $scope.serviceClients = [];
            //
            //                     dealerSearchObj.searchRegion.push(filter._id)
            //
            //                     $http.post("/dash/stores", dealerSearchObj)
            //                         .success(function (response) {
            //
            //                             $scope.multipleUsers(response, 'City');
            //                             // $scope.transactionCount(response.length, 4);
            //                             // $scope.renderStoreMap(response);
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //                     $http.post("/dash/stores/count", dealerSearchObj)
            //                         .success(function (res) {
            //                             $scope.transactionCount(res, 4);
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //                 } else {
            //                     if ($scope.dealer_city.length) {
            //                         for (var i = 0; i < $scope.dealer_city.length; i++) {
            //
            //                             if ($scope.dealer_city[i]._id != filter._id) {
            //                                 dealerSearchObj.searchRegion.push($scope.dealer_city[i]._id)
            //                             }
            //                         }
            //
            //                         $http.post("/dash/stores", dealerSearchObj)
            //                             .success(function (response) {
            //                                 // console.log(response)
            //                                 $scope.multipleUsers(response, 'City');
            //                                 // $scope.transactionCount(response.length, 4);
            //                                 // $scope.renderStoreMap(response);
            //
            //                             }).error(function(error, status){
            //                             console.log(error, status);
            //                             if(status >= 400 && status < 404)
            //                                 $window.location.href = '/404';
            //                             else if(status >= 500)
            //                                 $window.location.href = '/500';
            //                             else
            //                                 $window.location.href = '/404';
            //                         });
            //                         $http.post("/dash/stores/count", dealerSearchObj)
            //                             .success(function (res) {
            //                                 $scope.transactionCount(res, 4);
            //                             }).error(function(error, status){
            //                             console.log(error, status);
            //                             if(status >= 400 && status < 404)
            //                                 $window.location.href = '/404';
            //                             else if(status >= 500)
            //                                 $window.location.href = '/500';
            //                             else
            //                                 $window.location.href = '/404';
            //                         });
            //                     }
            //                 }
            //             }
            //
            //             $scope.viewLength = 0;
            //             $scope.newViewBy = viewBy.dealer;
            //         }
            //
            //
            //     }
            //
            // } else if(type =='area'){
            //
            //     if ($scope.dealerSelectAll.city) {
            //         if (dealerSearchObj.searchByArea.length) {
            //             if (filter.selected_area) {
            //                 dealerSearchObj.searchByArea = [];
            //                 dealerSearchObj.searchByArea.push(filter.selected_area)
            //
            //                 //.. Temp array..
            //                 // var new_array = [];
            //                 // for (var i = 0; i < dealerSearchObj.searchByArea.length; i++) {
            //                 //     console.log('i Loop')
            //                 //     //... Push all other cities...
            //                 //     if (filter._id != dealerSearchObj.searchByArea[i]) {
            //                 //
            //                 //         new_array.push(dealerSearchObj.searchByArea[i]);
            //                 //
            //                 //     }
            //                 // }
            //                 //... Replace the array..
            //                 // dealerSearchObj.searchByArea = new_array;
            //
            //                 if (dealerSearchObj.searchByArea.length) {
            //
            //                     $scope.fetchStoresByArea(dealerSearchObj);
            //
            //                 } else {
            //
            //                     $scope.fetchStoresByArea(dealerSearchObj);
            //                 }
            //
            //             } else {
            //                 for (var j = 0; j < dealerSearchObj.searchByArea.length; j++) {
            //                     // console.log('j Loop')
            //
            //                     if (filter._id == dealerSearchObj.searchByArea[j]) {
            //                         continue;
            //                     } else {
            //                         if (j == dealerSearchObj.searchByArea.length - 1) dealerSearchObj.searchByArea.push(filter._id);
            //                     }
            //                 }
            //                 $scope.fetchStoresByArea(dealerSearchObj);
            //             }
            //
            //         } else {
            //             if (!filter.selected_area) {
            //                 $scope.serviceClients = [];
            //
            //                 dealerSearchObj.dealerSelectAll = true;
            //                 dealerSearchObj.searchByArea.push(filter._id)
            //
            //                 $scope.fetchStoresByArea(dealerSearchObj);
            //
            //             } else {
            //
            //                 if ($scope.dealer_area.length) {
            //                     for (var i = 0; i < $scope.dealer_area.length; i++) {
            //
            //                         if ($scope.dealer_area[i]._id == filter.selected_area) {
            //                             dealerSearchObj.searchByArea.push($scope.dealer_area[i]._id)
            //                         }
            //                     }
            //                     $scope.showStoreFilter = true;
            //                     $scope.fetchStoresByArea(dealerSearchObj);
            //                 }
            //
            //             }
            //         }
            //     } else {
            //
            //         if (dealerSearchObj.searchByArea.length) {
            //
            //             if (!filter.selected_area) {
            //                 //.. Temp array..
            //                 var new_array = [];
            //                 for (var i = 0; i < dealerSearchObj.searchByArea.length; i++) {
            //                     // console.log('i Loop')
            //
            //                     if (filter.Area != dealerSearchObj.searchByArea[i]) {
            //
            //                         new_array.push(dealerSearchObj.searchByArea[i]);
            //
            //                     }
            //                 }
            //                 dealerSearchObj.searchByArea = new_array; //... Replace the array..
            //
            //                 if (dealerSearchObj.searchByArea.length) {
            //                     $http.post("/dash/stores", dealerSearchObj)
            //                         .success(function (response) {
            //                             $scope.multipleUsers(response, 'Area');
            //                             // $scope.transactionCount($scope.serviceClients.length, 4);
            //                             // $scope.renderStoreMap(response);
            //
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //                     $http.post("/dash/stores/count", dealerSearchObj)
            //                         .success(function (res) {
            //                             $scope.transactionCount(res, 4);
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //                 }
            //
            //             } else {
            //                 dealerSearchObj.searchByArea = [];
            //                 dealerSearchObj.searchByArea.push(filter.selected_area)
            //
            //                 // for (var j = 0; j < dealerSearchObj.searchByArea.length; j++) {
            //                 //     // console.log('j Loop')
            //                 //
            //                 //     if (filter.Area == dealerSearchObj.searchByArea[j]) {
            //                 //         continue;
            //                 //     } else {
            //                 //         if (j == dealerSearchObj.searchByArea.length - 1) dealerSearchObj.searchByArea.push(filter.Area);
            //                 //     }
            //                 // }
            //
            //                 $http.post("/dash/stores", dealerSearchObj)
            //                     .success(function (response) {
            //                         // console.log(response)
            //
            //                         $scope.multipleUsers(response, 'Area');
            //                         // $scope.transactionCount($scope.serviceClients.length, 4);
            //                         // $scope.renderStoreMap(response);
            //
            //                     });
            //
            //                 $http.post("/dash/stores/count", dealerSearchObj)
            //                     .success(function (res) {
            //                         $scope.transactionCount(res, 4);
            //                     });
            //             }
            //         } else {
            //
            //             if (filter.selected_area) {
            //                 $scope.serviceClients = [];
            //
            //                 dealerSearchObj.searchByArea.push(filter.selected_area);
            //                 console.log(dealerSearchObj)
            //
            //
            //                 $http.post("/dash/stores", dealerSearchObj)
            //                     .success(function (response) {
            //
            //                         $scope.multipleUsers(response, 'Area');
            //                         // $scope.renderStoreMap(response);
            //                         // $scope.transactionCount(response.length, 4);
            //                     }).error(function(error, status){
            //                     console.log(error, status);
            //                     if(status >= 400 && status < 404)
            //                         $window.location.href = '/404';
            //                     else if(status >= 500)
            //                         $window.location.href = '/500';
            //                     else
            //                         $window.location.href = '/404';
            //                 });
            //
            //                 $http.post("/dash/stores/count", dealerSearchObj)
            //                     .success(function (res) {
            //                         $scope.transactionCount(res, 4);
            //                     }).error(function(error, status){
            //                     console.log(error, status);
            //                     if(status >= 400 && status < 404)
            //                         $window.location.href = '/404';
            //                     else if(status >= 500)
            //                         $window.location.href = '/500';
            //                     else
            //                         $window.location.href = '/404';
            //                 });
            //             } else {
            //
            //                 if ($scope.dealer_area.length) {
            //                     for (var i = 0; i < $scope.dealer_area.length; i++) {
            //
            //                         if ($scope.dealer_area[i].Area != filter.Area) {
            //                             dealerSearchObj.searchByArea.push($scope.dealer_area[i].Area)
            //                         }
            //                     }
            //
            //                     $http.post("/dash/stores", dealerSearchObj)
            //                         .success(function (response) {
            //                             // console.log(response)
            //                             $scope.multipleUsers(response, 'Area');
            //                             // $scope.transactionCount(response.length, 4);
            //                             // $scope.renderStoreMap(response);
            //
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //
            //                     $http.post("/dash/stores/count", dealerSearchObj)
            //                         .success(function (res) {
            //                             $scope.transactionCount(res, 4);
            //                         }).error(function(error, status){
            //                         console.log(error, status);
            //                         if(status >= 400 && status < 404)
            //                             $window.location.href = '/404';
            //                         else if(status >= 500)
            //                             $window.location.href = '/500';
            //                         else
            //                             $window.location.href = '/404';
            //                     });
            //                 }
            //
            //             }
            //         }
            //
            //     }
            //
            // }
        };

        $scope.fetchStoresByCities =function(dealerSearchObj){
            $http.post("/dash/stores", dealerSearchObj)
                .success(function (response) {
                    $scope.multipleUsers(response, 'City');
                    $http.post("/dash/stores/count", dealerSearchObj)
                        .success(function (res) {
                            $scope.transactionCount(res, 4);
                        }).error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
                    $scope.getAllStoreAreas(false, 'area');
                });
        }

        $scope.fetchStoresByArea =function(dealerSearchObj){
            $http.post("/dash/stores", dealerSearchObj)
                .success(function (response) {
                    $scope.multipleUsers(response, 'Area');
                    $http.post("/dash/stores/count", dealerSearchObj)
                        .success(function (res) {
                            $scope.transactionCount(res, 4);
                        }).error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
                });
        }


        $scope.phoneNoValidate = function(tab ,flag,temp,type){
            $scope.validateDealerphone = false;


            switch(tab){
                /*customer tab*/
                case 0: {

                    if (flag != true) {
                        var body = {
                            phone: temp
                        };
                        $http.post("/dash/enquiry/validate/phone", body).success(function (res) {

                            if(type != 'edit'){
                                if(temp){
                                    if(res.length){
                                        $scope.validateDealerphone = true;
                                    }else{
                                        $scope.validateDealerphone = false;
                                    }
                                }else{
                                    $scope.validateDealerphone = false;
                                }

                            }else if(type == 'edit') {
                                if (temp != $scope.oldPhoneNo && temp) {
                                    if (res.length) {
                                        $scope.validateDealerphone = true;
                                    } else {
                                        $scope.validateDealerphone = false;
                                    }
                                } else {
                                    $scope.validateDealerphone = false;
                                }
                            }

                        }).error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                    }
                    break;
                }


            }

        };

        //add Dealer auto fill address
        $scope.addNewDealerAddress = function () {
            var input = document.getElementById('address');
            var editDealerAddress_autocomplete = new google.maps.places.Autocomplete(input);

            editDealerAddress_autocomplete.addListener('place_changed', function () {
                var newplace = editDealerAddress_autocomplete.getPlace();
                var lat=newplace.geometry.location.lat();
                var long = newplace.geometry.location.lng();
                for(var i=0; i<newplace.address_components.length; i++){
                    if(newplace.address_components[i].types[0]=="locality"){
                        var jcity = newplace.address_components[i].long_name;
                        var jaddress= newplace.formatted_address;
                    }
                    if(newplace.address_components[i].types[1]=="sublocality")
                        var jarea = newplace.address_components[i].long_name;
                    if(newplace.address_components[i].types[0] == "postal_code")
                        var jpostalCode = newplace.address_components[i].long_name;
                    if(newplace.address_components[i].types[0] == 'administrative_area_level_1')
                        var jstate = newplace.address_components[i].long_name;
                    if(newplace.address_components[i].types[0] == 'country')
                        var jcountry = newplace.address_components[i].long_name;
                }

                var scope = angular.element(document.getElementById('address')).scope();
                scope.dealer.City = jcity;
                scope.dealer.Area = jarea;
                scope.dealer.State = jstate;
                scope.dealer.Country = jcountry;
                scope.dealer.Pincode = jpostalCode;
                scope.dealer.Address = jaddress;
                scope.dealer.latitude = lat;
                scope.dealer.longitude = long;

                $('#newDealerArea').val(jarea);
                $('#newDealerCity').val(jcity);
                $('#newDealerPincode').val(jpostalCode);

                var latlng = new google.maps.LatLng(lat, long);
                var mapCanvas = document.getElementById("customerAddMap");
                var mapOptions = {center: latlng, zoom: 15};
                var map = new google.maps.Map(mapCanvas, mapOptions);
                var marker = new google.maps.Marker({position:latlng});
                marker.setMap(map);
            })
        };

        $scope.appendImageToStore = function(type, operation, index){
            /*
             Function to upload or remove an image of customer or customer document while adding it from portal

             type = Customer image or customer document image
             operation = add or remove an image
             index = used while removing an image from array

             */
            if(operation == 'add'){
                var image = ( (type == 'store') ? (document.getElementById('newStoresImage').files) : (document.getElementById('newStoreDocumentImage').files) );
                if(image[0]){
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var tempObj = {};
                        tempObj.Dealercode = (($scope.storesDisp) ? $scope.storesDisp.Dealercode : $scope.dealer.Dealercode);
                        tempObj.image = reader.result;
                        tempObj.date = new Date()+"";
                        tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                        tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);

                        if(type == 'store'){
                            tempObj.name = image[0].name ? image[0].name : "Customer Image";
                            $scope.newStoreImageArray.customerImage.push(tempObj);
                        }
                        else if(type == 'doc'){
                            tempObj.name = image[0].name ? image[0].name : "Document Image";
                            $scope.newStoreImageArray.customerDoc.push(tempObj)
                        }

                        // if($scope.itemsDisp.cloudinary){
                        //     if($scope.itemsDisp.cloudinaryURL.length > 0){
                        //         for(var i=0; i< $scope.itemsDisp.cloudinaryURL.length; i++){
                        //             imageObj.push($scope.itemsDisp.cloudinaryURL[0]);
                        //         }
                        //     }
                        // }
                        jQuery.noConflict();
                        $('#newStoresImage').val(null);
                        $('#newStoreDocumentImage').val(null);

                        jQuery.noConflict();
                        $scope.$apply();
                    }
                    reader.readAsDataURL(image[0]);
                }
                else{
                    Settings.failurePopup('Error',"Please select an image");

                    // bootbox.alert({
                    //     title : "ERROR",
                    //     message : "Please select an image",
                    //     className : "text-center"
                    // })
                }
            }
            else if(operation == 'del'){
                if(type == 'store'){
                    for(var i=0; i< $scope.newStoreImageArray.customerImage.length ; i++){
                        if(i == index){
                            $scope.newStoreImageArray.customerImage.splice(index, 1);
                        }
                    }
                }
                else if(type == 'doc'){
                    for(var i=0; i< $scope.newStoreImageArray.customerDoc.length ; i++){
                        if(i == index){
                            $scope.newStoreImageArray.customerDoc.splice(index, 1);
                        }
                    }
                }
            }


        }

        $scope.addDealer = function (flag) {
            $scope.disableFlag = true;


            $scope.dealer.Phone = Number($scope.dealer.Phone) ;
            if($scope.pinCodeMadatory){
                if($scope.dealer.DealerName && $scope.dealer.Phone && $scope.dealer.Pincode){
                    if ($scope.applicationType == 'StoreJini'){
                        $scope.dealer.SellerName = $scope.user.username;
                        $scope.dealer.Seller = $scope.dealer.Seller ? Number($scope.dealer.Seller) : $scope.user.sellerphone;
                        $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : "";
                        $scope.dealer.STOCKISTS = $scope.dealer.STOCKISTS ? Number($scope.dealer.STOCKISTS) : "";
                        $scope.dealer.cloudinaryURL = ($scope.newStoreImageArray.customerImage.length > 0) ? $scope.newStoreImageArray.customerImage : [];
                        $scope.dealer.doccloudinaryURL = ($scope.newStoreImageArray.customerDoc.length > 0) ? $scope.newStoreImageArray.customerDoc : [];
                        $scope.dealer.enquiry = $scope.enquiry;
                        $scope.dealer.customerType = "lead";
                        $scope.dealer.addedBy = $scope.user.username;
                        $scope.dealer.branchCode = parseInt($scope.EnquiryBranch.branchSelectedForEnquiry);
                        $scope.dealer.date_added = $scope.formatFullDealerDate(new Date());
                        $scope.dealer.Dealercode = $scope.dealer.Dealercode != '' ? $scope.dealer.Dealercode : '';
                        $scope.dealer.DealerID = $scope.dealer.Dealercode != '' ? $scope.dealer.Dealercode : '';
                        $scope.dealer.dob = $scope.formatYYMMDDrDate($scope.dealer.dob) ;
                        $scope.dealer.anniversary = $scope.formatYYMMDDrDate($scope.dealer.anniversary);
                        $scope.dealer.DealerName = $scope.dealer.DealerName.substr(0,1).toUpperCase() + $scope.dealer.DealerName.substr(1);

                        $scope.postNewDealer();
                    }
                    else{
                        if(!$scope.validateDealerphone){
                            $http.get("/dash/get/recentID/"+$scope.dealer.Dealercode).success(function(result){
                                if(result !=""){
                                    console.log("not unique");
                                    $scope.dealercodeUnique = "";
                                } else {
                                    console.log("--------unique dealercode-------");
                                    $scope.dealercodeUnique = "unique";
                                }
                                if($scope.dealercodeUnique == "unique"){

                                    if($scope.dealer.countryCode && $scope.dealer.countryCode != '+91'){
                                        $scope.dealer.Phone = Number($scope.dealer.countryCode + $scope.dealer.Phone);
                                    }

                                    $scope.dealer.Dealercode = $scope.dealer.Dealercode != '' ? $scope.dealer.Dealercode : '';
                                    var dealercodes = $scope.dealer.Dealercode;
                                    if (isNaN(dealercodes)) {
                                        console.log(dealercodes);
                                    } else {
                                        $scope.dealer.Dealercode = parseInt($scope.dealer.Dealercode);
                                        console.log($scope.dealer.Dealercode);
                                    }
                                    $scope.dealer.DealerName = $scope.dealer.DealerName.substr(0,1).toUpperCase() + $scope.dealer.DealerName.substr(1);
                                    // $scope.dealer.Seller = $scope.dealer.Seller ? Number($scope.dealer.Seller) : '';

                                    if($scope.dealer.salesPerson){
                                        $scope.dealer.Seller = $scope.dealer.salesPerson.sellerphone ? Number($scope.dealer.salesPerson.sellerphone) : '' ;
                                        $scope.dealer.SellerName =  $scope.dealer.salesPerson.sellername ? $scope.dealer.salesPerson.sellername : '' ;
                                    }
                                    else{
                                        $scope.dealer.Seller = $scope.user.sellerphone ? Number($scope.user.sellerphone) : '' ;
                                        $scope.dealer.SellerName =  $scope.user.username ? $scope.user.username : '' ;
                                    }
                                    $scope.dealer.class = $scope.dealer.class ? $scope.dealer.class : '';
                                    $scope.dealer.addedBy = $scope.user.sellerphone ? Number($scope.user.sellerphone) : '' ;

                                    $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : null;
                                    $scope.dealer.STOCKISTS = $scope.dealer.STOCKISTS ? Number($scope.dealer.STOCKISTS) : null;
                                    $scope.dealer.cloudinaryURL = ($scope.newStoreImageArray.customerImage.length > 0) ? $scope.newStoreImageArray.customerImage : [];
                                    $scope.dealer.doccloudinaryURL = ($scope.newStoreImageArray.customerDoc.length > 0) ? $scope.newStoreImageArray.customerDoc : [];
                                    $scope.dealer.customerType = "Lead";

                                    if(flag){
                                        $scope.postNewDealer('pos');

                                    }else{
                                        $scope.postNewDealer();
                                    }
                                }
                                else if(result[0]!= undefined){
                                    if($scope.Dealercodetemp==undefined){
                                        $scope.Dealercodetemp = 1001;
                                    }
                                    $scope.disableFlag = false;
                                    Settings.failurePopup('Error',"This Customer code already exists. Please use Customer code : "+$scope.Dealercodetemp);
                                    // bootbox.alert({
                                    //     title : 'ERROR',
                                    //     message : 'This Dealerecode already exists. Please use Dealercode : '+$scope.Dealercodetemp,
                                    //     className : 'text-center'
                                    // })
                                }
                            }).error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
                        }else{
                            $scope.disableFlag = false;
                            Settings.failurePopup('Error','This Phone number already exists.');
                        }

                    }
                }
                else if ($scope.dealer.Phone == undefined) {
                    $scope.disableFlag = false;
                    Settings.failurePopup('Error','Please enter a valid phone number');
                } else{
                    $scope.disableFlag = false;
                    Settings.failurePopup('Error','Please enter all mandatory details');
                }

            }else{
                if($scope.dealer.DealerName && $scope.dealer.Phone){
                    if ($scope.applicationType == 'StoreJini'){
                        $scope.dealer.SellerName = $scope.user.username;
                        $scope.dealer.Seller = $scope.dealer.Seller ? Number($scope.dealer.Seller) : $scope.user.sellerphone;
                        $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : "";
                        $scope.dealer.STOCKISTS = $scope.dealer.STOCKISTS ? Number($scope.dealer.STOCKISTS) : "";
                        $scope.dealer.cloudinaryURL = ($scope.newStoreImageArray.customerImage.length > 0) ? $scope.newStoreImageArray.customerImage : [];
                        $scope.dealer.doccloudinaryURL = ($scope.newStoreImageArray.customerDoc.length > 0) ? $scope.newStoreImageArray.customerDoc : [];
                        $scope.dealer.enquiry = $scope.enquiry;
                        $scope.dealer.customerType = "lead";
                        $scope.dealer.addedBy = $scope.user.username;
                        $scope.dealer.branchCode = parseInt($scope.EnquiryBranch.branchSelectedForEnquiry);
                        $scope.dealer.date_added = $scope.formatFullDealerDate(new Date());
                        $scope.dealer.Dealercode = $scope.dealer.Dealercode != '' ? $scope.dealer.Dealercode : '';
                        $scope.dealer.DealerID = $scope.dealer.Dealercode != '' ? $scope.dealer.Dealercode : '';
                        $scope.dealer.dob = $scope.formatYYMMDDrDate($scope.dealer.dob) ;
                        $scope.dealer.anniversary = $scope.formatYYMMDDrDate($scope.dealer.anniversary);
                        $scope.dealer.DealerName = $scope.dealer.DealerName.substr(0,1).toUpperCase() + $scope.dealer.DealerName.substr(1);

                        $scope.postNewDealer();
                    }
                    else{
                        if(!$scope.validateDealerphone){
                            $http.get("/dash/get/recentID/"+$scope.dealer.Dealercode).success(function(result){
                                if(result !=""){
                                    console.log("not unique");
                                    $scope.dealercodeUnique = "";
                                } else {
                                    console.log("--------unique dealercode-------");
                                    $scope.dealercodeUnique = "unique";
                                }
                                if($scope.dealercodeUnique == "unique"){

                                    if($scope.dealer.countryCode && $scope.dealer.countryCode != '+91'){
                                        $scope.dealer.Phone = Number($scope.dealer.countryCode + $scope.dealer.Phone);
                                    }

                                    $scope.dealer.Dealercode = $scope.dealer.Dealercode != '' ? $scope.dealer.Dealercode : '';
                                    var dealercodes = $scope.dealer.Dealercode;
                                    if (isNaN(dealercodes)) {
                                        console.log(dealercodes);
                                    } else {
                                        $scope.dealer.Dealercode = parseInt($scope.dealer.Dealercode);
                                        console.log($scope.dealer.Dealercode);
                                    }
                                    $scope.dealer.DealerName = $scope.dealer.DealerName.substr(0,1).toUpperCase() + $scope.dealer.DealerName.substr(1);
                                    // $scope.dealer.Seller = $scope.dealer.Seller ? Number($scope.dealer.Seller) : '';
                                    if($scope.dealer.salesPerson){
                                        $scope.dealer.Seller = $scope.dealer.salesPerson.sellerphone ? Number($scope.dealer.salesPerson.sellerphone) : '' ;
                                        $scope.dealer.SellerName =  $scope.dealer.salesPerson.sellername ? $scope.dealer.salesPerson.sellername : '' ;
                                    }
                                    else{
                                        $scope.dealer.Seller = $scope.user.sellerphone ? Number($scope.user.sellerphone) : '' ;
                                        $scope.dealer.SellerName =  $scope.user.username ? $scope.user.username : '' ;
                                    }

                                    $scope.dealer.addedBy = $scope.user.sellerphone ? Number($scope.user.sellerphone) : '' ;
                                    $scope.dealer.class = $scope.dealer.class ? $scope.dealer.class : '';

                                    $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : null;
                                    $scope.dealer.STOCKISTS = $scope.dealer.STOCKISTS ? Number($scope.dealer.STOCKISTS) : null;
                                    $scope.dealer.cloudinaryURL = ($scope.newStoreImageArray.customerImage.length > 0) ? $scope.newStoreImageArray.customerImage : [];
                                    $scope.dealer.doccloudinaryURL = ($scope.newStoreImageArray.customerDoc.length > 0) ? $scope.newStoreImageArray.customerDoc : [];
                                    $scope.dealer.customerType = "Lead";
                                    if(flag){
                                        $scope.postNewDealer('pos');

                                    }else{
                                        $scope.postNewDealer();
                                    }
                                }
                                else if(result[0]!= undefined){
                                    if($scope.Dealercodetemp==undefined){
                                        $scope.Dealercodetemp = 1001;
                                    }
                                    $scope.disableFlag = false;
                                    Settings.failurePopup('Error',"This Customer code already exists. Please use Customer code :"+$scope.Dealercodetemp);
                                }
                            }).error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
                        }else{
                            $scope.disableFlag = false;
                            Settings.failurePopup('Error','This Phone number already exists.');
                        }
                    }
                }
                else if ($scope.dealer.Phone == undefined) {
                    $scope.disableFlag = false;
                    Settings.failurePopup('Error','Please enter a valid phone number');
                } else{
                    $scope.disableFlag = false;
                    Settings.failurePopup('Error','Please enter all mandatory details');
                }
            }
        };



        $scope.postNewDealer = function(flag){

            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            $http.post("/dash/stores/add/new", $scope.dealer)
                .success(function (res) {
                    //console.log(res);

                    if (!res.imageStatus) {
                        Settings.failurePopup('Error','Your image data could not be uploaded');
                    }

                    if(!flag){
                        Settings.successPopup('Success',$scope.dealer.DealerName+' successfully added.')
                    }

                    $scope.dealerAddPage = false;

                    $scope.dealer = {};
                    $scope.dealer.email = '';
                    $scope.showStockist = false;
                    $scope.showSalesperson = false;
                    $scope.newStoreImageArray = {};
                    $scope.newStoreImageArray.customerImage = [];
                    $scope.newStoreImageArray.customerDoc = [];

                    setTimeout(function () {
                        $('.refresh').css("display", "none");
                    }, 1000);

                    $scope.refreshTransactions(4);

                })

        };

        $scope.refreshTransactions = function(tab){
            $scope.displayDealerRefresh = false;

            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            $scope.clearFilter(4);

            setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 2000);
        };

        $scope.ChangeCustomerType=function(data){
            if(data){
                $scope.editedDealer.customerType='';
            }

        }




        //new dealer address is blank, city and area also black
        $scope.empty = function(type){

            if(type == 'new'){
                if($scope.dealer.Address  == "" || $scope.dealer.Address == undefined) {
                    $('#newDealerArea').val('');
                    $('#newDealerCity').val('');
                    $('#newDealerPincode').val('');

                    $scope.dealer.Area="";
                    $scope.dealer.City="";
                    $scope.dealer.State="";
                    $scope.dealer.Country="";
                    $scope.dealer.Pincode="";
                    $scope.dealer.latitude = "";
                    $scope.dealer.longitude = "";
                    console.log($scope.dealer)
                }
            }
            if(type == 'edit'){
                if($scope.editedDealer.Address  == "" || $scope.editedDealer.Address == undefined) {
                    $('#editDealerArea').val('');
                    $('#editDealerCity').val('');
                    $('#editDealerPincode').val('');

                    $scope.editedDealer.Area = "";
                    $scope.editedDealer.City = "";
                    $scope.editedDealer.State = "";
                    $scope.editedDealer.Country = "";
                    $scope.editedDealer.Pincode = "";
                    $scope.editedDealer.latitude = "";
                    $scope.editedDealer.longitude = "";
                }
            }

        }

        $scope.notEmptyOrNull = function(item){
            return !(item._id === null || item._id.trim().length === 0)
        };

        //Edit Dealer Details


        $scope.dealerFilterBy = function(){
            $scope.dealerfilterFlag = !$scope.dealerfilterFlag;
        };

        $scope.assignNewSeller = function(seller,type){
            if(type == 'new'){
                if($scope.editedDealer.assignedSellers.indexOf(seller.sellerphone) == -1){
                    $scope.editedDealer.assignedSellers.push(seller.sellerphone);
                    $scope.storesDisp.salesPerson = '';
                }else{
                    Settings.alertPopup('Error',"Salesperson Already assigned");
                }

            } else if(type == 'remove'){
                $scope.editedDealer.assignedSellers.splice(seller,1);
            }
        };

        $scope.assignNewStockist = function(user,type){
            if(type == 'new'){

                if($scope.editedDealer.assignedStockist.indexOf(user.Stockist) == -1){
                    if($scope.editedDealer.newStockist.length){
                        if($scope.editedDealer.newStockist.indexOf(user.Stockist) == -1){
                            $scope.editedDealer.newStockist.push(user.Stockist);
                            $scope.storesDisp.Stockist = '';
                        }
                        else{
                            Settings.alertPopup('Error',"Stockist Already assigned");
                        }
                    }
                    else{
                        $scope.editedDealer.newStockist.push(user.Stockist);
                        $scope.storesDisp.stockist = '';
                    }

                }else{
                    Settings.alertPopup('Error',"Stockist Already assigned");

                }
            } else if(type == 'remove'){
                $scope.editedDealer.newStockist.splice(user,1);
            }
        };

        $scope.removeDealerImage = function(index){
            $scope.editedDealer.cloudinaryURL.splice(index,1);
            console.log(index);

        };

        $scope.uploadStoreImage = function(type){

            if(type == 'img'){
                var image = document.getElementById('uploadStoreImage').files;

                if(image.length){
                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");

                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var tempObj = {};
                        tempObj.Dealercode = (($scope.storesDisp) ? $scope.storesDisp.Dealercode : $scope.dealer.Dealercode);
                        tempObj.image = reader.result;
                        tempObj.date_added = new Date() + "" ;
                        tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                        tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);

                        var imageObj = [];

                        if ($scope.storesDisp.cloudinaryURL) {
                            if ($scope.storesDisp.cloudinaryURL.length > 0) {
                                for (var i = 0; i < $scope.storesDisp.cloudinaryURL.length; i++) {
                                    imageObj.push($scope.storesDisp.cloudinaryURL[i]);
                                }
                            }
                        }
                        var type = 'img' ;
                        imageObj.push(tempObj);
                        $http.put("/dash/stores/image/upload/"+type, imageObj)
                            .success(function (res) {
                                console.log("res is :");
                                console.log(res);

                                setTimeout(function () {
                                    $('.refresh').css("display", "none");
                                }, 500);

                                if (res) {

                                    $scope.storesDisp.cloudinaryURL = res;
                                    // bootbox.alert({
                                    //     title: 'SUCCESS',
                                    //     message: 'Successfully uploaded image.',
                                    //     className: 'text-center'
                                    // })
                                    toastr.success('Successfully uploaded image.')
                                    jQuery.noConflict();
                                    $('#uploadStoreImage').val(null);
                                    $('#upload-storeImage').css("display", "none");
                                    $('#upload-storeButton').css("display", "none");
                                }
                                else {
                                    bootbox.alert({
                                        title: 'ERROR',
                                        message: 'Failed to upload. Please try after sometime.',
                                        className: 'text-center'
                                    })
                                }
                            }).error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                    }
                    reader.readAsDataURL(image[0]);
                }

            }
            if(type == 'doc'){
                var image = document.getElementById('uploadStoreDoc').files;

                if(image.length){
                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");

                    var reader = new FileReader();
                    reader.onloadend = function () {
                        var tempObj = {};
                        tempObj.Dealercode = (($scope.storesDisp) ? $scope.storesDisp.Dealercode : $scope.dealer.Dealercode);
                        tempObj.image = reader.result;
                        tempObj.date_added = new Date() + "" ;
                        tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                        tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);
                        tempObj.type = 'doc';

                        var imageObj = [];

                        if ($scope.storesDisp.doccloudinaryURL) {
                            if ($scope.storesDisp.doccloudinaryURL.length > 0) {
                                for (var i = 0; i < $scope.storesDisp.doccloudinaryURL.length; i++) {
                                    imageObj.push($scope.storesDisp.doccloudinaryURL[i]);
                                }
                            }
                        }

                        var type = 'doc' ;
                        imageObj.push(tempObj);
                        $http.put("/dash/stores/image/upload/"+type, imageObj)
                            .success(function (res) {
                                console.log("res is :");
                                console.log(res);

                                setTimeout(function () {
                                    $('.refresh').css("display", "none");
                                }, 500);

                                if (res) {

                                    $scope.storesDisp.doccloudinaryURL = res;
                                    toastr.success('Successfully uploaded image.')
                                    jQuery.noConflict();
                                    $('#uploadStoreDoc').val(null);
                                    $('#upload-storeDoc').css("display", "none");
                                    $('#upload-storeDocButton').css("display", "none");
                                }
                                else {
                                    bootbox.alert({
                                        title: 'ERROR',
                                        message: 'Failed to upload. Please try after sometime.',
                                        className: 'text-center'
                                    })
                                }
                            }).error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                    }
                    reader.readAsDataURL(image[0]);
                }

            }
        }

        $scope.submitComments=function(dealer){
            if(dealer){

                var dealerId=dealer.Dealercode;
                var comments = {comment: '', username: '', userphone: '', date: ''};
                comments.comment=dealer.newcomments;
                if($scope.user.sellerObject){
                    comments.userphone=$scope.user.sellerObject.sellerphone;
                    comments.username=$scope.user.sellerObject.sellername;

                }
                else{
                    comments.userphone=0;
                    comments.username='Portal';
                }

                comments.date=new Date();
                var date = 	comments.date;
                comments.date = [date.getFullYear(),(date.getMonth()+1).padLeft(), date.getDate().padLeft() ].join('-') + ' '
                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join (':');
            }

            $http.put("/dash/store/comments/add/"+dealerId, comments).success(function (res) {
                if(res){
                    $scope.editedDealer.comments.push(comments);
                    $scope.editedDealer.newcomments='';
                }
            }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
        }


        $scope.submitLeadStatus=function(dealer){
            if(dealer) {
                if (dealer.leadstatus && dealer.leadDate) {
                    var dealerId = dealer.Dealercode;
                    var leadStatusWithFollowup = {leadstatus: '', leadDate: ''};
                    leadStatusWithFollowup.leadstatus = dealer.leadstatus;
                    leadStatusWithFollowup.leadDate = dealer.leadDate;
                    var date = leadStatusWithFollowup.leadDate;
                    leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                    leadStatusWithFollowup.dealerId = dealer.Dealercode;
                    if ($scope.user.sellerObject) {
                        leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                        leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                    } else {
                        leadStatusWithFollowup.userphone = 0;
                        leadStatusWithFollowup.username = 'Portal';
                    }

                    leadStatusWithFollowup.dateAdded = new Date();
                    var date = leadStatusWithFollowup.dateAdded;
                    leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');

                    //comments part
                    var comments = {comment: '', username: '', userphone: '', date: ''};
                    comments.comment = dealer.newcomments;
                    if ($scope.user.sellerObject) {
                        comments.userphone = $scope.user.sellerObject.sellerphone;
                        comments.username = $scope.user.sellerObject.sellername;

                    } else {
                        comments.userphone = 0;
                        comments.username = 'Portal';
                    }

                    comments.date = new Date();
                    var date = comments.date;
                    comments.date = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');

                    leadStatusWithFollowup.comments = comments;

                    $http.post("/dash/store/lead/followup/add/" + dealerId, leadStatusWithFollowup).success(function (res) {
                        if (res) {
                            $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
                            $scope.editedDealer.leadstatus = '';
                            $scope.dealer.leadstatus = '';
                            $scope.editedDealer.leadDate = '';
                            // $scope.editDealer.newcomments = '';
                        }
                    }).error(function (error, status) {
                        console.log(error, status);
                        if (status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if (status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
                }else{
                    var dealerId=dealer.Dealercode;
                    var comments = {comment: '', username: '', userphone: '', date: ''};
                    comments.comment=dealer.newcomments;
                    if($scope.user.sellerObject){
                        comments.userphone=$scope.user.sellerObject.sellerphone;
                        comments.username=$scope.user.sellerObject.sellername;

                    }
                    else{
                        comments.userphone=0;
                        comments.username='Portal';
                    }

                    comments.date=new Date();
                    var date = 	comments.date;
                    comments.date = [date.getFullYear(),(date.getMonth()+1).padLeft(), date.getDate().padLeft() ].join('-') + ' '
                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join (':');
                }

                $http.put("/dash/store/comments/add/"+dealerId, comments).success(function (res) {
                    if(res){
                        $scope.editedDealer.comments.push(comments);
                        $scope.editedDealer.newcomments='';
                    }
                }).error(function(error, status){
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
        $scope.addGroup =  function(){
            $scope.class.name = '';
            $scope.class.priceList = 'master';
        }

        $scope.addDealerClass = function(data){
            if(data.name){
                if($scope.dealerClasses.length){
                    var found = false;
                    for(var i = 0; i < $scope.dealerClasses.length; i++) {
                        if ($scope.dealerClasses[i].name.toUpperCase() == data.name.toUpperCase()) {
                            found = true;
                            break;
                        }
                    }
                    if(found){
                        Settings.failurePopup('ERROR',"Class name already exist!");
                    }
                    else{
                        postData();
                    }
                }
                else{
                    postData();
                }
                function postData(){
                    var temp = $scope.dealerClasses ;

                    temp[temp.length] = {
                        name : data.name,
                        priceList : data.priceList
                    };

                    $http.put("/dash/settings/dealer/class", temp)
                        .success(function(res){
                            //console.log(res);
                            Settings.success_toast('SUCCESS', "Class Added Successfully!")
                            $scope.dealerClasses = res ;
                            Settings.setInstanceDetails('dealerClass', $scope.dealerClasses)
                            $scope.class = {};
                            $scope.class.priceList = 'master';
                        })
                }
            }
            else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }
        }

        $scope.changeDealerPricelist = function(data,index){
            var temp = $scope.dealerClasses ;

            temp[index] = {
                name : data.name,
                priceList : data.priceList
            };

            $http.put("/dash/settings/dealer/class", temp)
                .success(function(res){
                    //console.log(res);
                    $scope.dealerClasses = res ;
                    $scope.priceListName = [] ;
                    function onlyUnique(value, index, self) {
                        return self.indexOf(value) === index;
                    }
                    for(var i =0 ; i< $scope.dealerClasses.length;i++){
                        $scope.priceListName.push($scope.dealerClasses[i].priceList)
                    }
                    var unique = $scope.priceListName.filter( onlyUnique );
                    $scope.priceListName = unique ;
                    // console.log($scope.priceListName)
                    Settings.success_toast('SUCCESS', "Class Updated Successfully!")
                })

        }

        $scope.removeDealerPricelist = function(index){
            var temp = $scope.dealerClasses ;
            temp.splice(index,1)
            $http.put("/dash/settings/dealer/class", temp)
                .success(function(res){
                    //console.log(res);
                    $scope.dealerClasses = res ;
                    Settings.setInstanceDetails('dealerClass', $scope.dealerClasses)
                    Settings.success_toast('SUCCESS', "Class Removed Successfully!")
                })

        }

        if($location.search().type){
            document.getElementById("leadButton").click();
            // dealerSearchObj.searchBycustomertype='Lead';
            // $scope.customerType='lead';
            // $scope.refreshTransactions();
        }

        $http.post("/dash/stores", dealerSearchObj)
            .success(function (res) {
                console.log("res",res);
                $scope.renderServiceClients(res);
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });




        $http.post("/dash/stores/count", dealerSearchObj)
            .success(function(res){
                $scope.transactionCount(res,4);
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });


        $scope.getShopifyStores = function(){
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            $http.get("/dash/shopify/pull/customers")
                .success(function (response) {
                    console.log("Shopify Stores Updation initiated")
                    console.log(response);

                    setTimeout(function(){
                        $('.refresh').css("display", "none");
                    }, 2000);

                    if(response == true){

                        Settings.success_toast('SUCCESS',"Shopify Stores will be synced in the background");
                    }
                    else{
                        Settings.failurePopup('ERROR',"Dealers importing failed, Check the credentials and try again");
                    }
                })
                .error(function (error){
                    setTimeout(function(){
                        $('.refresh').css("display", "none");
                    }, 2000);
                    console.log(error);
                    Settings.failurePopup('ERROR',"Stores importing failed");
                })
        }


        $scope.testFunc = function(){
            let date = new Date();
            let timestamp = date.getTime();
            let itemcode = Math.random().toString();
            let data = 'folder=438771969832161/test&public_id='+itemcode+'&timestamp='+timestamp+'AqgtFMvxFtupraWrUyUr8mFS-HQ'
            let hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
            console.log(hash)
        }
        var api_timeout = 600000;
        $scope.exportCustomer = function () {
            var request_object = {
                url : "/dash/csv/stores/download/"+$scope.filter.sales+"/"+$scope.filter.branch,
                method : "GET",
                timeout : api_timeout,
            };

            $http(request_object)
                .success(function(response) {
                    console.log(response);
                    downloadcustomer(response);
                })



        }

        function downloadcustomer(arg) {
            var result = arg.result



            console.log('headers',Object.keys(result[0]))

            var headerLeadsource = true;
            var headerRevenueAmount = true;
            var headerComment = true;
            var headerCountryCode = true;
            var headerLeadstatus = true;
            var headerPincode = true;
            var headercustomerType = true;
            var headerChangedToCustomer = true;
            var headercreatedDate = true;

            var Pincode = 'Pincode';
            var customerType = 'customerType';
            var countryCode = 'countryCode';
            var leadDate = 'leadDate';
            var leadstatus = 'leadstatus';
            var leadsource = 'leadsource';
            var revenueAmount = 'revenueAmount';
            var Stockists = 'Stockists';
            var comment = 'comment';
            var ChangedToCustomer = 'ChangedToCustomer';
            var createdDate = 'createdDate';

            var header = [];
            header = Object.keys(result[0])//get all key names for csv file

            header = header.filter(function( obj ) {
                return (obj !== '_id' && obj !== 'comments' && obj !== 'leadStatusWithFollowup');
            });


            // if( header.includes('multiple_stockist')){
            //     header.splice(10, 2);
            // }
            var output = header.join();			//makes it comma seperated heading
            //console.log("result",result)
            output += '\n'
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < header.length; j++) {
                    //console.log(header[j])
                    var temp = header[j];
                    /*console.log(temp)
                     console.log(result[i][temp])*/
                    try {
                        if (temp == 'Stockists') {
                            //  console.log("result[i][temp].length 2",result[i][temp].length);
                            if (result[i][temp]) {
                                if (result[i][temp].length) {
                                    var multi_stockist = [];
                                    for (var a = 0; a < result[i][temp].length; a++) {
                                        if (result[i][temp][a].StockistName && result[i][temp][a].Stockist) {
                                            var stockistData = result[i][temp][a].StockistName + '[' + result[i][temp][a].Stockist + ']'
                                            multi_stockist.push(stockistData);
                                        }
                                    }
                                    // console.log("header[10]",result[i],header[9]);
                                    result[i][temp] = multi_stockist;

                                }
                            }
                        }

                        if (temp == 'cloudinaryURL') {
                            if (result[i][temp] && result[i][temp].length) {
                                if (result[i][temp][0].image) {
                                    result[i][temp] = result[i][temp][0].image;
                                }
                            }
                        }

                        if (temp == 'doccloudinaryURL') {
                            if (result[i][temp].length) {
                                if (result[i][temp][0].image) {
                                    result[i][temp] = result[i][temp][0].image;
                                }
                            }
                        }
                        if (result[i][temp] == undefined || result[i][temp] == 'undefined' || !result[i][temp]) { //undefined
                            result[i][temp] = ' '
                        }
                        if ((result[i][temp]).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + result[i][temp] + '"'
                            result[i][temp] = quotesWrapped
                        }
                        if ((result[i][temp]).toString().indexOf('\n') != -1) {
                            var quotesWrapped = result[i][temp].replace('\n', ' ');
                            result[i][temp] = quotesWrapped
                        }
                        if ((result[i][temp]).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i][temp].replace('\t', ' ');
                            result[i][temp] = quotesWrapped
                        }
                        if (result[i].customerType == 'Lead') {
                            result[i].customerType = result[i].customerType;
                        } else {
                            result[i].customerType = 'Customer'
                        }
                        if (result[i].leadStatusWithFollowup && result[i].leadStatusWithFollowup.length) {
                            var last = result[i].leadStatusWithFollowup[result[i].leadStatusWithFollowup.length - 1];
                            result[i].leadstatus = last.leadstatus;
                        } else {
                            result[i].leadstatus = '';
                        }

                        if (result[i].leadStatusWithFollowup && result[i].leadStatusWithFollowup.length) {
                            var last = result[i].leadStatusWithFollowup[result[i].leadStatusWithFollowup.length - 1];
                            result[i].leadDate = formatdate(last.leadDate);
                        }

                        if (result[i].comments && result[i].comments.length) {
                            var last = result[i].comments[result[i].comments.length - 1];
                            result[i].comment = last.comment;
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    output += result[i][temp];
                    if (j < (header.length - 1))
                        output += ','
                }
                output += '\n';

            }
            var blob = new Blob([output], {type: "text/csv;charset=UTF-8"});
            console.log(blob);
            window.URL = window.webkitURL || window.URL;
            var url = window.URL.createObjectURL(blob);

            //console.log(url);
            //var data = output;

            var d = new Date();
            var anchor = angular.element('<a/>');
            var fileName = arg.fileName

            anchor.attr({
                href: url,
                target: '_blank',
                'Content-Type': 'application/json',
                download: fileName
            })[0].click();
        }


        setTimeout(function(){
            $('.refresh').css("display", "none");
        }, 2000);

        $scope.backToBrowserHistory = function() {
            $window.history.back();
        };
    });


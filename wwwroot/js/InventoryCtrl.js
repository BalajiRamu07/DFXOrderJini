/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')
    .controller("InventoryCtrl",function ($scope, $filter, $http, Settings, $modal, $window) {
        console.log("Hello From Inventory Controller .... !!!!");

        $scope.inventory = {};

        $scope.currency = Settings.getInstanceDetails('currency');

        $scope.inventorySearch = {};
        $scope.inventorySearch.filter = '';

        $scope.inventoryTransactionHistory = {};
        $scope.inventoryTransactionHistory.filter = '';


        /*.... Needs to be reviewed ....*/
        $scope.items15 = $scope.inventory;
        $scope.viewby = 10;
        $scope.totalItems = $scope.inventory.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = $scope.viewby;
        $scope.maxSize = 5;
        $scope.case15Length = $scope.inventory.length;


        $scope.stocksInventory = [];

        $scope.inventoryDealer = [];

        $scope.settings = {};

        $scope.itemInventoryDetails = [];
        $scope.showInventoryFilter = false;
        $scope.itemInventoryFilter = {};

        var initialViewBy = 60;
        //New Pagination variables
        $scope.viewLength = 0;
        $scope.newViewBy = 10;
        var viewBy = {};

        viewBy.inventoryTransactionHistory = 10;
        viewBy.items = 12;
        var inventoryTransactionObj =  {};
        var inventorySearchBy = ['location','Product','Category','itemCode','subCategory'];
        var inventoryTransactionHistorySearchBy = ['transaction_id','date_added','type'];

        var itemInventoryObj = {};
        var itemInventorySearchBy = ['transaction_id','date_added','type'];

        $scope.inventoryTransfer = {};
        $scope.interInventoryTransfer = [];
        $scope.interInventoryArray = [];
        
        $scope.interInventoryView = false;
        $scope.inventoryTransactionView = false;
        $scope.inventoryTransaction = [];

        $scope.selectedTab = 'miscellaneousReceipt';
        $scope.miscellaneousReceipt = {};

        $scope.receiveInventoryArray = [];
        $scope.transferInventoryArray = [];
        $scope.warehouseLocation = [];
        $scope.editWarehouseLocation = [];
        $scope.itemExistsInCatalog = false;
        $scope.editReceiveInventory = {};
        $scope.inventoryRecievePage = false ;
        $scope.inventoryTransferPage = false ;
        $scope.inventoryHistoryPage = false ;
        $scope.itemInventoryPage = false;
        // $scope.receiveInventoryView = false;
        $scope.filter = {};
        $scope.salesPersonflag = true;
        var user_details  = Settings.getUserInfo();
        $scope.userRole = user_details.role ? user_details.role : '';

        

        $('html, body').animate({scrollTop: '0px'}, 0);

        jQuery.noConflict();
        $('.refresh').css("display", "inline");

        var masterInventory = {};

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
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
            } else
                return 0;
        };

        const loadInventory = searchObj => {
            $http.post('/dash/inventory/view', searchObj)
                .then(inventory => {
                    $scope.inventory = inventory.data;
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

        const loadInventoryCount = searchObj => {
            $http.post('/dash/inventory/count', searchObj)
                .then(inventory => {
                    $scope.transactionCount(inventory.data, 37);
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

        $scope.renderInventory = function (response){
            // console.log('Inventory Refresh',response)
            $scope.inventory = [];
            $scope.assets = [];
            $scope.inventorySearch.filter = ''
            console.log("GET : Inventory --> ");
            $scope.filter.branchCode = '';
            $scope.filter.typeSelected = '';
            if(response.length < 10)
                $scope.totalInventoryDisplayed = response.length;

            if($scope.settings.invoice){
                var temp = [];
                for(var i=0; i< response.length; i++){
                    if(response[i].locationType == 'customer')
                        temp.push(response[i]);
                }
                $scope.inventory = temp;
                masterInventory = temp;
                $scope.inventory_rentalCount = temp.length;
            }else{
                inventoryObj.viewLength = 0;
                inventoryObj.viewBy =  initialViewBy;
                inventoryObj.searchFor = '';
                inventoryObj.searchBy = [];
                inventoryObj.filter = '';
                $scope.inventorySearch.filter = '';
                $scope.showInventoryFilter = false;
                // $scope.miscellaneousReceipt.location = 'All';
                //1s$scope.inventoryStatusSelect = 'all'

                jQuery.noConflict();
                $('.refresh').css("display", "inline");

                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            inventoryObj.searchFor = user_details.sellerObject.inventoryLocation+'';
                            inventoryObj.searchBy = ['location'];
                            $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;
                            // $scope.inventoryTransfer.from = user_details.sellerObject.inventoryLocation;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);
                            $scope.salesPersonflag = false;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);

                        }
                    }
                }

                $http.post('/dash/inventory/view',inventoryObj).success(function(res){
                    // console.log(res.length)
                    $scope.inventory = res;
                }).catch(function(err){
                    console.log(err)
                })


                $http.post('/dash/inventory/count',inventoryObj)
                    .success(function(response){
                        //console.log(response)
                        $scope.transactionCount(response,37)
                    });
                // $scope.inventory = response;
                $scope.items15 = $scope.inventory;
                $scope.viewby = 10;
                $scope.totalItems = $scope.inventory.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = $scope.viewby;
                $scope.maxSize = 5;
                $scope.case15Length = $scope.inventory.length;
                $scope.filterInventoryByLocation();

            }
            masterInventory = response;
            //$scope.loaded(13);
            if(response.length == 0){
                if($scope.uploadFiles){
                    $scope.uploadFiles.inventory=true;
                }
            }
            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 1000);
        };

        $scope.trial26 = function (val, i) {
            //$scope.fetchInventory();
            if(val == 'Not Available' || !val)val = '';
            $scope.miscellaneousReceipt.location = val;
            $scope.showStockInventory = false;
            $scope.inventory = $filter('filter')($scope.items15, val);
            $scope.viewby = i;
            $scope.totalItems = $scope.inventory.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.case15Length = $scope.inventory.length;

        }

        $scope.trial27 = function (i) {
            // alert()
            $scope.inventory = $scope.items15;
            $scope.inventorySearch.filter = '';
            $scope.viewby = i;
            $scope.totalItems = $scope.inventory.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.case15Length = $scope.inventory.length;
        }

        $scope.getWarehouseLocation = function(){
            $http.get("/dash/settings/inventory/locations").success(function(res){
                if(res.length){
                    $scope.warehouseLocation = res[0].location;
                }
            }).catch(function(err){
                console.log(err);
            })
        };

        // Function to switch between Inventory Transfer and Miscellaneous Receipt tabs......
        $scope.changeReceiveInventoryTab = function(tab){
            $scope.selectedTab = tab;
            $scope.inventoryTransfer = {};
            $scope.interInventoryTransfer = [];
        }

        // Clearing Miscellaneous
        $scope.clearMiscellaneousReceiptForm = function(){
            $scope.miscellaneousReceipt = {};
            $scope.interInventoryTransfer = [];
        }

        // Clearing Miscellaneous asset
        $scope.clearMiscellaneousAssetReceiptForm = function(){
            $scope.miscellaneousReceiptAsset = {};
            $scope.interAssetTransfer = [];
            $scope.asset = {};
        }

        // Remove item from the receiving inventory table.......
        $scope.removeMiscellaneousItem =function(data){
            $scope.receiveInventoryArray.splice($scope.receiveInventoryArray.indexOf(data), 1);
        };

        // Remove item from the transfering inventory table.......
        $scope.removeItemFromTransfer =function(data){
            $scope.transferInventoryArray.splice($scope.transferInventoryArray.indexOf(data), 1);
        };

        $scope.searchInterInventory = function (item) {
            $scope.interInventoryTransfer = [];
            var location ;
            if(user_details){
                if(user_details.sellerObject){
                    if(user_details.sellerObject.inventoryLocation){
                        location = user_details.sellerObject.inventoryLocation;
                    }
                }
            }

            if (item) {
                $http.get('/dash/inventory/search/' + item + "/" + location).success(function (res) {
                    $scope.interInventoryArray = res;

                    console.log('res',res);
                    if (res.length > 0 && res[0].inventory.length > 0) {
                        if(res.length == 1) {

                            if (!res[0].trackInventory && res[0].trackInventory !== false) {
                                res[0].trackInventory = true;
                            } else {
                                res[0].trackInventory = res[0].trackInventory;
                            }

                            $scope.interInventoryTransfer = res[0].inventory;
                            if ($scope.interInventoryTransfer.length) {
                                if (location) {
                                    $scope.inventoryTransfer.from = location;
                                }
                            }
                            $scope.interInventoryView = false;


                            for (var i = 0; i < res.length; i++) {
                                if (!res[i].trackInventory && res[i].trackInventory !== false) {
                                    res[i].trackInventory = true;
                                } else {
                                    res[i].trackInventory = res[i].trackInventory;
                                }
                            }
                        }else{
                            $scope.interInventoryTransfer = [];
                        }



                    } else {
                        if(user_details){
                            if(user_details.sellerObject){
                                if(user_details.sellerObject.inventoryLocation){
                                    $scope.inventoryTransfer.from = user_details.sellerObject.inventoryLocation;
                                    $scope.interInventoryTransfer.push({'location': user_details.sellerObject.inventoryLocation});
                                }else{
                                    $scope.inventoryTransfer.from = '';
                                }
                            }
                        }
                        $scope.interInventoryView = true;
                    }
                    $scope.interInventoryArray = res;
                    console.log('$scope.interInventoryArray',$scope.interInventoryArray)
                }).catch(function (err) {
                    console.log(err)
                })
            } else {

                $scope.interInventoryTransfer = [];
                $scope.inventoryTransfer = {};
                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            $scope.inventoryTransfer.from = user_details.sellerObject.inventoryLocation;
                            $scope.interInventoryTransfer.push({'location': user_details.sellerObject.inventoryLocation});
                        }
                    }
                }
            }
        };

        // Function to search by item name and item code from catalog collection................
        $scope.searchItemcodeInCatalog = function(search,type){
            $scope.searchArray = [];
            if(type == 'itemName' && search){
                // $scope.interInventoryTransfer = [];
                $http.get("/dash/item/search/"+search).success(function(res){
                    // console.log(res)
                    if(res.length>0){
                        if(res.length == 1){

                            if( !res[0].trackInventory && res[0].trackInventory !== false){
                                res[0].trackInventory = true;
                            }else{
                                res[0].trackInventory = res[0].trackInventory;
                            }

                            if(res[0].trackInventory){
                                $scope.miscellaneousReceipt.Product = res[0].Product;
                                $scope.miscellaneousReceipt.itemCode = res[0].itemCode;
                                $scope.miscellaneousReceipt.Category = res[0].Manufacturer ? res[0].Manufacturer : '';
                                $scope.miscellaneousReceipt.subCategory = res[0].subCategory ? res[0].subCategory : '';
                                $scope.miscellaneousReceipt.subSubCategory = res[0].subSubCategory ? res[0].subSubCategory : '';
                                $scope.miscellaneousReceipt.cloudinaryURL = res[0].cloudinaryURL ? res[0].cloudinaryURL : '';
                                $scope.miscellaneousReceipt.trackInventory = res[0].trackInventory;
                                $scope.itemExistsInCatalog = false;
                            }else{
                                $scope.miscellaneousReceipt = {};
                                Settings.alertPopup("Alert", "Inventory tracking is turned off for "+res[0].Product);
                                $scope.inventoryTransfer.inventoryTansferItemCode = '';
                            }


                        }else{

                            $scope.searchArray = res;
                        }
                        $scope.searchInterInventory(search);
                    }else {
                        $scope.searchArray = [];
                        $scope.itemExistsInCatalog = true;
                        $scope.miscellaneousReceipt.itemCode = '';
                        $scope.interInventoryTransfer = [];
                    }

                }).catch(function(error){
                    console.log(error)
                })
            }else if(type == 'itemCode' && search){

                $http.get("/dash/item/search/"+search).success(function(res){
                    if(res.length> 0){
                        console.log('res',res)
                        if(res.length ==1){

                        if( !res[0].trackInventory && res[0].trackInventory !== false){
                            res[0].trackInventory = true;
                        }else{
                            res[0].trackInventory = res[0].trackInventory;
                        }

                        $scope.miscellaneousReceipt.Product = res[0].Product;
                        $scope.miscellaneousReceipt.Category = res[0].Manufacturer ? res[0].Manufacturer : '';
                        $scope.miscellaneousReceipt.subCategory = res[0].subCategory ? res[0].subCategory : '';
                        $scope.miscellaneousReceipt.subSubCategory = res[0].subSubCategory ? res[0].subSubCategory : '';
                        $scope.miscellaneousReceipt.cloudinaryURL = res[0].cloudinaryURL ? res[0].cloudinaryURL : '';
                        $scope.miscellaneousReceipt.trackInventory = res[0].trackInventory;
                        $scope.itemExistsInCatalog = false;
                        $scope.interInventoryTransfer = [];
                            $scope.miscellaneousReceipt.itemCode = res[0].itemCode;
                        }else{
                            $scope.miscellaneousReceipt.Product = '';
                        }


                    }else{
                        $scope.miscellaneousReceipt.Product = '';
                        $scope.miscellaneousReceipt.quantity = '';
                        $scope.itemExistsInCatalog = true;
                        $scope.interInventoryTransfer = [];
                    }
                    $scope.searchInterInventory(search);

                    $scope.miscellaneousReceipt.itemName = '';

                }).catch(function(error){
                    console.log(error)
                })
            }else{
                $scope.miscellaneousReceipt.Product = '';
                $scope.miscellaneousReceipt.itemCode = '';
                $scope.itemExistsInCatalog = true;
                $scope.interInventoryTransfer = [];
            }

        };


        $scope.changeInventoryButton = function (flag) {
            if (flag == 0) {
                $scope.inventoryRecievePage = false ;
                $scope.inventoryTransferPage = false ;
                $scope.inventoryHistoryPage = false ;
                $scope.itemInventoryPage = false;
                // $scope.refreshTransactions(3);
                $scope.refreshInventory();
                $('html, body').animate({scrollTop: '0px'}, 0);
            }
            else if (flag == 1) {
                $scope.inventoryRecievePage = true ;
                $scope.itemExistsInCatalog = true;
                $scope.miscellaneousReceipt = {};
                $scope.interInventoryTransfer = [];
                $scope.refreshTransactions(3);
                $scope.miscellaneousReceipt.location = '';
                $('html, body').animate({scrollTop: '0px'}, 0);
            }
            else if (flag == 2){
                $scope.inventoryHistoryPage = false ;
                $scope.inventoryRecievePage = false ;
                $scope.inventoryTransferPage = true ;
                $scope.interInventoryTransfer = [];
                $scope.inventoryTransfer = {};

                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            $scope.interInventoryTransfer.push({"location" : user_details.sellerObject.inventoryLocation});
                            $scope.inventoryTransfer.from = user_details.sellerObject.inventoryLocation;
                        }
                    }
                }

                $('html, body').animate({scrollTop: '0px'}, 0);
            }
            else if (flag == 3){
                $scope.inventoryHistoryPage = true ;
                $scope.inventoryRecievePage = false ;
                $scope.inventoryTransferPage = false ;
                $scope.inventoryTransactionHistory.filter ='';
                $scope.getInventoryTransactionHistory();
                $scope.refreshTransactions(37);
                $('html, body').animate({scrollTop: '0px'}, 0);
            }
            else if (flag == 4){
                $scope.inventoryHistoryPage = false ;
                $scope.inventoryRecievePage = false ;
                $scope.inventoryTransferPage = false ;
                $scope.itemInventoryPage = true;
                $('html, body').animate({scrollTop: '0px'}, 0);
            }
        };

        $scope.receiveInventoryTypeahead = function(item){
            if( !item.trackInventory && item.trackInventory !== false){
                item.trackInventory = true;
            }else{
                item.trackInventory = item.trackInventory;
            }
            if(!item.trackInventory){
                $scope.miscellaneousReceipt = {};
                Settings.alertPopup("Alert", "Inventory tracking is turned off for "+item.Product);

            }else{
                $scope.miscellaneousReceipt.Product = item.Product;
                $scope.miscellaneousReceipt.itemCode = item.itemCode;
                $scope.miscellaneousReceipt = item;
                $scope.itemExistsInCatalog = false;
                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;
                        }
                    }
                }
                $scope.searchInterInventory(item.itemCode);
            }



        };

        var a = 0;
        $scope.navPage = (tab, direction) => {
            if(tab == 42){
                var viewLength = $scope.viewLength;
                var viewBy = $scope.newViewBy;

                // console.log(viewLength," ",viewBy);
                if(direction){
                    // console.log("NEXT");


                    if(viewLength + viewBy >= $scope.inventoryTransaction.length){
                        if(viewLength + viewBy < $scope.inventoryTransactionHistory_count){
                            viewLength += viewBy;
                            inventoryTransactionObj.viewLength = viewLength;
                            inventoryTransactionObj.viewBy = initialViewBy;


                            jQuery.noConflict();
                            $('.refresh').css("display", "inline");
                            $http.post("/dash/inventory/transactions",inventoryTransactionObj)
                                .success(function(response){
                                    console.log(response);

                                    for(var i=0; i<response.length; i++){
                                        $scope.inventoryTransaction.push(response[i]);
                                    }

                                    if(viewLength + viewBy > $scope.inventoryTransactionHistory_count){
                                        a = viewLength + viewBy - $scope.inventoryTransactionHistory_count;
                                        viewBy -= a;
                                        $scope.newViewBy = viewBy;
                                    }
                                    $scope.viewLength = viewLength;
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

                            jQuery.noConflict();
                            $('.refresh').css("display", "none");

                        }
                        else{
                            //console.log("Out of data")
                            if(viewLength + viewBy > $scope.inventoryTransactionHistory_count){
                                a = viewLength + viewBy - $scope.inventoryTransactionHistory_count;
                                viewBy -= a;
                                $scope.newViewBy = viewBy;
                            }
                        }
                    }
                    else{
                        // console.log("Minus viewby")
                        viewLength += viewBy;

                        if(viewLength + viewBy > $scope.inventoryTransactionHistory_count){
                            a = viewLength + viewBy - $scope.inventoryTransactionHistory_count;
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
                        if(viewLength + viewBy >= $scope.inventoryTransactionHistory_count){
                            viewBy += a;
                            a = 0;
                        }

                        viewLength -= viewBy;

                        $scope.viewLength = viewLength;
                        $scope.newViewBy = viewBy;
                    }
                }
            }else if(tab == 43){
                var viewLength = $scope.viewLength;
                var viewBy = $scope.newViewBy;

                var inventoryObj = {};
                if(direction){
                    // console.log("NEXT");
                    if(viewLength + viewBy >= $scope.inventory.length){
                        if(viewLength + viewBy < $scope.inventory_count){

                            console.log(viewLength + viewBy, ' ',$scope.inventory.length,' ',$scope.inventory_count)
                            viewLength += viewBy;
                            // console.log("Fetch more")
                            inventoryObj.viewLength = viewLength;
                            inventoryObj.viewBy = initialViewBy;

                            jQuery.noConflict();
                            $('.refresh').css("display", "inline");
                            $http.post("/dash/inventory/view",inventoryObj)
                                .success(function(response){
                                    for(var i=0; i<response.length; i++){
                                        $scope.inventory.push(response[i]);
                                    }

                                    if(viewLength + viewBy > $scope.inventory_count){
                                        a = viewLength + viewBy - $scope.inventory_count;
                                        viewBy -= a;
                                        $scope.newViewBy = viewBy;
                                    }
                                    $scope.viewLength = viewLength;
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
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
                        else{
                            // console.log("Out of data")
                            if(viewLength + viewBy > $scope.inventory_count){
                                a = viewLength + viewBy - $scope.inventory_count;
                                viewBy -= a;
                                $scope.newViewBy = viewBy;
                            }
                        }
                    }
                    else{
                        // console.log("Minus viewby")
                        viewLength += viewBy;

                        if(viewLength + viewBy > $scope.inventory_count){
                            a = viewLength + viewBy - $scope.inventory_count;
                            viewBy -= a;
                        }
                        $scope.newViewBy = viewBy;
                        $scope.viewLength = viewLength;
                    }
                }
                else{
                    console.log("BACK");
                    if(viewLength < viewBy){
                        //console.log("NO DATA")
                    }
                    else{
                        if(viewLength + viewBy >= $scope.inventory_count){
                            viewBy += a;
                            a = 0;
                        }

                        viewLength -= viewBy;

                        $scope.viewLength = viewLength;
                        $scope.newViewBy = viewBy;
                    }
                }
            }
            else if(tab == 44){
                var viewLength = $scope.viewLength;
                var viewBy = $scope.newViewBy;

                var inventoryObj = {};
                if(direction){
                    // console.log("NEXT");
                    if(viewLength + viewBy >= $scope.inventory.length){
                        if(viewLength + viewBy < $scope.inventory_rentalCount){
                            viewLength += viewBy;
                            console.log("Fetch more")
                            inventoryObj.viewLength = viewLength;
                            inventoryObj.viewBy = initialViewBy;

                            $http.post("/dash/inventory/rental",inventoryObj)
                                .success(function(response){
                                    for(var i=0; i<response.length; i++){
                                        $scope.inventory.push(response[i]);
                                    }

                                    if(viewLength + viewBy > $scope.inventory_rentalCount){
                                        a = viewLength + viewBy - $scope.inventory_rentalCount;
                                        viewBy -= a;
                                        $scope.newViewBy = viewBy;
                                    }
                                    $scope.viewLength = viewLength;
                                })

                        }
                        else{
                            // console.log("Out of data")
                            if(viewLength + viewBy > $scope.inventory_rentalCount){
                                a = viewLength + viewBy - $scope.inventory_rentalCount;
                                viewBy -= a;
                                $scope.newViewBy = viewBy;
                            }
                        }
                    }
                    else{
                        // console.log("Minus viewby")
                        viewLength += viewBy;

                        if(viewLength + viewBy > $scope.inventory_rentalCount){
                            a = viewLength + viewBy - $scope.inventory_rentalCount;
                            viewBy -= a;
                        }
                        $scope.newViewBy = viewBy;
                        $scope.viewLength = viewLength;
                    }
                }
                else{
                    // console.log("BACK");
                    if(viewLength < viewBy){
                        //console.log("NO DATA")
                    }
                    else{
                        if(viewLength + viewBy >= $scope.inventory_rentalCount){
                            viewBy += a;
                            a = 0;
                        }

                        viewLength -= viewBy;

                        $scope.viewLength = viewLength;
                        $scope.newViewBy = viewBy;
                    }
                }
            }
            else if(tab == 45){
                var viewLength = $scope.viewLength;
                var viewBy = $scope.newViewBy;

                var inventoryObj = {};
                if(direction){
                    // console.log("NEXT");
                    if(viewLength + viewBy >= $scope.itemInventoryDetails.length){
                        if(viewLength + viewBy < $scope.itemInventoryDetails_count){
                            viewLength += viewBy;
                            console.log("Fetch more")
                            itemInventoryObj.viewLength = viewLength;
                            itemInventoryObj.viewBy = initialViewBy;

                            jQuery.noConflict();
                            $('.refresh').css("display", "inline");
                            $http.post("/dash/inventory/item", itemInventoryObj)
                                .success(function(response){
                                    for(var i=0; i<response.length; i++){
                                        $scope.inventory.push(response[i]);
                                    }

                                    if(viewLength + viewBy > $scope.itemInventoryDetails_count){
                                        a = viewLength + viewBy - $scope.itemInventoryDetails_count;
                                        viewBy -= a;
                                        $scope.newViewBy = viewBy;
                                    }
                                    $scope.viewLength = viewLength;
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

                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                        }
                        else{
                            // console.log("Out of data")
                            if(viewLength + viewBy > $scope.itemInventoryDetails_count){
                                a = viewLength + viewBy - $scope.itemInventoryDetails_count;
                                viewBy -= a;
                                $scope.newViewBy = viewBy;
                            }
                        }
                    }
                    else{
                        // console.log("Minus viewby")
                        viewLength += viewBy;

                        if(viewLength + viewBy > $scope.itemInventoryDetails_count){
                            a = viewLength + viewBy - $scope.itemInventoryDetails_count;
                            viewBy -= a;
                        }
                        $scope.newViewBy = viewBy;
                        $scope.viewLength = viewLength;
                    }
                }
                else{
                    // console.log("BACK");
                    if(viewLength < viewBy){
                        //console.log("NO DATA")
                    }
                    else{
                        if(viewLength + viewBy >= $scope.itemInventoryDetails_count){
                            viewBy += a;
                            a = 0;
                        }

                        viewLength -= viewBy;

                        $scope.viewLength = viewLength;
                        $scope.newViewBy = viewBy;
                    }
                }
            }
        }
        var inventoryObj = {};

        $scope.refreshTransactions = function(tab){

            if(tab == 3){
                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                $scope.inventory=[];
                inventoryObj.viewLength = 0;
                inventoryObj.viewBy =  initialViewBy;
                inventoryObj.searchFor = '';
                inventoryObj.searchBy = [];
                inventoryObj.filter = '';
                $scope.inventorySearch.filter = '';
                $scope.miscellaneousReceipt.location = 'All';
                $scope.showInventoryFilter = false;

                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            $scope.inventorySearch.filter = '';
                            inventoryObj.searchFor = user_details.sellerObject.inventoryLocation+'';
                            inventoryObj.searchBy = ['location'];
                            $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);
                            // $scope.salesPersonflag = false;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);

                        }
                    }
                }

                //1s$scope.inventoryStatusSelect = 'all'
                $http.post('/dash/inventory/view',inventoryObj).success(function(res){
                    // console.log(res.length)
                    $scope.inventory = res;
                }).catch(function(err){
                    console.log(err)
                })

                $http.post('/dash/inventory/count',inventoryObj)
                    .success(function(response){
                        //console.log(response)
                        $scope.transactionCount(response,37)
                    });


                setTimeout(function () {
                    $('.refresh').css("display", "none");
                }, 1000);
            }
            else if(tab == 37){
                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                $scope.inventoryTransaction=[];

                inventoryTransactionObj.viewLength = 0;
                inventoryTransactionObj.viewBy =  initialViewBy;
                inventoryTransactionObj.searchFor = '';
                inventoryTransactionObj.searchBy = [];
                inventoryTransactionObj.filter = '';
                $scope.inventoryStatusSelect = 'all';

                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            $scope.inventorySearch.filter = '';
                            inventoryTransactionObj.location = user_details.sellerObject.inventoryLocation+'';

                        }
                    }
                }



                $http.post('/dash/inventory/transactions', inventoryTransactionObj).success(function(res){
                    // console.log(res)
                    $scope.inventoryTransaction = res;
                }).catch(function(err){
                    console.log(err)
                })


                $http.post('/dash/inventory/transactions/count', inventoryTransactionObj)
                    .success(function(response){
                        // console.log(response)
                        $scope.transactionCount(response,36)
                    });
                setTimeout(function () {
                    $('.refresh').css("display", "none");
                }, 1000);
            }else if(tab == 38){

                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                $scope.inventory=[];
                inventoryObj.viewLength = 0;
                inventoryObj.viewBy =  initialViewBy;
                inventoryObj.searchFor = '';
                inventoryObj.searchBy = [];
                inventoryObj.filter = '';
                $scope.inventorySearch.filter = '';
                $scope.miscellaneousReceipt.location = 'All';
                $scope.showInventoryFilter = false;

                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            $scope.inventorySearch.filter = '';
                            inventoryObj.searchFor = user_details.sellerObject.inventoryLocation+'';
                            inventoryObj.searchBy = ['location'];
                            $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);
                            // $scope.salesPersonflag = false;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);

                        }
                    }
                }

                //1s$scope.inventoryStatusSelect = 'all'
                $http.post('/dash/inventory/view',inventoryObj).success(function(res){
                    // console.log(res.length)
                    $scope.inventory = res;
                }).catch(function(err){
                    console.log(err)
                })

                $http.post('/dash/inventory/count',inventoryObj)
                    .success(function(response){
                        //console.log(response)
                        $scope.transactionCount(response,37)
                    });


                setTimeout(function () {
                    $('.refresh').css("display", "none");
                }, 1000);
            }else if(tab == 39){
                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                $scope.inventory=[];
                inventoryObj.viewLength = 0;
                inventoryObj.viewBy = initialViewBy;
                inventoryObj.searchFor = '';
                inventoryObj.searchBy = [];
                inventoryObj.filter = '';
                $scope.inventorySearch.filter = '';

                if($scope.customerSelected){
                    inventoryObj.dealercode = $scope.customerSelected;
                }

                if($scope.itemsSelected){
                    inventoryObj.itemCode = $scope.itemsSelected;
                }

                $http.post('/dash/inventory/rental',inventoryObj).success(function(res){
                    $scope.inventory = res;
                }).catch(function(err){
                    console.log(err)
                })

                $http.post("/dash/inventory/rental/count",inventoryObj)
                    .success(function(res){
                        if(res){
                            //console.log('res',res);
                            $scope.transactionCount(res,38);
                            $scope.inventory_rentalCount = res;
                        }
                    });
            }else if(tab == 39){
                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                $scope.inventory=[];
                inventoryObj.viewLength = 0;
                inventoryObj.viewBy = initialViewBy;
                inventoryObj.searchFor = '';
                inventoryObj.searchBy = [];
                inventoryObj.filter = '';
                $scope.inventorySearch.filter = '';

                if($scope.customerSelected){
                    inventoryObj.dealercode = $scope.customerSelected;
                }

                if($scope.itemsSelected){
                    inventoryObj.itemCode = $scope.itemsSelected;
                }

                $http.post('/dash/inventory/rental',inventoryObj).success(function(res){
                    $scope.inventory = res;
                }).catch(function(err){
                    console.log(err)
                })

                $http.post("/dash/inventory/rental/count",inventoryObj)
                    .success(function(res){
                        if(res){
                            //console.log('res',res);
                            $scope.transactionCount(res,38);
                            $scope.inventory_rentalCount = res;
                        }
                    });
            }
            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 1000);
        };

        $scope.formatDate = function(date){
            if(date==undefined || date == '')
                return ('');
            /* replace is used to ensure cross browser support*/
            var d = new Date(date.toString().replace("-","/").replace("-","/"));
            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            var dt = d.getDate();
            if(dt<10)
                dt = "0"+dt;
            var dateOut = dt+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear());
            return dateOut;
        };

        $scope.fetchTransactionDetails = function(item,flag){
            if(flag){
                var orderId = item+"";
                $http.get('/dash/inventory/transaction/detail/'+orderId).success(function(res) {
                    $scope.transactionDetails = res;
                    if(res.orderId){
                        $http.get('/dash/orders/detail/'+res.orderId).success(function(res) {
                            $scope.inventoryTransactionShipmentModelOrderDetails = res;
                        })
                    }else{
                        console.log('......Order Id Not Found.......')
                    }
                })

            }else{
                $scope.transactionDetails = item;
                if(item.orderId[0]){
                    $http.get('/dash/orders/detail/'+item.orderId[0]).success(function(res) {
                        $scope.inventoryTransactionShipmentModelOrderDetails = res;
                    })
                }else{
                    console.log('......Order Id Not Found.......')
                }
            }
        };

        // Submit Miscellaneous Receipt Form.........
        $scope.submitMiscellaneousReceiptForm = function(){
            console.log('$scope.miscellaneousReceipt',$scope.miscellaneousReceipt)
            if($scope.miscellaneousReceipt.trackInventory){
                if($scope.miscellaneousReceipt.itemCode){
                    if($scope.miscellaneousReceipt.Product){
                        if($scope.miscellaneousReceipt.quantity ){
                            if($scope.miscellaneousReceipt.quantity > 0){
                                if($scope.itemExistsInCatalog){
                                    Settings.alertPopup("ERROR", "Please add item to the Catalog");
                                    /*bootbox.alert({
                                        title : 'ERROR',
                                        message : 'Please add item to the Catalog',
                                        className : 'text-center'
                                    })*/

                                }else{
                                    if($scope.receiveInventoryArray.length){
                                        var dupicates = true ;
                                        for(var i = 0; i < $scope.receiveInventoryArray.length;i++){
                                            if($scope.receiveInventoryArray[i].itemCode == $scope.miscellaneousReceipt.itemCode){
                                                if(($scope.receiveInventoryArray[i].location == $scope.miscellaneousReceipt.location)||(!$scope.receiveInventoryArray[i].location && !$scope.miscellaneousReceipt.location)){
                                                    $scope.receiveInventoryArray[i].quantity += $scope.miscellaneousReceipt.quantity ;
                                                    dupicates = false ;

                                                    if(user_details){
                                                        if(user_details.sellerObject){
                                                            if(user_details.sellerObject.inventoryLocation){
                                                                $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;
                                                            }
                                                        }
                                                    }
                                                    break;

                                                }
                                            }

                                        }
                                        if(dupicates)
                                            $scope.receiveInventoryArray.push($scope.miscellaneousReceipt);

                                        $scope.interInventoryTransfer = [];
                                        $scope.miscellaneousReceipt = {}
                                    }
                                    else{

                                        $scope.receiveInventoryArray.push($scope.miscellaneousReceipt);
                                        $scope.interInventoryTransfer = [];
                                        $scope.miscellaneousReceipt = {}
                                        if(user_details){
                                            if(user_details.sellerObject){
                                                if(user_details.sellerObject.inventoryLocation){
                                                    $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;
                                                }
                                            }
                                        }
                                    }

                                }
                            }else{
                                Settings.fail_toast('Error', 'Please Enter a valid Quantity');
                            }
                        }else{
                            Settings.fail_toast('Error', 'Please Enter a Quantity');
                        }
                    }else{
                        Settings.fail_toast('Error', 'Please Enter a Product Name');
                    }
                }else{
                    Settings.fail_toast('Error', 'Please enter a Item Code');
                }
            }else{
                Settings.alertPopup('Alert', "Inventory tracking is turned off for "+$scope.miscellaneousReceipt.Product);
                $scope.miscellaneousReceipt = {};
            }


        };

        $scope.submitMiscellaneoustransferForm = function(){
                if($scope.inventoryTransfer.inventoryTansferItemCode) {
                        if ($scope.inventoryTransfer.from || $scope.inventoryTransfer.to || $scope.inventoryTransfer.from == 'DEFAULT LOCATION' || $scope.inventoryTransfer.to == 'DEFAULT LOCATION') {
                            if (!$scope.inventoryTransfer.from || $scope.inventoryTransfer.from == 'DEFAULT LOCATION') $scope.inventoryTransfer.from = '';
                            if (!$scope.inventoryTransfer.to || $scope.inventoryTransfer.to == 'DEFAULT LOCATION') $scope.inventoryTransfer.to = '';
                            if ($scope.inventoryTransfer.quantity) {
                                if($scope.interInventoryTransfer.length) {
                                    var uniqItem = true;
                                    for (var i = 0; i < $scope.transferInventoryArray.length; i++) {
                                        if ($scope.transferInventoryArray[i].inventoryTansferItemCode == $scope.inventoryTransfer.inventoryTansferItemCode || $scope.transferInventoryArray[i].inventoryTansferItemCode == $scope.interInventoryMultipletransfer.itemCode) {
                                            uniqItem = false;
                                            Settings.alertPopup('ERROR', 'Same item can be added only once');
                                            return;
                                        }
                                    }
                                    if(uniqItem){
                                        for (var i = 0; i < $scope.interInventoryTransfer.length; i++) {
                                            (function (i) {
                                                if ($scope.interInventoryTransfer[i].location == $scope.inventoryTransfer.from) {
                                                    if ($scope.interInventoryTransfer[i].Qty >= $scope.inventoryTransfer.quantity) {
                                                        if($scope.inventoryTransfer.from != $scope.inventoryTransfer.to) {
                                                            if ($scope.itemExistsInCatalog) {
                                                                Settings.alertPopup("ERROR", "Please add item to the Catalog");
                                                                /*bootbox.alert({
                                                                    title : 'ERROR',
                                                                    message : 'Please add item to the Catalog',
                                                                    className : 'text-center'
                                                                })*/

                                                            } else {
                                                                if ($scope.transferInventoryArray.length) {
                                                                        $scope.inventoryTransfer.Product = $scope.interInventoryTransfer[0].Product;
                                                                    if ($scope.interInventoryMultipletransfer) {
                                                                        $scope.inventoryTransfer.trackInventory = $scope.interInventoryMultipletransfer.trackInventory;
                                                                        $scope.inventoryTransfer.inventoryTansferItemCode = $scope.interInventoryMultipletransfer.itemCode;
                                                                    } else {
                                                                        $scope.inventoryTransfer.trackInventory = $scope.interInventoryArray[0].trackInventory;
                                                                    }
                                                                    $scope.transferInventoryArray.push($scope.inventoryTransfer);

                                                                    $scope.interInventoryTransfer = [];
                                                                    $scope.inventoryTransfer = {};
                                                                    $scope.interInventoryMultipletransfer = '';

                                                                } else {
                                                                    $scope.inventoryTransfer.Product = $scope.interInventoryTransfer[0].Product;
                                                                    if ($scope.interInventoryMultipletransfer) {
                                                                        $scope.inventoryTransfer.trackInventory = $scope.interInventoryMultipletransfer.trackInventory;
                                                                        $scope.inventoryTransfer.inventoryTansferItemCode = $scope.interInventoryMultipletransfer.itemCode;
                                                                    } else {
                                                                        $scope.inventoryTransfer.trackInventory = $scope.interInventoryArray[0].trackInventory;
                                                                    }
                                                                    $scope.transferInventoryArray.push($scope.inventoryTransfer);
                                                                    $scope.interInventoryTransfer = [];
                                                                    $scope.inventoryTransfer = {};
                                                                    $scope.interInventoryMultipletransfer = '';
                                                                    if (user_details) {
                                                                        if (user_details.sellerObject) {
                                                                            if (user_details.sellerObject.inventoryLocation) {
                                                                                $scope.inventoryTransfer.location = user_details.sellerObject.inventoryLocation;
                                                                            }
                                                                        }
                                                                    }
                                                                }

                                                            }
                                                        } else{
                                                            Settings.alertPopup('ERROR', 'From and To location cannot be same');
                                                        }
                                                    } else {
                                                        Settings.alertPopup('ERROR', 'Quantity is more than Existing');
                                                    }
                                                }
                                            })(i)
                                        }
                                    }
                                } else{
                                    Settings.alertPopup("ERROR", "No Items Available");
                                }
                            } else {
                                Settings.alertPopup('Error', 'Please Enter a Quantity');
                            }
                        } else {
                            Settings.alertPopup("ERROR", "Please Select a Location");
                            }
                         }else
                    {
                        Settings.fail_toast('Error', 'Please enter a Item Code');
                    }

        };

        $scope.transferInventory = function(){

            var date = new Date();
            var components = [
                date.getFullYear() - 1900,
                (date.getMonth() < 10)? '0' + date.getMonth() : date.getMonth(),
                (date.getDate() < 10)? '0' + date.getDate() : date.getDate(),
                (date.getHours() < 10)? '0' + date.getHours() : date.getHours(),
                (date.getMinutes() < 10)? '0' + date.getMinutes() : date.getMinutes(),
                (date.getSeconds() < 10)? '0' + date.getSeconds() : date.getSeconds(),
                (date.getMilliseconds() < 10)? '00' + date.getMilliseconds() : (date.getMilliseconds() < 100)? '0' + date.getMilliseconds() : date.getMilliseconds()
            ];
            var date_ = components.join("");


            var date1 = new Date();
            var dformat = [date1.getFullYear(),(date1.getMonth()+1).padLeft(), date1.getDate().padLeft() ].join('-') + ' '
                + [date1.getHours().padLeft(), date1.getMinutes().padLeft(), date1.getSeconds().padLeft()].join (':');

                if($scope.transferInventoryArray.length) {
                    for (var i = 0; i < $scope.transferInventoryArray.length; i++) {
                        var obj = {
                            // from: $scope.transferInventoryArray[i].from,
                            // to: $scope.transferInventoryArray[i].to,
                            transaction_id: date_,
                            shippedByName: $scope.user.username ? $scope.user.username : 'Admin',
                            seller: $scope.user.sellerphone ? $scope.user.sellerphone : 'Admin',
                            date_added: dformat,
                            transaction: [],
                            transaction: $scope.transferInventoryArray
                        }

                        obj.transaction[i].Product = $scope.transferInventoryArray[i].Product;
                        obj.transaction[i].itemCode = $scope.transferInventoryArray[i].inventoryTansferItemCode;
                        obj.transaction[i].quantity = Number($scope.transferInventoryArray[i].quantity.toFixed(3));
                        obj.transaction[i].from = $scope.transferInventoryArray[i].from;
                        obj.transaction[i].to =  $scope.transferInventoryArray[i].to;
                    }
                }
                                            jQuery.noConflict();
                                            $('.refresh').css("display", "inline");
                                            $http.post('/dash/inventory/interInventory',obj).success(function(res){
                                                $scope.transferInventoryArray = [];
                                                $scope.searchInterInventory(obj.itemCode);
                                                Settings.success_toast("Success", 'Inventory transferred successfully');
                                                $scope.inventoryTransfer = {};
                                                $scope.refreshTransactions(37);
                                                $scope.changeInventoryButton(3);
                                            }).catch(function(err){
                                                console.log(err)
                                            })
        };

        $scope.transactionCount = function(response, tab){
            // console.log("Count -> " + response, tab);
            if(tab == 36){
                if(response){
                    if(response > viewBy.items){
                        $scope.inventoryTransactionHistory_count = response;
                        $scope.viewLength = 0;
                        $scope.newViewBy = viewBy.items;
                    }
                    else if(response <= viewBy.items){
                        $scope.inventoryTransactionHistory_count = response;
                        $scope.newViewBy = response;
                    }
                    else{
                        $scope.inventoryTransaction = [];
                        $scope.newViewBy = 1;
                        $scope.inventoryTransactionHistory_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.items = [];
                    $scope.newViewBy = 1;
                    $scope.inventoryTransactionHistory_count = 0;
                    $scope.viewLength = -1;
                }
            }else if(tab == 37){
                if(response){
                    // console.log(response);
                    if(response > viewBy.items){
                        $scope.inventory_count = response;
                        $scope.viewLength = 0;
                        $scope.newViewBy = viewBy.items;
                    }
                    else if(response <= viewBy.items){
                        $scope.inventory_count = response;
                        $scope.newViewBy = response;
                    }
                    else{
                        $scope.inventory = [];
                        $scope.newViewBy = 1;
                        $scope.inventory_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.inventory = [];
                    $scope.newViewBy = 1;
                    $scope.inventory_count = 0;
                    $scope.viewLength = -1;
                }
            }else if(tab == 38){
                if(response){
                    if(response > viewBy.items){
                        $scope.inventory_rentalCount = response;
                        $scope.viewLength = 0;
                        $scope.newViewBy = viewBy.items;
                    }
                    else if(response <= viewBy.items){
                        $scope.inventory_rentalCount = response;
                        $scope.viewLength = 0;
                        $scope.newViewBy = response;
                    }
                    else{
                        $scope.inventory = [];
                        $scope.newViewBy = 1;
                        $scope.inventory_rentalCount = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.inventory = [];
                    $scope.newViewBy = 1;
                    $scope.inventory_rentalCount = 0;
                    $scope.viewLength = -1;
                }
            }else if(tab == 39){
                if(response){
                    if(response > viewBy.items){
                        $scope.itemInventoryDetails_count = response;
                        $scope.viewLength = 0;
                        $scope.newViewBy = viewBy.items;
                    }
                    else if(response <= viewBy.items){
                        $scope.itemInventoryDetails_count = response;
                        $scope.viewLength = 0;
                        $scope.newViewBy = response;
                    }
                    else{
                        $scope.inventory = [];
                        $scope.newViewBy = 1;
                        $scope.itemInventoryDetails_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.inventory = [];
                    $scope.newViewBy = 1;
                    $scope.itemInventoryDetails_count = 0;
                    $scope.viewLength = -1;
                }
            }

        };

        // Function To Switch Receive Inventory Module and Transaction History Component.....
        // $scope.changeInventoryView = function(tab){
        //     $scope.receiveInventoryView = tab;
        //     switch(tab){
        //         //.... Tab View...
        //         //.. Summary View
        //         case 0 : {
        //
        //             break;
        //         }
        //         //.... Receive View...
        //         case 1 : {
        //             $scope.itemExistsInCatalog = true;
        //             $scope.refreshTransactions(3);
        //             $scope.miscellaneousReceipt = {};
        //             break;
        //         }
        //         //... Txn History...
        //         case 2 : {
        //             $scope.inventoryTransactionHistory.filter ='';
        //             $scope.getInventoryTransactionHistory();
        //             break;
        //         }
        //         case 3 : {
        //             break;
        //         }
        //     }
        // };

        $scope.receiveInterInventoryTypeahead = function(item){
            if( !item.trackInventory && item.trackInventory !== false){
                item.trackInventory = true;
            }else{
                item.trackInventory = item.trackInventory;
            }
            if(item.trackInventory){
                $scope.interInventoryMultipletransfer = item;
                $scope.interInventoryTransfer=[];
                if(item && item.inventory.length){
                    $scope.interInventoryTransfer = item.inventory;
                    $scope.interInventoryView = false;
                }else{
                    if(user_details){
                        if(user_details.sellerObject){
                            if(user_details.sellerObject.inventoryLocation){
                                $scope.inventoryTransfer.from = user_details.sellerObject.inventoryLocation;
                                $scope.interInventoryTransfer.push({'location': user_details.sellerObject.inventoryLocation});
                            }else{
                                $scope.inventoryTransfer.from = '';
                            }
                        }
                    }
                }
            }else{
                Settings.alertPopup("Alert", "Inventory tracking is turned off for "+item.Product);
                $scope.inventoryTransfer.inventoryTansferItemCode = '';
            }

        };

        $scope.inventoryTransactionHistoryFilter = function(){

            $scope.inventoryTransaction = [];

            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            if($scope.inventoryTransactionHistory.filter){
                inventoryTransactionObj.searchFor = $scope.inventoryTransactionHistory.filter;
                inventoryTransactionObj.searchBy = inventoryTransactionHistorySearchBy;
            }

            if(user_details){
                if(user_details.sellerObject){
                    if(user_details.sellerObject.inventoryLocation){
                        $scope.inventorySearch.filter = '';
                        inventoryTransactionObj.location = user_details.sellerObject.inventoryLocation+'';

                    }
                }
            }

            $http.post('/dash/inventory/transactions',inventoryTransactionObj).success(function(res){
                $scope.inventoryTransaction = res;
            }).catch(function(err){
                console.log(err)
            })


            $http.post('/dash/inventory/transactions/count', inventoryTransactionObj)
                .success(function(response){
                    $scope.transactionCount(response,36)
                });
            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 1000);
        };

        $scope.getInventoryTransactionHistory = function(){

            var inventoryTransactionObj = {};
            inventoryTransactionObj.viewLength = 0;
            inventoryTransactionObj.viewBy =  initialViewBy;
            inventoryTransactionObj.searchFor = '';
            inventoryTransactionObj.searchBy = [];
            $scope.inventoryStatusSelect = 'all';
            inventoryTransactionObj.filter = '';

            $scope.viewLength = 0;

            if(user_details){
                if(user_details.sellerObject){
                    if(user_details.sellerObject.inventoryLocation){
                        inventoryTransactionObj.location = user_details.sellerObject.inventoryLocation+'';
                    }
                }
            }

            $http.post('/dash/inventory/transactions',inventoryTransactionObj).success(function(res){
                $scope.inventoryTransaction = res;
            }).catch(function(err){
                console.log(err)
            })


            $http.post('/dash/inventory/transactions/count', inventoryTransactionObj)
                .success(function(response){
                    $scope.transactionCount(response,36)
                });
        }

        $scope.clearTransferInventory = function(){
            $scope.inventoryTransfer = {};
            $scope.interInventoryTransfer = [];
            if(user_details){
                if(user_details.sellerObject){
                    if(user_details.sellerObject.inventoryLocation){
                        $scope.inventoryTransfer.from = user_details.sellerObject.inventoryLocation;
                        $scope.interInventoryTransfer.push({'location': user_details.sellerObject.inventoryLocation});
                    }
                }
            }
        }



        $scope.receiveMiscellaneousItem = function(){
            var obj = {};
            obj.transaction_id = Settings.generateId();
            obj.date_added = Settings.newDate();
            obj.receicedBy = $scope.user.username ? $scope.user.username : 'Admin';
            obj.seller = $scope.user.sellerphone ? $scope.user.sellerphone : 'Admin';
            
            obj.transaction = [];
            obj.transaction = $scope.receiveInventoryArray;

            if($scope.receiveInventoryArray.length){
                if($scope.receiveInventoryArray.length == 1){
                    obj.transaction[0].Manufacturer = $scope.receiveInventoryArray[0].Manufacturer ? $scope.receiveInventoryArray[0].Manufacturer : $scope.receiveInventoryArray[0].Category;
                    obj.transaction[0].subCategory = $scope.receiveInventoryArray[0].subCategory ? $scope.receiveInventoryArray[0].subCategory : '';
                    obj.transaction[0].subSubCategory = $scope.receiveInventoryArray[0].subSubCategory ? $scope.receiveInventoryArray[0].subSubCategory : '';
                    obj.transaction[0].quantity = Number($scope.receiveInventoryArray[0].quantity.toFixed(3));
                    obj.transaction[0].cloudinaryURL = $scope.receiveInventoryArray[0].cloudinaryURL ? $scope.receiveInventoryArray[0].cloudinaryURL : '';
                }else if($scope.receiveInventoryArray.length > 1){

                    for(var i=0; i< $scope.receiveInventoryArray.length; i++){
                        obj.transaction[i].Manufacturer = $scope.receiveInventoryArray[i].Manufacturer ? $scope.receiveInventoryArray[i].Manufacturer : $scope.receiveInventoryArray[0].Category;
                        obj.transaction[i].subCategory = $scope.receiveInventoryArray[i].subCategory ? $scope.receiveInventoryArray[i].subCategory : '';
                        obj.transaction[i].subSubCategory = $scope.receiveInventoryArray[i].subSubCategory ? $scope.receiveInventoryArray[i].subSubCategory : '';
                        obj.transaction[i].quantity = Number($scope.receiveInventoryArray[i].quantity.toFixed(3));
                        obj.transaction[i].cloudinaryURL = $scope.receiveInventoryArray[i].cloudinaryURL ? $scope.receiveInventoryArray[i].cloudinaryURL : '';
                    }
                }
            }

            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            $http.post("/dash/inventory/receive", obj).success(function(res){
                Settings.success_toast("Success", 'Inventory received successfully');
                $scope.receiveInventoryArray = [];
                // $scope.refreshTransactions(3);
                $scope.refreshTransactions(37);
                $scope.changeInventoryButton(3);

                // $scope.changeInventoryView('receive_inventory');
                // $scope.changeInventoryView('inventory_transaction');
                $scope.interInventoryTransfer =[];
            }).catch(function(err){
                console.log(err)
            })

        }

        $scope.filterInventoryByLocation = function(){
            $scope.inventoryLocationUnique = [];
            $http.get('dash/inventory/location/filter').success(function(res){

                if(res.length){
                    $scope.inventoryLocationUnique = res;
                    $scope.inventoryLocationUnique = $scope.inventoryLocationUnique.filter(Boolean) ;
                    $scope.inventoryLocationUnique = $scope.inventoryLocationUnique.map(function(x){return (x + "").toUpperCase()}) ;

                }
                for(var i=0; i< $scope.warehouseLocation.length; i++){
                    $scope.inventoryLocationUnique.push($scope.warehouseLocation[i].name);
                }

                $scope.inventoryLocationUnique = Array.from(new Set($scope.inventoryLocationUnique));

                for(var i=0;i< $scope.inventoryLocationUnique.length; i++){
                    if($scope.inventoryLocationUnique[i] == ''){
                        $scope.inventoryLocationUnique.splice(i, 1);
                    }
                }

            }).catch(function(err){
                console.log(err)
            })
        };

         $scope.fetchInventory = function(searchFor,flag){
             // console.log(searchFor)
             // console.log(flag)
             // $scope.miscellaneousReceipt.location = searchFor;
             var inventoryFetch = {};
             inventoryFetch.searchBy = [];
             inventoryFetch.searchFor = '';
             inventoryFetch.viewLength = 0;
             inventoryFetch.viewBy =  initialViewBy;
             inventoryFetch.filter = '';
             $scope.viewLength = 0;
             $scope.inventory = [];
             jQuery.noConflict();
             $('.refresh').css("display", "inline");

             if(!$scope.showInventoryFilter){
                 if(flag)
                     $scope.inventorySearch.filter = flag;
             }
             $scope.showInventoryFilter = true;

             if($scope.inventorySearch.filter){
                 inventoryFetch.searchFor = $scope.inventorySearch.filter + '';
                 inventoryFetch.searchBy = inventorySearchBy;
             }
             if(searchFor){
                 inventoryFetch.location = searchFor+''
                 $scope.miscellaneousReceipt.location = searchFor;
             }
             if(searchFor == "All"){
                 inventoryFetch.location = null;
                 $scope.miscellaneousReceipt.location = "All"
             }
             if(searchFor == ""){
                 inventoryFetch.location = '';
                 $scope.miscellaneousReceipt.location = ""
             }

             if(user_details){
                 if(user_details.sellerObject){
                     if(user_details.sellerObject.inventoryLocation){
                         // $scope.inventorySearch.filter = '';
                         inventoryFetch.location = user_details.sellerObject.inventoryLocation+'';
                         $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;

                     }
                 }
             }



             // if($scope.inventorySearch.filter && !searchFor && searchFor != ''){
             //    inventoryFetch.searchFor = $scope.inventorySearch.filter + '';
             //    inventoryFetch.searchBy = inventorySearchBy;
             //    $scope.miscellaneousReceipt.location = 'All';
             // }else if(searchFor == 'All'){
             //    $scope.miscellaneousReceipt.location = 'All';
             //    inventoryFetch.searchFor = 'All';
             // }else if(searchFor == ''){
             //    $scope.inventorySearch.filter = '';
             //    inventoryFetch.searchFor = searchFor+'';
             //    inventoryFetch.searchBy = ['location'];
             //    $scope.miscellaneousReceipt.location = '';
             // }
             // else if(searchFor){
             //     $scope.inventorySearch.filter = '';
             //     inventoryFetch.searchFor = searchFor+'';
             //     inventoryFetch.searchBy = ['location'];
             //     $scope.miscellaneousReceipt.location = searchFor;
             // }

             // console.log(inventoryFetch)



             $http.post('/dash/inventory/view/search',inventoryFetch).success(function(res){
                 // console.log("inventory data -- ", res);
                 $scope.inventory = res;
             }).catch(function(err){
                console.log(err)
             })

             $http.post('/dash/inventory/view/search/count', inventoryFetch)
                 .success(function(response){
                     console.log(response);
                     $scope.transactionCount(response,37)
                 });

             setTimeout(function(){
                 $('.refresh').css("display", "none");
             }, 1000);
         }

        //Get customer name - For inventory :: BB Foamwork
        $scope.getCustomerNameFromInventory = function(code){
            for(var i = 0; i < $scope.inventoryDealer.length; i++){
                if(Number(code) == $scope.inventoryDealer[i].Dealercode ){
                    console.log('type is : ',typeof $scope.inventoryDealer[i].DealerName);
                    if(typeof $scope.inventoryDealer[i].DealerName == 'object'){
                        return $scope.inventoryDealer[i].DealerName[0];
                    }else if(typeof $scope.inventoryDealer[i].DealerName == 'string'){
                        return $scope.inventoryDealer[i].DealerName;
                    }
                }
                else if(Number(code) == $scope.inventoryDealer[i].Stockist || code == $scope.inventoryDealer[i].Stockist )
                    return $scope.inventoryDealer[i].StockistName[0];
                else {
                    if(i == $scope.inventoryDealer.length - 1)
                        return code;
                }

            }
        }

        $scope.inventorySearchFilter = function(filter){

            var temp = '';

            if(filter == 'Receive')temp = 'receive_inventory';
            if(filter == 'Shipment')temp = 'inventory_shipment';
            if(filter == 'Transfer')temp = 'inventory_transfer';
            if(!filter)temp = '';

            $scope.inventoryTransaction = [];
            $scope.viewLength = 0;
            inventoryTransactionObj.filter = temp;
            inventoryTransactionObj.viewLength = 0;
            inventoryTransactionObj.viewBy =  initialViewBy;
            inventoryTransactionObj.searchBy = [];

            if (filter && filter != 'all') {
                $scope.inventoryStatusSelect = filter;
            }else{
                $scope.inventoryStatusSelect = '';
            }

            if(user_details){
                if(user_details.sellerObject){
                    if(user_details.sellerObject.inventoryLocation){
                        $scope.inventorySearch.filter = '';
                        inventoryTransactionObj.location = user_details.sellerObject.inventoryLocation+'';

                    }
                }
            }


            $http.post('/dash/inventory/transactions',inventoryTransactionObj).success(function(res){
                $scope.inventoryTransaction = res;
            }).catch(function(err){
                console.log(err)
            })


            $http.post('/dash/inventory/transactions/count', inventoryTransactionObj)
                .success(function(response){
                    $scope.transactionCount(response,36)
                }).catch(function(err){
                console.log(err)
            });
        }

        $scope.clearFilter = function(tab){
             $scope.showInventoryFilter = false;
             $scope.clearFilterButton(37);
         };

        $scope.clearFilterButton = function (search,tab){
            if(!search){
                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                if(tab == 36){
                    inventoryTransactionObj.viewLength = 0;
                    inventoryTransactionObj.viewBy = initialViewBy;
                    inventoryTransactionObj.searchFor = '';
                    inventoryTransactionObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = $scope.inventoryTransactionHistory;

                    if(user_details){
                        if(user_details.sellerObject){
                            if(user_details.sellerObject.inventoryLocation){
                                $scope.inventorySearch.filter = '';
                                inventoryTransactionObj.location = user_details.sellerObject.inventoryLocation+'';

                            }
                        }
                    }
                    $http.post('/dash/inventory/transactions',inventoryTransactionObj).success(function(res){
                        $scope.inventoryTransaction = res;
                    }).catch(function(err){
                        console.log(err)
                    })


                    $http.post('/dash/inventory/transactions/count', inventoryTransactionObj)
                        .success(function(response){
                            $scope.transactionCount(response,36)
                        });
                }
                else if(tab == 37){
                    inventoryObj.viewLength = 0;
                    inventoryObj.viewBy = initialViewBy;
                    inventoryObj.searchFor = '';
                    inventoryObj.searchBy = [];
                    $scope.showInventoryFilter = false;
                    $scope.miscellaneousReceipt.location = 'All';
                    $scope.inventorySearch.filter = '';
                    $scope.inventory = [];

                    if(user_details){
                        if(user_details.sellerObject){
                            if(user_details.sellerObject.inventoryLocation){
                                $scope.inventorySearch.filter = '';
                                inventoryObj.searchFor = user_details.sellerObject.inventoryLocation+'';
                                inventoryObj.searchBy = ['location'];
                                $scope.miscellaneousReceipt.location = user_details.sellerObject.inventoryLocation;
                                // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);
                                // $scope.salesPersonflag = false;
                                // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);

                            }
                        }
                    }


                    $scope.viewLength = 0;
                    $http.post('/dash/inventory/view',inventoryObj).success(function(res){
                        $scope.inventory = res;
                    }).catch(function(err){
                        console.log(err)
                    })

                    $http.post('/dash/inventory/count', inventoryObj)
                        .success(function(response){
                            $scope.transactionCount(response,37)
                        });
                }

                setTimeout(function(){
                    $('.refresh').css("display", "none");
                }, 1000);

            }
        };

        $scope.goToStocks = function(id){
            $window.location.href = '#/stocks/' +id;
        }


        $scope.refreshInventory = function(){
            if(!$scope.settings.invoice){
                $http.get("/dash/inventory/stocks")
                    .success(function (res) {
                        for(var i=0;i< res.location.length;i++){
                            if(res.location[i]._id == null){
                                res.location.splice(i, 1);
                            }
                        }

                        res.locationQty = 0;
                        res.locationAmount = 0;
                        res.dealerQty = 0;
                        res.dealerAmount = 0;
                        // console.log('res is',res.location.length)

                        if(res.location.length){
                            for(var i=0; i<res.location.length;i++){
                                res.locationQty += res.location[i].totalQty;
                                res.locationAmount += res.location[i].totalAmount;
                            }

                            for(var j=0; j<res.Dealer.length; j++){
                                res.dealerQty += res.Dealer[j].totalQty;
                                res.dealerAmount += res.Dealer[j].totalAmount;
                            }
                        }
                        $scope.stocksInventory = res;
                    })

                $scope.refreshTransactions(3);
                $scope.getWarehouseLocation();
                $scope.filterInventoryByLocation();
            }


            if($scope.settings.invoice){
                $http.get("/dash/stores")
                    .success(function (res) {
                        $scope.inventoryDealer = res;
                        // console.log($scope.inventoryDealer)
                    })

                // $http.get("/dash/inventory")
                //     .success($scope.renderInventory);

                if(!$scope.items.length)
                    $scope.clearFilter(2);
            }

            // $scope.changeInventoryView(0);
        }

        $scope.refreshInventory();

        $scope.getItemInventory = function(type,itemCode,filter){
            console.log(type)

            if(type == 'details'){
                $scope.changeInventoryButton(4);
                $scope.itemInventoryDetails = [];
                $scope.selectedItemInventory = itemCode ;
                if(typeof(itemCode) == 'object')
                    $scope.selectedItemInventory = itemCode.itemCode ;

                var itemInventoryObj = {};
                itemInventoryObj.viewLength = 0;
                itemInventoryObj.viewBy =  initialViewBy;
                itemInventoryObj.searchFor = '';
                itemInventoryObj.searchBy = [];
                itemInventoryObj.itemCode = $scope.selectedItemInventory;
                itemInventoryObj.startDate = 0;
                itemInventoryObj.endDate = 0;
                $scope.itemInventoryFilter = {};
                $scope.itemInventoryFilter.startDate = '';
                $scope.itemInventoryFilter.endDate = '';
                $scope.itemInventoryFilter.location = '';
                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            itemInventoryObj.location = user_details.sellerObject.inventoryLocation;
                            $scope.itemInventoryFilter.location = user_details.sellerObject.inventoryLocation;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);
                            $scope.salesPersonflag = false;
                            // $scope.fetchInventory(user_details.sellerObject.inventoryLocation);

                        }
                    }
                }

                // itemInventoryObj.location = filter.location||'';
                $scope.viewLength = 0;
                // console.log(itemInventoryObj)

                $http.post('/dash/inventory/item', itemInventoryObj).success(function(res){
                    // console.log(res)
                    $scope.itemInventoryDetails = res ;
                }).catch(function(err){
                    console.log(err)
                })

                $http.post('/dash/inventory/item/count', itemInventoryObj)
                    .success(function(response){
                        $scope.transactionCount(response,39)
                    });

            }else if(type == 'filter'){
                if($scope.itemInventoryFilter.startDate && $scope.itemInventoryFilter.endDate){
                    if (($scope.itemInventoryFilter.startDate - $scope.itemInventoryFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");
                        $scope.itemInventoryFilter.startDate = 0;
                        $scope.itemInventoryFilter.endDate = 0;

                    }
                }

                var itemInventoryObj = {};
                itemInventoryObj.viewLength = 0;
                itemInventoryObj.viewBy =  initialViewBy;
                itemInventoryObj.searchFor = '';
                itemInventoryObj.searchBy = [];
                itemInventoryObj.itemCode = $scope.selectedItemInventory;
                if(filter){
                    itemInventoryObj.startDate = Settings.dateFilterFormat(filter.startDate, 'start')||0;
                    itemInventoryObj.endDate = Settings.dateFilterFormat(filter.endDate, 'end')||0;
                    itemInventoryObj.location = filter.location;
                    if(filter.location == ''){
                        itemInventoryObj.location = null;
                    }
                }
                if(user_details){
                    if(user_details.sellerObject){
                        if(user_details.sellerObject.inventoryLocation){
                            $scope.itemInventoryFilter.location = user_details.sellerObject.inventoryLocation;
                            itemInventoryObj.location = user_details.sellerObject.inventoryLocation;
                            $scope.salesPersonflag = false;
                        }
                    }
                }
                $scope.viewLength = 0;

                $http.post('/dash/inventory/item', itemInventoryObj).success(function(res){
                    // console.log(res)
                    $scope.itemInventoryDetails = res ;
                }).catch(function(err){
                    console.log(err)
                })


                $http.post('/dash/inventory/item/count', itemInventoryObj)
                    .success(function(response){
                        $scope.transactionCount(response,39)
                    });

            }
        }
    })
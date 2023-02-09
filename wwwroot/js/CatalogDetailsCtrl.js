/**
 * Created by Bharat DN on 08/09/20.
 */

angular.module('ebs.controller')

    .controller("CatalogDetailCtrl",function ($scope, $rootScope, $filter, $http, $modal, $routeParams,$window, toastr,$location,Settings) {
        console.log("Hello From  Catalog Details Controller .... !!!!",$routeParams.id);

        console.log("catalog dat", Settings.getItemData());


        $scope.user = {};
        $scope.user.role = '';
        $scope.nav = [] ;

        var catItem = {};
        catItem.itemId = $routeParams.id;
        $scope.itemIdParam = $routeParams.id;

        // $scope.leadflag
        $scope.leadflag = $location.search().type;
        $scope.showleadtab = false;

        // item page declaration

        // $scope.itemListPage = true ;
        // $scope.itemAddPage = false ;
        // $scope.itemEditPage = false ;

        var masterItems = [] ;
        $scope.items = [];
        $scope.categories = [];
        $scope.subCategoriesDropDown = [];
        $scope.subSubCategoriesDropDown = [];
        $scope.newItemImageArray = {};
        $scope.newItemImageArray.itemImage = [];
        $scope.itemSelectAll = {};
        $scope.itemSelectAll.category = true;
        $scope.itemSelectAll.subCategory = true;
        $scope.itemSelectAll.subSubCategory = true;
        $scope.itemFilterSubSubCategories = [];
        $scope.newItem = {} ;
        $scope.edit = {};
        $scope.editedItem = {};

        $scope.itemSearch = {};
        $scope.priceListView = {};
        var instanceDetails =  Settings.getInstance();

        $scope.masterPriceList = instanceDetails.masterPriceList;
        $scope.country = {};
        $scope.country.name = instanceDetails.country || 'India';
        $scope.tempCountryName = $scope.country.name.toLowerCase();
        $scope.price = {};
        $scope.tagsNewArray=[];
        $scope.disableFlag = false;
        $scope.allTags=[];

        var viewBy = {};
        viewBy.items = 12;
        var initialViewBy = 60;
        $scope.newViewBy = 10;
        $scope.viewLength = 0;
        var itemSearchBy = ['itemCode', 'Product', 'Manufacturer', 'subCategory','subSubCategory'];
        var itemSearchObj = {};
        itemSearchObj.viewLength = 0;
        itemSearchObj.viewBy = initialViewBy;
        itemSearchObj.searchBy = [];
        itemSearchObj.searchFor = '';
        $scope.filterBy  = 'All';
        $scope.itemSearch.filter = '';
        $scope.itemSearch.filterBy = '';
        $scope.dealerClasses = [];
        $scope.masterPriceList = [];
        $scope.priceListName = ['master'];
        $scope.item= {};
        $scope.item.category_selected = '';
        $scope.item.subCategory_selected = '';
        $scope.item.subSubCategory_selected = '';
        $scope.priceListView.filter='master' ;
        $scope.showProdDes = true;
        $scope.tax = []; //Holds array of tax objects
        var defaultTaxObj = {}; //Has default tax object..

        $scope.categoryFilterFlag = false ;
        $scope.subCategoryFilterFlag = false ;
        $scope.subSubCategoryFilterFlag = false ;
        $scope.EditTagsArray=[];
        // $scope.tagsArray=[];
        $scope.DisplayShopifyButton = false;
         $scope.percentageDiscountFlag=false;
        $scope.percentageDiscountFlag=instanceDetails.percentageDiscount;
        console.log($scope.percentageDiscountFlag);


        //Ghana tax
        $scope.ghanaTax = {
            NHIL:2.5,
            GETL:2.5,
            VAT:15.9,
            VAT_VAL: 15
        };

        $scope.currencySet = Settings.getInstanceDetails('currency');

        var userRole = '';
        Settings.getUserInfo(function(user_details){
            if(user_details.role){
                userRole = user_details.role.toLowerCase();
            }

        });

        console.log("catalog", catItem);
        console.log("catalog", catItem.itemId);

        $http.get('/dash/item/details/'+ catItem.itemId)
            .success(function (catDetailsResponse) {
                console.log("catalog single response ",catDetailsResponse);
                $scope.CatagoryDetails = catDetailsResponse[0];
                Object.assign($scope.editedItem, $scope.CatagoryDetails)
                $scope.itemsColname( $scope.CatagoryDetails);

                console.log("catalog single response ", $scope.CatagoryDetails);
                console.log("get sales org details");
                console.log($scope.CatagoryDetails.product_id);
                $http.get("/dash/customerItems/"+ $scope.CatagoryDetails.product_id).success(function (res) {
                    console.log("sales org details");
                    console.log(res);
                    $scope.salesOrg = res;
                });
            })


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


        jQuery.noConflict();
        $('.refresh').css("display", "inline");

        $http.get("/dash/items")
            .success(function (response) {
                masterItems = response ;
                console.log("master items",masterItems)
                
                

            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });
        





        $scope.renderInstanceDetails = function (response) {
            console.log("Instance Details for Items  -->");
            console.log(response);
            $scope.taxSetup = response.taxSetup? (response.taxSetup.activate == false? false : true) : true;
            $scope.taxExclusive = response.tax? (response.taxExclusive ? response.taxExclusive : false) : false;
            $scope.goalsConfigArray = response.goalsConfig ? response.goalsConfig : {};
            $scope.tax = response.tax ? response.tax : [];
            $scope.otherTax = response.otherTax ? response.otherTax : [];
            $scope.otherTaxDefault = {};
            $scope.coID = response.coID;
            if($scope.otherTax.length){
                for(var j=0; j< $scope.otherTax.length; j++){
                    if($scope.otherTax[j].default){
                        $scope.otherTaxDefault = $scope.otherTax[j];
                    }
                }
            }

            $scope.otherTaxDefalt = response.other
            $scope.taxObj = response.taxObj ? response.taxObj : [];

            if($scope.taxObj){

                if($scope.taxObj.setupType == 'india'){
                    $scope.taxSetups.indiaSetup = 'india';

                }else if($scope.taxObj.setupType == 'other'){
                    $scope.taxSetups.otherSetup = 'other';
                }
            }


            for(var i=0; i< $scope.tax.length;i++){
                if($scope.tax[i].default)
                    defaultTaxObj = $scope.tax[i];
            }

            if(response.addItems != undefined)
                $scope.addItems = response.addItems;
            else $scope.addItems = false;


            if(response.dealerClass){
                $scope.dealerClasses = response.dealerClass ;
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }
                for(var i =0 ; i< $scope.dealerClasses.length;i++){
                    $scope.priceListName.push($scope.dealerClasses[i].priceList)
                }
                var unique = $scope.priceListName.filter( onlyUnique );
                $scope.priceListName = unique ;
                // console.log($scope.priceListName)
            }
            if(response.masterPriceList){
                $scope.masterPriceList = response.masterPriceList;
            }

        };

        $scope.notEmptyOrNull = function(item){
            return !(item._id === null || item._id.trim().length === 0)
        };

        $http.get("/dash/instanceDetails")
            .success($scope.renderInstanceDetails);


        $http.get("/dash/nav")
            .success(function(response){
                $scope.nav = response;
                console.log("response",response);
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
        };


        $scope.getAllCategories = function(param,type){

            $http.post("/dash/items/filter/"+type, {viewBy : 0})
                .success(function(category){
                    
                    $scope.itemFilterCategories = category ;
                    $scope.itemCategories = category;

                    // $scope.itemCategories = $scope.itemCategories.filter(function( obj ) {
                    //     return obj._id !== 'DEFAULT';
                    // })
                    console.log(category)
                    // $scope.itemCategories.map(function (item) {
                    //
                    //     if($scope.itemSelectAll.category){
                    //         item.selected_category = param;
                    //     }else{
                    //         item.itemCategories = true;
                    // }
                    //     return item;
                    // })

                })
        };


        $scope.getAllSubCategories = function(param,type){
            $http.post("/dash/items/filter/"+type, {viewBy : 0})
                .success(function(subCategory){

                    $scope.itemSubCategories = subCategory;
                    $scope.itemFilterSubCategories = subCategory;

                    $scope.itemSubCategories = $scope.itemSubCategories.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    })

                    // $scope.itemSubCategories.map(function (item) {
                    //
                    //     if($scope.itemSelectAll.category){
                    //         item.selected_subCategory = false;
                    //
                    //     }else{
                    //         item.itemSubCategories = false;
                    //         $scope.itemSubCategories = [];
                    //     }
                    //     return item;
                    // })

                })
        };


        $scope.getAllSubSubCategories = function(param,type){
            $http.post("/dash/items/filter/"+type, {viewBy : 0})
                .success(function(subSubCategory){
                    $scope.itemSubSubCategories = subSubCategory;

                    $scope.itemFilterSubSubCategories = subSubCategory;

                    $scope.itemSubSubCategories = $scope.itemSubSubCategories.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    });

                    if($scope.itemSubSubCategories.length ==1){
                        if($scope.itemSubSubCategories[0]._id == null){
                            $scope.itemSubSubCategories = [];
                        }
                    }
                    // $scope.itemSubSubCategories.map(function (item) {
                    //
                    //     if($scope.itemSelectAll.category && $scope.itemSelectAll.subCategory){
                    //         item.selected_subSubCategory = false;
                    //
                    //     }else{
                    //         item.itemSubSubCategories = true
                    //         $scope.itemSubSubCategories = [];
                    //     }
                    //     return item;
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

        $scope.getAllTags = function(param,type){
            $http.post("/dash/items/filter/"+type, {viewBy : 0})
                .success(function(tags){
                    var tempTagsArray=[];
                    $scope.allTags=[];
                    $scope.tagsFilter=[]
                    var uniqueArray=[];

                    for(var i=0;i<tags.length;i++) {
                        for(var j=0; j<tags[i]._id.length;j++){
                            tempTagsArray.push(tags[i]._id[j]);

                        }
                    }
                    if(tempTagsArray.length){
                        $.each(tempTagsArray, function(i, el){
                            if($.inArray(el, uniqueArray) === -1)
                            {uniqueArray.push(el);}
                        });
                        // for( var k=0; k <tempTagsArray.length; k++){
                        //     if(uniqueArray.indexOf(tempTagsArray[k]) === -1) {
                        //         uniqueArray.push(tempTagsArray[k]);
                        //     }
                        // }
                        //
                        // // console.log(uniqueArray);
                        if(uniqueArray.length){
                            for(var l=0;l<uniqueArray.length;l++){
                                $scope.allTags.push({tagname:uniqueArray[l],isselected:false});
                                $scope.tagsFilter=$scope.allTags;



                            }

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
        };
        $scope.FilterByTag= function(tag,index){
            var tempArray=[];
            for (var i = 0; i < $scope.allTags.length; i++) {
                if (index === i && $scope.allTags[i].isselected==false) {
                    $scope.allTags[i].isselected = true;
                    // $scope.tagsNewArray.push($scope.allTags[i].tagname);

                }
                else if(index === i && $scope.allTags[i].isselected==true){
                    $scope.allTags[i].isselected = false;
                    // $scope.tagsNewArray.splice(index,1);


                }
                if($scope.allTags[i].isselected==true){
                    tempArray.push($scope.allTags[i].tagname);

                }

            }
            itemSearchObj.viewLength = 0;
            itemSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.items;

            $scope.items = [];




            itemSearchObj.filterByTags = tempArray;
            // itemSearchObj.searchBy = itemSearchBy;


            $http.post("/dash/items",itemSearchObj)
                .success(function(response) {

                    $scope.renderItems(response);
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            $http.post('/dash/item/count', itemSearchObj)
                .success(function(response){
                    $scope.transactionCount(response,2);
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
            $scope.showItemFilter = true;




        }

        $scope.filterBasedOnCategory=function(category,type){
            var tempCategory = [];
            for(var i=0;i< masterItems.length;i++){
                if(masterItems[i].Manufacturer == category){
                    tempCategory.push(masterItems[i]);
                }
            }
            if(type == 'add'){

                $scope.addItemSubCategory = tempCategory.unique('subCategory');
                $scope.newItem.subCategory = 'DEFAULT' ;
                if($scope.itemsDisp){
                    $scope.itemsDisp.itemSubCategories = tempCategory.unique('subCategory') ;
                }
            }
            else if (type == 'edit'){
                $scope.editedItem.subCategory = 'DEFAULT' ;
                if($scope.itemsDisp){
                    $scope.itemsDisp.itemSubCategories = tempCategory.unique('subCategory') ;
                }
            }

            setTimeout(function(){
                $scope.$digest();
            }, 1000);
        };

        $scope.fetchOnlySubCatDropDown = function(data,type, subtype){
            // console.log(data)
            // console.log(type)
            var tempObj = {};
            tempObj = data;

            $http.post("/dash/items/category/sub", tempObj).success(function(res) {
                // console.log("res of subcat======",res);
                // $scope.subCategoriesDropDown = [];
                if(type == 'add'){
                    $scope.subCategoriesDropDown =  res;
                    $scope.subCategoriesDropDown = $scope.subCategoriesDropDown.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    });

                    $scope.newItem.subCategory = "DEFAULT" ;
                    $scope.newItem.subSubCategory = "DEFAULT";
                    $scope.subSubCategoriesDropDown = [];
                }
                else if (type == 'edit'){
                    $scope.subCategoriesDropDown =  res;
                    $scope.subCategoriesDropDown = $scope.subCategoriesDropDown.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    });
                    $scope.subSubCategoriesDropDown = [];
                    if(subtype == 'editView'){
                        $scope.editedItem.subCategory = tempObj.subCategory || 'DEFAULT';
                    }else{
                        $scope.editedItem.subCategory = "DEFAULT" ;
                    }
                    // $scope.editedItem.subSubCategory = "" ;
                }

                // console.log($scope.editedItem.subCategory)
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


        $scope.fetchOnlySubSubCatDropDown = function(data,type, subType){
            var tempObj = {};
            tempObj = data;

            $http.post("/dash/items/category/sub/sub", tempObj).success(function(res) {
                // $scope.subCategoriesDropDown = [];
                if(type == 'add'){
                    $scope.subSubCategoriesDropDown =  res;
                    $scope.subSubCategoriesDropDown = $scope.subSubCategoriesDropDown.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    });
                    $scope.newItem.subSubCategory = "DEFAULT" ;
                }
                else if (type == 'edit'){
                    $scope.subSubCategoriesDropDown = res;
                    $scope.subSubCategoriesDropDown = $scope.subSubCategoriesDropDown.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    });
                    if(subType == 'editView'){
                        $scope.editedItem.subSubCategory = tempObj.subSubCategory || 'DEFAULT';
                    }else{
                        $scope.editedItem.subSubCategory = 'DEFAULT';
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
        };

        $scope.refreshTransactions = function(tab){
            $scope.displayDealerRefresh = false;

            jQuery.noConflict();
            $('.refresh').css("display", "inline");


            $scope.clearFilter(2);


            setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 2000);
        };

        $scope.renderItems = function (items_list,type) {

            if($scope.coID == 'GLGR'){
                $scope.items = [];
            }

            //   console.log(items_list);
            var obj = [];

            if($scope.user.role == 'Dealer'){
                console.log("dealer")
                $http.get("/dash/store/details/"+$scope.user.sellerphone)
                    .success(function(dealer){
                        if($scope.coID != 'GLGR') {
                            if(!dealer.length){
                                Settings.alertPopup("ERROR", "This Customer might have been removed or Not added");
                            }
                            console.log('dealer.length',dealer.length);
                            if(dealer.length)
                                $http.get('dash/customprice/' + dealer[0].Dealercode)
                                    .success(function (pricelist) {
                                        console.log("Custom prices : " + pricelist.length)
                                        $scope.items_count = pricelist.length;
                                        dealerItemsCount = pricelist.length;
                                        if (pricelist.length < $scope.newViewBy) {
                                            $scope.newViewBy = pricelist.length;
                                            dealerNewViewBy = pricelist.length;
                                        }

                                        $scope.customPrices = pricelist;

                                        if (pricelist.length > 0) {
                                            console.log("Populating Custom price list")
                                            for (var i = 0; i < pricelist.length; i++) {
                                                $scope.items.push(pricelist[i])
                                            }
                                            $scope.itemsInModal = $scope.items;
                                            // $scope.renderItemsMrp();
                                            var selectedPriceList = 'master';
                                            if ($scope.dealerClasses && $scope.dealerClasses.length && dealer[0].class) {
                                                for (var i = 0; i < $scope.dealerClasses.length; i++) {
                                                    if ($scope.dealerClasses[i].name.toLowerCase() == dealer[0].class.toLowerCase()) {
                                                        selectedPriceList = $scope.dealerClasses[i].priceList;
                                                    }
                                                }
                                            }
                                            $scope.priceListFilter(selectedPriceList);
                                        }
                                        else {
                                            console.log("Showing all items")
                                            for (var i = 0; i < items_list.length; i++) {
                                                items_list[i].inventory.forEach(function (item) {
                                                    items_list[i].totalInventory += item.Qty;
                                                });
                                                if( !items_list[i].trackInventory && items_list[i].trackInventory !== false){
                                                    items_list[i].trackInventory = true;
                                                }else{
                                                    items_list[i].trackInventory = items_list[i].trackInventory;
                                                }
                                                $scope.items.push(items_list[i])

                                            }
                                            $scope.itemsInModal = $scope.items;
                                            console.log("scope of items",$scope.items)
                                            // $scope.renderItemsMrp();

                                        }
                                    })
                        }
                        else{
                            //.... tecknovate items....
                            console.log("Showing all items")
                            for (var i = 0; i < items_list.length; i++) {
                                items_list[i].inventory.forEach(function (item) {
                                    items_list[i].totalInventory += item.Qty;
                                });
                                if( !items_list[i].trackInventory && items_list[i].trackInventory !== false){
                                    items_list[i].trackInventory = true;
                                }else{
                                    items_list[i].trackInventory = items_list[i].trackInventory;
                                }

                                $scope.items.push(items_list[i])
                            }
                            $scope.itemsInModal = $scope.items;
                            var selectedPriceList = 'master';
                            if ($scope.dealerClasses && $scope.dealerClasses.length && dealer[0].class) {
                                for (var i = 0; i < $scope.dealerClasses.length; i++) {
                                    if ($scope.dealerClasses[i].name.toLowerCase() == dealer[0].class.toLowerCase()) {
                                        console.log($scope.dealerClasses[i].priceList);
                                        selectedPriceList = $scope.dealerClasses[i].priceList;
                                    }
                                }
                            }
                            $scope.priceListFilter(selectedPriceList);
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
            else{
                for(var i=0; i< items_list.length; i++){
                    items_list[i].customPricelist = [];
                    items_list[i].totalInventory = 0;
                    items_list[i].inventory.forEach( function(item) {
                        items_list[i].totalInventory += item.Qty;
                    });
                    if($scope.priceListName){
                        for(var k = 0;k < $scope.priceListName.length;k++ ){
                            if($scope.priceListName[k] != 'master'){
                                if ( typeof items_list[i][$scope.priceListName[k]] !== 'undefined' &&  items_list[i][$scope.priceListName[k]] != null) {
                                    if( typeof items_list[i][$scope.priceListName[k]] == "string"){
                                        items_list[i].customPricelist.push({
                                            itemCode:items_list[i].itemCode,
                                            name:$scope.priceListName[k],
                                            price: null ,
                                            status: false
                                        })
                                    }
                                    else{
                                        items_list[i].customPricelist.push({
                                            itemCode:items_list[i].itemCode,
                                            name:$scope.priceListName[k],
                                            price: items_list[i][$scope.priceListName[k]],
                                            status: true
                                        })
                                    }
                                }
                                else{
                                    items_list[i].customPricelist.push({
                                        itemCode:items_list[i].itemCode,
                                        name:$scope.priceListName[k],
                                        price: null ,
                                        status: false
                                    })
                                }
                            }
                        }

                    }
                    if( !items_list[i].trackInventory && items_list[i].trackInventory !== false){
                        items_list[i].trackInventory = true;
                    }else{
                        items_list[i].trackInventory = items_list[i].trackInventory;
                    }




                    $scope.items.push(items_list[i])
                    if(items_list[i].subCategory){
                        obj.push(items_list[i]);
                    }
                }
                $scope.itemsInModal=$scope.items;
                // $scope.renderItemsMrp();

            }

            setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 2000);



        };



        $http.post("/dash/items", itemSearchObj)
            .success($scope.renderItems);

        $scope.refreshItems = function () {
            $http.post("/dash/items", itemSearchObj)
                .success($scope.renderItems);
        }


        $scope.clearFilter = function(tab){
            itemSearchObj.viewLength = 0;
            itemSearchObj.viewBy = initialViewBy;
            itemSearchObj.searchFor = '';
            itemSearchObj.searchBy = [];
            itemSearchObj.searchBySubCategory = [];
            itemSearchObj.searchBySubSubCategory = [];
            itemSearchObj.searchCategory = [];
            itemSearchObj.filterByTags = [];

            $scope.itemFilterBy('');

            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.items;
            $scope.itemSearch.filter = '';
            $scope.itemSearch.priceList = '';
            $scope.priceListView.filter='master' ;
            $scope.priceListfilter = false ;
            $scope.items = [];

            $scope.showItemFilter = false;

            $scope.itemSelectAll.category = true;

            $http.post("/dash/items",itemSearchObj)
                .success(function(response) {

                    $scope.renderItems(response);
                    
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
            

            $http.post('/dash/item/count', itemSearchObj)
                .success(function(response){
                    $scope.transactionCount(response,2)
                }).error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            $scope.getAllCategories(true,'category');
            $scope.getAllSubCategories(true,'subCategory');
            $scope.getAllSubSubCategories(true,'subSubCategory');
            $scope.getAllTags(true,'tags');

        };

        var a = 0;
        $scope.navPage = function(tab, direction){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;

            if(direction){
                console.log("NEXT");

                if(viewLength + viewBy >= $scope.items.length){
                    if(viewLength + viewBy < $scope.items_count){
                        $scope.displayloader = true
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        itemSearchObj.viewLength = viewLength;
                        itemSearchObj.viewBy = initialViewBy;
                        itemSearchObj.searchFor = $scope.itemSearch.filter;
                        itemSearchObj.searchBy = itemSearchBy;

                        jQuery.noConflict();
                        $('.refresh').css("display", "inline");
                        $http.post("/dash/items",itemSearchObj)
                            .success(function(response){
                                console.log(response,"response")

                                $scope.renderItems(response,'Manufacturer');

                                if(viewLength + viewBy > $scope.items_count){
                                    a = viewLength + viewBy - $scope.items_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                                $scope.viewLength = viewLength;
                                $scope.displayloader = false;

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
                        if(viewLength + viewBy > $scope.items_count){
                            a = viewLength + viewBy - $scope.items_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    //console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.items_count){
                        a = viewLength + viewBy - $scope.items_count;
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
                    if(viewLength + viewBy >= $scope.items_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.transactionCount = function(response, tab){
            // console.log(response);
            if(response){
                if(response > viewBy.items){
                    $scope.items_count = response;
                    $scope.viewLength = 0;
                    $scope.newViewBy = viewBy.items;
                }
                else if(response <= viewBy.items){
                    $scope.items_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.items = [];
                    $scope.newViewBy = 1;
                    $scope.items_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.items = [];
                $scope.newViewBy = 1;
                $scope.items_count = 0;
                $scope.viewLength = -1;
            }
        };

        $scope.clearFilterButton = function (search,tab) {
            if (search === '') {

                itemSearchObj.viewLength = 0;
                itemSearchObj.viewBy = initialViewBy;
                itemSearchObj.searchFor = '';
                itemSearchObj.searchBy = [];

                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.items;
                $scope.itemSearch.filter = '';
                $scope.itemSearch.priceList = '';
                $scope.items = [];

                $http.post('/dash/items', itemSearchObj)
                    .success($scope.renderItems);

                $http.post('/dash/item/count', itemSearchObj)
                    .success(function (response) {
                        $scope.transactionCount(response, 2)
                    }).error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });



                $scope.showItemFilter = false;

                $scope.getAllCategories(true,'category');
                $scope.getAllSubCategories(true,'subCategory');
                $scope.getAllTags(true,'tags');

            }
        };

        $scope.itemSearchFilter = function(){
            if($scope.itemSearch.filter == ''){
                bootbox.alert({
                    title: 'Warning',
                    message : "Please type text in search box"
                })
            }
            else{
                itemSearchObj.viewLength = 0;
                itemSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.items;

                $scope.items = [];

                if($scope.itemSearch.filter){
                    itemSearchObj.searchFor = $scope.itemSearch.filter;
                    itemSearchObj.searchBy = itemSearchBy;
                }

                $http.post('/dash/items', itemSearchObj)
                    .success($scope.renderItems);

                $http.post('/dash/item/count', itemSearchObj)
                    .success(function(response){
                        $scope.transactionCount(response,2)
                    }).error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
                $scope.showItemFilter = true;
            }
        };

        $http.post("/dash/item/count", itemSearchObj)
            .success(function(response){
                $scope.transactionCount(response,2)
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

        $scope.trial31 = function (i) {
            // alert()
            $scope.items = $scope.items18;
            $scope.itemSearch.filter = '';
            $scope.viewby = i;
            $scope.totalItems = $scope.items.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;
            $scope.case3Length = $scope.items.length;
        };

        $scope.changeItemButton = function (flag) {
            if (flag == 0) {
                // console.log('back') ;
                // $scope.itemListPage = true ;
                // $scope.itemAddPage = false ;
                // $scope.itemEditPage = false ;
                if($scope.allTags.length){
                    for(var i=0;i<$scope.allTags.length;i++){
                        $scope.allTags[i].isselected=false;
                    }
                }


                // $scope.newItem = {};
                // $scope.newItem.Area = '';
                // $scope.newItem.City  = '';
                // $scope.newItemImageArray.itemImage = [];
                // $scope.subCategoriesDropDown = [];
                // $scope.itemEdit = false ;
                // $scope.itemEdit = false ;
                // $scope.addItemButton = true;
            }
            else if (flag == 1){
                // $scope.itemListPage = false ;
                // $scope.itemAddPage = true ;
                // $scope.disableFlag = false;
                document.getElementById('submitbutton').disabled = false;
                $scope.newItem = {};
                $scope.newItem.MRP = '';
                $scope.newItem.Qty = '';
                $scope.newItem.Specials = '';
                $scope.newItem.trackInventory = true;
                $scope.newItem.gst = defaultTaxObj;
                $scope.newItem.Manufacturer = 'DEFAULT';
                $scope.newItem.subCategory = 'DEFAULT';
                $scope.newItem.subSubCategory = 'DEFAULT';
                $scope.subCategoriesDropDown = [];
                $scope.subSubCategoriesDropDown = [];
                $scope.addItemSubCategory = [];
                $scope.newItemImageArray = {};
                $scope.addItemSubSubCategory = [];
                $scope.newItemImageArray = {};
                $scope.newItemImageArray.itemImage = [];
                $scope.tagsNewArray=[];
                // $scope.subCategoriesDropDown.push(temp);
                // $scope.subSubCategoriesDropDown.push(temp);
                // $scope.itemEdit = true ;
                $scope.newItem.looseQty =  true;
                $scope.addItemButton = false;
                $(".preview-image").remove();
                $("#pro-image").val('');
                newimage = [];
                removeImageindex= [];
                num = 0 ;
                $scope.getAllTags(true,'tags');


                // $scope.formItem.addItem.$setPristine();
                // $scope.formItem.addItem.$setUntouched();

                // console.log($scope.subCategoriesDropDown)


                // $http.post("/dash/items",itemSearchObj)
                //     .success(function(response) {
                //
                //         $scope.renderItems(response);
                //     });
                //
                // $http.post('/dash/item/count', itemSearchObj)
                //     .success(function(response){
                //         $scope.transactionCount(response,2)
                //     });

                $scope.getAllCategories(true,'category');
                // $scope.getAllSubCategories(true,'subCategory');
                // $scope.getAllSubSubCategories(true,'subSubCategory');

                $http.get("/dash/get/recentID/item")
                    .success(function (res) {

                        if(res.itemCode){
                            $scope.itemcodetemp = 1001;
                            $scope.itemcodetemp = res.itemCode + 1;
                            $scope.newItem.itemCode = res.itemCode + 1;
                        }else{
                            $scope.newItem.itemCode = 1001;
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
            else if (flag == 2){
                // console.log('edit')
                // $scope.itemListPage = false ;
                // $scope.itemEditPage = true ;
                // $scope.getAllTags(true,'tags');



            }
        };



        $scope.appendImageToItem = function(type, operation, index){
            /*
             Function to upload or remove an image of customer or customer document while adding it from portal

             type = Customer image or customer document image
             operation = add or remove an image
             index = used while removing an image from array

             */
            console.log(index);
            if(operation == 'add'){
                var image = (document.getElementById('addNewItemImage').files);

                if(image[0]){
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var tempObj = {};
                        tempObj.image = reader.result;
                        tempObj.date = new Date()+"";
                        tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                        tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);

                        tempObj.name = image[0].name ? image[0].name : "Item Image";
                        $scope.newItemImageArray.itemImage.push(tempObj);

                        jQuery.noConflict();
                        $('#addNewItemImage').val(null);

                        $scope.$apply();
                    }
                    reader.readAsDataURL(image[0]);
                }
                else{
                    Settings.failurePopup('Error','Please select an image');

                    // bootbox.alert({
                    //     title : "ERROR",
                    //     message : "Please select an image",
                    //     className : "text-center"
                    // })
                }
            }
            else if(operation == 'del'){

                for(var i=0; i< $scope.newItemImageArray.itemImage.length ; i++)
                {
                    if(i == index){
                        $scope.newItemImageArray.itemImage.splice(index, 1);
                    }
                }
            }


        };


        $scope.itemsColname = function (j) {

            console.log("itemscolname",j);
            if(j) {
                $scope.showProdDes(j)
                $scope.itemsDisp = j;
                $scope.itemsDisp.Manufacturer = j.Manufacturer || 'DEFAULT';
                $scope.itemsDisp.subCategory = j.subCategory || 'DEFAULT';
                $scope.itemsDisp.subSubCategory = j.subSubCategory || 'DEFAULT';
                $scope.itemsDisp.tags = j.tags ;
                $scope.edit = {};
                $scope.editedItem.itemCode = j.itemCode ;
                $scope.editedItem.Product = j.Product;
                $scope.editedItem.Manufacturer = j.Manufacturer || 'DEFAULT';
                $scope.editedItem.subCategory = j.subCategory || 'DEFAULT';
                $scope.editedItem.subSubCategory = j.subSubCategory || 'DEFAULT';
                $scope.editedItem.MRP = j.MRP;
                $scope.editedItem.Specials = j.Specials;
                $scope.editedItem.Pack = j.Pack;
                $scope.editedItem.Qty = j.Qty;
                $scope.editedItem.unit = j.unit ;
                $scope.editedItem.DealerPrice = j.DealerPrice ;
                $scope.editedItem.BulkPrice = j.BulkPrice ;
                $scope.editedItem.looseQty = j.looseQty ;
                $scope.editedItem.publish = j.publish ;
                $scope.editedItem.newImages = [];
                $scope.editedItem.presentImages = [];
                $scope.editedItem.hsn_code = j.hsn_code || '';
                $scope.editedItem.release_status = j.release_status || '';
                $scope.editedItem.product_category_id = j.product_category_id || '';
                $scope.editedItem.customer_group = j.customer_group || '';
                $scope.editedItem.order_type = j.order_type || '';




                // $scope.editedItem.Tag='';
                // $scope.editedItem.tags=[];

                // $scope.getAllTags(false,'tags');

                if( !j.trackInventory && j.trackInventory != false){
                    $scope.itemsDisp.trackInventory = true;
                    $scope.editedItem.trackInventory = true;
                }else{
                    $scope.editedItem.trackInventory = j.trackInventory;
                    $scope.itemsDisp.trackInventory = j.trackInventory;
                }
                

                if(j.tags){




                    for(var k=0;k<j.tags.length;k++){
                        for(var l=0;l<$scope.allTags.length;l++){
                            if(j.tags[k]==$scope.allTags[l].tagname){
                                $scope.allTags[l].isselected=true;

                            }

                        }



                    }

                }




                if(j.gst){
                    $scope.editedItem.gst = j.gst ;
                }else{
                    $scope.editedItem.gst = {};
                    $scope.editedItem.gst.cgst = j.CGST;
                    $scope.editedItem.gst.sgst = j.SGST;
                    $scope.editedItem.gst.igst = j.IGST;
                }

                if($scope.priceListName.length){
                    for(var i=0 ; i < $scope.priceListName.length ; i++){
                        if($scope.priceListName[i].toUpperCase() != "MASTER")
                            $scope.editedItem[$scope.priceListName[i]] = (j[$scope.priceListName[i]] || j[$scope.priceListName[i]] === 0)?j[$scope.priceListName[i]]:null ;
                    }
                }

                $scope.fetchOnlySubCatDropDown(j,'add');
                $scope.fetchOnlySubSubCatDropDown(j,'add');

                // $scope.filterBasedOnCategory(j.Manufacturer,'add') ;

                jQuery.noConflict();
                $('#uploadItemImage').val(null);


                if(j.cloudinaryURL){
                    if(typeof(j.cloudinaryURL) == 'string'){
                        var url = j.cloudinaryURL;
                        $scope.itemsDisp.cloudinaryURL = [];
                        $scope.itemsDisp.cloudinaryURL = [{'image' : url}];
                        $scope.editedItem.cloudinaryURL = [];
                        $scope.editedItem.cloudinaryURL = [{'image' : url}];
                        $scope.editedItem.presentImages = angular.copy($scope.editedItem.cloudinaryURL)
                    }
                    else{
                        $scope.editedItem.cloudinaryURL = j.cloudinaryURL ;
                        $scope.editedItem.presentImages = angular.copy($scope.editedItem.cloudinaryURL)
                    }

                }else{
                    $scope.itemsDisp.cloudinaryURL = [];
                    $scope.editedItem.cloudinaryURL = [];
                }
            }
        };
        $scope.showProdDes = function (response){
            if(response.Pack === "" || response.Pack === undefined || response.Pack === null) {
               $scope.showProdDes = false;
           }
       }

    //    $scope.itemsColname( $scope.CatagoryDetails);

        //Edit Item Details
        $scope.editItemDetails = function(item){
            if(item.Product != '' && item.Product != undefined){
                if(item.MRP != '' && item.MRP != null && item.MRP != 0){
                    if($scope.priceListName.length){
                        if($scope.priceListName.length > 1){
                            item.customPriceList = {} ;
                            for(var i = 0 ; i< $scope.priceListName.length ;i++){
                                if($scope.priceListName[i].toUpperCase() != 'MASTER'){
                                    item.customPriceList[$scope.priceListName[i]] = item[$scope.priceListName[i]] ;
                                }
                            }
                        }
                    }


                    if(itemEditimage.length){
                        var checkFlag = false ;
                        for(var i = 0; i < itemEditimage.length; i++){
                            var tempObj ={};
                            if(itemeditremoveImageindex.length){
                                checkFlag = itemeditremoveImageindex.includes(i) ;
                                if(!checkFlag){
                                    tempObj.itemCode = item.itemCode;
                                    tempObj.image = itemEditimage[i][0].image;
                                    tempObj.date = new Date()+"";
                                    tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                                    tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);
                                    tempObj.name = itemEditimage[i][0].name ? itemEditimage[i][0].name : "Item Image";
                                    item.newImages.push(tempObj)
                                }
                            }
                            else{
                                tempObj.itemCode = item.itemCode;
                                tempObj.image = itemEditimage[i][0].image;
                                tempObj.date = new Date()+"";
                                tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                                tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);
                                tempObj.name = itemEditimage[i][0].name ? itemEditimage[i][0].name : "Item Image";
                                item.newImages.push(tempObj)
                            }
                        }
                    }
                    item.cloudinaryURL = item.presentImages;
                    var tagsArray=[];
                    if($scope.allTags.length){
                        for(var j=0;j<$scope.allTags.length;j++){
                            if($scope.allTags[j].isselected==true){
                                tagsArray.push($scope.allTags[j].tagname);
                            }

                        }

                    }




                    item.tags=tagsArray;




                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");

                    $http.put('/dash/items/edit', item)
                        .success(function(res){
                            if(res){
                                itemSearchObj.viewLength = 0;
                                itemSearchObj.viewBy = initialViewBy;
                                itemSearchObj.searchBy = [];
                                itemSearchObj.searchFor = '';
                                var i = masterItems.findIndex(function(element) {
                                    return element.itemCode == item.itemCode;
                                });

                                if(i >= 0){
                                    masterItems[i].Product = item.Product ;
                                    masterItems[i].Manufacturer = item.Manufacturer ;
                                    masterItems[i].subCategory = item.subCategory ;
                                    masterItems[i].subSubCategory = item.subSubCategory ;
                                    masterItems[i].MRP = item.MRP ;
                                    masterItems[i].Specials = item.Specials ;
                                    masterItems[i].Pack = item.Pack ;
                                    masterItems[i].Qty = item.Qty ;
                                    masterItems[i].gst = item.gst ;
                                    masterItems[i].DealerPrice = item.DealerPrice ;
                                    masterItems[i].hsn_code = item.hsn_code;
                                }

                                $http.post("/dash/items", itemSearchObj)
                                    .success($scope.renderItems);

                                $http.post("/dash/item/count", itemSearchObj)
                                    .success(function(response){
                                        Settings.successPopup("Success",item.Product+' details updated');
                                        // Settings.success_toast('Success','Item Saved Successfully');
                                        // toastr.success("Item Saved Successfully")
                                        $window.location.href = '#/catalog';
                                    }).error(function(error, status){
                                    console.log(error, status);
                                    if(status >= 400 && status < 404)
                                        $window.location.href = '/404';
                                    else if(status >= 500)
                                        $window.location.href = '/500';
                                    else
                                        $window.location.href = '/404';
                                });

                                setTimeout(function(){
                                    $('.refresh').css("display", "none");
                                }, 1000);

                                if(item.newImages.length){
                                    for(var i = 0;i<item.newImages.length;i++){
                                        item.cloudinaryURL.push(item.newImages[i])
                                    }
                                }

                                $scope.refreshTransactions();
                                $scope.itemsDisp = item ;
                                $scope.edit.item = false ;


                            }
                            else{
                                setTimeout(function(){
                                    $('.refresh').css("display", "none");
                                }, 1000);
                                Settings.failurePopup("Error",'Error while updating Item');
                                // bootbox.alert("Error while updating Item")
                            }
                        })
                }
                else{
                    Settings.failurePopup("Error",'Enter a valid MRP');
                }
            }
            else{
                Settings.failurePopup("Error",'Enter a valid Product Name');
            }
        };

        //Add Tags to an Item on edit
        $scope.AddTag=function(item,index,flag){
            if(!flag){
                for (var i = 0; i < $scope.allTags.length; i++) {
                    if (index === i && $scope.allTags[i].isselected==false) {
                        $scope.allTags[i].isselected = true;
                        // $scope.tagsNewArray.push($scope.allTags[i].tagname);

                    }
                    else if(index === i && $scope.allTags[i].isselected==true){
                        $scope.allTags[i].isselected = false;
                        // $scope.tagsNewArray.splice(index,1);


                    }
                }
            }
            else{
                $scope.allTags.push({tagname:item,isselected:true});

            }
            $scope.editedItem.Tag='';

            // $scope.tagsArray.push(item);

        }


        //Add tags while adding new item
        $scope.AddNewTag=function(newitem,index,flag){
            if(!flag){
                for (var i = 0; i < $scope.allTags.length; i++) {
                    if (index === i && $scope.allTags[i].isselected==false) {
                        $scope.allTags[i].isselected = true;
                        // $scope.tagsNewArray.push($scope.allTags[i].tagname);

                    }
                    else if(index === i && $scope.allTags[i].isselected==true){
                        $scope.allTags[i].isselected = false;
                        // $scope.tagsNewArray.splice(index,1);


                    }
                }
            }
            else{
                $scope.allTags.push({tagname:newitem,isselected:true});


            }


            $scope.newItem.Tag='';


            console.log($scope.tagsNewArray)
        }

        /*.......
         Delete item from items collection
        ..... */
        $scope.deleteItem = function(item){

            Settings.confirmPopup("CONFIRM","Are you sure ? ",function (res) {
                if(res){

                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");

                    $http.delete("/dash/item/delete/"+item.itemCode)
                        .success(function(res){

                            if(res){
                                $scope.clearFilter(2);

                                setTimeout(function(){
                                    $('.refresh').css("display", "none");
                                }, 500);

                                Settings.successPopup('Success','Successfully deleted '+item.Product+'.');
                                $scope.itemEditPage = false ;
                                $scope.previousTab();
                            }
                            else{
                                setTimeout(function(){
                                    $('.refresh').css("display", "none");
                                }, 500);
                                Settings.failurePopup("Error",'Failed to delete '+item.Product+'. Please try after sometime.');
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
            })
        };

        $scope.getAllCategories(false,'category');
        $scope.getAllSubCategories(false,'subCategory');
        $scope.getAllSubSubCategories(false,'subSubCategory');
        $scope.getAllTags(false,'tags');

        $scope.itemFilterBy = function(type){
            if(type == 'category'){
                $scope.filterBy = type;
                $scope.categoryFilterFlag = true ;
                $scope.subCategoryFilterFlag = false ;
                $scope.subSubCategoryFilterFlag = false ;
            }
            else if(type == 'subCat'){
                $scope.filterBy = type;
                $scope.categoryFilterFlag = false ;
                $scope.subCategoryFilterFlag = true ;
                $scope.subSubCategoryFilterFlag = false ;
            }
            else if(type == 'subSubCat'){
                $scope.filterBy = type;
                $scope.categoryFilterFlag = false ;
                $scope.subCategoryFilterFlag = false ;
                $scope.subSubCategoryFilterFlag = true ;
            }
            else {
                $scope.filterBy = 'All';
                $scope.priceListView.filter = 'master' ;
                $scope.priceListfilter = false ;
                $scope.filterItemsByCriteria('clear',1);
                $scope.categoryFilterFlag = false ;
                $scope.subCategoryFilterFlag = false ;
                $scope.subSubCategoryFilterFlag = false ;
            }
        }

        $scope.filterItemsByCriteria = function(type, all ,filter){
            //Parameter 'all' is used when user clicks SELECT ALL
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            $scope.items = [];

            if (type == 'category') {
                $scope.itemFilterCategories.map(function (item) {
                    if(item.category_selected && filter){
                        item.category_selected = filter;
                    } else {
                        item.category_selected = null;
                    }
                    return item;
                })

                $scope.itemFilterSubCategories = [];
                $scope.itemFilterSubSubCategories = [];
                $http.post("/dash/items/filter/" + 'subCategory', itemSearchObj)
                    .success(function (subCategory) {
                        // console.log(subCategory)
                        if(subCategory.length){
                            // subCategory = subCategory.filter(function( obj ) {
                            //     return obj._id !== 'DEFAULT';
                            // });
                            // console.log(subCategory)
                            $scope.itemFilterSubCategories = subCategory;

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
                $scope.item.subCategory_selected = '';
                $scope.item.subSubCategory_selected = '';
                $scope.subCategoryFilterFlag = true ;

                var newArray = [];
                itemSearchObj.searchCategory = [];

                if(filter){
                    itemSearchObj.searchCategory.push(filter);
                }

                if(itemSearchObj.searchCategory && itemSearchObj.searchCategory.length){
                    for (var i = 0; i < itemSearchObj.searchCategory.length; i++) {
                        //... Push all other cities...
                        if (filter == itemSearchObj.searchCategory[i]) {
                            newArray.push(itemSearchObj.searchCategory[i]);
                        }
                    }
                    //... Replace the array..
                    itemSearchObj.searchCategory = newArray;
                    itemSearchObj.searchBySubCategory = [];
                    itemSearchObj.searchBySubSubCategory = [];

                }else if(!$scope.itemFilterCategories.length){
                    $scope.itemFilterSubCategories = [];
                }

                $http.post("/dash/items", itemSearchObj)
                    .success(function (response) {
                        

                        $scope.renderItems(response, 'Manufacturer');
                        $http.post("/dash/item/count", itemSearchObj)
                            .success(function (res) {
                                $scope.transactionCount(res, 2);
                                // $scope.showHideDes(response)
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
                    

            } else if(type == 'subCategory'){

                $scope.itemFilterSubCategories.map(function (item) {
                    if(item.subCategory_selected){
                        item.subCategory_selected = filter;
                    } else {
                        item.subCategory_selected = null;
                    }
                })

                $scope.itemFilterSubSubCategories = [];
                $http.post("/dash/items/filter/" + 'subSubCategory', itemSearchObj)
                    .success(function (subSubCategory) {

                        if(subSubCategory.length){
                            $scope.itemFilterSubSubCategories = [];
                            for(var i=0; i< subSubCategory.length ; i++){
                                if(subSubCategory[i]._id){
                                    $scope.itemFilterSubSubCategories.push(subSubCategory[i]);
                                }
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
                $scope.item.subSubCategory_selected = '';
                $scope.subSubCategoryFilterFlag = true ;

                if(filter){
                    var newArray = [];

                    if(filter)
                        newArray.push(filter);
                    itemSearchObj.searchBySubCategory = [];
                    itemSearchObj.searchBySubCategory = newArray; //... Replace the array..
                    itemSearchObj.searchBySubSubCategory = [];

                    if (itemSearchObj.searchBySubCategory.length) {
                        $http.post("/dash/items", itemSearchObj)
                            .success(function (response) {

                                $scope.renderItems(response, 'subCategory');

                                $http.post("/dash/item/count", itemSearchObj)
                                    .success(function (res) {
                                        $scope.transactionCount(res, 2);
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
                }

            } else if(type == 'subSubCategory'){

                $scope.itemFilterSubSubCategories.map(function (item) {
                    if(item.subSubCategory_selected || item.subSubCategory_selected == ''){
                        item.subSubCategory_selected = filter;
                    } else {
                        item.subSubCategory_selected = null;
                    }
                })

                if(filter){
                    var newArray = [];

                    if(filter)
                        newArray.push(filter);

                    itemSearchObj.searchBySubSubCategory = newArray; //... Replace the array..


                    if (itemSearchObj.searchBySubSubCategory.length) {
                        $http.post("/dash/items", itemSearchObj)
                            .success(function (response) {

                                $scope.renderItems(response, 'subSubCategory');

                                $http.post("/dash/item/count", itemSearchObj)
                                    .success(function (res) {
                                        $scope.transactionCount(res, 2);
                                    }).error(function(error, status){
                                    console.log(error, status);
                                    if(status >= 400 && status < 404)
                                        $window.location.href = '/404';
                                    else if(status >= 500)
                                        $window.location.href = '/500';
                                    else
                                        $window.location.href = '/404';
                                });
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
            }else if(type == 'clear'){

                $scope.item.category_selected = '';
                $scope.item.subCategory_selected = '';
                $scope.item.subSubCategory_selected = '';

                if(all){
                    // itemSearchObj = {};

                    $scope.getAllCategories(false,'category');
                    $scope.getAllSubCategories(false,'subCategory');
                    $scope.getAllSubSubCategories(false,'subSubCategory');
                    $scope.getAllTags(false,'tags');


                    itemSearchObj.searchCategory = [];
                    itemSearchObj.searchSubCategory = [];
                    itemSearchObj.searchSubSubCategory = [];
                    itemSearchObj.searchByCategory = [];
                    itemSearchObj.searchBySubCategory = [];
                    itemSearchObj.searchBySubSubCategory = [];
                    itemSearchObj.filterByTags=[]
                    $http.post("/dash/items", itemSearchObj)
                        .success(function (response) {

                            $scope.renderItems(response, 'Manufacturer');
                            $http.post("/dash/item/count", itemSearchObj)
                                .success(function (res) {
                                    $scope.transactionCount(res, 2);
                                }).error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
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
            } else {
                $scope.itemFilterCategories = [];
                $scope.itemFilterSubCategories = [];
                $scope.itemFilterSubSubCategories = [];
            }

            setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 1000);
        }

        $scope.addCategoryTempFunc = function(newItem,category,type) {
            if(category != '' && category != undefined && category != null){
                var temp = [];
                var uniquieCategory =  $scope.itemCategories.unique('_id');
                for (var i = 0; i < uniquieCategory.length ;i++){
                    temp.push(uniquieCategory[i]._id)
                }

                if(temp.indexOf(category) == -1){
                    $scope.itemCategories.push(newItem);
                    $scope.newItem.Manufacturer = category;
                    $scope.editedItem.Manufacturer = category;
                    $scope.newItem.subCategory = 'DEFAULT' ;
                    $scope.editedItem.subCategory = 'DEFAULT';
                    temp.push(category)

                    $scope.fetchOnlySubCatDropDown(newItem,'edit');

                    $scope.filterBasedOnCategory(category,'edit');


                    if(type == 'item'){
                        $scope.newItem.newManufacturer = '';

                        document.getElementById("newCategory").style.display = "none";
                        //hide the modal

                        $('body').removeClass('modal-open');
                        //modal-open class is added on body so it has to be removed

                        $('.modal-backdrop').remove();
                        //need to remove div with modal-backdrop class

                        // $(function () {
                        //     $('#newCategory').modal('toggle');
                        //     $('#newCategory').on('hidden.bs.modal', function (e) {
                        //         $(this).find("input").val('').end()
                        //     })
                        // });
                    }else if(type == 'inventory'){
                        console.log(type)
                        jQuery.noConflict();
                        $(function () {
                            $('#inventoryNewCategory').modal('toggle');
                            $('#inventoryNewCategory').on('hidden.bs.modal', function (e) {
                                $(this).find("input").val('').end()
                            })
                        });
                    }else if(type == 'edit'){
                        $scope.newItem.newManufacturer = '';
                        document.getElementById("editCategory").style.display = "none";
                        //hide the modal

                        $('body').removeClass('modal-open');
                        //modal-open class is added on body so it has to be removed

                        $('.modal-backdrop').remove();
                        //need to remove div with modal-backdrop class

                        // $(function () {
                        //     $('#editCategory').modal('toggle');
                        // });


                    }
                }
                else {
                    Settings.failurePopup("Error",'Category already exist');
                }
            }
            else{
                Settings.failurePopup("Error",'Enter a Category');
            }
        };

        $scope.addSubCategoryTempFunc = function(newItem,subCategory,type) {
            if(subCategory != '' && subCategory != undefined && subCategory != null) {
                if($scope.newItem.Manufacturer != 'DEFAULT' && $scope.editedItem.Manufacturer != 'DEFAULT'){
                    var temp = [];
                    var uniquiesubCategory =  $scope.subCategoriesDropDown.unique('_id');
                    for (var i = 0; i < uniquiesubCategory.length ;i++){
                        temp.push(uniquiesubCategory[i]._id)
                    }
                    if(temp.indexOf(subCategory) == -1){
                        $scope.newItem.subCategory = subCategory;
                        $scope.subCategoriesDropDown.push(newItem);
                        $scope.newItem.subSubCategory = 'DEFAULT' ;
                        $scope.editedItem.subSubCategory = 'DEFAULT';
                        $scope.editedItem.subCategory = subCategory ;
                        // if($scope.itemsDisp){
                        //     $scope.subCategoriesDropDown.push(newItem);
                        // }

                        if(type == 'item'){
                            $scope.newItem.newSubCategory = '';
                            document.getElementById("newSubCategory").style.display = "none";
                            //hide the modal

                            $('body').removeClass('modal-open');
                            //modal-open class is added on body so it has to be removed

                            $('.modal-backdrop').remove();
                            //need to remove div with modal-backdrop class
                            // $(function () {
                            //     $('#newSubCategory').modal('toggle');
                            // });
                        }else if(type == 'inventory'){
                            jQuery.noConflict();
                            $(function () {
                                $('#inventoyNewSubCategory').modal('toggle');
                                $('#inventoyNewSubCategory').on('hidden.bs.modal', function (e) {
                                    $(this).find("input").val('').end()
                                })
                            });
                        }else if(type == 'edit'){
                            $scope.newItem.newSubCategory = '';
                            document.getElementById("editSubCategory").style.display = "none";
                            //hide the modal

                            $('body').removeClass('modal-open');
                            //modal-open class is added on body so it has to be removed

                            $('.modal-backdrop').remove();
                            //need to remove div with modal-backdrop class

                            // $(function () {
                            //     $('#editSubCategory').modal('toggle');
                            // });

                        }

                    }
                    else{
                        Settings.failurePopup("Error",'SubCategory already exist');
                        // bootbox.alert({
                        //     size : 'small',
                        //     title : 'ERROR',
                        //     message : "SubCategory already exist ",
                        //     className : "text-center"
                        // });
                    }
                }
                else{
                    Settings.failurePopup("Error",'Please Add or Select a Category First');
                    // bootbox.alert({
                    //     size : 'small',
                    //     title : 'ERROR',
                    //     message : "Please Add or Select a Category First",
                    //     className : "text-center"
                    // });
                }
            }
            else{
                Settings.failurePopup("Error",'Enter a SubCategory');
                // bootbox.alert({
                //     size : 'small',
                //     title : 'ERROR',
                //     message : "Enter a SubCategory ",
                //     className : "text-center"
                // });
            }
        };

        $scope.addSubSubCategoryTempFunc = function(newItem,subSubCategory,type) {
            if(subSubCategory != '' && subSubCategory != undefined && subSubCategory != null) {
                if(($scope.newItem.Manufacturer != 'DEFAULT' && $scope.newItem.subCategory != 'DEFAULT') || ($scope.editedItem.Manufacturer != 'DEFAULT' && $scope.editedItem.subCategory != 'DEFAULT')){
                    var temp = [];
                    var uniquiesubSubCategory =  $scope.subSubCategoriesDropDown.unique('_id');
                    for (var i = 0; i < uniquiesubSubCategory.length ;i++){
                        temp.push(uniquiesubSubCategory[i]._id)
                    }
                    if(temp.indexOf(subSubCategory) == -1){
                        $scope.newItem.subSubCategory = subSubCategory;
                        $scope.subSubCategoriesDropDown.push(newItem);
                        $scope.editedItem.subSubCategory = subSubCategory ;
                        // if($scope.itemsDisp){
                        //     $scope.subSubCategoriesDropDown.push(newItem);
                        // }

                        if(type == 'item'){
                            $scope.newItem.newSubSubCategory = '';
                            document.getElementById("newSubSubCategory").style.display = "none";
                            //hide the modal

                            $('body').removeClass('modal-open');
                            //modal-open class is added on body so it has to be removed

                            $('.modal-backdrop').remove();
                            //need to remove div with modal-backdrop class

                            // $(function () {
                            //     $('#newSubSubCategory').modal('toggle');
                            // });
                        }else if(type == 'inventory'){
                            jQuery.noConflict();
                            $(function () {
                                $('#inventoyNewSubSubCategory').modal('toggle');
                                $('#inventoyNewSubSubCategory').on('hidden.bs.modal', function (e) {
                                    $(this).find("input").val('').end()
                                })
                            });
                        }else if(type == 'edit'){
                            $scope.newItem.newSubSubCategory = '';
                            document.getElementById("editSubSubCategory").style.display = "none";
                            //hide the modal

                            $('body').removeClass('modal-open');
                            //modal-open class is added on body so it has to be removed

                            $('.modal-backdrop').remove();
                            //need to remove div with modal-backdrop class

                            // $(function () {
                            //     $('#editSubSubCategory').modal('toggle');
                            // });

                        }
                    }
                    else{
                        Settings.failurePopup("Error",'Sub-Sub-Category already exist');
                        // bootbox.alert({
                        //     size : 'small',
                        //     title : 'ERROR',
                        //     message : "Sub-Sub-Category already exist ",
                        //     className : "text-center"
                        // });
                    }
                }
                else{
                    Settings.failurePopup("Error",'Please Add or Select a subCategory First');
                    // bootbox.alert({
                    //     size : 'small',
                    //     title : 'ERROR',
                    //     message : "Please Add or Select a subCategory First",
                    //     className : "text-center"
                    // });
                }
            }
            else{
                Settings.failurePopup("Error",'Enter a Sub-Sub-Category');
                // bootbox.alert({
                //     size : 'small',
                //     title : 'ERROR',
                //     message : "Enter a Sub-Sub-Category ",
                //     className : "text-center"
                // });
            }
        };

        $scope.clearFormvalues = function(){
            $scope.newItem.newManufacturer = '';
            $scope.newItem.newSubCategory = '';
            $scope.newItem.newSubSubCategory = '';
        };

        $scope.editItem = function (){
            newimage = [];
            removeImageindex= [];
            itemEditimage = [];
            $scope.editedItem.newImages = [];
            $scope.editedItem.Tagselected='';
            itemeditremoveImageindex = [];
            num = 0 ;
            $(".preview-image").remove();
            $("#pro-image").val('');
            // if($scope.itemsDisp.itemCode){
            //     $http.get("/dash/items/itemCode/"+$scope.itemsDisp.itemCode).success(function(response){
            //         var Tagselected=response.tags;
            //         if(Tagselected){
            //             for(var k=0;k<Tagselected.length;k++){
            //                 for(var l=0;l<$scope.allTags.length;l++){
            //                     if(Tagselected[k]==$scope.allTags[l].tagname){
            //                         $scope.allTags[l].isselected=true;
            //
            //                     }
            //                 }
            //
            //             }
            //         }
            //     }) .error(function(error, status){
            //         console.log(error, status);
            //         if(status >= 400 && status < 404)
            //             $window.location.href = '/404';
            //         else if(status >= 500)
            //             $window.location.href = '/500';
            //         else
            //             $window.location.href = '/404';
            //     });
            // }







        };

        setTimeout(function(){
            $('.refresh').css("display", "none");
        }, 2000);


        //.... Enable/disable to superjini items...
        $scope.superJiniItems = function (enable,itemCode) {
            console.log("Super Jini items enable function");
            $http.get("/dash/memberDetail").success(function(response){
                //console.log(response);
                $scope.memberdetails = response;
                if($scope.memberdetails.store_id){
                    var store_id = $scope.memberdetails.store_id;
                    /* console.log(enable);
                     console.log(store_id);
                     console.log(itemCode);*/
                    $http.put("/jini/enableSuperItems", {publish: enable,store_id : store_id,itemCode : itemCode})
                        .success(function (response) {
                            // console.log(response);
                            if (!response) {
                                alert("Something went wrong");
                                $scope.publish = false;
                            } else {
                                if(enable == true){
                                    console.log("SuperJini Store enabled --> " + response.length);
                                    Settings.success_toast('Success','Successfully to SuperJini Store!')
                                }
                                else if(enable == false){
                                    console.log("SuperJini Store enabled --> " + response.length);
                                    Settings.info_toast('Success','Successfully removed item from SuperJini Store!')

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
                else{
                    console.log("store not listed on superjini");
                    Settings.warning_toast('Error','Please add the store to SuperJini!');
                }
            })

        }

        $scope.priceListFilter = function(data){
            if(data == 'master'){
                $scope.priceListView.filter = data ;
                $scope.priceListfilter = false ;
                $scope.showItemFilter = false ;
            }else{
                $scope.priceListView.filter = data ;
                $scope.itemSearch.priceList = data ;
                $scope.priceListfilter = true ;
                $scope.showItemFilter = true ;
            }
        }

        $scope.priceListClear =  function(){
            $scope.price.name = '';
        }

        $scope.addPricelistName = function(name){
            if(name){
                if(name.toUpperCase() != 'MASTER'){
                    if($scope.masterPriceList.length){
                        var found = false;
                        for(var i = 0; i < $scope.masterPriceList.length; i++) {
                            if ($scope.masterPriceList[i].toUpperCase() == name.toUpperCase()) {
                                found = true;
                                break;
                            }
                        }
                        if(found){
                            Settings.failurePopup('ERROR',"Name already exist!");
                        }
                        else{
                            postlist();
                        }
                    }
                    else{
                        postlist();
                    }

                    function postlist(){
                        var temp = $scope.masterPriceList ;
                        temp[temp.length] = name ;
                        


                        $http.put("/dash/settings/pricelist/name", temp)
                            .success(function(res){
                                $scope.editedItem[res[res.length - 1]] = "";
                                // console.log(res);
                                Settings.success_toast('SUCCESS', "Class Added Successfully!")
                                $scope.masterPriceList = res ;
                                Settings.setInstanceDetails('masterPriceList', $scope.masterPriceList)
                                $scope.price = {};
                            })
                    }
                }
                else{
                    Settings.failurePopup('ERROR',"Pricelist cannot be named as MASTER!");
                }

            } else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }

        }
        $scope.getShopifyCatalog = function(){
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            $http.get("/dash/shopify/pull/catalog")
                .success(function (response) {
                    console.log("Shopify Catalog Updation initiated")
                    console.log(response)
                    setTimeout(function(){
                        $('.refresh').css("display", "none");
                    }, 2000);
                    if(response == true){
                        Settings.success_toast('SUCCESS', "Shopify Products will be synced in the background!")
                    }
                    else{

                        Settings.failurePopup('ERROR', "Products importing failed, Check the credentials and try again");
                    }

                    // $http.post("/dash/items", itemSearchObj)
                    //     .success($scope.renderItems);
                })
                .error(function (error){
                    setTimeout(function(){
                        $('.refresh').css("display", "none");
                    }, 2000);
                    console.log(error)

                    Settings.failurePopup('ERROR',"Products importing failed");
                })
        }


        $scope.removeItemImage = function(index){
            $scope.editedItem.presentImages.splice(index,1);
        }

        $scope.backToBrowserHistory = function() {
            $window.history.back();
        };

        $scope.previousTab = function () {
            if ($scope.leadflag)
                $location.path('/catalog/').search({ type: $scope.leadflag });
            else
                $location.path('/catalog');
        };

        $scope.editCatalog = function(item){
            console.log("editcatalog",item);
            Settings.setItemData(item);

        }
    });
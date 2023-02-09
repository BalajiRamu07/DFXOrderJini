/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("CatalogCtrl",function ($scope, $rootScope, $location, $http, $window, Settings) {
        console.log("Hello From Catalog Controller .... !!!!");

        //.... User details.....
        $scope.user = {};
        $scope.user.role = '';

        $scope.user_details = {};
        //.... Nav information....
        $scope.nav = [];

        //... List of items...
        $scope.items = [];

        //..... Categories & Sub Categories Dropdowns....
        $scope.categories = [];
        $scope.subCategoriesDropDown = [];
        $scope.subSubCategoriesDropDown = [];

        //.. Filtered items....
        $scope.itemFilterSubSubCategories = [];

        //... Shopify Connection ....
        $scope.shoppify_connected = false;

        /*----- All below variables need to be reviewed ---*/
        //.... TODO : Deprecated....

        var viewBy = {};
        viewBy.items = 12;
        $scope.tax = []; //Holds array of tax objects
        
        //Ghana tax
        $scope.ghanaTax = {
            NHIL:2.5,
            GETL:2.5,
            VAT:15.9,
            VAT_VAL: 15
        };
        /*----- All above variables need to be reviewed ---*/
        //.... Item Search Filter....
        $scope.itemSearch = {};
        $scope.itemSearch.filter = '';
        $scope.itemSearch.filterBy = '';

        //.... Pricelist Filtering....
        $scope.priceListView = {};

        var instanceDetails =  Settings.getInstance();

        $scope.percentageDiscountFlag = false;
        $scope.percentageDiscountFlag = instanceDetails.percentageDiscount;
        
        $scope.masterPriceList = instanceDetails.masterPriceList;
        $scope.country = {};
        $scope.country.name = instanceDetails.country || 'India';
        $scope.tempCountryName = $scope.country.name.toLowerCase();
        $scope.price = {};
        $scope.tagsNewArray=[];
        $scope.disableFlag = false;

        //.... Pagination....
        $scope.viewLength = 0;  
        $scope.newViewBy = 10;
        
        var initialViewBy = 60;

        //... Will soon be moved to API Level....
        var itemSearchBy = ['itemCode', 'Product', 'Manufacturer', 'subCategory','subSubCategory'];

        //.... Soon to be made as a $scope change....
        var itemSearchObj = {};
        itemSearchObj.viewLength = 0;
        itemSearchObj.viewBy = initialViewBy;
        itemSearchObj.searchBy = [];
        itemSearchObj.searchFor = '';

        //... Filtering.....
        $scope.filterBy  = 'All';
        
        $scope.dealerClasses = [];
        $scope.masterPriceList = [];
        $scope.priceListName = ['master'];

        //.... Filter Selected Categories / Sub Categories....
        $scope.item = {};
        $scope.item.category_selected = '';
        $scope.item.subCategory_selected = '';
        $scope.item.subSubCategory_selected = '';
        $scope.priceListView.filter = 'master';

        Settings.getUserInfo(user_details => {
            $scope.user_details = user_details;
            if($scope.user_details.role)
                $scope.user_details.role = user_details.role.toLowerCase();


            ///.... Will need to be removed...
            if(user_details.role){
                userRole = user_details.role.toLowerCase();
            }

            Settings.getNav(false, nav => {
                $scope.nav = nav;
            })
        });

        const fetchShopifyConnect = () => {
            $http.get("/dash/shopify/settings")
                .then(response => {
                    console.log(response.data);
                    if(response.data && response.data[0].shopify_api_key){
                        $scope.shoppify_connected = true;
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

        if($scope.user_details.role == "Admin")
            fetchShopifyConnect();

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }
        
        startLoader();

        $scope.renderItems = items_list => {
            console.log("Items --> ", items_list);
            //... If Glingring instance, then we clear the Array itself...
            if($scope.coID == 'GLGR'){
                $scope.items = [];
            }

            //... Needs to eb reviewed.....
            if($scope.user.role == 'Dealer'){
                $http.get("/dash/store/details/" + $scope.user.sellerphone)
                    .success(dealer => {
                        if($scope.coID != 'GLGR') {
                            if(dealer.length){
                                //.... If user found as dealer in Customer master, then we fetch the custom pricelist....
                                //.... Based on this, the price displayed will change....

                                $http.get('/dash/customprice/' + dealer[0].Dealercode)
                                    .success(pricelist => {
                                        console.log("Custom Prices Found : " + pricelist.length)
                                        $scope.items_count = pricelist.length;
                                        dealerItemsCount = pricelist.length;
                                        
                                        if (pricelist.length < $scope.newViewBy) {
                                            $scope.newViewBy = pricelist.length;
                                            dealerNewViewBy = pricelist.length;
                                        }

                                        $scope.customPrices = pricelist;

                                        if (pricelist.length > 0) {
                                            console.log("Populating Custom price list ---> ")
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
                                        } else {
                                            //... Assuming no items are available in Pricelist Table, we switch to the regular catalog view.......
                                            console.log("Showing all items ---> ");
                                            for (let i = 0; i < items_list.length; i++) {
                                                items_list[i].totalInventory = 0

                                                items_list[i].inventory.forEach(function (item) {
                                                    items_list[i].totalInventory += item.Qty;
                                                });
                                                
                                                $scope.items.push(items_list[i])

                                            }
                                        }
                                    })
                            }else 
                                Settings.alertPopup("ERROR", "Could not find link to Customer Master. Contact Admin for Support.");
                        } else {
                            //.... Tecknovate items....
                            console.log("Showing all packages ---> ", items_list);
                            
                            for (let i = 0; i < items_list.length; i++) {
                                items_list[i].totalInventory = 0

                                items_list[i].inventory.forEach(function (item) {
                                    items_list[i].totalInventory += item.Qty;
                                });
                                
                                $scope.items.push(items_list[i])
                            }
                            
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

            } else {
                for(let i = 0; i < items_list.length; i++){
                    items_list[i].totalInventory = 0;

                    //.... Adding up for total inventory quantity....
                    items_list[i].inventory.forEach(item => {
                        items_list[i].totalInventory += item.Qty;
                    });

                    $scope.items.push(items_list[i]);

                    //... If a pricelist filter has been added......
                    // if($scope.priceListName){

                    //     for(var k = 0; k < $scope.priceListName.length;k++ ){
                    //         //... If it's not the master catalog price view, then we replace the prices with the pricelist price...
                    //         if($scope.priceListName[k] != 'master'){
                    //             if (typeof items_list[i][$scope.priceListName[k]] !== 'undefined' 
                    //                 &&  items_list[i][$scope.priceListName[k]] != null) {

                    //                 //.... Pricelist Names are added as part of the Catalog upload as Columns....
                    //                 //... So the Pricelist names are as properties of the item object....

                    //                 //... We check if the Price Value / data for that Pricelist column is in string...
                    //                 //... We make the price as null....
                    //                 if(typeof items_list[i][$scope.priceListName[k]] == "string"){
                    //                     items_list[i].customPricelist.push({
                    //                         "itemCode" : items_list[i].itemCode, ///.... We push the prices for this item / itemcode.....
                    //                         "name" : $scope.priceListName[k], ///..... Pricelist Name....
                    //                         "price" : null,
                    //                         "status" : false
                    //                     })
                    //                 } else { //.... If the Pricelist Value is not a string or is a Number (Could be price value, we show it).....
                    //                     items_list[i].customPricelist.push({
                    //                         "itemCode" : items_list[i].itemCode,
                    //                         "name" : $scope.priceListName[k],
                    //                         "price": items_list[i][$scope.priceListName[k]], ///.... 
                    //                         "status" : true
                    //                     })
                    //                 }
                    //             } else {
                    //                 ///... Columns are not available.......
                    //                 items_list[i].customPricelist.push({
                    //                     "itemCode" : items_list[i].itemCode,
                    //                     "name" : $scope.priceListName[k],
                    //                     "price" : null,
                    //                     "status": false
                    //                 })
                    //             }
                    //         }
                    //     }
                    // }


                    // if(!items_list[i].trackInventory && items_list[i].trackInventory !== false){
                    //     items_list[i].trackInventory = true;
                    // }else{
                    //     items_list[i].trackInventory = items_list[i].trackInventory;
                    // }   
                }
            }

            stopLoader();
        };

        var a = 0;
        $scope.navPage = direction => {
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            
            if(direction){
                if(viewLength + viewBy >= $scope.items.length){
                    if(viewLength + viewBy < $scope.items_count){
                        viewLength += viewBy;
                        
                        itemSearchObj.viewLength = viewLength;
                        itemSearchObj.viewBy = initialViewBy;
                        itemSearchObj.searchFor = $scope.itemSearch.filter;
                        itemSearchObj.searchBy = itemSearchBy;

                        loadItems(itemSearchObj);
                        
                        if(viewLength + viewBy > $scope.items_count){
                            a = viewLength + viewBy - $scope.items_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
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
                    // console.log("Minus viewby")
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
                // console.log("BACK");
                if(viewLength < viewBy){
                    //console.log("NO DATA")
                }
                else{
                    // console.log("asasasas")
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
        

        $scope.transactionCount = response => {
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


        const loadItems = searchObj => {
            startLoader();
            $http.post("/dash/items", searchObj)
                .then((response) => {
                    $scope.renderItems(response.data);
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

        const loadItemsCount = searchObj => {
            $http.post('/dash/item/count', itemSearchObj)
                .then(response => {
                    $scope.transactionCount(response.data, 2);
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


        //.... To Get Image of the Catalog Items....
        $scope.getImageUrl = item => {
            if(item && item.cloudinaryURL){
                //.... The cloudinary image URL could be in an Array / Object form.....
                if(angular.isObject(item.cloudinaryURL) && item.cloudinaryURL.length > 0){
                    return item.cloudinaryURL[0].image;
                } else if(angular.isObject(item.cloudinaryURL) && !item.cloudinaryURL.length) return '../appimages/productlist_image_not_available.png';
                else if(item.cloudinaryURL != "[object Object]") return item.cloudinaryURL;
                else return '../appimages/productlist_image_not_available.png';
            }else return '../appimages/productlist_image_not_available.png';
        };




        //... To Be Deprecated....
        $scope.renderInstanceDetails = function (response) {
            console.log("Instance Details for Items  -->");
            // console.log(response);
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


            //.... Deprecated.....
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

        


        $scope.getAllCategories = () => {
            $http.post("/dash/items/filter/category", {viewBy : 0})
                .then(category => {
                    $scope.itemFilterCategories = category.data;
                    $scope.itemCategories = category.data;

                    $scope.itemFilterCategories = $scope.itemFilterCategories.filter(obj => {
                        return obj._id !== 'DEFAULT';
                    });
                })
        };


        $scope.getAllSubCategories = () => {
            $http.post("/dash/items/filter/subCategory", {viewBy : 0})
                .then(subCategory => {

                    $scope.itemSubCategories = subCategory.data;
                    $scope.itemFilterSubCategories = subCategory.data;

                    $scope.itemFilterSubCategories = $scope.itemFilterSubCategories.filter(obj => {
                        return obj._id !== 'DEFAULT';
                    });
                })
        };


        $scope.getAllSubSubCategories = () => {
            $http.post("/dash/items/filter/subSubCategory", {viewBy : 0})
                .then(subSubCategory => {
                    $scope.itemSubSubCategories = subSubCategory.data;
                    $scope.itemFilterSubSubCategories = subSubCategory.data;

                    $scope.itemFilterSubSubCategories = $scope.itemFilterSubSubCategories.filter(obj => {
                        return obj._id !== 'DEFAULT';
                    });

                    if($scope.itemSubSubCategories.length == 1 && $scope.itemSubSubCategories[0]._id == null){
                        $scope.itemSubSubCategories = [];
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


        $scope.getAllTags = () => {
            $http.post("/dash/items/filter/tags", {viewBy : 0})
                .then(tags => {
                    var tempTagsArray = [];
                    $scope.allTags = [];
                    $scope.tagsFilter = []
                    var uniqueArray = [];

                    for(let i = 0; i < tags.data.length; i++) {
                        for(let j = 0; j < tags.data[i]._id.length; j++){
                            tempTagsArray.push(tags.data[i]._id[j]);
                        }
                    }

                    if(tempTagsArray.length){
                        $.each(tempTagsArray, (i, el) => {
                            if($.inArray(el, uniqueArray) === -1){ uniqueArray.push(el); }
                        });

                        if(uniqueArray.length){
                            for(let i = 0; i < uniqueArray.length; i++){
                                $scope.allTags.push({"tagname" : uniqueArray[i], "isselected" : false});
                                $scope.tagsFilter = $scope.allTags;
                            }
                        }
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

        $scope.clearFilter = () => {
            console.log("Clear Filter ---> ");
            itemSearchObj.viewLength = 0;
            itemSearchObj.viewBy = initialViewBy;
            itemSearchObj.searchFor = '';
            itemSearchObj.searchBy = [];
            itemSearchObj.searchBySubCategory = [];
            itemSearchObj.searchBySubSubCategory = [];
            itemSearchObj.searchCategory = [];
            itemSearchObj.filterByTags = [];

            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.items;
            $scope.itemSearch.filter = '';
            $scope.itemSearch.priceList = '';
            $scope.priceListView.filter = 'master';
            $scope.priceListfilter = false ;
            $scope.items = [];

            $scope.filterBy = 'All';
            $scope.priceListView.filter = 'master';

            $scope.priceListfilter = false;

            $scope.item.category_selected = '';
            $scope.item.subCategory_selected = '';
            $scope.item.subSubCategory_selected = '';

            $scope.showItemFilter = false;

            loadItems(itemSearchObj);
            loadItemsCount(itemSearchObj);

            $scope.getAllCategories();
            $scope.getAllTags();
        };

        let search_timeout = null;

        const searchItems = () => {
            itemSearchObj.viewLength = 0;
            itemSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.items;

            $scope.items = [];

            if($scope.itemSearch.filter){
                itemSearchObj.searchFor = $scope.itemSearch.filter;
                itemSearchObj.searchBy = itemSearchBy;
            }

            loadItems(itemSearchObj);
            loadItemsCount(itemSearchObj);
            search_timeout = null;
        }

        $scope.searchItems = search => {
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

                loadItems(itemSearchObj);
                loadItemsCount(itemSearchObj);

                $scope.showItemFilter = false;

                $scope.getAllCategories();
                $scope.getAllTags();

            }else {
                if(!search_timeout){
                    search_timeout = setTimeout(() => {
                        searchItems();
                    }, 1000)
                }
            }
        };

        $scope.itemSearchFilter = function(){
            if($scope.itemSearch.filter == ''){
                bootbox.alert({
                    title: 'Warning',
                    message : "Please type text in search box"
                })
            } else $scope.searchItems($scope.itemSearch.filter);
        };

        $scope.filterByTag = index => {
            let tags = [];

            $scope.allTags[index].isselected = !$scope.allTags[index].isselected;

            for (let i = 0; i < $scope.allTags.length; i++) 
                if($scope.allTags[i].isselected) tags.push($scope.allTags[i].tagname);

            itemSearchObj.viewLength = 0;
            itemSearchObj.viewBy = initialViewBy;
            itemSearchObj.filterByTags = tags;

            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.items;

            $scope.items = [];

            loadItems(itemSearchObj);
            loadItemsCount(itemSearchObj);
        }

        $scope.clearFilter();
        
        //.... This is used only for Tecknovate....
        $scope.refreshItems = function () {
            $http.post("/dash/items", itemSearchObj)
                .success($scope.renderItems);
        }

        $scope.getItemDetails = id => {
            if($scope.percentageDiscountFlag)
                $location.path("/catalog-detail/" + encodeURIComponent(id));
            else $location.path("/catalog/details/" + encodeURIComponent(id));
            //$location.path("/catalog-detail/" + encodeURIComponent(id))
        }

        $scope.itemFilterBy = type => {
            $scope.filterBy = type || "All";

            if(!$scope.filterBy || $scope.filterBy == 'All') $scope.clearFilter();
        }

        $scope.filterItems = type => {
            //... We reset the view ....
            $scope.items = [];

            ///.... We also reset the Pagination to start of the Page....
            itemSearchObj.viewLength = 0;
            itemSearchObj.viewBy = initialViewBy;

            if (type == 'category') {
                //... This is for Check Boxes....
                $scope.itemFilterCategories.map(item => {
                    if(item.category_selected && $scope.item.category_selected){
                        item.category_selected = $scope.item.category_selected;
                    } else {
                        item.category_selected = null;
                    }
                    return item;
                })

                //.... Clear the SubCategory & Sub Sub Category Selections & Dropdowns....
                $scope.item.subCategory_selected = '';
                $scope.item.subSubCategory_selected = '';

                $scope.itemFilterSubCategories = [];
                $scope.itemFilterSubSubCategories = [];

                $http.post("/dash/items/filter/subCategory", itemSearchObj)
                    .then(subCategory => {
                        if(subCategory.data.length){
                            $scope.itemFilterSubCategories = subCategory.data;
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
                

                itemSearchObj.searchCategory = [];

                if($scope.item.category_selected)
                    itemSearchObj.searchCategory.push($scope.item.category_selected);
                

                //... Replace the array..
                itemSearchObj.searchBySubCategory = [];
                itemSearchObj.searchBySubSubCategory = [];

                loadItems(itemSearchObj);
                loadItemsCount(itemSearchObj);

            } else if(type == 'subCategory'){

                $scope.itemFilterSubCategories.map(item => {
                    if(item.subCategory_selected){
                        item.subCategory_selected = $scopeitem.subCategory_selected;
                    } else {
                        item.subCategory_selected = null;
                    }
                })

                $scope.itemFilterSubSubCategories = [];
                $scope.item.subSubCategory_selected = '';

                $http.post("/dash/items/filter/subSubCategory", itemSearchObj)
                    .then(subSubCategory => {
                        if(subSubCategory.data.length){
                            for(let i = 0; i < subSubCategory.data.length ; i++){
                                if(subSubCategory.data[i]._id){
                                    $scope.itemFilterSubSubCategories.push(subSubCategory.data[i]);
                                }
                            }
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

                itemSearchObj.searchBySubCategory = [];
                itemSearchObj.searchBySubSubCategory = [];

                if($scope.item.subCategory_selected)
                    itemSearchObj.searchBySubCategory.push($scope.item.subCategory_selected);

                loadItems(itemSearchObj);
                loadItemsCount(itemSearchObj);

            } else if(type == 'subSubCategory'){

                $scope.itemFilterSubSubCategories.map(item => {
                    if(item.subSubCategory_selected || item.subSubCategory_selected == ''){
                        item.subSubCategory_selected = $scope.item.subSubCategory_selected;
                    } else {
                        item.subSubCategory_selected = null;
                    }
                })

                itemSearchObj.searchBySubSubCategory = [];

                if($scope.item.subSubCategory_selected)
                    itemSearchObj.searchBySubSubCategory.push($scope.item.subSubCategory_selected);

                loadItems(itemSearchObj);
                loadItemsCount(itemSearchObj);
            }else if(type == 'clear') $scope.clearFilter();
        }
        

        $scope.priceListFilter = data => {
            $scope.priceListView.filter = data;
            if(data == 'master'){
                $scope.priceListfilter = false;
                $scope.showItemFilter = false;
            }else{
                $scope.itemSearch.priceList = data;
                $scope.priceListfilter = true;
                $scope.showItemFilter = true;
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
                                $rootScope.lastAddedPrice = res[res.length - 1];
                                
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
            startLoader();

            $http.get("/dash/shopify/pull/catalog")
                .success(function (response) {
                    console.log("Shopify Catalog Updation initiated")
                    console.log(response)
                    stopLoader();
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
                    stopLoader();
                    console.log(error);
                    Settings.failurePopup('ERROR',"Products importing failed");
                })
        }
    });
/**
 * Created by shreyasgombi on 27/09/22.
 */

 angular.module('ebs.controller')
    .controller("ReceiveInventoryCtrl",function ($scope, $routeParams, $http, Settings, $location, $window) {
        console.log("Hello From Receive Inventory Controller .... !!!!");

        $scope.tab = "quantity";

        $scope.tab = ($routeParams.tab && $routeParams.tab != "quantity") ? ($routeParams.tab ? $routeParams.tab : "quantity") : "quantity";

        $scope.receive_items = {};
        $scope.receive_items.item_search = "";
        $scope.receive_items.location = "";

        $scope.locations = [{"name" : "DEFAULT", "type" : "Real Location"}];

        //... Current Inventory Stats.....
        $scope.current_inventory = [];

        //.... Serial Based Scanning....
        $scope.serial_items = [];
        //.... Miscellaneous Items....
        $scope.misc_items = [];

        //... Miscellaneous item scan....
        $scope.misc_item = {};

        $scope.user_details = {};

        Settings.getUserInfo(user_details => {
            $scope.user_details = user_details;
        })

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        const fetchLocations = () => {
            startLoader();
            $http.get("/dash/settings/details/inventoryLocation")
                .then(locations => {
                    stopLoader();
                    if(locations.data && locations.data.location && locations.data.location.length){
                        for(let i = 0; i < locations.data.location.length; i++) $scope.locations.push(locations.data.location[i]);
                    }
                })
        };

        $scope.fetchInventory = () => {
            if($scope.item_details && $scope.item_details.itemCode){
                startLoader();
                $scope.current_inventory = [];
                let query = new URLSearchParams();

                if($scope.tab) query.append("tab", $scope.tab);
                if($scope.receive_items.item_search) {
                    if($scope.receive_items.item_search.itemCode) query.append("item", $scope.receive_items.item_search.itemCode);
                    else query.append("item", $scope.receive_items.item_search);
                }

                if($scope.receive_items.location) query.append("location", $scope.receive_items.location);

                $http.get("/dash/inventory/search?" + query.toString())
                    .then(inventory => {
                        stopLoader();
                        if(inventory.data && inventory.data.length){
                            inventory.data.map(el => {
                                if(!el.type) el.type = "quantity";
                            })
                            $scope.current_inventory = inventory.data;
                        }else{
                            if($scope.tab == 'quantity'){
                                if($scope.receive_items.location){
                                    $scope.current_inventory = [{
                                        "itemCode" : $scope.item_details.itemCode,
                                        "Qty" : 0,
                                        "type" : "quantity",
                                        "location" : $scope.receive_items.location
                                    }];
                                }else if($scope.locations.length){
                                    for(let i = 0; i < $scope.locations.length; i++){
                                        $scope.current_inventory.push({
                                            "itemCode" : $scope.item_details.itemCode,
                                            "Qty" : 0,
                                            "type" : "quantity",
                                            "location" : $scope.locations[i].name
                                        });
                                    }
                                }
                            }
                        }
                    }, (error, status) => {
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    })
            }
        }

        $scope.searchItem = () => {
            if($scope.receive_items.item_search){
                startLoader();
                $http.get("/dash/item/search?search=" + ($scope.receive_items.item_search.itemCode ? encodeURIComponent($scope.receive_items.item_search.itemCode) : encodeURIComponent($scope.receive_items.item_search)))
                    .then(items => {
                        stopLoader();
                        if(items.data && items.data.length){
                            $scope.inventory_search = items.data;
                            
                            if(items.data.length == 1){
                                if(items.data[0].cloudinaryURL && items.data[0].cloudinaryURL != "undefined"){
                                    if(typeof items.data[0].cloudinaryURL == "string"){
                                        let imageURL = items.data[0].cloudinaryURL;
                                        items.data[0].cloudinaryURL = [{
                                            "image" : imageURL
                                        }];
                                    }else if(items.data[0].cloudinaryURL instanceof Array){
                                        if(items.data[0].cloudinaryURL.length){
                                            console.log("Images are available & in array -- ");
                                        }else{
                                            items.data[0].cloudinaryURL = [{
                                                "image" : "appimages/product_image_not_available.png"
                                            }];                                }
                                    }
                                }else{
                                    items.data[0].cloudinaryURL = [{
                                        "image" : "appimages/product_image_not_available.png"
                                    }];
                                }
                                $scope.receive_items.item_search = items.data[0];
                                $scope.item_details = items.data[0];
                                $scope.fetchInventory();
                            }else{
                                $scope.item_details = {};
                            }
                        }
                    }, (error, status) => {
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    })
            }
        };

        $scope.selectItem = item => {
            if(item.cloudinaryURL && item.cloudinaryURL != "undefined"){
                if(typeof item.cloudinaryURL == "string"){
                    let imageURL = item.cloudinaryURL;
                    item.cloudinaryURL = [{
                        "image" : imageURL
                    }];
                }else if(item.cloudinaryURL instanceof Array){
                    if(item.cloudinaryURL.length){
                        console.log("Images are available & in array -- ");
                    }else{
                        item.cloudinaryURL = [{
                            "image" : "appimages/product_image_not_available.png"
                        }];                                }
                }
            }else{
                item.cloudinaryURL = [{
                    "image" : "appimages/product_image_not_available.png"
                }];
            }

            $scope.item_details = item;
            $scope.fetchInventory();
        }

        $scope.scanItem =  () => {
            if($scope.receive_items.scan_items){
                if(JSON.stringify($scope.serial_items).indexOf($scope.receive_items.scan_items) == -1){
                    if($scope.receive_items.scan_items && $scope.receive_items.location){
                        $scope.serial_items.push({
                            "itemCode" : $scope.item_details.itemCode,
                            "serial_number" : $scope.receive_items.scan_items,
                            "location" : $scope.receive_items.location,
                            "type" : "serial"
                        })
                        $scope.receive_items.scan_items = '';
                    }
                }else Settings.fail_toast("Error", "Scanned Item Already Exists");
            }else Settings.fail_toast("Error", "Enter the Serial Number / Unique Code");
        };

        const receiveInventory = items => {
            startLoader();
            $http.put("/dash/inventory/items/receive?tab=" + $scope.tab, items)
                .then(receive => {
                    stopLoader();
                    if(receive.data && receive.data.status == "success"){
                        Settings.success_toast("Success", "Received Items Successfully");
                        $scope.current_inventory = [];
                        $scope.serial_items = [];
                        $scope.misc_items = [];
                    }else{
                        Settings.fail_toast("Error", "Error receiving items to inventory");
                    }
                }, (error, status) => {
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                })
        }

        $scope.addToList = () => {
            if($scope.misc_item.itemCode && $scope.misc_item.Product && $scope.misc_item.receive && $scope.receive_items.location){
                if(JSON.stringify($scope.misc_items).indexOf($scope.misc_item.itemCode) == -1 && 
                    JSON.stringify($scope.misc_items).indexOf($scope.misc_item.Product) == -1){
                    $scope.misc_items.push({
                        "itemCode" : $scope.misc_item.itemCode,
                        "Product" : $scope.misc_item.Product,
                        "receive" : $scope.misc_item.receive,
                        "location" : $scope.receive_items.location,
                        "type" : "miscellaneous"
                    })
                }else Settings.fail_toast("Error", "Scanned Item Already Exists");
            }
        }

        $scope.receiveInventory = () => {
            if($scope.tab == "quantity"){
                console.log("Receive Inventory ---> ", $scope.current_inventory);
                if($scope.current_inventory.length){
                    let receive_items = [];
                    receive_items = $scope.current_inventory.filter(el => el.receive && el.receive > 0);
                    console.log(receive_items);
    
                    if(receive_items.length){
                        Settings.confirmPopup("Confirm", "Are you sure?\nNote that this will update the inventory data.",
                        result => {
                            if(result){
                                receiveInventory(receive_items);
                            }
                        })
                    }else Settings.fail_toast("Error", "Enter receiving quantity for atleast 1 item location");
                }
            }else if($scope.tab == "serial") {
                console.log("Receive Inventory ---> ", $scope.serial_items);
                if($scope.serial_items.length){
                    Settings.confirmPopup("Confirm", "Are you sure?\nNote that this will update the inventory data.",
                        result => {
                            if(result)
                                receiveInventory($scope.serial_items);
                        });
                }
            }else if($scope.tab == "miscellaneous"){
                console.log("Receive Inventory ---> ", $scope.misc_items);
                if($scope.misc_items.length){
                    Settings.confirmPopup("Confirm", "Are you sure?\nNote that this will update the inventory data.",
                        result => {
                            if(result)
                                receiveInventory($scope.misc_items);
                        });
                }
            }
            
        }

        if($scope.user_details.role == "Admin"){
            fetchLocations();
        }

        if($scope.tab != "miscellaneous"){
            if($routeParams.item && $routeParams.item != 'undefined'){
                $scope.receive_items.item_search = $routeParams.item;
                $scope.searchItem();
            }
        }
        

        $scope.reset = () => {
            $scope.current_inventory = [];
            $scope.receive_items.item_search = '';
            $scope.item_details = {};
            $scope.misc_item = {};
            $scope.misc_items = [];
        }

        console.log($scope.receive_items);
    })

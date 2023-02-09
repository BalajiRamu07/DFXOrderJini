/**
 * Created by shreyasgombi on 27/09/22.
 */

 angular.module('ebs.controller')
    .controller("InventoryTransferCtrl",function ($scope, $routeParams, $http, Settings, $window) {
        console.log("Hello From Transfer Inventory Controller .... !!!!");

        $scope.tab = "quantity";

        $scope.tab = ($routeParams.tab && $routeParams.tab != "quantity") ? ($routeParams.tab ? $routeParams.tab : "quantity") : "quantity";

        //... Transfer Items....
        $scope.transfer_items = {};
        $scope.transfer_items.item_search = "";
        $scope.transfer_items.from_location = "";
        $scope.transfer_items.to_location = "";

        $scope.locations = [{"name" : "DEFAULT", "type" : "Real Location"}];

        //... From Inventory Stats.....
        $scope.from_inventory = [];

        //... From Inventory Stats.....
        $scope.to_inventory = [];

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

        $scope.fetchMiscInventory = () => {
            startLoader();
            
            //.... Reset the display....
            $scope.from_inventory = [];
            $scope.to_inventory = [];

            if($scope.transfer_items.from_location){
                let query = new URLSearchParams();

                if($scope.tab) query.append("tab", $scope.tab);

                if($scope.transfer_items.item_search) {
                    query.append("item", $scope.transfer_items.item_search);
                    query.append("location", $scope.transfer_items.from_location);
    
                    $http.get("/dash/inventory/search?" + query.toString())
                    .then(inventory => {
                        stopLoader();
                        if(inventory.data && inventory.data.length){
                            inventory.data.map(el => {
                                if(!el.type) el.type = "quantity";
                            })
                            $scope.from_inventory = inventory.data;
                        }else{
                            $scope.from_inventory = [{
                                "itemCode" : $scope.transfer_items.item_search,
                                "Qty" : 0,
                                "type" : "miscellaneous",
                                "location" : $scope.transfer_items.from_location
                            }];
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
                }else stopLoader();
                if($scope.transfer_items.to_location) {
                    let query = new URLSearchParams();

                    if($scope.tab) query.append("tab", $scope.tab);
                    if($scope.transfer_items.item_search) {
                        query.append("item", $scope.transfer_items.item_search);
                        query.append("location", $scope.transfer_items.to_location); 
        
                        $http.get("/dash/inventory/search?" + query.toString())
                        .then(inventory => {
                            stopLoader();
                            if(inventory.data && inventory.data.length){
                                inventory.data.map(el => {
                                    if(!el.type) el.type = "quantity";
                                })
                                $scope.to_inventory = inventory.data;
                            }else{
                                $scope.to_inventory = [{
                                    "itemCode" : $scope.transfer_items.item_search,
                                    "Qty" : 0,
                                    "type" : "miscellaneous",
                                    "location" : $scope.transfer_items.to_location
                                }];
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
                } else stopLoader();
            } else stopLoader();
        };

        $scope.fetchInventory = tab => {
            if($scope.item_details && $scope.item_details.itemCode){
                startLoader();
                
                if(tab == 'from') $scope.from_inventory = [];
                else if(tab == 'to') $scope.to_inventory = [];
                let query = new URLSearchParams();

                if($scope.tab) query.append("tab", $scope.tab);
                if($scope.transfer_items.item_search) {
                    if($scope.transfer_items.item_search.itemCode) query.append("item", $scope.transfer_items.item_search.itemCode);
                    else query.append("item", $scope.transfer_items.item_search);
                }

                //console.log(tab, $scope.transfer_items.from_location, $scope.transfer_items.to_location)
                if(tab == 'from'){
                    if($scope.transfer_items.from_location) 
                        query.append("location", $scope.transfer_items.from_location);
                } else if(tab == 'to'){
                    if($scope.transfer_items.to_location) 
                        query.append("location", $scope.transfer_items.to_location);
                }
                    
                $http.get("/dash/inventory/search?" + query.toString())
                    .then(inventory => {
                        stopLoader();
                        if(inventory.data && inventory.data.length){
                            inventory.data.map(el => {
                                if(!el.type) el.type = "quantity";
                            })
                            if(tab == 'from')
                                $scope.from_inventory = inventory.data;
                            else if(tab == 'to')
                                $scope.to_inventory = inventory.data;
                        }else{
                            if($scope.tab == 'quantity'){
                                if(tab == 'from' && $scope.transfer_items.from_location)
                                    $scope.from_inventory = [{
                                        "itemCode" : $scope.item_details.itemCode,
                                        "Qty" : 0,
                                        "type" : "quantity",
                                        "location" : $scope.transfer_items.from_location
                                    }];
                                else if(tab == 'to' && $scope.transfer_items.to_location)
                                    $scope.to_inventory = [{
                                        "itemCode" : $scope.item_details.itemCode,
                                        "Qty" : 0,
                                        "type" : "quantity",
                                        "location" : $scope.transfer_items.to_location
                                    }];
                                else if($scope.locations.length){
                                    for(let i = 0; i < $scope.locations.length; i++){
                                        if(tab == 'from')
                                            $scope.from_inventory.push({
                                                "itemCode" : $scope.item_details.itemCode,
                                                "Qty" : 0,
                                                "type" : "quantity",
                                                "location" : $scope.locations[i].name
                                            });
                                        else if(tab == 'to')
                                            $scope.to_inventory.push({
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
            if($scope.transfer_items.item_search){
                startLoader();
                $http.get("/dash/item/search?search=" + ($scope.transfer_items.item_search.itemCode ? encodeURIComponent($scope.transfer_items.item_search.itemCode) : encodeURIComponent($scope.transfer_items.item_search)))
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
                                $scope.transfer_items.item_search = items.data[0];
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

        const transferInventory = items => {
            startLoader();
            $http.put("/dash/inventory/items/transfer?tab=" + $scope.tab, items)
                .then(transfer => {
                    stopLoader();
                    if(transfer.data && transfer.data.status == "success"){
                        Settings.success_toast("Success", "Transfer Items Successfully");
                        $scope.from_inventory = [];
                        $scope.to_inventory = [];
                        $scope.serial_items = [];
                        $scope.misc_items = [];

                        $scope.transfer_items.from_location = "";
                        $scope.transfer_items.to_location = "";
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
        };

        $scope.transferInventory = () => {
            if($scope.tab == "quantity"){
                console.log("Transfer Inventory ---> ", $scope.from_inventory, $scope.to_inventory);
                if($scope.from_inventory.length && $scope.to_inventory.length){
                    if($scope.transfer_items.from_location != $scope.transfer_items.to_location){
                        let transfer_items = [];
                        transfer_items = $scope.from_inventory.filter(el => el.transfer && el.transfer > 0);
                        transfer_items.map(el => el.to_location = $scope.transfer_items.to_location);
    
                        console.log(transfer_items);
        
                        if(transfer_items.length){
                            Settings.confirmPopup("Confirm", "Are you sure?\nNote that this will update the inventory data.",
                            result => {
                                if(result){
                                    transferInventory(transfer_items);
                                }
                            })
                        }else Settings.fail_toast("Error", "Enter the transfer quantity");
                    }else Settings.fail_toast("Error", "From and To Location Cannot be the same");
                }else Settings.fail_toast("Error", "Select both From and To Location");
            }else if($scope.tab == "serial") {
                console.log("Transfer Inventory ---> ", $scope.serial_items);
                if($scope.transfer_items.from_location != $scope.transfer_items.to_location){
                    if($scope.serial_items.length){
                        Settings.confirmPopup("Confirm", "Are you sure?\nNote that this will update the inventory data.",
                            result => {
                                $scope.serial_items.map(el => el.to_location = $scope.transfer_items.to_location);
                                if(result)
                                    transferInventory($scope.serial_items);
                            });
                    }
                }else Settings.fail_toast("Error", "From and To Location Cannot be the same");
            }else if($scope.tab == "miscellaneous"){
                console.log("Transfer Inventory ---> ", $scope.from_inventory, $scope.to_inventory);
                if($scope.transfer_items.from_location != $scope.transfer_items.to_location){
                    if($scope.from_inventory.length && $scope.to_inventory.length){
                        let items = $scope.from_inventory.filter(el => el.transfer && el.transfer > 0);
                        console.log(items);

                        if(items.length){
                            items.map(el => el.to_location = $scope.transfer_items.to_location);

                            console.log(items);
                            Settings.confirmPopup("Confirm", "Are you sure?\nNote that this will update the inventory data.",
                            result => {
                                if(result)
                                   transferInventory(items);
                            });
                        }else Settings.fail_toast("Error", "Enter the transfer quantity");
                    }else Settings.fail_toast("Error", "Choose Items from Inventory Locations");
                }else Settings.fail_toast("Error", "From and To Location Cannot be the same");
            }
            
        }

        $scope.scanItem =  () => {
            if($scope.transfer_items.scan_items){
                if(JSON.stringify($scope.serial_items).indexOf($scope.transfer_items.scan_items) == -1){
                    if($scope.transfer_items.scan_items && $scope.transfer_items.from_location){
                        startLoader();
                        
                        let query = new URLSearchParams();
                        //.... Set the tab.....
                        if($scope.tab) query.append("tab", $scope.tab);

                        //..... Set the item.....
                        if($scope.transfer_items.item_search) {
                            if($scope.transfer_items.item_search.itemCode) query.append("item", $scope.transfer_items.item_search.itemCode);
                            else query.append("item", $scope.transfer_items.item_search);
                        }

                        //.... Set the location....
                        if($scope.transfer_items.from_location) 
                            query.append("location", $scope.transfer_items.from_location);
                        
                        if($scope.transfer_items.scan_items) query.append("serial", $scope.transfer_items.scan_items);

                        $http.get("/dash/inventory/search?" + query.toString())
                            .then(inventory => {
                                stopLoader();
                                console.log(inventory);
                                if(inventory.data.length){
                                    $scope.serial_items.push({
                                        "itemCode" : $scope.item_details.itemCode,
                                        "serial_number" : $scope.transfer_items.scan_items,
                                        "location" : $scope.transfer_items.from_location,
                                        "to_location" : $scope.transfer_items.to_location,
                                        "type" : "serial"
                                    })

                                    $scope.transfer_items.scan_items = '';
                                }else Settings.fail_toast("Error", "Scanned Serial Number is not available");
                            });
                    }
                }else Settings.fail_toast("Error", "Scanned Item Already Exists");
            }else Settings.fail_toast("Error", "Enter the Serial Number / Unique Code");
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

            $scope.from_inventory = [];
            $scope.to_inventory = [];
            
            $scope.transfer_items.from_location = "";
            $scope.transfer_items.to_location = "";

            $scope.fetchInventory();
        }

        if($scope.user_details.role == "Admin"){
            fetchLocations();
        }

        if($scope.tab != "miscellaneous"){
            if($routeParams.item && $routeParams.item != 'undefined'){
                $scope.transfer_items.item_search = $routeParams.item;
                $scope.searchItem();
            }
        }
        

        $scope.reset = () => {
            $scope.from_inventory = [];
            $scope.to_inventory = [];

            $scope.transfer_items.from_location = "";
            $scope.transfer_items.to_location = "";

            $scope.transfer_items.item_search = '';
            $scope.item_details = {};
            $scope.misc_item = {};
            $scope.misc_items = [];
        }


    })

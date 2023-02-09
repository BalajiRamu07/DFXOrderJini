/**
 * Created by Bharat DN on 08/09/20.
 */

 angular.module('ebs.controller')

    .controller("CatalogDetailsCtrl",function ($scope, $http, $routeParams, $window, $location, Settings) {
    
        console.log("Hello From Catalog Details Controller .... !!!!", $routeParams.id);

        //.... Ticket information....
        $scope.catalog = {};

        $scope.user_details = {};

        $scope.nav = [];
        $scope.settings = {};
        $scope.settings.edit = {};
        $scope.settings.delete = {};

        $scope.pricelists = [];

        $scope.percentageDiscountFlag = false;

        Settings.getNav(false, nav => {
            $scope.nav = nav;
        })

        Settings.getUserInfo(user_details => {
            console.log(user_details);
            if(user_details.sellerObject)
                $scope.user_details = user_details.sellerObject;
            else $scope.user_details = user_details;
        })

        //.... Ticket ID from the params...
        const catalog_id =  $routeParams.id;
        let instance_details = Settings.getInstance();
        
        $scope.percentageDiscountFlag = instance_details.percentageDiscount;
        $scope.currency = instance_details.currency || "₹";
        $scope.country = instance_details.country || "India";

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        if($scope.percentageDiscountFlag) $location.path("/catalog-detail/" + encodeURIComponent(catalog_id));
        console.log("Catalog Details for - ", catalog_id);

        const loadMasterPricelist = () => {
            $http.get("/dash/settings/details/dealerClass")
                .then((classes) => {
                    stopLoader();
                    console.log(classes);
                    if(classes.data){
                        if(!classes.data.status || classes.data.status != 'error'){
                            if(classes.data.obj && classes.data.obj.length){
                                let pricelist_classes = classes.data.obj;
                                function onlyUnique(value, index, self) {
                                    return self.indexOf(value) === index;
                                }
                                for(let i = 0 ; i < pricelist_classes.length; i++){
                                    $scope.pricelists.push(pricelist_classes[i].priceList)
                                }
                                let unique = $scope.pricelists.filter(onlyUnique);
                                console.log(unique);
                                $scope.pricelists = unique;
                            }
                        }else
                            console.log("Invalid Request : ", classes);
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


        const fetchAccesses = () => {
            $http.get("/dash/settings/admin/role/access")
                .then(access => {
                    console.log(access);
                    if(access.data && (!access.data.status || access.data.status != "error")){
                        if(access.data.length){
                            for(let i = 0; i < access.data.length; i++)
                                if(access.data[i].action == 'edit') $scope.settings.edit = access.data[i].status;
                                else if(access.data[i].action == 'delete') $scope.settings.delete = access.data[i].status;
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
        }

        ///..... Function to fetch ticket details....
        const getItemDetails = () => {
            startLoader();
            if(catalog_id){
                $http.get('/dash/item/details/'+ catalog_id)
                    .then(item_details => {
                        console.log("Catalog Details -> ", item_details.data);
                        
                        if(item_details.data[0].cloudinaryURL && item_details.data[0].cloudinaryURL != "undefined"){
                            if(typeof item_details.data[0].cloudinaryURL == "string"){
                                let imageURL = item_details.data[0].cloudinaryURL;
                                item_details.data[0].cloudinaryURL = [{
                                    "image" : imageURL
                                }];
                            }else if(item_details.data[0].cloudinaryURL instanceof Array){
                                if(item_details.data[0].cloudinaryURL.length){
                                    console.log("Images are available & in array -- ");
                                }else{
                                    item_details.data[0].cloudinaryURL = [{
                                        "image" : "appimages/product_image_not_available.png"
                                    }];                                }
                            }
                        }else{
                            item_details.data[0].cloudinaryURL = [{
                                "image" : "appimages/product_image_not_available.png"
                            }];
                        }

                        $scope.catalog = item_details.data[0];
                        stopLoader();
                        
                        $http.get("/dash/customerItems/"+ catalog_id).success(function (res) {
                            console.log("sales org details");
                            console.log(res);
                            $scope.salesOrg = res;
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
            }
        }

        /*.......
         Delete item from items collection
        ..... */
        $scope.deleteItem = () => {

            Settings.confirmPopup("CONFIRM", "Are you sure you want to delete this item from Catalog? ", result => {
                if(result){
                    startLoader();
                    $http.delete("/dash/item/delete/"+catalog_id)
                        .then(deleted_item => {
                            stopLoader();
                            if(deleted_item.data){
                                Settings.success_toast("Success", "Successfully deleted " + $scope.catalog.Product);
                                $window.history.back();
                            } else Settings.fail_toast("Error", "Failed to delete " + $scope.catalog.Product + ". Please try after sometime.");
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
        };

        loadMasterPricelist();
        getItemDetails(catalog_id);

        if($scope.user_details.role)
            fetchAccesses();
        else{
            $scope.settings.edit = {"catalog" : true};
            $scope.settings.delete = {"catalog" : true};
        }
    })
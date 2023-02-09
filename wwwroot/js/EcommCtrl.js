/**
 * Created by shreyasgombi on 05/07/22.
 */

 angular.module('ebs.controller')

 .controller("EcommCtrl", ($scope, $routeParams, $http, $window, Settings) => {
        console.log("Hello From Ecomm Settings Controller .... !!!!");

        $scope.companyDetails = {};

        $scope.appBanner = {};
        $scope.appBanner.title = '';
        $scope.appBanner.heading1 = '';
        $scope.appBanner.heading2 = '';
        $scope.appBanner.appimage = '';

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        };

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        const fetchEcommDetails = () => {
            $http.get('/dash/settings/details/ecomm')
                .then(ecomm_setup => {
                    console.log("Ecomm Setup --> " + ecomm_setup.data);
                    if(ecomm_setup.data){
                        $scope.companyDetails = ecomm_setup.data;

                        $scope.companyDetails.domain = (window.location.hostname == 'localhost'? ('http://' + window.location.host) : ('https://' + window.location.host))
                    }
                });
        }

        const fetchAppBanner = () => {
            startLoader();
            $http.get('/dash/settings/appBanner')
                .then(appBanner => {
                    stopLoader();
                    console.log("Get dist App Banner --> " + appBanner.data.length);
                    if(appBanner.data.length){
                        $scope.appBannerData = appBanner.data[0].banner;
                    }
                });
        }

        const fetchDistMatrix = () => {
            startLoader();
            $http.get('/dash/settings/distMatrix')
                .then(matrixData => {
                    stopLoader();
                    console.log("Get dist Matrix --> "+ matrixData.data.length);
                    if(matrixData.data.length){
                        $scope.deliveryData = matrixData.data[0].matrix;
                    }
                });
        }

        
        // AppBanner to settings collection.....
        $scope.updatePicture  = (image, appimage) => {
            if(image[0].size >= 1024000 ){
                Settings.confirmPopup('Warning', "Image Size should lesser than 1MB, Please re-upload.");
            }else {
                $scope.userPicture = appimage;
            }
        }

        // Adding AppBanner  to settings collection.....
        $scope.saveAppBanner = appBanner => {
            $scope.appBanner.appimage =   $scope.userPicture;
            if(appBanner.title) {
                $http.put('/dash/fill/appBanner', $scope.appBanner)
                    .then(response => {
                        if (response.data) {
                            $http.get('/dash/settings/appBanner')
                                .then(appBanner => {
                                    if (appBanner.data.length) $scope.appBannerData = appBanner.data[0].banner;
                                });
                            $scope.appBanner.title = '';
                            $scope.appBanner.heading1 = '';
                            $scope.appBanner.heading2 = '';
                            $scope.appBanner.appimage = '';

                            Settings.success_toast("Success", "AppBanner Added Successfully");
                        }
                    });

            } else Settings.failurePopup('ERROR',"Please enter Title");
        }

        $scope.updatePicture1 = (image, appimage) => {
            if(image[0].size >= 1024000 ){
                Settings.confirmPopup('warning',"Image Size should lesser than 1MB, Please re-upload.");
            }else {
                $scope.userPicture1 = appimage;
            }
        }

        /*
            Enable SuperJIni for store
        */

        //.... Enable/disable to superjini...
        $scope.superJiniStore = enable => {
            console.log("Super Jini store enable function");
            let ecomm = {
                "store_id" : "",
                "storeURL" : "",
                "storeVal" : "",
                "superjini" : false
            };

            if(enable){
                ecomm.store_id = parseInt(Math.random() + new Date().getTime());
                ecomm.superjini = true;
            } else{
                ecomm.store_id = '';
                ecomm.storeURL = '';
                ecomm.storeVal = '';
            }

            $http.put("/dash/settings/enable/superjini", ecomm)
                .then(response => {
                    if (!response.data) {
                        alert("Something went wrong");
                        $scope.superjini = false;
                    } else {
                        if(enable){
                            console.log("SuperJini Store enabled --> " + response.data.length);
                            Settings.success_toast("Added to SuperJini Store Successfully!");
                            if(!response.data.Dealercode){
                                $http.get('/dash/get/recentID/'+'dealer')
                                    .then(storeRes => {
                                        $scope.dealer = {};
                                        $scope.dealer.store_id = store_id;
                                        $scope.dealer.Dealercode = storeRes.data.Dealercode + 1;
                                        $scope.dealer.DealerName = response.data.storeName
                                        $scope.dealer.Address = response.data.companyAddress
                                        $scope.dealer.Address2 = ''
                                        $scope.dealer.City = ''
                                        $scope.dealer.Category = ''
                                        $scope.dealer.SellerName = ''
                                        $scope.dealer.Seller = ''
                                        $scope.dealer.Phone = response.data.phone;
                                        $scope.dealer.companyIdc = response.data.companyIdc;
                                        $scope.dealer.companyName = response.data.companyName;
                                        $scope.dealer.gst = response.data.gstNumber;
                                        $scope.dealer.companyEmail = response.data.companyEmail;
                                        $scope.dealer.api_key = response.data.api_key;
                                        $scope.dealer.coID = response.data.coID;
                                        $scope.dealer.full_name = response.data.full_name;
                                        $scope.dealer.superJiniStore = true;
                                        $scope.dealer.cloudinaryURL = [];
                                        if(response.data.logo_url){
                                            $scope.dealer.cloudinaryURL.push(response.data.logo_url);
                                        } else $scope.dealer.cloudinaryURL = [];
                                        $scope.dealer.doccloudinaryURL = [];

                                        $http.post('/dash/stores/add/new',$scope.dealer)
                                            .then(dealerAdded => {
                                                console.log(dealerAdded.data);
                                                if(dealerAdded.data.ops[0].Dealercode){
                                                    $http.put("/jini/memberDealer/"+ dealerAdded.data.ops[0].Dealercode)
                                                        .then(code => {
                                                            console.log("dealercode put in members for identification" + code.data);
                                                        })
                                                }
                                            })
                                    })
                            }
                        } else {
                            console.log("SuperJini Store enabled --> " + response.data.length);
                            Settings.info_toast("Successfully removed from SuperJini Store!");
                        }
                    }
                })
        }

        $scope.saveStoreURL = storeVal => {
            /*
                Save store URL and store name...
             */
            $http.put("/jini/superjiniURLs", {storeVal: storeVal})
                .then(response => {
                    console.log(response.data);
                    if(response.data == 'store exists') Settings.fail_toast('ERROR', "Store URL already exists");
                    else if (!response.data) Settings.fail_toast('ERROR', "Something went wrong!");
                    else Settings.success_toast('SUCCESS', "Store URL Updated!");
                });
        };

        //.... Edit and update AppBanner.......
        $scope.editAppBannerFromSetting = (newAppBanner, index) => {

            if(newAppBanner.title) {
                $http.get('/dash/settings/appBanner')
                    .then(appBanner => {
                        if (appBanner.data.length) $scope.appBannerData = appBanner.data[0].banner;
                    });

                if($scope.userPicture1) newAppBanner.appimage = $scope.userPicture1;

                for (var i = 0; i < $scope.appBannerData.length; i++) {
                    $scope.appBannerData[i].edited = false ;

                    if (i == index) {
                        $scope.appBannerData[i] = newAppBanner;
                        $scope.appBannerData[i].edited = true;
                    }
                }


                $http.put('/dash/edit/appBanner', $scope.appBannerData)
                    .then(response => {
                        if (response.data) {
                            $http.get('/dash/settings/appBanner')
                                .then(appBanner => {
                                    if (appBanner.data.length) {
                                        $scope.appBannerData = appBanner.data[0].banner;
                                    }
                                });
                            Settings.success_toast("Success", "App Banner Updated Successfully");
                        }
                    });
            } else Settings.failurePopup('ERROR',"Please enter Title");
        }


        $scope.addStoreAddress = () => {
            var input = document.getElementById('store_address');

            if(input && google.maps){
                var companyAddress_autocomplete = new google.maps.places.Autocomplete(input);

                companyAddress_autocomplete.addListener('place_changed', function () {
                    var newplace = companyAddress_autocomplete.getPlace();
    
                    //.... We save the full address, lat and long....
                    $scope.companyDetails.storeAddress = newplace.formatted_address;
                    $scope.companyDetails.storeLatitude = newplace.geometry.location.lat();
                    $scope.companyDetails.storeLongitude = newplace.geometry.location.lng();
    
                    //.... For tax calculations, we save the State and Country, etc.....
                    for (var i = 0; i < newplace.address_components.length; i++) {
                        console.log(newplace.address_components[i]);
                        if(newplace.address_components[i].types[0]=="administrative_area_level_1"){
                            $scope.companyDetails.storeState = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0]=="country"){
                            $scope.companyDetails.storeCountry = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0]=="locality")
                            $scope.companyDetails.storeCity = newplace.address_components[i].long_name;
    
                        if(newplace.address_components[i].types[0] == "postal_code")
                            $scope.companyDetails.storePostalCode = newplace.address_components[i].long_name;
                    }
                })
            }else console.log("Err : Could not initialise google address input element / Error loading Google Maps SDK");
        }

        $scope.setStoreDetails = () => {
            $http.put("/dash/settings/ecomm/details", $scope.companyDetails)
                .then(response => {
                    if(response.data && response.data.status == "success"){
                        Settings.success_toast('SUCCESS', "Ecomm Details Updated!");
                    } else {
                        Settings.fail_toast("ERROR", "Store Name already Exists!")
                    }
                })
        }

        //... Remove AppBanner to settings collection.....

        $scope.removeAppBanner = function(index){
            // console.log(index);
            $scope.appBannerData.splice(index, 1);
             console.log($scope.appBannerData);

            $http.put('/dash/edit/appBanner',$scope.appBannerData).success(function(resp){
                if(resp){
                    // console.log(resp);
                    $http.get('/dash/settings/appBanner').success(function (appBanner) {
                        console.log("Get dist AppBanner"+ appBanner.length);
                        if(appBanner.length){
                            $scope.appBannerData = appBanner[0].banner;
                        }

                    });
                }

            });

        }


        //..... set subscription threshold (1to1)........
        $scope.setSubscriptionThreshold = function () {
            console.log($scope.subscription);
            $http.put("/dash/settings/update/subscription", $scope.subscription)
                .success(function(res){
                    console.log(res)
                    if(res)
                        Settings.success_toast('SUCCESS','Minimum Subscription Balance Updated Successfully!');

                }).error(function (error) {
                Settings.failurePopup('ERROR', 'Failed to update!');
            })

        };

        $scope.distMaxtrix = {}
        $scope.distMaxtrix.minAmount = '';
        $scope.distMaxtrix.maxAmount = '';
        $scope.distMaxtrix.minDist = '';
        $scope.distMaxtrix.maxDist = '';
        $scope.distMaxtrix.deliveryFee = '';

        $scope.addDelivery = () => {
            console.log($scope.distMaxtrix);
            $http.put('/dash/fill/distMatrix',$scope.distMaxtrix)
                .then(response => {
                    if(response.data){
                        fetchDistMatrix();

                        $scope.distMaxtrix.minAmount = '';
                        $scope.distMaxtrix.maxAmount = '';
                        $scope.distMaxtrix.minDist = '';
                        $scope.distMaxtrix.maxDist = '';
                        $scope.distMaxtrix.deliveryFee = '';
                    }
                });

        }
        $scope.removeDelivery = index => {
            
            $scope.deliveryData.splice(index, 1);

            $http.put('/dash/edit/distMatrix',$scope.deliveryData)
                .then(response => {
                    if(response.data){
                        fetchDistMatrix();
                    }
                });
        }

        fetchAppBanner();
        fetchDistMatrix();
        fetchEcommDetails();


        const loadScript = (key, type, charset) => {
            if(!google || !google.maps){
                console.log("No google SDK found, loading a new one - " + key);
                let url = 'https://maps.google.com/maps/api/js?key=' + key + '&libraries=geometry,places';
                let heads = document.getElementsByTagName("head");

                if (heads && heads.length) {
                    let head = heads[0];
                    if (head) {
                        var script = document.createElement('script');
                        script.setAttribute('src', url);
                        script.setAttribute('type', type);
                        if (charset) script.setAttribute('charset', charset);
                        head.appendChild(script);
                    }
                }
            }else
                console.log("Voila! Google is already loaded on your browser ---> ");
        };

        loadScript(Settings.getInstanceDetails('gMapAPI'), 'text/javascript', 'utf-8');
 });
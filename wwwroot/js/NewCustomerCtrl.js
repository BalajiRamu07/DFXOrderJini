/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("NewCustomerCtrl",function ($scope, $filter, $http, $modal, $window, toastr,Settings, $interval,$sce,$mdDialog,$location) {
        console.log("Hello From New Customer Controller .... !!!!");

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
        $scope.default_CountryCode = '';

        var viewBy = {};
        viewBy.dealer = 12;
        var initialViewBy = 60;
        var dealerSearchObj = {};
        $scope.orders = [];
        $scope.nav = [];
        $scope.newViewBy = 10;
        $scope.viewLength = 0;
        $scope.newViewBy = viewBy.dealer;
        $scope.displayDealerRefresh = true;
        $scope.serviceClients = [];
        $scope.leadserviceClients=[];
        dealerSearchObj.viewLength = 0;
        dealerSearchObj.viewBy = initialViewBy;
        dealerSearchObj.searchFor = '';
        dealerSearchObj.seller = '';
        dealerSearchObj.stockist = '';
        dealerSearchObj.searchBy = [];
        dealerSearchObj.searchByArea = [];
        dealerSearchObj.searchRegion = [];
        dealerSearchObj.searchBycustomertype='';
        $scope.customerType='customer';


        $scope.dealerSelectAll.city = true;
        $scope.leadstatus=[];
        $scope.leadsource=[];
        // $scope.customer_type = [];
        $scope.showStoreFilter = false;
        $scope.filter.sales = "All";
        $scope.filter.branch = "All";
        $scope.filter.class = "All";
        var instanceDetails =  Settings.getInstance();
        $scope.currencySet = Settings.getInstanceDetails('currency');

        console.log(instanceDetails);
        $scope.coID = instanceDetails.coID;
        $scope.leadstatus=instanceDetails.leadStatus;
        $scope.leadsource=instanceDetails.leadSource;
        // $scope.customer_type=instanceDetails.customerCategory;
        $scope.dealerClasses = instanceDetails.dealerClass ;
        $scope.masterPriceList = instanceDetails.masterPriceList;
        $scope.country = {};
        $scope.country.name = instanceDetails.country || 'India';
        $scope.default_CountryCode = '+91';
        $scope.default_CountryCode = instanceDetails.countryCode;
        $scope.tempCountryName = $scope.country.name.toLowerCase();
        $scope.dealerNotificationFlag = instanceDetails.dealerNotificationFlag || false;
        $scope.dealerAsUserFlag = instanceDetails.dealerAsUserFlag || false;

        $scope.dealerfilterFlag = false ;

        $scope.disableFlag = false;

        // $scope.cityFilterFlag = false;
        // $scope.areaFilterFlag = false;

        //Checkin Map Icons
        $scope.checkinIcons = [];
        $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';

        $scope.renderInstanceDetails = function (response) {
            console.log("Instance Details for Dealers -->");
            // console.log(response);
            if(response.dealerClass){
                $scope.dealerClasses = instanceDetails.dealerClass ;
            }
            if(response.masterPriceList){
                $scope.masterPriceList = instanceDetails.masterPriceList;
            }
        };

        $http.get('/dash/enforce/credit/fetch')
            .success(function (response) {
                if (response.length) {
                    $scope.enforceCredit = response[0].enforceCredit;
                }
            })

        $scope.getPlantCode = function () {
            $http.post("/dash/suppliers/plantcodes")
                .then(res => {
                if(res && res.data){
                $scope.plantCodes = res.data
            }
        })
        };

        $scope.getPlantCode();

        $scope.countryCodeGet = function () {
            console.log('get country codes and set default country code');
            $http.get("/country/countryCode").success(function (res) {

                if(res){
                    $scope.countryCode = res;
                }
            })
        };

        const fetchCustomerType = () => {
            $http.get("/dash/settings/details/customerCategory")
                .then(type => {
                if(type.data){
                $scope.customer_type = type.data.obj;
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

        $scope.countryCodeGet();
       fetchCustomerType();


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
        $http.get("/dash/stores/all/stockist").success(function (response) {
             console.log("stockist=====",response);
            allStockist = response;
            $scope.allStockistFromDealer = allStockist.unique('Stockist');
            for (var i = 0; i < response.length; i++)
                $scope.sellerNames[response[i].Stockist] = response[i].StockistName;
        }).error(function (error, status) {
            console.log(error, status);
            if (status >= 400 && status < 404)
                $window.location.href = '/404';
            else if (status >= 500)
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
                        if(salesperson[i] && salesperson[i].userStatus == 'Active')
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

        // $scope.changeDealerButton = function (flag) {
        //     if (flag == 0) {
        //         $scope.dealerListPage = true ;
        //         $scope.dealerAddPage = false ;
        //         $scope.dealerEditPage = false ;
        //         $scope.dealer = {};
        //         $scope.dealer.City = '';
        //         $scope.dealer.Pincode = '';
        //         $scope.dealer.Area = '';
        //         $scope.enquiry = [];
        //         $scope.EnquiryBranch = {};
        //         $scope.newDevices = [];
        //         $scope.newStoreImageArray.customerImage = [] ;
        //         $scope.newStoreImageArray.customerDoc = [] ;
        //         // jQuery.noConflict();
        //         // $(".itemsDropdown").css('display', 'none')
        //     }
        //     else if (flag == 1) {
        //         console.log("sandeep")
        //         $scope.dealerListPage = false ;
        //         $scope.dealerAddPage = true ;
        //         $scope.addDealerButton = true;
        //
        //         // $scope.dealer.customerVariant = "regular"
        //
        //
        //         // $scope.loaded(2);
        //     }
        //     else if (flag == 2){
        //         $scope.dealerListPage = false ;
        //         $scope.dealerEditPage = true ;
        //         dealerEditimage = [];
        //         removeImageindex= [];
        //         num = 0 ;
        //     }
        // };

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
                var scope = angular.element(document.getElementById('address')).scope();
                var newplace = editDealerAddress_autocomplete.getPlace();
                var lat=newplace.geometry.location.lat();
                var long = newplace.geometry.location.lng();
                var jaddress = '';
                for(var i=0; i<newplace.address_components.length; i++){
                    if(newplace.address_components[i].types[0]=="locality"){
                        var jcity = newplace.address_components[i].long_name;
                        //var jaddress= newplace.formatted_address;
                        //var jaddress;
                    }
                    //for(let a =0; a< newplace.address_components.length; a++){
                        //console.log(newplace.address_components[i].types[0])
                        if(newplace.address_components[i].types[0] == 'plus_code'){
                            jaddress='';
                            scope.dealer.GoogleDigitalCode = newplace.address_components[i].long_name.toString();
                        }
                        else{
                            jaddress+=(newplace.address_components[i].long_name.toString());
                            jaddress+=' ';
                            //console.log('this is the new address', jaddress);
                        }
                        //this.store.Address = jaddress;
                        //console.log('this is the new address', jaddress);
                    //}
                    if(newplace.address_components[i].types[1]=="sublocality")
                        var jarea = newplace.address_components[i].long_name;
                    if(newplace.address_components[i].types[0] == "postal_code")
                        var jpostalCode = newplace.address_components[i].long_name;
                    if(newplace.address_components[i].types[0] == 'administrative_area_level_1')
                        var jstate = newplace.address_components[i].long_name;
                    if(newplace.address_components[i].types[0] == 'country')
                        var jcountry = newplace.address_components[i].long_name;
                }

                //var scope = angular.element(document.getElementById('address')).scope();
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

        $scope.clearFilter = function(tab){
            dealerSearchObj.viewLength = 0;
            dealerSearchObj.viewBy = initialViewBy;
            dealerSearchObj.searchFor = '';
            dealerSearchObj.seller = '';
            dealerSearchObj.stockist = '';
            dealerSearchObj.class = '';
            dealerSearchObj.searchBy = [];
            dealerSearchObj.searchByArea = [];
            dealerSearchObj.searchRegion = [];
            if($scope.customerType=='lead'){
                dealerSearchObj.searchBycustomertype='Lead';

            }
            else{
                dealerSearchObj.searchBycustomertype='';

            }
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

            $scope.showStoreFilter = false;
            $scope.showListDealerDetail = false;
            $scope.dealerSelectAll.city = true;
            $scope.storeMarkershowMap = true;
            $scope.disableFlag = false;


            $http.post("/dash/stores", dealerSearchObj)
                .success(function(response){
                    // $scope.multipleUsers(response);
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


            // $scope.getAllStoreCities(true,'city');
            // $scope.getAllStoreAreas(true,'area');
        };

        $scope.addDealer = function (flag) {
            $scope.disableFlag = true;

            $scope.dealer.Phone = Number($scope.dealer.Phone) ;
            if($scope.pinCodeMadatory){
                if($scope.dealer.DealerName && $scope.dealer.Phone && $scope.dealer.Pincode && $scope.dealer.Address && $scope.dealer.City){
                    if ($scope.applicationType == 'StoreJini'){
                        $scope.dealer.SellerName = $scope.user.username;
                        $scope.dealer.Seller = $scope.dealer.Seller ? Number($scope.dealer.Seller) : $scope.user.sellerphone;
                     //   $scope.dealer.Stockist = $scope.dealer.Stockist.Stockist ? Number($scope.dealer.Stockist.Stockist) : "";

                        $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : "";
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
                                    if($scope.dealer.Stockist)
                                    $scope.dealer.Stockist = $scope.dealer.Stockist.Stockist ? Number($scope.dealer.Stockist.Stockist) : null;
                                   // $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : null;

                                    $scope.dealer.cloudinaryURL = ($scope.newStoreImageArray.customerImage.length > 0) ? $scope.newStoreImageArray.customerImage : [];
                                    $scope.dealer.doccloudinaryURL = ($scope.newStoreImageArray.customerDoc.length > 0) ? $scope.newStoreImageArray.customerDoc : [];
                                    $scope.dealer.customerType = "Lead";
                                    $scope.dealer.createdDate = new Date();
                                    var date = $scope.dealer.createdDate;
                                    $scope.dealer.createdDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                    $scope.dealer.comments=[];
                                    if($scope.dealer.newcomments) {


                                        var comments = {comment: '', username: '', userphone: '', date: ''};
                                        comments.comment = $scope.dealer.newcomments;
                                        if ($scope.user.sellerObject) {
                                            comments.userphone = $scope.user.sellerObject.sellerphone;
                                            comments.username = $scope.user.sellerObject.sellername;

                                        }
                                        else {
                                            comments.userphone = 0;
                                            comments.username = 'Portal';
                                        }

                                        comments.date = new Date();
                                        var date = comments.date;
                                        comments.date = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                            + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                        $scope.dealer.comments.push(comments) ;
                                    }
                                    if($scope.dealer.Stockist) {
                                        var stockist = {Dealercode:'',Stockist:'',StockistName:''}
                                        var colStockist = $scope.allStockistFromDealer;
                                        for(var i =0 ;i<colStockist.length ; i++) {
                                            if($scope.dealer.Stockist == colStockist[i].Stockist){
                                                $scope.stockistNumber = colStockist[i].Stockist;
                                                $scope.stockistName  = colStockist[i].StockistName;

                                                stockist.Dealercode =$scope.dealer.Dealercode;
                                                stockist.Stockist = $scope.stockistNumber;
                                                stockist.StockistName = $scope.stockistName;
                                            }
                                        }
                                        if(stockist.Dealercode!='' && stockist.Stockist !='' && stockist.StockistName) {
                                            $http.post("/dash/stockist/add", stockist).success(function (res) {
                                                if (res) {
                                                    console.log("res", res);
                                                }
                                            })
                                        }
                                    }


                                    if($scope.dealer.leadstatus){
                                        var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource: '', revenueAmount: 0};
                                        leadStatusWithFollowup.leadstatus = $scope.dealer.leadstatus;
                                        leadStatusWithFollowup.leadsource = $scope.dealer.leadsource;
                                        leadStatusWithFollowup.revenueAmount = $scope.dealer.revenueAmount;
                                        if($scope.dealer.leadDate){
                                            leadStatusWithFollowup.leadDate = $scope.dealer.leadDate;
                                            var date = leadStatusWithFollowup.leadDate;
                                            leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                        }else{
                                            leadStatusWithFollowup.leadDate = new Date();
                                            var date = leadStatusWithFollowup.leadDate;
                                            leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                        }
                                        leadStatusWithFollowup.dealerId = $scope.dealer.Dealercode;
                                        if($scope.user.sellerObject){
                                            leadStatusWithFollowup.userphone=$scope.user.sellerObject.sellerphone;
                                            leadStatusWithFollowup.username=$scope.user.sellerObject.sellername;

                                        }
                                        else{
                                            leadStatusWithFollowup.userphone = 0;
                                            leadStatusWithFollowup.username='Portal';
                                        }

                                        leadStatusWithFollowup.dateAdded = new Date();
                                        var date = 	leadStatusWithFollowup.dateAdded;
                                        leadStatusWithFollowup.dateAdded = [date.getFullYear(),(date.getMonth()+1).padLeft(), date.getDate().padLeft() ].join('-') + ' '
                                            + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join (':');

                                       /*===comments part=====*/
                                        if($scope.dealer.newcomments) {

                                            leadStatusWithFollowup.comments = [];
                                            var comments = {comment: '', username: '', userphone: '', date: ''};
                                            comments.comment = $scope.dealer.newcomments;
                                            if ($scope.user.sellerObject) {
                                                comments.userphone = $scope.user.sellerObject.sellerphone;
                                                comments.username = $scope.user.sellerObject.sellername;

                                            }
                                            else {
                                                comments.userphone = 0;
                                                comments.username = 'Portal';
                                            }

                                            comments.date = new Date();
                                            var date = comments.date;
                                            comments.date = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                            leadStatusWithFollowup.comments.push(comments);
                                        }
                                        $http.post("/dash/store/lead/followup/add/" + dealerId, leadStatusWithFollowup).success(function (res) {
                                            if (res) {
                                                // $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
                                                // $scope.editedDealer.leadstatus = '';
                                                // $scope.dealer.leadstatus = '';
                                                // $scope.editedDealer.leadDate = '';
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
                                        if($scope.dealer.leadsource || $scope.dealer.revenueAmount){
                                            var dealerId = $scope.dealer.Dealercode;
                                            var leadStatusWithFollowup = {leadsource: '', revenueAmount: 0};
                                            // leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                            // leadStatusWithFollowup.leadDate = '';
                                            leadStatusWithFollowup.leadsource = $scope.dealer.leadsource;
                                            leadStatusWithFollowup.revenueAmount = $scope.dealer.revenueAmount;
                                            leadStatusWithFollowup.dateAdded = new Date();
                                            var date = leadStatusWithFollowup.dateAdded;
                                            leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                            leadStatusWithFollowup.dealerId = $scope.dealer.Dealercode;;
                                            if ($scope.user.sellerObject) {
                                                leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                            } else {
                                                leadStatusWithFollowup.userphone = 0;
                                                leadStatusWithFollowup.username = 'Portal';
                                            }

                                            //comments part
                                            leadStatusWithFollowup.comments = [];
                                            var comments = {comment: '', username: '', userphone: '', date: ''};
                                            comments.comment = $scope.dealer.newcomments;
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

                                            leadStatusWithFollowup.comments.push(comments);

                                            $http.post("/dash/store/lead/followup/add/" + dealerId, leadStatusWithFollowup).success(function (res) {
                                                if (res) {
                                                    $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
                                                    // $scope.editedDealer.leadstatus = '';
                                                    // $scope.dealer.leadstatus = '';
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
                                        }
                                    }

                                    if($scope.dealerAsUserFlag){
                                        console.log("here 1")
                                        console.log($scope.dealerAsUserFlag)
                                        var seller = {};
                                        seller.sellername = $scope.dealer.DealerName;
                                        seller.countryCode = $scope.dealer.countryCode;
                                        seller.sellerphone = Number($scope.dealer.Phone);
                                        seller.sellerid = Number($scope.dealer.Phone);
                                        seller.role = 'Dealer';
                                        seller.email = $scope.dealer.email;
                                        seller.userStatus = 'Active';
                                        seller.portal = true;
                                        seller.salesrep = false;
                                        seller.admin = false;
                                        seller.stockist = false;
                                        seller.fulfiller = false;
                                        seller.manager = false;
                                        seller.dealer = true;
                                        seller.leave = [];
                                        seller.userType = '';
                                        seller.emailOtp = false;
                                        seller.emailOrder = false;
                                        seller.managerid = null;

                                        console.log('Add seller')

                                        $http.get("/dash/getsellerDetails/" + seller.sellerphone)
                                            .success(function (response) {
                                                console.log('response',response)
                                                $scope.sellers1 = response;
                                                // $scope.sellers1 = response;
                                                if (!response) {
                                                    seller.sellerid = seller.sellerphone;
                                                    seller.dealerNotificationFlag = $scope.dealerNotificationFlag;
                                                    seller.newDealerToUserDetails = 'true';
                                                    $http.post("/dash/sellers", seller)
                                                        .success(function (response) {
                                                            console.log("Create -->" + response);
                                                            $scope.refreshSellerNames();

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
                                                else {
                                                    if ($scope.sellers1.userStatus == 'Active') {
                                                        Settings.alertPopup('Error',"User phone number: " + $scope.sellers1.sellerphone + " already exists for " + $scope.sellers1.sellername);
                                                    }
                                                }
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
                                    document.getElementById('submitbutton').disabled = false;
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
                            document.getElementById('submitbutton').disabled = false;
                            Settings.failurePopup('Error','This Phone number already exists.');
                        }

                    }
                }
                else if ($scope.dealer.Phone == undefined) {
                    $scope.disableFlag = false;
                    document.getElementById('submitbutton').disabled = false;
                    Settings.failurePopup('Error','Please enter a valid phone number');
                } else{
                    $scope.disableFlag = false;
                    document.getElementById('submitbutton').disabled = false;
                    Settings.failurePopup('Error','Please enter all mandatory details');
                }

            }else{
                if($scope.dealer.DealerName && $scope.dealer.Phone){
                    if ($scope.applicationType == 'StoreJini'){
                        $scope.dealer.SellerName = $scope.user.username;
                        $scope.dealer.Seller = $scope.dealer.Seller ? Number($scope.dealer.Seller) : $scope.user.sellerphone;

                        $scope.dealer.Stockist = $scope.dealer.Stockist.Stockist ? Number($scope.dealer.Stockist.Stockist) : "";

                      //  $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : "";
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

                                   if($scope.dealer.Stockist)
                                    $scope.dealer.Stockist = $scope.dealer.Stockist.Stockist ? Number($scope.dealer.Stockist.Stockist) : null;
                                 //   $scope.dealer.Stockist = $scope.dealer.Stockist ? Number($scope.dealer.Stockist) : null;

                                    $scope.dealer.cloudinaryURL = ($scope.newStoreImageArray.customerImage.length > 0) ? $scope.newStoreImageArray.customerImage : [];
                                    $scope.dealer.doccloudinaryURL = ($scope.newStoreImageArray.customerDoc.length > 0) ? $scope.newStoreImageArray.customerDoc : [];
                                    $scope.dealer.customerType = "Lead";
                                    $scope.dealer.createdDate = new Date();
                                    var date = $scope.dealer.createdDate;
                                    $scope.dealer.createdDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                    $scope.dealer.comments=[];
                                    if($scope.dealer.newcomments) {


                                        var comments = {comment: '', username: '', userphone: '', date: ''};
                                        comments.comment = $scope.dealer.newcomments;
                                        if ($scope.user.sellerObject) {
                                            comments.userphone = $scope.user.sellerObject.sellerphone;
                                            comments.username = $scope.user.sellerObject.sellername;

                                        }
                                        else {
                                            comments.userphone = 0;
                                            comments.username = 'Portal';
                                        }

                                        comments.date = new Date();
                                        var date = comments.date;
                                        comments.date = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                            + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                        $scope.dealer.comments.push(comments) ;
                                    }

                                    if($scope.dealer.Stockist) {
                                        var stockist = {Dealercode:'',Stockist:'',StockistName:''}
                                        var colStockist = allStockist;
                                        for(var i =0 ;i<allStockist.length ; i++) {
                                            if($scope.dealer.Stockist == colStockist[i].Stockist){
                                                $scope.stockistNumber = colStockist[i].Stockist;
                                                $scope.stockistName  = colStockist[i].StockistName;

                                                stockist.Dealercode =$scope.dealer.Dealercode;
                                                stockist.Stockist = $scope.stockistNumber;
                                                stockist.StockistName = $scope.stockistName;
                                            }
                                        }
                                        if(stockist.Dealercode!='' && stockist.Stockist !='' && stockist.StockistName) {
                                            $http.post("/dash/stockist/add", stockist).success(function (res) {
                                                if (res) {
                                                    console.log("res", res);
                                                }
                                            })
                                        }
                                    }

                                    if($scope.dealer.leadstatus){
                                        var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource: '', revenueAmount: 0};
                                        leadStatusWithFollowup.leadstatus = $scope.dealer.leadstatus;
                                        leadStatusWithFollowup.leadsource = $scope.dealer.leadsource;
                                        leadStatusWithFollowup.revenueAmount = $scope.dealer.revenueAmount;
                                        if($scope.dealer.leadDate){
                                            leadStatusWithFollowup.leadDate = $scope.dealer.leadDate;
                                            var date = leadStatusWithFollowup.leadDate;
                                            leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                        }else{
                                            leadStatusWithFollowup.leadDate = new Date();
                                            var date = leadStatusWithFollowup.leadDate;
                                            leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                        }

                                        leadStatusWithFollowup.dealerId = $scope.dealer.Dealercode;
                                        if($scope.user.sellerObject){
                                            leadStatusWithFollowup.userphone=$scope.user.sellerObject.sellerphone;
                                            leadStatusWithFollowup.username=$scope.user.sellerObject.sellername;

                                        }
                                        else{
                                            leadStatusWithFollowup.userphone = 0;
                                            leadStatusWithFollowup.username='Portal';
                                        }

                                        leadStatusWithFollowup.dateAdded = new Date();
                                        var date = 	leadStatusWithFollowup.dateAdded;
                                        leadStatusWithFollowup.dateAdded = [date.getFullYear(),(date.getMonth()+1).padLeft(), date.getDate().padLeft() ].join('-') + ' '
                                            + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join (':');

                                        /*===comments part=====*/
                                         leadStatusWithFollowup.comments = [];
                                        if($scope.dealer.newcomments) {


                                            var comments = {comment: '', username: '', userphone: '', date: ''};
                                            comments.comment = $scope.dealer.newcomments;
                                            if ($scope.user.sellerObject) {
                                                comments.userphone = $scope.user.sellerObject.sellerphone;
                                                comments.username = $scope.user.sellerObject.sellername;

                                            }
                                            else {
                                                comments.userphone = 0;
                                                comments.username = 'Portal';
                                            }

                                            comments.date = new Date();
                                            var date = comments.date;
                                            comments.date = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                            leadStatusWithFollowup.comments.push(comments);
                                        }
                                        $http.post("/dash/store/lead/followup/add/" + dealerId, leadStatusWithFollowup).success(function (res) {
                                            if (res) {
                                                // $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
                                                // $scope.editedDealer.leadstatus = '';
                                                // $scope.dealer.leadstatus = '';
                                                // $scope.editedDealer.leadDate = '';
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
                                        if($scope.dealer.leadsource || $scope.dealer.revenueAmount){
                                            var dealerId = $scope.dealer.Dealercode;
                                            var leadStatusWithFollowup = {leadsource: '', revenueAmount: 0};
                                            // leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                            // leadStatusWithFollowup.leadDate = '';
                                            leadStatusWithFollowup.leadsource = $scope.dealer.leadsource;
                                            leadStatusWithFollowup.revenueAmount = $scope.dealer.revenueAmount;
                                            leadStatusWithFollowup.dateAdded = new Date();
                                            var date = leadStatusWithFollowup.dateAdded;
                                            leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                            leadStatusWithFollowup.dealerId = $scope.dealer.Dealercode;
                                            if ($scope.user.sellerObject) {
                                                leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                            } else {
                                                leadStatusWithFollowup.userphone = 0;
                                                leadStatusWithFollowup.username = 'Portal';
                                            }

                                            //comments part
                                            leadStatusWithFollowup.comments = [];
                                            var comments = {comment: '', username: '', userphone: '', date: ''};
                                            comments.comment = $scope.dealer.newcomments;
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

                                            leadStatusWithFollowup.comments.push(comments);

                                            $http.post("/dash/store/lead/followup/add/" + dealerId, leadStatusWithFollowup).success(function (res) {
                                                if (res) {
                                                    $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
                                                    // $scope.editedDealer.leadstatus = '';
                                                    // $scope.dealer.leadstatus = '';
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
                                        }
                                    }


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
                                    document.getElementById('submitbutton').disabled = false;
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
                            document.getElementById('submitbutton').disabled = false;
                            Settings.failurePopup('Error','This Phone number already exists.');
                        }
                    }
                }
                else if ($scope.dealer.Phone == undefined) {
                    $scope.disableFlag = false;
                    document.getElementById('submitbutton').disabled = false;
                    Settings.failurePopup('Error','Please enter a valid phone number');
                } else{
                    $scope.disableFlag = false;
                    document.getElementById('submitbutton').disabled = false;
                    Settings.failurePopup('Error','Please enter all mandatory details');
                }
            }
        };



        $scope.postNewDealer = function(flag){

            jQuery.noConflict();

            $http.post("/dash/stores/add/new", $scope.dealer)
                .success(function (res) {
                    // console.log($scope.dealer)
                    // // console.log("savee button")
                //    console.log("stockist",$scope.dealer.Stockist.Stockist)


                    if($scope.dealerAsUserFlag){
                        var seller = {};
                        seller.sellername = $scope.dealer.DealerName;
                       seller.countryCode = $scope.dealer.countryCode;
                        seller.sellerphone = Number($scope.dealer.Phone);
                        seller.sellerid = Number($scope.dealer.Phone);
                        seller.role = 'Dealer';
                        seller.email = $scope.dealer.email;
                        seller.userStatus = 'Active';
                        seller.portal = true;
                        seller.salesrep = false;
                        seller.admin = false;
                        seller.stockist = false;
                        seller.fulfiller = false;
                        seller.manager = false;
                        seller.dealer = true;
                        seller.leave = [];
                        seller.userType = '';
                        seller.emailOtp = false;
                        seller.emailOrder = false;
                        seller.managerid = null;

                        $http.get("/dash/getsellerDetails/" + seller.sellerphone)
                            .success(function (response) {
                                $scope.sellers1 = response;
                                // $scope.sellers1 = response;
                                if (!response) {
                                    seller.sellerid = seller.sellerphone;
                                    seller.dealerNotificationFlag = $scope.dealerNotificationFlag;
                                    seller.newDealerToUserDetails = 'true';
                                    $http.post("/dash/sellers", seller)
                                        .success(function (response) {
                                            console.log("Create -->" + response);
                                            $scope.refreshSellerNames();


                                            if (!res.imageStatus) {
                                                Settings.failurePopup('Error','Your image data could not be uploaded');
                                            }

                                            if(!flag){
                                                Settings.successPopup('Success',$scope.dealer.DealerName+' successfully added.')
                                            }

                                            if(res.ops[0].yBankRegisterError){
                                                Settings.failurePopup('Could not resigster to Ybank', res.ops[0].yBankRegisterError);
                                            }

                                            $scope.dealerAddPage = false;


                                            $scope.dealer = {};
                                            $scope.dealer.email = '';
                                            $scope.showStockist = false;
                                            $scope.showSalesperson = false;
                                            $scope.newStoreImageArray = {};
                                            $scope.newStoreImageArray.customerImage = [];
                                            $scope.newStoreImageArray.customerDoc = [];
                                            $scope.backToBrowserHistory();

                                            setTimeout(function () {
                                                $('.refresh').css("display", "none");
                                            }, 1000);

                                            $scope.refreshTransactions(4);


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
                                else {
                                    if ($scope.sellers1.userStatus == 'Active') {
                                        Settings.alertPopup('Error',"User phone number: " + $scope.sellers1.sellerphone + " already exists for " + $scope.sellers1.sellername);

                                        if (!res.imageStatus) {
                                            Settings.failurePopup('Error','Your image data could not be uploaded');
                                        }

                                        if(!flag){
                                            Settings.successPopup('Success',$scope.dealer.DealerName+' successfully added.')
                                        }

                                        if(res.ops[0].yBankRegisterError){
                                            Settings.failurePopup('Could not resigster to Ybank', res.ops[0].yBankRegisterError);
                                        }

                                        $scope.dealerAddPage = false;


                                        $scope.dealer = {};
                                        $scope.dealer.email = '';
                                        $scope.showStockist = false;
                                        $scope.showSalesperson = false;
                                        $scope.newStoreImageArray = {};
                                        $scope.newStoreImageArray.customerImage = [];
                                        $scope.newStoreImageArray.customerDoc = [];
                                        $scope.backToBrowserHistory();

                                        setTimeout(function () {
                                            $('.refresh').css("display", "none");
                                        }, 1000);

                                        $scope.refreshTransactions(4);

                                    }
                                }
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
                    }else{

                        if (!res.imageStatus) {
                            Settings.failurePopup('Error','Your image data could not be uploaded');
                        }

                        if(!flag){
                            Settings.successPopup('Success',$scope.dealer.DealerName+' successfully added.')
                        }

                        if(res.ops[0].yBankRegisterError){
                            Settings.failurePopup('Could not resigster to Ybank', res.ops[0].yBankRegisterError);
                        }

                        $scope.dealerAddPage = false;


                        $scope.dealer = {};
                        $scope.dealer.email = '';
                        $scope.showStockist = false;
                        $scope.showSalesperson = false;
                        $scope.newStoreImageArray = {};
                        $scope.newStoreImageArray.customerImage = [];
                        $scope.newStoreImageArray.customerDoc = [];
                        $scope.backToBrowserHistory();

                        setTimeout(function () {
                            $('.refresh').css("display", "none");
                        }, 1000);

                        $scope.refreshTransactions(4);

                    }





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
                    $scope.dealer.Pincode="";
                    $scope.dealer.State="";
                    $scope.dealer.Country="";
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
                     leadStatusWithFollowup.comments = [];
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

                     leadStatusWithFollowup.comments.push(comments);

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

        $scope.validateDealerphone = false;
        $scope.addDealerButton = false;
        $scope.enquiry = [];
        $scope.EnquiryBranch = {};
        $scope.newDevices = [];
        $scope.disableFlag = false;
        // jQuery.noConflict();
        // $(".itemsDropdown").css('display', 'none')

        $http.get("/dash/get/recentID/dealer")
            .success(function(res){
                if(res.Dealercode){
                    $scope.Dealercodetemp = 1001;
                    $scope.Dealercodetemp = res.Dealercode + 1;
                    $scope.dealer.Dealercode = res.Dealercode + 1;
                    $scope.dealer.countryCode = $scope.default_CountryCode;
                }else{
                    $scope.dealer.Dealercode = 1001;
                    $scope.dealer.countryCode = $scope.default_CountryCode;
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

        const loadGoogleMap = () => {
            if(google.maps){
                let latlng = new google.maps.LatLng(20.5937, 78.9629);
                let zoomLevel = 4;

                let myOptions = {
                    zoom: zoomLevel,
                    center: latlng,
                    scaleControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("customerAddMap"), myOptions);
            }
        };

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
                        setTimeout(() => {
                            loadGoogleMap();
                        }, 2000);
                    }
                }
            }else{
                loadGoogleMap();
                console.log("Voila! Google is already loaded on your browser ---> ");
            }
        };

        loadScript(Settings.getInstanceDetails('gMapAPI'), 'text/javascript', 'utf-8');

        setTimeout(function(){
            $('.refresh').css("display", "none");
        }, 2000);

        $scope.backToBrowserHistory = function() {
            $window.history.back();
        };

        $scope.previousTab = function () {
            if ($scope.leadflag)
                $location.path('/customers/').search({ type: $scope.leadflag });
            else
                $location.path('/customers');
        };


    });


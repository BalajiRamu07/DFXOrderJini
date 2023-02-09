/**
 * Created by Sandeep on 05/05/20.
 */

angular.module('ebs.controller')

    .controller("CustomerAddressDetailCtrl", function ($scope, $filter, $http, $modal, $window, toastr, Settings, $interval, $sce, $mdDialog, $location, $routeParams) {
        console.log("Hello From Customer Address Detail Controller .... !!!!");

        //Render Stores
        // Dealer page declaration

        // $scope.dealerListPage = true ;
        // $scope.dealerAddPage = false ;
        // $scope.dealerEditPage = false ;

        var dealer = {};
        // dealer.Dealercode = $routeParams.id;

        // $scope.leadflag
        $scope.leadflag = $location.search().type;
        $scope.showleadtab = false;


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
        $scope.dealerClasses = [];
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
        var dealerSearchBy = ['Dealercode', 'DealerName', 'City', 'seller', 'SellerName', 'StockistName', 'Area', 'Phone', 'email'];
        $scope.displayDealerRefresh = true;
        $scope.serviceClients = [];
        $scope.leadserviceClients = [];
        dealerSearchObj.viewLength = 0;
        dealerSearchObj.viewBy = initialViewBy;
        dealerSearchObj.searchFor = '';
        dealerSearchObj.seller = '';
        dealerSearchObj.stockist = '';
        dealerSearchObj.searchBy = [];
        dealerSearchObj.searchByArea = [];
        dealerSearchObj.searchRegion = [];
        dealerSearchObj.searchBycustomertype = '';
        $scope.customerType = 'customer';
        $scope.leadstatus = [];
        $scope.leadsource = [];
        var existingPhoneNumber = 0;


        $scope.dealerSelectAll.city = true;

        $scope.showStoreFilter = false;
        $scope.filter.sales = "All";
        $scope.filter.branch = "All";
        $scope.filter.class = "All";
        var instanceDetails = Settings.getInstance();
        $scope.currencySet = Settings.getInstanceDetails('currency');

        $scope.coID = instanceDetails.coID;
        $scope.leadstatus = instanceDetails.leadStatus;
        $scope.leadsource = instanceDetails.leadSource;

        $scope.dealerClasses = instanceDetails.dealerClass;
        $scope.masterPriceList = instanceDetails.masterPriceList;
        $scope.country = {};
        $scope.country.name = instanceDetails.country || 'India';
        $scope.default_CountryCode = '+91';
        $scope.tempCountryName = $scope.country.name.toLowerCase();
        $scope.dealerAsUserFlag = instanceDetails.dealerAsUserFlag || false;

        $scope.dealerfilterFlag = false;

        $scope.disableFlag = false;
        $scope.showContact = true;
        $scope.showName = true;
        $scope.showNumber = true;
        $scope.showEmail = true;
        $scope.showAddressInfo = true;
        $scope.showAddress = true;
        $scope.showArea = true;
        $scope.showCity = true;
        $scope.showPincode = true;
        // $scope.showOppAmount = true;
        // $scope.showLeadSource = true;

        $scope.showCountryCode=true;
        $scope.showPhoneNumber=true;

        $scope.showUName=true;
        $scope.showLine=true;









        $http.get('/dash/enforce/credit/fetch')
            .success(function (response) {
                if (response.length) {
                    $scope.enforceCredit = response[0].enforceCredit;
                }
            })

        // $scope.cityFilterFlag = false;
        // $scope.areaFilterFlag = false;
        $scope.nav = Settings.getNav();

        //Checkin Map Icons
        $scope.checkinIcons = [];
        $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';

        // $scope.renderInstanceDetails = function (response) {
        //     console.log("Instance Details for Dealers -->");
        //     // console.log(response);
        //     if(response.dealerClass){
        //         $scope.dealerClasses = response.dealerClass ;
        //     }
        //     if(response.masterPriceList){
        //         $scope.masterPriceList = response.masterPriceList;
        //     }
        // };

        $scope.userRole = [
            {
                name: "Admin",
                role: "Admin",
                status: true
            },
            {
                name: "Salesperson",
                role: "Salesperson",
                status: true
            },
            {
                name: "Stockist",
                role: "Stockist",
                status: true
            },
            {
                name: "Dealer",
                role: "Dealer",
                status: true
            },
            {
                name: "Portal Access",
                role: "Portal",
                status: true
            },
            {
                name: "Fulfiller",
                role: "Fulfiller",
                status: true
            },
            {
                name: "Manager",
                role: "Manager",
                status: true
            },
            {
                name: "Branch Role",
                role: "BranchManager",
                status: true
            }
        ];

        $scope.countryCodeGet = function () {
            console.log('get country codes and set default country code');
            $http.get("/country/countryCode").success(function (res) {
                if (res) {
                    $scope.countryCode = res;
                }
            })
        };


        $scope.countryCodeGet();

        // $http.get("/dash/instanceDetails")
        //     .success($scope.renderInstanceDetails).error(function(error, status){
        //     console.log(error, status);
        //     if(status >= 400 && status < 404)
        //         $window.location.href = '/404';
        //     else if(status >= 500)
        //         $window.location.href = '/500';
        //     else
        //         $window.location.href = '/404';
        // });


        jQuery.noConflict();
        $('.refresh').css("display", "inline");

        function geocode_address(result, type) {
            if (type == 'customer') {
                $scope.checkinMapLocation.dealer = result;
                $scope.$apply();
            }

        }

        function reverseGeocode(callback, latlng, type) {
            var geocoder = new google.maps.Geocoder();

            if (type == 'customer') {
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
        $scope.formatFullDate = function (date) {
            if (date == undefined)
                return
            /* replace is used to ensure cross browser support*/
            var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

            var time = ''
            var hour = d.getHours();
            var minute = d.getMinutes();
            var session = ''
            if (minute == 0)
                minute = '00'
            else if (minute < 10) {
                var temp = minute;
                minute = '0' + minute
            }

            if (d.getHours() > 12) {
                session = 'PM'
                hour -= 12
            }
            else if (d.getHours() == 12)
                session = 'PM'
            else {
                session = 'AM'
            }
            time = hour + ':' + minute + ' ' + session
            var dateOut = d.getDate() + " - " + monthNames[d.getMonth()] + " - " + (d.getFullYear()) + ' at ' + time

            $scope.mapTransactionDate = d.getDate() + " - " + monthNames[d.getMonth()] + " - " + (d.getFullYear());

            return dateOut;
        }

        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                //console.log("Salesperson : ", salesperson);
                if (salesperson && salesperson.length) {
                    $scope.roleSalesrep = [];
                    for (var i = 0; i < salesperson.length; i++) {
                        $scope.roleSalesrep.push({ sellername: salesperson[i].sellername, sellerphone: salesperson[i].sellerphone });
                    }
                    if (typeof $scope.roleSalesrep == 'object') {
                        for (var j = 0; j < $scope.roleSalesrep.length; j++) {
                            if ($scope.roleSalesrep[j].userStatus == 'Active' || $scope.roleSalesrep[j].role != '')
                                $scope.sellerNames[$scope.roleSalesrep[j].sellerphone] = $scope.roleSalesrep[j].sellername;
                        }
                    }
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

        $http.get("/dash/stores/all/stockist").success(function (response) {
            //  console.log("stockist=====",response);
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

        $scope.getRoleName = function (role) {
            // console.log(role)
            var temp = '';
            if (role) {
                if ($scope.userRole) {
                    for (var i = 0; i < $scope.userRole.length; i++) {
                        if ($scope.userRole[i].role.toUpperCase() == role.toUpperCase()) {
                            temp = $scope.userRole[i].name;
                            break;
                        }
                    }
                }
            }
            return temp;
        };

        $scope.refreshSellerNames = function () {
            if (typeof $scope.roleSalesrep == 'object') {
                for (var j = 0; j < $scope.roleSalesrep.length; j++) {
                    if ($scope.roleSalesrep[j].userStatus == 'Active' || $scope.roleSalesrep[j].role != '')
                        $scope.sellerNames[$scope.roleSalesrep[j].sellerphone] = $scope.roleSalesrep[j].sellername;
                }
            }

            // console.log($scope.sellerNames);
        }

        $scope.getSellerName = function (sellerNo, tag) {
            // console.log('SellerNumber',sellerNo,'Tag',tag)
            /*---DynamicProgramming---*/
            /*---objects doesnt have length ---*/
            if (sellerNo) {
                if (Object.keys($scope.sellerNames).length == 0) {
                    //console.log('Seller name array is empty and being initialized')
                    $scope.refreshSellerNames();
                    if (tag == 'goals' || $scope.applicationType == 'Atmosphere') $scope.refreshGoalSellerNames()
                }
                if ($scope.sellerNames[sellerNo]) {
                    return $scope.sellerNames[sellerNo]
                } else if ($scope.fulfillerNames[sellerNo] != undefined) {
                    return $scope.fulfillerNames[sellerNo];
                }
            } else return sellerNo;
        };

        $scope.getAllStoreCities = function (param, type) {

            $http.post("/dash/stores/filter/" + type, { viewBy: 0 })
                .success(function (city) {
                    $scope.dealer_city = city;
                    $scope.dealer_city.map(function (dealer) {

                        if ($scope.dealerSelectAll.city) {
                            dealer.selected_city = param;
                        } else {
                            dealer.dealer_city = true;
                        }
                        return dealer;
                    })

                }).error(function (error, status) {
                console.log(error, status);
                if (status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if (status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
        };

        $scope.getAllStoreAreas = function (param, type) {
            $http.post("/dash/stores/filter/" + type, { viewBy: 0 })
                .success(function (area) {
                    $scope.dealer_area = area;
                    $scope.dealer_area.map(function (dealer) {

                        if ($scope.dealerSelectAll.city) {
                            dealer.selected_area = true;

                        } else {
                            dealer.dealer_area = true
                            $scope.dealer_area = [];
                        }
                        return dealer;
                    })

                }).error(function (error, status) {
                console.log(error, status);
                if (status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if (status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
        };

        $scope.refreshTransactions = function (tab) {
            $scope.displayDealerRefresh = false;

            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            $scope.clearFilter(4);

            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 2000);
        };

        $scope.transactionCount = function (response, tab) {
            //console.log(response);
            if (response) {
                if (response > viewBy.dealer) {
                    $scope.dealer_count = response;
                    $scope.viewLength = 0;
                    $scope.newViewBy = viewBy.dealer;
                }
                else if (response <= viewBy.dealer) {
                    $scope.dealer_count = response;
                    $scope.newViewBy = response;
                }
                else {
                    $scope.serviceClients = [];
                    $scope.newViewBy = 1;
                    $scope.dealer_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else {
                $scope.serviceClients = [];
                $scope.newViewBy = 1;
                $scope.dealer_count = 0;
                $scope.viewLength = -1;
            }
        }

        $scope.clearFilter = function (tab) {
            dealerSearchObj.viewLength = 0;
            dealerSearchObj.viewBy = initialViewBy;
            dealerSearchObj.searchFor = '';
            dealerSearchObj.seller = '';
            dealerSearchObj.stockist = '';
            dealerSearchObj.class = '';
            dealerSearchObj.searchBy = [];
            dealerSearchObj.searchByArea = [];
            dealerSearchObj.searchRegion = [];
            if ($scope.customerType == 'lead') {
                dealerSearchObj.searchBycustomertype = 'Lead';

            }
            else {
                dealerSearchObj.searchBycustomertype = '';

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
                .success(function (response) {
                    // $scope.multipleUsers(response);
                    // $scope.renderStoreMap(response);
                    $scope.displayDealerRefresh = true

                }).error(function (error, status) {
                console.log(error, status);
                if (status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if (status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

            $http.post("/dash/stores/count", dealerSearchObj)
                .success(function (res) {
                    $scope.transactionCount(res, 4);
                    $scope.displayDealerRefresh = true

                }).error(function (error, status) {
                console.log(error, status);
                if (status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if (status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });


            $scope.getAllStoreCities(true, 'city');
            $scope.getAllStoreAreas(true, 'area');
        };



        $scope.changeDealerButton = function (flag) {
            if (flag == 0) {
                $scope.dealerListPage = true;
                $scope.dealerAddPage = false;
                $scope.dealerEditPage = false;
                $scope.dealer = {};
                $scope.dealer.City = '';
                $scope.dealer.Pincode = '';
                $scope.dealer.Area = '';
                $scope.enquiry = [];
                $scope.EnquiryBranch = {};
                $scope.newDevices = [];
                $scope.newStoreImageArray.customerImage = [];
                $scope.newStoreImageArray.customerDoc = [];
                // jQuery.noConflict();
                // $(".itemsDropdown").css('display', 'none')
            }
            else if (flag == 1) {
                $scope.dealerListPage = false;
                $scope.dealerAddPage = true;
                $scope.addDealerButton = true;
                $scope.validateDealerphone = false;
                $scope.addDealerButton = false;
                $scope.enquiry = [];
                $scope.EnquiryBranch = {};
                $scope.newDevices = [];
                $scope.disableFlag = false;
                $scope.dealer = {};
                $scope.dealer.countryCode = $scope.default_CountryCode;
                // jQuery.noConflict();
                // $(".itemsDropdown").css('display', 'none')

                $http.get("/dash/get/recentID/dealer")
                    .success(function (res) {
                        if (res.Dealercode) {
                            $scope.Dealercodetemp = 1001;
                            $scope.Dealercodetemp = res.Dealercode + 1;
                            $scope.dealer.Dealercode = res.Dealercode + 1;
                        } else {
                            $scope.dealer.Dealercode = 1001;
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

                var latlng = new google.maps.LatLng(20.5937, 78.9629);
                var zoomLevel = 4;

                var myOptions = {
                    zoom: zoomLevel,
                    center: latlng,
                    scaleControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("customerAddMap"), myOptions);
                // $scope.dealer.customerVariant = "regular"


                // $scope.loaded(2);
            }
            else if (flag == 2) {
                $scope.dealerListPage = false;
                $scope.dealerEditPage = true;
                dealerEditimage = [];
                removeImageindex = [];
                num = 0;
            }
        };

        $scope.showListDealerDetails = function (dealer, type) {
            if (dealer) {
                $scope.outstandingAmt = 0;
                $scope.invoiceDealerPaidAmt = [];
                var salesperson = [];
                var stockist = [];
                $scope.showseller = false;
                $scope.showstockist = false;
                $scope.showEditDealerListview = false;
                if ($scope.applicationType != 'StoreJini') {
                    $scope.dealerOrderView = true;
                    $scope.currentNavItem = 'Orders';
                    $scope.showMoreDealerDetails = false;

                    $scope.dealerPaymentView = false;
                    $scope.dealerVisitView = false;
                    $scope.dealerMeetingView = false;
                    $scope.dealerEnquiryView = false;
                    $scope.dealerInvoiceView = false;
                }

                if ($scope.applicationType == 'StoreJini') {
                    $scope.dealerEnquiryView = true;
                    $scope.currentNavItem = 'Enquires';
                    $scope.showMoreDealerDetails = true;
                    $scope.dealerOrderView = false;
                    $scope.dealerInvoiceView = false;
                }

                if (dealer.Seller) {
                    if (dealer.Seller.length > 1) {
                        for (var i = 0; i < dealer.Seller.length; i++) {
                            salesperson.push(Number(dealer.Seller[i]))
                        }

                    }
                    else {
                        salesperson.push(Number(dealer.Seller))
                    }
                }
                if (dealer.Seller2)
                    salesperson.push(Number(dealer.Seller2));

                if (dealer.Seller3) {
                    if (typeof (dealer.Seller3) == 'string' || typeof (dealer.Seller3) == "number") {
                        salesperson.push(Number(dealer.Seller3));
                    } else {
                        for (var i = 0; i < dealer.Seller3.length; i++) {
                            salesperson.push(Number(dealer.Seller3[i]));
                        }
                    }
                }
                if(dealer.STOCKISTS){
                    if(dealer.STOCKISTS.length){
                        for (var i = 0; i < dealer.STOCKISTS.length; i++) {
                            stockist.push(Number(dealer.STOCKISTS[i].Stockist))

                        }
                    }
                }

                // if (dealer.Stockist) {
                //     if (dealer.Stockist.length > 1) {
                //         for (var i = 0; i < dealer.Stockist.length; i++) {
                //             stockist.push(Number(dealer.Stockist[i]))
                //         }
                //
                //     }
                //     else {
                //         stockist.push(Number(dealer.Stockist))
                //     }
                // }

                var sortDupStockist = stockist;
                var stockist = [];
                $.each(sortDupStockist, function(i, el){
                    if($.inArray(el, stockist) === -1) stockist.push(el);
                });

                $scope.storeEntryshowMap = false;

                // $scope.storesColname('Dealercode',dealer);

                $scope.storesDisp = dealer;
                $scope.storesDisp.assignedSellers = [];
                $scope.storesDisp.assignedStockist = [];
                if (dealer.Seller || dealer.Seller2 || dealer.Seller3)
                    $scope.storesDisp.assignedSellers = salesperson;
                if (dealer.STOCKISTS)
                    $scope.storesDisp.assignedStockist = stockist;
                // if (dealer.Stockist)
                //     $scope.storesDisp.assignedStockist = stockist;

                // console.log($scope.storesDisp.assignedStockist);
                // $scope.storesDisp = dealer;

                $scope.edit = {};
                $scope.editedDealer = {};
                $scope.editedDealer.Dealercode = dealer.Dealercode;
                $scope.editedDealer.DealerName = dealer.DealerName;
                $scope.editedDealer.Address = dealer.Address;
                $scope.editedDealer.msidn = dealer.msidn;

                if (type == 'cancel') {
                    $scope.editedDealer.Phone = dealer.Phone;
                    $scope.editedDealer.countryCode = dealer.countryCode;
                } else {
                    if (dealer.countryCode) {
                        var sellerphoneNo = ("" + dealer.Phone).split("");
                        if (dealer.countryCode == '+91') {
                            if (sellerphoneNo.length > 10) {
                                // var sellerphoneNo = (""+response.sellerphone).split("");
                                var phoneNo = sellerphoneNo.splice(dealer.countryCode.length - 1);
                                $scope.editedDealer.Phone = Number(phoneNo.join(""));
                            } else {
                                $scope.editedDealer.Phone = dealer.Phone;
                                $scope.editedDealer.countryCode = dealer.countryCode;
                            }


                        } else {
                            // var sellerphoneNo = (""+response.sellerphone).split("");
                            var phoneNo = sellerphoneNo.splice(dealer.countryCode.length - 1);
                            $scope.editedDealer.Phone = Number(phoneNo.join(""));
                            $scope.editedDealer.countryCode = dealer.countryCode;
                            $scope.storesDisp.Phone = $scope.editedDealer.Phone;
                        }

                    } else {
                        $scope.editedDealer.countryCode = $scope.default_CountryCode;
                        $scope.editedDealer.Phone = Number(dealer.Phone);
                    }
                }

                // console.log('$scope.editedDealer',$scope.editedDealer);
                $scope.oldPhoneNo = Number(dealer.Phone);

                $scope.editedDealer.Stockist = dealer.Stockist;
                $scope.editedDealer.GST = dealer.GST;
                $scope.editedDealer.contactPerson = dealer.contactPerson;
                $scope.editedDealer.contactPersonNo = dealer.contactPersonNo;
                $scope.editedDealer.email = dealer.email;
                $scope.editedDealer.Area = dealer.Area;
                $scope.editedDealer.City = dealer.City;
                $scope.editedDealer.Pincode = dealer.Pincode;
                $scope.editedDealer.dob = dealer.dob;
                $scope.editedDealer.anniversary = dealer.anniversary;
                $scope.editedDealer.creditLimit = dealer.creditLimit;
                $scope.editedDealer.class = dealer.class || '';
                $scope.editedDealer.paymentMode = dealer.paymentMode || '';
                $scope.editedDealer.leadstatus = dealer.leadstatus || '';
                $scope.editedDealer.leadsource = dealer.leadsource || '';
                $scope.editedDealer.revenueAmount = dealer.revenueAmount || 0;



                $scope.editedDealer.assignedSellers = [];
                $scope.editedDealer.assignedStockist = [];
                //  $scope.editedDealer.assignedStockist = stockist;
                $scope.editedDealer.newStockist = [];
                $scope.editedDealer.newImages = [];
                $scope.editedDealer.showToogle = false;
                $scope.editedDealer.changeCustomerType = false;
                $scope.editedDealer.customerType = dealer.customerType;

                if (dealer.customerType == 'Lead') {
                    $scope.editedDealer.showToogle = true;
                    $scope.showleadtab = true;
                }
                if (dealer.comments) {
                    $scope.editedDealer.comments = dealer.comments;

                }
                else {
                    $scope.editedDealer.comments = [];
                }

                if (dealer.leadStatusWithFollowup) {
                    $scope.editedDealer.leadStatusWithFollowup = dealer.leadStatusWithFollowup;

                }
                else {
                    $scope.editedDealer.leadStatusWithFollowup = [];
                }

                if (dealer.Seller || dealer.Seller2 || dealer.Seller3)
                    $scope.editedDealer.assignedSellers = salesperson;
                if (dealer.STOCKISTS)
                    $scope.editedDealer.assignedStockist = stockist;
                if (dealer.cloudinaryURL) {
                    if (typeof ($scope.storesDisp.cloudinaryURL) == 'string') {
                        var url = $scope.storesDisp.cloudinaryURL;
                        $scope.storesDisp.cloudinaryURL = [];
                        $scope.editedDealer.cloudinaryURL = [];
                        $scope.storesDisp.cloudinaryURL = [{ 'image': url }];
                        $scope.editedDealer.cloudinaryURL = [{ 'image': url }];
                    } else {
                        $scope.editedDealer.cloudinaryURL = dealer.cloudinaryURL;
                    }

                } else {
                    $scope.editedDealer.cloudinaryURL = [];
                    $scope.storesDisp.cloudinaryURL = [];
                }




                // if(dealer.customerVariant)
                //     $scope.editedDealer.customerVariant = dealer.customerVariant ;
                // else
                //     $scope.editedDealer.customerVariant = 'regular' ;


                // $scope.editDealer.Seller = false;
                // $scope.editDealer.Stockist = false;

                $scope.validateDealerphone = false;


                if (!$scope.showEditDealerListview) {
                    $scope.storesDisp = dealer;
                    $scope.selected_customer = [];

                    if (dealer.cloudinaryURL) {
                        if (typeof (dealer.cloudinaryURL) == 'string') {
                            var url = dealer.cloudinaryURL;
                            $scope.storesDisp.cloudinaryURL = [];
                            $scope.storesDisp.cloudinaryURL = [{ 'image': url }];

                        }
                    }

                    if (dealer.doccloudinaryURL) {
                        if (typeof (dealer.doccloudinaryURL) == 'string') {
                            var url = dealer.doccloudinaryURL;
                            $scope.storesDisp.doccloudinaryURL = [];
                            $scope.storesDisp.doccloudinaryURL = [{ 'image': url }];
                        }
                    }

                    // for(var i = 0; i < $scope.allShippingAddress.length; i++){
                    //     if(dealer.Dealercode == $scope.allShippingAddress[i].Dealercode){
                    //         $scope.selected_customer.push($scope.allShippingAddress[i]);
                    //     }
                    // }
                }
                $http.post("/dash/invoice/fetch/dealer", dealer).success(function (res) {

                    var temp = 0;
                    $scope.totalAmt = 0;
                    for (var i = 0; i < res.length; i++) {
                        $scope.totalAmt += res[i].total;
                        if (res[i].payment) {
                            if (res[i].payment.length) {
                                var last = res[i].payment[res[i].payment.length - 1];
                                $scope.invoiceDealerPaidAmt.push(last);
                            }
                        }
                    }
                    if ($scope.invoiceDealerPaidAmt.length) {
                        for (var i = 0; i < $scope.invoiceDealerPaidAmt.length; i++) {
                            temp = parseFloat(temp) + parseFloat($scope.invoiceDealerPaidAmt[i].total_paid_amt);
                            $scope.outstandingAmt = $scope.totalAmt - temp;
                        }
                    } else {
                        $scope.outstandingAmt = $scope.totalAmt;
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

                $scope.showDealerDetail = dealer;
                $scope.showListDealerDetail = true;

            }

        }
        $scope.submitComments = function (dealer) {
            if (dealer) {

                var dealerId = dealer.Dealercode;
                var comments = { comment: '', username: '', userphone: '', date: '' };
                comments.comment = dealer.newcomments;
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
            }

            $http.put("/dash/store/comments/add/" + dealerId, comments).success(function (res) {
                if (res) {
                    $scope.editedDealer.comments.push(comments);
                    $scope.editedDealer.newcomments = '';
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

        $scope.submitLeadStatus = function (dealer) {
            if (dealer) {
                if (dealer.leadstatus && dealer.leadDate) {
                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");
                    var dealerId = dealer.Dealercode;
                    var leadStatusWithFollowup = {leadstatus: '', leadDate: ''};
                    leadStatusWithFollowup.leadstatus = dealer.leadstatus;
                    if (dealer.leadDate) {
                        leadStatusWithFollowup.leadDate = dealer.leadDate;
                    } else {
                        leadStatusWithFollowup.leadDate = new Date();
                        var date = leadStatusWithFollowup.leadDate;
                        leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                    }
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

                    $http.put("/dash/stores/update/edit", dealer)
                        .success(function (res) {

                            $http.post("/dash/store/lead/followup/add/" + dealerId, leadStatusWithFollowup).success(function (res) {
                                if (res) {
                                    $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
                                    $scope.editedDealer.leadstatus = '';
                                    $scope.dealer.leadstatus = '';
                                    $scope.editedDealer.leadDate = '';
                                    // $scope.editDealer.newcomments = '';
                                    Settings.successPopup('Success', $scope.editedDealer.DealerName + ' details updated ');
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
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
                        });
                } else {
                    if (dealer.newcomments != undefined && dealer.newcomments) {
                        jQuery.noConflict();
                        $('.refresh').css("display", "inline");
                        var dealerId = dealer.Dealercode;
                        var comments = {comment: '', username: '', userphone: '', date: ''};
                        comments.comment = dealer.newcomments;
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
                        $http.put("/dash/store/comments/add/" + dealerId, comments).success(function (res) {
                            if (res) {
                                $scope.editedDealer.comments.push(comments);
                                $scope.editedDealer.newcomments = '';
                                Settings.successPopup('Success', $scope.editedDealer.DealerName + ' added comments ');
                                jQuery.noConflict();
                                $('.refresh').css("display", "none");
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
            }
        }

        $scope.getDealerMoreDetails = function (dealer) {
            if (dealer) {
                var body = {};
                body.dealer = dealer;
                body.dealercode = dealer.Dealercode;
                // console.log(body)
                $http.post('/dash/orders/dealercode', body).success(function (res) {
                    if (res) {
                        $scope.dealerMoreDetail = [];
                        $scope.dealerMoreDetail = res;
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

                body.week_date = new Date();
                body.week_date.setDate(body.week_date.getDate() - 7)
                body.week_date.setHours(0, 0, 0, 0);
                body.month_date = new Date();
                body.month_date.setDate(body.month_date.getDate() - 30)
                body.month_date.setHours(0, 0, 0, 0);
                body.today_start = new Date();
                body.today_start.setDate(body.today_start.getDate());
                body.today_start.setHours(0, 0, 0, 0);
                body.today_end = new Date();
                body.today_end.setDate(body.today_end.getDate());
                body.today_end.setHours(23, 59, 59, 59);
                // console.log(body)

                $http.post('/dash/orders/summary/count', body).success(function (res) {
                    if (res) {
                        // console.log(res);
                        $scope.showDealerDetail.meeting_count = {}
                        $scope.showDealerDetail.orderCount = res.order;
                        $scope.showDealerDetail.paymentCount = res.payment;
                        $scope.showDealerDetail.check_insCount = res.check_ins;
                        $scope.showDealerDetail.meeting_count.meeting_month = res.meeting_month;
                        $scope.showDealerDetail.meeting_count.meeting_week = res.meeting_week;
                        $scope.showDealerDetail.meeting_count.meeting_today = res.meeting_today;
                    }
                });
            }
        }

        $scope.renderStoreEntryMap = function (order, view) {
            //console.log('pjp order', order)
            $scope.storeEntryshowMap = !$scope.storeEntryshowMap;
            var gmarkers = [];
            $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
            $scope.checkinMapLocation = {};
            $scope.checkinMapLocation.dealer = "Not Available";


            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 11;
            var latlngList = [];


            var myOptions = {
                zoom: zoomLevel,
                center: latlng,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            if (view == 'view') {
                map = new google.maps.Map(document.getElementById("mapstoreEntryView"), myOptions);
            }
            else if (view == 'edit') {
                dealerEditimage = [];
                dealereditremoveImageindex = [];
                no = 0;
                $(".preview-image").remove();
                $("#pro-image").val('');

                map = new google.maps.Map(document.getElementById("mapstoreEntryEdit"), myOptions);
            }
            function addMarker(latlng, id) {

                if (id == 0) {
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon: $scope.checkinIcons['Customer']
                    });
                    reverseGeocode(geocode_address, latlng, 'customer');
                }
                gmarkers.push(marker);
            }

            if (order.latitude && order.longitude && order.latitude != 1 && order.latitude != 2 &&
                order.latitude != 3 && order.latitude != 4) {
                latlng = new google.maps.LatLng(parseFloat(order.latitude), parseFloat(order.longitude));
                latlngList.push(new google.maps.LatLng(parseFloat(order.latitude), parseFloat(order.longitude)))
                addMarker(latlng, 0);
            } else {
                $scope.storeEntryshowMap = false;
                // bootbox.alert({
                //     title: "ERROR",
                //     message : "Location Is Not Available",
                //     className : 'text-center'
                // })
            }


            //Set zoom based on the location latlongs
            if (latlngList.length > 0) {
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < latlngList.length; i++) {
                    bounds.extend(latlngList[i]);
                }

                map.setCenter(bounds.getCenter()); //or use custom center
                map.panToBounds(bounds);
            }

            var mcOptions = { gridSize: 6, maxZoom: 20 };
            var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
            google.maps.event.trigger(map, 'resize');

            $('a[href="#profile"]').on('shown', function (e) {
                google.maps.event.trigger(map, 'resize');
            });


        }

        $scope.editDealerDetails = function (dealer, type, newDealer) {
            console.log("entered edit dealer in assets")
            var sellerPresent = false;
            if (type == 'edit') {
                console.log("entered type edit")
                if (newDealer.DealerName != undefined && newDealer.DealerName != '') {
                    if (newDealer.Phone != undefined && newDealer.Phone != '' && newDealer.Phone != null) {
                        if (!$scope.validateDealerphone) {
                            if ($scope.pinCodeMadatory) {
                                if (newDealer.Pincode && newDealer.Address && newDealer.City) {
                                    if (newDealer.countryCode && newDealer.countryCode != '+91') {
                                        newDealer.Phone = Number(newDealer.countryCode + newDealer.Phone);
                                    } else {
                                        newDealer.Phone = Number(newDealer.Phone);
                                    }

                                    newDealer.DealerName = newDealer.DealerName.substr(0, 1).toUpperCase() + newDealer.DealerName.substr(1);
                                    if (dealer.Address == newDealer.Address) {
                                        newDealer.latitude = dealer.latitude;
                                        newDealer.longitude = dealer.longitude;
                                    }
                                    if (dealer.State) {
                                        newDealer.State = dealer.State;
                                    }
                                    if (dealer.Country) {
                                        newDealer.Country = dealer.Country;
                                    }
                                    if (newDealer.ChangedToCustomer) {
                                        newDealer.ChangedToCustomer = newDealer.ChangedToCustomer;
                                    }else{
                                        if(dealer.ChangedToCustomer){
                                            newDealer.ChangedToCustomer = dealer.ChangedToCustomer;
                                        }
                                    }

                                    /*======lead status=====*/
                                    if(newDealer.changeCustomerType == true){
                                        var dealerId = dealer.Dealercode;
                                        newDealer.leadstatus = '';
                                        newDealer.leadsource = '';
                                        newDealer.revenueAmount = 0;
                                        var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                        leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                        leadStatusWithFollowup.dateAdded = new Date();
                                        var date = leadStatusWithFollowup.dateAdded;
                                        leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                            + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                        if ($scope.user.sellerObject) {
                                            leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                            leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                        } else {
                                            leadStatusWithFollowup.userphone = 0;
                                            leadStatusWithFollowup.username = 'Portal';
                                        }
                                        if(dealer.leadStatusWithFollowup.length){
                                            if(dealer.leadStatusWithFollowup[0].comments && dealer.leadStatusWithFollowup[0].comments.length){
                                                leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;
                                            }
                                        }
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
                                    }else{
                                        if(newDealer.leadstatus) {
                                            if (newDealer.leadstatus == dealer.leadstatus) {
                                                if (newDealer.leadDate) {
                                                    var dealerId = dealer.Dealercode;
                                                    var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                                    leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                    leadStatusWithFollowup.leadDate = newDealer.leadDate;
                                                    var date = leadStatusWithFollowup.leadDate;
                                                    leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                    leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                    leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                    leadStatusWithFollowup.dateAdded = new Date();
                                                    var date = leadStatusWithFollowup.dateAdded;
                                                    leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                                    leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                    if ($scope.user.sellerObject) {
                                                        leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                        leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                    } else {
                                                        leadStatusWithFollowup.userphone = 0;
                                                        leadStatusWithFollowup.username = 'Portal';
                                                    }

                                                    //comments part
                                                    leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

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
                                                } else {
                                                    var last = '';
                                                    if(newDealer.leadStatusWithFollowup.length){
                                                        last = dealer.leadStatusWithFollowup[dealer.leadStatusWithFollowup.length - 1];
                                                    }else{
                                                        last = dealer.leadstatus;
                                                    }

                                                    if (newDealer.leadstatus == last.leadstatus) {
                                                        if(newDealer.leadstatus == last.leadstatus && newDealer.revenueAmount == dealer.revenueAmount && newDealer.leadsource == dealer.leadsource) {
                                                            if (newDealer.leadStatusWithFollowup.length) {
                                                                var last = dealer.leadStatusWithFollowup[dealer.leadStatusWithFollowup.length - 1];
                                                                newDealer.leadstatus = last.leadstatus;
                                                            }
                                                        }else{
                                                            var dealerId = dealer.Dealercode;
                                                            var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                                            if (newDealer.leadStatusWithFollowup.length) {
                                                                var last = dealer.leadStatusWithFollowup[dealer.leadStatusWithFollowup.length - 1];
                                                                newDealer.leadstatus = last.leadstatus;
                                                                leadStatusWithFollowup.leadDate = last.leadDate;
                                                                leadStatusWithFollowup.dateAdded = last.dateAdded;
                                                            }
                                                            leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                            leadStatusWithFollowup.leadDate = new Date();
                                                            var date = leadStatusWithFollowup.leadDate;
                                                            leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                            leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                            leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                            leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                            if ($scope.user.sellerObject) {
                                                                leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                                leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                            } else {
                                                                leadStatusWithFollowup.userphone = 0;
                                                                leadStatusWithFollowup.username = 'Portal';
                                                            }

                                                            //comments part
                                                            leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

                                                            $http.put("/dash/store/lead/followup/update/" + dealerId, leadStatusWithFollowup).success(function (res) {
                                                                if (res) {
                                                                    // $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
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
                                                    } else {
                                                        var dealerId = dealer.Dealercode;
                                                        var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                                        leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                        leadStatusWithFollowup.leadDate = new Date();
                                                        var date = leadStatusWithFollowup.leadDate;
                                                        leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                        leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                        leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                        leadStatusWithFollowup.dateAdded = new Date();
                                                        var date = leadStatusWithFollowup.dateAdded;
                                                        leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                            + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                                        leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                        if ($scope.user.sellerObject) {
                                                            leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                            leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                        } else {
                                                            leadStatusWithFollowup.userphone = 0;
                                                            leadStatusWithFollowup.username = 'Portal';
                                                        }

                                                        //comments part
                                                        leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

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
                                            } else {
                                                var dealerId = dealer.Dealercode;
                                                var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                                leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                if (newDealer.leadDate) {
                                                    leadStatusWithFollowup.leadDate = newDealer.leadDate;
                                                    var date = leadStatusWithFollowup.leadDate;
                                                    leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                    leadStatusWithFollowup.dateAdded = new Date();
                                                    var date = leadStatusWithFollowup.dateAdded;
                                                    leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                                } else {
                                                    leadStatusWithFollowup.leadDate = new Date();
                                                    var date = leadStatusWithFollowup.leadDate;
                                                    leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                    leadStatusWithFollowup.dateAdded = new Date();
                                                    var date = leadStatusWithFollowup.dateAdded;
                                                    leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                                }
                                                leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                if ($scope.user.sellerObject) {
                                                    leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                    leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                } else {
                                                    leadStatusWithFollowup.userphone = 0;
                                                    leadStatusWithFollowup.username = 'Portal';
                                                }

                                                //comments part
                                                leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

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
                                        }else{
                                            if(newDealer.leadsource || newDealer.revenueAmount) {
                                                var dealerId = dealer.Dealercode;
                                                var leadStatusWithFollowup = {leadsource: '', revenueAmount: 0};
                                                // leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                // leadStatusWithFollowup.leadDate = '';
                                                leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                leadStatusWithFollowup.dateAdded = new Date();
                                                var date = leadStatusWithFollowup.dateAdded;
                                                leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                                leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                if ($scope.user.sellerObject) {
                                                    leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                    leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                } else {
                                                    leadStatusWithFollowup.userphone = 0;
                                                    leadStatusWithFollowup.username = 'Portal';
                                                }

                                                //comments part
                                                leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

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
                                    }

                                    /*======lead status end=====*/

                                    //comments
                                    if (newDealer.newcomments != undefined && newDealer.newcomments) {
                                        jQuery.noConflict();
                                        $('.refresh').css("display", "inline");
                                        var dealerId = dealer.Dealercode;
                                        var comments = {comment: '', username: '', userphone: '', date: ''};
                                        comments.comment = newDealer.newcomments;
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
                                        $http.put("/dash/store/comments/add/" + dealerId, comments).success(function (res) {
                                            if (res) {
                                                $scope.editedDealer.comments.push(comments);
                                                $scope.editedDealer.newcomments = '';
                                                Settings.successPopup('Success', $scope.editedDealer.DealerName + ' added comments ');
                                                jQuery.noConflict();
                                                $('.refresh').css("display", "none");
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
                                    if (newDealer.assignedSellers.length) {
                                        if (newDealer.assignedSellers.length == 1) {
                                            newDealer.Seller = newDealer.assignedSellers[0];
                                            newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                        }
                                        else if (newDealer.assignedSellers.length == 2) {
                                            newDealer.Seller = newDealer.assignedSellers[0];
                                            newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                            newDealer.Seller2 = newDealer.assignedSellers[1];
                                            newDealer.SellerName2 = $scope.getSellerName(newDealer.assignedSellers[1]);
                                        }
                                        else if (newDealer.assignedSellers.length == 3) {
                                            newDealer.Seller = newDealer.assignedSellers[0];
                                            newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                            newDealer.Seller2 = newDealer.assignedSellers[1];
                                            newDealer.SellerName2 = $scope.getSellerName(newDealer.assignedSellers[1]);
                                            newDealer.Seller3 = newDealer.assignedSellers[2];
                                            newDealer.SellerName3 = $scope.getSellerName(newDealer.assignedSellers[2]);
                                        }
                                        else if (newDealer.assignedSellers.length > 3) {
                                            newDealer.seller = newDealer.assignedSellers[0];
                                            // console.log(getSellerName(newDealer.assignedSellers[0]))
                                            newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                            newDealer.Seller2 = newDealer.assignedSellers[1];
                                            newDealer.SellerName2 = $scope.getSellerName(newDealer.assignedSellers[1]);
                                            newDealer.Seller3 = [];
                                            newDealer.SellerName3 = [];
                                            for (var i = 2; i < newDealer.assignedSellers.length; i++) {
                                                newDealer.Seller3.push(newDealer.assignedSellers[i]);
                                                newDealer.SellerName3.push($scope.getSellerName(newDealer.assignedSellers[2]));
                                            }
                                        }
                                    }

                                    if (newDealer.newStockist.length) {
                                        if (!newDealer.assignedStockist.length) {
                                            if (newDealer.newStockist.length == 1) {
                                                newDealer.Stockist = newDealer.newStockist[0];
                                                newDealer.StockistName = $scope.getSellerName(newDealer.newStockist[0]);
                                            }
                                        }
                                        else {
                                            newDealer.Stockist = [];
                                            for (var i = 0; i < newDealer.assignedStockist.length; i++) {
                                                newDealer.Stockist.push(newDealer.assignedStockist[i]);
                                                newDealer.StockistName = $scope.getSellerName(newDealer.assignedStockist[0]);
                                                newDealer.StockistName1 = $scope.getSellerName(newDealer.assignedStockist[1]);
                                            }
                                            for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                newDealer.Stockist.push(newDealer.newStockist[i]);
                                                newDealer.StockistName1 = $scope.getSellerName(newDealer.newStockist[0]);
                                            }


                                        }
                                    }
                                    if(newDealer.newStockist != '' && newDealer.assignedStockist == '') {
                                        if(newDealer.newStockist.length){
                                            var stockist = [{Dealercode:'',Stockist:'',StockistName:''}]
                                            var newDealerStockist = newDealer.newStockist;
                                            var colStockist = $scope.allStockistFromDealer;
                                            var stockist = {Dealercode: '', Stockist: '', StockistName: ''}
                                            // var filteredClasses = colStockist.filter(cls => newDealerStockist.includes(cls.Stockist));
                                            var filteredClasses = colStockist.filter(function (cls) {
                                                return newDealerStockist.includes(cls.Stockist);
                                            });
                                            stockist =  filteredClasses.map((item, i) => ({
                                                ...item,
                                                Dealercode: newDealer.Dealercode,

                                            }));
                                            $http.put("/dash/stockist/update", stockist).success(function (res) {
                                                if (res) {
                                                    console.log("res", res);
                                                }
                                            })
                                        }else if (newDealer.newStockist){
                                            var stockist = {Dealercode:'',Stockist:'',StockistName:''}
                                            var colStockist = $scope.allStockistFromDealer;
                                            for(var i =0 ;i<colStockist.length ; i++) {
                                                if(newDealer.Stockist == colStockist[i].Stockist){
                                                    $scope.stockistNumber = colStockist[i].Stockist;
                                                    $scope.stockistName  = colStockist[i].StockistName;

                                                    stockist.Dealercode =newDealer.Dealercode;
                                                    stockist.Stockist = $scope.stockistNumber;
                                                    stockist.StockistName = $scope.stockistName;
                                                }
                                            }
                                            // console.log("stockist",stockist);
                                            if(stockist.Dealercode!='' && stockist.Stockist !='' && stockist.StockistName) {
                                                $http.put("/dash/stockist/update", stockist).success(function (res) {
                                                    if (res) {
                                                        console.log("res", res);
                                                    }
                                                })
                                            }
                                        }


                                    } else if(newDealer.assignedStockist && newDealer.newStockist){
                                        var stockistDetails = [];
                                        if(newDealer.newStockist.length){
                                            var newDealerStockist = newDealer.newStockist;
                                            for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                stockistDetails.push(Number(newDealerStockist[i]))
                                            }
                                        } else {
                                            stockistDetails.push(Number(newDealerStockist))
                                        }
                                        if(newDealer.assignedStockist.length){
                                            var newDealerStockist1 = newDealer.assignedStockist;
                                            //  var colStockist = $scope.allStockistFromDealer;
                                            for (var i = 0; i < newDealer.assignedStockist.length; i++) {
                                                stockistDetails.push(Number(newDealerStockist1[i]))
                                            }
                                        } else {
                                            stockistDetails.push(Number(newDealerStockist))
                                        }
                                        // stockist1 = JSON.parse(JSON.stringify(stockist1[0]));
                                        var stockist = {Dealercode:newDealer.Dealercode,Stockist:'',StockistName:''}
                                        var colStockist = $scope.allStockistFromDealer;
                                        var filteredClasses = colStockist.filter(function (cls) {
                                            return stockistDetails.includes(cls.Stockist);
                                        });

                                        stockist =  filteredClasses.map((item, i) => ({
                                            ...item,
                                            Dealercode: newDealer.Dealercode,

                                        }));

                                        if(!stockist || stockist == '' ){
                                            stockist = [{Dealercode: newDealer.Dealercode ,Stockist:'',StockistName:''}]
                                        }
                                        // console.log(stockist);
                                        $http.put("/dash/stockist/update", stockist).success(function (res) {
                                            if (res) {
                                                console.log("res", res);
                                            }
                                        })


                                    }


                                    if (dealerEditimage.length) {
                                        var checkFlag = false;
                                        for (var i = 0; i < dealerEditimage.length; i++) {
                                            var tempObj = {};
                                            if (dealereditremoveImageindex.length) {
                                                checkFlag = dealereditremoveImageindex.includes(i);
                                                if (!checkFlag) {
                                                    tempObj.Dealercode = newDealer.Dealercode;
                                                    tempObj.image = dealerEditimage[i][0].image;
                                                    tempObj.date = new Date() + "";
                                                    tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                                                    tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);
                                                    tempObj.name = dealerEditimage[i][0].name ? dealerEditimage[i][0].name : "Dealer Image";
                                                    newDealer.newImages.push(tempObj)
                                                }
                                            }
                                            else {
                                                tempObj.Dealercode = newDealer.Dealercode;
                                                tempObj.image = dealerEditimage[i][0].image;
                                                tempObj.date = new Date() + "";
                                                tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                                                tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);
                                                tempObj.name = dealerEditimage[i][0].name ? dealerEditimage[i][0].name : "Dealer Image";
                                                newDealer.newImages.push(tempObj)
                                            }
                                        }
                                    }

                                    jQuery.noConflict();
                                    $('.refresh').css("display", "inline");


                                    $http.put("/dash/stores/update/edit", newDealer)
                                        .success(function (res) {
                                            if (res == true) {

                                                if ($scope.dealerAsUserFlag) {

                                                    $http.get("/dash/getsellerDetails/" + existingPhoneNumber)
                                                        .success(function (response) {

                                                            if (response) {
                                                                //   console.log(response)

                                                                var seller = response;
                                                                seller.sellername = newDealer.DealerName
                                                                seller.sellerphone = newDealer.Phone;
                                                                seller.sellerid = newDealer.Phone
                                                                seller.oldPhoneNumber = existingPhoneNumber;

                                                                if (newDealer.email) {
                                                                    seller.email = newDealer.email
                                                                }

                                                                if (newDealer.userId) {
                                                                    seller._id = newDealer.userId
                                                                }

                                                                $http.put("/dash/sellers/" + seller._id, seller)
                                                                    .success(function (response) {
                                                                        console.log("Update -->" + response);

                                                                        // $scope.dealerEditPage = false ;
                                                                        Settings.successPopup('Success', newDealer.DealerName + ' details updated ');
                                                                        $scope.refreshTransactions(4);

                                                                        if (newDealer.newStockist.length) {
                                                                            for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                                                newDealer.assignedStockist.push(newDealer.newStockist[i])
                                                                            }
                                                                            newDealer.newStockist = [];
                                                                        }
                                                                        // console.log(newDealer)
                                                                        if (newDealer.newImages.length) {
                                                                            for (var i = 0; i < newDealer.newImages.length; i++) {
                                                                                newDealer.cloudinaryURL.push(newDealer.newImages[i])
                                                                            }
                                                                        }
                                                                        // console.log($scope.storesDisp)
                                                                        $scope.storesDisp = newDealer;
                                                                        //     $scope.showListDealerDetails(newDealer, 'edit');
                                                                        $scope.edit.dealer = false;

                                                                    })
                                                            } else {
                                                                // $scope.dealerEditPage = false ;
                                                                Settings.successPopup('Success', newDealer.DealerName + ' details updated ');
                                                                $scope.refreshTransactions(4);

                                                                if (newDealer.newStockist.length) {
                                                                    for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                                        newDealer.assignedStockist.push(newDealer.newStockist[i])
                                                                    }
                                                                    newDealer.newStockist = [];
                                                                }
                                                                // console.log(newDealer)
                                                                if (newDealer.newImages.length) {
                                                                    for (var i = 0; i < newDealer.newImages.length; i++) {
                                                                        newDealer.cloudinaryURL.push(newDealer.newImages[i])
                                                                    }
                                                                }
                                                                // console.log($scope.storesDisp)
                                                                $scope.storesDisp = newDealer;
                                                                //     $scope.showListDealerDetails(newDealer, 'edit');
                                                                $scope.edit.dealer = false;
                                                            }



                                                        })

                                                } else {
                                                    // $scope.dealerEditPage = false ;
                                                    Settings.successPopup('Success', newDealer.DealerName + ' details updated ');
                                                    $scope.refreshTransactions(4);

                                                    if (newDealer.newStockist.length) {
                                                        for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                            newDealer.assignedStockist.push(newDealer.newStockist[i])
                                                        }
                                                        newDealer.newStockist = [];
                                                    }
                                                    // console.log(newDealer)
                                                    if (newDealer.newImages.length) {
                                                        for (var i = 0; i < newDealer.newImages.length; i++) {
                                                            newDealer.cloudinaryURL.push(newDealer.newImages[i])
                                                        }
                                                    }
                                                    // console.log($scope.storesDisp)
                                                    $scope.storesDisp = newDealer;
                                                    //   $scope.showListDealerDetails(newDealer, 'edit');
                                                    $scope.edit.dealer = false;
                                                }



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
                                } else {
                                    Settings.failurePopup('Error', 'Please enter all mandatory details');
                                }

                            } else {
                                if (newDealer.countryCode && newDealer.countryCode != '+91') {
                                    newDealer.Phone = Number(newDealer.countryCode + newDealer.Phone);
                                } else {
                                    newDealer.Phone = Number(newDealer.Phone);
                                }

                                if (newDealer.ChangedToCustomer) {
                                    newDealer.ChangedToCustomer = newDealer.ChangedToCustomer;
                                }else{
                                    if(dealer.ChangedToCustomer){
                                        newDealer.ChangedToCustomer = dealer.ChangedToCustomer;
                                    }
                                }

                                /*======lead status=====*/
                                if(newDealer.changeCustomerType == true){
                                    var dealerId = dealer.Dealercode;
                                    newDealer.leadstatus = '';
                                    newDealer.leadsource = '';
                                    newDealer.revenueAmount = 0;
                                    var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                    leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                    leadStatusWithFollowup.dateAdded = new Date();
                                    var date = leadStatusWithFollowup.dateAdded;
                                    leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                    if ($scope.user.sellerObject) {
                                        leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                        leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                    } else {
                                        leadStatusWithFollowup.userphone = 0;
                                        leadStatusWithFollowup.username = 'Portal';
                                    }
                                    if(dealer.leadStatusWithFollowup.length){
                                        if(dealer.leadStatusWithFollowup[0].comments && dealer.leadStatusWithFollowup[0].comments.length){
                                            leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;
                                        }
                                    }
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
                                }else{
                                    if(newDealer.leadstatus) {
                                        if (newDealer.leadstatus == dealer.leadstatus) {
                                            if (newDealer.leadDate) {
                                                var dealerId = dealer.Dealercode;
                                                var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                                leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                leadStatusWithFollowup.leadDate = newDealer.leadDate;
                                                var date = leadStatusWithFollowup.leadDate;
                                                leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                leadStatusWithFollowup.dateAdded = new Date();
                                                var date = leadStatusWithFollowup.dateAdded;
                                                leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                                leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                if ($scope.user.sellerObject) {
                                                    leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                    leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                } else {
                                                    leadStatusWithFollowup.userphone = 0;
                                                    leadStatusWithFollowup.username = 'Portal';
                                                }

                                                //comments part
                                                leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

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
                                            } else {
                                                var last = '';
                                                if(newDealer.leadStatusWithFollowup.length){
                                                    last = dealer.leadStatusWithFollowup[dealer.leadStatusWithFollowup.length - 1];
                                                }else{
                                                    last = dealer.leadstatus;
                                                }

                                                if (newDealer.leadstatus == last.leadstatus) {
                                                    if(newDealer.leadstatus == last.leadstatus && newDealer.revenueAmount == dealer.revenueAmount && newDealer.leadsource == dealer.leadsource) {
                                                        if (newDealer.leadStatusWithFollowup.length) {
                                                            var last = dealer.leadStatusWithFollowup[dealer.leadStatusWithFollowup.length - 1];
                                                            newDealer.leadstatus = last.leadstatus;
                                                        }
                                                    }else{
                                                        var dealerId = dealer.Dealercode;
                                                        var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                                        if (newDealer.leadStatusWithFollowup.length) {
                                                            var last = dealer.leadStatusWithFollowup[dealer.leadStatusWithFollowup.length - 1];
                                                            newDealer.leadstatus = last.leadstatus;
                                                            leadStatusWithFollowup.leadDate = last.leadDate;
                                                            leadStatusWithFollowup.dateAdded = last.dateAdded;
                                                        }
                                                        leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                        leadStatusWithFollowup.leadDate = new Date();
                                                        var date = leadStatusWithFollowup.leadDate;
                                                        leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                        leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                        leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                        leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                        if ($scope.user.sellerObject) {
                                                            leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                            leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                        } else {
                                                            leadStatusWithFollowup.userphone = 0;
                                                            leadStatusWithFollowup.username = 'Portal';
                                                        }

                                                        //comments part
                                                        leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

                                                        $http.put("/dash/store/lead/followup/update/" + dealerId, leadStatusWithFollowup).success(function (res) {
                                                            if (res) {
                                                                // $scope.editedDealer.leadStatusWithFollowup.push(leadStatusWithFollowup);
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
                                                } else {
                                                    var dealerId = dealer.Dealercode;
                                                    var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                                    leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                                    leadStatusWithFollowup.leadDate = new Date();
                                                    var date = leadStatusWithFollowup.leadDate;
                                                    leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                    leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                                    leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                                    leadStatusWithFollowup.dateAdded = new Date();
                                                    var date = leadStatusWithFollowup.dateAdded;
                                                    leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                                    leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                                    if ($scope.user.sellerObject) {
                                                        leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                        leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                                    } else {
                                                        leadStatusWithFollowup.userphone = 0;
                                                        leadStatusWithFollowup.username = 'Portal';
                                                    }

                                                    //comments part
                                                    leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

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
                                        } else {
                                            var dealerId = dealer.Dealercode;
                                            var leadStatusWithFollowup = {leadstatus: '', leadDate: '',leadsource:'',revenueAmount:0};
                                            leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                            leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                            leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                            if (newDealer.leadDate) {
                                                leadStatusWithFollowup.leadDate = newDealer.leadDate;
                                                var date = leadStatusWithFollowup.leadDate;
                                                leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                leadStatusWithFollowup.dateAdded = new Date();
                                                var date = leadStatusWithFollowup.dateAdded;
                                                leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                            } else {
                                                leadStatusWithFollowup.leadDate = new Date();
                                                var date = leadStatusWithFollowup.leadDate;
                                                leadStatusWithFollowup.leadDate = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-');
                                                leadStatusWithFollowup.dateAdded = new Date();
                                                var date = leadStatusWithFollowup.dateAdded;
                                                leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                            }
                                            leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                            if ($scope.user.sellerObject) {
                                                leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                            } else {
                                                leadStatusWithFollowup.userphone = 0;
                                                leadStatusWithFollowup.username = 'Portal';
                                            }

                                            //comments part
                                            if(dealer.leadStatusWithFollowup.length){
                                                leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;
                                            }

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
                                    }else{
                                        if(newDealer.leadsource || newDealer.revenueAmount) {
                                            var dealerId = dealer.Dealercode;
                                            var leadStatusWithFollowup = {leadsource: '', revenueAmount: 0};
                                            // leadStatusWithFollowup.leadstatus = newDealer.leadstatus;
                                            // leadStatusWithFollowup.leadDate = '';
                                            leadStatusWithFollowup.leadsource = newDealer.leadsource;
                                            leadStatusWithFollowup.revenueAmount = newDealer.revenueAmount;
                                            leadStatusWithFollowup.dateAdded = new Date();
                                            var date = leadStatusWithFollowup.dateAdded;
                                            leadStatusWithFollowup.dateAdded = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
                                            leadStatusWithFollowup.dealerId = dealer.Dealercode;
                                            if ($scope.user.sellerObject) {
                                                leadStatusWithFollowup.userphone = $scope.user.sellerObject.sellerphone;
                                                leadStatusWithFollowup.username = $scope.user.sellerObject.sellername;

                                            } else {
                                                leadStatusWithFollowup.userphone = 0;
                                                leadStatusWithFollowup.username = 'Portal';
                                            }

                                            //comments part
                                            leadStatusWithFollowup.comments = dealer.leadStatusWithFollowup[0].comments;

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
                                }
                                /*======lead status end=====*/
                                if (newDealer.newcomments != undefined && newDealer.newcomments) {
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "inline");
                                    var dealerId = dealer.Dealercode;
                                    var comments = {comment: '', username: '', userphone: '', date: ''};
                                    comments.comment = newDealer.newcomments;
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
                                    $http.put("/dash/store/comments/add/" + dealerId, comments).success(function (res) {
                                        if (res) {
                                            $scope.editedDealer.comments.push(comments);
                                            $scope.editedDealer.newcomments = '';
                                            Settings.successPopup('Success', $scope.editedDealer.DealerName + ' added comments ');
                                            jQuery.noConflict();
                                            $('.refresh').css("display", "none");
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

                                newDealer.DealerName = newDealer.DealerName.substr(0, 1).toUpperCase() + newDealer.DealerName.substr(1);
                                if (dealer.Address == newDealer.Address) {
                                    newDealer.latitude = dealer.latitude;
                                    newDealer.longitude = dealer.longitude;
                                }
                                if (dealer.State) {
                                    newDealer.State = dealer.State;
                                }
                                if (dealer.Country) {
                                    newDealer.Country = dealer.Country;
                                }
                                if (newDealer.assignedSellers.length) {
                                    if (newDealer.assignedSellers.length == 1) {
                                        newDealer.Seller = newDealer.assignedSellers[0];
                                        newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                    }
                                    else if (newDealer.assignedSellers.length == 2) {
                                        newDealer.Seller = newDealer.assignedSellers[0];
                                        newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                        newDealer.Seller2 = newDealer.assignedSellers[1];
                                        newDealer.SellerName2 = $scope.getSellerName(newDealer.assignedSellers[1]);
                                    }
                                    else if (newDealer.assignedSellers.length == 3) {
                                        newDealer.Seller = newDealer.assignedSellers[0];
                                        newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                        newDealer.Seller2 = newDealer.assignedSellers[1];
                                        newDealer.SellerName2 = $scope.getSellerName(newDealer.assignedSellers[1]);
                                        newDealer.Seller3 = newDealer.assignedSellers[2];
                                        newDealer.SellerName3 = $scope.getSellerName(newDealer.assignedSellers[2]);
                                    }
                                    else if (newDealer.assignedSellers.length > 3) {
                                        newDealer.Seller = newDealer.assignedSellers[0];
                                        newDealer.SellerName = $scope.getSellerName(newDealer.assignedSellers[0]);
                                        newDealer.Seller2 = newDealer.assignedSellers[1];
                                        newDealer.SellerName2 = $scope.getSellerName(newDealer.assignedSellers[1]);
                                        newDealer.Seller3 = [];
                                        newDealer.SellerName3 = [];
                                        for (var i = 2; i < newDealer.assignedSellers.length; i++) {
                                            newDealer.Seller3.push(newDealer.assignedSellers[i]);
                                            newDealer.SellerName3.push($scope.getSellerName(newDealer.assignedSellers[2]));
                                        }
                                    }
                                }


                                if (newDealer.newStockist.length) {
                                    if (!newDealer.assignedStockist.length) {
                                        if (newDealer.newStockist.length == 1) {
                                            newDealer.Stockist = newDealer.newStockist[0];
                                            newDealer.StockistName = $scope.getSellerName(newDealer.newStockist[0]);
                                        }
                                    }
                                    else {
                                        newDealer.Stockist = [];
                                        for (var i = 0; i < newDealer.assignedStockist.length; i++) {
                                            newDealer.Stockist.push(newDealer.assignedStockist[i]);
                                            newDealer.StockistName = $scope.getSellerName(newDealer.assignedStockist[0]);
                                            newDealer.StockistName1 = $scope.getSellerName(newDealer.assignedStockist[1]);
                                        }
                                        for (var i = 0; i < newDealer.newStockist.length; i++) {
                                            newDealer.Stockist.push(newDealer.newStockist[i]);
                                            newDealer.StockistName1 = $scope.getSellerName(newDealer.newStockist[0]);
                                        }


                                    }
                                }

                                if(newDealer.newStockist != '' && newDealer.assignedStockist == '') {

                                    if(newDealer.newStockist.length){
                                        var stockist = [{Dealercode:'',Stockist:'',StockistName:''}]
                                        var newDealerStockist = newDealer.newStockist;
                                        var colStockist = $scope.allStockistFromDealer;
                                        var stockist = {Dealercode: '', Stockist: '', StockistName: ''}
                                        // var filteredClasses = colStockist.filter(cls => newDealerStockist.includes(cls.Stockist));
                                        var filteredClasses = colStockist.filter(function (cls) {
                                            return newDealerStockist.includes(cls.Stockist);
                                        });

                                        stockist =  filteredClasses.map((item, i) => ({
                                            ...item,
                                            Dealercode: newDealer.Dealercode,

                                        }));

                                        $http.put("/dash/stockist/update", stockist).success(function (res) {
                                            if (res) {
                                                console.log("res", res);
                                            }
                                        })

                                    }else if (newDealer.newStockist){
                                        var stockist = {Dealercode:'',Stockist:'',StockistName:''}
                                        var colStockist = $scope.allStockistFromDealer;
                                        for(var i =0 ;i<colStockist.length ; i++) {
                                            if(newDealer.Stockist == colStockist[i].Stockist){
                                                $scope.stockistNumber = colStockist[i].Stockist;
                                                $scope.stockistName  = colStockist[i].StockistName;

                                                stockist.Dealercode =newDealer.Dealercode;
                                                stockist.Stockist = $scope.stockistNumber;
                                                stockist.StockistName = $scope.stockistName;
                                            }
                                        }

                                        if(stockist.Dealercode!='' && stockist.Stockist !='' && stockist.StockistName) {
                                            $http.put("/dash/stockist/update", stockist).success(function (res) {
                                                if (res) {
                                                    console.log("res", res);
                                                }
                                            })
                                        }
                                    }


                                } else if(newDealer.assignedStockist && newDealer.newStockist){
                                    var stockistDetails = [];
                                    if(newDealer.newStockist.length){
                                        var newDealerStockist = newDealer.newStockist;
                                        for (var i = 0; i < newDealer.newStockist.length; i++) {
                                            stockistDetails.push(Number(newDealerStockist[i]))
                                        }
                                    } else {
                                        stockistDetails.push(Number(newDealerStockist))
                                    }
                                    if(newDealer.assignedStockist.length){
                                        var newDealerStockist1 = newDealer.assignedStockist;
                                        //  var colStockist = $scope.allStockistFromDealer;
                                        for (var i = 0; i < newDealer.assignedStockist.length; i++) {
                                            stockistDetails.push(Number(newDealerStockist1[i]))
                                        }
                                    } else {
                                        stockistDetails.push(Number(newDealerStockist))
                                    }
                                    // stockist1 = JSON.parse(JSON.stringify(stockist1[0]));
                                    var stockist = {Dealercode:newDealer.Dealercode,Stockist:'',StockistName:''}
                                    var colStockist = $scope.allStockistFromDealer;
                                    var filteredClasses = colStockist.filter(function (cls) {
                                        return stockistDetails.includes(cls.Stockist);
                                    });

                                    stockist =  filteredClasses.map((item, i) => ({
                                        ...item,
                                        Dealercode: newDealer.Dealercode,

                                    }));

                                    if(!stockist || stockist == '' ){
                                        stockist = [{Dealercode: newDealer.Dealercode ,Stockist:'',StockistName:''}]
                                    }
                                    //  console.log(stockist);
                                    $http.put("/dash/stockist/update", stockist).success(function (res) {
                                        if (res) {
                                            console.log("res", res);
                                        }
                                    })


                                }
                                // else{
                                //     console.log("else",newDealer.assignedStockist.length);
                                //     if(newDealer.assignedStockist.length){
                                //         var stockist = [{Dealercode:newDealer.Dealercode,Stockist:'',StockistName:''}]
                                //         var newDealerStockist = newDealer.assignedStockist;
                                //         var colStockist = $scope.allStockistFromDealer;
                                //        // var stockist = {Dealercode: '', Stockist: '', StockistName: ''}
                                //        // var filteredClasses = colStockist.filter(cls => newDealerStockist.includes(cls.Stockist));
                                //         var filteredClasses = colStockist.filter(function (cls) {
                                //             return newDealerStockist.includes(cls.Stockist);
                                //         });
                                //        // console.log(filteredClasses);
                                //
                                //         stockist =  filteredClasses.map((item, i) => ({
                                //             ...item,
                                //             Dealercode: newDealer.Dealercode,
                                //
                                //     }));
                                //       //  console.log("assignedStockist",stockist);
                                //         if(!stockist || stockist == '' ){
                                //             stockist = [{Dealercode: newDealer.Dealercode ,Stockist:'',StockistName:''}]
                                //         }
                                //       //  console.log("assignedStockist",stockist);
                                //
                                //         // $http.put("/dash/stockist/update", stockist).success(function (res) {
                                //         //     if (res) {
                                //         //         console.log("res123", res);
                                //         //     }
                                //         // })
                                //     }else {
                                //         console.log("else else",newDealer.assignedStockist.length);
                                //     }
                                //
                                // }
                                //   console.log("newDealer",newDealer.Stockist);

                                if (dealerEditimage.length) {
                                    var checkFlag = false;
                                    for (var i = 0; i < dealerEditimage.length; i++) {
                                        var tempObj = {};
                                        if (dealereditremoveImageindex.length) {
                                            checkFlag = dealereditremoveImageindex.includes(i);
                                            if (!checkFlag) {
                                                tempObj.Dealercode = newDealer.Dealercode;
                                                tempObj.image = dealerEditimage[i][0].image;
                                                tempObj.date = new Date() + "";
                                                tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                                                tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);
                                                tempObj.name = dealerEditimage[i][0].name ? dealerEditimage[i][0].name : "Item Image";
                                                newDealer.newImages.push(tempObj)
                                            }
                                        }
                                        else {
                                            tempObj.Dealercode = newDealer.Dealercode;
                                            tempObj.image = dealerEditimage[i][0].image;
                                            tempObj.date = new Date() + "";
                                            tempObj.username = ($scope.user.username ? $scope.user.username : "Portal Admin");
                                            tempObj.userphone = ($scope.user.sellerphone ? $scope.user.sellerphone : null);
                                            tempObj.name = dealerEditimage[i][0].name ? dealerEditimage[i][0].name : "Dealer Image";
                                            newDealer.newImages.push(tempObj)
                                        }
                                    }
                                }

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.put("/dash/stores/update/edit", newDealer)
                                    .success(function (res) {
                                        // console.log(res)
                                        if (res == true) {

                                            if ($scope.dealerAsUserFlag) {
                                                $http.get("/dash/getsellerDetails/" + existingPhoneNumber)
                                                    .success(function (response) {

                                                        console.log('response', response)

                                                        if (response) {
                                                            var seller = response;
                                                            seller.sellername = newDealer.DealerName
                                                            seller.sellerphone = newDealer.Phone;
                                                            seller.sellerid = newDealer.Phone;
                                                            seller.oldPhoneNumber = existingPhoneNumber;

                                                            if (newDealer.email) {
                                                                seller.email = newDealer.email
                                                            }

                                                            if (newDealer.userId) {
                                                                seller._id = newDealer.userId
                                                            }

                                                            $http.put("/dash/sellers/" + seller._id, seller)
                                                                .success(function (response) {
                                                                    console.log("Update -->" + response);


                                                                    Settings.successPopup('Success', newDealer.DealerName + ' successfully updated ');
                                                                    // toastr.success($scope.nav[2].tab+' Successfully Updated ');
                                                                    // $scope.dealerEditPage = false ;
                                                                    $scope.refreshTransactions(4);
                                                                    if (newDealer.newStockist.length) {
                                                                        for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                                            newDealer.assignedStockist.push(newDealer.newStockist[i])
                                                                        }
                                                                        newDealer.newStockist = [];
                                                                    }
                                                                    if (newDealer.newImages.length) {
                                                                        for (var i = 0; i < newDealer.newImages.length; i++) {
                                                                            newDealer.cloudinaryURL.push(newDealer.newImages[i])
                                                                        }
                                                                    }
                                                                    $scope.storesDisp = newDealer;
                                                                    if (newDealer.countryCode) {
                                                                        var sellerphoneNo = ("" + newDealer.Phone).split("");
                                                                        if (newDealer.countryCode == '+91') {
                                                                            if (sellerphoneNo.length > 10) {
                                                                                // var sellerphoneNo = (""+response.sellerphone).split("");
                                                                                var phoneNo = sellerphoneNo.splice(newDealer.countryCode.length - 1);
                                                                                $scope.storesDisp.Phone = Number(phoneNo.join(""));
                                                                            }

                                                                        } else {
                                                                            // var sellerphoneNo = (""+response.sellerphone).split("");
                                                                            var phoneNo = sellerphoneNo.splice(newDealer.countryCode.length - 1);
                                                                            $scope.storesDisp.Phone = Number(phoneNo.join(""));
                                                                            $scope.storesDisp.countryCode = newDealer.countryCode;
                                                                        }

                                                                    } else {
                                                                        $scope.storesDisp.countryCode = '+91'
                                                                        $scope.storesDisp.Phone = Number(newDealer.Phone);
                                                                    }
                                                                    $scope.edit.dealer = false;

                                                                })
                                                        } else {
                                                            Settings.successPopup('Success', newDealer.DealerName + ' successfully updated ');
                                                            // toastr.success($scope.nav[2].tab+' Successfully Updated ');
                                                            // $scope.dealerEditPage = false ;
                                                            $scope.refreshTransactions(4);
                                                            if (newDealer.newStockist.length) {
                                                                for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                                    newDealer.assignedStockist.push(newDealer.newStockist[i])
                                                                }
                                                                newDealer.newStockist = [];
                                                            }
                                                            if (newDealer.newImages.length) {
                                                                for (var i = 0; i < newDealer.newImages.length; i++) {
                                                                    newDealer.cloudinaryURL.push(newDealer.newImages[i])
                                                                }
                                                            }
                                                            $scope.storesDisp = newDealer;
                                                            if (newDealer.countryCode) {
                                                                var sellerphoneNo = ("" + newDealer.Phone).split("");
                                                                if (newDealer.countryCode == '+91') {
                                                                    if (sellerphoneNo.length > 10) {
                                                                        // var sellerphoneNo = (""+response.sellerphone).split("");
                                                                        var phoneNo = sellerphoneNo.splice(newDealer.countryCode.length - 1);
                                                                        $scope.storesDisp.Phone = Number(phoneNo.join(""));
                                                                    }

                                                                } else {
                                                                    // var sellerphoneNo = (""+response.sellerphone).split("");
                                                                    var phoneNo = sellerphoneNo.splice(newDealer.countryCode.length - 1);
                                                                    $scope.storesDisp.Phone = Number(phoneNo.join(""));
                                                                    $scope.storesDisp.countryCode = newDealer.countryCode;
                                                                }

                                                            } else {
                                                                $scope.storesDisp.countryCode = '+91'
                                                                $scope.storesDisp.Phone = Number(newDealer.Phone);
                                                            }
                                                            $scope.edit.dealer = false;
                                                        }



                                                    })
                                            } else {
                                                Settings.successPopup('Success', newDealer.DealerName + ' successfully updated ');
                                                // toastr.success($scope.nav[2].tab+' Successfully Updated ');
                                                // $scope.dealerEditPage = false ;
                                                $scope.refreshTransactions(4);
                                                if (newDealer.newStockist.length) {
                                                    for (var i = 0; i < newDealer.newStockist.length; i++) {
                                                        newDealer.assignedStockist.push(newDealer.newStockist[i])
                                                    }
                                                    newDealer.newStockist = [];
                                                }
                                                if (newDealer.newImages.length) {
                                                    for (var i = 0; i < newDealer.newImages.length; i++) {
                                                        newDealer.cloudinaryURL.push(newDealer.newImages[i])
                                                    }
                                                }
                                                $scope.storesDisp = newDealer;
                                                if (newDealer.countryCode) {
                                                    var sellerphoneNo = ("" + newDealer.Phone).split("");
                                                    if (newDealer.countryCode == '+91') {
                                                        if (sellerphoneNo.length > 10) {
                                                            // var sellerphoneNo = (""+response.sellerphone).split("");
                                                            var phoneNo = sellerphoneNo.splice(newDealer.countryCode.length - 1);
                                                            $scope.storesDisp.Phone = Number(phoneNo.join(""));
                                                        }

                                                    } else {
                                                        // var sellerphoneNo = (""+response.sellerphone).split("");
                                                        var phoneNo = sellerphoneNo.splice(newDealer.countryCode.length - 1);
                                                        $scope.storesDisp.Phone = Number(phoneNo.join(""));
                                                        $scope.storesDisp.countryCode = newDealer.countryCode;
                                                    }

                                                } else {
                                                    $scope.storesDisp.countryCode = '+91'
                                                    $scope.storesDisp.Phone = Number(newDealer.Phone);
                                                }
                                                $scope.edit.dealer = false;
                                            }

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
                        } else {
                            Settings.failurePopup('Error', 'Phone Number already exists');
                        }
                    }
                    else {
                        Settings.failurePopup('Error', 'Invalid Phone Number');
                    }
                }
                else {
                    Settings.failurePopup('Error', 'Invalid Name');
                }

            }

            if (type == 'close') {
                $scope.showEditDealerListview = false;
            }

            if (type == 'Seller') {
                $scope.editedDealer.Seller = newDealer;

                jQuery.noConflict();
                $(".salesrepDropdown").css('display', 'none')

                if (newDealer == null) {
                    Settings.failurePopup('Error', "Select a Salesperson ");

                    // bootbox.alert({
                    //     title : "ERROR",
                    //     message : "Select a Salesperson",
                    //     className : "text-center"
                    // })
                }
                else {
                    if (dealer.Seller == newDealer.sellerphone || dealer.Seller2 == newDealer.sellerphone || dealer.Seller3 == newDealer.sellerphone) {
                        Settings.failurePopup('Error', "Salesperson is already assigned to this " + $scope.nav[2].tab);
                        // bootbox.alert({
                        //     title : "ERROR",
                        //     message : "Salesperson is already assigned to this "+$scope.nav[2].tab,
                        //     className : "text-center"
                        // })
                    } else {


                        if (dealer.Seller == '' || !dealer.Seller) {
                            dealer.Seller = newDealer.sellerphone;
                            dealer.SellerName = newDealer.sellername;


                            $http.put("/dash/stores/update/Seller", dealer)
                                .success(function (res) {
                                    if (res) {
                                        // jQuery.noConflict();
                                        // $('#storeModal').modal('hide')

                                        toastr.success('Successfully assigned Salesperson');

                                        //$scope.refreshTransactions(4);
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
                        } else if (!dealer.Seller2) {
                            dealer.Seller2 = newDealer.sellerphone;
                            dealer.Seller2Name = newDealer.sellername
                            $http.put("/dash/stores/update/Seller", dealer)
                                .success(function (res) {
                                    if (res) {
                                        // jQuery.noConflict();
                                        // $('#storeModal').modal('hide')

                                        toastr.success('Successfully assigned Salesperson');

                                        //$scope.refreshTransactions(4);
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

                        } else if (!dealer.Seller3) {
                            if (dealer.Seller != newDealer.sellerphone + "" || dealer.Seller != newDealer.sellerphone) {
                                dealer.Seller3 = newDealer.sellerphone;
                                dealer.Seller3Name = newDealer.sellername;

                                $http.put("/dash/stores/update/Seller", dealer)
                                    .success(function (res) {
                                        if (res) {
                                            // jQuery.noConflict();
                                            // $('#storeModal').modal('hide')

                                            toastr.success('Successfully assigned Salesperson');

                                            //$scope.refreshTransactions(4);
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
                        else if (typeof (dealer.Seller) == 'string' || typeof (dealer.Seller) == 'number') {

                            if (dealer.Seller != newDealer.sellerphone + "" || dealer.Seller != newDealer.sellerphone) {
                                var temp = '';
                                temp = dealer.Seller;

                                dealer.Seller = [];
                                dealer.Seller.push(temp);
                                dealer.Seller.push(newDealer.sellerphone);
                                dealer.SellerName += ', ' + newDealer.sellername;

                                $scope.storesDisp.multipleSeller = true;
                                $scope.showDealerDetail.multipleSeller = true;
                                $http.put("/dash/stores/update/Seller", dealer)
                                    .success(function (res) {
                                        if (res) {
                                            // jQuery.noConflict();
                                            // $('#storeModal').modal('hide')

                                            toastr.success('Successfully assigned Salesperson');
                                            $scope.refreshTransactions(4);
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
                            else {
                                Settings.failurePopup('Error', "Salesperson is already assigned to this " + $scope.nav[2].tab);
                            }
                        }
                        else {
                            for (var i = 0; i < dealer.Seller.length; i++) {
                                if (dealer.Seller[i] == newDealer.sellerphone + "" || dealer.Seller[i] == newDealer.sellerphone)
                                    sellerPresent = true;
                            }
                            $scope.showDealerDetail.multipleSeller = true;
                            $scope.storesDisp.multipleSeller = true;
                            // console.log('sellerPresent',sellerPresent)
                            if (!sellerPresent) {
                                dealer.Seller.push(newDealer.sellerphone);
                                dealer.SellerName += ', ' + newDealer.sellername;

                                $http.put("/dash/stores/update/Seller", dealer)
                                    .success(function (res) {
                                        if (res) {
                                            // jQuery.noConflict();
                                            // $('#storeModal').modal('hide')

                                            toastr.success('Successfully assigned Salesperson');
                                            $scope.refreshTransactions(4);
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
                            else {
                                Settings.failurePopup('Error', "Salesperson is already assigned to this " + $scope.nav[2].tab);
                            }

                        }
                    }


                }

                $scope.editDealer.Seller = false;
                $scope.editedDealer.Seller = null;
                $scope.editedDealer.searchSellerName = null;
            }

            if (type == 'Stockist') {
                jQuery.noConflict();
                $(".stockDropdown").css('display', 'none')

                if (newDealer == null) {
                    Settings.failurePopup('Error', 'Select a Stockist');
                }
                else {

                    if (!dealer.Stockist) {

                        if (newDealer.Stockist[0]) {

                            dealer.Stockist = newDealer.Stockist[0];
                            dealer.StockistName = newDealer._id;

                            $http.put("/dash/stores/update/Stockist", dealer)
                                .success(function (res) {
                                    if (res) {
                                        // jQuery.noConflict();
                                        // $('#storeModal').modal('hide')

                                        toastr.success('Successfully assigned Stockist');
                                        //$scope.refreshTransactions(4);
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
                        } else {
                            Settings.failurePopup('Error', 'Stockist number not available');
                        }

                    }
                    else if (typeof (dealer.Stockist) == 'string' || typeof (dealer.Stockist) == 'number') {
                        if (dealer.Stockist + "" != newDealer.Stockist[0] + "") {
                            var temp = '';
                            temp = parseInt(dealer.Stockist);

                            dealer.Stockist = [];
                            dealer.Stockist.push(temp);

                            if (newDealer.Stockist[0]) {
                                dealer.Stockist.push(newDealer.Stockist[0]);

                                // dealer.StockistName += ', '+newDealer.StockistName;
                                console.log("Final Result", dealer.Stockist);

                                $http.put("/dash/stores/update/Stockist", dealer)
                                    .success(function (res) {
                                        if (res) {
                                            // jQuery.noConflict();
                                            //     $('#storeModal').modal('hide');
                                            $scope.storesDisp.multipleStockist = true;

                                            toastr.success('Successfully assigned Stockist');
                                            //$scope.refreshTransactions(4);
                                        }
                                    })
                            } else {
                                Settings.failurePopup('Error', 'Stockist number not available');
                                // bootbox.alert({
                                //     title : "ERROR",
                                //     message : "Stockist number not available",
                                //     className : "text-center"
                                // })
                            }
                        }
                        else {
                            Settings.failurePopup('Error', 'Stockist is already assigned to this ' + $scope.nav[2].tab);
                            // bootbox.alert({
                            //     title : "ERROR",
                            //     message : "Stockist is already assigned to this "+$scope.nav[2].tab,
                            //     className : "text-center"
                            // })
                        }

                    }
                    else {
                        for (var i = 0; i < dealer.Stockist.length; i++) {
                            if (dealer.Stockist[i] + "" == newDealer.Stockist[0] + "")
                                sellerPresent = true;
                        }

                        if (!sellerPresent) {
                            if (newDealer.Stockist[0]) {
                                dealer.Stockist.push(newDealer.Stockist[0]);
                                // dealer.StockistName += ', ' + newDealer._id;

                                $http.put("/dash/stores/update/Stockist", dealer)
                                    .success(function (res) {
                                        if (res) {
                                            // jQuery.noConflict();
                                            // $('#storeModal').modal('hide')
                                            $scope.storesDisp.multipleStockist = true;

                                            toastr.success('Successfully assigned Stockist');
                                            //$scope.refreshTransactions(4);
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
                            } else {
                                Settings.failurePopup('Error', 'Stockist number not available');
                                // bootbox.alert({
                                //     title : "ERROR",
                                //     message : "Stockist number not available",
                                //     className : "text-center"
                                // })
                            }
                        }
                        else {
                            Settings.failurePopup('Error', "Stockist is already assigned to this " + $scope.nav[2].tab);
                            // bootbox.alert({
                            //     title : "ERROR",
                            //     message : "Stockist is already assigned to this "+$scope.nav[2].tab,
                            //     className : "text-center"
                            // })
                        }

                    }
                }

                $scope.editDealer.Stockist = false;
                $scope.editedDealer.StockistNumber = null;
            }

        };





        $scope.phoneNoValidate = function (tab, flag, temp, type) {
            $scope.validateDealerphone = false;


            switch (tab) {
                /*customer tab*/
                case 0: {

                    if (flag != true) {
                        var body = {
                            phone: temp
                        };
                        $http.post("/dash/enquiry/validate/phone", body).success(function (res) {

                            if (type != 'edit') {
                                if (temp) {
                                    if (res.length) {
                                        $scope.validateDealerphone = true;
                                    } else {
                                        $scope.validateDealerphone = false;
                                    }
                                } else {
                                    $scope.validateDealerphone = false;
                                }

                            } else if (type == 'edit') {
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
                    break;
                }


            }

        };

        $http.get("/dash/stores/" + $routeParams.id)
            .success(function (response) {
                dealer = response;

                if (dealer.leadStatusWithFollowup.length) {
                    var last = dealer.leadStatusWithFollowup[dealer.leadStatusWithFollowup.length - 1];
                    dealer.leadstatus = last.leadstatus;
                    dealer.leadsource = last.leadsource;
                    dealer.revenueAmount = last.revenueAmount;
                    dealer.comments = last.comments;
                }

                if (response.Phone) {
                    existingPhoneNumber = angular.copy(response.Phone)
                }

                $scope.getDealerMoreDetails(dealer);
                $scope.showListDealerDetails(dealer, 'edit');
                $scope.renderStoreEntryMap(dealer, 'view')
                $scope.showHideContact(response)
                $scope.showHideAddress(response)
                $scope.showHideInfo(response)
            }).error(function (error, status) {
            console.log(error, status);
            if (status >= 400 && status < 404)
                $window.location.href = '/404';
            else if (status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

        $scope.showHideContact = function (response) {
            if (response.contactPerson === "" || response.contactPerson === undefined || response.contactPerson === null) {
                $scope.showName = false;
            }
            if (response.contactPersonNo === "" || response.contactPersonNo === undefined || response.contactPersonNo === null) {
                $scope.showNumber = false;
            }
            if (response.email === "" || response.email === undefined || response.email === null) {
                $scope.showEmail = false;
            }
            if(!$scope.showName && !$scope.showNumber && !$scope.showEmail ){
                $scope.showContact = false;
                $scope.showLine = false;
            }
        }
        $scope.showHideInfo = function (response) {
            // if (response.Dealercode === "" || response.Dealercode === undefined || response.Dealercode === null) {
            //     $scope.showCcode = false;
            // }

            if (response.countryCode === "" || response.countryCode === undefined || response.countryCode === null) {
                $scope.showCountryCode = false;
            }


            // if(!$scope.showCcode && !$scope.showCountryCode && !$scope.showPhoneNumber ){
            //     $scope.showContact = false;
            // }
        }
        $scope.showHideAddress = function (response) {
            if (response.Address === "" || response.Address === undefined || response.Address === null) {
                $scope.showAddress = false;
            }
            if (response.Area === "" || response.Area === undefined || response.Area === null) {
                $scope.showArea = false;
            }
            if (response.City === "" || response.City === undefined || response.City === null) {
                $scope.showCity = false;
            }
            if (response.Pincode === "" || response.Pincode === undefined || response.Pincode === null) {
                $scope.showPincode = false;
            }
            if(!$scope.showAddress && !$scope.showArea && !$scope.showCity && !$scope.showPincode ){
                $scope.showAddressInfo = false;
            }
        }

        $scope.formatDateOnly = function (date) {
            if (date == undefined || date == '')
                return ('');
            /* replace is used to ensure cross browser support*/
            var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dt = d.getDate();
            if (dt < 10)
                dt = "0" + dt;
            var dateOut = dt;
            return dateOut;
        }
        $scope.formatMonthOnly = function (date) {
            if (date == undefined || date == '')
                return ('');
            /* replace is used to ensure cross browser support*/
            var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dt = d.getDate();
            if (dt < 10)
                dt = "0" + dt;
            var dateOut = monthNames[d.getMonth()];
            return dateOut;
        }

        $scope.getTimeFromDate = function (date) {
            if (date) {
                var t = date.split(" ");
                var time = t[1].split(":");

                if (time[0] <= 11) {
                    return time[0] + ":" + time[1] + " AM";
                }
                else if (time[0] == 12) {
                    return time[0] + ":" + time[1] + " PM";
                }
                else {
                    return (time[0] - 12) + ":" + time[1] + " PM";
                }
            }
            else {
                return 'Not available';
            }
        };

        $scope.dealersEditListView = function () {
            var input = document.getElementById('dealerListViewAddress');

            var editDealerAddress_autocomplete = new google.maps.places.Autocomplete(input);

            editDealerAddress_autocomplete.addListener('place_changed', function () {
                var newplace = editDealerAddress_autocomplete.getPlace();
                var lat = newplace.geometry.location.lat();
                var long = newplace.geometry.location.lng();
                for (var i = 0; i < newplace.address_components.length; i++) {
                    if (newplace.address_components[i].types[0] == "locality") {
                        var jcity = newplace.address_components[i].long_name;
                        var jaddress = newplace.formatted_address;
                    }
                    if (newplace.address_components[i].types[1] == "sublocality")
                        var jarea = newplace.address_components[i].long_name;
                    if (newplace.address_components[i].types[0] == "postal_code")
                        var jpostalCode = newplace.address_components[i].long_name;
                    if (newplace.address_components[i].types[0] == 'administrative_area_level_1')
                        var jstate = newplace.address_components[i].long_name;
                    if (newplace.address_components[i].types[0] == 'country')
                        var jcountry = newplace.address_components[i].long_name;
                }
                console.log("lat and long" + lat, long);
                console.log("city-- " + jcity);
                console.log("area-- " + jarea);
                console.log("address-- " + jaddress);
                console.log("state-- " + jstate);
                console.log("country-- " + jcountry);
                var scope = angular.element(document.getElementById('dealerListViewAddress')).scope();
                scope.editedDealer.City = jcity;
                scope.editedDealer.Area = jarea;
                scope.editedDealer.State = jstate;
                scope.editedDealer.Country = jcountry;
                scope.editedDealer.Address = jaddress;
                scope.editedDealer.Pincode = jpostalCode;
                scope.editedDealer.latitude = lat;
                scope.editedDealer.longitude = long;
                $('#editDealerArea').val(jarea);
                $('#editDealerCity').val(jcity);
                $('#editDealerPincode').val(jpostalCode);

            })
        }

        //new dealer address is blank, city and area also black
        $scope.empty = function (type) {

            if (type == 'new') {
                if ($scope.dealer.Address == "" || $scope.dealer.Address == undefined) {
                    $('#newDealerArea').val('');
                    $('#newDealerCity').val('');
                    $('#newDealerPincode').val('');

                    $scope.dealer.Area = "";
                    $scope.dealer.City = "";
                    $scope.dealer.Pincode = "";
                    $scope.dealer.latitude = "";
                    $scope.dealer.longitude = "";
                    console.log($scope.dealer)
                }
            }
            if (type == 'edit') {
                if ($scope.editedDealer.Address == "" || $scope.editedDealer.Address == undefined) {
                    $('#editDealerArea').val('');
                    $('#editDealerCity').val('');
                    $('#editDealerPincode').val('');

                    $scope.editedDealer.Area = "";
                    $scope.editedDealer.City = "";
                    $scope.editedDealer.Pincode = "";
                    $scope.editedDealer.latitude = "";
                    $scope.editedDealer.longitude = "";
                }
            }

        }

        $scope.ChangeCustomerType = function (data) {
            if (data) {
                $scope.editedDealer.customerType = '';
                $scope.editedDealer.ChangedToCustomer = new Date();
                var date = $scope.editedDealer.ChangedToCustomer;
                $scope.editedDealer.ChangedToCustomer = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');
            }

        }

        $scope.assignNewSeller = function (seller, type) {
            if (type == 'new') {
                if ($scope.editedDealer.assignedSellers.indexOf(seller.sellerphone) == -1) {
                    $scope.editedDealer.assignedSellers.push(seller.sellerphone);
                    $scope.storesDisp.salesPerson = '';
                } else {
                    Settings.alertPopup('Error', "Salesperson Already assigned");
                }

            } else if (type == 'remove') {
                $scope.editedDealer.assignedSellers.splice(seller, 1);
            }
        };

        $scope.assignNewStockist = function (user, type) {
            if (type == 'new') {

                if ($scope.editedDealer.assignedStockist.indexOf(user.Stockist) == -1) {
                    if ($scope.editedDealer.newStockist.length) {
                        if ($scope.editedDealer.newStockist.indexOf(user.Stockist) == -1) {
                            $scope.editedDealer.newStockist.push(user.Stockist);
                            $scope.storesDisp.Stockist = '';
                        }
                        else {
                            Settings.alertPopup('Error', "Stockist Already assigned");
                        }
                    }
                    else {
                        $scope.editedDealer.newStockist.push(user.Stockist);
                        $scope.storesDisp.stockist = '';
                    }
                    console.log("newStockist ", $scope.editedDealer.newStockist);
                } else {
                    Settings.alertPopup('Error', "Stockist Already assigned");

                }
            } else if (type == 'remove') {
                $scope.editedDealer.newStockist.splice(user, 1);
                //  $scope.editedDealer.assignedStockist.splice(user, 1);
            }
            console.log("assignedStockist 1",$scope.editedDealer.assignedStockist);
        };
        $scope.removeStockist = function(user, type){
            if (type == 'remove') {
                $scope.editedDealer.assignedStockist.splice(user, 1);
            }
            console.log("assignedStockist 2",$scope.editedDealer.assignedStockist);
            console.log("assignedStockist 2",$scope.storesDisp.assignedStockist);
        }

        //add Dealer auto fill address
        $scope.addNewDealerAddress = function () {
            var input = document.getElementById('address');
            var editDealerAddress_autocomplete = new google.maps.places.Autocomplete(input);

            editDealerAddress_autocomplete.addListener('place_changed', function () {
                var newplace = editDealerAddress_autocomplete.getPlace();
                var lat = newplace.geometry.location.lat();
                var long = newplace.geometry.location.lng();
                for (var i = 0; i < newplace.address_components.length; i++) {
                    if (newplace.address_components[i].types[0] == "locality") {
                        var jcity = newplace.address_components[i].long_name;
                        var jaddress = newplace.formatted_address;
                    }
                    if (newplace.address_components[i].types[1] == "sublocality")
                        var jarea = newplace.address_components[i].long_name;
                    if (newplace.address_components[i].types[0] == "postal_code")
                        var jpostalCode = newplace.address_components[i].long_name;
                }

                var scope = angular.element(document.getElementById('address')).scope();
                scope.dealer.City = jcity;
                scope.dealer.Area = jarea;
                scope.dealer.Pincode = jpostalCode;
                scope.dealer.Address = jaddress;
                scope.dealer.latitude = lat;
                scope.dealer.longitude = long;

                $('#newDealerArea').val(jarea);
                $('#newDealerCity').val(jcity);
                $('#newDealerPincode').val(jpostalCode);

                var latlng = new google.maps.LatLng(lat, long);
                var mapCanvas = document.getElementById("customerAddMap");
                var mapOptions = { center: latlng, zoom: 15 };
                var map = new google.maps.Map(mapCanvas, mapOptions);
                var marker = new google.maps.Marker({ position: latlng });
                marker.setMap(map);
            })
        };

        /*.......
    Delete dealer from collection
    .....*/
        $scope.deleteDealer = function (dealerCode, name) {
            Settings.confirmPopup("CONFIRM", "Are you sure ? ", function (res) {
                if (res) {
                    $http.delete("/dash/store/delete/" + dealerCode)
                        .success(function (res) {
                            if (res) {

                                $scope.dealerEditPage = false;
                                $scope.clearFilter(4);

                                // $('#storeModal').modal('hide');

                                setTimeout(function () {
                                    $('.refresh').css("display", "none");
                                }, 500);

                                Settings.successPopup('Success', name + ' successfully deleted ');
                                $scope.previousTab();

                                // bootbox.alert({
                                //     title : 'SUCCESS',
                                //     message : 'Successfully deleted.',
                                //     className : 'text-center'
                                // })

                                $http.get("/dash/pjp/get/beats")
                                    .success(function (res) {
                                        $scope.beats = res;
                                    })
                            }
                            else {
                                // $('#storeModal').modal('hide');

                                setTimeout(function () {
                                    $('.refresh').css("display", "none");
                                }, 500);

                                Settings.failurePopup("Error", 'Failed to delete. Please try again later');

                                // bootbox.alert({
                                //     title : 'ERROR',
                                //     message : 'Failed to delete. Please try again later',
                                //     className : 'text-center'
                                // })
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
            });

        };

        $scope.fetchDetails = function (invoice) {
            var url = encodeURIComponent(invoice)
            $location.path('/invoice-details/' + url);
        }

        $scope.backToBrowserHistory = function () {
            $window.history.back();
        };

        $scope.previousTab = function () {
            if ($scope.leadflag)
                $location.path('/customerAddresses/').search({ type: $scope.leadflag });
            else
                $location.path('/customerAddresses');
        };


        setTimeout(function () {
            $('.refresh').css("display", "none");
        }, 2000);



    });


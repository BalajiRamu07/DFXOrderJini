/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("OldSettingsCtrl", function($scope, $routeParams, $rootScope, $http, toastr, $window, Settings){
        console.log("Hello From Settings Controller .... !!!!");

        //for display in settings page
        // $scope.shopify_flag = JSON.parse($routeParams.flag);
        var el;
        var tab;
        // if($scope.shopify_flag){
        //     el = document.getElementById('Integrations_tab');
        //     el.classList.add('active');
        //     tab = document.getElementById('integrations');
        //     tab.classList.add('active');
        // }
        // else{
            el = document.getElementById('Company_profile_tab');
            el.classList.add('active');
            tab = document.getElementById('profile');
            tab.classList.add('active');
        // }
        $scope.dataSource = {} //for displaying the data input sources
        $scope.dataSource.selected = 'profile' //default
        $scope.navTabDataSource = 'tab';
        $scope.dataIntegrationTabDataSource = 'shopify';
        var instanceCryptoPass ='';
        $scope.enableOrdersEmail = false;
        $scope.noOfDevices = 1;
        $scope.expense = {};
        // var itemSearchObj = {};
        $scope.shopify = {};
        $scope.firebase = {};
        $scope.newNav = [];
        $scope.UserTabsActive = false;
        $scope.currency = '₹';
        $scope.country = {};
        $scope.country.name = 'India';
        $scope.email = {};
        $scope.settings = {};
        $scope.orderEditForStatus = [];
        $scope.leadStatus = [];
        $scope.gMapAPI = {};
        $scope.taxSetups = {};
        $scope.newPayment = {};
        $scope.warehouseLocation =[];
        $scope.location = {};
        $scope.dealerClasses = [];
        $scope.masterPriceList = [];
        $scope.priceListName = ['master'];
        $scope.class = {};
        $scope.class.priceList = 'master';
        $scope.price = {};
        $scope.invoiceID = {};
        $scope.companyDetails = {};
        $scope.editLeadStatus = [];
        $scope.editGMapAPI = {};
        $scope.editLeadSource=[];
        $scope.newLead = {};
        $scope.newGmapAPI = {};
        $scope.dealerNotificationFlag = false;
        $scope.enforceStockistFlag = false;
        $scope.dealerAsUserFlag = false;
        $scope.leadSource =[];
        $scope.enableQuotations = false;
        $scope.enableFulfiller = false;
        $scope.recordPaymentFlag = false;
        $scope.cloudinary = {};
        $scope.newmpg={};
        $scope.neworderType={};
        $scope.newUOM={};
        $scope.dealerAsCustomerFlag = false;

        $scope.quickbooksArray = [];
        $scope.applicationType='';

        //....Atmosphere....
            $scope.newEvaluationType = {};
                $scope.settingsEvaluation = [];
                $scope.settingsDepartment = [];
                $scope.editEvaluationType = [];
                $scope.editDepartmentSetup = [];


        //...... FTP Tenants....
        $scope.tenants = [];
        $scope.tenant = {type  : 'FTP', format : 'Standard'};

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        };

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        //Atmosphere....Functions for settings --->Author shradha

            $scope.addEvaluationType = function(type,days){

                var length = $scope.settingsEvaluation.length-1

                if(type != '' && type != undefined && days != '' && days != undefined){

                    var typeCaps = type.charAt(0).toUpperCase();
                    $scope.settingsEvaluation[length+1] = {
                        'name' : typeCaps+type.slice(1),
                        'days' : days
                    };
                    $scope.newEvaluationType.type = ''
                    $scope.newEvaluationType.days = ''
                    // $scope.settingsEvaluation[length+1] = type
                    console.log( $scope.settingsEvaluation);
//                    console.log("Inside....");

                    $http.put("/dash/settings/update/evaluationType",  $scope.settingsEvaluation)
                        .success(function(res){
                            console.log(res);
                        })

                }

            }
                $scope.editEvaluationTypeFromSettings = function(roles, index){
                    if(roles == undefined){
                    Settings.popupAlert("Please enter some text!")

                    }
                    else{
                        var rolesObj = [];
                        rolesObj = $scope.settingsEvaluation;
                        rolesObj[index] = {
                            name : $scope.settingsEvaluation[index].name,
                            days : roles
                        };

                        console.log(rolesObj)

                        $http.put("/dash/settings/update/evaluationType",  $scope.settingsEvaluation)
                            .success(function(res){
                                console.log(res);
                                if(res)
                                {
                                 Settings.popupAlert("Evaluation type successfully updated")

                                }
                                else{
                                     Settings.popupAlert("Error while updating evaluation type")

                                }
                            })

                    }
                };
                    $scope.removeEvaluationType = function(roles){
                        var index = $scope.settingsEvaluation.map(function(o) { return o.name; }).indexOf(roles);
                        console.log(index);
                        if(index != -1 && ($scope.settingsEvaluation.length > 1)){
                            console.log(index);
                            $scope.settingsEvaluation.splice(index, 1);
                            console.log($scope.settingsEvaluation)

                            $http.put("/dash/settings/update/evaluationType", $scope.settingsEvaluation)
                                .success(function(res){
                                    //console.log(res);
                                    // $scope.userRole = res;
                                })

                        }
                        else{
                                        Settings.popupAlert("A minimum of one type has to be present.")

//                            bootbox.alert({
//                                title : 'ERROR',
//                                message : 'A minimum of one type has to be present.',
//                                className : 'text-center'
//                            })
                        }

                    }

                        $scope.addDepartment = function(name){
                            var length = $scope.settingsDepartment.length-1

                            if(name != '' && name != undefined){

                                var typeCaps = name.charAt(0).toUpperCase();
                                $scope.settingsDepartment[length+1] = {
                                    'name' : typeCaps+name.slice(1)
                                };
                                $scope.newEvaluationType.dept = ''
                                // $scope.settingsEvaluation[length+1] = type

                                $http.put("/dash/settings/update/department",  $scope.settingsDepartment)
                                    .success(function(res){
                                        console.log(res);
                                    })

                            }
                            else{
                                  Settings.popupAlert("Please enter both the fields.")

                            }
                        }

                            $scope.removeDepartmentFormSetup = function(roles){
                                var index = $scope.settingsDepartment.map(function(o) { return o.name; }).indexOf(roles);
                                if(index != -1 && ($scope.settingsDepartment.length > 1)){
                                    $scope.settingsDepartment.splice(index, 1);
                                    //console.log($scope.settingsDepartment)

                                    $http.put("/dash/settings/update/department", $scope.settingsDepartment)
                                        .success(function(res){
                                            console.log(res);
                                            // $scope.settingsDepartment = res;
                                        })

                                }
                                else{
                                    Settings.popupAlert("A minimum of one type has to be present.")

                                }

                            }

                                $scope.editDepartmentFromSettings = function(roles, index){
                                    if(roles == undefined){
                                        Settings.popupAlert("Please enter some text")
//
//                                        bootbox.alert({
//                                            title : "ERROR",
//                                            message : "Please enter some text",
//                                            className : "text-center"
//                                        })
                                    }
                                    else{
                                        var rolesObj = [];
                                        var typeCaps = roles.charAt(0).toUpperCase();
                                        rolesObj = $scope.settingsDepartment;
                                        rolesObj[index] = {
                                            name : typeCaps+roles.slice(1)
                                        };

                                        //console.log(rolesObj)

                                        $http.put("/dash/settings/update/department",  rolesObj)
                                            .success(function(res){
                                                console.log(res);
                                                if(res)
                                                {
                                                   Settings.popupAlert("Department successfully updated")

                                                }
                                                else{
                                                       Settings.popupAlert("Error while updating department")
//
//                                                    bootbox.alert({
//                                                        title : 'Error',
//                                                        message : 'Error while updating department',
//                                                        className : 'text-center'
//                                                    })
                                                }
                                            })
                                    }
                                };

                                    $scope.addGoalsConfiguration = function(evaluation)
                                    {
                                        if(evaluation != '' && evaluation != undefined){

                                            $scope.goalsConfigArray= {
                                                'holiday' : evaluation.holiday,
                                                'week_start' : evaluation.week_start,
                                                'week_end' : evaluation.week_end
                                            }
                                                $http.put("/dash/settings/update/goalsConfig",  $scope.goalsConfigArray)
                                                    .success(function(res){
                                                     Settings.popupAlert("Goals configuration successfully updated")


                                                    })
                                        }
                                        else{
                                               Settings.popupAlert("Please enter text.")

                                        }
                                    }


            // Select the application type in the instance
            $scope.changeApplicationType = function (type) {
                $http.put("/dash/settings/application/" + type)
                    .success(function (res) {
                        // console.log(res)
                        if (res == 'success') {
                            $scope.applicationType = type;
                        }
                    })
            }

        $scope.getShipInvoiceTermsAndConditions = function(){
            $http.get('/dash/settings/shipment/terms/conditions').success(function (result) {
                $scope.shipInvoiceTC = result;
            })
        }

        $scope.renderSettingsData = function() {
            startLoader();
            $http.get("/dash/instanceDetails")
                .success(function (response) {
                    stopLoader();
                    console.log("Instance Details --> ", response);
                    instanceCryptoPass = response.cryptoPass;
                    $scope.coID = response.coID || '';
                    $scope.api_key = response.api_key || '';
                    $scope.items_csv_upload_date = response.items_csv_upload_date || '';
                    $scope.stores_csv_upload_date = response.stores_csv_upload_date || '';
                    $scope.inventory_csv_upload_date = response.inventory_csv_upload_date || '';
                    $scope.currency = response.currency || "₹";
                    $scope.country.name = response.country || 'India';
                    $scope.tempCountryName = $scope.country.name.toLowerCase();
                    $scope.companyQtnEmail = response.companyQtnEmail;
                    $scope.fullName = response.full_name;
                    $scope.logo_url = response.logo_url;
                    $scope.lockOrderInventory = response.orderInvlock;
                    $scope.shipmentEnable = response.orderShipment;
                    //.... All the email configuration is set here....!!!
                    $scope.email.company_name = response.company_name;
                    $scope.email.from = response.from;
                    // $scope.email.subject=response.subject;
                    $scope.email.cc = response.cc;
                    $scope.email.contact_number = response.support_contact_number;
                    $scope.email.support_email = response.support_email;
                    $scope.email.company_logo_url = response.company_logo_url;
                    $scope.email.company_description = response.company_description;
                    $scope.email.company_website_url = response.company_website_url;
                    $scope.companyDetails.companyEmail = response.companyEmail ? response.companyEmail : '';
                    $scope.companyDetails.companyName = response.companyName || '';
                    $scope.companyDetails.storeName = response.storeName || '';
                    $scope.companyDetails.gstNumber = response.gstNumber || '';
                    $scope.companyDetails.companyAddress = response.companyAddress || '';
                    $scope.companyDetails.companyCity = response.companyCity || '';
                    $scope.companyDetails.companyState = response.companyState || '';
                    $scope.companyDetails.companyLatitude = response.companyLatitude || '';
                    $scope.companyDetails.companyLongitude = response.companyLongitude || '';
                    $scope.companyDetails.companyIdc = response.companyIdc || '';
                    $scope.companyDetails.companyTmc = response.companyTmc || '';
                    $scope.companyDetails.bannerText = response.bannerText || '';
                    $scope.companyDetails.storeVal = response.storeVal;
                    $scope.companyDetails.storeURL = response.storeURL;
                    $scope.companyDetails.logo_url = response.logo_url;
                    $scope.companyDetails.deliveryDistance = response.deliveryDistance;
                    $scope.companyDetails.storeAddress = response.storeAddress || '';
                    $scope.companyDetails.storeCity = response.storeCity || '';
                    $scope.companyDetails.storeState = response.storeCity || '';
                    $scope.companyDetails.storeLatitude = response.storeLatitude;
                    $scope.companyDetails.storeLongitude = response.storeLongitude;
                    $scope.companyDetails.minOrderAmount = response.minOrderAmount;
                    $scope.companyDetails.phone = response.phone;
                    $scope.companyDetails.domain = (window.location.hostname == 'localhost'? ('http://' + window.location.host) : ('https://' + window.location.host));

                    $scope.superjini = response.superjini || false;
                    $scope.settings.invoice = response.invoice;
                    $scope.smsCount = response.smsCount;
                    $scope.notificationConfig = response.notification;
                    $scope.editByRoles = response.dealerEdit;
                    $scope.sendSms = response.sendSms;
                    $scope.taxSetup = response.taxSetup? (response.taxSetup.activate == false? false : true) : true;
                    $scope.taxExclusive = response.tax? (response.taxExclusive ? response.taxExclusive : false) : false;
                    // $scope.goalsConfigArray = response.goalsConfig ? response.goalsConfig : {};
                    $scope.tax = response.tax ? response.tax : [];
                    $scope.otherTax = response.otherTax ? response.otherTax : [];
                    $scope.otherTaxDefault = {};
                    $scope.updateNotificationEnable = response.updateNotification ? response.updateNotification : true;
                    $scope.forceUpdateEnable = response.enforceUpdate ? response.enforceUpdate : false;
                    $scope.vanSalesEnable = response.vanSalesEnable ? response.vanSalesEnable : false;
                    $scope.recordPaymentFlag = response.recordPayment ? response.recordPayment : false;
                    $scope.paymentModes = response.paymentMode;
                    $scope.invoiceID.name = response.invoiceID || 'INV' ;
                    $scope.leadStatus = response.leadStatus || [];
                    $scope.gMapAPI = response.gMapAPI || '';
                   // console.log("gmap",response.gMapAPI );
                    $scope.leadSource=response.leadSource||[];
                    $scope.mpg=response.mpg || [];
                    $scope.orderType=response.orderType || [];
                    $scope.salesUOM=response.salesUOM || [];


                    $scope.subscription = response.subscription || {};
                    $scope.customNames = response.customNames || [];
                    $scope.dealerNotificationFlag = response.dealerNotificationFlag || false;
                    $scope.enforceStockistFlag = response.enforceStockistFlag || false;
                    $scope.dealerAsUserFlag = response.dealerAsUserFlag || false;
                    $scope.dealerAsCustomerFlag = response.dealerAsCustomerFlag || false;
                    $scope.goalsConfigArray = response.goalsConfig ? response.goalsConfig : {};


                    $scope.percentageDiscount = response.percentageDiscount || false

                    $http.get("/dash/settings/invoice/recent/id")
                        .success(function(response){
                            // console.log('response',response)
                            const zeroPad = (num, places) => String(num).padStart(places, '0');
                            if(!response){
                                $scope.invoiceID.num = zeroPad(1,5)
                            }else{

                                $scope.invoiceID.num = zeroPad(response.invoiceID,5);
                                // console.log($scope.invoiceID.num)
                            }
                        });
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
                    $scope.uploadIds = response.csv_upload_date ? response.csv_upload_date : [];
                    $scope.leaveType = response.leave.leaveType;
                    $scope.leaveEnabled = []
                    for(var i=0; i< response.leave.leaveType.length; i++){
                        $scope.leaveEnabled[response.leave.leaveType[i].type] = {'name' :response.leave.leaveType[i].name, 'enable' : response.leave.leaveType[i].enable};
                    }
                    $scope.orderEditForStatus = response.orderEdit ? response.orderEdit : [];

                    if(!response.orderEdit){
                        var obj = {};
                        obj.type = 'orderEdit';
                        obj.obj = [];

                        for (var i = 0; i < $scope.nav[1].status.length; i++) {
                            obj.obj.push({'status': $scope.nav[1].status[i], 'editable': false});
                        }

                        $http.put("/dash/settings/update/order/edit/access", obj.obj)
                            .success(function (res) {
                                //console.log(res);
                                $scope.orderEditForStatus = obj.obj;
                            })
                    }else{
                        if (response.orderEdit.length == 0) {
                            var obj = {};
                            obj.type = 'orderEdit';
                            obj.obj = [];

                            for (var i = 0; i < $scope.nav[1].status.length; i++) {
                                obj.obj.push({'status': $scope.nav[1].status[i], 'editable': false});
                            }

                            $http.put("/dash/settings/update/order/edit/access", obj.obj)
                                .success(function (res) {
                                    //console.log(res);
                                    $scope.orderEditForStatus = obj.obj;
                                })
                        }
                    }
                    $scope.inventoryType = response.inventoryType ? response.inventoryType : '';
                    $scope.applicationType = response.applicationType ? response.applicationType : 'OrderJini';
                    $scope.paytm = response.paytm ;
                    $scope.freight = response.freight ? response.freight :[] ;
                    $scope.freightChargeType = response.freightChargeType ? response.freightChargeType :[];
                    $scope.mopMargin = response.mopMargin ? response.mopMargin : 0 ;

                    //order DeliveryDate

                    $scope.deliveryDate = response.deliveryDate;
                    if(response.deliveryDate){
                        $scope.delivery_date_Enable = $scope.deliveryDate.delivery_date_Enable;
                        $scope.deliveryOrderDate = $scope.deliveryDate.orderDeliveryDate ? $scope.deliveryDate.orderDeliveryDate : '0';
                    }


                    var itemUpdateDate = new Date(response.items_update);
                    var inventoryUpdateDate = new Date(response.inventory_update);
                    var storesUpdateDate = new Date(response.stores_update);

                    var itemsUpdate = moment(itemUpdateDate);
                    var inventoryUpdate = moment(inventoryUpdateDate);
                    var storesUpdate = moment(storesUpdateDate);

                    var now = moment(new Date());

                    var itemUpdate2 = moment.duration(now.diff(itemsUpdate));
                    var inventoryUpdate2 = moment.duration(now.diff(inventoryUpdate));
                    var storesUpdate2 = moment.duration(now.diff(storesUpdate));


                    $scope.itemUpdateTime = itemUpdate2.asDays();
                    $scope.inventoryUpdateTime = inventoryUpdate2.asDays();
                    $scope.storesUpdateTime = storesUpdate2.asDays();

                    //.... We can enable to add new items from the mobile app, by setting true / false...
                    if(response.token != undefined)
                        $scope.token = response.token;
                    else
                        $scope.token = false;

                    //.... We can enable to add new items from the mobile app, by setting true / false...
                    if(response.addItems != undefined)
                        $scope.addItems = response.addItems;
                    else $scope.addItems = false;

                    if(response.attendance != undefined)
                        $scope.attendance = response.attendance;
                    else
                        $scope.attendance = false;

                    if(response.enableStocks != undefined)
                        $scope.enableStocks = response.enableStocks;
                    else
                        $scope.enableStocks = false;

                    if(response.enableFulfiller != undefined)
                        $scope.enableFulfiller = response.enableFulfiller;
                    else
                        $scope.enableFulfiller = false;

                    if(response.enableQuotations != undefined)
                        $scope.enableQuotations = response.enableQuotations;
                    else
                        $scope.enableQuotations = false;

                    if(response.enableOrdersEmail != undefined)
                        $scope.enableOrdersEmail = response.enableOrdersEmail;
                    else
                        $scope.enableOrdersEmail = false;

                    if(response.enableQuotationsEmail != undefined)
                        $scope.enableQuotationsEmail = response.enableQuotationsEmail;
                    else
                        $scope.enableQuotationsEmail = false;

                    if(response.discount){
                        $scope.discountList = response.discount;
                    }else{
                        $scope.discountList = [];
                    }

                    // if(response.UOM)
                    //     $scope.UOM = response.UOM;
                    // else
                    //     $scope.UOM = '';


                    if(response.stepQuantity) {
                        $scope.stepQuantity = response.stepQuantity;
                    }
                    else {
                        $scope.stepQuantity = 1;
                    }


                    //..... We can parameterize / customize / enable, disable the status changing on the portal..
                    //... By default we set to true (i.e. enabled)..
                    if(response.statusChange)
                        $scope.settings.statusChange = response.statusChange;
                    else $scope.settings.statusChange = false;

                    //..... We can parameterize / customize / enable, disable the status changing on the portal..
                    //... By default we set to true (i.e. enabled)..
                    if(response.lineStatusChange)
                        $scope.settings.lineStatusChange = response.lineStatusChange;
                    else $scope.settings.lineStatusChange = false;

                    if(response.editItemPrice)
                        $scope.settings.editItemPrice = response.editItemPrice;
                    else $scope.settings.editItemPrice = false;
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
                    }
                    if(response.masterPriceList){
                        $scope.masterPriceList = response.masterPriceList;
                    }
                    if(response.token || response.token != undefined)
                        $scope.token = response.token;
                    else
                        $scope.token = false;
                    if (response.enableOrdersEmail != undefined || response.enableOrdersEmail)
                        $scope.enableOrdersEmail = response.enableOrdersEmail;
                    else
                        $scope.enableOrdersEmail = false;
                    $scope.smsCount = response.smsCount ? response.smsCount : 0;
                    if (response.shopifyProperties) {
                        $scope.shopifyArray = response.shopifyProperties;
                    }

                    if (response.QuickBooksProperties) {
                        console.log()
                        $scope.quickbooksArray = response.QuickBooksProperties;
                    }
                });

            // $http.get("/dash/memberDetail").success(function(response){
            //     $scope.memberdetails = response;
            // })
            $http.get('/dash/settings/distMatrix').success(function (matrixData) {
                console.log("Get dist Matrix"+ matrixData.length);
                if(matrixData.length){
                    $scope.deliveryData = matrixData[0].matrix;
                }

            });
            Settings.getNav(true, function(nav){
                $scope.nav = nav;
                // console.log($scope.nav);
                $scope.reportTab = $scope.nav[8].cols;
            })

            var temp = false;
            for(var i=0;i<$scope.nav.length;i++){
                if(!$scope.nav[i].hasOwnProperty('flag')){
                    $scope.nav[i].flag = $scope.nav[i].activated;
                    temp = true;
                }
                if($scope.nav[i].flag == true){
                    $scope.newNav.push($scope.nav[i]);
                }

                if(i == $scope.nav.length - 1 && temp){
                    $http.put('/dash/nav/update', $scope.nav)
                        .success(function(res){
                            console.log(res);
                            // $scope.all();
                        });
                }
            }

            //Roles from nav
            if($scope.nav[4]){
                if($scope.nav[4].roles){
                    if($scope.nav[4].roles.length){
                        $scope.allRoles = [];
                        $scope.userRole = $scope.nav[4].roles;
                        $scope.editSetupRoles = [];
                        for(var j=0;j<$scope.userRole.length;j++){
                            $scope.allRoles.push({
                                name :$scope.userRole[j].name,
                                role :$scope.userRole[j].role
                            })
                            $scope.editSetupRoles.push({
                                name :$scope.userRole[j].name,
                                role :$scope.userRole[j].role.toLowerCase()
                            })
                        }
                        $http.put("/dash/settings/update/roles", $scope.userRole)
                            .success(function (response) {
                                //  console.log(response);
                            });
                    }
                    else{

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
                        $scope.allRoles = [];
                        for(var l=0;l<$scope.userRole.length;l++){
                            $scope.allRoles.push({
                                role :$scope.userRole[l].name
                            })
                        }
                    }
                }else{

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
                    $scope.allRoles = [];
                    for(var m=0;m<$scope.userRole.length;m++){
                        $scope.allRoles.push({
                            role :$scope.userRole[m].name
                        })
                    }
                    $scope.nav[4].roles = $scope.userRole;
                }
            }

            $http.get("/country/countryCode").success(function (res) {
                $scope.countryCode = res;
            })

            $http.get("/dash/settings/fetch/other/tabs")
                .success(function (tabs) {
                    $scope.otherTabs = [];
                    console.log('tabs', tabs);
                    if (tabs.length) {
                        $scope.otherTabs = tabs[0].Tabs;
                    } else {
                        $scope.otherTabs = [
                            {
                                'tab': 'Expense',
                                'tabIndex': 1,
                                'enable': false
                            },
                            {
                                'tab': 'Meetings',
                                'tabIndex': 2,
                                'enable': false
                            },
                            {
                                'tab': 'Payments',
                                'tabIndex': 3,
                                'enable': false
                            }
                        ];

                        if ($scope.otherTabs) {
                            $http.put("/dash/settings/other/tabs", $scope.otherTabs)
                                .success(function (res) {
                                    console.log(res);
                                });
                        }
                    }
                })

            $http.get("/dash/settings/customer/edit")
                .success(function(dealerEditRole){
                    $scope.dealerEditRoles = [];
                    if(dealerEditRole.length){
                        if(dealerEditRole.length || dealerEditRole[0].Roles.length)
                            for(var i=0; i< dealerEditRole[0].Roles.length; i++){
                                if(!dealerEditRole[0].Roles[i].enable){
                                    dealerEditRole[0].Roles[i].enable = false;
                                }
                            }
                        $scope.dealerEditRoles = dealerEditRole;
                    }else{
                        $scope.dealerEditRoles = [ {'Roles' : [
                            {
                                "name" : "Admin",
                                "role" : "Admin",
                                "enable" : false
                            },
                            {
                                "name" : "Salesperson",
                                "role" : "Salesperson",
                                "enable" : false
                            },
                            {
                                "name" : "Stockist",
                                "role" : "Stockist",
                                "enable" : false
                            },
                            {
                                "name" : "Dealer",
                                "role" : "Dealer",
                                "enable" : false
                            },
                            {
                                "name" : "Portal Access",
                                "role" : "Portal",
                                "enable" : false
                            },
                            {
                                "name" : "Fulfiller",
                                "role" : "Fulfiller",
                                "enable" : false
                            },
                            {
                                "name" : "Manager",
                                "role" : "Manager",
                                "enable" : false
                            },
                            {
                                "name" : "Branch Role",
                                "role" : "BranchManager",
                                "enable" : false
                            }
                        ]}];

                        $http.put("/dash/settings/update/customer/edit/access", $scope.dealerEditRoles)
                            .success(function(res){
                                //console.log(res);
                            })
                    }
                });

            $scope.customNames = [];
            $http.get("/dash/settings/customize/names")
                .success(function(customNames){
                    if(customNames.length && customNames[0].obj.length){
                        $scope.customNames = customNames[0].obj;
                        Settings.setInstanceDetails('customNames', $scope.customNames)

                    }else{
                        var customObj = {
                            "name" : "Delivery Date",
                            "displayName" : "Delivery Date"
                        };

                        $scope.customNames[0] = customObj;

                        $http.put("/dash/settings/update/custom/name", $scope.customNames)
                            .success(function(res){
                                Settings.setInstanceDetails('customNames', $scope.customNames)
                                //console.log(res);
                            })
                    }
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

            $http.get('/dash/enforce/credit/fetch')
                .success(function (response) {
                    if (response.length) {
                        $scope.enforceCredit = response[0].enforceCredit;
                    }
                })

            $http.get('/dash/enforce/orderInventory/fetch')
                .success(function (response){
                    if(response.length){
                        $scope.enforceInventoryOrder = response[0].enforceInventoryOrder;
                    }
                })

            $http.get('/dash/settings/standard/fulfilment')
                .success(function (response){
                    if(response.length){
                        $scope.standardOrderFulfilFlag = response[0].standardOrderFulfilFlag;
                    }
                })

            $http.get("/dash/shopify/creds/fetch")
                .success(function (response) {
                    console.log("Shopify credentials Fetched")
                    if(response.length){
                        $scope.shopify.api_key = response[0].shopify_api_key;
                        $scope.shopify.password = response[0].shopify_password;
                        $scope.shopify.host = response[0].shopify_host;
                        $scope.shopify.store_name = response[0].shopify_store_name;
                        //$scope.dataSource.selected = 'shopify'; //this will put shopify screen in settings

                        $scope.cloudinary.api = response[0].cloudinary_api;
                        $scope.cloudinary.cloud = response[0].cloudinary_cloud;
                        $scope.cloudinary.secretapi = response[0].cloudinary_secretapi;
                        if(response[0].cloudinary_api) $scope.cloudinary.upload_limit = 75000;
                        else $scope.cloudinary.upload_limit = 300;

                    }
                })
                .error(function (error){
                    console.log(error)
                })

            $http.get('/dash/userTabs/showUserTabs')
                .success(function (result){
                    if(result.length)
                        $scope.UserTabsActive = result[0].UserTab;
                })

            $scope.getWarehouseLocation();
            $scope.getShipInvoiceTermsAndConditions();
        };

        // Fetch warehouse locations from setting location ........
        $scope.getWarehouseLocation = function(){
            $http.get("/dash/settings/inventory/locations").success(function(res){
                if(res.length){
                    $scope.warehouseLocation = res[0].location;
                }
            }).catch(function(err){
                console.log(err);
            })
        }

        $scope.renderSettingsData();

        $scope.addShipInvoiceTermsCondition = function(shipInvoiceTC){
            var body = {};
            body.shipInvoice = shipInvoiceTC;
    
            $http.post('/dash/settings/terms/conditions', body).success(function (res) {
                if(res){
                    toastr.success("Terms and condition Added Successfully")
                }
                $scope.getShipInvoiceTermsAndConditions();
    
            })
        }

        $scope.removeShipInvoiceTerms = function(type, terms, index){
            var body = {};
            body.type = type;
            body.terms = terms;
            bootbox.confirm({
                title : 'CONFIRM',
                message : "Are you sure you want to remove Shipping Invoice Terms & Conditions",
                className: "text-center",
                buttons : {
                    confirm : {
                        label : 'Remove',
                        className : 'btn-danger'
                    },
                    cancel : {
                        label : 'Cancel',
                        className : 'btn-success'
    
                    }
                },
                callback : function(result){
                    if(result){
                        $http.put('/dash/settings/terms/conditions/update', body)
                            .success(function (result) {
                                toastr.success("Terms and Conditions Removed Successfully");
                                $scope.getShipInvoiceTermsAndConditions();
                            })
                    }
                }
            })
    
        }

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
        }

         /*
            Discount value
        */
        $scope.discountObj = {};

        $scope.addDiscount = function(status){
            if(status != '' && status != undefined && Number(status)>0){
                var found = $scope.discountList.some(el => el.value === status);
                console.log('found',found)
    
                if(!found){
                    $scope.discountList[$scope.discountList.length] = {'value' : status}
                    $http.put("/dash/settings/discount", $scope.discountList)
                        .success(function(res){
                            //console.log(res);
                            $scope.discountObj.newDiscountValue = '';
                            $scope.discountList = res;
                        })
                }else{
                    bootbox.alert({
                        title : 'ERROR',
                        message : 'Discount value already exist',
                        className : 'text-center'
                    })
                }
            }
            else{
                bootbox.alert({
                    title : 'ERROR',
                    message : 'Discount value is invalid.',
                    className : 'text-center'
                })
            }
        }
    
        $scope.removeDiscount = function(value,index){
            $scope.discountList.splice(index, 1);
            $http.put("/dash/settings/discount", $scope.discountList)
                .success(function(res){
                    //console.log(res);
                    $scope.discountObj.newDiscountValue = '';
                    $scope.discountList = res;
                })
    
        }

        //Prompt if user wants to access nav change view. Password is 'pass4superadmin'
        $scope.checkIfSuperAdmin = function(){

            Settings.inputPrompt("Enter Password","password",function (result) {
                    if(result){
                        var temp = {};
                        temp.pass = result;
                        $http.post("/dash/getCryptoPass", temp)
                            .success(function(res){
                                if(result == 'pass4superadmin' || res == instanceCryptoPass){
                                    $scope.dataSource.selected = 'nav';
                                    $scope.class = {};
                                    $scope.class.priceList = 'master';
                                    $scope.getExpense();
                                    // $scope.getPurchaseStatus();
                                    if($scope.applicationType == 'Atmosphere'){
                                        if(!$scope.settingsEvaluation.length){
                                            $http.get("/dash/settings/get/evaluation")
                                                .success(function(response){
                                                    console.log("Evaluation types" + response.length)
                                                    $scope.settingsEvaluation = response[0].obj;
                                                });
                                        }
                                        if(!$scope.settingsDepartment.length){
                                            $http.get("/dash/settings/get/department")
                                                .success(function(response){
                                                    console.log("Department from settings" + response.length);
                                                    if(!$scope.settingsDepartment.length){
                                                        $http.get("/dash/userDepartments")
                                                            .success(function(response){
                                                                console.log("All departments" + response.length);
                                                                //   console.log(response)
                                                                if(response.length) $scope.allDepartments = response;
                                                                /* for(var k=0;k<$scope.allDepartments.length;k++){
                                                                 $scope.settingsDepartment.push({
                                                                 name : $scope.allDepartments[k]
                                                                 })
                                                                 }*/

                                                                $http.put("/dash/settings/update/department",   $scope.allDepartments)
                                                                    .success(function(res){
                                                                        $http.get("/dash/settings/get/department")
                                                                            .success(function(response){
                                                                                if(response.length) $scope.settingsDepartment = response[0].obj;
                                                                            })
                                                                    })
                                                            });
                                                    }
                                                    else{
                                                        console.log("departments exists");
                                                        $http.get("/dash/settings/get/department")
                                                            .success(function(response){
                                                                console.log(response)
                                                                if(response.length) $scope.settingsDepartment = response[0].obj;
                                                            })
                                                    }
                                                })
                                        }
                                    }
                                }
                                else{
                                    Settings.fail_toast('ERROR', 'Invalid password');
                                }
                            })
                    }
            });
        }


        $scope.getExpense = function(expense){
            $http.get('/dash/expense').success(function (result) {
                if(result && result[0]){
                    $scope.expense_Type = result[0];
                    for(var i = 0; i < $scope.expense_Type.category.length;i++){
                        if($scope.expense_Type.category[i].name == expense){
                            $scope.subExpenseShow = $scope.expense_Type.category[i].subexpense;

                            if($scope.expense_Type && $scope.expense_Type.category.length)
                                $scope.selectExpenses($scope.expense_Type.category[i].name);
                        }
                    }
                }
                $scope.expense.name = '';
            })
        }


        //........ Update the Company's email ID for setting up to receive orders via email...
        $scope.setOrdersEmailID = function (email) {
            $scope.companyEmail = email;
            if ($scope.companyEmail) {
                $http.put("/dash/settings/orders/email", {companyEmail: $scope.companyEmail})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) {
                            Settings.fail_toast('ERROR', "Something went wrong!")
                            $scope.companyEmail = '';
                        } else {
                            $scope.companyEmail = email;
                            Settings.setInstanceDetails('companyEmail', $scope.companyEmail)
                            Settings.success_toast('SUCCESS', "Email_Id Settings Updated!")
                        }
                    })
            }
            else {
                Settings.popupAlert("Please enter a valid email ID!")
            }
        }

        $scope.newAddCompanyAddress = function() {
            input = document.getElementById('newCompany_address');

            if(input && google.maps){
                var companyAddress_autocomplete = new google.maps.places.Autocomplete(input);

                companyAddress_autocomplete.addListener('place_changed', function () {
                    var newplace = companyAddress_autocomplete.getPlace();
    
                    var lat=newplace.geometry.location.lat();
                    var long = newplace.geometry.location.lng();
    
                    //.... We save the full address, lat and long....
                    $scope.companyDetails.companyAddress = newplace.formatted_address;
                    /*  $scope.companyDetails.latitude = newplace.geometry.location.lat();
                     $scope.companyDetails.longitude = newplace.geometry.location.lng();*/
    
                    //.... For tax calculations, we save the State and Country, etc.....
                    for (var i = 0; i < newplace.address_components.length; i++) {
                        console.log(newplace.address_components[i]);
                        if(newplace.address_components[i].types[0]=="administrative_area_level_1"){
                            $scope.companyDetails.companyState = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0]=="country"){
                            $scope.companyDetails.companyCountry = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0]=="locality")
                            $scope.companyDetails.companyCity = newplace.address_components[i].long_name;
    
                        if(newplace.address_components[i].types[0] == "postal_code")
                            $scope.companyDetails.companyPostalCode = newplace.address_components[i].long_name;
                    }
    
                    $scope.companyDetails.companyLatitude = lat;
                    $scope.companyDetails.companyLongitude = long;
    
                })
            }
        }

        $scope.addCompanyAddress = function() {
            var input = document.getElementById('company_address');

            if(input && google.maps){
                var companyAddress_autocomplete = new google.maps.places.Autocomplete(input);

                companyAddress_autocomplete.addListener('place_changed', function () {
                    var newplace = companyAddress_autocomplete.getPlace();

                    //.... We save the full address, lat and long....
                    $scope.companyDetails.companyAddress = newplace.formatted_address;
                /*  $scope.companyDetails.latitude = newplace.geometry.location.lat();
                    $scope.companyDetails.longitude = newplace.geometry.location.lng();*/

                    //.... For tax calculations, we save the State and Country, etc.....
                    for (var i = 0; i < newplace.address_components.length; i++) {
                        console.log(newplace.address_components[i]);
                        if(newplace.address_components[i].types[0]=="administrative_area_level_1"){
                            $scope.companyDetails.companyState = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0]=="country"){
                            $scope.companyDetails.companyCountry = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0]=="locality")
                            $scope.companyDetails.companyCity = newplace.address_components[i].long_name;

                        if(newplace.address_components[i].types[0] == "postal_code")
                            $scope.companyDetails.companyPostalCode = newplace.address_components[i].long_name;
                    }
                })
            }
        }

        $scope.addStoreAddress = function() {
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
            }
        }

        //........
        //
        //             GET APPLICATION STATISTICS (EG : NUMBER OF USERS PER CUSTOMER) FOR MOBIJINI SUPERADMIN
        //
        //..........
        $scope.getAppStats = function (flag) {

            if (flag) {
                console.log("Getting application statistics")
                $scope.showMobijiniAdminStatus = true;
                $http.get("/dash/settings/statistics")
                    .success(function (response) {
                        //console.log(response);
                        $scope.usersByCoid = response;

                        $scope.totalUsersInInstance = 0;
                        for (var i = 0; i < response.length; i++) {
                            $scope.totalUsersInInstance += response[i].count;
                        }
                    })
            }
            else {
                $scope.usersByCoid = {};
                $scope.showMobijiniAdminStatus = false;
            }
        }


        //........ Update the Company's email ID for setting up to receive Quotations via email...
        $scope.setQuotationsEmailID = function (companyQtnEmail) {
            $scope.companyQtnEmail = companyQtnEmail;

            if ($scope.companyEmail) {
                $http.put("/dash/settings/quotation/email", {companyQtnEmail: $scope.companyQtnEmail})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) {
                            alert("Something went wrong");
                            $scope.companyQtnEmail = '';
                        } else {
                            //console.log("Updated companyQtnEmail Email ID --> "+response);
                            $scope.companyQtnEmail = companyQtnEmail;
                        }
                    })
            }
            else {
                alert("Please enter a valid email ID");
            }
        }

        //........ Update the Company's Logo URL.....

        $scope.setCompany_logo_url = function (company_logo_url) {
            $scope.company_logo_url = company_logo_url;
            if ($scope.company_logo_url) {
                bootbox.confirm("Do you want to update Company Logo URL?", function (result) {
                    if (result) {
                        $http.put("/dash/settings/company/logo", {company_logo_url: $scope.company_logo_url})
                            .success(function (response) {
                                //console.log(response)
                                if (!response) {
                                    alert("Something went wrong");
                                    $scope.company_logo_url = '';
                                } else {
                                    $scope.company_Logo_Url = company_logo_url;
                                }

                            })
                    }
                    else {
                        // console.log("company logo URL not updated")
                    }
                });
            }

        }
        
        $scope.setCompanyID = function (coID) {
            $scope.coID = coID.toUpperCase();
            if (coID.length != 4) {
                alert("Error! Length should be 4 chars");
                $scope.coID = "";
            }
            else {
                $http.post("/dash/settings/company", {coID: $scope.coID})
                    .success(function (response) {
                        //console.log(response)
                        if (!response) {
                            alert("Pick different Company ID");
                            $scope.coID = "";
                        } else {
                            //console.log("Create -->" + response.length);
                            $scope.coID = coID.toUpperCase();
                        }
                        //$scope.all();
                    });
            }
        }

        //.....Api to set company description.......

        $scope.setcompanyDescription = function (company_description) {
            $scope.company_description = company_description;
            if ($scope.company_description) {
                bootbox.confirm("Do you want to update Company Description?", function (result) {
                    if (result) {
                        $http.put("/dash/settings/company/description", {company_description: $scope.company_description})
                            .success(function (response) {
                                //console.log(response)
                                if (!response) {
                                    alert('Something went Wrong')
                                    $scope.company_description = '';
                                } else {
                                    $scope.company_description = company_description;
                                }
                            })
                    }
                    else {
                        // console.log("company Description not updated")
                    }
                });
            }

        }

        //.....Api to set company website url.......

        $scope.setcompanyWebsiteUrl = function (company_website_url) {
            console.log(company_website_url)
            $scope.company_website_url = company_website_url;
            if ($scope.company_website_url) {
                bootbox.confirm("Do you want to update Company Website URL?", function (result) {
                    if (result) {
                        $http.put("/dash/settings/company/website", {company_website_url: $scope.company_website_url})
                            .success(function (response) {
                                //console.log(response)
                                if (!response) {
                                    alert('Something went Wrong')
                                    $scope.company_website_url = '';
                                } else {
                                    console.log("updated company description" + response)
                                    $scope.company_website_url = company_website_url;
                                }
                            })
                    }
                    else {
                        console.log("company Website Url not updated")
                    }
                });
            }
        }

        //Invoice Document Header

        $scope.setInvoiceHeader = function (Idc) {
            $scope.companyIdc = Idc;
            console.log("Update Invoice header : " + $scope.companyIdc);
            if ($scope.companyIdc) {
                $http.put("/dash/settings/company/idc", {companyIdc: $scope.companyIdc})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) {
                            alert("Something went wrong");
                            $scope.companyIdc = '';
                        } else {
                            console.log("Updated Company Email ID --> " + response);
                            $scope.companyIdc = Idc;
                            toastr.success("Added Successfully");
                        }
                    })
            }
            else {
                alert("Please enter a valid header");
            }
        }

        //Terms and conditions

        $scope.setInvoiceTmc = function (Tmc) {
            $scope.companyTmc = Tmc;
            console.log("Update Terns and Conditions: " + $scope.companyTmc);
            if ($scope.companyTmc) {
                $http.put("/dash/settings/company/terms/conditions", {companyTmc: $scope.companyTmc})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) {
                            alert("Something went wrong");
                            $scope.companyTmc = '';
                        } else {
                            console.log("Updated Company Email ID --> " + response);
                            $scope.companyTmc = Tmc;
                            toastr.success("Added Successfully");
                        }
                    })
            }
            else {
                alert("Please enter a valid header");
            }
        }

        /*Enable/ disable quotations via email*/
        $scope.quotationsEmail = function (enable) {
            $http.put("/dash/settings/enable/quotations/email", {enableQuotationsEmail: enable})
                .success(function (response) {
                    console.log(response);
                    if (!response) {
                        alert("Something went wrong");
                        $scope.enableQuotationsEmail = false;
                    } else {
                        console.log("Receive quotations via Email --> " + response.length);
                    }
                })
        }

        //.... Enable/disable to receive email orders...
        $scope.ordersEmail = function (enable) {
            $http.put("/dash/settings/enable/orders/email", {enableOrdersEmail: enable})
                .success(function (response) {
                    console.log(response);
                    if (!response) {
                        alert("Something went wrong");
                        $scope.enableOrdersEmail = false;
                    } else {
                        console.log("Receive orders via Email --> " + response.length);
                        toastr.success("Email_Id Added Successfully");
                    }
                })
        }

        $scope.setCompanyDetails = function() {
            $http.put("/dash/settings/update/company/details", $scope.companyDetails)
                .success(function (response) {
                     if (!response) {
                        Settings.fail_toast('ERROR', "Something went wrong!")
                    } else {
                        Settings.success_toast('SUCCESS', "Company Details Updated!")
                    }
                })
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


        $scope.clearCompanyDetails = function() {
            $scope.companyDetails.companyEmail = '';
            $scope.companyDetails.companyName = '';
            $scope.companyDetails.storeName = '';
            $scope.companyDetails.gstNumber = '';
            $scope.companyDetails.companyAddress = '';
            $scope.companyDetails.companyIdc = '';
            $scope.companyDetails.companyTmc = '';
        }


        //.... Enable/disable to receive email orders...
        $scope.ordersEmail = function (enable) {
            $http.put("/dash/settings/enable/orders/email", {enableOrdersEmail: enable})
                .success(function (response) {
                    // console.log(response);
                    if (!response) {
                        Settings.fail_toast('ERROR', "Something went wrong!")
                        $scope.enableOrdersEmail = false;
                        Settings.setInstanceDetails('enableOrdersEmail', $scope.enableOrdersEmail)
                    } else {
                        // console.log("Receive orders via Email --> " + response.length);
                        if(enable)
                            Settings.success_toast('SUCCESS', "Orders Email Enabled Successfully!");
                        else
                            Settings.info_toast('SUCCESS', "Orders Email Disabled Successfully!");
                    }
                })
        }


        //Invoice company address
        $scope.setInvoiceAddress = function (address) {
            $scope.companyAddress = address;
            console.log("Update Company Address : " + $scope.companyAddress);
            if ($scope.companyAddress) {
                $http.put("/dash/settings/company/address", {companyAddress: $scope.companyAddress})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) {
                            Settings.fail_toast('ERROR', "Something went wrong!")
                            $scope.companyAddress = '';
                        } else {
                            console.log("Updated Company Email ID --> " + response);
                            $scope.companyAddress = address;
                            Settings.setInstanceDetails('companyAddress', $scope.companyAddress)
                            Settings.success_toast('SUCCESS', "Address Added Successfully!")
                        }
                    })
            }
            else {
                Settings.popupAlert("Please enter a valid address");
            }
        }


        //Invoice Document Header
        $scope.setInvoiceHeader = function (Idc) {
            // $scope.companyIdc = Idc;
            console.log("Update Invoice header : " + Idc);
            if (Idc) {
                $http.put("/dash/settings/company/idc", {companyIdc: Idc})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) {
                            Settings.fail_toast('ERROR', "Something went wrong!")
                            $scope.companyDetails.companyIdc = '';
                        } else {
                            console.log("Updated Company Email ID --> " + response);
                            // $scope.companyIdc = Idc;
                            // Settings.setInstanceDetails('companyIdc', $scope.companyIdc)
                            Settings.success_toast('SUCCESS', "invoice Header Added Successfully!")
                        }
                    })
            }
            else {
                Settings.popupAlert("Please enter a valid header");
            }
        }


        //Terms and conditions
        $scope.setInvoiceTmc = function (Tmc) {
            // $scope.companyTmc = Tmc;
            console.log("Update Terns and Conditions: " + Tmc);
            if (Tmc) {
                $http.put("/dash/settings/company/terms/conditions", {companyTmc: Tmc})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) {
                            Settings.fail_toast('ERROR', "Something went wrong!")
                            $scope.companyDetails.companyTmc = '';
                        } else {
                            console.log("Updated Company Email ID --> " + response);
                            // $scope.companyDetails.companyTmc = Tmc;
                            // Settings.setInstanceDetails('companyTmc', $scope.companyTmc)
                            Settings.success_toast('SUCCESS', "Terms and Conditions Added Successfully!")
                        }
                    })
            }
            else {
                Settings.popupAlert("Please enter a valid header");
            }
        }


        //upload company logo
        $scope.uploadLogo = function(){
            var image = document.getElementById('logo-input_upload').files;

            var reader = new FileReader();
            reader.onloadend = function() {
                var tempObj = {};
                tempObj.image = reader.result;

                $http.post("/dash/upload/logo", tempObj)
                    .success(function(err, logo){
                        console.log(logo);
                        if(logo){
                            Settings.successPopup('SUCCESS','Logo successfully uploaded. Please refresh.');
                        }
                        else{
                            Settings.failurePopup('ERROR','Failed to upload. Please try after sometime.');
                        }
                    })

            }
            reader.readAsDataURL(image[0]);
        }


        //upload company docs
        $scope.uploadDocuments = function(){
            var image = document.getElementById('doc-input_upload').files;

            var reader = new FileReader();
            reader.onloadend = function() {
                var tempObj = {};
                tempObj.image = reader.result;

                $http.post("/dash/upload/documents", tempObj)
                    .success(function(err, docs){
                        console.log(docs);
                        if(docs){
                            Settings.successPopup('SUCCESS','Document successfully uploaded.');
                        }
                        else{
                            Settings.failurePopup('ERROR','Failed to upload. Please try after sometime.');
                        }
                    })

            }
            reader.readAsDataURL(image[0]);
        }

        //upload company logo
        $scope.newUploadLogo = function(){
            var image = document.getElementById('logo-input_upload').files;

            var reader = new FileReader();
            reader.onloadend = function() {
                var tempObj = {};
                tempObj.image = reader.result;

                $http.post("/dash/upload/logo", tempObj)
                    .success(function(err, logo){
                        console.log(logo);
                        if(logo){
                            Settings.successPopup('SUCCESS','Logo successfully uploaded. Please refresh.');
                        }
                        else{
                            Settings.failurePopup('ERROR','Failed to upload. Please try after sometime.');
                        }
                    })

            }
            reader.readAsDataURL(image[0]);
        }


        //upload company docs
        $scope.newUploadDocuments = function(){
            var image = document.getElementById('newdoc-input_upload').files;

            var reader = new FileReader();
            reader.onloadend = function() {
                var tempObj = {};
                tempObj.image = reader.result;

                $http.post("/dash/upload/documents", tempObj)
                    .success(function(err, docs){
                        console.log(docs);
                        if(docs){
                            Settings.successPopup('SUCCESS','Document successfully uploaded.');
                        }
                        else{
                            Settings.failurePopup('ERROR','Failed to upload. Please try after sometime.');
                        }
                    })

            }
            reader.readAsDataURL(image[0]);
        }

        //set no. of devices
        $scope.setNoOfDevices = function (noOfDevices) {
            // console.log('devices',noOfDevices);
            $scope.noOfDevices = noOfDevices;
            $http.put("/dash/devices/login/"+noOfDevices)
                .success(function(res){
                    if(res == 'success'){
                        Settings.setInstanceDetails('noOfDevices', $scope.noOfDevices)
                        Settings.success_toast('SUCCESS', "No. of devices updated!")

                    }
                })
        };

        $http.get("/dash/settings/devices/count")
            .success((devices) => {
                $scope.noOfDevices = 1;
                if(devices.length){
                    $scope.noOfDevices = devices[0].devices+'';
                }else{
                    $http.put("/dash/devices/login/" + 1)
                        .then((res) => {
                            if(res && res.data == 'success'){
                                console.log('default device per person set to 1')
                            }
                        })
                }
            })

        // ........... Data Integration Functions ............

        /* Shopify Integration */



        $scope.updateShopifyCreds = function(){
            //console.log($scope.shopify)
            if($scope.shopify.api_key!='' && $scope.shopify.password !='' && $scope.shopify.host !=''){
                $http.put("/dash/shopify/creds/update", $scope.shopify)
                    .success(function (response) {
                        Settings.success_toast('SUCCESS', "Shopify credentials updated!")
                    })
                    .error(function (error){
                        Settings.failurePopup('ERROR','Failed to update credentials!');
                    })
            }else{
                Settings.popupAlert("Enter all the shopify credentials")
            }
        };


        $scope.deleteShopifyCreds = function(){
            //console.log($scope.shopify)
            if($scope.shopify.api_key!='' && $scope.shopify.password !='' && $scope.shopify.host !=''){
                Settings.confirmPopup("Confirm","Are you sure to disconnect?",function (result) {
                    if (result) {
                        $http.delete("/dash/shopify/creds/remove", $scope.shopify)
                            .success(function (response) {
                                $scope.shopify.api_key = ''
                                $scope.shopify.password = ''
                                $scope.shopify.host = ''
                            })
                            .error(function (error) {
                                Settings.failurePopup('ERROR', 'Failed to disconnect!');
                            })
                    }
                })
            }else{
                Settings.popupAlert("Enter all the shopify credentials")
            }
        };

        // for posting products in shopify
        $scope.postShopifyCatalog = function(){
            // jQuery.noConflict();
            // $('.refresh').css("display", "inline");
            $http.post("/dash/sendshopifyCatalog")
                .success(function(response){

                    // setTimeout(function(){
                    //     $('.refresh').css("display", "none");
                    // }, 10000);

                    Settings.success_toast('SUCCESS', "Products exported to shopify")
                })
                .error(function (error){

                    // setTimeout(function(){
                    //     $('.refresh').css("display", "none");
                    // }, 10000);

                    Settings.failurePopup('ERROR', "Error exporting products");
                })
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


        $scope.getShopifyOrders = function(){
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            $http.get("/dash/shopify/pull/orders")
                .success(function (response) {
                    console.log("Shopify Orders Updation initiated");
                    console.log(response);

                    setTimeout(function(){
                        $('.refresh').css("display", "none");
                    }, 2000);

                    if(response == true){

                        Settings.success_toast('SUCCESS',"Shopify Orders will be synced in the background");
                    }
                    else{
                        Settings.failurePopup('ERROR', "Orders importing failed, Check the credentials and try again");
                    }

                })
                .error(function (error){
                    setTimeout(function(){
                        $('.refresh').css("display", "none");
                    }, 2000);
                    console.log(error);
                    Settings.failurePopup('ERROR',"Orders importing failed");
                })
        }


        $scope.shopifySchedularUpdate = function(boolean,type,category){

            $scope.shopifyArray[category][type] = boolean;

            $http.put("/dash/shopify/settings/update/properties", $scope.shopifyArray)
                .success(function (response) {
                    Settings.setInstanceDetails('shopifyArray', $scope.shopifyArray)

                });
        }


        //----------------------------------//

        //***** Quickbooks Integration ****//

        //---------------------------------//

        $scope.QBCredentials = () => {
            $http.get("/dash/quickbooks/creds/fetch")
                .then((creds) => {
                    if(creds && creds.data && creds.data.quickbooks_token){
                        $http.get("/dash/quickbooks/token/check").then((result) => {
                            if(result && result.data){
                                if(result.data.QueryResponse){
                                    if(creds.data.lastConnectedTime){
                                        $scope.qbConnectTime = creds.data.lastConnectedTime;
                                    }

                                    if(creds.data.qbCompany){
                                        $scope.qbCompany = creds.data.qbCompany;
                                    }
                                }else{
                                    $scope.qbConnect = false;
                                }
                                $http.get("/dash/quickbooks/request/token").then((response) => {
                                    if (response && response.data == true) {
                                        $scope.checkQbflag();
                                        $scope.showLoader = false;
                                        $scope.qbConnect = true;
                                        console.log("---- QB Session Available ----");
                                    } else {
                                        console.log("---- Connect Again ----");
                                        $scope.showLoader = false;
                                        $scope.qbConnect = false;
                                    }
                                })
                            }
                            else{
                                $scope.qbConnect = false;
                            }
                        })
                    }
                    else{
                        $scope.qbConnect = false;
                    }
                })
        }
        $scope.QBCredentials();

        var qbInterval = '';

        $scope.launchPopup = function(path) {
            var startTime = new Date().getTime();
            qbInterval = setInterval(function(){
                if(new Date().getTime() - startTime > 600000){
                    clearInterval(qbInterval);
                    return;
                }
                $scope.checkQbflag();
            }, 5000);

            $scope.showLoader = true;

            $http.get("/dash/quickbooks/creds/fetch")
                .then((credentials) => {
                    if(credentials && credentials.data && credentials.data.quickbooks_refToken) {

                        $http.get("/dash/quickbooks/request/token").then(function (response) {
                            if (response.data) {
                                $scope.showLoader = false;
                                $scope.qbConnect = true;
                                Settings.success_toast('SUCCESS',"QuickBooks Connected");
                                console.log("---- QB Session Available ----");
                            } else {
                                console.log("---- QB : Connect Again ----");
                                $scope.showLoader = false;
                                $scope.qbConnect = false;
                                Settings.failurePopup('ERROR',"Connect Again");
                            }
                        })
                    }
                    else{
                        $scope.showLoader = false;
                        console.log("QuickBooks : Launch Pop-up ----");

                        var win;
                        var checkConnect;
                        var parameters = "location=1,width=800,height=650";
                        parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;

                        // Launch Popup
                        win = window.open(path, 'connectPopup', parameters);
                    }
            })
        }


        $scope.checkQbflag = function(){
            $http.get("/dash/quickbooks/flag/check")
                .success(function(response){
                    if(response){
                        $scope.qbConnect = true;
                        $scope.qbConnectTime = response.lastConnectedTime;
                        $scope.qbCompany = response.quickbooks_company_id;
                        clearInterval(qbInterval);
                    }
                })
        }

        $scope.deleteQuickbooksTokens =function(){
            Settings.confirmPopup("Confirm","Are you sure you want to disconnect?",function (result) {
                if (result) {
                    $scope.showLoader = true;
                    $http.get("/dash/quickbooks/revoke")
                        .success(function (response) {
                            if (response) {

                                $scope.showLoader = false;
                                console.log("Tokens revoked from quickbooks **");
                                console.log(response)
                                $scope.qbConnect = false;
                                Settings.success_toast('SUCCESS', "QuickBooks disconnected");

                            }
                            else {
                                console.log("Error From Revoke Api....");
                                Settings.failurePopup('ERROR', "Error While Disconnecting, Try Again Later...");
                                $scope.showLoader = false;
                                $scope.qbConnect = true;
                            }

                        })
                }
            })
        }


        $scope.quickbooksSchedularUpdate = function(boolean,index){

            $scope.quickbooksArray[index]['sync'] = boolean;

            $http.put("/dash/quickbooks/update/properties", $scope.quickbooksArray)
                .success(function(response){
                    if(response){
                        console.log("Quickbooks scheduler updated****");
                    }
                })

        }

        $scope.downloadStorecsv = function(){
            $http.get("/dash/stores/ftp/refresh")
                .success(function(){
                    console.log('Downloaded');
                    Settings.popupAlert("Download Complete! Please refresh with F5.");
                });
        }


        $scope.downloadcsv = function(){
            //$http.get("/dash/items/download")
            $http.get("/dash/items/refresh")
                .success(function(){
                    console.log('Downloaded');
                    Settings.popupAlert("Download Complete! Please refresh with F5.");
                });
        }


        $scope.downloadSellerscsv = function(){
            //$http.get("/dash/items/download")
            $http.get("/dash/sellersrefresh")
                .success(function(){
                    console.log('Downloaded');
                    Settings.popupAlert("Download Complete! Please refresh with F5.");
                });
        }


        /*............................................
                FTP Tenant Management
        ........................................... */

        //Stores - serviceClient is store

        //.... Fetch all FTP tenants....
        $scope.fetchFTPTenants = () => {
            $http.get("/dash/tenants")
                .success(function (response) {
                    console.log("GetAll Tenants-->");
                    $scope.tenants = response;
                });
        };

        //.... Create a new tenant....
        $scope.createTenant = function(){
            console.log("Tenant Details --> ", $scope.tenant);

            if ($scope.tenant && $scope.tenant._id)
                $scope.tenant._id = null;

            $http.post("/dash/tenants", $scope.tenant)
                .success(function (response) {
                    console.log("Create -->" + response);
                    $scope.fetchFTPTenants();
                });
        };

        //.... Remove a tenant.....
        $scope.removeTenant = function(id) {
            $http.delete("/dash/tenants/" + id)
                .success(function (response) {
                    console.log("Delete -->" + response);
                    $scope.fetchFTPTenants();
                });
        };

        //..... Choose a tenant....
        $scope.selectTenant = function(id) {
            $http.get("/dash/tenants/" + id)
                .success( function(response) {
                    console.log("Select -->" + response);
                    $scope.tenant = response;
                });
        };

        //..... Update the tenant information.....
        $scope.updateTenant = function() {
            $http.put("/dash/tenants/" + $scope.tenant._id, $scope.tenant)
                .success(function (response) {
                    console.log("Update -->" + response);
                    Settings.success_toast("Success", "FTP Details Updated!");
                    $scope.fetchFTPTenants();
                });
        };


        /*............................................
                    Cloudianry Integration
         ........................................... */

        
        $scope.updateCloudinary = function(){
            //console.log($scope.cloudinary)
            if($scope.cloudinary.api!='' && $scope.cloudinary.cloud !='' && $scope.cloudinary.secretapi !=''){
                $http.post("/dash/settings/cloudinary/creds/update", $scope.cloudinary)
                    .success(function (response) {
                        Settings.successPopup('SUCCESS','Cloudinary Credentials Updated!');
                    })
                    .error(function (error){
                        Settings.failurePopup('ERROR', "Could not update "+error)
                    })
            }else{
                Settings.popupAlert("Enter all the cloudainary credentials")
            }
        };


        $scope.deleteCloudinaryCreds = function(){
            Settings.confirmPopup("Confirm","Are you sure you want to drop credentials?",function (result) {
                if (result) {
                    $http.delete("/dash/settings/cloudinary/creds/delete", $scope.shopify)
                        .success(function (response) {

                            Settings.successPopup('SUCCESS', "Cloudinary Credentials Dropped!");
                            $scope.cloudinary.api = '';
                            $scope.cloudinary.cloud = '';
                            $scope.cloudinary.secretapi = '';
                        })
                        .error(function (error) {
                            Settings.failurePopup('ERROR', "Could not drop creds " + error)
                        })
                }
            })
        };


        $scope.getItemsCategories = function(type) {
            $http.get("/dash/items/categories/"+type)
                .success(function (response) {
                    //console.log(response);
                    $scope.uniqueCategories =[];
                    $scope.categoryType = type;
                    for(var i=0; i< response.length; i++){
                        (function(i) {
                            $scope.uniqueCategories.push({categoryName : response[i]});
                            $http.get("/dash/item/category/image/" + type + "/" + $scope.uniqueCategories[i].categoryName).then(function (imgs) {
                                //console.log(imgs.data);
                                if (imgs.data.length){
                                    $scope.uniqueCategories[i].image = imgs.data[0].cloudinaryURL;
                                    $scope.uniqueCategories[i].type = imgs.data[0].type;
                                    $scope.uniqueCategories[i].categoryId = imgs.data[0].categoryId;
                                }
                            });
                        })(i)
                    }
                })
                .error(function (error){
                    console.log(error);
                    Settings.failurePopup('ERROR', "Could not fetch categories");
                })
        };


        $scope.openCategoryImageModal = function (cat) {
            $scope.categoryDetails = cat;
            jQuery.noConflict();
            $('#uploadCategoryImage').modal('show');
        };


        //Api to insert or update the firebase credentials
        $scope.updateFirebase = function(){

            if($scope.firebase.api_key!='' && $scope.firebase.database_url!='' && $scope.firebase.auth_domain!='' && $scope.firebase.project_id!='' && $scope.firebase_storage_bucket_id!='' && $scope.firebase_messaging_sender_id!='') {

                $http.put("/dash/firebase/setup", $scope.firebase)
                    .success(function (response) {
                        Settings.successPopup('SUCCESS',"Firebase credentials Updated!")
                    })
                    .error(function (error){
                        Settings.failurePopup('ERROR',"Could not update "+error)
                    })
            }else{
                Settings.popupAlert("Enter all the Firebase credentials")
            }
        }


        // Api to drop the firebase credentials from Database
        $scope.clearFirebase = function() {
            Settings.confirmPopup("Confirm","Are you sure you want to drop credentials?",function (result) {
                if (result) {
                    $http.delete("/dash/firebase/remove", $scope.firebase)
                        .success(function (response) {
                            Settings.successPopup('SUCCESS', "Firebase Credentials Dropped!");
                            $scope.firebase.api_key = '';
                            $scope.firebase.database_url = '';
                            $scope.firebase.auth_domain = '';
                            $scope.firebase.project_id = '';
                            $scope.firebase_storage_bucket_id = '';
                            $scope.firebase_messaging_sender_id = '';
                        })
                        .error(function (error) {
                            Settings.failurePopup('ERROR', "Could not drop creds " + error)
                        })
                }
            })
        }



        <!-- ............ NAV PAGE FUNCTIONS .............. -->

        //............ MENU SETUP ...................


        $scope.UserTabsSelect = function (data){
            var body = {};
            body.type = 'UserTabs'
            body.userTabs = data;
            if(data) {
                $http.put('/dash/UserTabs/update', body)
                    .success(function (res) {
                    });
            }else{
                $http.put('/dash/UserTabs/update', body)
                    .success(function (res) {
                    });
            }
        }


        $scope.saveNavChange = function(newNav, nav){
            if(newNav != ''){
                Settings.confirmPopup("Confirm","Renaming "+nav.tab+" to "+newNav+". Are you sure?",function (result) {
                        if(result){
                            nav.tab = newNav;
                            nav.task = 'name';

                            $http.post("/dash/update/navTab", nav)
                                .success(function(res){
                                    //console.log(res);

                                    if(res){
                                        Settings.getNav(true, function(nav){
                                            $scope.nav = nav;
                                        })
                                    }
                                    else{
                                        console.log("Nav not updated")
                                    }
                                })
                        }
                })
            }
            else{
                Settings.popupAlert("Enter a name for the tab");
            }

        }


        $scope.toggleNavTab = function(nav, flag,value){
            console.log(nav, flag, value)
            if(nav.tab === "Walk-in Sale" && flag === false){
                $rootScope.walkInSalesOn = true;
            }
            if(nav.tab === "Walk-in Sale" && flag === true){
                $rootScope.walkInSalesOn = false;
            }
            nav.flag = value;
            nav.activated = flag;
            nav.task = 'toggle';
            $http.post("/dash/update/navTab", nav)
                .success(function(res){
                    //console.log(res);
                    if(res){
                        Settings.getNav(true, function(nav){
                            $scope.nav = nav;
                        })
                    }
                    else{
                        console.log("Nav not updated")
                    }
                })

        }


        $scope.DealerPinCodeMadatory = function (enable) {
            $http.put("/dash/settings/customer/pincode/mandatory", {"type" : "DealerTabs", "PinCodeMadatory" : enable})
                .then(response => {
                    if(response.data && response.data.status == "success"){
                        fetchDealerTab();
                        Settings.success_toast("Success", "Pincode Mandatory - " + (enable ? "Enabled" : "Disabled"))
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


        $scope.saveNavReportChange = function(newNav, nav){
            if(newNav != ''){
                Settings.confirmPopup("Confirm","Renaming "+nav.tabName+" to "+newNav+"",function (result) {
                        if(result){
                            nav.tab = newNav;
                            nav.task = 'report';

                            $http.post("/dash/update/navTab", nav)
                                .success(function(res){
                                    //console.log(res);

                                    if(res){
                                        Settings.getNav(true, function(nav){
                                            $scope.nav = nav;
                                        })
                                    }
                                    else{
                                        console.log("Nav not updated")
                                    }
                                })
                        }
                })
            }
            else{
                Settings.popupAlert("Enter a name for the tab")
            }
        }

        //Report tab toggle
        $scope.toggleReportTab = function(report){
            report.task = 'reportToggle';
            $http.post("/dash/update/navTab", report)
                .success(function(res){
                    if(res){
                        Settings.getNav(true, function(nav){
                            $scope.nav = nav;
                        })
                    }
                    else{
                        console.log("Error while updating report tabs")
                    }
                })
        }


        //Leave type toggle
        $scope.toggleLeaveType = function(leave){

            $http.post("/dash/leave/update/type", leave)
                .success(function(res){
                    if(res){
                        // $http.get("/dash/instanceDetails")
                        //     .success($scope.renderInstanceDetails);

                        // bootbox.alert({
                        //     title : 'SUCCESS',
                        //     message : 'Successfully updated',
                        //     className : 'text-center'
                        // })
                    }
                    else{
                        Settings.failurePopup('ERROR','Unable to update. Please try again later')
                    }
                })
        }


        $scope.otherTabSetup = function(tab, index, flag){
            var body = {
                'tab' : tab,
                'tabIndex' : index+1,
                'enable': flag
            }

            $http.put("/dash/update/otherTabs", body)
                .success(function(res){
                    console.log(res);
                    // $scope.taxSetup = flag
                })
        }


        //............ SYSTEM SETUP ...................

        $scope.tokenAccess = function () {
            $scope.token = !$scope.token;
            console.log("Token Access --> " + $scope.token);
            $http.put("/dash/settings/token", {token: $scope.token})
                .success(function (response) {
                    if (!response) {
                        $scope.token = !$scope.token;
                        Settings.setInstanceDetails('token', $scope.token)
                    }
                })
        }


        //..... Update the line status change setting, to enable users to change line status of order lines, etc 'on-portal'...
        $scope.lineStatusEnable = function () {
            $http.put("/dash/settings/enable/status/lineStatus", {status: $scope.settings.lineStatusChange})
                .success(function (response) {
                    if (!response) {
                        Settings.setInstanceDetails('lineStatusChange', $scope.lineStatusChange)
                        console.log("!!!! Update Line Status Enable / Disable option --->")
                    }
                })
        };


        $scope.addNewItems = function () {
            $scope.addItems = !$scope.addItems;
            console.log("Add Items Access --> " + $scope.addItems);
            $http.put("/dash/items/add/update", {addItems: $scope.addItems})
                .success(function (response) {
                    if (!response) {
                        $scope.addItems = !$scope.addItems;
                        Settings.setInstanceDetails('addItems', $scope.addItems)
                    }
                })
        }


        $scope.enforceCreditUpdate = function(credit){
            var body = {};
            body.type = 'enforceCredit';
            body.enforceCredit = credit;
            if(credit) {
                $http.put('/dash/enforce/credit/update', body)
                    .success(function (res) {
                    });
            }else{
                $http.put('/dash/enforce/credit/update', body)
                    .success(function (res) {
                    });
            }
        }


        //..... Update the invoice module setting, to enable users to create invoice for orders, etc 'on-portal'...
        //... Currently designed for B&B Formork customer....
        $scope.invoicingType = function () {
            console.log($scope.settings.invoice);

            $http.put("/dash/settings/invoice", {invoice: $scope.settings.invoice})
                .success(function (response) {
                    if (!response) {
                        Settings.setInstanceDetails('invoice', $scope.settings.invoice)
                        console.log("!! Update Invoicing --->")
                    }
                })
        };


        // Select the inventory type in the instance
        $scope.changeInventoryType = function(type){
            $http.put("/dash/settings/inventory/mode/"+type)
                .success(function(res){
                    if(res == 'success'){
                        $scope.inventoryType = type;
                        Settings.setInstanceDetails('inventoryType', $scope.inventoryType)
                    }
                })
        }


        $scope.attendanceEnable = function () {
            $scope.attendance = !$scope.attendance;
            console.log("Enable/Disable attendance Access --> " + $scope.attendance);
            $http.put("/dash/settings/attendance", {attendance: $scope.attendance})
                .success(function (response) {
                    if (!response) {
                        $scope.attendance = !$scope.attendance;
                        Settings.setInstanceDetails('attendance', $scope.attendance)
                    }
                })
        }


        //.....Toggle edit item price ....//
        $scope.toggleEditItemPrice = function(){
            $http.put("/dash/settings/edit/price",{ editItemPrice : $scope.settings.editItemPrice})
                .success(function(response){
                    //console.log(response);
                    if(!response)
                        $scope.settings.editItemPrice = !$scope.settings.editItemPrice;
                    Settings.setInstanceDetails('editItemPrice', $scope.settings.editItemPrice)
                })
        }


        //..... Update the status change setting, to enable users to change status of orders, etc 'on-portal'...
        $scope.statusChangeEnable = function () {
            console.log($scope.settings.statusChange);
            $http.put("/dash/settings/enable/status/status", {status: $scope.settings.statusChange})
                .success(function (response) {
                    if (response) {
                        Settings.setInstanceDetails('statusChange', $scope.settings.statusChange)
                    }else{
                        console.log("!!!! Update Status Enable / Disable Option --->");
                    }
                })
        };


        /*
         Discount value
         */
        $scope.discountObj = {};

        $scope.addDiscount = function(status){
            console.log('statusk',status);
            if(status != '' && status != undefined && Number(status)>0){
                var found = $scope.discountList.some(el => el.value === status);
                console.log('found',found)

                if(!found){
                    $scope.discountList[$scope.discountList.length] = {'value' : status}
                    $http.put("/dash/settings/discount", $scope.discountList)
                        .success(function(res){
                            //console.log(res);
                            $scope.discountObj.newDiscountValue = '';
                            $scope.discountList = res;
                        })
                }else{
                    bootbox.alert({
                        title : 'ERROR',
                        message : 'Discount value already exist',
                        className : 'text-center'
                    })
                }
            }
            else{
                bootbox.alert({
                    title : 'ERROR',
                    message : 'Discount value is invalid.',
                    className : 'text-center'
                })
            }
        }

        $scope.removeDiscount = function(value,index){
            $scope.discountList.splice(index, 1);
            $http.put("/dash/settings/discount", $scope.discountList)
                .success(function(res){
                    //console.log(res);
                    $scope.discountObj.newDiscountValue = '';
                    $scope.discountList = res;
                })

        }

        $scope.selectSubExpenses = function (expense){
            $scope.subCatExpenseShow = [];
            $scope.subCatExpenseType = {};
            $scope.selectSubExpense = expense;

            if($scope.subExpenseShow.length){
                for(var i = 0; i < $scope.subExpenseShow.length;i++){

                    if($scope.subExpenseShow[i].subName == expense){

                        $scope.subCatExpenseShow = $scope.subExpenseShow[i].subExp;
                        return;
                    }
                }

            }
        }

        $scope.addSubCatExpenseType = function(expense, subExpense) {
            console.log('addSubCatExpenseType',expense, subExpense);
            if (subExpense && $scope.selectSubExpense && $scope.selectExpense) {
                if (subExpense) {
                    var body = {};
                    if(expense){
                        expense.push(subExpense);
                        body.expensetype = expense;


                    }
                    else{
                        expense = [];
                        expense.push(subExpense);
                        body.expensetype = expense;
                        $scope.subCatExpenseShow = [];
                        $scope.subCatExpenseShow.push(subExpense);
                    }
                    body.subExpense = subExpense;
                    body.selectSubExpense = $scope.selectSubExpense;
                    body.selectExpense = $scope.selectExpense;
                    $http.post('/dash/expense/update/category', body).success(function (res) {
                        $scope.subCatExpenseType.subExpenses = '';
                        $scope.getExpense(expense);
                    });
                } else {
                    bootbox.alert({
                        title: 'ERROR',
                        message: 'Please enter text.',
                        className: 'text-center'
                    })
                }
            }
            else{
                console.log("All values not there")
            }
        }

        // for bbc app inventory //
        $scope.restrictInventory = function(boolean){

            var body = {'lockvalue':boolean};

            $http.post("/dash/shopify/bbc/update/invLock", body)
                .success(function(response){

                    if(response == true){
                        Settings.setInstanceDetails('lockOrderInventory', $scope.lockOrderInventory)
                        // Settings.successPopup('SUCCESS',"Inventory Lock Updated!")
                    }
                    else{
                        Settings.failurePopup('ERROR',"Could not Update Inventory Lock!")
                    }
                })
        }


        // $scope.activateOrangeMantra = function(boolean){
        //
        //     console.log('activateOrangeMantra', boolean);
        //     var body = {'value':boolean};
        //
        //     console.log(body)
        //     $http.post("/dash/activate/OrangeMantra", body)
        //         .success(function(response){
        //
        //             if(response == true){
        //                 jQuery.noConflict();
        //                 $('.refresh').css("display", "inline");
        //                 $http.get("/orange_mantra/orderlist/28")
        //                     .success(function (response) {
        //                         console.log(response);
        //                         jQuery.noConflict();
        //                         $('.refresh').css("display", "none");
        //                         Settings.successPopup('SUCCESS',"Orders Fetched!")
        //                     })
        //                     .error(function(error, status){
        //                         console.log(error, status);
        //
        //                     })
        //                 Settings.setInstanceDetails('OrangeMantra', $scope.OrangeMantra)
        //                 // Settings.successPopup('SUCCESS',"Inventory Lock Updated!")
        //             }
        //             else{
        //                 Settings.failurePopup('ERROR',"Could not Update!")
        //             }
        //         })
        // }



        //******************* inventory check for order ********************
        $scope.inventoryCheckForOrder = function(credit){
            console.log(credit)
            $scope.enforceInventoryOrder = credit;
            var body = {};
            body.type = 'enforceInventoryOrder';
            body.enforceInventoryOrder = credit;
            if(credit) {
                $http.put('/dash/enforce/orderInventory/update', body)
                    .success(function (res) {
                    });
            }else{
                $http.put('/dash/enforce/orderInventory/update', body)
                    .success(function (res) {
                    });
            }
            Settings.setInventoryOrderConfig($scope.enforceInventoryOrder)
        }

        //******************* inventory check for order ********************
        $scope.standredOrderFulfilment = function(credit){
            console.log(credit)
            $scope.standredOrderFulfilFlag = credit;
            var body = {};
            body.type = 'standardOrderFulfilFlag';
            body.standardOrderFulfilFlag = credit;
            if(credit) {
                $http.put("/dash/settings/update/standard/order/fulfilment", body)
                    .success(function (res) {

                        var status = ["New", "Approved", "Packing","Ready for Delivery","Out for Delivery","Delivered","Closed","Cancelled"]
                        var OrderStatus = [];
                        for (var i=0;i<status.length;i++){
                            var obj = {};
                            obj.status = status[i];

                            if(i==0){
                                obj.editable = true;
                            }else{
                                obj.editable = false;
                            }
                            OrderStatus.push(obj);
                        }



                        $http.put("/dash/nav/order/status", status)
                            .success(function(res){
                                $scope.nav[1].status = status

                                $http.put("/dash/settings/update/order/edit/access", OrderStatus)
                                    .success(function(res){
                                        //console.log(res);
                                        $scope.orderEditForStatus = res;
                                        Settings.setInstanceDetails('orderEditForStatus', $scope.orderEditForStatus)
                                    })
                            })

                    });
            }else{
                $http.put("/dash/settings/update/standard/order/fulfilment", body)
                    .success(function (res) {
                    });
            }
            Settings.setStandredOrderFulfilmentConfig($scope.standredOrderFulfilFlag)
        }

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

        $scope.recordPayment = function () {
            $scope.recordPaymentFlag = !$scope.recordPaymentFlag;
            // $scope.recordPaymentFlag = !$scope.recordPaymentFlag;
            console.log("Add Items Access --> " + $scope.recordPaymentFlag);
            var body = {};
            body.type = 'recordPayment';
            body.recordPayment = $scope.recordPaymentFlag;
            $http.put("/dash/settings/record/order/payment", body)
                .success(function (response) {
                    if (!response) {
                        $scope.recordPaymentFlag = !$scope.recordPaymentFlag;
                    }else{
                        Settings.setInstanceDetails('recordPaymentFlag', $scope.recordPaymentFlag)
                        Settings.successPopup('SUCCESS',"Updated Successfully");
                    }
                })
        }

        $scope.newDealerAsCustomer = function () {
            $scope.dealerAsCustomerFlag = !$scope.dealerAsCustomerFlag;
            var body = {};
            body.type = 'newDealerAsCustomer';
            body.dealerAsCustomerFlag = $scope.dealerAsCustomerFlag;
            $http.put("/dash/settings/dealer/customer", body)
                .success(function (response) {
                    if (!response) {
                        $scope.recordPaymentFlag = !$scope.recordPaymentFlag;
                    }else{
                        Settings.setInstanceDetails('recordPaymentFlag', $scope.recordPaymentFlag)
                        Settings.successPopup('SUCCESS',"Updated Successfully");
                    }
                })
        }

        $scope.dealerNotification = function (status) {
            // $scope.dealerNotificationFlag = !$scope.dealerNotificationFlag;
            $scope.dealerNotificationFlag = status;
            var body = {};
            body.type = 'newDealerNotification';
            body.dealerNotificationFlag = $scope.dealerNotificationFlag;
            $http.put("/dash/dealer/notification/toggle", body)
                .success(function (response) {
                    if (!response) {
                        $scope.dealerNotificationFlag = !$scope.dealerNotificationFlag;
                    }else{
                        Settings.successPopup('SUCCESS',"Updated Successfully");
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

        $scope.enforceStockist = function (status) {
            $scope.enforceStockistFlag = status;
            var body = {};
            body.type = 'enforceStockist';
            body.enforceStockistFlag = $scope.enforceStockistFlag;
            $http.put("/dash/stockist/toggle", body)
                .success(function (response) {
                    if (!response) {
                        $scope.enforceStockistFlag = !$scope.enforceStockistFlag;
                    }else{
                        Settings.successPopup('SUCCESS',"Updated Successfully");
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


        $scope.newDealerAsUser = function (status) {
            $scope.dealerAsUserFlag = status;
            var body = {};
            body.type = 'newDealerAsUser';
            body.dealerAsUserFlag = $scope.dealerAsUserFlag;
            $http.put("/dash/dealer/user/toggle", body)
                .success(function (response) {
                    if (!response) {
                        $scope.dealerAsUserFlag != $scope.dealerAsUserFlag;
                    }else{
                        Settings.setInstanceDetails('dealerAsUserFlag', $scope.dealerAsUserFlag)
                        Settings.successPopup('SUCCESS',"Updated Successfully");
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

        $scope.stepQty = function (stepQuantity) {
            $scope.stepQuantity = stepQuantity;
            if ($scope.stepQuantity) $scope.stepQuantity = stepQuantity;
            else $scope.stepQuantity = 1;
            if ($scope.stepQuantity) {
                $http.put("/dash/settings/step/quantity", {stepQuantity: $scope.stepQuantity})
                    .success(function (response) {
                        //console.log(response);
                        if (!response) $scope.stepQuantity = 1;
                        Settings.setInstanceDetails('stepQuantity', $scope.stepQuantity)

                    })
            }
        }

        $scope.setCountry = function (country) {
            console.log("Setting set country --> " + country);
            var dial_code = '';
            if($scope.countryCode){
                for(var i =0; i< 245; i++){
                    if(country == $scope.countryCode[i].name){
                        // console.log($scope.countryCode[i]);
                        dial_code = $scope.countryCode[i].dial_code;
                        if($scope.countryCode[i].currency){
                            $scope.setCurrency($scope.countryCode[i].currency);
                        }else{
                            $scope.setCurrency('');
                        }
                    }
                }
            }

            $http.post("/dash/settings/country", {country: country, dial_code: dial_code})
                .success(function (response) {
                    if(response.nModified > 0){
                        Settings.setInstanceDetails('countryCode', dial_code);
                        Settings.setInstanceDetails('country', $scope.countryCode[i].name)
                        Settings.successPopup('SUCCESS',"Updated Successfully");
                    }
                    console.log("Create -->");
                    $scope.country.name = country;
                    $scope.tempCountryName = $scope.country.name.toLowerCase();
                    Settings.setInstanceDetails('country', $scope.tempCountryName)
                });
        }


        $scope.setCurrency = function (currency) {
            console.log("Setting Currency --> " + currency);
            $http.post("/dash/settings/currency", {currency: currency})
                .success(function (response) {
                   // console.log("Create -->" + response.length);
                    $scope.currency = currency;
                    Settings.setInstanceDetails('currency', $scope.currency)
                });

        }


        // $scope.setUOM = function (UOM) {
        //     $scope.UOM = UOM;
        //     if ($scope.UOM) {
        //         $http.put("/dash/settings/unit/measurement", {UOM: $scope.UOM})
        //             .success(function (response) {
        //                 //console.log(response);
        //                 if (!response) $scope.UOM = '';
        //                 Settings.setInstanceDetails('UOM', $scope.UOM)
        //             })
        //     }
        // }


        //To setup a new MVAAYOO SMS credentails to send SMS
        $scope.smsSetup = function(sms){
            console.log(sms)
            if(sms){
                if(sms.username && sms.password && sms.senderId){
                    console.log(sms)
                    $http.post("/dash/setup/Sms", sms)
                        .success(function(res){
                            console.log(res);
                            if(res){
                                Settings.successPopup('SUCCESS',"Successfully updated SMS credentials!");
                            }
                        })
                }
                else{
                    Settings.failurePopup('ERROR',"Enter all the 3 fields");
                }
            }
            else{
                Settings.failurePopup('ERROR',"Enter all the 3 fields");
            }
        }


        $scope.vanSalesEnable = false;
        $scope.enableVanSalesToggle = function(value){
            // console.log('vansales', value);
            var body = {};
            body.value = value;

            console.log('enableVanSalesToggle', value, body);
            $http.put("/dash/settings/van/sales", body)
                .success(function(response){
                    if(response){
                        console.log('van sales toggle updated');
                    }
                    else{
                        toastr.error("Error")
                    }
                })
        }

        $scope.quotationsEnable = function () {
            $scope.enableQuotations = !$scope.enableQuotations;
            console.log("enableQuotations Access --> " + $scope.enableQuotations);
            $http.put("/dash/settings/enable/quotations", {enableQuotations: $scope.enableQuotations})
                .success(function (response) {
                    if (!response) {
                        $scope.enableQuotations = !$scope.enableQuotations;
                    }
                })
        }

        $scope.fulfillerEnable = function () {
            $scope.enableFulfiller = !$scope.enableFulfiller;
            console.log("enableFulfiller Access --> " + $scope.enableFulfiller);
            $http.put("/dash/settings/enable/fulfiller", {enableFulfiller: $scope.enableFulfiller})
                .success(function (response) {
                    if (!response) {
                        $scope.enableFulfiller = !$scope.enableFulfiller;
                    }
                })
        }
    
        $scope.recordPayment = function () {
            $scope.recordPaymentFlag = !$scope.recordPaymentFlag;
            console.log("Add Items Access --> " + $scope.recordPaymentFlag);
            var body = {};
            body.type = 'recordPayment';
            body.recordPayment = $scope.recordPaymentFlag;
            $http.put("/dash/settings/record/order/payment", body)
                .success(function (response) {
                    if (!response) {
                        $scope.recordPaymentFlag = !$scope.recordPaymentFlag;
                    }
                })
        }

        //force update app toggle
        $scope.updateNotificationEnable = true;
        $scope.forceUpdateEnable = false;
        $scope.forceUpdateToggle = function(type, value){
            if(type == 'updateNotification'){
                $scope.updateNotificationEnable = value;
                if(!value){
                    $scope.forceUpdateEnable = value;
                }
            }
            var body = {};
            body.type = type;
            body.value = value;

            $http.post("/dash/settings/app/update", body)
                .success(function(response){

                    if(response == true){
                        console.log('App update toggle updated');
                        $http.get('/dash/settings/app/update/status')
                            .success(function (response){
                                if(response.length){
                                    $scope.updateNotificationEnable = response[0].updateNotification;
                                    $scope.forceUpdateEnable = response[0].enforceUpdate;
                                }
                            })
                    }
                    else{
                        toastr.error("Error")
                    }
                })
        }


        $scope.deliveryDateStatus = function(boolean){
            var body = {'delivery_date_Enable':boolean};
            $http.post("/dash/settings/delivery/date/update", body)
                .success(function(response){

                    if(response == true){
                        Settings.successPopup('SUCCESS',"Delivery Date Status Updated!");
                        Settings.setInstanceDetails('delivery_date_Enable', $scope.delivery_date_Enable)
                        $http.get("/dash/instanceDetails")
                            .success($scope.renderSettingsData);
                    }
                    else{
                        Settings.failurePopup('ERROR',"Could not Update delivery status!")
                    }
                })
        }
        $scope.customerDiscount = function(boolean){
            console.log("Boolean");
            console.log(boolean);
            var body = {'customerDiscount' : boolean};
            $http.put("/dash/settings/update/percentage/discount", body)
                .success(function(response){


                    if(response){
                        Settings.successPopup('SUCCESS',"Percentage Discount Updated!");
                        Settings.setInstanceDetails('customerDiscount', $scope.customerDiscount)
                        $http.get("/dash/instanceDetails")
                            .success($scope.renderSettingsData);
                    }
                    else{
                        Settings.failurePopup('ERROR',"Could not Update percentage discount!")
                    }
                })
        }


        $scope.orderDeliveryDateSet = function (orderDeliveryDate) {
            if(orderDeliveryDate){
                $scope.orderDeliveryDate = orderDeliveryDate;
                var body = {'orderDeliveryDate': orderDeliveryDate};

                $http.post("/dash/settings/delivery/date/update", body)
                    .success(function(response){
                        if(response == true){
                            Settings.successPopup('SUCCESS',"Delivery Date Status Updated");
                            Settings.setInstanceDetails('deliveryOrderDate', $scope.orderDeliveryDate)
                            $http.get("/dash/instanceDetails")
                                .success($scope.renderSettingsData);
                        }
                        else{
                            Settings.failurePopup('ERROR',"Could not Update!")
                        }
                    })
            }
        }

        $scope.toggleEditDealer = function(role){
            if(role){
                for(var i=0; i< $scope.dealerEditRoles[0].Roles.length; i++){
                    if(role.name == $scope.dealerEditRoles[0].Roles[i].name){
                        $scope.dealerEditRoles[0].Roles[i].enable = role.enable;
                    }
                }
            }

            $http.put("/dash/settings/update/customer/edit/access", $scope.dealerEditRoles)
                .success(function(res){
                    //console.log(res);
                })
        }

        // Edit and update warehouse location.......
        $scope.editWarehouseLocationFromSettings = function(location,index){
            if(location) {
                $http.put("/dash/settings/update/inventory/locations",{location:location,type:'edit',index:index})
                    .success(function(res){
                        if(res){
                            $scope.getWarehouseLocation();
                        }else{
                            console.log('Something Went wrong.....')
                        }
                    }).catch(function(error){
                    console.log(error)
                })
            }else{
                console.log('Please enter the location....')
            }
        }


        // Remove warehouse location from settings collection.....
        $scope.removeWarehouseLocation = function(location){
            $http.put("/dash/settings/update/inventory/locations",{location:location,type:'remove'})
                .success(function(res){
                    if(res){
                        $scope.warehouseLocation.splice($scope.warehouseLocation.indexOf(location), 1);
                    }else{
                        console.log('Something Went wrong.....')
                    }
                }).catch(function(error){
                console.log(error)
            })
        }


        // Adding warehouse location to settings collection.....
        $scope.addWarehouseLocation = function(location){
            // console.log(location)

            if(location.name){
                var duplicate = false;

                var temp = {} ;
                temp.name = location.name.toUpperCase();
                if(location.type)
                    temp.type = location.type ;
                else
                    temp.type = '' ;

                if(location.latitude && location.longitude){
                    temp.latitude = Number(location.latitude) ;
                    temp.longitude = Number(location.longitude) ;
                }



                if($scope.warehouseLocation.length){
                    for(var i=0;i< $scope.warehouseLocation.length;i++){
                        if($scope.warehouseLocation[i].name.toUpperCase() == temp.name.toUpperCase() && $scope.warehouseLocation[i].type == temp.type){
                            duplicate = true;
                        }
                    }
                }

                if(duplicate){
                    Settings.failurePopup('Error',"Location name Already exist");
                }
                else{
                    $http.put("/dash/settings/update/inventory/locations",{location:temp})
                        .success(function(res){
                            if(res) {
                                $scope.warehouseLocation.push(temp);
                                $scope.location.name = '';
                                $scope.location.type = '';
                                $scope.location.latitude = '';
                                $scope.location.longitude = '';

                                Settings.success_toast("Success", "Location Added Successfully");

                            }
                        }).catch(function(error){
                        console.log(error)
                    })
                }


                // console.log(temp)

            }
            else{
                Settings.failurePopup('ERROR',"Please enter text");
            }
        }


        //Function to update ORDER STATUS from SETTINGS PAGE. Only by Admin
        $scope.editOrderStatusFromSettings = function(status, index){
            console.log(status);
            if(status == undefined){
                Settings.failurePopup('ERROR',"Please enter text");
            }
            else{
                var statusObj = [];
                statusObj = $scope.nav[1].status;
                statusObj[index] = status;

                $http.put("/dash/nav/order/status", statusObj)
                    .success(function(res){
                        if(res){
                            Settings.successPopup('SUCCESS',"Order status successfully updated!");
                            $scope.nav[1].status = statusObj;
                            Settings.setNav($scope.nav);
                            $scope.orderEditForStatus[index].status = status;

                            $http.put("/dash/settings/update/order/edit/access", $scope.orderEditForStatus)
                                .success(function(res){
                                    //console.log(res);
                                    $scope.orderEditForStatus = res;
                                    Settings.setInstanceDetails('orderEditForStatus', $scope.orderEditForStatus)
                                })

                        }
                        else{
                            Settings.failurePopup('ERROR',"Could not update order status!");
                        }
                    })
            }
        }


        /*..........
            Remove order status from settings page
         .........*/
        $scope.removeOrderStatus = function(status){
            var index = $scope.nav[1].status.indexOf(status);

            if(index != -1 && ($scope.nav[1].status.length > 1)){
                $scope.nav[1].status.splice(index, 1);

                $scope.orderEditForStatus.splice(index, 1);

                $http.put("/dash/nav/order/status", $scope.nav[1].status)
                    .success(function(res){
                        console.log(res);

                        $http.put("/dash/settings/update/order/edit/access", $scope.orderEditForStatus)
                            .success(function(res){
                                //console.log(res);
                                $scope.orderEditForStatus = res;
                                Settings.setInstanceDetails('orderEditForStatus', $scope.orderEditForStatus)
                            })

                    })
            }
            else{
                Settings.failurePopup('ERROR',"A minimum of one status has to be present!");
            }
        }


        $scope.reorderOrderStatus = function(dir, value){
            if(dir == 'up'){
                var temp = $scope.nav[1].status[value];
                $scope.nav[1].status[value] = $scope.nav[1].status[value - 1];
                $scope.nav[1].status[value - 1] = temp;

                var temp1 = $scope.orderEditForStatus[value];
                $scope.orderEditForStatus[value] = $scope.orderEditForStatus[value - 1];
                $scope.orderEditForStatus[value - 1] = temp1;

                $http.put("/dash/nav/order/status", $scope.nav[1].status)
                    .success(function(res){
                        //console.log(res);

                        $http.put("/dash/settings/update/order/edit/access", $scope.orderEditForStatus)
                            .success(function(res){
                                //console.log(res);
                                $scope.orderEditForStatus = res;
                                Settings.setInstanceDetails('orderEditForStatus', $scope.orderEditForStatus)
                            })
                    })

            }
            else if(dir == 'down'){
                var temp = $scope.nav[1].status[value];
                $scope.nav[1].status[value] = $scope.nav[1].status[value + 1];
                $scope.nav[1].status[value + 1] = temp;

                var temp1 = $scope.orderEditForStatus[value];
                $scope.orderEditForStatus[value] = $scope.orderEditForStatus[value + 1];
                $scope.orderEditForStatus[value + 1] = temp1;

                $http.put("/dash/nav/order/status", $scope.nav[1].status)
                    .success(function(res){
                        //console.log(res);

                        $http.put("/dash/settings/update/order/edit/access", $scope.orderEditForStatus)
                            .success(function(res){
                                //console.log(res);
                                $scope.orderEditForStatus = res;
                                Settings.setInstanceDetails('orderEditForStatus', $scope.orderEditForStatus)
                            })
                    })
            }
        }


        $scope.addOrderStatus = function(status){

            if(status != '' && status != undefined){
                $scope.nav[1].status[$scope.nav[1].status.length] = status;

                $scope.orderEditForStatus[$scope.orderEditForStatus.length] = {'status' : status, 'editable' : false};

                $http.put("/dash/nav/order/status", $scope.nav[1].status)
                    .success(function(res){

                        $http.put("/dash/settings/update/order/edit/access", $scope.orderEditForStatus)
                            .success(function(res){
                                //console.log(res);
                                $scope.orderEditForStatus = res;
                                Settings.setInstanceDetails('orderEditForStatus', $scope.orderEditForStatus)
                            })
                    })
            }
            else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }
        }


        $scope.toggleEditOrderStatus = function(status){
            console.log(status)
            for(var i=0; i< $scope.orderEditForStatus.length; i++){
                if(status.status == $scope.orderEditForStatus[i].status){
                    $scope.orderEditForStatus[i].editable = status.editable;
                }
            }
            $http.put("/dash/settings/update/order/edit/access", $scope.orderEditForStatus)
                .success(function(res){
                    //console.log(res);
                    $scope.orderEditForStatus = res;
                    Settings.setInstanceDetails('orderEditForStatus', $scope.orderEditForStatus)
                })
        }


        /*..........
         Remove  payment status from settings page
         .........*/
        $scope.removePaymentOrderStatus = function(status){
            var index = $scope.nav[1].paymentstatus.indexOf(status);

            if(index != -1 && ($scope.nav[1].paymentstatus.length > 1)){
                $scope.nav[1].paymentstatus.splice(index, 1);

                $http.put("/dash/nav/order/payment/status", $scope.nav[1].paymentstatus)
                    .success(function(res){
                        if(res){
                            Settings.successPopup('SUCCESS',"Status updated Successfully");
                            console.log("-------Status updated successfully")
                        }else{
                            Settings.failurePopup('ERROR',"Could not update! Try again Later");
                        }

                    })
            }
            else{
                Settings.failurePopup('ERROR',"A minimum of one status has to be present!");
            }
        };


        $scope.editPaymentOrderStatusFromSettings = function(status, index){
            if(!status){
                Settings.failurePopup('ERROR',"Please enter text!");
            }
            else{
                var statusObj = [];
                statusObj = $scope.nav[1].paymentstatus;
                statusObj[index] = status;

                $http.put("/dash/nav/order/payment/status", statusObj)
                    .success(function(res){
                        if(res){
                            Settings.successPopup('SUCCESS',"Order status successfully updated!!");
                        }
                        else{
                            Settings.failurePopup('ERROR','Error while updating order status');
                        }
                    })
            }
        }


        $scope.addPaymentOrderStatus = function(status){

            if(status != '' && status != undefined){
                $scope.nav[1].paymentstatus[$scope.nav[1].paymentstatus.length] = $scope.nav[1].paymentstatus[$scope.nav[1].paymentstatus.length-1] ;
                $scope.nav[1].paymentstatus[$scope.nav[1].paymentstatus.length-2] = status ;

                $http.put("/dash/nav/order/payment/status", $scope.nav[1].paymentstatus)
                    .success(function(res){
                        if(res){
                            $scope.newPayment.orderStatus = '' ;
                            Settings.successPopup('SUCCESS',"Status Added Successfully");
                        }
                        else{
                            Settings.failurePopup('ERROR',"Could not update! Try again Later");
                        }
                    })
            }
            else{
                Settings.failurePopup('ERROR',"Please enter text");
            }
        }

        /* google map API setup started */

        $scope.addgMapAPI = function(gMapKey){

            $scope.gMapAPI = {
                api_key : gMapKey

            }
          //  console.log("gmapkey", $scope.gMapAPI);
            if(gMapKey != '' && gMapKey != undefined){
                   // var temp = $scope.gMapAPI;
                    $http.post("/dash/settings/google/maps", $scope.gMapAPI)
                        .success(function(res){
                           // $scope.newGmapAPI.gMapKey = '';
                            Settings.success_toast('SUCCESS',"gMapAPI successfully added!");
                            Settings.setInstanceDetails('gMapAPI', $scope.gMapAPI)
                        })


            }
            else{
                Settings.failurePopup('ERROR',"Please enter CORRECT API KEY!");
            }
        }

        $scope.editGmap = function(){
            $scope.newEditGMapAPI = $scope.gMapAPI;
        }

        //Function to update GMAP API KEY from SETTINGS PAGE. Only by Admin
        $scope.editGMAPAPIFromSettings = function(gMapKey, index,type){

            if(gMapKey == undefined){
                Settings.failurePopup('ERROR',"Please enter API Key");
            }
            else{
                $scope.gMapAPI = {
                    api_key : gMapKey

                }

                    $http.post("/dash/settings/google/maps", $scope.gMapAPI)
                        .success(function(res){
                            if(res){
                                Settings.success_toast('SUCCESS',"API Key  successfully updated!");

                                $scope.newEditGMapAPI = $scope.gMapAPI.api_key;
                                Settings.setInstanceDetails('gMapAPI', $scope.gMapAPI.api_key)
                            }
                            else{
                                Settings.failurePopup('ERROR',"Could not update API Key!");
                            }
                        })

            }
        }


        /* google map API setup ended  */



        /*..........
         lead status setup
         .........*/


        $scope.addLeadStatus = function(status){

            if(status != '' && status != undefined){
                if($scope.leadStatus.length){
                    if($scope.leadStatus.indexOf(status.toLowerCase()) == -1){
                        leadFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"Status name already exist");
                    }
                }
                else{
                    leadFunc ();
                }

                function leadFunc (){
                    var temp = $scope.leadStatus;
                    temp.push(status.toLowerCase())

                    $http.post("/dash/settings/leadstatus", temp)
                        .success(function(res){
                            $scope.leadStatus = temp;
                            $scope.newLead.status = '';
                            Settings.success_toast('SUCCESS',"Lead status successfully added!");
                            Settings.setInstanceDetails('leadStatus', $scope.leadStatus)
                        })

                }

            }
            else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }
        }

        //Function to update lead STATUS from SETTINGS PAGE. Only by Admin
        $scope.editLeadStatusFromSettings = function(status, index,type){

            if(status == undefined){
                Settings.failurePopup('ERROR',"Please enter text");
            }
            else{
                if($scope.leadStatus.length){
                    if($scope.leadStatus.indexOf(status.toLowerCase()) == -1){
                        editLeadFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"Status name already exist");
                    }
                }

                function editLeadFunc(){
                    var statusObj = [];
                    statusObj = $scope.leadStatus;
                    statusObj[index] = status.toLowerCase();

                    $http.post("/dash/settings/leadstatus", statusObj)
                        .success(function(res){
                            if(res){
                                Settings.success_toast('SUCCESS',"Lead status successfully updated!");

                                $scope.leadStatus[index] = status.toLowerCase();
                                Settings.setInstanceDetails('leadStatus', $scope.leadStatus)
                            }
                            else{
                                Settings.failurePopup('ERROR',"Could not update lead status!");
                            }
                        })

                }



            }
        }

        /*..........
         Remove  lead status from settings page
         .........*/
        $scope.removeleadStatus = function(index){
            // console.log(index)
            var obj = $scope.leadStatus;
            obj.splice(index,1)
            $http.post("/dash/settings/leadstatus", obj)
                .success(function(res){
                    if(res){
                        Settings.success_toast('SUCCESS',"Lead status successfully updated!");
                        $scope.leadStatus = obj;
                        Settings.setInstanceDetails('leadStatus', $scope.leadStatus)
                    }
                    else{
                        Settings.failurePopup('ERROR',"Could not update lead status!");
                    }
                })
        };

        
        // Add MPG to settings
        $scope.addMPG = function(source){

            if(source != '' && source != undefined){
                if($scope.mpg.length){
                    if($scope.mpg.indexOf(source.toLowerCase()) == -1){
                        mpgSourceFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"MPG name already exist");
                    }
                }
                else{
                    mpgSourceFunc ();
                }

                function mpgSourceFunc (){
                    var temp = $scope.mpg;
                    temp.push(source)

                    $http.post("/dash/settings/mpg", temp)
                        .success(function(res){
                            $scope.mpg = temp;
                            $scope.newmpg.mpgValue = '';
                            Settings.success_toast('SUCCESS',"MPG successfully added!");
                            Settings.setInstanceDetails('mpg', $scope.mpg)
                        })

                }

            }
            else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }
        }
        // Add OrderType to settings
        $scope.addOrderType = function(source){

            if(source != '' && source != undefined){
                if($scope.orderType.length){
                    if($scope.orderType.indexOf(source) == -1){
                        orderTypeFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"Order Type already exist");
                    }
                }
                else{
                    orderTypeFunc ();
                }

                function orderTypeFunc (){
                    var temp = $scope.orderType;
                    temp.push(source)

                    $http.post("/dash/settings/orderType", temp)
                        .success(function(res){
                            $scope.orderType = temp;
                            $scope.neworderType.orderType = '';
                            Settings.success_toast('SUCCESS',"OrderType successfully added!");
                            Settings.setInstanceDetails('orderType', $scope.orderType)
                        })

                }

            }
            else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }
        }
                // Add UOM to settings
                $scope.addUOM = function(source){

                    if(source != '' && source != undefined){
                        if($scope.salesUOM.length){
                            if($scope.salesUOM.indexOf(source.toLowerCase()) == -1){
                                salesUOMFunc ();
                            }
                            else{
                                Settings.failurePopup('ERROR',"Sales UOM already exist");
                            }
                        }
                        else{
                            salesUOMFunc ();
                        }

                        function salesUOMFunc (){
                            var temp = $scope.salesUOM;
                            temp.push(source.toLowerCase())

                            $http.post("/dash/settings/salesUOM", temp)
                                .success(function(res){
                                    $scope.salesUOM = temp;
                                    $scope.newUOM.UOM = '';
                                    Settings.success_toast('SUCCESS',"Sales UOM successfully added!");
                                    Settings.setInstanceDetails('salesUOM', $scope.salesUOM)
                                })

                        }

                    }
                    else{
                        Settings.failurePopup('ERROR',"Please enter text!");
                    }
                }

        //Add lead source to settings
        $scope.addLeadSource = function(source){

            if(source != '' && source != undefined){
                if($scope.leadSource.length){
                    if($scope.leadSource.indexOf(source.toLowerCase()) == -1){
                        leadSourceFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"Source name already exist");
                    }
                }
                else{
                    leadSourceFunc ();
                }

                function leadSourceFunc (){
                    var temp = $scope.leadSource;
                    temp.push(source.toLowerCase())

                    $http.post("/dash/settings/leadsource", temp)
                        .success(function(res){
                            $scope.leadSource = temp;
                            $scope.newLead.source = '';
                            Settings.success_toast('SUCCESS',"Lead source successfully added!");
                            Settings.setInstanceDetails('leadSource', $scope.leadSource)
                        })

                }

            }
            else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }
        }
        /*..........
         Remove  lead source from settings page
         .........*/
        $scope.removeleadSource = function(index){
            // console.log(index)
            var obj = $scope.leadSource;
            obj.splice(index,1);
            $http.post("/dash/settings/leadsource", obj)
                .success(function(res){
                    if(res){
                        Settings.success_toast('SUCCESS',"Lead source successfully updated!");
                        $scope.leadSource = obj;
                        Settings.setInstanceDetails('leadSource', $scope.leadSource)
                    }
                    else{
                        Settings.failurePopup('ERROR',"Could not update lead source!");
                    }
                })
        };
        /*..........
        Remove  MPG from settings page
        .........*/
        $scope.removeMPG = function(index){
            // console.log(index)
            var obj = $scope.mpg;
            obj.splice(index,1);
            $http.post("/dash/settings/mpg", obj)
                .success(function(res){
                    if(res){
                        Settings.success_toast('SUCCESS',"MPG successfully updated!");
                        $scope.mpg = obj;
                        Settings.setInstanceDetails('mpg', $scope.mpg)
                    }
                    else{
                        Settings.failurePopup('ERROR',"Could not update MPG!");
                    }
                })
        };
                /*..........
        Remove  salesUOM from settings page
        .........*/
                $scope.removeSalesUOM = function(index){
                    // console.log(index)
                    var obj = $scope.salesUOM;
                    obj.splice(index,1);
                    $http.post("/dash/settings/salesUOM", obj)
                        .success(function(res){
                            if(res){
                                Settings.success_toast('SUCCESS',"sales UOM successfully updated!");
                                $scope.orderType = obj;
                                Settings.setInstanceDetails('salesUOM', $scope.salesUOM)
                            }
                            else{
                                Settings.failurePopup('ERROR',"Could not update sales UOM!");
                            }
                        })
                };
        /*..........
Remove  orderType from settings page
.........*/
        $scope.removeorderType = function(index){
            // console.log(index)
            var obj = $scope.orderType;
            obj.splice(index,1);
            $http.post("/dash/settings/orderType", obj)
                .success(function(res){
                    if(res){
                        Settings.success_toast('SUCCESS',"OrderType successfully updated!");
                        $scope.orderType = obj;
                        Settings.setInstanceDetails('orderType', $scope.orderType)
                    }
                    else{
                        Settings.failurePopup('ERROR',"Could not update OrderType!");
                    }
                })
        };
                //Function to update sales UOM from SETTINGS PAGE. Only by Admin
                $scope.editSalesUOMFromSettings = function(source, index,type){

                    if(source == undefined){
                        Settings.failurePopup('ERROR',"Please enter text");
                    }
                    else{
                        if($scope.salesUOM.length){
                            if($scope.salesUOM.indexOf(source.toLowerCase()) == -1){
                                editSalesUomFunc ();
                            }
                            else{
                                Settings.failurePopup('ERROR',"sales UOM already exist");
                            }
                        }

                        function editSalesUomFunc(){
                            var sourceObj = [];
                            sourceObj = $scope.salesUOM;
                            sourceObj[index] = source.toLowerCase();

                            $http.post("/dash/settings/salesUOM", sourceObj)
                                .success(function(res){
                                    if(res){
                                        Settings.success_toast('SUCCESS',"salesUOM successfully updated!");

                                        $scope.orderType[index] = source.toLowerCase();
                                        Settings.setInstanceDetails('salesUOM', $scope.salesUOM)
                                    }
                                    else{
                                        Settings.failurePopup('ERROR',"Could not update salesUOM!");
                                    }
                                })

                        }



                    }
                }
        //Function to update OrderType from SETTINGS PAGE. Only by Admin
        $scope.editOrderTypeFromSettings = function(source, index,type){

            if(source == undefined){
                Settings.failurePopup('ERROR',"Please enter text");
            }
            else{
                if($scope.orderType.length){
                    if($scope.orderType.indexOf(source.toLowerCase()) == -1){
                        editOrderTypeFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"OrderType already exist");
                    }
                }

                function editOrderTypeFunc(){
                    var sourceObj = [];
                    sourceObj = $scope.orderType;
                    sourceObj[index] = source.toLowerCase();

                    $http.post("/dash/settings/orderType", sourceObj)
                        .success(function(res){
                            if(res){
                                Settings.success_toast('SUCCESS',"orderType successfully updated!");

                                $scope.orderType[index] = source.toLowerCase();
                                Settings.setInstanceDetails('orderType', $scope.orderType)
                            }
                            else{
                                Settings.failurePopup('ERROR',"Could not update orderType!");
                            }
                        })

                }



            }
        }
        //Function to update MPG from SETTINGS PAGE. Only by Admin
        $scope.editMPGFromSettings = function(source, index,type){

            if(source == undefined){
                Settings.failurePopup('ERROR',"Please enter text");
            }
            else{
                if($scope.mpg.length){
                    if($scope.mpg.indexOf(source.toLowerCase()) == -1){
                        editMPGFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"Source name already exist");
                    }
                }

                function editMPGFunc(){
                    var sourceObj = [];
                    sourceObj = $scope.mpg;
                    sourceObj[index] = source.toLowerCase();

                    $http.post("/dash/settings/mpg", sourceObj)
                        .success(function(res){
                            if(res){
                                Settings.success_toast('SUCCESS',"MPG successfully updated!");

                                $scope.mpg[index] = source.toLowerCase();
                                Settings.setInstanceDetails('mpg', $scope.mpg)
                            }
                            else{
                                Settings.failurePopup('ERROR',"Could not update MPG!");
                            }
                        })

                }



            }
        }
        //Function to update lead SOURCE from SETTINGS PAGE. Only by Admin
        $scope.editLeadSourceFromSettings = function(source, index,type){

            if(source == undefined){
                Settings.failurePopup('ERROR',"Please enter text");
            }
            else{
                if($scope.leadSource.length){
                    if($scope.leadSource.indexOf(source.toLowerCase()) == -1){
                        editLeadSourceFunc ();
                    }
                    else{
                        Settings.failurePopup('ERROR',"Source name already exist");
                    }
                }

                function editLeadSourceFunc(){
                    var sourceObj = [];
                    sourceObj = $scope.leadSource;
                    sourceObj[index] = source.toLowerCase();

                    $http.post("/dash/settings/leadsource", sourceObj)
                        .success(function(res){
                            if(res){
                                Settings.success_toast('SUCCESS',"Lead source successfully updated!");

                                $scope.leadSource[index] = source.toLowerCase();
                                Settings.setInstanceDetails('leadSource', $scope.leadSource)
                            }
                            else{
                                Settings.failurePopup('ERROR',"Could not update lead source!");
                            }
                        })

                }



            }
        }

        /*..........
         Remove user roles from settings page
         .........*/
        $scope.removeUserRoles = function(roles){
            var index = $scope.nav[4].roles.map(function(o) { return o.name; }).indexOf(roles);
            console.log(index);
            if(index != -1 && ($scope.nav[4].roles.length > 1)){
                console.log(index);
                $scope.nav[4].roles.splice(index, 1);
                console.log($scope.nav[4].roles)
                $scope.allRoles.splice(index,1);
                $http.put("/dash/nav/roles/update", $scope.nav[4].roles)
                    .success(function(res){
                        //  console.log(res);
                        $http.put("/dash/settings/update/roles", $scope.nav[4].roles)
                            .success(function(res){
                                //console.log(res);
                                $scope.userRole = res;
                                Settings.setInstanceDetails('userRole', $scope.userRole)
                            })
                    })
            }
            else{
                Settings.failurePopup('ERROR',"A minimum of one role has to be present!");
            }


        }


        /*..........
         customize name settings page
         .........*/

        $scope.addCustomName = function(customName){
            if(customName != '' && customName != undefined){
                $scope.customNames[$scope.customNames.length] = {
                    name : customName,
                    displayName : customName
                };

                console.log('$scope.customNames',$scope.customNames)
                $http.put("/dash/settings/update/custom/name",  $scope.customNames)
                    .success(function(res){
                        // console.log(res);
                        $scope.customNames = res;
                        $scope.newCustomizeName = '';
                        Settings.setInstanceDetails('customizeName', $scope.customNames)
                    })
            }
            else{
                Settings.failurePopup('ERROR',"Please enter text!");
            }
        }

        $scope.removeCustomName = function(name){
            var index = $scope.customNames.map(function(o) { return o.name; }).indexOf(name);
            if(index != -1 && ($scope.customNames.length > 1)){
                // console.log(index);
                $scope.customNames.splice(index, 1);

                $http.put("/dash/settings/update/custom/name", $scope.customNames)
                    .success(function(res){
                        //console.log(res);
                        $scope.customNames = res;
                        Settings.setInstanceDetails('customName', $scope.customNames)
                    })
            }
            else{
                Settings.failurePopup('ERROR',"A default custom name has to be present!");
            }
        }

        $scope.addUserRoles = function(roles){
            if(roles != '' && roles != undefined){
                $scope.nav[4].roles[$scope.nav[4].roles.length] = {
                    name : roles,
                    role : roles,
                    status : true
                };

                $scope.allRoles[$scope.nav[4].roles.length-1] = {
                    role : roles
                };


                $http.put("/dash/nav/roles/update", $scope.nav[4].roles)
                    .success(function(res){

                        $http.put("/dash/settings/update/roles",  $scope.nav[4].roles)
                            .success(function(res){
                                console.log(res);
                                $scope.userRole = res;
                                $scope.newUserRole = '';
                                Settings.setInstanceDetails('userRole', $scope.userRole)

                            })
                    })
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
                        console.log(temp)


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


        //------------------------------------------------------------------------------//

        //**** BUSY INTEGRATION ****//

        //------------------------------------------------------------------------------//

        $scope.busy = {};

        $scope.addBusyDetails = function(company){

            $http.post("/dash/busy/creds/update",$scope.busy)
                .success(function(response){
                    console.log(response);
                    Settings.successPopup('SUCCESS',"busy credentials has been set");
                })
                .error(function (error){
                    Settings.failurePopup('ERROR',"Could not update! Try again Later");
                })
        }


        /*
         EXPENSE TYPE Turn ON/OFF a notification
         */

        $scope.expense = {};
        $scope.newExpense = {};
        $scope.newExpense.name = '';
        $scope.addExpenseType = function(newExpense){
            if(newExpense) {
                var body = {};
                body.expensetype = newExpense;

                $http.post('/dash/expense/update/category', body).success(function (res) {
                    if(res){
                        $scope.newExpense.name = '';
                        if($scope.expense_type){
                            if($scope.expense_Type.category.length) {
                                $scope.selectExpenses($scope.expense_Type.category[0].name);
                            }
                        }
                        $scope.getExpense();
                    }else{
                        Settings.failurePopup('ERROR',"Failed to Add Expense");
                    }
                });
            } else{
                Settings.failurePopup('ERROR',"Please enter text");
            }

        }


        var selectBackgroundColor = 0;
        $scope.selectBackgroundColor = function(dataIndex){
            document.getElementById("selectBackground"+dataIndex).style.background = '#dedbdbd4';
            if(selectBackgroundColor>=0){
                document.getElementById("selectBackground"+selectBackgroundColor).style.background = '';
            }
            selectBackgroundColor = dataIndex;
        }


        $scope.selectExpense = '';
        $scope.selectExpenses = function (expense){
            $scope.selectExpense = expense;
            $scope.selectSubExpense = false;

            if($scope.expense_Type.category.length){
                for(var i = 0; i < $scope.expense_Type.category.length;i++){
                    if($scope.expense_Type.category[i].name == expense){
                        $scope.subExpenseShow = $scope.expense_Type.category[i].subexpense;
                    }
                }
            }
        }


        $scope.expenseEditName = '';
        $scope.editExpenseType = function(type, expensetype, expenseIndex, expneseInputs) {
            var body = {};
            body.editExpense = expensetype;
            body.expenseIndex = expenseIndex;
            body.expenseInputs = expneseInputs;
            body.editType = type;

            if (type == "edit") {
                $http.put('/dash/expense/edit/update/category', body)
                    .success(function (result) {
                        console.log('Put API Results ' + result);
                        if (type == 'edit') {
                            selectBackgroundColor--;
                        }
                        $scope.getExpense();
                    })
            } else {
                Settings.confirmPopup("CONFIRM", "Are you sure you want to Delete Category?", function (res) {
                    if (res) {
                        $http.put('/dash/expense/edit/update/category', body)
                            .success(function (result) {
                                console.log('Put API Results ' + result);
                                if (type == 'remove') {
                                    selectBackgroundColor--;
                                }
                                $scope.getExpense();
                                if ($scope.expense_Type && $scope.expense_Type.category.length)
                                    $scope.selectExpenses($scope.expense_Type.category[0].name);
                            })
                    }
                })
            }
        }


        $scope.reorderExpenseCategory = function(dir, value){
            if(dir == 'up'){
                var temp = $scope.expense_Type.category[value];
                $scope.expense_Type.category[value] = $scope.expense_Type.category[value - 1];
                $scope.expense_Type.category[value - 1] = temp;

                $http.put("/dash/expense/reorder/category", $scope.expense_Type.category)
                    .success(function(res){
                    })
            }
            else if(dir == 'down'){
                var temp = $scope.expense_Type.category[value];
                $scope.expense_Type.category[value] = $scope.expense_Type.category[value + 1];
                $scope.expense_Type.category[value + 1] = temp;
                $http.put("/dash/expense/reorder/category", $scope.expense_Type.category)
                    .success(function(res){
                        console.log(res);
                    })
            }
        }


        $scope.subExpenseType = {};
        $scope.addSubExpenseType = function(expense, subExpense, inputs) {
            if (expense && subExpense && inputs) {
                if (inputs) {
                    var body = {};
                    body.expensetype = expense;
                    body.subExpense = subExpense;
                    body.subExpenseInput = inputs;
                    $http.post('/dash/expense/update/category', body).success(function (res) {
                        $scope.getExpense(expense);
                    });
                } else {
                    Settings.failurePopup('ERROR',"Please enter text");
                }
            } else if (expense && subExpense) {
                if (subExpense) {
                    var body = {};
                    body.expensetype = expense;
                    body.subExpense = subExpense;
                    $http.post('/dash/expense/update/category', body).success(function (res) {
                        $scope.subExpenseType.subName = '';
                        $scope.getExpense(expense);
                    });
                } else {
                    Settings.failurePopup('ERROR',"Please enter text");
                }
            }
        }


        $scope.subExpenseEditSubName = '';
        $scope.editSubExpenseType = function(type, expense, subExpIndex, subName){
            var body = {};
            body.type = type;
            body.expense = expense;
            body.subExpIndex = subExpIndex;
            body.subName = subName;
            $http.put('/dash/expense/edit/update/sub-category', body)
                .success(function (result) {
                    console.log('Put API Results ' + result);
                    $scope.subCatExpenseShow = [];
                    $scope.getExpense(expense);
                })
        }


        //Function to update User roles from SETTINGS PAGE. Only by Admin
        $scope.editUserRolesFromSettings = function(roles, index){
            if(roles == undefined){
                Settings.failurePopup('ERROR',"Please enter text");
            }
            else{
                var rolesObj = [];
                rolesObj = $scope.nav[4].roles;
                rolesObj[index] = {
                    name : roles,
                    role : $scope.nav[4].roles[index].role,
                    status : true

                };

                $http.put("/dash/nav/roles/update", rolesObj)
                    .success(function(res){
                        if(res){
                            Settings.successPopup('SUCCESS',"User Roles successfully updated!");

                            $scope.allRoles[index] = {
                                name: roles,
                                role : $scope.allRoles[index].role
                            };

                            $http.put("/dash/settings/update/roles", rolesObj)
                                .success(function(res){
                                    //console.log(res);
                                    $scope.userRole = res;
                                    Settings.setInstanceDetails('userRole', $scope.userRole)
                                })

                        }
                        else{
                            Settings.failurePopup('ERROR',"Error while updating user roles");
                        }
                    })
            }
        };

        //Function to update custom name from SETTINGS PAGE. Only by Admin
        $scope.editCustomNameFromSettings = function(name, displayName,  index){
            if(displayName == undefined || displayName == ''){
                Settings.failurePopup('ERROR',"Please enter text");
            }
            else{

                if($scope.customNames.length && $scope.customNames[index].name == name){
                    $scope.customNames[index] = {
                        name: name,
                        displayName : displayName
                    };

                    $http.put("/dash/settings/update/custom/name", $scope.customNames)
                        .success(function(res){
                            //console.log(res);
                            $scope.customNames = res;
                            Settings.successPopup('SUCCESS',"Updated Successfully");
                            Settings.setInstanceDetails('customNames', $scope.customNames)
                        })
                }else{
                    Settings.failurePopup('ERROR',"Failed to update");
                }
            }
        };

        //............ TAX SETUP ...................


        $scope.toggleTaxSetup = enable => {
            $http.put("/dash/settings/tax/enable", {"activate" : enable})
                .then(response => {
                    console.log(response.data);
                    if(response.data && response.data == "success"){
                        $scope.taxSetup = flag
                        Settings.setInstanceDetails('taxSetup', enable);
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


        $scope.toggleTaxExclusive = function(exclusive){
            $http.put("/dash/settings/catalog/prices/tax/exclusive", {activate : exclusive})
                .then(response => {
                    if(response.data && response.data.status == "success"){
                        $scope.taxExclusive = exclusive;
                        Settings.success_toast("Success", "Tax Exclusive - " + (exclusive ? "Yes" : "No"))
                        Settings.setInstanceDetails('taxExclusive', exclusive);
                    }
                })
        }


        /*.........
         Save new tax obj
         .......*/
        $scope.newTax = {};
        $scope.saveNewTax = function(tax){
            if(tax){
                if(tax.name){
                var message ='CGST : '+(tax.cgst ?  tax.cgst+' %' : '0 %')+' || SGST : '+(tax.sgst ?  tax.sgst+' %' : '0 %')+' || IGST : '+(tax.igst ?  tax.igst+' %' : '0 %');

                        Settings.confirmPopup("Are you sure?",message,function (res) {
                        if(res){
                                var date = new Date();
                                tax.cgst = tax.cgst ? tax.cgst : 0;
                                tax.sgst = tax.sgst ? tax.sgst : 0;
                                tax.igst = tax.igst ? tax.igst : 0;
                                tax.username = $scope.user.username ? $scope.user.username : 'PORTAL ADMIN';
                                tax.seller = $scope.user.sellerphone ? $scope.user.sellerphone : '';
                                tax.date_added = [date.getFullYear(),(date.getMonth()+1).padLeft(), date.getDate().padLeft() ].join('-') + ' '
                                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join (':');

                                $http.post("/dash/tax/addNew", tax)
                                    .success(function(response){
                                        //console.log(response);
                                        if(response){
                                            if(response.status){
                                                $scope.newTax = {};
                                                $scope.tax.push(response.tax);
                                                Settings.setInstanceDetails('tax', $scope.tax)
                                            }
                                            else{
                                                Settings.failurePopup('ERROR','Failed to save tax. Please try after sometime')
                                            }
                                        }
                                    })
                            }
                    })
                }
                else{
                    Settings.failurePopup('ERROR','Please enter a tax name!');
                }
            }
            else{
                Settings.failurePopup('ERROR','You have not entered anything!');
            }

        }


        /*.....
         Set a tax to be default
         ..... */
        $scope.setDefaultTax = function(tax, type){
            if(!type){
                var localTax = $scope.tax;
                $scope.tax = [];
                var flag = true;

                for(var i=0; i< localTax.length ; i++){
                    localTax[i].default = false;
                    if(localTax[i].name == tax.name && flag){
                        localTax[i].default = true;
                    }
                }

                $http.put("/dash/tax/updateTax/default", localTax)
                    .success(function(res){
                        if(res){
                            $scope.tax = localTax;
                            defaultTaxObj = tax;
                            Settings.setInstanceDetails('tax', $scope.tax)
                        }
                        else{
                            Settings.failurePopup('ERROR','Failed to set default tax. Please try after sometime')
                        }
                    })
            }else if(type){
                var localTax = $scope.otherTax;
                $scope.OtherTax = [];
                var flag = true;

                for(var i=0; i< localTax.length ; i++){
                    localTax[i].default = false;
                    if(localTax[i].taxSetupName == tax.taxSetupName && flag){
                        localTax[i].default = true;
                        $scope.otherTaxDefault = localTax[i];
                    }
                }

                $http.put("/dash/tax/updateTax/otherTax", localTax)
                    .success(function(res){
                        if(res){
                            $scope.OtherTax = localTax;
                            defaultTaxObj = tax;
                        }
                        else{
                            Settings.failurePopup('ERROR','Failed to set default tax. Please try after sometime')
                        }
                    })
            }
        }


        <!-- .......... NOTIFICATION SETUP ............ -->


        $scope.ClearEmail = function () {
            $scope.email.company_name = '';
            $scope.email.from = '';
            // $scope.email.subject='';
            $scope.email.cc = '';
            $scope.email.contact_number = '';
            $scope.email.support_email = '';
            $scope.email.company_logo_url = '';
            $scope.email.company_website_url = '';
            $scope.email.company_description = '';
        }


        $scope.setEmail = function () {
            console.log($scope.email)
            Settings.confirmPopup("Confirm", "Save Email",function (result) {
                if (result) {
                    $http.put("/dash/email", {email: $scope.email})
                        .success(function (response) {
                            //console.log(response)
                            if (!response) {
                                Settings.popupAlert("Something went wrong");
                                $scope.email = '';
                            } else {
                                Settings.setInstanceDetails('email', $scope.email)
                                Settings.successPopup('SUCCESS','Updated Successfully!');
                                //console.log("Updated Company Logo URL --> "+response);
                            }

                        })
                }
                else {
                    //console.log("company logo URL not updated")
                }
            });
        }


        /*
         Turn ON/OFF a notification
         */
        $scope.toggleNotification = function(user, platform, type, flag){
            $scope.notificationConfig[user][platform == 'email' ? 0 : 1]['status'][type] = flag;

            $http.put("/dash/settings/update/push/notification", $scope.notificationConfig)
                .then(response => {
                    if(response.data && response.data.status == "success"){
                        Settings.success_toast("Success", "Push Notification Setup Updated!");
                    }
                    else if(!response.data || response.data.status == "error"){
                        $scope.notificationConfig[user][platform == 'email' ? 0 : 1]['status'][type] = !flag;
                        Settings.fail_toast("Error", "Error updating Push Notification Setup");
                    }
                })
        };


        $scope.toggleSendSms = function(type, flag){

            $scope.sendSms[type] = flag;

            $http.put("/dash/settings/update/sms/notification", $scope.sendSms)
                .then(response => {
                    if(response.data && response.data.status == "success"){
                        Settings.success_toast("Success", "SMS Notification Setup Updated!");
                    }
                    else if(!response.data || response.data.status == "error"){
                        $scope.sendSms[type] = !flag;
                        Settings.fail_toast("Error", "Error updating SMS Notification Setup");
                    }
                })
        }


        <!-- .......... PAYMENT SETUP ............ -->


        $scope.togglePaymentModeSelect = function (data){
            // console.log(data)
            if(data){
                if(data.name == 'Razorpay' && data.active && !data.id && !data.key){
                    Settings.info_toast("Enter Credentials to activate!");
                }
                else{
                    for(var i=0; i< $scope.paymentModes.length; i++){
                        if(data.name == $scope.paymentModes[i].name){
                            $scope.paymentModes[i] = data;
                            // console.log($scope.paymentModes);

                            $http.put("/dash/settings/update/payment/mode", $scope.paymentModes)
                                .success(function(res){
                                    $scope.paymentModes = res
                                    Settings.successPopup('SUCCESS','Payment Settings Saved!');
                                })
                        }
                    }
                }
            }
        }


        <!-- .......... EDIT SETUP ............ -->


        $scope.toggleEditOrderDealer = function(user, action, type, flag){
            if(type == 'shipment'){
                $scope.editByRoles[user][action == 'edit' ? 0 : 1]['status'][type] = flag;
                // console.log("$scope.editByRoles[user][action == 'edit' ? 0 : 1]['status'][type]",$scope.editByRoles[user][action == 'edit' ? 0 : 1]['status'][type])
                $http.put("/dash/settings/admin/update/role/access", $scope.editByRoles)
                    .success(function(res){
                        console.log(res);
                        Settings.setInstanceDetails('editByRoles', $scope.editByRoles);
                        if(!res)
                            $scope.editByRoles[user][action == 'shipment' ? 0 : 1][0][type] = !flag;
                    })
            }else{
                $scope.editByRoles[user][action == 'edit' ? 0 : 1]['status'][type] = flag;
                // console.log("$scope.editByRoles[user][action == 'edit' ? 0 : 1]['status'][type]",$scope.editByRoles[user][action == 'edit' ? 0 : 1]['status'][type])
                $http.put("/dash/settings/admin/update/role/access", $scope.editByRoles)
                    .success(function(res){
                        console.log(res);
                        Settings.setInstanceDetails('editByRoles', $scope.editByRoles);
                        if(!res)
                            $scope.editByRoles[user][action == 'edit' ? 0 : 1][0]['status'][type] = !flag;
                    })
            }
        }



        /*
    Enable SuperJIni for store
     */

        //.... Enable/disable to superjini...
        $scope.superJiniStore = function (enable) {
            console.log("Super Jini store enable function");
            if(enable == true){
                var store_id = parseInt(Math.random() + new Date().getTime());
            }
            else{
                store_id = '';
                var storeURL = '';
                var storeVal = '';
            }

            $http.put("/dash/settings/enable/superjini", {superjini : enable, store_id : store_id, storeURL : storeURL, storeVal : storeVal})
                .success(function (response) {
                    if (!response) {
                        alert("Something went wrong");
                        $scope.superjini = false;
                    } else {
                        if(enable == true){
                            console.log("SuperJini Store enabled --> " + response.length);
                            Settings.success_toast("Added to SuperJini Store Successfully!");
                          if(!response.Dealercode){
						$http.get('/dash/get/recentID/'+'dealer').success(function(storeRes){
                            console.log("recent dealer code ")
                            console.log(storeRes);

                                $scope.dealer = {};
                                $scope.dealer.store_id = store_id;
                                $scope.dealer.Dealercode = storeRes.Dealercode + 1;
                                $scope.dealer.DealerName = response.storeName
                                $scope.dealer.Address = response.companyAddress
                                $scope.dealer.Address2 = ''
                                $scope.dealer.City = ''
                                $scope.dealer.Category = ''
                                $scope.dealer.SellerName = ''
                                $scope.dealer.Seller = ''
                                $scope.dealer.Phone = response.phone;
                                $scope.dealer.companyIdc = response.companyIdc;
                                $scope.dealer.companyName = response.companyName;
                                $scope.dealer.gst = response.gstNumber;
                                $scope.dealer.companyEmail = response.companyEmail;
                                $scope.dealer.api_key = response.api_key;
                                $scope.dealer.coID = response.coID;
                                $scope.dealer.full_name = response.full_name;
                                $scope.dealer.superJiniStore = true;
                                $scope.dealer.cloudinaryURL = [];
                                if(response.logo_url){
                                    $scope.dealer.cloudinaryURL.push(response.logo_url);
                                }
                                else{
                                    $scope.dealer.cloudinaryURL = [];
                                }
                                $scope.dealer.doccloudinaryURL = [];

                                $http.post('/dash/stores/add/new',$scope.dealer).success(function(dealerAdded){
                                    console.log(dealerAdded);
                                    if(dealerAdded.ops[0].Dealercode){
                                        $http.put("/jini/memberDealer/"+ dealerAdded.ops[0].Dealercode).success(function(code){
                                            console.log("dealercode put in members for identification" + code)


                                        })
                                    }
                                })






                        })


                          }
						 }
                        else if(enable == false){
                            console.log("SuperJini Store enabled --> " + response.length);
                            Settings.info_toast("Successfully removed from SuperJini Store!");
                        }
                    }
                })
        }

        $scope.saveStoreURL = function(storeVal){
            console.log(storeVal);
            /*
            save store URL and store name
             */
            $http.put("/jini/superjiniURLs", {storeVal: storeVal}).success(function(response){
                console.log(response);
                if(response == 'store exists'){
                    Settings.fail_toast('ERROR', "Store URL already exists")
                }
                else if (!response) {
                    Settings.fail_toast('ERROR', "Something went wrong!")
                } else {
                    Settings.success_toast('SUCCESS', "Store URL Updated!")
                }

            });
        };

        /*$scope.customerNotification = () => {
            $http.put("/jini/customer/notification", {storeVal: storeVal}).success(function(response){
                console.log(response);
                if(response == 'store exists'){
                    Settings.fail_toast('ERROR', "Store URL already exists")
                }
                else if (!response) {
                    Settings.fail_toast('ERROR', "Something went wrong!")
                } else {
                    Settings.success_toast('SUCCESS', "Store URL Updated!")
                }

            });
        }*/

        $scope.setInvoice = function (name,type) {
            if(type == 'name'){
                if(!name){
                    name = 'INV'
                }
                $http.put("/dash/invoiceIdName", {value: name})
                    .success(function (response) {
                        if(response){
                            $scope.invoiceID.name = response;
                            Settings.success_toast('SUCCESS','Updated Successfully!');
                            Settings.setInstanceDetails('invoiceID', response)

                        }
                    })

            }
            else{
                Settings.confirmPopup("Confirm","Generation of invoice number will start from "+ name +"?",function (result) {
                    if (result) {
                        const zeroPad = (num, places) => String(num).padStart(places, '0');
                        var number = Number(name);
                        var date = new Date();
                        $http.post("/dash/settings/invoice/set/id", {id:'INV',invoiceID : number, type : 'settings'})
                            .success(function(res){
                                console.log(res)
                                if(res)
                                    $scope.invoiceID.num = zeroPad(res.value.invoiceID, 5);
                                Settings.success_toast('SUCCESS','InvoiceID Updated Successfully!');

                            }).error(function (error) {
                            Settings.failurePopup('ERROR', 'Failed to update!');
                        })
                    }else{
                        $http.get("/dash/settings/invoice/recent/id")
                            .success(function(response){
                                // console.log('response',response)
                                const zeroPad = (num, places) => String(num).padStart(places, '0');
                                if(!response){
                                    $scope.invoiceID.num = zeroPad(1,5)
                                }else{

                                    $scope.invoiceID.num = zeroPad(response.invoiceID,5);
                                    // console.log($scope.invoiceID.num)
                                }
                            });

                    }
                })


            }

        };

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

        $scope.addDelivery = function(){
            console.log($scope.distMaxtrix);
            $http.put('/dash/fill/distMatrix',$scope.distMaxtrix).success(function(resp){
                if(resp){
                    // console.log(resp);
                    $http.get('/dash/settings/distMatrix').success(function (matrixData) {
                        console.log("Get dist Matrix"+ matrixData.length);
                        if(matrixData.length){
                            $scope.deliveryData = matrixData[0].matrix;
                        }

                    });
                    $scope.distMaxtrix.minAmount = '';
                    $scope.distMaxtrix.maxAmount = '';
                    $scope.distMaxtrix.minDist = '';
                    $scope.distMaxtrix.maxDist = '';
                    $scope.distMaxtrix.deliveryFee = '';
                }


            });

        }
        $scope.removeDelivery = function(index){
           // console.log(index);
            $scope.deliveryData.splice(index, 1);
           // console.log($scope.deliveryData);

            $http.put('/dash/edit/distMatrix',$scope.deliveryData).success(function(resp){
                if(resp){
                    // console.log(resp);
                    $http.get('/dash/settings/distMatrix').success(function (matrixData) {
                        console.log("Get dist Matrix"+ matrixData.length);
                        if(matrixData.length){
                            $scope.deliveryData = matrixData[0].matrix;
                        }

                    });
                }


            });

        }



        $scope.appBanner = {};
        $scope.appBanner.title = '';
        $scope.appBanner.heading1 = '';
        $scope.appBanner.heading2 = '';
        $scope.appBanner.appimage = '';

        $http.get('/dash/settings/appBanner').success(function (appBanner) {
            console.log("Get dist appBanner"+ appBanner.length);
            if(appBanner.length){
                $scope.appBannerData = appBanner[0].banner;
            }
        });


// AppBanner  to settings collection.....

        $scope.updatePicture  = function(image,appimage){
            if(image[0].size >= 1024000 ){
                Settings.confirmPopup('warning',"Image Size should lesser than 1MB, please check");

            }else {
                $scope.userPicture = appimage;
            }

        }

        // Adding AppBanner  to settings collection.....
        $scope.saveAppBanner = function(appBanner) {

            $scope.appBanner.appimage =   $scope.userPicture;
         //   console.log("app banner save button",$scope.appBanner.title);

            if(appBanner.title) {
                $http.put('/dash/fill/appBanner', $scope.appBanner).success(function (resp) {

                    if (resp) {
                     //   console.log(resp);
                        $http.get('/dash/settings/appBanner').success(function (appBanner) {
                           // console.log("Get dist appBanner" + appBanner.length);
                            if (appBanner.length) {

                                $scope.appBannerData = appBanner[0].banner;
                            }

                        });
                        $scope.appBanner.title = '';
                        $scope.appBanner.heading1 = '';
                        $scope.appBanner.heading2 = '';
                        $scope.appBanner.appimage = '';

                        Settings.success_toast("Success", "AppBanner Added Successfully");

                    }
                });

            } else {
                Settings.failurePopup('ERROR',"Please enter Title");
            }
        }



        $scope.updatePicture1  = function(image,appimage){

            if(image[0].size >= 1024000 ){
                Settings.confirmPopup('warning',"Image Size should lesser than 1MB, please check");

            }else {
                $scope.userPicture1 = appimage;
            }


        }

        // Edit and update AppBanner.......c


        $scope.editAppBannerFromSetting = function(newAppBanner,index) {

            if(newAppBanner.title) {

            //    console.log("edit app banner", newAppBanner);
            $http.get('/dash/settings/appBanner').success(function (appBanner) {
                if (appBanner.length) {
                    $scope.appBannerData = appBanner[0].banner;
                }
            });

            if($scope.userPicture1){
                newAppBanner.appimage = $scope.userPicture1;
            }


                for (var i = 0; i < $scope.appBannerData.length; i++) {
                $scope.appBannerData[i].edited = false ;

                if (i == index) {
                    $scope.appBannerData[i] = newAppBanner;
                    $scope.appBannerData[i].edited = true ;

                }
            }


            $http.put('/dash/edit/appBanner', $scope.appBannerData)
                .success(function (resp) {
                    if (resp) {
                          console.log(resp);
                        $http.get('/dash/settings/appBanner').success(function (appBanner) {
                      //      console.log("Get newAppBanner"+ appBanner[0].banner, appBanner.length);

                            if (appBanner.length) {
                                $scope.appBannerData = appBanner[0].banner;
                            }

                        });
                        Settings.success_toast("Success", "AppBanner Updated Successfully");
                    }

                });
        }
        else
        {
            Settings.failurePopup('ERROR',"Please enter Title");
        }
        }



//remove  AppBanner  to settings collection.....

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


//end  AppBanner  to settings collection.....

    });
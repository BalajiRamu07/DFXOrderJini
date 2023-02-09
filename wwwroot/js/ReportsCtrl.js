/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("ReportsCtrl",function ($scope, $filter, $routeParams, Settings, $http, $window,toastr, $location) {
        console.log("Hello From Reports Controller .... !!!!", $routeParams.tab);

        $scope.orderfilterFlag = false;
        $scope.showReports = false;
        $scope.reportTabName = "Home";

        //.... Extend Timeout for the API requests...
        const api_timeout = 600000;

        $scope.reportTabId = 0;
        $scope.HubSummaryTab = 'hub_summary';
        /*if($routeParams.tab)
         $scope.reportTabId = parseInt($routeParams.tab)*/
        $scope.ridersReportSeach = {};
        $scope.viewLength = 0;
        $scope.newViewBy = 10;
        var initialViewBy = 60;

        //.... View By 3, 5, 10, 20, 30, 40, 50, 100, 200
        var localViewBy = $scope.newViewBy;

        $scope.itemSelectAll = {};
        $scope.itemSelectAll.category = true;
        $scope.itemSelectAll.subCategory = true;
        $scope.itemSelectAll.subSubCategory = true;

        $scope.dealerSelectAll = {};
        $scope.dealerSelectAll.city =true;
        var master_date_added = {};
        $scope.showAtdDashboard = true;
        $scope.attendanceChartReport = [];

        Settings.getNav(false, nav => {
            $scope.nav = nav;
            $scope.orderPaymentStatus = $scope.nav[1].paymentstatus? $scope.nav[1].paymentstatus : [];
            $scope.fulfillmentstatus = $scope.nav[1].fulfillmentstatus? $scope.nav[1].fulfillmentstatus : [];
            $scope.orderStatus = $scope.nav[1].status? $scope.nav[1].status : [];
        })
        $scope.itemCategories = [];
        $scope.sellerNames = []; //stores seller name

        $scope.displayloader = false;

        $scope.mapsFilter = {};
        $scope.mapsFilter.from = new Date();
        //$scope.mapsFilter.from.setDate($scope.mapsFilter.from.getDate()-1);
        $scope.mapsFilter.from.setHours(0, 0, 0, 0);
        $scope.mapsFilter.to = new Date();
        $scope.mapsFilter.to.setHours(23, 59, 59, 59);

        $scope.QuotationReportFilter    = {};
        $scope.paymentsreport           = {};
        $scope.cinreport                = {};
        $scope.riderCheckInreports       = {};
        $scope.orderSearch               = {};
        $scope.riderActivityreports      = {};
        $scope.cinemployeereport        = {};
        $scope.overallreport            = {};
        $scope.overallreports           = {};
        $scope.mtgreport                = {};
        $scope.expensesreports          = {};
        $scope.expreport                = {};
        $scope.atdreports               = {};
        $scope.atdChartReport           = {};
        $scope.dealerreport = {};
        $scope.itemreport = {};
        $scope.sellerreport = {};
        $scope.orderreport = {};
        $scope.cashreport = {};
        $scope.checkInreport = {};
        $scope.riderCheckInreport          = {};
        $scope.expensereport = {};
        $scope.meetingreport = {};
        $scope.attendancereport = {};
        $scope.skuReport = {};
        $scope.visitsReport = {};
        //filters for report
        $scope.orderReportFilter 	      = {};
        $scope.sellerReportFilter	      = {};
        $scope.itemReportFilter		  = {};
        $scope.customOrderFilter		  = {};
        $scope.enquiryReportFilter      = {};
        $scope.targetAchievementReportFilter = {};
        $scope.dealerReportFilter	      = {};
        $scope.skuReportFilter		  = {};
        $scope.visitsReportFilter	      = {};
        $scope.sellerUserFilter         = {};
        $scope.QuotationFilter          = {};
        $scope.salesReportFilter		  = {};
        $scope.ridersReportFilter		  = {};
        $scope.hubReportFilter		  = {};
        $scope.overallReportFilter		  = {};

        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;
        
        var reportSearchBy = ['seller', 'sellername', 'dealername', 'dealerphone','stockist','stockistname'];
        $scope.showHubFilter = false;
        $scope.checkinMapLocation = {}; // to store checkin locations of Customer, Start Visit, End Visit
        $scope.hubDetailsObj = {};
        //Checkin Map Icons
        $scope.checkinIcons = [];
        $scope.checkinIcons['startVisit'] = 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png';
        $scope.checkinIcons['endVisit'] = 'https://maps.google.com/mapfiles/ms/micons/red-dot.png';
        $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
        $scope.checkinIcons['pjp'] = 'https://maps.google.com/mapfiles/ms/micons/green-dot.png';

        $scope.ridersReportFilter.startDate = new Date();
        $scope.ridersReportFilter.startDate.setDate($scope.ridersReportFilter.startDate.getDate() - 7);
        $scope.ridersReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.ridersReportFilter.endDate = new Date();
        $scope.ridersReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.overallReportFilter.startDate = new Date();
        $scope.overallReportFilter.startDate.setDate($scope.overallReportFilter.startDate.getDate() - 7);
        $scope.overallReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.overallReportFilter.endDate = new Date();
        $scope.overallReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.salesReportFilter.startDate = new Date();
        $scope.salesReportFilter.startDate.setDate($scope.salesReportFilter.startDate.getDate() - 7);
        $scope.salesReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.salesReportFilter.endDate = new Date();
        $scope.salesReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.sellerReportFilter.startDate = new Date();
        $scope.sellerReportFilter.startDate.setDate($scope.sellerReportFilter.startDate.getDate() - 7);
        $scope.sellerReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.sellerReportFilter.endDate = new Date();
        $scope.sellerReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.cinemployeereport.startDate = new Date();
        $scope.cinemployeereport.startDate.setDate($scope.cinemployeereport.startDate.getDate() - 7);
        $scope.cinemployeereport.startDate.setHours(0, 0, 0, 0);
        $scope.cinemployeereport.endDate = new Date();
        $scope.cinemployeereport.endDate.setHours(23, 59, 59, 59);

        $scope.QuotationReportFilter.startDate = new Date();
        $scope.QuotationReportFilter.startDate.setDate($scope.QuotationReportFilter.startDate.getDate() - 7);
        $scope.QuotationReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.QuotationReportFilter.endDate = new Date();
        $scope.QuotationReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.skuReportFilter.startDate = new Date();
        $scope.skuReportFilter.startDate.setDate($scope.skuReportFilter.startDate.getDate() - 7);
        $scope.skuReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.skuReportFilter.endDate = new Date();
        $scope.skuReportFilter.endDate.setHours(23, 59, 59, 59);
        $scope.skuReportFilter.dealer = {};
        $scope.skuReportFilter.dealer.Dealercode = '0'
        $scope.skuReportFilter.category = {};
        $scope.skuReportFilter.category.Manufacturer = '0';

        $scope.visitsReportFilter.startDate = new Date();
        $scope.visitsReportFilter.startDate.setDate($scope.visitsReportFilter.startDate.getDate() - 7);
        $scope.visitsReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.visitsReportFilter.endDate = new Date();
        $scope.visitsReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.dealerReportFilter.startDate = new Date();
        $scope.dealerReportFilter.startDate.setDate($scope.dealerReportFilter.startDate.getDate() - 7);
        $scope.dealerReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.dealerReportFilter.endDate = new Date();
        $scope.dealerReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.itemReportFilter.startDate = new Date();
        $scope.itemReportFilter.startDate.setDate($scope.itemReportFilter.startDate.getDate() - 7);
        $scope.itemReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.itemReportFilter.endDate = new Date();
        $scope.itemReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.customOrderFilter.startDate = new Date();
        $scope.customOrderFilter.startDate.setDate($scope.customOrderFilter.startDate.getDate() - 7);
        $scope.customOrderFilter.startDate.setHours(0, 0, 0, 0);
        $scope.customOrderFilter.endDate = new Date();
        $scope.customOrderFilter.endDate.setHours(23, 59, 59, 59);

        $scope.paymentsreport.startDate = new Date();
        $scope.paymentsreport.startDate.setDate($scope.paymentsreport.startDate.getDate() - 7);
        $scope.paymentsreport.startDate.setHours(0, 0, 0, 0);
        $scope.paymentsreport.endDate = new Date();
        $scope.paymentsreport.endDate.setHours(23, 59, 59, 59);

        $scope.cinreport.startDate = new Date();
        $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
        $scope.cinreport.startDate.setHours(0, 0, 0, 0);
        $scope.cinreport.endDate = new Date();
        $scope.cinreport.endDate.setHours(23, 59, 59, 59);

        $scope.riderCheckInreports.startDate = new Date();
        $scope.riderCheckInreports.startDate.setDate($scope.riderCheckInreports.startDate.getDate() - 7);
        $scope.riderCheckInreports.startDate.setHours(0, 0, 0, 0);
        $scope.riderCheckInreports.endDate = new Date();
        $scope.riderCheckInreports.endDate.setHours(23, 59, 59, 59);

        $scope.riderActivityreports.startDate = new Date();

        $scope.mtgreport.startDate = new Date();
        $scope.mtgreport.startDate.setDate($scope.mtgreport.startDate.getDate() - 30);
        $scope.mtgreport.startDate.setHours(0, 0, 0, 0);
        $scope.mtgreport.endDate = new Date();
        $scope.mtgreport.endDate.setHours(23, 59, 59, 59);

        $scope.sellerUserFilter.startDate = new Date();
        $scope.sellerUserFilter.startDate.setDate($scope.sellerUserFilter.startDate.getDate() - 7);
        $scope.sellerUserFilter.startDate.setHours(0, 0, 0, 0);
        $scope.sellerUserFilter.endDate = new Date();
        $scope.sellerUserFilter.endDate.setSeconds(0, 0);

        $scope.orderReportFilter.startDate = new Date();
        $scope.orderReportFilter.startDate.setDate($scope.orderReportFilter.startDate.getDate() - 7);
        $scope.orderReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.orderReportFilter.endDate = new Date();
        $scope.orderReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.atdreports.startDate = new Date();
        $scope.atdreports.startDate.setDate($scope.atdreports.startDate.getDate() - 3);
        $scope.atdreports.startDate.setHours(0, 0, 0, 0);
        $scope.atdreports.endDate = new Date();
        $scope.atdreports.endDate.setHours(23, 59, 59, 59);

        $scope.atdChartReport.startDate = new Date();
        $scope.atdChartReport.startDate.setDate($scope.atdChartReport.startDate.getDate() - 3);
        $scope.atdChartReport.startDate.setHours(0, 0, 0, 0);
        $scope.atdChartReport.endDate = new Date();
        $scope.atdChartReport.endDate.setHours(23, 59, 59, 59);

        $scope.expreport.startDate = new Date();
        $scope.expreport.startDate.setDate($scope.expreport.startDate.getDate() - 7);
        $scope.expreport.startDate.setHours(0, 0, 0, 0);
        $scope.expreport.endDate = new Date();
        $scope.expreport.endDate.setHours(23, 59, 59, 59);

        $scope.enquiryReportFilter.startDate = new Date();
        $scope.enquiryReportFilter.startDate.setDate($scope.enquiryReportFilter.startDate.getDate() - 7);
        $scope.enquiryReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.enquiryReportFilter.endDate = new Date();
        $scope.enquiryReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.targetAchievementReportFilter.startDate = new Date();
        $scope.targetAchievementReportFilter.startDate = new Date($scope.targetAchievementReportFilter.startDate.getFullYear() ,$scope.targetAchievementReportFilter.startDate.getMonth(),1);
        $scope.targetAchievementReportFilter.startDate.setHours(0, 0, 0, 0);
        $scope.targetAchievementReportFilter.endDate = new Date($scope.targetAchievementReportFilter.startDate.getFullYear() ,$scope.targetAchievementReportFilter.startDate.getMonth()+1,0);
        $scope.targetAchievementReportFilter.endDate.setHours(23, 59, 59, 59);

        $scope.orderSearch.startDate = new Date();
        $scope.orderSearch.startDate.setDate($scope.orderSearch.startDate.getDate() - 7);
        $scope.orderSearch.startDate.setHours(0, 0, 0, 0);
        $scope.orderSearch.endDate = new Date();
        $scope.orderSearch.endDate.setHours(23, 59, 59, 59);


        $scope.visitsReportFilter.dealer = {};
        $scope.visitsReportFilter.noVisits = false;
        $scope.visitsReportFilter.visits = false;

        //... Search models Initialization ...
        $scope.itemReportSearch = {};
        $scope.itemReportSearch.filter = '';
        $scope.dealerReportSearch = {};
        $scope.dealerReportSearch.filter = '';
        $scope.sellerReportSearch = {};
        $scope.sellerReportSearch.filter = '';
        $scope.orderReportSearch = '';
        $scope.paymentReportSearch = {};
        $scope.paymentReportSearch.filter = '';
        $scope.checkInReportSearch = {};
        $scope.checkInReportSearch.filter = '';
        $scope.riderCheckInReportSearch = {};
        $scope.riderActivityReportSearch = {};
        $scope.riderCheckInReportSearch.filter = '';
        $scope.riderActivityReportSearch.filter = '';
        $scope.enquiryReportSearch = {};
        $scope.enquiryReportSearch.filter = '';
        $scope.expenseReportSearch = {};
        $scope.expenseReportSearch.filter = '';
        $scope.expenseFilterStatus = '';
        $scope.salesReportSeach = {};
        $scope.salesReportSeach.filter = '';
        $scope.modeOfPayment = '';
        $scope.meetingsReportSearch = {};
        $scope.meetingsReportSearch.filter = '';
        $scope.skuReportSearch = {};
        $scope.skuReportSearch.filter = '';
        $scope.visitsReportSearch = {};
        $scope.visitsReportSearch.filter = '';
        $scope.AttendanceReportSearch = {};
        $scope.AttendanceReportSearch.filter = '';
        $scope.userSearch = {};
        $scope.userSearch.filter = '';
        $scope.EnquiryBranch = {}
        $scope.EnquiryBranch.branchSelectedForEnquiry = '';
        $scope.targetAchievementReportSearch = {};
        $scope.targetAchievementReportSearch.filter = '';

        var checkinSearchObj = {};
        var overallSearchObj = {};
        var riderCheckinSearchObj = {};
        var riderActivitySearchObj = {};
        var orderSummarySearchObj = {};
        var dealerSearchObj = {};
        $scope.sourceType = [];
        $scope.sourceType = ["Pos","Order","App","Shopify","Old orders","Superjini"];
        var sellerSearchObj = {};
        var targetAchievementSearchObj = {};
        var attSearchObj = {};
        var paymentSearchObj = {};
        var soldSearchObj = {};
        var customOrderSearchObj = {};
        var employeeSearchObj = {};
        var skuSearchObj = {};
        var meetingSearchObj = {};
        var expenseSearchObj = {};
        var summarySearchObj = {};
        var topUserSearchObj = {};
        var topCustomerSearchObj = {};
        var topEnquirySearchObj = {};
        var salesSearchObj = {};
        var riderSearchObj = {};
        var dealerSearchBy = ['Dealercode', 'DealerName', 'City', 'seller','SellerName', 'StockistName', 'Area', 'Phone', 'email'];
        // $scope.orderPaymentStatus = $scope.nav[1].paymentstatus? $scope.nav[1].paymentstatus : [];
        // $scope.fulfillmentstatus = $scope.nav[1].fulfillmentstatus? $scope.nav[1].fulfillmentstatus : [];
        $scope.orderFilterDealers = [];

        // $scope.orderStatus = $scope.nav[1].status? $scope.nav[1].status : [];

        var soldSearchBy = ['medicine','model'];
        var topSellerSearchBy = ['sellername'];
        var topDealerSearchBy = ['dealername','sellername'];
        var expenseSearchBy= ['sellername'];
        var employeeSearchBy = ['sellername'];
        var salesSearchBy = ['orderId', 'sellername', 'seller', 'dealername', 'dealerphone', 'quantity', 'class', 'paymentMode','itemcode','medicine','sellername'];
        var paymentSearchBy = ['dealername', 'sellername'];
        var checkinDealerSearchBy = ['dealername','sellername'];
        var itemSearchBy = ['itemCode', 'Product', 'Manufacturer', 'subCategory','subSubCategory'];
        var enquirySearchBy = ['itemName'];
        var riderCheckinSearchBy = ['fulfillerName'];
        var riderActivitySearchBy = ['tripId'];
        var orderSearchBy = ['orderId', 'sellername', 'seller', 'dealername', 'dealerphone', 'quantity', 'stockistname'];
        var riderSearchBy = ['orderId', 'dealername', 'dealerphone', 'tripId', 'paymentMode','itemcode','medicine','fulfillerName'];
        var customOrderSearchBy = ['plant', 'state'];


        topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
        topCustomerSearchObj.searchBy = topDealerSearchBy;
        var userRoletype = '';


        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                // console.log("Salesperson : ", salesperson);
                if(salesperson && salesperson.length){
                    $scope.roleSalesrep = [];
                    for(var i = 0; i < salesperson.length; i++){
                        $scope.roleSalesrep.push({sellername : salesperson[i].sellername, sellerphone : salesperson[i].sellerphone});
                        //$scope.fulfillerNames[fulfillers[i].sellerphone] = fulfillers[i].sellername;
                    }

                    $scope.salespersonLength = $scope.roleSalesrep.length;
                    //$scope.refreshSellerNames();

                }
            });

        $scope.states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'New Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Punjab', 'Puducherry', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Tripura', 'Uttar Pradesh', 'West Bengal', 'Chhattisgarh', 'Uttarakhand', 'Jharkhand', 'Telangana'];


        //.... Plant Codes....
        $scope.getPlantCode = function () {
            $http.post("/dash/suppliers/plantcodes")
                .then(res => {
                if(res && res.data){
                $scope.plant_codes = res.data
            }

        })
        };
        $scope.getPlantCode();


        //.... Plant Codes....
        // $scope.plant_codes = [
        //     {
        //         "code" : "P001",
        //         "name" : "PDN Factory",
        //         "days" : 4
        //     },
        //     {
        //         "code" : "P055",
        //         "name" : "Shivarna Plant",
        //         "days" : 3
        //     },
        //     {
        //         "code" : "D010",
        //         "name" : "Kerala Depot",
        //         "days" : 1
        //     },
        //     {
        //         "code" : "P056",
        //         "name" : "JRG Foam Plant",
        //         "days" : 3
        //     }
        // ];

        $scope.getPlantName = function(plant){
            var plantName = "";
            $scope.plant_codes.map(a => {
                if(a.supplier == plant){
                plantName = a.supplierName;
            }
        })
            return plantName;
        }

        var instanceDetails =  Settings.getInstance();

        $scope.warehouseLocation = [];
        Settings.getUserInfo(function(user_details){
            $scope.user = user_details;

            if($scope.user.role){
                userRoletype = $scope.user.role.toLowerCase();
            }
        });

        if($scope.user.role == "Factory"){
             var factoryCodesArr = [];
            if($scope.user && $scope.user.sellerObject && $scope.user.sellerObject.plant_code) {
                $scope.factoryPlantCode = $scope.user.sellerObject.plant_code;
              $scope.plant_codes.filter(filterPlantCodes)

                function filterPlantCodes(plant) {
                    $scope.factoryPlantCode.map(code => {
                        if(plant.code == code){
                            factoryCodesArr.push(plant);
                    }
                })
            }
                $scope.plant_codes = factoryCodesArr;
        }
        }

        $scope.userRole = $scope.nav[4].roles;
        $scope.roleFulfiller = [];

        var obj = {};
        if(userRoletype  && userRoletype != 'admin' && $scope.user.sellerObject.inventoryLocation){
            obj.warehouse = $scope.user.sellerObject.inventoryLocation;

            $http.post("/dash/role/rider/fulfiller",obj)
                .success(function (fulfillers) {
                    $scope.roleFulfiller = [];
                    if(fulfillers && fulfillers.length){

                        for(var i = 0; i < fulfillers.length; i++){
                            $scope.roleFulfiller.push({
                                sellername : fulfillers[i].sellername, 
                                sellerphone : fulfillers[i].sellerphone,
                                inventoryLocation : fulfillers[i].inventoryLocation
                            });
                        }
                    }
                })
        }else{
            $http.get("/dash/role/sellers/Fulfiller")
                .success(function (fulfillers) {
                    $scope.roleFulfiller = [];
                    if(fulfillers && fulfillers.length){

                        for(var i = 0; i < fulfillers.length; i++){
                            $scope.roleFulfiller.push({
                                sellername : fulfillers[i].sellername, 
                                sellerphone : fulfillers[i].sellerphone,
                                inventoryLocation : fulfillers[i].inventoryLocation});
                        }
                    }

                });
        }

        $http.get("/dash/settings/inventory/locations").success(function(res){
            if(res.length){
                $scope.warehouseLocation = res[0].location;
            }
        }).catch(function(err){
            console.log(err);
        })

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


        $scope.daysDifference = function(startDate, endDate){

            if (startDate && endDate) {
                var d1 = moment(startDate);
                var d2 = moment(endDate);
                var numberOfDays = moment.duration(d2.diff(d1)).asDays();
            }
            else if (!endDate) {
                var d1 = moment(startDate);
                var d2 = moment(new Date());
                var numberOfDays = moment.duration(d2.diff(d1)).asDays();
            }
            else
                var numberOfDays = 0;
            return numberOfDays;

        };

        $scope.formatdate = function(date){
            if(date!=undefined && date!='' && date!= null){
                var a = date.toString();
                var b = a.replace(/-/g, "/");
                return new Date(b);
            }
            else{
                return false;
            }
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

        $scope.calculateDuration = function(inTime, outTime){

            var intime ,outtime;

            if(inTime.isArray && outTime.isArray)
            {
                intime = inTime[0];
                outtime = outTime[0];
            }
            else
            {
                intime = inTime;
                outtime = outTime;
            }

            if(intime != null && outtime != null){
                if(outtime != ''){

                    var newInTime = new Date(intime);
                    var newOutTime = new Date(outtime);

                    if(newInTime == 'Invalid Date' && newOutTime == 'Invalid Date'){
                        var t1 = intime.split(':');
                        var t2 = outtime.split(':');

                        var hh1 = parseInt(t1[0]);
                        var hh2 = parseInt(t2[0]);
                        var mm1 = parseInt(t1[1]);
                        var mm2 = parseInt(t2[1]);

                        var h1 = hh1*60;
                        var h2 = hh2*60;

                        var diff = (h2 + mm2) - (h1 + mm1);

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            return hh+ "h : " +mm+ "m";
                        }
                        else{
                            var mm = parseInt(diff);
                            return "0h : "+mm+"m";
                        }
                    }
                    else{
                        var t1 = moment(newInTime);
                        var t2 = moment(newOutTime);
                        var diff = moment.duration(t2.diff(t1)).asMinutes();

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            return hh+ "h : " +mm+ "m";
                        }
                        else{
                            var mm = parseInt(diff);
                            return "0h : "+mm+"m";
                        }
                    }

                }

                else{
                    return "User not punched out";
                }
            }
        };

        $scope.getTimeFromDate = function(date){
            if(date){
                var t = date.split(" ");
                var time = t[1].split(":");

                if(time[0] <= 11){
                    return time[0]+":"+time[1]+" AM";
                }
                else if(time[0] == 12){
                    return time[0]+":"+time[1]+" PM";
                }
                else{
                    return (time[0] - 12)+":"+time[1]+" PM";
                }
            }
            else{
                return 'N/A';
            }
        };

        $scope.getMinutesDifference = function (date1,date2) {
            if(date1 && date2){
                var fromDate = new Date(date1);
                var toDate = new Date(date2);

                var diffMs =  toDate.getTime() - fromDate.getTime() ;
                var diffMins = Math.round(diffMs / 60000);
                return diffMins + " min";
            }else{
                return "N/A";
            }



        }

        $scope.getFullTimeFromDate = function(date){
            if(date){
                var t = date.split(" ");
                var time = t[1].split(":");

                if(time[0] <= 11){
                    if (time[1] < 10 && time[1].length <2) time[1] = '0' + time[1];
                    return time[0]+":"+time[1];
                }
                else if(time[0] == 12 ){
                    if (time[1] < 10 && time[1].length <2) time[1] = '0' + time[1];
                    return time[0]+":"+time[1];
                }
                else{
                    if (time[1] < 10 && time[1].length <2) time[1] = '0' + time[1];
                    return (time[0])+":"+time[1];
                }
            }
            else{
                return 'N/A';
            }
        };

        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                //console.log("Salesperson : ", salesperson);
                if(salesperson && salesperson.length){
                    $scope.roleSalesrep = [];
                    for(var i = 0; i < salesperson.length; i++){
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

        // $http.get("/dash/role/sellers/Fulfiller")
        //     .success(function (fulfillers) {
        //         if(fulfillers && fulfillers.length){
        //             $scope.roleFulfiller = [];
        //             for(var i = 0; i < fulfillers.length; i++){
        //                 $scope.roleFulfiller.push({sellername : fulfillers[i].sellername, sellerphone : fulfillers[i].sellerphone});
        //             }
        //         }
        //     })
        //     .error(function(error, status){
        //         console.log(error, status);
        //         if(status >= 400 && status < 500)
        //             $window.location.href = '/404';
        //         else if(status >= 500)
        //             $window.location.href = '/500';
        //         else
        //             $window.location.href = '/404';
        //     });

        // $http.get("/dash/stores/stockist").success(function(response){
        //     // console.log("stockist=====",response);
        //     allStockist = response;
        //     $scope.allStockistFromDealer = allStockist.unique('_id');
        //     for(var i = 0; i < response.length; i++)
        //         $scope.sellerNames[response[i].Stockist] = response[i]._id;
        // }).error(function(error, status){
        //     console.log(error, status);
        //     if(status >= 400 && status < 404)
        //         $window.location.href = '/404';
        //     else if(status >= 500)
        //         $window.location.href = '/500';
        //     else
        //         $window.location.href = '/404';
        // });

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


        $scope.getCountDetails = function(id){
            // console.log(id)
            $scope.report_itemCountDisp = {};
            $scope.report_itemCountDisp = id ;
        };

        $scope.calculateDiff = function(inTime,outTime)
        {
            var intime = inTime[0];
            var outtime = outTime[0];

            if(intime != null && outtime != null){
                if(outtime != ''){

                    var newInTime = new Date(intime);
                    var newOutTime = new Date(outtime);

                    if(newInTime == 'Invalid Date' && newOutTime == 'Invalid Date'){
                        var t1 = intime.split(':');
                        var t2 = outtime.split(':');

                        var hh1 = parseInt(t1[0]);
                        var hh2 = parseInt(t2[0]);
                        var mm1 = parseInt(t1[1]);
                        var mm2 = parseInt(t2[1]);

                        var h1 = hh1*60;
                        var h2 = hh2*60;

                        var diff = (h2 + mm2) - (h1 + mm1);

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            // return hh+ "h : " +mm+ "m";

                            return $scope.cal(hh);
                        }
                        else{
                            var mm = parseInt(diff);
                            // return "0h : "+mm+"m";

                            return $scope.cal(0);
                        }
                    }
                    else{
                        var t1 = moment(newInTime);
                        var t2 = moment(newOutTime);
                        var diff = moment.duration(t2.diff(t1)).asMinutes();

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            // return hh+ "h : " +mm+ "m";

                            return $scope.cal(hh);
                        }
                        else{
                            var mm = parseInt(diff);
                            // return "0h : "+mm+"m";

                            return $scope.cal(0);
                        }
                    }

                }

                else{
                    return "User not punched out";
                }
            }

            $scope.cal = function(hour)
            {

                if(hour < 4) {
                    return 'Leave';
                }
                else if(hour >= 4 && hour < 8)
                {
                    return 'Half Day';
                }
                else if(hour >= 8){
                    return 'Full Day';
                }
            }

            // return $scope.diff;
        }

        $scope.topSoldDuration = $scope.daysDifference($scope.itemReportFilter.startDate , $scope.itemReportFilter.endDate);
        $scope.customOrderDuration = $scope.daysDifference($scope.customOrderFilter.startDate , $scope.customOrderFilter.endDate);
        $scope.topDealersDuration = $scope.daysDifference($scope.dealerReportFilter.startDate , $scope.dealerReportFilter.endDate);
        $scope.topSellerDuration = $scope.daysDifference($scope.sellerReportFilter.startDate , $scope.sellerReportFilter.endDate);
        $scope.summaryDuration = $scope.daysDifference($scope.orderReportFilter.startDate , $scope.orderReportFilter.endDate);
        $scope.paymentDuration = $scope.daysDifference($scope.paymentsreport.startDate , $scope.paymentsreport.endDate);
        $scope.checkinDuration = $scope.daysDifference($scope.cinreport.startDate , $scope.cinreport.endDate);
        $scope.expenseDuration = $scope.daysDifference($scope.expreport.startDate , $scope.expreport.endDate);
        $scope.meetingDuration = $scope.daysDifference($scope.mtgreport.startDate , $scope.mtgreport.endDate);
        $scope.skuDuration = $scope.daysDifference($scope.skuReportFilter.startDate , $scope.skuReportFilter.endDate);
        $scope.visitDuration = $scope.daysDifference($scope.visitsReportFilter.startDate , $scope.visitsReportFilter.endDate);
        //$scope.attendanceDuration = $scope.daysDifference($scope.atdreports.startDate , $scope.atdreports.endDate);
        $scope.topEnquiryDuration = $scope.daysDifference($scope.enquiryReportFilter.startDate , $scope.enquiryReportFilter.endDate);
        $scope.overallDuration = $scope.daysDifference($scope.overallReportFilter.startDate , $scope.overallReportFilter.endDate);
        $scope.riderCheckinDuration = $scope.daysDifference($scope.riderCheckInreports.startDate , $scope.riderCheckInreports.endDate);
        $scope.riderActivityDuration = $scope.daysDifference($scope.riderActivityreports.startDate , $scope.riderActivityreports.endDate);


        function getMaster_Date_added(date) {
            var d = new Date(date);
            var d2 = new Date(date);
            master_date_added.date = date.getDate();
            master_date_added.month = date.getMonth();
            master_date_added.year = date.getFullYear();

            d.setDate(d.getDate() - 1);
            master_date_added.date_1 = d.getDate();
            master_date_added.month_1 = d.getMonth();
            master_date_added.year_1 = d.getFullYear();

            d2.setDate(d2.getDate() - 2)
            master_date_added.date_2 = d2.getDate();
            master_date_added.month_2 = d2.getMonth();
            master_date_added.year_2 = d2.getFullYear();
        }

        getMaster_Date_added(new Date());

        function reverseGeocode(callback, latlng, type){
            var geocoder = new google.maps.Geocoder();

            if(type == 'ATD'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'ATD');
                    }
                });
            }
            else if(type == 'customer'){
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
            else if(type == 'startVisit'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'startVisit');
                    }
                });
            }
            else if(type == 'endVisit'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'endVisit');
                    }
                });
            } else if(type == 'delivered'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'delivered');
                    }
                });
            }

            else if(type == 'bidhistory'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log("bidhistory address==");
                        var address = (results[0].formatted_address);

                        callback.call(this, address, 'bidhistory');
                    }
                });
            }


        }

        $scope.getAllCategories = function(type){
            $http.post("/dash/items/filter/"+type, {viewBy : 0})
                .success(function(category){
                    console.log(category);
                    $scope.itemCategories = category;

                    $scope.itemCategories = $scope.itemCategories.filter(function( obj ) {
                        return obj._id !== 'DEFAULT';
                    });
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
        };

        function geocode_address(result, type){
            if(type == 'ATD'){
                //console.log(result)
                $scope.attendance_address = result;
                $scope.$apply();
            }
            else if(type == 'customer'){
                $scope.checkinMapLocation.dealer = result;
                $scope.$apply();
            }
            else if(type == 'startVisit'){
                $scope.checkinMapLocation.sVisit = result;
                $scope.$apply();
            }
            else if(type == 'endVisit'){
                $scope.checkinMapLocation.eVisit = result;
                $scope.$apply();
            }
            else if(type == 'bidhistory'){
                $scope.checkinMapLocation.BidHistoryAddress = result;
                $scope.$apply();
            } else if(type == 'delivered'){
                $scope.checkinMapLocation.delivered = result;
                $scope.$apply();
            }
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
            }
            else
                return 0;
        };

        $scope.transactionCount = function(response, tab){
            //console.log(response);
            if(response){
                if(response > localViewBy){
                    $scope.attendance_count = response;
                }
                else if(response <= localViewBy){
                    $scope.attendance_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.attendancereport = [];
                    $scope.newViewBy = 1;
                    $scope.attendance_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.attendancereport = [];
                $scope.newViewBy = 1;
                $scope.attendance_count = 0;
                $scope.viewLength = -1;
            }
        };


        /*********************
         *      Reports!!!!
         *
         *********************/

        $scope.reportFilter = function(id){
            $scope.newViewBy1.view = 10;

            switch(id){
                case 1 : {
                    //.... Top Sold...
                    soldSearchObj.viewLength = 0;
                    soldSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.itemReportSearch.filter){
                        soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                        soldSearchObj.searchBy = soldSearchBy;
                    }

                    if($scope.itemReportFilter.warehouse){
                        soldSearchObj.warehouse = $scope.itemReportFilter.warehouse;
                    }else{
                        soldSearchObj.warehouse = '';
                    }


                    $scope.itemreport = [];


                    $http.post("/dash/reports/items",soldSearchObj)
                        .success(function(response){
                            // console.log(response);
                            var tempArray = [];
                            $http.get("/dash/items")
                                .success(function (response) {
                                    for(var i = 0 ;i < response.length;i++){
                                        var temp = response[i].itemCode +'';
                                        tempArray[temp] = response[i].Manufacturer ;

                                    }
                                    sold();
                                });

                            function sold(){
                                for (var i = 0;i < response.length;i++){
                                    response[i].isCollapsed = false ;
                                    response[i].Manufacturer = tempArray[response[i]._id] ;
                                    var data = response[i].orderDetail ;
                                    var seen = {};
                                    data = data.filter(function(entry) {
                                        var previous;

                                        // Have we seen this label before?
                                        if (seen.hasOwnProperty(entry.seller)) {
                                            // Yes, grab it and add this data to it
                                            previous = seen[entry.seller];
                                            previous.quantity.push(parseInt(entry.quantity));
                                            previous.stockist.push({'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity)});

                                            // Don't keep this entry, we've merged it into the previous one
                                            return false;
                                        }

                                        // entry.data probably isn't an array; make it one for consistency
                                        if (!Array.isArray(entry.quantity)) {
                                            entry.quantity = [parseInt(entry.quantity)];
                                        }
                                        entry.stockist = [{'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity[0])}];


                                        // Remember that we've seen it
                                        seen[entry.seller] = entry;

                                        // Keep this one, we'll merge any others that match into it
                                        return true;
                                    });
                                    response[i].orderDetail = data ;
                                    for (var j=0; j < response[i].orderDetail.length ; j++){
                                        var a = response[i].orderDetail[j].quantity;
                                        response[i].orderDetail[j].quantity = a.reduce(function(a, b) { return a + b; }, 0);
                                        var stockist = response[i].orderDetail[j].stockist ;
                                        var temp = {};
                                        stockist = stockist.filter(function(entry) {
                                            var previous;

                                            // Have we seen this label before?
                                            if (temp.hasOwnProperty(entry.stockist)) {
                                                // Yes, grab it and add this data to it
                                                previous = temp[entry.stockist];
                                                previous.count.push(parseInt(entry.count));

                                                // Don't keep this entry, we've merged it into the previous one
                                                return false;
                                            }

                                            // entry.data probably isn't an array; make it one for consistency
                                            if (!Array.isArray(entry.count)) {
                                                entry.count = [parseInt(entry.count)];
                                            }

                                            // Remember that we've seen it
                                            temp[entry.stockist] = entry;

                                            // Keep this one, we'll merge any others that match into it
                                            return true;
                                        });
                                        response[i].orderDetail[j].stockist = stockist ;
                                        for(var k = 0 ; k < response[i].orderDetail[j].stockist.length; k++){
                                            var b = response[i].orderDetail[j].stockist[k].count;
                                            response[i].orderDetail[j].stockist[k].count = b.reduce(function(a, b) { return a + b; }, 0);


                                        }
                                    }
                                }
                                $scope.itemreport = response;
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

                    $http.post("/dash/reports/top/sold/count", soldSearchObj)
                        .success(function (response) {
                            $scope.reportsTransactionCount(response, 1);
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

                    $scope.showSoldFilter = true;

                    if($scope.itemReportSearch.filter == '')
                        $scope.showSoldFilter = false;

                    break;
                }
                case 2 : {
                    //.... Top Customers...
                    topCustomerSearchObj.viewLength = 0;
                    topCustomerSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.dealerReportSearch.filter){
                        topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                        topCustomerSearchObj.searchBy = topDealerSearchBy;
                    }

                    $scope.dealerreport = [];

                    $http.post("/dash/reports/dealers", topCustomerSearchObj)
                        .success(function(response){
                            console.log(response)
                            $scope.dealerreport = response;

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

                    $http.post("/dash/reports/top/customer/count", topCustomerSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 2);
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

                    $scope.showTopCustomerFilter = true;

                    if($scope.dealerReportSearch.filter == '')
                        $scope.showTopCustomerFilter = false;

                    break;
                }
                case 3 : {

                    //.... Top Users...
                    topUserSearchObj.viewLength = 0;
                    topUserSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.sellerReportSearch.filter){
                        topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                        topUserSearchObj.searchBy = topSellerSearchBy;
                    }

                    $scope.sellerreport = [];

                    if($scope.applicationType == "StoreJini"){
                        $http.post("/dash/reports/storeJini/sellers", topUserSearchObj)
                            .success(function(response){
                                $scope.sellerreport = response;
                                $scope.reportsTransactionCount($scope.sellerreport.length, 3);

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

                    if($scope.applicationType != "StoreJini"){
                        $http.post("/dash/reports/sellers", topUserSearchObj)
                            .success(function(response){
                                $scope.sellerreport = response;

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

                        $http.post("/dash/reports/top/user/count", topUserSearchObj)
                            .success(function (res) {
                                $scope.reportsTransactionCount(res, 3);
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



                    $scope.showTopSellerFilter = true;

                    if($scope.sellerReportSearch.filter == '')
                        $scope.showTopSellerFilter = false;

                    break;
                }
                case 5 : {
                    //.... Payments Report...
                    paymentSearchObj.viewLength = 0;
                    paymentSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.paymentReportSearch.filter){
                        paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                        paymentSearchObj.searchBy = paymentSearchBy;
                    }

                    $scope.cashreport = [];

                    if($scope.applicationType != 'StoreJini'){
                        $http.post("/dash/reports/cashitems",paymentSearchObj)
                            .success(function(response){
                                var tempPaymentMode = [];
                                console.log(response);
                                $scope.cashreport = response;

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

                    if($scope.applicationType == 'StoreJini'){
                        $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                            .success(function(response){
                                $scope.cashreport = response;

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

                    $http.post("/dash/reports/payment/count", paymentSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 5);
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

                    $scope.showPaymentFilter = true;

                    if($scope.paymentReportSearch.filter == '')
                        $scope.showPaymentFilter = false;
                    break;
                }
                case 6 : {
                    checkinSearchObj.viewLength = 0;
                    checkinSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.cinreport.customerType = '';
                    $scope.cinreport.seller = '';
                    if($scope.checkInReportSearch.filter){
                        checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                        checkinSearchObj.searchBy = checkinDealerSearchBy;
                    }

                    $scope.checkInreport = [];


                    $http.post("/dash/reports/checkins",checkinSearchObj)
                        .success(function(response) {
                            $scope.checkInreport = response;

                            for(var i=0; i< $scope.checkInreport.length; i++){
                                if($scope.checkInreport[i].storeLat[0] && $scope.checkInreport[i].storeLong[0]){
                                    $scope.checkInreport[i].customerLocation = true;
                                    var slatlng = new google.maps.LatLng($scope.checkInreport[i].storeLat[0], $scope.checkInreport[i].storeLong[0]);
                                    var startLatLong;
                                    var endLatLong;
                                    //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                    if($scope.checkInreport[i].latitude[0] && $scope.checkInreport[i].longitude[0]
                                        && $scope.checkInreport[i].latitude[0] != 1 && $scope.checkInreport[i].longitude[0] != 1
                                        && $scope.checkInreport[i].latitude[0] != 2 && $scope.checkInreport[i].longitude[0] != 2
                                        && $scope.checkInreport[i].latitude[0] != 3 && $scope.checkInreport[i].longitude[0] != 3
                                        && $scope.checkInreport[i].latitude[0] != 4 && $scope.checkInreport[i].longitude[0] != 4){
                                        startLatLong = new google.maps.LatLng($scope.checkInreport[i].latitude[0], $scope.checkInreport[i].longitude[0]);
                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                        $scope.checkInreport[i].sVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                        $scope.checkInreport[i].startVisitLocation = true;
                                    }
                                    else{
                                        $scope.checkInreport[i].startVisitLocation = false;
                                        $scope.checkInreport[i].sVisitDist =
                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                    }

                                    if($scope.checkInreport[i].exitLat[0] && $scope.checkInreport[i].exitLong[0]
                                        && $scope.checkInreport[i].exitLat[0] != 1 && $scope.checkInreport[i].exitLong != 1
                                        && $scope.checkInreport[i].exitLat[0] != 2 && $scope.checkInreport[i].exitLong != 2
                                        && $scope.checkInreport[i].exitLat[0] != 3 && $scope.checkInreport[i].exitLong != 3
                                        && $scope.checkInreport[i].exitLat[0] != 4 && $scope.checkInreport[i].exitLong != 4){

                                        endLatLong = new google.maps.LatLng($scope.checkInreport[i].exitLat[0], $scope.checkInreport[i].exitLong[0]);
                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                        $scope.checkInreport[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                        $scope.checkInreport[i].endVisitLocation = true;
                                    }
                                    else{
                                        $scope.checkInreport[i].eVisitDist =
                                            ($scope.checkInreport[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                                ($scope.checkInreport[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                                    (($scope.checkInreport[i].exitLong[0] == 3 || $scope.checkInreport[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                        $scope.checkInreport[i].endVisitLocation = false;
                                    }
                                }
                                else{
                                    $scope.checkInreport[i].customerLocation = false;

                                    if($scope.checkInreport[i].latitude[0] == 1 ||
                                        $scope.checkInreport[i].latitude[0] == 2 ||
                                        $scope.checkInreport[i].latitude[0] == 3 ||
                                        $scope.checkInreport[i].latitude[0] == 4){
                                        $scope.checkInreport[i].startVisitLocation = false;
                                        $scope.checkInreport[i].sVisitDist =
                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                    }
                                    else{
                                        $scope.checkInreport[i].startVisitLocation = true;
                                    }
                                    if($scope.checkInreport[i].exitLat[0] == 1 ||
                                        $scope.checkInreport[i].exitLat[0] == 2 ||
                                        $scope.checkInreport[i].exitLat[0] == 3 ||
                                        $scope.checkInreport[i].exitLat[0] == 4){
                                        $scope.checkInreport[i].endVisitLocation = false;
                                        $scope.checkInreport[i].eVisitDist = ($scope.checkInreport[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                            ($scope.checkInreport[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                                (($scope.checkInreport[i].exitLat[0] == 3 || $scope.checkInreport[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                                    }
                                    else{

                                        if($scope.checkInreport[i].exitLat[0])
                                            $scope.checkInreport[i].endVisitLocation = true;
                                        else{ // Check if null?? if yes, it means that the user has not ended visit
                                            $scope.checkInreport[i].endVisitLocation = false;
                                            $scope.checkInreport[i].eVisitDist = 'Not Ended';
                                        }

                                    }

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

                    $http.post("/dash/reports/checkin/count", checkinSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 6);
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

                    $scope.showCheckinFilter = true;

                    if($scope.checkInReportSearch.filter == '')
                        $scope.showCheckinFilter = false;
                    break;
                }

                case 7 : {
                    //.... Expense Report
                    expenseSearchObj.viewLength = 0;
                    expenseSearchObj.viewBy = initialViewBy;

                    expenseSearchObj.eDate = '';
                    expenseSearchObj.sDate = '';

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.expenseReportSearch.filter){
                        expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                        expenseSearchObj.searchBy = expenseSearchBy;
                    }

                    $scope.expensereport = [];


                    $http.post("/dash/reports/expense",expenseSearchObj)
                        .success(function(response) {
                            $scope.expensereport = response;

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

                    $http.post("/dash/reports/expense/count", expenseSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 7);
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

                    $scope.showExpenseFilter = true;

                    if($scope.expenseReportSearch.filter == '')
                        $scope.showExpenseFilter = false;
                    break;
                }
                case 8 : {
                    //.... Meetings Report...
                    meetingSearchObj.viewLength = 0;
                    meetingSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.meetingsReportSearch.filter){
                        meetingSearchObj.searchFor = $scope.meetingsReportSearch.filter;
                        meetingSearchObj.searchBy = topDealerSearchBy;
                    }

                    $scope.meetingreport = [];



                    $http.post("/dash/reports/meeting", meetingSearchObj)
                        .success(function(response){
                            // console.log(response)
                            $scope.meetingreport = response;
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

                    $http.post("/dash/reports/meeting/count", meetingSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 8);
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

                    $scope.showMeetingFilter = true;

                    if($scope.meetingsReportSearch.filter == '')
                        $scope.showMeetingFilter = false;
                    break;
                }
                case 9 : {
                    //.... Items Not Billed....
                    skuSearchObj.viewLength = 0;
                    skuSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.skuReportFilter.filter){
                        skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                        skuSearchObj.searchBy = itemSearchBy;
                    }

                    $scope.skureport = [];


                    $http.post("/dash/reports/sku",skuSearchObj)
                        .success(function(response) {
                            $scope.skureport = response;
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


                    $http.post("/dash/reports/sku/count", skuSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 9);
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

                    $scope.showSkuFilter = true;

                    if($scope.skuReportFilter.filter == '')
                        $scope.showSkuFilter = false;
                    break;
                }
                case 10 : {

                    break;
                }
                case 11 : {

                    break;
                }
                case 12 : {

                    break;
                }
                case 13 : {
                    //... Employee Report....
                    employeeSearchObj.viewLength = 0;
                    employeeSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.cinemployeereport.filter){
                        employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                        employeeSearchObj.searchBy = employeeSearchBy;
                    }

                    $scope.checkInEmployeeTime = [];


                    $http.post("/dash/reports/employee",employeeSearchObj)
                        .success(function(response) {
                            $scope.checkInEmployeeTime = response;
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


                    $http.post("/dash/reports/employee/count", employeeSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 13);
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

                    $scope.showEmpFilter = true;

                    if($scope.cinemployeereport.filter == '')
                        $scope.showEmpFilter = false;
                    break;
                }
                case 14 : {

                    break;
                }
                case 15 : {
                    //.... Top Enquiry...
                    topEnquirySearchObj.viewLength = 0;
                    topEnquirySearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.enquiryReportSearch.filter){
                        topEnquirySearchObj.searchFor = $scope.enquiryReportSearch.filter;
                        topEnquirySearchObj.searchBy = enquirySearchBy;
                    }

                    $scope.enquiryreport = [];


                    $http.post("/dash/reports/storeJini/top/enquiry", topEnquirySearchObj)
                        .success(function(response){
                            $scope.enquiryreport = response;
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

                    // $http.post("/dash/reports/top/user/count", topEnquirySearchObj)
                    //     .success(function (res) {
                    //         $scope.reportsTransactionCount(res, 3);
                    //     })

                    $scope.showEnquirySellerFilter = true;

                    if($scope.enquiryReportSearch.filter == '')
                        $scope.showEnquirySellerFilter = false;
                    break;
                }
                case 16 : {
                    //... Target vs Achievements .....
                    targetAchievementSearchObj.viewLength = 0;
                    targetAchievementSearchObj.viewBy = initialViewBy;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if($scope.targetAchievementReportSearch.filter){
                        targetAchievementSearchObj.searchFor = $scope.targetAchievementReportSearch.filter;
                        targetAchievementSearchObj.searchBy = topSellerSearchBy;
                    }

                    $scope.targetAchievementreport = [];


                    $http.post("/dash/reports/storeJini/target/achievement", targetAchievementSearchObj)
                        .success(function(response){
                            $scope.targetAchievementreport = response;
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

                    // $http.post("/dash/reports/top/user/count", topEnquirySearchObj)
                    //     .success(function (res) {
                    //         $scope.reportsTransactionCount(res, 3);
                    //     })

                    $scope.showTargetAchievementFilter = true;

                    if($scope.targetAchievementReportSearch.filter == '')
                        $scope.showTargetAchievementFilter = false;
                    break;
                }

                case 17:
                    salesSearchObj.viewLength = 0;
                    salesSearchObj.viewBy = initialViewBy;
                    salesSearchObj.searchFor = [];
                    salesSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.salesReportSeach.filter = '';


                    $scope.salesreport = [];

                    $scope.showSalesFilter = false;

                    $http.post("/dash/reports/sales/orders", salesSearchObj)
                        .success(function(response){
                            $scope.salesreport = response;
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
                    $http.post("/dash/reports/sales/orders/count", salesSearchObj)
                        .success(function (response) {
                            $scope.reportsTransactionCount(response, 18);
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

                    break;

                case 18:
                    riderSearchObj.viewLength = 0;
                    riderSearchObj.viewBy = initialViewBy;
                    riderSearchObj.searchFor = [];
                    riderSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.salesReportSeach.filter = '';


                    $scope.ridersreport = [];

                    $scope.showSalesFilter = false;

                    $http.post("/dash/reports/riders/orders", riderSearchObj)
                        .success(function(response){
                            $scope.ridersreport = response;
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
                    $http.post("/dash/reports/riders/orders/count", riderSearchObj)
                        .success(function (response) {
                            $scope.reportsTransactionCount(response, 19);
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

                    break;

                case 19:
                    orderSummarySearchObj.viewLength = 0;
                    orderSummarySearchObj.viewBy = initialViewBy;
                    orderSummarySearchObj.searchFor = [];
                    orderSummarySearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.orderSearch.warehouse = '';

                    $scope.orderSummaryreport = [];

                    $scope.showOrderFilter = false;

                    $http.post("/dash/reports/order/summary", orderSummarySearchObj)
                        .success(function(response){
                            $scope.orderSummaryreport = response;
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
                    $http.post("/dash/reports/order/summary/count", orderSummarySearchObj)
                        .success(function (response) {
                            $scope.reportsTransactionCount(response, 24);
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

                    break;

                case 21:
                    $scope.riderCheckInreports = {};
                    $scope.riderCheckInreports.warehouse = '';
                    $scope.riderCheckInreports.fulfillmentStatus = '';
                    break;

                case 23:
                    $scope.riderActivityreports = {};
                    $scope.riderActivityreports.warehouse = '';
                    $scope.riderActivityreports.fulfillmentStatus = '';
                    break;


            }
        };


        $scope.changePaymentStatus =  function(order){
            var payment = {};
            payment.orderId = order._id ;
            payment.status = order.status ;

            $http.put("/dash/reports/payment/editstatus", payment)
                .success(function(res){
                    if(res){
                        Settings.success_toast("SUCCESS", "Status updated Successfully");
                    }
                    else{
                        Settings.fail_toast("ERROR", "Update unsuccessful. Please try again");
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

        $scope.clearFilter = function(tab){
            $scope.atdreports.startDate= new Date();
            $scope.atdreports.startDate.setDate($scope.atdreports.startDate.getDate()-3);
            $scope.atdreports.startDate.setHours(0,0,0,0);
            $scope.atdreports.endDate = new Date();
            $scope.atdreports.endDate.setHours(23,59,59,59);

            attSearchObj.sDate = $scope.DateTimeFormat($scope.atdreports.startDate, 'start');
            attSearchObj.eDate = $scope.DateTimeFormat($scope.atdreports.endDate, 'end');
            attSearchObj.viewLength = 0;
            attSearchObj.viewBy =initialViewBy;
            attSearchObj.searchFor = '';

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;
            $scope.AttendanceReportSearch.filter = '';
            $scope.attendancereport = [];

            $http.post("/dash/reports/attendance", attSearchObj)
                .success(function(response){
                    //console.log("GetAll Attendance reports-->");
                    //console.log(response)

                    response.sort(function(a, b) {
                        return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
                    });

                    $http.post("/dash/reports/attendance/count", attSearchObj)
                        .success(function(res){
                            $scope.transactionCount(res,3);
                        })


                    $scope.attendancereport = response;
                    allAttendance = response;

                    $scope.showAttendanceFilter = false;
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

        $scope.toggleDashboard = function(){
            $scope.showAtdDashboard = !$scope.showAtdDashboard;
            if(!$scope.showAtdDashboard)
                $scope.noAttendance();
        };

        $scope.IsAllCollapsed = false;

        $scope.collapseAll = function() {
            $scope.IsAllCollapsed = !$scope.IsAllCollapsed;
            $scope.itemreport.forEach(function(item) {
                item.isCollapsed = $scope.IsAllCollapsed;
            })
        }

        $scope.openFilterClear = function(tab){
            switch (tab) {
                case 1:
                    $scope.itemReportFilter.startDate='';
                    $scope.itemReportFilter.endDate='';
                    $scope.itemReportFilter.branchCode = '';
                    $scope.itemReportFilter.area = '';
                    $scope.itemReportFilter.region = '';
                    $scope.itemReportFilter.Manufacturer = '';
                    break;

                case 2:
                    $scope.dealerReportFilter.startDate = '';
                    $scope.dealerReportFilter.endDate = '';
                    $scope.dealerReportFilter.branchCode = '';
                    $scope.dealerReportFilter.seller = '';
                    $scope.dealerReportFilter.area = '';
                    $scope.dealerReportFilter.region = '';
                    $scope.dealerReportFilter.warehouse = '';

                    break;

                case 3:
                    $scope.sellerReportFilter.startDate = '';
                    $scope.sellerReportFilter.endDate = '';
                    $scope.sellerReportFilter.branchCode = '';
                    break;

                case 4:
                    $scope.orderReportFilter.startDate = '';
                    $scope.orderReportFilter.endDate = '';
                    $scope.orderReportFilter.branchCode = '';
                    $scope.orderReportFilter.status = '';
                    $scope.orderReportFilter.warehouse = '';
                    break;

                case 5:
                    $scope.paymentsreport.startDate = '';
                    $scope.paymentsreport.endDate = '';
                    $scope.paymentsreport.branchCode = '';
                    break;

                case 6:
                    $scope.cinreport.startDate = '';
                    $scope.cinreport.endDate = '';
                    $scope.cinreport.seller = '';
                    break ;

                case 7:
                    $scope.expreport.startDate = '';
                    $scope.expreport.endDate = '';
                    $scope.expreport.category = '';
                    $scope.expreport.branchCode = '';
                    break;

                case 8:
                    $scope.mtgreport.startDate = '';
                    $scope.mtgreport.endDate = '';
                    break;

                case 9:
                    
                    break;

                case 11:
                    $scope.atdreports.startDate = '';
                    $scope.atdreports.endDate = '';
                    break;

                case 12:
                    $scope.QuotationReportFilter.endDate = '';
                    break;

                case 13:
                    $scope.cinemployeereport.startDate = '';
                    $scope.cinemployeereport.endDate = '';
                    break;

                case 14:
                    // $scope.overallReportFilter.startDate = '';
                    // $scope.overallReportFilter.endDate = '';
                    $scope.overallReportFilter.seller = '';
                    $scope.overallReportFilter.filter = '';
                    $scope.overallReportFilter.stockist = '';
                    break;

                case 15:
                    $scope.enquiryReportFilter.startDate = '';
                    $scope.enquiryReportFilter.endDate = '';
                    $scope.enquiryReportFilter.branchCode = '';
                    break;

                case 16:
                    $scope.targetAchievementReportFilter.startDate = '';
                    $scope.targetAchievementReportFilter.endDate = '';
                    break;

                case 18:
                    $scope.riderCheckInreports.startDate = '';
                    $scope.riderCheckInreports.endDate = '';
                    $scope.riderCheckInreports.rider = '';
                    break ;

                case 19:
                    $scope.riderActivityreports.startDate = '';
                    $scope.riderActivityreports.rider = '';
                    $scope.riderActivityreports.customerVisits = 0;
                    break ;

                case 39:
                    $scope.customOrderFilter.startDate = '';
                    $scope.customOrderFilter.endDate = '';
                    $scope.customOrderFilter.plant = '';
                    $scope.customOrderFilter.plant_code = '';
                    $scope.customOrderFilter.state = '';

                    break ;
            }
        };

        //clear report search filter
        $scope.clearReportFilter = function(tab){
            switch(tab) {

                //CLear top sold
                case 1:
                    soldSearchObj.viewLength = 0;
                    soldSearchObj.viewBy = initialViewBy;
                    soldSearchObj.searchFor = [];
                    soldSearchObj.searchBy = [];

                    $scope.newViewBy = localViewBy;
                    $scope.itemReportSearch.filter = '';
                    $scope.itemReportFilter.warehouse = '';

                    $scope.itemreport = [];


                    $http.post("/dash/reports/items",soldSearchObj)
                        .success(function(response){
                            var tempArray = [];
                            $http.get("/dash/items")
                                .success(function (response) {
                                    for(var i = 0 ;i < response.length;i++){
                                        var temp = response[i].itemCode +'';
                                        tempArray[temp] = response[i].Manufacturer ;

                                    }
                                    sold();
                                });

                            function sold(){
                                for (var i = 0;i < response.length;i++){
                                    response[i].isCollapsed = false ;
                                    response[i].Manufacturer = tempArray[response[i]._id] ;
                                    var data = response[i].orderDetail ;
                                    var seen = {};
                                    data = data.filter(function(entry) {
                                        var previous;

                                        // Have we seen this label before?
                                        if (seen.hasOwnProperty(entry.seller)) {
                                            // Yes, grab it and add this data to it
                                            previous = seen[entry.seller];
                                            previous.quantity.push(parseInt(entry.quantity));
                                            previous.stockist.push({'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity)});

                                            // Don't keep this entry, we've merged it into the previous one
                                            return false;
                                        }

                                        // entry.data probably isn't an array; make it one for consistency
                                        if (!Array.isArray(entry.quantity)) {
                                            entry.quantity = [parseInt(entry.quantity)];
                                        }
                                        entry.stockist = [{'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity[0])}];


                                        // Remember that we've seen it
                                        seen[entry.seller] = entry;

                                        // Keep this one, we'll merge any others that match into it
                                        return true;
                                    });
                                    response[i].orderDetail = data ;
                                    for (var j=0; j < response[i].orderDetail.length ; j++){
                                        var a = response[i].orderDetail[j].quantity;
                                        response[i].orderDetail[j].quantity = a.reduce(function(a, b) { return a + b; }, 0);
                                        var stockist = response[i].orderDetail[j].stockist ;
                                        var temp = {};
                                        stockist = stockist.filter(function(entry) {
                                            var previous;

                                            // Have we seen this label before?
                                            if (temp.hasOwnProperty(entry.stockist)) {
                                                // Yes, grab it and add this data to it
                                                previous = temp[entry.stockist];
                                                previous.count.push(parseInt(entry.count));

                                                // Don't keep this entry, we've merged it into the previous one
                                                return false;
                                            }

                                            // entry.data probably isn't an array; make it one for consistency
                                            if (!Array.isArray(entry.count)) {
                                                entry.count = [parseInt(entry.count)];
                                            }

                                            // Remember that we've seen it
                                            temp[entry.stockist] = entry;

                                            // Keep this one, we'll merge any others that match into it
                                            return true;
                                        });
                                        response[i].orderDetail[j].stockist = stockist ;
                                        for(var k = 0 ; k < response[i].orderDetail[j].stockist.length; k++){
                                            var b = response[i].orderDetail[j].stockist[k].count;
                                            response[i].orderDetail[j].stockist[k].count = b.reduce(function(a, b) { return a + b; }, 0);


                                        }
                                    }
                                }
                                $scope.itemreport = response;
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

                    $http.post("/dash/reports/top/sold/count", soldSearchObj)
                        .success(function (response) {
                            $scope.reportsTransactionCount(response, 1);
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

                    $scope.showSoldFilter = false;

                    break;

                // top customer
                case 2:
                    topCustomerSearchObj.viewLength = 0;
                    topCustomerSearchObj.viewBy = initialViewBy;
                    topCustomerSearchObj.searchFor = [];
                    topCustomerSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.dealerReportSearch.filter = '';


                    $scope.dealerreport = [];



                    $http.post("/dash/reports/dealers", topCustomerSearchObj)
                        .success(function(response){
                            $scope.dealerreport = response;
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

                    $http.post("/dash/reports/top/customer/count", topCustomerSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 2);
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
                    $scope.showTopCustomerFilter = false;

                    break;

                //    top user
                case 3:
                    topUserSearchObj.viewLength = 0;
                    topUserSearchObj.viewBy = initialViewBy;
                    topUserSearchObj.searchFor = [];
                    topUserSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.sellerReportSearch.filter = '';


                    $scope.sellerreport = [];

                    if($scope.applicationType == "StoreJini"){
                        $http.post("/dash/reports/storeJini/sellers", topUserSearchObj)
                            .success(function(response){
                                $scope.sellerreport = response;
                                $scope.reportsTransactionCount($scope.sellerreport.length, 3);
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

                    if($scope.applicationType != "StoreJini"){
                        $http.post("/dash/reports/sellers", topUserSearchObj)
                            .success(function(response){
                                $scope.sellerreport = response;
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

                        $http.post("/dash/reports/top/user/count", topUserSearchObj)
                            .success(function (res) {
                                $scope.reportsTransactionCount(res, 3);
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

                    $scope.showTopSellerFilter = false;

                    break;

                //    payments
                case 5:
                    paymentSearchObj.viewLength = 0;
                    paymentSearchObj.viewBy = initialViewBy;
                    paymentSearchObj.searchFor = [];
                    paymentSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.paymentReportSearch.filter = '';


                    $scope.cashreport = [];


                    if($scope.applicationType != 'StoreJini'){
                        $http.post("/dash/reports/cashitems",paymentSearchObj)
                            .success(function(response){
                                var tempPaymentMode = [];
                                $scope.cashreport = response;
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

                    if($scope.applicationType == 'StoreJini'){
                        $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                            .success(function(response){
                                var tempPaymentMode = [];
                                $scope.cashreport = response;

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

                    $http.post("/dash/reports/payment/count", paymentSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 5);
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

                    $scope.showPaymentFilter = false;

                    break;

                //    checkins

                case 6:
                    checkinSearchObj.viewLength = 0;
                    checkinSearchObj.viewBy = initialViewBy;
                    checkinSearchObj.searchFor = [];
                    checkinSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.checkInReportSearch.filter = '';


                    $scope.checkInreport = [];


                    $http.post("/dash/reports/checkins",checkinSearchObj)
                        .success(function(response) {
                            $scope.checkInreport = response;
                            for(var i=0; i< $scope.checkInreport.length; i++){
                                if($scope.checkInreport[i].storeLat[0] && $scope.checkInreport[i].storeLong[0]){
                                    $scope.checkInreport[i].customerLocation = true;
                                    var slatlng = new google.maps.LatLng($scope.checkInreport[i].storeLat[0], $scope.checkInreport[i].storeLong[0]);
                                    var startLatLong;
                                    var endLatLong;
                                    //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                    if($scope.checkInreport[i].latitude[0] && $scope.checkInreport[i].longitude[0]
                                        && $scope.checkInreport[i].latitude[0] != 1 && $scope.checkInreport[i].longitude[0] != 1
                                        && $scope.checkInreport[i].latitude[0] != 2 && $scope.checkInreport[i].longitude[0] != 2
                                        && $scope.checkInreport[i].latitude[0] != 3 && $scope.checkInreport[i].longitude[0] != 3
                                        && $scope.checkInreport[i].latitude[0] != 4 && $scope.checkInreport[i].longitude[0] != 4){
                                        startLatLong = new google.maps.LatLng($scope.checkInreport[i].latitude[0], $scope.checkInreport[i].longitude[0]);
                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                        $scope.checkInreport[i].sVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                        $scope.checkInreport[i].startVisitLocation = true;
                                    }
                                    else{
                                        $scope.checkInreport[i].startVisitLocation = false;
                                        $scope.checkInreport[i].sVisitDist =
                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                    }

                                    if($scope.checkInreport[i].exitLat[0] && $scope.checkInreport[i].exitLong[0]
                                        && $scope.checkInreport[i].exitLat[0] != 1 && $scope.checkInreport[i].exitLong != 1
                                        && $scope.checkInreport[i].exitLat[0] != 2 && $scope.checkInreport[i].exitLong != 2
                                        && $scope.checkInreport[i].exitLat[0] != 3 && $scope.checkInreport[i].exitLong != 3
                                        && $scope.checkInreport[i].exitLat[0] != 4 && $scope.checkInreport[i].exitLong != 4){

                                        endLatLong = new google.maps.LatLng($scope.checkInreport[i].exitLat[0], $scope.checkInreport[i].exitLong[0]);
                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                        $scope.checkInreport[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                        $scope.checkInreport[i].endVisitLocation = true;
                                    }
                                    else{
                                        $scope.checkInreport[i].eVisitDist =
                                            ($scope.checkInreport[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                                ($scope.checkInreport[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                                    (($scope.checkInreport[i].exitLong[0] == 3 || $scope.checkInreport[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                        $scope.checkInreport[i].endVisitLocation = false;
                                    }
                                }
                                else{
                                    $scope.checkInreport[i].customerLocation = false;

                                    if($scope.checkInreport[i].latitude[0] == 1 ||
                                        $scope.checkInreport[i].latitude[0] == 2 ||
                                        $scope.checkInreport[i].latitude[0] == 3 ||
                                        $scope.checkInreport[i].latitude[0] == 4){
                                        $scope.checkInreport[i].startVisitLocation = false;
                                        $scope.checkInreport[i].sVisitDist =
                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                    }
                                    else{
                                        $scope.checkInreport[i].startVisitLocation = true;
                                    }
                                    if($scope.checkInreport[i].exitLat[0] == 1 ||
                                        $scope.checkInreport[i].exitLat[0] == 2 ||
                                        $scope.checkInreport[i].exitLat[0] == 3 ||
                                        $scope.checkInreport[i].exitLat[0] == 4){
                                        $scope.checkInreport[i].endVisitLocation = false;
                                        $scope.checkInreport[i].eVisitDist = ($scope.checkInreport[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                            ($scope.checkInreport[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                                (($scope.checkInreport[i].exitLat[0] == 3 || $scope.checkInreport[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                                    }
                                    else{

                                        if($scope.checkInreport[i].exitLat[0])
                                            $scope.checkInreport[i].endVisitLocation = true;
                                        else{ // Check if null?? if yes, it means that the user has not ended visit
                                            $scope.checkInreport[i].endVisitLocation = false;
                                            $scope.checkInreport[i].eVisitDist = 'Not Ended';
                                        }

                                    }

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


                    $http.post("/dash/reports/checkin/count", checkinSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 6);
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

                    $scope.showCheckinFilter = false;

                    break;

                //    expense

                case 7:
                    expenseSearchObj.viewLength = 0;
                    expenseSearchObj.viewBy = initialViewBy;
                    expenseSearchObj.searchFor = [];
                    expenseSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.expenseReportSearch.filter = '';


                    $scope.expensereport = [];


                    $http.post("/dash/reports/expense",expenseSearchObj)
                        .success(function(response) {
                            $scope.expensereport = response;
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


                    $http.post("/dash/reports/expense/count", expenseSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 7);
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

                    $scope.showExpenseFilter = false;

                    break;

                //    meetings

                case 8:
                    meetingSearchObj.viewLength = 0;
                    meetingSearchObj.viewBy = initialViewBy;
                    meetingSearchObj.searchFor = [];
                    meetingSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.meetingsReportSearch.filter = '';

                    $scope.meetingreport = [];



                    $http.post("/dash/reports/meeting", meetingSearchObj)
                        .success(function(response){
                            $scope.meetingreport = response;
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

                    $http.post("/dash/reports/meeting/count", meetingSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 8);
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

                    $scope.showMeetingFilter = false;

                    break;

                // items not billed

                case 9:
                    skuSearchObj.viewLength = 0;
                    skuSearchObj.viewBy = initialViewBy;
                    skuSearchObj.searchFor = [];
                    skuSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.skuReportFilter.filter = '';


                    $scope.skureport = [];


                    $http.post("/dash/reports/sku",skuSearchObj)
                        .success(function(response) {
                            $scope.skureport = response;
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


                    $http.post("/dash/reports/sku/count", skuSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 9);
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

                    $scope.showSkuFilter = false;

                    break;

                //   employee time

                case 13:
                    employeeSearchObj.viewLength = 0;
                    employeeSearchObj.viewBy = initialViewBy;
                    employeeSearchObj.searchFor = [];
                    employeeSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.cinemployeereport.filter = '';


                    $scope.checkInEmployeeTime = [];


                    $http.post("/dash/reports/employee",employeeSearchObj)
                        .success(function(response) {
                            $scope.checkInEmployeeTime = response;
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


                    $http.post("/dash/reports/employee/count", employeeSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 13);
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

                    $scope.showEmpFilter = false;

                    break;

                //    top Enquiry

                case 15:
                    topEnquirySearchObj.viewLength = 0;
                    topEnquirySearchObj.viewBy = initialViewBy;
                    topEnquirySearchObj.searchFor = [];
                    topEnquirySearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.enquiryReportSearch.filter = '';


                    $scope.enquiryreport = [];


                    $http.post("/dash/reports/storeJini/top/enquiry", topEnquirySearchObj)
                        .success(function(response){
                            $scope.enquiryreport = response;
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

                    $scope.showEnquirySellerFilter = false;

                    break;

                case 16:
                    targetAchievementSearchObj.viewLength = 0;
                    targetAchievementSearchObj.viewBy = initialViewBy;
                    targetAchievementSearchObj.searchFor = [];
                    targetAchievementSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.targetAchievementReportSearch.filter = '';


                    $scope.targetAchievementreport = [];


                    $http.post("/dash/reports/storeJini/target/achievement", targetAchievementSearchObj)
                        .success(function(response){
                            $scope.targetAchievementreport = response;
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

                    $scope.showTargetAchievementFilter = false;

                    break;

                case 17:
                    salesSearchObj.viewLength = 0;
                    salesSearchObj.viewBy = initialViewBy;
                    salesSearchObj.searchFor = [];
                    salesSearchObj.searchBy = [];


                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.salesReportSeach.filter = '';


                    $scope.salesreport = [];

                    $scope.showSalesFilter = false;

                    $http.post("/dash/reports/sales/orders", salesSearchObj)
                        .success(function(response){
                            $scope.salesreport = response;
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

                    $http.post("/dash/reports/sales/orders/count", salesSearchObj)
                        .success(function (response) {
                            $scope.reportsTransactionCount(response, 18);
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

                    break;
            }

        }

        $scope.changeReportDuration = function(startDate, endDate , index, reset){
            if(endDate)
                endDate.setHours(23, 59, 59, 59);

            if(!reset) {
                if(startDate || endDate){
                    if (startDate && endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(endDate);
                        var numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else if (!endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(new Date());
                        var numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else
                        var numberOfDays = 0;

                    switch (index) {
                        case 1:
                            $scope.topSoldDuration = numberOfDays;
                            break;
                        case 2:
                            $scope.topDealersDuration = numberOfDays;
                            break;
                        case 3:
                            $scope.topSellerDuration = numberOfDays;
                            break;
                        case 4:
                            $scope.summaryDuration = numberOfDays;
                            break;
                        case 5:
                            $scope.paymentDuration = numberOfDays;
                            break;
                        case 6:
                            $scope.checkinDuration = numberOfDays;
                            break;
                        case 7:
                            $scope.expenseDuration = numberOfDays;
                            break;
                        case 8:
                            $scope.meetingDuration = numberOfDays;
                            break;
                        case 9:
                            $scope.skuDuration = numberOfDays;
                            break;
                        case 10:
                            $scope.visitDuration = numberOfDays;
                            break;

                        case 11:
                            $scope.attendanceDuration = numberOfDays;
                            break;

                        case 12:
                            $scope.leaveDuration = numberOfDays;
                            break;
                        case 13:
                            $scope.topEnquiryDuration = numberOfDays;
                            break;
                        case 14:
                            $scope.atmsReportsDuration = numberOfDays;
                            break;
                        case 15:
                            $scope.atmsIndividualReportDays = numberOfDays;
                            break;
                        case 16:
                            $scope.atmsDashboardReportDays = numberOfDays;
                            break;
                        case 17:
                            $scope.salesDuration = numberOfDays;
                            break;
                        case 18:
                            $scope.overallDuration = numberOfDays;
                            break;
                        case 21:
                            $scope.riderCheckinDuration = numberOfDays;
                            break;
                        case 24:
                            $scope.orderSummaryDuration = numberOfDays;
                            break;
                        case 39:
                            $scope.customOrderDuration = numberOfDays;
                            break;
                    }
                }
            }
            else{
                switch (index) {
                    case 1:
                        $scope.topSoldDuration = 0;
                        break;
                    case 2:
                        $scope.topDealersDuration = 0;
                        break;
                    case 3:
                        $scope.topSellerDuration = 0;
                        break;
                    case 4:
                        $scope.summaryDuration = 0;
                        break;
                    case 5:
                        $scope.paymentDuration = 0;
                        break;
                    case 6:
                        $scope.checkinDuration = 0;
                        break;
                    case 7:
                        $scope.expenseDuration = 0;
                        break;
                    case 8:
                        $scope.meetingDuration = 0;
                        break;
                    case 9:
                        $scope.skuDuration = 0;
                        break;
                    case 10:
                        $scope.visitDuration = 0;
                        break;
                    case 11:
                        $scope.attendanceDuration = 0;
                        break;

                    case 12 :
                        $scope.leaveDuration = 0;
                        break;

                    case 13:
                        $scope.topEnquiryDuration = 0;
                        break;
                    case 17:
                        $scope.salesDuration = 0;
                        break;
                    case 18:
                        $scope.overallDuration = 0;
                        break;
                    case 21:
                        $scope.riderCheckinDuration = 0;
                        break;
                    case 24:
                        $scope.orderSummaryDuration = 0;
                        break;
                    case 39:
                        $scope.customOrderDuration = 0;
                        break;

                }
            }
        };

        $scope.clearSalesReport = function (){
            $scope.salesReportFilter = {};
            $scope.salesReportFilter.startDate = '';
            $scope.salesReportFilter.endDate = '';
        };

        $scope.clearRiderReport = function (){
            // $scope.ridersReportFilter = {};
            // $scope.ridersReportFilter.startDate = '';
            // $scope.ridersReportFilter.endDate = '';
            $scope.ridersReportFilter.fulfiller = 0;
            $scope.ridersReportFilter.warehouse = '';
            $scope.ridersReportFilter.fulfillmentStatus = '';
            $scope.ridersReportSeach.filter = '';
            $scope.changeReportView(20);
        };
        $scope.clearHubReport = function (){
            $scope.showHubFilter = false;
            $scope.displayReport = '';
            $scope.hubReportFilter = {};
            $scope.hubReportFilter.startDate = '';
            $scope.hubReportFilter.endDate = '';
            $scope.hubReportFilter.filter = '';
            $scope.changeReportView(22);
        };

        //Draw a pie chart for Attendance - Nithish
        $scope.attendanceUser = {};
        $scope.drawAtdChart = function(){
            $scope.attendanceUser = {};
            $scope.attendanceUser.punchIn = 0;
            $scope.attendanceUser.punchOut = 0;

            var punchIn = 0;
            var punchIn_1 = 0;
            var punchIn_2 = 0;
            var punchIn_3 = 0;

            var punchOut = 0;
            var punchOut_1 = 0;
            var punchOut_2 = 0;
            var punchOut_3 = 0;

            var barGraph_In = [];
            barGraph_In[0] = {};
            barGraph_In[0].pIn = 0;
            barGraph_In[0].pIn_1 = 0;
            barGraph_In[0].pIn_2 = 0;
            barGraph_In[0].pIn_3 = 0;

            barGraph_In[1] = {};
            barGraph_In[1].pIn = 0;
            barGraph_In[1].pIn_1 = 0;
            barGraph_In[1].pIn_2 = 0;
            barGraph_In[1].pIn_3 = 0;

            barGraph_In[2] = {};
            barGraph_In[2].pIn = 0;
            barGraph_In[2].pIn_1 = 0;
            barGraph_In[2].pIn_2 = 0;
            barGraph_In[2].pIn_3 = 0;

            var barGraph_Out = [];
            barGraph_Out[0] = {};
            barGraph_Out[0].pIn = 0;
            barGraph_Out[0].pIn_1 = 0;
            barGraph_Out[0].pIn_2 = 0;
            barGraph_Out[0].pIn_3 = 0;

            barGraph_Out[1] = {};
            barGraph_Out[1].pIn = 0;
            barGraph_Out[1].pIn_1 = 0;
            barGraph_Out[1].pIn_2 = 0;
            barGraph_Out[1].pIn_3 = 0;

            barGraph_Out[2] = {};
            barGraph_Out[2].pIn = 0;
            barGraph_Out[2].pIn_1 = 0;
            barGraph_Out[2].pIn_2 = 0;
            barGraph_Out[2].pIn_3 = 0;

            var todayDate = new Date();
            for(var i=0; i<$scope.attendanceChartReport.length; i++){

                if($scope.attendanceChartReport[i].intime[0]){
                    if($scope.attendanceChartReport[i].latitude[0] == 1)
                        punchIn_1++;
                    else if($scope.attendanceChartReport[i].latitude[0] == 2)
                        punchIn_2++;
                    else if($scope.attendanceChartReport[i].latitude[0] == 3 || $scope.attendanceChartReport[i].latitude[0] == 4)
                        punchIn_3++;
                    else
                        punchIn++;
                }

                if($scope.attendanceChartReport[i].outtime[0]){
                    if($scope.attendanceChartReport[i].punch_out_lat[0] == 1)
                        punchOut_1++;
                    else if($scope.attendanceChartReport[i].punch_out_lat[0] == 2)
                        punchOut_2++;
                    else if($scope.attendanceChartReport[i].punch_out_lat[0] == 3 || $scope.attendanceChartReport[i].punch_out_lat[0] == 4)
                        punchOut_3++;
                    else
                        punchOut++;
                }

            }

            $scope.attendanceUser.punchIn = punchIn + punchIn_1 + punchIn_2 + punchIn_3;
            $scope.attendanceUser.punchOut = punchOut + punchOut_1 + punchOut_2 + punchOut_3;


            var tempDate = new Date($scope.atdChartReport.endDate);
            var tempDate_1 = new Date($scope.atdChartReport.endDate);
            tempDate_1.setDate(tempDate_1.getDate() - 1)
            var tempDate_2 = new Date($scope.atdChartReport.endDate);
            tempDate_2.setDate(tempDate_2.getDate() - 2)


            barGraph_In[0].date = $scope.formatDate(tempDate)
            barGraph_In[1].date = $scope.formatDate(tempDate_1)
            barGraph_In[2].date = $scope.formatDate(tempDate_2)

            barGraph_Out[0].date = $scope.formatDate(tempDate)
            barGraph_Out[1].date = $scope.formatDate(tempDate_1)
            barGraph_Out[2].date = $scope.formatDate(tempDate_2)


            //console.log($scope.attendanceChartReport)
            //console.log(allAttendanceRecords)
            for(var i=0; i< allAttendanceRecords.length; i++){
                var d = new Date(allAttendanceRecords[i].date_added[0]);
                if(allAttendanceRecords[i].intime[0]){
                    if((master_date_added.date == d.getDate()) && (master_date_added.month == d.getMonth()) && (master_date_added.year == d.getFullYear())){
                        if(allAttendanceRecords[i].latitude[0] == 1)
                            barGraph_In[0].pIn_1++;
                        else if(allAttendanceRecords[i].latitude[0] == 2)
                            barGraph_In[0].pIn_2++;
                        else if(allAttendanceRecords[i].latitude[0] == 3 || allAttendanceRecords[i].latitude[0] == 4)
                            barGraph_In[0].pIn_3++;
                        else
                            barGraph_In[0].pIn++;
                    }
                    else if((master_date_added.date_1 == d.getDate()) && (master_date_added.month_1 == d.getMonth()) && (master_date_added.year_1 == d.getFullYear())){
                        if(allAttendanceRecords[i].latitude[0] == 1)
                            barGraph_In[1].pIn_1++;
                        else if(allAttendanceRecords[i].latitude[0] == 2)
                            barGraph_In[1].pIn_2++;
                        else if(allAttendanceRecords[i].latitude[0] == 3 || allAttendanceRecords[i].latitude[0] == 4)
                            barGraph_In[1].pIn_3++;
                        else
                            barGraph_In[1].pIn++;
                    }
                    else if((master_date_added.date_2 == d.getDate()) && (master_date_added.month_2 == d.getMonth()) && (master_date_added.year_2 == d.getFullYear())){
                        if(allAttendanceRecords[i].latitude[0] == 1)
                            barGraph_In[2].pIn_1++;
                        else if(allAttendanceRecords[i].latitude[0] == 2)
                            barGraph_In[2].pIn_2++;
                        else if(allAttendanceRecords[i].latitude[0] == 3 || allAttendanceRecords[i].latitude[0] == 4)
                            barGraph_In[2].pIn_3++;
                        else
                            barGraph_In[2].pIn++;
                    }
                }

                if(allAttendanceRecords[i].outtime[0]){
                    if((master_date_added.date == d.getDate()) && (master_date_added.month == d.getMonth()) && (master_date_added.year == d.getFullYear())){
                        if(allAttendanceRecords[i].punch_out_lat[0] == 1)
                            barGraph_Out[0].pIn_1++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 2)
                            barGraph_Out[0].pIn_2++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 3 || allAttendanceRecords[i].punch_out_lat[0] == 4)
                            barGraph_Out[0].pIn_3++;
                        else
                            barGraph_Out[0].pIn++;
                    }
                    else if((master_date_added.date_1 == d.getDate()) && (master_date_added.month_1 == d.getMonth()) && (master_date_added.year_1 == d.getFullYear())){
                        if(allAttendanceRecords[i].punch_out_lat[0] == 1)
                            barGraph_Out[1].pIn_1++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 2)
                            barGraph_Out[1].pIn_2++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 3 || allAttendanceRecords[i].punch_out_lat[0] == 4)
                            barGraph_Out[1].pIn_3++;
                        else
                            barGraph_Out[1].pIn++;
                    }
                    else if((master_date_added.date_2 == d.getDate()) && (master_date_added.month_2 == d.getMonth()) && (master_date_added.year_2 == d.getFullYear())){
                        if(allAttendanceRecords[i].punch_out_lat[0] == 1)
                            barGraph_Out[2].pIn_1++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 2)
                            barGraph_Out[2].pIn_2++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 3 || allAttendanceRecords[i].punch_out_lat[0] == 4)
                            barGraph_Out[2].pIn_3++;
                        else
                            barGraph_Out[2].pIn++;
                    }
                }
            }


            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart(){

                //........Punch In pie chart......//
                var punchInData = google.visualization.arrayToDataTable([
                    ['Punch-In', '%'],
                    ['Location OK ('+punchIn+')', punchIn],
                    ['User Denied Permission ('+punchIn_1+')', punchIn_1],
                    ['GPS Error ('+punchIn_2+')',  punchIn_2],
                    ['Device GPS - OFF ('+punchIn_3+')', punchIn_3]
                ]);
                var punchInoptions = {
                    legend : {position : 'top', alignment : 'center'},
                    pieSliceText : 'value',
                    slices : [{color : 'green'}, {color : 'red'}, {color: 'yellow'}, {color: 'orange'}],
                    chartArea : {width : '100%', height:'70%'},
                    pieHole : '0.3'
                };
                var punchInchart = new google.visualization.PieChart(document.getElementById('atd_PunchIn_PieChart'));


                // //........Punch Out pie chart....//
                var punchOutData = google.visualization.arrayToDataTable([
                    ['Punch-Out', '%'],
                    ['Location OK ('+punchOut+')', punchOut],
                    ['User Denied Permission ('+punchOut_1+')', punchOut_1],
                    ['GPS Error ('+punchOut_2+')',  punchOut_2],
                    ['Device GPS - OFF ('+punchOut_3+')', punchOut_3]
                ]);
                var punchOutchart = new google.visualization.PieChart(document.getElementById('atd_PunchOut_PieChart'));


                // //.......Punch in bar graph.......//
                var punchInBarDate = google.visualization.arrayToDataTable([
                    ['Date','Location OK','User Denied Permission','GPS Error','Device GPS - OFF'],
                    [barGraph_In[2].date, barGraph_In[2].pIn, barGraph_In[2].pIn_1, barGraph_In[2].pIn_2, barGraph_In[2].pIn_3],
                    [barGraph_In[1].date, barGraph_In[1].pIn, barGraph_In[1].pIn_1, barGraph_In[1].pIn_2, barGraph_In[1].pIn_3],
                    [barGraph_In[0].date, barGraph_In[0].pIn, barGraph_In[0].pIn_1, barGraph_In[0].pIn_2, barGraph_In[0].pIn_3]
                ])
                var punchInBarOptions = {
                    vAxis: {title: '# of Users'},
                    hAxis: {title: 'Date'},
                    seriesType: 'bars',
                    series: [
                        {color: 'green'},
                        {color: 'red'},
                        {color: 'yellow'},
                        {color: 'orange'}
                    ],
                    legend : {position : 'top', alignment : 'center'}
                };
                var punchInBarChart = new google.visualization.ComboChart(document.getElementById('atd_PunchIn_BarChart'));
                punchInBarChart.draw(punchInBarDate, punchInBarOptions);


                //.......Punch out bar graph.......//
                var punchOutBarDate = google.visualization.arrayToDataTable([
                    ['Date','Location OK','User Denied Permission','GPS Error','Device GPS - OFF'],
                    [barGraph_Out[2].date, barGraph_Out[2].pIn, barGraph_Out[2].pIn_1, barGraph_Out[2].pIn_2, barGraph_Out[2].pIn_3],
                    [barGraph_Out[1].date, barGraph_Out[1].pIn, barGraph_Out[1].pIn_1, barGraph_Out[1].pIn_2, barGraph_Out[1].pIn_3],
                    [barGraph_Out[0].date, barGraph_Out[0].pIn, barGraph_Out[0].pIn_1, barGraph_Out[0].pIn_2, barGraph_Out[0].pIn_3]
                ])
                var punchOutBarOptions = {
                    vAxis: {title: '# of Users'},
                    hAxis: {title: 'Date'},
                    seriesType: 'bars',
                    series: [
                        {color: 'green'},
                        {color: 'red'},
                        {color: 'yellow'},
                        {color: 'orange'}
                    ],
                    legend : {position : 'top', alignment : 'center'}
                };
                var punchOutBarChart = new google.visualization.ComboChart(document.getElementById('atd_PunchOut_BarChart'));
                punchOutBarChart.draw(punchOutBarDate, punchOutBarOptions);

                if(punchIn || punchIn_1 || punchIn_2 || punchIn_3)
                    punchInchart.draw(punchInData, punchInoptions);
                else{
                    jQuery.noConflict();
                    $("#atd_PunchIn_PieChart").html("<br><br><h5 style='text-align:center; margin:0px;'>No punch-in</h5><br><br>")
                }

                if(punchOut || punchOut_1 || punchOut_2 || punchOut_3)
                    punchOutchart.draw(punchOutData, punchInoptions);
                else{
                    jQuery.noConflict();
                    $("#atd_PunchOut_PieChart").html("<br><br><h5 style='text-align:center; margin:0px;'>No punch-out</h5><br><br>")
                    var tempHt = $("#atd_PunchIn_PieChart").height();
                    $("#atd_PunchOut_PieChart").height(tempHt);
                }



                google.visualization.events.addListener(punchInchart, 'select', function(){
                    $scope.atdModalData = [];
                    $scope.atdLocationErrorCode = '';
                    //console.log(punchInchart.getSelection()[0]);
                    var errorType = punchInchart.getSelection()[0].row;

                    if(errorType == 0){
                        //console.log("Location OK")
                        $scope.atdLocationErrorCode = 'LOCATION OK';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] != 1 && $scope.attendanceChartReport[i].latitude[0] != 2 && $scope.attendanceChartReport[i].latitude[0] != 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }

                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 1){
                        //console.log("Denied permission")
                        $scope.atdLocationErrorCode = 'USER DENIED PERMISSION';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] == 1){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 2){
                        //console.log("GPS error")
                        $scope.atdLocationErrorCode = 'GPS ERROR';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] == 2){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 3){
                        //console.log("Device GPS off")
                        $scope.atdLocationErrorCode = 'DEVICE GPS - OFF';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] == 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }

                    jQuery.noConflict();
                    $('#atdLocationErrorModal').modal('show');


                });

                google.visualization.events.addListener(punchOutchart, 'select', function(){
                    //console.log(punchOutchart.getSelection()[0]);
                    $scope.atdModalData = [];
                    $scope.atdLocationErrorCode = '';
                    //console.log(punchInchart.getSelection()[0]);
                    var errorType = punchOutchart.getSelection()[0].row;

                    if(errorType == 0){
                        //console.log("Location OK")
                        $scope.atdLocationErrorCode = 'LOCATION OK';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] != 1 && $scope.attendanceChartReport[i].punch_out_lat[0] != 2 && $scope.attendanceChartReport[i].punch_out_lat[0] != 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }

                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 1){
                        //console.log("Denied permission")
                        $scope.atdLocationErrorCode = 'USER DENIED PERMISSION';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] == 1){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 2){
                        //console.log("GPS error")
                        $scope.atdLocationErrorCode = 'GPS ERROR';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] == 2){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 3){
                        //console.log("Device GPS off")
                        $scope.atdLocationErrorCode = 'DEVICE GPS - OFF';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] == 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }

                    jQuery.noConflict();
                    $('#atdLocationErrorModal').modal('show');
                });

            }
        }

        $scope.parseData = function(viewLength, newViewBy){
            // console.log(typeof viewLength);
            // console.log(typeof newViewBy);

            return parseInt(viewLength) + parseInt(newViewBy);
        }


        $scope.paymentMode = [];

        $scope.dateWise = false;
        $scope.dateWiseSummary = function(value){
            if(value){
                $scope.dateWise = true;
                $scope.changeReportView(14);
            }else{
                $scope.dateWise = false;
                $scope.changeReportView(14);
            }
        }

        $scope.changeAtdChart = function(dir){
            $scope.attendanceChartReport = [];
            allAttendanceRecords = [];
            if(dir){
                var tempEndDate = $scope.atdChartReport.endDate;
                tempEndDate.setDate(tempEndDate.getDate() + 1);
                var tempStartDate = $scope.atdChartReport.startDate;
                tempStartDate.setDate(tempStartDate.getDate() + 1);

                $scope.atdChartReport.endDate = tempEndDate;
                $scope.atdChartReport.startDate = tempStartDate;

                getMaster_Date_added(tempEndDate);


                attSearchObj.sDate = $scope.DateTimeFormat(tempStartDate, 'start');
                attSearchObj.eDate = $scope.DateTimeFormat(tempEndDate, 'end');
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy =initialViewBy;
                attSearchObj.searchFor = '';


                $http.post("/dash/reports/attendance", attSearchObj)
                    .success(function(res){

                        allAttendanceRecords = res;
                        for(i=0; i< res.length; i++){
                            if(res[i].date_added[0]){
                                var d = new Date(res[i].date_added[0]);
                                var date = {};
                                date.date = d.getDate();
                                date.month = d.getMonth();

                                if((d.getDate() == master_date_added.date) && (d.getMonth() == master_date_added.month) && (d.getFullYear() == master_date_added.year)){
                                    $scope.attendanceChartReport.push(res[i]);
                                }
                            }
                        }
                        $scope.drawAtdChart();
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

                var tempEndDate = $scope.atdChartReport.endDate;
                tempEndDate.setDate(tempEndDate.getDate() - 1);
                var tempStartDate = $scope.atdChartReport.startDate;
                tempStartDate.setDate(tempStartDate.getDate() - 1);

                $scope.atdChartReport.endDate = tempEndDate;
                $scope.atdChartReport.startDate = tempStartDate;

                getMaster_Date_added(tempEndDate);


                attSearchObj.sDate = $scope.DateTimeFormat(tempStartDate, 'start');
                attSearchObj.eDate = $scope.DateTimeFormat(tempEndDate, 'end');
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy =initialViewBy;
                attSearchObj.searchFor = '';


                $http.post("/dash/reports/attendance", attSearchObj)
                    .success(function(res){

                        allAttendanceRecords = res;
                        for(i=0; i< res.length; i++){
                            if(res[i].date_added[0]){
                                var d = new Date(res[i].date_added[0]);
                                var date = {};
                                date.date = d.getDate();
                                date.month = d.getMonth();

                                if((d.getDate() == master_date_added.date) && (d.getMonth() == master_date_added.month) && (d.getFullYear() == master_date_added.year)){
                                    $scope.attendanceChartReport.push(res[i]);
                                }
                            }
                        }
                        $scope.drawAtdChart();
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
        }


        $scope.attendance_address = '';
        $scope.renderMaps_attendance = function(order, flag, i) {

            $scope.selectedOrder = '';
            $scope.maps_users = [];
            $scope.mapOrders = [];
            $scope.mapsOrdersAll = [];
            var gmarkers = [];
            var waypts = [];


            var icons = [];

            icons['Attendance'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';


            $scope.mapsFilter.to.setHours(23, 59, 59, 59);
            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 4;

            $scope.mapsOrdersAll_attendance = order;
            $scope.mapNoLocation = 0;

            if(order){
                if(!flag){

                    if (order.latitude[0] != 0 && order.latitude[0] != "" && order.longitude[0] != 0 && order.longitude[0] != ""
                        && order.latitude[0] != "undefined" && order.longitude[0] != "undefined"
                        && order.latitude[0] != 1 && order.latitude[0] != 2 && order.latitude[0] != 3 && order.latitude[0] !=4
                        && order.longitude[0] != 1 && order.longitude[0] != 2 && order.longitude[0] != 3 && order.longitude[0] != 4) {

                        latlng = new google.maps.LatLng(order.latitude[0], order.longitude[0]);
                        zoomLevel = 14;

                        if (order.itemcode == 'ATD') {
                            order.type = [];
                            order.type[0] = 'Attendance';

                            $scope.mapOrders.push(order);
                            //console.log($scope.mapOrders)
                        }
                        else {
                            $scope.mapOrders.push(order);
                        }

                        reverseGeocode(geocode_address, latlng, 'ATD');

                    }
                    else{
                        $scope.attendance_address = '';
                        $scope.mapNoLocation++;
                    }


                    function addMarker(m,order){

                        var contentString = '<div id="content">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<table>';
                        contentString += '<th colspan="2" class="text-center">Attendance</th>' +
                            '<tr>'+
                            '<tr>' +
                            '<td><strong>Name :</strong>'+order.sellername[0]+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Punch-In: </strong>' + (order.intime[0]?order.intime[0]:'Punch-In Not Done ') + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Date: </strong>' +order.date_added[0] + '</td>' +
                            '</tr>' +
                            '</tr>';


                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: 'Click to zoom',
                            icon : icons[$scope.mapOrders[0].type[0]]
                        });
                        marker.addListener('click', function() {
                            infowindow.open(map, marker);
                            setTimeout(function () { infowindow.close(); }, 5000);
                            $scope.$apply();
                        });
                        gmarkers.push(marker);

                    }

                    var myOptions = {
                        zoom: zoomLevel,
                        center: latlng,
                        scaleControl: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false
                    };

                    var directionsService = new google.maps.DirectionsService;
                    var directionsDisplay = new google.maps.DirectionsRenderer;

                    map = new google.maps.Map(document.getElementById("map_canvas2"), myOptions);

                    directionsDisplay.setMap(map);


                    if((order.latitude[0] != 0 && order.latitude[0] != "" && order.longitude[0] != 0 && order.longitude[0] != ""  && order.latitude[0] != "undefined" && order.longitude[0] != "undefined")){
                        latlng = new google.maps.LatLng(parseFloat($scope.mapOrders[0].latitude[0]), parseFloat($scope.mapOrders[0].longitude[0]));
                        addMarker(i, $scope.mapOrders[0]);
                    }

                    var mcOptions = {gridSize: 6, maxZoom: 20};
                    var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
                    google.maps.event.trigger(map, 'resize');

                    $('a[href="#profile"]').on('shown', function (e) {
                        google.maps.event.trigger(map, 'resize');
                    });
                }
                else{

                    if (order.punch_out_lat[0] != 0 && order.punch_out_lat[0] != "" && order.punch_out_long[0] != 0 && order.punch_out_long[0] != ""
                        && order.punch_out_lat[0] != "undefined" && order.punch_out_long[0] != "undefined"  && order.punch_out_lat[0] && order.punch_out_long[0]
                        && order.punch_out_lat[0] != 1 && order.punch_out_lat[0] != 2 && order.punch_out_lat[0] != 3 && order.punch_out_lat[0] != 4
                        && order.punch_out_long[0] != 1 && order.punch_out_long[0] != 2 && order.punch_out_long[0] != 3 && order.punch_out_long[0] != 4) {

                        latlng = new google.maps.LatLng(order.punch_out_lat[0], order.punch_out_long[0]);
                        zoomLevel = 14;

                        if (order.itemcode == 'ATD') {
                            order.type = [];
                            order.type[0] = 'Attendance';

                            $scope.mapOrders.push(order);
                            //console.log($scope.mapOrders)
                        }
                        else {
                            $scope.mapOrders.push(order);
                        }

                        reverseGeocode(geocode_address, latlng, 'ATD');
                    }
                    else{
                        $scope.mapNoLocation++;
                        $scope.attendance_address = '';
                    }


                    var myOptions = {
                        zoom: zoomLevel,
                        center: latlng,
                        scaleControl: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var directionsService = new google.maps.DirectionsService;
                    var directionsDisplay = new google.maps.DirectionsRenderer;

                    map = new google.maps.Map(document.getElementById("map_canvas2"), myOptions);

                    directionsDisplay.setMap(map);

                    function addMarker(m,order){

                        var contentString = '<div id="content">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<table>';
                        contentString += '<th colspan="2" class="text-center">Attendance</th>' +
                            '<tr>'+
                            '<tr>' +
                            '<td><strong>Name :</strong>'+order.sellername[0]+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Punch-Out: </strong>' + (order.outtime[0]?order.outtime[0]:'Punch-Out Not Done ') + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Date: </strong>' +order.date_added[0] + '</td>' +
                            '</tr>' +
                            '</tr>';


                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: 'Click to zoom',
                            icon : icons[$scope.mapOrders[0].type[0]]
                        });
                        marker.addListener('click', function() {
                            //map.setZoom(8);
                            //map.setCenter(marker.getPosition());
                            infowindow.open(map, marker);
                            setTimeout(function () { infowindow.close(); }, 5000);
                            $scope.selectedOrder=$scope.mapOrders[m];
                            $scope.renderMapsOrderDetails();
                            //console.log($scope.mapOrders[m])
                            $scope.$apply();
                        });
                        gmarkers.push(marker);

                    }

                    if (order.punch_out_lat[0] != 0 && order.punch_out_lat[0] != "" && order.punch_out_long[0] != 0 && order.punch_out_long[0] != ""  && order.punch_out_lat[0] != "undefined" && order.punch_out_long[0] != "undefined"  && order.punch_out_lat[0] && order.punch_out_long[0]) {
                        latlng = new google.maps.LatLng(parseFloat($scope.mapOrders[0].punch_out_lat[0]), parseFloat($scope.mapOrders[0].punch_out_long[0]));
                        addMarker(i, $scope.mapOrders[0]);
                    }


                    var mcOptions = {gridSize: 6, maxZoom: 20};
                    var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
                    google.maps.event.trigger(map, 'resize');

                    $('a[href="#profile"]').on('shown', function (e) {
                        google.maps.event.trigger(map, 'resize');
                    });
                }
            }
        };

        //Notify Punchout
        $scope.notifyPunchOut = function(){

            var D = new Date();
            D.setUTCMinutes(D.getUTCMinutes()+330);

            var A= [D.getUTCDate(), D.getUTCMonth(), D.getUTCFullYear()];
            A[1]++
            if(A[1]<10) A[1]= '0'+A[1];
            if(A[0]<10) A[0]= '0'+A[0];

            var today = A[2]+"-"+A[1]+"-"+A[0]+" 00:00:01";


            $http.get("/dash/notify/punchout/"+today)
                .success(function(res){
                    //console.log(res);
                    if(res){
                        bootbox.alert({
                            title : "INFO",
                            message : "Notified Users to punch-out",
                            className : "text-center"
                        })
                    }
                    else{
                        bootbox.alert({
                            title : "INFO",
                            message : "All users have punched-out",
                            className : "text-center"
                        })
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
        };

        $scope.renderCheckinMap = function(order){
            var gmarkers = [];
            $scope.checkinIcons['startVisit'] = 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png';
            $scope.checkinIcons['endVisit'] = 'https://maps.google.com/mapfiles/ms/micons/red-dot.png';
            $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
            $scope.checkinMapLocation = {};
            $scope.checkinMapLocation.dealer = "Not Available";
            $scope.checkinMapLocation.sVisit = "Not Available";
            $scope.checkinMapLocation.eVisit = "Not Available";
            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 4;
            var latlngList = [];

            var myOptions = {
                zoom: zoomLevel,
                center: latlng,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            };
            map = new google.maps.Map(document.getElementById("map_checkin"), myOptions);

            function addMarker(latlng, id){

                if(id == 0){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['startVisit']
                    });
                    reverseGeocode(geocode_address, latlng, 'startVisit');
                }
                else if(id == 1){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['Customer']
                    });
                    reverseGeocode(geocode_address, latlng, 'customer');
                }
                else if(id == 2){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['endVisit']
                    });
                    reverseGeocode(geocode_address, latlng, 'endVisit');
                }


                gmarkers.push(marker);

            }

            if(order.latitude[0] && order.longitude[0] && order.latitude[0] != 1 && order.latitude[0] != 2 &&
                order.latitude[0] != 3 && order.latitude[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0])))
                addMarker(latlng, 0);
            }
            if(order.exitLat[0] && order.exitLong[0] && order.exitLat[0] !=1 && order.exitLat[0] !=2 &&
                order.exitLat[0] != 3 && order.exitLat[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.exitLat[0]), parseFloat(order.exitLong[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.exitLat[0]), parseFloat(order.exitLong[0])))
                addMarker(latlng, 2);
            }

            if(order.storeLat[0] && order.storeLong[0]){
                var slatlng = new google.maps.LatLng(parseFloat(order.storeLat[0]), parseFloat(order.storeLong[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.storeLat[0]), parseFloat(order.storeLong[0])))
                addMarker(slatlng, 1);
            }


            //Set zoom based on the location latlongs
            if(latlngList.length > 0){
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < latlngList.length; i++) {
                    bounds.extend(latlngList[i]);
                }

                map.setCenter(bounds.getCenter()); //or use custom center
                map.fitBounds(bounds);
            }

            var mcOptions = {gridSize: 6, maxZoom: 20};
            var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
            google.maps.event.trigger(map, 'resize');

            $('a[href="#profile"]').on('shown', function (e) {
                google.maps.event.trigger(map, 'resize');
            });
        }


        /*=======rider location map=======*/
        $scope.renderRiderCheckinMap = function(order){
            $scope.riderCheckinMap = order;
            var gmarkers = [];
            $scope.checkinIcons['customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
            $scope.checkinIcons['delivered'] = 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png';
            $scope.checkinMapLocation = {};
            $scope.checkinMapLocation.dealer = "Not Available";
            $scope.checkinMapLocation.delivered = "Not Available";
            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 4;
            var latlngList = [];

            var myOptions = {
                zoom: zoomLevel,
                center: latlng,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            };
            map = new google.maps.Map(document.getElementById("map_riderCheckin"), myOptions);

            function addMarker(latlng, id){
                if(id == 0){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['customer']
                    });
                    reverseGeocode(geocode_address, latlng, 'customer');
                }
                else if(id == 1){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['delivered']
                    });
                    reverseGeocode(geocode_address, latlng, 'delivered');
                }

                gmarkers.push(marker);

            }

            if(order.latitude[0] && order.longitude[0] && order.latitude[0] != 1 && order.latitude[0] != 2 &&
                order.latitude[0] != 3 && order.latitude[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0])))
                addMarker(latlng, 0);
            }
            if(order.delivered_lat[0] && order.delivered_lng[0] && order.delivered_lat[0] !=1 && order.delivered_lat[0] !=2 &&
                order.delivered_lat[0] != 3 && order.delivered_lat[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.delivered_lat[0]), parseFloat(order.delivered_lng[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.delivered_lat[0]), parseFloat(order.delivered_lng[0])))
                addMarker(latlng, 1);
            }


            //Set zoom based on the location latlongs
            if(latlngList.length > 0){
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < latlngList.length; i++) {
                    bounds.extend(latlngList[i]);
                }

                map.setCenter(bounds.getCenter()); //or use custom center
                map.fitBounds(bounds);
            }

            var mcOptions = {gridSize: 6, maxZoom: 20};
            var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
            google.maps.event.trigger(map, 'resize');

            $('a[href="#profile"]').on('shown', function (e) {
                google.maps.event.trigger(map, 'resize');
            });
        }

        /*=======rider activity location map=======*/
        $scope.renderRiderActivityMap = function(order){
            $scope.riderCheckinMap = order;
            var gmarkers = [];
            $scope.checkinIcons['customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
            $scope.checkinIcons['delivered'] = 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png';
            $scope.checkinMapLocation = {};
            $scope.checkinMapLocation.dealer = "Not Available";
            $scope.checkinMapLocation.delivered = "Not Available";
            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 4;
            var latlngList = [];

            var myOptions = {
                zoom: zoomLevel,
                center: latlng,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            };
            map = new google.maps.Map(document.getElementById("map_riderActivity"), myOptions);

            function addMarker(latlng, id){
                if(id == 0){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['customer']
                    });
                    reverseGeocode(geocode_address, latlng, 'customer');
                }
                else if(id == 1){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['delivered']
                    });
                    reverseGeocode(geocode_address, latlng, 'delivered');
                }

                gmarkers.push(marker);

            }

            if(order.latitude[0] && order.longitude[0] && order.latitude[0] != 1 && order.latitude[0] != 2 &&
                order.latitude[0] != 3 && order.latitude[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0])))
                addMarker(latlng, 0);
            }
            if(order.delivered_lat[0] && order.delivered_lng[0] && order.delivered_lat[0] !=1 && order.delivered_lat[0] !=2 &&
                order.delivered_lat[0] != 3 && order.delivered_lat[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.delivered_lat[0]), parseFloat(order.delivered_lng[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.delivered_lat[0]), parseFloat(order.delivered_lng[0])))
                addMarker(latlng, 1);
            }


            //Set zoom based on the location latlongs
            if(latlngList.length > 0){
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < latlngList.length; i++) {
                    bounds.extend(latlngList[i]);
                }

                map.setCenter(bounds.getCenter()); //or use custom center
                map.fitBounds(bounds);
            }

            var mcOptions = {gridSize: 6, maxZoom: 20};
            var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
            google.maps.event.trigger(map, 'resize');

            $('a[href="#profile"]').on('shown', function (e) {
                google.maps.event.trigger(map, 'resize');
            });
        }

        $scope.OrderFilterBy = function(){
            $scope.orderfilterFlag = !$scope.orderfilterFlag;
        };

        //... Pagination for all reports
        $scope.reportsPage =  function(tab, direction, newViewBy){
            // console.log("newViewBy reportspage",newViewBy)
            $scope.newViewBy = parseInt(newViewBy);
            switch(tab){


                case 1:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.itemreport.length){
                            if(viewLength + viewBy < $scope.sold_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                soldSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    soldSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    soldSearchObj.viewBy = initialViewBy;
                                }
                                soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
                                soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
                                soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                                soldSearchObj.searchBy = soldSearchBy;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/items",soldSearchObj)
                                    .success(function(response){
                                        var tempArray = [];
                                        $http.get("/dash/items")
                                            .success(function (response) {
                                                for(var i=0; i<response.length; i++){
                                                    var temp = response[i].itemCode +'';
                                                    tempArray[temp] = response[i].Manufacturer ;

                                                }
                                                sold();
                                            });

                                        function sold(){
                                            for (var i = 0;i < response.length;i++){
                                                response[i].isCollapsed = false ;
                                                response[i].Manufacturer = tempArray[response[i]._id] ;
                                                var data = response[i].orderDetail ;
                                                var seen = {};
                                                data = data.filter(function(entry) {
                                                    var previous;

                                                    // Have we seen this label before?
                                                    if (seen.hasOwnProperty(entry.seller)) {
                                                        // Yes, grab it and add this data to it
                                                        previous = seen[entry.seller];
                                                        previous.quantity.push(parseInt(entry.quantity));
                                                        previous.stockist.push({'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity)});

                                                        // Don't keep this entry, we've merged it into the previous one
                                                        return false;
                                                    }

                                                    // entry.data probably isn't an array; make it one for consistency
                                                    if (!Array.isArray(entry.quantity)) {
                                                        entry.quantity = [parseInt(entry.quantity)];
                                                    }
                                                    entry.stockist = [{'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity[0])}];


                                                    // Remember that we've seen it
                                                    seen[entry.seller] = entry;

                                                    // Keep this one, we'll merge any others that match into it
                                                    return true;
                                                });
                                                response[i].orderDetail = data ;
                                                for (var j=0; j < response[i].orderDetail.length ; j++){
                                                    var a = response[i].orderDetail[j].quantity;
                                                    response[i].orderDetail[j].quantity = a.reduce(function(a, b) { return a + b; }, 0);
                                                    var stockist = response[i].orderDetail[j].stockist ;
                                                    var temp = {};
                                                    stockist = stockist.filter(function(entry) {
                                                        var previous;

                                                        // Have we seen this label before?
                                                        if (temp.hasOwnProperty(entry.stockist)) {
                                                            // Yes, grab it and add this data to it
                                                            previous = temp[entry.stockist];
                                                            previous.count.push(parseInt(entry.count));

                                                            // Don't keep this entry, we've merged it into the previous one
                                                            return false;
                                                        }

                                                        // entry.data probably isn't an array; make it one for consistency
                                                        if (!Array.isArray(entry.count)) {
                                                            entry.count = [parseInt(entry.count)];
                                                        }

                                                        // Remember that we've seen it
                                                        temp[entry.stockist] = entry;

                                                        // Keep this one, we'll merge any others that match into it
                                                        return true;
                                                    });
                                                    response[i].orderDetail[j].stockist = stockist ;
                                                    for(var k = 0 ; k < response[i].orderDetail[j].stockist.length; k++){
                                                        var b = response[i].orderDetail[j].stockist[k].count;
                                                        response[i].orderDetail[j].stockist[k].count = b.reduce(function(a, b) { return a + b; }, 0);


                                                    }
                                                }
                                                $scope.itemreport.push(response[i]);
                                            }
                                        }

                                        if(viewLength + viewBy > $scope.sold_count){
                                            a = viewLength + viewBy - $scope.sold_count;
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
                                if(viewLength + viewBy > $scope.sold_count){
                                    a = viewLength + viewBy - $scope.sold_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.sold_count){
                                a = viewLength + viewBy - $scope.sold_count;
                                viewBy -= a;

                                if(viewLength + viewBy > $scope.itemreport.length){
                                    soldSearchObj.viewLength = $scope.itemreport.length ;
                                    soldSearchObj.viewBy = viewLength + viewBy - $scope.itemreport.length;
                                    soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
                                    soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
                                    soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                                    soldSearchObj.searchBy = soldSearchBy;

                                    $http.post("/dash/reports/items",soldSearchObj)
                                        .success(function(response){
                                            var tempArray = [];
                                            $http.get("/dash/items")
                                                .success(function (response) {
                                                    for(var i=0; i<response.length; i++){
                                                        var temp = response[i].itemCode +'';
                                                        tempArray[temp] = response[i].Manufacturer ;

                                                    }
                                                    sold();
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

                                            function sold(){
                                                for (var i = 0;i < response.length;i++){
                                                    response[i].isCollapsed = false ;
                                                    response[i].Manufacturer = tempArray[response[i]._id] ;
                                                    var data = response[i].orderDetail ;
                                                    var seen = {};
                                                    data = data.filter(function(entry) {
                                                        var previous;

                                                        // Have we seen this label before?
                                                        if (seen.hasOwnProperty(entry.seller)) {
                                                            // Yes, grab it and add this data to it
                                                            previous = seen[entry.seller];
                                                            previous.quantity.push(parseInt(entry.quantity));
                                                            previous.stockist.push({'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity)});

                                                            // Don't keep this entry, we've merged it into the previous one
                                                            return false;
                                                        }

                                                        // entry.data probably isn't an array; make it one for consistency
                                                        if (!Array.isArray(entry.quantity)) {
                                                            entry.quantity = [parseInt(entry.quantity)];
                                                        }
                                                        entry.stockist = [{'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity[0])}];


                                                        // Remember that we've seen it
                                                        seen[entry.seller] = entry;

                                                        // Keep this one, we'll merge any others that match into it
                                                        return true;
                                                    });
                                                    response[i].orderDetail = data ;
                                                    for (var j=0; j < response[i].orderDetail.length ; j++){
                                                        var a = response[i].orderDetail[j].quantity;
                                                        response[i].orderDetail[j].quantity = a.reduce(function(a, b) { return a + b; }, 0);
                                                        var stockist = response[i].orderDetail[j].stockist ;
                                                        var temp = {};
                                                        stockist = stockist.filter(function(entry) {
                                                            var previous;

                                                            // Have we seen this label before?
                                                            if (temp.hasOwnProperty(entry.stockist)) {
                                                                // Yes, grab it and add this data to it
                                                                previous = temp[entry.stockist];
                                                                previous.count.push(parseInt(entry.count));

                                                                // Don't keep this entry, we've merged it into the previous one
                                                                return false;
                                                            }

                                                            // entry.data probably isn't an array; make it one for consistency
                                                            if (!Array.isArray(entry.count)) {
                                                                entry.count = [parseInt(entry.count)];
                                                            }

                                                            // Remember that we've seen it
                                                            temp[entry.stockist] = entry;

                                                            // Keep this one, we'll merge any others that match into it
                                                            return true;
                                                        });
                                                        response[i].orderDetail[j].stockist = stockist ;
                                                        for(var k = 0 ; k < response[i].orderDetail[j].stockist.length; k++){
                                                            var b = response[i].orderDetail[j].stockist[k].count;
                                                            response[i].orderDetail[j].stockist[k].count = b.reduce(function(a, b) { return a + b; }, 0);


                                                        }
                                                    }
                                                    $scope.itemreport.push(response[i]);
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

                            }else{
                                if(viewLength + viewBy > $scope.itemreport.length){
                                    soldSearchObj.viewLength = $scope.itemreport.length ;
                                    soldSearchObj.viewBy = viewLength + viewBy - $scope.itemreport.length;
                                    soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
                                    soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
                                    soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                                    soldSearchObj.searchBy = soldSearchBy;

                                    $http.post("/dash/reports/items",soldSearchObj)
                                        .success(function(response){
                                            var tempArray = [];
                                            $http.get("/dash/items")
                                                .success(function (response) {
                                                    for(var i=0; i<response.length; i++){
                                                        var temp = response[i].itemCode +'';
                                                        tempArray[temp] = response[i].Manufacturer ;

                                                    }
                                                    sold();
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

                                            function sold(){
                                                for (var i = 0;i < response.length;i++){
                                                    response[i].isCollapsed = false ;
                                                    response[i].Manufacturer = tempArray[response[i]._id] ;
                                                    var data = response[i].orderDetail ;
                                                    var seen = {};
                                                    data = data.filter(function(entry) {
                                                        var previous;

                                                        // Have we seen this label before?
                                                        if (seen.hasOwnProperty(entry.seller)) {
                                                            // Yes, grab it and add this data to it
                                                            previous = seen[entry.seller];
                                                            previous.quantity.push(parseInt(entry.quantity));
                                                            previous.stockist.push({'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity)});

                                                            // Don't keep this entry, we've merged it into the previous one
                                                            return false;
                                                        }

                                                        // entry.data probably isn't an array; make it one for consistency
                                                        if (!Array.isArray(entry.quantity)) {
                                                            entry.quantity = [parseInt(entry.quantity)];
                                                        }
                                                        entry.stockist = [{'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity[0])}];


                                                        // Remember that we've seen it
                                                        seen[entry.seller] = entry;

                                                        // Keep this one, we'll merge any others that match into it
                                                        return true;
                                                    });
                                                    response[i].orderDetail = data ;
                                                    for (var j=0; j < response[i].orderDetail.length ; j++){
                                                        var a = response[i].orderDetail[j].quantity;
                                                        response[i].orderDetail[j].quantity = a.reduce(function(a, b) { return a + b; }, 0);
                                                        var stockist = response[i].orderDetail[j].stockist ;
                                                        var temp = {};
                                                        stockist = stockist.filter(function(entry) {
                                                            var previous;

                                                            // Have we seen this label before?
                                                            if (temp.hasOwnProperty(entry.stockist)) {
                                                                // Yes, grab it and add this data to it
                                                                previous = temp[entry.stockist];
                                                                previous.count.push(parseInt(entry.count));

                                                                // Don't keep this entry, we've merged it into the previous one
                                                                return false;
                                                            }

                                                            // entry.data probably isn't an array; make it one for consistency
                                                            if (!Array.isArray(entry.count)) {
                                                                entry.count = [parseInt(entry.count)];
                                                            }

                                                            // Remember that we've seen it
                                                            temp[entry.stockist] = entry;

                                                            // Keep this one, we'll merge any others that match into it
                                                            return true;
                                                        });
                                                        response[i].orderDetail[j].stockist = stockist ;
                                                        for(var k = 0 ; k < response[i].orderDetail[j].stockist.length; k++){
                                                            var b = response[i].orderDetail[j].stockist[k].count;
                                                            response[i].orderDetail[j].stockist[k].count = b.reduce(function(a, b) { return a + b; }, 0);


                                                        }
                                                    }
                                                    $scope.itemreport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;

                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.sold_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 2:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;

                    if(direction){

                        // console.log("NEXT");
                        if(viewLength + viewBy >= $scope.dealerreport.length){

                            if(viewLength + viewBy < $scope.customer_count){
                                viewLength += viewBy;
                                // console.log("Fetch more")
                                topCustomerSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    topCustomerSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    topCustomerSearchObj.viewBy = initialViewBy;
                                }
                                topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
                                topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
                                topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                                topCustomerSearchObj.searchBy = topDealerSearchBy;


                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/dealers",topCustomerSearchObj)
                                    .success(function(response){
                                        console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.dealerreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.customer_count){
                                            a = viewLength + viewBy - $scope.customer_count;
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
                                if(viewLength + viewBy > $scope.customer_count){
                                    a = viewLength + viewBy - $scope.customer_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.customer_count){
                                a = viewLength + viewBy - $scope.customer_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.dealerreport.length){
                                    topCustomerSearchObj.viewLength = $scope.dealerreport.length;
                                    topCustomerSearchObj.viewBy = viewLength + viewBy - $scope.dealerreport.length;
                                    topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
                                    topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
                                    topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                                    topCustomerSearchObj.searchBy = topDealerSearchBy;

                                    $http.post("/dash/reports/dealers",topCustomerSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.dealerreport.push(response[i]);
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
                            }else {
                                if(viewLength + viewBy > $scope.dealerreport.length){
                                    topCustomerSearchObj.viewLength = $scope.dealerreport.length;
                                    topCustomerSearchObj.viewBy = viewLength + viewBy - $scope.dealerreport.length;
                                    topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
                                    topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
                                    topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                                    topCustomerSearchObj.searchBy = topDealerSearchBy;

                                    $http.post("/dash/reports/dealers",topCustomerSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.dealerreport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.customer_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 3:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.sellerreport.length){
                            if(viewLength + viewBy < $scope.user_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                topUserSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    topUserSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    topUserSearchObj.viewBy = initialViewBy;
                                }
                                topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                                topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                                topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                                topUserSearchObj.searchBy = topSellerSearchBy;


                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/sellers",topUserSearchObj)
                                    .success(function(response){


                                        for(var i=0; i<response.length; i++){
                                            $scope.sellerreport.push(response[i]);
                                            console.log( $scope.sellerreport);
                                        }

                                        if(viewLength + viewBy > $scope.user_count){
                                            a = viewLength + viewBy - $scope.user_count;
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
                                if(viewLength + viewBy > $scope.user_count){
                                    a = viewLength + viewBy - $scope.user_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.user_count){
                                a = viewLength + viewBy - $scope.user_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.sellerreport.length){
                                    topUserSearchObj.viewLength = $scope.sellerreport.length;
                                    topUserSearchObj.viewBy = viewLength + viewBy - $scope.sellerreport.length;
                                    topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                                    topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                                    topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                                    topUserSearchObj.searchBy = topSellerSearchBy;


                                    $http.post("/dash/reports/sellers",topUserSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.sellerreport.push(response[i]);
                                                console.log( $scope.sellerreport);
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
                            }else {
                                if(viewLength + viewBy > $scope.sellerreport.length){
                                    topUserSearchObj.viewLength = $scope.sellerreport.length;
                                    topUserSearchObj.viewBy = viewLength + viewBy - $scope.sellerreport.length;
                                    topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                                    topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                                    topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                                    topUserSearchObj.searchBy = topSellerSearchBy;


                                    $http.post("/dash/reports/sellers",topUserSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.sellerreport.push(response[i]);
                                                console.log( $scope.sellerreport);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.user_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 4:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.orderreport.length){
                            if(viewLength + viewBy < $scope.summary_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                summarySearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    summarySearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    summarySearchObj.viewBy = initialViewBy;
                                }
                                summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
                                summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                
                                $http.post("/dash/reports/ordersreport",summarySearchObj)
                                    .success(function(response){
                                        console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.orderreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.summary_count){
                                            a = viewLength + viewBy - $scope.summary_count;
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
                                if(viewLength + viewBy > $scope.summary_count){
                                    a = viewLength + viewBy - $scope.summary_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.summary_count){
                                a = viewLength + viewBy - $scope.summary_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.orderreport.length){
                                    summarySearchObj.viewLength = $scope.orderreport.length;
                                    summarySearchObj.viewBy = viewLength + viewBy - $scope.orderreport.length;
                                    summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
                                    summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');

                                    $http.post("/dash/reports/ordersreport",summarySearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.orderreport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.orderreport.length){
                                    summarySearchObj.viewLength = $scope.orderreport.length;
                                    summarySearchObj.viewBy = viewLength + viewBy - $scope.orderreport.length;
                                    summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
                                    summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');

                                    $http.post("/dash/reports/ordersreport",summarySearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.orderreport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.summary_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 5:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.cashreport.length){
                            if(viewLength + viewBy < $scope.payment_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                paymentSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    paymentSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    paymentSearchObj.viewBy = initialViewBy;
                                }
                                paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
                                paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
                                paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                                paymentSearchObj.searchBy = paymentSearchBy;
                                paymentSearchObj.filter = $scope.modeOfPayment;

                                if($scope.applicationType != 'StoreJini'){
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "inline");
                                    $http.post("/dash/reports/cashitems",paymentSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.cashreport.push(response[i]);
                                            }

                                            if(viewLength + viewBy > $scope.payment_count){
                                                a = viewLength + viewBy - $scope.payment_count;
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

                                if($scope.applicationType == 'StoreJini'){
                                    $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                                        .success(function(response){

                                            for(var i=0; i<response.length; i++){
                                                $scope.cashreport.push(response[i]);
                                            }

                                            if(viewLength + viewBy > $scope.payment_count){
                                                a = viewLength + viewBy - $scope.payment_count;
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
                                }



                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.payment_count){
                                    a = viewLength + viewBy - $scope.payment_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.payment_count){
                                a = viewLength + viewBy - $scope.payment_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.cashreport.length){
                                    paymentSearchObj.viewLength = $scope.cashreport.length;
                                    paymentSearchObj.viewBy = viewLength + viewBy - $scope.cashreport.length;
                                    paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
                                    paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
                                    paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                                    paymentSearchObj.searchBy = paymentSearchBy;
                                    paymentSearchObj.filter = $scope.modeOfPayment;

                                    if($scope.applicationType != 'StoreJini'){
                                        $http.post("/dash/reports/cashitems",paymentSearchObj)
                                            .success(function(response){
                                                console.log(response);

                                                for(var i=0; i<response.length; i++){
                                                    $scope.cashreport.push(response[i]);
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

                                    if($scope.applicationType == 'StoreJini'){
                                        $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                                            .success(function(response){
                                                // console.log(response);

                                                for(var i=0; i<response.length; i++){
                                                    $scope.cashreport.push(response[i]);
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


                                }
                            }else{
                                if(viewLength + viewBy > $scope.cashreport.length){
                                    paymentSearchObj.viewLength = $scope.cashreport.length;
                                    paymentSearchObj.viewBy = viewLength + viewBy - $scope.cashreport.length;
                                    paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
                                    paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
                                    paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                                    paymentSearchObj.searchBy = paymentSearchBy;
                                    paymentSearchObj.filter = $scope.modeOfPayment;

                                    if($scope.applicationType != 'Storejini'){
                                        $http.post("/dash/reports/cashitems",paymentSearchObj)
                                            .success(function(response){
                                                console.log(response);

                                                for(var i=0; i<response.length; i++){
                                                    $scope.cashreport.push(response[i]);
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
                                    if($scope.applicationType == 'Storejini'){
                                        $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                                            .success(function(response){
                                                // console.log(response);

                                                for(var i=0; i<response.length; i++){
                                                    $scope.cashreport.push(response[i]);
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
                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.payment_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 6:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;


                    if(direction){
                        // console.log("NEXT");
                        if(viewLength + viewBy >= $scope.checkInreport.length){

                            if(viewLength + viewBy < $scope.checkin_count){
                                viewLength += viewBy;
                                // console.log("Fetch more")
                                checkinSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    checkinSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    checkinSearchObj.viewBy = initialViewBy;
                                }
                                checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                                checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                                checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                                checkinSearchObj.searchBy = checkinDealerSearchBy;


                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/checkins",checkinSearchObj)
                                    .success(function(response){

                                        for(var i=0; i<response.length; i++){
                                            $scope.checkInreport.push(response[i]);
                                        }
                                        for(var i=0; i< $scope.checkInreport.length; i++){
                                            if($scope.checkInreport[i].storeLat[0] && $scope.checkInreport[i].storeLong[0]){
                                                $scope.checkInreport[i].customerLocation = true;
                                                var slatlng = new google.maps.LatLng($scope.checkInreport[i].storeLat[0], $scope.checkInreport[i].storeLong[0]);
                                                var startLatLong;
                                                var endLatLong;
                                                //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                                if($scope.checkInreport[i].latitude[0] && $scope.checkInreport[i].longitude[0]
                                                    && $scope.checkInreport[i].latitude[0] != 1 && $scope.checkInreport[i].longitude[0] != 1
                                                    && $scope.checkInreport[i].latitude[0] != 2 && $scope.checkInreport[i].longitude[0] != 2
                                                    && $scope.checkInreport[i].latitude[0] != 3 && $scope.checkInreport[i].longitude[0] != 3
                                                    && $scope.checkInreport[i].latitude[0] != 4 && $scope.checkInreport[i].longitude[0] != 4){
                                                    startLatLong = new google.maps.LatLng($scope.checkInreport[i].latitude[0], $scope.checkInreport[i].longitude[0]);
                                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                                    $scope.checkInreport[i].sVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                    $scope.checkInreport[i].startVisitLocation = true;
                                                }
                                                else{
                                                    $scope.checkInreport[i].startVisitLocation = false;
                                                    $scope.checkInreport[i].sVisitDist =
                                                        ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                            ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                                }

                                                if($scope.checkInreport[i].exitLat[0] && $scope.checkInreport[i].exitLong[0]
                                                    && $scope.checkInreport[i].exitLat[0] != 1 && $scope.checkInreport[i].exitLong != 1
                                                    && $scope.checkInreport[i].exitLat[0] != 2 && $scope.checkInreport[i].exitLong != 2
                                                    && $scope.checkInreport[i].exitLat[0] != 3 && $scope.checkInreport[i].exitLong != 3
                                                    && $scope.checkInreport[i].exitLat[0] != 4 && $scope.checkInreport[i].exitLong != 4){

                                                    endLatLong = new google.maps.LatLng($scope.checkInreport[i].exitLat[0], $scope.checkInreport[i].exitLong[0]);
                                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                                    $scope.checkInreport[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                    $scope.checkInreport[i].endVisitLocation = true;
                                                }
                                                else{
                                                    $scope.checkInreport[i].eVisitDist =
                                                        ($scope.checkInreport[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                                            ($scope.checkInreport[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                                                (($scope.checkInreport[i].exitLong[0] == 3 || $scope.checkInreport[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                                    $scope.checkInreport[i].endVisitLocation = false;
                                                }
                                            }
                                            else{
                                                $scope.checkInreport[i].customerLocation = false;

                                                if($scope.checkInreport[i].latitude[0] == 1 ||
                                                    $scope.checkInreport[i].latitude[0] == 2 ||
                                                    $scope.checkInreport[i].latitude[0] == 3 ||
                                                    $scope.checkInreport[i].latitude[0] == 4){
                                                    $scope.checkInreport[i].startVisitLocation = false;
                                                    $scope.checkInreport[i].sVisitDist =
                                                        ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                            ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                                }
                                                else{
                                                    $scope.checkInreport[i].startVisitLocation = true;
                                                }
                                                if($scope.checkInreport[i].exitLat[0] == 1 ||
                                                    $scope.checkInreport[i].exitLat[0] == 2 ||
                                                    $scope.checkInreport[i].exitLat[0] == 3 ||
                                                    $scope.checkInreport[i].exitLat[0] == 4){
                                                    $scope.checkInreport[i].endVisitLocation = false;
                                                    $scope.checkInreport[i].eVisitDist = ($scope.checkInreport[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                                        ($scope.checkInreport[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                                            (($scope.checkInreport[i].exitLat[0] == 3 || $scope.checkInreport[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                                                }
                                                else{

                                                    if($scope.checkInreport[i].exitLat[0])
                                                        $scope.checkInreport[i].endVisitLocation = true;
                                                    else{ // Check if null?? if yes, it means that the user has not ended visit
                                                        $scope.checkInreport[i].endVisitLocation = false;
                                                        $scope.checkInreport[i].eVisitDist = 'Not Ended';
                                                    }

                                                }

                                            }
                                        }

                                        if(viewLength + viewBy > $scope.checkin_count){
                                            a = viewLength + viewBy - $scope.checkin_count;
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
                                if(viewLength + viewBy > $scope.checkin_count){
                                    a = viewLength + viewBy - $scope.checkin_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.checkin_count){
                                a = viewLength + viewBy - $scope.checkin_count;
                                viewBy -= a;

                                if(viewLength + viewBy > $scope.checkInreport.length){
                                    checkinSearchObj.viewLength = $scope.checkInreport.length; //.... 60
                                    checkinSearchObj.viewBy = viewLength + viewBy - $scope.checkInreport.length; //.... 20
                                    checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                                    checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                                    checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                                    checkinSearchObj.searchBy = checkinDealerSearchBy;

                                    $http.post("/dash/reports/checkins",checkinSearchObj)
                                        .success(function(response){


                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.checkInreport.push(response[i]);
                                            }

                                            for(var i=0; i< $scope.checkInreport.length; i++){
                                                if($scope.checkInreport[i].storeLat[0] && $scope.checkInreport[i].storeLong[0]){
                                                    $scope.checkInreport[i].customerLocation = true;
                                                    var slatlng = new google.maps.LatLng($scope.checkInreport[i].storeLat[0], $scope.checkInreport[i].storeLong[0]);
                                                    var startLatLong;
                                                    var endLatLong;
                                                    //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                                    if($scope.checkInreport[i].latitude[0] && $scope.checkInreport[i].longitude[0]
                                                        && $scope.checkInreport[i].latitude[0] != 1 && $scope.checkInreport[i].longitude[0] != 1
                                                        && $scope.checkInreport[i].latitude[0] != 2 && $scope.checkInreport[i].longitude[0] != 2
                                                        && $scope.checkInreport[i].latitude[0] != 3 && $scope.checkInreport[i].longitude[0] != 3
                                                        && $scope.checkInreport[i].latitude[0] != 4 && $scope.checkInreport[i].longitude[0] != 4){
                                                        startLatLong = new google.maps.LatLng($scope.checkInreport[i].latitude[0], $scope.checkInreport[i].longitude[0]);
                                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                                        $scope.checkInreport[i].sVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                        $scope.checkInreport[i].startVisitLocation = true;
                                                    }
                                                    else{
                                                        $scope.checkInreport[i].startVisitLocation = false;
                                                        $scope.checkInreport[i].sVisitDist =
                                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                                    }

                                                    if($scope.checkInreport[i].exitLat[0] && $scope.checkInreport[i].exitLong[0]
                                                        && $scope.checkInreport[i].exitLat[0] != 1 && $scope.checkInreport[i].exitLong != 1
                                                        && $scope.checkInreport[i].exitLat[0] != 2 && $scope.checkInreport[i].exitLong != 2
                                                        && $scope.checkInreport[i].exitLat[0] != 3 && $scope.checkInreport[i].exitLong != 3
                                                        && $scope.checkInreport[i].exitLat[0] != 4 && $scope.checkInreport[i].exitLong != 4){

                                                        endLatLong = new google.maps.LatLng($scope.checkInreport[i].exitLat[0], $scope.checkInreport[i].exitLong[0]);
                                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                                        $scope.checkInreport[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                        $scope.checkInreport[i].endVisitLocation = true;
                                                    }
                                                    else{
                                                        $scope.checkInreport[i].eVisitDist =
                                                            ($scope.checkInreport[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                                                ($scope.checkInreport[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                                                    (($scope.checkInreport[i].exitLong[0] == 3 || $scope.checkInreport[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                                        $scope.checkInreport[i].endVisitLocation = false;
                                                    }
                                                }
                                                else{
                                                    $scope.checkInreport[i].customerLocation = false;

                                                    if($scope.checkInreport[i].latitude[0] == 1 ||
                                                        $scope.checkInreport[i].latitude[0] == 2 ||
                                                        $scope.checkInreport[i].latitude[0] == 3 ||
                                                        $scope.checkInreport[i].latitude[0] == 4){
                                                        $scope.checkInreport[i].startVisitLocation = false;
                                                        $scope.checkInreport[i].sVisitDist =
                                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                                    }
                                                    else{
                                                        $scope.checkInreport[i].startVisitLocation = true;
                                                    }
                                                    if($scope.checkInreport[i].exitLat[0] == 1 ||
                                                        $scope.checkInreport[i].exitLat[0] == 2 ||
                                                        $scope.checkInreport[i].exitLat[0] == 3 ||
                                                        $scope.checkInreport[i].exitLat[0] == 4){
                                                        $scope.checkInreport[i].endVisitLocation = false;
                                                        $scope.checkInreport[i].eVisitDist = ($scope.checkInreport[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                                            ($scope.checkInreport[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                                                (($scope.checkInreport[i].exitLat[0] == 3 || $scope.checkInreport[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                                                    }
                                                    else{

                                                        if($scope.checkInreport[i].exitLat[0])
                                                            $scope.checkInreport[i].endVisitLocation = true;
                                                        else{ // Check if null?? if yes, it means that the user has not ended visit
                                                            $scope.checkInreport[i].endVisitLocation = false;
                                                            $scope.checkInreport[i].eVisitDist = 'Not Ended';
                                                        }

                                                    }

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
                            }else{
                                if(viewLength + viewBy > $scope.checkInreport.length){
                                    checkinSearchObj.viewLength = $scope.checkInreport.length; //.... 60
                                    checkinSearchObj.viewBy = viewLength + viewBy - $scope.checkInreport.length; //.... 20
                                    checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                                    checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                                    checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                                    checkinSearchObj.searchBy = checkinDealerSearchBy;

                                    $http.post("/dash/reports/checkins",checkinSearchObj)
                                        .success(function(response){


                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.checkInreport.push(response[i]);
                                            }

                                            for(var i=0; i< $scope.checkInreport.length; i++){
                                                if($scope.checkInreport[i].storeLat[0] && $scope.checkInreport[i].storeLong[0]){
                                                    $scope.checkInreport[i].customerLocation = true;
                                                    var slatlng = new google.maps.LatLng($scope.checkInreport[i].storeLat[0], $scope.checkInreport[i].storeLong[0]);
                                                    var startLatLong;
                                                    var endLatLong;
                                                    //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                                    if($scope.checkInreport[i].latitude[0] && $scope.checkInreport[i].longitude[0]
                                                        && $scope.checkInreport[i].latitude[0] != 1 && $scope.checkInreport[i].longitude[0] != 1
                                                        && $scope.checkInreport[i].latitude[0] != 2 && $scope.checkInreport[i].longitude[0] != 2
                                                        && $scope.checkInreport[i].latitude[0] != 3 && $scope.checkInreport[i].longitude[0] != 3
                                                        && $scope.checkInreport[i].latitude[0] != 4 && $scope.checkInreport[i].longitude[0] != 4){
                                                        startLatLong = new google.maps.LatLng($scope.checkInreport[i].latitude[0], $scope.checkInreport[i].longitude[0]);
                                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                                        $scope.checkInreport[i].sVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                        $scope.checkInreport[i].startVisitLocation = true;
                                                    }
                                                    else{
                                                        $scope.checkInreport[i].startVisitLocation = false;
                                                        $scope.checkInreport[i].sVisitDist =
                                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                                    }

                                                    if($scope.checkInreport[i].exitLat[0] && $scope.checkInreport[i].exitLong[0]
                                                        && $scope.checkInreport[i].exitLat[0] != 1 && $scope.checkInreport[i].exitLong != 1
                                                        && $scope.checkInreport[i].exitLat[0] != 2 && $scope.checkInreport[i].exitLong != 2
                                                        && $scope.checkInreport[i].exitLat[0] != 3 && $scope.checkInreport[i].exitLong != 3
                                                        && $scope.checkInreport[i].exitLat[0] != 4 && $scope.checkInreport[i].exitLong != 4){

                                                        endLatLong = new google.maps.LatLng($scope.checkInreport[i].exitLat[0], $scope.checkInreport[i].exitLong[0]);
                                                        var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                                        $scope.checkInreport[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                        $scope.checkInreport[i].endVisitLocation = true;
                                                    }
                                                    else{
                                                        $scope.checkInreport[i].eVisitDist =
                                                            ($scope.checkInreport[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                                                ($scope.checkInreport[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                                                    (($scope.checkInreport[i].exitLong[0] == 3 || $scope.checkInreport[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                                        $scope.checkInreport[i].endVisitLocation = false;
                                                    }
                                                }
                                                else{
                                                    $scope.checkInreport[i].customerLocation = false;

                                                    if($scope.checkInreport[i].latitude[0] == 1 ||
                                                        $scope.checkInreport[i].latitude[0] == 2 ||
                                                        $scope.checkInreport[i].latitude[0] == 3 ||
                                                        $scope.checkInreport[i].latitude[0] == 4){
                                                        $scope.checkInreport[i].startVisitLocation = false;
                                                        $scope.checkInreport[i].sVisitDist =
                                                            ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                                ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                    (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                                    }
                                                    else{
                                                        $scope.checkInreport[i].startVisitLocation = true;
                                                    }
                                                    if($scope.checkInreport[i].exitLat[0] == 1 ||
                                                        $scope.checkInreport[i].exitLat[0] == 2 ||
                                                        $scope.checkInreport[i].exitLat[0] == 3 ||
                                                        $scope.checkInreport[i].exitLat[0] == 4){
                                                        $scope.checkInreport[i].endVisitLocation = false;
                                                        $scope.checkInreport[i].eVisitDist = ($scope.checkInreport[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                                            ($scope.checkInreport[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                                                (($scope.checkInreport[i].exitLat[0] == 3 || $scope.checkInreport[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                                                    }
                                                    else{

                                                        if($scope.checkInreport[i].exitLat[0])
                                                            $scope.checkInreport[i].endVisitLocation = true;
                                                        else{ // Check if null?? if yes, it means that the user has not ended visit
                                                            $scope.checkInreport[i].endVisitLocation = false;
                                                            $scope.checkInreport[i].eVisitDist = 'Not Ended';
                                                        }

                                                    }

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
                            }

                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.checkin_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 7:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.expensereport.length){
                            if(viewLength + viewBy < $scope.expense_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                expenseSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    expenseSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    expenseSearchObj.viewBy = initialViewBy;
                                }
                                expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                                expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                                expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                                expenseSearchObj.searchBy = expenseSearchBy;
                                expenseSearchObj.filter = $scope.expenseFilterStatus;


                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/expense",expenseSearchObj)
                                    .success(function(response){
                                        // console.log(response);


                                        for(var i=0; i<response.length; i++){
                                            $scope.expensereport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.expense_count){
                                            a = viewLength + viewBy - $scope.expense_count;
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
                                if(viewLength + viewBy > $scope.expense_count){
                                    a = viewLength + viewBy - $scope.expense_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.expense_count){
                                a = viewLength + viewBy - $scope.expense_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.expensereport.length){
                                    expenseSearchObj.viewLength =  $scope.expensereport.length;
                                    expenseSearchObj.viewBy = viewLength + viewBy - $scope.expensereport.length;
                                    expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                                    expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                                    expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                                    expenseSearchObj.searchBy = expenseSearchBy;
                                    expenseSearchObj.filter = $scope.expenseFilterStatus;


                                    $http.post("/dash/reports/expense",expenseSearchObj)
                                        .success(function(response){
                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.expensereport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.expensereport.length){
                                    expenseSearchObj.viewLength =  $scope.expensereport.length;
                                    expenseSearchObj.viewBy = viewLength + viewBy - $scope.expensereport.length;
                                    expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                                    expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                                    expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                                    expenseSearchObj.searchBy = expenseSearchBy;
                                    expenseSearchObj.filter = $scope.expenseFilterStatus;


                                    $http.post("/dash/reports/expense",expenseSearchObj)
                                        .success(function(response){
                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.expensereport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.expense_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;


                case 8:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.meetingreport.length){
                            if(viewLength + viewBy < $scope.meeting_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                meetingSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    meetingSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    meetingSearchObj.viewBy = initialViewBy;
                                }
                                meetingSearchObj.sDate = $scope.DateTimeFormat($scope.mtgreport.startDate, 'start');
                                meetingSearchObj.eDate = $scope.DateTimeFormat($scope.mtgreport.endDate, 'end');
                                meetingSearchObj.searchFor = $scope.meetingsReportSearch.filter;
                                meetingSearchObj.searchBy = topDealerSearchBy;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/meeting",meetingSearchObj)
                                    .success(function(response){
                                        // console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.meetingreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.meeting_count){
                                            a = viewLength + viewBy - $scope.meeting_count;
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
                                if(viewLength + viewBy > $scope.meeting_count){
                                    a = viewLength + viewBy - $scope.meeting_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.meeting_count){
                                a = viewLength + viewBy - $scope.meeting_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.meetingreport.length){
                                    meetingSearchObj.viewLength =  $scope.meetingreport.length;
                                    meetingSearchObj.viewBy = viewLength + viewBy - $scope.meetingreport.length;
                                    meetingSearchObj.sDate = $scope.DateTimeFormat($scope.mtgreport.startDate, 'start');
                                    meetingSearchObj.eDate = $scope.DateTimeFormat($scope.mtgreport.endDate, 'end');
                                    meetingSearchObj.searchFor = $scope.meetingsReportSearch.filter;
                                    meetingSearchObj.searchBy = topDealerSearchBy;

                                    $http.post("/dash/reports/meeting",meetingSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.meetingreport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.meetingreport.length){
                                    meetingSearchObj.viewLength =  $scope.meetingreport.length;
                                    meetingSearchObj.viewBy = viewLength + viewBy - $scope.meetingreport.length;
                                    meetingSearchObj.sDate = $scope.DateTimeFormat($scope.mtgreport.startDate, 'start');
                                    meetingSearchObj.eDate = $scope.DateTimeFormat($scope.mtgreport.endDate, 'end');
                                    meetingSearchObj.searchFor = $scope.meetingsReportSearch.filter;
                                    meetingSearchObj.searchBy = topDealerSearchBy;

                                    $http.post("/dash/reports/meeting",meetingSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.meetingreport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.meeting_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 9:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.skureport.length){
                            if(viewLength + viewBy < $scope.sku_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                skuSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    skuSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    skuSearchObj.viewBy = initialViewBy;
                                }
                                skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
                                skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
                                skuSearchObj.category = $scope.skuReportFilter.category.Manufacturer;
                                skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
                                skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                                skuSearchObj.searchBy = itemSearchBy;


                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/sku",skuSearchObj)
                                    .success(function(response){
                                        // console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.skureport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.sku_count){
                                            a = viewLength + viewBy - $scope.sku_count;
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
                                if(viewLength + viewBy > $scope.sku_count){
                                    a = viewLength + viewBy - $scope.sku_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.sku_count){
                                a = viewLength + viewBy - $scope.sku_count;
                                viewBy -= a;
                                if(viewLength + viewBy >  $scope.skureport.length){
                                    skuSearchObj.viewLength =  $scope.skureport.length;
                                    skuSearchObj.viewBy = viewLength + viewBy -  $scope.skureport.length;
                                    skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
                                    skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
                                    skuSearchObj.category = $scope.skuReportFilter.category.Manufacturer;
                                    skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
                                    skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                                    skuSearchObj.searchBy = itemSearchBy;

                                    $http.post("/dash/reports/sku",skuSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.skureport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy >  $scope.skureport.length){
                                    skuSearchObj.viewLength =  $scope.skureport.length;
                                    skuSearchObj.viewBy = viewLength + viewBy -  $scope.skureport.length;
                                    skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
                                    skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
                                    skuSearchObj.category = $scope.skuReportFilter.category.Manufacturer;
                                    skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
                                    skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                                    skuSearchObj.searchBy = itemSearchBy;

                                    $http.post("/dash/reports/sku",skuSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.skureport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.sku_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 13:
                    //console.log("case 13")
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;

                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.checkInEmployeeTime.length){
                            if(viewLength + viewBy < $scope.emp_count){
                                $scope.displayloader = true
                                viewLength += viewBy;
                                //console.log("Fetch more")


                                employeeSearchObj.viewLength = viewLength;

                                if($scope.newViewBy > initialViewBy ){
                                    employeeSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    employeeSearchObj.viewBy = initialViewBy;
                                }
                                employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
                                employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
                                employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                                employeeSearchObj.searchBy = employeeSearchBy;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/employee",employeeSearchObj)
                                    .success(function(response){
                                         console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.checkInEmployeeTime.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.emp_count){
                                            a = viewLength + viewBy - $scope.emp_count;
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
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.emp_count){
                                    a = viewLength + viewBy - $scope.emp_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.emp_count){
                                a = viewLength + viewBy - $scope.emp_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.checkInEmployeeTime.length){
                                    employeeSearchObj.viewLength = $scope.checkInEmployeeTime.length;
                                    employeeSearchObj.viewBy = viewLength + viewBy - $scope.checkInEmployeeTime.length;
                                    employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
                                    employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
                                    employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                                    employeeSearchObj.searchBy = employeeSearchBy;

                                    $http.post("/dash/reports/employee",employeeSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.checkInEmployeeTime.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.checkInEmployeeTime.length){
                                    employeeSearchObj.viewLength = $scope.checkInEmployeeTime.length;
                                    employeeSearchObj.viewBy = viewLength + viewBy - $scope.checkInEmployeeTime.length;
                                    employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
                                    employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
                                    employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                                    employeeSearchObj.searchBy = employeeSearchBy;

                                    $http.post("/dash/reports/employee",employeeSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.checkInEmployeeTime.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.emp_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 14:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;


                    if(direction){
                         console.log(" overallreports NEXT");
                        if(viewLength + viewBy >= $scope.overallreports.length){

                            if(viewLength + viewBy < $scope.overall_count){
                                viewLength += viewBy;
                                // console.log("Fetch more")
                                overallSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    overallSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    overallSearchObj.viewBy = initialViewBy;
                                }
                                overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
                                overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
                                overallSearchObj.searchFor = $scope.overallReportFilter.filter;
                                overallSearchObj.searchBy = reportSearchBy;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/overallreports",overallSearchObj)
                                    .success(function(response){
                                        // console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.overallreports.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.overall_count){
                                            a = viewLength + viewBy - $scope.overall_count;
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
                                if(viewLength + viewBy > $scope.overall_count){
                                    a = viewLength + viewBy - $scope.overall_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.overall_count){
                                a = viewLength + viewBy - $scope.overall_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.overallreports.length){
                                    overallSearchObj.viewLength = $scope.overallreports.length;
                                    overallSearchObj.viewBy = viewLength + viewBy - $scope.overallreports.length;
                                    overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
                                    overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
                                    overallSearchObj.searchFor = $scope.overallReportFilter.filter;
                                    overallSearchObj.searchBy = reportSearchBy;

                                    $http.post("/dash/reports/overallreports",overallSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.overallreports.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.overallreports.length){
                                    overallSearchObj.viewLength = $scope.overallreports.length;
                                    overallSearchObj.viewBy = viewLength + viewBy - $scope.overallreports.length;
                                    overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
                                    overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
                                    overallSearchObj.searchFor = $scope.overallReportFilter.filter;
                                    overallSearchObj.searchBy = reportSearchBy;

                                    $http.post("/dash/reports/overallreports",overallSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.overallreports.push(response[i]);
                                            }

                                        })

                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.overall_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 15:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.enquiryreport.length){
                            if(viewLength + viewBy < $scope.user_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                topEnquirySearchObj.viewLength = viewLength;
                                topEnquirySearchObj.viewBy = initialViewBy;
                                topEnquirySearchObj.sDate = $scope.DateTimeFormat($scope.enquiryReportFilter.startDate, 'start');
                                topEnquirySearchObj.eDate = $scope.DateTimeFormat($scope.enquiryReportFilter.endDate, 'end');
                                topEnquirySearchObj.searchFor = $scope.enquiryReportSearch.filter;
                                topEnquirySearchObj.searchBy = enquirySearchBy;


                                $http.post("/dash/reports/storeJini/top/enquiry",topEnquirySearchObj)
                                    .success(function(response){


                                        for(var i=0; i<response.length; i++){
                                            $scope.enquiryreport.push(response[i]);
                                            console.log( $scope.enquiryreport);
                                        }

                                        if(viewLength + viewBy > $scope.enquiryreport.length){
                                            a = viewLength + viewBy - $scope.enquiryreport.length;
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

                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.enquiryreport.length){
                                    a = viewLength + viewBy - $scope.enquiryreport.length;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.enquiryreport.length){
                                a = viewLength + viewBy - $scope.enquiryreport.length;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.enquiryreport.length){
                                    topEnquirySearchObj.viewLength = $scope.enquiryreport.length;
                                    topEnquirySearchObj.viewBy = viewLength + viewBy - $scope.enquiryreport.length;
                                    topEnquirySearchObj.sDate = $scope.DateTimeFormat($scope.enquiryReportFilter.startDate, 'start');
                                    topEnquirySearchObj.eDate = $scope.DateTimeFormat($scope.enquiryReportFilter.endDate, 'end');
                                    topEnquirySearchObj.searchFor = $scope.enquiryReportSearch.filter;
                                    topEnquirySearchObj.searchBy = enquirySearchBy;


                                    $http.post("/dash/reports/storeJini/top/enquiry",topEnquirySearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.enquiryreport.push(response[i]);
                                                console.log( $scope.enquiryreport);
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
                            }else {
                                if(viewLength + viewBy > $scope.enquiryreport.length){
                                    topEnquirySearchObj.viewLength = $scope.enquiryreport.length;
                                    topEnquirySearchObj.viewBy = viewLength + viewBy - $scope.enquiryreport.length;
                                    topEnquirySearchObj.sDate = $scope.DateTimeFormat($scope.enquiryReportFilter.startDate, 'start');
                                    topEnquirySearchObj.eDate = $scope.DateTimeFormat($scope.enquiryReportFilter.endDate, 'end');
                                    topEnquirySearchObj.searchFor = $scope.enquiryReportSearch.filter;
                                    topEnquirySearchObj.searchBy = enquirySearchBy;


                                    $http.post("/dash/reports/storeJini/top/enquiry",topEnquirySearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.enquiryreport.push(response[i]);
                                                console.log( $scope.enquiryreport);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.enquiryreport.length){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 16:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.targetAchievementreport.length){
                            if(viewLength + viewBy < $scope.user_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                targetAchievementSearchObj.viewLength = viewLength;
                                targetAchievementSearchObj.viewBy = initialViewBy;
                                targetAchievementSearchObj.sDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.startDate, 'start');
                                targetAchievementSearchObj.eDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.endDate, 'end');
                                targetAchievementSearchObj.searchFor = $scope.targetAchievementReportSearch.filter;
                                targetAchievementSearchObj.searchBy = topSellerSearchBy;


                                $http.post("/dash/reports/storeJini/target/achievement",targetAchievementSearchObj)
                                    .success(function(response){


                                        for(var i=0; i<response.length; i++){
                                            $scope.targetAchievementreport.push(response[i]);
                                            console.log( $scope.targetAchievementreport);
                                        }

                                        if(viewLength + viewBy > $scope.targetAchievementreport.length){
                                            a = viewLength + viewBy - $scope.targetAchievementreport.length;
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

                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.targetAchievementreport.length){
                                    a = viewLength + viewBy - $scope.targetAchievementreport.length;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.targetAchievementreport.length){
                                a = viewLength + viewBy - $scope.targetAchievementreport.length;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.targetAchievementreport.length){
                                    targetAchievementSearchObj.viewLength = $scope.targetAchievementreport.length;
                                    targetAchievementSearchObj.viewBy = viewLength + viewBy - $scope.targetAchievementreport.length;
                                    targetAchievementSearchObj.sDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.startDate, 'start');
                                    targetAchievementSearchObj.eDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.endDate, 'end');
                                    targetAchievementSearchObj.searchFor = $scope.targetAchievementReportSearch.filter;
                                    targetAchievementSearchObj.searchBy = topSellerSearchBy;


                                    $http.post("/dash/reports/storeJini/target/achievement",targetAchievementSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.targetAchievementreport.push(response[i]);
                                                console.log( $scope.targetAchievementreport);
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
                            }else {
                                if(viewLength + viewBy > $scope.targetAchievementreport.length){
                                    targetAchievementSearchObj.viewLength = $scope.targetAchievementreport.length;
                                    targetAchievementSearchObj.viewBy = viewLength + viewBy - $scope.targetAchievementreport.length;
                                    targetAchievementSearchObj.sDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.startDate, 'start');
                                    targetAchievementSearchObj.eDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.endDate, 'end');
                                    targetAchievementSearchObj.searchFor = $scope.targetAchievementReportSearch.filter;
                                    targetAchievementSearchObj.searchBy = topSellerSearchBy;


                                    $http.post("/dash/reports/storeJini/target/achievement",targetAchievementSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.targetAchievementreport.push(response[i]);
                                                console.log( $scope.targetAchievementreport);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.targetAchievementreport.length){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 17:

                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.salesreport.length){
                            if(viewLength + viewBy < $scope.sales_count){
                                $scope.displayloader = true;
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                salesSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    salesSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    salesSearchObj.viewBy = initialViewBy;
                                }
                                salesSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportFilter.startDate, 'start');
                                salesSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportFilter.endDate, 'end');
                                salesSearchObj.searchFor = $scope.salesReportSeach.filter;
                                salesSearchObj.searchBy = salesSearchBy;
                                salesSearchObj.class = '';
                                salesSearchObj.paymentMode = '';
                                salesSearchObj.seller = '';
                                salesSearchObj.Manufacturer = '';
                                if($scope.salesReportFilter.class)
                                    salesSearchObj.class = $scope.salesReportFilter.class;
                                if($scope.salesReportFilter.paymentMode)
                                    salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
                                if($scope.salesReportFilter.seller)
                                    salesSearchObj.seller = $scope.salesReportFilter.seller ;
                                if($scope.salesReportFilter.Manufacturer)
                                    salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");

                                $http.post("/dash/reports/sales/orders",salesSearchObj)
                                    .success(function(response){
                                        // console.log(response);


                                        for(var i=0; i<response.length; i++){
                                            $scope.salesreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.expense_count){
                                            a = viewLength + viewBy - $scope.expense_count;
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
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.sales_count){
                                    a = viewLength + viewBy - $scope.sales_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.sales_count){
                                a = viewLength + viewBy - $scope.sales_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.salesreport.length){
                                    salesSearchObj.viewLength =  $scope.salesreport.length;
                                    salesSearchObj.viewBy = viewLength + viewBy - $scope.salesreport.length;
                                    salesSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportSeach.startDate, 'start');
                                    salesSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportSeach.endDate, 'end');
                                    salesSearchObj.searchFor = $scope.expenseReportSearch.filter;
                                    salesSearchObj.searchBy = expenseSearchBy;
                                    salesSearchObj.filter = $scope.expenseFilterStatus;
                                    if($scope.salesReportFilter.class)
                                        salesSearchObj.class = $scope.salesReportFilter.class;
                                    if($scope.salesReportFilter.paymentMode)
                                        salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
                                    if($scope.salesReportFilter.seller)
                                        salesSearchObj.seller = $scope.salesReportFilter.seller ;
                                    if($scope.salesReportFilter.Manufacturer)
                                        salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;


                                    $http.post("/dash/reports/sales/orders",salesSearchObj)
                                        .success(function(response){
                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.salesreport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.salesreport.length){
                                    salesSearchObj.viewLength =  $scope.salesreport.length;
                                    salesSearchObj.viewBy = viewLength + viewBy - $scope.salesreport.length;
                                    salesSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                                    salesSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                                    salesSearchObj.searchFor = $scope.expenseReportSearch.filter;
                                    salesSearchObj.searchBy = expenseSearchBy;
                                    salesSearchObj.filter = $scope.expenseFilterStatus;
                                    if($scope.salesReportFilter.class)
                                        salesSearchObj.class = $scope.salesReportFilter.class;
                                    if($scope.salesReportFilter.paymentMode)
                                        salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
                                    if($scope.salesReportFilter.seller)
                                        salesSearchObj.seller = $scope.salesReportFilter.seller ;
                                    if($scope.salesReportFilter.Manufacturer)
                                        salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;


                                    $http.post("/dash/reports/sales/orders",salesSearchObj)
                                        .success(function(response){
                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.salesreport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.sales_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }


                    break;

                case 18:

                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.ridersreport.length){
                            if(viewLength + viewBy < $scope.rider_count){
                                $scope.displayloader = true
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                riderSearchObj.viewLength = viewLength;


                                if($scope.newViewBy > initialViewBy ){
                                    riderSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    riderSearchObj.viewBy = initialViewBy;
                                }
                                riderSearchObj.sDate = $scope.DateTimeFormat($scope.ridersReportFilter.startDate, 'start');
                                riderSearchObj.eDate = $scope.DateTimeFormat($scope.ridersReportFilter.endDate, 'end');
                                riderSearchObj.searchFor = $scope.salesReportSeach.filter;
                                riderSearchObj.searchBy = riderSearchBy;
                                riderSearchObj.class = '';
                                riderSearchObj.paymentMode = '';
                                riderSearchObj.seller = '';
                                riderSearchObj.Manufacturer = '';
                                if($scope.ridersReportFilter.paymentMode)
                                    riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
                                if($scope.ridersReportFilter.fulfiller)
                                    riderSearchObj.fulfiller = $scope.ridersReportFilter.fulfiller ;
                                if($scope.ridersReportFilter.Manufacturer)
                                    riderSearchObj.Manufacturer = $scope.ridersReportFilter.Manufacturer ;


                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");

                                $http.post("/dash/reports/riders/orders",riderSearchObj)
                                    .success(function(response){
                                        // console.log(response);


                                        for(var i=0; i<response.length; i++){
                                            $scope.ridersreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.expense_count){
                                            a = viewLength + viewBy - $scope.expense_count;
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
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.rider_count){
                                    a = viewLength + viewBy - $scope.rider_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.rider_count){
                                a = viewLength + viewBy - $scope.rider_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.ridersreport.length){
                                    riderSearchObj.viewLength =  $scope.ridersreport.length;
                                    riderSearchObj.viewBy = viewLength + viewBy - $scope.ridersreport.length;
                                    riderSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportSeach.startDate, 'start');
                                    riderSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportSeach.endDate, 'end');
                                    riderSearchObj.searchFor = $scope.expenseReportSearch.filter;
                                    riderSearchObj.searchBy = expenseSearchBy;
                                    riderSearchObj.filter = $scope.expenseFilterStatus;
                                    if($scope.ridersReportFilter.class)
                                        riderSearchObj.class = $scope.ridersReportFilter.class;
                                    if($scope.ridersReportFilter.paymentMode)
                                        riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
                                    if($scope.ridersReportFilter.seller)
                                        riderSearchObj.seller = $scope.ridersReportFilter.seller ;
                                    if($scope.ridersReportFilter.Manufacturer)
                                        riderSearchObj.Manufacturer = $scope.ridersReportFilter.Manufacturer ;


                                    $http.post("/dash/reports/sales/orders",riderSearchObj)
                                        .success(function(response){
                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.salesreport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.ridersreport.length){
                                    riderSearchObj.viewLength =  $scope.ridersreport.length;
                                    riderSearchObj.viewBy = viewLength + viewBy - $scope.ridersreport.length;
                                    riderSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                                    riderSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                                    riderSearchObj.searchFor = $scope.expenseReportSearch.filter;
                                    riderSearchObj.searchBy = expenseSearchBy;
                                    riderSearchObj.filter = $scope.expenseFilterStatus;
                                    if($scope.ridersReportFilter.class)
                                        riderSearchObj.class = $scope.ridersReportFilter.class;
                                    if($scope.ridersReportFilter.paymentMode)
                                        riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
                                    if($scope.ridersReportFilter.seller)
                                        riderSearchObj.seller = $scope.ridersReportFilter.seller ;
                                    if($scope.ridersReportFilter.Manufacturer)
                                        riderSearchObj.Manufacturer = $scope.ridersReportFilter.Manufacturer ;


                                    $http.post("/dash/reports/riders/orders",riderSearchObj)
                                        .success(function(response){
                                            console.log(response);


                                            for(var i=0; i<response.length; i++){
                                                $scope.ridersreport.push(response[i]);
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
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.rider_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }


                    break;


                case 21:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;

                    if(direction){
                        // console.log("NEXT");
                        if(viewLength + viewBy >= $scope.riderCheckInreport.length){

                            if(viewLength + viewBy < $scope.riderCheckin_count){
                                viewLength += viewBy;
                                // console.log("Fetch more")
                                riderCheckinSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    riderCheckinSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    riderCheckinSearchObj.viewBy = initialViewBy;
                                }
                                riderCheckinSearchObj.sDate = $scope.DateTimeFormat($scope.riderCheckInreports.startDate, 'start');
                                riderCheckinSearchObj.eDate = $scope.DateTimeFormat($scope.riderCheckInreports.endDate, 'end');
                                riderCheckinSearchObj.searchFor = $scope.riderCheckInReportSearch.filter;
                                riderCheckinSearchObj.searchBy = riderCheckinSearchBy;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/rider/checkins",riderCheckinSearchObj)
                                    .success(function(response){
                                        // console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.riderCheckInreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.riderCheckin_count){
                                            a = viewLength + viewBy - $scope.riderCheckin_count;
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
                                if(viewLength + viewBy > $scope.riderCheckin_count){
                                    a = viewLength + viewBy - $scope.riderCheckin_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.riderCheckin_count){
                                a = viewLength + viewBy - $scope.riderCheckin_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.riderCheckInreport.length){
                                    riderCheckinSearchObj.viewLength = $scope.riderCheckInreport.length;
                                    riderCheckinSearchObj.viewBy = viewLength + viewBy - $scope.riderCheckInreport.length;
                                    riderCheckinSearchObj.sDate = $scope.DateTimeFormat($scope.riderCheckInreports.startDate, 'start');
                                    riderCheckinSearchObj.eDate = $scope.DateTimeFormat($scope.riderCheckInreports.endDate, 'end');
                                    riderCheckinSearchObj.searchFor = $scope.riderCheckInReportSearch.filter;
                                    riderCheckinSearchObj.searchBy = riderCheckinSearchBy;

                                    $http.post("/dash/reports/rider/checkins",riderCheckinSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.riderCheckInreport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.riderCheckInreport.length){
                                    riderCheckinSearchObj.viewLength = $scope.riderCheckInreport.length;
                                    riderCheckinSearchObj.viewBy = viewLength + viewBy - $scope.riderCheckInreport.length;
                                    riderCheckinSearchObj.sDate = $scope.DateTimeFormat($scope.riderCheckInreports.startDate, 'start');
                                    riderCheckinSearchObj.eDate = $scope.DateTimeFormat($scope.riderCheckInreports.endDate, 'end');
                                    riderCheckinSearchObj.searchFor = $scope.riderCheckInReportSearch.filter;
                                    riderCheckinSearchObj.searchBy = riderCheckinSearchBy;

                                    $http.post("/dash/reports/rider/checkins",riderCheckinSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.riderCheckInreport.push(response[i]);
                                            }

                                        })

                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.riderCheckin_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 23:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;


                    if(direction){
                        // console.log("NEXT");
                        if(viewLength + viewBy >= $scope.riderActivityreport.length){

                            if(viewLength + viewBy < $scope.riderActivity_count){
                                viewLength += viewBy;
                                // console.log("Fetch more")
                                riderActivitySearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    riderActivitySearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    riderActivitySearchObj.viewBy = initialViewBy;
                                }
                                riderActivitySearchObj.sDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'start');
                                riderActivitySearchObj.eDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'end');

                                riderActivitySearchObj.searchFor = $scope.riderActivityReportSearch.filter;
                                riderActivitySearchObj.searchBy = riderActivitySearchBy;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/rider/activity",riderActivitySearchObj)
                                    .success(function(response){
                                        // console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.riderActivityreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.riderActivity_count){
                                            a = viewLength + viewBy - $scope.riderActivity_count;
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
                                if(viewLength + viewBy > $scope.riderActivity_count){
                                    a = viewLength + viewBy - $scope.riderActivity_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.riderActivity_count){
                                a = viewLength + viewBy - $scope.riderActivity_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.riderActivityreport.length){
                                    riderActivitySearchObj.viewLength = $scope.riderActivityreport.length;
                                    riderActivitySearchObj.viewBy = viewLength + viewBy - $scope.riderActivityreport.length;
                                    riderActivitySearchObj.sDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'start');
                                    riderActivitySearchObj.eDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'end');

                                    riderActivitySearchObj.searchFor = $scope.riderActivityReportSearch.filter;
                                    riderActivitySearchObj.searchBy = riderActivitySearchBy;

                                    $http.post("/dash/reports/rider/activity",riderActivitySearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.riderActivityreport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.riderActivityreport.length){
                                    riderActivitySearchObj.viewLength = $scope.riderActivityreport.length;
                                    riderActivitySearchObj.viewBy = viewLength + viewBy - $scope.riderActivityreport.length;
                                    riderActivitySearchObj.sDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'start');
                                    riderActivitySearchObj.eDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'end');

                                    riderActivitySearchObj.searchFor = $scope.riderActivityReportSearch.filter;
                                    riderActivitySearchObj.searchBy = riderActivitySearchBy;

                                    $http.post("/dash/reports/rider/activity",riderActivitySearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.riderActivityreport.push(response[i]);
                                            }

                                        })

                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.riderActivity_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 24:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;


                    if(direction){
                        // console.log("NEXT");
                        if(viewLength + viewBy >= $scope.orderSummaryreport.length){

                            if(viewLength + viewBy < $scope.orderSummary_count){
                                viewLength += viewBy;
                                // console.log("Fetch more")
                                orderSummarySearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    orderSummarySearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    orderSummarySearchObj.viewBy = initialViewBy;
                                }
                                orderSummarySearchObj.startDate = $scope.DateTimeFormat($scope.orderSearch.startDate, 'start');
                                orderSummarySearchObj.endDate = $scope.DateTimeFormat($scope.orderSearch.endDate, 'end');
                                orderSummarySearchObj.searchFor = $scope.orderSearch.filter;
                                orderSummarySearchObj.searchBy = orderSearchBy;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/order/summary",orderSummarySearchObj)
                                    .success(function(response){
                                        // console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.orderSummaryreport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.orderSummary_count){
                                            a = viewLength + viewBy - $scope.orderSummary_count;
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
                                if(viewLength + viewBy > $scope.orderSummary_count){
                                    a = viewLength + viewBy - $scope.orderSummary_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.orderSummary_count){
                                a = viewLength + viewBy - $scope.orderSummary_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.orderSummaryreport.length){
                                    orderSummarySearchObj.viewLength = $scope.orderSummaryreport.length;
                                    orderSummarySearchObj.viewBy = viewLength + viewBy - $scope.orderSummaryreport.length;
                                    orderSummarySearchObj.startDate = $scope.DateTimeFormat($scope.orderSearch.startDate, 'start');
                                    orderSummarySearchObj.endDate = $scope.DateTimeFormat($scope.orderSearch.endDate, 'end');
                                    orderSummarySearchObj.searchFor = $scope.orderSearch.filter;
                                    orderSummarySearchObj.searchBy = orderSearchBy;

                                    $http.post("/dash/reports/order/summary",orderSummarySearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.orderSummaryreport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.orderSummaryreport.length){
                                    orderSummarySearchObj.viewLength = $scope.orderSummaryreport.length;
                                    orderSummarySearchObj.viewBy = viewLength + viewBy - $scope.orderSummaryreport.length;
                                    orderSummarySearchObj.startDate = $scope.DateTimeFormat($scope.orderSearch.startDate, 'start');
                                    orderSummarySearchObj.endDate = $scope.DateTimeFormat($scope.orderSearch.endDate, 'end');
                                    orderSummarySearchObj.searchFor = $scope.orderSearch.filter;
                                    orderSummarySearchObj.searchBy = orderSearchBy;

                                    $http.post("/dash/reports/order/summary",orderSummarySearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.orderSummaryreport.push(response[i]);
                                            }

                                        })

                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.orderSummary_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 39:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;


                    if(direction){
                        // console.log("NEXT");
                        if(viewLength + viewBy >= $scope.customOrderReport.length){

                            if(viewLength + viewBy < $scope.customOrder_count){
                                viewLength += viewBy;
                                // console.log("Fetch more")
                                customOrderSearchObj.viewLength = viewLength;
                                if($scope.newViewBy > initialViewBy ){
                                    customOrderSearchObj.viewBy = $scope.newViewBy;
                                }else{
                                    customOrderSearchObj.viewBy = initialViewBy;
                                }
                                customOrderSearchObj.sDate = $scope.DateTimeFormat($scope.customOrderFilter.startDate, 'start');
                                customOrderSearchObj.eDate = $scope.DateTimeFormat($scope.customOrderFilter.endDate, 'end');
                                customOrderSearchObj.searchFor = $scope.customOrderFilter.filter;
                                customOrderSearchObj.searchBy = customOrderSearchBy;
                                customOrderSearchObj.plant = $scope.customOrderFilter.plant;
                                customOrderSearchObj.state = $scope.customOrderFilter.state;

                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");
                                $http.post("/dash/reports/customordersreport",customOrderSearchObj)
                                    .success(function(response){
                                        // console.log("results",response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.customOrderReport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.customOrder_count){
                                            a = viewLength + viewBy - $scope.customOrder_count;
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
                                if(viewLength + viewBy > $scope.customOrder_count){
                                    a = viewLength + viewBy - $scope.customOrder_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.customOrder_count){
                                a = viewLength + viewBy - $scope.customOrder_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.customOrderReport.length){
                                    customOrderSearchObj.viewLength = $scope.customOrderReport.length;
                                    customOrderSearchObj.viewBy = viewLength + viewBy - $scope.customOrderReport.length;
                                    customOrderSearchObj.sDate = $scope.DateTimeFormat($scope.customOrderFilter.startDate, 'start');
                                    customOrderSearchObj.eDate = $scope.DateTimeFormat($scope.customOrderFilter.endDate, 'end');
                                    customOrderSearchObj.searchFor = $scope.customOrderFilter.filter;
                                    customOrderSearchObj.searchBy = customOrderSearchBy;
                                    customOrderSearchObj.plant = $scope.customOrderFilter.plant;
                                    customOrderSearchObj.state = $scope.customOrderFilter.state;

                                    $http.post("/dash/reports/customordersreport",customOrderSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.customOrderReport.push(response[i]);
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
                            }else{
                                if(viewLength + viewBy > $scope.customOrderReport.length){
                                    customOrderSearchObj.viewLength = $scope.customOrderReport.length;
                                    customOrderSearchObj.viewBy = viewLength + viewBy - $scope.customOrderReport.length;
                                    customOrderSearchObj.sDate = $scope.DateTimeFormat($scope.customOrderFilter.startDate, 'start');
                                    customOrderSearchObj.eDate = $scope.DateTimeFormat($scope.customOrderFilter.endDate, 'end');
                                    customOrderSearchObj.searchFor = $scope.customOrderFilter.filter;
                                    customOrderSearchObj.searchBy = customOrderSearchBy;
                                    customOrderSearchObj.plant = $scope.customOrderFilter.plant;
                                    customOrderSearchObj.state = $scope.customOrderFilter.state;

                                    $http.post("/dash/reports/customordersreport",customOrderSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.customOrderReport.push(response[i]);
                                            }

                                        })

                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.customOrder_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;
            }

        }

        //.... Reports Transactions Counts...
        $scope.reportsTransactionCount = function(response, tab){
            switch(tab){
                case 1:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.sold_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.sold_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.itemreport = [];
                            $scope.newViewBy = 1;
                            $scope.sold_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.itemreport = [];
                        $scope.newViewBy = 1;
                        $scope.sold_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;


                case 2:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.customer_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.customer_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.dealerreport = [];
                            $scope.newViewBy = 1;
                            $scope.customer_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.dealerreport = [];
                        $scope.newViewBy = 1;
                        $scope.customer_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 3:
                    // console.log("top user report  ",response);
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.user_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.user_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.sellerreport = [];
                            $scope.newViewBy = 1;
                            $scope.user_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.sellerreport = [];
                        $scope.newViewBy = 1;
                        $scope.user_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;


                case 4:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.summary_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.summary_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.orderreport = [];
                            $scope.newViewBy = 1;
                            $scope.summary_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.orderreport = [];
                        $scope.newViewBy = 1;
                        $scope.summary_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 5:
                    // console.log("payment report ",response);
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.payment_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.payment_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.cashreport = [];
                            $scope.newViewBy = 1;
                            $scope.payment_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.cashreport = [];
                        $scope.newViewBy = 1;
                        $scope.payment_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 6:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.checkin_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.checkin_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.checkInreport = [];
                            $scope.newViewBy = 1;
                            $scope.checkin_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.checkInreport = [];
                        $scope.newViewBy = 1;
                        $scope.checkin_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 7:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.expense_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.expense_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.expensereport = [];
                            $scope.newViewBy = 1;
                            $scope.expense_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.expensereport = [];
                        $scope.newViewBy = 1;
                        $scope.expense_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;



                case 8:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.meeting_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.meeting_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.meetingreport = [];
                            $scope.newViewBy = 1;
                            $scope.meeting_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.meetingreport = [];
                        $scope.newViewBy = 1;
                        $scope.meeting_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 9:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.sku_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.sku_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.skureport = [];
                            $scope.newViewBy = 1;
                            $scope.sku_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.skureport = [];
                        $scope.newViewBy = 1;
                        $scope.sku_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 13:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.emp_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.emp_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.checkInEmployeeTime = [];
                            $scope.newViewBy = 1;
                            $scope.emp_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.checkInEmployeeTime = [];
                        $scope.newViewBy = 1;
                        $scope.emp_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 14:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.overall_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.overall_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.overallreports = [];
                            $scope.newViewBy = 1;
                            $scope.overall_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.overallreports = [];
                        $scope.newViewBy = 1;
                        $scope.overall_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 15:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.enquiry_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.enquiry_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.enquiryreports = [];
                            $scope.newViewBy = 1;
                            $scope.enquiry_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.enquiryreports = [];
                        $scope.newViewBy = 1;
                        $scope.enquiry_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 16:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.targetAchievement_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.targetAchievement_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.targetAchievementreport = [];
                            $scope.newViewBy = 1;
                            $scope.targetAchievement_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.targetAchievementreport = [];
                        $scope.newViewBy = 1;
                        $scope.targetAchievement_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;
                case 17:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.dashboardBranch_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.dashboardBranch_count = response;
                            $scope.newViewBy = response;

                        }
                        else{
                            $scope.dashboardBranchReport = [];
                            $scope.newViewBy = 1;
                            $scope.dashboardBranch_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.dashboardBranchReport = [];
                        $scope.newViewBy = 1;
                        $scope.dashboardBranch_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 18:

                    if(response){

                        if(response > $scope.newViewBy){
                            $scope.sales_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.sales_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.salesreport = [];
                            $scope.newViewBy = 1;
                            $scope.sales_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.salesreport = [];
                        $scope.newViewBy = 1;
                        $scope.sales_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 19:

                    if(response){

                        if(response > $scope.newViewBy){
                            $scope.rider_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.rider_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.ridersreport = [];
                            $scope.newViewBy = 1;
                            $scope.rider_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.ridersreport = [];
                        $scope.newViewBy = 1;
                        $scope.rider_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 21:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.riderCheckin_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.riderCheckin_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.riderCheckInreport = [];
                            $scope.newViewBy = 1;
                            $scope.riderCheckin_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.riderCheckInreport = [];
                        $scope.newViewBy = 1;
                        $scope.riderCheckin_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 23:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.riderActivity_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.riderActivity_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.riderActivityreport = [];
                            $scope.newViewBy = 1;
                            $scope.riderActivity_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.riderActivityreport = [];
                        $scope.newViewBy = 1;
                        $scope.riderActivity_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

                case 24:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.orderSummary_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.orderSummary_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.orderSummaryreport = [];
                            $scope.newViewBy = 1;
                            $scope.orderSummary_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.orderSummaryreport = [];
                        $scope.newViewBy = 1;
                        $scope.orderSummary_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;
                case 39:
                    if(response){
                        if(response > $scope.newViewBy){
                            $scope.customOrder_count = response;
                        }
                        else if(response <= $scope.newViewBy){
                            $scope.customOrder_count = response;
                            $scope.newViewBy = response;
                        }
                        else{
                            $scope.customOrderReport = [];
                            $scope.newViewBy = 1;
                            $scope.customOrder_count = 0;
                            $scope.viewLength = -1;
                        }
                    }
                    else{
                        $scope.customOrderReport = [];
                        $scope.newViewBy = 1;
                        $scope.customOrder_count = 0;
                        $scope.viewLength = -1;
                    }

                    break;

            }

        }

        var a = 0;

        $scope.navPage = function(tab, direction){
            switch(tab){

                //Attendance Navigation
                case 3:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;

                    if(direction){
                        //console.log("NEXT");

                        if(viewLength + viewBy >= $scope.attendancereport.length){
                            if(viewLength + viewBy < $scope.attendance_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                attSearchObj.viewLength = viewLength;
                                attSearchObj.viewBy = initialViewBy;
                                attSearchObj.sDate = $scope.DateTimeFormat($scope.atdreports.startDate, 'start');
                                attSearchObj.eDate = $scope.DateTimeFormat($scope.atdreports.endDate, 'end');
                                attSearchObj.searchFor = $scope.AttendanceReportSearch.filter;

                                $http.post("/dash/reports/attendance",attSearchObj)
                                    .success(function(response){
                                        //console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.attendancereport.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.attendance_count){
                                            a = viewLength + viewBy - $scope.attendance_count;
                                            viewBy -= a;
                                            $scope.newViewBy = viewBy;
                                        }
                                        $scope.viewLength = viewLength;
                                    })

                            }
                            else{
                                //console.log("Out of data")
                                if(viewLength + viewBy > $scope.attendance_count){
                                    a = viewLength + viewBy - $scope.attendance_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            //console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.attendance_count){
                                a = viewLength + viewBy - $scope.attendance_count;
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
                            if(viewLength + viewBy >= $scope.attendance_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;
            }
        }

        //Function to refresh all the reports
        $scope.refreshReports = function (id) {
            // console.log($scope.newViewBy1)
            $scope.newViewBy1.view = 10;
            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            switch (id) {
                case 0:
                    $scope.loaded(8);
                    break;
                case 1 :
                    $scope.changeReportView(1);
                    break;
                case 2 :
                    $scope.changeReportView(2);
                    break;
                case 3 :
                    $scope.changeReportView(3);
                    break;
                case 4 :
                    $scope.changeReportView(4);
                    break;
                case 5 :
                    $scope.changeReportView(5);

                    paymentSearchObj.viewLength = 0;
                    paymentSearchObj.viewBy = initialViewBy;
                    paymentSearchObj.filter = '';


                    $scope.modeOfPayment = '';
                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.cashreport = [];


                    if($scope.applicationType != 'StoreJini'){
                        $http.post("/dash/reports/cashitems",paymentSearchObj)
                            .success(function(response){
                                $scope.cashreport = response;

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

                    if($scope.applicationType == 'StoreJini'){
                        $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                            .success(function(response){
                                $scope.cashreport = response;

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
                    $http.post("/dash/reports/payment/count", paymentSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 5);
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
                    break;

                case 6 :
                    $scope.changeReportView(6);
                    break;
                case 7 :
                    $scope.changeReportView(7);

                    expenseSearchObj.viewLength = 0;
                    expenseSearchObj.viewBy = initialViewBy;
                    expenseSearchObj.filter = '';


                    $scope.expenseFilterStatus = '';
                    $scope.viewLength = 0;
                    $scope.expreport.status = '';
                    $scope.newViewBy = localViewBy;
                    $scope.expensereport = [];

                    $http.post("/dash/reports/expense", expenseSearchObj)
                        .success(function(res){
                            $scope.expensereport = res;
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

                    $http.post("/dash/reports/expense/count", expenseSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 7);
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

                    break;
                case 8 :
                    $scope.changeReportView(8);
                    break;
                case 9 :
                    $scope.changeReportView(9);
                    break;
                // case 10 :
                //     $scope.renderVisitsReport();
                //     break;
                case 11 :
                    $scope.renderQuotationReport();
                    break;
                case 12 :
                    $scope.changeReportView(13);
                    break;
                case 13 :
                    $scope.changeReportView(14);
                    break;
                case 14 :
                    $scope.changeReportView(15);
                    break;
                case 15 :
                    $scope.changeReportView(16);
                    break;
                case 20 :
                    $scope.changeReportView(20);
                    break;
                case 21 :
                    // $scope.riderCheckInreports.rider = '';
                    $scope.changeReportView(21);
                    break;
                case 23 :
                    // $scope.riderActivityreports.rider = '';
                    // $scope.riderActivityreports.startDate = '';
                    // $scope.riderActivityreports.customerVisits = 0;
                    $scope.changeReportView(23);
                    break;
                case 24 :
                    // $scope.orderSearch.startDate = '';
                    // $scope.orderSearch.endDate = '';
                    // $scope.orderSearch.source = '';
                    // $scope.orderSearch.seller = '';
                    // $scope.orderSearch.dealer = '';
                    // $scope.orderSearch.warehouse = '';
                    // $scope.orderSearch.paymentStatus = '';
                    // $scope.orderSearch.fulfillmentStatus = '';
                    // $scope.orderSearch.dealerPhone_Name = '';
                    // $scope.orderSearch.dealer = '';
                    // $scope.orderSearch.filterStockist = '';
                    // $scope.showOrderFilter = false;

                    $scope.changeReportView(24);
                    break;
                case 39 :
                    $scope.changeReportView(39);
                    break;

            }

            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 2000)
        }

        /*QUOTATION SUMMARY REPORT START*/

        $scope.renderQuotationReport = function () {
            //If date is set pass the parameter

            if($scope.QuotationReportFilter.startDate && $scope.QuotationReportFilter.endDate){
                if (($scope.QuotationReportFilter.startDate - $scope.QuotationReportFilter.endDate) > 0){
                    Settings.alertPopup("WARNING", "Invalid Date Range set.");
                    return;
                }

            }
            console.log("Reports between "+$scope.QuotationReportFilter.startDate+ " and "+$scope.QuotationReportFilter.endDate)
            $http.get("/dash/reports/quotation/"+$scope.DateTimeFormat($scope.QuotationReportFilter.startDate, 'start')+"/"+$scope.DateTimeFormat($scope.QuotationReportFilter.endDate, 'end'))
                .success(function(response){
                    console.log("GetAll Quotations Summary reports-->");
                    //console.log(response);

                    response.sort(function(a, b) {
                        return new Date(a.date[0]) < new Date(b.date[0]) ? 1 : -1;
                    });


                    $scope.quotationreport = response;
                    var orderreport = $scope.orderreport;

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
        };


        $scope.showImage = function(order, type){
            if(type == 'payment'){
                $scope.showPaymentImage = [];

            if(typeof order.cloudinaryURL[0] == "object"){
                for(var i=0; i<order.cloudinaryURL.length; i++){
                    for(var j=0; j<order.cloudinaryURL[i].length; j++) {
                        var arrImg = order.cloudinaryURL[i];
                        $scope.showPaymentImage.push(arrImg[j].image);
                    }
                }
            }else{
                $scope.showPaymentImage.push(order.cloudinaryURL[0]);
            }


            }
            if(type == 'expense'){
                $scope.showExpenseImage = order.cloudinaryURL;
            }
        }

        $scope.getAllSubCategories = function(param,type){
            $http.post("/dash/items/filter/"+type, {viewBy : 0})
                .success(function(subCategory){

                    $scope.itemSubCategories = subCategory;

                    $scope.itemSubCategories.map(function (item) {

                        if($scope.itemSelectAll.category){
                            item.selected_subCategory = true;

                        }else{
                            item.itemSubCategories = true
                            $scope.itemSubCategories = [];
                        }
                        return item;
                    })
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


        $scope.getAllSubSubCategories = function(param,type){
            $http.post("/dash/items/filter/"+type, {viewBy : 0})
                .success(function(subSubCategory){
                    $scope.itemSubSubCategories = subSubCategory;

                    if($scope.itemSubSubCategories.length ==1){
                        if($scope.itemSubSubCategories[0]._id == null){
                            $scope.itemSubSubCategories = [];
                        }
                    }
                    $scope.itemSubSubCategories.map(function (item) {

                        if($scope.itemSelectAll.category && $scope.itemSelectAll.subCategory){
                            item.selected_subSubCategory = true;

                        }else{
                            item.itemSubSubCategories = true
                            $scope.itemSubSubCategories = [];
                        }
                        return item;
                    })
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

        $scope.getAllStoreAreas = function(param,type){
            $http.post("/dash/stores/filter/"+type, {viewBy : 0})
                .success(function(area){
                    // console.log("Get all Areas......")
                    $scope.dealer_area = area;

                    // console.log(area)

                    $scope.dealer_area.map(function (dealer) {

                        if($scope.dealerSelectAll.city){
                            dealer.selected_area = true;

                        }else{
                            dealer.dealer_area = true
                            $scope.dealer_area= [];
                        }
                        return dealer;
                    })

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

        $http.get("/dash/stores/region")
            .success(function(region){
                if(region.length){
                    $scope.dealerRegions = region ;
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

        $scope.getAllCategories('category');
        $scope.getAllStoreAreas(true,'area');

        $scope.noAttendanceRes = [];
        $scope.noAttendance = function () {
            console.log("No attendance------>")
            var attr = '', attSearchObj1 = {};
            attr = new Date();


            attSearchObj1.viewLength = 0;
            attSearchObj1.viewBy = initialViewBy;
            attSearchObj1.sDate = $scope.DateTimeFormat(attr, 'start');
            attSearchObj1.eDate = $scope.DateTimeFormat(attr, 'end');
            attSearchObj1.searchFor = '';

            $http.post("/dash/reports/noattendance", attSearchObj1)
                .success(function (response) {
                    // console.log("GetAll Attendance reports-->");
                    // console.log(response)
                    $scope.noAttendanceRes = response;

                    // response.sort(function(a, b) {
                    //     return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
                    // });


                    /*$scope.attendancereport = response;
                     allAttendance = response;

                     if($scope.AttendanceReportSearch.filter)
                     $scope.showAttendanceFilter = true;*/
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


        $scope.clearFilterButton = function (search,tab) {
            if (search === '') {
                switch (tab) {
                    //order
                    case 1:
                        $scope.changeReportView(20,'','');
                        break;
                    case 3:
                        $scope.riderActivityReportSearch.filter = '';
                        $scope.changeReportView(23,'','');
                        break;

                }
            }
        }

        $scope.goToReport = (report) => {
            switch (report.reportTab) {
                case 1 : {
                    $location.path('/reports/top/sold');
                    break;
                }
                case 2 : {
                    $location.path('/reports/top/customers');
                    break;
                }
                case 3 : {
                    $location.path('/reports/top/users');
                    break;
                }
                // case 3 : {
                //     $location.path('/reports/top/sold')
                //     break;
                // }
                case 4 : {
                    $location.path('/reports/overall/summary');
                    break;
                }
                case 5 : {
                    $location.path('/reports/overall/payments');
                    break;
                }
                case 6 : {
                    $location.path('/reports/overall/checkins');
                    break;
                }
                case 7: {
                    $location.path('/reports/overall/expenses');
                    break;
                }
                case 8: {
                    $location.path('/reports/overall/meetings');
                    break;
                }
                case 9: {
                    $location.path('/reports/overall/billed');
                    break;
                }
                case 11: {
                    $location.path('/reports/overall/attendance');
                    break;
                }
                case 13: {
                    $location.path('/reports/overall/emplyoee');
                    break;
                }
                case 14: {
                    $location.path('/reports/overall/report');
                    break;
                }
                case 19: {
                    $location.path('/reports/overall/distribution');
                    break;
                }
                case 20: {
                    $location.path('/reports/rider/reconciliation');
                    break;
                }
                case 21: {
                    $location.path('/reports/overall/checkins/distance/calculation');
                    break;
                }
                default : {
                    $scope.changeReportView(report.reportTab, report.tabName);
                }
            }
        }

        $scope.changeReportView = function(id, name,newViewBy,reportName){
            console.log("Report Tab ---> ", id);
            $scope.newViewBy1.view = newViewBy;
            $scope.newViewBy = parseInt(newViewBy);
            if($scope.tab != 8) $scope.tab = 8;
            $scope.reportTabName = name || "Home";
            $scope.reportTabId = id;
            $scope.showReports = true;

            if(id == 0){
                $scope.newViewBy1.view = 10;
                $scope.showReports = false;
                $scope.reportTabName = "Home";
            }

            //Top sold...

            if(id == 1){

                $scope.reportTabName = "Top Sold";

                if($scope.itemReportFilter.startDate && $scope.itemReportFilter.endDate){
                    if (($scope.itemReportFilter.startDate - $scope.itemReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.itemReportFilter.startDate = new Date();
                        $scope.itemReportFilter.startDate.setDate($scope.itemReportFilter.startDate.getDate() - 7);
                        $scope.itemReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.itemReportFilter.endDate = new Date();
                        $scope.itemReportFilter.endDate.setHours(23, 59, 59, 59);

                    }

                }

                soldSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    soldSearchObj.viewBy = $scope.newViewBy;
                }else{
                    soldSearchObj.viewBy = initialViewBy;
                }
                soldSearchObj.sDate = $scope.DateTimeFormat($scope.itemReportFilter.startDate, 'start');
                soldSearchObj.eDate = $scope.DateTimeFormat($scope.itemReportFilter.endDate, 'end');
                soldSearchObj.searchFor = $scope.itemReportSearch.filter;
                soldSearchObj.searchBy = soldSearchBy;
                soldSearchObj.branch = '';
                soldSearchObj.region = '';
                soldSearchObj.area = '';
                soldSearchObj.Manufacturer = '';
                if($scope.itemReportFilter.branch)
                    soldSearchObj.branch = $scope.itemReportFilter.branch;
                if($scope.itemReportFilter.region)
                    soldSearchObj.region = $scope.itemReportFilter.region ;
                if($scope.itemReportFilter.area)
                    soldSearchObj.area = $scope.itemReportFilter.area ;
                if($scope.itemReportFilter.Manufacturer)
                    soldSearchObj.Manufacturer = $scope.itemReportFilter.Manufacturer ;

                if($scope.itemReportFilter.warehouse){
                    soldSearchObj.warehouse = $scope.itemReportFilter.warehouse;
                }else{
                    soldSearchObj.warehouse = '';
                }


                $scope.itemreport = [];
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/items",soldSearchObj)
                    .success(function(response){
                        var tempArray = [];
                        $http.get("/dash/items")
                            .success(function (response) {
                                for(var i = 0 ;i < response.length;i++){
                                    var temp = response[i].itemCode +'';
                                    tempArray[temp] = response[i].Manufacturer ;

                                }
                                sold();
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

                        function sold(){
                            for (var i = 0;i < response.length;i++){
                                response[i].isCollapsed = false ;
                                response[i].Manufacturer = tempArray[response[i]._id] ;
                                var data = response[i].orderDetail ;
                                var seen = {};
                                data = data.filter(function(entry) {
                                    var previous;

                                    // Have we seen this label before?
                                    if (seen.hasOwnProperty(entry.seller)) {
                                        // Yes, grab it and add this data to it
                                        previous = seen[entry.seller];
                                        previous.quantity.push(parseInt(entry.quantity));
                                        previous.stockist.push({'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity)});

                                        // Don't keep this entry, we've merged it into the previous one
                                        return false;
                                    }

                                    // entry.data probably isn't an array; make it one for consistency
                                    if (!Array.isArray(entry.quantity)) {
                                        entry.quantity = [parseInt(entry.quantity)];
                                    }
                                    entry.stockist = [{'stockistName':entry.stockistname,'stockist':parseInt(entry.stockist),'count':parseInt(entry.quantity[0])}];


                                    // Remember that we've seen it
                                    seen[entry.seller] = entry;

                                    // Keep this one, we'll merge any others that match into it
                                    return true;
                                });
                                response[i].orderDetail = data ;
                                for (var j=0; j < response[i].orderDetail.length ; j++){
                                    var a = response[i].orderDetail[j].quantity;
                                    response[i].orderDetail[j].quantity = a.reduce(function(a, b) { return a + b; }, 0);
                                    var stockist = response[i].orderDetail[j].stockist ;
                                    var temp = {};
                                    stockist = stockist.filter(function(entry) {
                                        var previous;

                                        // Have we seen this label before?
                                        if (temp.hasOwnProperty(entry.stockist)) {
                                            // Yes, grab it and add this data to it
                                            previous = temp[entry.stockist];
                                            previous.count.push(parseInt(entry.count));

                                            // Don't keep this entry, we've merged it into the previous one
                                            return false;
                                        }

                                        // entry.data probably isn't an array; make it one for consistency
                                        if (!Array.isArray(entry.count)) {
                                            entry.count = [parseInt(entry.count)];
                                        }

                                        // Remember that we've seen it
                                        temp[entry.stockist] = entry;

                                        // Keep this one, we'll merge any others that match into it
                                        return true;
                                    });
                                    response[i].orderDetail[j].stockist = stockist ;
                                    for(var k = 0 ; k < response[i].orderDetail[j].stockist.length; k++){
                                        var b = response[i].orderDetail[j].stockist[k].count;
                                        response[i].orderDetail[j].stockist[k].count = b.reduce(function(a, b) { return a + b; }, 0);


                                    }
                                }
                            }
                            $scope.itemreport = response;
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

                $http.post("/dash/reports/top/sold/count", soldSearchObj)
                    .success(function (response) {
                        $scope.reportsTransactionCount(response, 1);
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

            //Top customers...
            if(id == 2){

                $scope.reportTabName = "Top " + $scope.nav[2].tab;

                if($scope.dealerReportFilter.startDate && $scope.dealerReportFilter.endDate){
                    if (($scope.dealerReportFilter.startDate - $scope.dealerReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.dealerReportFilter.startDate = new Date();
                        $scope.dealerReportFilter.startDate.setDate($scope.dealerReportFilter.startDate.getDate() - 7);
                        $scope.dealerReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.dealerReportFilter.endDate = new Date();
                        $scope.dealerReportFilter.endDate.setHours(23, 59, 59, 59);

                    }
                }

                topCustomerSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    topCustomerSearchObj.viewBy = $scope.newViewBy;
                }else{
                    topCustomerSearchObj.viewBy = initialViewBy;
                }
                topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
                topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
                topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
                topCustomerSearchObj.searchBy = topDealerSearchBy;
                topCustomerSearchObj.seller = '';
                topCustomerSearchObj.branch = '';
                topCustomerSearchObj.region = '';
                topCustomerSearchObj.area = '';
                topCustomerSearchObj.warehouse = '';
                if($scope.dealerReportFilter.branch)
                    topCustomerSearchObj.branch = report.branch ;
                if($scope.dealerReportFilter.seller)
                    topCustomerSearchObj.seller = $scope.dealerReportFilter.seller ;
                if($scope.dealerReportFilter.region)
                    topCustomerSearchObj.region = $scope.dealerReportFilter.region ;
                if($scope.dealerReportFilter.area)
                    topCustomerSearchObj.area = $scope.dealerReportFilter.area ;
                if($scope.dealerReportFilter.warehouse)
                    topCustomerSearchObj.warehouse = $scope.dealerReportFilter.warehouse ;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/dealers", topCustomerSearchObj)
                    .success(function(response){

                        response.sort(function(a, b) {
                            return a.orderTotal < b.orderTotal ? 1 : -1;
                        });

                        $scope.dealerreport = response;

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

                $http.post("/dash/reports/top/customer/count", topCustomerSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 2);
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

            //top user
            if(id == 3){

                $scope.reportTabName = "Top" + ' ' + $scope.nav[4].tab;
                $scope.sellerreport = [];

                if($scope.sellerReportFilter.startDate && $scope.sellerReportFilter.endDate){
                    if (($scope.sellerReportFilter.startDate - $scope.sellerReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.sellerReportFilter.startDate = new Date();
                        $scope.sellerReportFilter.startDate.setDate($scope.sellerReportFilter.startDate.getDate() - 7);
                        $scope.sellerReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.sellerReportFilter.endDate = new Date();
                        $scope.sellerReportFilter.endDate.setHours(23, 59, 59, 59);
                    }
                }

                topUserSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    topUserSearchObj.viewBy = $scope.newViewBy;
                }else{
                    topUserSearchObj.viewBy = initialViewBy;
                }
                topUserSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                topUserSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                topUserSearchObj.searchFor = $scope.sellerReportSearch.filter;
                topUserSearchObj.searchBy = topSellerSearchBy;
                topUserSearchObj.branch = '';
                $scope.sellerreport = [];

                if($scope.sellerReportFilter.branch)
                    topUserSearchObj.branch = $scope.sellerReportFilter.branch ;

                $scope.viewLength = 0;
                if(!newViewBy) {
                    $scope.newViewBy = parseInt(localViewBy);
                }


                if($scope.applicationType == "StoreJini"){
                    $http.post("/dash/reports/storeJini/sellers", topUserSearchObj)
                        .success(function(response){
                            $scope.sellerreport = response;
                            $scope.reportsTransactionCount($scope.sellerreport.length, 3);
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


                if($scope.applicationType != 'StoreJini'){

                    $http.post("/dash/reports/sellers", topUserSearchObj)
                        .success(function(response){
                            for(var i=0; i<response.length; i++){
                                $scope.sellerreport.push(response[i]);
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

                    $http.post("/dash/reports/top/user/count", topUserSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 3);
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
            }


            //.... Summary Report....
            if(id == 4){

                $scope.reportTabName = "Summary";

                if($scope.orderReportFilter.startDate && $scope.orderReportFilter.endDate){
                    if (($scope.orderReportFilter.startDate - $scope.orderReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Invalid Date Range set.");

                        $scope.orderReportFilter.startDate = new Date();
                        $scope.orderReportFilter.startDate.setDate($scope.orderReportFilter.startDate.getDate() - 7);
                        $scope.orderReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.orderReportFilter.endDate = new Date();
                        $scope.orderReportFilter.endDate.setHours(23, 59, 59, 59);

                        return;
                    }

                }

                summarySearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    summarySearchObj.viewBy = $scope.newViewBy;
                }else{
                    summarySearchObj.viewBy = initialViewBy;
                }
                summarySearchObj.sDate = $scope.DateTimeFormat($scope.orderReportFilter.startDate, 'start');
                summarySearchObj.eDate = $scope.DateTimeFormat($scope.orderReportFilter.endDate, 'end');
                summarySearchObj.branch = '';
                if($scope.orderReportFilter.branchCode)
                    summarySearchObj.branch = $scope.orderReportFilter.branchCode ;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = localViewBy;
                }

                summarySearchObj.warehouse = '';
                if($scope.orderReportFilter.warehouse)
                    summarySearchObj.warehouse = $scope.orderReportFilter.warehouse ;

                summarySearchObj.status = '';
                if($scope.orderReportFilter.status)
                    summarySearchObj.status = $scope.orderReportFilter.status ;

                $http.post("/dash/reports/ordersreport",summarySearchObj)
                    .success(function(response){
                        console.log("GetAll Order Summary reports-->");
                        //console.log(response);

                        response.sort(function(a, b) {
                            return new Date(a.date[0]) < new Date(b.date[0]) ? 1 : -1;
                        });


                        $scope.orderreport = response;
                        $scope.totalItems3 = response.length;
                        var orderreport = $scope.orderreport;



                        $scope.viewby3 = 10;
                        $scope.totalItems3 = $scope.orderreport.length;
                        $scope.currentPage3 = 1;
                        $scope.itemsPerPage3 = $scope.viewby3;
                        $scope.maxSize3 = 5;
                        $scope.case8dLength = $scope.orderreport.length;

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

                $http.post("/dash/reports/summary/count", summarySearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 4);
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

            //... Payments Reports.....
            if(id == 5){

                $scope.reportTabName = "Payments";

                if($scope.paymentsreport.startDate && $scope.paymentsreport.endDate) {
                    if (($scope.paymentsreport.startDate - $scope.paymentsreport.endDate) > 0) {
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.paymentsreport.startDate = new Date();
                        $scope.paymentsreport.startDate.setDate($scope.paymentsreport.startDate.getDate() - 7);
                        $scope.paymentsreport.startDate.setHours(0, 0, 0, 0);
                        $scope.paymentsreport.endDate = new Date();
                        $scope.paymentsreport.endDate.setHours(23, 59, 59, 59);
                    }
                }



                paymentSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    paymentSearchObj.viewBy = $scope.newViewBy;
                }else{
                    paymentSearchObj.viewBy = initialViewBy;
                }
                paymentSearchObj.sDate = $scope.DateTimeFormat($scope.paymentsreport.startDate, 'start');
                paymentSearchObj.eDate = $scope.DateTimeFormat($scope.paymentsreport.endDate, 'end');
                paymentSearchObj.searchFor = $scope.paymentReportSearch.filter;
                paymentSearchObj.searchBy = paymentSearchBy;
                paymentSearchObj.filter = $scope.modeOfPayment;
                paymentSearchObj.branch = '';
                if($scope.paymentsreport.branchCode)
                    paymentSearchObj.branch = $scope.paymentsreport.branchCode ;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                if($scope.applicationType != 'StoreJini'){
                    $http.post("/dash/reports/cashitems",paymentSearchObj)
                        .success(function(response){
                            console.log("GetAll Cash reports-->");

                            // var tempPaymentMode = [];

                            $scope.cashreport = response;
                            console.log("order payment",  $scope.cashreport);
                            // if($scope.applicationType != 'StoreJini'){
                            //     for(var i=0; i < $scope.cashreport.length;i++){
                            //         tempPaymentMode.push({'mode' : $scope.cashreport[i].medicine[0] , 'status' : true })
                            //     }
                            //
                            //     $scope.paymentMode = tempPaymentMode.unique('mode');
                            // }


                        });

                }
                if($scope.applicationType == 'StoreJini' ){
                    $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                        .success(function(response){
                            console.log("GetAll Cash reports for Storejini-->");
                            $scope.cashreport = response;

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
                $http.post("/dash/reports/payment/count", paymentSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 5);
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

            // .... Additional things to be done for checkin report...
            if(id == 6){
                $scope.reportTabName = "Check Ins";

                if($scope.cinreport.startDate && $scope.cinreport.endDate){
                    if (($scope.cinreport.startDate - $scope.cinreport.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.cinreport.startDate = new Date();
                        $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
                        $scope.cinreport.startDate.setHours(0, 0, 0, 0);
                        $scope.cinreport.endDate = new Date();
                        $scope.cinreport.endDate.setHours(23, 59, 59, 59);

                    }
                }
                checkinSearchObj.seller = ''
                if($scope.cinreport.seller)
                    checkinSearchObj.seller = $scope.cinreport.seller ;



                checkinSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    checkinSearchObj.viewBy = $scope.newViewBy;
                }else{
                    checkinSearchObj.viewBy = initialViewBy;
                }
                checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                checkinSearchObj.searchBy = checkinDealerSearchBy;

                $scope.checkInreport = [];
                $scope.viewLength = 0;

                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }
                checkinSearchObj.customerType = '';
                if($scope.cinreport.customerType){
                    checkinSearchObj.customerType = $scope.cinreport.customerType;
                }



                $http.post("/dash/reports/checkins",checkinSearchObj)
                    .success(function(response){

                        //console.log(response) 
                        response.sort(function(a, b) {
                            return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
                        });

                        $scope.checkInreport = response;

                        for(var i=0; i< $scope.checkInreport.length; i++){
                            if($scope.checkInreport[i].storeLat[0] && $scope.checkInreport[i].storeLong[0]){
                                $scope.checkInreport[i].customerLocation = true;
                                var slatlng = new google.maps.LatLng($scope.checkInreport[i].storeLat[0], $scope.checkInreport[i].storeLong[0]);
                                var startLatLong;
                                var endLatLong;
                                //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                if($scope.checkInreport[i].latitude[0] && $scope.checkInreport[i].longitude[0]
                                    && $scope.checkInreport[i].latitude[0] != 1 && $scope.checkInreport[i].longitude[0] != 1
                                    && $scope.checkInreport[i].latitude[0] != 2 && $scope.checkInreport[i].longitude[0] != 2
                                    && $scope.checkInreport[i].latitude[0] != 3 && $scope.checkInreport[i].longitude[0] != 3
                                    && $scope.checkInreport[i].latitude[0] != 4 && $scope.checkInreport[i].longitude[0] != 4){
                                    startLatLong = new google.maps.LatLng($scope.checkInreport[i].latitude[0], $scope.checkInreport[i].longitude[0]);
                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                    $scope.checkInreport[i].sVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                    $scope.checkInreport[i].startVisitLocation = true;
                                }
                                else{
                                    $scope.checkInreport[i].startVisitLocation = false;
                                    $scope.checkInreport[i].sVisitDist =
                                        ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                            ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                }

                                if($scope.checkInreport[i].exitLat[0] && $scope.checkInreport[i].exitLong[0]
                                    && $scope.checkInreport[i].exitLat[0] != 1 && $scope.checkInreport[i].exitLong != 1
                                    && $scope.checkInreport[i].exitLat[0] != 2 && $scope.checkInreport[i].exitLong != 2
                                    && $scope.checkInreport[i].exitLat[0] != 3 && $scope.checkInreport[i].exitLong != 3
                                    && $scope.checkInreport[i].exitLat[0] != 4 && $scope.checkInreport[i].exitLong != 4){

                                    endLatLong = new google.maps.LatLng($scope.checkInreport[i].exitLat[0], $scope.checkInreport[i].exitLong[0]);
                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                    $scope.checkInreport[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                    $scope.checkInreport[i].endVisitLocation = true;
                                }
                                else{
                                    $scope.checkInreport[i].eVisitDist =
                                        ($scope.checkInreport[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                            ($scope.checkInreport[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                                (($scope.checkInreport[i].exitLong[0] == 3 || $scope.checkInreport[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                    $scope.checkInreport[i].endVisitLocation = false;
                                }
                            }
                            else{
                                $scope.checkInreport[i].customerLocation = false;

                                if($scope.checkInreport[i].latitude[0] == 1 ||
                                    $scope.checkInreport[i].latitude[0] == 2 ||
                                    $scope.checkInreport[i].latitude[0] == 3 ||
                                    $scope.checkInreport[i].latitude[0] == 4){
                                    $scope.checkInreport[i].startVisitLocation = false;
                                    $scope.checkInreport[i].sVisitDist =
                                        ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                            ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                }
                                else{
                                    $scope.checkInreport[i].startVisitLocation = true;
                                }
                                if($scope.checkInreport[i].exitLat[0] == 1 ||
                                    $scope.checkInreport[i].exitLat[0] == 2 ||
                                    $scope.checkInreport[i].exitLat[0] == 3 ||
                                    $scope.checkInreport[i].exitLat[0] == 4){
                                    $scope.checkInreport[i].endVisitLocation = false;
                                    $scope.checkInreport[i].eVisitDist = ($scope.checkInreport[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                        ($scope.checkInreport[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                            (($scope.checkInreport[i].exitLat[0] == 3 || $scope.checkInreport[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                                }
                                else{

                                    if($scope.checkInreport[i].exitLat[0])
                                        $scope.checkInreport[i].endVisitLocation = true;
                                    else{ // Check if null?? if yes, it means that the user has not ended visit
                                        $scope.checkInreport[i].endVisitLocation = false;
                                        $scope.checkInreport[i].eVisitDist = 'Not Ended';
                                    }

                                }

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


                $http.post("/dash/reports/checkin/count", checkinSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 6);
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


            if(id == 7){

                $scope.reportTabName = "Expense";

                if($scope.expreport.startDate && $scope.expreport.endDate){
                    if (($scope.expreport.startDate - $scope.expreport.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.expreport.startDate = new Date();
                        $scope.expreport.startDate.setDate($scope.expreport.startDate.getDate() - 7);
                        $scope.expreport.startDate.setHours(0, 0, 0, 0);
                        $scope.expreport.endDate = new Date();
                        $scope.expreport.endDate.setHours(23, 59, 59, 59);

                    }
                }

                expenseSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    expenseSearchObj.viewBy = $scope.newViewBy;
                }else{
                    expenseSearchObj.viewBy = initialViewBy;
                }
                expenseSearchObj.sDate = $scope.DateTimeFormat($scope.expreport.startDate, 'start');
                expenseSearchObj.eDate = $scope.DateTimeFormat($scope.expreport.endDate, 'end');
                expenseSearchObj.searchFor = $scope.expenseReportSearch.filter;
                expenseSearchObj.searchBy = expenseSearchBy;
                expenseSearchObj.filter = $scope.expenseFilterStatus;
                if(expenseSearchObj.eDate){
                    expenseSearchObj.eDate = new Date(expenseSearchObj.eDate);
                }
                if(expenseSearchObj.sDate){
                    expenseSearchObj.sDate = new Date(expenseSearchObj.sDate);
                }

                expenseSearchObj.branch = '';
                expenseSearchObj.expenseType = '';
                if($scope.expreport.branchCode)
                    expenseSearchObj.branch = $scope.expreport.branchCode ;

                if($scope.expreport.category)
                    expenseSearchObj.expenseType = $scope.expreport.category ;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/expense",expenseSearchObj)
                    .success(function(response){

                        var expenses = [];

                        for(var i=0;i< response.length; i++){
                            if(response[i].type == 'expense')
                                expenses.push(response[i])

                        }
                        $scope.expensereport = expenses;

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

                $http.post("/dash/reports/expense/count", expenseSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 7);
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


            if(id == 8){

                $scope.reportTabName = $scope.nav[18].tab;

                if($scope.mtgreport.startDate && $scope.mtgreport.endDate){
                    if (($scope.mtgreport.startDate - $scope.mtgreport.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.mtgreport.startDate = new Date();
                        $scope.mtgreport.startDate.setDate($scope.mtgreport.startDate.getDate() - 30);
                        $scope.mtgreport.startDate.setHours(0, 0, 0, 0);
                        $scope.mtgreport.endDate = new Date();
                        $scope.mtgreport.endDate.setHours(23, 59, 59, 59);

                    }
                }

                meetingSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    meetingSearchObj.viewBy = $scope.newViewBy;
                }else{
                    meetingSearchObj.viewBy = initialViewBy;
                }
                meetingSearchObj.sDate = $scope.DateTimeFormat($scope.mtgreport.startDate, 'start');
                meetingSearchObj.eDate = $scope.DateTimeFormat($scope.mtgreport.endDate, 'end');
                meetingSearchObj.searchFor = $scope.meetingsReportSearch.filter;
                meetingSearchObj.searchBy = topDealerSearchBy;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }


                $http.post("/dash/reports/meeting", meetingSearchObj)
                    .success(function(response){
                        response.sort(function(a, b) {
                            return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
                        });

                        $scope.meetingreport = response;

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

                $http.post("/dash/reports/meeting/count", meetingSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 8);
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


            if(id == 9){

                $scope.reportTabName = "Items Not Billed";

                $scope.skuReportFilter.dealer = {};
                $scope.skuReportFilter.dealer.Dealercode = '0';


                if(!$scope.skuReportFilter.category) {
                    $scope.skuReportFilter.category = {};
                    $scope.skuReportFilter.category.Manufacturer = '0';
                }

                if($scope.skuReportFilter.startDate && $scope.skuReportFilter.endDate){
                    if (($scope.skuReportFilter.startDate - $scope.skuReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Invalid Date Range set.");

                        $scope.skuReportFilter.startDate = new Date();
                        $scope.skuReportFilter.startDate.setDate($scope.skuReportFilter.startDate.getDate() - 7);
                        $scope.skuReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.skuReportFilter.endDate = new Date();
                        $scope.skuReportFilter.endDate.setHours(23, 59, 59, 59);
                    }
                }


                skuSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    skuSearchObj.viewBy = $scope.newViewBy;
                }else{
                    skuSearchObj.viewBy = initialViewBy;
                }
                skuSearchObj.sDate = $scope.DateTimeFormat($scope.skuReportFilter.startDate, 'start');
                skuSearchObj.eDate = $scope.DateTimeFormat($scope.skuReportFilter.endDate, 'end');
                skuSearchObj.category = $scope.skuReportFilter.category._id;
                skuSearchObj.dealercode = $scope.skuReportFilter.dealer.Dealercode;
                skuSearchObj.searchFor = $scope.skuReportFilter.filter;
                skuSearchObj.searchBy = itemSearchBy;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }




                $http.post("/dash/reports/sku", skuSearchObj)
                    .success(function(response){
                        console.log("Get SKUs report from and to date -->");

                        $scope.skureport = response;
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


                $http.post("/dash/reports/sku/count", skuSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 9);
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


            if(id == 11){

                $scope.atdreports.startDate = new Date();
                $scope.atdreports.startDate.setDate($scope.atdreports.startDate.getDate() - 3);
                $scope.atdreports.startDate.setHours(0, 0, 0, 0);
                $scope.atdreports.endDate = new Date();
                $scope.atdreports.endDate.setHours(23, 59, 59, 999);

                $scope.atdChartReport.startDate = new Date();
                $scope.atdChartReport.startDate.setDate($scope.atdChartReport.startDate.getDate() - 3);
                $scope.atdChartReport.startDate.setHours(0, 0, 0, 0);
                $scope.atdChartReport.endDate = new Date();
                $scope.atdChartReport.endDate.setHours(23, 59, 59, 999);

                $scope.attendancereport = [];
                $scope.attendanceChartReport = [];
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy = initialViewBy;
                attSearchObj.sDate = $scope.DateTimeFormat($scope.atdreports.startDate, 'start');
                attSearchObj.eDate = $scope.DateTimeFormat($scope.atdreports.endDate, 'end');
                attSearchObj.searchFor = '';

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/attendance", attSearchObj)
                    .success(function (res) {
                        allAttendanceRecords = res;
                        $scope.attendancereport = res;
                        for (i = 0; i < res.length; i++) {
                            if (res[i].date_added[0]) {
                                var d = new Date(res[i].date_added[0]);
                                var date = {};
                                date.date = d.getDate();
                                date.month = d.getMonth();

                                if ((d.getDate() == master_date_added.date) && (d.getMonth() == master_date_added.month) && (d.getFullYear() == master_date_added.year)) {
                                    $scope.attendanceChartReport.push(res[i]);
                                }
                            }
                        }

                        getMaster_Date_added(new Date());
                        $scope.drawAtdChart();
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

                $http.post("/dash/reports/attendance/count", attSearchObj)
                    .success(function (res) {
                        $scope.transactionCount(res, 3);
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
                $scope.noAttendance();
            }



            if(id == 13){

                $scope.reportTabName = "Employee Time";

                if($scope.cinemployeereport.startDate && $scope.cinemployeereport.endDate){
                    if (($scope.cinemployeereport.startDate - $scope.cinemployeereport.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.cinemployeereport.startDate = new Date();
                        $scope.cinemployeereport.startDate.setDate($scope.cinemployeereport.startDate.getDate() - 7);
                        $scope.cinemployeereport.startDate.setHours(0, 0, 0, 0);
                        $scope.cinemployeereport.endDate = new Date();
                        $scope.cinemployeereport.endDate.setHours(23, 59, 59, 59);
                    }
                }


                employeeSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    employeeSearchObj.viewBy = $scope.newViewBy;
                }else{
                    employeeSearchObj.viewBy = initialViewBy;
                }
                employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
                employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
                employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                employeeSearchObj.searchBy = employeeSearchBy;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }



                $http.post("/dash/reports/employee",employeeSearchObj)
                    .success(function(response) {

                        console.log("Employee reports--------->>>")
                        $scope.checkInEmployeeTime = response;
                        $scope.employeeItems = response;
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


                $http.post("/dash/reports/employee/count", employeeSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 13);
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


            //over all reports
            if(id == 14){

                jQuery.noConflict();
                $('.refresh').css("display", "inline");

                $scope.reportTabName = "OverAllReports";

                if($scope.overallReportFilter.startDate && $scope.overallReportFilter.endDate){
                    if (($scope.overallReportFilter.startDate - $scope.overallReportFilter.endDate) > 0){
                        bootbox.alert({
                            title : 'WARNING',
                            message : 'Start date cannot be greater than End date.',
                            className : 'text-center'
                        })

                        $scope.overallReportFilter.startDate = new Date();
                        $scope.overallReportFilter.startDate.setDate($scope.overallReportFilter.startDate.getDate() - 7);
                        $scope.overallReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.overallReportFilter.endDate = new Date();
                        $scope.overallReportFilter.endDate.setHours(23, 59, 59, 59);
                    }

                }
                console.log("=======")

                if($scope.overallReportFilter.seller){
                    overallSearchObj.seller = $scope.overallReportFilter.seller;
                }else{
                    overallSearchObj.seller = '';
                }
                if($scope.overallReportFilter.stockist){
                    overallSearchObj.stockist = $scope.overallReportFilter.stockist;
                }else{
                    overallSearchObj.stockist = '';
                }


                overallSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    overallSearchObj.viewBy = $scope.newViewBy;
                }else{
                    overallSearchObj.viewBy = initialViewBy;
                }
                overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
                overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
                overallSearchObj.dateWise = $scope.dateWise;
                overallSearchObj.searchFor = $scope.overallReportFilter.filter;
                overallSearchObj.searchBy = reportSearchBy;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }


                $http.post("/dash/reports/overallreports", overallSearchObj)
                    .success(function(res){
                        $scope.overallreports = res;
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

                $http.post("/dash/reports/overallreport/count", overallSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 14);
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

                setTimeout(function(){
                    $('.refresh').css("display", "none");
                }, 5000);
            }

            if(id == 15){

                $scope.reportTabName = "Top Enquired";

                if($scope.enquiryReportFilter.startDate && $scope.enquiryReportFilter.endDate){
                    if (($scope.enquiryReportFilter.startDate - $scope.enquiryReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.enquiryReportFilter.startDate = new Date();
                        $scope.enquiryReportFilter.startDate.setDate($scope.enquiryReportFilter.startDate.getDate() - 7);
                        $scope.enquiryReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.enquiryReportFilter.endDate = new Date();
                        $scope.enquiryReportFilter.endDate.setHours(23, 59, 59, 59);
                    }
                }

                topEnquirySearchObj.viewLength = 0;
                topEnquirySearchObj.viewBy = initialViewBy;
                topEnquirySearchObj.sDate = $scope.DateTimeFormat($scope.enquiryReportFilter.startDate, 'start');
                topEnquirySearchObj.eDate = $scope.DateTimeFormat($scope.enquiryReportFilter.endDate, 'end');
                topEnquirySearchObj.searchFor = $scope.enquiryReportFilter.filter;
                topEnquirySearchObj.branch = '';
                if(report.branch)
                    topEnquirySearchObj.branch = report.branch ;

                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/storeJini/top/enquiry", topEnquirySearchObj)
                    .success(function(response){

                        $scope.enquiryreport = response;
                        $scope.reportsTransactionCount(response.length,15 );

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

            if(id == 16){
                // console.log($scope.targetAchievementReportFilter.endDate)
                // console.log($scope.targetAchievementReportFilter.startDate)
                if($scope.targetAchievementReportFilter.endDate)
                    $scope.targetAchievementReportFilter.endDate = new Date($scope.targetAchievementReportFilter.endDate.getFullYear() ,$scope.targetAchievementReportFilter.endDate.getMonth()+1,0);

                $scope.reportTabName = "Target v/s Achievement";

                if($scope.targetAchievementReportFilter.startDate && $scope.targetAchievementReportFilter.endDate){
                    if (($scope.targetAchievementReportFilter.startDate - $scope.targetAchievementReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.targetAchievementReportFilter.startDate = new Date();
                        $scope.targetAchievementReportFilter.startDate = new Date($scope.targetAchievementReportFilter.startDate.getFullYear() ,$scope.targetAchievementReportFilter.startDate.getMonth(),1);
                        $scope.targetAchievementReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.targetAchievementReportFilter.endDate = new Date($scope.targetAchievementReportFilter.startDate.getFullYear() ,$scope.targetAchievementReportFilter.startDate.getMonth()+1,0);
                        $scope.targetAchievementReportFilter.endDate.setHours(23, 59, 59, 59);

                    }

                }

                targetAchievementSearchObj.viewLength = 0;
                targetAchievementSearchObj.viewBy = initialViewBy;
                if($scope.targetAchievementReportFilter.startDate && $scope.targetAchievementReportFilter.endDate){
                    targetAchievementSearchObj.sDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.startDate, 'start');
                    targetAchievementSearchObj.eDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.endDate, 'end');
                }
                else if(!$scope.targetAchievementReportFilter.startDate && $scope.targetAchievementReportFilter.endDate){
                    targetAchievementSearchObj.sDate = $scope.DateTimeFormat('Thu Jan 01 1970  00:00:00', 'start');
                    targetAchievementSearchObj.eDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.endDate, 'end');
                }
                else if($scope.targetAchievementReportFilter.startDate && !$scope.targetAchievementReportFilter.endDate){
                    targetAchievementSearchObj.sDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.startDate, 'start');
                    var temp = new Date();
                    $scope.targetAchievementReportFilter.endDate = new Date(temp.getFullYear() ,temp.getMonth()+1,0);
                    $scope.targetAchievementReportFilter.endDate.setHours(23, 59, 59, 59);
                    targetAchievementSearchObj.eDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.endDate, 'end');
                }
                else if(!$scope.targetAchievementReportFilter.startDate && !$scope.targetAchievementReportFilter.endDate){
                    targetAchievementSearchObj.sDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.startDate, 'start');
                    targetAchievementSearchObj.eDate = $scope.DateTimeFormat($scope.targetAchievementReportFilter.endDate, 'end');
                }

                if($scope.targetAchievementReportFilter.startDate){
                    targetAchievementSearchObj.sMonth = $scope.targetAchievementReportFilter.startDate.getMonth();
                    targetAchievementSearchObj.sYear = $scope.targetAchievementReportFilter.startDate.getFullYear();
                }
                else{
                    targetAchievementSearchObj.sMonth = '';
                    targetAchievementSearchObj.sYear = '';

                }
                if($scope.targetAchievementReportFilter.endDate){
                    targetAchievementSearchObj.eMonth = $scope.targetAchievementReportFilter.endDate.getMonth();
                    targetAchievementSearchObj.eYear = $scope.targetAchievementReportFilter.endDate.getFullYear();
                }
                else{
                    targetAchievementSearchObj.eMonth = '';
                    targetAchievementSearchObj.eYear = '';
                }

                targetAchievementSearchObj.searchFor = $scope.targetAchievementReportFilter.filter;
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/storeJini/target/achievement", targetAchievementSearchObj)
                    .success(function(response){
                        // console.log(response)
                        $scope.targetAchievementreport = response;
                        $scope.reportsTransactionCount(response.length,16 );

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

            //sales and distribution

            if(id == 19){

                $scope.reportTabName = "Sales And Distribution";

                if($scope.salesReportFilter.startDate && $scope.salesReportFilter.endDate){
                    if (($scope.salesReportFilter.startDate - $scope.salesReportFilter.endDate) > 0){
                        bootbox.alert({
                            title : 'WARNING',
                            message : 'Start date cannot be greater than End date.',
                            className : 'text-center'
                        })

                        $scope.salesReportFilter.startDate = new Date();
                        $scope.salesReportFilter.startDate.setDate($scope.salesReportFilter.startDate.getDate() - 7);
                        $scope.salesReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.salesReportFilter.endDate = new Date();
                        $scope.salesReportFilter.endDate.setHours(23, 59, 59, 59);

                    }

                }

                salesSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    salesSearchObj.viewBy = $scope.newViewBy;
                }else{
                    salesSearchObj.viewBy = initialViewBy;
                }
                salesSearchObj.sDate = $scope.DateTimeFormat($scope.salesReportFilter.startDate, 'start');
                salesSearchObj.eDate = $scope.DateTimeFormat($scope.salesReportFilter.endDate, 'end');
                salesSearchObj.searchFor = $scope.salesReportSeach.filter;
                salesSearchObj.searchBy = salesSearchBy;
                salesSearchObj.class = '';
                salesSearchObj.paymentMode = '';
                salesSearchObj.seller = '';
                salesSearchObj.Manufacturer = '';
                if($scope.salesReportFilter.class)
                    salesSearchObj.class = $scope.salesReportFilter.class;
                if($scope.salesReportFilter.paymentMode)
                    salesSearchObj.paymentMode = $scope.salesReportFilter.paymentMode ;
                if($scope.salesReportFilter.seller)
                    salesSearchObj.seller = $scope.salesReportFilter.seller ;
                if($scope.salesReportFilter.Manufacturer)
                    salesSearchObj.Manufacturer = $scope.salesReportFilter.Manufacturer ;


                $scope.salesreport = [];
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/sales/orders",salesSearchObj)
                    .success(function(response){
                        $scope.salesreport = response;
                        console.log('itemreport',$scope.salesreport)
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

                $http.post("/dash/reports/sales/orders/count", salesSearchObj)
                    .success(function (response) {
                        console.log('count response',response)
                        $scope.reportsTransactionCount(response, 18);
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

            if(id == 20){

                $scope.reportTabName = "Rider Reconciliation";
                riderSearchObj = {};
                if($scope.ridersReportFilter.startDate && $scope.ridersReportFilter.endDate){
                    if (($scope.ridersReportFilter.startDate - $scope.ridersReportFilter.endDate) > 0){
                        bootbox.alert({
                            title : 'WARNING',
                            message : 'Start date cannot be greater than End date.',
                            className : 'text-center'
                        })

                        $scope.ridersReportFilter.startDate = new Date();
                        $scope.ridersReportFilter.startDate.setDate($scope.ridersReportFilter.startDate.getDate() - 7);
                        $scope.ridersReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.ridersReportFilter.endDate = new Date();
                        $scope.ridersReportFilter.endDate.setHours(23, 59, 59, 59);

                    }

                }

                riderSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    riderSearchObj.viewBy = $scope.newViewBy;
                }else{
                    riderSearchObj.viewBy = initialViewBy;
                }
                riderSearchObj.sDate = $scope.DateTimeFormat($scope.ridersReportFilter.startDate, 'start');
                riderSearchObj.eDate = $scope.DateTimeFormat($scope.ridersReportFilter.endDate, 'end');
                riderSearchObj.searchFor = $scope.ridersReportSeach.filter;
                riderSearchObj.searchBy = riderSearchBy;
                riderSearchObj.class = '';
                riderSearchObj.paymentMode = '';
                riderSearchObj.seller = '';
                riderSearchObj.Manufacturer = '';
                riderSearchObj.fulfillmentStatus = '';
                console.log('$scope.ridersReportFilter.warehouse',$scope.ridersReportFilter.warehouse)

                if($scope.ridersReportFilter.paymentMode)
                    riderSearchObj.paymentMode = $scope.ridersReportFilter.paymentMode ;
                if($scope.ridersReportFilter.fulfiller)
                    riderSearchObj.fulfiller = $scope.ridersReportFilter.fulfiller ;
                if($scope.ridersReportFilter.warehouse)
                    riderSearchObj.warehouse = $scope.ridersReportFilter.warehouse ;

                if($scope.ridersReportFilter.fulfillmentStatus)
                    riderSearchObj.fulfillmentStatus = $scope.ridersReportFilter.fulfillmentStatus ;


                $scope.ridersreport = [];
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/riders/orders",riderSearchObj)
                    .success(function(response){
                        $scope.ridersreport = response;
                        console.log('Riders Report ->', $scope.ridersreport)
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


                $http.post("/dash/reports/riders/orders/count", riderSearchObj)
                    .success(function (response) {
                        console.log('count response',response)
                        $scope.reportsTransactionCount(response, 19);
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

            if(id == 21){
                $scope.newViewBy1.view = 10;
                $scope.showReports = false;
                $scope.reportTabName = "Rider CheckIns";
                $scope.riderCheckInreport = [];
                $scope.riderCheckinMap = '';
                $scope.checkinMapLocation = {};

                if($scope.riderCheckInreports.startDate && $scope.riderCheckInreports.endDate){
                    if (($scope.riderCheckInreports.startDate - $scope.riderCheckInreports.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.riderCheckInreports.startDate = new Date();
                        $scope.riderCheckInreports.startDate.setDate($scope.riderCheckInreports.startDate.getDate() - 7);
                        $scope.riderCheckInreports.startDate.setHours(0, 0, 0, 0);
                        $scope.riderCheckInreports.endDate = new Date();
                        $scope.riderCheckInreports.endDate.setHours(23, 59, 59, 59);

                    }
                }

                riderCheckinSearchObj.rider = ''
                if($scope.riderCheckInreports.rider)
                    riderCheckinSearchObj.rider = $scope.riderCheckInreports.rider ;

                riderCheckinSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    riderCheckinSearchObj.viewBy = $scope.newViewBy;
                }else{
                    riderCheckinSearchObj.viewBy = initialViewBy;
                }

                riderCheckinSearchObj.warehouse = ''
                if($scope.riderCheckInreports.warehouse)
                    riderCheckinSearchObj.warehouse = $scope.riderCheckInreports.warehouse ;

                riderCheckinSearchObj.fulfillmentStatus = ''
                if($scope.riderCheckInreports.fulfillmentStatus)
                    riderCheckinSearchObj.fulfillmentStatus = $scope.riderCheckInreports.fulfillmentStatus ;

                riderCheckinSearchObj.sDate = $scope.DateTimeFormat($scope.riderCheckInreports.startDate, 'start');
                riderCheckinSearchObj.eDate = $scope.DateTimeFormat($scope.riderCheckInreports.endDate, 'end');
                riderCheckinSearchObj.searchFor = $scope.riderCheckInReportSearch.filter;
                riderCheckinSearchObj.searchBy = riderCheckinSearchBy;

                $scope.riderCheckInreport = [];
                $scope.viewLength = 0;

                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/rider/checkins",riderCheckinSearchObj)
                    .success(function(response){
                        $scope.riderCheckInreport = response;
                        console.log('rider report',$scope.riderCheckInreport);
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

                $http.post("/dash/reports/rider/checkin/count", riderCheckinSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 21);
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
            if(id == 22){

                $scope.reportTabName = "Hub Summary";
                riderSearchObj = {};
                if($scope.hubReportFilter.startDate && $scope.hubReportFilter.endDate){
                    if (($scope.hubReportFilter.startDate - $scope.hubReportFilter.endDate) > 0){
                        bootbox.alert({
                            title : 'WARNING',
                            message : 'Start date cannot be greater than End date.',
                            className : 'text-center'
                        })

                        // $scope.hubReportFilter.startDate = new Date();
                        // $scope.hubReportFilter.startDate.setDate($scope.hubReportFilter.startDate.getDate() - 7);
                        // $scope.hubReportFilter.startDate.setHours(0, 0, 0, 0);
                        // $scope.hubReportFilter.endDate = new Date();
                        // $scope.hubReportFilter.endDate.setHours(23, 59, 59, 59);
                        console.log('$scope.hubReportFilter.date',$scope.hubReportFilter.date)



                    }

                }

                if(!$scope.hubReportFilter.date){
                    $scope.hubReportFilter.date = new Date();
                }

                riderSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    riderSearchObj.viewBy = $scope.newViewBy;
                }else{
                    riderSearchObj.viewBy = initialViewBy;
                }
                riderSearchObj.sDate = $scope.DateTimeFormat($scope.hubReportFilter.date, 'start');
                riderSearchObj.eDate = $scope.DateTimeFormat($scope.hubReportFilter.date, 'end');
                riderSearchObj.searchFor = $scope.ridersReportSeach.filter;
                riderSearchObj.searchBy = riderSearchBy;
                riderSearchObj.orderId = '';
                riderSearchObj.paymentMode = '';
                riderSearchObj.seller = '';
                riderSearchObj.Manufacturer = '';

                console.log('$scope.hubReportFilter.warehouse',$scope.hubReportFilter.warehouse)

                if($scope.hubReportFilter.paymentMode)
                    riderSearchObj.paymentMode = $scope.hubReportFilter.paymentMode ;
                if($scope.hubReportFilter.fulfiller)
                    riderSearchObj.fulfiller = $scope.hubReportFilter.fulfiller ;
                if($scope.hubReportFilter.warehouse)
                    riderSearchObj.warehouse = $scope.hubReportFilter.warehouse ;

                if($scope.hubReportFilter.orderId){
                    riderSearchObj.orderId = $scope.hubReportFilter.orderId ;
                }


                if($scope.hubReportFilter.warehouse || $scope.hubReportFilter.fulfiller){
                    $scope.showHubFilter = true
                }

                if(reportName){
                    $scope.displayReport = reportName;
                }



                $scope.Hubreport = [];
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/hub/orders",riderSearchObj)
                    .success(function(response){
                        $scope.Hubreport = response;
                        console.log('itemreport',$scope.Hubreport)

                        if(reportName == 'Rider Summary'){
                            document.getElementById("rider_summary").style.display = "none";
                            //hide the modal

                            $('body').removeClass('modal-open');
                            //modal-open class is added on body so it has to be removed

                            $('.modal-backdrop').remove();
                        }else if(reportName == 'Trip Summary'){
                            document.getElementById("trip_summary").style.display = "none";
                            //hide the modal

                            $('body').removeClass('modal-open');
                            //modal-open class is added on body so it has to be removed

                            $('.modal-backdrop').remove();
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

                $http.post("/dash/reports/riders/orders/count", riderSearchObj)
                    .success(function (response) {
                        console.log('count response',response)
                        $scope.reportsTransactionCount(response, 19);
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
            if(id == 23){
                $scope.newViewBy1.view = 10;
                $scope.showReports = false;
                $scope.reportTabName = "Rider Activity";
                $scope.riderActivityreport = [];
                $scope.riderCheckinMap = '';
                $scope.checkinMapLocation = {};

                riderActivitySearchObj.rider = ''
                if($scope.riderActivityreports.rider)
                    riderActivitySearchObj.rider = $scope.riderActivityreports.rider ;

                riderActivitySearchObj.warehouse = ''
                if($scope.riderActivityreports.warehouse)
                    riderActivitySearchObj.warehouse = $scope.riderActivityreports.warehouse ;

                riderActivitySearchObj.fulfillmentStatus = ''
                if($scope.riderActivityreports.fulfillmentStatus)
                    riderActivitySearchObj.fulfillmentStatus = $scope.riderActivityreports.fulfillmentStatus ;

                riderActivitySearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    riderActivitySearchObj.viewBy = $scope.newViewBy;
                }else{
                    riderActivitySearchObj.viewBy = initialViewBy;
                }
                riderActivitySearchObj.eDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'end');
                riderActivitySearchObj.sDate = $scope.DateTimeFormat($scope.riderActivityreports.startDate, 'start');
                riderActivitySearchObj.searchFor = $scope.riderActivityReportSearch.filter;
                riderActivitySearchObj.searchBy = riderActivitySearchBy;

                $scope.riderActivityreport = [];
                $scope.viewLength = 0;

                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $scope.riderActivityreports.customerVisits = 0;

                $http.post("/dash/reports/rider/Activity",riderActivitySearchObj)
                    .success(function(response){
                        $scope.riderActivityreport = response;
                        if(response){
                            $scope.riderActivityreports.amount_collected = 0;
                            $scope.riderActivityreports.distance = 0;
                            $scope.riderActivityreports.balance_qty = 0;
                            for(var i=0;i<response.length; i++){
                                if(response[i].fulfiller[0] == $scope.riderActivityreports.rider || response[i].tripId[0] == $scope.riderActivityReportSearch.filter){
                                    $scope.rider = response[i].rider;
                                    $scope.riderActivityreports.customerVisits += response[i].dealername.length;
                                    $scope.riderActivityreports.amount_collected += parseFloat(response[i].amount_collected);
                                    $scope.riderActivityreports.distance += (response[i].distance ? parseFloat(response[i].distance) : 0);
                                    $scope.riderActivityreports.tripId = response[i].tripId[0];
                                    $scope.date = response[i].deliveredTime;
                                    $scope.riderActivityreports.balance_qty += response[i].balance_qty ? parseInt(response[i].balance_qty) : 0;
                                }
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

                $http.post("/dash/reports/rider/Activity/count", riderActivitySearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 23);
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

            if(id == 24){

                $scope.showReports = false;
                $scope.reportTabName = "Order Summary";
                $scope.orderSummaryreport = [];

                orderSummarySearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    orderSummarySearchObj.viewBy = $scope.newViewBy;
                }else{
                    orderSummarySearchObj.viewBy = initialViewBy;
                }

                orderSummarySearchObj.startDate = $scope.DateTimeFormat($scope.orderSearch.startDate, 'start');
                orderSummarySearchObj.endDate = $scope.DateTimeFormat($scope.orderSearch.endDate, 'end');
                orderSummarySearchObj.searchFor = $scope.orderSearch.filter;
                orderSummarySearchObj.searchBy = orderSearchBy;
                $scope.orderSummaryreport = [];
                $scope.viewLength = 0;

                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                if($scope.orderSearch.warehouse){
                    orderSummarySearchObj.warehouse = $scope.orderSearch.warehouse;
                }else{
                    orderSummarySearchObj.warehouse = '';
                }

                if($scope.orderSearch.paymentStatus){
                    orderSummarySearchObj.paymentStatus = $scope.orderSearch.paymentStatus;
                }else{
                    orderSummarySearchObj.paymentStatus = '';
                }

                if($scope.orderSearch.fulfillmentStatus){
                    orderSummarySearchObj.fulfillmentStatus = $scope.orderSearch.fulfillmentStatus;
                }else{
                    orderSummarySearchObj.fulfillmentStatus = '';
                }

                orderSummarySearchObj.dealer = {};
                if($scope.orderSearch.dealer){
                    orderSummarySearchObj.dealer.dealerID = $scope.orderSearch.dealer.DealerID ? $scope.orderSearch.dealer.DealerID : '';
                    orderSummarySearchObj.dealer.dealercode = $scope.orderSearch.dealer.Dealercode ? $scope.orderSearch.dealer.Dealercode : '';
                }


                if($scope.orderSearch.seller){
                    orderSummarySearchObj.seller = $scope.orderSearch.seller.sellerphone;
                }
                else{
                    orderSummarySearchObj.seller = '';
                }


                if($scope.orderSearch.source){
                    orderSummarySearchObj.source = $scope.orderSearch.source;
                }else{
                    orderSummarySearchObj.source = '';
                }

                $http.post("/dash/reports/order/summary",orderSummarySearchObj)
                    .success(function(response){
                        for(var i=0;i<response.length; i++){
                            $scope.orderSummaryreport.push(response[i]);
                            if(response[i].source == 'Shopify'){
                                $scope.hideAndshowkitchen = true;
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

                $http.post("/dash/reports/order/summary/count", orderSummarySearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 24);
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
                if(orderSummarySearchObj.startDate != 0  || orderSummarySearchObj.endDate != 0 || orderSummarySearchObj.source != '' || orderSummarySearchObj.warehouse != '' || orderSummarySearchObj.seller != '' || orderSummarySearchObj.paymentStatus != '' || orderSummarySearchObj.fulfillmentStatus != ''){
                    $scope.showOrderFilter = true;
                }else{
                    $scope.showOrderFilter = false;
                }
            }

            if(id == 39){

                $scope.reportTabName = "Custom Order Report";

                $scope.customOrderReport = [];

                if($scope.itemReportFilter.startDate && $scope.itemReportFilter.endDate){
                    if (($scope.itemReportFilter.startDate - $scope.itemReportFilter.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        $scope.itemReportFilter.startDate = new Date();
                        $scope.itemReportFilter.startDate.setDate($scope.itemReportFilter.startDate.getDate() - 7);
                        $scope.itemReportFilter.startDate.setHours(0, 0, 0, 0);
                        $scope.itemReportFilter.endDate = new Date();
                        $scope.itemReportFilter.endDate.setHours(23, 59, 59, 59);

                    }

                }

                customOrderSearchObj.viewLength = 0;
                if($scope.newViewBy > initialViewBy ){
                    customOrderSearchObj.viewBy = $scope.newViewBy;
                }else{
                    customOrderSearchObj.viewBy = initialViewBy;
                }
                customOrderSearchObj.sDate = $scope.DateTimeFormat($scope.customOrderFilter.startDate, 'start');
                customOrderSearchObj.eDate = $scope.DateTimeFormat($scope.customOrderFilter.endDate, 'end');
                customOrderSearchObj.searchFor = $scope.customOrderFilter.filter;
                customOrderSearchObj.searchBy = customOrderSearchBy;
                customOrderSearchObj.plant = $scope.customOrderFilter.plant;
                customOrderSearchObj.state = $scope.customOrderFilter.state;

                if($scope.user.role == "Factory"){
                    if($scope.user && $scope.user.sellerObject && $scope.user.sellerObject.plant_code)
                    customOrderSearchObj.plant_code = $scope.user.sellerObject.plant_code;
                }

                $scope.itemreport = [];
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }

                $http.post("/dash/reports/customordersreport",customOrderSearchObj)
                    .success(function(response){
                        console.log("results",response);
                        $scope.customOrderReport = response;


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

                $http.post("/dash/reports/customordersreport/count", customOrderSearchObj)
                    .success(function (response) {
                        $scope.reportsTransactionCount(response, 39);
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

        }

        /*============download csv function=============*/
        $scope.downloadCSV = function(tab){
            switch(tab){

                case 1:
                    checkinSearchObj.seller = ''
                    if($scope.cinreport.seller)
                        checkinSearchObj.seller = $scope.cinreport.seller ;

                    checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                    checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                    checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                    checkinSearchObj.searchBy = checkinDealerSearchBy;

                    checkinSearchObj.customerType = '';
                    if($scope.cinreport.customerType){
                        checkinSearchObj.customerType = $scope.cinreport.customerType;
                    }

                    var request_object = {
                        url : "/dash/reports/checkin/count",
                        method : "POST",
                        timeout : api_timeout,
                        data : checkinSearchObj
                    };

                    $http(request_object)
                        .success(function(response){

                            if(response > 30000){
                                bootbox.alert({
                                    title: 'WARNING',
                                    message : 'Please select a smaller date range. Current records : <span class="ERROR">'+response.rma_list+'</span>',
                                    class: 'text-center'
                                })
                            }
                            else {
                                checkinSearchObj.seller = ''
                                if($scope.cinreport.seller)
                                    checkinSearchObj.seller = $scope.cinreport.seller ;

                                checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                                checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                                checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                                checkinSearchObj.searchBy = checkinDealerSearchBy;

                                checkinSearchObj.customerType = '';
                                if($scope.cinreport.customerType){
                                    checkinSearchObj.customerType = $scope.cinreport.customerType;
                                }
                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");

                                var request_object = {
                                    url : "/dash/csv/checkins/download",
                                    method : "POST",
                                    timeout : api_timeout,
                                    data : checkinSearchObj
                                };

                                $http(request_object)
                                    .success(function(result){
                                        var output = 'id,Check-In ID,Date_added,Time,Dealercode,Dealername,Dealerphone,Salesperson No.,Salesperson,Stockist_Phone,Stockist_Name,Stockist_Area,Start Visit Time,End Visit Time,Comment,Latitude,Longitude,Type,Address,Start_Visit_Dist,End_Visit_Dist ';			//makes it comma seperated heading
                                        //console.log(output)
                                        output += '\n';
                                        for (var i = 0; i < result.length; i++) {

                                            if(result[i].storeLat && result[i].storeLong){
                                                result[i].customerLocation = true;
                                                var slatlng = new google.maps.LatLng(result[i].storeLat, result[i].storeLong);
                                                var startLatLong;
                                                var endLatLong;
                                                //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                                if(result[i].latitude && result[i].longitude
                                                    && result[i].latitude != 1 && result[i].longitude != 1
                                                    && result[i].latitude != 2 && result[i].longitude != 2
                                                    && result[i].latitude != 3 && result[i].longitude != 3
                                                    && result[i].latitude != 4 && result[i].longitude != 4){
                                                    startLatLong = new google.maps.LatLng(result[i].latitude, result[i].longitude);
                                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                                    result[i].sVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                    result[i].startVisitLocation = true;
                                                }
                                                else{
                                                    result[i].startVisitLocation = false;
                                                    result[i].sVisitDist =
                                                        (result[i].latitude == 1 ? 'User Denied GPS Permission' :
                                                            (result[i].latitude == 2 ? 'GPS ERROR' :
                                                                ((result[i].latitude == 3 || result[i].latitude == 4) ? 'Device GPS off' : '')));
                                                }

                                                if(result[i].exitLat && result[i].exitLong
                                                    && result[i].exitLat != 1 && result[i].exitLong != 1
                                                    && result[i].exitLat != 2 && result[i].exitLong != 2
                                                    && result[i].exitLat != 3 && result[i].exitLong != 3
                                                    && result[i].exitLat != 4 && result[i].exitLong != 4){

                                                    endLatLong = new google.maps.LatLng(result[i].exitLat, result[i].exitLong);
                                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                                    result[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                    result[i].endVisitLocation = true;
                                                }
                                                else{
                                                    result[i].eVisitDist =
                                                        (result[i].exitLong == 1 ? 'User Denied GPS Permission' :
                                                            (result[i].exitLong == 2 ? 'GPS ERROR' :
                                                                ((result[i].exitLong == 3 || result[i].exitLong == 4) ? 'Device GPS off' : '')));
                                                    result[i].endVisitLocation = false;
                                                }
                                            }
                                            else{
                                                result[i].customerLocation = false;

                                                if(result[i].latitude == 1 ||
                                                    result[i].latitude == 2 ||
                                                    result[i].latitude == 3 ||
                                                    result[i].latitude == 4){
                                                    result[i].startVisitLocation = false;
                                                    result[i].sVisitDist =
                                                        (result[i].latitud == 1 ? 'User Denied GPS Permission' :
                                                            (result[i].latitude == 2 ? 'GPS ERROR' :
                                                                ((result[i].latitude == 3 || result[i].latitude == 4) ? 'Device GPS off' : '')));

                                                }
                                                else{
                                                    result[i].startVisitLocation = true;
                                                }
                                                if(result[i].exitLat == 1 ||
                                                    result[i].exitLat == 2 ||
                                                    result[i].exitLat == 3 ||
                                                    result[i].exitLat == 4){
                                                    result[i].endVisitLocation = false;
                                                    result[i].eVisitDist = (result[i].exitLat == 1 ? 'User Denied GPS Permission' :
                                                        (result[i].exitLat == 2 ? 'GPS ERROR' :
                                                            ((result[i].exitLat == 3 || result[i].exitLat == 4) ? 'Device GPS off' : '')));
                                                }
                                                else{

                                                    if(result[i].exitLat)
                                                        result[i].endVisitLocation = true;
                                                    else{ // Check if null?? if yes, it means that the user has not ended visit
                                                        result[i].endVisitLocation = false;
                                                        result[i].eVisitDist = 'Not Ended';
                                                    }

                                                }

                                            }

                                            output += i + 1;
                                            output += ',';


                                            output += result[i].orderId;
                                            output += ',';

                                            function formatdate(date) {
                                                if (date == undefined || date == '')
                                                    return ('');
                                                /* replace is used to ensure cross browser support*/
                                                var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                                                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                                var dt = d.getDate();
                                                if (dt < 10)
                                                    dt = "0" + dt;
                                                var dateOut = dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear());
                                                return dateOut;
                                            }

                                            function formattime(date) {
                                                if (date == undefined || date == '')
                                                    return ('')
                                                var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                                                var dt = d.getDate()
                                                if (dt < 10)
                                                    dt = "0" + dt
                                                var datetime = (d.getHours()) + ":" + (d.getMinutes())
                                                return datetime;
                                            }

                                            if (result[i].date_added)
                                                var dateformat = formatdate(result[i].date_added);

                                            output += dateformat;
                                            output += ',';

                                            if (result[i].date_added)
                                                var dateformat = formattime(result[i].date_added);

                                            output += dateformat;
                                            output += ',';

                                            output += result[i].dealercode;
                                            output += ',';

                                            try {
                                                if (result[i].dealername) {
                                                    if ((result[i].dealername).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + result[i].dealername + '"';
                                                        result[i].dealername = quotesWrapped
                                                    }
                                                    output += result[i].dealername;
                                                }
                                            } catch (e) {
                                            }

                                            output += ',';
                                            if (result[i].dealerphone)
                                                output += result[i].dealerphone;
                                            output += ',';

                                            if (result[i].seller)
                                                output += result[i].seller;
                                            output += ',';

                                            try {
                                                if (result[i].sellername) {
                                                    if ((result[i].sellername).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + result[i].sellername + '"';
                                                        result[i].sellername = quotesWrapped
                                                    }
                                                }
                                                output += result[i].sellername;
                                            } catch (e) {
                                            }

                                            output += ',';
                                            if (result[i].stockist)
                                                output += result[i].stockist;
                                            output += ',';
                                            if (result[i].stockistname)
                                                output += result[i].stockistname;
                                            output += ',';
                                            if (result[i].stockistarea)
                                                output += result[i].stockistarea;
                                            output += ',';

                                            if(result[i].intime){
                                                output += $scope.getTimeFromDate(result[i].intime);
                                            }
                                            output += ',';

                                            if(result[i].outtime){
                                                output += $scope.getTimeFromDate(result[i].outtime);
                                            }
                                            output += ',';

                                            var comment = '';
                                            try {
                                                comment = result[i].comment[(result[i].comment.length) - 1].comment;
                                                if (comment) {
                                                    if ((comment).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + comment + '"';
                                                        comment = quotesWrapped
                                                    }
                                                }
                                                output += comment;
                                            } catch (e) {
                                            }
                                            output += ',';

                                            if (result[i].latitude != 'undefined')
                                                output += result[i].latitude;
                                            output += ',';
                                            if (result[i].longitude != 'undefined')
                                                output += result[i].longitude;
                                            output += ',';

                                            if (result[i].type)
                                                output += result[i].type;
                                            output += ',';

                                            // output += result[i].orderId;
                                            // output += ',';

                                            try {
                                                if (result[i].Address) {
                                                    if ((result[i].Address).toString().indexOf(',') != -1) {
                                                        quotesWrapped = '"' + result[i].Address + '"'
                                                        result[i].Address = quotesWrapped
                                                    }
                                                    output += result[i].Address;
                                                }
                                            } catch (e) {
                                                console.log(e)
                                            }
                                            output += ',';

                                            if (result[i].sVisitDist)
                                                output += result[i].sVisitDist;
                                            output += ',';

                                            if (result[i].eVisitDist)
                                                output += result[i].eVisitDist;


                                            output += '\n';
                                        }


                                        var blob = new Blob([output], {type : "text/csv;charset=UTF-8"});
                                        console.log(blob);
                                        window.URL = window.webkitURL || window.URL;
                                        var url = window.URL.createObjectURL(blob);

                                        var d = new Date();
                                        var anchor = angular.element('<a/>');

                                        anchor.attr({
                                            href: url,
                                            target: '_blank',
                                            download: 'Mbj_' + instanceDetails.api_key + '_Checkins_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                        })[0].click();
                                        //return response

                                        jQuery.noConflict();
                                        $('.refresh').css("display", "none");
                                    })
                                    .error(function(data, status, headers, config){
                                        console.log(data);
                                        // document.getElementById("loader").style.display = "none";
                                        // document.getElementById("myDiv").style.display = "block";
                                        // document.getElementById("message").style.display = "none";

                                        bootbox.alert({
                                            title: "ERROR Line : 14877",
                                            message: "The server took too long to respond : Timeout Error. Please try again!<br>Error : " + data + " " + status,
                                            className: "text-center",
                                            callback: function (result) {

                                            }
                                        })
                                    });
                            }

                        })
                        .error(function(data, status, headers, config){
                            console.log(data);
                            // document.getElementById("loader").style.display = "none";
                            // document.getElementById("myDiv").style.display = "block";
                            // document.getElementById("message").style.display = "none";

                            bootbox.alert({
                                title: "ERROR Line : 14895",
                                message: "The server took too long to respond : Timeout Error. Please try again!<br>Error : " + data + " " + status,
                                className: "text-center",
                                callback: function (result) {

                                }
                            })
                        });
                    break;
            }
        }
        /*============download csv function end==========*/

        //Function to take care of things when a store is selected for the new order
        $scope.FetchSelectedFromDelearList = function(){
            var popularDealers = [];
            for(var i = 0; i < $scope.dealerreport.length; i++){
                popularDealers.push({'Dealercode':$scope.dealerreport[i].dealer[0]});
            }

            $http.post("/dash/stores/dealercode",popularDealers)
                .success(function (response) {
                    $scope.popularDealerReport = response;
                })
        }

        $scope.renderDealerReport = function (type) {

            if($scope.dealerReportFilter.startDate && $scope.dealerReportFilter.endDate){
                if (($scope.dealerReportFilter.startDate - $scope.dealerReportFilter.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.dealerReportFilter.startDate = new Date();
                    $scope.dealerReportFilter.startDate.setDate($scope.dealerReportFilter.startDate.getDate() - 7);
                    $scope.dealerReportFilter.startDate.setHours(0, 0, 0, 0);
                    $scope.dealerReportFilter.endDate = new Date();
                    $scope.dealerReportFilter.endDate.setHours(23, 59, 59, 59);

                    return;
                }
            }

            topCustomerSearchObj.viewLength = 0;
            topCustomerSearchObj.viewBy = initialViewBy;
            topCustomerSearchObj.sDate = $scope.DateTimeFormat($scope.dealerReportFilter.startDate, 'start');
            topCustomerSearchObj.eDate = $scope.DateTimeFormat($scope.dealerReportFilter.endDate, 'end');
            topCustomerSearchObj.searchFor = $scope.dealerReportSearch.filter;
            topCustomerSearchObj.searchBy = topDealerSearchBy;

            if(!type){
                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

            }

            $http.post("/dash/reports/dealers/",topCustomerSearchObj)
                .success(function(response){
                    console.log("GetAll Dealers reports-->" );
                    // console.log(response);
                    response.sort(function(a, b) {
                        return a.orderTotal < b.orderTotal ? 1 : -1;
                    });

                    $scope.dealerreport = response;
                    $scope.items10 = response;
                    $scope.totalItems1 = response.length;
                    $scope.FetchSelectedFromDelearList();

                    $scope.items10 = $scope.dealerreport;
                    $scope.viewby1 = 10;
                    $scope.totalItems1 = $scope.dealerreport.length;
                    $scope.currentPage1 = 1;
                    $scope.itemsPerPage1 = $scope.viewby1;
                    $scope.maxSize1 = 5;
                    $scope.case8bLength = $scope.dealerreport.length;

                    $http.post("/dash/reports/top/customer/count", topCustomerSearchObj)
                        .success(function (res) {
                            if(!type) {
                                $scope.reportsTransactionCount(res, 2);
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

        };


        $scope.Payments = {};
        $scope.Payments.all = true;

        $scope.filterByModeOfPayment = function(type)
        {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            if(type != 'all' && type != undefined){
                $scope.modeOfPayment = type;
            }
            else
                $scope.modeOfPayment = '';


            paymentSearchObj.viewLength = 0;
            paymentSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.paymentsreport.startDate)
                paymentSearchObj.sDate = $scope.paymentsreport.startDate;
            if($scope.paymentsreport.endDate){
                $scope.paymentsreport.endDate.setHours(23,59,59)
                paymentSearchObj.eDate = $scope.paymentsreport.endDate;
            }
            if(type != 'all')
                paymentSearchObj.filter = type;
            else
                paymentSearchObj.filter = '';


            $scope.cashreport = [];

            if($scope.applicationType != 'StoreJini'){
                $http.post("/dash/reports/cashitems",paymentSearchObj)
                    .success(function(response){
                        console.log("GetAll Cash reports-->");
                        $scope.cashreport = response;

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
            if($scope.applicationType == 'StoreJini'){
                $http.post("/dash/reports/storeJini/payments",paymentSearchObj)
                    .success(function(response){
                        console.log("GetAll Cash reports for storeJini-->");
                        $scope.cashreport = response;

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



            $http.post("/dash/reports/payment/count", paymentSearchObj)
                .success(function (res) {
                    $scope.reportsTransactionCount(res, 5);
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

            setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 1000);
        }



        $scope.renderOverallReport = function()
        {
            if($scope.overallReportFilter.startDate && $scope.overallReportFilter.endDate){
                if (($scope.overallReportFilter.startDate - $scope.overallReportFilter.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    return;
                }
            }

            if($scope.overallReportFilter.seller){
                overallSearchObj.seller = $scope.overallReportFilter.seller;
            }
            else{
                overallSearchObj.seller = '';
            }

            if($scope.overallReportFilter.stockist){
                overallSearchObj.stockist = $scope.overallReportFilter.stockist;
            }
            else{
                overallSearchObj.stockist = '';
            }



            overallSearchObj.viewLength = 0;
            overallSearchObj.viewBy = initialViewBy;
            overallSearchObj.sDate = $scope.DateTimeFormat($scope.overallReportFilter.startDate, 'start');
            overallSearchObj.eDate = $scope.DateTimeFormat($scope.overallReportFilter.endDate, 'end');
            overallSearchObj.dateWise = $scope.dateWise;
            overallSearchObj.searchFor = $scope.overallReportFilter.filter;
            overallSearchObj.searchBy = reportSearchBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            jQuery.noConflict();
            $('.refresh').css("display", "inline");



            $http.post("/dash/reports/overallreports",overallSearchObj).success(function(response){

                $scope.overallreports = response;

                $http.post("/dash/reports/overallreport/count", overallSearchObj)
                    .success(function (res) {
                        $scope.reportsTransactionCount(res, 14);
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
            })
            setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 1000);

        }

        $scope.tripDetails = {};
        $scope.trips = [];
        var expenses = [];

        $scope.getTripDetails = function(id){

            $scope.tripDetails = {};

            if(id){

                if($scope.expreport.startDate && $scope.expreport.endDate){
                    if (($scope.expreport.startDate - $scope.expreport.endDate) > 0){
                        Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                        return;
                    }
                }
                $http.get("/dash/reports/expense/trip/details/"+$scope.DateTimeFormat($scope.expreport.startDate, 'start')+"/"+$scope.DateTimeFormat($scope.expreport.endDate, 'end'))
                    .success(function(response) {


                        for (var i = 0; i < response.length; i++) {

                            if (response[i].type == 'trip')
                                $scope.trips.push(response[i]);
                            // console.log("trip details",$scope.trips)
                        }

                        if($scope.trips.length){
                            for(var i=0; i< $scope.trips.length; i++){
                                if($scope.trips[i].tripID == id){
                                    $scope.tripDetails = $scope.trips[i];
                                    jQuery.noConflict();
                                    $('#tripDetails').modal('show');
                                    break;
                                }else{
                                    if(i == $scope.trips.length-1){
                                        Settings.alertPopup("ERROR", "This trip might have been removed or deleted");
                                        return;
                                    }
                                }
                            }
                        }else{
                            Settings.alertPopup("ERROR", "This trip might have been removed or deleted");
                            return;
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
        }


        $scope.filterExpenseStatus = function(status)
        {

            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            if(status != 'all' && status != undefined){
                $scope.expenseFilterStatus = status;
            }
            else
                $scope.expenseFilterStatus = '';


            expenseSearchObj.viewLength = 0;
            expenseSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.expreport.startDate)
                expenseSearchObj.sDate = $scope.expreport.startDate;
            if($scope.expreport.endDate){
                $scope.expreport.endDate.setHours(23,59,59)
                expenseSearchObj.eDate = $scope.expreport.endDate;
            }
            if(status != 'all')
                expenseSearchObj.filter = status;
            else
                expenseSearchObj.filter = '';


            $scope.expensereport = [];

            $http.post("/dash/reports/expense",expenseSearchObj)
                .success(function(response) {
                    // console.log(response);


                    for (var i = 0; i < response.length; i++) {
                        $scope.expensereport.push(response[i]);
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

            $http.post("/dash/reports/expense/count", expenseSearchObj)
                .success(function(res){
                    $scope.reportsTransactionCount(res,7);
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

            setTimeout(function(){
                $('.refresh').css("display", "none");
            }, 1000);
        }


        $scope.renderMeetingReport = function () {
            console.log("GetAll Meeting reports-->");
            if($scope.mtgreport.startDate && $scope.mtgreport.endDate){
                if (($scope.mtgreport.startDate - $scope.mtgreport.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");


                    $scope.mtgreport.startDate = new Date();
                    $scope.mtgreport.startDate.setDate($scope.mtgreport.startDate.getDate() - 30);
                    $scope.mtgreport.startDate.setHours(0, 0, 0, 0);
                    $scope.mtgreport.endDate = new Date();
                    $scope.mtgreport.endDate.setHours(23, 59, 59, 59);

                    return;
                }
            }

            meetingSearchObj.viewLength = 0;
            meetingSearchObj.viewBy = initialViewBy;
            meetingSearchObj.sDate = $scope.DateTimeFormat($scope.mtgreport.startDate, 'start');
            meetingSearchObj.eDate = $scope.DateTimeFormat($scope.mtgreport.endDate, 'end');
            meetingSearchObj.searchFor = $scope.meetingsReportSearch.filter;
            meetingSearchObj.searchBy = topDealerSearchBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;



            $http.post("/dash/reports/meeting/",meetingSearchObj)
                .success(function(response){

                    // console.log(response) 

                    response.sort(function(a, b) {
                        return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
                    });


                    $scope.meetingreport = response;
                    $scope.items6 = response;
                    $scope.totalItems7 = $scope.meetingreport.length;
                    $scope.currentPage7 = 1;
                    $scope.maxSize7 = 5;

                    $scope.items6 = $scope.meetingreport;
                    $scope.viewby7 = 10;
                    $scope.totalItems7 = $scope.meetingreport.length;
                    $scope.currentPage7 = 1;
                    $scope.itemsPerPage7 = $scope.viewby7;
                    $scope.maxSize7 = 5;
                    $scope.case8hLength = $scope.meetingreport.length;

                    $http.post("/dash/reports/meeting/count", meetingSearchObj)
                        .success(function (res) {
                            $scope.reportsTransactionCount(res, 8);
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
            //console.log($scope.meetingreport);
        }



        $scope.renderAttendanceReport = function () {
            if ((($scope.atdreports.startDate - $scope.atdreports.endDate) > 0) && ($scope.atdreports.startDate && $scope.atdreports.endDate)){
                Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

            }
            else{
                attSearchObj.sDate = $scope.DateTimeFormat($scope.atdreports.startDate, 'start');
                attSearchObj.eDate = $scope.DateTimeFormat($scope.atdreports.endDate, 'end');
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy =initialViewBy;
                attSearchObj.searchFor = '';

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;
                if($scope.AttendanceReportSearch.filter != '')
                    attSearchObj.searchFor = $scope.AttendanceReportSearch.filter;

                $http.post("/dash/reports/attendance", attSearchObj)
                    .success(function(response){
                        console.log("GetAll Attendance reports-->");
                        //console.log(response)

                        // response.sort(function(a, b) {
                        //     return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
                        // });

                        $http.post("/dash/reports/attendance/count", attSearchObj)
                            .success(function(res){
                                $scope.transactionCount(res,3);
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

                        $scope.attendancereport = response;
                        allAttendance = response;

                        if($scope.AttendanceReportSearch.filter)
                            $scope.showAttendanceFilter = true;
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
        };


        $scope.renderUserReport = function() {

            if($scope.sellerUserFilter.startDate && $scope.sellerUserFilter.endDate){
                if (($scope.sellerUserFilter.startDate - $scope.sellerUserFilter.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    return
                }
                $http.get("/dash/reports/order/"+$scope.DateTimeFormat($scope.sellerUserFilter.startDate,'start')+"/"+$scope.DateTimeFormat($scope.sellerUserFilter.endDate,'end'))
                    .success(function(response){
                        console.log("GetAll Seller report -->");
                        //console.log(response);
                        $scope.reps = response;
                        // $scope.sellerreport = response;
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
            }else {
                // $http.get("/dash/reports/sellers/0/0")
                // 	.success(function (response) {
                // 		console.log("GetAll Seller report -->");
                // 		console.log(response)
                // 		$scope.sellerreport = response;
                //
                // 	})
            }
        };
        var sortDir = false;
        $scope.sortTable = function (item, prop) {
            // debugger
            sortDir = !sortDir;

            if (($scope[item][0]) != null) {
                if (typeof ($scope[item][0][prop]) == "string") {
                    if (sortDir) {
                        $scope[item].sort(function (a, b) {
                            var nameA = a[prop], nameB = b[prop];
                            // console.log(nameA)
                            if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
                                if (isNaN(nameA[0]) == true && isNaN(nameB[0]) == true) {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] < nameB[0] ? 1 : -1;
                                }
                                else if (isNaN(nameA[0]) == false && isNaN(nameB[0]) == false) {
                                    return a[prop] - b[prop]
                                }
                                else {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] < nameB[0] ? 1 : -1;
                                }
                            }
                            else {
                                return a[prop] > b[prop]
                            }
                        });
                    } else {
                        $scope[item].sort(function (a, b) {
                            var nameA = a[prop], nameB = b[prop];
                            // console.log(nameA)
                            if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
                                if (isNaN(nameA[0]) == true && isNaN(nameB[0]) == true) {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] > nameB[0] ? 1 : -1;
                                }
                                else if (isNaN(nameA[0]) == false && isNaN(nameB[0]) == false) {
                                    return b[prop] - a[prop]
                                }
                                else {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
                                    else
                                        return nameA[0] > nameB[0] ? 1 : -1;
                                }
                            }
                            else {
                                return a[prop] > b[prop]
                            }
                        });
                    }
                }
                else if (typeof ($scope[item][0][prop]) == "number") {
                    if (sortDir) {
                        $scope[item].sort(function (a, b) {
                            return a[prop] - b[prop];
                            // return (a[prop] < b[prop] ? 1 : -1);
                        });
                    }
                    else {
                        $scope[item].sort(function (a, b) {
                            return b[prop] - a[prop];
                            // return (a[prop] > b[prop] ? 1 : -1);
                        });
                    }
                }
            }

            if ((($scope[item][0][prop][0])) != null) {
                if (typeof (($scope[item][0][prop][0])) == "string") {
                    if (sortDir) {
                        $scope[item].sort(function (a, b) {
                            var nameA = a[prop], nameB = b[prop];
                            // console.log(nameA)
                            if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
                                if (isNaN(nameA[0]) == true && isNaN(nameB[0]) == true) {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
                                    else
                                        return nameA[0] < nameB[0] ? 1 : -1;
                                }
                                else if (isNaN(nameA[0]) == false && isNaN(nameB[0]) == false) {
                                    return a[prop] - b[prop]
                                }
                                else {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
                                    else
                                        return nameA[0] < nameB[0] ? 1 : -1;
                                }
                            }
                            else {
                                return a[prop] > b[prop]
                            }
                        });
                    } else {
                        $scope[item].sort(function (a, b) {
                            var nameA = a[prop], nameB = b[prop];
                            // console.log(nameA)
                            if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
                                if (isNaN(nameA[0]) == true && isNaN(nameB[0]) == true) {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
                                    else
                                        return nameA[0] > nameB[0] ? 1 : -1;
                                }
                                else if (isNaN(nameA[0]) == false && isNaN(nameB[0]) == false) {
                                    return b[prop] - a[prop]
                                }
                                else {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] > nameB[0] ? 1 : -1;
                                }
                            }
                            else {
                                return a[prop] > b[prop]
                            }
                        });
                    }
                }
                else if (typeof (($scope[item][0][prop][0])) == "number") {
                    if (sortDir) {
                        $scope[item].sort(function (a, b) {
                            return a[prop] - b[prop];
                            // return (a[prop] < b[prop] ? 1 : -1);
                        });
                    }
                    else {
                        $scope[item].sort(function (a, b) {
                            return b[prop] - a[prop];
                            // return (a[prop] > b[prop] ? 1 : -1);
                        });
                    }
                }
            }


            if (($scope[item][0][0]) != null) {
                // if (typeof ($scope[item][0][prop][0]) != null){
                if (typeof ($scope[item][0][prop])[0] == "string") {
                    if (sortDir) {
                        $scope[item].sort(function (a, b) {
                            var nameA = a[prop][0], nameB = b[prop][0];
                            // console.log(nameA)
                            if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
                                if (isNaN(nameA[0]) == true && isNaN(nameB[0]) == true) {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] < nameB[0] ? 1 : -1;

                                }
                                else if (isNaN(nameA[0]) == false && isNaN(nameB[0]) == false) {
                                    return a[prop] - b[prop]
                                }
                                else {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] < nameB[0] ? 1 : -1;
                                }
                            }
                            else {
                                return a[prop] > b[prop]
                            }
                        });
                    } else {
                        $scope[item].sort(function (a, b) {
                            var nameA = a[prop][0], nameB = b[prop][0];
                            // console.log(nameA)
                            if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
                                if (isNaN(nameA[0]) == true && isNaN(nameB[0]) == true) {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] > nameB[0] ? 1 : -1;
                                }
                                else if (isNaN(nameA[0]) == false && isNaN(nameB[0]) == false) {
                                    return b[prop] - a[prop]
                                }
                                else {
                                    if (nameA[0].toLowerCase() && nameB[0].toLowerCase())
                                        return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
                                    else return nameA[0] > nameB[0] ? 1 : -1;
                                }
                            }
                            else {
                                return a[prop] > b[prop]
                            }
                        });
                    }
                }
                // }
                else if (typeof ($scope[item][0][prop][0]) == "number") {
                    if (sortDir) {
                        $scope[item].sort(function (a, b) {
                            return a[prop] - b[prop];
                            // return (a[prop] < b[prop] ? 1 : -1);
                        });
                    }
                    else {
                        $scope[item].sort(function (a, b) {
                            return b[prop] - a[prop];
                            // return (a[prop] > b[prop] ? 1 : -1);
                        });
                    }
                }
            }
            // }
            // }


            //         var prop = z;
            //         sortDir = !sortDir;
            //         // debugger
            //         // if(x[0][z]) {
            //         for(i=0 ; i <x.length ; i++) {
            //             if(x[i][z]) {
            //                 if ((x[i][z])[0] != undefined) {
            //                     var typ = typeof (x[i][z])[0];
            //                 }
            //
            //                 else if (x[i][z] != undefined) {
            //                     var typ = typeof ((x[i][z]));
            //                 }
            //             }
            //             }
            //         // }
            //
            //
            // if(typ != undefined) {
            //         if (typ == "string") {
            //             if (sortDir) {
            //                 x.sort(function (a, b) {
            //                     var nameA = a[prop], nameB = b[prop]
            //                     // console.log(nameA)
            //                     if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined && nameA[0].toLowerCase() && nameB[0].toLowerCase()) {
            //                         return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
            //                     }
            //                     else {
            //                         return a[prop] > b[prop]
            //                     }
            //                 });
            //             } else {
            //                 x.sort(function (a, b) {
            //                     var nameA = a[prop], nameB = b[prop]
            //                     if (nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
            //                         return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
            //                     }
            //                     else {
            //                         return b[prop] > a[prop]
            //                     }
            //                 });
            //             }
            //         }
            //     else if(typ == "number") {
            //             if(sortDir) {
            //                         x.sort(function(a, b) {
            //                             return a[prop]-b[prop]
            //                             // return (a[prop] < b[prop] ? 1 : -1);
            //                         });
            //                     }
            //                     else {
            //                         x.sort(function(a, b) {
            //                             return b[prop]-a[prop]
            //                             // return (a[prop] > b[prop] ? 1 : -1);
            //                         });
            //                     }
            //         }
            //     }


            // if(x.z == undefined) {
            //
            // }
            // else {


            // if(type == "text") {
            //     if(sortDir) {
            //         x.sort(function(a, b) {
            //             var nameA=a[prop], nameB=b[prop]
            //             // console.log(nameA)
            //             if(nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
            //                 return (nameA[0].toLowerCase() < nameB[0].toLowerCase() ? 1 : -1);
            //             }
            //         });
            //     }
            //     else {
            //         x.sort(function(a, b) {
            //             var nameA=a[prop], nameB=b[prop]
            //             if(nameA != "" && nameB != "" && nameA != undefined && nameB != undefined) {
            //                 return (nameA[0].toLowerCase() > nameB[0].toLowerCase() ? 1 : -1);
            //             }
            //         });
            //     }
            // }
            // else if(type == "number") {
            //     if(sortDir) {
            //         x.sort(function(a, b) {
            //             return a[prop]-b[prop]
            //             // return (a[prop] < b[prop] ? 1 : -1);
            //         });
            //     }
            //     else {
            //         x.sort(function(a, b) {
            //             return b[prop]-a[prop]
            //             // return (a[prop] > b[prop] ? 1 : -1);
            //         });
            //     }
            // }
            // else if(type == "date") {
            //     if(sortDir) {
            //         x.sort(function(a, b) {
            //             return (a[prop] < b[prop] ? 1 : -1);
            //         });
            //     }
            //     else {
            //         x.sort(function(a, b) {
            //             return (a[prop] > b[prop] ? 1 : -1);
            //         });
            //     }
            // }
            // }
        };


        $scope.fetchInvoiceDetails = function (invoice){
            var url = encodeURIComponent(invoice)
            $location.path('/invoice-details/'+ url);
        }

        $scope.emptyFilter = function(filter){
            if(!filter){
                $scope.renderOverallReport();
            }

        }


        $scope.filterHubDetails = function (obj ,type) {
            console.log('obj',obj)

            if(type == 'hub'){
                $scope.hubDetailsObj = obj
                $scope.hubReportFilter.warehouse = obj.warehouse[0];
                $scope.changeReportView(22,'','','Rider Summary');
            }else if(type == 'rider'){
                $scope.hubDetailsObj = obj
                $scope.hubReportFilter.fulfiller = obj.fulfiller[0];
                $scope.changeReportView(22,'','','Trip Summary');
            }else if(type == 'order'){
                $scope.hubDetailsObj = obj
                $scope.hubReportFilter.orderId = obj.orderId[0];
                $scope.changeReportView(22,'','','Order Summary');
            }

        }

        $scope.dealerPhoneFilter = function() {
            $scope.showCustomersDropdown = false;

            if ($scope.orderSearch.dealerPhone_Name) {
                var phone = $scope.orderSearch.dealerPhone_Name.toString();

                if (phone.length > 3) {
                    dealerSearchObj.viewLength = 0;
                    dealerSearchObj.viewBy = initialViewBy;
                    if ($scope.orderSearch.dealerPhone_Name) {
                        var phone = $scope.orderSearch.dealerPhone_Name.toString();
                        dealerSearchObj.searchFor = phone;
                        dealerSearchObj.searchBy = dealerSearchBy;

                        $http.post('/dash/stores', dealerSearchObj)
                            .success(function (res) {

                                if (res.length > 0) {
                                    $scope.filteredDealer = true;
                                    $scope.showCustomersDropdown = true;
                                    $scope.orderFilterDealers = res;
                                } else {
                                    $scope.filteredDealer = false;
                                    $scope.orderFilterDealers = [];
                                }
                            });
                    }
                }
            }
        }

        $scope.selectFilterDealer = function (dealer) {
            $scope.showCustomersDropdown = false;
            $scope.orderSearch.dealer = dealer;
            if(dealer.DealerName)
                $scope.orderSearch.dealerPhone_Name = dealer.DealerName;
            $scope.changeReportView(24);
            $scope.filteredDealer = true;
        }

        $scope.pointingOrderDetails = function (orderId){
            $location.path('/order-details/'+ orderId);
        }



    })
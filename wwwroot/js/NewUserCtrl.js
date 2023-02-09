/**
 * Created by shreyasgombi on 05/03/20.
 */


angular.module('ebs.controller')

    .controller("NewUserCtrl",function ($scope, $location, $http, Settings, $window) {
        console.log("Hello From New Users Controller .... !!!!");

        //.... List View.... (Deprecated)
        $scope.userListPage = false;

        //..... Add Page View .... (Deprecated)
        $scope.userAddPage = true;

        //.... Edit Page View .... (Deprecated)
        $scope.userEditPage = false;

        //.... User Object....
        $scope.user = {};
        $scope.user.role = '';
        $scope.user.status = '';

        $scope.userRole = [];

        //.... Current Sellers... ?
        $scope.sellers = [];
        $scope.sellersMasterList = [];

        //.... Devices.....
        $scope.devices = null;
        $scope.deviceStatus = false;
        $scope.viewLength = 0;
        $scope.newViewBy = 10;
        $scope.allUserLength = 0;
       
        //..... New User Details....
        $scope.seller = {};

        //.... Search Object.... (Deprecated)
        $scope.userSearch = {};
        $scope.userSearch.filter = '';
        $scope.userSearch.filterBy = '';
        $scope.userSearch.rolefilter = 'allUsers';


        $scope.userRoles = {};
        $scope.userRoles.Roles = true;
        $scope.userSelectedRole = true;
        $scope.disableFlag = false;
        $scope.edit = {};
        
        $scope.editSeller = {};
        $scope.sellerNames = [];
        $scope.roleSalesrep = [];
        $scope.locSeller =[];
        $scope.roleAdmin = [];
        $scope.roleStockist = [];
        $scope.roleDealerPortalApp = [];
        $scope.roleManager = [];
        $scope.countryCode = [];
        $scope.default_CountryCode = '+91';
        $scope.filter = {};
        $scope.userBranch='';
        $scope.branchIds = [];

        var viewBy = {};
        viewBy.sellers = 12;
    
        
        $scope.appTabs = [];
        $scope.appTabs = ["New Order","Order History","Catalog","Leave Management","Chat","Inventory","Task Management","New Payment","New Meeting","Payment History","Meeting History","Visit History","Expense History"];
        
        
        Settings.getNav(false, nav => {
            console.log(nav);
            $scope.newNav = nav;
            $scope.nav = nav;
            $scope.userRole = $scope.nav[4].roles;
        });

        const promise = new Promise((resolve, reject) => {
            $http.get("/dash/settings/type/" + 'customer_setup')
                .then(types => {
                resolve(types);
            })
        });

        let userAsCustomer = false;
        promise.then(values => {
            if(values.data)
            userAsCustomer = values.data ? values.data.customer_user_to_master : false;
        });


        $scope.user = [];
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

        
        $scope.warehouseLocation = Settings.getInstanceDetails('inventoryLocation');
        var instanceDetails =  Settings.getInstance();
        $scope.applicationType=instanceDetails.applicationType;
        $scope.coID = instanceDetails.coID;
        $scope.default_CountryCode = instanceDetails.countryCode;
        $scope.dealerAsUserFlag = instanceDetails.dealerAsUserFlag || false;

       
        $scope.userPicture = '';
        $scope.setCountryCode = '';
        $scope.setCountry = '';

        //.... Plant Codes....
        $scope.getPlantCode = function () {
            $http.post("/dash/suppliers/plantcodes")
                .then(res => {
                if(res && res.data){
                console.log("plantcodes",res.data)
                $scope.plant_codes = res.data
            }

        })
        };
        $scope.getPlantCode();

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
        // ]

        //... Start a loader....
        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }
        
        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }


        $('html, body').animate({scrollTop: '0px'}, 0);

        $scope.countryCodeGet = function () {
            $http.get("/country/countryCode")
                .then(res => {
                    if(res && res.data){
                        for(let i in res.data){
                            $scope.countryCode.push(res.data[i])
                        }
                    }else{
                        $scope.countryCode = [
                            {"name":"India","dial_code":"+91","code":"IN","currency":"₹"}, 
                            {"name":"Thailand","dial_code":"+66","code":"TH","currency":"฿"}];
                    }
                    $scope.seller.countryCode = "+91";
                })
        };

        $scope.countryCodeGet();



        /*---check the phone no is valid or not---*/
        $scope.isPhoneNo = function (data) {
            var x = Number.parseInt(data);
            if(data){
                if (data.toString().length >= 10) {
                    if (Number.isInteger(x) && ((x.toString().length >= 10)) && (data.toString().length >= 10))
                        return true;
                    else
                        return false;
                }
                return false;
            }
            return false;
        };

        $scope.refreshSellerNames = function(){
            if(typeof $scope.roleSalesrep == 'object'){
                for(var j = 0; j < $scope.roleSalesrep.length; j++){
                    if($scope.roleSalesrep[j].userStatus == 'Active' || $scope.roleSalesrep[j].role != '')
                        $scope.sellerNames[$scope.roleSalesrep[j].sellerphone] = $scope.roleSalesrep[j].sellername;
                }
            }
            if($scope.roleManager.length){
                for(var j = 0; j < $scope.roleManager.length; j++){
                    if($scope.roleManager[j].userStatus == 'Active' || $scope.roleManager[j].role != '')
                        $scope.sellerNames[$scope.roleManager[j].sellerphone] = $scope.roleManager[j].sellername;
                }
            }
        }

        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                if(salesperson && salesperson.length){
                    $scope.roleSalesrep = [];
                    for(var i = 0; i < salesperson.length; i++){
                        $scope.roleSalesrep.push({sellername : salesperson[i].sellername, sellerphone : salesperson[i].sellerphone});
                    }

                    $scope.salespersonLength = $scope.roleSalesrep.length;
                }
                $http.get("/dash/userManagers")
                    .then(response => {
                        console.log("All Users Managers--------->>>" + response.data.length);
                        if(response.data && response.data.length)
                            $scope.roleManager = response.data;
                        $scope.refreshSellerNames();
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
            })

        
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

        $scope.changeUserButton = function (flag) {
            if (flag == 0) {
                $scope.userListPage = true ;
                $scope.userAddPage = false ;
                $scope.userEditPage = false ;
            }
            else if (flag == 1){
                $scope.userListPage = false ;
                $scope.userAddPage = true ;
                $scope.disableFlag = false;
                $scope.seller = {};
                $scope.seller.countryCode = $scope.default_CountryCode;
                $('#new-user-picture').val('');
                $('#profilePicturePreview').attr('src', '');
            }
            else if (flag == 2){
                $scope.userListPage = false ;
                $scope.userEditPage = true ;
                $('#edit-user-picture').val('');
                $('#editUserPreview').attr('src', '');
            }

            $window.history.back();
        };


        var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";

        var checkForSpecialChar = function(string){
            for(i = 0; i < specialChars.length;i++){
                if(string.indexOf(specialChars[i]) > -1){
                    return true
                }
            }
            return false;
        }



        $scope.getSellerName = function(sellerNo,tag){
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

     

        $scope.lastFunc = function (id) {
            if(id == "add-user") {
                // document.getElementById("addUpdateButton").innerHTML = "Add";
                $scope.createSeller();
                // $('#myModalAddUser').modal({'show':false});
                // alert("entry");

            }
            else if(id == "update-user") {
                // document.getElementById("addUpdateButton").innerHTML = "Update";
                $scope.updateSeller();
            }
        };

        $scope.createSeller = function() {
            $scope.disableFlag = true;

            if($scope.coID == 'GATE'){
                $scope.seller.enableReceive = $scope.seller.enableReceive ? $scope.seller.enableReceive : false ;
            }

            //.... Default the new user as "active";
            $scope.seller.userStatus = "Active";
            $scope.seller.location = $scope.seller.location || '';
            
            console.log($scope.warehouseLocation, $scope.seller.inventoryLocation);
            //.... Selected Branches.....
            if($scope.branchIds.length){
                $scope.seller.branchCode = $scope.branchIds;
            }

            console.log($scope.seller.role);
            
            if(!$scope.seller.managerName && $scope.applicationType == 'OrderJini'){
                if($scope.roleManager.length){
                    for(var i=0 ; i< $scope.roleManager.length;i++){
                        if($scope.roleManager[i].sellerphone == $scope.seller.managerid){
                            $scope.seller.managerName = $scope.roleManager[i].sellername;
                        }
                    }
                }
            }

            if($scope.applicationType == 'Atmosphere') $scope.seller.managerid = Number($scope.seller.managerid);
            
            $scope.seller.date_added = Settings.newDate();

            switch ($scope.seller.role){
                case "Admin" :
                    $scope.seller.admin = true;
                    break;

                case "Salesperson" :
                    $scope.seller.salesrep = true;
                    break;

                case "Stockist" :
                    $scope.seller.stockist = true;
                    break;

                case "Fulfiller" :
                    $scope.seller.fulfiller = true;
                    break;

                case "Manager" :
                    $scope.seller.manager = true;
                    break;
                    
                case "Dealer" :
                    $scope.seller.dealer = true;
                    break;

                case "BranchManager" :
                    $scope.seller.branchManager = true;
                    break;

                case "Portal" :
                    $scope.seller.portal_role = true;
                    break;

                /*
                    Changes for atmosphere ; Author : Aditi!
                */
                default : 
                    for(let i = 0; i < $scope.userRole.length; i++){
                        if($scope.seller.role == $scope.userRole[i].name){
                            $scope.seller.user_role = $scope.userRole[i].role;

                            if($scope.seller.user_role == 'Manager'){
                                $scope.seller.manager = true;
                            }
                        }
                    }
            }
         
            if(!$scope.seller.sellername) {
                $scope.disableFlag = false;
                document.getElementById('submitbutton').disabled = false;
                Settings.alertPopup('Error',"Please enter your name");
                return false;
            }
            else if (!$scope.seller.countryCode && !$scope.isPhoneNo($scope.seller.sellerphone)) {
                $scope.disableFlag = false;
                document.getElementById('submitbutton').disabled = false;
                Settings.alertPopup('Error',"Please enter a valid phone number");
                return false;
            }
            else if (!$scope.seller.sellerphone) {
                $scope.disableFlag = false;
                document.getElementById('submitbutton').disabled = false;
                Settings.alertPopup('Error',"Please enter a phone number");
                return false;
            }
            else if (!$scope.seller.email) {
                $scope.disableFlag = false;
                Settings.alertPopup('Error',"Please enter a mail id");
                return false;
            }

            else if (!$scope.seller.role) {
                $scope.disableFlag = false;
                document.getElementById('submitbutton').disabled = false;
                Settings.alertPopup('Error',"Please select any role");
                return false;
            }
            else {
                $scope.seller.leave = [
                    {
                        "type" : "casual",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "paid",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "compensatory",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "sick",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "maternity",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "paternity",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "emergency",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "marriage",
                        "balance" : 0,
                        "consumed" : 0
                    },
                    {
                        "type" : "bereavement",
                        "balance" : 0,
                        "consumed" : 0
                    }
                ];

                //.... Based on the country code selected, we append the country code if not 
                if(!$scope.seller.countryCode)
                    $scope.seller.countryCode = "+91";
                else if($scope.seller.countryCode != '+91')
                    $scope.seller.sellerphone = $scope.seller.countryCode + $scope.seller.sellerphone;
            
                $scope.seller.email =  $scope.seller.email.toLowerCase();

                $http.get("/dash/user/details/" + $scope.seller.sellerphone + "/"  + $scope.seller.email)
                    .then(user => {
                        if(user.data && user.data.sellerphone){
                            if(user.data.userStatus == "Active"){
                                $scope.disableFlag = false;
                                document.getElementById('submitbutton').disabled = false;
                                Settings.alertPopup('Error',"User with Phone number : " + $scope.seller.sellerphone + " / Email : " + $scope.seller.email + " already exists");
                            }else{
                                document.getElementById('submitbutton').disabled = false;
                                Settings.confirmCustomPopup(
                                    'Confirm',
                                    "User with Phone number : " + $scope.seller.sellerphone + " / Email : " + $scope.seller.email + " already exists and is deactivated.\nDo you want to Re-Activate the account?",
                                    {"confirm" : "Yes", "cancel" : "No"},
                                    (confirm) => {
                                        if(confirm){
                                            $http.get("/dash/user/activate/" + user.data._id)
                                                .then((result) => {
                                                    if(result.data && result.data.status == 'success'){
                                                        Settings.successPopup('Success', 'User '+ $scope.seller.sellername +' was Re-Activated successfully');
                                                        $location.path('/users'); 
                                                    }
                                                })
                                        }
                                    });
                            }
                        }else{
                            $scope.seller.sellerid = $scope.seller.sellerphone;
                            
                            startLoader();

                            console.log($scope.seller);
                            $http.post("/dash/users/create", $scope.seller)
                                .then(async response => {
                                    if(response.data){
                                        if(response.data.status == 'error'){
                                            stopLoader()
                                            $scope.disableFlag = false;
                                            document.getElementById('submitbutton').disabled = false;
                                            Settings.alertPopup('Error',"User with Phone number : " + $scope.seller.sellerphone + " / Email : " + $scope.seller.email + " already exists");
                                        }else{
                                            let dealerRes;
                                            // console.log('userAsCustomer =->',userAsCustomer);
                                            if(userAsCustomer && $scope.seller.role == 'Dealer')
                                                dealerRes = await addUserAsDealer($scope.seller);
                                            // console.log('dealerRes==->> ',dealerRes);

                                            Settings.successPopup('Success','User '+ $scope.seller.sellername +' added successfully as '+ $scope.getRoleName($scope.seller.role));
                                            console.log($scope.userPicture);
        
                                            var image = $scope.userPicture;
                                            if (image.length) {
                                                if ((image[0].size / 1024) <= 200) {
                                                    var reader = new FileReader();
                                                    reader.onloadend = function () {
                                                        var tempObj = {};
                                                        tempObj.image = reader.result;
                                                        tempObj.seller = $scope.seller.sellerphone;
                                                        console.log(tempObj)
                                                        $http.put("/dash/upload/user/image", tempObj)
                                                            .success(function (res) {
                                                                console.log(res);
                                                                if (res) {
                                                                    stopLoader();
                                                                    $window.history.back();
                                                                    console.log("image uploaded successfully");
                                                                } else {
                                                                    stopLoader();
                                                                    $window.history.back();
                                                                    console.log("image uploaded failed");
                                                                    jQuery.noConflict()
                                                                    $('.refresh').css("display", "none");
                                                                }
                                                            })
        
                                                    }
                                                    reader.readAsDataURL(image[0]);
                                                }else{
                                                    stopLoader();
                                                    Settings.fail_toast("ERROR", "Profile Image too large");
                                                    $window.history.back();
                                                }
                                            }else  {
                                                $window.history.back();
                                                stopLoader();
                                            }
                                        }
                                    }
                                });
                        }
                    });
            }
        };

        const addUserAsDealer = (user) => {
            console.log("$scope.user.sellerphone", $scope.user.sellerphone);
            let dealer = {};
            dealer.DealerName = user.sellername;
            dealer.Phone = Number(user.sellerphone);
            dealer.email = user.email;

            if(dealer.DealerName && dealer.Phone){
                $http.get("/dash/get/recentID/dealer")
                    .success(function(res){
                        if(res.Dealercode){
                            $scope.Dealercodetemp = 1001;
                            $scope.Dealercodetemp = res.Dealercode + 1;
                            dealer.Dealercode = res.Dealercode + 1;
                            dealer.countryCode = $scope.default_CountryCode;
                        }else{
                            dealer.Dealercode = 1001;
                            dealer.countryCode = $scope.default_CountryCode;
                        }

                        dealer.DealerName = dealer.DealerName.substr(0,1).toUpperCase() + dealer.DealerName.substr(1);
                        dealer.Seller = '' ;
                        dealer.SellerName = '' ;
                        dealer.class = '';
                        dealer.addedBy = $scope.user.sellerphone ? Number($scope.user.sellerphone) : '' ;
                        dealer.Stockist = null;
                        dealer.STOCKISTS = null;
                        dealer.cloudinaryURL = [];
                        dealer.doccloudinaryURL = [];
                        dealer.customerType = "Lead";
                        dealer.createdDate = Settings.newDate();

                        $http.get("/dash/stores/search/"+dealer.Phone)
                            .success(function(dealerDetails){
                                if(dealerDetails.length){
                                    console.log(dealerDetails)
                                    console.log('dealer-=>> ', dealerDetails[0], dealer)
                                    $http.put("/dash/stores/user/dealer/update/"+dealerDetails[0].Dealercode, dealer).success(function(response){
                                        if(response){
                                            console.log('if response');
                                        }else
                                            console.log("dealer not updated");
                                    })
                                }else {
                                    $http.get("/dash/get/recentID/"+dealer.Dealercode).success(function(result){
                                        $scope.dealercodeUnique = (result != '') ? '' : 'unique';

                                        if($scope.dealercodeUnique == "unique"){
                                            if(dealer.countryCode && user.countryCode != '+91')
                                                dealer.Phone = Number(user.countryCode + dealer.Phone);

                                            var dealercodes = dealer.Dealercode;
                                            if (isNaN(dealercodes)) {
                                                console.log(dealercodes);
                                            } else {
                                                dealer.Dealercode = parseInt(dealer.Dealercode);
                                            }

                                            $http.post("/dash/stores/add/new", dealer)
                                                .success(function (res) {
                                                    console.log('dealer added resp ', res);
                                                })
                                        }
                                        else if(result[0]!= undefined){
                                            if($scope.Dealercodetemp==undefined){
                                                $scope.Dealercodetemp = 1001;
                                            }
                                            Settings.failurePopup('Error',"This Customer code already exists. Please use Customer code : "+$scope.Dealercodetemp);
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
                    })

            }
            else if (dealer.Phone == undefined) {
                Settings.failurePopup('Error','Please enter a valid phone number');
            } else{
                Settings.failurePopup('Error','Please enter all mandatory details');
            }
        }

        $scope.updatePicture  = function(image){
            console.log(image)
            $scope.userPicture = image;
        }

        $scope.enableUsers = function () {

            $scope.seller.salesrep = false;
            $scope.seller.admin = false;
            $scope.seller.stockist = false;
            $scope.seller.fulfiller = false;
            $scope.seller.manager = false;
            $scope.seller.dealer = false;
            $scope.seller.branchManager = false;
            $scope.seller.portal_role = false;
            $scope.seller.userStatus = "Active";
            $scope.seller.showOperations = true;

            var date1 = new Date();
            $scope.seller.last_updated = [date1.getFullYear(),(date1.getMonth()+1).padLeft(), date1.getDate().padLeft() ].join('-') + ' '
                + [date1.getHours().padLeft(), date1.getMinutes().padLeft(), date1.getSeconds().padLeft()].join (':');


            if ($scope.seller.role == "Salesperson") {
                $scope.seller.salesrep = true;
            }
            else if ($scope.seller.role == "Admin") {
                $scope.seller.admin = true;
            }
            else if ($scope.seller.role == "Stockist") {
                $scope.seller.stockist = true;
            }
            else if ($scope.seller.role == "Fulfiller") {
                $scope.seller.fulfiller = true;
            }
            else if ($scope.seller.role == "Manager") {
                $scope.seller.manager = true;
            }
            else if ($scope.seller.role == "Dealer") {
                $scope.seller.dealer = true;
            }else if ($scope.seller.role == "BranchManager") {
                $scope.seller.branchManager = true;
            }
            else if ($scope.seller.role == "Portal") {
                $scope.seller.portal_role = true;
            }
            else{
                /*
                 Changes for atmosphere ; Author : Aditi!
                 */
                for(var i=0;i<$scope.userRole.length;i++){
                    if($scope.seller.role == $scope.userRole[i].name){
                        $scope.seller.user_role = $scope.userRole[i].role;
                        if($scope.seller.user_role == 'Manager'){
                            $scope.seller.manager = true;
                        }
                    }
                }

            }

            Settings.confirmPopup('Confirm',"The user was deleted. Do you want to re-enable?",function (result) {
                if(result){
                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");
                    $scope.seller.sellerid = $scope.seller.sellerphone;
                    $http.put("/dash/seller/enable/"+$scope.sellers1._id, $scope.seller)
                        .success( function(response){
                            $scope.editedsellers = response;
                            Settings.successPopup('Success','User '+$scope.seller.sellername +' enabled successfully as '+ $scope.seller.role);
                            $scope.refreshTransactions(35);
                            jQuery.noConflict()
                            setTimeout(function(){
                                $('.refresh').css("display", "none");
                            }, 1000);

                            // $scope.all();
                            $scope.refreshSellerNames();
                            // jQuery.noConflict();
                            // $('#myModalAddUser').modal('hide');
                            $scope.userAddPage = false;
                        });
                }
                else {
                    console.log("Deleted re addition cancelled")
                }
            });
        };

        $scope.assignValues = function (id) {

            $scope.managerSelectedList = [];
            $scope.editSeller = {};

            $http.get("/dash/seller/details/"+id)
                .success( function(response) {
                    if(response){
                        if(response.countryCode){
                            var sellerphoneNo = (""+response.sellerphone).split("");
                            if(response.countryCode == '+91' ){
                                presentNumber = response.sellerphone;
                                if(sellerphoneNo.length > 10){
                                    // var sellerphoneNo = (""+response.sellerphone).split("");
                                    var phoneNo = sellerphoneNo.splice(response.countryCode.length -1);
                                    response.sellerphone = phoneNo.join("");
                                    // console.log(response);
                                }

                            }else if(response.countryCode == '91'){
                                if(sellerphoneNo.length > 10){
                                    // var sellerphoneNo = (""+response.sellerphone).split("");
                                    var phoneNo = sellerphoneNo.splice(response.countryCode.length);
                                    response.sellerphone = phoneNo.join("");

                                    console.log(response);
                                }
                                response.countryCode = '+'+response.countryCode;

                            }else{
                                presentNumber = response.sellerphone;
                                // var sellerphoneNo = (""+response.sellerphone).split("");
                                if(checkForSpecialChar(response.countryCode)){
                                    var phoneNo = sellerphoneNo.splice(response.countryCode.length -1);
                                    response.sellerphone = phoneNo.join("");
                                } else {
                                    var phoneNo = sellerphoneNo.splice(response.countryCode.length);
                                    response.sellerphone = phoneNo.join("");
                                    response.countryCode = '+'+response.countryCode;
                                }
                            }

                        }else{
                            presentNumber = response.sellerphone;
                            response.countryCode = $scope.default_CountryCode;
                        }
                        if(response.cloudinaryURL){
                            $('#editUserPreview').attr('src', response.cloudinaryURL).fadeIn('slow');
                        }
                        $scope.managerSelectedList = response.managerid;
                        $scope.seller = response;

                        // console.log(presentNumber)
                        $scope.editSeller = response;
                        $scope.edit.user = true ;
                        if($scope.seller.Manager_Name){
                            $scope.ATMSmanagers.tempManager = $scope.seller.Manager_Name;
                        }
                        if($scope.seller.Assistant_Manager_Name){
                            $scope.ATMSmanagers.tempManager1 = $scope.seller.Assistant_Manager_Name;
                        }
                        if($scope.seller.Supervisor_Name){
                            $scope.ATMSmanagers.tempManager2 = $scope.seller.Supervisor_Name;
                        }



                    }
                });
        };

        $scope.seller.plantCode = [];

        $scope.addPlantCodeTagged = function() {
            let elements = document.getElementsByClassName('plantcode');

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var strSel = element.options[element.selectedIndex].text;
                $scope.seller.plantCode.push(strSel);
            }
            var sortDupPlantCode = $scope.seller.plantCode;
            var allplantCode = [];
            $.each(sortDupPlantCode, function(i, strSel){
                if($.inArray(strSel, allplantCode) === -1)  allplantCode.push(strSel);
            });
            $scope.seller.plantCode = allplantCode;
        }


        $scope.removeSelectedTag = function(tab,index){
            console.log("remove tab",tab,index)
            if(tab == 'plantcode')
                $scope.seller.plantCode.splice(index,1);

        }
    });
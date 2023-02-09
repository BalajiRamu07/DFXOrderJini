

angular.module('ebs.controller')

.controller("EditUserCtrl",function ($scope, $routeParams, $location, $http, Settings, $window) {
    console.log("Hello From Edit Users Controller .... !!!!");
    let id = $routeParams.id;

    $scope.user = {};
    $scope.user_info = {};
    $scope.nav = {};

    $scope.countryCode = [];

    let current_status = '';

    //... Atmosphere details ....
    $scope.allDesignations = [];
    $scope.allDepartments = [];
    $scope.userRole = [];
    $scope.roleManager = [];
    $scope.sellerNames = [];

    //... Atmosphere branches....
    $scope.branches = [];

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

    Settings.getUserInfo(user_info => {
        $scope.user_info = user_info;
    });

    Settings.getNav(false, nav => {
        $scope.nav = nav;
        $scope.userRole = $scope.nav[4].roles;
    });

    $scope.applicationType = Settings.getInstanceDetails('applicationType');
    $scope.warehouseLocation = Settings.getInstanceDetails('inventoryLocation');
    
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
            })
    };

    $scope.countryCodeGet();

    //... Reload User details....
    const loadUserDetails = id => {
        startLoader();
        $http.get("/dash/user/detail/" + id)
            .then(user_details => {
                console.log(user_details);
                stopLoader();
                if(user_details && user_details.data){
                    $scope.user = user_details.data;
                    if(!$scope.user.countryCode)
                        $scope.user.countryCode = "+91";
                    current_status = user_details.data.userStatus;
                }else
                    $location.path('/');
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

    $scope.goBackTo = () => $window.history.back();

    $scope.getRoleName = function(role){
        let temp = '';
        if(role && $scope.userRole){
            for (let i = 0 ; i < $scope.userRole.length; i++){
                if($scope.userRole[i].role.toUpperCase() == role.toUpperCase()){
                    temp = $scope.userRole[i].name;
                    break;
                }
            }
        }
        return temp;
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

            $http.get("/dash/users/managers")
                .then(response => {
                    console.log("Managers ---> " + response.data.length);
                    $scope.roleManager = [];
                    for(let i = 0; i < response.data.length; i++)
                        if(response.data[i]._id != $scope.user._id)    
                            $scope.roleManager.push(response.data[i]);
                    $scope.refreshSellerNames();
                });

            $http.post("/dash/allBranches")
                .then(branches => {
                    console.log("Branches ---> "+branches.data.length);
                    $scope.branches = branches.data;
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

   

    const uploadUserImage = image => {
        if (image.length) {
            if ((image[0].size / 1024) <= 200) {
                let reader = new FileReader();
                reader.onloadend = () => {
                    let tempObj = {};
                    tempObj.image = reader.result;
                    tempObj.seller = $scope.user.sellerphone;
                    
                    $http.put("/dash/upload/user/image", tempObj)
                        .then(res => {
                            if(res.data){
                                Settings.success_toast("Success", "User Profile Image Uploaded!");
                            }else Settings.fail_toast("Error", "Error in uploading Profile Image");
                        })
                }
                reader.readAsDataURL(image[0]);
            }
        }
    }

    $scope.updateUser = () => {
        if($scope.user.role){
            switch ($scope.user.role){
                case "Admin" : {
                    $scope.user.admin = true;
                    $scope.user.salesrep = false;
                    $scope.user.manager = false;
                    $scope.user.stockist = false;
                    $scope.user.fulfiller = false;
                    $scope.user.dealer = false;
                    $scope.user.portal = false;
                    break;
                }
                case "Dealer" : {
                    $scope.user.admin = false;
                    $scope.user.salesrep = false;
                    $scope.user.manager = false;
                    $scope.user.stockist = false;
                    $scope.user.fulfiller = false;
                    $scope.user.dealer = true;
                    $scope.user.portal = false;
                    break;
                }
                case "Stockist" : {
                    $scope.user.admin = false;
                    $scope.user.salesrep = false;
                    $scope.user.manager = false;
                    $scope.user.stockist = true;
                    $scope.user.fulfiller = false;
                    $scope.user.dealer = false;
                    $scope.user.portal = false;
                    break;
                }
                case "Salesperson" : {
                    $scope.user.admin = false;
                    $scope.user.salesrep = true;
                    $scope.user.manager = false;
                    $scope.user.stockist = false;
                    $scope.user.fulfiller = false;
                    $scope.user.dealer = false;
                    $scope.user.portal = false;
                    break;
                }
                case "Manager" : {
                    $scope.user.admin = false;
                    $scope.user.salesrep = false;
                    $scope.user.manager = true;
                    $scope.user.stockist = false;
                    $scope.user.fulfiller = false;
                    $scope.user.dealer = false;
                    $scope.user.portal = false;
                    break;
                }
                case "Fulfiller" : {
                    $scope.user.admin = false;
                    $scope.user.salesrep = false;
                    $scope.user.manager = false;
                    $scope.user.stockist = false;
                    $scope.user.fulfiller = true;
                    $scope.user.dealer = false;
                    $scope.user.portal = false;
                    break;
                }
                case "Portal Access" : {
                    $scope.user.admin = false;
                    $scope.user.salesrep = false;
                    $scope.user.manager = false;
                    $scope.user.stockist = false;
                    $scope.user.fulfiller = false;
                    $scope.user.dealer = false;
                    $scope.user.portal = true;
                    break;
                }
            }
        }

        $http.put("/dash/user/update/" + (current_status == 'Active' ? 'update' : 'activate') + "/" + $scope.user._id, 
            $scope.user)
                .then(result => {
                    if(result.data && result.data.status == 'success'){
                        if(current_status == 'Deleted')
                            Settings.success_toast("Success", "User Re-Activation Successful");
                        else Settings.success_toast("Success", "User Details Updated Successful");

                        $window.history.back();
                    }else{
                        Settings.fail_toast("Error", "Error activating the user");
                    }

                    let image = $scope.userPicture;
                    if (image && image.length) {
                        uploadUserImage(image);
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

    $scope.removeBranch = index => $scope.branchIds.splice(index, 1);

    $scope.getAtmsDropdowns = function(){ 
        $http.get('/dash/allUsers')
            .success(function (response) {
                console.log("ALL users count--------->>>"+ response.length)
                $scope.allGoalUsers = response
            });

        $http.get("/dash/userRoles")
            .success(function (response) {
                console.log("All Users Roles --------->>>" + response.length);
                $scope.userRole = response;

            });

        $http.get("/dash/userDesignations")
            .success(function (response) {
                console.log("All Users Designation --------->>>" + response.length);
                $scope.allDesignations = response;
            });

        $http.get("/dash/userDepartments")
            .success(function(response){
                console.log("All departments --> " + response.length);
                if(response.length) $scope.allDepartments = response;
            });

            if(!$scope.roleManager.length){
                var body = {};
                body.text = '';
                body.role = "Manager";
                // console.log($scope.user.sellerObject.Resort);
                if($scope.user){
                    if($scope.user.sellerObject){
                        if($scope.user.sellerObject.Resort){
                            body.resort = $scope.user.sellerObject.Resort
                        }
                        else{
                            body.resort = ''
                        }
                    }
                    else{
                        body.resort = ''
                    }
                }
                else{
                    body.resort = ''
                }

                $http.post('/dash/getSellers/roleType',body)
                    .success(function(response){
                        console.log("all managers"+response.length);
                        $scope.roleManager = response;
                    });
            }
    }

    if($scope.applicationType=='Atmosphere'){
        $scope.getAtmsDropdowns();
    }

    if(id) loadUserDetails(id);


    
    $scope.addPlantCodeForFactory = function(role){
        if($scope.user.role == 'Factory' && role == 'Factory') {
            $scope.user.plant_code =  $scope.user.plant_code ? $scope.user.plant_code : [];
        }
    }

    $scope.addPlantCodeTagged = function() {
        if($scope.user.role == 'Factory') {
            let elements = document.getElementsByClassName('plantcode');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var strSel = element.options[element.selectedIndex].text;
                $scope.user.plant_code.push(strSel);
            }
            var sortDupPlantCode = $scope.user.plant_code;
            var allplantCode = [];
            $.each(sortDupPlantCode, function (i, strSel) {
                if ($.inArray(strSel, allplantCode) === -1) allplantCode.push(strSel);
            });
            $scope.user.plant_code = allplantCode;
        }
    }
    $scope.removeSelectedTag = function(tab,index){
        console.log("remove tab",tab,index)
        if(tab == 'plantcode')
            $scope.user.plant_code.splice(index,1);

    }

})
angular.module('ebs.controller')

    .controller("NewRequestCtrl",function ($scope, $filter, $http,Settings, $modal, $window, toastr, $interval,$sce,$mdDialog) {
        console.log("Hello From  NewRequestCtrl Controller .... !!!!");
        $scope.assetItems = {}
        $scope.assetItems.Product = '';
        $scope.assetItems.Qty = '';
        $scope.assetItems.MRP = '';
        $scope.assetItems.value = '';
        $scope.assetItems.comments = '';
        $scope.assetItems.unitOfMeasure = '';


        $scope.toaddress={};
        $scope.toaddress.searchText='';
        $scope.fromaddress={};
        $scope.fromaddress.searchText='';
        $scope.fromaddress.branchCodes=[];
        $scope.searchedToAddress=[];
        $scope.searchedFromAddress=[];
        $scope.allBranches=[];
        $scope.allCustomers=[];
        // $scope.fromaddress='';



        $scope.newRequest={};
        $scope.newRequest.branchName='';
        $scope.newRequest.branchAddress='';
        $scope.newRequest.customerName='';
        $scope.newRequest.customerAddress='';
        $scope.newRequest.customerCity='';
        $scope.newRequest.branchCity='';
        $scope.newRequest.comments='';
        $scope.newRequest.vehicleNumber='';
        $scope.newRequest.courierTrackingNumber='';


        $scope.newRequest.type='';
        $scope.newRequest.requestID='';
        $scope.newRequest.items=[];
        $scope.itemsArray=[];
        $scope.user={};
        $scope.branchCodes=[];


        // console.log($scope.assetItems);
        Settings.getUserInfo(function(user_details){
            $scope.user = user_details;

            // $scope.branchCodes.push();
            $scope.branchCodes=$scope.user.sellerObject.branchCode;
            if($scope.branchCodes && $scope.user.role!='Admin'){
                $scope.fromaddress.branchCodes=$scope.branchCodes;
                console.log($scope.fromaddress);

            }
            console.log($scope.branchCodes);
            console.log($scope.user);


            // console.log($scope.newRequest);
            // console.log($scope.user);
        });
        // Settings.getInstance(function(instance_details){
        //
        //     console.log(instance_details);
        // });

        //Get All branches

        $scope.getAllBranches=function(){
            if($scope.user.role!='Admin' && $scope.branchCodes.length ){
                var body={};
                body.branchCodes=$scope.branchCodes;
                console.log(body);
                $http.post("/dash/assets/allbranches/branchCode",body)
                    .success(function (res) {
                        console.log(res);
                        if(res){
                            $scope.searchedFromAddress=res;
                            $scope.allBranches=res;
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
            else{
                console.log("else");
                $http.get("/dash/assets/allbranches")
                    .success(function (res) {
                        if(res){
                            $scope.searchedFromAddress=res;
                            $scope.allBranches=res;
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
        $scope.getAllBranches();

        $scope.getAllCustomers=function(){
            $http.get("/dash/assets/allCustomers")
                .success(function (res) {
                    // console.log(res);
                    if(res){
                        $scope.searchedToAddress=res;
                        $scope.allCustomers=res;
                    }
                }).error(function(error, status){
                // console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
        }
        $scope.getAllCustomers();

        // Add items to cart
        $scope.addItems = function() {

            var tempItems=$scope.assetItems;
            $scope.assetItems.comments= $scope.assetItems.comments ? $scope.assetItems.comments : '';
            $scope.assetItems.unitOfMeasure= $scope.assetItems.unitOfMeasure ? $scope.assetItems.unitOfMeasure : ''

            if(tempItems){
                if(!$scope.itemsArray.length){
                    $http.get("/dash/get/recentID/item")
                        .success(function (res) {
                            // console.log(res);
                            if(res.itemCode){
                                tempItems.itemCode = res.itemCode + 1;
                            }else{
                                tempItems.itemCode = 1001;
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
                else{
                        for(let i=0;i<$scope.itemsArray.length;i++){
                            console.log($scope.itemsArray[i]);
                            tempItems.itemCode = $scope.itemsArray[i].itemCode+1;

                        }

                }

                tempItems.Manufacturer= 'DEFAULT';
                tempItems.subCategory= 'DEFAULT';
                tempItems.subSubCategory= 'DEFAULT';
                tempItems.status='Open';
                tempItems.isReturned=false;
                // tempItems.comments = $scope.assetItems.comments ? $scope.assetItems.comments : 'N/A'
                $scope.itemsArray.push(tempItems);
                $scope.assetItems={};

            }


        }
        // Delete items from cart
        $scope.removeItems=function(index){
    $scope.itemsArray.splice(index, 1);
        }

        $scope.getStoreAddress=function(){
            // console.log( $scope.toaddress.searchText);
            // console.log($scope.toaddress);
            if($scope.toaddress.searchText.length>=3) {
                $scope.searchedToAddress=[];

                $http.post('/dash/search/asset/Dealer', $scope.toaddress)
                    .success(function (res) {
                        // console.log(res);
                        if (res.length) {
                            $scope.searchedToAddress = res;
                            // console.log($scope.searchedToAddress);
                        }

                        // $http.get("/dash/stores/all/stockist").success(function(response){
                        //
                        // $scope.renderStoreMap(res);
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
            else if($scope.toaddress.searchText==''){
                $scope.searchedToAddress=$scope.allCustomers;

            }

        }

        $scope.getFromAddress=function(){

            $scope.searchedFromAddress=[];
            if($scope.fromaddress.searchText.length>=3) {
                console.log($scope.fromaddress);
                $http.post('/dash/search/asset/branch', $scope.fromaddress)
                    .success(function (res) {
                        // console.log(res);
                        if (res.length) {
                            $scope.searchedFromAddress = res;
                            // console.log($scope.searchedFromAddress);
                        }

                        // $http.get("/dash/stores/all/stockist").success(function(response){
                        //
                        // $scope.renderStoreMap(res);
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
           else if($scope.fromaddress.searchText==''){
                $scope.searchedFromAddress=$scope.allBranches;

            }

        }
        $scope.setDealerAddress=function(data){
            // console.log(data);
            // console.log("Data.....");
            // console.log($scope.newRequest.customerName);
            $scope.newRequest.customerAddress=data.Address;
            $scope.newRequest.customerCity=data.City;
            $scope.newRequest.customerId=data.Dealercode;
            $scope.newRequest.customerGst=data.GST ? data.GST : '' ;

        }
        $scope.setBranchAddress=function(data){
            // console.log(data);
            // console.log("Data.....");
            // console.log($scope.newRequest.branchName);
            $scope.newRequest.branchAddress=data.address;
            $scope.newRequest.branchCity=data.city;
            $scope.newRequest.branchId=data.branchCode;
            $scope.newRequest.branchGst=data.gst ? data.gst : '';
        }
        $scope.generateRequestID=function(){
            $http.get("/dash/get/asset/recentID")
                .success(function (res) {
                    // console.log(res);
                    if(res.requestCode){
                        if($scope.newRequest.type=='Returnable'){
                            $scope.newRequest.requestCode=res.requestCode+1;
                            $scope.newRequest.requestID='RTN'+$scope.newRequest.requestCode;


                        }
                        else{
                            $scope.newRequest.requestCode=res.requestCode+1;
                            $scope.newRequest.requestID='NRTN'+$scope.newRequest.requestCode;



                        }
                        // $scope.newRequest.requestID = res.requestID + 1;
                    }else{
                        if($scope.newRequest.type=='Returnable'){
                            // console.log("inside if");
                            $scope.newRequest.requestID='RTN1001';
                            $scope.newRequest.requestCode=1001;
                        }
                        else{
                            $scope.newRequest.requestID='NRTN1001';
                            $scope.newRequest.requestCode=1001;
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

        $scope.submitRequest=function (){
            console.log( $scope.newRequest);
            $scope.newRequest.status='Open';
            $scope.newRequest.created_date=new Date();
            $scope.newRequest.raisedBy=$scope.user.username ? $scope.user.username : 'Admin';
            $scope.newRequest.sellerPhone=$scope.user.sellerphone?$scope.user.sellerphone:0;
            $scope.newRequest.departmentApprovedBy=''
            $scope.newRequest.factoryApprovedBy=''
            if($scope.itemsArray.length){
                $scope.newRequest.items=$scope.itemsArray;
                $http.post('/dash/asset/newRequest', $scope.newRequest)
                    .success(function (res) {
                        // console.log("Response....");
                        // console.log(res);
                        if(res){

                            $http.post('/dash/asset/addItems', $scope.newRequest.items)
                                .success(function (res) {
                                    // console.log("Response....");
                                    // console.log(res);
                                    if(res){
                                        $scope.assetItems = {};
                                        $scope.newRequest={};
                                        $scope.toaddress={};
                                        $scope.fromaddress={};
                                        $scope.itemsArray=[];
                                        $scope.searchedToAddress=$scope.allCustomers;
                                        $scope.searchedFromAddress=$scope.allBranches;
                                        Settings.successPopup('Success', 'Request successfully submitted.');

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
        $scope.getValue=function(){

            $scope.assetItems.value='';
            if($scope.assetItems.MRP>0 &&  $scope.assetItems.Qty>0){
                $scope.assetItems.value=$scope.assetItems.MRP*$scope.assetItems.Qty;
            }



        }





        });

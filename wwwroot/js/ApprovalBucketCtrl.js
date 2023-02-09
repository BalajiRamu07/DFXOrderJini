angular.module('ebs.controller')



    .controller("ApprovalBucketCtrl",function ($scope, $filter, $http,Settings, $modal, $window, toastr, $interval,$sce,$mdDialog) {
        console.log("Hello From  ApprovalBucket Controller .... !!!!");
        $scope.allRequests=[];
        $scope.allStatus=[];
        $scope.requestDetails={};
        $scope.approvedBy='';
        $scope.itemStatus='';
        $scope.selectStatus='';
        $scope.requestStatus='';
        $scope.openRequests=[];
        $scope.searchRequest='';
        $scope.allRequestMaster=[];
        $scope.requestSearch = {};
        $scope.userRole='';
        $scope.adminRole='';



        var viewBy = {};
        viewBy.items = 10;
        var initialViewBy = 60;
        $scope.newViewBy = 10;
        $scope.viewLength = 0;
        var requestSearchObj = {};
        var requestSearchBy = ['requestID', 'customerName', 'branchName', 'raisedBy','type'];

        requestSearchObj.viewLength = 0;
        requestSearchObj.viewBy = initialViewBy;
        requestSearchObj.searchBy = [];
        requestSearchObj.searchFor = '';
        $scope.request_count=0;
        $scope.requestSearch.filter = '';
        Settings.getUserInfo(function(user_details){
            console.log("inside if");
            console.log(user_details);
            if(user_details.role=='Admin'){
                $scope.adminRole=user_details.role;
            }
            $scope.approvedBy=user_details.username ? user_details.username : 'Admin';
            $scope.userRole=user_details.sellerObject.levelOfManager;
            // console.log($scope.approvedBy);
        });

        $scope.getAllRequest=function(){
            // console.log(requestSearchObj);
            $http.post("/dash/assets/searchRequests",requestSearchObj)
                .success(function (res) {
                    console.log(res);
                    if(res){
                        $scope.allRequests=res;
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

        $scope.getMasterRequest=function(){
            $http.get("/dash/assets/allRequests/data")
                .success(function (res) {
                    console.log(res);
                    $scope.allRequestMaster=res;
                    if( $scope.allRequestMaster.length){
                        $scope.getAllRequestCount();
                    }
                    // if(res){
                    //     $scope.openRequests=res;
                    //     // console.log("Open Requests");
                    //     // console.log($scope.openRequests);
                    // }
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
        $scope.getMasterRequest();
        $scope.getAllRequest();
        $scope.getAllRequestCount=function(){
            console.log("Inside count");
                $http.get("/dash/assets/allRequests/count")
                    .success(function (res) {
                        console.log(res);
                        // $scope.request_count=res;
                        $scope.transactionCount(res);

                        // if(res){
                        //     $scope.openRequests=res;
                        //     // console.log("Open Requests");
                        //     // console.log($scope.openRequests);
                        // }
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

        $scope.getOpenRequest=function(){
            $http.get("/dash/assets/openRequests")
                .success(function (res) {
                    // console.log(res);
                    if(res){
                        $scope.openRequests=res;
                        // console.log("Open Requests");
                        // console.log($scope.openRequests);
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
        $scope.getOpenRequest();
        $scope.getAllStatus=function(){
            $http.get("/dash/assets/allRequest/status")
                .success(function (res) {
                    // console.log(res);
                    if(res){
                        $scope.allStatus=res.obj;
                        console.log($scope.allStatus);

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
        $scope.getAllStatus();

        $scope.viewRequest=function (request){
            $scope.requestDetails=request;
            // console.log($scope.requestDetails);
            // console.log("View request...");
        }
        // $scope.updateRequestStatus=function(reqStatus,data){
        //     // console.log(reqStatus);
        //     // console.log(data);
        //     var body={};
        //     if(reqStatus && data){
        //         body.status=reqStatus.status;
        //         body.reqId=data._id;
        //         body.updatedBy=$scope.approvedBy;
        //         body.updatedDate=new Date();
        //         console.log(body);
        //         if(body){
        //             $http.put("/dash/assets/allRequest/status/update", body)
        //                 .success(function (response) {
        //                     // console.log("Update -->" + response);
        //                     console.log(response);
        //                     if(response=='success'){
        //                         Settings.success_toast('Status Updated successfully');
        //                         // $scope.requestDetails.items.status=body.status;
        //                         $scope.getAllRequest();
        //
        //                     }
        //
        //                     //$scope.all();
        //
        //                     // Settings.success_toast($scope.getfulfillersName(fulfiller)+ " assigned to " + order.orderId);
        //                 })
        //                 .error(function(error, status){
        //                     console.log(error, status);
        //                     if(status >= 400 && status < 404)
        //                         $window.location.href = '/404';
        //                     else if(status >= 500)
        //                         $window.location.href = '/500';
        //                     else
        //                         $window.location.href = '/404';
        //                 });
        //         }
        //     }
        //
        // }
        $scope.approveRequest=function (request){
            console.log("approve request...");
            console.log(request);
            var body={};

            if($scope.userRole!='department' && $scope.adminRole!='Admin'){

                    body.factoryApprovedBy=$scope.approvedBy;
                    body.factoryApprovedDate=new Date();
                    body.status='Approved';

            }
            else if($scope.userRole!='department' && $scope.adminRole=='Admin'){
                body.factoryApprovedBy='Admin';
                body.departmentApprovedBy='Admin';
                body.departmentApprovedDate=new Date();
                body.factoryApprovedDate=new Date();
                body.adminApproval=true;
                body.status='Approved';

            }
            else{
                body.departmentApprovedBy=$scope.approvedBy;
                body.departmentApprovedDate=new Date();
                body.status='Open';
            }
            body.reqId=request._id;
            body.updatedBy=$scope.approvedBy;
            body.updatedDate=new Date();
            console.log(body);
            if(body){
                $http.put("/dash/assets/allRequest/status/update", body)
                    .success(function (response) {
                        // console.log("Update -->" + response);
                        console.log(response);
                        if(response=='success'){
                         Settings.successPopup('Success', 'Status Updated successfully');

//                          Settings.success_toast("SUCCESS",'Status Updated successfully');

                            // $scope.requestDetails.items.status=body.status;
                            $scope.getAllRequestCount();
                            $scope.getOpenRequest();
                            $scope.getAllRequest();
                            $scope.getMasterRequest();

                        }

                        //$scope.all();

                        // Settings.success_toast($scope.getfulfillersName(fulfiller)+ " assigned to " + order.orderId);
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
        $scope.rejectRequest=function (request){
            // console.log("reject request...");
            var body={};
            body.status='Rejected';
            body.reqId=request._id;
            body.updatedBy=$scope.approvedBy;
            body.rejectedBy=$scope.approvedBy;
            body.rejectedDate=new Date();
            body.updatedDate=new Date();
            // console.log(body);
            if(body){
                $http.put("/dash/assets/allRequest/status/update", body)
                    .success(function (response) {
                        // console.log("Update -->" + response);
                        console.log(response);
                        if(response=='success'){
//                            Settings.success_toast('Status Updated successfully');
                             Settings.successPopup('Success', 'Status Updated successfully');

                            $scope.getOpenRequest();
                            $scope.getAllRequest();
                            $scope.getAllRequestCount();
                            $scope.getMasterRequest();


                        }

                        //$scope.all();

                        // Settings.success_toast($scope.getfulfillersName(fulfiller)+ " assigned to " + order.orderId);
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
        $scope.updateItemStatus=function (data,items){
            var body={}
            body.status=data.status;
            body.requestId=$scope.requestDetails.requestID;
            body.itemCode=items.itemCode;
            body.updatedBy= $scope.approvedBy;
            body.updatedDate=new Date();
            if(body){
                $http.put("/dash/assets/allRequest/itemStatus/update", body)
                    .success(function (response) {
                        // console.log("Update -->" + response);
                        console.log(response);
                        if(response=='success'){
                         Settings.successPopup('Success', 'Status Updated successfully');

                            $scope.getUpdatedItems();
                            $scope.getAllRequest();

                        }

                        //$scope.all();

                        // Settings.success_toast($scope.getfulfillersName(fulfiller)+ " assigned to " + order.orderId);
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
            // body.itemCode


        }

        $scope.getUpdatedItems=function(){
            $http.get("/dash/assets/request/"+$scope.requestDetails.requestID)
                .success(function (response) {
                    // console.log("Update -->" + response);
                    $scope.requestDetails=response[0];


                    //$scope.all();

                    // Settings.success_toast($scope.getfulfillersName(fulfiller)+ " assigned to " + order.orderId);
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
        $scope.searchRequestData=function(){
            // console.log($scope.requestSearch.filter);
            if($scope.requestSearch.filter.length>=3){
                requestSearchObj.viewLength = 0;
                requestSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.items;
                $scope.allRequests = [];
                requestSearchObj.searchFor = $scope.requestSearch.filter;
                requestSearchObj.searchBy = requestSearchBy;

                $http.post("/dash/assets/searchRequests",requestSearchObj)
                    .success(function (res) {
                        // console.log(res);
                        if(res){
                            $scope.allRequests=res;
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
                $http.post("/dash/assets/searchRequests/count",requestSearchObj)
                    .success(function (res) {
                        console.log(res);
                        if(res){
                            $scope.transactionCount(res);
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
            else if($scope.requestSearch.filter.length==0){
                $scope.allRequests=$scope.allRequestMaster;
                $http.get("/dash/assets/allRequests/count")
                    .success(function (res) {
                        console.log(res);
                        $scope.transactionCount(res);
                        // $scope.request_count=res;
                        // if(res){
                        //     $scope.openRequests=res;
                        //     // console.log("Open Requests");
                        //     // console.log($scope.openRequests);
                        // }
                    }).error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
                // $scope.getAllRequestCount();
            }

        }
        var a = 0;
        $scope.navPage = function(tab, direction){
            // console.log("nav page");
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;
            var allItems = $scope.allRequestMaster;
            var allItemsLength = $scope.allRequestMaster.length;
            // console.log(viewLength);
            // console.log(viewBy);
            // $scope.items = allItems;
            // console.log($scope.viewLength)
            // console.log($scope.newViewBy)
            // console.log(allItems)
            if(direction){
                $scope.cBack = "incomplete"
                // console.log("NEXT");

                if(viewLength + viewBy >= allItems.length){
                    // console.log("idhar")
                    if(viewLength + viewBy < allItemsLength){
                        // console.log("inside if");
                        // $scope.displayloader = true
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        requestSearchObj.viewLength = viewLength;
                        requestSearchObj.viewBy = initialViewBy;
                        requestSearchObj.searchFor = '';
                        requestSearchObj.searchBy = '';
                        $http.post("/dash/assets/searchRequests",requestSearchObj)
                            .success(function (res) {
                                console.log(res);
                                if(res){
                                    $scope.allRequests=res;
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

                        // jQuery.noConflict();
                        // $('.refresh').css("display", "inline");


                        // jQuery.noConflict();
                        // $('.refresh').css("display", "none");


                    }
                    else{
                        //console.log("Out of data")
                        if(viewLength + viewBy > $scope.request_count){
                            a = viewLength + viewBy - $scope.request_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > allItemsLength){
                        a = viewLength + viewBy - allItemsLength;
                        viewBy -= a;
                    }
                    $scope.newViewBy = viewBy;
                    $scope.viewLength = viewLength;
                    console.log($scope.newViewBy)
                    console.log($scope.viewLength)
                }
            }
            else{
                // console.log("BACK");
                if(viewLength < viewBy){
                    //console.log("NO DATA")
                }
                else{
                    // console.log("asasasas")
                    if(viewLength + viewBy >= $scope.request_count){
                        // console.log("kjkjkkjkj")
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }
        $scope.transactionCount = function(response, tab){
            console.log(response);
            if(response){
                if(response > viewBy.items){
                    $scope.request_count = response;
                    $scope.viewLength = 0;
                    $scope.newViewBy = viewBy.items;
                }
                else if(response <= viewBy.items){
                    $scope.request_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.allRequests = [];
                    $scope.newViewBy = 1;
                    $scope.request_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.allRequests = [];
                $scope.newViewBy = 1;
                $scope.request_count = 0;
                $scope.viewLength = -1;
            }
        };



    });

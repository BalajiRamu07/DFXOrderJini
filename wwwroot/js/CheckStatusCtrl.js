angular.module('ebs.controller')

    .controller("CheckStatusCtrl",function ($scope, $filter, $http,Settings, $modal, $window, toastr, $interval,$sce,$mdDialog) {
        console.log("Hello From  CheckStatusCtrl Controller .... !!!!");
        $scope.request = [];
        $scope.requestItems = [];
        $scope.allStatus = [];
        $scope.btnValue = '';
        $scope.newQTY = 0;
        $scope.requestID = ''
        $scope.returnDetails = ''
        $scope.receivedDetails = ''
        $scope.dataFound = true;
        $scope.awaitingApproval=false;
        $scope.user={};
        $scope.instanceDetails={};
         $scope.instanceDetails =  Settings.getInstance();
         $scope.qtyTotal=0;
         $scope.amountTotal=0;
        console.log($scope.instanceDetails);

        Settings.getUserInfo(function(user_details) {
            $scope.user = user_details;
            console.log("User details");
            console.log($scope.user);
        });


        $scope.getRequest=function(requestID){
            console.log("get request using request id"+requestID)
            console.log(requestID.length);
            $scope.requestID = requestID;
            if(requestID.length == 7 || requestID.length == 8){

                $http.get("/dash/assets/request/"+requestID)
                    .success(function (res) {
                        console.log(res);
                        if(res.length){
                            if(res[0].status=='Approved'){
                                $scope.request = res[0];
                                $scope.dataFound = false;
                                $scope.awaitingApproval=false;
                                $scope.qtyTotal=0;
                                $scope.amountTotal=0;

                                $scope.requestItems = res[0].items
                                // console.log($scope.requestItems);
                                if($scope.requestItems.length){
                                    for(let i=0;i<$scope.requestItems.length;i++){
                                        $scope.qtyTotal+=$scope.requestItems[i].Qty;
                                        $scope.amountTotal+=$scope.requestItems[i].value;
                                    }
                                    // console.log($scope.qtyTotal);
                                    // console.log($scope.amountTotal);


                                }
                                $scope.showBtn();

                            }
                            else{
                                $scope.request = [];
                                $scope.dataFound = true;
                                $scope.awaitingApproval=true;
                                $scope.requestItems = [];
                            }

                        }
                        else{
                            $scope.request = [];
                            $scope.dataFound = true;
                            $scope.awaitingApproval=false;

                            $scope.requestItems = [];
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


        $scope.getAllStatus=function(){
            $http.get("/dash/assets/allRequest/status")
                .success(function (res) {
                    console.log(res);
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

        $scope.changeQTY = function (request,value) {
            console.log("return receive request...");
            console.log(request);
            console.log(value)
            $scope.btnValue = value;
            $scope.selectedItem = request;
            $scope.totalQTY = request.Qty;
            $scope.newQTY = 0;

            console.log(" Total Received Qty -" + $scope.selectedItem.totreceivedQty)
            console.log(" Total Returned Qty -" + $scope.selectedItem.totreturnQty);
            if($scope.selectedItem.totreceivedQty){
                $scope.totalQTY = request.Qty - $scope.selectedItem.totreceivedQty
            }
            else if($scope.selectedItem.totreturnQty){
                $scope.totalQTY = request.Qty - $scope.selectedItem.totreturnQty
            }
            else if($scope.selectedItem.totreceivedQty && $scope.selectedItem.totreturnQty){
                $scope.totalQTY = request.Qty - ($scope.selectedItem.totreceivedQty+$scope.selectedItem.totreturnQty);
            }


        }


        $scope.returnReceiveQTY = function (quantity,btnVal){
            console.log(quantity);
            console.log(btnVal);



            if(btnVal == 'Return'){
                var body = {};
                body.returnDetails = {}
                body.returnDetails.returnedQty = quantity;
                body.returnDetails.returnDate = new Date();
                body.requestID =  $scope.requestID
                body.itemCode = $scope.selectedItem.itemCode
                Settings.getUserInfo(function(user_details){
                    body.returnDetails.returnedUser = user_details.username ? user_details.username : 'Admin';
                });

                if(body){
                    $http.put("/dash/assets/itemStatus/receiveReturn", body)
                        .success(function (response) {
                             console.log("Update -->" + response);
                            console.log(response);
                            if(response=='success'){
                         Settings.successPopup('Success', 'Item Returned Successfully');
                                $scope.getAllStatus();
                                $scope.getRequest($scope.requestID);
                                $scope.hideModal();
                                $scope.showBtn();


                                // document.getElementById('returnReceiveModal').style.display='none';
                                // document.getElementsByClassName('modal-backdrop').na)


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
            else if(btnVal == 'Receive'){
                var body = {};
                body.receivedDetails = {}
                body.receivedDetails.receivedQty = quantity;
                body.receivedDetails.receivedDate = new Date();
                body.requestID =  $scope.requestID;
                body.itemCode = $scope.selectedItem.itemCode

                Settings.getUserInfo(function(user_details){
                    // console.log("inside if");
                    // console.log(user_details);
                    body.receivedDetails.receivedUser =user_details.username ? user_details.username : 'Admin';

                    // console.log($scope.approvedBy);
                });


                if(body){
                    $http.put("/dash/assets/itemStatus/receiveReturn", body)
                        .success(function (response) {
                             console.log("Update -->" + response);
                            if(response=='success'){
//                                Settings.success_toast('Item Received successfully');
                                Settings.successPopup('Success', 'Item Received successfully');

                                $scope.getAllStatus();
                                $scope.getRequest($scope.requestID);
                              //  document.getElementById('returnReceiveModal').style.display='none';


                                $scope.hideModal();
                                $scope.showBtn();
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


        }


        $scope.expandSelected=function(person){
            $scope.requestItems.forEach(function(val){
                val.expanded=false;
            })
            person.expanded=true;
            console.log(person);
            $scope.returnDetails = person.returnDetails;
            $scope.receivedDetails = person.receivedDetails;


        }


        $scope.hideModal = function (){
            let modal = document.getElementById('returnReceiveModal');
            let modalDismiss = modal.querySelector('[data-dismiss]');
            let backdrop = document.querySelector('.modal-backdrop');

            modal.classList.remove('show');
            backdrop.removeEventListener('click', $scope.hideModal.bind($scope));
            modalDismiss.removeEventListener('click', $scope.hideModal.bind($scope));

            setTimeout(function(){
                modal.style.display = 'none';
                modal.removeAttribute('aria-modal');
                modal.removeAttribute('style');
                modal.setAttribute('aria-hidden', 'true');
                document.body.removeAttribute('style');
                document.body.classList.remove('modal-open');
                backdrop.remove();
            }, 200);
        }


        $scope.showBtn = function () {
            console.log("show btn function");
            console.log($scope.requestItems);
           for(var i=0;i<$scope.requestItems.length;i++){
               if($scope.requestItems[i].receivedDetails){
                   console.log("recevied qty");
                   $scope.receivedallQty = 0;
                   $scope.requestItems[i].showReceiveBtn = false;
                   $scope.requestItems[i].showReturnBtn = false;
                   for(var j=0;j<$scope.requestItems[i].receivedDetails.length;j++){
                       // console.log(i);
                       // console.log($scope.requestItems[i]);
                       // console.log($scope.requestItems[i].receivedDetails[j]);
                       $scope.receivedallQty += $scope.requestItems[i].receivedDetails[j].receivedQty;
                     //  console.log($scope.receivedallQty);
                       $scope.requestItems[i].totreceivedQty = $scope.receivedallQty;
                      // console.log($scope.requestItems[i]);
                       if($scope.requestItems[i].totreceivedQty == $scope.requestItems[i].Qty){
                           console.log("hide receive btn")
                           $scope.requestItems[i].showReceiveBtn = true;
                           $scope.requestItems[i].showReturnBtn = true;
                       }
                       if($scope.requestItems[i].totreceivedQty+$scope.requestItems[i].totreturnQty == $scope.requestItems[i].Qty){
                           console.log("hide both btn")
                           $scope.requestItems[i].showReturnBtn = true;
                           $scope.requestItems[i].showReceiveBtn = true;
                       }

                   }
               }
               if($scope.requestItems[i].returnDetails){
                   console.log("returned qty");
                   $scope.returnallQty = 0;
                   $scope.requestItems[i].showReturnBtn = false;
                   $scope.requestItems[i].showReceiveBtn = false;
                   for(var k=0;k<$scope.requestItems[i].returnDetails.length;k++){
                       $scope.returnallQty += $scope.requestItems[i].returnDetails[k].returnedQty;
                       $scope.requestItems[i].totreturnQty = $scope.returnallQty;
                       if($scope.requestItems[i].totreturnQty == $scope.requestItems[i].Qty){
                           console.log("hide return btn")
                           $scope.requestItems[i].showReturnBtn = true;
                           $scope.requestItems[i].showReceiveBtn = true;
                       }
                       if($scope.requestItems[i].totreceivedQty+$scope.requestItems[i].totreturnQty == $scope.requestItems[i].Qty){
                           console.log("hide both btn");
                           $scope.requestItems[i].showReturnBtn = true;
                           $scope.requestItems[i].showReceiveBtn = true;
                       }
                   }
               }



           }
        }








    });

/**
 * Created by shreyasgombi on 30/07/22.
 */


 angular.module('ebs.controller')

 .controller("PaymentsAdminCtrl", function($scope, $location, $http, $window, Settings){
     console.log("Hello From Admin Settings Payments Controller .... !!!!");

     $scope.payment_modes = [];

     $scope.razorpay = {};

     const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    };

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    };

     const fetchPaymentModes = () => {
        startLoader();
        $http.get("/dash/settings/details/paymentMode")
            .then(response => {
                stopLoader();
                if(response.data && response.data.obj) {
                    console.log(response.data.obj);
                    $scope.payment_modes = response.data.obj;

                    for(let i = 0; i < $scope.payment_modes.length; i++){
                        switch($scope.payment_modes[i].name){
                            case "Razorpay" : {
                                $scope.razorpay = $scope.payment_modes[i];
                                break;
                            }
                            case "Cash On Delivery" : {
                                $scope.payment_modes[i].description = "Cash On Delivery will be an option to choose whenever customer's place an order.";
                                break;
                            }
                        }
                    }
                } else $scope.payment_modes = [];
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

     $scope.togglePaymentModeSelect = data => {
        if(data){
            if(data.name == 'Razorpay' && data.active && !data.id && !data.key){
                Settings.info_toast("Enter Credentials to Activate!");
            } else {
                for(let i = 0; i < $scope.payment_modes.length; i++){
                    if(data.name == $scope.payment_modes[i].name){
                        $scope.payment_modes[i] = data;

                        $http.put("/dash/settings/update/payment/mode", $scope.payment_modes)
                            .then(response => {
                                if(response.data){
                                    $scope.payment_modes = response.data;
                                    fetchPaymentModes();
                                    Settings.success_toast("SUCCESS", "Payment Settings Saved!");
                                }
                            })
                    }
                }
            }
        }
    };

    $scope.dropRazorpay = () => {
        Settings.confirmPopup("Confirm", "Are you sure? Razorpay Payment Integration will be disabled",
            result => {
                if(result){
                    for(let i = 0; i < $scope.payment_modes.length; i++){
                        if("Razorpay" == $scope.payment_modes[i].name){
                            $scope.payment_modes[i] = {
                                "name" : "Razorpay",
                                "active" : false,
                                "id" : "",
                                "key" : ""
                            };
                        }
                    };

                    $http.put("/dash/settings/update/payment/mode", $scope.payment_modes)
                            .then(response => {
                                if(response.data){
                                    $scope.payment_modes = response.data;
                                    fetchPaymentModes();
                                    Settings.success_toast("SUCCESS", "Payment Settings Saved!");
                                }
                            })
                }
            })
    }

    $scope.getLogo = mode => {
        switch(mode.name){
            case "Razorpay" : {
                return "assets/images/settings/razorpay_logo.svg";
            }
            case "Cash On Delivery" : {
                return "assets/images/settings/cash_on_delivery.png";
            }
        }
    };

    fetchPaymentModes();
 });
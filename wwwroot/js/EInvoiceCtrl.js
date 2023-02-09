angular.module('ebs.controller')

    .controller("EInvoiceCtrl", function($scope, $routeParams, $http, $window, Settings){
        console.log("Hello From E-invoice Integration Settings Controller .... !!!!");

        /*............................................
                    E-Invoice Integration Setup
         ........................................... */

        $scope.eInvoiceIntegration = {};
        $scope.eInvoiceIntegration_stats = {};

        $scope.country = Settings.getInstanceDetails('country') || 'India';
        // console.log("country",$scope.country);

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }
    
        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        
        const initialiseCredentials = () => {
            $scope.eInvoiceIntegration = {};
            startLoader();
            // console.log("api status")
            // $http.get("/dash/settings/invoice/integration/status")
            //     .then(eInvoiceIntegration => {
            //         console.log(eInvoiceIntegration)
            //         if(eInvoiceIntegration.data){
            //             console.log(eInvoiceIntegration.data);
            //             $scope.eInvoiceIntegration = eInvoiceIntegration.data;
            //         }
            //     })
            //     .catch((error, status) => {
            //         console.log(error, status);
            //         if(status){
            //             if(status >= 400 && status < 404)
            //                 $window.location.href = '/404';
            //             else if(status >= 500)
            //                 $window.location.href = '/500';
            //         }else if(error.status){
            //             if(error.status >= 400 && error.status < 404)
            //                 $window.location.href = '/404';
            //             else if(error.status >= 500)
            //                 $window.location.href = '/500';
            //         }
            //         else
            //             $window.location.href = '/404';
            //     });

            $http.get("/dash/settings/invoice/integration/status")
                .then(eInvoiceIntegration => {
                    // console.log('eInvoice data', eInvoiceIntegration)
                    if(eInvoiceIntegration.data){
                        // console.log(eInvoiceIntegration.data);
                        $scope.eInvoiceIntegration = eInvoiceIntegration.data;
                    }else{
                        $scope.eInvoiceIntegration = {};
                    }
                    stopLoader()
                })
                .catch((error, status) => {
                    // console.log(error, status);
                    stopLoader()
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
                stopLoader()
        }

        
         $scope.updateInvoiceIntegration = function(){
            // console.log($scope.eInvoiceIntegration)
            if($scope.eInvoiceIntegration.company_tin && $scope.eInvoiceIntegration.company_names && $scope.eInvoiceIntegration.company_security_key){
                startLoader()
                $http.post("/dash/settings/invoice/integration/creds/update", $scope.eInvoiceIntegration)
                    .then((response) => {
                        if(response.data && response.data.status == 'success')
                            Settings.successPopup("SUCCESS", "E-Invoice Integration has been setup!");
                        else
                            Settings.failurePopup("ERROR", "Could not update E-Invoice Integration");

                        stopLoader()
                        initialiseCredentials();  
                    })
                    .catch((error, status) => {
                        // console.log(error, status);
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
            }else{
                Settings.failurePopup("Error", "Enter all mandatory details");
            }
        };


        $scope.deleteInvoiceIntegrationCreds = function(){
            Settings.confirmPopup("Confirm", "Are you sure you want to drop credentials?", (result) => {
                if (result) {
                    startLoader()
                    $http.delete("/dash/settings/invoice/integration/creds/delete", $scope.eInvoiceIntegration)
                        .then((response) => {
                            if(response.data && response.data.status == 'success'){
                                Settings.successPopup("SUCCESS", "E-Invoice Integration setup has been disabled!");
                            }
                            else
                                Settings.failurePopup("ERROR", "Could not drop E-Invoice Integration creds");
                            stopLoader()
                            initialiseCredentials();  
                        })
                        .catch((error, status) => {
                            // console.log(error, status);
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
                        stopLoader()
                }
            })
        };

        initialiseCredentials();

    })
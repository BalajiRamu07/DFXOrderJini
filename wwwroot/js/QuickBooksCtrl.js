/**
 * Created by shreyasgombi on 05/07/22.
 */

 angular.module('ebs.controller')

 .controller("QuickBooksCtrl", function($scope, $routeParams, $http, $window, Settings){
     console.log("Hello From QuickBooks Settings Controller .... !!!!");

     $scope.quickbooks = {};
     $scope.quickbooksArray = [];

     //... Save the timer in a variable... We can clear it at a later stage...
     let qbInterval = '';

     const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    }

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    }

     const requestToken = () => {
        $http.get("/dash/quickbooks/request/token")
            .then(function (response) {
                if (response.data) {
                    stopLoader();
                    Settings.success_toast('Success', "QuickBooks Connected");

                    console.log("---- QB Session Available ----");
                } else {
                    console.log("---- QB : Connect Again ----");
                    Settings.failurePopup('ERROR',"Connect Again");
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

     const startTimer = () => {
        let startTime = new Date().getTime();
        qbInterval = setInterval(function(){
            if(new Date().getTime() - startTime > 600000){
                clearInterval(qbInterval);
                return;
            }
            $scope.checkStatus();
        }, 5000);
     };


    const refreshQuickBooksSettings = () => {
        $http.get("/dash/quickbooks/settings")
            .then(response => {
                console.log(response.data);
                if(response.data && response.data.obj)
                    $scope.quickbooksArray = response.data.obj;
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
    $scope.launchPopup = function(path) {
        startTimer();
        startLoader();

        $http.get("/dash/quickbooks/creds/fetch")
            .then((credentials) => {
                //..... Validate if token already exists....
                if(credentials && credentials.data && credentials.data.quickbooks_refToken) {
                    //... If an old token already exists, request a new token....
                    requestToken();                }
                else{
                    $scope.showLoader = false;
                    console.log("QuickBooks : Launch Pop-up ----");

                    var parameters = "location=1,width=800,height=650";
                    parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;

                    // Launch Popup
                    window.open(path, 'connectPopup', parameters);
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

     $scope.checkStatus = () => {
        $http.get("/dash/quickbooks/flag/check")
            .then((response) => {
                if(response.data){
                    $scope.quickbooks.token = true;
                    $scope.quickbooks.last_connected = response.data.lastConnectedTime;
                    $scope.quickbooks.company = response.data.qbCompany || response.data.quickbooks_company_id;
                    stopLoader();
                    clearInterval(qbInterval);
                    refreshQuickBooksSettings();
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

     $scope.quickBooksInit = () => {
        $http.get("/dash/quickbooks/creds/fetch")
            .then((creds) => {
                //.... Tokens are available, so it could be already signed in....
                if(creds && creds.data && creds.data.quickbooks_token){
                    $scope.quickbooks.token = creds.data.quickbooks_token;
                    //.... Verify if the token is still active....
                    
                    $http.get("/dash/quickbooks/token/check")
                        .then((result) => {
                            if(result && result.data && result.data.QueryResponse){
                                if(creds.data.lastConnectedTime){
                                    $scope.qbConnectTime = creds.data.lastConnectedTime;
                                    $scope.quickbooks.last_connected = creds.data.lastConnectedTime;
                                }

                                if(creds.data.qbCompany){
                                    $scope.quickbooks.company = creds.data.qbCompany;
                                }

                                Settings.success_toast('Success', "QuickBooks is Connected & Active");
                            }

                            $http.get("/dash/quickbooks/request/token")
                                .then((response) => {
                                    console.log(response.data);
                                    if (response && response.data) {
                                        $scope.checkStatus();
                                    }else{
                                        $scope.quickbooks = {};
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
    $scope.quickBooksInit();

    $scope.deleteQuickbooksTokens = () => {
        Settings.confirmPopup("Confirm","Are you sure you want to disconnect?", (result) => {
            if (result) {
                startLoader();
                $http.get("/dash/quickbooks/revoke")
                    .success(function (response) {
                        if (response) {
                            stopLoader();
                            console.log("Tokens revoked from quickbooks **");
                            console.log(response);
                            $scope.quickbooks = {};
                            Settings.success_toast('SUCCESS', "QuickBooks disconnected");
                        }
                        else {
                            console.log("Error From Revoke Api....");
                            Settings.failurePopup('ERROR', "Error While Disconnecting, Try Again Later...");
                            stopLoader();
                        }
                    })
            }
        })
    };

    $scope.schedularUpdate = (boolean, index) => {

        $scope.quickbooksArray[index]['sync'] = boolean;

        $http.put("/dash/quickbooks/update/properties", $scope.quickbooksArray)
            .then(response => {
                if(response.data){
                    console.log("Quickbooks scheduler updated****");
                    Settings.success_toast('SUCCESS', "QuickBooks Scheduler Tuned ON");
                }else{
                    Settings.fail_toast('SUCCESS', "Error enabling the scheduler");
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
 });
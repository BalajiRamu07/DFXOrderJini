/**
 * Created by shreyasgombi on 08/09/22.
 */


 angular.module('ebs.controller')

 .controller("TaxAdminCtrl", function($scope, $location, $http, $window, Settings){
    console.log("Hello From Admin Settings Tax Controller .... !!!!");

    $scope.new_tax = {};

    $scope.taxes = [];

    $scope.settings = {};
    $scope.settings.tax_setup = false;

    const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    };

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    };

    let instance_details = Settings.getInstance();
    $scope.settings.currency = instance_details.currency || '₹';
    $scope.settings.country = instance_details.country || 'India';

    const fetchTaxes = () => {
        startLoader();
        $http.get("/dash/settings/details/tax")
            .then(taxes => {
                stopLoader();
                if(taxes.data){
                    $scope.taxes = taxes.data.tax;
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

    const fetchTaxSetup = () => {
        startLoader();
        $http.get("/dash/settings/details/taxSetup")
            .then(tax_setup => {
                stopLoader();
                if(tax_setup.data){
                    $scope.settings.tax_setup = tax_setup.data.activate;
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

    $scope.toggleTaxSetup = enable => {
        $http.put("/dash/settings/tax/enable", {"activate" : enable})
            .then(response => {
                console.log(response.data);
                if(response.data && response.data == "success"){
                    $scope.settings.tax_setup = flag
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
    };

    const checkDuplicate = name => {
        for(let i = 0; i < $scope.taxes.length; i++) 
            if(name == $scope.taxes[i].name) return false;
            else if(i == $scope.taxes.length - 1) return true;

            if(!$scope.taxes.length)
                return true;
    }

    $scope.saveNewTax = () => {
        if($scope.new_tax.name){
            if(checkDuplicate($scope.new_tax.name)){
                let message = $scope.new_tax.name + ' - CGST : '+($scope.new_tax.cgst ?  $scope.new_tax.cgst+' %' : '0 %')+' || SGST : '+($scope.new_tax.sgst ?  $scope.new_tax.sgst+' %' : '0 %')+' || IGST : '+($scope.new_tax.igst ?  $scope.new_tax.igst+' %' : '0 %');

                Settings.confirmPopup("Confirm", message, result => {
                    if(result){
                        $scope.new_tax.cgst = $scope.new_tax.cgst || 0;
                        $scope.new_tax.sgst = $scope.new_tax.sgst || 0;
                        $scope.new_tax.igst = $scope.new_tax.igst || 0;
    
                        $scope.new_tax.country = $scope.settings.country;
    
                        $http.post("/dash/settings/new/tax", $scope.new_tax)
                            .then(response => {
                                if(response.data && response.data.status == "success"){
                                    Settings.success_toast("SUCCESS", "Tax " + $scope.new_tax.name + " was added successfully!");
                                    $scope.new_tax = {};
                                    fetchTaxes();
                                    Settings.setInstanceDetails('tax', $scope.taxes);
                                }else Settings.fail_toast("ERROR", "Failed to save tax. Please try after sometime");
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
            } else Settings.fail_toast("ERROR", "Tax Name Already Exists. Choose a different name");
            
        } else Settings.fail_toast("ERROR", "Enter all mandatory details");

    }

    $scope.setDefaultTax = tax => {
        if(tax && tax.name){
            for(let i = 0; i < $scope.taxes.length; i++){
                $scope.taxes[i].default = false;
                if(tax.name == $scope.taxes[i].name) $scope.taxes[i].default = true;
            }
    
            $http.put("/dash/settings/tax/update", $scope.taxes)
                .then(response => {
                    if(response.data && response.data.status == "success"){
                        Settings.success_toast("SUCCESS", "Tax " + tax.name + " was set as default");
                        fetchTaxes();
                    } else Settings.fail_toast("ERROR", "Failed to set default tax. Please try again");
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
    }

    $scope.removeTax = index => {
        Settings.confirmPopup("Confirm", 
        "Are you sure?\nPlease Note : Any catalog items assigned with this tax will continue to be assigned with tagged tax values",
            result => {
                if(result){
                    let tax_name = $scope.taxes[index].name;
                    $scope.taxes.splice(index, 1);
                    console.log($scope.taxes);

                    $http.put("/dash/settings/tax/update", $scope.taxes)
                        .then(response => {
                            if(response.data && response.data.status == "success"){
                                Settings.success_toast("SUCCESS", "Tax " + tax_name + " was removed");
                                fetchTaxes();
                            } else Settings.fail_toast("ERROR", "Failed to set default tax. Please try again");
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
    };

    fetchTaxSetup();
    fetchTaxes();
 })
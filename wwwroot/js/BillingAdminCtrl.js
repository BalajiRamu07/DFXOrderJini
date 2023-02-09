/**
 * Created by shreyasgombi on 31/07/22.
 */


 angular.module('ebs.controller')

 .controller("BillingAdminCtrl", function($scope, $routeParams, $location, $http, $window, Settings){
    console.log("Hello From Admin Settings Billing Controller .... !!!!");

    $scope.invoices = [];

    $scope.plan_details = {'plan' : "Free", "pricing_type" : "Flat", "flat_rate" : 850};
    $scope.estimate = {};
    $scope.billing = {};
    $scope.billing.enable = false;

    $scope.user_activites = [];

    let instance_details = Settings.getInstance();
    $scope.currency = instance_details.currency;

    const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    };

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    }

    const fetchInvoices = () => {
        startLoader();
        $http.get("/dash/settings/admin/billing/invoices")
            .then(invoices => {
                stopLoader();
                if(invoices.data && invoices.data.length){
                    for(let i = 0; i < invoices.data.length; i++){
                        if(invoices.data[i].amount && invoices.data[i].IGST)
                            invoices.data[i].amount += (invoices.data[i].amount * (invoices.data[i].IGST / 100));
                        else if(invoices.data[i].amount && invoices.data[i].CGST && invoices.data[i].SGST){
                            invoices.data[i].amount += ((invoices.data[i].amount * (invoices.data[i].CGST / 100)) + (invoices.data[i].amount * (invoices.data[i].SGST / 100)));
                        }

                        invoices.data[i].amount = parseFloat(invoices.data[i].amount.toFixed(2));
                    }
                    $scope.invoices = invoices.data;
                }
            })
    }

    const fetchBillingStatus = () => {
        $http.get("/dash/settings/admin/billing/status")
            .then(billing => {
                stopLoader();
                if(billing.data){
                    console.log(billing.data);
                    $scope.billing.enable = billing.data.billing;
                }
            })
    }

    const fetchPlan = () => {
        startLoader();
        $http.get("/dash/settings/admin/billing/plan")
            .then(plan => {
                stopLoader();
                if(plan.data){
                    plan.data.status = plan.data.status.toUpperCase();
                    if(plan.data.subscription){
                        if(plan.data.subscription.start_date) plan.data.subscription.start_date = new Date(plan.data.subscription.start_date);
                        if(plan.data.subscription.end_date) plan.data.subscription.end_date = new Date(plan.data.subscription.end_date);
                    }
                    $scope.plan_details = plan.data;
                }
            })
    }

    const fetchUserActivities = () => {
        startLoader();
        $http.get("/dash/settings/admin/billing/user/activities")
            .then(activities => {
                stopLoader();
                if(activities.data && activities.data.length){
                    $scope.user_activites = activities.data;
                }
            })
    }

    const getCurrentEstimate = () => {
        $http.get("/dash/settings/admin/billing/estimate")
            .then(estimate => {
                if(estimate.data && estimate.data.status != "error"){
                    estimate.data.taxable = estimate.data.amount;
                    if(estimate.data.amount && estimate.data.IGST)
                        estimate.data.amount += (estimate.data.amount * (estimate.data.IGST / 100));
                        else if(estimate.data.amount && estimate.data.CGST && estimate.data.SGST){
                            estimate.data.amount += ((estimate.data.amount * (estimate.data.CGST / 100)) + (estimate.data.amount * (estimate.data.SGST / 100)));
                        }
                        estimate.data.amount = parseFloat(estimate.data.amount.toFixed(2));

                        $scope.estimate = estimate.data;
                }else{
                    $scope.estimate.error = estimate.data.message;
                }
            })
    }


    $scope.refreshPlan = () => fetchPlan();

    $scope.updatePlan = () => {
        if($scope.plan_details.plan && $scope.plan_details.flat_rate){
            if(!$scope.plan_details.purchase_id) $scope.plan_details.purchase_id = Settings.generateId();
            
            Settings.confirmPopup("Confrim", "Confirm Plan Change?",
                result => {
                    if(result){
                        $http.put("/dash/settings/admin/billing/update/plan", $scope.plan_details)
                            .then(plan_update => {
                                if(plan_update.data && plan_update.data.status == 'success'){
                                    Settings.success_toast("Success", "Plan Successfully Updated");
                                }else Settings.fail_toast("Error", "Error updating the plan details");
                                fetchPlan();
                            })
                    }
                })
        }else fetchPlan();
    }

    $scope.enableBilling = () => {
        Settings.confirmPopup("Confrim", ($scope.billing.enable ? "Enable" : "Disable") + " Billing?",
                result => {
                    if(result){
                        $http.put("/dash/settings/admin/billing/enable", $scope.billing)
                            .then(plan_update => {
                                if(plan_update.data && plan_update.data.status == 'success'){
                                    Settings.success_toast("Success", "Billing Successfully " + ($scope.billing.enable ? "Enabled" : "Disabled"));
                                }else Settings.fail_toast("Error", "Error enabling billing");
                                fetchBillingStatus();
                            })
                    }else fetchBillingStatus();
                })
    }

    fetchUserActivities();
    fetchInvoices();
    fetchPlan();
    fetchBillingStatus();
    getCurrentEstimate();

   
 })
/**
 * Created by shreyasgombi on 15/09/22.
 */

 angular.module('ebs.controller')


 .controller("NewEnquiryCtrl",function ($scope, $http, $window, Settings, $routeParams, $location) {
     console.log("Hello From New Enquiry Controller .... !!!!");

     //.... Capture new ticket details...
    $scope.enquiry = {
        "call" : "Hot",
        "address" : {}
    };

    //.... Customer Code from the params if available...
    //... This will prefix the customer details...
    const customer_code =  $routeParams.code;

    const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    }

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    }

    $scope.lead_sources = [
        {
            "type" : "Walk-In",
            "name" : "Walk-In"
        },
        {
            "type" : "Landline",
            "name" : "Landline"
        },
        {
            "type" : "Mobile",
            "name" : "Mobile"
        },
        {
            "type" : "Website",
            "name" : "Website"
        },
        {
            "type" : "Hoarding",
            "name" : "Hoarding"
        },
        {
            "type" : "News Paper",
            "name" : "News Paper"
        },
        {
            "type" : "Hand Bills",
            "name" : "Hand Bills"
        },
        {
            "type" : "TV",
            "name" : "TV"
        },
        {
            "type" : "Radio",
            "name" : "Radio"
        }
    ]

    $scope.lead_types = [
        {
            "type" : "Existing Customer",
            "name" : "Existing Customer"
        },
        {
            "type" : "New Lead",
            "name" : "New Lead"
        },
        {
            "type" : "Just Enquiry",
            "name" : "Just Enquiry"
        },
        {
            "type" : "Fake Call",
            "name" : "Fake Call"
        }
    ];

    $scope.occupations = [
        {
            "type" : "Central Govt",
            "name" : "Central Govt"
        },
        {
            "type" : "State Govt",
            "name" : "State Govt"
        },
        {
            "type" : "Private",
            "name" : "Private"
        },
        {
            "type" : "Professional",
            "name" : "Professional"
        },
        {
            "type" : "Self Employed",
            "name" : "Self Employed"
        }
    ];

    $scope.annual_incomes = [
        {
            "range" : "< 3,00,000"
        },
        {
            "range" : "3,00,001 - 6,00,000"
        },
        {
            "range" : "6,00,001 - 10,00,000"
        },
        {
            "range" : "10,00,001 - 15,00,000"
        },
        {
            "range" : "15,00,001 - 20,00,000"
        },
        {
            "range" : "> 20,00,000"
        }
    ];

    $scope.budget_range = [
        {
            "range" : "< 30 Lakhs"
        },
        {
            "range" : "31 Lakhs - 50 Lakhs"
        },
        {
            "range" : "51 Lakhs - 70 Lakhs"
        },
        {
            "range" : "71 Lakhs - 90 Lakhs"
        },
        {
            "range" : "> 91 Lakhs"
        }
    ]

    $scope.age_range = [
        {
            "range" : "20-30"
        },
        {
            "range" : "31-40"
        },
        {
            "range" : "41-50"
        },
        {
            "range" : "51-60"
        },
        {
            "range" : "> 60"
        },
    ]

    const getCustomerDetails = code => {
        $http.get("/dash/store/" + code)
        .then(store_details => {
            if(store_details.data.length && store_details.data[0].Dealercode && store_details.data[0].Dealercode[0]){
                console.log(store_details.data[0]);
                $scope.enquiry.existing_customer = true;
                $scope.enquiry.customer_code = store_details.data[0].Dealercode[0];
                $scope.enquiry.customer_name = store_details.data[0].DealerName[0];

                if(store_details.data[0].email && store_details.data[0].email[0]) $scope.enquiry.customer_email = store_details.data[0].email[0];
                if(store_details.data[0].Phone && store_details.data[0].Phone[0]) $scope.enquiry.customer_phone = store_details.data[0].Phone[0];
                if(store_details.data[0].Addess && store_details.data[0].Addess[0]) $scope.enquiry.address.address = store_details.data[0].Addess[0];
                if(store_details.data[0].Area && store_details.data[0].Area[0]) $scope.enquiry.address.area = store_details.data[0].Area[0];
                if(store_details.data[0].State && store_details.data[0].State[0]) $scope.enquiry.address.state = store_details.data[0].State[0];
                if(store_details.data[0].City && store_details.data[0].City[0]) $scope.enquiry.address.city = store_details.data[0].City[0];
                if(store_details.data[0].Country && store_details.data[0].Country[0]) $scope.enquiry.address.country = store_details.data[0].Country[0];
                if(store_details.data[0].Pincode && store_details.data[0].Pincode[0]) $scope.enquiry.address.pincode = store_details.data[0].Pincode[0];
            }
        });
    }

    const loadEnquiryTypes = () => {
        startLoader();
        $http.get("/dash/settings/enquiry/lead/types")
            .then(types => {
                if(types.data && types.data.data.length){
                    $scope.lead_types = types.data.data;
                }
                stopLoader();
            })
            .catch((error, status) => {
                if (status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if (status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
    }

    const loadLeadSources = () => {
        $http.get("/dash/settings/enquiry/lead/sources")
            .then(sources => {
                if(sources.data && sources.data.data.length){
                    $scope.lead_sources = sources.data.data;
                }
            })
    }
    loadEnquiryTypes();
    loadLeadSources();

    const validateEnquiryData = data => {
        if(!data.subject){
            Settings.fail_toast("Error", "Enquiry subject not available");
            return false;
        }else if(!data.customer_name){
            Settings.fail_toast("Error", "Customer name not available");
            return false;
        }else if(!data.customer_phone){
            Settings.fail_toast("Error", "Customer phone not available");
            return false;
        }else if(!data.customer_email){
            Settings.fail_toast("Error", "Customer email not available");
            return false;
        }else if(!data.lead_source){
            Settings.fail_toast("Error", "Select a Lead Source");
            return false;
        }else return true;
    };

    $scope.submitEnquiry = () => {
        console.log($scope.enquiry);
        if(validateEnquiryData($scope.enquiry)){
            startLoader();
            Settings.confirmPopup("Confirm", "Are you sure?", result => {
                if(result){
                    $http.post("/dash/enquiry/new/query", $scope.enquiry)
                        .then(new_enquiry => {
                            stopLoader();
                            if(new_enquiry.data && new_enquiry.data.status != 'error'){
                                Settings.success_toast("Success", "New Enquiry Created!");
                                $location.path("/enquiry/tracker");
                            }else
                                Settings.fail_toast("Error", "Error creating new enquiry");
                        })
                        .catch((error, status) => {
                            if (status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if (status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }else stopLoader();
            })
        }
    }

    //.... Function to get all users...
    const getUsers = () => {
        $http.post("/dash/users/list", {})
            .then((users) => {
                if(users.data && users.data.length){
                    console.log(users.data);
                    $scope.users = users.data;
                }
            })
            .catch((error, status) => {
                if (status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if (status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });
    }

    getUsers();

    if(customer_code && customer_code != 'undefined') getCustomerDetails(customer_code);

    $scope.goBack = () => $window.history.back();
 })
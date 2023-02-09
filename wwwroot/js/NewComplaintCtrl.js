

angular.module('ebs.controller')

.controller("NewComplaintCtrl", function ($scope, $http, $routeParams, Settings, $location, $window) {
    console.log("Hello From New Complaint Controller .... !!!!");


    const generateOrderId = () => {

        var date = new Date();

        var components = [
            date.getYear(),
            (date.getMonth() < 10)? '0' + date.getMonth() : date.getMonth(),
            (date.getDate() < 10)? '0' + date.getDate() : date.getDate(),
            (date.getHours() < 10)? '0' + date.getHours() : date.getHours(),
            (date.getMinutes() < 10)? '0' + date.getMinutes() : date.getMinutes(),
            (date.getSeconds() < 10)? '0' + date.getSeconds() : date.getSeconds(),
            (date.getMilliseconds() < 10)? '00' + date.getMilliseconds() : (date.getMilliseconds() < 100)? '0' + date.getMilliseconds() : date.getMilliseconds()
        ];

        var date_ = components.join("");
        return date_;
    }

    //.... Capture new ticket details...
    $scope.ticket = {
        "priority" : "Low",
        "ticket_id": generateOrderId()
    };

    $scope.user_details = {};
    $scope.product = {};
    $scope.product.kw = '';
    $scope.product.pole = '';
    $scope.product.category = '';
    $scope.productObj = '';

    //.... Customer Code from the params if available...
    //... This will prefix the customer details...
    const customer_code =  $routeParams.code;

    let instanceDetails =  Settings.getInstance();

    Settings.getNav((nav) => {
        console.log('nav-=> ',nav)
        $scope.nav = nav;
        $scope.userRole = $scope.nav[4].roles ? $scope.nav[4].roles: [];
    });

    Settings.getUserInfo(user_details => {
        if(user_details)
            $scope.user_details = user_details;
    })

    const startLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "inline");
    }

    const stopLoader = () => {
        jQuery.noConflict();
        $('.refresh').css("display", "none");
    }

    $scope.issue_types = [
        {
            "type" : "Amount Over Charged",
            "name" : "Amount Over Charged"
        },
        {
            "type" : "Refund Overdue",
            "name" : "Refund Overdue"
        },
        {
            "type" : "Web Portal Not Working",
            "name" : "Web Portal Not Working"
        },
        {
            "type" : "App Issues",
            "name" : "App Issues"
        },
        {
            "type" : "General Enquiry",
            "name" : "General Enquiry"
        },
        {
            "type" : "Legal Issues",
            "name" : "Legal Issues"
        },
        {
            "type" : "Others",
            "name" : "Others"
        }
    ]

    $scope.ticket_types = [
        {
            "type" : "Negative Interactions",
            "name" : "Negative Interactions"
        },
        {
            "type" : "Billing Issues",
            "name" : "Billing Issues"
        },
        {
            "type" : "E-commerce Problems",
            "name" : "E-commerce Problems"
        },
        {
            "type" : "Refunds",
            "name" : "Refunds"
        },
        {
            "type" : "Product Quality",
            "name" : "Product Quality"
        },
        {
            "type" : "Products Not Delivered",
            "name" : "Products Not Delivered"
        },
        {
            "type" : "Others",
            "name" : "Others"
        }
    ];

    $scope.branches = [
        {
            "type" : "JP Nagar Branch",
            "name" : "JP Nagar Branch"
        },
        {
            "type" : "Jayanagar Branch",
            "name" : "Jayanagar Branch"
        },
        {
            "type" : "Basavangudi Branch",
            "name" : "Basavangudi Branch"
        }
    ]

    $scope.itemSearch = {};
    $scope.itemSearch.filter = '';


    $scope.searchCustomer = function(text){
        $scope.customers = [];
        $scope.ticket.customer_phone = '';
        $scope.ticket.customer_email = '';
        if(text){
            $http.get("/dash/stores/search/"+text)
            .success(function(res){
                $scope.customers = res;
            });
        }else $scope.customers = [];
    }

    $scope.customer = {};
    $scope.itemSelected = function(customer){
        console.log("customer", customer)
        if(customer.Dealercode){
            $scope.ticket.customer_name  = customer.DealerName;
            $scope.ticket.customer_phone = customer.Phone;
            $scope.ticket.customer_email = customer.email;
        }
    }

    // $scope.selectProduct = function(product){
    //     console.log("product-=> ",product);
    //     $scope.product = JSON.parse(product.name);

    //     console.log($scope.product)
    // }

    $scope.ticket.products = [];
    $scope.addProduct = function(item,prod){
        item = JSON.parse(item)
        console.log(item, prod)
        if($scope.ticket.products.length){
            const max = $scope.ticket.products.reduce((prev, current) => (prev.lineId > current.lineId) ? prev.lineId : current.lineId, 1)
            item.lineId = max+1;
        }else item.lineId = 1;

        item.category = prod.category || '';
        item.kW = prod.kW || '';
        item.pole = prod.pole || '';
        item.serial_number = prod.serial_number || '';
        item.issueType1 = prod.issueType1 || '';
        item.issueType2 = prod.issueType2 || '';
        item.issueType3 = prod.issueType3 || '';
        item.invoice_number = prod.invoice_number || '';
        item.attachments = $scope.productAttachment;
        $scope.ticket.products.push(item);
        $scope.product = {};
        $scope.productObj = {};
        $scope.productAttachment = [];
        let select_box = document.getElementById("issue-subject-product");
        select_box.selectedIndex = 0;
    }

    $scope.clearProduct = function(){
        $scope.product = {};
        $scope.productObj = {};
        $scope.productAttachment = [];
    }

    $scope.removeProduct = function(index){
        $scope.ticket.products.splice(index, 1);
    }

    $scope.removeProductAttachments = function(index){
        // console.log('remove attachment ', index)
        $scope.productAttachment.splice(index, 1)
    }

    $scope.removeTicketAttachments = function(index){
        // console.log('remove attachment ', index)
        $scope.ticket.attachments.splice(index, 1)
    }

    const getCustomerDetails = code => {
        $http.get("/dash/store/" + code)
        .then(store_details => {
            if(store_details.data.length && store_details.data[0].Dealercode && store_details.data[0].Dealercode[0]){
                console.log(store_details.data[0]);
                $scope.ticket.existing_customer = true;
                $scope.ticket.customer_code = store_details.data[0].Dealercode[0];
                $scope.ticket.customer_name = store_details.data[0].DealerName[0];

                if(store_details.data[0].email && store_details.data[0].email[0]) $scope.ticket.customer_email = store_details.data[0].email[0];
                if(store_details.data[0].Phone && store_details.data[0].Phone[0]) $scope.ticket.customer_phone = store_details.data[0].Phone[0];
            }
        });
    }

    const loadTicketTypes = () => {
        startLoader();
        $http.get("/dash/settings/service/ticket/types")
            .then(types => {
                if(types.data && types.data.data.length){
                    $scope.ticket_types = types.data.data;
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

    const loadIssueTypes = () => {
        $http.get("/dash/settings/service/issue/types")
            .then(types => {
                if(types.data && types.data.data.length){
                    $scope.ticket_types = types.data.data;
                }
            })
    }
    loadTicketTypes();
    loadIssueTypes();

    const validateTicketData = data => {
        if(!$scope.ticket.regalStatus){
            if(!data.issue){
                Settings.fail_toast("Error", "Issue subject not available");
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
            }else if(!data.issue_type){
                Settings.fail_toast("Error", "Select an Issue Type");
                return false;
            }else if(!data.ticket_type){
                Settings.fail_toast("Error", "Select the type of Ticket");
                return false;
            }else return true;
        }else if(!data.issue){
            Settings.fail_toast("Error", "Issue subject not available");
            return false;
        }else if(!data.endUserName){
            Settings.fail_toast("Error", "Please enter End User Name");
            return false;
        }else if(!data.endUserPhone){
            Settings.fail_toast("Error", "Please enter End User Phone");
            return false;
        }else return true;
    };

    $scope.submitTicket = () => {
        // console.log($scope.ticket);
        if($scope.nav[25] && $scope.nav[25].activated) {
            $scope.ticket.status = $scope.regalStatus.length ? $scope.regalStatus[0] : 'New';
            $scope.ticket.regalStatus = true;
        }else $scope.ticket.regalStatus = false;
        if(validateTicketData($scope.ticket)){
            startLoader();
            Settings.confirmPopup("Confirm", "Are you sure?", result => {
                if(result){
                    $http.post("/dash/services/new/ticket", $scope.ticket)
                        .then(new_ticket => {
                            stopLoader();
                            if(new_ticket.data && new_ticket.data.status != 'error'){
                                Settings.success_toast("Success", "New Ticket Created!");
                                $location.path("/service/complaints/pending");
                            }else
                                Settings.fail_toast("Error", "Error creating new ticket");
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

    if($scope.user_details.role == "Dealer"){
        if($scope.user_details.sellerObject && $scope.user_details.sellerObject.Dealercode){
            getCustomerDetails($scope.user_details.sellerObject.Dealercode);
        }else{
            $http.get("/dash/store/details/" + $scope.user_details.sellerObject.sellerphone)
                .then(store_details => {
                    if(store_details.data && store_details.data.length){
                        if(store_details.data[0].Dealercode && store_details.data[0].Dealercode){
                            $scope.ticket.existing_customer = true;
                            $scope.ticket.customer_code = store_details.data[0].Dealercode;
                            $scope.ticket.customer_name = store_details.data[0].DealerName;
            
                            if(store_details.data[0].email && store_details.data[0].email) $scope.ticket.customer_email = store_details.data[0].email;
                            if(store_details.data[0].Phone && store_details.data[0].Phone) $scope.ticket.customer_phone = store_details.data[0].Phone;
                        }
                    }else {
                        Settings.fail_toast("Error", "Could not find reference from Customer Master");
                    }
                })
        }
    }else{
        if(customer_code && customer_code != 'undefined') {
            getCustomerDetails(customer_code);
        }
    }

    //add Dealer auto fill address
    $scope.addNewAddress = function () {
        var input = document.getElementById('end-user-address');
        var addressAutocomplete = new google.maps.places.Autocomplete(input);

        addressAutocomplete.addListener('place_changed', function () {
            var newplace = addressAutocomplete.getPlace();
            var lat=newplace.geometry.location.lat();
            var long = newplace.geometry.location.lng();
            for(var i=0; i<newplace.address_components.length; i++){
                if(newplace.address_components[i].types[0]=="locality"){
                    var jcity = newplace.address_components[i].long_name;
                    var jaddress= newplace.formatted_address;
                }
                if(newplace.address_components[i].types[1]=="sublocality")
                    var jarea = newplace.address_components[i].long_name;
                if(newplace.address_components[i].types[0] == "postal_code")
                    var jpostalCode = newplace.address_components[i].long_name;
                if(newplace.address_components[i].types[0] == 'administrative_area_level_1')
                    var jstate = newplace.address_components[i].long_name;
                if(newplace.address_components[i].types[0] == 'country')
                    var jcountry = newplace.address_components[i].long_name;
            }

            var scope = angular.element(document.getElementById('end-user-address')).scope();
            scope.ticket.endUserCity = jcity;
            scope.ticket.endUserArea = jarea;
            scope.ticket.endUserState = jstate;
            scope.ticket.endUserCountry = jcountry;
            scope.ticket.endUserPincode = jpostalCode;
            scope.ticket.endUserAddress = jaddress;
            scope.ticket.endUserlatitude = lat;
            scope.ticket.endUserlongitude = long;

            $('#endUserCity').val(jcity);
            $('#endUserPincode').val(jpostalCode);
            scope.$apply();

        })
    };

    const loadScript = (key, type, charset) => {
        if(!google || !google.maps){
            console.log("No google SDK found, loading a new one - " + key);
            let url = 'https://maps.google.com/maps/api/js?key=' + key + '&libraries=geometry,places';
            let heads = document.getElementsByTagName("head");

            if (heads && heads.length) {
                let head = heads[0];
                if (head) {
                    var script = document.createElement('script');
                    script.setAttribute('src', url);
                    script.setAttribute('type', type);
                    if (charset) script.setAttribute('charset', charset);
                    head.appendChild(script);
                }
            }
        }else
            console.log("Voila! Google is already loaded on your browser ---> ");
    };

    loadScript(Settings.getInstanceDetails('gMapAPI'), 'text/javascript', 'utf-8');

    $scope.type1Selected = (type) => {
        if($scope.regalIssueTypes.length){
            $scope.regalIssueTypes.map(issue => {
                if(issue.type_1 == type){
                    $scope.product.issueType2 = '';
                    $scope.product.issueType3 = '';
                    $scope.regalIssueType3 = [];
                    $scope.regalIssueType2 = issue.types;
                }
            })
        }
    }

    $scope.type2Selected = (type) => {
        if($scope.regalIssueType2.length){
            $scope.regalIssueType2.map(issue => {
                if(issue.type_2 == type){
                    $scope.product.issueType3 = '';
                    $scope.regalIssueType3 = issue.types;
                }
            })
        }
    }

    $scope.regalStatus =[];
    const getSettingTypes = (typeName) => {
        startLoader();
        $http.get("/dash/settings/service/regal/types/"+typeName)
            .then(types => {
                console.log(types)
                if(types.data && types.data.type == "regalIssueType"){
                    if(types.data.issueTypes && types.data.issueTypes.length)
                        $scope.regalIssueTypes = types.data.issueTypes;
                    else
                        $scope.regalIssueTypes = [];
                }else if(types.data && types.data.type == "regalProduct"){
                    $scope.products = types.data.products;
                }else if(types.data && types.data.type == "regalProductCategory"){
                    $scope.productCategory = types.data.productCategory;
                }else if(types.data && types.data.type == "regalStatus"){
                    console.log(types.data)
                    $scope.regalStatus = types.data.status;
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


    // $scope.productAttachment = {};
    $scope.productAttachment = [];
    $scope.ticket.attachments = [];
    //upload attachment docs
    $scope.newUploadDocuments = function(step){
        console.log('step', step, $scope.ticket)
        var reader = new FileReader();
        var tempObj = {};
        let image =[];
        tempObj.publicId = generateOrderId();
        if(step == 1){
            tempObj.path = $scope.ticket.ticket_id+'/product';
            image = document.getElementById('product-input_upload').files;
            $('#product-fake-file-button-upload').prop('disabled', true);
        }else if(step == 2){
            tempObj.path = $scope.ticket.ticket_id+'/ticket';
            image = document.getElementById('ticket-input_upload').files;
            $('#ticket-fake-file-button-upload').prop('disabled', true);
        }
        startLoader();

        console.log(reader);
        reader.onloadend = function() {
            tempObj.image = reader.result;

            $http.post("/dash/upload/service/complaint/product", tempObj)
                .success(function(docs){
                    if(docs){
                        if(step == 1){
                            console.log('docs', docs.url)
                            document.getElementById("product-input_upload").value = "";
                            $scope.productAttachment.push(docs);
                        }else if(step == 2){
                            document.getElementById("ticket-input_upload").value = "";
                            $scope.ticket.attachments.push(docs)
                        }
                        Settings.successPopup('SUCCESS','Successfully uploaded.');
                    }
                    else{
                        Settings.failurePopup('ERROR','Failed to upload. Please try after sometime.');
                    }
                    stopLoader();
                })
                .error(function(error, status){
                    // console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

        }
        reader.readAsDataURL(image[0]);
    }

    console.log('$scope.nav', $scope.nav);
    if($scope.nav.length && $scope.nav[25] && $scope.nav[25].activated){
        getSettingTypes("regalIssueType");
        getSettingTypes("regalProduct");
        getSettingTypes("regalProductCategory");
        getSettingTypes("regalStatus")
    }
    
    $scope.goBack = () => $window.history.back();
});
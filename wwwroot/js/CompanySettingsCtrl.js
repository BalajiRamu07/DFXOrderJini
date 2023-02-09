/**
 * Created by shreyasgombi on 05/07/22.
 */

 angular.module('ebs.controller')

    .controller("CompanySettingsCtrl", function($scope, $routeParams, $http, $window, Settings){
        console.log("Hello From Company Settings Controller .... !!!!");

        $scope.company = {};
        $scope.company.address = {};

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        };

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }
        
        const loadSettings = () => {
            startLoader();
            $http.get("/dash/settings/details/company_details")
                .then((settings) => {
                    stopLoader();
                    console.log(settings);
                    if(settings && settings.data){
                        if(!settings.data.status || settings.data.status != 'error'){
                            $scope.company = settings.data;
                        }else
                            console.log("Invalid Request : ", settings);
                    }
                })
        }

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
                        setTimeout(() => {
                            console.log("All Good! Google must be loaded by now ---> ");
                        }, 2000);
                    }
                }
            }else{
                console.log("Voila! Google is already loaded on your browser ---> ");
            }
        };

        loadScript(Settings.getInstanceDetails('gMapAPI'), 'text/javascript', 'utf-8');

        //... Save the company details....
        $scope.saveDetails = () => {
            $http.put("/dash/settings/update/company/details", $scope.company)
                .then(response => {
                    if(response && response.data){
                        Settings.success_toast('Success', "Company Details Updated!");
                    } else Settings.fail_toast('Error', "Something went wrong!");
                })
        }

        //.... Google Enabled, Company Address Setting....
        $scope.companyAddress = () => {
            let input = document.getElementById('company_address');
            if(input && google.maps){
                let address_autocomplete = new google.maps.places.Autocomplete(input);
                console.log(address_autocomplete);

                address_autocomplete.addListener('place_changed', function () {
                    let newplace = address_autocomplete.getPlace();

                    var lat = newplace.geometry.location.lat();
                    var long = newplace.geometry.location.lng();

                    
                    //.... We save the full address, lat and long....
                    $scope.company.address.address = newplace.formatted_address;

                    //.... For tax calculations, we save the State and Country, etc.....
                    for (var i = 0; i < newplace.address_components.length; i++) {
                        console.log(newplace.address_components[i]);
                        if(newplace.address_components[i].types[0] == "administrative_area_level_1"){
                            $scope.company.address.state = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0] == "country"){
                            $scope.company.address.country = newplace.address_components[i].long_name;
                        }
                        if(newplace.address_components[i].types[0] == "locality")
                            $scope.company.address.city = newplace.address_components[i].long_name;

                        if(newplace.address_components[i].types[0] == "postal_code")
                            $scope.company.address.pin_code = newplace.address_components[i].long_name;
                    }

                    $scope.company.address.latitude = lat;
                    $scope.company.address.longitude = long;
                });
            }else console.log("Err : Could not initialise google address input element / Error loading Google Maps SDK")
        }

        //upload company logo
        $scope.uploadLogo = function(){
            startLoader();
            let image = document.getElementById('logo-input_upload').files;

            var reader = new FileReader();
            reader.onloadend = function() {
                var tempObj = {};
                tempObj.image = reader.result;

                $http.post("/dash/upload/logo", tempObj)
                    .then(logo => {
                        console.log(logo);
                        stopLoader();
                        if(logo.data){
                            Settings.successPopup('Success','Logo successfully uploaded. Please refresh.');
                        } else {
                            Settings.failurePopup('Error','Failed to upload. Please try after sometime.');
                        }
                    })

            }
            reader.readAsDataURL(image[0]);
        };

        //upload company docs
        $scope.uploadDocuments = function(){
            startLoader();
            var image = document.getElementById('doc-input_upload').files;

            var reader = new FileReader();
            reader.onloadend = function() {
                var tempObj = {};
                tempObj.image = reader.result;

                $http.post("/dash/upload/documents", tempObj)
                    .then(docs => {
                        console.log(docs);
                        stopLoader();
                        if(docs.data){
                            Settings.success_toast('Success', 'Document successfully uploaded.');
                        } else {
                            Settings.fail_toast('Error', 'Failed to upload. Please try after sometime.');
                        }
                    })

            }
            reader.readAsDataURL(image[0]);
        }

        loadSettings();
    });
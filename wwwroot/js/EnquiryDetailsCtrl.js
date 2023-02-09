/**
 * Created by shreyasgombi on 15/09/22.
 */

 angular.module('ebs.controller')


 .controller("EnquiryDetailsCtrl",function ($scope, $routeParams, $http, Settings, $window, $location) {
     console.log("Hello From Enquiry Details Controller .... !!!!");


     //.... Ticket information....
    $scope.enquiry = {};
    $scope.enquiry_update = {};

    //... List of users...
    $scope.users = [];

    //.... Ticket ID from the params...
    const enquiry_id =  $routeParams.id;

    console.log("Enquiry Details for - ", enquiry_id);

    ///..... Function to fetch ticket details....
    const getEnquiryDetails = () => {
        if(enquiry_id){
            $http.get("/dash/enquiry/details/" + enquiry_id)
                .then((enquiry_details) => {
                    if(enquiry_details.data && (!enquiry_details.data.status || enquiry_details.data.status != 'error')){
                        if(enquiry_details.data[0].comments && enquiry_details.data[0].comments.length){
                            for(let i = 0; i < enquiry_details.data[0].comments.length; i++){
                                for(let j = 0; j < $scope.users.length; j++){
                                    console.log(enquiry_details.data[0].comments[i].added_by, $scope.users[j]._id);
                                    if(enquiry_details.data[0].comments[i].added_by == $scope.users[j]._id){
                                        enquiry_details.data[0].comments[i].user_details = $scope.users[j];
                                    }
                                }
                            }
                        }

                        $scope.enquiry = enquiry_details.data[0];

                        if(enquiry_details.data[0].lead_by && enquiry_details.data[0].lead_by._id) $scope.enquiry_update.lead_by = enquiry_details.data[0].lead_by._id;
                        if(enquiry_details.data[0].priority) $scope.enquiry_update.priority = enquiry_details.data[0].priority;
                        if(enquiry_details.data[0].due_date) $scope.enquiry_update.due_date = new Date(enquiry_details.data[0].due_date);
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
    };

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

    $scope.goBack = () => $window.history.back();

    const updateEnquiry = () => {
        $http.put("/dash/enquiry/update/followup/details/" + enquiry_id, $scope.enquiry_update)
            .then((updated_enquiry) => {
                stopLoader();
                if(updated_enquiry.data && updated_enquiry.data.status != "error"){
                    Settings.success_toast("Success", "Enquiry Comments Added / Enquiry Updated");
                    $scope.enquiry_update.comments = "";
                    getTicketDetails();
                }
            })
    }

    //... Update the ticket details...
    $scope.updateEnquiry = () => {
        console.log($scope.enquiry_update);
        
        if($scope.enquiry_update.lead_by || $scope.enquiry_update.comments || $scope.enquiry_update.comments){
            startLoader();
            Settings.confirmPopup(
                "Confirm", "Are you sure?", result => {
                    if(result) updateEnquiry();
                    else stopLoader();
                }
            )
        }
    }


    getEnquiryDetails();
    getUsers();
 })
angular.module('ebs.controller')

    .controller("InviteUsersCtrl",function ($scope, $http, Settings, $modal, $window, $location) {
        console.log("Hello From Invite Users Controller .... !!!!");

        //.... User who has logged in, check if the user is an admin.....
        let user_details = {};

        const api_timeout = 60000;

        //.... User roles defined in the system.....
        $scope.user_roles = [];
        //.... New users who will be invited....
        $scope.new_users = [];
        //.... Nav configuration, it will also have the roles....
        $scope.nav = [];

        //.... This is the definition of the new user we will be inviting....
        $scope.user = {};

         //... Start a loader....
        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }
        
        //... Stop a loader....
        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        Settings.getUserInfo(user => {
            console.log(user);
            if(!user.role || user.role == 'Admin'){
                console.log("Logged in user is an admin ....");
            }else $location.path('/overview');
        });

        Settings.getNav(false, nav => {
            console.log(nav);
            $scope.nav = nav;
            if(nav[4].roles && nav[4].roles.length)
                $scope.user_roles = nav[4].roles;
        })

        //.... Add users to the list....

        $scope.addToList = () => {
            console.log($scope.user);
            if($scope.user.email && $scope.user.role){
                if(JSON.stringify($scope.new_users).indexOf($scope.user.email) == -1){
                    $scope.new_users.push($scope.user);
                    $scope.user = {};
                } else Settings.warning_toast("ERROR", "This user is already added to the list");
            } else Settings.warning_toast("ERROR", "Please enter email address and select the role");
        };

        $scope.removeUser = index => {
            $scope.new_users.splice(index, 1);
        }

        $scope.quickInvite = () => {
            if($scope.user.email && $scope.user.role){
                startLoader();

                let request_object = {
                    url : "/dash/users/invite",
                    method : "POST",
                    timeout : api_timeout,
                    data : $scope.user
                }
                $http(request_object)
                .then((response) => {
                    stopLoader();
                    if(response.data && response.data.status != "error")
                        Settings.success_toast("SUCCESS", "Successfully Invited!");
                    else Settings.warning_toast("ERROR", response.data.message);
                    
                })
                .catch(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 500)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                });
            } else Settings.warning_toast("ERROR", "Please enter email address and select the role");
        }
    })
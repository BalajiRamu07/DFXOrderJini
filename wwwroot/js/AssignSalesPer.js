/**
 * Created by Akash on 10/03/20.
 */

angular.module('ebs.controller')

    .controller("AssignSalesPer",function ($scope, $filter, $http, $modal,$routeParams, $window,Settings, toastr, $interval,$sce,$mdDialog,$location) {
        $scope.BeatId = Number($routeParams.id);
        $scope.nav = Settings.getNav();
        console.log('$scope.nav',$scope.nav)
        $scope.userRole = $scope.nav[4].roles ? $scope.nav[4].roles: [];
        $scope.salespersonList = [];
        $scope.searchText = {};
        $scope.pjpDailyList = ["Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday","Sunday"];
        $scope.pjpDateType = {};
        $scope.BeatId = $routeParams.id;
        $scope.pjpMinDate={};
        $scope.pjpMinDate.startDate = null;
        $scope.selectedBeat = {};
        var tempBeat = {};

        $scope.renderPjp = function(response){
            $scope.allPjp = response;

            var result = $scope.allPjp.filter(
                function(items){return Number(items.beatId) == $scope.BeatId})

            console.log('result',result)
            console.log('$scope.$scope.BeatId ',$scope.BeatId)

            console.log('$scope.allPjp',$scope.allPjp)

            $scope.beatSalesPerson = result;
        }

        $http.get("/dash/pjp/"+$scope.BeatId)
            .success($scope.renderPjp);

        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                //console.log("Salesperson : ", salesperson);
                if(salesperson && salesperson.length){
                    $scope.roleSalesrep = [];
                    for(var i = 0; i < salesperson.length; i++){
                        $scope.roleSalesrep.push({sellername : salesperson[i].sellername, sellerphone : salesperson[i].sellerphone});
                    }
                    $scope.salespersonList = $scope.roleSalesrep;
                }
            });

        $scope.getRoleName = function(role){
            // console.log(role)
            var temp = '';
            if(role){
                if($scope.userRole){
                    for (var i=0 ; i<$scope.userRole.length ; i++){
                        if($scope.userRole[i].role.toUpperCase() == role.toUpperCase()){
                            temp =$scope.userRole[i].name ;
                            break;
                        }
                    }
                }
            }
            return temp ;
        };

        $scope.exists = function (item, list) {
            if(list){
                return list.indexOf(item) > -1;
            }
        };

        // $scope.salesSearchText = '';
        $scope.querySalespersonSearch =function(query) {
            if(query){
                var results =  $filter('filter')($scope.roleSalesrep, query);
                console.log('results222',results)
                console.log('allPjp',$scope.allPjp)
                $(".dealerDropdown").css('display', 'block')

                $scope.salespersonList=  results;

            }else{
                $(".dealerDropdown").css('display', 'none')
            }

        }

        $scope.selectedSalesChange =function(query,flag) {
            console.log('selectedsSalesChange', query)

            console.log('beatSalesPerson',$scope.beatSalesPerson);
            var result = $scope.beatSalesPerson.filter(
                function(items){return Number(items.sellerPhone) == Number(query.sellerphone)})

            if(flag){
                $scope.searchText.name = '';
                $scope.pjpSalesperson = query;
                // $(".dealerDropdown").css('display', 'none')
            }else{
                if(result.length){
                    Settings.alertPopup("Alert",$scope.newPjpBeat+" is already assigned to "+query.sellername);
                    $(".dealerDropdown").css('display', 'none')
                    $scope.searchText.name = '';
                }else{
                    $scope.customerVisible = [];
                    // $scope.selectedCustomers = [];
                    $scope.pjpType = 'Create';
                    $scope.searchText.name = '';
                    $scope.pjpSalesperson = query;
                    $(".dealerDropdown").css('display', 'none')
                }
            }

        }

        $scope.savePjp = function(day, person){
            //console.log(person);

            if(person != null && person != undefined && $scope.pjpDateType.group){

                var checkPjp = true;
                var pjpObj = {};
                var backToHome = true;
                if($scope.pjpDateType.group == 'date'){

                    if(!$scope.pjpDateType.date){
                        checkPjp = false;
                        Settings.alertPopup("Alert", "Please select a valid date");
                    }else{
                        pjpObj.day =  $scope.pjpDateType.date;
                        pjpObj.pjpType = $scope.pjpDateType.group
                    }

                }else if($scope.pjpDateType.group == 'range'){

                    if(!$scope.pjpDateType.startDate ||  !$scope.pjpDateType.endDate){
                        checkPjp = false;

                        Settings.alertPopup("Alert", "Please select a valid date");

                    }else{
                        var dateRange = {
                            startDate:$scope.pjpDateType.startDate,
                            endDate:$scope.pjpDateType.endDate
                        };
                        if($scope.selectedWeek.length){
                            var dateRangeWeek = {
                                dateRange: dateRange,
                                week : $scope.selectedWeek,
                            };
                            pjpObj.day =  dateRangeWeek;
                            pjpObj.pjpType = 'rangeweek'
                        }else{
                            pjpObj.day =  dateRange;
                            pjpObj.pjpType = $scope.pjpDateType.group
                        }
                    }

                }else if($scope.pjpDateType.group == 'week'){

                    if(!$scope.selectedWeek.length){
                        checkPjp = false;
                        Settings.alertPopup("Alert", "Please select Day");

                    }else{
                        var week = {
                            week : $scope.selectedWeek,
                        };
                        pjpObj.day =  week;
                        pjpObj.pjpType = $scope.pjpDateType.group
                    }
                }



                if(checkPjp){
                    var message='';
                    console.log('pjpType',$scope.pjpType)
                    if($scope.pjpType == 'Create'){
                        message = "Assign " + $scope.newPjpBeat + " to " + person.sellername + " ?";
                    }else{
                        message ='Are you sure?';
                    }



                    Settings.confirmPopup('CONFIRM',message,function(result){
                        if(result){

                                pjpObj.beatId = tempBeat.beatId;
                                pjpObj.person = person;
                                var date = new Date();
                                pjpObj.date_added = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');


                                var notifydate = '';
                                if(pjpObj.pjpType == 'date'){
                                    notifydate = moment(pjpObj.day).format('LL');
                                }else if(pjpObj.pjpType == 'week'){
                                    notifydate= "\""+ pjpObj.day.week.toString()+"\"";
                                }else if(pjpObj.pjpType == 'range'){
                                    notifydate= moment(pjpObj.day.startDate).format("DD-MMM-YYYY") +' to '+ moment(pjpObj.day.endDate).format("DD-MMM-YYYY");
                                }else if(pjpObj.pjpType == 'rangeweek'){
                                    notifydate = moment(pjpObj.day.startDate).format("DD-MMM-YYYY") +' to '+ moment(pjpObj.day.endDate).format("DD-MMM-YYYY") +'  '+"\""+ pjpObj.day.week.toString() +"\"";
                                }

                                //console.log(pjpObj)

                                if($scope.pjpType == 'edit'){
                                    pjpObj.pjpId = tempPjp.pjpId;

                                    $http.post("/dash/pjp/edit", pjpObj)
                                        .success(function (res) {
                                            //console.log(res)

                                            if(res){
                                                $scope.selectedWeek = [];
                                                $scope.diaplayEditIcon = false;
                                                $scope.selectedBeatRow = null;


                                                if($scope.pjpType == 'Create'){
                                                    Settings.success_toast('Success',$scope.newPjpBeat+" assigned to "+person.sellername+" for "+notifydate);
                                                }else{
                                                    Settings.success_toast('Success',$scope.newPjpBeat+" updated successfully ");

                                                }
                                                $location.path('/beat-plan');
                                            }
                                            else{
                                                Settings.alertPopup("Alert", $scope.newPjpBeat+" is already assigned to "+person.sellername+" for "+notifydate);
                                                $location.path('/beat-plan');
                                            }
                                        })

                                }else{
                                    $http.post("/dash/pjp/assign", pjpObj)
                                        .success(function (res) {
                                            //console.log(res)

                                            if(res){
                                                $scope.diaplayEditIcon = false;
                                                $scope.selectedBeatRow =null;

                                                // toastr.success($scope.newPjpBeat+" assigned to "+person.sellername+" for "+ notifydate);

                                                Settings.success_toast('Success',$scope.newPjpBeat+" assigned to "+person.sellername+" for "+notifydate);
                                                $location.path('/beat-plan');
                                            }
                                            else{
                                                Settings.alertPopup("Alert", $scope.newPjpBeat+" is already assigned to "+person.sellername+" for "+notifydate);

                                            }
                                        })
                                }


                            }

                    })

                }

            }
            else{
                if(!$scope.pjpDateType.group){
                    Settings.alertPopup("Alert", 'Please assign a Date');

                }else{
                    Settings.alertPopup("Alert", 'Please select a '+$scope.nav[2].display[6]);

                }


            }
        }

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };


        $scope.removePjp = function(pjp,index){
            Settings.confirmPopup('CONFIRM',"Are you sure?",function(result){
                if(result){
                    $http.delete("/dash/pjp/delete/"+pjp.pjpId).success(function(response) {
                        $http.get("/dash/pjp/"+$scope.BeatId).success(function(response) {
                            $scope.beatSalesPerson = response;
                        });
                    })
                }
            })
        }

        $scope.assignPjp = function(beat,sales){
            console.log('assignPjp',beat)
            console.log('sales',sales)
            $scope.pjpMinDate.startDate = null;


            if(beat){
                tempBeat = beat;
                $scope.newPjpBeat = beat.beatName;
                $scope.newPjpTab = 2;
                $scope.addPjpDateView = true
                $scope.addPjpButton = false;
                $scope.pjpType = 'Create';
                $scope.selectedWeek = [];
                if(sales){
                    $scope.salesSearchText = sales.sellerPhone;
                    var results =  $filter('filter')($scope.roleSalesrep,  $scope.salesSearchText);
                    console.log('results',results)
                    $scope.selectedSalesChange(results[0],'edit');
                    $scope.pjpDateType = {};
                    $scope.pjpDateType.group = sales.pjp_type;
                    $scope.pjpType = 'edit';
                    tempPjp = sales;

                    if( $scope.pjpDateType.group == 'date'){
                        $scope.pjpDateType.date = new Date(sales.day);
                    }else if($scope.pjpDateType.group == 'range'){

                        $scope.pjpDateType.startDate = new Date(sales.day.startDate);
                        var startDate = new Date(sales.day.startDate)

                        $scope.pjpMinDate.startDate = new Date(
                            startDate.getFullYear(),
                            startDate.getMonth(),
                            startDate.getDate());

                        console.log('$scope.pjpMinDate',$scope.pjpMinDate)

                        $scope.pjpDateType.endDate =new Date(sales.day.endDate);


                    }else if($scope.pjpDateType.group == 'week'){
                        $scope.selectedWeek =sales.day.week;
                    }else if($scope.pjpDateType.group == 'rangeweek'){
                        $scope.pjpDateType.startDate = new Date(sales.day.dateRange.startDate);

                        var startDate = new Date(sales.day.dateRange.startDate);

                        $scope.pjpMinDate.startDate = new Date(
                            startDate.getFullYear(),
                            startDate.getMonth(),
                            startDate.getDate());


                        $scope.pjpDateType.endDate =new Date(sales.day.dateRange.endDate);
                        $scope.selectedWeek =sales.day.week;
                        $scope.pjpDateType.group = 'range';
                    }

                }else{
                    $scope.pjpSalesperson = null;
                    $scope.pjpDateType = {};
                }


            }
        }

        if($scope.BeatId){
            $http.get("/dash/pjp/get/beats").success(function(response) {
                if(response.length){
                    var result = response.filter(
                        function(items){return Number(items.beatId) == Number($scope.BeatId)})

                    if(result.length){
                        $scope.selectedBeat = result[0];
                        $scope.assignPjp(result[0]);
                    }

                }

            })
        }


    })

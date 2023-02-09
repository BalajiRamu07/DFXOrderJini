angular.module('ebs.controller')



    .controller("AtmosphereDashboardCtrl",function ($scope, $filter, $http,Settings, $modal, $window, toastr, $interval,$sce,$mdDialog) {
        console.log("Hello From  AtmosphereDashboardCtrl Controller .... !!!!");
            var resortfilter={};
            var resortforsearch={};
            var resortdataonclick={};
            $scope.atmsDasboard ={};
            $scope.atms_Dashboard_filter = {};
            $scope.colleagueSearcgObj={};
            $scope.showmoregoals=[];


        $scope.FetchAtmosphereDashboard=function(){

                        //Fetch Goals if tab is activated
                        console.log("***** Tab 37 : ATmosphere Dashboard");
                        $scope.atmsTabName='Dashboard';
                        $scope.department_perf_groups = [];
                        $scope.showdepartments = false;
                        $scope.distinctperformance=[];
                        console.log($scope.user);

                        if($scope.user.sellerObject) {
                          if($scope.user.sellerObject.Resort){
                           resortfilter.resortname = $scope.user.sellerObject.Resort;
                           $scope.resortname = $scope.user.sellerObject.Resort;
                          }
                          else{
                            resortfilter.resortname='all';
                            $scope.resortname = 'all';

                          }

                        }
                        else{
                            resortfilter.resortname='all';
                            $scope.resortname = 'all';
                        }

//
                        $scope.atmsDasboard.dashboard_startDate = new Date();
                        $scope.atmsDasboard.dashboard_startDate = new Date($scope.atmsDasboard.dashboard_startDate.setDate($scope.atmsDasboard.dashboard_startDate.getDate() - 30));
                        $scope.atmsDasboard.dashboard_todayDate = new Date();

                        var start_date = $scope.atmsDasboard.dashboard_startDate;
                        var today = $scope.atmsDasboard.dashboard_todayDate;
                        today.setHours(0, 0, 0)
                        start_date.setHours(0,0,0)

                        resortfilter.TODAY_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
                            + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');


                        resortfilter.START_DATE = [start_date.getFullYear(), (start_date.getMonth() + 1).padLeft(), (start_date.getDate()).padLeft()].join('-') + ' '
                            + [start_date.getHours().padLeft(), start_date.getMinutes().padLeft(), start_date.getSeconds().padLeft()].join(':');

                        $scope.atms_Dashboard_filter.TODAY_DATE = resortfilter.TODAY_DATE;
                        $scope.atms_Dashboard_filter.START_DATE = resortfilter.START_DATE;
                                                $http.post("/dash/allGoals/resorts",resortfilter).success(function(response){
                                                     console.log(response);
                                                    if(response){
                                                        $scope.resortbuttons=response;
                                                        if($scope.user.sellerObject){
                                                            for(var i=0; i<$scope.resortbuttons.length; i++){
                                                                if($scope.resortbuttons[i] == $scope.user.sellerObject.Resort){
                                                                    $scope.getResortCount($scope.resortbuttons[i], i)
                                                                    $scope.loggedInResort = $scope.resortbuttons[i];
                                                                }
                                                            }
                                                        }
                                                    }
                                                });



                        $http.post("/dash/goals/calculation/weekly",resortfilter).success(function(goals_pendingcount)
                                    {
                                        console.log("Goals Pending Count......." + goals_pendingcount.length);
                                        // console.log(goals_pendingcount)
                                        $scope.atmsDashboardData = goals_pendingcount;
                                        if($scope.atmsDashboardData.length){
                                          //  console.log($scope.atmsDashboardData)
                                            if($scope.atmsDashboardData[0]._id.DEPARTMENT){
                                                $scope.departmentValue = $scope.atmsDashboardData[0]._id.DEPARTMENT;
                                                resortfilter.DEPARTMENT = $scope.departmentValue;
                                                $scope.showdepartments = true;
                                                $scope.pageNumber = 0;
                                                resortdataonclick.resort='all';
                                               console.log(resortfilter);
                                                $http.post("/dash/atms/employeescore",resortfilter).success(function(response){
                                                    // console.log(response)
                                                    if(response){
                                                        $scope.empatmsIndividualReport = response;
                                                        $scope.groupallColleaguesFunc($scope.empatmsIndividualReport);
                                                    }
                                                });
                                                $http.post("/dash/atms/employeescorecount",resortfilter).success(function(response){

                                                    if(response){
                                                        // console.log("count funct" + response.length);

                                                        $scope.groupallColleaguescountFunc(response);
                                                    }

                                                });

                                                $http.post("/dash/allGoals/resorts",resortfilter).success(function(response){
                                                    // console.log(response);
                                                    if(response){
                                                        $scope.resortbuttons=response;
                                                        if($scope.user.sellerObject){
                                                            for(var i=0; i<$scope.resortbuttons.length; i++){
                                                                if($scope.resortbuttons[i] == $scope.user.sellerObject.Resort){
                                                                    $scope.getResortCount($scope.resortbuttons[i], i)
                                                                    $scope.loggedInResort = $scope.resortbuttons[i];
                                                                }
                                                            }
                                                        }
                                                    }
                                                });

                                                $http.post("/dash/atms/dashboard/department",resortfilter).success(function (response) {
                                                    // console.log("Show department goals" + response.length);
                                                    $scope.department_perf_groups = response;
                                                });

                                            }


                                            if(goals_pendingcount.length) {
                                                for (var i = 0; i < goals_pendingcount.length; i++) {
                                                    $scope.atmsDashboardData[i].pendingCircle = (100 * goals_pendingcount[i].pending_goals) / $scope.atmsDashboardData[i].total_goals;
                                                    $scope.atmsDashboardData[i].NcCircle = goals_pendingcount[i].nc_goals ? ((100 * goals_pendingcount[i].nc_goals) / $scope.atmsDashboardData[i].total_goals) : 0;
                                                }

                                            }
                                        }


                                    });



        }
        $scope.FetchAtmosphereDashboard();

            //Dashboard colleague ng-repeat group by func 1---shradha
            $scope.groupallColleaguesFunc=function(data){
                  console.log("groupallColleaguesFunc=function");
                 // console.log(data)
                $scope.colleague_perf_groups = [];
                $scope.perfgroup = [];
                // $scope.groupedcolleagues=[]


                if(data.length){
                    for (var i = 0; i < data.length; i++) {
                        var temp_perf =data[i];
                        // console.log(temp_perf);

                        if (!$scope.checkIfallColleaguePerfGrouped(temp_perf)) {
                            $scope.perfgroup = {
                                EVALUATION: temp_perf._id.EVALUATION,
                                RESORT:temp_perf.resort,
                                DEPARTMENT:temp_perf.department,
                                EVALUATION_TYPE:temp_perf.evaluation_type,
                                cloudinaryurl:temp_perf.cloudinaryURL ? temp_perf.cloudinaryURL : '',

                                goals: []

                            };
                            $scope.colleague_perf_groups.push($scope.perfgroup);
                            $scope.perfgroup.goals.push(temp_perf);
                        }
                        if(i == data.length-1){
                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                        }
                    }
                    // console.log("Grouped data last")
                    // console.log($scope.colleague_perf_groups);
                    if($scope.colleague_perf_groups) {
                        for (var j = 0; j < $scope.colleague_perf_groups.length; j++) {
                            $scope.colleague_perf_groups[j].weightagesum =0;
                            $scope.colleague_perf_groups[j].Scoretotal=0;
                            $scope.colleague_perf_groups[j].colleagueFinalScore=0;

                            //    $scope.colleague_perf_groups[j].EVALUATION_TYPE = $scope.colleague_perf_groups[j].goals[k].evaluation_type;

                            for(var k=0;k<$scope.colleague_perf_groups[j].goals.length;k++){
                                // console.log($scope.colleague_perf_groups[j].goals[k].weightage)
                                $scope.colleague_perf_groups[j].colleague_code=$scope.colleague_perf_groups[j].goals[k].colleauge_code[0];
                                $scope.colleague_perf_groups[j].employee_name=$scope.colleague_perf_groups[j].goals[k].employee_name[0]
                                $scope.colleague_perf_groups[j].department=$scope.colleague_perf_groups[j].goals[k].department;
                                $scope.colleague_perf_groups[j].designation=$scope.colleague_perf_groups[j].goals[k].designation[0]
                                $scope.colleague_perf_groups[j].weightagesum += ($scope.colleague_perf_groups[j].goals[k].average ? $scope.colleague_perf_groups[j].goals[k].weightage: 0)
                                $scope.colleague_perf_groups[j].Scoretotal += ($scope.colleague_perf_groups[j].goals[k].average ? $scope.colleague_perf_groups[j].goals[k].average : 0) * $scope.colleague_perf_groups[j].goals[k].weightage;
                                if(k== $scope.colleague_perf_groups[j].goals.length-1){
                                    $scope.colleague_perf_groups[j].colleagueFinalScore = ($scope.colleague_perf_groups[j].Scoretotal / ($scope.colleague_perf_groups[j].weightagesum * 5))*100
                                }
                            }

                        }

                    }
                }
                else{
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");
                }

            }

                //Dashboard colleagues count func 1
                $scope.groupallColleaguescountFunc=function(data){
                    // console.log("Data.....")
                    // console.log(data)
                    $scope.totalcolleagues=0;
                    $scope.colleague_perf_groups_count = [];
                    $scope.perfgroup_count = [];


                    // console.log(data)
                    for (var i = 0; i < data.length; i++) {
                        var temp_perf =data[i];
                        // console.log(data[i]._id.EVALUATION);

                        if (!$scope.checkIfallColleaguePerfGroupedcount(temp_perf)) {
                            $scope.perfgroup = {
                                EVALUATION: temp_perf._id.EVALUATION,
                                goals: []

                            };
                            $scope.colleague_perf_groups_count.push($scope.perfgroup);
                            $scope.perfgroup.goals.push(temp_perf);
                        }
                    }

                    $scope.totalcolleagues=$scope.colleague_perf_groups_count.length;
                    // console.log("Resort count")
                    // console.log($scope.colleague_perf_groups_count)
                }
                    //Dashboard colleague count func 2
                    $scope.checkIfallColleaguePerfGroupedcount=function(perf_groups){
                        for(var i=0;i<$scope.colleague_perf_groups_count.length;i++) {
                            for (var j = 0; j < $scope.colleague_perf_groups_count[i].goals.length; j++) {

                                if ($scope.colleague_perf_groups_count[i].goals[j]._id.EVALUATION == perf_groups._id.EVALUATION) {
                                    $scope.colleague_perf_groups_count[i].goals.push(perf_groups);
                                    return true;
                                }
                                else {
                                    if (i == $scope.colleague_perf_groups_count.length - 1 && j == $scope.colleague_perf_groups_count[i].goals.length-1) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                        //Dashboard colleague ng-repeat group by func 2
                        $scope.checkIfallColleaguePerfGrouped=function(perf_groups){
                            for(var i=0;i<$scope.colleague_perf_groups.length;i++) {
                                for (var j = 0; j < $scope.colleague_perf_groups[i].goals.length; j++) {

                                    if ($scope.colleague_perf_groups[i].goals[j]._id.EVALUATION == perf_groups._id.EVALUATION) {
                                        $scope.colleague_perf_groups[i].goals.push(perf_groups);
                                        return true;
                                    }
                                    else {
                                        if (i == $scope.colleague_perf_groups.length - 1 && j == $scope.colleague_perf_groups[i].goals.length-1) {
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                            $scope.formatDashboardDate = function (date) {
                                if (date == undefined)
                                    return;
                                var d = new Date(date);
                                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                                var dateOut = d.getDate() + " - " + monthNames[d.getMonth()] + " - " + (d.getFullYear());

                                $scope.mapTransactionDate = d.getDate() + " - " + monthNames[d.getMonth()] + " - " + (d.getFullYear());

                                return dateOut;
                            };

                                $scope.getResortCount=function(resort,index,deptIndex,department) {
                                    console.log("Resort function");
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "inline");
                                    $scope.department_perf_groups = [];
                                    $scope.showdepartments = false;
                                        $scope.pageNumber=0;

                                        $scope.resortnumber = index;
                                        if(resort){
                                            $scope.resortname = resort;
                                            resortfilter.resortname = resort;
                                            resortdataonclick.resort = resort;

                                        }
                                        else{
                                            resortfilter.resortname = $scope.resortname;
                                            resortdataonclick.resort = $scope.resortname;

                                        }

                                    var start_date = $scope.atmsDasboard.dashboard_startDate;
                                    var today = $scope.atmsDasboard.dashboard_todayDate;
                                    today.setHours(0, 0, 0)
                                    start_date.setHours(0,0,0)

                                    resortfilter.TODAY_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
                                        + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');

                                    resortfilter.START_DATE = [start_date.getFullYear(), (start_date.getMonth() + 1).padLeft(), (start_date.getDate()).padLeft()].join('-') + ' '
                                        + [start_date.getHours().padLeft(), start_date.getMinutes().padLeft(), start_date.getSeconds().padLeft()].join(':');

                                    $scope.atms_Dashboard_filter.TODAY_DATE = resortfilter.TODAY_DATE;
                                    $scope.atms_Dashboard_filter.START_DATE = resortfilter.START_DATE;

                                        $http.post("/dash/goals/calculation/weekly", resortfilter).success(function (goals_pendingcount) {
                                             console.log("Goals Resort Count......." + goals_pendingcount.length);
                                            // console.log(goals_pendingcount);
                                            if(goals_pendingcount.length){
                                                $scope.showNoGoals = false;
                                                $scope.atmsDashboardData = goals_pendingcount;

                                                if(department){
                                                    $scope.departmentValue = department;
                                                    resortfilter.DEPARTMENT = $scope.departmentValue;
                                                    $scope.pageNumber=deptIndex;

                                                }
                                                else{
                                                    if($scope.atmsDashboardData[0]){
                                                        $scope.departmentValue = $scope.atmsDashboardData[0]._id.DEPARTMENT;
                                                        resortfilter.DEPARTMENT = $scope.departmentValue;

                                                    }
                                                    else{
                                                        $scope.departmentValue = '';
                                                        resortfilter.DEPARTMENT = $scope.departmentValue;
                                                    }
                                                }


                                                    for (var i = 0; i < goals_pendingcount.length; i++) {
                                                        $scope.atmsDashboardData[i].pendingCircle = (100 * goals_pendingcount[i].pending_goals) / $scope.atmsDashboardData[i].total_goals;
                                                        $scope.atmsDashboardData[i].NcCircle = (100 * goals_pendingcount[i].nc_goals) / $scope.atmsDashboardData[i].total_goals;
                                                    }

                                               // console.log(resortfilter)
                                                if ($scope.resortname && $scope.departmentValue) {
                                                    $scope.showdepartments = true;
                                                    resortdataonclick.resort=$scope.resortname;
                                                    $http.post("/dash/atms/dashboard/department",resortfilter).success(function (response) {
                                                        console.log("Show department goals" + response.length);
                                                        if(response){
                                                            $scope.department_perf_groups = response;
                                                        }

                                                    });

                                                    $http.post("/dash/atms/employeescore",resortfilter).success(function(response){
                                                        console.log("colleagues data....1")
                                                        console.log(response)
                                                        if(response){
                                                            // $scope.empatmsIndividualReport = response;
                                                            $scope.groupallColleaguesFunc(response);
                                                        }
                                                        else{
                                                            jQuery.noConflict();
                                                            $('.refresh').css("display", "none");
                                                        }

                                                        // console.log($scope.empatmsIndividualReport)

                                                    });
                                                    $http.post("/dash/atms/employeescorecount",resortfilter).success(function(response){

                                                        if(response){

                                                            $scope.groupallColleaguescountFunc(response);
                                                        }

                                                    });


                                                }
                                                else{
                                                    $http.post("/dash/atms/employeescore",resortfilter).success(function(response){
                                                        console.log("colleagues data")
                                                        console.log(response)
                                                        if(response){
                                                            // $scope.empatmsIndividualReport = response;
                                                            $scope.groupallColleaguesFunc(response);
                                                        }
                                                        else{
                                                            jQuery.noConflict();
                                                            $('.refresh').css("display", "none");
                                                        }

                                                        // console.log($scope.empatmsIndividualReport)

                                                    });
                                                    $http.post("/dash/atms/employeescorecount",resortfilter).success(function(response){

                                                        if(response){

                                                            $scope.groupallColleaguescountFunc(response);
                                                        }

                                                    });
                                                }


                                            }
                                            else{
                                                $scope.atmsDashboardData ={};
                                                $scope.colleague_perf_groups = [];
                                                $scope.department_perf_groups=[];
                                                $scope.showNoGoals = true;
                                                $scope.totalcolleagues = 0;
                                                jQuery.noConflict();
                                                $('.refresh').css("display", "none");
                                            }

                                        });

                                }

    $scope.searchColleaguename=function(empname){
        // console.log(empname)
        var temporaryDate =new Date();
        $scope.dashboard_startDate = new Date();
        $scope.dashboard_startDate = new Date($scope.dashboard_startDate.setDate($scope.dashboard_startDate.getDate() - 30));
        $scope.dashboard_todayDate = new Date();
        var start_date = new Date(temporaryDate.setDate(temporaryDate.getDate() - 30));
        var today = new Date();
        today.setHours(0, 0, 0)
        resortfilter.TODAY_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
            + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');
        start_date.setHours(0,0,0)

        resortforsearch.TODAY_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
            + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');
        start_date.setHours(0,0,0)

        resortforsearch.START_DATE = [start_date.getFullYear(), (start_date.getMonth() + 1).padLeft(), (start_date.getDate()).padLeft()].join('-') + ' '
            + [start_date.getHours().padLeft(), start_date.getMinutes().padLeft(), start_date.getSeconds().padLeft()].join(':');

        resortforsearch.resortname = $scope.resortname;
        resortforsearch.DEPARTMENT = $scope.departmentValue;
        resortforsearch.employeename=empname; //--- This can be either employee name or employee code

        if(resortforsearch.employeename) {

            $http.post("/dash/atms/employeescore/search",resortforsearch).success(function (response) {
                if(response.length){
                     console.log(response)
                    $scope.empatmsIndividualReport = response;
                    $scope.groupColleaguesFunc($scope.empatmsIndividualReport);

                }
                else{
                $scope.colleague_perf_groups=[];

                }


            })
        }
        else{
            $http.post("/dash/atms/employeescore",resortforsearch).success(function(response){

                if(response.length){


                    $scope.empatmsIndividualReport = response;
                    $scope.groupallColleaguesFunc($scope.empatmsIndividualReport);
                    // $scope.groupallColleaguescountFunc(($scope.empatmsIndividualReport))


                }
                                else{
                                $scope.colleague_perf_groups=[];

                                }
            });
            $http.post("/dash/atms/employeescorecount",resortforsearch).success(function(response){

                if(response){


                    // $scope.empatmsIndividualReport = response;
                    // $scope.groupallColleaguesFunc(response);
                    $scope.groupallColleaguescountFunc(response)


                }
            });

        }


    }
        $scope.openRatingsDetails = function (goal) {
//        console.log("Rating Details.....");
            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            goal.TODAY_DATE = $scope.atms_Dashboard_filter.TODAY_DATE;
            goal.START_DATE = $scope.atms_Dashboard_filter.START_DATE;

            $http.post("/dash/atms/deptGoals",goal).success(function (response) {
                if(response){
                    $scope.employeeRatingDetails  = response;
                    $scope.employeeRatingDetails.average = goal.average;
                    $scope.employeeRatingDetails.goalstatement = goal.goalstatement;
                    $scope.employeeRatingDetails.DEPARTMENT = goal.DEPARTMENT;
                    $scope.employeeRatingDetails.RESORT = goal.RESORT;
                   // console.log($scope.employeeRatingDetails)
//                    jQuery.noConflict();
//                    $('#ratingDetailsModal').modal('show');
//                    $('.refresh').css("display", "none");
                }
            })
        };
            $scope.getScoreCard = function(id,score){
                // console.log(id)
                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                $scope.scoreofemp=score;
                $scope.showmoregoals=[];
                $scope.employeecloudinary='';
                var start_date = $scope.atmsDasboard.dashboard_startDate;
                var today = $scope.atmsDasboard.dashboard_todayDate;
                today.setHours(0, 0, 0)
                start_date.setHours(0,0,0)

                resortfilter.TODAY_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
                    + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');


                resortfilter.START_DATE = [start_date.getFullYear(), (start_date.getMonth() + 1).padLeft(), (start_date.getDate()).padLeft()].join('-') + ' '
                    + [start_date.getHours().padLeft(), start_date.getMinutes().padLeft(), start_date.getSeconds().padLeft()].join(':');
                resortfilter.id = id;


                $http.get("/dash/atmssellercloudinary/"+ id) .success(function(response){
                    console.log(response)
                    $scope.employeecloudinary=response.cloudinaryURL;
                })

                $http.post("/dash/atms/empScoreCards",resortfilter)
                .success(function(response){
                    // console.log("data from api"+ response.length);
                    $scope.scoreCards = response;
                   /* console.log("scorecard data")
                    console.log($scope.scoreCards);*/
                    if($scope.scoreCards){
                        $scope.groupByScore($scope.scoreCards);
                    }
                })
            }
                $scope.groupByScore = function(data) {

                    $scope.allScoreCards = [];
                     $scope.scoregroup = [];
                     // var temp_sc
                    if(data.length){
                        for (var i = 0; i < data.length; i++) {
                            for(var j=0;j<data[i].goals.length;j++) {
                                data[i].goals[j].PERFORMANCE_DATE = data[i]._id.PERFORMANCE_DATE;
                                var temp_perf = data[i].goals[j];
                                if (!$scope.checkIfScoreGrouped(temp_perf)) {
                                    $scope.scoregroup = {

                                        EVALUATION_TYPE: temp_perf.EVALUATION_TYPE,
                                        goals: []

                                    };
                                    $scope.allScoreCards.push($scope.scoregroup);
                                    $scope.scoregroup.goals.push(temp_perf);
                                }
                            }
                        }

                        if($scope.allScoreCards){
                            console.log($scope.allScoreCards)
                            $scope.allScoreCards.employeename=$scope.scoreCards[0].employee_name;
                            $scope.allScoreCards.designation=$scope.scoreCards[0].designation;
                            $scope.allScoreCards.department=$scope.scoreCards[0].department;
                            $scope.allScoreCards.colleaguecode=$scope.scoreCards[0].colleauge_code;
                            $scope.allScoreCards.score=$scope.scoreofemp ? $scope.scoreofemp:0;
                            $scope.allScoreCards.Manager=$scope.scoreCards[0].Manager;
                            $scope.allScoreCards.Evaluation=$scope.scoreCards[0]._id.EVALUATION;

                        }
//                        jQuery.noConflict();
//                        $('#employeeScorecardModal').modal('show');
//                        $('.refresh').css("display", "none");
                    }
                    else{
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                    }


                    // console.log("all score")
                    // console.log($scope.allScoreCards)

                }

    $scope.checkIfScoreGrouped = function(score){

        for(var i=0;i<$scope.allScoreCards.length;i++) {
            for (var j = 0; j < $scope.allScoreCards[i].goals.length; j++) {
                if ($scope.allScoreCards[i].goals[j].EVALUATION_TYPE == score.EVALUATION_TYPE) {
                    $scope.allScoreCards[i].goals.push(score);
                    return true;
                }
                else {
                    if (i == $scope.allScoreCards.length - 1 && j == $scope.allScoreCards[i].goals.length-1) {
                        return false;
                    }
                }
            }
        }

    }
        $scope.showHideGoals=function(index){

            $scope.showmoregoals[index] = !$scope.showmoregoals[index];
        }


        });
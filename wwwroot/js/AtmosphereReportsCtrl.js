angular.module('ebs.controller')

    .controller("AtmosphereReportsCtrl",function ($scope, $filter, $http,Settings, $modal, $window, toastr, $interval,$sce,$mdDialog) {
        console.log("Hello From AtmosphereReportCtrl Controller .... !!!!");

        //ATMOSPHERE DECLARATIONS
        $scope.allGoals = [];
        $scope.reportGoals = [];
        $scope.goalsResort = [];
        $scope.totalcolleagues=0;
        $scope.showmoregoals=[];
        // $scope.atmsseller={};
        $scope.showsearchedgoals=false;
        $scope.goalSearch = {};
        $scope.EmployeeSearch = {};
        $scope.goalEmployeecode={};
        $scope.searchcolleaguefromgoalsBody={};
        $scope.goalsevaluation=[];
        $scope.goalssearch={};
        $scope.goalssearchwithemployee={}

        $scope.goalSearch.filter = '';
        var goalSearchObj = {};
        var resortfilter={};
        var resortforsearch={}
        var resortdataonclick={}
        var viewBy = {};
        viewBy.goals = 12;
        var goalSearchBy = ['RESORT','GOAL_ID', 'GOAL_STATEMENT', 'ROLE', 'DEPARTMENT', 'WEIGHTAGE', 'EVALUATION_TYPE', 'EVALUATION', 'EVALUVATOR', 'EVALUATION_BY_ROLE', 'RATING_SCALE'];
        var ncNrSearchBy = ['sellername','EMPLOYEE_ID','sellerid','DEPARTMENT','role'];
        $scope.editGoal = {};
        $scope.editGoalEvaluation = [];
        $scope.newGoal = {};
        // $scope.newGoal.RATING_SCALE = [];
        $scope.addGoalButton = true;
        $scope.newEvaluationType = {};
        $scope.settingsEvaluation = [];
        $scope.settingsDepartment = [];
        $scope.editEvaluationType = [];
        $scope.editDepartmentSetup = [];
        $scope.formName = {};
        $scope.formName.name = '';
        $scope.editFormLabel = [];
        $scope.formLabels = [];
        $scope.newLabelModal = '';
        $scope.assignUI = [];
        $scope.allPerformance = [];
        $scope.managerSelectedList = [];

        $scope.reportsGoalSearch = {};
        // $scope.reportsGoalSearch.filter = '';

        var reportsGoalSearchObj = {};
        // $scope.pageNumber=0;
        var reportsNcNrObj = {};
        $scope.reportsNcNr = {};
        $scope.reportsNcNr.filter = '';
        $scope.atmsFilter5 = true;
        viewBy.reportsGoals = 12;
        $scope.atmsColleagues = [];
        var colleaguesSearchObj = {};
        $scope.colleaguesReportSearch = {};
        $scope.colleaguesReportSearch.filter = '';
        var colleaguesSearchBy = ['sellername','EMPLOYEE_ID','DEPARTMENT','role','Designation','Supervisor_Code','Supervisor_Name','Supervisor_Designation','Assistant_Manager_Code','Assistant_Manager_Name','Assistant_Manager_Designation','Manager_Code','Manager_Name','Manager_Designation'];
        $scope.colleaguesReportFilter = {};

        $scope.atmsIndividualReport = {};
        var individualReportSearchObj = {};
        var atmsdashboardSearch={}
        $scope.individualReportSearch = {};
        $scope.individualReportSearch.filter = '';
        var individualReportSearchBy = ['goal_statement'];
        $scope.individualReportFilter = {};
        $scope.allIndividualReportData = [];
        $scope.individualReportFilter.startDate = '';
        $scope.individualReportFilter.endDate = new Date();
        $scope.individualReportFilter.endDate.setHours(23, 59, 59, 59);
        $scope.atmsIndividualReportDays =0;
        $scope.resortname='';
        var scoreCardObj = {};
        $scope.scoreCardFilterObj = {};
        $scope.scoreCardFilterObj.filter = '';
        viewBy.scoreCard = 12;
        var scoreCardSearchBy = ['sellername'];
        $scope.showdepartments=false;

        var reportsDashboardSearchObj = {};
        $scope.reportsDashboardSearch = {};
        $scope.reportsDashboardSearch.filter = '';
        var dashboardReportSearchBy = ['statement','score','personal_details'];
        $scope.colleagueSearcgObj={}
        var atmsUsersSearchObj = {};
        $scope.atmsUsersSearch = {};
        $scope.atmsUsersSearch.filter = '';

        $scope.branchName = ''
        $scope.atmsDasboard ={};
        $scope.atms_Dashboard_filter = {}
        $scope.flagforncNr=false;
        $scope.qbConnect = false;
        $scope.showLoader = false;
        $scope.distinctperformance=[];
        $scope.atmsTabs = [];
        $scope.enabledReports = []

        $scope.individualReport_count = 0;

        //End of Atmosphere Declarations

        $scope.viewLength = 0;
        $scope.newViewBy = 10;
        var localViewBy = $scope.newViewBy;
        var initialViewBy = 60;
        var sellerSearchBy = ['sellername','sellerphone','role','email','userStatus', 'appVersion','EMPLOYEE_ID','Resort'];
        $scope.atmsTabName = "Atmosphere Reports";

        Settings.getNav(true, function(nav){
            console.log("nav -=>", nav)
            $scope.atmsTabs = [];
            if(nav[29].cols){
                for(var l=0;l<nav[29].cols.length;l++) {
                    if(nav[29].cols[l]){
                        if (nav[29].cols[l].flag == true) {
                            $scope.enabledReports.push(nav[29].cols[l]);
                        }
                        nav[29].cols[l].reportTab = l + 1;
                    }
                }
            }
            console.log("$scope.enabledReports", $scope.enabledReports);
            $scope.nav = nav;
        })

        if($scope.nav[29].cols){
            for(var k=0;k<$scope.nav[29].cols.length;k++) {
                if ($scope.nav[29].cols[k].flag == true) {
                    $scope.atmsTabs.push($scope.nav[29].cols[k]);
                }
            }
            console.log('$scope.atmsTabs = [];',$scope.atmsTabs)
        }

        $scope.atmsReportView = function(id, name,newViewBy){

            console.log("id, name, newviewyb -=-=-=->", id, name, newViewBy)
            $scope.atmsTabName = name;
            $scope.atmsTab = id;
            $scope.newViewBy = parseInt(newViewBy);
    
    
            if(id == 0){
                $scope.showATMSReports = false;
                $scope.atmsTabName = "Atmosphere Reports";
            }
            if(id == 1){
                $scope.showATMSReports = true;
                $scope.atmsTab = 1;
                $scope.atmsTabName = "Goals Report";
    
                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.reportsGoals;
                /* $scope.showGoalFilter = false;
                 $scope.atmsFilter1 = false;*/
                $scope.reportsGoalSearch.filter = '';
                $scope.reportsGoalSearch.allRole = '';
                if($scope.user.sellerObject){
                    $scope.reportsGoalSearch.allResort = $scope.user.sellerObject.Resort;
                    reportsGoalSearchObj.resort = $scope.user.sellerObject.Resort;
                }
                else{
                    $scope.reportsGoalSearch.allResort = '';
                    reportsGoalSearchObj.resort = '';
                }
                $scope.reportsGoalSearch.allDepartment = '';
                $scope.reportsGoalSearch.evaluationBy = '';
                $scope.reportsGoalSearch.allFrequency = '';
    
    
                reportsGoalSearchObj.viewLength = 0;
                reportsGoalSearchObj.viewBy = initialViewBy;
                reportsGoalSearchObj.searchBy = $scope.reportsGoalSearch.filter;
                reportsGoalSearchObj.searchFor = goalSearchBy;
                reportsGoalSearchObj.dept = '';
                reportsGoalSearchObj.allFrequency = '';
                reportsGoalSearchObj.evaluationBy = '';
                reportsGoalSearchObj.role = '';
    
    
                $scope.reportGoals = [];
                // $scope.tempGoals = []
    
                $http.post("/dash/goals", reportsGoalSearchObj)
                    .success($scope.renderGoals);
    
                $http.post('/dash/reportAllGoals', reportsGoalSearchObj)
                    .success(function (response) {
                        $scope.reportALLGoals = response; // --- dropdowns after department
                    })
    
                $http.post('/dash/goals/count', reportsGoalSearchObj)
                    .success(function (response) {
                        console.log("Goals count--------->>>", response);
                        $scope.atmsReportTransactionCount(response, 1)
                    });
    
    
            }
            if(id == 2){
                $scope.showATMSReports = true;
                $scope.atmsTab = 2;
                $scope.atmsTabName = "Colleagues Report";
                $scope.reportsAllColleagues = [];
                $scope.atmsColleagues = [];
    
                $scope.showColleaguesFilter =false;
                $scope.atmsFilter2 = false;
                $scope.colleaguesReportSearch.filter ='';
                colleaguesSearchObj.viewLength = 0;
                colleaguesSearchObj.viewBy = initialViewBy;
                // colleaguesSearchObj.searchFor = $scope.colleaguesReportSearch.filter;
                // colleaguesSearchObj.searchBy = colleaguesSearchBy;
                colleaguesSearchObj.searchFor = $scope.colleaguesReportSearch.filter;
                colleaguesSearchObj.searchBy = sellerSearchBy;
                colleaguesSearchObj.DEPARTMENT ='';
                colleaguesSearchObj.Designation ='';
                colleaguesSearchObj.Supervisor_Name ='';
                colleaguesSearchObj.Assistant_Manager_Name ='';
                colleaguesSearchObj.Manager_Name ='';
                if($scope.user.sellerObject){
                    $scope.colleaguesReportFilter.allResort = $scope.user.sellerObject.Resort;
                    colleaguesSearchObj.resort = $scope.user.sellerObject.Resort;
                    $http.post("/dash/reports/ATMS/colleagues", colleaguesSearchObj)
                        .success(function(res){
                            // console.log("Department.....")
                            // console.log(res)
                            $scope.reportsAllColleagues = res;
                            

                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                        });
                }
                else{
                    $scope.colleaguesReportFilter.allResort = '';
                    colleaguesSearchObj.resort ='';
                }
                $scope.colleaguesReportFilter.all_Department = '';
                $scope.colleaguesReportFilter.all_Designation = '';
                $scope.colleaguesReportFilter.all_Supervisor_Name = '';
                $scope.colleaguesReportFilter.all_Assistant_Manager_Name = '';
                $scope.colleaguesReportFilter.all_Manager_Name = '';
                $scope.usersResorts = [];
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }
    
                $http.post("/dash/reports/atms/sellers", colleaguesSearchObj)
                    .success(function (res){
                        console.log('response -=>> ', res);
                        $scope.atmsColleagues = res;
                    });
                //
                // $http.post("/dash/reports/ATMS/colleagues", colleaguesSearchObj)
                //     .success(function(res){
                //         $scope.reportsAllColleagues = res;
                //     });
    
                $http.get("/dash/usersResorts")
                    .success(function (res) {
                        $scope.usersResorts = res;
                    });
    
    
                $http.post("/dash/colleagues/count", colleaguesSearchObj)
                    .success(function (res) {
                        /* console.log("colleagues count");
                         console.log(res)*/
                        $scope.atmsReportTransactionCount(res, 2);
                    })
    
            }
            if(id == 3){
                $scope.showATMSReports = true;
                $scope.atmsTab = 3;
                $scope.atmsTabName = "Department Report";
                $scope.atmsDashboardReportDays = 0;
                $scope.performanceResorts = []; // push resorts from performance
                $scope.performanceDepartments = []; // push dept from performance
                $scope.performanceRole = []; // push role from performance
    
                $scope.dashboardFiltersTag = false
    
                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.reportsGoals;
                $scope.showDashBoardFilter = false;
                $scope.atmsFilter3 = false;
                $scope.reportsDashboardSearch = {}
    
                reportsDashboardSearchObj.viewLength = 0;
                reportsDashboardSearchObj.viewBy = initialViewBy;
                reportsDashboardSearchObj.searchBy = [];
                reportsDashboardSearchObj.searchFor = '';
                reportsDashboardSearchObj.dept = '';
                reportsDashboardSearchObj.allFrequency = '';
                reportsDashboardSearchObj.evaluationBy = '';
                reportsDashboardSearchObj.role = '';
                reportsDashboardSearchObj.from = '';
                reportsDashboardSearchObj.end = '';
    
                $scope.temp_groups = [];
                $scope.reportDashboard_count = 0;
    
                $scope.reportsDashboardSearch.startDate = '';
                $scope.reportsDashboardSearch.endDate = new Date();
                $scope.reportsDashboardSearch.endDate.setHours(23, 59, 59, 59);
    
                $http.post("/dash/dashBoard/reports", reportsDashboardSearchObj)
                    .success(function(res_dashboard)
                    {
                        $scope.temp_groups = res_dashboard;
                        // $scope.reportDashboard_count = res_dashboard.length
                        $scope.groupReportsFunc(res_dashboard);
                        $scope.atmsReportTransactionCount(res_dashboard,3)
                    });
            }
            if(id == 4){
                $scope.showATMSReports = true;
                $scope.atmsIndividualReport =[];
                $scope.atmsTab = 4;
                $scope.atmsTabName = "Individual Report";
                $scope.atmsIndividualReportDays =0;
                $scope.searchColleagueBody = {};
                if($scope.user.sellerObject)
                    $scope.searchColleagueBody.resort = $scope.user.sellerObject.Resort;
    
                $scope.showIndividualReportFilter =false;
                $scope.atmsFilter4 = false;
                $scope.individualReportSearch.filter ='';
                individualReportSearchObj.viewLength = 0;
                individualReportSearchObj.viewBy = initialViewBy;
    
                individualReportSearchObj.searchFor = [];
                individualReportSearchObj.searchBy = '';
                individualReportSearchObj.department ='';
                individualReportSearchObj.colleauge_code ='';
                individualReportSearchObj.startDate ='';
                individualReportSearchObj.endDate ='';
    
                $scope.individualReportFilter.all_Department ='';
                $scope.individualReportFilter.all_Colleague_Code ='';
                $scope.individualReportFilter.startDate ='';
                $scope.individualReportFilter.endDate = new Date();
                $scope.individualReportFilter.endDate.setHours(23, 59, 59, 59);
    
                $scope.viewLength = 0;
                if(!newViewBy){
                    $scope.newViewBy = parseInt(localViewBy);
                }
    
                $http.post("/dash/reports/atms/individual", individualReportSearchObj)
                    .success($scope.renderIndividualReports);

                $scope.atmsReportTransactionCount($scope.atmsIndividualReport.length, 4);
    
            }
            if(id == 5){
                console.log("atmsReportView--------->>>")
                $scope.atmsReportsDuration = 0;
    
                $scope.showATMSReports = true;
                $scope.atmsTab = 5;
                $scope.atmsTabName = "NC/NR Report";
                $scope.ncnrResorts =[];
                $scope.viewLength = 0;
                $scope.ncNr_count = 0;
                $scope.newViewBy = viewBy.reportsGoals;
                $scope.reportsNcNr.filter = '';
                $scope.reportsNcNr.startDate = '';
                $scope.reportsNcNr.endDate = new Date();
                $scope.reportsNcNr.endDate.setHours(23, 59, 59, 59);
                $scope.reportsNcNr.allDepartment = '';
    
                reportsNcNrObj.viewLength = 0;
                reportsNcNrObj.viewBy = initialViewBy;
                reportsNcNrObj.searchBy = [];
                reportsNcNrObj.searchFor = '';
                reportsNcNrObj.from = '';
                reportsNcNrObj.end = '';
                reportsNcNrObj.dept = '';
                $scope.allPerformanceReports = [];
                $scope.tempAllPerformanceReports = [];
                $scope.atmsReportTransactionCount($scope.allPerformanceReports.length, 5);
            }
    
        }


        $scope.renderGoals = function (goals_list) {

            var goalResort = {};
            console.log("Render Goals-->" , goals_list.length);
    
            if($scope.allGoals.length != 0) {
                for(var i=0; i<goals_list.length; i++) {
                    $scope.allGoals.push(goals_list[i]);
                }
            }
    
            else {
                $scope.allGoals = goals_list;
            }
            if($scope.user){
                if($scope.user.sellerObject){
                    goalResort.resort = $scope.user.sellerObject.Resort;
                }
                else{
                    goalResort.resort = '';
                }
            }
            else{
                goalResort.resort = '';
    
            }
            $scope.reportGoals = $scope.allGoals;
    
            $http.post('/dash/allGoals/resorts',goalResort)
                .success(function (response) {
                    console.log("All Goals reosrts--------->>>" + response.length);
                    $scope.goalsResort = response; // -- resort dropdown with all the data for goals report
                });
        };

        $scope.renderIndividualReports = function (data) {
            console.log("Render Individual Reports-->");
            console.log(data);
            $scope.atmsIndividualReport = data;
            $scope.allIndividualReportData = data;
            $scope.atmsReportTransactionCount(data.length, 4);
        };

        $scope.parseData = function(viewLength, newViewBy){
            return parseInt(viewLength) + parseInt(newViewBy);
        }

        //pagination for all ATMS reports
        $scope.atmsReportsPage =  function(tab, direction, newViewBy){
            console.log("newViewBy reportspage--=>>", tab, direction, newViewBy)
            $scope.newViewBy = parseInt(newViewBy);
            switch(tab){
                case 1:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.reportGoals.length){
                            if(viewLength + viewBy < $scope.reportGoals_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                reportsGoalSearchObj.viewLength = viewLength;
                                reportsGoalSearchObj.viewBy = initialViewBy;
                                reportsGoalSearchObj.searchFor = $scope.reportsGoalSearch.filter;
                                reportsGoalSearchObj.searchBy = goalSearchBy;

                                $http.post("/dash/goals",reportsGoalSearchObj)
                                    .success(function(response){
                                        console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            $scope.reportGoals.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.reportGoals_count){
                                            a = viewLength + viewBy - $scope.reportGoals_count;
                                            viewBy -= a;
                                            $scope.newViewBy = viewBy;
                                        }
                                        $scope.viewLength = viewLength;
                                    })

                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.reportGoals_count){
                                    a = viewLength + viewBy - $scope.reportGoals_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.reportGoals_count){
                                a = viewLength + viewBy - $scope.reportGoals_count;
                                viewBy -= a;

                                if(viewLength + viewBy > $scope.reportGoals.length){
                                    reportsGoalSearchObj.viewLength = $scope.reportGoals.length ;
                                    reportsGoalSearchObj.viewBy = viewLength + viewBy - $scope.reportGoals.length;
                                    reportsGoalSearchObj.searchFor = $scope.reportsGoalSearch.filter;
                                    reportsGoalSearchObj.searchBy = goalSearchBy;

                                    $http.post("/dash/goals",reportsGoalSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.reportGoals.push(response[i]);
                                            }
                                            console.log('$scope.itemreport.length',$scope.reportGoals.length);
                                            console.log('response',response.length)
                                        })
                                }

                            }else{
                                if(viewLength + viewBy > $scope.reportGoals.length){
                                    reportsGoalSearchObj.viewLength = $scope.reportGoals.length ;
                                    reportsGoalSearchObj.viewBy = viewLength + viewBy - $scope.reportGoals.length;
                                    reportsGoalSearchObj.searchFor = $scope.reportsGoalSearch.filter;
                                    reportsGoalSearchObj.searchBy = goalSearchBy;

                                    $http.post("/dash/goals",reportsGoalSearchObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                $scope.reportGoals.push(response[i]);
                                            }
                                        })
                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;

                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.reportGoals_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 2:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;

                    if(direction){

                        if(viewLength + viewBy >= $scope.atmsColleagues.length){
                            if(viewLength + viewBy < $scope.colleagues_count){
                                viewLength += viewBy;
                                colleaguesSearchObj.viewLength = viewLength;
                                colleaguesSearchObj.viewBy = initialViewBy;
                                colleaguesSearchObj.searchFor = $scope.colleaguesReportSearch.filter;
                                colleaguesSearchObj.searchBy = colleaguesSearchBy;


                                $http.post("/dash/reports/atms/sellers",colleaguesSearchObj)
                                    .success(function(response){


                                        for(var i=0; i<response.length; i++){
                                            $scope.atmsColleagues.push(response[i]);
                                            console.log( $scope.atmsColleagues);
                                        }

                                        if(viewLength + viewBy > $scope.colleagues_count){
                                            a = viewLength + viewBy - $scope.colleagues_count;
                                            viewBy -= a;
                                            $scope.newViewBy = viewBy;
                                        }
                                        $scope.viewLength = viewLength;
                                    })

                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.colleagues_count){
                                    a = viewLength + viewBy - $scope.colleagues_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.colleagues_count){
                                a = viewLength + viewBy - $scope.colleagues_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.atmsColleagues.length){
                                    colleaguesSearchObj.viewLength = $scope.atmsColleagues.length;
                                    colleaguesSearchObj.viewBy = viewLength + viewBy - $scope.atmsColleagues.length;
                                    colleaguesSearchObj.searchFor = $scope.colleaguesReportSearch.filter;
                                    colleaguesSearchObj.searchBy = colleaguesSearchBy;


                                    $http.post("/dash/reports/atms/sellers",colleaguesSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.atmsColleagues.push(response[i]);
                                                console.log( $scope.atmsColleagues);
                                            }

                                        })
                                }
                            }else {
                                if(viewLength + viewBy > $scope.atmsColleagues.length){
                                    colleaguesSearchObj.viewLength = $scope.atmsColleagues.length;
                                    colleaguesSearchObj.viewBy = viewLength + viewBy - $scope.atmsColleagues.length;
                                    colleaguesSearchObj.searchFor = $scope.colleaguesReportSearch.filter;
                                    colleaguesSearchObj.searchBy = colleaguesSearchBy;


                                    $http.post("/dash/reports/atms/sellers",colleaguesSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.atmsColleagues.push(response[i]);
                                                console.log( $scope.atmsColleagues);
                                            }

                                        })
                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{

                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.colleagues_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 3:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;

                    if(direction){

                        if(viewLength + viewBy >= $scope.temp_groups2.length){
                            if(viewLength + viewBy < $scope.reportDashboard_count){
                                viewLength += viewBy;
                                reportsDashboardSearchObj.viewLength = viewLength;
                                reportsDashboardSearchObj.viewBy = initialViewBy;
                                reportsDashboardSearchObj.searchFor = $scope.reportsDashboardSearch.filter;
                                reportsDashboardSearchObj.searchBy = colleaguesSearchBy;


                                $http.post("/dash/dashBoard/reports",reportsDashboardSearchObj)
                                    .success(function(response){


                                        for(var i=0; i<response.length; i++){
                                            $scope.temp_groups2.push(response[i]);
                                            console.log( $scope.temp_groups);
                                        }

                                        $scope.groupReportsFunc(response);
                                        // $scope.atmsReportTransactionCount(response,3)

                                        if(viewLength + viewBy > $scope.reportDashboard_count){
                                            a = viewLength + viewBy - $scope.reportDashboard_count;
                                            viewBy -= a;
                                            $scope.newViewBy = viewBy;
                                        }
                                        $scope.viewLength = viewLength;
                                    })

                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.reportDashboard_count){
                                    a = viewLength + viewBy - $scope.reportDashboard_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.reportDashboard_count){
                                a = viewLength + viewBy - $scope.reportDashboard_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.temp_groups2.length){
                                    reportsDashboardSearchObj.viewLength = $scope.temp_groups2.length;
                                    reportsDashboardSearchObj.viewBy = viewLength + viewBy - $scope.temp_groups2.length;
                                    reportsDashboardSearchObj.searchFor = $scope.reportsDashboardSearch.filter;
                                    reportsDashboardSearchObj.searchBy = colleaguesSearchBy;


                                    $http.post("/dash/dashBoard/reports",reportsDashboardSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.temp_groups2.push(response[i]);
                                                console.log( $scope.temp_groups);
                                            }

                                            $scope.groupReportsFunc(response);
                                            // $scope.atmsReportTransactionCount(response,3)

                                        })
                                }
                            }else {
                                if(viewLength + viewBy > $scope.temp_groups2.length){
                                    reportsDashboardSearchObj.viewLength = $scope.temp_groups2.length;
                                    reportsDashboardSearchObj.viewBy = viewLength + viewBy - $scope.temp_groups2.length;
                                    reportsDashboardSearchObj.searchFor = $scope.reportsDashboardSearch.filter;
                                    reportsDashboardSearchObj.searchBy = colleaguesSearchBy;


                                    $http.post("/dash/dashBoard/reports",colleaguesSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.temp_groups2.push(response[i]);
                                            }

                                            $scope.groupReportsFunc(response);
                                            // $scope.atmsReportTransactionCount(response,3)

                                        })
                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{

                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.reportDashboard_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 4:

                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;

                    if(direction){
                        if(viewLength + viewBy >= $scope.atmsIndividualReport.length){
                            if(viewLength + viewBy < $scope.individualReport_count){
                                viewLength += viewBy;
                                individualReportSearchObj.viewLength = viewLength;
                                individualReportSearchObj.viewBy = initialViewBy;
                                // individualReportSearchObj.startDate = $scope.DateTimeFormat($scope.individualReportFilter.startDate, 'start');
                                // individualReportSearchObj.startDate = $scope.DateTimeFormat($scope.individualReportFilter.endDate, 'end');
                                individualReportSearchObj.searchFor = $scope.individualReportSearch.filter;
                                individualReportSearchObj.searchBy = individualReportSearchBy;


                                $http.post("/dash/reports/atms/individual",individualReportSearchObj)
                                    .success(function(response){


                                        for(var i=0; i<response.length; i++){
                                            $scope.atmsIndividualReport.push(response[i]);
                                            //console.log( $scope.individualReportFilter);
                                        }

                                        if(viewLength + viewBy > $scope.individualReport_count){
                                            a = viewLength + viewBy - $scope.individualReport_count;
                                            viewBy -= a;
                                            $scope.newViewBy = viewBy;
                                        }
                                        $scope.viewLength = viewLength;
                                    })

                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.individualReport_count){
                                    a = viewLength + viewBy - $scope.individualReport_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.individualReport_count){
                                a = viewLength + viewBy - $scope.individualReport_count;
                                viewBy -= a;
                                if(viewLength + viewBy > $scope.atmsIndividualReport.length){
                                    individualReportSearchObj.viewLength = $scope.atmsIndividualReport.length;
                                    individualReportSearchObj.viewBy = viewLength + viewBy - $scope.atmsIndividualReport.length;
                                    // colleaguesSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                                    // colleaguesSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                                    individualReportSearchObj.searchFor = $scope.individualReportSearch.filter;
                                    individualReportSearchObj.searchBy = individualReportSearchBy;


                                    $http.post("/dash/reports/atms/individual",individualReportSearchObj)
                                        .success(function(response){


                                            for(var i=0; i<response.length; i++){
                                                $scope.atmsIndividualReport.push(response[i]);
                                                console.log( $scope.atmsIndividualReport);
                                            }

                                        })
                                }
                            }else {
                                if(viewLength + viewBy > $scope.atmsIndividualReport.length){
                                    individualReportSearchObj.viewLength = $scope.atmsIndividualReport.length;
                                    individualReportSearchObj.viewBy = viewLength + viewBy - $scope.atmsIndividualReport.length;
                                    // colleaguesSearchObj.sDate = $scope.DateTimeFormat($scope.sellerReportFilter.startDate, 'start');
                                    // colleaguesSearchObj.eDate = $scope.DateTimeFormat($scope.sellerReportFilter.endDate, 'end');
                                    individualReportSearchObj.searchFor = $scope.individualReportSearch.filter;
                                    individualReportSearchObj.searchBy = individualReportSearchBy;


                                    $http.post("/dash/reports/atms/individual",individualReportSearchObj)
                                        .success(function(response){
                                            for(var i=0; i<response.length; i++){
                                                $scope.atmsIndividualReport.push(response[i]);
                                                console.log($scope.atmsIndividualReport);
                                            }
                                        })
                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;
                        }
                    }
                    else{
                        console.log(viewLength);
                        console.log(viewBy);
                        console.log($scope.individualReport_count);

                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.individualReport_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;

                case 5:
                    var viewLength = $scope.viewLength;
                    var viewBy = $scope.newViewBy;
                    if(direction){
                        // console.log("NEXT");

                        if(viewLength + viewBy >= $scope.allPerformanceReports.length){
                            if(viewLength + viewBy < $scope.ncNr_count){
                                viewLength += viewBy;
                                //console.log("Fetch more")
                                reportsNcNrObj.viewLength = viewLength;
                                reportsNcNrObj.viewBy = initialViewBy;
                                reportsNcNrObj.searchFor = $scope.reportsNcNr.filter;
                                reportsNcNrObj.searchBy = goalSearchBy;

                                $http.post("/dash/ncNReports",reportsNcNrObj)
                                    .success(function(response){
                                        console.log(response);

                                        for(var i=0; i<response.length; i++){
                                            if(response[i].NR != 0 || response[i].sumValueNc != 0) $scope.allPerformanceReports.push(response[i]);
                                        }

                                        if(viewLength + viewBy > $scope.ncNr_count){
                                            a = viewLength + viewBy - $scope.ncNr_count;
                                            viewBy -= a;
                                            $scope.newViewBy = viewBy;
                                        }
                                        $scope.viewLength = viewLength;
                                    })

                            }
                            else{
                                // console.log("Out of data")
                                if(viewLength + viewBy > $scope.ncNr_count){
                                    a = viewLength + viewBy - $scope.ncNr_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                            }
                        }
                        else{
                            // console.log("Minus viewby")
                            viewLength += viewBy;

                            if(viewLength + viewBy > $scope.ncNr_count){
                                a = viewLength + viewBy - $scope.ncNr_count;
                                viewBy -= a;

                                if(viewLength + viewBy > $scope.allPerformanceReports.length){
                                    reportsNcNrObj.viewLength = $scope.allPerformanceReports.length ;
                                    reportsNcNrObj.viewBy = viewLength + viewBy - $scope.reportGoals.length;
                                    reportsNcNrObj.searchFor = $scope.reportsNcNr.filter;
                                    reportsNcNrObj.searchBy = goalSearchBy;

                                    $http.post("/dash/ncNReports",reportsNcNrObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                if(response[i].NR != 0 || response[i].sumValueNc != 0) $scope.allPerformanceReports.push(response[i]);
                                            }
                                            console.log('$scope.itemreport.length',$scope.allPerformanceReports.length);
                                            console.log('response',response.length)
                                        })
                                }

                            }else{
                                if(viewLength + viewBy > $scope.allPerformanceReports.length){
                                    reportsNcNrObj.viewLength = $scope.allPerformanceReports.length ;
                                    reportsNcNrObj.viewBy = viewLength + viewBy - $scope.allPerformanceReports.length;
                                    reportsNcNrObj.searchFor = $scope.reportsNcNr.filter;
                                    reportsNcNrObj.searchBy = goalSearchBy;

                                    $http.post("/dash/ncNReports",reportsNcNrObj)
                                        .success(function(response){
                                            console.log(response);

                                            for(var i=0; i<response.length; i++){
                                                if(response[i].NR != 0 || response[i].sumValueNc != 0) $scope.allPerformanceReports.push(response[i]);
                                            }
                                        })
                                }
                            }
                            $scope.newViewBy = viewBy;
                            $scope.viewLength = viewLength;

                        }
                    }
                    else{
                        // console.log("BACK");
                        if(viewLength < viewBy){
                            // console.log("NO DATA")
                        }
                        else{
                            if(viewLength + viewBy >= $scope.ncNr_count){
                                viewBy += a;
                                a = 0;
                            }

                            viewLength -= viewBy;

                            $scope.viewLength = viewLength;
                            $scope.newViewBy = viewBy;
                        }
                    }

                    break;
            }

        }

        $scope.atmsReportTransactionCount = function (response,tab) {
            if(tab == 1){
                console.log("response report goals : count:",response, tab);
                if(response){
                    if(response > viewBy.goals){
                        $scope.reportGoals_count = response;
                    }
                    else if(response <= viewBy.goals){
                        $scope.reportGoals_count = response;
                        $scope.newViewBy = response;
                    }
                    else{
                        $scope.reportGoals = [];
                        // $scope.tempGoals = [];
                        $scope.newViewBy = 1;
                        $scope.allGoals_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.reportGoals = [];
                    // $scope.tempGoals = [];
                    $scope.newViewBy = 1;
                    $scope.reportGoals_count = 0;
                    $scope.viewLength = -1;
                }
            }
    
            if(tab == 2)
            {
                // console.log("top user report  ",response);
                if(response){
                    if(response > $scope.newViewBy){
                        $scope.colleagues_count = response;
                    }
                    else if(response <= $scope.newViewBy){
                        $scope.colleagues_count = response;
                        $scope.newViewBy = response;
    
                    }
                    else{
                        $scope.atmsColleagues = [];
                        $scope.newViewBy = 1;
                        $scope.colleagues_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.atmsColleagues = [];
                    $scope.newViewBy = 1;
                    $scope.colleagues_count = 0;
                    $scope.viewLength = -1;
                }
            }
            if(tab == 3){
                console.log("response report Dashboard : count:  " +response.length);
                console.log($scope.newViewBy)
                if(response.length){
                    if(response.length > $scope.newViewBy){
                        $scope.reportDashboard_count = response.length;
                    }
                    else if(response.length <= $scope.newViewBy){
                        $scope.reportDashboard_count = response.length;
                        $scope.newViewBy = response.length;
                    }
                    else{
                        console.log("Else inside if---->>>")
                        $scope.temp_groups2 = [];
                        $scope.newViewBy = 1;
                        $scope.reportDashboard_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    console.log("No response---->>>")
                    $scope.temp_groups2 = [];
                    $scope.newViewBy = 1;
                    $scope.reportDashboard_count = 0;
                    $scope.viewLength = -1;
                }
            }
            if(tab == 4)
            {
                // console.log("top user report  ",response);
                if(response){
                    if(response > $scope.newViewBy){
                        $scope.individualReport_count = response;
                    }
                    else if(response <= $scope.newViewBy){
                        $scope.individualReport_count = response;
                        $scope.newViewBy = response;
    
                    }
                    else{
                        $scope.atmsIndividualReport = [];
                        $scope.newViewBy = 1;
                        $scope.individualReport_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.atmsIndividualReport = [];
                    $scope.newViewBy = 1;
                    $scope.individualReport_count = 0;
                    $scope.viewLength = -1;
                }
            }
    
            if(tab == 5)
            {
                console.log("response goals : count:");
                console.log(response);
                if(response){
                    if(response > viewBy.reportsGoals){
                        $scope.ncNr_count = response;
                    }
                    else if(response <= viewBy.reportsGoals){
                        $scope.ncNr_count = response;
                        $scope.newViewBy = response;
                    }
                    else{
                        // $scope.allGoals = [];
                        $scope.allPerformanceReports = [];
                        $scope.newViewBy = 1;
                        $scope.ncNr_count = 0;
                        $scope.viewLength = -1;
                    }
                }
                else{
                    $scope.allGoals = [];
                    $scope.reportGoals = [];
                    $scope.newViewBy = 1;
                    $scope.ncNr_count = 0;
                    $scope.viewLength = -1;
                }
            }
        }

        $scope.atmsToggleFilter = function(flag, tab){

            switch(tab){
                case 1 :
                    if(flag)
                        $scope.atmsFilter1 = true;
                    else
                        $scope.atmsFilter1 = false;
                    break;

                case 2 :
                    if(flag)
                        $scope.atmsFilter2 = true;
                    else
                        $scope.atmsFilter2 = false;
                    break;

                case 3 :
                    if(flag)
                        $scope.atmsFilter3 = true;
                    else
                        $scope.atmsFilter3 = false;
                    break;

                case 4 :
                    if(flag)
                        $scope.atmsFilter4 = true;
                    else
                        $scope.atmsFilter4 = false;
                    break;


                case 5 :
                    if(flag)
                        $scope.atmsFilter5 = true;
                    else
                        $scope.atmsFilter5 = false;
                    break;
            }
        }


        $scope.atmsRefreshReports = function(id){
            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            switch (id) {
                case 0:
                    $scope.atmsReportView(0);
                    break;
                case 1 :
                    $scope.atmsReportView(1);
                    break;
                case 2 :
                    $scope.atmsReportView(2);
                    break;
                case 3 :
                    $scope.atmsReportView(3);
                    break;
                case 4 :
                    $scope.atmsReportView(4);
                    break;
                case 5 :
                    $scope.atmsReportView(5);
                    break;
            }
            setTimeout(function () {
                $('.refresh').css("display", "none");
            }, 2000)
        }



        $scope.atmsClearReportFilter = function(tab){
            switch(tab) {

                //CLear goals filter
                case 1:
                    $scope.viewLength = 0;
                    $scope.newViewBy = viewBy.reportsGoals;
                    $scope.reportsGoalSearch.filter = '';
                    $scope.reportsGoalSearch.allRole = '';
                    if($scope.user.sellerObject){
                        $scope.reportsGoalSearch.allResort = $scope.user.sellerObject.Resort;
                        reportsGoalSearchObj.resort = $scope.user.sellerObject.Resort;
                    }
                    else{
                        $scope.reportsGoalSearch.allResort = '';
                        reportsGoalSearchObj.resort = '';
                    }
                    $scope.reportsGoalSearch.allDepartment = '';
                    $scope.reportsGoalSearch.evaluationBy = '';
                    $scope.reportsGoalSearch.allFrequency = '';


                    reportsGoalSearchObj.viewLength = 0;
                    reportsGoalSearchObj.viewBy = initialViewBy;
                    reportsGoalSearchObj.searchBy = [];
                    reportsGoalSearchObj.searchFor = '';
                    reportsGoalSearchObj.dept = '';
                    reportsGoalSearchObj.allFrequency = '';
                    reportsGoalSearchObj.evaluationBy = '';
                    reportsGoalSearchObj.role = '';


                    $scope.reportGoals = [];
                    //   $scope.tempGoals = []

                    console.log(reportsGoalSearchObj);

                    $http.post("/dash/goals", reportsGoalSearchObj)
                        .success($scope.renderGoals);

                    $http.post('/dash/goals/count', reportsGoalSearchObj)
                        .success(function (response) {
                            console.log("Goals count--------->>>")
                            console.log(response)
                            $scope.atmsReportTransactionCount(response, 1)
                        });

                    //  $scope.showGoalFilter = false;

                    break;


                case 2:

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.colleaguesReportSearch.filter = '';
                    colleaguesSearchObj.viewLength = 0;
                    colleaguesSearchObj.viewBy = initialViewBy;
                    colleaguesSearchObj.searchBy = [];
                    colleaguesSearchObj.searchFor = '';
                    if($scope.user.sellerObject){
                        $scope.colleaguesReportFilter.allResort = $scope.user.sellerObject.Resort;
                        colleaguesSearchObj.resort = $scope.user.sellerObject.Resort;
                    }
                    else{
                        $scope.colleaguesReportFilter.allResort = '';
                        colleaguesSearchObj.resort = '';
                    }

                    $scope.atmsColleagues = [];


                    // $http.post("/dash/reports/atms/sellers", colleaguesSearchObj)
                    //     .success(function(response){
                    //         $scope.atmsColleagues = response;
                    //
                    //     })

                    $http.post("/dash/colleagues/count", colleaguesSearchObj)
                        .success(function (res) {
                            $scope.atmsReportTransactionCount(res, 2);
                        });
                    $http.post("/dash/reports/ATMS/colleagues", colleaguesSearchObj)
                        .success(function(res){
                            $scope.reportsAllColleagues = res;
                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                        });

                    $http.get("/dash/usersResorts")
                        .success(function (res) {
                            $scope.usersResorts = res;
                        });

                    $scope.showColleaguesFilter = false;

                    break;

                case 3:

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.reportsDashboardSearch.filter = '';
                    $scope.reportsDashboardSearch = {}
                    $scope.atmsDashboardReportDays = 0;
                    /* reportsGoalSearchObj.viewLength = 0;
                    reportsGoalSearchObj.viewBy = initialViewBy;
                    reportsGoalSearchObj.searchBy = [];
                    reportsGoalSearchObj.searchFor = '';


                    $scope.temp_groups2 = [];


                    $http.post("/dash/dashBoard/reports", reportsGoalSearchObj)
                    .success(function(response){
                    $scope.temp_groups = response;
                    // $scope.reportDashboard_count = response.length
                    $scope.groupReportsFunc(response);
                    // $scope.atmsReportTransactionCount(response,3)
                    })*/

                    // $scope.showIndividualReportFilter = false;

                    break;

                case 4:

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;
                    $scope.individualReportSearch.filter = '';
                    individualReportSearchObj.viewLength = 0;
                    individualReportSearchObj.viewBy = initialViewBy;
                    individualReportSearchObj.searchBy = [];
                    individualReportSearchObj.searchFor = '';

                    $scope.atmsIndividualReport = [];

                    $http.post("/dash/reports/atms/individual", individualReportSearchObj)
                        .success(function(response){
                            if(response){
                                $scope.individualScoretotal =0;
                                $scope.individualFinalScore =0;
                                $scope.weightagesSum = 0;
                                $scope.atmsIndividualReport = response;
                                $scope.atmsReportTransactionCount(response.length, 4);
                                for(var i=0; i< $scope.atmsIndividualReport.length; i++){
                                    $scope.individualScoretotal += $scope.atmsIndividualReport[i].average * $scope.atmsIndividualReport[i].weightage;
                                    $scope.weightagesSum += ($scope.atmsIndividualReport[i].average ? $scope.atmsIndividualReport[i].weightage : 0);
                                    if(i== $scope.atmsIndividualReport.length-1){
                                        $scope.individualFinalScore = ($scope.individualScoretotal/ ($scope.weightagesSum * 5))*100
                                    }
                                }
                            }

                        })

                    $scope.showIndividualReportFilter = false;

                    break;

                case 5:
                    reportsNcNrObj.viewLength = 0;
                    reportsNcNrObj.viewBy = initialViewBy;
                    reportsNcNrObj.searchBy = [];
                    reportsNcNrObj.searchFor = '';
                    // reportsNcNrObj.dept = '';

                    $scope.allPerformanceReports = [];
                    // $scope.tempAllPerformanceReports = [];
                    $scope.reportsNcNr.filter = '';
                    // $scope.reportsNcNr.allDepartment = '';

                    $http.post("/dash/ncNReports",reportsNcNrObj)
                        .success(function(res_evaluation)
                        {
                            console.log(res_evaluation)
                            for(var i=0; i<res_evaluation.length; i++)
                            {
                                if(res_evaluation[i].NR != 0 || res_evaluation[i].NC != 0) $scope.allPerformanceReports.push(res_evaluation[i]);
                            }
                            // $scope.allPerformanceReports = res_evaluation
                            // $scope.tempAllPerformanceReports = res_evaluation
                            $scope.atmsReportTransactionCount($scope.allPerformanceReports.length, 5)
                        })

                    /*$http.post('/dash/performance/count', reportsNcNrObj)
                    .success(function (response) {
                    console.log("Performance count--------->>>")
                    console.log(response)
                    var tempArray = []
                    for(var i=0; i<response.length; i++)
                    {
                    if(response[i].NR != 0 || response[i].sumValueNc != 0) tempArray.push(response[i]);
                    }
                    $scope.atmsReportTransactionCount(tempArray.length, 5)
                    });*/

                    $scope.showNcNrFilter = false;

                    break;
            }

        }

        $scope.atmsclearSearch = function(id){
            if(id == 1){
                $scope.reportsGoalSearch.filter = '';
                reportsGoalSearchObj.searchFor = '';
                $scope.atmsReportFilter(1);
            }
            if(id==2){
                $scope.colleaguesReportSearch.filter = '';

                colleaguesSearchObj.searchFor = '';
                $scope.atmsReportFilter(2);
            }

        }


        $scope.atmsReportFilter = function(id,tag){
            if(id == 1){
                reportsGoalSearchObj.viewLength = 0;
                reportsGoalSearchObj.viewBy = initialViewBy;
                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

                if($scope.reportsGoalSearch.filter){
                    reportsGoalSearchObj.searchFor = $scope.reportsGoalSearch.filter;
                    reportsGoalSearchObj.searchBy = goalSearchBy;
                }

                if($scope.reportsGoalSearch.allResort){
                    reportsGoalSearchObj.resort = $scope.reportsGoalSearch.allResort;
                }
                else{
                    if($scope.user.sellerObject){
                        $scope.reportsGoalSearch.allResort = $scope.user.sellerObject.Resort;
                        reportsGoalSearchObj.resort = $scope.user.sellerObject.Resort;
                    }
                    else{
                        $scope.reportsGoalSearch.allResort = '';
                        reportsGoalSearchObj.resort = '';
                    }
                }

                if($scope.reportsGoalSearch.allDepartment != ''){
                    reportsGoalSearchObj.dept = $scope.reportsGoalSearch.allDepartment;
                }
                else{
                    reportsGoalSearchObj.dept = ''
                }
                if($scope.reportsGoalSearch.allRole){
                    reportsGoalSearchObj.role = $scope.reportsGoalSearch.allRole;

                }
                else{
                    reportsGoalSearchObj.role = ''
                }
                if($scope.reportsGoalSearch.evaluationBy){
                    reportsGoalSearchObj.evaluationBy = $scope.reportsGoalSearch.evaluationBy;
                }
                else{
                    reportsGoalSearchObj.evaluationBy = ''
                }

                if($scope.reportsGoalSearch.allFrequency){
                    reportsGoalSearchObj.allFrequency = $scope.reportsGoalSearch.allFrequency;
                }
                else{
                    reportsGoalSearchObj.allFrequency = ''
                }

                // $scope.reportGoals = [];
                // $scope.reportALLGoals = [];
                // console.log(reportsGoalSearchObj);

                $http.post("/dash/goals",reportsGoalSearchObj)
                    .success(function(response){
                        // console.log(response);
                        $scope.reportGoals = response;
                        /* if($scope.reportGoals.length == 0){
                        $scope.tempGoals = $scope.allGoals;
                        }*/
                    })

                $http.post('/dash/goals/count', reportsGoalSearchObj)
                    .success(function (response) {
                        $scope.atmsReportTransactionCount(response, 1);
                    });

                $http.post('/dash/reportAllGoals', reportsGoalSearchObj)
                    .success(function (response) {
                        $scope.reportALLGoals = response; // ---- All dropdowns after resort
                    })

                $scope.showGoalFilter = true;

                if($scope.reportsGoalSearch.filter == '')
                    $scope.showGoalFilter = false;

            }

            if(id == 2){

                jQuery.noConflict();
                $('.refresh').css("display", "inline");

                $scope.atmsColleagues =[];
                colleaguesSearchObj.viewLength = 0;
                colleaguesSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;
                console.log($scope.colleaguesReportSearch.filter)

                if($scope.colleaguesReportSearch.filter){
                    colleaguesSearchObj.searchFor = $scope.colleaguesReportSearch.filter;
                    colleaguesSearchObj.searchBy = colleaguesSearchBy;
                }

                if($scope.colleaguesReportFilter.allResort){
                    colleaguesSearchObj.resort = $scope.colleaguesReportFilter.allResort;
                }
                else{
                    if($scope.user.sellerObject){
                        $scope.colleaguesReportFilter.allResort = $scope.user.sellerObject.Resort;
                        colleaguesSearchObj.resort = $scope.user.sellerObject.Resort;
                    }
                    else{
                        $scope.colleaguesReportFilter.allResort = '';
                        colleaguesSearchObj.resort = ''
                    }
                }

                if($scope.colleaguesReportFilter.all_Department){
                    colleaguesSearchObj.DEPARTMENT = $scope.colleaguesReportFilter.all_Department;
                }
                else{
                    colleaguesSearchObj.DEPARTMENT = ''
                }
                if($scope.colleaguesReportFilter.all_Designation){
                    colleaguesSearchObj.Designation = $scope.colleaguesReportFilter.all_Designation;
                }
                else{
                    colleaguesSearchObj.Designation = ''
                }
                if($scope.colleaguesReportFilter.all_Supervisor_Name){
                    colleaguesSearchObj.Supervisor_Name = $scope.colleaguesReportFilter.all_Supervisor_Name;
                }
                else{
                    colleaguesSearchObj.Supervisor_Name = ''
                }
                if($scope.colleaguesReportFilter.all_Assistant_Manager_Name){
                    colleaguesSearchObj.Assistant_Manager_Name = $scope.colleaguesReportFilter.all_Assistant_Manager_Name;
                }
                else{
                    colleaguesSearchObj.Assistant_Manager_Name = ''
                }
                if($scope.colleaguesReportFilter.all_Manager_Name){
                    colleaguesSearchObj.Manager_Name = $scope.colleaguesReportFilter.all_Manager_Name;
                }
                else{
                    colleaguesSearchObj.Manager_Name = ''
                }


                $http.post("/dash/reports/atms/sellers", colleaguesSearchObj)
                    .success(function(response){
                        console.log("sellers "+ response.length);
                        $scope.atmsColleagues = response;
                    });

                $http.post("/dash/reports/ATMS/colleagues", colleaguesSearchObj)
                    .success(function(res){
                        $scope.reportsAllColleagues = res;
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                    });

                $http.post("/dash/colleagues/count", colleaguesSearchObj)
                    .success(function (res) {
                        $scope.atmsReportTransactionCount(res, 2);
                    })

                $scope.showColleaguesFilter = true;

                if($scope.colleaguesReportSearch.filter == '')
                    $scope.showColleaguesFilter = false;
            }

            if(id == 3){

                console.log("Department reports--->>>");
                jQuery.noConflict();
                $('.refresh').css("display", "inline");
                $scope.dashboardFiltersTag = false

                reportsDashboardSearchObj.viewLength = 0;
                reportsDashboardSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

                if(tag){
                    reportsDashboardSearchObj.searchFor = tag;
                    reportsDashboardSearchObj.searchBy = dashboardReportSearchBy;
                }

                if($scope.reportsDashboardSearch.department){
                    reportsDashboardSearchObj.department = $scope.reportsDashboardSearch.department;
                }
                else{
                    reportsDashboardSearchObj.department = ''
                }

                if($scope.reportsDashboardSearch.role){
                    reportsDashboardSearchObj.role = $scope.reportsDashboardSearch.role;
                }
                else{
                    reportsDashboardSearchObj.role = ''
                }

                if($scope.reportsDashboardSearch.startDate){
                    reportsDashboardSearchObj.startDate = $scope.reportsDashboardSearch.startDate;
                }
                else{
                    reportsDashboardSearchObj.startDate = ''
                }
                if($scope.reportsDashboardSearch.endDate){
                    reportsDashboardSearchObj.endDate = $scope.reportsDashboardSearch.endDate;
                }
                else{
                    reportsDashboardSearchObj.endDate = ''
                }

                if($scope.reportsDashboardSearch.resort){
                    reportsDashboardSearchObj.resort = $scope.reportsDashboardSearch.resort;
                }
                else{
                    if($scope.user.sellerObject){
                        reportsDashboardSearchObj.resort = $scope.user.sellerObject.Resort;
                        $scope.reportsDashboardSearch.resort = $scope.user.sellerObject.Resort;
                    }else{
                        reportsDashboardSearchObj.resort = ''
                        $scope.reportsDashboardSearch.resort = ''
                    }
                }

                console.log(reportsDashboardSearchObj)

                $http.post("/dash/dashBoard/reports", reportsDashboardSearchObj)
                    .success(function(res_dashboard)
                    {
                        console.log(res_dashboard.length);
                        // console.log(res_dashboard)
                        $scope.temp_groups = res_dashboard;
                        $scope.groupReportsFunc(res_dashboard);

                        if($scope.reportsDashboardSearch.startDate && $scope.reportsDashboardSearch.endDate &&
                            $scope.reportsDashboardSearch.department && $scope.reportsDashboardSearch.role && res_dashboard.length)
                        {
                            $scope.dashboardFiltersTag = true
                        }
                        // $scope.atmsReportTransactionCount(res_dashboard,3)
                    })

                //Not using it -- Author : Bhargavi
                $scope.tempDashbordDropdown=[]
                $http.post("/dash/dashBoard/reports/count", reportsDashboardSearchObj)
                    .success(function(res_dashboard)
                    {
                        $scope.tempDashbordDropdown = res_dashboard;
                        // $scope.groupReportsFunc($scope.reportsDashboard);
                    })
                //Get the resorts dropdown without skip and limit
                $http.post("/dash/deptReports",reportsDashboardSearchObj)
                    .success(function(resorts){
                        console.log("dept resorts"+ resorts.length);
                        for(var j=0;j<resorts.length;j++){
                            if(resorts[j].resort[0] != undefined){
                                if($scope.performanceResorts.includes(resorts[j].resort[0])){
                                    // console.log("data already exists");
                                }
                                else{
                                    $scope.performanceResorts.push(resorts[j].resort[0]);

                                }
                            }

                        }


                    })

                              //Get the resorts dropdown without skip and limit
             $http.post("/dash/deptReports",reportsDashboardSearchObj)
             .success(function(resorts){
                 console.log("dept resorts"+ resorts.length);
                 if(resorts.length) {
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");

                     for (var j = 0; j < resorts.length; j++) {
                         if (resorts[j].resort[0] != undefined) {
                             if ($scope.performanceResorts.includes(resorts[j].resort[0])) {
                                 // console.log("data already exists");
                             }
                             else {
                                 $scope.performanceResorts.push(resorts[j].resort[0]);

                             }
                         }
                         if (resorts[j].department[0] != undefined) {
                             if ($scope.performanceDepartments.includes(resorts[j].department[0])) {
                                 // console.log("data already exists");
                             }
                             else {
                                 $scope.performanceDepartments.push(resorts[j].department[0]);

                             }
                         }
                         if (resorts[j].role[0] != undefined) {
                             if ($scope.performanceRole.includes(resorts[j].role[0])) {
                                 // console.log("data already exists");
                             }
                             else {
                                 $scope.performanceRole.push(resorts[j].role[0]);

                             }
                         }
                     }
                 }
                 else{
                     jQuery.noConflict();
                     $('.refresh').css("display", "none");
                 }
             });

            }

            if(id == 4){

                jQuery.noConflict();
                $(".colleagueCodeDropdown").css('display', 'none')

                if($scope.individualReportFilter.all_Colleague_Code) {
                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");
                }

                individualReportSearchObj.viewLength = 0;
                individualReportSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

                if($scope.individualReportSearch.filter){
                    individualReportSearchObj.searchFor = $scope.individualReportSearch.filter;
                    individualReportSearchObj.searchBy = individualReportSearchBy;
                }

                if($scope.individualReportFilter.all_Department){
                    individualReportSearchObj.department = $scope.individualReportFilter.all_Department;
                }
                else{
                    individualReportSearchObj.department = ''
                }

                if($scope.individualReportFilter.all_Colleague_Code){
                    individualReportSearchObj.colleauge_code = tag.EVALUATION_ID;
                    if(tag.EVALUATION_NAME)
                        $scope.individualReportFilter.all_Colleague_Code = tag.EVALUATION_ID+' - '+tag.EVALUATION_NAME;
                    else
                        $scope.individualReportFilter.all_Colleague_Code = tag.EVALUATION_ID;
                    $scope.selected_Colleague_code = tag;
                }
                else{
                    individualReportSearchObj.colleauge_code = ''
                }

                if($scope.individualReportFilter.startDate){
                    individualReportSearchObj.startDate = $scope.individualReportFilter.startDate;
                    $scope.searchColleagueBody.startDate = $scope.individualReportFilter.startDate;
                }
                else{
                    individualReportSearchObj.startDate = ''
                    $scope.searchColleagueBody.startDate = ''
                }

                if($scope.individualReportFilter.endDate){
                    individualReportSearchObj.endDate = $scope.individualReportFilter.endDate;
                    $scope.searchColleagueBody.endDate = $scope.individualReportFilter.endDate;
                }
                else{
                    individualReportSearchObj.endDate = ''
                    $scope.searchColleagueBody.endDate =''
                }

                $scope.atmsIndividualReport = [];

                $http.post("/dash/reports/atms/individual", individualReportSearchObj)
                    .success(function(response){
                        if(response){
                            $scope.individualScoretotal =0;
                            $scope.individualFinalScore =0;
                            $scope.weightagesSum = 0;
                            $scope.atmsIndividualReport = response;
                            //console.log($scope.atmsIndividualReport);
                            $scope.atmsReportTransactionCount(response.length, 4);
                            for(var i=0; i< $scope.atmsIndividualReport.length; i++){
                                $scope.individualScoretotal += $scope.atmsIndividualReport[i].average * $scope.atmsIndividualReport[i].weightage;
                                $scope.weightagesSum += ($scope.atmsIndividualReport[i].average ? $scope.atmsIndividualReport[i].weightage : 0);
                                if(i== $scope.atmsIndividualReport.length-1){
                                    $scope.individualFinalScore = ($scope.individualScoretotal/ ($scope.weightagesSum * 5))*100;
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
                                }
                            }
                        }
                        else {
                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                        }
                    })

                $scope.showIndividualReportFilter = true;

                if($scope.individualReportSearch.filter == '')
                    $scope.showIndividualReportFilter = false;
            }

            if(id == 5){

                if(tag == 'clear')
                {
                    reportsNcNrObj.viewLength = 0;
                    reportsNcNrObj.viewBy = initialViewBy;
                    reportsNcNrObj.dept = '';
                    reportsNcNrObj.from = ''
                    reportsNcNrObj.end = ''
                    if($scope.user.sellerObject){
                        reportsNcNrObj.resort = $scope.user.sellerObject.Resort;
                        $scope.reportsNcNr.resort = $scope.user.sellerObject.Resort;
                    }
                    else{
                        $scope.reportsNcNr.resort = '';
                        reportsNcNrObj.resort = '';
                    }
                    $scope.atmsReportsDuration = 0;

                    $scope.allPerformanceReports = [];
                    $scope.reportsNcNr.startDate = ''
                    $scope.reportsNcNr.endDate = ''
                    $scope.reportsNcNr.allDepartment = ''
                }
                else {

                    if ($scope.reportsNcNr.allDepartment) {
                        jQuery.noConflict();
                        $('.refresh').css("display", "inline");
                        $scope.flagforncNr=true;
                    }

                    reportsNcNrObj.viewLength = 0;
                    reportsNcNrObj.viewBy = 1000;

                    $scope.viewLength = 0;
                    $scope.newViewBy = localViewBy;

                    if ($scope.reportsNcNr.filter) {
                        $scope.showNcNrFilter = true;
                        reportsNcNrObj.searchFor = $scope.reportsNcNr.filter;
                        reportsNcNrObj.searchBy = ncNrSearchBy;
                    }

                    if ($scope.reportsNcNr.startDate && $scope.reportsNcNr.endDate) {
                        reportsNcNrObj.from = $scope.reportsNcNr.startDate;
                        reportsNcNrObj.end = $scope.reportsNcNr.endDate
                    }

                    if ($scope.reportsNcNr.allDepartment && $scope.reportsNcNr.allDepartment != '') {
                        reportsNcNrObj.dept = $scope.reportsNcNr.allDepartment;
                    } else {
                        reportsNcNrObj.dept = ''
                    }
                    if ($scope.reportsNcNr.resort && $scope.reportsNcNr.resort != '') {
                        reportsNcNrObj.resort = $scope.reportsNcNr.resort;
                    } else {
                        if ($scope.user.sellerObject) {
                            $scope.reportsNcNr.resort = $scope.user.sellerObject.Resort;
                            reportsNcNrObj.resort = $scope.user.sellerObject.Resort;
                            $http.post("/dash/nc/nr/depts", $scope.reportsNcNr)
                                .success(function(depts){
                                    $scope.ncnrdepts = depts;
                                })
                        } else {
                            $scope.reportsNcNr.resort = '';
                            reportsNcNrObj.resort = '';
                        }
                    }

                    $scope.allPerformanceReports = [];
                    // console.log(reportsNcNrObj);

                    $http.post("/dash/ncNReports", reportsNcNrObj)
                        .success(function (response_data) {
                            console.log("Response of NC NR------>>>" + response_data.length);
                            // console.log(response_data);
                            // $scope.allPerformanceReports = response_data;

                            for (var i = 0; i < response_data.length; i++) {
                                if (response_data[i].NR || response_data[i].NC) {
                                    // console.log(response_data);
                                    $scope.allPerformanceReports.push(response_data[i]);
                                    // console.log("Peformance")
                                    // console.log($scope.allPerformanceReports)
                                    $scope.flagforncNr=false;
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
                                }
                            }

                            $scope.atmsReportTransactionCount($scope.allPerformanceReports.length, 5);
                        })

                    if (!reportsNcNrObj.resort && (reportsNcNrObj.from || reportsNcNrObj.end || reportsNcNrObj.dept)) {
                        $http.post("/dash/nc/nr/resorts", reportsNcNrObj)
                            .success(function (resorts) {
                                // console.log('----- nc nr resorts ----')
                                // console.log(resorts);
                                $scope.ncnrResorts = resorts;
                                jQuery.noConflict();
                                $('.refresh').css("display", "none");
                            })
                    }

                }

            }
        }

        $scope.changeReportDuration = function(startDate, endDate , index, reset){

            if(endDate && !$scope.displayTimeSlot)
            endDate.setHours(23, 59, 59, 59);
    
            if(!reset) {
                if(startDate || endDate){
                    if (startDate && endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(endDate);
                        var numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else if (!endDate) {
                        var d1 = moment(startDate);
                        var d2 = moment(new Date());
                        var numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else
                        var numberOfDays = 0;
    
                    switch (index) {
                        // case 1:
                        //     $scope.topSoldDuration = numberOfDays;
                        //     break;
                        // case 2:
                        //     $scope.topDealersDuration = numberOfDays;
                        //     break;
                        // case 3:
                        //     $scope.topSellerDuration = numberOfDays;
                        //     break;
                        // case 4:
                        //     $scope.summaryDuration = numberOfDays;
                        //     break;
                        // case 5:
                        //     $scope.paymentDuration = numberOfDays;
                        //     break;
                        // case 6:
                        //     $scope.checkinDuration = numberOfDays;
                        //     break;
                        // case 7:
                        //     $scope.expenseDuration = numberOfDays;
                        //     break;
                        // case 8:
                        //     $scope.meetingDuration = numberOfDays;
                        //     break;
                        // case 9:
                        //     $scope.skuDuration = numberOfDays;
                        //     break;
                        // case 10:
                        //     $scope.visitDuration = numberOfDays;
                        //     break;
    
                        // case 11:
                        //     $scope.attendanceDuration = numberOfDays;
                        //     break;
    
                        // case 12:
                        //     $scope.leaveDuration = numberOfDays;
    
                        // case 13:
                        //     $scope.topEnquiryDuration = numberOfDays;
    
                        case 14:
                            $scope.atmsReportsDuration = numberOfDays;
    
                        case 15:
                            $scope.atmsIndividualReportDays = numberOfDays;
    
                        case 16:
                            $scope.atmsDashboardReportDays = numberOfDays;
    
                    }
                }
            }
            else{
                switch (index) {
                    // case 1:
                    //     $scope.topSoldDuration = 0;
                    //     break;
                    // case 2:
                    //     $scope.topDealersDuration = 0;
                    //     break;
                    // case 3:
                    //     $scope.topSellerDuration = 0;
                    //     break;
                    // case 4:
                    //     $scope.summaryDuration = 0;
                    //     break;
                    // case 5:
                    //     $scope.paymentDuration = 0;
                    //     break;
                    // case 6:
                    //     $scope.checkinDuration = 0;
                    //     break;
                    // case 7:
                    //     $scope.expenseDuration = 0;
                    //     break;
                    // case 8:
                    //     $scope.meetingDuration = 0;
                    //     break;
                    // case 9:
                    //     $scope.skuDuration = 0;
                    //     break;
                    // case 10:
                    //     $scope.visitDuration = 0;
                    //     break;
                    // case 11:
                    //     $scope.attendanceDuration = 0;
                    //     break;
    
                    // case 12 :
                    //     $scope.leaveDuration = 0;
                    //     break;
    
                    // case 13:
                    //     $scope.topEnquiryDuration = 0;
                    //     break;

                    case 14:
                        $scope.atmsReportsDuration = 0;
                        break;
                    case 15:
                        $scope.atmsIndividualReportDays = 0;
                        break;
                    case 16:
                        $scope.atmsDashboardReportDays = 0;
                        break;
                }
            }
        }


        //Department Report ng-repeat func 1
        $scope.groupReportsFunc = function(data){
            $scope.temp_groups2 = [];
            $scope.temObjArray = {};
            $scope.temObjArray.cols = []
            $scope.temObjArray.display = []
            $scope.temp = []
            var index=0
            var perfgroup = {};
            for (var i = 0; i < data.length; i++) {

                if(data[i].personal_details[0].length)
                {
                    var temp_perf = data[i];
                    if (!$scope.checkIfPerfGrouped(temp_perf)) {
                        perfgroup = {
                            ROLE : temp_perf['role'][0],
                            DEPARTMENT : temp_perf['department'][0],
                            RESORT : temp_perf['resort'][0],
                            EVALUATION : temp_perf['EVALUATION'][0],
                            DETAILS : temp_perf['personal_details'][0],
                            TOTAL : temp_perf['score'],
                            WEIGHTAGE : temp_perf['weightage'][0],
                            goals: []
                        };
                        $scope.temp_groups2.push(perfgroup);
                        var state_var = temp_perf['statement'][0]
                        var obj =  {
                            'SCORE' : temp_perf['score'],
                            'EVALUATION' : temp_perf['EVALUATION'][0],
                            'GOAL_ID' : temp_perf['GOAL_ID'][0],
                            'GOAL_STATEMENT' : temp_perf['statement'][0]
                        }
                        obj[state_var] = temp_perf['score']
                        perfgroup.goals.push(obj);
                    }
                    if(i == data.length -1){
                        console.log($scope.temp_groups2);
                        console.log($scope.temp_groups);
                        for(var j=0; j<$scope.temp_groups2.length; j++)
                        {
                            for(var k=0; k<$scope.temp_groups2[j].goals.length; k++)
                            {

                                $scope.temObjArray.display[index] = $scope.temp_groups2[j].goals[k]

                                if($scope.temp.indexOf($scope.temp_groups2[j].goals[k].GOAL_ID) == -1)
                                {
                                    $scope.temp.push($scope.temp_groups2[j].goals[k].GOAL_ID)
                                    $scope.temObjArray.cols.push({'GOAL_ID' : $scope.temp_groups2[j].goals[k].GOAL_ID,
                                        'GOAL_STATEMENT' : $scope.temp_groups2[j].goals[k].GOAL_STATEMENT})
                                }

                                index++;

                            }

                            if(j == $scope.temp_groups2.length-1)
                            {
                                console.log($scope.temp_groups2.length)
                                console.log($scope.temObjArray)

                                //This score was not coming for the last record. Hence download was not working -- Author : Bhargavi
                                if(!$scope.temp_groups2[j].FINAL_SCORE) $scope.temp_groups2[j].FINAL_SCORE = ($scope.temp_groups2[j].TOTAL/ ($scope.temp_groups2[j].WEIGHTAGE*5))*100
                                $scope.atmsReportTransactionCount($scope.temp_groups2,3);
                                jQuery.noConflict();
                                $('.refresh').css("display", "none");
                            }

                        }
                    }
                }

                //
            }

        };

        //Department ng-repeat func 2
    $scope.checkIfPerfGrouped = function(perf) {
        for(var i=0;i<$scope.temp_groups2.length;i++) {
            // var total = $scope.temp_groups2[i].TOTAL
            for (var j = 0; j < $scope.temp_groups2[i].goals.length; j++) {
                if ($scope.temp_groups2[i].goals[j].EVALUATION == perf.EVALUATION[0]) {
                    var stateVar = perf.statement[0]
                    var obj = {
                        'SCORE' : perf.score,
                        'EVALUATION' : perf.EVALUATION[0],
                        'GOAL_ID' : perf.GOAL_ID[0],
                        'GOAL_STATEMENT' : perf.statement[0]
                    }

                    $scope.temp_groups2[i].TOTAL += perf.score
                    $scope.temp_groups2[i].WEIGHTAGE += perf.weightage[0]
                    obj[stateVar] = perf.score
                    $scope.temp_groups2[i].goals.push(obj);

                    if(j == $scope.temp_groups2[i].goals.length-1)
                    {
                        $scope.temp_groups2[i].FINAL_SCORE = ($scope.temp_groups2[i].TOTAL/ ($scope.temp_groups2[i].WEIGHTAGE*5))*100
                    }
                    return true;
                }
                else {
                    if (i == $scope.temp_groups2.length - 1 && j == $scope.temp_groups2[i].goals.length-1) {
                        $scope.temp_groups2[i].FINAL_SCORE = ($scope.temp_groups2[i].TOTAL/ ($scope.temp_groups2[i].WEIGHTAGE*5))*100
                        return false;
                    }
                }
            }

            // $scope.temp_groups2[i].FINAL_SCORE = ($scope.temp_groups2[i].TOTAL/ ($scope.temp_groups2[i].WEIGHTAGE*5))*100
        }
    }


    $scope.all_colleague_codes = [];

    $scope.searchColleagueCodes = function(text){
        // console.log(text)
        if(text.length >= 4){
            $http.post("/dash/atms/search/colleagueCodes/"+text, $scope.searchColleagueBody)
                .success(function(res){
                    // console.log(res)
                    if(res.length){
                        $scope.all_colleague_codes = res;
                        jQuery.noConflict();
                        $(".colleagueCodeDropdown").css('display', 'block')
                    }
                    else
                        $scope.all_colleague_codes = [];

                })
        }
        else{
            jQuery.noConflict();
            $(".colleagueCodeDropdown").css('display', 'none')
        }
    }
    
    $scope.getNcNrDepts = function(){
        if($scope.reportsNcNr.resort && $scope.reportsNcNr.resort!='')
        {
            $scope.reportsNcNr.allDepartment ='';
            $http.post("/dash/nc/nr/depts", $scope.reportsNcNr)
                .success(function(depts){
                    // console.log('----- nc nr depts ----')
                    // console.log(depts);
                    $scope.ncnrdepts = depts;
                })
        }
    }

    // Download Reports
    $scope.atmsDownloadReports = function(tab,res,dashboard_statements){

        if(tab == 1){
            if(res){
                var result = "Role, Goal Title, Goal Statement, Evaluation By, Wtg, Department, Frequency,Resort, RATING_1, RATING_2, RATING_3, RATING_4, RATING_5, Created Date,Created By, Modified Date,Modified By\n";

                for(var i=0; i< res.length; i++){

                    result += res[i].ROLE;
                    result += ',';

                    if(res[i].GOAL_TITLE){
                        if ((res[i]['GOAL_TITLE']).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i]['GOAL_TITLE'] + '"'
                            res[i].GOAL_TITLE = quotesWrapped;

                        }
                        if (res[i]['GOAL_TITLE'] == undefined || res[i]['GOAL_TITLE'] == 'undefined' || !res[i]['GOAL_TITLE']) { //undefined
                            res[i].GOAL_TITLE = ' '
                        }

                        if ((res[i]['GOAL_TITLE']).toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i]['GOAL_TITLE'].replace('\n', ' ');
                            res[i].GOAL_TITLE = quotesWrapped
                        }
                        if ((res[i]['GOAL_TITLE']).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i]['GOAL_TITLE'].replace('\t', ' ');
                            res[i].GOAL_TITLE = quotesWrapped
                        }
                        result += res[i].GOAL_TITLE;
                        result += ',';
                    }
                    else{
                        res[i].GOAL_TITLE = '';
                        result += res[i].GOAL_TITLE;
                        result += ',';
                    }

                    if(res[i].GOAL_STATEMENT){
                        if ((res[i]['GOAL_STATEMENT']).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i]['GOAL_STATEMENT'] + '"'
                            res[i].GOAL_STATEMENT = quotesWrapped;

                        }
                        if (res[i]['GOAL_STATEMENT'] == undefined || res[i]['GOAL_STATEMENT'] == 'undefined' || !res[i]['GOAL_STATEMENT']) { //undefined
                            res[i].GOAL_STATEMENT = ' '
                        }

                        if ((res[i]['GOAL_STATEMENT']).toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i]['GOAL_STATEMENT'].replace('\n', ' ');
                            res[i].GOAL_STATEMENT = quotesWrapped
                        }
                        if ((res[i]['GOAL_STATEMENT']).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i]['GOAL_STATEMENT'].replace('\t', ' ');
                            res[i].GOAL_STATEMENT = quotesWrapped
                        }
                        result += res[i].GOAL_STATEMENT;
                        result += ',';
                    }
                    else{
                        res[i].GOAL_STATEMENT = '';
                        result += res[i].GOAL_STATEMENT;
                        result += ',';
                    }



                    if(res[i].EVALUATION_BY_ROLE){
                        result += res[i].EVALUATION_BY_ROLE;
                        result += ',';
                    }
                    else{
                        res[i].EVALUATION_BY_ROLE = '';
                        result += res[i].EVALUATION_BY_ROLE;
                        result += ',';
                    }


                    if(res[i].WEIGHTAGE){
                        result += res[i].WEIGHTAGE;
                        result += ',';
                    }
                    else{
                        res[i].WEIGHTAGE = '';
                        result += res[i].WEIGHTAGE;
                        result += ',';
                    }

                    if(res[i].DEPARTMENT){
                        result += res[i].DEPARTMENT;
                        result += ',';
                    }
                    else{
                        res[i].DEPARTMENT = '';
                        result += res[i].DEPARTMENT;
                        result += ',';
                    }

                    if(res[i].EVALUATION_TYPE){
                        result += res[i].EVALUATION_TYPE;
                        result += ',';
                    }
                    else{
                        res[i].EVALUATION_TYPE = '';
                        result += res[i].EVALUATION_TYPE;
                        result += ',';
                    }

                    if(res[i].RESORT){
                        result += res[i].RESORT;
                        result += ',';
                    }
                    else{
                        res[i].RESORT = '';
                        result += res[i].RESORT;
                        result += ',';
                    }

                    if(res[i].RATING_1){
                        if ((res[i]['RATING_1']).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i]['RATING_1'] + '"'
                            res[i].RATING_1 = quotesWrapped;

                        }

                        if ((res[i]['RATING_1']).toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i]['RATING_1'].replace('\n', ' ');
                            res[i].RATING_1 = quotesWrapped
                        }
                        if ((res[i]['RATING_1']).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i]['RATING_1'].replace('\t', ' ');
                            res[i].RATING_1 = quotesWrapped
                        }
                        result += res[i].RATING_1;
                        result += ',';
                    }
                    else{
                        res[i].RATING_1 = '';
                        result += res[i].RATING_1;
                        result += ',';
                    }


                    if(res[i].RATING_2){
                        if ((res[i]['RATING_2']).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i]['RATING_2'] + '"'
                            res[i].RATING_2 = quotesWrapped;

                        }

                        if ((res[i]['RATING_2']).toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i]['RATING_2'].replace('\n', ' ');
                            res[i].RATING_2 = quotesWrapped
                        }
                        if ((res[i]['RATING_2']).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i]['RATING_2'].replace('\t', ' ');
                            res[i].RATING_2 = quotesWrapped
                        }
                        result += res[i].RATING_2;
                        result += ',';
                    }
                    else{
                        res[i].RATING_2 = '';
                        result += res[i].RATING_2;
                        result += ',';
                    }

                    if(res[i].RATING_3){
                        if ((res[i]['RATING_3']).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i]['RATING_3'] + '"'
                            res[i].RATING_3 = quotesWrapped;
                        }


                        if ((res[i]['RATING_3']).toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i]['RATING_3'].replace('\n', ' ');
                            res[i].RATING_3 = quotesWrapped
                        }
                        if ((res[i]['RATING_3']).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i]['RATING_3'].replace('\t', ' ');
                            res[i].RATING_3 = quotesWrapped
                        }
                        result += res[i].RATING_3;
                        result += ',';
                    }
                    else{
                        res[i].RATING_3 = '';
                        result += res[i].RATING_3;
                        result += ',';
                    }

                    if(res[i].RATING_4){
                        if ((res[i]['RATING_4']).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i]['RATING_4'] + '"'
                            res[i].RATING_4 = quotesWrapped;

                        }

                        if ((res[i]['RATING_4']).toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i]['RATING_4'].replace('\n', ' ');
                            res[i].RATING_4 = quotesWrapped
                        }
                        if ((res[i]['RATING_4']).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i]['RATING_4'].replace('\t', ' ');
                            res[i].RATING_4 = quotesWrapped
                        }
                        result += res[i].RATING_4;
                        result += ',';
                    }
                    else{
                        res[i].RATING_4 = '';
                        result += res[i].RATING_4;
                        result += ',';
                    }

                    if(res[i].RATING_5){
                        if ((res[i]['RATING_5']).toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i]['RATING_5'] + '"'
                            res[i].RATING_5 = quotesWrapped;

                        }

                        if ((res[i]['RATING_5']).toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i]['RATING_5'].replace('\n', ' ');
                            res[i].RATING_5 = quotesWrapped
                        }
                        if ((res[i]['RATING_5']).toString().indexOf('\t') != -1) {
                            var quotesWrapped = result[i]['RATING_5'].replace('\t', ' ');
                            res[i].RATING_5 = quotesWrapped
                        }
                        result += res[i].RATING_5;
                        result += ',';
                    }
                    else{
                        res[i].RATING_5 = '';
                        result += res[i].RATING_5;
                        result += ',';
                    }

                    if(res[i].CREATED_DATE){
                        result += $scope.atmsFormatedDate(res[i].CREATED_DATE);
                        result += ',';
                    }
                    else{
                        res[i].CREATED_DATE = '';
                        result += res[i].CREATED_DATE;
                        result += ',';
                    }

                    if(res[i].CREATED_BY){
                        result += res[i].CREATED_BY;
                        result += ',';
                    }
                    else{
                        res[i].CREATED_BY = '';
                        result += res[i].CREATED_BY;
                        result += ',';
                    }

                    if(res[i].MODIFIED_DATE){
                        result += $scope.atmsFormatedDate(res[i].MODIFIED_DATE);
                        result += ',';
                    }
                    else{
                        res[i].MODIFIED_DATE = '';
                        result += res[i].MODIFIED_DATE;
                        result += ',';
                    }
                    if(res[i].MODIFIED_BY){
                        result += res[i].MODIFIED_BY;
                        result += ',';
                    }
                    else{
                        res[i].MODIFIED_BY = '';
                        result += res[i].MODIFIED_BY;
                        result += ',';
                    }

                    result += '\n';
                }

                var blob = new Blob([result], {type : "text/csv;charset=UTF-8"});
                //console.log(blob);
                window.URL = window.webkitURL || window.URL;
                var url = window.URL.createObjectURL(blob);

                var d = new Date();
                var anchor = angular.element('<a/>');

                anchor.attr({
                    href: url,
                    target: '_blank',
                    download: 'Goal_Reports_'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                })[0].click();
            }
        }

        if(tab == 2){
            if(res.length){
                var result = "Colleague Code, Colleague Name, Department,Role, Designation, Supervisor Code, Supervisor Name, Supervisor Designation, Phone Number, Assistant Manager Code, Assistant Manager Name, Assistant Manager Designation, Phone Number, Manager Code, Manager Name, Manager Designation, Phone Number,Created Date,Created By, Last Update, Update by,Image Modified By\n";

                for(var i=0; i< res.length; i++){

                    result += res[i].EMPLOYEE_ID;
                    result += ',';

                    result += res[i].sellername;
                    result += ',';

                    result += res[i].DEPARTMENT;
                    result += ',';

                    if(res[i].role){
                        if (res[i].role.toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i].role + '"';
                            res[i].role = quotesWrapped;
                        }
                        if (res[i].role.toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i].role.replace('\n', ' ');
                            res[i].role = quotesWrapped;
                        }
                        if (res[i].role.toString().indexOf('\t') != -1) {
                            var quotesWrapped = res[i].role.replace('\t', ' ');
                            res[i].role = quotesWrapped;
                        }

                        result += res[i].role;
                        result += ',';
                    }else
                        result += ',';

                    if(res[i].Designation){
                        if (res[i].Designation.toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i].Designation + '"';
                            res[i].Designation = quotesWrapped;
                        }
                        if (res[i].Designation.toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i].Designation.replace('\n', ' ');
                            res[i].role = quotesWrapped;
                        }
                        if (res[i].Designation.toString().indexOf('\t') != -1) {
                            var quotesWrapped = res[i].Designation.replace('\t', ' ');
                            res[i].Designation = quotesWrapped;
                        }

                        result += res[i].Designation;
                        result += ',';
                    }else
                        result += ',';


                    if(res[i].Supervisor_Code){
                        result += res[i].Supervisor_Code;
                        result += ',';
                    }
                    else{
                        res[i].Supervisor_Code = '';
                        result += res[i].Supervisor_Code;
                        result += ',';
                    }

                    if(res[i].Supervisor_Name){
                        result += res[i].Supervisor_Name;
                        result += ',';
                    }
                    else{
                        res[i].Supervisor_Name = '';
                        result += res[i].Supervisor_Name;
                        result += ',';
                    }


                    if(res[i].Supervisor_Designation) {
                        if (res[i].Supervisor_Designation.toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i].Supervisor_Designation + '"';
                            res[i].Supervisor_Designation = quotesWrapped;
                        }
                        if (res[i].Supervisor_Designation.toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i].Supervisor_Designation.replace('\n', ' ');
                            res[i].Supervisor_Designation = quotesWrapped;
                        }
                        if (res[i].Supervisor_Designation.toString().indexOf('\t') != -1) {
                            var quotesWrapped = res[i].Supervisor_Designation.replace('\t', ' ');
                            res[i].Supervisor_Designation = quotesWrapped;
                        }

                        result += res[i].Supervisor_Designation
                        result += ',';
                    }else
                        result += ',';

                    if(res[i].Supervisor_Phone_Number){
                        result += res[i].Supervisor_Phone_Number;
                        result += ',';
                    }
                    else{
                        res[i].Supervisor_Phone_Number = '';
                        result += res[i].Supervisor_Phone_Number;
                        result += ',';
                    }

                    if(res[i].Assistant_Manager_Code){
                        result += res[i].Assistant_Manager_Code;
                        result += ',';
                    }
                    else{
                        res[i].Assistant_Manager_Code = '';
                        result += res[i].Assistant_Manager_Code;
                        result += ',';
                    }

                    if(res[i].Assistant_Manager_Name){
                        result += res[i].Assistant_Manager_Name;
                        result += ',';
                    }
                    else{
                        res[i].Assistant_Manager_Name = '';
                        result += res[i].Assistant_Manager_Name;
                        result += ',';
                    }

                    if(res[i].Assistant_Manager_Designation) {
                        if (res[i].Assistant_Manager_Designation.toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i].Assistant_Manager_Designation + '"';
                            res[i].Assistant_Manager_Designation = quotesWrapped;
                        }
                        if (res[i].Assistant_Manager_Designation.toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i].Assistant_Manager_Designation.replace('\n', ' ');
                            res[i].Assistant_Manager_Designation = quotesWrapped;
                        }
                        if (res[i].Assistant_Manager_Designation.toString().indexOf('\t') != -1) {
                            var quotesWrapped = res[i].Assistant_Manager_Designation.replace('\t', ' ');
                            res[i].Assistant_Manager_Designation = quotesWrapped;
                        }

                        result += res[i].Assistant_Manager_Designation;
                        result += ',';
                    }else
                        result += ',';

                    if(res[i].Assistant_Manager_Phone_Number){
                        result += res[i].Assistant_Manager_Phone_Number;
                        result += ',';
                    }
                    else{
                        res[i].Assistant_Manager_Phone_Number = '';
                        result += res[i].Assistant_Manager_Phone_Number;
                        result += ',';
                    }

                    if(res[i].Manager_Code){
                        result += res[i].Manager_Code;
                        result += ',';
                    }
                    else{
                        res[i].Manager_Code = '';
                        result += res[i].Manager_Code;
                        result += ',';
                    }

                    if(res[i].Manager_Name){
                        result += res[i].Manager_Name;
                        result += ',';
                    }
                    else{
                        res[i].Manager_Name = '';
                        result += res[i].Manager_Name;
                        result += ',';
                    }

                    if(res[i].Manager_Designation) {
                        if (res[i].Manager_Designation.toString().indexOf(',') != -1) {
                            var quotesWrapped = '"' + res[i].Manager_Designation + '"';
                            res[i].Manager_Designation = quotesWrapped;
                        }
                        if (res[i].Manager_Designation.toString().indexOf('\n') != -1) {
                            var quotesWrapped = res[i].Manager_Designation.replace('\n', ' ');
                            res[i].Manager_Designation = quotesWrapped;
                        }
                        if (res[i].Manager_Designation.toString().indexOf('\t') != -1) {
                            var quotesWrapped = res[i].Manager_Designation.replace('\t', ' ');
                            res[i].Manager_Designation = quotesWrapped;
                        }

                        result += res[i].Manager_Designation;
                        result += ',';
                    }else
                        result += ',';


                    if(res[i].Manager_Phone_Number){
                        result += res[i].Manager_Phone_Number;
                        result += ',';
                    }
                    else{
                        res[i].Manager_Phone_Number = '';
                        result += res[i].Manager_Phone_Number;
                        result += ',';
                    }


                    if(res[i].CREATED_DATE) {
                        result += $scope.atmsFormatedDate(res[i].CREATED_DATE);
                        result += ',';
                    }
                    else{
                        res[i].CREATED_DATE = '';
                        result += ',';
                    }


                    if(res[i].CREATED_BY) {
                        result += res[i].CREATED_BY;
                        result += ',';
                    }
                    else{
                        res[i].CREATED_BY = '';
                        result += ',';
                    }

                    if(res[i].last_updated) {
                        result += $scope.atmsFormatedDate(res[i].last_updated);
                        result += ',';
                    }
                    else{
                        res[i].last_updated = '';
                        result += ',';
                    }


                    if(res[i].last_updated_by) {
                        result += res[i].last_updated_by;
                        result += ',';
                    }
                    else{
                        res[i].last_updated_by = '';
                        result += ',';
                    }

                    if(res[i].IMAGE_MODIFIED_BY) {
                        result += res[i].IMAGE_MODIFIED_BY;
                        result += ',';
                    }
                    else{
                        res[i].IMAGE_MODIFIED_BY = '';
                        result += ',';
                    }

                    result += '\n';
                }

                var blob = new Blob([result], {type : "text/csv;charset=UTF-8"});
                //console.log(blob);
                window.URL = window.webkitURL || window.URL;
                var url = window.URL.createObjectURL(blob);

                var d = new Date();
                var anchor = angular.element('<a/>');

                anchor.attr({
                    href: url,
                    target: '_blank',
                    download: 'Colleauges_Reports_'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                })[0].click();
            }
        }

        if(tab == 3){
            if(res){
                var result = "Colleague Code, Colleague Name, Designation,";
                var count =0;

                for (var j = 0; j <= 1; j++) {

                    /*if(j == 0){
                     var result = 'Dates';
                     result += ',';
                     }
                     else{
                     result += $scope.getDownloadableDate($scope.individualReportFilter.startDate, j-1);
                     result += ',';
                     }*/
                    if(j==0)
                    {

                        for (var i = 0; i < dashboard_statements.cols.length; i++) {

                            var temp = dashboard_statements.cols[i].GOAL_STATEMENT;

                            // if(result.indexOf(res[i].statement[0]) == -1)
                            // {
                            if (dashboard_statements.cols[i].GOAL_STATEMENT.toString().indexOf(',') != -1) {
                                var quotesWrapped = '"' + dashboard_statements.cols[i].GOAL_STATEMENT + '"';
                                temp = quotesWrapped;
                            }
                            if (dashboard_statements.cols[i].GOAL_STATEMENT.toString().indexOf(' ') != -1) {
                                var quotesWrapped = '"' + dashboard_statements.cols[i].GOAL_STATEMENT + '"';
                                temp = quotesWrapped;
                            }
                            if (dashboard_statements.cols[i].GOAL_STATEMENT.toString().indexOf('\n') != -1) {
                                var quotesWrapped = dashboard_statements.cols[i].GOAL_STATEMENT.replace('\n', ' ');
                                temp = quotesWrapped;
                            }
                            if (dashboard_statements.cols[i].GOAL_STATEMENT.toString().indexOf('\t') != -1) {
                                var quotesWrapped = dashboard_statements.cols[i].GOAL_STATEMENT.replace('\t', ' ');
                                temp = quotesWrapped;
                            }
                            result += temp;

                            if (i == dashboard_statements.cols.length - 1) {

                                result += ', Total, Final Score\n ';
                            } else
                                result += ',';
                            // }
                        }
                    }

                    else {

                        console.log(res.length)

                        //unique evaluation array with grouped goals -- the main ng-repeat after the groupFunc
                        for(var det=0; det<res.length; det++)
                        {
                            if(res[det].DETAILS.length)
                            {
                                result += res[det].DETAILS[0].EMPLOYEE_ID;
                                result += ',';

                                result += res[det].DETAILS[0].sellername;
                                result += ',';

                                result += res[det].DETAILS[0].Designation ? res[det].DETAILS[0].Designation : res[det].DETAILS[0].role;
                                result += ',';

                                //dashboard_statements is the grouped array for cols and display
                                for (var k = 0; k < dashboard_statements.cols.length; k++) {

                                    for(var index=0; index < dashboard_statements.display.length; index++)
                                    {
                                        if(res[det].EVALUATION == dashboard_statements.display[index].EVALUATION)
                                        {
                                            // if(dashboard_statements.cols[k].GOAL_ID == dashboard_statements.display[index].GOAL_ID)
                                            // {

                                            //To check if the goal statement has score in the dashboard_statements.display array
                                            if(dashboard_statements.display[index][dashboard_statements.cols[k].GOAL_STATEMENT]) {
                                                result += dashboard_statements.display[index][dashboard_statements.cols[k].GOAL_STATEMENT];
                                            }

                                            // }
                                        }
                                    }
                                    result += ',';



                                    if (k == dashboard_statements.cols.length - 1) {
                                        result += res[det].TOTAL ? res[det].TOTAL : '';
                                        result += ',';

                                        result += res[det].FINAL_SCORE ? res[det].FINAL_SCORE.toFixed(2) : '';
                                        result += ',';

                                        result += ' \n ';
                                    }

                                }

                                if (det == res.length - 1) {
                                    result += ' \n ';
                                }
                            }
                            else
                            {
                                if (det == res.length - 1) {
                                    result += ' \n ';
                                }
                            }

                        }

                    }

                }


                var blob = new Blob([result], {type: "text/csv;charset=UTF-8"});
                //console.log(blob);
                window.URL = window.webkitURL || window.URL;
                var url = window.URL.createObjectURL(blob);

                var d = new Date();
                var anchor = angular.element('<a/>');

                anchor.attr({
                    href: url,
                    target: '_blank',
                    download: 'Dashboard_Reports_' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '.csv'
                })[0].click();
            }
        }

        if(tab == 4) {

            $http.post('/dash/reports/atms/download/individualReport', individualReportSearchObj)
                .success(function (res) {
                    console.log(res);
                    if (res) {
                        for (var j = 0; j <= Math.round($scope.atmsIndividualReportDays); j++) {

                            if(j == 0){
                                var result = 'Dates';
                                result += ',';
                            }
                            else{
                                result += $scope.getDownloadableDate($scope.individualReportFilter.startDate, j-1);
                                result += ',';
                            }
                            for (var i = 0; i < res.length; i++) {

                                if(j==0){
                                    var temp = res[i].goal_statement;
                                    if (res[i].goal_statement.toString().indexOf(',') != -1) {
                                        var quotesWrapped = '"' + res[i].goal_statement + '"';
                                        temp = quotesWrapped;
                                    }
                                    if (res[i].goal_statement.toString().indexOf(' ') != -1) {
                                        var quotesWrapped = '"' + res[i].goal_statement + '"';
                                        temp = quotesWrapped;
                                    }
                                    if (res[i].goal_statement.toString().indexOf('\n') != -1) {
                                        var quotesWrapped = res[i].goal_statement.replace('\n', ' ');
                                        temp = quotesWrapped;
                                    }
                                    if (res[i].goal_statement.toString().indexOf('\t') != -1) {
                                        var quotesWrapped = res[i].goal_statement.replace('\t', ' ');
                                        temp = quotesWrapped;
                                    }
                                    result += temp+' - '+ res[i].evaluation_type;
                                    result += ',';

                                    result += 'Comment';

                                    if (i == res.length - 1) {
                                        result += ' \n ';
                                    } else
                                        result += ',';
                                }
                                else{
                                    function fillData(count) {
                                        if (res[i].goal_end[count] && res[i].goal_end[count]!= res[i].goal_start[count]) {
                                            if ($scope.inDateRange(res[i].goal_end[count], res[i].goal_start[count], '') == 'not_started') {
                                                result += '';
                                                result += ',';

                                                result += '';
                                            } else if ($scope.inDateRange(res[i].goal_end[count], res[i].goal_start[count], '')) {
                                                result += res[i].rating[count] ? res[i].rating[count].STAR : (res[i].not_completed[count] ? 'NC' : 'NR');
                                                result += ',';

                                                result += res[i].comment[count];
                                            } else {
                                                if (res[i].goal_end[count+1]) {
                                                    fillData(count+1);
                                                } else {
                                                    result += '';
                                                    result += ',';

                                                    result += '';
                                                }
                                            }
                                        }
                                        else{
                                            if($scope.inDateRange('', res[i].goal_start[count], true) == 'not_started'){
                                                result += '';
                                                result += ',';

                                                result += '';
                                            }
                                            else if($scope.inDateRange('', res[i].goal_start[count], true)){
                                                result += res[i].rating[count]? res[i].rating[count].STAR : (res[i].not_completed[count] ? 'NC' : 'NR');
                                                result += ',';

                                                result += res[i].comment[count];
                                            }
                                            else{
                                                if(res[i].goal_start[count+1]){
                                                    fillData(count+1);
                                                }
                                                else{
                                                    result += '';
                                                    result += ',';

                                                    result += '';
                                                }
                                            }
                                        }
                                    }

                                    fillData(0);

                                    if (i == res.length - 1) {
                                        result += ' \n ';
                                    } else
                                        result += ',';
                                }
                            }
                        }

                        var blob = new Blob([result], {type: "text/csv;charset=UTF-8"});
                        //console.log(blob);
                        window.URL = window.webkitURL || window.URL;
                        var url = window.URL.createObjectURL(blob);

                        var d = new Date();
                        var anchor = angular.element('<a/>');

                        anchor.attr({
                            href: url,
                            target: '_blank',
                            download: 'Individual_Reports_' +$scope.selected_Colleague_code.EVALUATION_ID + ($scope.selected_Colleague_code.EVALUATION_NAME ? ('_' + $scope.selected_Colleague_code.EVALUATION_NAME) : '') + '_' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '.csv'
                        })[0].click();
                    }
                })

        }

        if(tab == 5){
            if(res){
                var result = "Colleague Code, Colleague Name, Department, Designation, No of Goals, No of NCs, No of NRs\n";

                for(var i=0; i< res.length; i++){

                    if(res[i].NC != 0 || res[i].NR != 0)
                    {
                        result += res[i]._id.EMPLOYEE_ID;
                        result += ',';

                        result += res[i]._id.EVALUATOR_NAME;
                        result += ',';

                        result += res[i].DEPARTMENT ? res[i].DEPARTMENT : '';
                        result += ',';

                        result += res[i].DESIGNATION ? res[i].DESIGNATION : '';
                        result += ',';

                        result += res[i].TOTAL ? res[i].TOTAL : '-';
                        result += ',';

                        result += res[i].NC ? res[i].NC : '0';
                        result += ',';

                        result += res[i].NR ? res[i].NR : '0';
                        result += ',';

                        result += '\n';
                    }

                }

                var blob = new Blob([result], {type : "text/csv;charset=UTF-8"});
                //console.log(blob);
                window.URL = window.webkitURL || window.URL;
                var url = window.URL.createObjectURL(blob);

                var d = new Date();
                var anchor = angular.element('<a/>');

                anchor.attr({
                    href: url,
                    target: '_blank',
                    download: 'NC/NR_Reports_'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                })[0].click();
            }
        }
    }

    $scope.atmsFormatedDate = function(d){
        if(d){
            var date = new Date(d);
            var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            var year = date.getUTCFullYear();
            var month =  monthNames[date.getMonth()];
            var d = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
            var hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
            var minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
            var seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
            var ampm = hour >= 12 ? ' PM' : ' AM';
            var dateformat = d + '-' + month + '-' + year + ' ' + hour + ':' + minute + ' ' + ampm ;
            return dateformat
        }
        else
            return '';
    }

    $scope.getDownloadableDate = function(date, days){
        var tempDate = new Date(date);
        tempDate.setDate(tempDate.getDate() + days);
        $scope.newColumnDate = new Date(tempDate);
        var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
        var month =  monthNames[tempDate.getMonth()];
        var d = tempDate.getDate();
        var dateformat = d + '-' + month ;
        //console.log(dateformat)
        return dateformat
    }

    $scope.inDateRange = function(goal_end, goal_start, type){
        if(type){
            var goalStartDate = new Date(goal_start);
            if($scope.newColumnDate >= goalStartDate) {
                if(($scope.newColumnDate).toString() == (goalStartDate).toString()){
                    return true;
                }
                else
                    return false;
            }
            else
                return 'not_started';
        }
        else{
            var goalEndDate = new Date(goal_end);
            var goalStartDate = new Date(goal_start);
            if($scope.newColumnDate >= goalStartDate) {
                if ($scope.newColumnDate <= goalEndDate){
                    return true;
                }
                else
                    return false;
            }
            else
                return 'not_started';
        }
    }

    $scope.individualReportPdf = function(){

        document.getElementById('individualReport-print-body').style.display = 'block';

        var options = {
            pagesplit : true
        }

        var pdf = new jsPDF('p', 'pt', 'a4');

        jQuery.noConflict();
        pdf.addHTML($("#individualReport-print-body"), 0, 0, options, function() {
            var title = 'Individual_Reports_' +$scope.selected_Colleague_code.EVALUATION_ID + ($scope.selected_Colleague_code.EVALUATION_NAME ? ('_' + $scope.selected_Colleague_code.EVALUATION_NAME) : '') + '.pdf';
            pdf.save(title);
            document.getElementById('individualReport-print-body').style.display = 'none';
        });

    }

})
angular.module('ebs.controller')



    .controller("AtmosphereGoalsCtrl",function ($scope, $filter, $http,Settings, $modal, $window, toastr, $interval,$sce,$mdDialog) {
        console.log("Hello From  AtmosphereGoalsCtrl Controller .... !!!!");

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
    $scope.goalssearchwithemployee={};


    $scope.goalSearch.filter = '';
    var goalSearchObj = {};

    var viewBy={};
    viewBy.goals = 12;
    var initialViewBy = 60;
//     $scope.itemSearch.filter = '';


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
        $scope.sellerNames = []; //stores seller name
            $scope.desc = [];


   // $scope.reportsGoalSearch.filter = '';

//    var reportsGoalSearchObj = {};
//    // $scope.pageNumber=0;
//    var reportsNcNrObj = {};
//    $scope.reportsNcNr = {};
//    $scope.reportsNcNr.filter = '';
//    $scope.atmsFilter5 = true;
//    viewBy.reportsGoals = 12;
//    $scope.atmsColleagues = {};
//    var colleaguesSearchObj = {};
//    $scope.colleaguesReportSearch = {};
//    $scope.colleaguesReportSearch.filter = '';
//    var colleaguesSearchBy = ['sellername','EMPLOYEE_ID','DEPARTMENT','role','Designation','Supervisor_Code','Supervisor_Name','Supervisor_Designation','Assistant_Manager_Code','Assistant_Manager_Name','Assistant_Manager_Designation','Manager_Code','Manager_Name','Manager_Designation'];
//    $scope.colleaguesReportFilter = {};

//    $scope.atmsIndividualReport = {};
//    var individualReportSearchObj = {};
//    var atmsdashboardSearch={}
//    $scope.individualReportSearch = {};
//    $scope.individualReportSearch.filter = '';
//    var individualReportSearchBy = ['goal_statement'];
//    $scope.individualReportFilter = {};
//    $scope.allIndividualReportData = [];
//    $scope.individualReportFilter.startDate = '';
//    $scope.individualReportFilter.endDate = new Date();
//    $scope.individualReportFilter.endDate.setHours(23, 59, 59, 59);
//    $scope.atmsIndividualReportDays =0;
//    $scope.resortname='';
//    var scoreCardObj = {};
//    $scope.scoreCardFilterObj = {};
//    $scope.scoreCardFilterObj.filter = '';
//    viewBy.scoreCard = 12;
//    var scoreCardSearchBy = ['sellername'];
//    $scope.showdepartments=false;

//    var reportsDashboardSearchObj = {};
//    $scope.reportsDashboardSearch = {};
//    $scope.reportsDashboardSearch.filter = '';
//    var dashboardReportSearchBy = ['statement','score','personal_details'];
//    $scope.colleagueSearcgObj={}
//    var atmsUsersSearchObj = {};
//    $scope.atmsUsersSearch = {};
//    $scope.atmsUsersSearch.filter = '';
//
//    $scope.branchName = ''
//    $scope.atmsDasboard ={};
//    $scope.atms_Dashboard_filter = {}
//    $scope.flagforncNr=false;
//    $scope.qbConnect = false;
//    $scope.showLoader = false;
//    $scope.distinctperformance=[]

    //End of Atmosphere Declarations

        //Apply item search Filter
        $scope.goalSearchFilter = function(){
            console.log($scope.goalSearch.filter)
            if($scope.goalSearch.filter == ''){
            Settings.alertPopup('WARNING',"Please type text in search box");
//
//                bootbox.alert({
//                    title: 'Warning',
//                    message : "Please type text in search box"
//                })
            }
            else{
                goalSearchObj.viewLength = 0;
                goalSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.goals;

                $scope.allGoals = [];
                $scope.reportGoals = [];
             //   $scope.tempGoals = [];

                if($scope.goalSearch.filter){
                    goalSearchObj.searchFor = $scope.goalSearch.filter;
                    goalSearchObj.searchBy = goalSearchBy;
                }
                if($scope.applicationType == 'Atmosphere' && $scope.user.sellerObject) {
                    goalSearchObj.resort = $scope.user.sellerObject.Resort;
                }

                $http.post('/dash/mastergoals', goalSearchObj)
                    .success($scope.renderGoals);

                $http.post('/dash/mastergoals/count', goalSearchObj)
                    .success(function(response){
                        $scope.transactionCount(response,29)
                    });
                $scope.showItemFilter = true;
            }
        }
                     $scope.renderGoals = function (goals_list) {

                         var goalResort = {};
                         console.log("Render Goals-->" + goals_list.length);

                         if($scope.allGoals.length != 0) {
                             for(var i=0; i<goals_list.length; i++) {
                                 $scope.allGoals.push(goals_list[i]);
                             }
                         }

                         else {
                             $scope.allGoals = goals_list;
                         }
                         console.log($scope.allGoals);
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

                         $http.post('/dash/allGoals/resorts',goalResort)
                             .success(function (response) {
                                 console.log("All Goals reosrts--------->>>" + response.length);
                                 $scope.goalsResort = response; // -- resort dropdown with all the data for goals report
                             });
                     };

        $scope.getAllGoals=function(){
                        console.log("***** Tab 29 : Fetching all Goals")
                        $scope.viewLength = 0;
                        $scope.newViewBy = viewBy.goals;
                        $scope.goalSearch.filter = '';
                        /*$http.get("/dash/goals")
                         .success(function(response){
                         $scope.allGoals = response;
                         console.log($scope.allGoals)
                         })*/


                        goalSearchObj.viewLength = 0;
                        goalSearchObj.viewBy = 10;
                        goalSearchObj.searchBy = [];
                        goalSearchObj.searchFor = '';
                        if($scope.applicationType == 'Atmosphere' && $scope.user.sellerObject) {
                            goalSearchObj.resort = $scope.user.sellerObject.Resort;
                        }

                        $scope.allGoals = [];
                        $scope.reportGoals = [];
                        $http.post("/dash/mastergoals", goalSearchObj)
                            .success($scope.renderGoals);

                        $http.post('/dash/mastergoals/count', goalSearchObj)
                            .success(function (response) {
                                console.log("Goals count--------->>>"+response.length);
                                $scope.transactionCount(response, 29)
                            });


                        $http.get('/dash/allUsers')
                            .success(function (response) {
                                console.log("Goals users count--------->>>")
                                // console.log(response)
                                if(response.length) $scope.allGoalUsers = response;
                                console.log($scope.allGoalUsers);

                            });
        }
         $scope.getAllGoals();
             $scope.transactionCount = function(response, tab){
                 switch(tab){


                        case 29:
                         console.log("response goals : count:");
                         console.log(response);
                         if(response){
                             if(response > viewBy.goals){
                                 $scope.allGoals_count = response;
                             }
                             else if(response <= viewBy.goals){
                                 $scope.allGoals_count = response;
                                 $scope.newViewBy = response;
                             }
                             else{
                                 $scope.allGoals = [];
                                 $scope.reportGoals = [];
                            //     $scope.tempGoals = [];
                                 $scope.newViewBy = 1;
                                 $scope.allGoals_count = 0;
                                 $scope.viewLength = -1;
                             }
                         }
                         else{
                             $scope.allGoals = [];
                             $scope.reportGoals = [];
                          //   $scope.tempGoals = [];
                             $scope.newViewBy = 1;
                             $scope.allGoals_count = 0;
                             $scope.viewLength = -1;
                         }

                         break;

                 }
             }
                 $scope.selectedGoal = {}
                 $scope.selectGoal = function(col,item) {
                 console.log(col);
                 console.log(item);
                     var evaluation = [];
                     var evaluator = [];
                     $scope.assign = []

                     $scope.editGoal.evaluator = {};
                     $scope.editGoal.evaluator1 = '';
                     $scope.editGoal.evaluation = {};
                     $scope.editGoal.evaluation1 = '';
                     $scope.editGoal.start = '';
                     $scope.editGoal.end = '';
                     $scope.addEvaluatorRow = false;

                     $scope.goalUserSelected = []
                     // console.log(col);
                     // console.log(item);
                     $scope.selectedGoal = item
                     // $scope.editGoal = item

                     $http.get("/dash/goals/" + item.GOAL_ID + "/" + 0 + "/" + 0)
                         .success(function (response) {
                             if (response.length) {
                                 // console.log(response)
                                 for (var i = 0; i < response.length; i++) {
                                     evaluation.push(response[i].EVALUATION)
                                     evaluator.push(response[i].EVALUATOR)


                                     $scope.selectedGoal.EVALUATOR = response[0].EVALUATOR
                                     $scope.selectedGoal.EVALUATION = evaluation

                                     $scope.assign.push({
                                         'EVALUATOR': response[i].EVALUATOR,
                                         'EVALUATION': response[i].EVALUATION,
                                         'START_DATE': response[i].START_DATE,
                                         'END_DATE': response[i].END_DATE,
                                         'ASSIGNMENT_ID': response[i].ASSIGNMENT_ID
                                     })
                                 }

                                 /*$scope.selectedGoal.EVALUATOR = remove_duplicates_safe(evaluator)
                                  $scope.selectedGoal.EVALUATION = evaluation

                                  for(var j=0; j<$scope.selectedGoal.EVALUATOR.length; j++)
                                  {
                                  var evaluator_temp = $scope.selectedGoal.EVALUATOR[j]
                                  $http.get("/dash/goals/"+item.GOAL_ID+"/"+$scope.selectedGoal.EVALUATOR[j])
                                  .success(function (response_evaluator)
                                  {
                                  (function(j){
                                  $scope.assign.push({
                                  'EVALUATOR' : response_evaluator[0].EVALUATOR,
                                  'EVALUATION' : response_evaluator
                                  })
                                  console.log(j);
                                  console.log($scope.assign);
                                  })(j);

                                  })


                                  }*/


                             }
                         })

                     // jQuery.noConflict();
                     // $('#goalModal').modal('show');

                     console.log("Assign Evaluator array----->>>")
                     console.log($scope.assign)
                 }

                     $scope.changeGoalButton = function(flag){
                         console.log("Change Goal Button------->>>");
                         console.log(flag);
                         $scope.allGoalsDept = [];
                         $scope.allGoalsEVroles = [];
                         $scope.allGoalsRoles = [];
                         $scope.userRole=[];

                          var goalDept = {}
                         if(flag) {

                             console.log(flag)
                             $scope.addGoalButton = true;
                             $scope.newGoal = {};

                         }
                         else{
                             $scope.addGoalButton = false;
                             $scope.newGoal = {};
                             // $scope.newGoal.RATING_SCALE = [];
                             $scope.desc = [];
                             // $scope.newItem.gst = defaultTaxObj;
                             // $scope.newItem.Manufacturer = 'DEFAULT';
                             // $scope.newItem.subCategory = 'DEFAULT';
                             // $scope.addItemSubCategory = $scope.itemSubCategories;
                             if($scope.user.sellerObject){
                                 goalDept.resort = $scope.user.sellerObject.Resort;
                             }
                             else{
                                 goalDept.resort = '';
                             }

                             $http.post('/dash/goalsDepartments',goalDept)
                                 .success(function (response) {
                                     console.log("ALL goals dept--------->>>"+ response.length)
                                     $scope.allGoalsDept = response
                                 });

                             $http.post('/dash/goalsRoles',goalDept)
                                 .success(function (response) {
                                     console.log("ALL goals roles--------->>>"+ response.length)
                                     $scope.allGoalsRoles = response
                                 });

                             $http.post('/dash/goalsEVrole',goalDept)
                                 .success(function (response) {
                                     console.log("ALL goals ev roles--------->>>"+ response.length)
                                     $scope.allGoalsEVroles = response
                                 });
                                 $http.get("/dash/userRoles")
                                  .success(function (response) {
                                   console.log("All Users Roles--------->>>" + response.length);
                                   $scope.userRole = response;
                                 });

                             $http.get("/dash/settings/get/evaluation")
                                 .success(function(response){
                                     console.log("Evaluation types" + response.length)
                                     $scope.settingsEvaluation = response[0].obj;
                                 });

                             $http.get("/dash/get/recentGoalID")
                                 .success(function(res){
                                     console.log(res)
                                     $scope.newGoal.GOAL_ID = res.GOAL_ID + 1;
                                 })

                         }

                     }
                         $scope.addAssignRow = function(tag,goal)
                         {
                             $scope.goalEdit = false
                             // if(tag == 'add')  $scope.assignUI.push({});
                             // else $scope.assignUI.splice(0,1);

                              console.log(goal)


                             if(tag == 'cancel')
                             {
                                 $scope.addEvaluatorRow = false;
                                 $scope.goalUserSelected = [];
                                 $scope.editGoal.evaluator = {};
                                 $scope.editGoal.evaluator1 = '';
                                 $scope.editGoal.evaluation = {};
                                 $scope.editGoal.evaluation1 = '';
                                 $scope.editGoal.start = '';
                                 $scope.editGoal.end = '';
                             }
                             else
                             {
                                 $http.get("/dash/settings/get/evaluation")
                                     .success(function(response)
                                     {
                                         console.log(response)
                                         if(response.length)
                                         {
                                             for(var i=0; i<response[0].obj.length; i++)
                                             {
                                                 //console.log(response[0].obj[i].name)
                                                 //console.log(goal.EVALUATION_TYPE)
                                                 if(response[0].obj[i].name == goal.EVALUATION_TYPE)
                                                 {
                                                     $scope.addEvaluatorRow = true;
                                                     break;
                                                 }
                                                 else
                                                 {
                                                     if(i == response[0].obj.length-1)
                                                     {
                                                      Settings.alertPopup('WARNING',"Setup evaluation delay days in settings before assigning goals");
//
//                                                         bootbox.alert({
//                                                             title : 'WARNING',
//                                                             message : 'Setup evaluation delay days in settings before assigning goals',
//                                                             className : 'text-center'
//                                                         })
                                                     }
                                                 }
                                             }
                                         }
                                         else
                                         {
                                           Settings.alertPopup('WARNING',"Setup evaluation delay days in settings before assigning goals");

//                                             bootbox.alert({
//                                                 title : 'WARNING',
//                                                 message : 'Setup evaluation delay days in settings before assigning goals',
//                                                 className : 'text-center'
//                                             })
                                         }

                                     })

                             }

                         }
                             $scope.goalsUsers = [];
                             $scope.searchEvaluator = function(text,index){

                                 if(text.length > 0){

                                     console.log(text.length)
                                     $http.get("/dash/search/evaluator/"+text)
                                         .success(function(res){

                                             $scope.goalsUsers = res;

                                             if(index >= 0)
                                             {
                                                 jQuery.noConflict();
                                                 $("."+index).css('display', 'block')
                                             }
                                             else
                                             {
                                                 jQuery.noConflict();
                                                 $(".evaluatorDropdown").css('display', 'block')
                                             }

                                         })
                                 }
                                 else{
                                     $scope.newTreatments = [];
                                     if(index >= 0)
                                     {
                                         jQuery.noConflict();
                                         $("."+index).css('display', 'none')
                                     }
                                     else
                                     {
                                         jQuery.noConflict();
                                         $(".evaluatorDropdown").css('display', 'none')
                                     }
                                 }

                                 if(index >= 0)
                                 {
                                     jQuery.noConflict();
                                     $("."+index).css('display', 'none')
                                 }
                                 else
                                 {
                                     jQuery.noConflict();
                                     $(".evaluatorDropdown").css('display', 'none')
                                 }
                             }

                             $scope.evaluationUsers = []
                             $scope.searchEvaluation = function(text){
                             console.log(text);
                                 if(text.length > 0){

                                     $scope.evaluationUsers = $filter('filter')($scope.evaluatorUsers, text);
                                     console.log($scope.evaluationUsers)

                                     jQuery.noConflict();
                                     $(".evaluationDropdown").css('display', 'block')
                                 }
                                 else{
                                     $scope.evaluationUsers = [];
                                     jQuery.noConflict();
                                     $(".evaluationDropdown").css('display', 'none')
                                 }

                                 // jQuery.noConflict();
                                 // $(".evaluationDropdown").css('display', 'none')
                             }
                                 $scope.evaluatorSelected = function(evaluator,goal)
                                 {
                                     $scope.evaluatorUsers =[];
                                     $scope.goalUserSelected = [];
                                     var evaluatorObj = {};
                                     try {
                                         evaluatorObj = JSON.parse(evaluator)
                                         $scope.editGoal.evaluator1 = evaluatorObj.sellername
                                         $scope.editGoal.evaluator = evaluatorObj
                                     }
                                     catch (e)
                                     {
                                         evaluatorObj = evaluator
                                         $scope.editGoal.evaluator1 = evaluatorObj.sellername
                                         $scope.editGoal.evaluator = evaluatorObj
                                     }


                                     var tempArrayGoal = []
                                     var sellerID = evaluatorObj.sellerid ? evaluatorObj.sellerid : evaluatorObj.EMPLOYEE_ID
                                     $http.get("/dash/evaluator/users/"+evaluatorObj.EMPLOYEE_ID+"/"+sellerID)
                                         .success(function (response_evaluator1)
                                         {
                                             console.log("Evaluator1"+response_evaluator1.length);
                                             if(response_evaluator1.length)
                                             {
                                                 // $scope.evaluatorUsers = response_evaluator1;


                                                 $http.get("/dash/goals/"+goal.GOAL_ID+"/"+evaluatorObj.EMPLOYEE_ID+"/"+sellerID)
                                                     .success(function (response_evaluator)
                                                     {
                                                         tempArrayGoal = response_evaluator;

                                                         if(tempArrayGoal.length)
                                                         {
                                                             for( var i = 0; i<response_evaluator1.length; i++){
                                                                 for( var j=0; j<tempArrayGoal.length; j++){
                                                                     if(response_evaluator1[i].sellerphone != tempArrayGoal[j].EVALUATION){
                                                                         $scope.evaluatorUsers.push(response_evaluator1[i]);
                                                                     }
                                                                 }
                                                             }
                                                         }
                                                         else
                                                         {
                                                             $scope.evaluatorUsers = response_evaluator1;
                                                         }
                                                     })
                                             }
                                         })

                                     jQuery.noConflict();
                                     $(".evaluatorDropdown").css('display', 'none')
                                 }
                                     $scope.goalUserSelected = []

                                     $scope.evaluationSelected = function(user,checkvalue)
                                     {
                                         var goalUsers;
                                         try{
                                             goalUsers = JSON.parse(user)
                                             $scope.editGoal.evaluation1 = goalUsers.sellername
                                             $scope.editGoal.evaluation = goalUsers
                                         }
                                         catch (e)
                                         {
                                             goalUsers = user
                                             $scope.editGoal.evaluation1 = goalUsers.sellername
                                             $scope.editGoal.evaluation = goalUsers
                                         }

                                         var index = $scope.goalUserSelected.findIndex(function(el) {
                                             return el.sellerid == goalUsers.sellerid;
                                         });

                                         if(checkvalue != 'remove')
                                         {
                                             if ($scope.goalUserSelected.indexOf(goalUsers) == -1) {
                                                 // SAFE
                                                 $scope.goalUserSelected.push(goalUsers);
                                             }
                                             // $scope.goalUserSelected.push(goalUsers);
                                         }
                                         else
                                         {
                                             $scope.goalUserSelected.splice(index, 1);
                                         }

                                         $scope.editGoal.evaluation1 = '';

                                         jQuery.noConflict();
                                         $(".evaluationDropdown").css("display", "none");

                                         console.log($scope.goalUserSelected)
                                     }
                                         //assign goal
                                         $scope.addGoalDetails = function(goal,evaluator,evaluation,startDate,endDate)
                                         {
                                             $scope.addEvaluatorRow = false;
                                             $scope.hideAddButton = true;

                                             if(goal && evaluator && evaluation && startDate && startDate != null &&
                                                 endDate && endDate != null && $scope.editGoal.evaluator1 && $scope.editGoal.evaluator1 != '')
                                             {
                                                 delete goal['_id']
                                                 var assign,assignedTo;

                                                 //To handle JSON to JSON parse exceptions
                                                 try {
                                                     assign = JSON.parse(evaluator);  // evaluator is a seller object
                                                     assignedTo = JSON.parse(evaluation); // evaluation is a seller object
                                                 }
                                                 catch(e)
                                                 {
                                                     assign = evaluator;
                                                     assignedTo = evaluation;
                                                 }

                                                 goal.EVALUATOR = assign.EMPLOYEE_ID;
                                                 goal.EVALUATOR_NUMBER = assign.sellerid;
                                                 goal.EVALUATION = $scope.goalUserSelected;
                                                 for(var i=0; i<goal.EVALUATION.length; i++)
                                                 {
                                                     //For every evaluation single assignment ID will be generated
                                                     var uniqueId = $scope.generateOrderId()
                                                     goal.EVALUATION[i].ASSIGNMENT_ID = Number(uniqueId) + i
                                                 }
                                                 var start = new Date(startDate);
                                                 var end = new Date(endDate);
                                                 var today = new Date();
                                                 today.setHours(0,0,0)

                                                 goal.START_DATE = [start.getFullYear(), (start.getMonth() + 1).padLeft(), start.getDate().padLeft()].join('-') + ' '
                                                     + [start.getHours().padLeft(), start.getMinutes().padLeft(), start.getSeconds().padLeft()].join(':');

                                                 goal.END_DATE = [end.getFullYear(), (end.getMonth() + 1).padLeft(), end.getDate().padLeft()].join('-') + ' '
                                                     + [end.getHours().padLeft(), end.getMinutes().padLeft(), end.getSeconds().padLeft()].join(':');

                                                 goal.MODIFIED_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
                                                     + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');

                                                 console.log(goal)
                                                 console.log($scope.goalUserSelected)


                                                 //Goals check if already assigned
                                                 $http.post("/dash/goalsCheck",goal)
                                                     .success(function(goalsExists)
                                                     {
                                                         console.log("Goals check"+ goalsExists)
                                                         if(goalsExists == ''){
                                                             //To calculate the evaluation delay date
                                                             $http.get("/dash/settings/get/evaluation")
                                                                 .success(function(evaluationType)
                                                                 {
                                                                     for(var i=0; i<evaluationType[0].obj.length; i++)
                                                                     {
                                                                         if(evaluationType[0].obj[i].name == goal.EVALUATION_TYPE)
                                                                         {
                                                                             goal.EVALUATION_DAYS = parseInt(evaluationType[0].obj[i].days)
                                                                         }
                                                                     }

                                                                     $http.post("/dash/add/goals", goal)
                                                                         .success(function(res){
                                                                             if(res){
                                                                                 /*jQuery.noConflict();
                                                                                  $('#storeModal').modal('hide')

                                                                                  bootbox.alert({
                                                                                  title : 'SUCCESS',
                                                                                  message : 'Successfully assigned Salesperson',
                                                                                  className : 'text-center'
                                                                                  })*/

                                                                                 // $scope.refreshTransactions(4);

                                                                                 if(res == 'no date')
                                                                                 {
                                                                                 Settings.alertPopup('ERROR',"Please select start date and end date");

//                                                                                     bootbox.alert({
//                                                                                         title : 'ERROR',
//                                                                                         message : 'Please select start date and end date',
//                                                                                         className : 'text-center'
//                                                                                     })
                                                                                 }
                                                                                 else
                                                                                 {
                                                                                     var user_body = {}
                                                                                     user_body.TODAY_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
                                                                                         + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');
                                                                                     user_body.EVALUATOR = goal.EVALUATOR;
                                                                                     user_body.EVALUATOR_NUMBER = assign.sellerid;
                                                                                     user_body.EVALUATION = $scope.goalUserSelected;

                                                                                     //console.log(user_body)

                                                                                     $http.post("/dash/calculate/users/performance",user_body)
                                                                                         .success(function(update_user)
                                                                                         {
                                                                                             console.log("User body---->>")
                                                                                             console.log(update_user)
                                                                                             if(update_user.n){
                                                                                                 $scope.hideAddButton = false;
                                                                                                 $scope.goalUserSelected = [];
                                                                                                 /*   bootbox.alert({
                                                                                                        title : 'Success',
                                                                                                        message : 'Goal assigned successfully!!',
                                                                                                        className : 'text-center'
                                                                                                    })*/

                                                                                                 $scope.editGoal.evaluator = {};
                                                                                                 $scope.editGoal.evaluator1 = '';
                                                                                                 $scope.editGoal.evaluation = {};
                                                                                                 $scope.editGoal.evaluation1 = '';
                                                                                                 $scope.editGoal.start = '';
                                                                                                 $scope.editGoal.end = '';
                                                                                             }
                                                                                             else{
                                                                                                 $scope.selectGoal(0,$scope.selectedGoal)
                                                                                                 $scope.hideAddButton = false;
                                                                                                 $scope.addEvaluatorRow = true;

                                                                                                 bootbox.alert({
                                                                                                     title : 'Error',
                                                                                                     message : 'Goal not assigned!! Please try again.',
                                                                                                     className : 'text-center'
                                                                                                 })
                                                                                             }

                                                                                         })

                                                                                     // jQuery.noConflict();
                                                                                     // $('#goalModal').modal('hide')
                                                                                 }

                                                                                 $scope.selectGoal(0,$scope.selectedGoal)
                                                                             }
                                                                         })
                                                                 })
                                                         }
                                                         else{
                                                             $scope.hideAddButton = false;
                                                             $scope.addEvaluatorRow = true;
                                                             Settings.alertPopup('ERROR',"Goals already assigned!");

//
//                                                             bootbox.alert({
//                                                                 title : 'ERROR',
//                                                                 message : 'Goals already assigned!',
//                                                                 className : 'text-center'
//                                                             })

                                                         }


                                                     });






                                             }
                                             else{
                                                 $scope.hideAddButton = false;
                                                 $scope.addEvaluatorRow = true;
                                                 Settings.alertPopup('ERROR',"Please fill all the four fields.");

//
//                                                 bootbox.alert({
//                                                     title : 'ERROR',
//                                                     message : 'Please fill all the four fields.',
//                                                     className : 'text-center'
//                                                 })

                                                 $scope.goalUserSelected = [];
                                                 $scope.editGoal.evaluator = {};
                                                 $scope.editGoal.evaluator1 = '';
                                                 $scope.editGoal.evaluation = {};
                                                 $scope.editGoal.evaluation1 = '';
                                                 $scope.editGoal.start = '';
                                                 $scope.editGoal.end = '';
                                             }

                                         }

                                         //all evaluation goals are delete and not evaluator
                                             $scope.deleteEvaluatorDetails = function(goal_id,goal)
                                             {
//                                               Settings.confirmPopup('CONFIRM',"Are you sure about deleting assigned Goal??");
                                               Settings.confirmPopup('',"Are you sure about deleting assigned Goal??", function(result) {



//                                                 bootbox.confirm({
//                                                     title: 'CONFIRM',
//                                                     message: "Are you sure about deleting assigned Goal??",
//                                                     className: "text-center",
//                                                     buttons: {
//                                                         confirm: {
//                                                             label: 'YES',
//                                                             className: 'btn-danger'
//                                                         },
//                                                         cancel: {
//                                                             label: 'Cancel',
//                                                             className: 'btn-success'
//                                                         }
//                                                     },
//                                                     callback: function (result) {

                                                         if(result)
                                                         {
                                                             $http.delete("/dash/goals/delete/"+goal.ASSIGNMENT_ID+"/"+goal.EVALUATION+"/"+goal.EVALUATOR+"/"+goal_id)
                                                                 .success(function(response)
                                                                 {
                                                                     console.log("deleted response`")
                                                                     console.log(response)
                                                                     if(response)
                                                                     {
                                                                         var today = new Date();
                                                                         today.setHours(0,0,0)
                                                                         var user_body = {}
                                                                         user_body.TODAY_DATE = [today.getFullYear(), (today.getMonth() + 1).padLeft(), today.getDate().padLeft()].join('-') + ' '
                                                                             + [today.getHours().padLeft(), today.getMinutes().padLeft(), today.getSeconds().padLeft()].join(':');
                                                                         user_body.EVALUATOR = goal.EVALUATOR;
                                                                         user_body.EVALUATOR_NUMBER = response.EVALUATOR_NUMBER.sellerid;
                                                                         user_body.EVALUATION = response.EVALUATION;

                                                                         console.log(user_body)

                                                                         if(user_body.EVALUATION.length)
                                                                         {
                                                                             $http.post("/dash/calculate/users/performance",user_body)
                                                                                 .success(function(update_user)
                                                                                 {
                                                                                     console.log("User body---->>")
                                                                                     console.log(update_user);
//                                                                                     bootbox.alert({
//                                                                                         title : "Success",
//                                                                                         message : "Goals for the selected evaluation deleted successfully!",
//                                                                                         className : "text-center"
//                                                                                     })
                                                                                 Settings.successPopup('Success',"Goals for the selected evaluation deleted successfully!");

                                                                                 })
                                                                         }
                                                                     }
                                                                     $scope.selectGoal(0,$scope.selectedGoal)

                                                                 })
                                                         }
                                                         });




                                             }
                        /*---fetches sellername if phone is provided---*/
                        $scope.getSellerName = function(sellerNo,tag){
//                             console.log('SellerNumber',sellerNo,'Tag',tag);
//                             console.log($scope.allGoalUsers);
//                             var result = $scope.allGoalUsers.filter(s => s.includes(sellerNo));
//                             console.log(result)
                            /*---DynamicProgramming---*/
                            /*---objects doesnt have length ---*/
                            if(sellerNo){
                                if(Object.keys($scope.sellerNames).length==0){
                                    console.log('Seller name array is empty and being initialized')
//                                    $scope.refreshSellerNames();
                                    if(tag == 'goals' || $scope.applicationType == 'Atmosphere')
                                    $scope.refreshGoalSellerNames()
                                }
                                if($scope.sellerNames[sellerNo]){
                                    return $scope.sellerNames[sellerNo]
                                }else if($scope.fulfillerNames[sellerNo]!=undefined){
                                    return $scope.fulfillerNames[sellerNo];
                                }
                            }else return sellerNo;
                        };

                            $scope.refreshGoalSellerNames = function(){
                                if($scope.allGoalUsers){
//                                console.log($scope.allGoalUsers);
                                    for(var j=0;j<$scope.allGoalUsers.length;j++){
                                        if($scope.allGoalUsers[j].userStatus == 'Active' || $scope.allGoalUsers[j].role != '')
                                            $scope.sellerNames[$scope.allGoalUsers[j].EMPLOYEE_ID] = $scope.allGoalUsers[j].sellername;
                                        $scope.sellerNames[$scope.allGoalUsers[j].sellerphone] = $scope.allGoalUsers[j].sellername;
                                    }
                                }
//                                console.log($scope.sellerNames);
                            }


    $scope.editEvaluatorDetails = function(goal_id,evaluator){
        $scope.goalAssignmentDetails ={}
        $scope.goalEvaluators = {};
        console.log(evaluator)
        $http.get("/dash/goalsAssignment/"+ evaluator.ASSIGNMENT_ID+"/"+goal_id)
            .success(function (res)
            {
               /* console.log("goal assigned details")
                console.log(res);*/

//                jQuery.noConflict();
//                $('#editEvaluatorDetail').modal('show');

                if (res.length) {
                    $scope.goalAssignmentDetails = evaluator;

                    $http.get("/dash/managers/users/"+evaluator.EVALUATION)
                        .success(function(managers){
                          //  console.log(managers)
                            $scope.goalEvaluators = managers
                        })

                }
            })




    }
        $scope.goals_colleague_codes=[];

        $scope.searchColleaguesfromGoals=function(text){
            console.log("Searchhhhh.....");
            // console.log($scope.user.sellerObject)
            if($scope.user.sellerObject) {
                $scope.searchcolleaguefromgoalsBody.resort = $scope.user.sellerObject.Resort;
            }

            // console.log(text)

            if(text.length>=4){
                $http.post("/dash/atms/search/colleagueCodesfromgoals/"+text, $scope.searchcolleaguefromgoalsBody)
                    .success(function(res){
                        // console.log(res)
                        if(res.length){
                            $scope.goals_colleague_codes = res;
                            console.log( $scope.goals_colleague_codes);
                            jQuery.noConflict();
                            $(".colleagueCodeDropdown").css('display', 'block')
                        }
                        else
                            $scope.goals_colleague_codes = [];

                    })
            }
            else{
                jQuery.noConflict();
                $(".colleagueCodeDropdown").css('display', 'none')
            }

        }
            $scope.formatDate = function(date){
                if(date==undefined || date == '')
                    return ('');
                /* replace is used to ensure cross browser support*/
                var d = new Date(date.toString().replace("-","/").replace("-","/"));
                var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                var dt = d.getDate();
                if(dt<10)
                    dt = "0"+dt;
                var dateOut = dt+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear());
                return dateOut;
            }

                $scope.saveNewEvaluator = function(newData){
                    //console.log(newData)
                    if(newData.EVALUATOR){
                        $http.put("/dash/goals/update/evaluator", newData)
                            .success(function(res){
                                console.log(res);
                                if(res == 'success'){
                                    jQuery.noConflict();
                                    $('#editEvaluatorDetail').modal('hide');
                                    $("#evaluatorUpdateSuccess").fadeIn(1000,function() {
                                        $("#evaluatorUpdateSuccess").fadeOut(3000);
                                    });

                                }
                                else{
                                   Settings.alertPopup('ERROR',"Unable to edit evaluator");

                                    console.log('unable to assign');
//                                    bootbox.alert({
//                                        title : 'ERROR',
//                                        message : 'Unable to edit evaluator',
//                                        className : 'text-center'
//                                    })
                                }

                            })
                    }
                    else{
                        console.log("no evaluator");
                     Settings.alertPopup('ERROR',"Please select evaluator");
//
//                        bootbox.alert({
//                            title : 'ERROR',
//                            message : 'Please select evaluator',
//                            className : 'text-center'
//                        })
                    }

                }
                    $scope.clearFilterButton = function (search,tab)
                    {
                        if (search === '')
                        {
                            switch (tab)
                            {
                                            case 29 :

                                                goalSearchObj.viewLength = 0;
                                                goalSearchObj.viewBy = initialViewBy;
                                                goalSearchObj.searchFor = '';
                                                goalSearchObj.searchBy = [];
                                                if($scope.applicationType == 'Atmosphere' && $scope.user.sellerObject) {
                                                    goalSearchObj.resort = $scope.user.sellerObject.Resort;
                                                }

                                                $scope.viewLength = 0;
                                                $scope.newViewBy = viewBy.goals;
                                                $scope.goalSearch.filter = '';
                                                $scope.allGoals = [];
                                                $scope.reportGoals = [];
                                             //   $scope.tempGoals = [];

                                                $http.post('/dash/mastergoals', goalSearchObj)
                                                    .success($scope.renderGoals);

                                                $http.post('/dash/mastergoals/count', goalSearchObj)
                                                    .success(function (response) {
                                                        $scope.transactionCount(response, 29)
                                                    });

                                                // $scope.itemCategories = masterItems.unique('Manufacturer')
                                                // $scope.itemSubCategories = masterItems.unique('subCategory')
                                                //
                                                // $scope.itemCategories.map(function (item) {
                                                //     item.selected_category = true;
                                                //     return item;
                                                // })
                                                // $scope.itemSubCategories.map(function (item) {
                                                //     item.selected_subCategory = true;
                                                //     return item;
                                                // })

                                                $scope.showItemFilter = false;

                                                break;

                            }
                            }
                            }


                   //Navigation of pages
                   var a = 0;
                   $scope.navPage = function(tab, direction){
                   console.log("Goals navigation");
                       switch(tab){

            //Goals Navigation
            case 29:
                var viewLength = $scope.viewLength;
                var viewBy = $scope.newViewBy;

                if(direction){
                    //console.log("NEXT");

                    if(viewLength + viewBy >= $scope.allGoals.length){
                        if(viewLength + viewBy < $scope.allGoals_count){
                            viewLength += viewBy;
                            //console.log("Fetch more")
                            goalSearchObj.viewLength = viewLength;
                            goalSearchObj.viewBy = initialViewBy;
                            goalSearchObj.searchFor = $scope.goalSearch.filter;
                            goalSearchObj.searchBy = goalSearchBy;
                            if($scope.applicationType == 'Atmosphere' && $scope.user.sellerObject) {
                                goalSearchObj.resort = $scope.user.sellerObject.Resort;
                            }

                            $http.post("/dash/mastergoals",goalSearchObj)
                                .success(function(response){
                                    console.log(response);

                                    $scope.renderGoals(response);

                                    if(viewLength + viewBy > $scope.allGoals_count){
                                        a = viewLength + viewBy - $scope.allGoals_count;
                                        viewBy -= a;
                                        $scope.newViewBy = viewBy;
                                    }
                                    $scope.viewLength = viewLength;
                                })

                        }
                        else{
                            //console.log("Out of data")
                            if(viewLength + viewBy > $scope.allGoals_count){
                                a = viewLength + viewBy - $scope.allGoals_count;
                                viewBy -= a;
                                $scope.newViewBy = viewBy;
                            }
                        }
                    }
                    else{
                        //console.log("Minus viewby")
                        viewLength += viewBy;

                        if(viewLength + viewBy > $scope.allGoals_count){
                            a = viewLength + viewBy - $scope.allGoals_count;
                            viewBy -= a;
                        }
                        $scope.newViewBy = viewBy;
                        $scope.viewLength = viewLength;
                    }
                }
                else{
                    //console.log("BACK");
                    if(viewLength < viewBy){
                        //console.log("NO DATA")
                    }
                    else{
                        if(viewLength + viewBy >= $scope.allGoals_count){
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

                $scope.refreshTransactions = function(tab){
                    $scope.displayDealerRefresh = false;
                    $scope.userBranchFilter={};
                    $scope.userDesignationFilter = {};

                    jQuery.noConflict();
                    $('.refresh').css("display", "inline");

                    switch(tab){
                     case 5:
                                        $scope.clearFilter(29);
                                        $scope.goalEmployeecode.all_Colleague_Code='';
                                        $scope.showevaluatorgoals=[];
                                        $scope.goalsevaluation=[];
                                        $scope.showsearchedgoals=false;
                                        // console.log($scope.goalssearch)
                                        $scope.goalssearch.evaluation='';
                                        $scope.goalssearchwithemployee={};

                                        $http.post("/dash/mastergoals",goalSearchObj)
                                            .success(function(response){
                                                // console.log(response);

                                                $scope.renderGoals(response);
                                                //
                                                // if(viewLength + viewBy > $scope.allGoals_count){
                                                //     a = viewLength + viewBy - $scope.allGoals_count;
                                                //     viewBy -= a;
                                                //     $scope.newViewBy = viewBy;
                                                // }
                                                // $scope.viewLength = viewLength;
                                            })


                                    break;

                    }
                    }
                        $scope.clearFilter = function(tab){
                            switch(tab){
                                        case 29 :
                                            //Fetch Goals if tab is activated
                                            console.log("***** Tab 29 : Fetching all Goals")
                                            $scope.viewLength = 0;
                                            $scope.newViewBy = viewBy.goals;
                                            $scope.goalSearch.filter = '';
                                            /*$http.get("/dash/goals")
                                             .success(function(response){
                                             $scope.allGoals = response;
                                             console.log($scope.allGoals)
                                             })*/


                                            goalSearchObj.viewLength = 0;
                                            goalSearchObj.viewBy = initialViewBy;
                                            goalSearchObj.searchBy = [];
                                            goalSearchObj.searchFor = '';
                                            if($scope.applicationType == 'Atmosphere' && $scope.user.sellerObject) {
                                                goalSearchObj.resort = $scope.user.sellerObject.Resort;
                                            }

                                            $scope.allGoals = [];
                                            $scope.reportGoals = [];
                                        //    $scope.tempGoals = [];
                                            $http.post("/dash/mastergoals", goalSearchObj)
                                                .success($scope.renderGoals);

                                            $http.post('/dash/mastergoals/count', goalSearchObj)
                                                .success(function (response) {
                                                    console.log("Goals count--------->>>"+response.length);
                                                    $scope.transactionCount(response, 29)
                                                });


                                            $http.get('/dash/allUsers')
                                                .success(function (response) {
                                                    console.log("Goals users count--------->>>")
                                                    // console.log(response)
                                                    if(response.length) $scope.allGoalUsers = response

                                                });

                                            // if($scope.coID == 'ATMS')
                                            // {
                                      /*      $http.get("/dash/settings/get/evaluation")
                                                .success(function(response){
                                                    console.log(response)
                                                    if(response.length) $scope.settingsEvaluation = response[0].obj;
                                                })*/
                                            // }

                                         /*   $http.get("/dash/settings/get/department")
                                                .success(function(response){
                                                    console.log(response)
                                                    if(response.length) $scope.settingsDepartment = response[0].obj;
                                                })*/

                                            break;

                            }
                            }
                                $scope.addGoals = function()
                                {
                                    if($scope.newGoal.GOAL_STATEMENT && $scope.desc.length != 0 && $scope.newGoal.WEIGHTAGE
                                        && $scope.newGoal.EVALUATION_TYPE && $scope.newGoal.DEPARTMENT)
                                    {


                                        $scope.newGoal.RATING_1 = $scope.desc[0] ? $scope.desc[0] : '-'
                                        $scope.newGoal.RATING_2 = $scope.desc[1] ? $scope.desc[1] : '-'
                                        $scope.newGoal.RATING_3 = $scope.desc[2] ? $scope.desc[2] : '-'
                                        $scope.newGoal.RATING_4 = $scope.desc[3] ? $scope.desc[3] : '-'
                                        $scope.newGoal.RATING_5 = $scope.desc[4] ? $scope.desc[4] : '-'


                                               Settings.confirmPopup('',"Are you sure about adding the goal??", function(result) {


                                                if(result)
                                                {
                                                    /*var start = new Date($scope.newGoal.START_DATE);
                                                    var end = new Date($scope.newGoal.END_DATE);
                                                    var date = new Date();
                                                    $scope.newGoal.START_DATE = [start.getFullYear(), (start.getMonth() + 1).padLeft(), start.getDate().padLeft()].join('-') + ' '
                                                        + [start.getHours().padLeft(), start.getMinutes().padLeft(), start.getSeconds().padLeft()].join(':');

                                                    $scope.newGoal.END_DATE = [end.getFullYear(), (end.getMonth() + 1).padLeft(), end.getDate().padLeft()].join('-') + ' '
                                                        + [end.getHours().padLeft(), end.getMinutes().padLeft(), end.getSeconds().padLeft()].join(':');

                                                    $scope.newGoal.DATE_ADDED = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                                                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');

                                                    var tempEvaluationType = {}
                                                    try{
                                                        console.log($scope.newGoal.EVALUATION_TYPE)
                                                        tempEvaluationType = JSON.parse($scope.newGoal.EVALUATION_TYPE)
                                                        $scope.newGoal.EVALUATION_TYPE = tempEvaluationType.name
                                                        $scope.newGoal.EVALUATION_DAYS = tempEvaluationType.days
                                                    }
                                                    catch(e) {
                                                        tempEvaluationType = $scope.newGoal.EVALUATION_TYPE
                                                        $scope.newGoal.EVALUATION_TYPE = tempEvaluationType.name
                                                        $scope.newGoal.EVALUATION_DAYS = tempEvaluationType.days
                                                    }*/



                                                    $http.post("/dash/add/master/goals", $scope.newGoal)
                                                        .success(function(res)
                                                        {
                                                            console.log(res)
                                                            if(res){
                                                           Settings.successPopup('Success',"New Goal added successfully!");
//
//                                                                bootbox.alert({
//                                                                    title : "SUCCESS",
//                                                                    message : "New Goal added successfully!",
//                                                                    className : 'text-center'
//                                                                })
                                                            }
                                                            $scope.addGoalButton = true;
                                                        })
                                                }

                                                else
                                                {}
                                                 });
                                            }
                                                                               else{
                                                                                Settings.alertPopup('ERROR',"Please enter all the fields");
                                            //
                                            //                                        bootbox.alert({
                                            //                                            title : "ERROR",
                                            //                                            message : "Please enter all the fields",
                                            //                                            className : 'text-center'
                                            //                                        })
                                                                                }


                                    }
                                        $scope.atmsgoalsforcolleague=function(code){

                                            // console.log(code)

                                            $scope.showsearchedgoals=true;
                                            $scope.showevaluatorgoals = [];
                                            jQuery.noConflict();
                                            $(".colleagueCodeDropdown").css('display', 'none')
                                            if(code.EMPLOYEE_ID){
                                                $scope.goalEmployeecode.all_Colleague_Code=code.EMPLOYEE_ID+' - '+code.sellername;
                                                $scope.goalssearchwithemployee.EMPLOYEE_ID=code.EMPLOYEE_ID;


                                            }
                                            else{
                                                $scope.goalssearchwithemployee.EvaluationId=code;
                                            }
                                            if($scope.goalssearchwithemployee){
                                                $http.post("/dash/atms/goalsforselectedevaluator",$scope.goalssearchwithemployee)
                                                    .success(function(res){
                                                        // console.log(res)
                                                        if(res.length){
                                                            for(var i=0; i<res.length; i++) {
                                                                $scope.showevaluatorgoals.push(res[i]);
                                                                for(var j=0;j<res[i].EVALUATION_ID.length;j++){

                                                                    $scope.goalsevaluation.push({'id' : res[i].EVALUATION_ID[j]});


                                                                }
                                                            }
                                                            // console.log($scope.showevaluatorgoals)

                                                            $scope.transactionCount(res.length, 29);

                                                        }

                                                    })

                                            }


                                            // if($scope.goalEmployeecode.all_Colleague_Code) {
                                            //     jQuery.noConflict();
                                            //     $('.refresh').css("display", "inline");
                                            // }
                                        }











        });
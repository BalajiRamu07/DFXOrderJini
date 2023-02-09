/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("TasksCtrl",function ($scope, $filter, $http, Settings, $window) {
        console.log("Hello From Tasks Controller .... !!!!");

        $scope.allTasks = [];
        $scope.groupTask = {};
        $scope.toggleTrue = {};
        var localViewBy = $scope.newViewBy;


        $scope.user = Settings.getUserInfo();
        console.log($scope.user);
        //$scope.nav = Settings.getNav();
        $scope.currency = Settings.getInstanceDetails('currency');

        $scope.taskSelectedTab = 'tasks'; //Select USER tab when users.html is opened
        // $scope.changeDataSource('task', 'tasks');
        var taskSearchObj ={};
        var taskinitialViewBy = 50;
        var taskSearchBy = ['taskId','name','seller','tagName','assignee','assigneeName'];

        //New Pagination variables
        $scope.viewLength = 0;
        $scope.newViewBy = 10;
        var viewBy = {};
        viewBy.allTasks   = 10;
        var initialViewBy = 60;

        taskSearchObj.viewLength = 0;
        taskSearchObj.viewBy = taskinitialViewBy;
        taskSearchObj.searchFor = '';
        taskSearchObj.seller = '';
        taskSearchObj.stockist = '';
        taskSearchObj.searchBy = [];
        taskSearchObj.tab = 0;
        $scope.taskTab = 0;
        $scope.allTasks = [];
        $scope.showTaskDetails = false;
        $scope.subtaskValue = false;
        $scope.dateFormat = 'dd-MMM-yyyy';

        $scope.group = {};

        // function to disable past dates in a datepicker
        var minDate = new Date();
        minDate = minDate.setDate(minDate.getDate()-0);

        $scope.datepickerOptionsPast = {
            minDate: minDate
        };


        $scope.formatFullDate = function(date){
            if(date==undefined)
                return
            /* replace is used to ensure cross browser support*/
            var d = new Date(date.toString().replace("-","/").replace("-","/"));
            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

            var time = ''
            var hour =  d.getHours();
            var minute = d.getMinutes();
            var session = ''
            if(minute==0)
                minute = '00'
            else if(minute<10){
                var temp = minute;
                minute = '0' +minute
            }

            if(d.getHours()>12) {
                session = 'PM'
                hour -= 12
            }
            else if(d.getHours() == 12)
                session = 'PM'
            else {
                session = 'AM'
            }
            time = hour+':'+ minute +' '+session
            var dateOut = d.getDate()+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear())+' at '+ time

            $scope.mapTransactionDate = d.getDate()+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear());

            return dateOut;
        }


        $scope.createGroup = function(){
            $scope.group.nameList = $scope.AddToUsers;
            ///for id generation/////
            var date = new Date();
            var components = [
                date.getFullYear().toString().substr(-2),
                (date.getMonth() < 10)? '0' + date.getMonth() : date.getMonth(),
                (date.getDate() < 10)? '0' + date.getDate() : date.getDate(),
                (date.getHours() < 10)? '0' + date.getHours() : date.getHours(),
                (date.getMinutes() < 10)? '0' + date.getMinutes() : date.getMinutes(),
                (date.getSeconds() < 10)? '0' + date.getSeconds() : date.getSeconds(),
                (date.getMilliseconds() < 10)? '00' + date.getMilliseconds() : (date.getMilliseconds() < 100)? '0' + date.getMilliseconds() : date.getMilliseconds()
            ];
            var date_new = components.join("");
            $scope.group.groupId=date_new;

            if($scope.AddToUsers.length==0){
                Settings.alertPopup('ERROR', "Please Select Users");
            }
            if(!$scope.group.Name){
                Settings.alertPopup('ERROR', "Please Enter Group Name");
            }
            if(!$scope.group.Phone){
                Settings.alertPopup('ERROR', "Please Enter Phone Number");
                return false;
            }
            if(!$scope.group.SubCat){
                Settings.alertPopup('ERROR', "Please Select Or Enter Category");
            }
            else if(!$scope.group.Email){
                Settings.alertPopup('ERROR', "Please Enter Email Address");
            }
            else {
                $http.post("/dash/creategroup", $scope.group)
                    .success(function (response) {
                        $scope.cleargroup();
                        $http.get("/dash/groupDetails")
                            .success($scope.renderGroups);
                        jQuery.noConflict();
                        $('#myModalGroupByUser').modal('hide');
                        Settings.success_toast("Success", "Group Created Successfully");
                    })
                    .error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
            }
        }

        //.....Format the date in datetime stamp format (2017-04-23 11:03:40) ....
        function DateTimeStampFormat(date_added) {

            if (date_added) {
                //This is to format the date in dd-mm-yy hh:mm:ss format, also padding 0's if values are <10 using above function
                var date = new Date(date_added);
                var dformat = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                    + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');

                return (dformat);
            }
            else
                return null;
        }


        //Render Tasks
        $scope.renderTask = function (response) {
            console.log("GetAll Tasks-->" );
            // console.log(response);

            var fliteredTaskList =[];

            for(var i = 0;i<response.length;i++){
                if(response[i].dueDate) {
                    response[i].displayDueDate = (moment(response[i].dueDate).calendar().split(" at"))[0];
                    if(response[i].displayDueDate.indexOf('last') !== -1){
                        response[i].displayDueDate = moment(response[i].dueDate).format("DD/MM/YYYY");
                    }

                    response[i].dueDate= new Date(response[i].dueDate);
                }else{
                    response[i].dueDate = null;
                }

                if(response[i].complete == 'true'){
                    response[i].complete = true;
                }

                $scope.allTasks.push(response[i]);
            }

        };

        $scope.showTaskFilter = '';

        //filter based on tasks
        $scope.filterBasedonTask = function(tab,type)
        {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            if(tab == 3){
                $scope.showTaskFilter = "Other's tasks";
            }else{
                $scope.showTaskFilter = type;
            }
            $scope.taskTab = tab;
            $scope.allTasks = [];
            taskSearchObj.viewLength = 0;
            taskSearchObj.viewBy = taskinitialViewBy;
            taskSearchObj.searchFor = '';
            taskSearchObj.seller = '';
            taskSearchObj.stockist = '';
            taskSearchObj.searchBy = [];
            taskSearchObj.tab = tab;
            $scope.showTaskDetails = false;
            $scope.subtaskValue = false;

            $http.post("/dash/task", taskSearchObj)
                .success(function(res){
                    console.log('task res',res);
                    $scope.renderTask(res);
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");

                })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

            $http.post("/dash/task/count", taskSearchObj)
                .success(function(res) {
                    $scope.transactionCount(res,28);
                })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        }

        $scope.transactionCount = function(response, tab){
            console.log("response is : count:");
            if(response){
                if(response > viewBy.allTasks){
                    $scope.allTask_count = response;
                    $scope.newViewBy = viewBy.allTasks;
                    $scope.viewLength = 0;
                }
                else if(response <= viewBy.allTasks){
                    $scope.allTask_count = response;
                    $scope.newViewBy = response;
                    $scope.viewLength = 0;
                }
                else{
                    $scope.allTasks = [];
                    $scope.newViewBy = 1;
                    $scope.allTask_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.allTasks = [];
                $scope.newViewBy = 1;
                $scope.allTask_count = 0;
                $scope.viewLength = -1;
            }
        }

        $scope.refreshTransactions = function(tab) {
            $scope.displayDealerRefresh = false;

            jQuery.noConflict();
            $('.refresh').css("display", "inline");


            $scope.allTasks = [];

            taskSearchObj.viewLength = 0;
            taskSearchObj.viewBy = taskinitialViewBy;
            taskSearchObj.searchFor = '';
            taskSearchObj.seller = '';
            taskSearchObj.stockist = '';
            taskSearchObj.searchBy = [];

            $http.post("/dash/task", taskSearchObj)
                .success(function (res) {
                    $scope.renderTask(res);
                    if ($scope.taskDetails) {
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].taskId == $scope.taskDetails.taskId) {
                                $scope.taskDetails = res[i];

                                $scope.getTaskDetails($scope.taskDetails);
                            }
                        }
                    }
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");

                })
                .error(function(error, status){
                    console.log(error, status);
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

            $http.post("/dash/task/count", taskSearchObj)
                .success(function (res) {
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");
                    $scope.transactionCount(res, 28);

                })
                .error(function(error, status){
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

        }

        $http.post("/dash/task", taskSearchObj)
            .success(function(res){
                console.log('task res',res);
                $scope.renderTask(res);
            })
            .error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

        $http.post("/dash/task/count", taskSearchObj)
            .success(function(res) {
                $scope.transactionCount(res,28);
            })
            .error(function(error, status){
                console.log(error, status);
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
                else
                    $window.location.href = '/404';
            });

        /* .......................................................................................................................................................................

         Task Management

         ...........................................................................................................................................................*/


        $scope.task = {};
        $scope.task.cc = [];
        $scope.allSubtasks =[];
        $scope.subTask =[];
        $scope.ccBadges = [];
        $scope.edit = false;



        $scope.CreateTask = function (flag1 ,flag2) {

            tasklog = '';
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            if($scope.task.name){
                console.log("$scope.task.name",$scope.task.name);

                delete $scope.task.taskGroupBox;
                delete $scope.task.taskUserBox;

                $scope.task.complete = false;
                $scope.task.escalate = false;
                $scope.task.critical =false;
                $scope.task.creater = $scope.user.username?$scope.user.username:'PORTAL';
                $scope.task.seller = $scope.user.sellerphone?$scope.user.sellerphone:'PORTAL';
                $scope.task.completedDate = '';
                $scope.task.taskGroupId = '';
                tasklog = $scope.task.creater+ ' Created task ' + $scope.task.name;

                taskobj.message = tasklog;



                var date = new Date();
                var dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
                    + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

                $scope.task.date = dformat;


                if($scope.task.dueDate){
                    $scope.task.dueDate = $scope.dateFormate($scope.task.dueDate);
                }else{
                    $scope.task.dueDate = $scope.dateFormate(date);
                }

                var date = new Date();
                var components = [
                    date.getFullYear() - 1900,
                    (date.getMonth() < 10)? '0' + date.getMonth() : date.getMonth(),
                    (date.getDate() < 10)? '0' + date.getDate() : date.getDate(),
                    (date.getHours() < 10)? '0' + date.getHours() : date.getHours(),
                    (date.getMinutes() < 10)? '0' + date.getMinutes() : date.getMinutes(),
                    (date.getSeconds() < 10)? '0' + date.getSeconds() : date.getSeconds(),
                    (date.getMilliseconds() < 10)? '00' + date.getMilliseconds() : (date.getMilliseconds() < 100)? '0' + date.getMilliseconds() : date.getMilliseconds()
                ];
                var date_ = components.join("");

                $scope.task.taskId = date_;

                taskobj.date = $scope.dateFormate(date);

                $scope.task.subTask = [];
                $scope.task.taskLogs =  [];
                $scope.task.taskLogs.push(taskobj);

                $http.post("/dash/task/create", $scope.task)
                    .success(function(response){
                        // console.log(response)
                        Settings.success_toast("Success", "Created New Task: " + $scope.task.name);
                        $scope.task.name = '';
                        $scope.task.dueDate = '';
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                    })
                    .error(function(error, status){
                        console.log(error, status);
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");

                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });

                if(!flag2){
                    $scope.handleCancelNewTask();
                }
                $scope.refreshTransactions(28);
            }else{
                Settings.alertPopup('ERROR', "Please Enter a Task Name");
            }
        }


        //formate date
        $scope.dateFormate=function(date){
            return dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
                + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
        }


        $scope.saveTaskComment =function(comment,id) {
                taskobj = {};

                var cDate = new Date();
                var addComment = {};


                addComment.date = DateTimeStampFormat(cDate);
                addComment.comment = comment.taskComment;
                addComment.username = ($scope.user.username ? $scope.user.username : "PORTAL");
                addComment.role = ($scope.user.role ? $scope.user.role : "PORTAL");

                taskobj.message = addComment.username + ' added comment';

                taskobj.date = $scope.dateFormate(cDate);

                var reqcommentbody = {
                    "addComment": addComment,
                    "taskLogs": taskobj
                }

                if (comment.taskComment) {
                    $http.post('/dash/task/add/comment/' + id, reqcommentbody).success(function (response) {
                        // console.log('res',response);
                        if (response) {

                            for (var i = 0; i < $scope.allTasks.length; i++) {
                                // console.log('$scope.allTasks[i].taskId',$scope.allTasks[i].taskId);
                                // console.log('id',id)

                                if ($scope.allTasks[i].taskId == id) {

                                    if ($scope.allTasks[i].comment) {
                                        // console.log('first')
                                        $scope.allTasks[i].comment.push(addComment)
                                    } else {
                                        $scope.allTasks[i].comment = [];
                                        $scope.allTasks[i].comment.push(addComment)
                                    }
                                }
                            }

                            $scope.task.taskComment = '';
                        }
                        Settings.success_toast("Success", "Successfully commented");
                    })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });

                } else {
                    Settings.alertPopup('ERROR', "Please Enter Comment");

                }

        }

        $scope.saveEscalate =function(comment,id) {
            taskobj ={};

            var cDate = new Date();
            var addComment = {};

            addComment.date = DateTimeStampFormat(cDate);
            addComment.comment = comment.escalateComment? comment.escalateComment :'Escalation raised by ' + ($scope.user.username ? $scope.user.username : "PORTAL");
            addComment.username = ($scope.user.username ? $scope.user.username : "PORTAL");
            addComment.role =($scope.user.role ? $scope.user.role : "PORTAL");
            addComment.type = 'escalate';

            taskobj.message = addComment.username + ' escalated';
            taskobj.date    = $scope.dateFormate(cDate);

            var reqcommentbody = {
                "addComment":addComment,
                "taskLogs" : taskobj,
                "escalate" : true
            }
            $scope.escalateTask = reqcommentbody.escalate;
            $http.post('/dash/task/add/comment/' + id, reqcommentbody).success(function (response) {
                // console.log('res',response);
                if (response) {

                    for(var i=0;i<$scope.allTasks.length;i++ ){

                        if($scope.allTasks[i].taskId == id ){

                            if($scope.allTasks[i].comment){
                                // console.log('first')
                                $scope.allTasks[i].comment.push(addComment)
                            }else{
                                $scope.allTasks[i].comment = [];
                                $scope.allTasks[i].comment.push(addComment)
                            }
                        }
                    }
                    $scope.task.escalateComment = '';
                }
                Settings.success_toast("Success", "Successfully Escalated");
                $scope.refreshTransactions(28);
                jQuery.noConflict();
                $('#escalate').modal('hide');
            })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

        }


        $scope.addSubTask =function(subtask,id) {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");

                $scope.displaySubTask = true;
                var taskobj = {};
                var date = new Date();
                var components = [
                    date.getFullYear() - 1900,
                    (date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth(),
                    (date.getDate() < 10) ? '0' + date.getDate() : date.getDate(),
                    (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
                    (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
                    (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds(),
                    (date.getMilliseconds() < 10) ? '00' + date.getMilliseconds() : (date.getMilliseconds() < 100) ? '0' + date.getMilliseconds() : date.getMilliseconds()
                ];
                var date_ = components.join("");

                this.user.taskId = date_;  // task id

                var dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
                    + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

                var subtasks = {
                    "name": subtask,
                    "subtaskId": date_,
                    "date_added": dformat,
                    "creater_phone": $scope.user.sellerphone ? $scope.user.sellerphone : 'Admin',
                    "creater": $scope.user.username ? $scope.user.username : 'Admin',
                    "complete": false
                };

                var creater = $scope.user.username ? $scope.user.username : 'Admin';

                taskobj.message = creater + ' Created sub task ' + subtask;
                taskobj.date = $scope.dateFormate(date);


                var reqbody = {
                    "subtasks": subtasks,
                    "taskLogs": taskobj
                };


                if (subtask) {
                    $http.post('/dash/task/create/subtask/' + id, reqbody).success(function (response) {
                        if (response) {
                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                            $scope.displaySubTask = false;
                            for (var i = 0; i < $scope.allTasks.length; i++) {
                                if ($scope.allTasks[i].taskId == id) {
                                    if ($scope.allTasks[i].subTask) {
                                        $scope.getTaskDetails($scope.allTasks[i], 'addSubTask');
                                        $scope.allTasks[i].subTask.push(subtasks);
                                    } else {
                                        $scope.allTasks[i].subTask = [];
                                        $scope.allTasks[i].subTask.push(subtasks);
                                        $scope.getTaskDetails($scope.allTasks[i], 'addSubTask');
                                    }
                                }
                            }

                            Settings.success_toast("Success", "Added New Subtask: " + subtasks.name);


                            if ($scope.taskDetails.taskLogs) {
                                $scope.taskDetails.taskLogs.push(taskobj)
                            } else {
                                $scope.taskDetails.taskLogs = [];
                                $scope.taskDetails.taskLogs.push(taskobj)
                            }
                        }else{
                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                        }
                    })
                        .error(function(error, status){
                            jQuery.noConflict();
                            $('.refresh').css("display", "none");
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });

                } else {
                    jQuery.noConflict();
                    $('.refresh').css("display", "none");
                    $scope.displaySubTask = false;
                    Settings.alertPopup('ERROR', "Please Enter a Subtask Name");

                }


        }

        $scope.oldtaskdetails={};
        var taskCCUpdated = false;
        var taskDueDate;
        $scope.currentDate = new Date();
        $scope.displaySubTask = false;
        var sortedPjp = [];

        $scope.getTaskDetails = function(task,type){


            if(task.escalate == true){
                $scope.toggleTrue.escalate = true;
            }else {
                $scope.toggleTrue.escalate = false;
            }


            $scope.displaySubTask = false;

            $scope.oldtaskdetails = {};
            taskCCUpdated = false;
            $scope.oldtaskdetails = angular.copy(task);

            // console.log('type',type)
            $scope.showTaskDetails=true;
            $scope.subtaskValue = false;
            if(!type){
                $scope.edit = false;
            }
            $scope.taskDetails = {};
            $scope.taskDetails = task;
            // if($scope.taskDetails.dueDate){
            //     $scope.taskDetails.dueDate = new Date( $scope.taskDetails.dueDate);
            // }else{
            //     $scope.taskDetails.dueDate = null;
            // }

            if(!$scope.taskDetails.taskGroupId){
                $scope.taskDetails.assigneeGroup = '';
                $scope.taskDetails.taskGroupId = '';
            }
            $scope.taskDetails.assigneeList = [];

            if(task.assignee){
                var obj =  {
                    'name':task.assigneeName,
                    'id':task.assignee
                }
                $scope.taskDetails.assigneeList.push(obj);
            }


            if($scope.task.taskComment){
                $scope.task.taskComment='';
            }

            $scope.task.subTask = '';

            if( ($scope.taskDetails.complete == 'completed' || $scope.taskDetails.complete == true || $scope.taskDetails.complete == 'true') && ($scope.user.role != 'Admin') && ($scope.user.seller != $scope.taskDetails.seller)){
                $scope.displaySubTask = true;
            }

            var pjpLength  = 0;
            sortedPjp = [];
            if($scope.taskDetails.taskLogs){
                sortedPjp = $filter('orderBy')( $scope.taskDetails.taskLogs, '-date');

                // console.log('OrderedPjp',sortedPjp)
                $scope.pjpLogs = [];
                if(sortedPjp.length >= $scope.pjpLogs.length+10){
                    pjpLength = $scope.pjpLogs.length+10;
                    $scope.displaypjpSeeMore = true;
                    for(var i=$scope.pjpLogs.length;i<pjpLength;i++){
                        $scope.pjpLogs.push(sortedPjp[i])
                    }
                }else if(sortedPjp.length > $scope.pjpLogs.length){
                    pjpLength = sortedPjp.length;
                    $scope.displaypjpSeeMore = false;
                    for(var i=$scope.pjpLogs.length;i<pjpLength;i++){
                        $scope.pjpLogs.push(sortedPjp[i])
                    }
                }
            }

            if($scope.taskDetails.taskGroupId) {
                var type = 'groupId';
                var body = {'groupFilter':$scope.taskDetails.taskGroupId}
                $http.post("/dash/task/group/search/"+ type,body).success(function (res) {
                    // console.log('res', res);
                    $scope.taskDetails.assigneeGroup = res[0].name;
                })
                    .error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
            }

            if($scope.taskDetails && $scope.taskDetails.subTask)
                $scope.subTask = $scope.taskDetails.subTask ;
            else
                $scope.subTask = ''

            if($scope.taskDetails.cc){
                if(!$scope.taskDetails.cc.length){
                    $scope.taskDetails.cc = [];
                }
            }else{
                $scope.taskDetails.cc = [];
            }

            $scope.newGroups = [];
            $scope.newUsers = [];
        }


        /*delete task*/
        $scope.deleteSelectedTask = function(task,taskId){
            var temp = {};
            temp.taskId = taskId;

            if($scope.user.seller == task.seller || $scope.user.role == ''){
                Settings.confirmPopup("CONFIRM", "Are you sure?", function(result){
                    if(result){
                        $http.post("/dash/task/delete",temp)
                            .success(function(res){
                                $scope.showTaskDetails=false;

                                Settings.success_toast("Success", "Successfully Deleted");
                                $scope.refreshTransactions(28);
                            })
                            .error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
                    }
                })
            }else{
                Settings.alertPopup('ERROR', "Only Creator can delete the Task");
            }

        }


        /*delete sub task*/
        $scope.deleteSelectedSubTask = function(index,taskId,subtask){
            var temp = {};
            temp.taskId = taskId;
            temp.subtask = subtask;

            Settings.confirmPopup("CONFIRM", "Are you sure?", function(result) {
                if (result) {
                    if(result){
                        $http.post("/dash/task/sub/task/delete",temp)
                            .success(function(res){
                                $scope.subTask.splice(index,1);
                                // $scope.showTaskDetails=false;
                            })
                            .error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
                    }
                }
            });
        }

        $scope.tasksGroupSelected = function(group,type){
            if(type == 'create') {
                // console.log('group', group)
                $scope.task.taskGroupBox = group.name;
                $scope.task.taskGroupId = group.groupId;
                $scope.t = group;
                jQuery.noConflict();
                $(".taskGroupDropdown").css("display", "none");
            }else{
                $scope.taskDetails.assigneeGroup = group.name;
                $scope.taskDetails.taskGroupId   = group.groupId;
                jQuery.noConflict();
                $(".taskGroupDropdown").css("display", "none");
            }
        }


        $scope.tasksSelectedFromTypeahead = function(item,type){
            // console.log(item);
            // console.log(type)

            if(type == 'create'){

                if($scope.task.cc.length){
                    var result = $scope.task.cc.filter(
                        function(items){return items.sellerid == item.sellerid})
                    if(!result.length){
                        $scope.task.taskUserBox = item.sellername;
                        $scope.task.assignee = item.sellerid;
                        $scope.task.assigneeName = item.sellername;
                        $scope.t = item;

                    }else{
                        Settings.alertPopup('Warning', item.sellername +" is already assigned")
                        $scope.task.taskUserBox = '';
                    }

                }else{

                    $scope.task.taskUserBox = item.sellername;
                    $scope.task.assignee = item.sellerid;
                    $scope.task.assigneeName = item.sellername;
                    $scope.t = item;
                }
            }else{
                if($scope.task.cc.length) {

                    var result = $scope.taskDetails.cc.filter(
                        function(items){return items.sellerid == item.sellerid})
                    if(!result.length) {
                        $scope.taskDetails.assigneeName = item.sellername;
                    }else {
                        Settings.alertPopup('Warning', item.sellername + " is already assigned");
                        $scope.taskDetails.assigneeName = '';
                    }
                }else{
                    $scope.taskDetails.assignee = item.sellerid;
                    $scope.taskDetails.assigneeName = item.sellername;
                }
            }

            jQuery.noConflict();
            $(".taskDropdown").css("display", "none");

        }


        $scope.tasksSelectedCcTypeahead = function(item,type){

            var obj =  {
                'username':item.sellername,
                'id':item._id,
                'role':item.user_role,
                'sellerid':item.sellerid,
                'date':new Date()
            }

            if(type == 'create'){

                if($scope.task.assignee != item.sellerid){

                    var result = $scope.task.cc.filter(
                        function(items){return items.sellerid == item.sellerid})

                    if(!result.length){
                        $scope.task.cc.push(obj);
                        $scope.cc = item;
                        $scope.task.taskCc = '';
                    }else{
                        Settings.alertPopup('Warning', item.sellername + " is already assigned");
                        $scope.task.taskCc = '';
                    }

                } else{
                    Settings.alertPopup('Warning', item.sellername + " is already assigned");
                    $scope.task.taskCc = '';
                }
            }else if(type=='edit'){

                if ($scope.taskDetails.assignee != item.sellerid) {



                    var result = $scope.taskDetails.cc.filter(
                        function (items) {
                            return items.sellerid == item.sellerid
                        })


                    if (!result.length) {
                        if($scope.taskDetails){
                            if($scope.taskDetails.cc){
                                taskCCUpdated = true;
                                $scope.taskDetails.cc.push(obj);
                            }
                        }
                    } else{
                        Settings.alertPopup('Warning', item.sellername + " is already assigned");
                        $scope.taskDetails.taskCc = '';
                    }
                    $scope.taskDetails.taskCc = '';
                } else {
                    Settings.alertPopup('Warning', item.sellername + " is already assigned");
                }
            }

            jQuery.noConflict();
            $(".taskForCcDropdown").css("display", "none");

        }

        $scope.removeCC = function(id,type){

            if(type == 'create'){
                var tempArray = [];
                for(var i = 0; i < $scope.task.cc.length; i++){
                    if(id != $scope.task.cc[i].id)
                        tempArray.push($scope.task.cc[i]);
                }
                $scope.task.cc = tempArray;

            }else if(type == 'edit'){
                taskCCUpdated = true;
                var tempArray = [];
                for(var i = 0; i < $scope.taskDetails.cc.length; i++){

                    if(id != $scope.taskDetails.cc[i].id)
                        tempArray.push($scope.taskDetails.cc[i]);
                }
                $scope.taskDetails.cc = tempArray;
            }

        }

        $scope.groupSelect = function(){
            $scope.newGroups = [];
            var type = 'name';

            $http.post("/dash/task/group/search/"+type).success(function(res){
                // console.log('res of search',res);
                // console.log(res)

                $scope.newGroups = res;
                // console.log($scope.task);


                jQuery.noConflict();
                $(".taskGroupDropdown").css('display', 'block')
            })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        }


        $scope.newGroups = [];
        $scope.searchGroup = function(text,type){

            var body = {};
            body.groupFilter = text;

            if(type == 'edit'){
                $scope.taskDetails.assigneeName = '';
                jQuery.noConflict();
                $(".taskDropdown").css('display', 'none');

                if(text.length > 0){
                    var type = 'name';
                    $http.post("/dash/task/group/search/"+type,body).success(function(res){
                        // console.log('res of search',res);
                        // console.log(res)

                        $scope.newGroups = res;
                        // console.log($scope.task);


                        jQuery.noConflict();
                        $(".taskGroupDropdown").css('display', 'block')
                    })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }
                else{
                    $scope.newGroups = [];
                    jQuery.noConflict();
                    $(".taskGroupDropdown").css('display', 'none')
                }
            }else {
                $scope.task.taskUserBox = '';
                jQuery.noConflict();
                $(".taskDropdown").css('display', 'none');

                if(text.length > 0){
                    var type = 'name';
                    $http.post("/dash/task/group/search/"+type,body).success(function(res){
                        // console.log('res of search====',res);
                        // console.log(res)

                        $scope.newGroups = res;


                        jQuery.noConflict();
                        $(".taskGroupDropdown").css('display', 'block')
                    })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }
                else{
                    $scope.newGroups = [];
                    jQuery.noConflict();
                    $(".taskGroupDropdown").css('display', 'none')
                }
            }

        };

        $scope.tasksSelectedAssign = function(item,type){

            var obj =  {
                'name':item.sellername,
                'id':item.sellerid
            }

            if(!$scope.taskDetails.assigneeList){
                $scope.taskDetails.assigneeList = [];
            }
            if(!$scope.taskDetails.cc){
                $scope.taskDetails.cc = [];
            }

            if(type == 'create'){

                if($scope.task.assignee != item.sellerid){

                    var result = $scope.task.taskAssign.filter(
                        function(items){return items.sellerid == item.sellerid})

                    if(!result.length){
                        $scope.task.taskAssign.push(obj);
                        $scope.cc = item;
                        $scope.task.taskCc = '';
                    }else{

                        Settings.alertPopup("Alert",item.sellername +" is already assigned");

                        $scope.task.taskCc = '';
                    }

                } else{
                    Settings.alertPopup("Alert",item.sellername +" is already assigned");

                    $scope.task.taskCc = '';
                }
            }else if(type=='edit'){
                if($scope.taskDetails.assignee != item.sellerid){

                    var result = $scope.taskDetails.cc.filter(
                        function (items) {
                            return items.sellerid == item.sellerid
                        })



                    if (!result.length) {

                        var Assignresult = $scope.taskDetails.assigneeList.filter(
                            function (items) {
                                return items.id == item.sellerid
                            })


                        if(!Assignresult.length){
                            $scope.taskDetails.assigneeList = [];
                            $scope.taskDetails.assigneeList.push(obj);

                        }else{
                                Settings.alertPopup("Alert",item.sellername +" is already assigned");
                                $scope.taskDetails.assigneeMultiple = '';
                            }

                        // if(!Assignresult.length){
                        //     if($scope.taskDetails){
                        //         if($scope.taskDetails.assigneeList){
                        //             taskCCUpdated = true;
                        //             $scope.taskDetails.assigneeList.push(obj);
                        //             $scope.taskDetails.assigneeMultiple = '';
                        //         }
                        //     }
                        // }else{
                        //     Settings.alertPopup("Alert",item.sellername +" is already assigned");
                        //
                        //     $scope.taskDetails.assigneeMultiple = '';
                        // }

                    } else{
                        Settings.alertPopup("Alert",item.sellername +" is already assigned");

                        $scope.taskDetails.assigneeMultiple = '';
                    }
                }
                else{
                    Settings.alertPopup("Alert",item.sellername +" is already assigned");

                    $scope.taskDetails.assigneeMultiple = '';
                }


                $scope.taskDetails.assigneeMultiple = '';

            }

            console.log('$scope.taskDetails.',$scope.taskDetails.assigneeList);

            jQuery.noConflict();
            $(".taskDropdownMultiple").css("display", "none");

        }

        $scope.removeAssign = function(id,type){

            if(type == 'create'){
                var tempArray = [];
                for(var i = 0; i < $scope.task.cc.length; i++){
                    if(id != $scope.task.cc[i].id)
                        tempArray.push($scope.task.cc[i]);
                }
                $scope.task.cc = tempArray;

            }else if(type == 'edit'){
                taskCCUpdated = true;
                var tempArray = [];
                for(var i = 0; i < $scope.taskDetails.assigneeList.length; i++){

                    if(id != $scope.taskDetails.assigneeList[i].id)
                        tempArray.push($scope.taskDetails.assigneeList[i]);
                }
                $scope.taskDetails.assigneeList = tempArray;
            }

        }



        $scope.taskSelectMultiple = function(text,type,mode,groupvalue){
            $scope.newUsers = [];

            if(type == 'assignee'){

                console.log("type",type)
                console.log("mode",mode)

                if (groupvalue)
                {
                    if (mode == 'create') {

                        var body = {
                            groupId: $scope.task.taskGroupId
                        };
                        $http.post("/dash/task/group/users", body).success(function (res) {
                            $scope.newUsers = res;
                            jQuery.noConflict();
                            $(".taskDropdownMultiple").css('display', 'block')
                        });

                    } else if (mode == 'edit') {
                        $scope.taskDetails.assigneeMultiple = '';

                        var body = {
                            groupId: $scope.taskDetails.taskGroupId
                        };
                        $http.post("/dash/task/group/users", body).success(function (res) {
                            $scope.newUsers = res;
                            jQuery.noConflict();
                            $(".taskDropdownMultiple").css('display', 'block')
                        });
                    }
                }
                else {
                    if(text && text.length > 0) {
                        $http.get("/dash/user/search/" + text)
                            .success(function (res) {
                                // console.log(res)

                                $scope.newUsers = res;
                                // console.log($scope.task);


                                jQuery.noConflict();
                                $(".taskDropdownMultiple").css('display', 'block')
                            })
                    }
                }

            }else {

                if(text && text.length > 0){
                    $http.get("/dash/user/search/"+text)
                        .success(function(res){
                            // console.log(res)

                            $scope.newUsers = res;


                            jQuery.noConflict();
                            $(".taskForCcDropdown").css('display', 'block')
                        })
                }
                else{
                    $scope.newUsers = [];
                    jQuery.noConflict();
                    $(".taskForCcDropdown").css('display', 'none')
                }
            }

        }



        $scope.taskSelect = function(text,type,mode,groupvalue){
            $scope.newUsers = [];

            if(type == 'assignee'){

                console.log("type",type)
                console.log("mode",mode)

                if (groupvalue)
                {
                    if (mode == 'create') {

                        var body = {
                            groupId: $scope.task.taskGroupId
                        };
                        $http.post("/dash/task/group/users", body).success(function (res) {
                            $scope.newUsers = res;
                            jQuery.noConflict();
                            $(".taskDropdown").css('display', 'block')
                        })
                            .error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });

                    } else if (mode == 'edit') {
                        $scope.taskDetails.assigneeName = '';

                        var body = {
                            groupId: $scope.taskDetails.taskGroupId
                        };
                        $http.post("/dash/task/group/users", body).success(function (res) {
                            $scope.newUsers = res;
                            jQuery.noConflict();
                            $(".taskDropdown").css('display', 'block')
                        })
                            .error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
                    }
                }
                else {
                    if(text && text.length > 0) {
                        $http.get("/dash/user/search/" + text)
                            .success(function (res) {
                                // console.log(res)

                                $scope.newUsers = res;
                                // console.log($scope.task);


                                jQuery.noConflict();
                                $(".taskDropdown").css('display', 'block')
                            })
                            .error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
                    }
                }

            }else {

                if(text && text.length > 0){
                    $http.get("/dash/user/search/"+text)
                        .success(function(res){
                            // console.log(res)

                            $scope.newUsers = res;


                            jQuery.noConflict();
                            $(".taskForCcDropdown").css('display', 'block')
                        })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }
                else{
                    $scope.newUsers = [];
                    jQuery.noConflict();
                    $(".taskForCcDropdown").css('display', 'none')
                }
            }

        };

        /*var substringMatcher = function(strs) {
            return function findMatches(q, cb) {
                var matches, substringRegex;

                // an array that will be populated with substring matches
                matches = [];

                // regex used to determine if a string contains the substring `q`
                var substrRegex = new RegExp(q, 'i');

                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                for (var i = 0; i < strs.length; i++) {
                    if (substrRegex.test(strs[i])) {
                        matches.push(strs[i]);
                    }
                }

                cb(matches);
            };
        };*/


        $scope.searchUser = function(text,type,mode,groupvalue){
            console.log("Searching User ----> ", text, type, mode, groupvalue);
            // $(".taskForCcDropdown").css('display', 'none')
            // $(".taskDropdownMultiple").css('display', 'none')
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            if(text){
                if(type == 'assignee'){
                    if(text.length > 0){
                        if (groupvalue)
                        {
                            if (mode == 'create') {

                                var body = {
                                    groupId: $scope.task.taskGroupId,
                                    text: text
                                };
                                $http.post("/dash/task/group/users", body).success(function (res) {
                                    $scope.newUsers = res;
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
                                    $(".taskDropdownMultiple").css('display', 'block')
                                    $(".taskForCcDropdown").css('display', 'none')

                                })
                                    .error(function(error, status){
                                        jQuery.noConflict();
                                        $('.refresh').css("display", "none");
                                        console.log(error, status);
                                        if(status >= 400 && status < 404)
                                            $window.location.href = '/404';
                                        else if(status >= 500)
                                            $window.location.href = '/500';
                                        else
                                            $window.location.href = '/404';
                                    });

                            } else if (mode == 'edit') {

                                var body = {
                                    groupId: $scope.taskDetails.taskGroupId,
                                    text: text
                                };
                                $http.post("/dash/task/group/users", body).success(function (res) {
                                    $scope.newUsers = res;
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
                                    $(".taskDropdownMultiple").css('display', 'block')
                                    $(".taskForCcDropdown").css('display', 'none')

                                })
                                    .error(function(error, status){
                                        jQuery.noConflict();
                                        $('.refresh').css("display", "none");
                                        console.log(error, status);
                                        if(status >= 400 && status < 404)
                                            $window.location.href = '/404';
                                        else if(status >= 500)
                                            $window.location.href = '/500';
                                        else
                                            $window.location.href = '/404';
                                    });
                            }
                        }
                        else {
                            $http.get("/dash/user/search/"+text)
                                .success(function(res){
                                    // console.log(res)

                                    $scope.newUsers = res;
                                    // console.log($scope.task);


                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
                                    $(".taskDropdownMultiple").css('display', 'block')
                                    $(".taskForCcDropdown").css('display', 'none')

                                })
                                .error(function(error, status){
                                    jQuery.noConflict();
                                    $('.refresh').css("display", "none");
                                    console.log(error, status);
                                    if(status >= 400 && status < 404)
                                        $window.location.href = '/404';
                                    else if(status >= 500)
                                        $window.location.href = '/500';
                                    else
                                        $window.location.href = '/404';
                                });
                        }
                    }
                    else{
                        $scope.newUsers = [];
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                        $(".taskDropdownMultiple").css('display', 'none')
                        $(".taskForCcDropdown").css('display', 'none')

                    }
                }else {
                    if( text.length > 0){
                        $http.get("/dash/user/search/"+text)
                            .success(function(res){
                                // console.log(res)

                                $scope.newUsers = res;


                                jQuery.noConflict();
                                $('.refresh').css("display", "none");
                                $(".taskForCcDropdown").css('display', 'block')
                                $(".taskDropdownMultiple").css('display', 'none')

                            })
                            .error(function(error, status){
                                jQuery.noConflict();
                                $('.refresh').css("display", "none");
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });
                    }
                    else{
                        $scope.newUsers = [];
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                        $(".taskForCcDropdown").css('display', 'none')
                        $(".taskDropdownMultiple").css('display', 'none')

                    }
                }
            }else{
                $scope.newUsers = [];
                jQuery.noConflict();
                $('.refresh').css("display", "none");
                $(".taskForCcDropdown").css('display', 'none')
                $(".taskDropdownMultiple").css('display', 'none')

            }



        };

        $scope.addCc = function(searchCc){
            $scope.ccBadges.push(obj)
        }


        $scope.editTask = function(){
            $scope.edit = true;
        }

        $scope.closeTask = function(){
            $scope.showTaskDetails = false;
            $scope.taskDetails = {};
        }

        $scope.MarkTaskComplet = function(task){
            var cDate = new Date();

            if(task){
                $scope.getTaskDetails(task);
                if($scope.taskDetails.complete == 'completed' || $scope.taskDetails.complete == true ) {
                    $scope.taskDetails.complete = 'completed';
                }else{
                    $scope.taskDetails.complete = 'not completed'
                }
            }else{
                if($scope.taskDetails.complete == 'completed' || $scope.taskDetails.complete == true ) {
                    $scope.taskDetails.complete = 'not completed';
                }else{
                    $scope.taskDetails.complete = 'completed'
                }
            }


            if($scope.taskDetails.complete == 'completed' || $scope.taskDetails.complete == true ) {
                $scope.taskDetails.complete = 'completed';
            }else{
                $scope.taskDetails.complete = 'not completed'
            }

            $scope.saveEditTask();
        }


        $scope.toggleFunction = function(toggle,task){
            if(toggle == false){
                $("#escalate").on("shown.bs.modal", function () {
                });
                jQuery.noConflict();
                $('#escalate').modal('show');
            }

            if(toggle == true && toggle != undefined){
                var taskobj = {};

                tasklog = '';

                var creater = $scope.user.username ? $scope.user.username : 'Admin';
                var date = new Date();
                taskobj.message = creater + ' cancelled escalation';
                taskobj.date = date;
                var body = {
                    taskId: task.taskId,
                    name:task.name,
                    discr:(task.discr?task.discr:''),
                    assignee: task.assignee,
                    tagName:task.tagName,
                    assigneeName: task.assigneeName,
                    taskGroupId:task.taskGroupId,
                    dueDate: $scope.dateFormate($scope.taskDetails.dueDate),
                    updatedBy:$scope.user.username,
                    cc:task.cc,
                    taskLogs:taskobj,
                    date_updated:task.date_updated,
                    complete:task.complete,
                    escalate: false

                };
                $http.post('/dash/task/update',body).success(function(response) {
                    $scope.escalateTask = response.escalate;
                    Settings.success_toast("Success", "Escalation cancelled");
                    $scope.refreshTransactions(28);

                })
                    .error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });

            }

        }

        $scope.escalateToggleOff = function(){
            $scope.toggleTrue.escalate = false;
        }

        var tasklog;
        var taskobj ={};
        $scope.saveEditTask =function(){
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            taskobj ={};
            tasklog = '';

            var creater = $scope.user.username ? $scope.user.username : 'Admin';



            tasklog= creater + ' updated';

            // console.log('form values',$scope.myForm.taskDetails.name.$pristine);
            console.log('oldtaskdetails',$scope.oldtaskdetails);
            console.log('$scope.taskDetails',$scope.taskDetails);


            if($scope.oldtaskdetails.name != $scope.taskDetails.name){
                tasklog = tasklog+' task name ' + $scope.taskDetails.name+',';
            }

            if($scope.oldtaskdetails.assignee != $scope.taskDetails.assignee){
                tasklog = tasklog+' assignee name ' + $scope.taskDetails.assigneeName+',';
            }
            if($scope.taskDetails.dueDate ){
                if($scope.oldtaskdetails.dueDate){
                    $scope.oldtaskdetails.dueDate = new Date($scope.oldtaskdetails.dueDate);
                    if($scope.oldtaskdetails.dueDate.setHours(0,0,0,0) != $scope.taskDetails.dueDate.setHours(0,0,0,0)){
                        tasklog = tasklog+' due Date,';
                    }
                }else{
                    tasklog = tasklog+' due Date,';
                }
            }

            if($scope.oldtaskdetails.complete !=$scope.taskDetails.complete){
                tasklog = tasklog+' task status ' + $scope.taskDetails.complete+',';
            }
            if($scope.oldtaskdetails.discr !=$scope.taskDetails.discr){
                tasklog = tasklog+' description as ' +$scope.taskDetails.discr+',';
            }
            if($scope.oldtaskdetails.taskGroupId !=$scope.taskDetails.taskGroupId){
                tasklog = tasklog+' group as ' +$scope.taskDetails.assigneeGroup+',';
            }


            if(taskCCUpdated ){
                tasklog = tasklog+' mark/CC,'
            }

            // $scope.oldtaskdetails.taskLogs.push(tasklog);
            var date = new Date();
            taskobj.message = tasklog;
            taskobj.date = $scope.dateFormate(date);
            $scope.taskDetails.taskLogobj = taskobj;


            var dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
                + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
            var date_updated = dformat;

            if($scope.taskDetails.dueDate){
                $scope.taskDetails.dueDate = $scope.dateFormate($scope.taskDetails.dueDate);
            }else{
                $scope.taskDetails.dueDate = '';
            }



            var multiAssignee =[];
            var multiIndexStart = 0;
            // if(!$scope.taskDetails.assignee){
            //     multiIndexStart = 1;
            // }else{
            //     multiIndexStart = 0;
            // }

            console.log('$scope.taskDetails.assignee',$scope.taskDetails.assignee)
            console.log('$scope.taskDetails.assigneeList',$scope.taskDetails.assigneeList)



            // if($scope.taskDetails.assigneeList && $scope.taskDetails.assigneeList.length ){
            //     for(var i=multiIndexStart;i<$scope.taskDetails.assigneeList.length;i++){
            //         var task = {};
            //         var tasklog = '';
            //         task.complete = false;
            //         task.escalate = false;
            //         task.critical =false;
            //         task.creater = $scope.user.username?$scope.user.username:'PORTAL';
            //         task.seller = $scope.user.sellerphone?$scope.user.sellerphone:'PORTAL';
            //         task.completedDate = '';
            //         task.taskGroupId = '';
            //         tasklog = $scope.taskDetails.creater+ ' Created task ' + $scope.taskDetails.name;
            //         task.name = $scope.taskDetails.name;
            //         taskobj.message = tasklog;
            //
            //
            //         var date = new Date();
            //         var dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
            //             + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
            //
            //         task.date = dformat;
            //
            //         if($scope.taskDetails.dueDate){
            //             task.dueDate = $scope.taskDetails.dueDate;
            //         }else{
            //             task.dueDate = '';
            //         }
            //
            //
            //         var date = new Date();
            //         var components = [
            //             date.getFullYear() - 1900,
            //             (date.getMonth() < 10)? '0' + date.getMonth() : date.getMonth(),
            //             (date.getDate() < 10)? '0' + date.getDate() : date.getDate(),
            //             (date.getHours() < 10)? '0' + date.getHours() : date.getHours(),
            //             (date.getMinutes() < 10)? '0' + date.getMinutes() : date.getMinutes(),
            //             (date.getSeconds() < 10)? '0' + date.getSeconds() : date.getSeconds(),
            //             (date.getMilliseconds() < 10)? '00' + date.getMilliseconds() : (date.getMilliseconds() < 100)? '0' + date.getMilliseconds() : date.getMilliseconds()
            //         ];
            //         var date_ = components.join("");
            //         task.taskId = date_+i;
            //
            //
            //         if($scope.taskDetails.ref_Id){
            //             task.ref_Id = $scope.taskDetails.ref_Id;
            //         }else{
            //             task.ref_Id = $scope.taskDetails.taskId;
            //         }
            //
            //
            //         task.assignee = $scope.taskDetails.assigneeList[i].id;
            //         task.assigneeName = $scope.taskDetails.assigneeList[i].name;
            //
            //         taskobj.date = $scope.dateFormate(date);
            //         task.taskLogs =  [];
            //         task.taskLogs.push(taskobj);
            //
            //         multiAssignee.push(task);
            //     }
            //
            // }

            console.log('multiAssignee',multiAssignee)

            var body = {
                taskId: $scope.taskDetails.taskId,
                name:$scope.taskDetails.name,
                discr:($scope.taskDetails.discr?$scope.taskDetails.discr:''),
                assignee: $scope.taskDetails.assignee,
                tagName:$scope.taskDetails.tagName,
                assigneeName: $scope.taskDetails.assigneeName,
                taskGroupId:$scope.taskDetails.taskGroupId,
                dueDate: $scope.taskDetails.dueDate,
                updatedBy:$scope.user.username,
                date_updated: date_updated,
                cc:$scope.taskDetails.cc,
                taskLogs:$scope.taskDetails.taskLogobj
            };
            if($scope.taskDetails.ref_Id){
                body.ref_Id = $scope.taskDetails.ref_Id;
            }

            body.multipleassignee = multiAssignee;

            // if($scope.taskDetails.assigneeList && $scope.taskDetails.assigneeList.length && !$scope.taskDetails.assignee){
            //     body.assignee = $scope.taskDetails.assigneeList[0].id;
            //     body.assigneeName = $scope.taskDetails.assigneeList[0].name;
            // }else{
            //     body.assignee = $scope.taskDetails.assignee;
            //     body.assigneeName = $scope.taskDetails.assigneeName;
            // }

            if($scope.taskDetails.assigneeList && $scope.taskDetails.assigneeList.length){
                body.assignee = $scope.taskDetails.assigneeList[0].id;
                body.assigneeName = $scope.taskDetails.assigneeList[0].name;
            }

            if($scope.escalateTask){
                body.escalate = $scope.escalateTask
            }else{
                body.escalate = $scope.taskDetails.escalate
            }

            if( $scope.taskDetails.complete == 'completed'){
                body.complete = true;
                body.escalate = false;
                body.completed_by = $scope.user.seller;
                body.completedDate=DateTimeStampFormat(date);

            }else{
                body.complete = false;
                body.completedDate='';

            }
            // console.log(body)

            if($scope.taskDetails.name){
                $http.post('/dash/task/update',body).success(function(response){

                    if(!response.insert_status){
                        $scope.refreshTransactions(28);
                        $scope.taskDetails.completedDate = response.completedDate;

                        if($scope.taskDetails.taskLogs){
                            $scope.taskDetails.taskLogs.push(taskobj)
                        }else{
                            $scope.taskDetails.taskLogs = [];
                            $scope.taskDetails.taskLogs.push(taskobj)
                        }
                        if($scope.taskDetails.dueDate){
                            $scope.taskDetails.dueDate = new Date( $scope.taskDetails.dueDate);
                            $scope.taskDetails.displayDueDate =  (moment($scope.taskDetails.dueDate).calendar().split(" at"))[0];

                            if($scope.taskDetails.displayDueDate.indexOf('last') !== -1){
                                $scope.taskDetails.displayDueDate = moment($scope.taskDetails.dueDate).format("DD/MM/YYYY");
                            }
                        }
                        $scope.oldtaskdetails = angular.copy($scope.taskDetails);
                        taskCCUpdated=false;


                        // $scope.taskDetails.taskLogs = $scope.oldtaskdetails.taskLogs;
                        // toastr.success("Task Updated Successfully")
                        Settings.success_toast("Success", "Task Updated Successfully");

                        $scope.edit = false;
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                    }else{
                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                        $scope.refreshTransactions(28);
                        $scope.getTaskDetails($scope.taskDetails);
                        Settings.alertPopup("Alert",response.assigneeName +" is already assigned");

                    }
                })
            }else{

                Settings.alertPopup("Alert","Please enter the task name");

            }




        }


        $scope.changeSubTaskStatus = function(changeSubTaskStatus,id,param){

            taskid=id
            var newdate = new Date();
            changeSubTaskStatus.complete = param;

            var creater = $scope.user.username ? $scope.user.username : 'Admin';

            if(changeSubTaskStatus.complete){
                taskobj.message = creater + ' updated sub task ' + changeSubTaskStatus.name + ' completed';
                taskobj.date    = newdate;
            }else{
                taskobj.message = creater + ' updated sub task ' + changeSubTaskStatus.name + ' not completed';
                taskobj.date    = newdate;
            }



            var body = {
                complete: changeSubTaskStatus.complete,
                creater: changeSubTaskStatus.creater,
                creater_phone: changeSubTaskStatus.creater_phone,
                date_added: changeSubTaskStatus.date_added,
                name: changeSubTaskStatus.name,
                subtaskId: changeSubTaskStatus.subtaskId,
                date: newdate
            }

            var reqbody = {
                "body":body,
                "taskLogs" : taskobj,
            };


            $http.put('/dash/task/edit/subtask/'+id, reqbody).success(function(response){
                // console.log(response );
                if(response && changeSubTaskStatus.complete){

                    if($scope.taskDetails.taskLogs){
                        $scope.taskDetails.taskLogs.push(taskobj)
                    }else{
                        $scope.taskDetails.taskLogs = [];
                        $scope.taskDetails.taskLogs.push(taskobj)
                    }

                    Settings.success_toast("Success", "Subtask "+changeSubTaskStatus.name+" completed");
                }else if(response){
                    if($scope.taskDetails.taskLogs){
                        $scope.taskDetails.taskLogs.push(taskobj)
                    }else{
                        $scope.taskDetails.taskLogs = [];
                        $scope.taskDetails.taskLogs.push(taskobj)
                    }
                }
            })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });


            console.log(body,'altereds');
        }


        $scope.taskUserChanged = function(type){
            if(type == 'create')
            {
                $scope.task.taskUserBox = '';
            }else{
                $scope.taskDetails.assigneeName='';

            }
            jQuery.noConflict();
            $(".taskDropdown").css('display', 'none')
            $scope.t = {};
        }

        $scope.taskgroupUserChanged = function(type){

            $scope.task.taskGroupBox = '';
            $scope.task.taskUserBox = '';

            jQuery.noConflict();
            $(".taskGroupDropdown").css('display', 'none')
            $(".taskDropdown").css('display', 'none')

        }



        $scope.taskUserCc = function(type){
            if(type == 'create')
            {
                $scope.task.taskCc = '';
            }else{
                $scope.taskDetails.taskCc = '';
            }
            $scope.cc = {};
        }



        //Task search filter function

        $scope.taskSearchFilter = function(){

            taskSearchObj.viewLength = 0;
            taskSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.allTaskSearch.filter){
                taskSearchObj.searchFor = $scope.allTaskSearch.filter;
                taskSearchObj.searchBy = taskSearchBy;
            }

            $scope.allTasks = [];

            // console.log(taskSearchObj)
            $http.post("/dash/task", taskSearchObj)
                .success(function(res){
                    // console.log('task res',res);
                    $scope.renderTask(res);
                })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

            $http.post("/dash/task/count", taskSearchObj)
                .success(function(res) {
                    $scope.transactionCount(res,28);
                })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

        };


        $scope.createGroupPagination = function(){
            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.sellers;
            $scope.userSearch.filter = '';
            $scope.showSellerFilter = false;
            $scope.clearFilter(5);

        }


        // create group task

        $scope.groupTask.users = [];

        $scope.createGroupTask = function(res) {
            var date = new Date();
            var dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
                + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

            if ($scope.groupTask.name != '' && $scope.groupTask.name != null && $scope.groupTask.name != undefined) {
                if ($scope.AddTaskToUser != '' && $scope.AddTaskToUser != null && $scope.AddTaskToUser != undefined) {


                    for (var i = 0; i < $scope.AddTaskToUser.length; i++) {

                        if ($scope.AddTaskToUser[i].sellerphone) {
                            $scope.groupTask.users.push({
                                'sellerphone': $scope.AddTaskToUser[i].sellerphone,
                                'level': parseInt($scope.AddTaskToUser[i].level)
                            });
                        }
                    }

                    $scope.groupTask.groupId = $scope.generateOrderId();
                    $scope.groupTask.date_added = dformat;
                    $scope.groupTask.creater = $scope.user.username;
                    $scope.groupTask.createrPhoneNum = $scope.user.sellerphone;

                    $scope.tempObj = {};
                    $scope.tempObj = res;

                    $http.post("/dash/task/group/add", $scope.tempObj)
                        .success(function (response) {
                            if (response) {
                                Settings.alertPopup("SUCCESS", "Group created successfully");

                                $scope.clearGroupTaskFields();
                                $scope.closeModal();
                                $scope.getGroupTaskDetails();
                                $scope.groupTask.users = [];
                            }
                        })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }
                else
                {
                    Settings.alertPopup("ERROR", "Please add users");
                }
            }
            else {
                Settings.alertPopup("ERROR", "Please Enter group name");
            }

        }



        /* clear fields*/

        $scope.clearGroupTaskFields = function(){
            $scope.AddTaskToUser = [];
            $scope.groupTask.name = '';
        }


        /* add users to group */
        $scope.AddTaskToUser = [];
        $scope.addUsersToTaskList = function(seller){
            if(seller.role != "Admin"){
                if ($scope.AddTaskToUser.indexOf(seller) == -1) {
                    $scope.AddTaskToUser.push(seller);
                    var indexInCatalogue = $scope.doesItemExistsInArray($scope.sellers, "sellername", seller)
                    $scope.sellers[indexInCatalogue].added = $scope.AddTaskToUser.length - 1;
                    return $scope.AddTaskToUser.length;
                }else{
                    Settings.alertPopup("ERROR", "User is already group member");
                }
            }else{
                Settings.alertPopup("ERROR", "Can't add Admin to Group");
            }
        }




        /* remove users from group*/
        $scope.removeUserFromList = function(seller,index){

            var indexInCatalogue = $scope.doesItemExistsInArray($scope.sellers,"sellerphone",seller)
            $scope.sellers[indexInCatalogue].added =-1;
            $scope.AddTaskToUser.splice(index,1);
        }


        //get group details
        $scope.groupTaskDetails = [];
        $scope.getGroupTaskDetails = function(){
            $http.get("/dash/task/group/tasks").success(function(response){
                $scope.groupTaskDetails = response;
                // console.log("groupTaskDetails",$scope.groupTaskDetails);
            })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        }


        // group members
        $scope.groupUsers =[];
        $scope.getGroupTaskMembers = function(task){

            $scope.showGroupTaskDetails=true;
            $scope.groupMembers = true;
            $scope.groupName = task.name;
            $scope.groupID= task.groupId;
            $scope.groupUsers = task.users;
            $scope.groupCreater = task.creater;
            $scope.getTaskList(task);

            $http.post("/dash/task/group/members", $scope.groupUsers).success(function(response) {
                $scope.taskDetails1 = response;
            })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        }

        $scope.idSelectedGroup = null;
        $scope.setSelectedGroup = function (idSelectedGroup) {
            $scope.idSelectedGroup = idSelectedGroup;
        };


        $scope.getTaskList = function(res){
            $scope.getTaskList1 = [];

            for(var i=0; i<$scope.allTasks.length; i++){
                if(res.groupId == $scope.allTasks[i].taskGroupId){
                    $scope.getTaskList1.push($scope.allTasks[i])
                }
            }

        }


        $scope.closeGroupTask = function(){
            // $scope.showGroupTaskDetails = false;
            $scope.groupMembers = false;
            // $scope.getTaskList1 = [];
        }


        //delete user from group

        $scope.deleteGroupUser = function(group,i,seller){

            var temp = {};
            temp.groupid = group;
            temp.seller =  seller.sellerphone ;

            Settings.confirmPopup("CONFIRM", "Are you sure?", function(result){
                if(result){
                    $http.post("/dash/task/group/member/delete",temp)
                        .success(function(res){
                            if(res){
                                $scope.taskDetails1.splice(i,1);
                                console.log("true",res)
                            }
                            $scope.getGroupTaskDetails();
                        })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }
            });
        }

        /*delete group*/
        $scope.deleteGroup = function(group){

            var temp = {};
            temp.groupid = group;

            Settings.confirmPopup("CONFIRM", "Are you sure?", function(result){
                if(result){
                    $http.post("/dash/task/group/delete",temp)
                        .success(function(res){
                            Settings.success_toast("Success", "Group Deleted Successfully");
                            $scope.closeGroupTask();
                            $scope.getGroupTaskDetails();
                        })
                        .error(function(error, status){
                            console.log(error, status);
                            if(status >= 400 && status < 404)
                                $window.location.href = '/404';
                            else if(status >= 500)
                                $window.location.href = '/500';
                            else
                                $window.location.href = '/404';
                        });
                }
            })

        }

        /*edit users[add/remove] */
        $scope.editTaskToUser = [];
        $scope.editUsersToTaskList = function(seller){
            if(seller.role != "Admin"){
                var result = $scope.taskDetails1.filter(
                    function(items){return items.sellerid == seller.sellerid})

                if ($scope.editTaskToUser.indexOf(seller) == -1 && !result.length) {
                    $scope.editTaskToUser.push(seller);
                    var indexInCatalogue = $scope.doesItemExistsInArray($scope.sellers, "sellername", seller)
                    $scope.sellers[indexInCatalogue].added = $scope.editTaskToUser.length - 1;
                    return $scope.editTaskToUser.length;
                } else{
                    Settings.alertPopup("ERROR", "User is already group member");
                }

            }else{
                Settings.alertPopup("ERROR", "Can't add Admin to Group");
            }

        }

        /*remove users from edit group*/
        $scope.removeEditUserFromList = function(seller,index){

            var indexInCatalogue = $scope.doesItemExistsInArray($scope.sellers,"sellerphone",seller)
            $scope.sellers[indexInCatalogue].added =-1;
            $scope.editTaskToUser.splice(index,1);
        }


        /*clear edit details*/
        $scope.clearEditGroupTaskFields = function(){
            $scope.editTaskToUser = [];
        }

        // create edited group task

        $scope.editGroupTask = function(res,name) {
            $scope.groupUsers = [];

            if($scope.editTaskToUser.length){
                for (var i = 0; i < $scope.editTaskToUser.length; i++) {
                    if ($scope.editTaskToUser[i].sellerphone) {
                        $scope.groupUsers.push({
                            'sellerphone': $scope.editTaskToUser[i].sellerphone,
                            'level': parseInt($scope.editTaskToUser[i].level)
                        });
                    }
                }
            }


            for (var i = 0; i < $scope.taskDetails1.length; i++) {
                $scope.groupUsers.push({
                    'sellerphone': $scope.taskDetails1[i].sellerphone,
                    'level': parseInt($scope.taskDetails1[i].level)
                });
            }


            $scope.tempObj = {};
            $scope.tempObj.id = res;
            $scope.tempObj.name = name;
            $scope.tempObj.users = $scope.groupUsers;

            $http.post("/dash/task/group/task/update", $scope.tempObj)
                .success(function (response) {
                    if (response) {
                        Settings.alertPopup("SUCCESS", "Successfully updated");
                        $scope.clearEditGroupTaskFields();
                        $scope.getGroupTaskDetails();
                        $scope.getGroupTaskMembers($scope.tempObj);
                        $scope.closeModal();
                    }
                })
                .error(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });
        }

        $scope.changeDataSource = function(tab, value){
            $scope.taskSelectedTab = value;
            if(value == 'tasks'){
                taskSearchObj.viewLength = 0;
                taskSearchObj.viewBy = taskinitialViewBy;
                taskSearchObj.searchFor = '';
                taskSearchObj.seller = '';
                taskSearchObj.stockist = '';
                taskSearchObj.searchBy = [];
                $scope.showTaskDetails = false;

                $http.post("/dash/task", taskSearchObj)
                    .success(function(res){
                        $scope.renderTask(res);
                    })
                    .error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });

                $http.post("/dash/task/count", taskSearchObj)
                    .success(function(res) {
                        $scope.transactionCount(res,28);
                    })
                    .error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });

            }
            else if(value == 'group'){
                $scope.getGroupTaskDetails();
                $scope.showTaskDetails = false;
                $scope.refreshTransactions(28);
            }

            //<<<---for expenses show initial data and background color selected in settings page--->>>
            if(document.getElementById("selectBackground"+0)){
                document.getElementById("selectBackground"+0).style.background = '#dedbdbd4';
                document.getElementById("selectBackground"+selectBackgroundColor).style.background = '';
            }

            if($scope.expense_Type){
                $scope.selectExpenses($scope.expense_Type.category[0].name);
            }
        }

        var a = 0;
        $scope.navPage = function(tab, direction){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;

            console.log('$scope.allTasks',$scope.allTasks);

            if(direction){
                console.log("NEXT");
                console.log('log',viewLength + viewBy)
                console.log('$scope.allTask_count',$scope.allTask_count)
                if(viewLength + viewBy >= $scope.allTasks.length){
                    if(viewLength + viewBy < $scope.allTask_count){
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        taskSearchObj.viewLength = viewLength;
                        taskSearchObj.viewBy = taskinitialViewBy;

                        $http.post("/dash/task",taskSearchObj)
                            .success(function(response){
                                console.log('response',response);

                                $scope.renderTask(response)

                                if(viewLength + viewBy > $scope.allTask_count){
                                    a = viewLength + viewBy - $scope.allTask_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                                $scope.viewLength = viewLength;
                            })
                            .error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });

                    }
                    else{
                        //console.log("Out of data")
                        if(viewLength + viewBy > $scope.allTask_count){
                            a = viewLength + viewBy - $scope.allTask_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    //console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.allTask_count){
                        a = viewLength + viewBy - $scope.allTask_count;
                        viewBy -= a;
                    }
                    $scope.newViewBy = viewBy;
                    $scope.viewLength = viewLength;
                }
            }
            else{
                console.log("BACK");
                if(viewLength < viewBy){
                    //console.log("NO DATA")
                }
                else{
                    if(viewLength + viewBy >= $scope.allTask_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }


        $scope.clearFilterButton = function (search,tab) {
            if (search === '') {
                $scope.allTasks = [];

                taskSearchObj.viewLength = 0;
                taskSearchObj.viewBy = taskinitialViewBy;
                taskSearchObj.searchFor = '';
                taskSearchObj.seller = '';
                taskSearchObj.stockist = '';
                taskSearchObj.searchBy = [];

                $http.post("/dash/task", taskSearchObj)
                    .success(function (res) {
                        $scope.renderTask(res);
                    })
                    .error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
                $http.post("/dash/task/count", taskSearchObj)
                    .success(function (res) {
                        $scope.transactionCount(res, 28);
                    })
                    .error(function(error, status){
                        console.log(error, status);
                        if(status >= 400 && status < 404)
                            $window.location.href = '/404';
                        else if(status >= 500)
                            $window.location.href = '/500';
                        else
                            $window.location.href = '/404';
                    });
            }
        }


    })

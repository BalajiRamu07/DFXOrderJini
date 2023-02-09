angular.module('ebs.controller')

    .controller("AttendanceReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Attendance Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Attendance";

        $scope.reportTabId = 11;
        $scope.tab = 8;
        $scope.showReports = true;
        $scope.attendance_count = 0;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let master_date_added = {};
        let instanceDetails =  Settings.getInstance();
        const api_timeout = 600000;

        $scope.showAtdDashboard = true;
        $scope.attendancereport = [];

        //.... Reports Filter.....
        $scope.atdreports = {};
        $scope.atdChartReport           = {};

        //.... Set Filter Dates to last 7 days....
        $scope.atdreports.startDate = new Date();
        $scope.atdreports.startDate.setDate($scope.atdreports.startDate.getDate() - 3);
        $scope.atdreports.startDate.setHours(0, 0, 0, 0);
        $scope.atdreports.endDate = new Date();
        $scope.atdreports.endDate.setHours(23, 59, 59, 59);

        $scope.atdChartReport.startDate = new Date();
        $scope.atdChartReport.startDate.setDate($scope.atdChartReport.startDate.getDate() - 3);
        $scope.atdChartReport.startDate.setHours(0, 0, 0, 0);
        $scope.atdChartReport.endDate = new Date();
        $scope.atdChartReport.endDate.setHours(23, 59, 59, 59);

        $scope.AttendanceReportSearch = {};
        $scope.AttendanceReportSearch.filter = '';
        $scope.mapsFilter = {};
        $scope.mapsFilter.to = new Date();
        $scope.mapsFilter.to.setHours(23, 59, 59, 59);

        let attSearchObj = {};
        //$scope.attendanceDuration = $scope.daysDifference($scope.atdreports.startDate , $scope.atdreports.endDate);
        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

        $scope.openFilterClear = () => {
            $scope.atdreports.startDate = '';
            $scope.atdreports.endDate = '';

            $scope.atdreports.startDate = new Date();
            $scope.atdreports.startDate.setDate($scope.atdreports.startDate.getDate() - 7);
            $scope.atdreports.startDate.setHours(0, 0, 0, 0);
            $scope.atdreports.endDate = new Date();
            $scope.atdreports.endDate.setHours(23, 59, 59, 59);
        }
        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
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

        
        function getMaster_Date_added(date) {
            var d = new Date(date);
            var d2 = new Date(date);
            master_date_added.date = date.getDate();
            master_date_added.month = date.getMonth();
            master_date_added.year = date.getFullYear();

            d.setDate(d.getDate() - 1);
            master_date_added.date_1 = d.getDate();
            master_date_added.month_1 = d.getMonth();
            master_date_added.year_1 = d.getFullYear();

            d2.setDate(d2.getDate() - 2)
            master_date_added.date_2 = d2.getDate();
            master_date_added.month_2 = d2.getMonth();
            master_date_added.year_2 = d2.getFullYear();
        }

        function reverseGeocode(callback, latlng, type){
            var geocoder = new google.maps.Geocoder();

            if(type == 'ATD'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'ATD');
                    }
                });
            }
            else if(type == 'customer'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'customer');
                    }
                });
            }
            else if(type == 'startVisit'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'startVisit');
                    }
                });
            }
            else if(type == 'endVisit'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'endVisit');
                    }
                });
            } else if(type == 'delivered'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results);
                        var address = (results[0].formatted_address);
                        callback.call(this, address, 'delivered');
                    }
                });
            }

            else if(type == 'bidhistory'){
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        console.log(status);
                    }

                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log("bidhistory address==");
                        var address = (results[0].formatted_address);

                        callback.call(this, address, 'bidhistory');
                    }
                });
            }


        }

        function geocode_address(result, type){
            if(type == 'ATD'){
                //console.log(result)
                $scope.attendance_address = result;
                $scope.$apply();
            }
            else if(type == 'customer'){
                $scope.checkinMapLocation.dealer = result;
                $scope.$apply();
            }
            else if(type == 'startVisit'){
                $scope.checkinMapLocation.sVisit = result;
                $scope.$apply();
            }
            else if(type == 'endVisit'){
                $scope.checkinMapLocation.eVisit = result;
                $scope.$apply();
            }
            else if(type == 'bidhistory'){
                $scope.checkinMapLocation.BidHistoryAddress = result;
                $scope.$apply();
            } else if(type == 'delivered'){
                $scope.checkinMapLocation.delivered = result;
                $scope.$apply();
            }
        }

        $scope.toggleDashboard = function(){
            $scope.showAtdDashboard = !$scope.showAtdDashboard;
            if(!$scope.showAtdDashboard)
                $scope.noAttendance();
        };
        $scope.noAttendance = function () {
            console.log("No attendance------>")
            var attr = '', attSearchObj1 = {};
            attr = new Date();


            attSearchObj1.viewLength = 0;
            attSearchObj1.viewBy = initialViewBy;
            attSearchObj1.sDate = $scope.DateTimeFormat(attr, 'start');
            attSearchObj1.eDate = $scope.DateTimeFormat(attr, 'end');
            attSearchObj1.searchFor = '';

            $http.post("/dash/reports/noattendance", attSearchObj1)
                .success(function (response) {
                    $scope.noAttendanceRes = response;
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
        $scope.transactionCount = function(response){
            //console.log(response);
            if(response){
                if(response > localViewBy){
                    $scope.attendance_count = response;
                }
                else if(response <= localViewBy){
                    $scope.attendance_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.attendancereport = [];
                    $scope.newViewBy = 1;
                    $scope.attendance_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.attendancereport = [];
                $scope.newViewBy = 1;
                $scope.attendance_count = 0;
                $scope.viewLength = -1;
            }
        };

        const loadReport = (attSearchObj) =>{
            startLoader();
            $http.post("/dash/reports/attendance", attSearchObj)
                .success(function(response){
                    console.log("GetAll Attendance reports-->", response);

                    $scope.attendancereport = response;
                    allAttendance = response;
                    stopLoader();
                    if($scope.AttendanceReportSearch.filter)
                        $scope.showAttendanceFilter = true;
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
        const loadReportCount = (attSearchObj) => {
            $http.post("/dash/reports/attendance/count", attSearchObj)
                .success(function (res) {
                    $scope.transactionCount(res);
                    stopLoader();
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

        $scope.navPage = (direction, newViewBy) => {
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;

            if(direction){
                //console.log("NEXT");

                if(viewLength + viewBy >= $scope.attendancereport.length){
                    if(viewLength + viewBy < $scope.attendance_count){
                        viewLength += viewBy;
                        //console.log("Fetch more")
                        attSearchObj.viewLength = viewLength;
                        attSearchObj.viewBy = initialViewBy;
                        attSearchObj.sDate = $scope.DateTimeFormat($scope.atdreports.startDate, 'start');
                        attSearchObj.eDate = $scope.DateTimeFormat($scope.atdreports.endDate, 'end');
                        attSearchObj.searchFor = $scope.AttendanceReportSearch.filter;

                        $http.post("/dash/reports/attendance",attSearchObj)
                            .success(function(response){
                                //console.log(response);

                                for(var i=0; i<response.length; i++){
                                    $scope.attendancereport.push(response[i]);
                                }
                            })
                        //loadReport(attSearchObj);

                        if(viewLength + viewBy > $scope.attendance_count){
                            a = viewLength + viewBy - $scope.attendance_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        //console.log("Out of data")
                        if(viewLength + viewBy > $scope.attendance_count){
                            a = viewLength + viewBy - $scope.attendance_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    //console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.attendance_count){
                        a = viewLength + viewBy - $scope.attendance_count;
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
                    if(viewLength + viewBy >= $scope.attendance_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.changeReportView = (newViewBy) => {
            //startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);

            $scope.atdreports.startDate = new Date();
            $scope.atdreports.startDate.setDate($scope.atdreports.startDate.getDate() - 3);
            $scope.atdreports.startDate.setHours(0, 0, 0, 0);
            $scope.atdreports.endDate = new Date();
            $scope.atdreports.endDate.setHours(23, 59, 59, 999);

            $scope.atdChartReport.startDate = new Date();
            $scope.atdChartReport.startDate.setDate($scope.atdChartReport.startDate.getDate() - 3);
            $scope.atdChartReport.startDate.setHours(0, 0, 0, 0);
            $scope.atdChartReport.endDate = new Date();
            $scope.atdChartReport.endDate.setHours(23, 59, 59, 999);

            $scope.attendancereport = [];
            $scope.attendanceChartReport = [];
            attSearchObj.viewLength = 0;
            attSearchObj.viewBy = initialViewBy;
            attSearchObj.sDate = $scope.DateTimeFormat($scope.atdreports.startDate, 'start');
            attSearchObj.eDate = $scope.DateTimeFormat($scope.atdreports.endDate, 'end');
            attSearchObj.searchFor = '';

            $scope.viewLength = 0;
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            $http.post("/dash/reports/attendance", attSearchObj)
                .success(function (res) {
                    allAttendanceRecords = res;
                    $scope.attendancereport = res;
                    for (i = 0; i < res.length; i++) {
                        if (res[i].date_added[0]) {
                            var d = new Date(res[i].date_added[0]);
                            var date = {};
                            date.date = d.getDate();
                            date.month = d.getMonth();

                            if ((d.getDate() == master_date_added.date) && (d.getMonth() == master_date_added.month) && (d.getFullYear() == master_date_added.year)) {
                                $scope.attendanceChartReport.push(res[i]);
                            }
                        }
                    }

                    getMaster_Date_added(new Date());
                    $scope.drawAtdChart();
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

            loadReportCount(attSearchObj);
            $scope.noAttendance();
        }
        $scope.changeReportDuration = (startDate, endDate, reset) => {
            if(endDate)
                endDate.setHours(23, 59, 59, 59);

            if(!reset) {
                if(startDate || endDate){
                    let numberOfDays
                    if (startDate && endDate) {
                        let d1 = moment(startDate);
                        let d2 = moment(endDate);
                        numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else if (!endDate) {
                        let d1 = moment(startDate);
                        let d2 = moment(new Date());
                        numberOfDays = moment.duration(d2.diff(d1)).asDays();
                    }
                    else
                        numberOfDays = 0;

                    $scope.attendanceDuration = numberOfDays;
                }
            }else
                $scope.attendanceDuration = 0;
        }

        $scope.attendanceUser = {};
        $scope.drawAtdChart = function(){
            $scope.attendanceUser = {};
            $scope.attendanceUser.punchIn = 0;
            $scope.attendanceUser.punchOut = 0;

            var punchIn = 0;
            var punchIn_1 = 0;
            var punchIn_2 = 0;
            var punchIn_3 = 0;

            var punchOut = 0;
            var punchOut_1 = 0;
            var punchOut_2 = 0;
            var punchOut_3 = 0;

            var barGraph_In = [];
            barGraph_In[0] = {};
            barGraph_In[0].pIn = 0;
            barGraph_In[0].pIn_1 = 0;
            barGraph_In[0].pIn_2 = 0;
            barGraph_In[0].pIn_3 = 0;

            barGraph_In[1] = {};
            barGraph_In[1].pIn = 0;
            barGraph_In[1].pIn_1 = 0;
            barGraph_In[1].pIn_2 = 0;
            barGraph_In[1].pIn_3 = 0;

            barGraph_In[2] = {};
            barGraph_In[2].pIn = 0;
            barGraph_In[2].pIn_1 = 0;
            barGraph_In[2].pIn_2 = 0;
            barGraph_In[2].pIn_3 = 0;

            var barGraph_Out = [];
            barGraph_Out[0] = {};
            barGraph_Out[0].pIn = 0;
            barGraph_Out[0].pIn_1 = 0;
            barGraph_Out[0].pIn_2 = 0;
            barGraph_Out[0].pIn_3 = 0;

            barGraph_Out[1] = {};
            barGraph_Out[1].pIn = 0;
            barGraph_Out[1].pIn_1 = 0;
            barGraph_Out[1].pIn_2 = 0;
            barGraph_Out[1].pIn_3 = 0;

            barGraph_Out[2] = {};
            barGraph_Out[2].pIn = 0;
            barGraph_Out[2].pIn_1 = 0;
            barGraph_Out[2].pIn_2 = 0;
            barGraph_Out[2].pIn_3 = 0;

            var todayDate = new Date();
            for(var i=0; i<$scope.attendanceChartReport.length; i++){

                if($scope.attendanceChartReport[i].intime[0]){
                    if($scope.attendanceChartReport[i].latitude[0] == 1)
                        punchIn_1++;
                    else if($scope.attendanceChartReport[i].latitude[0] == 2)
                        punchIn_2++;
                    else if($scope.attendanceChartReport[i].latitude[0] == 3 || $scope.attendanceChartReport[i].latitude[0] == 4)
                        punchIn_3++;
                    else
                        punchIn++;
                }

                if($scope.attendanceChartReport[i].outtime[0]){
                    if($scope.attendanceChartReport[i].punch_out_lat[0] == 1)
                        punchOut_1++;
                    else if($scope.attendanceChartReport[i].punch_out_lat[0] == 2)
                        punchOut_2++;
                    else if($scope.attendanceChartReport[i].punch_out_lat[0] == 3 || $scope.attendanceChartReport[i].punch_out_lat[0] == 4)
                        punchOut_3++;
                    else
                        punchOut++;
                }

            }

            $scope.attendanceUser.punchIn = punchIn + punchIn_1 + punchIn_2 + punchIn_3;
            $scope.attendanceUser.punchOut = punchOut + punchOut_1 + punchOut_2 + punchOut_3;


            var tempDate = new Date($scope.atdChartReport.endDate);
            var tempDate_1 = new Date($scope.atdChartReport.endDate);
            tempDate_1.setDate(tempDate_1.getDate() - 1)
            var tempDate_2 = new Date($scope.atdChartReport.endDate);
            tempDate_2.setDate(tempDate_2.getDate() - 2)


            barGraph_In[0].date = $scope.formatDate(tempDate)
            barGraph_In[1].date = $scope.formatDate(tempDate_1)
            barGraph_In[2].date = $scope.formatDate(tempDate_2)

            barGraph_Out[0].date = $scope.formatDate(tempDate)
            barGraph_Out[1].date = $scope.formatDate(tempDate_1)
            barGraph_Out[2].date = $scope.formatDate(tempDate_2)


            //console.log($scope.attendanceChartReport)
            //console.log(allAttendanceRecords)
            for(var i=0; i< allAttendanceRecords.length; i++){
                var d = new Date(allAttendanceRecords[i].date_added[0]);
                if(allAttendanceRecords[i].intime[0]){
                    if((master_date_added.date == d.getDate()) && (master_date_added.month == d.getMonth()) && (master_date_added.year == d.getFullYear())){
                        if(allAttendanceRecords[i].latitude[0] == 1)
                            barGraph_In[0].pIn_1++;
                        else if(allAttendanceRecords[i].latitude[0] == 2)
                            barGraph_In[0].pIn_2++;
                        else if(allAttendanceRecords[i].latitude[0] == 3 || allAttendanceRecords[i].latitude[0] == 4)
                            barGraph_In[0].pIn_3++;
                        else
                            barGraph_In[0].pIn++;
                    }
                    else if((master_date_added.date_1 == d.getDate()) && (master_date_added.month_1 == d.getMonth()) && (master_date_added.year_1 == d.getFullYear())){
                        if(allAttendanceRecords[i].latitude[0] == 1)
                            barGraph_In[1].pIn_1++;
                        else if(allAttendanceRecords[i].latitude[0] == 2)
                            barGraph_In[1].pIn_2++;
                        else if(allAttendanceRecords[i].latitude[0] == 3 || allAttendanceRecords[i].latitude[0] == 4)
                            barGraph_In[1].pIn_3++;
                        else
                            barGraph_In[1].pIn++;
                    }
                    else if((master_date_added.date_2 == d.getDate()) && (master_date_added.month_2 == d.getMonth()) && (master_date_added.year_2 == d.getFullYear())){
                        if(allAttendanceRecords[i].latitude[0] == 1)
                            barGraph_In[2].pIn_1++;
                        else if(allAttendanceRecords[i].latitude[0] == 2)
                            barGraph_In[2].pIn_2++;
                        else if(allAttendanceRecords[i].latitude[0] == 3 || allAttendanceRecords[i].latitude[0] == 4)
                            barGraph_In[2].pIn_3++;
                        else
                            barGraph_In[2].pIn++;
                    }
                }

                if(allAttendanceRecords[i].outtime[0]){
                    if((master_date_added.date == d.getDate()) && (master_date_added.month == d.getMonth()) && (master_date_added.year == d.getFullYear())){
                        if(allAttendanceRecords[i].punch_out_lat[0] == 1)
                            barGraph_Out[0].pIn_1++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 2)
                            barGraph_Out[0].pIn_2++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 3 || allAttendanceRecords[i].punch_out_lat[0] == 4)
                            barGraph_Out[0].pIn_3++;
                        else
                            barGraph_Out[0].pIn++;
                    }
                    else if((master_date_added.date_1 == d.getDate()) && (master_date_added.month_1 == d.getMonth()) && (master_date_added.year_1 == d.getFullYear())){
                        if(allAttendanceRecords[i].punch_out_lat[0] == 1)
                            barGraph_Out[1].pIn_1++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 2)
                            barGraph_Out[1].pIn_2++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 3 || allAttendanceRecords[i].punch_out_lat[0] == 4)
                            barGraph_Out[1].pIn_3++;
                        else
                            barGraph_Out[1].pIn++;
                    }
                    else if((master_date_added.date_2 == d.getDate()) && (master_date_added.month_2 == d.getMonth()) && (master_date_added.year_2 == d.getFullYear())){
                        if(allAttendanceRecords[i].punch_out_lat[0] == 1)
                            barGraph_Out[2].pIn_1++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 2)
                            barGraph_Out[2].pIn_2++;
                        else if(allAttendanceRecords[i].punch_out_lat[0] == 3 || allAttendanceRecords[i].punch_out_lat[0] == 4)
                            barGraph_Out[2].pIn_3++;
                        else
                            barGraph_Out[2].pIn++;
                    }
                }
            }


            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart(){

                //........Punch In pie chart......//
                var punchInData = google.visualization.arrayToDataTable([
                    ['Punch-In', '%'],
                    ['Location OK ('+punchIn+')', punchIn],
                    ['User Denied Permission ('+punchIn_1+')', punchIn_1],
                    ['GPS Error ('+punchIn_2+')',  punchIn_2],
                    ['Device GPS - OFF ('+punchIn_3+')', punchIn_3]
                ]);
                var punchInoptions = {
                    legend : {position : 'top', alignment : 'center'},
                    pieSliceText : 'value',
                    slices : [{color : 'green'}, {color : 'red'}, {color: 'yellow'}, {color: 'orange'}],
                    chartArea : {width : '100%', height:'70%'},
                    pieHole : '0.3'
                };
                var punchInchart = new google.visualization.PieChart(document.getElementById('atd_PunchIn_PieChart'));


                // //........Punch Out pie chart....//
                var punchOutData = google.visualization.arrayToDataTable([
                    ['Punch-Out', '%'],
                    ['Location OK ('+punchOut+')', punchOut],
                    ['User Denied Permission ('+punchOut_1+')', punchOut_1],
                    ['GPS Error ('+punchOut_2+')',  punchOut_2],
                    ['Device GPS - OFF ('+punchOut_3+')', punchOut_3]
                ]);
                var punchOutchart = new google.visualization.PieChart(document.getElementById('atd_PunchOut_PieChart'));


                // //.......Punch in bar graph.......//
                var punchInBarDate = google.visualization.arrayToDataTable([
                    ['Date','Location OK','User Denied Permission','GPS Error','Device GPS - OFF'],
                    [barGraph_In[2].date, barGraph_In[2].pIn, barGraph_In[2].pIn_1, barGraph_In[2].pIn_2, barGraph_In[2].pIn_3],
                    [barGraph_In[1].date, barGraph_In[1].pIn, barGraph_In[1].pIn_1, barGraph_In[1].pIn_2, barGraph_In[1].pIn_3],
                    [barGraph_In[0].date, barGraph_In[0].pIn, barGraph_In[0].pIn_1, barGraph_In[0].pIn_2, barGraph_In[0].pIn_3]
                ])
                var punchInBarOptions = {
                    vAxis: {title: '# of Users'},
                    hAxis: {title: 'Date'},
                    seriesType: 'bars',
                    series: [
                        {color: 'green'},
                        {color: 'red'},
                        {color: 'yellow'},
                        {color: 'orange'}
                    ],
                    legend : {position : 'top', alignment : 'center'}
                };
                var punchInBarChart = new google.visualization.ComboChart(document.getElementById('atd_PunchIn_BarChart'));
                punchInBarChart.draw(punchInBarDate, punchInBarOptions);


                //.......Punch out bar graph.......//
                var punchOutBarDate = google.visualization.arrayToDataTable([
                    ['Date','Location OK','User Denied Permission','GPS Error','Device GPS - OFF'],
                    [barGraph_Out[2].date, barGraph_Out[2].pIn, barGraph_Out[2].pIn_1, barGraph_Out[2].pIn_2, barGraph_Out[2].pIn_3],
                    [barGraph_Out[1].date, barGraph_Out[1].pIn, barGraph_Out[1].pIn_1, barGraph_Out[1].pIn_2, barGraph_Out[1].pIn_3],
                    [barGraph_Out[0].date, barGraph_Out[0].pIn, barGraph_Out[0].pIn_1, barGraph_Out[0].pIn_2, barGraph_Out[0].pIn_3]
                ])
                var punchOutBarOptions = {
                    vAxis: {title: '# of Users'},
                    hAxis: {title: 'Date'},
                    seriesType: 'bars',
                    series: [
                        {color: 'green'},
                        {color: 'red'},
                        {color: 'yellow'},
                        {color: 'orange'}
                    ],
                    legend : {position : 'top', alignment : 'center'}
                };
                var punchOutBarChart = new google.visualization.ComboChart(document.getElementById('atd_PunchOut_BarChart'));
                punchOutBarChart.draw(punchOutBarDate, punchOutBarOptions);

                if(punchIn || punchIn_1 || punchIn_2 || punchIn_3)
                    punchInchart.draw(punchInData, punchInoptions);
                else{
                    jQuery.noConflict();
                    $("#atd_PunchIn_PieChart").html("<br><br><h5 style='text-align:center; margin:0px;'>No punch-in</h5><br><br>")
                }

                if(punchOut || punchOut_1 || punchOut_2 || punchOut_3)
                    punchOutchart.draw(punchOutData, punchInoptions);
                else{
                    jQuery.noConflict();
                    $("#atd_PunchOut_PieChart").html("<br><br><h5 style='text-align:center; margin:0px;'>No punch-out</h5><br><br>")
                    var tempHt = $("#atd_PunchIn_PieChart").height();
                    $("#atd_PunchOut_PieChart").height(tempHt);
                }



                google.visualization.events.addListener(punchInchart, 'select', function(){
                    $scope.atdModalData = [];
                    $scope.atdLocationErrorCode = '';
                    //console.log(punchInchart.getSelection()[0]);
                    var errorType = punchInchart.getSelection()[0].row;

                    if(errorType == 0){
                        //console.log("Location OK")
                        $scope.atdLocationErrorCode = 'LOCATION OK';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] != 1 && $scope.attendanceChartReport[i].latitude[0] != 2 && $scope.attendanceChartReport[i].latitude[0] != 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }

                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 1){
                        //console.log("Denied permission")
                        $scope.atdLocationErrorCode = 'USER DENIED PERMISSION';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] == 1){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 2){
                        //console.log("GPS error")
                        $scope.atdLocationErrorCode = 'GPS ERROR';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] == 2){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 3){
                        //console.log("Device GPS off")
                        $scope.atdLocationErrorCode = 'DEVICE GPS - OFF';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].latitude[0] == 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }

                    jQuery.noConflict();
                    $('#atdLocationErrorModal').modal('show');


                });

                google.visualization.events.addListener(punchOutchart, 'select', function(){
                    //console.log(punchOutchart.getSelection()[0]);
                    $scope.atdModalData = [];
                    $scope.atdLocationErrorCode = '';
                    //console.log(punchInchart.getSelection()[0]);
                    var errorType = punchOutchart.getSelection()[0].row;

                    if(errorType == 0){
                        //console.log("Location OK")
                        $scope.atdLocationErrorCode = 'LOCATION OK';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] != 1 && $scope.attendanceChartReport[i].punch_out_lat[0] != 2 && $scope.attendanceChartReport[i].punch_out_lat[0] != 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }

                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 1){
                        //console.log("Denied permission")
                        $scope.atdLocationErrorCode = 'USER DENIED PERMISSION';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] == 1){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 2){
                        //console.log("GPS error")
                        $scope.atdLocationErrorCode = 'GPS ERROR';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] == 2){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }
                    else if(errorType == 3){
                        //console.log("Device GPS off")
                        $scope.atdLocationErrorCode = 'DEVICE GPS - OFF';
                        for(var i=0; i<$scope.attendanceChartReport.length; i++){
                            if($scope.attendanceChartReport[i].punch_out_lat[0] == 3){
                                $scope.atdModalData.push($scope.attendanceChartReport[i]);
                            }
                        }
                        $scope.$apply();
                        //console.log($scope.atdModalData)
                    }

                    jQuery.noConflict();
                    $('#atdLocationErrorModal').modal('show');
                });

            }
        }

        $scope.changeAtdChart = function(dir){
            $scope.attendanceChartReport = [];
            allAttendanceRecords = [];
            if(dir){
                var tempEndDate = $scope.atdChartReport.endDate;
                tempEndDate.setDate(tempEndDate.getDate() + 1);
                var tempStartDate = $scope.atdChartReport.startDate;
                tempStartDate.setDate(tempStartDate.getDate() + 1);

                $scope.atdChartReport.endDate = tempEndDate;
                $scope.atdChartReport.startDate = tempStartDate;

                getMaster_Date_added(tempEndDate);


                attSearchObj.sDate = $scope.DateTimeFormat(tempStartDate, 'start');
                attSearchObj.eDate = $scope.DateTimeFormat(tempEndDate, 'end');
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy =initialViewBy;
                attSearchObj.searchFor = '';


                $http.post("/dash/reports/attendance", attSearchObj)
                    .success(function(res){

                        allAttendanceRecords = res;
                        for(i=0; i< res.length; i++){
                            if(res[i].date_added[0]){
                                var d = new Date(res[i].date_added[0]);
                                var date = {};
                                date.date = d.getDate();
                                date.month = d.getMonth();

                                if((d.getDate() == master_date_added.date) && (d.getMonth() == master_date_added.month) && (d.getFullYear() == master_date_added.year)){
                                    $scope.attendanceChartReport.push(res[i]);
                                }
                            }
                        }
                        $scope.drawAtdChart();
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

                var tempEndDate = $scope.atdChartReport.endDate;
                tempEndDate.setDate(tempEndDate.getDate() - 1);
                var tempStartDate = $scope.atdChartReport.startDate;
                tempStartDate.setDate(tempStartDate.getDate() - 1);

                $scope.atdChartReport.endDate = tempEndDate;
                $scope.atdChartReport.startDate = tempStartDate;

                getMaster_Date_added(tempEndDate);


                attSearchObj.sDate = $scope.DateTimeFormat(tempStartDate, 'start');
                attSearchObj.eDate = $scope.DateTimeFormat(tempEndDate, 'end');
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy =initialViewBy;
                attSearchObj.searchFor = '';


                $http.post("/dash/reports/attendance", attSearchObj)
                    .success(function(res){

                        allAttendanceRecords = res;
                        for(i=0; i< res.length; i++){
                            if(res[i].date_added[0]){
                                var d = new Date(res[i].date_added[0]);
                                var date = {};
                                date.date = d.getDate();
                                date.month = d.getMonth();

                                if((d.getDate() == master_date_added.date) && (d.getMonth() == master_date_added.month) && (d.getFullYear() == master_date_added.year)){
                                    $scope.attendanceChartReport.push(res[i]);
                                }
                            }
                        }
                        $scope.drawAtdChart();
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

        $scope.renderAttendanceReport = function () {
            startLoader();
            if ((($scope.atdreports.startDate - $scope.atdreports.endDate) > 0) && ($scope.atdreports.startDate && $scope.atdreports.endDate)){
                Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");
                stopLoader();
            }
            else{
                attSearchObj.sDate = $scope.DateTimeFormat($scope.atdreports.startDate, 'start');
                attSearchObj.eDate = $scope.DateTimeFormat($scope.atdreports.endDate, 'end');
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy =initialViewBy;
                attSearchObj.searchFor = '';

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;
                if($scope.AttendanceReportSearch.filter != '')
                    attSearchObj.searchFor = $scope.AttendanceReportSearch.filter;

                // $http.post("/dash/reports/attendance", attSearchObj)
                //     .success(function(response){
                //         console.log("GetAll Attendance reports-->");
                //         //console.log(response)
                //
                //         // response.sort(function(a, b) {
                //         //     return new Date(a.date_added[0]) < new Date(b.date_added[0]) ? 1 : -1;
                //         // });
                //
                //         // $http.post("/dash/reports/attendance/count", attSearchObj)
                //         //     .success(function(res){
                //         //         $scope.transactionCount(res,3);
                //         //     })
                //         //     .error(function(error, status){
                //         //         console.log(error, status);
                //         //         if(status >= 400 && status < 404)
                //         //             $window.location.href = '/404';
                //         //         else if(status >= 500)
                //         //             $window.location.href = '/500';
                //         //         else
                //         //             $window.location.href = '/404';
                //         //     });
                //         loadReportCount(attSearchObj);
                //
                //         $scope.attendancereport = response;
                //         allAttendance = response;
                //
                //         if($scope.AttendanceReportSearch.filter)
                //             $scope.showAttendanceFilter = true;
                //     })
                //     .error(function(error, status){
                //         console.log(error, status);
                //         if(status >= 400 && status < 404)
                //             $window.location.href = '/404';
                //         else if(status >= 500)
                //             $window.location.href = '/500';
                //         else
                //             $window.location.href = '/404';
                //     });
                // stopLoader();
                loadReport(attSearchObj);
                loadReportCount(attSearchObj);
            }
        };
        $scope.formatdate = function(date){
            if(date!=undefined && date!='' && date!= null){
                var a = date.toString();
                var b = a.replace(/-/g, "/");
                return new Date(b);
            }
            else{
                return false;
            }
        };
        $scope.calculateDuration = function(inTime, outTime){
            var intime ,outtime;

            if(inTime.isArray && outTime.isArray)
            {
                intime = inTime[0];
                outtime = outTime[0];
            }
            else
            {
                intime = inTime;
                outtime = outTime;
            }

            if(intime != null && outtime != null){
                if(outtime != ''){

                    var newInTime = new Date(intime);
                    var newOutTime = new Date(outtime);

                    if(newInTime == 'Invalid Date' && newOutTime == 'Invalid Date'){
                        var t1 = intime.split(':');
                        var t2 = outtime.split(':');

                        var hh1 = parseInt(t1[0]);
                        var hh2 = parseInt(t2[0]);
                        var mm1 = parseInt(t1[1]);
                        var mm2 = parseInt(t2[1]);

                        var h1 = hh1*60;
                        var h2 = hh2*60;

                        var diff = (h2 + mm2) - (h1 + mm1);

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            return hh+ "h : " +mm+ "m";
                        }
                        else{
                            var mm = parseInt(diff);
                            return "0h : "+mm+"m";
                        }
                    }
                    else{
                        var t1 = moment(newInTime);
                        var t2 = moment(newOutTime);
                        var diff = moment.duration(t2.diff(t1)).asMinutes();

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            return hh+ "h : " +mm+ "m";
                        }
                        else{
                            var mm = parseInt(diff);
                            return "0h : "+mm+"m";
                        }
                    }

                }

                else{
                    return "User not punched out";
                }
            }
        };
        $scope.calculateDiff = function(inTime,outTime)
        {
            var intime = inTime[0];
            var outtime = outTime[0];

            if(intime != null && outtime != null){
                if(outtime != ''){

                    var newInTime = new Date(intime);
                    var newOutTime = new Date(outtime);

                    if(newInTime == 'Invalid Date' && newOutTime == 'Invalid Date'){
                        var t1 = intime.split(':');
                        var t2 = outtime.split(':');

                        var hh1 = parseInt(t1[0]);
                        var hh2 = parseInt(t2[0]);
                        var mm1 = parseInt(t1[1]);
                        var mm2 = parseInt(t2[1]);

                        var h1 = hh1*60;
                        var h2 = hh2*60;

                        var diff = (h2 + mm2) - (h1 + mm1);

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            // return hh+ "h : " +mm+ "m";

                            return $scope.cal(hh);
                        }
                        else{
                            var mm = parseInt(diff);
                            // return "0h : "+mm+"m";

                            return $scope.cal(0);
                        }
                    }
                    else{
                        var t1 = moment(newInTime);
                        var t2 = moment(newOutTime);
                        var diff = moment.duration(t2.diff(t1)).asMinutes();

                        if(diff >=60){
                            var hh = parseInt(diff / 60);
                            var mm = parseInt(diff - (hh*60));

                            // return hh+ "h : " +mm+ "m";

                            return $scope.cal(hh);
                        }
                        else{
                            var mm = parseInt(diff);
                            // return "0h : "+mm+"m";

                            return $scope.cal(0);
                        }
                    }

                }

                else{
                    return "User not punched out";
                }
            }
            else{
                return "User not punched out";
            }

            // return $scope.diff;
        };
        $scope.cal = function(hour)
        {

            if(hour < 4) {
                return 'Leave';
            }
            else if(hour >= 4 && hour < 8)
            {
                return 'Half Day';
            }
            else if(hour >= 8){
                return 'Full Day';
            }
        }

        /*$scope.formatDate = function(date){
            if(date==undefined || date == '')
                return ('');
            /!* replace is used to ensure cross browser support*!/
            var d = new Date(date.toString().replace("-","/").replace("-","/"));
            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            var dt = d.getDate();
            if(dt<10)
                dt = "0"+dt;
            var dateOut = dt+" - "+monthNames[d.getMonth()]+" - "+(d.getFullYear());
            return dateOut;
        };*/

        $scope.renderMaps_attendance = function(order, flag, i) {

            $scope.selectedOrder = '';
            $scope.maps_users = [];
            $scope.mapOrders = [];
            $scope.mapsOrdersAll = [];
            var gmarkers = [];
            var waypts = [];


            var icons = [];

            icons['Attendance'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';


            $scope.mapsFilter.to.setHours(23, 59, 59, 59);
            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 4;

            $scope.mapsOrdersAll_attendance = order;
            $scope.mapNoLocation = 0;

            if(order){
                if(!flag){

                    if (order.latitude[0] != 0 && order.latitude[0] != "" && order.longitude[0] != 0 && order.longitude[0] != ""
                        && order.latitude[0] != "undefined" && order.longitude[0] != "undefined"
                        && order.latitude[0] != 1 && order.latitude[0] != 2 && order.latitude[0] != 3 && order.latitude[0] !=4
                        && order.longitude[0] != 1 && order.longitude[0] != 2 && order.longitude[0] != 3 && order.longitude[0] != 4) {

                        latlng = new google.maps.LatLng(order.latitude[0], order.longitude[0]);
                        zoomLevel = 14;

                        if (order.itemcode == 'ATD') {
                            order.type = [];
                            order.type[0] = 'Attendance';

                            $scope.mapOrders.push(order);
                            //console.log($scope.mapOrders)
                        }
                        else {
                            $scope.mapOrders.push(order);
                        }

                        reverseGeocode(geocode_address, latlng, 'ATD');

                    }
                    else{
                        $scope.attendance_address = '';
                        $scope.mapNoLocation++;
                    }


                    function addMarker(m,order){

                        var contentString = '<div id="content">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<table>';
                        contentString += '<th colspan="2" class="text-center">Attendance</th>' +
                            '<tr>'+
                            '<tr>' +
                            '<td><strong>Name :</strong>'+order.sellername[0]+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Punch-In: </strong>' + (order.intime[0]?order.intime[0]:'Punch-In Not Done ') + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Date: </strong>' +order.date_added[0] + '</td>' +
                            '</tr>' +
                            '</tr>';


                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: 'Click to zoom',
                            icon : icons[$scope.mapOrders[0].type[0]]
                        });
                        marker.addListener('click', function() {
                            infowindow.open(map, marker);
                            setTimeout(function () { infowindow.close(); }, 5000);
                            $scope.$apply();
                        });
                        gmarkers.push(marker);

                    }

                    var myOptions = {
                        zoom: zoomLevel,
                        center: latlng,
                        scaleControl: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false
                    };

                    var directionsService = new google.maps.DirectionsService;
                    var directionsDisplay = new google.maps.DirectionsRenderer;

                    map = new google.maps.Map(document.getElementById("map_canvas2"), myOptions);

                    directionsDisplay.setMap(map);


                    if((order.latitude[0] != 0 && order.latitude[0] != "" && order.longitude[0] != 0 && order.longitude[0] != ""  && order.latitude[0] != "undefined" && order.longitude[0] != "undefined")){
                        latlng = new google.maps.LatLng(parseFloat($scope.mapOrders[0].latitude[0]), parseFloat($scope.mapOrders[0].longitude[0]));
                        addMarker(i, $scope.mapOrders[0]);
                    }

                    var mcOptions = {gridSize: 6, maxZoom: 20};
                    var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
                    google.maps.event.trigger(map, 'resize');

                    $('a[href="#profile"]').on('shown', function (e) {
                        google.maps.event.trigger(map, 'resize');
                    });
                }
                else{

                    if (order.punch_out_lat[0] != 0 && order.punch_out_lat[0] != "" && order.punch_out_long[0] != 0 && order.punch_out_long[0] != ""
                        && order.punch_out_lat[0] != "undefined" && order.punch_out_long[0] != "undefined"  && order.punch_out_lat[0] && order.punch_out_long[0]
                        && order.punch_out_lat[0] != 1 && order.punch_out_lat[0] != 2 && order.punch_out_lat[0] != 3 && order.punch_out_lat[0] != 4
                        && order.punch_out_long[0] != 1 && order.punch_out_long[0] != 2 && order.punch_out_long[0] != 3 && order.punch_out_long[0] != 4) {

                        latlng = new google.maps.LatLng(order.punch_out_lat[0], order.punch_out_long[0]);
                        zoomLevel = 14;

                        if (order.itemcode == 'ATD') {
                            order.type = [];
                            order.type[0] = 'Attendance';

                            $scope.mapOrders.push(order);
                            //console.log($scope.mapOrders)
                        }
                        else {
                            $scope.mapOrders.push(order);
                        }

                        reverseGeocode(geocode_address, latlng, 'ATD');
                    }
                    else{
                        $scope.mapNoLocation++;
                        $scope.attendance_address = '';
                    }


                    var myOptions = {
                        zoom: zoomLevel,
                        center: latlng,
                        scaleControl: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var directionsService = new google.maps.DirectionsService;
                    var directionsDisplay = new google.maps.DirectionsRenderer;

                    map = new google.maps.Map(document.getElementById("map_canvas2"), myOptions);

                    directionsDisplay.setMap(map);

                    function addMarker(m,order){

                        var contentString = '<div id="content">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<table>';
                        contentString += '<th colspan="2" class="text-center">Attendance</th>' +
                            '<tr>'+
                            '<tr>' +
                            '<td><strong>Name :</strong>'+order.sellername[0]+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Punch-Out: </strong>' + (order.outtime[0]?order.outtime[0]:'Punch-Out Not Done ') + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><strong>Date: </strong>' +order.date_added[0] + '</td>' +
                            '</tr>' +
                            '</tr>';


                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: 'Click to zoom',
                            icon : icons[$scope.mapOrders[0].type[0]]
                        });
                        marker.addListener('click', function() {
                            //map.setZoom(8);
                            //map.setCenter(marker.getPosition());
                            infowindow.open(map, marker);
                            setTimeout(function () { infowindow.close(); }, 5000);
                            $scope.selectedOrder=$scope.mapOrders[m];
                            $scope.renderMapsOrderDetails();
                            //console.log($scope.mapOrders[m])
                            $scope.$apply();
                        });
                        gmarkers.push(marker);

                    }

                    if (order.punch_out_lat[0] != 0 && order.punch_out_lat[0] != "" && order.punch_out_long[0] != 0 && order.punch_out_long[0] != ""  && order.punch_out_lat[0] != "undefined" && order.punch_out_long[0] != "undefined"  && order.punch_out_lat[0] && order.punch_out_long[0]) {
                        latlng = new google.maps.LatLng(parseFloat($scope.mapOrders[0].punch_out_lat[0]), parseFloat($scope.mapOrders[0].punch_out_long[0]));
                        addMarker(i, $scope.mapOrders[0]);
                    }


                    var mcOptions = {gridSize: 6, maxZoom: 20};
                    var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
                    google.maps.event.trigger(map, 'resize');

                    $('a[href="#profile"]').on('shown', function (e) {
                        google.maps.event.trigger(map, 'resize');
                    });
                }
            }
        };

        $scope.downloadCSV = function(){
            startLoader();
            var request_object = {
                url : "/dash/reports/attendance/count",
                method : "POST",
                timeout : api_timeout,
                data : attSearchObj
            };

            $http(request_object)
                .then((count) => {
                console.log(count);
            if(!count.data){
                Settings.failurePopup(
                    'WARNING',
                    'No records to download. Choose different filter'
                )
                stopLoader();
            }
            else if(count.data > 3000){
                Settings.failurePopup(
                    'WARNING',
                    'Please select a smaller date range.\nCurrent records : ' + count.data + ' - Max. records : 3000'
                )
                stopLoader();
            }
            else {

                console.log(attSearchObj);
                attSearchObj.viewLength = 0;
                attSearchObj.viewBy = count.data;

                var request_object = {
                    url : "/dash/reports/attendance",
                    method : "POST",
                    timeout : api_timeout,
                    data : attSearchObj
                };

                $http(request_object)
                    .then((result) => {
                    let _data = result.data;
                console.log(result.data);
                var output = 'id,Attendance ID,Date,Number,Name,Punch-In Time,Punch-Out Time,Punch_In_Latitude,Punch_In_Longitude,Punch_Out_Latitude,Duration,Status,Punch_Out_Longitude';
                output += '\n'
                for (var i = 0; i < _data.length; i++) {
                    output += i + 1;
                    output += ',';

                    output += _data[i].orderId;
                    output += ',';


                    function formatdate(date) {
                        if (!date)
                            return ('');
                        /* replace is used to ensure cross browser support*/
                        var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        var dt = d.getDate();
                        if (dt < 10)
                            dt = "0" + dt;
                        return (dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear()));
                    }
                    // console.log(dateformat);
                    // var punchin =output.replace('date','Punch-In Date')
                    output += formatdate(_data[i].date_added);
                    output += ',';

                    if (_data[i].seller)
                        output += _data[i].seller;
                    output += ',';

                    try {
                        if (_data[i].sellername) {
                            if ((_data[i].sellername).toString().indexOf(',') != -1) {
                                var quotesWrapped = '"' + _data[i].sellername + '"';
                                _data[i].sellername = quotesWrapped
                            }
                        }
                        output += _data[i].sellername;
                    } catch (e) {
                    }
                    output += ',';


                    if (_data[i].intime)
                        output += _data[i].intime;
                    output += ',';


                    if (_data[i].outtime)
                        output += _data[i].outtime;
                    output += ',';


                    if (_data[i].latitude && _data[i].latitude != 'undefined')
                        output += _data[i].latitude;
                    output += ',';

                    if (_data[i].longitude && _data[i].longitude != 'undefined')
                        output += _data[i].longitude;
                    output += ',';

                    if (_data[i].punch_out_lat && _data[i].punch_out_lat != 'undefined')
                        output += _data[i].punch_out_lat;
                    output += ',';

                    if(_data[i].intime && _data[i].outtime)
                    {
                        output += $scope.calculateDuration(_data[i].intime,_data[i].outtime);
                        output += ',';
                    }

                    if(_data[i].intime && _data[i].outtime)
                    {
                        output += $scope.calculateDiff(_data[i].intime,_data[i].outtime);
                        output += ',';
                    }

                    if (_data[i].punch_out_long && _data[i].punch_out_long != 'undefined')
                        output += _data[i].punch_out_long;
                    output += '\n';

                }

                var blob = new Blob([output], {type : "text/csv;charset=UTF-8"});
                console.log(blob);
                window.URL = window.webkitURL || window.URL;
                var url = window.URL.createObjectURL(blob);

                var d = new Date();
                var anchor = angular.element('<a/>');

                anchor.attr({
                    href: url,
                    target: '_blank',
                    download: 'Mbj_' + instanceDetails.api_key + '_Attendance_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    //download: 'Mbj_' + '_Attendance_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                })[0].click();

                stopLoader();
            })
            .catch((error, status) => {
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
        .catch((error, status) => {
                console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });
        };

        $scope.changeReportView(localViewBy);
    })
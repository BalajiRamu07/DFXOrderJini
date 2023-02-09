angular.module('ebs.controller')

    .controller("EmployeeReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Employee Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Emplyoee";

        $scope.reportTabId = 13;
        $scope.tab = 8;
        $scope.showReports = true;
        $scope.emp_count = 0;

        let localViewBy = $scope.newViewBy;
        let initialViewBy = 60;
        let instanceDetails =  Settings.getInstance();
        const api_timeout = 600000;
        $scope.checkInEmployeeTime = [];
        $scope.enquiryReportFilter = {};
        //.... Reports Filter.....
        $scope.cinemployeereport = {};

        //.... Set Filter Dates to last 7 days....
        $scope.cinemployeereport.startDate = new Date();
        $scope.cinemployeereport.startDate.setDate($scope.cinemployeereport.startDate.getDate() - 7);
        $scope.cinemployeereport.startDate.setHours(0, 0, 0, 0);
        $scope.cinemployeereport.endDate = new Date();
        $scope.cinemployeereport.endDate.setHours(23, 59, 59, 59);

        let employeeSearchObj = {};
        let employeeSearchBy = ['sellername'];

        $scope.topEnquiryDuration = Settings.daysDifference($scope.enquiryReportFilter.startDate , $scope.enquiryReportFilter.endDate);
        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

        $scope.openFilterClear = () => {
            $scope.cinemployeereport.startDate = '';
            $scope.cinemployeereport.endDate = '';

            $scope.cinemployeereport.startDate = new Date();
            $scope.cinemployeereport.startDate.setDate($scope.cinemployeereport.startDate.getDate() - 7);
            $scope.cinemployeereport.startDate.setHours(0, 0, 0, 0);
            $scope.cinemployeereport.endDate = new Date();
            $scope.cinemployeereport.endDate.setHours(23, 59, 59, 59);
        }
        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        const loadReport = (employeeSearchObj) => {
            $http.post("/dash/reports/employee",employeeSearchObj)
                .success(function(response){

                    for(var i=0; i<response.length; i++){
                        $scope.checkInEmployeeTime.push(response[i]);
                    }
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
        const loadReportCount = (employeeSearchObj) => {
            $http.post("/dash/reports/employee/count", employeeSearchObj)
                .success(function (res) {
                    $scope.reportsTransactionCount(res);
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
                // console.log("NEXT");

                if(viewLength + viewBy >= $scope.checkInEmployeeTime.length){
                    if(viewLength + viewBy < $scope.emp_count){
                        $scope.displayloader = true
                        viewLength += viewBy;
                        //console.log("Fetch more")


                        employeeSearchObj.viewLength = viewLength;

                        if($scope.newViewBy > initialViewBy ){
                            employeeSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            employeeSearchObj.viewBy = initialViewBy;
                        }
                        employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
                        employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
                        employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                        employeeSearchObj.searchBy = employeeSearchBy;

                        startLoader();
                        loadReport(employeeSearchObj);

                        if(viewLength + viewBy > $scope.emp_count){
                            a = viewLength + viewBy - $scope.emp_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                        $scope.displayloader = false;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.emp_count){
                            a = viewLength + viewBy - $scope.emp_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.emp_count){
                        a = viewLength + viewBy - $scope.emp_count;
                        viewBy -= a;
                        if(viewLength + viewBy > $scope.checkInEmployeeTime.length){
                            employeeSearchObj.viewLength = $scope.checkInEmployeeTime.length;
                            employeeSearchObj.viewBy = viewLength + viewBy - $scope.checkInEmployeeTime.length;
                            employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
                            employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
                            employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                            employeeSearchObj.searchBy = employeeSearchBy;

                            startLoader();
                            loadReport(employeeSearchObj);

                        }
                    }else{
                        if(viewLength + viewBy > $scope.checkInEmployeeTime.length){
                            employeeSearchObj.viewLength = $scope.checkInEmployeeTime.length;
                            employeeSearchObj.viewBy = viewLength + viewBy - $scope.checkInEmployeeTime.length;
                            employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
                            employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
                            employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                            employeeSearchObj.searchBy = employeeSearchBy;

                            startLoader();
                            loadReport(employeeSearchObj);

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
                    if(viewLength + viewBy >= $scope.emp_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.changeReportView = (newViewBy) =>{
            startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);
            if($scope.cinemployeereport.startDate && $scope.cinemployeereport.endDate){
                if (($scope.cinemployeereport.startDate - $scope.cinemployeereport.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.cinemployeereport.startDate = new Date();
                    $scope.cinemployeereport.startDate.setDate($scope.cinemployeereport.startDate.getDate() - 7);
                    $scope.cinemployeereport.startDate.setHours(0, 0, 0, 0);
                    $scope.cinemployeereport.endDate = new Date();
                    $scope.cinemployeereport.endDate.setHours(23, 59, 59, 59);
                }
            }


            employeeSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                employeeSearchObj.viewBy = $scope.newViewBy;
            }else{
                employeeSearchObj.viewBy = initialViewBy;
            }
            employeeSearchObj.sDate = $scope.DateTimeFormat($scope.cinemployeereport.startDate, 'start');
            employeeSearchObj.eDate = $scope.DateTimeFormat($scope.cinemployeereport.endDate, 'end');
            employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
            employeeSearchObj.searchBy = employeeSearchBy;

            $scope.viewLength = 0;
            $scope.checkInEmployeeTime = [];
            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }

            startLoader();
            loadReport(employeeSearchObj);
            loadReportCount(employeeSearchObj);
        }
        $scope.reportsTransactionCount = (response) => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.emp_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.emp_count = response;
                    $scope.newViewBy = response;

                }
                else{
                    $scope.checkInEmployeeTime = [];
                    $scope.newViewBy = 1;
                    $scope.emp_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.checkInEmployeeTime = [];
                $scope.newViewBy = 1;
                $scope.emp_count = 0;
                $scope.viewLength = -1;
            }
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

                    $scope.topEnquiryDuration = numberOfDays;
                }
            }else
                $scope.topEnquiryDuration = 0;
        }
        $scope.getTimeFromDate = function(date){
            if(date){
                var t = date.split(" ");
                var time = t[1].split(":");

                if(time[0] <= 11){
                    return time[0]+":"+time[1]+" AM";
                }
                else if(time[0] == 12){
                    return time[0]+":"+time[1]+" PM";
                }
                else{
                    return (time[0] - 12)+":"+time[1]+" PM";
                }
            }
            else{
                return 'N/A';
            }
        };
        /*$scope.calculateDuration = Settings.calculateDuration(inTime, outTime);*/
        $scope.calculateDuration = function(inTime, outTime){
            var intime, outtime;

            if(inTime.isArray && outTime.isArray) {
                intime = inTime[0];
                outtime = outTime[0];
            } else {
                intime = inTime;
                outtime = outTime;
            }

            if(intime != null && outtime != null){
                //.... Out Time is available....
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

        $scope.clearFilter = () => {
            employeeSearchObj.viewLength = 0;
            employeeSearchObj.viewBy = initialViewBy;

            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.cinemployeereport.filter){
                employeeSearchObj.searchFor = $scope.cinemployeereport.filter;
                employeeSearchObj.searchBy = employeeSearchBy;
            }

            $scope.checkInEmployeeTime = [];

            $scope.showEmpFilter = true;

            if($scope.cinemployeereport.filter == '')
                $scope.showEmpFilter = false;

            $scope.changeReportView();
        }

        $scope.renderCheckinMap = function(order){
            var gmarkers = [];
            $scope.checkinIcons['startVisit'] = 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png';
            $scope.checkinIcons['endVisit'] = 'https://maps.google.com/mapfiles/ms/micons/red-dot.png';
            $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
            $scope.checkinMapLocation = {};
            $scope.checkinMapLocation.dealer = "Not Available";
            $scope.checkinMapLocation.sVisit = "Not Available";
            $scope.checkinMapLocation.eVisit = "Not Available";
            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 4;
            var latlngList = [];

            var myOptions = {
                zoom: zoomLevel,
                center: latlng,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            };
            map = new google.maps.Map(document.getElementById("map_checkin"), myOptions);

            function addMarker(latlng, id){

                if(id == 0){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['startVisit']
                    });
                    reverseGeocode(geocode_address, latlng, 'startVisit');
                }
                else if(id == 1){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['Customer']
                    });
                    reverseGeocode(geocode_address, latlng, 'customer');
                }
                else if(id == 2){
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: 'Click to zoom',
                        icon : $scope.checkinIcons['endVisit']
                    });
                    reverseGeocode(geocode_address, latlng, 'endVisit');
                }


                gmarkers.push(marker);

            }

            if(order.latitude[0] && order.longitude[0] && order.latitude[0] != 1 && order.latitude[0] != 2 &&
                order.latitude[0] != 3 && order.latitude[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0])))
                addMarker(latlng, 0);
            }
            if(order.exitLat[0] && order.exitLong[0] && order.exitLat[0] !=1 && order.exitLat[0] !=2 &&
                order.exitLat[0] != 3 && order.exitLat[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.exitLat[0]), parseFloat(order.exitLong[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.exitLat[0]), parseFloat(order.exitLong[0])))
                addMarker(latlng, 2);
            }

            if(order.storeLat[0] && order.storeLong[0]){
                var slatlng = new google.maps.LatLng(parseFloat(order.storeLat[0]), parseFloat(order.storeLong[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.storeLat[0]), parseFloat(order.storeLong[0])))
                addMarker(slatlng, 1);
            }


            //Set zoom based on the location latlongs
            if(latlngList.length > 0){
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < latlngList.length; i++) {
                    bounds.extend(latlngList[i]);
                }

                map.setCenter(bounds.getCenter()); //or use custom center
                map.fitBounds(bounds);
            }

            var mcOptions = {gridSize: 6, maxZoom: 20};
            var markerCluster = new MarkerClusterer(map, gmarkers, mcOptions); //clusters the nearby points
            google.maps.event.trigger(map, 'resize');

            $('a[href="#profile"]').on('shown', function (e) {
                google.maps.event.trigger(map, 'resize');
            });
        };

        $scope.downloadCSV = function(){
            startLoader();
            var request_object = {
                url : "/dash/reports/employee/count",
                method : "POST",
                timeout : api_timeout,
                data : employeeSearchObj
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

                console.log(employeeSearchObj);
                employeeSearchObj.viewLength = 0;
                employeeSearchObj.viewBy = count.data;

                var request_object = {
                    url : "/dash/reports/employee",
                    method : "POST",
                    timeout : api_timeout,
                    data : employeeSearchObj
                };

                $http(request_object)
                    .then((result) => {
                    let _data = result.data;
                console.log(result.data);
                var output = 'Date, Salesperson, First Check In, Check In Time, Last Check Out, Check In Time, Duration\n';
                
                for (var i = 0; i < _data.length; i++) {
                    // output += i + 1;
                    // output += ',';


                    function formatdate(date) {
                        if (!date)
                            return ('');
                        /* replace is used to ensure cross browser support*/
                        var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        var dt = d.getDate();
                        if (dt < 10)
                            dt = "0" + dt;
                        var dateOut = dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear());
                        return dateOut;
                    }

                    output += formatdate(_data[i].date_added[0]);
                    output += ',';

                    output += _data[i].sellername[0];
                    output += ',';

                    try {
                        if (_data[i].dealer && _data[i].dealer[0]) {
                            if ((_data[i].dealer[0]).toString().indexOf(',') != -1) {
                                var quotesWrapped = '"' + _data[i].dealer[0] + '"';
                                _data[i].dealer[0] = quotesWrapped
                            }
                            output += _data[i].dealer[0];
                        }
                    } catch (e) {
                    }
                    output += ',';

                    function formattime(date) {
                        if (date == undefined || date == '')
                            return ('');
                        var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                        var dt = d.getDate();
                        if (dt < 10)
                            dt = "0" + dt;
                        //var datetime = (d.getHours()) + ":" + (d.getMinutes());
                        var datetime = (d.getHours() < 10 ? ('0' + (d.getHours())) : d.getHours()) + ":" + (d.getMinutes() < 10 ? ('0' + (d.getMinutes())) : d.getMinutes());
                        //console.log('Returning minutes string',(d.getMinutes() < 10 ? ('0' + (d.getMinutes())) : d.getMinutes()), d.getMinutes().toString());
                        //console.log('Returning datetime like here', datetime);
                        return datetime;
                    }

                    output += formattime(_data[i].firstDate);
                    output += ',';

                    try {
                        if (_data[i].dealer && _data[i].dealer[_data[i].dealer.length - 1]) {
                            if ((_data[i].dealer[_data[i].dealer.length - 1]).toString().indexOf(',') != -1) {
                                var quotesWrapped = '"' + _data[i].dealer[_data[i].dealer.length - 1] + '"';
                                _data[i].dealer[_data[i].dealer.length - 1] = quotesWrapped
                            }
                            output += _data[i].dealer[_data[i].dealer.length - 1];
                        }
                    } catch (e) {
                    }
                    output += ',';

                    output += formattime(_data[i].lastDate);
                    output += ',';

                    function calculateDuration(inTime, outTime) {
                        var intime, outtime;

                        if (inTime.isArray && outTime.isArray) {
                            intime = inTime[0];
                            outtime = outTime[0];
                        }
                        else {
                            intime = inTime;
                            outtime = outTime;
                        }

                        if (intime != null && outtime != null) {
                            if (outtime != '') {

                                var newInTime = new Date(intime);
                                var newOutTime = new Date(outtime);

                                if (newInTime == 'Invalid Date' && newOutTime == 'Invalid Date') {
                                    var t1 = intime.split(':');
                                    var t2 = outtime.split(':');

                                    var hh1 = parseInt(t1[0]);
                                    var hh2 = parseInt(t2[0]);
                                    var mm1 = parseInt(t1[1]);
                                    var mm2 = parseInt(t2[1]);

                                    var h1 = hh1 * 60;
                                    var h2 = hh2 * 60;

                                    var diff = (h2 + mm2) - (h1 + mm1);

                                    if (diff >= 60) {
                                        var hh = parseInt(diff / 60);
                                        var mm = parseInt(diff - (hh * 60));

                                        return hh + "h : " + mm + "m";
                                    }
                                    else {
                                        var mm = parseInt(diff);
                                        return "0h : " + mm + "m";
                                    }
                                }
                                else {
                                    var t1 = moment(newInTime);
                                    var t2 = moment(newOutTime);
                                    var diff = moment.duration(t2.diff(t1)).asMinutes();

                                    if (diff >= 60) {
                                        var hh = parseInt(diff / 60);
                                        var mm = parseInt(diff - (hh * 60));

                                        return hh + "h : " + mm + "m";
                                    }
                                    else {
                                        var mm = parseInt(diff);
                                        return "0h : " + mm + "m";
                                    }
                                }

                            }

                            else {
                                return "Not punched out";
                            }
                        }
                    }

                    if (_data[i] && _data[i].lastDate && _data[i].firstDate) {
                        var dateformat = calculateDuration(_data[i].firstDate, _data[i].lastDate);
                        output += dateformat;
                    }
                    if(_data[i] && !_data[i].lastDate && _data[i].firstDate){
                        // output += '0h:0m';
                        var dateformat = calculateDuration(_data[i].firstDate, _data[i].lastDate);
                        output += dateformat;
                    }
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
                    download: 'Mbj_' + instanceDetails.api_key + '_Employee_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    //download: 'Mbj_' + '_Payments_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
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
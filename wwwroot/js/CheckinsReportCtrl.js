angular.module('ebs.controller')

    .controller("CheckinsReportCtrl", function ($scope, $http, Settings, $window) {
        console.log("Hello From Checkins Report Controller .... !!!!");

        //.... User details....
        $scope.user = {};

        //..... Pagination.....
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        //.... Other View Values....
        $scope.newViewBy1 = {};
        $scope.newViewBy1.view = 10;

        $scope.reportTabName = "Check-ins";

        $scope.reportTabId = 6;
        $scope.tab = 8;
        $scope.showReports = true;

        $scope.checkin_count = 0;
        const api_timeout = 600000;

        let localViewBy = $scope.newViewBy;

        let initialViewBy = 60;
        let instanceDetails =  Settings.getInstance();
        $scope.cinreport = {};
        
        //... Last 7 Days Filter.....
        $scope.cinreport.startDate = new Date();
        $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
        $scope.cinreport.startDate.setHours(0, 0, 0, 0);
        $scope.cinreport.endDate = new Date();
        $scope.cinreport.endDate.setHours(23, 59, 59, 59);

        $scope.checkInReportSearch = {};
        $scope.checkInReportSearch.filter = '';

        const fetchCustomerType = () => {
            $http.get("/dash/settings/details/customerCategory")
                .then(category => {
                if(category.data){
                $scope.customercategory = category.data.obj;
            }
        })
        .catch((error, status) => {
                console.log(error, status);
            if(status){
                if(status >= 400 && status < 404)
                    $window.location.href = '/404';
                else if(status >= 500)
                    $window.location.href = '/500';
            }else if(error.status){
                if(error.status >= 400 && error.status < 404)
                    $window.location.href = '/404';
                else if(error.status >= 500)
                    $window.location.href = '/500';
            }
            else
                $window.location.href = '/404';
        });
        }

        fetchCustomerType();

        //Checkin Map Icons
        $scope.checkinIcons = [];
        $scope.checkinIcons['startVisit'] = 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png';
        $scope.checkinIcons['endVisit'] = 'https://maps.google.com/mapfiles/ms/micons/red-dot.png';
        $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
        $scope.checkinIcons['pjp'] = 'https://maps.google.com/mapfiles/ms/micons/green-dot.png';

        let checkinDealerSearchBy = ['dealername','sellername'];

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }
        let checkinSearchObj = {};
        $scope.checkInreport = {};

        $scope.checkinDuration = Settings.daysDifference($scope.cinreport.startDate , $scope.cinreport.endDate);
        $scope.parseData = (viewLength, newViewBy) => parseInt(viewLength) + parseInt(newViewBy);
        $scope.DateTimeFormat = (date, when) => Settings.dateFilterFormat(date, when);

        $http.get("/dash/role/sellers/Salesperson")
            .success(function (salesperson) {
                //console.log("Salesperson : ", salesperson);
                if(salesperson && salesperson.length){
                    console.log('This is list of sales person', salesperson);
                    $scope.roleSalesrep = [];
                    for(var i = 0; i < salesperson.length; i++){
                        if(salesperson[i] && salesperson[i].userStatus == 'Active')
                        $scope.roleSalesrep.push({sellername : salesperson[i].sellername, sellerphone : salesperson[i].sellerphone});
                    }
                }
            }).error(function(error, status){
            console.log(error, status);
            if(status >= 400 && status < 404)
                $window.location.href = '/404';
            else if(status >= 500)
                $window.location.href = '/500';
            else
                $window.location.href = '/404';
        });

        $scope.openFilterClear = () => {
            $scope.cinreport.startDate = '';
            $scope.cinreport.endDate = '';
            $scope.cinreport.seller = '';
            $scope.cinreport.customerType = '';
            $scope.cinreport.customercategory = '';

            $scope.cinreport.startDate = new Date();
            $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
            $scope.cinreport.startDate.setHours(0, 0, 0, 0);
            $scope.cinreport.endDate = new Date();
            $scope.cinreport.endDate.setHours(23, 59, 59, 59);
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

        const loadReport = (checkinSearchObj) => {
            $http.post("/dash/reports/checkins", checkinSearchObj)
                .success(function(response){

                    for(let i = 0; i < response.length; i++){
                        $scope.checkInreport.push(response[i]);
                    }

                    for(let i = 0; i < $scope.checkInreport.length; i++){
                        if($scope.checkInreport[i].storeLat[0] && $scope.checkInreport[i].storeLong[0]) {
                            $scope.checkInreport[i].customerLocation = true;
                            var slatlng = new google.maps.LatLng($scope.checkInreport[i].storeLat[0], $scope.checkInreport[i].storeLong[0]);
                            var startLatLong;
                            var endLatLong;
                            //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                            if ($scope.checkInreport[i].latitude && $scope.checkInreport[i].longitude) {
                                if ($scope.checkInreport[i].latitude[0] && $scope.checkInreport[i].longitude[0]
                                    && $scope.checkInreport[i].latitude[0] != 1 && $scope.checkInreport[i].longitude[0] != 1
                                    && $scope.checkInreport[i].latitude[0] != 2 && $scope.checkInreport[i].longitude[0] != 2
                                    && $scope.checkInreport[i].latitude[0] != 3 && $scope.checkInreport[i].longitude[0] != 3
                                    && $scope.checkInreport[i].latitude[0] != 4 && $scope.checkInreport[i].longitude[0] != 4) {
                                    startLatLong = new google.maps.LatLng($scope.checkInreport[i].latitude[0], $scope.checkInreport[i].longitude[0]);
                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                    $scope.checkInreport[i].sVisitDist = parseFloat(dist / 1000).toFixed(2) + "KM from " + $scope.nav[2].tab;
                                    $scope.checkInreport[i].startVisitLocation = true;
                                }
                            }
                            else {
                                $scope.checkInreport[i].startVisitLocation = false;
                                if ($scope.checkInreport[i].latitude){
                                    $scope.checkInreport[i].sVisitDist =
                                        ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                            ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                }
                            }

                            if($scope.checkInreport[i].exitLat[0] && $scope.checkInreport[i].exitLong[0]
                                && $scope.checkInreport[i].exitLat[0] != 1 && $scope.checkInreport[i].exitLong != 1
                                && $scope.checkInreport[i].exitLat[0] != 2 && $scope.checkInreport[i].exitLong != 2
                                && $scope.checkInreport[i].exitLat[0] != 3 && $scope.checkInreport[i].exitLong != 3
                                && $scope.checkInreport[i].exitLat[0] != 4 && $scope.checkInreport[i].exitLong != 4){

                                endLatLong = new google.maps.LatLng($scope.checkInreport[i].exitLat[0], $scope.checkInreport[i].exitLong[0]);
                                var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                $scope.checkInreport[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                $scope.checkInreport[i].endVisitLocation = true;
                            }
                            else{
                                $scope.checkInreport[i].eVisitDist =
                                    ($scope.checkInreport[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                        ($scope.checkInreport[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                            (($scope.checkInreport[i].exitLong[0] == 3 || $scope.checkInreport[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                $scope.checkInreport[i].endVisitLocation = false;
                            }
                        }
                        else {
                            $scope.checkInreport[i].customerLocation = false;
                            if($scope.checkInreport[i].latitude){
                                if ($scope.checkInreport[i].latitude[0] == 1 ||
                                    $scope.checkInreport[i].latitude[0] == 2 ||
                                    $scope.checkInreport[i].latitude[0] == 3 ||
                                    $scope.checkInreport[i].latitude[0] == 4) {
                                    $scope.checkInreport[i].startVisitLocation = false;
                                    $scope.checkInreport[i].sVisitDist =
                                        ($scope.checkInreport[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                            ($scope.checkInreport[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                (($scope.checkInreport[i].latitude[0] == 3 || $scope.checkInreport[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                }
                            }
                            else{
                                $scope.checkInreport[i].startVisitLocation = true;
                            }
                            if($scope.checkInreport[i].exitLat[0] == 1 ||
                                $scope.checkInreport[i].exitLat[0] == 2 ||
                                $scope.checkInreport[i].exitLat[0] == 3 ||
                                $scope.checkInreport[i].exitLat[0] == 4){
                                $scope.checkInreport[i].endVisitLocation = false;
                                $scope.checkInreport[i].eVisitDist = ($scope.checkInreport[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                    ($scope.checkInreport[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                        (($scope.checkInreport[i].exitLat[0] == 3 || $scope.checkInreport[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                            }
                            else{

                                if($scope.checkInreport[i].exitLat[0])
                                    $scope.checkInreport[i].endVisitLocation = true;
                                else{ // Check if null?? if yes, it means that the user has not ended visit
                                    $scope.checkInreport[i].endVisitLocation = false;
                                    $scope.checkInreport[i].eVisitDist = 'Not Ended';
                                }

                            }

                        }
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

        const loadReportCount = (checkinSearchObj) => {
            $http.post("/dash/reports/checkin/count", checkinSearchObj)
                .success($scope.reportsTransactionCount)
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

        //... Pagination for all reports
        $scope.navPage =  function(direction, newViewBy){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;


            if(direction){
                // console.log("NEXT");
                if(viewLength + viewBy >= $scope.checkInreport.length){

                    if(viewLength + viewBy < $scope.checkin_count){
                        viewLength += viewBy;
                        // console.log("Fetch more")
                        checkinSearchObj.viewLength = viewLength;
                        if($scope.newViewBy > initialViewBy ){
                            checkinSearchObj.viewBy = $scope.newViewBy;
                        }else{
                            checkinSearchObj.viewBy = initialViewBy;
                        }
                        checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                        checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                        checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                        checkinSearchObj.searchBy = checkinDealerSearchBy;

                        startLoader();
                        loadReport(checkinSearchObj);
                        if(viewLength + viewBy > $scope.checkin_count){
                            a = viewLength + viewBy - $scope.checkin_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        // console.log("Out of data")
                        if(viewLength + viewBy > $scope.checkin_count){
                            a = viewLength + viewBy - $scope.checkin_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.checkin_count){
                        a = viewLength + viewBy - $scope.checkin_count;
                        viewBy -= a;

                        if(viewLength + viewBy > $scope.checkInreport.length){
                            checkinSearchObj.viewLength = $scope.checkInreport.length; //.... 60
                            checkinSearchObj.viewBy = viewLength + viewBy - $scope.checkInreport.length; //.... 20
                            checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                            checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                            checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                            checkinSearchObj.searchBy = checkinDealerSearchBy;

                            startLoader();
                            loadReport(checkinSearchObj);
                        }
                    }else{
                        if(viewLength + viewBy > $scope.checkInreport.length){
                            checkinSearchObj.viewLength = $scope.checkInreport.length; //.... 60
                            checkinSearchObj.viewBy = viewLength + viewBy - $scope.checkInreport.length; //.... 20
                            checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                            checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                            checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                            checkinSearchObj.searchBy = checkinDealerSearchBy;

                            startLoader();
                            loadReport(checkinSearchObj);
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
                    if(viewLength + viewBy >= $scope.checkin_count){
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
            startLoader();
            $scope.newViewBy1.view = newViewBy || 10;
            $scope.newViewBy = parseInt(newViewBy || 10);
            //$scope.reportTabName = "Check Ins";

            if($scope.cinreport.startDate && $scope.cinreport.endDate){
                if (($scope.cinreport.startDate - $scope.cinreport.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.cinreport.startDate = new Date();
                    $scope.cinreport.startDate.setDate($scope.cinreport.startDate.getDate() - 7);
                    $scope.cinreport.startDate.setHours(0, 0, 0, 0);
                    $scope.cinreport.endDate = new Date();
                    $scope.cinreport.endDate.setHours(23, 59, 59, 59);

                }
            }
            checkinSearchObj.seller = ''
            if($scope.cinreport.seller)
                checkinSearchObj.seller = $scope.cinreport.seller ;



            checkinSearchObj.viewLength = 0;
            if($scope.newViewBy > initialViewBy ){
                checkinSearchObj.viewBy = $scope.newViewBy;
            }else{
                checkinSearchObj.viewBy = initialViewBy;
            }
            checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
            checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
            checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
            checkinSearchObj.searchBy = checkinDealerSearchBy;

            $scope.checkInreport = [];
            $scope.viewLength = 0;

            if(!newViewBy){
                $scope.newViewBy = parseInt(localViewBy);
            }
            checkinSearchObj.customerType = '';
            if($scope.cinreport.customerType){
                checkinSearchObj.customerType = $scope.cinreport.customerType;
            }
            checkinSearchObj.customercategory = '';
            if($scope.cinreport.customercategory){
                checkinSearchObj.customercategory = $scope.cinreport.customercategory;
            }
            startLoader();
            loadReport(checkinSearchObj);

            loadReportCount(checkinSearchObj);
        }

        $scope.reportsTransactionCount = (response) => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.checkin_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.checkin_count = response;
                    $scope.newViewBy = response;

                }
                else{
                    $scope.checkInreport = [];
                    $scope.newViewBy = 1;
                    $scope.checkin_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.checkInreport = [];
                $scope.newViewBy = 1;
                $scope.checkin_count = 0;
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

                    $scope.checkinDuration = numberOfDays;
                }
            }else
                $scope.checkinDuration = 0;
        }

        // $scope.CheckInPrevDistanceCal = function (seller, dateRange){
        //     // console.log('seller ', seller, $scope.checkInreport);
        //     $scope.sellerCheckinOneDayRecords = [];
        //     $scope.sellerCheckinOneDayRecords = $scope.checkInreport.filter(check=> {
        //         return check.seller[0] == seller[0]
        //     })
        //
        //     // console.log('$scope.sellerCheckinOneDayRecords',$scope.sellerCheckinOneDayRecords);
        //     $scope.checkInTotalDist = 0;
        //     $scope.sellerCheckinOneDayRecords.map(c => {
        //         if(c.distance_prev.length)
        //         $scope.checkInTotalDist +=  Number(c.distance_prev[0]);
        //         // $scope.checkInTotalDist;
        //     })
        //
        //
        // }

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

            if(order.latitude && order.latitude[0] && order.longitude[0] && order.latitude[0] != 1 && order.latitude[0] != 2 &&
                order.latitude[0] != 3 && order.latitude[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.latitude[0]), parseFloat(order.longitude[0])))
                addMarker(latlng, 0);
            }
            if(order.exitLat && order.exitLat[0] && order.exitLong[0] && order.exitLat[0] !=1 && order.exitLat[0] !=2 &&
                order.exitLat[0] != 3 && order.exitLat[0] != 4){
                latlng = new google.maps.LatLng(parseFloat(order.exitLat[0]), parseFloat(order.exitLong[0]));
                latlngList.push(new google.maps.LatLng(parseFloat(order.exitLat[0]), parseFloat(order.exitLong[0])))
                addMarker(latlng, 2);
            }

            if(order.storeLat && order.storeLat[0] && order.storeLong[0]){
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
        }

        $scope.downloadCSV = function(tab){
            switch(tab){

                case 1:
                    checkinSearchObj.seller = ''
                    if($scope.cinreport.seller)
                        checkinSearchObj.seller = $scope.cinreport.seller ;

                    checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                    checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                    checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                    checkinSearchObj.searchBy = checkinDealerSearchBy;

                    checkinSearchObj.customerType = '';
                    if($scope.cinreport.customerType){
                        checkinSearchObj.customerType = $scope.cinreport.customerType;
                    }

                    checkinSearchObj.customercategory = '';
                    if($scope.cinreport.customercategory){
                        checkinSearchObj.customercategory = $scope.cinreport.customercategory;
                    }

                    var request_object = {
                        url : "/dash/reports/checkin/count",
                        method : "POST",
                        timeout : api_timeout,
                        data : checkinSearchObj
                    };

                    $http(request_object)
                        .success(function(response){

                            if(response > 6000){
                                Settings.failurePopup(
                                    'WARNING',
                                    'Please select a smaller date range.\nCurrent records : ' + response + ' - Max. records : 6000'
                                )

                            }
                            else {
                                checkinSearchObj.seller = ''
                                if($scope.cinreport.seller)
                                    checkinSearchObj.seller = $scope.cinreport.seller ;

                                checkinSearchObj.sDate = $scope.DateTimeFormat($scope.cinreport.startDate, 'start');
                                checkinSearchObj.eDate = $scope.DateTimeFormat($scope.cinreport.endDate, 'end');
                                checkinSearchObj.searchFor = $scope.checkInReportSearch.filter;
                                checkinSearchObj.searchBy = checkinDealerSearchBy;
                                checkinSearchObj.viewBy = 6000;

                                checkinSearchObj.customerType = '';
                                if($scope.cinreport.customerType){
                                    checkinSearchObj.customerType = $scope.cinreport.customerType;
                                }

                                checkinSearchObj.customercategory = '';
                                if($scope.cinreport.customercategory){
                                    checkinSearchObj.customercategory = $scope.cinreport.customercategory;
                                }
                                jQuery.noConflict();
                                $('.refresh').css("display", "inline");

                                // var request_object = {
                                //     url : "/dash/csv/checkins/download",
                                //     method : "POST",
                                //     timeout : api_timeout,
                                //     data : checkinSearchObj
                                // };

                                // using chekin view api to get data
                                var request_object = {
                                    url : "/dash/reports/checkins",
                                    method : "POST",
                                    timeout : api_timeout,
                                    data : checkinSearchObj
                                };

                                $http(request_object)
                                    .success(function(result){
                                        var output = 'id,Check-In ID,Date_added,Time,Dealercode,Dealername,Dealerphone,Salesperson No.,Salesperson,Customer Category ,Stockist_Phone,Stockist_Name,Stockist_Area,Start Visit Time,End Visit Time,Comment,Latitude,Longitude,Type,Address,Start_Visit_Dist,End_Visit_Dist ';			//makes it comma seperated heading
                                        //console.log(output)
                                        output += '\n';
                                        for (var i = 0; i < result.length; i++) {
                                            if(result[i].storeLat[0] && result[i].storeLong[0]) {
                                                result[i].customerLocation = true;
                                                var slatlng = new google.maps.LatLng(result[i].storeLat[0], result[i].storeLong[0]);
                                                var startLatLong;
                                                var endLatLong;
                                                //handle condition for ignoring calculation when lat/long values are 1 2 3 4 #DistanceCompute
                                                if(result[i].latitude && result[i].longitude){
                                                if (result[i].latitude[0] && result[i].longitude[0]
                                                    && result[i].latitude[0] != 1 && result[i].longitude[0] != 1
                                                    && result[i].latitude[0] != 2 && result[i].longitude[0] != 2
                                                    && result[i].latitude[0] != 3 && result[i].longitude[0] != 3
                                                    && result[i].latitude[0] != 4 && result[i].longitude[0] != 4) {
                                                    startLatLong = new google.maps.LatLng(result[i].latitude[0], result[i].longitude[0]);
                                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, startLatLong);
                                                    result[i].sVisitDist = parseFloat(dist / 1000).toFixed(2) + "KM from " + $scope.nav[2].tab;
                                                    result[i].startVisitLocation = true;
                                                }
                                            }
                                                else {
                                                    result[i].startVisitLocation = false;
                                                    if(result[i].latitude){
                                                    result[i].sVisitDist =
                                                        (result[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                            (result[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                ((result[i].latitude[0] == 3 || result[i].latitude[0] == 4) ? 'Device GPS off' : '')));
                                                }
                                                }

                                                if(result[i].exitLat[0] && result[i].exitLong[0]
                                                    && result[i].exitLat[0] != 1 && result[i].exitLong[0] != 1
                                                    && result[i].exitLat[0] != 2 && result[i].exitLong[0] != 2
                                                    && result[i].exitLat[0] != 3 && result[i].exitLong[0] != 3
                                                    && result[i].exitLat[0] != 4 && result[i].exitLong[0] != 4){

                                                    endLatLong = new google.maps.LatLng(result[i].exitLat[0], result[i].exitLong[0]);
                                                    var dist = google.maps.geometry.spherical.computeDistanceBetween(slatlng, endLatLong);
                                                    result[i].eVisitDist = parseFloat(dist/1000).toFixed(2)+"KM from "+$scope.nav[2].tab;
                                                    result[i].endVisitLocation = true;
                                                }
                                                else{
                                                    result[i].eVisitDist =
                                                        (result[i].exitLong[0] == 1 ? 'User Denied GPS Permission' :
                                                            (result[i].exitLong[0] == 2 ? 'GPS ERROR' :
                                                                ((result[i].exitLong[0] == 3 || result[i].exitLong[0] == 4) ? 'Device GPS off' : '')));
                                                    result[i].endVisitLocation = false;
                                                }
                                            }
                                            else {
                                                result[i].customerLocation = false;
                                                if(result[i].latitude){
                                                if (result[i].latitude[0] == 1 ||
                                                    result[i].latitude[0] == 2 ||
                                                    result[i].latitude[0] == 3 ||
                                                    result[i].latitude[0] == 4) {
                                                    result[i].startVisitLocation = false;
                                                    result[i].sVisitDist =
                                                        (result[i].latitude[0] == 1 ? 'User Denied GPS Permission' :
                                                            (result[i].latitude[0] == 2 ? 'GPS ERROR' :
                                                                ((result[i].latitude[0] == 3 || result[i].latitude[0] == 4) ? 'Device GPS off' : '')));

                                                }
                                            }
                                                else{
                                                    result[i].startVisitLocation = true;
                                                }
                                                if(result[i].exitLat[0] == 1 ||
                                                    result[i].exitLat[0] == 2 ||
                                                    result[i].exitLat[0] == 3 ||
                                                    result[i].exitLat[0] == 4){
                                                    result[i].endVisitLocation = false;
                                                    result[i].eVisitDist = (result[i].exitLat[0] == 1 ? 'User Denied GPS Permission' :
                                                        (result[i].exitLat[0] == 2 ? 'GPS ERROR' :
                                                            ((result[i].exitLat[0] == 3 || result[i].exitLat[0] == 4) ? 'Device GPS off' : '')));
                                                }
                                                else{

                                                    if(result[i].exitLat[0])
                                                        result[i].endVisitLocation = true;
                                                    else{ // Check if null?? if yes, it means that the user has not ended visit
                                                        result[i].endVisitLocation = false;
                                                        result[i].eVisitDist = 'Not Ended';
                                                    }

                                                }

                                            }

                                            output += i + 1;
                                            output += ',';


                                            output += result[i].orderId;
                                            output += ',';

                                            function formatdate(date) {
                                                if (date == undefined || date == '')
                                                    return ('');
                                                /* replace is used to ensure cross browser support*/
                                                var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                                                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                                var dt = d.getDate();
                                                if (dt < 10)
                                                    dt = "0" + dt;
                                                var dateOut = dt + "-" + monthNames[d.getMonth()] + "-" + (d.getFullYear());
                                                return dateOut;
                                            }

                                            function formattime(date) {
                                                if (date == undefined || date == '')
                                                    return ('')
                                                var d = new Date(date.toString().replace("-", "/").replace("-", "/"));
                                                var dt = d.getDate()
                                                if (dt < 10)
                                                    dt = "0" + dt
                                                var datetime = (d.getHours()) + ":" + (d.getMinutes())
                                                return datetime;
                                            }

                                            if (result[i].date_added[0])
                                                var dateformat = formatdate(result[i].date_added[0]);

                                            output += dateformat;
                                            output += ',';

                                            if (result[i].date_added[0])
                                                var dateformat = formattime(result[i].date_added[0]);

                                            output += dateformat;
                                            output += ',';

                                            output += result[i].dealercode[0];
                                            output += ',';

                                            try {
                                                if (result[i].dealername[0]) {
                                                    if ((result[i].dealername[0]).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + result[i].dealername[0] + '"';
                                                        result[i].dealername[0] = quotesWrapped
                                                    }
                                                    output += result[i].dealername[0];
                                                }
                                            } catch (e) {
                                            }

                                            output += ',';
                                            if (result[i].dealerphone[0])
                                                output += result[i].dealerphone[0];
                                            output += ',';

                                            if (result[i].seller[0])
                                                output += result[i].seller[0];
                                            output += ',';

                                            try {
                                                if (result[i].sellername[0]) {
                                                    if ((result[i].sellername[0]).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + result[i].sellername[0] + '"';
                                                        result[i].sellername[0] = quotesWrapped
                                                    }
                                                }
                                                output += result[i].sellername[0];
                                            } catch (e) {
                                            }
                                            output += ',';
                                            if (result[i].customercategory && result[i].customercategory[0])
                                                output += result[i].customercategory[0];
                                            output += ',';
                                            if (result[i].stockist && result[i].stockist[0])
                                                output += result[i].stockist[0];
                                            output += ',';
                                            if (result[i].stockistname && result[i].stockistname[0])
                                                output += result[i].stockistname[0];
                                            output += ',';
                                            if (result[i].stockistarea && result[i].stockistarea[0])
                                                output += result[i].stockistarea[0];
                                            output += ',';

                                            if(result[i].intime[0]){
                                                output += $scope.getTimeFromDate(result[i].intime[0]);
                                            }
                                            output += ',';

                                            if(result[i].outtime[0]){
                                                output += $scope.getTimeFromDate(result[i].outtime[0]);
                                            }
                                            output += ',';

                                            var comment = '';
                                            try {
                                                comment = result[i].comment[0][(result[i].comment[0].length) - 1].comment;
                                                if (comment) {
                                                    if ((comment).toString().indexOf(',') != -1) {
                                                        var quotesWrapped = '"' + comment + '"';
                                                        comment = quotesWrapped
                                                    }
                                                }
                                                output += comment;
                                            } catch (e) {
                                            }
                                            output += ',';

                                            if (result[i].latitude && result[i].latitude[0] != 'undefined')
                                                output += result[i].latitude[0];
                                            output += ',';
                                            if (result[i].longitude && result[i].longitude[0] != 'undefined')
                                                output += result[i].longitude[0];
                                            output += ',';

                                            if (result[i].type && result[i].type[0])
                                                output += result[i].type[0];
                                            output += ',';

                                            // output += result[i].orderId;
                                            // output += ',';

                                            try {
                                                if (result[i].address[0]) {
                                                    if ((result[i].address[0]).toString().indexOf(',') != -1) {
                                                        quotesWrapped = '"' + result[i].address[0] + '"'
                                                        result[i].address[0] = quotesWrapped
                                                    }
                                                    output += result[i].address[0];
                                                }
                                            } catch (e) {
                                                console.log(e)
                                            }
                                            output += ',';

                                            if (result[i].sVisitDist)
                                                output += result[i].sVisitDist;
                                            output += ',';

                                            if (result[i].eVisitDist)
                                                output += result[i].eVisitDist;


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
                                            download: 'Mbj_' + instanceDetails.api_key + '_Checkins_' +d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                                        })[0].click();
                                        //return response

                                        jQuery.noConflict();
                                        $('.refresh').css("display", "none");
                                    })
                                    .error(function(data, status, headers, config){
                                        console.log(data);
                                        // document.getElementById("loader").style.display = "none";
                                        // document.getElementById("myDiv").style.display = "block";
                                        // document.getElementById("message").style.display = "none";

                                        // bootbox.alert({
                                        //     title: "ERROR Line : 14877",
                                        //     message: "The server took too long to respond : Timeout Error. Please try again!<br>Error : " + data + " " + status,
                                        //     className: "text-center",
                                        //     callback: function (result) {
                                        //
                                        //     }
                                        // })


                                        Settings.alertPopup("Alert", "The server took too long to respond : Timeout Error. Please try again! " <br> "Error : " + data + " " + status);

                                    });
                            }

                        })
                        .error(function(data, status, headers, config){
                            console.log(data);
                            // document.getElementById("loader").style.display = "none";
                            // document.getElementById("myDiv").style.display = "block";
                            // document.getElementById("message").style.display = "none";

                            bootbox.alert({
                                title: "ERROR Line : 14895",
                                message: "The server took too long to respond : Timeout Error. Please try again!<br>Error : " + data + " " + status,
                                className: "text-center",
                                callback: function (result) {

                                }
                            })
                        });
                    break;
            }
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
        $scope.changeReportView(localViewBy);
    })
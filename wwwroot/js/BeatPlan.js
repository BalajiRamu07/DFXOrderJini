/**
 * Created by Akash on 10/03/20.
 */

angular.module('ebs.controller')

    .controller("BeatPlanCtrl",function ($scope, $filter, $http, $modal,$routeParams, $window,Settings, toastr, $interval,$sce,$mdDialog,$location) {
        console.log("Hello From beat Controller .... !!!!");
        $scope.selectedDealer = [];
        $scope.beatSalesPerson = [];
        $scope.selectedBeatRow = null;
        $scope.diaplayEditIcon = false;
        $scope.displayBeatSearch = true;
        $scope.beatSearch='';
        $scope.pjpSearch = {};
        $scope.checkinMapLocation = {};
        $scope.itemsPjp = $scope.allPjp;
        $scope.editPjpTable = [];
        $scope.checkinIcons = [];
        $scope.showBeatId = Settings.getId() ? Settings.getId() : 0;
        $scope.showBeatIndex = 0;

        $scope.checkinIcons['startVisit'] = 'https://maps.google.com/mapfiles/ms/micons/blue-dot.png';
        $scope.checkinIcons['endVisit'] = 'https://maps.google.com/mapfiles/ms/micons/red-dot.png';
        $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
        $scope.checkinIcons['pjp'] = 'https://maps.google.com/mapfiles/ms/micons/green-dot.png';


        jQuery.noConflict();
        $('.refresh').css("display", "inline");

        setTimeout(function () {
            $('.refresh').css("display", "none");
        }, 3000);
        // $scope.salesSearchText = '';
        $scope.querySalespersonSearch = function(query) {
            var results =  $filter('filter')($scope.roleSalesrep, query);
            console.log('Result of the Filter ---> ', results);
            console.log('All PJPs --- ', $scope.allPjp);

            return results;
        }

        $scope.countSalesperson = function (){
            if($scope.beats.length && $scope.allPjp){
                for(var i = 0; i < $scope.beats.length; i++){
                    var result = $scope.allPjp.filter(
                        function(items){return Number(items.beatId) == Number($scope.beats[i].beatId)})
                    console.log('result',result)
                    console.log('$scope.beats',$scope.beats[i]);
                    console.log('$scope.$scope.allPjp',$scope.allPjp);

                    if(result.length){
                        $scope.beats[i].totalSalesperson = result.length;
                    }else{
                        $scope.beats[i].totalSalesperson = 0;
                    }

                }
            }
        }


        $scope.renderPjpBeat = function(response){
            //console.log("Render Beat ---->")
            console.log(response);
            if(response && response.length){
                $scope.displayBeat = response;
                $scope.beats = response;
    
                $scope.countSalesperson()
    
                if($scope.showBeatId){
                    for(var i = 0; i < $scope.beats.length; i++){
                        if(Number($scope.showBeatId) == Number($scope.beats[i].beatId)){
                            $scope.showBeatIndex = Number(i);
                            $scope.fetchSalesperson($scope.beats[i],i)
                        }
                    }
    
                }else{
                    $scope.fetchSalesperson($scope.beats[0],0)
                }
            }
        }

        $scope.renderPjp = function(response){
            $scope.allPjp = response;

            $http.get("/dash/pjp/get/beats")
                .success($scope.renderPjpBeat)
                .error((error, status) => {
                    console.log(error, status);
                })
        }

        $scope.refreshTransactions = function(){
            $http.get("/dash/pjp/0")
                .success($scope.renderPjp)
                .error((error, status) => {
                    console.log(error, status);
                })
        }


        $scope.deleteBeat = function(beat){
            console.log(beat);

            Settings.confirmPopup('CONFIRM',"Deleting a beat will result in removing all PJP's associated with the beat",function(result){
                if(result){
                        $http.get("/dash/pjp/beat/remove/beat/"+beat.beatId+"/"+null)
                            .success(function(res){
                                //console.log(res)

                                $http.get("/dash/pjp/0")
                                    .success($scope.renderPjp);

                                $http.get("/dash/pjp/get/beats")
                                    .success($scope.renderPjpBeat)
                                $scope.selectedBeatRow = null;
                                $scope.selectedDealer=[];
                                $scope.beatSalesPerson=[];
                                $scope.diaplayEditIcon = false;
                                // jQuery.noConflict();
                                // $("#beatDetails").modal('hide');
                            })
                    }
            })
        }

        $scope.setBeatId = function (beat) {
            if(beat){
                Settings.setId(beat.beatId);
            }
        }


        $scope.DistanceCalculate = [];
        $scope.renderPjpMap = function(order,mapvalue) {
            $scope.DistanceCalculate = [];
            console.log('pjp order', order)
            console.log('pjp mapvalue', mapvalue)

            // $scope.showMap = true;
            $scope.showPjpMap = false;
            var gmarkers = [];
            $scope.checkinIcons['Customer'] = 'https://maps.google.com/mapfiles/ms/micons/orange-dot.png';
            // $scope.checkinMapLocation = {};
            // $scope.checkinMapLocation.dealer = "Not Available";
            // $scope.checkinMapLocation.sVisit = "Not Available";

            var myOptions = {
                zoom: zoomLevel,
                center: latlng,
                scaleControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var latlng = new google.maps.LatLng(20.5937, 78.9629);
            var zoomLevel = 5;
            var latlngList = [];
            var flightPlanCoordinates = [];
            map = new google.maps.Map(document.getElementById(mapvalue), myOptions);



            console.log('after map');
            for (var i = 0; i < order.length; i++) {
                var demolatlang = {};


                if (order[i].latitude && order[i].longitude) {
                    if (typeof order[i].latitude == 'object' && typeof order[i].longitude == 'object') {
                        //console.log('array')
                        if (order[i].latitude[0] && order[i].longitude[0] && order[i].latitude[0] != 1 && order[i].latitude[0] != 2 &&
                            order[i].latitude[0] != 3 && order[i].latitude[0] != 4) {
                            $scope.DistanceCalculate.push(order[i]);
                            demolatlang.lat = order[i].latitude[0];
                            demolatlang.lng = order[i].longitude[0];
                            flightPlanCoordinates.push(demolatlang);
                            $scope.showPjpMap = true;
                            latlngList.push(new google.maps.LatLng(parseFloat(order[i].latitude[0]), parseFloat(order[i].longitude[0])))
                        }
                    }
                    else {
                        if (order[i].latitude && order[i].longitude && order[i].latitude != 1 && order[i].latitude != 2 &&
                            order[i].latitude != 3 && order[i].latitude != 4) {
                            $scope.DistanceCalculate.push(order[i]);
                            demolatlang.lat = order[i].latitude;
                            demolatlang.lng = order[i].longitude;
                            flightPlanCoordinates.push(demolatlang);
                            $scope.showPjpMap = true;
                            latlngList.push(new google.maps.LatLng(parseFloat(order[i].latitude), parseFloat(order[i].longitude)))
                        }
                    }
                }
            }



            for(var i=0;i<$scope.DistanceCalculate.length;i++){


                if ($scope.DistanceCalculate[i].latitude && $scope.DistanceCalculate[i].longitude) {
                    if (typeof $scope.DistanceCalculate[i].latitude == 'object' && typeof $scope.DistanceCalculate[i].longitude == 'object') {
                        if ($scope.DistanceCalculate[i].latitude[0] && $scope.DistanceCalculate[i].longitude[0] && $scope.DistanceCalculate[i].latitude[0] != 1 && $scope.DistanceCalculate[i].latitude[0] != 2 &&
                            $scope.DistanceCalculate[i].latitude[0] != 3 && $scope.DistanceCalculate[i].latitude[0] != 4) {
                            latlng = new google.maps.LatLng(parseFloat($scope.DistanceCalculate[i].latitude[0]), parseFloat($scope.DistanceCalculate[i].longitude[0]));
                            addMarker(latlng, 0);
                        }
                    }
                    else {
                        if ($scope.DistanceCalculate[i].latitude && $scope.DistanceCalculate[i].longitude && $scope.DistanceCalculate[i].latitude != 1 && $scope.DistanceCalculate[i].latitude != 2 &&
                            $scope.DistanceCalculate[i].latitude != 3 && $scope.DistanceCalculate[i].latitude != 4) {
                            latlng = new google.maps.LatLng(parseFloat($scope.DistanceCalculate[i].latitude), parseFloat($scope.DistanceCalculate[i].longitude));
                            addMarker(latlng, 0);
                        }
                    }
                }



                function addMarker(latlng, id) {
                    // console.log('addmarker');
                    var markertitle = i+1;
                    var contentString = $scope.DistanceCalculate[i].DealerName;

                    if (id == 0) {
                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                            title: markertitle.toString() + '. ' + contentString,
                        });
                        if (i == 0) {
                            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
                        } else if (i == $scope.DistanceCalculate.length - 1 ) {
                            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
                        } else {
                            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
                        }
                        reverseGeocode(geocode_address, latlng, 'customer');
                    }

                    var infowindow = new google.maps.InfoWindow({
                        content: markertitle.toString() + '. ' + contentString
                    });
                    marker.addListener('click', function () {
                        infowindow.open(map, marker);
                    });

                    gmarkers.push(marker);
                }


            }


            //Set zoom based on the location latlongs
            if (latlngList.length > 0) {
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < latlngList.length; i++) {
                    bounds.extend(latlngList[i]);
                }

                map.setCenter(bounds.getCenter()); //or use custom center
                map.fitBounds(bounds);
                // map.invalidatesize(true);

            }

            var mcOptions = {gridSize: 6, maxZoom: 20,
                imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"};
            var markerCluster = new MarkerClusterer(map, gmarkers,mcOptions); //clusters the nearby points
            google.maps.event.trigger(map, 'resize');
            $('a[href="#profile"]').on('shown', function (e) {
                google.maps.event.trigger(map, 'resize');
            });


            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(map);



        }


        $scope.beatDistance = 0;
        $scope.renderPjpMapDistance = function(){

            if($scope.DistanceCalculate.length <= 24){

                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                $scope.beatDistance = 0;

                var waypts = [];
                // var checkboxArray = document.getElementById('waypoints');
                // console.log('checkboxArray',checkboxArray)

                var startpoint = '';
                var endpoint =  '';

                var startindex = 0;
                var lastindex = 0;

                var tempArray = [];


                for (var j = 0 ; j < $scope.DistanceCalculate.length; j++) {

                    // console.log('index1',j);

                    lastindex += 24;
                    waypts = [];

                    if( $scope.DistanceCalculate.length <= lastindex ) {
                        startindex=$scope.DistanceCalculate.length;
                    }else{
                        startindex += 24;
                    }

                    for (i=j;i<startindex;i++){
                        if($scope.DistanceCalculate[i].latitude[0] && $scope.DistanceCalculate[j].longitude[0]){
                            console.log('index2',i);
                            if(i == 0){
                                startpoint = new google.maps.LatLng($scope.DistanceCalculate[i].latitude[0],$scope.DistanceCalculate[i].longitude[0]);
                            }else if(i == startindex-1){
                                endpoint =new google.maps.LatLng($scope.DistanceCalculate[i].latitude[0],$scope.DistanceCalculate[i].longitude[0]);
                            }else{
                                waypts.push({
                                    location: new google.maps.LatLng($scope.DistanceCalculate[i].latitude[0],$scope.DistanceCalculate[i].longitude[0]),
                                    stopover: true
                                });
                            }

                        }else if($scope.DistanceCalculate[i].latitude && $scope.DistanceCalculate[i].longitude ){

                            if(i == 0){
                                startpoint = new google.maps.LatLng($scope.DistanceCalculate[i].latitude,$scope.DistanceCalculate[i].longitude);
                            }else if(i == startindex-1){
                                console.log('end',i);
                                endpoint =new google.maps.LatLng($scope.DistanceCalculate[i].latitude,$scope.DistanceCalculate[i].longitude);
                            }else{
                                waypts.push({
                                    location: new google.maps.LatLng($scope.DistanceCalculate[i].latitude,$scope.DistanceCalculate[i].longitude),
                                    stopover: true
                                });
                            }
                        }
                    }

                    j= startindex;

                    directionsService.route({
                        origin: startpoint,
                        destination: endpoint,
                        waypoints: waypts,
                        optimizeWaypoints: true,
                        travelMode: 'DRIVING'
                    }, function(response, status) {
                        if (status === 'OK') {
                            directionsDisplay.setDirections(response);
                            var route = response.routes[0];
                            // var summaryPanel = document.getElementById('directions-panel');
                            // summaryPanel.innerHTML = '';
                            // For each route, display summary information.
                            for (var i = 0; i < route.legs.length; i++) {
                                $scope.beatDistance  += route.legs[i].distance.value
                            }
                            $scope.beatDistance = $scope.beatDistance / 1000;

                            $scope.$apply();

                            waypts = [];
                        } else {

                        }
                    });


                }

            }else{
                bootbox.alert({
                    title : 'ERROR',
                    message : 'Distance can be calculated for only 25 '+$scope.nav[2].tab,
                    className : 'text-center'
                })
            }

        }


        $scope.fetchSalesperson = function(value, index) {
            $scope.DistanceCalculate = [];
            $scope.beatDistance = null;
            $scope.beatDistance = 0;
            $scope.selectedBeat = value;
            $scope.selectedBeatRow = index;
            $scope.showPjpMap = false;
            $scope.selectedDealer = value.beat;
            $scope.diaplayEditIcon = true
            $scope.pjpBeatId = value.beatId;
            var result = $scope.allPjp.filter(
                function(items){return items.beatId == value.beatId})
            $scope.beatSalesPerson = result;


            if(!document.getElementById('map_PJP-'+index) ){
                var checkDiv=setInterval(function(){
                if(document.getElementById('map_PJP-'+index)) {    // it would be good if you would use id instead of the class
                    $scope.renderPjpMap(value.beat,'map_PJP-'+index)
                    clearInterval(checkDiv);
                    //further action here
                }
            }, 100);

            }else{
                $scope.renderPjpMap(value.beat,'map_PJP-'+index)
            }
        }




        $scope.refreshTransactions();


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
            }
        }

        $scope.getBeatName = function(beatId){
            if($scope.beats){
                for(var i=0; i< $scope.beats.length; i++){
                    if(beatId == $scope.beats[i].beatId)
                        return $scope.beats[i].beatName;
                }
            }

            return '';
        }

        $scope.pjpCsv = function(){
            $http.get("/dash/csv/pjp/download")
                .success(function(res){
                    //console.log(res)

                    var result = "Sl No,Date Added,Salesperson,Salesperson Phone,Beat Name,Day\n";

                    for(var i=0; i< res.length; i++){
                        result += i+1+",";

                        result += res[i].date_added;
                        result += ',';

                        result += res[i].sellerName;
                        result += ',';

                        result += res[i].sellerPhone;
                        result += ',';

                        result += $scope.getBeatName(res[i].beatId);
                        result += ',';

                        if(res[i].pjp_type == 'date'){
                            result += moment(res[i].day).format("DD-MMM-YYYY");
                        }else if(res[i].pjp_type == 'week'){
                            result += "\""+ res[i].day.week.toString()+"\"";
                        }else if(res[i].pjp_type == 'range'){
                            result += moment(res[i].day.startDate).format("DD-MMM-YYYY") +' to '+ moment(res[i].day.endDate).format("DD-MMM-YYYY");
                        }else if(res[i].pjp_type == 'rangeweek'){
                            result += "\""+ res[i].day.week.toString() +"\""+ "  "+ moment(res[i].day.startDate).format("DD-MMM-YYYY") +" to "+ moment(res[i].day.endDate).format("DD-MMM-YYYY") ;
                        }else if(!res[i].pjp_type){
                            result += res[i].day;
                        }



                        result += '\n';
                    }

                    result += '\n\n';
                    result += ' '+','+$scope.nav[2].tab+' Name,Address,Area,City\n';
                    var beat_res = res.unique('beatId');

                    for(var i=0; i< beat_res.length; i++){
                        for(var j=0; j< $scope.beats.length; j++){
                            if(beat_res[i].beatId == $scope.beats[j].beatId){
                                result += $scope.beats[j].beatName;
                                result += '\n';

                                for(var k=0; k < $scope.beats[j].beat.length; k++){
                                    result += k+1+",";

                                    result += $scope.beats[j].beat[k].DealerName;
                                    result += ',';

                                    if($scope.beats[j].beat[k].Address){
                                        result += "\""+$scope.beats[j].beat[k].Address+"\"";
                                        result += ',';
                                    }else{
                                        result += "\""+''+"\"";
                                        result += ',';
                                    }

                                    if($scope.beats[j].beat[k].Area){
                                        result += $scope.beats[j].beat[k].Area;
                                        result += ',';
                                    }else{
                                        result += "";
                                        result += ',';
                                    }

                                    if($scope.beats[j].beat[k].City){
                                        result += $scope.beats[j].beat[k].City;
                                        result += ',';
                                    }else{
                                        result += "";
                                        result += ',';
                                    }


                                    result += '\n';
                                }
                                result += '\n';
                            }
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
                        download: 'PJP_'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'.csv'
                    })[0].click();

                })
        }

    })

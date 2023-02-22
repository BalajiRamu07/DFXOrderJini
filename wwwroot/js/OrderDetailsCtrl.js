var app = angular.module('MyApp2', [])
    .controller('MyController2', function ($scope, $http, $window) {

        var subjectSel = document.getElementById("subject");
        var topicSel = document.getElementById("topic");
        var DensitySel = document.getElementById("Density");
        var lblBundle = document.getElementById("lblBundle");
        var LengthSel = document.getElementById("LengthSel");
        var widthSel = document.getElementById("widthSel");
        var thicknessSel = document.getElementById("thicknessSel");
        $scope.IsVisible = false;
        $scope.GetAllData = function () {
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetOrders",
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                var fcustomer = '{OrderID: "' + $scope.Prefix + '" }';
                $scope.OrderDetails = response;
                $scope.IsVisible = true;
            });
            post.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //This will hide the DIV by default.
        $scope.IsHidden = true;
        $scope.OrderFilterBy = function () {
            //If DIV is hidden it will be visible and vice versa.
            $scope.IsHidden = $scope.IsHidden ? false : true;
        }
        //-------------------------------CUSTOMERS----------------------------------------------------------//



        $scope.GetAllCustomers = function () {
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetCustomers",
                dataType: 'json',

                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.CustomerDetails = response;
                $scope.IsVisible = true;
            });
            post.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //-----------------------------CUSTOMER-DEALERCODE-----------------------------------------------------------//
        // $scope.GetCustomersDetails = function () {
        var customer = '{OrderID: "' + $scope.Prefix + '" }';
        var DealerCode = localStorage['DealerCode'];
        var post = $http({
            method: "POST",
            url: "/api/Orders/GetDealersDetails" + "?DealerCode=" + localStorage['DealerCode'],
            dataType: 'json',

            headers: { "Content-Type": "application/json" }
        });
        post.success(function (response, status) {
            $scope.CustomerDetails = response;
            $("#CustomeraName").text($scope.CustomerDetails[0].dealerName);
            $("#BillingAdd").text($scope.CustomerDetails[0].billingAddress);

            $("#CustomerCode").text($scope.CustomerDetails[0].dealercode);
            $("#ShippingAdd").text($scope.CustomerDetails[0].shippingAddress);
            $scope.IsVisible = true;
        });
        //  post.error(function (response, status) {
        // $window.alert(response.Message);
        // });
        //}
        //--------------------------------SHOWHIDE - Filter--------------------------------------------------------//

        //This will hide the DIV by default.
        $scope.IsHidden = true;
        $scope.OrderFilterBy = function () {
            //If DIV is hidden it will be visible and vice versa.
            $scope.IsHidden = $scope.IsHidden ? false : true;
        }
        //--------------------------------ONLOAD---------------------------------------------------------//

        $window.onload = function () {
            // $scope.LoadVehicleDetails();
        };
        //--------------------------------Load Category Items---------------------------------------------------------//

        $scope.SelectItems = [];
        
        var items = $http(
            {
                method: 'POST',
                url: '/api/Orders/GetProductItems' + "?DealerCode=" + localStorage['DealerCode'],  /*You URL to post*/
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                },
            });
        items.success(function (response, status) {
            $scope.SelectItems = response;
            for (var i = 1; i < $scope.SelectItems.length; i++) {
                subjectSel.options[subjectSel.options.length] = new Option($scope.SelectItems[i].productItems);
            }
            subjectSel.remove(1);
            $scope.IsVisible = true;
            //$scope.LoadVehicle();
        });
        items.error(function (response, status) {
            $window.alert(response.Message);
        });


        //-------------------------------------------Load Grades-------------------------------------------------------------------------//
        $scope.GetGrades = function (item) {

            $scope.SelectGrade = "";
            var postData = "?Item=" + item + "&DealerCode=" + localStorage['DealerCode'];
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetProductGrade' + postData ,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.SelectGrade = response;
                //empty Chapters- and Topics- dropdowns
                topicSel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.SelectGrade.length; i++) {
                    topicSel.options[topicSel.options.length] = new Option($scope.SelectGrade[i].productItems);
                }
                //topicSel.remove(0);

                $scope.GetPrimaryUOM($("#subject").find("option:selected").text(), "");

                $scope.IsVisible = true;

            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //-----------------------------------------LOAD DENSITY---------------------------------------------------------------------//
        $scope.GetDensity = function (item, item1) {
            $scope.SelectDensity = "";
            var postData = "?Item=" + item + "&Item1=" + item1;
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetProductDensity' + postData + "&DealerCode=" + localStorage['DealerCode'],  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.SelectDensity = response;
                //empty Chapters- and Topics- dropdowns
                DensitySel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.SelectDensity.length; i++) {
                    DensitySel.options[DensitySel.options.length] = new Option($scope.SelectDensity[i].productItems);
                }
                //DensitySel.remove(0);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //------------------------------------------DISPLAY PRIMARYOUM------------------//
        $scope.GetPrimaryUOM = function (item, item1) {
            $scope.SelectDensity = "";
            var postData = "?Item=" + item + "&Item1=1";
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetProductPrimaryUOM' + postData,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.SelectDensity = response;
                //empty Chapters- and Topics- dropdowns
                DensitySel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.SelectDensity.length; i++) {
                    $("#lblBundle").text($scope.SelectDensity[i].productItems);
                    $("#QtyBundleName").text("IN " + $scope.SelectDensity[i].productItems);
                }

                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //------------------------------------------LOAD LENGTH------------------------------------------------------------//
        $scope.GetLengthData = function (item, item1) {
            $scope.Selectlendth = "";
            var postData = "?Item=" + item + "&Item1=1";
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetProductLenth' + postData,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.Selectlendth = response;
                //empty Chapters- and Topics- dropdowns
                LengthSel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.Selectlendth.length; i++) {
                    LengthSel.options[LengthSel.options.length] = new Option($scope.Selectlendth[i].productItems);
                }
                // LengthSel.remove(0);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //-----------------------------------------LOAD WIDTH----------------------------------------------------------//
        $scope.GetWidthData = function (item, item1) {
            $scope.SelectWidth = "";
            var postData = "?Item=" + item + "&Item1=" + item1;
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetProductWidth' + postData,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.SelectWidth = response;
                //empty Chapters- and Topics- dropdowns
                widthSel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.SelectWidth.length; i++) {
                    widthSel.options[widthSel.options.length] = new Option($scope.SelectWidth[i].productItems);
                }
                //widthSel.remove(0);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //------------------------------LOAD THICKNES-----------------------------------------------------------------------------//
        $scope.GetThicknessData = function (item, item1, item2) {

            $scope.Selectthickness = "";
            var postData = "?Item=" + item + "&Item1=" + item1 + "&Item2=" + item2;
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetProductThickness' + postData,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.Selectthickness = response;
                //empty Chapters- and Topics- dropdowns
                thicknessSel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.Selectthickness.length; i++) {
                    thicknessSel.options[thicknessSel.options.length] = new Option($scope.Selectthickness[i].productItems);
                }
                //thicknessSel.remove(1);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //-------------------------------------LOAD BUNDLES CALC-----------------------------------------------------------//
        $scope.GetBundleCalculatepieces = function (item, item1, item2, item3) {
            //---------------------------------------------------------------------------------//
            $scope.Selectthickness = "";
            var postData = "?Item=" + item + "&Item1=" + item1 + "&Item2=" + item2 + "&Item3=" + item3;
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetBundleCalculatepieces' + postData,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.Selectthickness = response;
                $("#pieces").text($scope.Selectthickness[0].productItems);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }

        $scope.selectedItems = function () {
            $scope.GetGrades($scope.selitem.productItems);
        }
        $scope.selectedGrade = function (item1, item2) {
            $scope.GetDensity(item1, item2);
        }
        $scope.selectedDensity = function (item1, item2) {
            $scope.GetLengthData(item1, item2);
            var subjectSel = $("#subject").find("option:selected").text();
            var topicSel = $("#topic").find("option:selected").text();
        }

        $("#subject").bind("click focus change", function () {
            var subjectSel = $("#subject").find("option:selected").text();
            if (subjectSel == "Select") {
                $("#Gradediv").hide();
            }
            else {
                $("#Gradediv").show();
            }
            $("#Densitydiv").hide();

            $("#Primuomdiv").hide();
            $("#Sizediv").hide();
            $("#Qtydiv").hide();

            $("#CalcualtePieces").val("");
            $("#Volume").text("");
            $("#piecescal").text("");
        });
        $("#topic").bind("click focus change", function () {

            var subjectSel = $("#subject").find("option:selected").text();
            var topicSel = $("#topic").find("option:selected").text();
            var selectedValue = $(this).val();


            if (topicSel == "Select") {
                $("#Densitydiv").hide();
            }
            else {

                $scope.selectedGrade(subjectSel, topicSel);
                $scope.selectedDensity(subjectSel, topicSel);
                $("#Densitydiv").show();
            }
        });
        $("#Density").bind("click focus change", function () {

            var subjectSel = $("#subject").find("option:selected").text();
            var topicSel = $("#topic").find("option:selected").text();

            var selectedValue = $(this).val();
            var LengthSel = $("#LengthSel").prop("selectedIndex", 1).val();
            $scope.GetWidthData(subjectSel, LengthSel);
            var widthSel = $("#widthSel").prop("selectedIndex", 1).val();
            $scope.GetThicknessData(subjectSel, LengthSel, widthSel);

            var Density = $("#Density").find("option:selected").text();
            if (Density == "Select") {
                $("#Primuomdiv").hide();
                $("#Sizediv").hide();
                $("#IsBlockCuson").hide();
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#Vehiclediv").hide();
            }
            else if (Density != "Select" && subjectSel == "AYUSH CUSHIONS" || subjectSel == "BLOCKS") {

                $("#Primuomdiv").show();
                $("#Sizediv").show();
                $("#IsBlockCuson").show();
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
            }
            else if (Density != "Select" && subjectSel == "CHIP FOAM SHEETS" || subjectSel == "LATEX LIKE FOAM SHEETS") {

                $("#Primuomdiv").show();
                $("#Sizediv").show();
                $("#IsBlockCuson").hide();
                $("#IsFoamSheet").show();
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();

            }

        });

        $("#IsFoamid").bind("change", function () {
            $("#Qtydiv").show();
            $("#LDPEdiv").show();
        });
        $("#thicknessSel").bind("click focus change", function () {
            var LengthSel = $("#LengthSel").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();
            var subjectSel = $("#subject").find("option:selected").text();
            var widthSel = $("#widthSel").find("option:selected").text();

            if (thicknessSel == "Select") {
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#Vehiclediv").hide();

            }
            else if (thicknessSel != "Select" && subjectSel == "AYUSH CUSHIONS" && widthSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").show();


            }
            else if (thicknessSel != "Select" && subjectSel == "BLOCKS" && widthSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();


            }
        });
        $("#widthSel").bind("click focus change", function () {
            var LengthSel = $("#LengthSel").find("option:selected").text();

            var widthSel = $("#widthSel").find("option:selected").text();
            var subjectSel = $("#subject").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();


            if (widthSel == "Select") {
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
            }
            else if (widthSel != "Select" && subjectSel == "AYUSH CUSHIONS" && thicknessSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").show();

            }
            else if (widthSel != "Select" && subjectSel == "BLOCKS" && thicknessSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();


            }
        });
        $("#LengthSel").bind("click focus change", function () {
            var widthSel = $("#widthSel").find("option:selected").text();
            var LengthSel = $("#LengthSel").find("option:selected").text();
            var subjectSel = $("#subject").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();


            if (LengthSel == "Select") {
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
            }
            else if (LengthSel != "Select" && subjectSel == "AYUSH CUSHIONS" && thicknessSel != "Select" && widthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").show();

            }
            else if (LengthSel != "Select" && subjectSel == "BLOCKS" && thicknessSel != "Select" && widthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();


            }
        });
        $scope.CalculatePiecevolume = function (qty) {


            var subjectSel = $("#subject").find("option:selected").text();
            var qty = qty;
            var LengthSel = $("#LengthSel").find("option:selected").text();
            var widthSel = $("#widthSel").find("option:selected").text();
            var Density = $("#Density").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();
            $scope.GetBundleCalculatepieces(subjectSel, LengthSel, widthSel, thicknessSel);
            var pieces = $("#pieces").text();

            var piece = pieces * qty;
            $("#pieces").text(piece);

            Density = Density.substring(1, 3);



            if (subjectSel === "AYUSH CUSHIONS") {

                $("#piecescal").text("Pieces : " + parseFloat(piece));
                var Volume = (LengthSel * 0.0254) * (widthSel * 0.0254) * thicknessSel / 1000 * piece;
                var amt = parseFloat(Volume);
                $("#Volume").text("Volume : " + amt.toFixed(2));
                $("#volumecal").text(amt.toFixed(2));
            }
            else if (subjectSel === "BLOCKS") {

                // $("#piecescal").text("Pieces : " + parseFloat(piece));
                var KGs = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (thicknessSel / 1000) * Density) * qty;
                var amt = parseFloat(KGs);
                $("#Volume").text("KGs : " + amt.toFixed(2));
                $("#volumecal").text(amt.toFixed(2));
            }
            else if (subjectSel === "MF ROLLS") {

                $("#piecescal").text("Pieces : " + parseFloat(piece));
                var KGs = (((widthSel * 0.0254) * (thicknessSel / 1000) * (Density)) * LengthSel) * piece;
                var amt = parseFloat(KGs);
                $("#Volume").text("KGs : " + amt.toFixed(2));
                $("#volumecal").text(amt.toFixed(2));
            }
        }

        $("#CalcualtePieces").bind("change keyup keydown", function () {
            $scope.CalculatePiecevolume($("#CalcualtePieces").val());
        });
        $(".totalqty").bind("change keyup keydown", function () {
            $scope.CalculatePiecevolume($("#totalqty").val());
        });
        //--------------------------------------------//
        $("#btnOrderSave").bind("click", function () {

            $scope.AddCart_SaveUpdate("Save", localStorage['DealerCode']);


        });

        //-----------------------------------------------ORDER CREATION -INSERT---------------------//
        $scope.AddCart_SaveUpdate = function (Flag, dcode) {
            var subjectSel = $("#subject").find("option:selected").text();
            var topicSel = $("#topic").find("option:selected").text();
            var Density = $("#Density").find("option:selected").text();
            var val = $("#CalcualtePieces").val();
            var LengthSel = $("#LengthSel").find("option:selected").text();
            var widthSel = $("#widthSel").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();
            var Qty = $("#CalcualtePieces").val();
            var ldpe = $("input[name='ldpe']:checked").val();
            var piece = $("#pieces").text();
            var pieces = piece * val;
            var lblBundle = $("#lblBundle").text();
            var Volume = $("#volumecal").text();


            if (Flag == "Save") {


                //var postdt = "?Order" + Orders;
                var postData = "?ItemName=" + subjectSel + "&Grade=" + topicSel + "&Density=" + Density + "&PrimaryUOM=" + lblBundle + "&Lmax=" + LengthSel
                    + "&Wmax=" + widthSel + "&Tmax=" + thicknessSel + "&QTY=" + Qty + "&Pieces=" + pieces + "&LDPE=" + ldpe + "&DealerCode=" + dcode + "&Volume=" + Volume;
                //var postData = "?ItemName=" + subjectSel + "&Grade=" + topicSel + "&Density=" + Density
                //    + "&PrimaryUOM=" + lblBundle + "&Lmax=" + LengthSel
                //    + "&Wmax=" + widthSel + "&Tmax=" + thicknessSel + "&QTY=" + Qty + "&Pieces=" + pieces + "&LDPE=" + ldpe;

                var post = $http({
                    method: "POST",
                    url: "/api/SalesOrder/OrderCreate" + postData,
                    dataType: 'json',

                    headers: { "Content-Type": "application/json" }
                });
                post.success(function (response, status) {
                    if (response.data != "") {

                        // alert("Data Save Successfully");
                        $scope.GetItems();
                    } else {
                        // alert("Some error");
                    }

                });
                post.error(function (response, status) {
                    $window.alert(response.Message);
                });


            }
        }
        //--------------------------------------------------ITEM SAVING-----------------------------------------------//

        //-----------------------------------------------ORDER CREATION -INSERT---------------------//
        $scope.AddItem_SaveUpdate = function (Flag, DealerCode, Flag1, id, qty, pieces, volume) {
            var Comments = $("#CommentsId").val();
            var Cust_Ref = $("#Cus_refId").val();

            var CRDDate = $("#CRDDate").val();
            var PlantSel = $("#PlantSel").find("option:selected").text();
            var OrderId = $("#OrderIDForItemUpdate").val();
            var VehicleSel = $("#VehicleSel").find("option:selected").text();


            //var Qty = $("#ttlqty").val();
            //var ldpe = $("input[name='ldpe']:checked").val();
            var piece = pieces;
            //var pieces = piece * Qty;
            //var lblBundle = $("#lblBundle").text();
            //var Volume = $("#volumecal").text();


            if (Flag == "Update") {


                //var postdt = "?Order" + Orders;
                var postData = "?Cust_Ref=" + Cust_Ref + "&Comments=" + Comments + "&VehicleCode=" + VehicleSel + "&PlantCode=" + PlantSel + "&CRD_Date=" + CRDDate
                    + "&Wmax=" + id + "&Tmax=" + Flag1 + "&QTY=" + qty + "&Pieces=" + piece + "&LDPE=" + '' + "&DealerCode=" + DealerCode + "&OrderID=" + OrderId + "&Volume=" + volume;
                //var postData = "?ItemName=" + subjectSel + "&Grade=" + topicSel + "&Density=" + Density
                //    + "&PrimaryUOM=" + lblBundle + "&Lmax=" + LengthSel
                //    + "&Wmax=" + widthSel + "&Tmax=" + thicknessSel + "&QTY=" + Qty + "&Pieces=" + pieces + "&LDPE=" + ldpe;

                var post = $http({
                    method: "POST",
                    url: "/api/SalesOrder/OrderItemUpdate" + postData,
                    dataType: 'json',

                    headers: { "Content-Type": "application/json" }
                });
                post.success(function (response, status) {
                    if (response.data != "") {
                        // $scope.GetItems();
                        //alert("Data Save Successfully");

                    } else {
                        // alert("Some error");
                    }
                });
                post.error(function (response, status) {
                    $window.alert(response.Message);
                });


            }
        }
        $scope.ConfirmItem_SaveUpdate = function (Flag, DealerCode, Flag1, id) {
            var Comments = $("#CommentsId").val();
            var Cust_Ref = $("#Cus_refId").val();

            var CRDDate = $("#CRDDate").val();
            var PlantSel = $("#PlantSel").find("option:selected").text();
            var OrderId = $("#OrderIDForItemUpdate").val();
            var VehicleSel = $("#VehicleSel").find("option:selected").text();


            var Qty = $("#ttlqty").val();
            //var ldpe = $("input[name='ldpe']:checked").val();
            var piece = $("#ttlpieces").text();
            //var pieces = piece * Qty;
            //var lblBundle = $("#lblBundle").text();
            //var Volume = $("#volumecal").text();


            if (Flag == "Update") {


                //var postdt = "?Order" + Orders;
                var postData = "?Cust_Ref=" + Cust_Ref + "&Comments=" + Comments + "&VehicleCode=" + VehicleSel + "&PlantCode=" + PlantSel + "&CRD_Date=" + CRDDate
                    + "&Wmax=" + id + "&Tmax=" + Flag1 + "&QTY=" + Qty + "&Pieces=" + piece + "&LDPE=" + '' + "&DealerCode=" + DealerCode + "&OrderID=" + OrderId;
                //var postData = "?ItemName=" + subjectSel + "&Grade=" + topicSel + "&Density=" + Density
                //    + "&PrimaryUOM=" + lblBundle + "&Lmax=" + LengthSel
                //    + "&Wmax=" + widthSel + "&Tmax=" + thicknessSel + "&QTY=" + Qty + "&Pieces=" + pieces + "&LDPE=" + ldpe;

                var post = $http({
                    method: "POST",
                    url: "/api/SalesOrder/OrderItemUpdate" + postData,
                    dataType: 'json',

                    headers: { "Content-Type": "application/json" }
                });
                post.success(function (response, status) {
                    if (response.data != "") {
                        // $scope.GetItems();
                        //alert("Data Save Successfully");
                        var url = $("#RedirectTo").val();
                        location.href = url;
                    } else {
                        // alert("Some error");
                    }
                });
                post.error(function (response, status) {
                    $window.alert(response.Message);
                });


            }
        }
        //--------------------------------------------------LOAD ORDER ITEMS--------------------------------------//
        $scope.GetItems = function () {
            $scope.ItemDetails = "";
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetItems" + "?DealerCode=" + localStorage['DealerCode'],
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.ItemDetails = response;

                if ($scope.ItemDetails.length > 0) {
                    $("#tblBykeLists td").parent().remove();
                    for (i = 0; i < $scope.ItemDetails.length; i++) {
                        var item = "<i class='mdi mdi-delete text-danger pull-right' ng - click='removeItem($index)' role = 'button' tabindex = '0' ></i > ";
                        var itemname = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style='color: grey;margin: 0px'>Item : </span> " + $scope.ItemDetails[i].itemName + "</p> &nbsp;&nbsp;" + item + "</td></tr>";
                        var material = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style='color: grey; margin: 0px'>Material ID : </span> " + $scope.ItemDetails[i].materialID + "</p></td></tr>";
                        var lwt = "<tr style='border:0'><td style='border:0'><p class='ng-binding'><span ng-if='item.leng' class='ng - binding ng - scope''>L-" + $scope.ItemDetails[i].lmax + "</span> <span ng-if='item.width' class='ng-binding ng-scope'>W-" + $scope.ItemDetails[i].wmax + "</span><span ng-if='item.thickness' class='ng-binding ng-scope'> T-" + $scope.ItemDetails[i].tmax + "</span>&nbsp;&nbsp;&nbsp; <span style='color: grey; margin: 0px'>Qty</span> - " + $scope.ItemDetails[i].qty + "&nbsp;&nbsp;&nbsp; <span style = 'color: grey; margin: 0px'>LDPE</span> - " + $scope.ItemDetails[i].ldpe + "</p></td></tr>";
                        var pieces = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style='color: grey; margin: 0px' class='ng - binding'>Pieces</span> - " + $scope.ItemDetails[i].pieces + " &nbsp;&nbsp;<span style='color: grey; margin: 0px'>UOM</span> - " + $scope.ItemDetails[i].primaryUOM + "</p></td></tr>";
                        var volume = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style ='color: grey;margin: 0px'>Volume</span> - " + $scope.ItemDetails[i].volume + "</p><hr></td></tr>";
                        $("#tblBykeLists").append(itemname + material + lwt + pieces + volume);



                        //----------------------//



                        $('#btnPreview').show();

                    }
                }
                else {

                    $('#btnPreview').hide();
                }
                $scope.IsVisible = true;
            });
            // post.error(function (response, status) {
            //  $window.alert(response.Message);
            // });

        }
        $scope.GetOrdersId = function () {
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var OrderIDForItem = $("#OrderIDForItemUpdate").val();
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetOrdersId" + "?DealerCode=" + localStorage['DealerCode'] + "&OrderId=" + OrderIDForItem,
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.GetOrdersId = response;
                if ($scope.GetOrdersId.length > 0) {
                    for (i = 0; i < $scope.GetOrdersId.length; i++) {
                        $("#Cus_refId").val($scope.GetOrdersId[i].cust_Ref);
                        $("#CommentsId").val($scope.GetOrdersId[i].cust_Comments);
                        
                        var format3 = moment($scope.GetOrdersId[i].crD_Date).format('DD/MM/YYYY');

                        $("#CRDDate").val(format3.replace("01/01/1900", ""));
                        
                    }
                }
            });
            post.error(function (response, status) {
                $window.alert(response.Message);
            });
        }

        $scope.GetItemsDetails = function () {
            $scope.ItemDetails = "";
            var TQtysum = 0;
            var TPiecessum = 0;
            var TVolumesum = 0;
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetItems" + "?DealerCode=" + localStorage['DealerCode'],
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.ItemDetails = response;
                var TQtysum = 0;
                var TPiecessum = 0;
                if ($scope.ItemDetails.length > 0) {
                    for (i = 0; i < $scope.ItemDetails.length; i++) {
                        //----------------------//
                        $("#DealerCodeForItemUpdate").val("IN " + $scope.ItemDetails[i].dealerCode);
                        $("#OrderIDForItemUpdate").val($scope.ItemDetails[i].orderID);

                        TQtysum += parseFloat(NanValue($scope.ItemDetails[i].qty));
                        $('#TQtysum').text(TQtysum);

                        TPiecessum += parseFloat(NanValue($scope.ItemDetails[i].pieces));
                        $('#TPiecesum').text(TPiecessum);

                        TVolumesum += parseFloat(NanValue($scope.ItemDetails[i].volume));
                        $('#TVolumesum').text(TVolumesum.toFixed(2));

                        //---------------------------//
                        //if ($scope.ItemDetails[i].vehiclE_CODE !== 0 || $scope.ItemDetails[i].vehiclE_CODE !== '' || $scope.ItemDetails[i].vehiclE_CODE !== null) {
                        //    if ($scope.ItemDetails[i].vehiclE_CODE.length > 0) {

                        //    $("#VehicleSel").find("option[text=" + $scope.ItemDetails[i].vehiclE_CODE + "]").attr("selected", true);
                        //}
                        //}
                    }

                }
                else {

                    $('#btnPreview').hide();
                }
                $scope.IsVisible = true;
                $scope.GetOrdersId();
                $scope.LoadVehicleDetails();
               
            });
            // post.error(function (response, status) {
            //  $window.alert(response.Message);
            // });

        }

        //---------------------------------------------LOAD VEHICLE DETAILS----------------------//

        //------------------------------------------------LOAD PLANT-------------------------------//
        //$scope.GetPlant = function () {

        //--------------------------------------------//
        $("#btnOrderSaves").bind("click", function () {

            $scope.AddCart_SaveUpdate("Save", localStorage['DealerCode']);


        });


        // $("#ItemUpdateSave").bind("click", function () {
       // $("#msgsave").dialog();

        function validate_Orders() {
            var CRDDate;
            CRDDate = document.getElementById("CRDDate").value;

            if (CRDDate.length <= 0) {

                jAlert('CRDDate cannot be blank', 'Adcode', function (r) { document.getElementById("CRDDate").focus(); });

                return false;
            }
        }


        
        $("#ItemUpdateSave").click(function (event) {

            if (validate_Orders() != false) {
                event.preventDefault();
                $('<div title="Order Confirmation"></div>').dialog({
                    open: function (event, ui) {
                        $(this).html("Are You Want To Save?");
                    },
                    close: function () {
                        $(this).remove();
                    },
                    resizable: false,
                    height: 140,
                    modal: true,
                    buttons: {
                        'Yes': function () {

                            $scope.ConfirmItem_SaveUpdate("Update", localStorage['DealerCode'], 'ItemSave', '');

                        },
                        'No': function () {
                            $(this).dialog('close');

                        }
                    }
                });
            }
        });

        $("#ItemUpdateConfirm").click(function (event) {
            event.preventDefault();
            $('<div title="Order Confirmation"></div>').dialog({
                open: function (event, ui) {
                    $(this).html("Are You Want To Confirm?");
                },
                close: function () {
                    $(this).remove();
                },
                resizable: false,
                height: 140,
                modal: true,
                buttons: {
                    'Yes': function () {
                       
                        
                        $scope.ConfirmItem_SaveUpdate("Update", localStorage['DealerCode'], 'ItemConfirm', '');
                    },
                    'No': function () {
                        $(this).dialog('close');
                        
                    }
                }
            });
        });


      //  });
        $("#addNewItemBtn").bind("click", function () {

            var url = $("#RedirectToNewOrder").val();
            location.href = url;


        });
      

        //-----------------------------LOAD PLANT---------------------------------//
        $scope.LoadPlant = function () {
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetPlantDetails' + "?DealerCode=" + localStorage['DealerCode'],  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {
                $scope.LoadPlant = response;
                //empty Chapters- and Topics- dropdowns
                PlantSel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.LoadPlant.length; i++) {
                    PlantSel.options[PlantSel.options.length] = new Option($scope.LoadPlant[i].plant);
                }
                //DensitySel.remove(0);
                $('#PlantSel').prop('selectedIndex', 1);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }
        //-----------------------------LOAD VEHICLE CODE---------------------------------//
        $scope.LoadVehicle = function () {
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/LoadVehicleDetails' + "?DealerCode=" + localStorage['DealerCode'],  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

            Grade.success(function (response, status) {
                $scope.LoadVehicle = response;
                //empty Chapters- and Topics- dropdowns
                VehicleSel.length = 1;
                //display correct values
                //$('#topic').prop('selectedIndex', 0);
                for (var i = 0; i < $scope.LoadVehicle.length; i++) {
                    //VehicleSel.options[VehicleSel.options.length] = new Option($scope.LoadVehicle[i].vehicleCode + ' - ' + $scope.LoadVehicle[i].vehicleType);
                    //var value = $scope.LoadVehicle[i].vehicleCode + ' - ' + $scope.LoadVehicle[i].vehicleType;
                    VehicleSel.options[VehicleSel.options.length] = new Option($scope.LoadVehicle[i].vehiTypedesc);
                }
                //DensitySel.remove(0);
                $('#VehicleSel').prop('selectedIndex', 1);
                $scope.IsVisible = true;
               
            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });

        }
        //}
        //---------------------------------CHANGE PLANT BY ADMIN/FACTORYADMIN------------------------//

        $scope.ChangePlant = function () {

            var Plant = $("#PlantSel").find("option:selected").text();
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/ChangePlantByAdmin' + "?DealerCode=" + localStorage['DealerCode'] + "&PlantCode=" + Plant,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {

                if (response.data != "") {
                    alert("Data Save Successfully");

                } else {
                    alert("Some error");
                }

            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }

        $scope.RemoveItem = function (id) {

            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/RemoveOrderItems' + "?DealerCode=" + localStorage['DealerCode'] + "&ItemID=" + id,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            Grade.success(function (response, status) {

                if (response.data != "") {
                    //alert("Data Save Successfully");
                    $scope.GetItemsDetails();

                } else {
                    // alert("Some error");
                }

            });
            Grade.error(function (response, status) {
                $window.alert(response.Message);
            });
        }



        $scope.UpdateItem = function (id, qty,pieces,volume) {
            $scope.AddItem_SaveUpdate("Update", localStorage['DealerCode'], 'Itemupdate', id, qty, pieces, volume);
            $scope.GetItemsDetails();
          

        }
        var NanValue = function (entry) {
            if (entry == "NaN" || entry == "" || entry == "null" || entry == null) {
                return 0.00;
            } else {
                return entry;
            }
        }
        var Homeurl = function () {
        var url    = $("#RedirectTo").val();
        location.href = url;
        }

       
        $('#Itemstbl').on('keyup keydown', 'input', function () {
            var row = $(this).closest('tr');
            var total = 0;
            var ItemName = $(this).closest("tr").find("td:eq(8)").text();
            var lmax = $(this).closest("tr").find("td:eq(9)").text();
            var wmax = $(this).closest("tr").find("td:eq(10)").text();
            var tmax = $(this).closest("tr").find("td:eq(11)").text();
            var density = $(this).closest("tr").find("td:eq(12)").text();

            var grade = $(this).closest("tr").find("td:eq(13)").text();

            //var qty = $(this).closest("tr").find("td:eq(3)").text();
           
            $('input', row).each(function () {
               
               // $scope.CalculateEditQtyPiecevolume($(this).val(), ItemName, lmax, wmax, tmax, Density, grade);
                var subjectSel = ItemName;
                var qty = $(this).val();
                var LengthSel = lmax;
                var widthSel = wmax;
                var Density = density;
                var thicknessSel = tmax;
                $scope.Selectthickness = "";
                var postData = "?Item=" + ItemName + "&Item1=" + lmax + "&Item2=" + wmax + "&Item3=" + tmax;
                var Grade = $http(
                    {
                        method: 'POST',
                        url: '/api/Orders/GetBundleCalculatepieces' + postData,  /*You URL to post*/
                        dataType: 'json',
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                Grade.success(function (response, status) {
                    $scope.Selectthickness = response;
                    $('.TotalPieces', row).text($scope.Selectthickness[0].productItems);

                   
                   
               
                //$scope.GetBundleCalculatepieces(subjectSel, LengthSel, widthSel, thicknessSel);
                    var pieces = $('.TotalPieces', row).text();
                var qt = qty;
                var piece = pieces * qt;
                
                $('.TotalPieces', row).text(piece);
                Density = Density.substring(1, 3);
                


                if (subjectSel === "AYUSH CUSHIONS") {

                    $("#piecescal").text("Pieces : " + parseFloat(piece));
                    var Volume = (LengthSel * 0.0254) * (widthSel * 0.0254) * thicknessSel / 1000 * piece;
                    var amt = parseFloat(Volume);
                   
                    $('.TotalVolume', row).text(amt.toFixed(2));
                   
                }
                else if (subjectSel === "BLOCKS") {

                   
                    var KGs = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (thicknessSel / 1000) * Density) * qty;
                    var amt = parseFloat(KGs);
                    $('.TotalVolume', row).text(amt.toFixed(2));

                }
                else if (subjectSel === "MF ROLLS") {

                    $("#piecescal").text("Pieces : " + parseFloat(piece));
                    var KGs = (((widthSel * 0.0254) * (thicknessSel / 1000) * (Density)) * LengthSel) * piece;
                    var amt = parseFloat(KGs);
                    $('.TotalVolume', row).text(amt.toFixed(2));

                    }
                });
                Grade.error(function (response, status) {
                    $window.alert(response.Message);
                });
            });
           
        });

      

        $(document).on("click", ".edit", function (e) {
            var row_index = $(this).closest("tr").index();

            var row = $(this).closest('tr');
            // $('#Itemstbl tbody').find("tr").each(function (index, tds) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var btn = $(this);
            var td = btn.closest("tr").find(".editable");
            currentValue = td.text();

            if (btn.text() === "edit") {
                td.html("<input type='text' class='identifier''  value=" + currentValue + " />");
                btn.html("save");
               // $('.cancel', row).show();
                
              
            }
           
            else {
                var qty = td.find("input").val();
                btn.html("edit");
               
                //var d = $(this).closest('tr').find(".editable").attr('qtyid');
                var td = $(this).closest("tr").find(".editable");
                //alert(d);
                if (currentValue) {
                    td.html(currentValue);

                    $(this).parent().find(".edit").html("edit");
                    //currentValue = null;
                }
                //alert(df);
                //alert($(this).closest("tr").find("td:eq(7)").text());
                var itemid = $(this).closest("tr").find("td:eq(7)").text();
                //var qty = $(this).closest("tr").find("td:eq(3)").text();
                $scope.UpdateItem(itemid, qty, $(this).closest("tr").find("td:eq(4)").text(), $(this).closest("tr").find("td:eq(5)").text());
                
            }
            // });
        });

        $(document).on("click", ".cancel", function (e) {
            var row_index = $(this).closest("tr").index();


            // $('#Itemstbl tbody').find("tr").each(function (index, tds) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var d = $(this).closest('tr').find(".editable").attr('qtyid');
            var td = $(this).closest("tr").find(".editable");
            //alert(d);
            if (currentValue) {
                td.html(currentValue);

                $(this).parent().find(".edit").html("edit");
                currentValue = null;
               // $('.cancel', row).hide();

            }

        });

        $scope.LoadOrder_History = function (id) {
           
            var url = $("#RedirectToOrderDetails").val();
            location.href = url;

        }
    });

//-------------------------------------------JQUERY FUNCTIONS---------------------------------------------------//
$(document).ready(function () {
   
    // Search all columns
    $('#myInput').keyup(function () {
        // Search Text
        var search = $(this).val();

        // Hide all table tbody rows
        $('table tbody tr').hide();

        // Count total search result
        var len = $('table tbody tr:not(.notfound) td:contains("' + search + '")').length;

        if (len > 0) {
            // Searching text in columns and show match row
            $('table tbody tr:not(.notfound) td:contains("' + search + '")').each(function () {
                $(this).closest('tr').show();
            });
        } else {
            $('.notfound').show();
        }

    });
   
   
   //--------------------------------------------TABLE SEARCH-----------------------------------//
    $('#myTable').on('click', 'tr', function () {
        var text = $(this).find(".dcode").text()
        var url = $("#RedirectTo").val();
        location.href = url ;
        localStorage['DealerCode'] = "";

        localStorage['DealerCode'] = text;
    });
   

    //jQuery('#library tr').click(function (e) {
    //    e.stopPropagation();
    //    var $this = jQuery(this);
    //    var trid = $this.closest('tr').attr('id');
    //});



});

  
// Case-insensitive searching (Note - remove the below script for Case sensitive search )
$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});


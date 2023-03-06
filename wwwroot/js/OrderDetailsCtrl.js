var app = angular.module('MyApp2', [])
    .controller('MyController2', function ($scope, $http, $window) {
        //var DealerCode_Id =localStorage['DealerCode'];
        //var ProfileName_Id = localStorage['ProfileName'];

        //------------------------------------------------------------LOGIN PROFILE---------------------------//
        var UserId = localStorage["UserId"];
        var profile = localStorage["ProfileName"];
        $("#userid").text(UserId);
        $("#profileid").text(profile);
        $("#usersignoutid").text(profile);
        $scope.AdminProfileEnable = function () {

            var UserId = localStorage["UserId"];
            var profile = localStorage["ProfileName"];
            $("#userid").text(UserId);
            $("#profileid").text(profile);
            $("#usersignoutid").text(profile);
            var colno = "17";
            var colno1 = "9";
            var $tbl = $("#Itemstbl");
            if (profile == "Admin") {
                localStorage["UserId"] = "Admin";
                localStorage["ProfileName"] = "Admin";
                $("#CustomerMenu").show();
                $("#MenuFoamId").show();
                localStorage["SearchName"] = "Admin";

                $("#PlantSel").prop("disabled", false)

            }
            else if (profile == "Customer") {
                localStorage["DealerCode"] = UserId;

                $("#CustomerMenu").hide();
                $("#MenuFoamId").show();
                localStorage["SearchName"] = "Orders";

                $("#PlantSel").prop("disabled", true);
                //$("#edithide").show();
                //  $('#Itemstbl').find('.editd').showsh
                $('#Itemstbl').closest("tr").find(".editd").hide();
                // $("#Itemstbl").closest("tr").find(".editd").show();
            }
            else if (profile == "FactoryAdmin") {




                $("#CustomerMenu").show();
                $("#MenuFoamId").hide();
                localStorage["SearchName"] = "FactoryAdmin";

            }
            else if (profile == "SalesPerson") {

                $("#CustomerMenu").show();
                $("#MenuFoamId").show();
                localStorage["SearchName"] = "Orders";
                $("#PlantSel").prop("disabled", true);


            }
        }

        //------------------------------------------------------------LOGIN PROFILE---------------------------//
        var subjectSel = document.getElementById("subject");
        var topicSel = document.getElementById("topic");
        var DensitySel = document.getElementById("Density");
        var lblBundle = document.getElementById("lblBundle");
        var LengthSel = document.getElementById("LengthSel");
        var widthSel = document.getElementById("widthSel");
        var thicknessSel = document.getElementById("thicknessSel");
        $scope.IsVisible = false;
        $scope.GetAllData = function () {
            $scope.AdminProfileEnable();
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetOrders" + "?DealerCode=" + localStorage['DealerCode'] + "&SearchName=" + localStorage['ProfileName'],
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
                //$window.alert(response.Message);
            });
        }

        //This will hide the DIV by default.
        $scope.IsHidden = true;
        $scope.OrderFilterBy = function () {
            //If DIV is hidden it will be visible and vice versa.
            $scope.IsHidden = $scope.IsHidden ? false : true;
        }

        //-------------------------------------------------REPEAT ORDER-------------------------------------//
        $scope.RepeatOrder_History = function (Orderid, dealercode) {
            $scope.RepeatOrder(Orderid, dealercode);


        }

        $scope.RepeatOrder = function (Orderid, dealercode) {
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/Create_RepeatOrder" + "?DealerName=" + dealercode + "&SearchName=" + Orderid,
                dataType: 'json',

                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.RepeatOrderdetails = response;
                if ($scope.RepeatOrderdetails[0].resultErrorMsg == "Repeat Order Created Successfully!") {
                    alert($scope.RepeatOrderdetails[0].resultErrorMsg);
                    var url = $("#RedirectToOrderDetails").val();
                    location.href = url;
                }
                else {
                    alert($scope.RepeatOrderdetails[0].resultErrorMsg);
                }
            });
            post.error(function (response, status) {
                //$window.alert(response.Message);
            });
        }
        //-------------------------------------------------REPEAT ORDER-------------------------------------//
        //
       
        setTimeout(function () {
            $scope.GetCRD_Date_HolidayList();

        }, 1000)
        $(window).on('load', function () {
            //insert all your ajax callback code here.
            //Which will run only after page is fully loaded in background.
            //scope.GetCRD_Date_HolidayList();
        });
        
        $scope.GetCRD_Date_HolidayList = function () {
            var PlantSel = $("#PlantSel").find("option:selected").text();

            var post = $http({
                method: "POST",
                url: "/api/Orders/GetCRD_Date_HolidayList" + "?Orderdate=" + PlantSel + "&plant=" + PlantSel,
                dataType: 'json',

                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.CRD_Date = response;
                $("#CRDDate").val($scope.CRD_Date[0].resultErrorMsg);
                
                  
            });
            post.error(function (response, status) {
                //$window.alert(response.Message);
            });
        }
        //-------------------------------CUSTOMERS----------------------------------------------------------//

      

            $scope.GetAllCustomers = function () {
                var customer = '{OrderID: "' + $scope.Prefix + '" }';
                var post = $http({
                    method: "POST",
                    url: "/api/Orders/GetCustomers" + "?DealerName=" + localStorage['UserId'] + "&SearchName=" + localStorage['ProfileName'],
                    dataType: 'json',

                    headers: { "Content-Type": "application/json" }
                });
                post.success(function (response, status) {
                    $scope.CustomerDetails = response;
                    $scope.IsVisible = true;
                });
                post.error(function (response, status) {
                    //$window.alert(response.Message);
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
            if ($("#ShippingAdd").text == null || $("#ShippingAdd").text == "") {
                $("#ShippingAdd").text($scope.CustomerDetails[0].billingAddress);
            }
            $scope.IsVisible = true;
        });
        //  post.error(function (response, status) {
        // //$window.alert(response.Message);
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
             $scope.AdminProfileEnable();
            
        };
        //--------------------------------Load Category Items---------------------------------------------------------//
        
        

        $scope.SelectItems = [];

        var profilecode = localStorage['UserId'];
        if (profilecode == "Admin" ) {
            profilecode = profilecode;
        }
        else {
           profilecode= localStorage['DealerCode']
        }

        var items = $http(
            {
                method: 'POST',
                url: '/api/Orders/GetProductItems' + "?DealerCode=" + profilecode  ,  /*You URL to post*/
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
            //$window.alert(response.Message);
        });


        //-------------------------------------------Load Grades-------------------------------------------------------------------------//
        $scope.GetGrades = function (item) {

            $scope.SelectGrade = "";
            var postData = "?Item=" + item + "&DealerCode=" + profilecode;
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
                //$window.alert(response.Message);
            });
        }
        //-----------------------------------------LOAD DENSITY---------------------------------------------------------------------//
        $scope.GetDensity = function (item, item1) {
            $scope.SelectDensity = "";
            var postData = "?Item=" + item + "&Item1=" + item1;
            var Grade = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/GetProductDensity' + postData + "&DealerCode=" + profilecode,  /*You URL to post*/
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
                //$window.alert(response.Message);
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
                if ($("#subject").find("option:selected").text() == "MF ROLLS") {
                    $("#QtyBundleName").text("IN " + "Rolls");

                }
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                //$window.alert(response.Message);
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
                var subjectSel = $("#subject").find("option:selected").text();
                if (subjectSel == "CHIP FOAM SHEETS" || subjectSel == "LATEX LIKE FOAM SHEETS" || subjectSel == "MF SHEETS" || subjectSel == "PUF SHEETS") {
                    LengthSel.options[LengthSel.options.length] = new Option("Custom Length");
                }
                for (var i = 0; i < $scope.Selectlendth.length; i++) {
                    LengthSel.options[LengthSel.options.length] = new Option($scope.Selectlendth[i].productItems);
                }
                // LengthSel.remove(0);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                //$window.alert(response.Message);
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
                var subjectSel = $("#subject").find("option:selected").text();
                if (subjectSel == "CHIP FOAM SHEETS" || subjectSel == "LATEX LIKE FOAM SHEETS" || subjectSel == "MF SHEETS" || subjectSel == "PUF SHEETS") {
                    widthSel.options[widthSel.options.length] = new Option("Custom Width");
                }
                for (var i = 0; i < $scope.SelectWidth.length; i++) {
                    widthSel.options[widthSel.options.length] = new Option($scope.SelectWidth[i].productItems);
                }
                //widthSel.remove(0);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                //$window.alert(response.Message);
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
                var subjectSel = $("#subject").find("option:selected").text();

                if (subjectSel == "BLOCKS") {

                    thicknessSel.remove(0);
                }
            });
            Grade.error(function (response, status) {
                //$window.alert(response.Message);
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
                $("#bundleheight").text($scope.Selectthickness[0].productItems);
                $scope.IsVisible = true;
            });
            Grade.error(function (response, status) {
                //$window.alert(response.Message);
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

            $("#TCustomLength").text("");
            $("#TCustomwidth").text("");
            $("#tmaxatexid").text("");
            $("#tpuftexid").text("");
            $("#tmaxid").text("");
            $("#tmaxatexid").text("");
            $("#tpuftexid").text("");
          
            $("#IsFoamid").val("");
            $("#IsLatexsheetid").val("");
            $("#IsPufsheetid").val("");

            
            
            
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
            $("#CalcualtePieces").val("");
            $("#Volume").text("");
            $("#piecescal").text("");

            $("#TCustomLength").text("");
            $("#TCustomwidth").text("");
            $("#tmaxatexid").text("");
            $("#tpuftexid").text("");
            $("#tmaxid").text("");
            $("#tmaxatexid").text("");
            $("#tpuftexid").text("");

            $("#IsFoamid").val("");
            $("#IsLatexsheetid").val("");
            $("#IsPufsheetid").val("");
        });
        $("#Density").bind("click focus change", function () {

            var subjectSel = $("#subject").find("option:selected").text();
          
            var topicSel = $("#topic").find("option:selected").text();

            var selectedValue = $(this).val();
            var LengthSel = $("#LengthSel").prop("selectedIndex", 0).val();
            $scope.GetWidthData(subjectSel, LengthSel);
            var widthSel = $("#widthSel").prop("selectedIndex", 0).val();
            $scope.GetThicknessData(subjectSel, LengthSel, widthSel);
            $("#CalcualtePieces").val("");
            $("#Volume").text("");
            $("#piecescal").text("");

            $("#TCustomLength").text("");
            $("#TCustomwidth").text("");
            $("#tmaxatexid").text("");
            $("#tpuftexid").text("");
            $("#tmaxid").text("");
            $("#tmaxatexid").text("");
            $("#tpuftexid").text("");

            $("#IsFoamid").val("");
            $("#IsLatexsheetid").val("");
            $("#IsPufsheetid").val("");
            var Density = $("#Density").find("option:selected").text();
            if (Density == "Select") {
                $("#Primuomdiv").hide();
                $("#Sizediv").hide();
                $("#IsBlockCuson").hide();
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#Vehiclediv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();
                $("#IsMfrollslength").hide();

            }
            else if (Density != "Select" && subjectSel == "AYUSH CUSHIONS" || subjectSel == "BLOCKS" ) {

                $("#Primuomdiv").show();
                $("#Sizediv").show();
                $("#IsBlockCuson").show();
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();
                $("#IsLatexsheet").hide();
                $("#IsMfrollslength").show();

              
            }
            else if (Density != "Select" && subjectSel == "MF ROLLS") {

                $("#Primuomdiv").show();
                $("#Sizediv").show();
                $("#IsBlockCuson").show();
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();
                $("#IsLatexsheet").hide();
                $("#IsMfrollslength").hide();
                

            }
            else if (Density != "Select" && subjectSel == "CHIP FOAM SHEETS" ) {

                $("#Primuomdiv").show();
                $("#Sizediv").show();
                $("#IsBlockCuson").hide();
                $("#IsFoamSheet").show();
                $("#IsLatexsheet").hide();
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();
                $("#IsMfrollslength").show();

            }
            else if (Density != "Select" || subjectSel == "LATEX LIKE FOAM SHEETS" || subjectSel == "MF SHEETS") {

                $("#Primuomdiv").show();
                $("#Sizediv").show();
                $("#IsBlockCuson").hide();
                $("#IsFoamSheet").hide();
                $("#IsLatexsheet").show();

                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();
                $("#IsMfrollslength").show();

            }
            else if (Density != "Select" || subjectSel == "PUF SHEETS") {

                $("#Primuomdiv").show();
                $("#Sizediv").show();
                $("#IsBlockCuson").hide();
                $("#IsFoamSheet").hide();
                $("#IsPufxsheet").show();
                $("#IsLatexsheet").hide();
                
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();
                $("#IsMfrollslength").show();

            }

        });
        
        $("#IsFoamid").bind('keydown keyup change', function () {
                var char = $(this).val();
                var charLength = $(this).val();
                if (charLength < 15) {
                    $('#tmaxid').text('Thickness is short, minimum ' + "15" + ' required.');
                } else if (charLength > 150) {
                    $('#tmaxid').text('Thickness is not valid, maximum ' + "150" + ' allowed.');
                    $(this).val(char.substring(0, "150"));
                } else {
                    $('#tmaxid').text('Thickness is valid');
                    $("#Qtydiv").show();
                    $("#LDPEdiv").show();
                }
            
        });
        $("#IsLatexsheetid").bind('keydown keyup change', function () {
            var char = $(this).val();
            var charLength = $(this).val();
            if (charLength < 25) {
                $('#tmaxatexid').text('Thickness is short, minimum ' + "25" + ' required.');
            } else if (charLength > 150) {
                $('#tmaxatexid').text('Thickness is not valid, maximum ' + "150" + ' allowed.');
                $(this).val(char.substring(0, "150"));
            } else {
                $('#tmaxatexid').text('Thickness is valid');
                $("#Qtydiv").show();
                $("#LDPEdiv").show();
            }

        });
        
        $("#IsPufsheetid").bind('keydown keyup change', function () {
            var char = $(this).val();
            var charLength = $(this).val();
            if (charLength < 5) {
                $('#tpuftexid').text('Thickness is short, minimum ' + "5" + ' required.');
            } else if (charLength > 250) {
                $('#tpuftexid').text('Thickness is not valid, maximum ' + "250" + ' allowed.');
                $(this).val(char.substring(0, "250"));
            } else {
                $('#tpuftexid').text('Thickness is valid');
                $("#Qtydiv").show();
                $("#LDPEdiv").show();
            }

        });

        $("#CustomWidthId").bind('keydown keyup change', function () {
           
            var subjectSel = $("#subject").find("option:selected").text();
            var min = 0;
            var max = 0;
            if (subjectSel == "CHIP FOAM SHEETS" ) {
                min = 30;
                max = 48;
            }
            if (subjectSel == "MF SHEETS") {
                min = 30;
                max = 72;
            }
            if (subjectSel == "LATEX LIKE FOAM SHEETS") {
                min = 30;
                max = 72;
            }
            if (subjectSel == "PUF SHEETS") {
                min = 24;
                max = 49;
            }

            var char = $(this).val();
            var charLength = $(this).val();
            if (charLength < min) {
                $('#TCustomwidth').text('Width is short, minimum ' + min + ' required.');
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
            } else if (charLength > max) {
                $('#TCustomwidth').text('Width is not valid, maximum ' + max + ' allowed.');
                $(this).val(char.substring(0, max));
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
            } else {
                $('#TCustomwidth').text('Width is valid');
                $("#Qtydiv").show();
                $("#LDPEdiv").show();
            }

        });
        $("#CustomLengthId").bind('keydown keyup change', function () {
            var subjectSel = $("#subject").find("option:selected").text();
            var min = 0;
            var max = 0;
            if (subjectSel == "CHIP FOAM SHEETS" || subjectSel == "LATEX LIKE FOAM SHEETS" ) {
                min = 60;
                max = 78;
            }
            if (subjectSel == "PUF SHEETS") {
                min = 60;
                max = 84;
            }
            if (subjectSel == "MF SHEETS") {
                min = 72;
                max = 78;
            }

            var char = $(this).val();
            var charLength = $(this).val();
            if (charLength < min) {
                $('#TCustomLength').text('Length is short, minimum ' + min + ' required.');
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
            } else if (charLength > max) {
                $('#TCustomLength').text('Length is not valid, maximum ' + max + ' allowed.');
                $(this).val(char.substring(0, max));
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
            } else {
                $('#TCustomLength').text('Length is valid');
                $("#Qtydiv").show();
                $("#LDPEdiv").show();
            }

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
            else if (thicknessSel != "Select" && subjectSel == "MF ROLLS" && widthSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();


            }
            else if (thicknessSel != "Select" && subjectSel == "MF SHEETS" && widthSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();


            }
            else if (thicknessSel != "Select" && subjectSel == "LATEX LIKE FOAM SHEETS" && widthSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();


            }
        });
        $("#widthSel").bind("click focus change", function () {
            var LengthSel = $("#LengthSel").find("option:selected").text();

            var widthSel = $("#widthSel").find("option:selected").text();
            var subjectSel = $("#subject").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();
            var CustomLengthId = $("#CustomLengthId").val();
            var CustomWidthId = $("#CustomWidthId").val();
            
           
            $scope.GetThicknessData(subjectSel, LengthSel, widthSel);
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
            else if (widthSel != "Select" && subjectSel == "MF ROLLS" && thicknessSel != "Select" && LengthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();


            }

            else if (subjectSel == "CHIP FOAM SHEETS" || subjectSel == "LATEX LIKE FOAM SHEETS" || subjectSel == "MF SHEETS" || subjectSel == "PUF SHEETS") {
                if (widthSel == "Custom Width" ) {
                    $("#Qtydiv").show();
                    $("#LDPEdiv").hide();
                    $("#CustomWidthId").show();
                    
                }
                

                else if (widthSel != "Custom Width" || widthSel != "Select") {
                    $("#Qtydiv").show();
                    $("#LDPEdiv").hide();
                    $("#CustomWidthId").hide();

                }

                if (CustomLengthId.length > 0 || CustomWidthId.length > 0) {
                    $("#Qtydiv").show();
                    $("#LDPEdiv").show();
                   

                }
                else {
                    $("#Qtydiv").hide();
                    $("#LDPEdiv").hide();
                   
                }
               

            }
        });
        $("#LengthSel").bind("click focus change", function () {
          
           // var widthSel = $("#widthSel").find("option:selected").text();
           

            var widthSel = $("#widthSel").find("option:selected").text();
            var LengthSel = $("#LengthSel").find("option:selected").text();
            var subjectSel = $("#subject").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();
            var CustomLengthId = $("#CustomLengthId").val();
            var CustomWidthId = $("#CustomWidthId").val();

            $scope.GetWidthData(subjectSel, LengthSel);
            $scope.GetThicknessData(subjectSel, LengthSel, widthSel);
            if (LengthSel == "Select") {
                $("#Qtydiv").hide();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();

            }
            else if (LengthSel != "Select" && subjectSel == "AYUSH CUSHIONS" && thicknessSel != "Select" && widthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").show();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();
            }
            else if (LengthSel != "Select" && subjectSel == "BLOCKS" && thicknessSel != "Select" && widthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();

            }
            else if (LengthSel != "Select" && subjectSel == "MF ROLLS" && thicknessSel != "Select" && widthSel != "Select") {
                $("#Qtydiv").show();
                $("#LDPEdiv").hide();
                $("#CustomWidthId").hide();
                $("#CustomLengthId").hide();

            }
            else if (subjectSel == "CHIP FOAM SHEETS" || subjectSel == "LATEX LIKE FOAM SHEETS" || subjectSel == "MF SHEETS" || subjectSel == "PUF SHEETS") {
                if (LengthSel == "Custom Length") {
                    $("#Qtydiv").show();
                    $("#LDPEdiv").hide();
                    $("#CustomLengthId").show();

                }

                else if (LengthSel != "Custom Length" || LengthSel != "Select") {
                    $("#Qtydiv").show();
                    $("#LDPEdiv").hide();
                    $("#CustomLengthId").hide();

                }

                if (CustomLengthId.length > 0 || CustomWidthId.length > 0) {
                    $("#Qtydiv").show();
                    $("#LDPEdiv").show();


                }
                else {
                    $("#Qtydiv").hide();
                    $("#LDPEdiv").hide();

                }
            }
        });
        $scope.ChipFoamCalc = function (pieces, ChipThickness, widthSel, LengthSel, qty, Density) {
            var bundleheight = parseFloat(pieces * ChipThickness);
            // (Bundle Height / Thickness) * No of Quantity
            var piec = parseFloat(((bundleheight) / ChipThickness) * qty);
            $("#piecescal").text("Pieces : " + parseFloat(piec));
            var KGs = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (bundleheight / 1000)) * qty;
            var amt = parseFloat(KGs);
            $("#Volume").text("Volume : " + amt.toFixed(2));
            $("#volumecal").text(amt.toFixed(2));

            var Weight = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (ChipThickness / 1000) * Density) * qty;
            $("#Weightid").text(Weight);
        }
        $scope.PufcushionmCalc = function (pieces, ChipThickness, widthSel, LengthSel, qty, Density) {
            var bundleheight = parseFloat(pieces * ChipThickness);
            // (Bundle Height / Thickness) * No of Quantity
            var piec = parseFloat(((bundleheight) / ChipThickness) * qty);
            $("#piecescal").text("Pieces : " + parseFloat(piec));
            var KGs = (widthSel * 0.0254) * (LengthSel * 0.0254) * bundleheight / 1000 * qty;
            var amt = parseFloat(KGs);
            $("#Volume").text("Volume : " + amt.toFixed(2));
            $("#volumecal").text(amt.toFixed(2));

            var Weight = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (ChipThickness / 1000) * Density) * qty;
            $("#Weightid").text(Weight);
        }
        $scope.AyushCalc = function (pieces, ChipThickness, widthSel, LengthSel, qty, Density) {
            var bundleheight = parseFloat(pieces * ChipThickness);
            // (Bundle Height / Thickness) * No of Quantity
            var piec = parseFloat(((bundleheight) / ChipThickness) * qty);
            $("#piecescal").text("Pieces : " + parseFloat(piec));
            var KGs = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (bundleheight / 1000)) * qty;
            var amt = parseFloat(KGs);
            $("#Volume").text("Volume : " + amt.toFixed(2));
            $("#volumecal").text(amt.toFixed(2));

            var Weight = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (ChipThickness / 1000) * Density) * qty;
            $("#Weightid").text(Weight);
        }
       

        $scope.LATEXSHEETCalc = function (pieces, ChipThickness, widthSel, LengthSel, qty, Density) {

            var bundleheight = parseFloat(pieces * IsLatexsheetid);
            // (Bundle Height / Thickness) * No of Quantity
            var piec = parseFloat(((bundleheight) / IsLatexsheetid) * qty);
            $("#piecescal").text("Pieces : " + parseFloat(piec));
            var KGs = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (bundleheight / 1000)) * qty;
            var amt = parseFloat(KGs);
            $("#Volume").text("Volume : " + amt.toFixed(2));
            $("#volumecal").text(amt.toFixed(2));

            var Weight = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (IsLatexsheetid / 1000) * Density) * qty;
            $("#Weightid").text(Weight);
        }
        $scope.CalculatePiecevolume = function (qty) {


            var subjectSel = $("#subject").find("option:selected").text();
            var qty = qty;
            var LengthSel = $("#LengthSel").find("option:selected").text();
            var widthSel = $("#widthSel").find("option:selected").text();
            var Density = $("#Density").find("option:selected").text();
            var thicknessSel = $("#thicknessSel").find("option:selected").text();
            var ChipThickness = $("#IsFoamid").val();
            var CustomLengthId = $("#CustomLengthId").val();
            var CustomWidthId = $("#CustomWidthId").val();
            var IsLatexsheetid = $("#IsLatexsheetid").val();
            //---------------------------------------------------ITEM BASED BUNDLE CALCULATION----------------------------------------------------//
            if (subjectSel == "CHIP FOAM SHEETS") {

                if (LengthSel == "Custom Length" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.GetBundleCalculatepieces(subjectSel, CustomLengthId, widthSel, ChipThickness);
                }
                if (widthSel == "Custom Width" && LengthSel != "Custom Length" && LengthSel != "Select") {
                    $scope.GetBundleCalculatepieces(subjectSel, LengthSel, CustomWidthId, ChipThickness);
                }
                if (LengthSel == "Custom Length" && widthSel == "Custom Width") {
                    $scope.GetBundleCalculatepieces(subjectSel, CustomLengthId, CustomWidthId, ChipThickness);
                }
                if (LengthSel != "Custom Length" && LengthSel != "Select" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.GetBundleCalculatepieces(subjectSel, LengthSel, widthSel, ChipThickness);
                }

            }
            else if (subjectSel == "PUF CUSHIONS") {
                if (LengthSel != "Select" && widthSel != "Select") {
                    $scope.GetBundleCalculatepieces(subjectSel, LengthSel, widthSel, IsLatexsheetid);
                }
            }
            else if (subjectSel == "LATEX LIKE FOAM SHEETS" || subjectSel == "MF CUSHIONS" || subjectSel == "MF SHEETS") {
                if (LengthSel == "Custom Length" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.GetBundleCalculatepieces(subjectSel, CustomLengthId, widthSel, IsLatexsheetid);
                }
                if (widthSel == "Custom Width" && LengthSel != "Custom Length" && LengthSel != "Select") {
                    $scope.GetBundleCalculatepieces(subjectSel, LengthSel, CustomWidthId, IsLatexsheetid);
                }
                if (LengthSel == "Custom Length" && widthSel == "Custom Width") {
                    $scope.GetBundleCalculatepieces(subjectSel, CustomLengthId, CustomWidthId, IsLatexsheetid);
                }
                if (LengthSel != "Custom Length" && LengthSel != "Select" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.GetBundleCalculatepieces(subjectSel, LengthSel, widthSel, IsLatexsheetid);
                }
            }
            else if (subjectSel == "MF ROLLS") {
                $scope.GetBundleCalculatepieces(subjectSel, 0, widthSel, thicknessSel);
            }
            else {
                $scope.GetBundleCalculatepieces(subjectSel, LengthSel, widthSel, thicknessSel);

            }
            var pieces = $("#pieces").text();
            
            //---------------------------------------------------ITEM BASED BUNDLE CALCULATION----------------------------------------------------//
            if (LengthSel == "Custom Length" || widthSel == "Custom Width") {
               
                localStorage['STANDARD_ORDER'] = "";
                localStorage['STANDARD_ORDER'] = "NS";
            }
            else {
                localStorage['STANDARD_ORDER'] = "";
                localStorage['STANDARD_ORDER'] = "SO";
            }
            
            
            
            Density = Density.substring(1, 3);
            //---------------------------------------------------ITEM BASED QTY*PIECES CALCULATION----------------------------------------------------//



            if (subjectSel == "AYUSH CUSHIONS" ) {
                //var piece = pieces * qty;
                //$("#pieces").text(piece);

                //$("#piecescal").text("Pieces : " + parseFloat(piece));
                //var Volume = (LengthSel * 0.0254) * (widthSel * 0.0254) * thicknessSel / 1000 * piece;
                //var amt = parseFloat(Volume);
                //$("#Volume").text("Volume : " + amt.toFixed(2));
                //$("#volumecal").text(amt.toFixed(2));
                $scope.AyushCalc(pieces, thicknessSel, widthSel, LengthSel, qty, Density);
            }
            else if (subjectSel == "PUF CUSHIONS") {
               
                $scope.PufcushionmCalc(pieces, IsLatexsheetid, widthSel, LengthSel, qty, Density);
            }
            else if (subjectSel == "BLOCKS") {
                var piece = pieces * qty;
                $("#pieces").text(piece);

                // $("#piecescal").text("Pieces : " + parseFloat(piece));
                var KGs = ((widthSel * 0.0254) * (LengthSel * 0.0254) * (thicknessSel / 1000) * Density) * qty;
                var amt = parseFloat(KGs);
                $("#Volume").text("KGs : " + amt.toFixed(2));
                $("#volumecal").text(amt.toFixed(2));
            }
            //else if (subjectSel == "MF ROLLS") {
            //    var piece = pieces * qty;
            //    $("#pieces").text(piece);
                
            //    // $("#piecescal").text("Pieces : " + parseFloat(piece));
            //    var KGs = (((widthSel * 0.0254) * (thicknessSel / 1000) * (Density)) * pieces) * qty;
            //    var amt = parseFloat(KGs);
            //    $("#Volume").text("KGs : " + amt.toFixed(2));
            //    $("#volumecal").text(amt.toFixed(2));
               
            //    $("#Weightid").text(amt.toFixed(2));
                
            //}
            else if (subjectSel == "CHIP FOAM SHEETS") {
                if (LengthSel == "Custom Length" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.ChipFoamCalc(pieces, ChipThickness, widthSel, CustomLengthId, qty, Density);
                }
                if (widthSel == "Custom Width" && LengthSel != "Custom Length" && LengthSel != "Select") {
                    $scope.ChipFoamCalc(pieces, ChipThickness, CustomWidthId, LengthSel, qty, Density);
                }
                if (LengthSel == "Custom Length" && widthSel == "Custom Width") {
                    $scope.ChipFoamCalc(pieces, ChipThickness, CustomWidthId, CustomLengthId, qty, Density);
                }
                if (LengthSel != "Custom Length" && LengthSel != "Select" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.ChipFoamCalc(pieces, ChipThickness, widthSel, LengthSel, qty, Density);
                }

               
            }
            else if (subjectSel == "LATEX LIKE FOAM SHEETS" || subjectSel == "MF CUSHIONS" || subjectSel == "MF SHEETS" ) {
                if (LengthSel == "Custom Length" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.ChipFoamCalc(pieces, IsLatexsheetid, widthSel, CustomLengthId, qty, Density);
                }
                if (widthSel == "Custom Width" && LengthSel != "Custom Length" && LengthSel != "Select") {
                    $scope.ChipFoamCalc(pieces, IsLatexsheetid, CustomWidthId, LengthSel, qty, Density);
                }
                if (LengthSel == "Custom Length" && widthSel == "Custom Width") {
                    $scope.ChipFoamCalc(pieces, IsLatexsheetid, CustomWidthId, CustomLengthId, qty, Density);
                }
                if (LengthSel != "Custom Length" && LengthSel != "Select" && widthSel != "Custom Width" && widthSel != "Select") {
                    $scope.ChipFoamCalc(pieces, IsLatexsheetid, widthSel, LengthSel, qty, Density);
                }
            }
            else if (subjectSel == "MF ROLLS") {

                $("#piecescal").text("Pieces : " + parseFloat(piece));
                var KGs = (((widthSel * 0.0254) * (thicknessSel / 1000) * (Density)) * LengthSel) * piece;
                var amt = parseFloat(KGs);
                $("#Volume").text("KGs : " + amt.toFixed(2));
                $("#volumecal").text(amt.toFixed(2));
            }
            //---------------------------------------------------ITEM BASED QTY*PIECES CALCULATION----------------------------------------------------//

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
            var Weight = $("#Weightid").text();
            var CustomLengthId = $("#CustomLengthId").val();
            var CustomWidthId = $("#CustomWidthId").val();
            var ChipThickness = $("#IsFoamid").val();
            //-------------------------------------------------------------------------------------------------------------//
            if (subjectSel == "CHIP FOAM SHEETS") {
                if (LengthSel == "Custom Length" && LengthSel != "Select" && widthSel != "Custom Width" && widthSel != "Select") {
                    thicknessSel = ChipThickness;
                    LengthSel = CustomLengthId;
                   
                }
                if (widthSel == "Custom Width" && widthSel != "Select" && LengthSel != "Custom Length" && LengthSel != "Select") {

                   
                    thicknessSel = ChipThickness;
                    widthSel = CustomWidthId;
                }
                if (LengthSel == "Custom Length" && LengthSel != "Select" && widthSel == "Custom Width" && widthSel != "Select") {

                 
                    LengthSel = CustomLengthId;
                    thicknessSel = ChipThickness;
                    widthSel = CustomWidthId;
                }
                if (LengthSel != "Custom Length" && LengthSel != "Select" && widthSel != "Custom Width" && widthSel != "Select") {

                    thicknessSel = ChipThickness;

                }

            }
            //-------------------------------------------------------------------------------------------------------------//

            if (Flag == "Save") {


                //var postdt = "?Order" + Orders;
                var postData = "?ItemName=" + subjectSel + "&Grade=" + topicSel + "&Density=" + Density + "&PrimaryUOM=" + lblBundle + "&Lmax=" + LengthSel
                    + "&Wmax=" + widthSel + "&Tmax=" + thicknessSel + "&QTY=" + Qty + "&Pieces=" + pieces + "&LDPE=" + ldpe + "&DealerCode=" + dcode
                    + "&Volume=" + Volume + "&Weight=" + Weight + "&STANDARD_ORDER=" + localStorage['STANDARD_ORDER'] + "&OrderPlacedby=" + localStorage['ProfileName'];
                //var postData = "?ItemName=" + subjectSel + "&Grade=" + topicSel + "&Density=" + Density
                //    + "&PrimaryUOM=" + lblBundle + "&Lmax=" + LengthSel
                //    + "&Wmax=" + widthSel + "&Tmax=" + thicknessSel + "&QTY=" + Qty + "&Pieces=" + pieces + "&LDPE=" + ldpe;
               // var objs = {
                  //  ItemName: subjectSel, Grade: topicSel, Density: Density, Lmax: LengthSel, Wmax: widthSel, QTY: Qty, Pieces: pieces, LDPE: ldpe, DealerCode: dcode,
                   // Volume: Volume, Weight: Weight, STANDARD_ORDER: localStorage['STANDARD_ORDER'], OrderPlacedby: localStorage['UserId']
                //};

                var post = $http({
                    method: "GET",
                    url: "/api/SalesOrder/OrderCreate" + postData,  //OrderCreate "@Url.Action(OrderCreate, SalesOrder, new { area = '' })",//"/api/SalesOrder/OrderCreate",
                    dataType: 'json',
                    
                    headers: { "Content-Type": "application/json" }
                });
                post.success(function (response, status) {
                    if (response.data != "") {

                        // alert("Data Save Successfully");
                        $scope.GetItems();
                        if (response!="") {
                            alert(response);
                        }
                        else {
                            alert("Order Created Successfully");
                        }
                       
                    } else {
                        // alert("Some error");
                    }

                });
                post.error(function (response, status) {
                    //$window.alert(response.Message);
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
            var OrderId = localStorage["OrderHistoryId"];// $("#OrderIDForItemUpdate").val();
            var VehicleSel = $("#VehicleSel").find("option:selected").text();

            var Weight = $("#Weightid").text();
            //var Qty = $("#ttlqty").val();
            //var ldpe = $("input[name='ldpe']:checked").val();
            var piece = pieces;
            //var pieces = piece * Qty;
            //var lblBundle = $("#lblBundle").text();
            //var Volume = $("#volumecal").text();


            if (Flag == "Update") {


                //var postdt = "?Order" + Orders;
                var postData = "?Cust_Ref=" + Cust_Ref + "&Comments=" + Comments + "&VehicleCode=" + VehicleSel + "&PlantCode=" + PlantSel + "&CRD_Date=" + CRDDate
                    + "&Wmax=" + id + "&Tmax=" + Flag1 + "&QTY=" + qty + "&Pieces=" + piece + "&LDPE=" + '' + "&DealerCode=" + DealerCode + "&OrderID=" + OrderId + "&Volume=" + volume + "&Weight=" + Weight;
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
                    //$window.alert(response.Message);
                });


            }
        }
        $scope.ConfirmItem_SaveUpdate = function (Flag, DealerCode, Flag1, id) {
            var Comments = $("#CommentsId").val();
            var Cust_Ref = $("#Cus_refId").val();

            var CRDDate = $("#CRDDate").val();
            var PlantSel = $("#PlantSel").find("option:selected").text();
            var OrderId = localStorage["OrderHistoryId"];// $("#OrderIDForItemUpdate").val();
            var VehicleSel = $("#VehicleSel").find("option:selected").text();


            var Qty = $("#ttlqty").val();
            //var ldpe = $("input[name='ldpe']:checked").val();
            var piece = $("#ttlpieces").text();
            //var pieces = piece * Qty;
            //var lblBundle = $("#lblBundle").text();
            //var Volume = $("#volumecal").text();

            var Weight = $("#Weightid").text();
            if (Flag == "Update") {


                //var postdt = "?Order" + Orders;
                var postData = "?Cust_Ref=" + Cust_Ref + "&Comments=" + Comments + "&VehicleCode=" + VehicleSel + "&PlantCode=" + PlantSel + "&CRD_Date=" + CRDDate
                    + "&Wmax=" + id + "&Tmax=" + Flag1 + "&QTY=" + Qty + "&Pieces=" + piece + "&LDPE=" + '' + "&DealerCode=" + DealerCode + "&OrderID=" + OrderId + "&Weight=" + Weight;
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
                    //$window.alert(response.Message);
                });


            }
        }
        //--------------------------------------------------LOAD ORDER ITEMS--------------------------------------//
        $scope.GetItems = function () {
            $scope.ItemDetails = "";
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetItems" + "?DealerCode=" + localStorage['DealerCode'] + "&ProfileName=" + localStorage['ProfileNameItem'],
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.ItemDetails = response;

                if ($scope.ItemDetails.length > 0) {
                    $("#tblBykeLists td").parent().remove();
                    for (var i = 0; i < $scope.ItemDetails.length; i++) {
                        var item = "<i class='mdi mdi-delete text-danger pull-right' ng - click='removeItem($index)' role = 'button' tabindex = '0' ></i > ";
                        var itemname = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style='color: grey;margin: 0px'>Item : </span> " + $scope.ItemDetails[i].itemName + "</p> &nbsp;&nbsp;" + item + "</td></tr>";
                        var material = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style='color: grey; margin: 0px'>Material ID : </span> " + $scope.ItemDetails[i].materialID + "</p></td></tr>";
                        var lwt = "<tr style='border:0'><td style='border:0'><p class='ng-binding'><span ng-if='item.leng' class='ng - binding ng - scope''>L-" + $scope.ItemDetails[i].lmax + "</span> <span ng-if='item.width' class='ng-binding ng-scope'>W-" + $scope.ItemDetails[i].wmax + "</span><span ng-if='item.thickness' class='ng-binding ng-scope'> T-" + $scope.ItemDetails[i].tmax + "</span>&nbsp;&nbsp;&nbsp; <span style='color: grey; margin: 0px'>Qty</span> - " + $scope.ItemDetails[i].qty + "&nbsp;&nbsp;&nbsp; <span style = 'color: grey; margin: 0px'>LDPE</span> - " + $scope.ItemDetails[i].ldpe + "</p></td></tr>";
                        var pieces = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style='color: grey; margin: 0px' class='ng - binding'>Pieces</span> - " + $scope.ItemDetails[i].pieces + " &nbsp;&nbsp;<span style='color: grey; margin: 0px'>UOM</span> - " + $scope.ItemDetails[i].primaryUOM + "</p></td></tr>";
                        var volume = "<tr style='border:0'><td style='border:0'> <p class='ng-binding'><span style ='color: grey;margin: 0px'>Volume</span> - " + $scope.ItemDetails[i].volume + "</p><hr></td></tr>";
                        $("#tblBykeLists").append(itemname + material + lwt + pieces + volume);
                        //$("#tblBykeListsv").append(itemname + material + lwt + pieces + volume);

                        //----------------------//

                        $('#btnPreview').show();
                       
                    }

                    $scope.GetRepeatOrder();

                }
                else {

                    $('#btnPreview').hide();
                }
                $scope.IsVisible = true;
            });
            // post.error(function (response, status) {
            //  //$window.alert(response.Message);
            // });

        }
        $scope.GetRepeatOrder = function () {
            $scope.OrderDetails1 = "";
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetOrders" + "?DealerCode=" + localStorage['DealerCode'] + "&SearchName=" + localStorage['ProfileNameRepeatorder'],
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {

                $scope.OrderDetails1 = response;
                var gfd = "";
                if ($scope.OrderDetails1.length > 0) {
                    for (var i = 0; i < $scope.OrderDetails1.length; i++) {
                         gfd = "<tr class='ng - scope' ng-repeat='emps in OrderDetails1'><td class= 'ng-binding' >" + $scope.OrderDetails1[i].orderID + "</td > <td class='ng-binding'>" + $scope.OrderDetails1[i].orderDate
                            + "</td> <td class='ng-binding'> <a style='text-decoration: none' data-href='re' id='Orderitemgg'  class='ng-binding OrderId' tabindex='0'>Repeat Order</a></td></tr >"
                        $("#tblBykeListsv").append(gfd);
                    }
                    
                }
            });
        }
       
       
       
        $scope.GetParameterValues = function (param) { 
            var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < url.length; i++) {
                var urlparam = url[i].split('=');
                if (urlparam[0] == param) {
                    return urlparam[1];
                }
            }
        }  
        $scope.GetOrdersId = function () {
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var OrderIDForItem = localStorage["OrderHistoryId"];// $("#OrderIDForItemUpdate").val();
            //var id = GetParameterValues('id');

            //if (id != "" || id !=null) {
                //OrderIDForItem = id;
            //}
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetOrdersId" + "?DealerCode=" + localStorage['DealerCode'] + "&OrderId=" + OrderIDForItem  ,
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.GetOrdersId = response;
                if ($scope.GetOrdersId.length > 0) {
                    for (var i = 0; i < $scope.GetOrdersId.length; i++) {
                        $("#Cus_refId").val($scope.GetOrdersId[i].cust_Ref);
                        $("#CommentsId").val($scope.GetOrdersId[i].cust_Comments);
                        
                        var format3 = moment($scope.GetOrdersId[i].crD_Date).format('DD/MM/YYYY');

                        $("#CRDDate").val(format3.replace("01/01/1900", ""));

                        //$("#hdnstatus").val($scope.GetOrdersId[i].status);  && localStorage["ProfileName"] != "Admin"

                        if ($scope.GetOrdersId[i].status == "Confirm") {
                           
                            
                            $("#addNewItemBtn").hide();
                        }
                        else if ($scope.GetOrdersId[i].status == "Confirm" && localStorage["ProfileName"] == "Admin") {


                            $("#addNewItemBtn").show();
                        }
                        else {
                            $("#addNewItemBtn").show();


                        }
                        
                    }
                }
            });
            post.error(function (response, status) {
                //$window.alert(response.Message);
            });
        }
        $scope.GetOrdersIdhistory = function () {
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var OrderIDForItem = localStorage["OrderHistoryId"];// $("#OrderIDForItemUpdate").val();
            //var id = GetParameterValues('id');

            //if (id != "" || id !=null) {
            //OrderIDForItem = id;
            //}
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetOrdersId" + "?DealerCode=" + localStorage['DealerCode'] + "&OrderId=" + localStorage['OrderHistoryId'],
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.GetOrdersId = response;
                if ($scope.GetOrdersId.length > 0) {
                    for (var i = 0; i < $scope.GetOrdersId.length; i++) {
                        $("#Cus_refId").val($scope.GetOrdersId[i].cust_Ref);
                        $("#CommentsId").val($scope.GetOrdersId[i].cust_Comments);

                        var format3 = moment($scope.GetOrdersId[i].crD_Date).format('DD/MM/YYYY');

                        $("#CRDDate").val(format3.replace("01/01/1900", ""));

                        
                        if ($scope.GetOrdersId[i].status == "Confirm") {

                            
                            $("#addNewItemBtn").hide();
                            $("#ItemUpdateSave").hide();
                            $("#ItemUpdateConfirm").hide();
                        }
                        else if ($scope.GetOrdersId[i].status == "Confirm" && localStorage["ProfileName"] == "Admin") {


                            $("#addNewItemBtn").show();
                            $("#ItemUpdateSave").hide();
                            $("#ItemUpdateConfirm").hide();
                        }
                        else {
                            $("#addNewItemBtn").show();
                            $("#ItemUpdateSave").show();
                            $("#ItemUpdateConfirm").show();

                        }


                    }
                }
            });
            post.error(function (response, status) {
                //$window.alert(response.Message);
            });
        }
        $scope.GetItems_OrderHistoryDetails = function () {

            $scope.ItemDetails = "";
            var TQtysum = 0;
            var TPiecessum = 0;
            var TVolumesum = 0;
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetOrderHistory_Items" + "?OrderId=" + localStorage["OrderHistoryId"] + "&ProfileName=" + localStorage['ProfileNameItem'],
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.ItemDetails = response;
                var TQtysum = 0;
                var TPiecessum = 0;
                if ($scope.ItemDetails.length > 0) {
                    for (var i = 0; i < $scope.ItemDetails.length; i++) {
                        //----------------------//
                        $("#DealerCodeForItemUpdate").val("IN " + $scope.ItemDetails[i].dealerCode);
                        $("#OrderIDForItemUpdate").val($scope.ItemDetails[i].orderID);

                        //--------------Admin Edit Button Show/Hide-----------------------------//
                        $scope.ItemDetails[i].flag = localStorage['ProfileName'];
                        //--------------Admin Edit Button Show/Hide-----------------------------//

                        $("#ordid").text($scope.ItemDetails[i].orderID);
                        $("#orddate").text($scope.ItemDetails[i].orderDate);
                        $("#ordplacedby").text($scope.ItemDetails[i].orderPlacedBy);
                        $("#ordsalesperson").text($scope.ItemDetails[i].salesPerson);
                        // $("#ordplant").text($scope.ItemDetails[i].plantCode);

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
                        $scope.AdminProfileEnable();
                        $scope.GetOrdersIdhistory();
                        
                   
                    }

                }
                else {

                    $('#btnPreview').hide();
                }
                $scope.IsVisible = true;
                $scope.GetOrdersId();
                $scope.LoadVehicleDetails();
                if ($scope.ItemDetails[0].status == "Confirm") {
                    $("#ItemUpdateConfirm").hide();
                }
                else
                    $("#ItemUpdateConfirm").show();
            });
            // post.error(function (response, status) {
            //  //$window.alert(response.Message);
            // });

        }
        $scope.GetItemsDetails = function () {
        
            $scope.ItemDetails = "";
            var TQtysum = 0;
            var TPiecessum = 0;
            var TVolumesum = 0;
            var customer = '{OrderID: "' + $scope.Prefix + '" }';
            var post = $http({
                method: "POST",
                url: "/api/Orders/GetItems" + "?DealerCode=" + localStorage["DealerCode"] + "&ProfileName=" + localStorage['ProfileNameItem'],
                dataType: 'json',
                data: customer,
                headers: { "Content-Type": "application/json" }
            });
            post.success(function (response, status) {
                $scope.ItemDetails = response;
                var TQtysum = 0;
                var TPiecessum = 0;
                if ($scope.ItemDetails.length > 0) {
                    for (var i = 0; i < $scope.ItemDetails.length; i++) {
                        //----------------------//
                        $("#DealerCodeForItemUpdate").val("IN " + $scope.ItemDetails[i].dealerCode);
                        $("#OrderIDForItemUpdate").val($scope.ItemDetails[i].orderID);
                        localStorage["OrderHistoryId"] = "";
                        localStorage["OrderHistoryId"] = $scope.ItemDetails[i].orderID;
                        //--------------Admin Edit Button Show/Hide-----------------------------//
                        $scope.ItemDetails[i].flag = localStorage['ProfileName'];
                        //--------------Admin Edit Button Show/Hide-----------------------------//
                      
                        $("#ordid").text($scope.ItemDetails[i].orderID);
                        $("#orddate").text($scope.ItemDetails[i].orderDate);
                        $("#ordplacedby").text($scope.ItemDetails[i].orderPlacedBy);
                        $("#ordsalesperson").text($scope.ItemDetails[i].salesPerson);
                       // $("#ordplant").text($scope.ItemDetails[i].plantCode);

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
                        $scope.AdminProfileEnable();
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
            //  //$window.alert(response.Message);
            // });

        }

        //---------------------------------------------LOAD VEHICLE DETAILS----------------------//

        //------------------------------------------------LOAD PLANT-------------------------------//
        //$scope.GetPlant = function () {

        //--------------------------------------------//
        $("#btnOrderSaves").bind("click", function () {

            $scope.AddCart_SaveUpdate("Save", localStorage['DealerCode']);


        });
        $("#btnPreview").bind("click", function () {
            var OrderIDForItem = localStorage["OrderHistoryId"];// $("#OrderIDForItemUpdate").val();
            localStorage["OrderHistoryId"] = "";
            localStorage["OrderHistoryId"] = id;
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
                        $(this).html("Do You Want To Save?");
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
                    $(this).html("Are You Sure Want To Confirm?");
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
                //$window.alert(response.Message);
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
                //$window.alert(response.Message);
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
                //$window.alert(response.Message);
            });
        }

        $scope.RemoveItem = function (id) {
            event.preventDefault();
            $('<div title="Order Confirmation"></div>').dialog({
                open: function (event, ui) {
                    $(this).html("Are You Sure Want To Delete?");
                },
                close: function () {
                    $(this).remove();
                },
                resizable: false,
                height: 140,
                modal: true,
                buttons: {
                    'Yes': function () {


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
                            //$window.alert(response.Message);
                        });
                    },
                    'No': function () {
                        $(this).dialog('close');

                    }
                }
            });
            
        }



        $scope.UpdateItem = function (id, qty,pieces,volume) {
            $scope.AddItem_SaveUpdate("Update", localStorage['DealerCode'], 'Itemupdate', id, qty, pieces, volume);
            
          

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
            var ItemName = $(this).closest("tr").find("td:eq(9)").text();
            var lmax = $(this).closest("tr").find("td:eq(10)").text();
            var wmax = $(this).closest("tr").find("td:eq(11)").text();
            var tmax = $(this).closest("tr").find("td:eq(12)").text();
            var density = $(this).closest("tr").find("td:eq(13)").text();

            var grade = $(this).closest("tr").find("td:eq(14)").text();

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
                    //$window.alert(response.Message);
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

            if (btn.text() === "Edit") {
                td.html("<input  class='identifier' type='number' style='width:45px'  value=" + currentValue + " />");
                btn.html("Save");
               // $('.cancel', row).show();
                
              
            }
           
            else {
                var qty = td.find("input").val();
                btn.html("Edit");
               
                //var d = $(this).closest('tr').find(".editable").attr('qtyid');
                var td = $(this).closest("tr").find(".editable");
                //alert(d);
                if (currentValue) {
                    td.html(currentValue);

                    $(this).parent().find(".edit").html("Edit");
                    //currentValue = null;
                }
                //alert(df);
                //alert($(this).closest("tr").find("td:eq(7)").text());
                var itemid = $(this).closest("tr").find("td:eq(8)").text();
                //var qty = $(this).closest("tr").find("td:eq(3)").text();
                $scope.UpdateItem(itemid, qty, $(this).closest("tr").find("td:eq(5)").text(), $(this).closest("tr").find("td:eq(6)").text());
                $scope.GetItemsDetails();
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

                $(this).parent().find(".edit").html("Edit");
                currentValue = null;
               // $('.cancel', row).hide();

            }

        });

        $scope.LoadOrder_History = function (id) {
            $("#hdnordid").val(id);
            localStorage["OrderHistoryId"] = "";
            localStorage["OrderHistoryId"] = id;
            var url = $("#RedirectToOrderDetails").val();
            location.href = url +"?id="+id;
           // $scope.GetOrderHistoryId(id);
           
        }
      

        $scope.selectAddress = (index,Address) => {
            //for (let i = 0; i < $scope.shipping_addresses.length; i++)
            
            var ordid = localStorage["OrderHistoryId"];// $("#OrderIDForItemUpdate").val(); 
               // if (i != index) {
                   //$scope.shipping_addresses[i].selected = false;
                    
              var posttt = "?Item1=" + ordid + "&Item=" + Address + "&DealerCode=" + localStorage['DealerCode'];
            var ordid = localStorage["OrderHistoryId"];// $("#OrderIDForItemUpdate").val();
                    var items = $http(
                        {
                            method: 'POST',
                            url: '/api/Orders/ChangeShippingAddress' + posttt,  /*You URL to post*/
                            dataType: 'json',
                            headers: {
                                "Content-Type": "application/json"
                            },
                        });
                    items.success(function (response, status) {
                        $scope.shipping_addresses = response;
                        $("#ShippingAdd").text($scope.shipping_addresses[0].address);
                       // alert("Shipping Address has been Changed");
                        //for (let i = 0; i < $scope.shipping_addresses.length; i++)
                        //    if (i != index) $scope.shipping_addresses[i].selected = false;
                        //    else {
                        //        $scope.shipping_addresses[i].selected = true;
                        //        $scope.config.shipping_address = $scope.shipping_addresses[i].address;
                        //        alert("Shipping Address has been Changed");
                        //        //$scope.config.ship_to_code = $scope.shipping_addresses[i].ShipToCode;
                        //       // $scope.config.delivery_location = $scope.shipping_addresses[i].DeliveryLocation || '';
                        //    }
                        $scope.Loadshipping_addresses();
                    });
                    items.error(function (response, status) {
                        // //$window.alert(response.Message);
                    });
                //}
                
        }
        $scope.Loadshipping_addresses = function (item) {
            var items = $http(
                {
                    method: 'POST',
                    url: '/api/Orders/LoadShippingAddress' + "?DealerCode=" + localStorage['DealerCode'],  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            items.success(function (response, status) {
                $scope.shipping_addresses = response;

                $("#shipping_address .close").click()
                //$('#shipping_address').modal('toggle');
            });
            items.error(function (response, status) {
               // //$window.alert(response.Message);
            });
        }

        $("#modeladdress").bind("click", function () {

          //  $('#shipping_address').modal('show');


        });

        $("#FoamOrder_Menuid").bind("click", function () {
            $scope.Foamorderclick();
          
        });

        $scope.Foamorderclick = function () {
            var a = "hi";
            var b = "hi1";
            var c = localStorage['ProfileName'];
            if (localStorage['ProfileName'] == "Admin" || localStorage['ProfileName'] == "FactoryAdmin" || localStorage['ProfileName'] == "SalesPerson") {
                var url = $("#RedirectToCustomelist").val();
                location.href = url;
                $scope.GetAllCustomers();
            }
            else {
                var url = $("#RedirectToOrderCreation").val();
                location.href = url;

            }
         
        }

        $scope.LoadingMenu = function () {
            if (localStorage['ProfileName'] == "Admin") {

            }
            else {

            }
        }

        $("#btnlogin").bind("click", function () {

            var url = $("#RedirectToOrderDetails").val();
           
            localStorage.clear();
            localStorage['DealerCode'] = "";
            localStorage['ProfileName'] = "";
            localStorage['DealerCode'] = $("#UserId").val()
            var dcode = localStorage['UserId'] = $("#UserId").val();
            var dddd = $("#ProfileName").find("option:selected").text();
            localStorage['ProfileName'] = dddd; 
            //---------------------------------------------------------------------------//
            var result = "";
             $scope.LoginCheck = "";
            var items = $http(
                {
                    method: 'POST',
                    url: '/api/Login/LoginCheck' + "?Name=" + dddd + "&DealerName=" + dcode,  /*You URL to post*/
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/json"
                    },
                }); 
            items.success(function (response, status) {
                $scope.LoginCheck = response;
                if ($scope.LoginCheck[0].resultErrorMsg == "1") {
                    if (dddd == "Admin" && dcode == "Admin") {
                        localStorage['UserId'] = "";

                        localStorage['ProfileNameRepeatorder'] = "";
                        localStorage['ProfileNameRepeatorder'] = "Repeatorder_Admin";
                        localStorage['ProfileNameItem'] ="";
                        localStorage['ProfileNameItem'] = "Item_Admin";

                        location.href = url + "?UserId=" + $("#UserId").val() + "&ProfileName=" + dddd;
                        
                    }
                    else if (dddd == "Customer" && dcode != "Admin") {
                        localStorage['UserId'] = dcode;

                        localStorage['ProfileNameRepeatorder'] = "";
                        localStorage['ProfileNameRepeatorder'] = "Repeatorder_Customer";
                        localStorage['ProfileNameItem'] = "";

                        localStorage['ProfileNameItem'] = "Item_Customer";

                        location.href = url + "?UserId=" + $("#UserId").val() + "&ProfileName=" + dddd;
                    }
                    else if (dddd == "FactoryAdmin" && dcode != "Admin") {
                        localStorage['UserId'] = dcode;

                        localStorage['ProfileNameRepeatorder'] = "";
                        localStorage['ProfileNameRepeatorder'] = "Repeatorder_FactoryAdmin";
                        localStorage['ProfileNameItem'] = "";

                        localStorage['ProfileNameItem'] = "Item_FactoryAdmin";

                        location.href = url + "?UserId=" + $("#UserId").val() + "&ProfileName=" + dddd;
                    }
                    else if (dddd == "SalesPerson" && dcode != "Admin") {
                        localStorage['UserId'] = dcode;

                        localStorage['ProfileNameRepeatorder'] = "";
                        localStorage['ProfileNameRepeatorder'] = "Repeatorder_SalesPerson";
                        localStorage['ProfileNameItem'] = "";

                        localStorage['ProfileNameItem'] = "Item_SalesPerson";

                        location.href = url + "?UserId=" + $("#UserId").val() + "&ProfileName=" + dddd;
                    }
                }
                else {
                    alert($scope.LoginCheck[0].resultErrorMsg);

                }
               
                

            });
            items.error(function (response, status) {
                // //$window.alert(response.Message);
            });
            //---------------------------------------------------------------------------//
           
        });
       
       
               
    });

$(document).ready(function () {
   
    $('#OrdrHistoryTbfl').delegate('td', 'click', function () {

        var url = $("#RedirectToOrderDetails").val();
        location.href = url;
    });
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
        //localStorage['DealerCode'] = "";
       // localStorage.clear();
        localStorage['DealerCode'] = text;
    });
  
      
    
    //jQuery('#library tr').click(function (e) {
    //    e.stopPropagation();
    //    var $this = jQuery(this);
    //    var trid = $this.closest('tr').attr('id');
    //});

    //$(document).ready(function () {
       
    //});
    //$("#FoamOrder_Menuid").click(function () {
    //    alert("The paragraph was clicked.");
    //});
    //$(".MenuFoamId a").live('click', function (e) {
    //    if (DealerCode_Id != null && ProfileName_Id == "Customer") {
    //        var url = $("#RedirectToOrderCreation").val();
    //        location.href = url;
    //    }
    //    else if (DealerCode_Id != null && ProfileName_Id == "Customer") {
    //        $scope.GetAllCustomers();
    //    }
    //});

});

  
// Case-insensitive searching (Note - remove the below script for Case sensitive search )
$.expr[":"].contains = $.expr.createPseudo(function (arg) {
    return function (elem) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});


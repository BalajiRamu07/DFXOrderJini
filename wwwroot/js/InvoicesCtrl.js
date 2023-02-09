/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("InvoicesCtrl",function ($scope, $filter, $http, $window, Settings ,$location) {
        console.log("Hello From Invoices Controller .... !!!!");

        var invoiceSearchObj = {};
        var initialViewBy = 60;

        $scope.newViewBy = 10;
        $scope.viewLength = 0;
        var localViewBy = $scope.newViewBy;
        $scope.invoiceSearch = {};
        $scope.invoice = {};
        $scope.paymentInv = {};
        $scope.invoiceClients = [];
        $scope.invoice.items = [];
        var instanceDetails =  Settings.getInstance();

        $scope.razorPayModeStatus = false;
        instanceDetails.paymentModes.map(mode => {
            if(mode.name == 'Razorpay'){
                $scope.razorPayModeStatus = mode.active;
            }
        })

        $scope.user = {};
        Settings.getUserInfo(user => {
            $scope.user = user;
        })

        Settings.getNav(false, function(nav){
            $scope.nav = nav;
            instanceDetails =  Settings.getInstance();
            $scope.coID = instanceDetails.coID;
        });

        var invoiceSearchBy = ['salesperson','customername','invoiceId'];

        $scope.refreshInvoices = function(){
            if($scope.invoiceSearch.startDate && $scope.invoiceSearch.endDate){
                if (($scope.invoiceSearch.startDate - $scope.invoiceSearch.endDate) > 0){
                    Settings.alertPopup("WARNING", "Start date cannot be greater than End date.");

                    $scope.invoiceSearch.startDate = new Date();
                    $scope.invoiceSearch.startDate.setDate($scope.invoiceSearch.startDate.getDate() - 7);
                    $scope.invoiceSearch.startDate.setHours(0, 0, 0, 0);
                    $scope.invoiceSearch.endDate = new Date();
                    $scope.invoiceSearch.endDate.setHours(23, 59, 59, 59);

                }

            }

            $scope.DateTimeFormat = function (date_added, when) {

                if (date_added) {
                    //This is to format the date in dd-mm-yy hh:mm:ss format, also padding 0's if values are <10 using above function
                    var date = new Date(date_added);
                    if (when == 'start') date.setHours(0, 0, 0, 0);
                    else if (when == 'end') date.setHours(23, 59, 59, 999);
                    var dformat = [date.getFullYear(), (date.getMonth() + 1).padLeft(), date.getDate().padLeft()].join('-') + ' '
                        + [date.getHours().padLeft(), date.getMinutes().padLeft(), date.getSeconds().padLeft()].join(':');

                    return (dformat);
                }
                else
                    return 0;
            };

            $scope.viewLength = 0;
            invoiceSearchObj.viewLength = 0;
            invoiceSearchObj.sDate = $scope.DateTimeFormat($scope.invoiceSearch.startDate, 'start');
            invoiceSearchObj.eDate = $scope.DateTimeFormat($scope.invoiceSearch.endDate, 'end');
            invoiceSearchObj.viewBy = initialViewBy;
            invoiceSearchObj.searchFor = '';
            invoiceSearchObj.searchBy = [];
            $scope.newViewBy = parseInt(localViewBy);
            $scope.invoiceReport = [];
            $scope.invoiceDealerPaidAmt = [];

            jQuery.noConflict();
            $('.refresh').css("display", "inline");
                if($scope.user.role == "Manager"){
                    $http.post("/dash/fetch/invoices",invoiceSearchObj).success(function (response) {
                    if(response && response.length){
                        $scope.invoiceReport = response;
                        var totalAmount = 0;
                        $scope.invoice_paid_amt = 0;
                        $scope.invoice_due_amt = 0;
                        $scope.invoice_total = 0;
                        for (var i = 0; i < response.length; i++) {
                            response[i].displayRed = false;
                            if(response[i].date) {
                                let todaysDate = $scope.dateFormatedays(new Date());
                                let myArray = response[i].date;
                                let invoiceDate = myArray.split(" ");
                                if (response[i].dealername && response[i].dealername.PaymentTerms) {
                                    $scope.diffDays = parseInt((Date.parse(todaysDate) - Date.parse(invoiceDate[0])) / (1000 * 60 * 60 * 24), 10);
                                    if ($scope.diffDays > response[i].dealername.PaymentTerms) {
                                        response[i].displayRed = true;
                                    } else {
                                        response[i].displayRed = false;
                                    }
                                }
                            }

                            if(response[i].invoiceDetails && response[i].invoiceDetails.total)
                            totalAmount += response[i].invoiceDetails.total;
                            if(response[i].invoiceDetails && response[i].invoiceDetails.payment){
                                if(response[i].invoiceDetails.payment.length ){
                                    var last = response[i].invoiceDetails.payment[response[i].invoiceDetails.payment.length - 1];
                                    // console.log("Last Payment ---> ", last.total_paid_amt);
                                    $scope.invoiceDealerPaidAmt.push(last);
                                }
                            }
                        }


                        $scope.invoiceReport = response;
                        $scope.invoice_total = totalAmount;
                        $scope.invoice_due_amt = totalAmount;

                        if($scope.invoiceDealerPaidAmt.length){
                            for(var i=0; i<$scope.invoiceDealerPaidAmt.length; i++){
                                $scope.invoice_due_amt = parseFloat($scope.invoice_due_amt) -  parseFloat($scope.invoiceDealerPaidAmt[i].total_paid_amt);
                                $scope.invoice_paid_amt = parseFloat($scope.invoice_paid_amt) + parseFloat($scope.invoiceDealerPaidAmt[i].total_paid_amt);
                            }
                        }else{
                            if(response[0].invoiceDetails && response[0].invoiceDetails.total) {
                                $scope.invoice_due_amt = response[0].invoiceDetails.total;
                            }
                        }
                    }
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
                }else{
            $http.post("/dash/fetch/invoices",invoiceSearchObj).success(function (response) {
                if(response && response.length){
                    $scope.invoiceReport = response;

                    var totalAmount = 0;
                    $scope.invoice_paid_amt = 0;
                    $scope.invoice_due_amt = 0;
                    $scope.invoice_total = 0;
                    for(var i=0; i<response.length; i++){
                        totalAmount += response[i].total;
                        response[i].displayRed = false;
                        let todaysDate = $scope.dateFormatedays(new Date());
                        let  myArray = response[i].date
                        let invoiceDate  = myArray.split(" ");

                    if(response[i].dealername && response[i].dealername.PaymentTerms) {
                        $scope.diffDays = parseInt((Date.parse(todaysDate) - Date.parse(invoiceDate[0])) / (1000 * 60 * 60 * 24), 10);
                        if( $scope.diffDays > response[i].dealername.PaymentTerms ){
                            response[i].displayRed = true;
                        }else{
                            response[i].displayRed = false;
                        }
                    }

                        if( response[i].payment){
                            if(response[i].payment.length ){
                                var last = response[i].payment[response[i].payment.length - 1];
                                // console.log("Last Payment ---> ", last.total_paid_amt);
                                $scope.invoiceDealerPaidAmt.push(last);
                            }
                        }
                    }
                    $scope.invoiceReport = response;
                    $scope.invoice_total = totalAmount;
                    $scope.invoice_due_amt = totalAmount;

                    if($scope.invoiceDealerPaidAmt.length){
                        for(var i=0; i<$scope.invoiceDealerPaidAmt.length; i++){
                            $scope.invoice_due_amt = parseFloat($scope.invoice_due_amt) -  parseFloat($scope.invoiceDealerPaidAmt[i].total_paid_amt);
                            $scope.invoice_paid_amt = parseFloat($scope.invoice_paid_amt) + parseFloat($scope.invoiceDealerPaidAmt[i].total_paid_amt);
                        }
                    }else{
                        $scope.invoice_due_amt = response[0].total;
                    }
                }
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
                }
        };

        $scope.item = {};
        $scope.addInvoiceTab = function (flag) {
            if (flag) {

                $scope.addInvoice1 = false;
            }
            else {
                $scope.addInvoice1 = true;
                $scope.invoice.items = [];
                $scope.addInvoice3 = {};
                $scope.item.Product = '';
                $scope.invoice.total = '';
                $scope.invoice.customername = '';
                $scope.invoice.customerAddress = '';
                $scope.invoice.customer_code = '';
                $scope.invoice.salesperson = '';
                $scope.invoicedealer = {};
                $scope.displayloader = false;
            }
        };


        const loadInvoices = invoiceSearchObj => {
            $http.post("/dash/fetch/invoices", invoiceSearchObj)
                .then(res => {
                    $scope.invoiceReport = res.data;
                })
                .catch(function(error, status){
                    console.log(error, status);
                    if(status >= 400 && status < 404)
                        $window.location.href = '/404';
                    else if(status >= 500)
                        $window.location.href = '/500';
                    else
                        $window.location.href = '/404';
                });

        $http.post("/dash/fetch/invoices/count", invoiceSearchObj)
            .success(function(res) {
                $scope.transactionCount(res);
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


        $scope.clearFilter = function(){
            $scope.multipleInvoices = [];
            $scope.viewLength = 0;
            $scope.newViewBy = parseInt(localViewBy);

            invoiceSearchObj.viewLength = 0;
            invoiceSearchObj.viewBy = initialViewBy;
            invoiceSearchObj.searchFor = '';
            invoiceSearchObj.searchBy = [];
            invoiceSearchObj.dealercode = '';

            $scope.invoiceSearch.filter = '';
            $scope.invoiceSearch.idFilter = '';
            $scope.invoiceSearch.startDate = '';
            $scope.invoiceSearch.endDate = '';

            $scope.invoiceReport = [];
            $scope.invoiceGetDealer = [];
            $scope.refreshInvoices();

            loadInvoices(invoiceSearchObj);
            
            $scope.showInvoiceFilter = false;
        }

        $scope.searchDealer = function(text){

            if(text.length >= 3 && text){
                $scope.displayloader = false;
                $http.get("/dash/stores/search/"+text)
                    .success(function(res){
                        if(res) {
                            $scope.showPjpDealersSearch = true;
                            if(text.length >=3){
                                console.log('searchDealer 1',res)
                                $scope.searchDealerCount = res.length;
                                $scope.newDealers = res;

                                $scope.viewLength = 0;
                                $scope.newViewBy = localViewBy;

                                if ( $scope.searchDealerCount < localViewBy) {
                                    $scope.newViewBy = $scope.searchDealerCount;
                                }
                                jQuery.noConflict();
                                $(".dealerDropdown").css('display', 'block')
                            }else{
                                $scope.viewLength = -1;
                                $scope.newViewBy = 0;
                                $scope.searchDealerCount = 0;
                                $scope.newDealers = [];
                                jQuery.noConflict();
                                $(".dealerDropdown").css('display', 'none')
                            }
                        }else{

                            $scope.searchDealerCount = $scope.dealer_count;
                            $scope.newDealers = $scope.serviceClients;

                            $scope.viewLength = 0;
                            $scope.newViewBy = localViewBy;

                            if ( $scope.searchDealerCount < localViewBy) {
                                $scope.newViewBy = $scope.searchDealerCount;
                            }
                            jQuery.noConflict();
                            $(".dealerDropdown").css('display', 'none');
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
            else{
                if(text){
                    $scope.displayloader = true;
                }else {
                    $scope.displayloader = false;
                }

                $scope.searchDealerCount = $scope.dealer_count;
                $scope.newDealers = $scope.serviceClients;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

                if ( $scope.searchDealerCount < localViewBy) {
                    $scope.newViewBy = $scope.searchDealerCount;
                }

                jQuery.noConflict();
                $(".dealerDropdown").css('display', 'none')
            }
            // console.log('reslast',$scope.newDealers);
        };

    
        var a = 0;
        $scope.navPage = function(tab, direction){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;

            if(direction){
                console.log("NEXT");
                if(viewLength + viewBy >= $scope.invoiceReport.length){
                    if(viewLength + viewBy < $scope.invoice_count){
                        viewLength += viewBy;

                        invoiceSearchObj.viewLength = viewLength;
                        invoiceSearchObj.viewBy = initialViewBy;
                        invoiceSearchObj.sDate = $scope.DateTimeFormat($scope.invoiceSearch.startDate, 'start');
                        invoiceSearchObj.eDate = $scope.DateTimeFormat($scope.invoiceSearch.endDate, 'end');
                        invoiceSearchObj.searchFor = ($scope.invoiceSearch.filter ? $scope.invoiceSearch.filter : $scope.invoiceSearch.idFilter );
                        invoiceSearchObj.searchBy = invoiceSearchBy;

                        jQuery.noConflict();
                        $('.refresh').css("display", "inline");
                        $http.post("/dash/fetch/invoices",invoiceSearchObj).success(function (response) {

                            for(var i=0; i<response.length; i++){
                                $scope.invoiceReport.push(response[i]);
                            }


                            if(viewLength + viewBy > $scope.invoice_count){
                                a = viewLength + viewBy - $scope.invoice_count;
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

                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                    }
                    else{
                        //console.log("Out of data")
                        if(viewLength + viewBy > $scope.invoice_count){
                            a = viewLength + viewBy - $scope.invoice_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    //console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.invoice_count){
                        a = viewLength + viewBy - $scope.invoice_count;
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
                    if(viewLength + viewBy >= $scope.invoice_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        };


        $scope.clearInvoices = function(){
            $scope.invoice = {};
            $scope.addInvoice3 = {};
            $scope.item.Product = '';
            $scope.invoice.total = '';
            $scope.invoice.customername = '';
            $scope.invoice.customerAddress = '';
            $scope.invoice.customer_code = '';
            $scope.invoice.salesperson = '';
            $scope.invoice.items = [];
            $scope.invoicedealer = {};
            $scope.displayloader = false;
        };

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

        $scope.generateInvoiceNumber = function(callback){
            const zeroPad = (num, places) => String(num).padStart(places, '0');
            var invoiceNumber = instanceDetails.invoiceID ?instanceDetails.invoiceID : 'INV';
            var date = new Date();
            var year = date.getFullYear();
            year = year.toString().substr(-2);
            var financialYear  = year+'-'+(parseInt(year)+1);
            // console.log(financialYear)
            var id

            $http.post("/dash/settings/invoice/set/id", {id : 'INV'})
                .success(function(res){
                    console.log(res)
                    if(res){
                        if(res.value){
                            id = invoiceNumber+"/"+financialYear+"/"+zeroPad(res.value.invoiceID, 5);
                            callback(id)
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
        }

        //formate date
        $scope.dateFormate = function(date){
            return dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
                + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
        }

        $scope.dateFormatedays = function(date){
            return dformat = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' ';
        }

        // invoice dealer searchable
        $scope.selectDealerInvoice = function(dealer){
            $scope.invoiceDealerPaidAmt = [];

            if(dealer){
                jQuery.noConflict();
                $('.refresh').css("display", "inline");

                invoiceSearchObj.viewLength = 0;
                invoiceSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

                invoiceSearchObj.searchFor = '';
                invoiceSearchObj.searchBy = invoiceSearchBy;
                invoiceSearchObj.dealercode = dealer.Dealercode;

                $scope.invoiceGetDealer =[];

                $http.post("/dash/fetch/invoices", invoiceSearchObj).success(function (res) {
                    $scope.invoiceSearch.filter = dealer.DealerName;
                    $scope.invoiceReport = [];
                    $scope.viewLength = 0;
                    $scope.newViewBy = parseInt(localViewBy);
                    var temp = 0;
                    $scope.invoice_total = 0;
                    $scope.invoice_paid_amt = 0;
                    for(var i = 0; i < res.length; i++){
                        $scope.invoice_total += res[i].total;
                        if( res[i].payment){
                            if(res[i].payment.length ){
                                var last = res[i].payment[res[i].payment.length-1];
                                $scope.invoiceDealerPaidAmt.push(last);
                            }
                        }
                    }
                    if($scope.invoiceDealerPaidAmt.length) {
                        for (var i = 0; i < $scope.invoiceDealerPaidAmt.length; i++) {
                            temp = parseFloat(temp) + parseFloat($scope.invoiceDealerPaidAmt[i].total_paid_amt);
                            $scope.invoice_due_amt = $scope.invoice_total - temp;
                            $scope.invoice_paid_amt = parseFloat($scope.invoice_paid_amt) + parseFloat($scope.invoiceDealerPaidAmt[i].total_paid_amt);
                        }
                    }else{
                        $scope.invoice_paid_amt = 0;
                        $scope.invoice_due_amt =  $scope.invoice_total;
                    }

                    $scope.invoiceReport = res;
                    $scope.transactionCount(res.length);
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

                $http.post("/dash/fetch/invoices/count", invoiceSearchObj)
                    .success(function(res) {
                        $scope.transactionCount(res);
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
                jQuery.noConflict();
                $('.refresh').css("display", "none");
            }

            jQuery.noConflict();
            $(".dealerDropdown").css('display', 'none');
            $('#deviceSearchBar').val('');
        };

        //invoices tab 34
        $scope.createInvoices = function(res){
            if (res.customername) {
                if (res.items.length) {

            var date = new Date();
            $scope.tempObj = {};
            $scope.tempObj = res;

            if(!res.date){
                $scope.tempObj.date = $scope.dateFormate(date);
            }else{
                var date = res.date;
                $scope.tempObj.date = $scope.dateFormate(date);
            }

            $scope.tempObj.seller = res.seller ? res.seller : $scope.user.seller;
            $scope.tempObj.salesperson = res.salesperson ? res.salesperson : $scope.user.username;


            $scope.generateInvoiceNumber(function(id){
                $scope.tempObj.invoiceId = id;
                        if(id){
                    $http.post("/dash/invoices/", $scope.tempObj)
                        .success(function (response) {
                            if (response) {
                                Settings.alertPopup("SUCCESS", "Successfully Created Invoice");
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
                    })


                } else {
                    Settings.alertPopup("ERROR", "Please Enter Items");
                }
            } else {
                Settings.alertPopup("ERROR", "Please Enter Dealer");
            }
            $scope.invoice = {};
            $scope.invoice.items = [];
            $scope.refreshInvoices();
        }


        $scope.addInvoice3 = {}
        $scope.saveInvoices = function(){
            if(Object.keys($scope.addInvoice3).length && $scope.addInvoice3.invoiceProduct !=''  && $scope.addInvoice3.invoiceProduct != undefined ){
                if($scope.addInvoice3.invoiceMrp != '' && $scope.addInvoice3.invoiceMrp != undefined ){
                    if($scope.addInvoice3.quantity != '' && $scope.addInvoice3.quantity != undefined){
                        $scope.invoice.items.push($scope.addInvoice3);
                        $scope.addInvoice3 = {};
                        $scope.item.Product = '';
                    }else{
                        Settings.alertPopup("ERROR", "Please Enter Quantity");
                    }
                }else{
                    Settings.alertPopup("ERROR", "Please Enter Price");
                }

            }else{
                Settings.alertPopup("ERROR", "Please Enter Items");
            }

        }


        $scope.addInvoiceMrp = function(data){
            $scope.invoice.total = 0;
            $scope.invoice.totalQty = 0;
            if(data){
                $scope.invoice.items = data;
            }
            for(var i = 0; i < $scope.invoice.items.length; i++){
                $scope.invoice.total  += $scope.invoice.items[i].invoiceMrp * $scope.invoice.items[i].quantity;
                $scope.invoice.totalQty = parseFloat($scope.invoice.totalQty) + parseFloat($scope.invoice.items[i].quantity)

            }
            return $scope.invoice.total;
            $scope.invoice.items = [];
            $scope.item.Product = '';
        }


        $scope.invoicedealer = {};
        // invoice dealer prefilled
        $scope.selectInvoice = function(details){
            $scope.invoice.dealername = details;
            $scope.invoice.customerAddress = details.Address;
            $scope.invoice.customername = details.DealerName;
            $scope.invoice.customer_code = details.Dealercode || 0;
            $scope.invoicedealer.dealer = details.DealerName;



            jQuery.noConflict();
            $(".dealerDropdown").css('display', 'none');
            // $('#invoiceDealerSearchBar').val('');
        }
        //end



        // /Apply invoice filter
        $scope.invoiceGetDealer = [];
        $scope.invoiceSearchFilter = function(data)
        {
            if(data){
                jQuery.noConflict();
                $('.refresh').css("display", "inline");


                invoiceSearchObj.viewLength = 0;
                invoiceSearchObj.viewBy = initialViewBy;

                $scope.viewLength = 0;
                $scope.newViewBy = localViewBy;

                invoiceSearchObj.searchFor = data;
                invoiceSearchObj.searchBy = invoiceSearchBy;


                $scope.invoiceGetDealer =[];

                $http.post("/dash/fetch/invoices", invoiceSearchObj).success(function (response) {
                    $scope.invoiceGetDealer = response;
                    jQuery.noConflict();
                    $(".userDropdown").css('display', 'block')
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

                $http.post("/dash/fetch/invoices/count", invoiceSearchObj)
                    .success(function(res) {
                        $scope.transactionCount(res);
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


                $scope.showInvoiceFilter = true;

                if($scope.invoiceSearch.idFilter == '')
                    $scope.showInvoiceFilter = false;

                setTimeout(function(){
                    $('.refresh').css("display", "none");
                }, 2000);
            }else{
                $scope.invoiceGetDealer =[];
                $scope.clearFilter();
            }

        };

        $scope.invoiceGetDealer = [];

        //.... Invoice Customer Search Filter.....
        $scope.invoiceDealerSearchFilter = function(data) {
            //... Show Refresh ....
            jQuery.noConflict();
            $('.refresh').css("display", "inline");

            $scope.invoiceGetDealer = [];

            if(data){
                $http.get("/dash/stores/search/" + data)
                    .then(res => {
                        $scope.invoiceGetDealer = res.data;
                        jQuery.noConflict();
                        $(".dealerDropdown").css('display', 'block');
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

                $scope.showInvoiceFilter = true;

                if($scope.invoiceSearch.filter == '')
                    $scope.showInvoiceFilter = false;

                setTimeout(function(){
                    $('.refresh').css("display", "none");
                }, 2000);
            }else{
                $('.refresh').css("display", "none");
                $scope.clearFilter();
            }
        };

        $scope.refreshInvoices();

        /*=======delete selected items for invoice=====*/
        $scope.deleteSelectedItems = function(index,data){
            $scope.addInvoice3 = {};
            Settings.confirmPopup("CONFIRM", "Are you sure?", function(result){
                if(result){
                    $scope.invoice.items.splice(index,1);
                    $scope.addInvoice3 = $scope.invoice.items;
                    $scope.addInvoiceMrp($scope.addInvoice3)
                }
            });
        }

        $scope.multipleInvoices = [];
        $scope.multipleInvoice = function (invoice,value) {
            // console.log("invoice multiple ", invoice, value)
            if(value){
                $scope.multipleInvoices.push(invoice);
            }else{
                var idx = $scope.multipleInvoices.indexOf(invoice);
                if (idx > -1) {
                    $scope.multipleInvoices.splice(idx, 1);
                }
            }
        }

        $scope.invoiceProceedToPayment = function(){
            console.log('proceed to pay')
            if($scope.multipleInvoices.length){
                let totalInvoiceAmt = 0;
                let invoiceIds = [];
                let dataObj = {};
                $scope.multipleInvoices.map((i)=> {
                    totalInvoiceAmt += i.total;
                    invoiceIds.push(i.invoiceId);
                })
                
                dataObj.amount = totalInvoiceAmt;
                dataObj.invoiceIds = invoiceIds;
                $scope.makeRazorpayPayment(dataObj, $scope.multipleInvoices)
            }
        }

        $scope.makeRazorpayPayment = function (data, newOrder) {
            console.log("razor pay");
            console.log('Amt : ', data.amount);
            var body = {};
            var options = {
                "amount": parseInt(data.amount * 100),
                "currency": 'INR',
                "payment_capture": "1"
            };
            body.options = options;
            $http.post("/razorpay/order", body).then(function (order) {
                if (order.data && !order.data.message && !order.data.error) {
                    // console.log('order ', order);
                    let orderInv = {};
                    let date = new Date();
                    let dateform = $scope.dateFormate(date)
                    var options = {
                        "key": order.data.key_id,
                        "amount": order.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                        "currency": order.data.currency,
                        "name": data.storeName || "Invoice",
                        // "description": "Invoices",
                        "order_id": order.data.id,
                        "handler": function (response) {
                            // console.log("Razor pay log")
                            //  console.log(response)
                            if (response) {
                                orderInv.orderId =  $scope.generateOrderId();
                                orderInv.razorpay_payment_id = response.razorpay_payment_id;
                                orderInv.razorpay_order_id = response.razorpay_order_id;
                                orderInv.razorpay_signature = response.razorpay_signature;
                                orderInv.paymentStatus = "Paid";
                                orderInv.dealercode = $scope.multipleInvoices.length ? $scope.multipleInvoices[0].customer_code : '';
                                orderInv.dealername = '';
                                orderInv.dealerphone = '';
                                orderInv.seller = $scope.user.seller;
                                orderInv.sellername = $scope.user.username;
                                orderInv.quantity = data.amount;
                                orderInv.invoiceIds = data.invoiceIds;
                                orderInv.type = 'Payment';
                                orderInv.itemcode = 'OTS';
                                orderInv.medicine = 'RazorPay'
                                orderInv.date_added = dateform;

                                $http.post("/razorpay/payment/verify", orderInv).then(function (res) {
                                    if (res.data) {
                                        console.log(res.data);
                                        var paymentData = res.data;
                                        orderInv.amount_refunded = paymentData.amount_refunded;
                                        orderInv.bank = paymentData.bank;
                                        orderInv.error_code = paymentData.error_code;
                                        orderInv.error_description = paymentData.error_description;
                                        orderInv.error_reason = paymentData.error_reason;
                                        orderInv.error_source = paymentData.error_source;
                                        orderInv.international = paymentData.international;
                                        orderInv.method = paymentData.method;
                                        orderInv.invoice_id = paymentData.invoice_id;
                                        orderInv.refund_status = paymentData.refund_status;
                                        orderInv.vpa = paymentData.vpa;
                                        orderInv.wallet = paymentData.wallet;
                                        
                                        /*
                                       Post order and Put payment details into orders collection
                                         */

                                       if($scope.multipleInvoices.length){
                                            for(let i=0; i< $scope.multipleInvoices.length; i++){
                                                $scope.tempObj = {};
                                                console.log('$scope.user', $scope.user);
                                                
                                                $scope.tempObj.invoiceId = $scope.multipleInvoices[i].invoiceId;
                                                $scope.tempObj.Payment = {
                                                    'paid_Amt': $scope.multipleInvoices[i].total,
                                                    'balance_amt': 0,
                                                    'total_paid_amt': $scope.multipleInvoices[i].total,
                                                    'date': dateform,
                                                    'payment_Id': $scope.generateOrderId(),
                                                    'type': "RazorPay",
                                                    'razorpay_payment_id': response.razorpay_payment_id,
                                                    'razorpay_order_id' : response.razorpay_order_id,
                                                    'sellername': $scope.user.username ? $scope.user.username : 'Portal',
                                                    'sellerphone': $scope.user.sellerphone ? $scope.user.sellerphone : 'Portal',
                                                }
        
                                                $http.post("/dash/invoice/updatePayment",$scope.tempObj)
                                                .success(function(response) {
                                                    //  Settings.success_toast("SUCCESS", "Payment Recorded Successfully!");
                                                    //  $scope.paymentInv = {};
                                                    //  $scope.fetchinvoicedata(invoice_id);
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

                                       let invPayment = [];
                                       invPayment.push(orderInv);
                                       $http.post("/dash/orders/" + orderInv.orderId, invPayment)
                                            .success(function (response) {
                                                Settings.successPopup('SUCCESS', 'Payment Successful!');
                                                $scope.clearFilter();
                                                $scope.multipleInvoices = [];
                                            //   console.log("post dash order from invoice details", response);
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
                        }
                    };
                    const rzp1 = Razorpay(options);
                    rzp1.open();
                } else if (order.data.statusCode) {
                    Settings.failurePopup("Error", order.data.error.description);
                } else {
                    if (order.data.message)
                        Settings.failurePopup("Error", order.data.message);
                    else
                        Settings.failurePopup("Error", 'Something went wrong! Please contact Admin.');
                }
            })
        }

        /*==========taxable items/ change gst=========*/
        $scope.changeGSTForInvoiceItems = function(order, gst){
            $scope.invoice.total = 0;
            $scope.invoice.totalQty = 0;

            if(gst){
                $scope.invoice.items.quantity = order.quantity;
                for(var i=0; i< $scope.invoice.items.length; i++){
                    $scope.invoice.items[i].GST = gst;
                    $scope.invoice.items[i].qbId = gst.qbId;
                    $scope.invoice.total  += $scope.invoice.items[i].invoiceMrp * $scope.invoice.items[i].quantity;
                    $scope.invoice.totalQty = parseFloat($scope.invoice.totalQty) + parseFloat($scope.invoice.items[i].quantity);
                    $scope.invoice.items[i].taxableMrp = (($scope.invoice.items[i].invoiceMrp  / (gst.cgst + gst.sgst + gst.igst + 100)) * 100) * $scope.invoice.items[i].quantity ;
                    $scope.invoice.items[i].cgst = ($scope.invoice.items[i].taxableMrp * gst.cgst) / 100;
                    $scope.invoice.items[i].sgst = ($scope.invoice.items[i].taxableMrp * gst.sgst) / 100;
                    $scope.invoice.items[i].igst = ($scope.invoice.items[i].taxableMrp * gst.igst) / 100;

                }
            }else{
                $scope.invoice.items.quantity = order.quantity;
                for(var i=0; i< $scope.invoice.items.length; i++){

                    $scope.invoice.items[i].cgst = 0;
                    $scope.invoice.items[i].sgst = 0;
                    $scope.invoice.items[i].igst = 0;
                    $scope.invoice.items[i].qbId = 0;
                    $scope.invoice.total  += $scope.invoice.items[i].invoiceMrp * $scope.invoice.items[i].quantity;
                    $scope.invoice.totalQty = parseFloat($scope.invoice.totalQty) + parseFloat($scope.invoice.items[i].quantity);
                    $scope.invoice.items[i].taxableMrp =
                        (($scope.invoice.items[i].quantity  * $scope.invoice.items[i].invoiceMrp) /
                        (100 + $scope.invoice.items[i].cgst + $scope.invoice.items[i].sgst + $scope.invoice.items[i].igst)) * 100;


                }
            }
        }

        // invoice dealer searchable
        $scope.selectInvoiceNumber = function(details){
            $scope.invoiceReport = [];
            $scope.viewLength = 0;
            $scope.newViewBy = parseInt(localViewBy);
            $scope.invoiceSearch.idFilter = details.invoiceId;
            $scope.invoice_total = details.total;
            if(details.payment){
                var last = details.payment[details.payment.length-1];
                $scope.invoice_paid_amt = last.total_paid_amt;
                $scope.invoice_due_amt = last.balance_amt;
            }else{
                $scope.invoice_paid_amt = 0;
                $scope.invoice_due_amt = $scope.invoice_total;
            }
            $scope.invoiceReport.push(details);
            $scope.transactionCount($scope.invoiceReport.length);

            jQuery.noConflict();
            $(".userDropdown").css('display', 'none');
            $('#deviceSearchBar').val('');

        };

        /*user search and dropdown*/
        $scope.searchInvoiceUser = function(text){


            if(text.length >= 2 && text){
                $http.get("/dash/user/search/"+text)
                    .success(function(res){
                        if(res) {
                            $scope.roleSalesrep = res;
                        }

                        jQuery.noConflict();
                        $(".userDropdown").css('display', 'block')
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
            }else{
                jQuery.noConflict();
                $(".userDropdown").css('display', 'none')
            }

            // console.log('reslast',$scope.newDealers);
        };

        $scope.selectInvoiceUser = function(details){
            $scope.invoice.salesperson = details.sellername;
            $scope.invoice.seller = details.sellerphone;

            jQuery.noConflict();
            $(".userDropdown").css('display', 'none')
            $('#invoiceSearchBar').val('');
        };

        //invoice dealer details prfilled
        $scope.selectItem = function(search){
            if(search){
                $http.get("/dash/item/search/"+search).success(function(res){
                    $scope.allInvoiceItems = res;
                    jQuery.noConflict();
                    $(".productDropdown").css('display', 'block');
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
            }else{
                $scope.addInvoice3 = {};
            }
            jQuery.noConflict();
            $(".productDropdown").css('display', 'none');
        };

        $scope.selectBankName = function(temp){
            $scope.paymentInv.bankName = temp;


            jQuery.noConflict();
            $(".userDropdown").css('display', 'none');
            $('#invoiceSearchBar1').val('');
        };



        $scope.fetchinvoicedata = function(id){
            var body = {};
            body.id = id;

            var url = encodeURIComponent(id)

            $http.post("/dash/fetchInvoice/"+url).success(function(response){
                $scope.invoicedetails1 = response;
                if($scope.invoicedetails1){
                if($scope.invoicedetails1.payment){
                    var last = $scope.invoicedetails1.payment[$scope.invoicedetails1.payment.length-1];
                    $scope.orderBalance_amt = last.balance_amt;
                }else{
                    $scope.orderBalance_amt = $scope.invoicedetails1.total;
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
        }

        //invoices tab 34

        $scope.selectInvoiceItem = function(item){
            $scope.addInvoice3.invoiceProduct = item.Product;
            $scope.item.Product = item.Product;
            $scope.addInvoice3.invoiceDescription = item.Pack;
            $scope.addInvoice3.invoiceMrp = item.MRP;
            $scope.addInvoice3.itemCode = item.itemCode;
            $scope.addInvoice3.cgst = item.CGST;
            $scope.addInvoice3.igst = item.IGST;
            $scope.addInvoice3.sgst = item.SGST;
            $scope.addInvoice3.quantity = 1;

            jQuery.noConflict();
            $(".productDropdown").css('display', 'none');
        };
        //end

        $scope.transactionCount = function(response) {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.invoice_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.invoice_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.invoiceReport = [];
                    $scope.newViewBy = 1;
                    $scope.invoice_count = 0;
                    $scope.viewLength = -1;
                }
            }
            else{
                $scope.invoiceReport = [];
                $scope.newViewBy = 1;
                $scope.invoice_count = 0;
                $scope.viewLength = -1;
            }
        };

        $http.post("/dash/fetch/invoices/count", invoiceSearchObj)
            .success(function(res) {
                $scope.transactionCount(res);
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
        //
        // $scope.invoiceForm();

        $http.get("/dash/memberDetail").success(function(response){
            $scope.memberdetails = response;
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

        if( !$scope.invoiceSearch.startDate && !$scope.invoiceSearch.endDate ){
            $scope.showInvoiceFilter = false;
        }else{
            $scope.showInvoiceFilter = true;
        }


        $scope.fetchDetails = function (invoice){
            var url = encodeURIComponent(invoice)
            $location.path('/invoice-details/'+ url);
        }

        $scope.pointingOrderDetails = function (orderId){
            $location.path('/order-details/'+ orderId);
        }

    })
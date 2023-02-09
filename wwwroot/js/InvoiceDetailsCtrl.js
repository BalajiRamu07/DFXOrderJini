/**
 * Created by shreyasgombi on 10/03/20.
 */

angular.module('ebs.controller')

    .controller("InvoiceDetailsCtrl",function ($scope, $filter, $http, $routeParams, $window, Settings) {
        console.log("Hello from Invoice Details Ctrl ..... !!!!");

        var invoice_id = $routeParams.invoice_id;
        $scope.invoicedetails1 = [];
        $scope.bankNames = [];
        $scope.payment = {};
        $scope.payment.type = "NEFT";

        $http.get("/dash/memberDetail").success(function(response){
            $scope.memberdetails = response;
           // console.log("response",response);
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

        var invoiceDetails = Settings.getInstance();
        $scope.country = invoiceDetails.country.toLowerCase() || 'india';
        console.log("Fetching Invoice Details for - ", invoice_id);
        $scope.recordPaymentFlag = invoiceDetails.recordPaymentFlag || false;

        $scope.backToBrowserHistory = function() {
            $window.history.back();
        };

        $scope.taxCalc = function(value)
        {
            var with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
            // rounded = with2Decimals;
            return Number(with2Decimals);
        }

        $scope.fetchinvoicedata = function (invoice_id) {

            $http.post("/dash/fetchInvoice/"+invoice_id
            ).success(function(response){
                $scope.invoicedetails1 = response[0];
                if($scope.invoicedetails1.ghana_Tax) {
                    $scope.newOrderExcTaxNHIL = parseFloat((($scope.invoicedetails1.totalTaxableMrp * $scope.invoicedetails1.ghana_Tax.NHIL) / 100).toFixed(2));
                    $scope.newOrderExcTaxGETL = parseFloat((($scope.invoicedetails1.totalTaxableMrp * $scope.invoicedetails1.ghana_Tax.GETL) / 100).toFixed(2));
                    $scope.newOrderExcTaxVAT = parseFloat((($scope.invoicedetails1.totalTaxableMrp * $scope.invoicedetails1.ghana_Tax.VAT) / 100).toFixed(2));
                    $scope.newOrderExcTaxCOVID = parseFloat((($scope.invoicedetails1.totalTaxableMrp * $scope.invoicedetails1.ghana_Tax.COVID) / 100).toFixed(2));
                }
                $http.get("/dash/orders/" + response[0].orderId)
                    .success( function(res) {
                        if(res.length){
                            if(res[0].country != 'ghana'){
                                $scope.invoicedetails1.orderTotal = Math.round(res[0].orderTotal);
                            }
                            if(res[0].country == 'ghana'){
                                $scope.invoicedetails1.orderTotal = res[0].orderTotal;
                            }
                        }
                    });


                $http.post("/dash/fetchInvoice/"+response[0].orderId
                ).success(function(data) {
                    $scope.invoicedetails1.total_paid_amt = 0;
                    for(var i = 0; i< data.length; i++){
                        if(data[i].payment){
                            var last = data[i].payment[data[i].payment.length-1];
                            $scope.invoicedetails1.total_paid_amt = Number($scope.invoicedetails1.total_paid_amt) + Number(last.total_paid_amt);
                        }
                    }
                });

                if($scope.invoicedetails1){


                if( $scope.country == 'ghana'){
                    $scope.invoicedetails1.subTotal =   (parseFloat($scope.invoicedetails1.total) -  parseFloat($scope.invoicedetails1.freight));
                  //  $scope.invoicedetails1.total = Math.round($scope.invoicedetails1.total)
                    $scope.invoicedetails1.total = $scope.invoicedetails1.total;
                }else {
                    $scope.invoicedetails1.subTotal =  $scope.invoicedetails1.total;
                  // $scope.invoicedetails1.total = (Math.round($scope.invoicedetails1.total) + Math.round($scope.invoicedetails1.freight))
                    $scope.invoicedetails1.total =  $scope.invoicedetails1.total +  $scope.invoicedetails1.freight;
                }

                    $scope.invoicedetails1.order_total_words = convertNumberToWords($scope.invoicedetails1.total);


                }



                if($scope.invoicedetails1.payment){
                    var last = $scope.invoicedetails1.payment[$scope.invoicedetails1.payment.length-1];
                    if($scope.invoicedetails1.items[0].country != 'ghana'){
                        $scope.orderBalance_amt = Math.round(last.balance_amt);
                    }
                    if($scope.invoicedetails1.items[0].country == 'ghana'){
                        $scope.orderBalance_amt = last.balance_amt;
                    }

                }else{
                    if($scope.invoicedetails1.items[0].country != 'ghana') {
                        $scope.orderBalance_amt = Math.round($scope.invoicedetails1.total);
                    }
                    if($scope.invoicedetails1.items[0].country == 'ghana'){
                        $scope.orderBalance_amt = parseFloat($scope.invoicedetails1.total);
                    }
                }

                window.setTimeout(function(){
                    $( document ).ready(function() {
                        if($scope.invoicedetails1.signatureResponse && $scope.invoicedetails1.signatureResponse.QR_CODE){
                            var qrcode = new QRCode(document.getElementById("InvoiceGhanaQRcode"), {
                                text: $scope.invoicedetails1.signatureResponse.QR_CODE,
                                width: 128,
                                height: 128,
                            });
                            
                            var qrcode = new QRCode(document.getElementById("downloadInvoiceGhanaQRcode"), {
                                text: $scope.invoicedetails1.signatureResponse.QR_CODE,
                                width: 128,
                                height: 128,
                            });
                        }
                    });
                }, 0);
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

        $scope.fetchinvoicedata(invoice_id);


        $scope.formatDate = function(date){
            if(date)
                return new Date(date);
            else return date;
        };

        /*===bank names====*/

        $scope.searchBankName = function(text){

            if(text.length >= 2 && text){
                $http.get("/dash/invoice/fetch/bankName/"+text)
                    .success(function(res){
                        if(res.length) {
                            if(res[0])
                                $scope.bankNames = res[0].bankNames;
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

        };

        $scope.eInvoiceIntegration = {};
        if($scope.country == 'ghana')
        $http.get("/dash/settings/invoice/integration/status")
                .then(eInvoiceIntegration => {
                    console.log('eInvoice data', eInvoiceIntegration)
                    if(eInvoiceIntegration.data){
                        $scope.eInvoiceIntegration = eInvoiceIntegration.data;
                    }else{
                        $scope.eInvoiceIntegration = {};
                    }
                })
                .catch((error, status) => {
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

        /*=========record invoice payment========*/

        $scope.setPaymentType = function (type) {
            if(type){
                $scope.invoicePaymentType = type;
            }
        }

        $scope.invoicePayment = function(res,data,tab){
            var date = new Date();
            var dateform = [date.getFullYear(), (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate() < 10 ? '0' + date.getDate() : date.getDate()].join('-') + ' '
                + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');


            $scope.tempObj = {};
            var temp = {};
            temp.orderId =  $scope.generateOrderId();
            if(res.orderId){
                temp.order_Id = res.orderId;
            }
            if(res.payment){
                var last = res.payment[res.payment.length-1];
                if(res.items[0].country != 'ghana') {
                    if ($scope.paymentInv.payments <= Math.round(last.balance_amt)) {
                        var bal_amt = Math.round(parseFloat((last.balance_amt - $scope.paymentInv.payments).toFixed(2)));
                        var total_pay = parseFloat(last.total_paid_amt) + parseFloat($scope.paymentInv.payments);
                        $scope.tempObj.Payment = {
                            'paid_Amt': data.payments,
                            'balance_amt': bal_amt,
                            'total_paid_amt': total_pay,
                            'orderTotal': Math.round(res.orderTotal),
                            'date': dateform,
                            'payment_Id': $scope.generateOrderId(),
                            'type': $scope.invoicePaymentType,
                            'sellername': $scope.user.username ? $scope.user.username : 'Portal'
                        }
                    } else {
                        Settings.alertPopup("ERROR", "Payment should not be more than due amount");

                        $scope.paymentInv.payments = '';
                    }
                }
                if(res.items[0].country == 'ghana'){
                    if ($scope.paymentInv.payments <= last.balance_amt) {
                        var bal_amt = (parseFloat((last.balance_amt - $scope.paymentInv.payments).toFixed(2)));
                        var total_pay = parseFloat(last.total_paid_amt) + parseFloat($scope.paymentInv.payments);
                        $scope.tempObj.Payment = {
                            'paid_Amt': data.payments,
                            'balance_amt': bal_amt,
                            'total_paid_amt': total_pay,
                            'orderTotal': res.orderTotal,
                            'date': dateform,
                            'payment_Id': $scope.generateOrderId(),
                            'type': $scope.invoicePaymentType,
                            'sellername': $scope.user.username ? $scope.user.username : 'Portal'
                        }
                    } else {
                        Settings.alertPopup("ERROR", "Payment should not be more than due amount");

                        $scope.paymentInv.payments = '';
                    }
                }

            }else{
                if(res.items[0].country != 'ghana'){
                    if($scope.paymentInv.payments <= Math.round($scope.invoicedetails1.total)){
                        var bal_amt = Math.round(parseFloat(($scope.invoicedetails1.total - $scope.paymentInv.payments).toFixed(2)));
                        var total_pay = $scope.paymentInv.payments;
                        $scope.tempObj.Payment = {
                            'paid_Amt':data.payments,
                            'balance_amt': bal_amt,
                            'total_paid_amt' : total_pay,
                            'orderTotal' : Math.round(res.orderTotal),
                            'date':dateform,
                            'payment_Id': $scope.generateOrderId(),
                            'type': $scope.invoicePaymentType,
                            'sellername':$scope.user.username ? $scope.user.username : 'Portal'
                        }
                    }else{
                        Settings.alertPopup("ERROR", "Payment should not be more than due amount");

                        $scope.paymentInv.payments = '';
                    }
                }
                if(res.items[0].country == 'ghana'){
                    if($scope.paymentInv.payments <= (parseFloat(($scope.invoicedetails1.total).toFixed(2)))){
                        var bal_amt = parseFloat((parseFloat(($scope.invoicedetails1.total).toFixed(2))) - $scope.paymentInv.payments);
                        var total_pay = $scope.paymentInv.payments;
                        $scope.tempObj.Payment = {
                            'paid_Amt':data.payments,
                            'balance_amt': bal_amt,
                            'total_paid_amt' : total_pay,
                            'orderTotal' : res.orderTotal,
                            'date':dateform,
                            'payment_Id': $scope.generateOrderId(),
                            'type': $scope.invoicePaymentType,
                            'sellername':$scope.user.username ? $scope.user.username : 'Portal'
                        }
                    }else{
                        Settings.alertPopup("ERROR", "Payment should not be more than due amount");

                        $scope.paymentInv.payments = '';
                    }
                }
            }

            $scope.tempObj.invoiceId = res.invoiceId;
            res.total_paid_amt  = Number(res.total_paid_amt) + Number($scope.tempObj.Payment.paid_Amt);
            if($scope.tempObj.Payment.orderTotal){
                if(res.total_paid_amt >= $scope.tempObj.Payment.orderTotal){
                    temp.paymentStatus = 'paid';
                }else if(res.total_paid_amt == 0){
                    temp.paymentStatus = 'unpaid';
                }else if(res.total_paid_amt < $scope.tempObj.Payment.orderTotal){
                    temp.paymentStatus = 'partially paid';
                }
            }else {
                if (bal_amt <= 0) {
                    temp.paymentStatus = 'paid';
                }
                // else if(total_pay > 0 ){
                //     temp.paymentStatus ='partially paid';
                // }
                else {
                    temp.paymentStatus = 'unpaid';
                }
            }



            temp.dealercode = res.dealername.Dealercode;
            temp.dealername = res.dealername.DealerName;
            temp.dealerphone = res.dealername.Phone;
            temp.seller = res.seller ? res.seller : $scope.user.seller;
            temp.sellername = res.salesperson ? res.salesperson : $scope.user.username;
            temp.type = 'Payment';
            if(res.payment){
                temp.quantity = data.payments;
            }else{
                temp.quantity = $scope.paymentInv.payments;
            }
            temp.invoiceId = res.invoiceId;


            temp.date_added = dateform;
            temp.comment = [];
            temp.comment.push({'comment':data.comment ? data.comment : 'N/A'});
            if($scope.invoicePaymentType == 'Cash'){
                temp.medicine = $scope.invoicePaymentType;
                temp.itemcode = 'XXX';
            }
            if($scope.invoicePaymentType == 'Cheque'){
                temp.medicine = $scope.invoicePaymentType;
                temp.itemcode = 'YYY';
                temp.bankname =  data.bankName;
                temp.chequenum = data.chequeNumber;
            }

            if($scope.invoicePaymentType == 'Others'){
                temp.medicine = $scope.payment.type;
                temp.itemcode = 'OTS';
                temp.bankname =  data.bankName;
                temp.chequenum = data.chequeNumber;
            }

            var invPayment = [];
            invPayment.push(temp);

            if($scope.tempObj.Payment != undefined){

              //  console.log("payment status", $scope.tempObj);
                $http.post("/dash/invoice/updatePayment",$scope.tempObj)
                    .success(function(response) {
                        Settings.success_toast("SUCCESS", "Payment Recorded Successfully!");
                        $scope.paymentInv = {};

                        $scope.fetchinvoicedata(invoice_id);
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


                $http.post("/dash/orders/" + temp.orderId, invPayment)
                    .success(function (response) {
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
            //to  Update the paymentstatus
                var payment_status = {
                    status : temp.paymentStatus
                }
                $http.put("/dash/orders/payment/status/" + temp.order_Id,payment_status)
                    .success(function (response) {
                        //console.log("post dash order from payment details", response);
                    })
                    // .error(function(error, status){
                    //     console.log(error, status);
                    //     if(status >= 400 && status < 404)
                    //         $window.location.href = '/404';
                    //     else if(status >= 500)
                    //         $window.location.href = '/500';
                    //     else
                    //         $window.location.href = '/404';
                    // });


            }


        }

        //******** fetch payment data *******
        $scope.fetchpaymentdata = function(id){
            var body={};
            body.id = id;

            $http.post("/dash/Invoice/payment/fetch",body).success(function(response){
                $scope.invoicePaymentDetails = response.payment[0];
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

        $scope.selectBankName = function(temp){
            $scope.paymentInv.bankName = temp;
            $scope.bankNames = [];
        };

        $scope.modeOfInvoicePayment = function (type) {
            $scope.invoicePaymentType = type;

            $scope.invoiceCashView = false;
            $scope.invoiceChequeView = false;
            $scope.invoiceOtherView = false;
            if(type == 'Cash'){
                $scope.invoiceCashView = true;
            }else if(type == 'Cheque'){
                $scope.invoiceChequeView = true;
            }else if(type == 'Others'){
                $scope.invoiceOtherView = true;
            }

        };

        //..... generate YBank payment link .........
        $scope.generatePaymentLink = function() {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
            $http.post("/dash/ybank/generate/link",$scope.invoicedetails1).then(function(response){
                console.log(response)
                if(response.data.smartUrl){
                    $scope.payment_url = response.data.smartUrl;
                }
                else if(response.data.error){
                    Settings.failurePopup('Error', response.data.message);
                }
                jQuery.noConflict();
                $('.refresh').css("display", "none");
            })
        }

        //.... send payment link via mail to customers ......
        $scope.emailPaymentLink = function() {
            var body = {
                payment_link : $scope.payment_url,
                email : $scope.invoicedetails1.dealername.email
            }

            $http.post("/dash/ybank/email/link", body).then(function(response) {
                console.log(response)
            })
        }

    // ..... convert numbers to words ....
        function convertNumberToWords(amount) {
            var words = new Array();
            words[0] = '';
            words[1] = 'One';
            words[2] = 'Two';
            words[3] = 'Three';
            words[4] = 'Four';
            words[5] = 'Five';
            words[6] = 'Six';
            words[7] = 'Seven';
            words[8] = 'Eight';
            words[9] = 'Nine';
            words[10] = 'Ten';
            words[11] = 'Eleven';
            words[12] = 'Twelve';
            words[13] = 'Thirteen';
            words[14] = 'Fourteen';
            words[15] = 'Fifteen';
            words[16] = 'Sixteen';
            words[17] = 'Seventeen';
            words[18] = 'Eighteen';
            words[19] = 'Nineteen';
            words[20] = 'Twenty';
            words[30] = 'Thirty';
            words[40] = 'Forty';
            words[50] = 'Fifty';
            words[60] = 'Sixty';
            words[70] = 'Seventy';
            words[80] = 'Eighty';
            words[90] = 'Ninety';
            amount = amount.toString();
            var atemp = amount.split(".");
            var number = atemp[0].split(",").join("");
            var n_length = number.length;
            var words_string = "";
            if (n_length <= 9) {
                var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                var received_n_array = new Array();
                for (var i = 0; i < n_length; i++) {
                    received_n_array[i] = number.substr(i, 1);
                }
                for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                    n_array[i] = received_n_array[j];
                }
                for (var i = 0, j = 1; i < 9; i++, j++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        if (n_array[i] == 1) {
                            n_array[j] = 10 + parseInt(n_array[j]);
                            n_array[i] = 0;
                        }
                    }
                }
                value = "";
                for (var i = 0; i < 9; i++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        value = n_array[i] * 10;
                    } else {
                        value = n_array[i];
                    }
                    if (value != 0) {
                        words_string += words[value] + " ";
                    }
                    if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Crores ";
                    }
                    if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Lakhs ";
                    }
                    if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Thousand ";
                    }
                    if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                        words_string += "Hundred and ";
                    } else if (i == 6 && value != 0) {
                        words_string += "Hundred ";
                    }
                }
                words_string = words_string.split("  ").join(" ");
            }
            return words_string;
        }


    });
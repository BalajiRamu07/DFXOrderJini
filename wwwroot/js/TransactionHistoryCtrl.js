/**
 * Created by shreyasgombi on 27/09/22.
 */

 angular.module('ebs.controller')
 .controller("TransactionHistoryCtrl",function ($scope, $filter, $http, Settings, $modal, $window) {
        console.log("Hello From Inventory Transaction History Controller .... !!!!");

        //.... Transactions....
        $scope.transactions = [];
        $scope.transaction_count = 0;
        
        const initialViewBy = 60;
        
        $scope.viewLength = 0;
        $scope.newViewBy = 10;

        $scope.transaction_filter = {};
        $scope.transaction_filter.startDate = new Date();
        $scope.transaction_filter.startDate.setDate($scope.transaction_filter.startDate.getDate() - 7);
        $scope.transaction_filter.startDate.setHours(0, 0, 0, 0);
        $scope.transaction_filter.endDate = new Date();
        $scope.transaction_filter.endDate.setHours(23, 59, 59, 59);

        $scope.transaction_filter.status = 'all';

        const startLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "inline");
        }

        const stopLoader = () => {
            jQuery.noConflict();
            $('.refresh').css("display", "none");
        }

        const loadTransactions = () => {
            startLoader();
            let query = new URLSearchParams();

            if($scope.transaction_filter.status != "all"){
                if($scope.transaction_filter.status == 'Receive') query.append("type", 'receive_inventory');
                if($scope.transaction_filter.status == 'Shipment') query.append("type", 'inventory_shipment');
                if($scope.transaction_filter.status == 'Transfer') query.append("type", 'inventory_transfer');
            }

            query.append("skip", $scope.transaction_filter.viewLength || 0);
            query.append("limit", $scope.transaction_filter.viewBy || 10);

            if($scope.transaction_filter.searchBy) query.append("search",  $scope.transaction_filter.searchBy);
            if($scope.transaction_filter.startDate) query.append("from",  $scope.transaction_filter.startDate.toISOString());
            if($scope.transaction_filter.endDate) query.append("to",  $scope.transaction_filter.endDate.toISOString());

            $http.get('/dash/inventory/transactions?' + query.toString())
                .then(transactions => {
                    stopLoader();
                    if(transactions.data && !transactions.data.status && transactions.data.length){
                        for(let i = 0; i < transactions.data.length; i++){
                            if(transactions.data[i].type == "inventory_transfer") transactions.data[i].transaction_type = "transfer";
                            else if(transactions.data[i].type == "inventory_shipment") transactions.data[i].transaction_type = "shipment";
                            else transactions.data[i].transaction_type = "receive";

                            transactions.data[i].total = 0;

                            for(let j = 0; j < transactions.data[i].transaction.length; j++){
                                if(!transactions.data[i].transaction[j].type || transactions.data[i].transaction[j].type == "quantity" || transactions.data[i].transaction[j].type == "miscellaneous"){
                                    transactions.data[i].total += transactions.data[i].transaction[j].Qty;
                                }else {
                                    transactions.data[i].total += 1;
                                }
                            }
                            $scope.transactions.push(transactions.data[i]);
                        }
                    } else {
                        console.log(transactions.data);
                    }
                })
                .catch(function(err){
                    console.log(err)
                })
        };

        const loadTransactionCount = () => {
            let query = new URLSearchParams();
            query.append("count", 1);

            if($scope.transaction_filter.status != "all"){
                if($scope.transaction_filter.status == 'Receive') query.append("type", 'receive_inventory');
                if($scope.transaction_filter.status == 'Shipment') query.append("type", 'inventory_shipment');
                if($scope.transaction_filter.status == 'Transfer') query.append("type", 'inventory_transfer');
            }

            if($scope.transaction_filter.searchBy) query.append("search",  $scope.transaction_filter.searchBy);
            if($scope.transaction_filter.startDate) query.append("from",  $scope.transaction_filter.startDate.toISOString());
            if($scope.transaction_filter.endDate) query.append("to",  $scope.transaction_filter.endDate.toISOString());


            $http.get('/dash/inventory/transactions?' + query.toString())
                .then(count => {
                    if(!count.data.status){
                        $scope.transactionCount(count.data);
                    } else {
                        console.log(count.data);
                    }
                })
                .catch(function(err){
                    console.log(err)
                })
        };

        $scope.transactionCount = response => {
            if(response){
                if(response > $scope.newViewBy){
                    $scope.transaction_count = response;
                }
                else if(response <= $scope.newViewBy){
                    $scope.transaction_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.transactions = [];
                    $scope.newViewBy = 1;
                    $scope.transaction_count = 0;
                    $scope.viewLength = -1;
                }
            } else {
                $scope.transactions = [];
                $scope.newViewBy = 1;
                $scope.transaction_count = 0;
                $scope.viewLength = -1;
            }

            // if(response){
            //     if(response > viewBy.items){
            //         $scope.transaction_count = response;
            //         $scope.viewLength = 0;
            //         $scope.newViewBy = viewBy.items;
            //     } else if(response <= viewBy.items){
            //         $scope.transaction_count = response;
            //         $scope.newViewBy = response;
            //     } else {
            //         $scope.transactions = [];
            //         $scope.newViewBy = 1;
            //         $scope.transaction_count = 0;
            //         $scope.viewLength = -1;
            //     }
            // } else {
            //     $scope.transactions = [];
            //     $scope.newViewBy = 1;
            //     $scope.transaction_count = 0;
            //     $scope.viewLength = -1;
            // }
        }

        var a = 0;
        $scope.navPage = (direction) => {
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;

            if(direction){
                // console.log("NEXT");
                if(viewLength + viewBy >= $scope.transactions.length){
                    if(viewLength + viewBy < $scope.transaction_count){
                        viewLength += viewBy;
                        $scope.transaction_filter.viewLength = viewLength;
                        $scope.transaction_filter.viewBy = initialViewBy;

                        loadTransactions();

                        if(viewLength + viewBy > $scope.transaction_count){
                            a = viewLength + viewBy - $scope.transaction_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                        $scope.viewLength = viewLength;
                    }
                    else{
                        //console.log("Out of data")
                        if(viewLength + viewBy > $scope.transaction_count){
                            a = viewLength + viewBy - $scope.transaction_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    // console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.transaction_count){
                        a = viewLength + viewBy - $scope.transaction_count;
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
                    if(viewLength + viewBy >= $scope.transaction_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.searchTransactions = () => {
            $scope.transactions = [];

            $scope.viewLength = 0;
            $scope.newViewBy = 10;

            $scope.transaction_filter.viewLength = 0;
            $scope.transaction_filter.viewBy =  initialViewBy;

            loadTransactions();
            loadTransactionCount();
        }

        $scope.refreshTransactions = () => {
            $scope.transactions = [];

            $scope.transaction_filter.viewLength = 0;
            $scope.transaction_filter.viewBy =  initialViewBy;
            $scope.transaction_filter.searchFor = '';
            $scope.transaction_filter.type = '';

            $scope.transaction_filter.status = 'all';

            $scope.viewLength = 0;
            $scope.newViewBy = 10;

            loadTransactions();
            loadTransactionCount();
        }

        $scope.refreshTransactions();
 })
